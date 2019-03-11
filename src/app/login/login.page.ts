/**
 * Ionic4 Firebase Starter Kit (https://store.enappd.com/product/firebase-starter-kitionic4-firebase-starter)
 *
 * Copyright © 2019-present Enappd. All rights reserved.
 *
 * This source code is licensed as per the terms found in the
 * LICENSE.md file in the root directory of this source tree.
 */
import { Component, OnInit } from '@angular/core';
import { MenuController, Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { utilService } from '../services/util/util.service';
import { AuthenticationService } from '../services/firestore/firebase-authentication.service';
import { IfStmt } from '@angular/compiler';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email = "";
  password = "";

  constructor(private platform: Platform, public loadingController: LoadingController,
    public alertController:AlertController,
    private splashScreen: SplashScreen, public util: utilService, private menuCtrl: MenuController, private authServ: AuthenticationService) {
  }

  ngOnInit() {
   
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(false, 'start');
    this.menuCtrl.enable(false, 'end');
    this.splashScreen.hide();
  }

   signin() {

    if (this.util.validateEmail(this.email) && this.password != "") {
      this.util.openLoader();
      this.authServ.login(this.email, this.password).then(
        userData => {
         
          this.util.navigate('home',false);
          this.email= "";
          this.password= "";
        }
      ).catch(err =>{
        if (err){
          this.util.presentToast(`${err}`, true, 'bottom', 2100);
          
        }
      
      } ).then( el => this.util.closeLoading())
    }
    else {
      this.util.presentToast('Please enter email and password', true, 'bottom', 2100);
    }
  }

  async forgotPassword() {
    const alert = await this.alertController.create({
      header: 'Reset Email',
      backdropDismiss: false,
      inputs: [
        {
          name: 'name1',
          type: 'email',
          placeholder: 'Enter your email',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (res) => {
            
          }
        }, {
          text: 'Ok',
          handler: (res) => {
            let value = this.util.validateEmail(res.name1); 
             this.authServ.forgotPassoword(res.name1);
             
             return value;
            
          }
        }
      ]
    });

    await alert.present();
  }

}
