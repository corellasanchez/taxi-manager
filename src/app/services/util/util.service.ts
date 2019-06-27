import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, NavController, AlertController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoadingController } from '@ionic/angular';
import * as firebase from 'firebase/app';
import { AngularFireDatabase } from '@angular/fire/database';
import { Chart } from 'chart.js';



@Injectable({
  providedIn: 'root'
})
export class UtilService {
  userid: BehaviorSubject<string> = new BehaviorSubject<string>('');
  rol: BehaviorSubject<string> = new BehaviorSubject<string>('');
  loaderToShow: any;

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

  buildPieBarChart(name: string, label: string, element: any, labels: Array<string>, datasets: Array<any>) {
    element.el.innerHTML = '<canvas #' + name + '></canvas>';
    const chart = new Chart(element.el.childNodes[0], {
      type: 'pie',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        title: {
          display: false,
          text: label
        }
      }
  });
  }

  buildGroupedBarChart(name: string, label: string, element: any, labels: Array<string>, datasets: Array<any>) {
    element.el.innerHTML = '<canvas #' + name + '></canvas>';
    const chart = new Chart(element.el.childNodes[0], {
      type: 'bar',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        title: {
          display: false,
          text: label
        }
      }
  });
  }

  buildBarChart(name: string, label: string, element: any, labels: Array<string>, values: Array<number>, colors?: Array<string>) {
    element.el.innerHTML = '<canvas #' + name + '></canvas>';
    let backgroundColors: any;
    if (colors) {
      backgroundColors = colors;
    } else {
      backgroundColors = 'rgba(0,128,255, 0.7)';
    }

    const chart = new Chart(element.el.childNodes[0], {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: label,
          data: values,
          backgroundColor: backgroundColors
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });

  }

  timestamp() {
    return firebase.firestore.Timestamp.now();
  }

  timestampFormat(date: Date) {
    return firebase.firestore.Timestamp.fromDate(date);
  }

  timestampFromMillis(millis: number) {
    return firebase.firestore.Timestamp.fromMillis(millis);
  }


  connectionState(uid: string) {
    const userStatusDatabaseRef = this.db.database.ref('/status/' + uid);
    const connectedRef = this.db.database.ref('.info/connected');
    connectedRef.on('value', function (snap) {
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

  public showLoader() {
    this.loaderToShow = this.loadingController.create({
      message: 'Cargando ...'
    }).then((res) => {
      res.present();

      res.onDidDismiss().then((dis) => {
        this.loaderToShow = {};
      });
    });
  }

  public hideLoader() {
    try {
      this.loadingController.dismiss();
    } catch (error) {
      console.log(error);
    }
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
