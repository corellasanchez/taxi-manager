import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, NavController, AlertController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoadingController } from '@ionic/angular';
import * as firebase from 'firebase/app';
import { AngularFireDatabase } from '@angular/fire/database';



@Injectable({
  providedIn: 'root'
})
export class UtilService {
  userid: BehaviorSubject<string> = new BehaviorSubject<string>('');
  rol: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(
    public loadingController: LoadingController,
    private fireAuth: AngularFireAuth,
    private router: Router,
    private toastController: ToastController,
    private nav: NavController,
    public alertController: AlertController,
    public db: AngularFireDatabase) {
    this.getUserId();
  }

  getUserId() {
    this.fireAuth.auth.onAuthStateChanged(user => {
      if (user) {
        this.userid.next(user.uid);
      } else {
        this.userid.next(null);
      }

    });
  }

  timestamp() {
    return  firebase.firestore.Timestamp.now();
  }

 timestampFormat( date: Date) {
  return firebase.firestore.Timestamp.fromDate(date);
 }

 timestampFromMillis( millis: number) {
  return firebase.firestore.Timestamp.fromMillis(millis);
 }


  connectionState(uid: string ) {
    const userStatusDatabaseRef = this.db.database.ref('/status/' + uid);
    const connectedRef = this.db.database.ref('.info/connected');
    connectedRef.on('value', function(snap) {
      if (snap.val() === true) {
        alert('connected');
      } else {
        alert('not connected');
      }
    });
  }

  setRol(rol: string) {
    this.userid.next(rol);
  }

  navigate(link, forward?) {
    if (forward) {
      this.nav.navigateForward('/' + link);
    } else {
      this.router.navigateByUrl('/' + link);
    }
  }

  validateEmail(email) {
    // tslint:disable-next-line:max-line-length
    const re = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }


  async presentToast(message, show_button, position, duration) {
    const toast = await this.toastController.create({
      message: message,
      showCloseButton: show_button,
      position: position,
      duration: duration,
      closeButtonText: 'Ok'
    });
    toast.present();
  }


  removeConfirm(id?: string, showId?: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const alert = await this.alertController.create({
        header: 'Confirmar!',
        message: 'Estas seguro que deseas eliminar este elemento. <br><strong>' + (showId ? showId : id) + '</strong>',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (cancel) => {

              resolve('cancel');
            }
          }, {
            text: 'Sí',
            handler: (ok) => {

              resolve('ok');
            }
          }
        ]
      });

      alert.present();
    });
  }

  async openLoader() {
    const loading = await this.loadingController.create({
      message: 'Cargando ...',
      duration: 2000
    });
    await loading.present();
  }
  async closeLoading() {
    return await this.loadingController.dismiss();
  }

  getLocalUrl(_imagePath): Promise<{ url: string, nativeUrl: string }> {
    return new Promise((resolve, reject) => {
      const name = _imagePath.split('/');
      this.makeFileIntoBlob(_imagePath, name[name.length - 1]).then((image) => {
        resolve({ url: window.URL.createObjectURL(image), nativeUrl: _imagePath });
      }).catch(
        _ => {
          reject();

        }
      );
    });
  }
  makeFileIntoBlob(_imagePath, fileName) {
    return new Promise((resolve, reject) => {
      window['resolveLocalFileSystemURL'](_imagePath, (fileEntry) => {
        fileEntry['file']((resFile) => {
          const reader = new FileReader();
          reader.onload = (evt: any) => {
            const imgBlob: any = new Blob([evt.target.result], { type: 'image/jpeg' });
            imgBlob.name = fileName;
            resolve(imgBlob);
          };
          reader.onloadend = (evt: any) => {
            const imgBlob: any = new Blob([evt.target.result], { type: 'image/jpeg' });
            imgBlob.name = fileName;
            resolve(imgBlob);
          };

          reader.onerror = (e) => {

            reject(e);
          };

          reader.readAsArrayBuffer(resFile);
        }, (err) => {

          reject({ message: 'El archivo no existe.' });
        });
      }, (err) => {
        console.log('Error', err);
      });
    });
  }
}
