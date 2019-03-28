
import { Component, OnInit } from '@angular/core';
import { MenuController, Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { UtilService } from '../../services/util/util.service';
import { AuthenticationService } from '../../services/firestore/firebase-authentication.service';
import { LoadingController } from '@ionic/angular';
import { UserDataService } from '../../services/data-services/user-data.service';
import { DriverService } from '../../services/data-services/driver.service';

@Component({
  selector: 'app-driver-login',
  templateUrl: './driver-login.page.html',
  styleUrls: ['./driver-login.page.scss'],
})
export class DriverLoginPage implements OnInit {

  email = '';
  password = '';
  uid = '';

  constructor(private platform: Platform, public loadingController: LoadingController,
    public alertController: AlertController,
    private splashScreen: SplashScreen,
    public util: UtilService,
    private menuCtrl: MenuController,
    private authServ: AuthenticationService,
    private userDataService: UserDataService,
    private driverService: DriverService) {
  }

  ngOnInit() {

  }

  ionViewDidEnter() {
    this.menuCtrl.enable(false, 'start');
    this.menuCtrl.enable(false, 'end');
    this.splashScreen.hide();
  }

  signin() {
    if (this.util.validateEmail(this.email) && this.password !== '') {
      this.util.openLoader();
      this.authServ.anonimousLogin(this.email, this.password).then(
        userData => {
          console.log(userData);
          this.email = '';
          this.password = '';
         // this.util.navigate('cars', false);

        }
      ).catch(err => {
        if (err) {
          this.util.presentToast(`${err}`, true, 'bottom', 3100);

        }

      }).then(el => this.util.closeLoading());
    } else {
      this.util.presentToast('Ingrese su email y contraseña', true, 'bottom', 3100);
    }
  }



  async forgotPassword() {
    const alert = await this.alertController.create({
      header: 'Olvide mi contraseña',
      backdropDismiss: false,
      inputs: [
        {
          name: 'name1',
          type: 'email',
          placeholder: 'Ingresa tu email',
        }
      ],
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (res) => {

          }
        }, {
          text: 'Ok',
          handler: (res) => {
            const value = this.util.validateEmail(res.name1);
            this.authServ.forgotPassoword(res.name1);
            return value;
          }
        }
      ]
    });
    await alert.present();
  }

}
