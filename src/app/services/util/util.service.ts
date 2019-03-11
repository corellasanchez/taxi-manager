/**
 * Ionic4 Firebase Starter Kit (https://store.enappd.com/product/firebase-starter-kitionic4-firebase-starter)
 *
 * Copyright © 2019-present Enappd. All rights reserved.
 *
 * This source code is licensed as per the terms found in the
 * LICENSE.md file in the root directory of this source tree.
 */


import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, NavController, AlertController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoadingController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class utilService {
  userid: BehaviorSubject<string> = new BehaviorSubject<string>("")
  constructor(public loadingController: LoadingController,private fireAuth: AngularFireAuth, private router:Router, private toastController: ToastController, private nav: NavController,public alertController: AlertController) {
    this.getUserId();
  }

  getUserId(){
    this.fireAuth.auth.onAuthStateChanged(user => {
      this.userid.next(user.uid);
  })
  }

  navigate(link, forward?){
    if(forward){
      this.nav.navigateForward('/'+link);
    }
    else{
      this.router.navigateByUrl('/'+link);
    }
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }


  async presentToast(message, show_button, position, duration) {
    const toast = await this.toastController.create({
      message: message,
      showCloseButton: show_button,
      position: position,
      duration: duration
    });
    toast.present();
  }


  removeConform():Promise<any>{
    return new Promise(async (resolve,reject) => {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure you want to remove this item',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (cancel) => {
            
            resolve('cancel');
          }
        }, {
          text: 'Okay',
          handler: (ok) => {
           
            resolve('ok');
          }
        }
      ]
    });

    alert.present();
   })     
  }

  async openLoader(){
    const loading = await this.loadingController.create({
      message: 'Please Wait ...',
      duration: 2000
    });
    await loading.present();
  }
  async closeLoading(){
    return await this.loadingController.dismiss();
  }

  getLocalUrl(_imagePath):Promise<{url:string,nativeUrl:string}>{
    return new Promise((resolve, reject) => {
      let name = _imagePath.split('/');
      this.makeFileIntoBlob(_imagePath, name[name.length - 1]).then((image) => {
        resolve({url:window.URL.createObjectURL(image), nativeUrl: _imagePath})
      }).catch(
        _=> {
          reject();
          
        }
      )
    });
  }
  makeFileIntoBlob(_imagePath, fileName) {
    return new Promise((resolve, reject) => {
      window['resolveLocalFileSystemURL'](_imagePath, (fileEntry) => {
        fileEntry['file']((resFile) => {
          var reader = new FileReader();
          reader.onload = (evt: any) => {
            var imgBlob: any = new Blob([evt.target.result], { type: 'image/jpeg' });
            imgBlob.name = fileName;
            resolve(imgBlob);
          };
          reader.onloadend = (evt: any) => {
            var imgBlob: any = new Blob([evt.target.result], { type: 'image/jpeg' });
            imgBlob.name = fileName;
            resolve(imgBlob);
          };

          reader.onerror = (e) => {
          
            reject(e);
          };

          reader.readAsArrayBuffer(resFile);
        }, (err) => { 
          
          reject({message:"File does not exists."})
           });
      }, (err) => { 
        debugger ; 
        
      });
    });
  }
}
