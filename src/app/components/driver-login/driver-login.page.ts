
import { Component,  AfterViewInit } from '@angular/core';
import { UtilService } from '../../services/util/util.service';
import { AuthenticationService } from '../../services/firestore/firebase-authentication.service';
import { LoadingController } from '@ionic/angular';
import { DriverService } from '../../services/data-services/driver.service';
import { Storage } from '@ionic/storage';


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
    private storage: Storage
  ) {
  }

  signin(ssn: string, password: string) {
    if (ssn !== '' && password !== '') {
      this.util.openLoader();

      this.getDriver(ssn, password);

    } else {
      this.util.presentToast('Ingrese su cédula y contraseña', true, 'bottom', 3100);
    }
  }

  ngAfterViewInit() {
    // autologin
    this.storage.get('driver').then((val) => {
      if (val) {
        const driver = JSON.parse(val)[0];
        this.signin(driver.ssn, driver.password);
      }
    });
  }

  getDriver(ssn, password) {
        this.driverService.driverLogin(ssn, password).subscribe(result => {
          if (result.length > 0) {
            this.storage.set('driver', JSON.stringify(result));
            this.util.navigate('driver-lobby', false);
          } else {
            this.util.presentToast('Cédula o contraseña inválidas', true, 'bottom', 3100);
          }
        });
  }

forgotPassword() {
    this.util.presentToast('Pregunta a tu administrador por tu contraseña.', true, 'bottom', 2100);
  }

}
