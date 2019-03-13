import { Component, OnInit } from '@angular/core';
import { UtilService } from '../services/util/util.service';
import { MenuController } from '@ionic/angular';
import { AuthenticationService } from '../services/firestore/firebase-authentication.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  first_name = '';
  last_name = '';
  email = '';
  password = '';

  constructor(
    public util: UtilService,
    private menuCtrl: MenuController,
    private authServ: AuthenticationService) {
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(false, 'start');
    this.menuCtrl.enable(false, 'end');
  }

  signup() {
    if (this.first_name !== '' &&
      this.last_name !== '' &&
      this.email !== '' &&
      this.password !== '' &&
      this.util.validateEmail(this.email)) {
      this.authServ.createAccount(this.email, this.password).then(
        userData => {
          this.util.presentToast('Gracias por preferirnos.', true, 'bottom', 2100);

          this.util.navigate('', false);
        }
      ).catch(err => {
        if (err) {

          switch (err) {
            case 'creation failed Error: Password should be at least 6 characters': {
              this.util.presentToast('La contraseña debe tener al menos 6 letras o números', true, 'bottom', 5100);
              break;
            }
            case 'creation failed Error: The email address is already in use by another account.': {
              this.util.presentToast('Este correo ya esta registrado, intente con otro.', true, 'bottom', 5100);
              break;
            }
            default: {
              this.util.presentToast(`${err}`, true, 'bottom', 5100);
              break;
            }
          }
        }
      });
    } else {
      this.util.presentToast('Revise sus datos.', true, 'bottom', 2100);
    }
  }

}
