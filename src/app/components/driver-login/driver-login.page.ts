
import { Component, AfterViewInit } from '@angular/core';
import { UtilService } from '../../services/util/util.service';
import { AuthenticationService } from '../../services/firestore/firebase-authentication.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { DriverService } from '../../services/data-services/driver.service';
import { Storage } from '@ionic/storage';
import { CarService } from '../../services/data-services/car.service';



@Component({
  selector: 'app-driver-login',
  templateUrl: './driver-login.page.html',
  styleUrls: ['./driver-login.page.scss'],
})
export class DriverLoginPage implements AfterViewInit {

  ssn = '';
  password = '';
  uid = '';

  constructor(public loadingController: LoadingController,
    public util: UtilService,
    private authService: AuthenticationService,
    private driverService: DriverService,
    private storage: Storage,
    public alertController: AlertController,
    private carService: CarService
  ) {
  }

  signin(ssn: string, password: string) {
    if (ssn !== '' && password !== '') {
      this.getDriver(ssn, password);
    } else {
      this.util.presentToast('Ingrese su cédula y contraseña', true, 'bottom', 3100);
    }
  }

  ngAfterViewInit() {
    this.rememberCredentials();
  }

  rememberCredentials() {
    this.storage.get('driver_login').then((val) => {
      if (val) {
        const driver = JSON.parse(val);
        this.ssn = driver.ssn;
        this.password = driver.password;
      }
    });
  }

  getDriver(ssn, password) {
    this.util.openLoader();
    this.driverService.driverLogin(ssn, password).subscribe(result => {
      if (result.length > 0) {
        this.storage.ready().then(ready => {
          this.storage.remove('driver_login').then(deleted => {
            this.storage.set('driver_login', JSON.stringify({ ssn: ssn, password: password })).then(saved => {
            });
          });
        });
        this.util.closeLoading();
        this.getAdmin(result);
      } else {
        this.util.presentToast('Cédula o contraseña inválidas', true, 'bottom', 3100);
      }
    });
  }

  forgotPassword() {
    this.util.presentToast('Pregunta a tu administrador por tu contraseña.', true, 'bottom', 2100);
  }

  getAdmin(user) {
    const admins = [];
    if (user.length > 1) {
      for (let index = 0; index < user.length; index++) {
        const email = user[index].admin_email;
        admins.push(
          {
            name: email,
            type: 'radio',
            label: email,
            value: user[index]
          }
        );
      }
      this.selectAdminModal(admins);
    } else {
      this.adminEmailSelect(user[0]);
    }
  }

  async selectAdminModal(inputs: any) {
    const alert = await this.alertController.create({
      header: 'Selecciona el correo de tu patron',
      inputs: inputs,
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Seleccion de auto cancelada');
        }
      }, {
        text: 'Ok',
        handler: data => {
          this.adminEmailSelect(data);
        }
      }]
    });

    await alert.present();
  }

  async selectCarModal(inputs: any) {
    const alert = await this.alertController.create({
      header: 'Selecciona el auto que conduces hoy',
      inputs: inputs,
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Seleccion de auto cancelada');
        }
      }, {
        text: 'Ok',
        handler: data => {
          this.carSelect(data);
        }
      }]
    });

    await alert.present();
  }

  adminEmailSelect(user: any) {
    this.storage.ready().then(ready => {
      this.storage.remove('driver_info').then(deleted => {
        this.storage.set('driver_info', JSON.stringify(user)).then(saved => {
          this.getCarsInfo(user.uid);
        });
      });
    });
  }

  getCarsInfo(id: string) {
    const availableCars = [];
    const carInputs = [];
    this.carService.getCarsOnce(id).subscribe(cars => {
      cars.docs.map(doc => {
        availableCars.push(doc.data());
      });

      console.log(availableCars);
      if (availableCars.length === 0) {
        this.util.presentToast('Su administrador no tiene autos disponibles', true, 'bottom', 3100);
        return;
      }
      if (availableCars.length === 1) {
        this.carSelect(availableCars[0]);
      }

      if (availableCars.length > 1) {
        for (let index = 0; index < availableCars.length; index++) {
          const car_plate = availableCars[index].id;
          carInputs.push({
            name: car_plate,
            type: 'radio',
            label: car_plate,
            value: availableCars[index]
          });
        }
        this.selectCarModal(carInputs);
      }
    });
  }

  carSelect(car: any) {
    this.storage.ready().then(ready => {
      this.storage.remove('car').then(deleted => {
        this.storage.set('car', JSON.stringify(car)).then(saved => {
          this.util.navigate('expenses', false);
        });
      });
    });
  }
}