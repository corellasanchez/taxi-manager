
import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { UtilService } from '../../services/util/util.service';
import { AuthenticationService } from '../../services/firestore/firebase-authentication.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { DriverService } from '../../services/data-services/driver.service';
import { Storage } from '@ionic/storage';
import { CarService } from '../../services/data-services/car.service';



@Component({
  selector: 'app-driver-login',
  templateUrl: './driver-login.page.html'
})
export class DriverLoginPage implements AfterViewInit, OnDestroy {

  ssn = '';
  password = '';
  uid = '';
  driverSubscription: any;

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
    this.authService.logout().then(() => {
      console.log('Cerrando session administrativa');
    });
    this.storage.get('driver_login').then((val) => {
      if (val) {
        const driver = JSON.parse(val);
        this.ssn = driver.ssn;
        this.password = driver.password;
      }
    });
  }

  getDriver(ssn, password) {
    this.driverSubscription = this.driverService.driverLogin(ssn, password).subscribe(
      result => {
        if (result.length > 0) {
          this.storage.ready().then(ready => {
            this.storage.remove('driver_login').then(deleted => {
              this.storage.set('driver_login', JSON.stringify({ ssn: ssn, password: password })).then(saved => {
              });
            });
          });
          this.getAdmin(result);
        } else {
          this.util.presentToast('Cédula o contraseña inválidas', true, 'bottom', 3100);
        }
      }
    );
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

  ngOnDestroy() {
    if (this.driverSubscription) {
      this.driverSubscription.unsubscribe();
    }

  }

}


/**
 *
 *
 * Driver
 {
  "admin_email": "corellasanchez@hotmail.com",
  "id": "c9cfb23b-f7b2-55a6-dca8-43e64eb39f2b",
  "last_name": "Apelo",
  "name": "Rope",
  "password": "123456",
  "percentage": 30,
  "phone": "23442234234",
  "ssn": "12345",
  "uid": "U1KujWainaPsgkoCE8EftABIg2s2"
}

Admin
{
  "email": "corellasanchez@hotmail.com",
  "id": "U1KujWainaPsgkoCE8EftABIg2s2",
  "last_name": "Perto",
  "name": "Roberto",
  "phone": "77611628"
}

Car
{
  "brand": "TOYOTA",
  "color": "#000000",
  "id": "ASD-098",
  "model": "TERCEL",
  "uid": "U1KujWainaPsgkoCE8EftABIg2s2",
  "year": 2019
}


 *
 *
 */
