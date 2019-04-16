
import { Component, OnInit } from '@angular/core';
import { MenuController, Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { UtilService } from '../../services/util/util.service';
import { AuthenticationService } from '../../services/firestore/firebase-authentication.service';
import { IfStmt } from '@angular/compiler';
import { LoadingController } from '@ionic/angular';
import { UserDataService } from '../../services/data-services/user-data.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html'
})

export class LoginPage implements OnInit {

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
    private storage: Storage) {
  }

  ngOnInit() {
    this.util.closeLoading();
    this.rememberCredentials();
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(false, 'start');
    this.menuCtrl.enable(false, 'end');
    this.splashScreen.hide();
  }

  rememberCredentials() {
    this.storage.ready().then(ready => {
    this.storage.get('admin_login').then((val) => {
      if (val) {
        const admin = JSON.parse(val);
        this.email = admin.email;
        this.password = admin.password;
      }
    });
  });
  }

  signin() {

    if (this.util.validateEmail(this.email) && this.password !== '') {
      this.util.openLoader();
      this.authServ.login(this.email, this.password).then(
        userData => {
          if (userData) {
            this.storage.ready().then(ready => {
              this.storage.remove('admin_login').then(deleted => {
                this.storage.set('admin_login', JSON.stringify({ email: this.email, password: this.password })).then(saved => {
                  this.util.navigate('cars', false);
                });
              });
            });
          } else {
            this.util.presentToast('Error al ingresar', true, 'bottom', 3100);
          }
        }
      ).catch(err => {
        if (err) {
          this.util.presentToast(`${err}`, true, 'bottom', 3100);
        }
      });
    } else {
      this.util.presentToast('Ingrese su email y contraseña', true, 'bottom', 3100);
    }
  }

  verifyUserRole(uid: string) {
    this.userDataService.getOne(uid).subscribe(userData => {
      if (userData) {
        this.util.navigate('cars', false);
      } else {
        this.util.presentToast('Su usuario no es administrador intente ingresar como chofer.', true, 'bottom', 5100);
      }
    });
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
