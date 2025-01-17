import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Driver } from '../../models/driver.model';
import { UUID } from 'angular2-uuid';
import { DriverService } from '../../services/data-services/driver.service';
import { AuthenticationService } from '../../services/firestore/firebase-authentication.service';
import { UtilService } from '../../services/util/util.service';
import { MenuController, IonContent } from '@ionic/angular';
import { FirestoreService } from '../../services/firestore/firestore.service';
import * as moment from 'moment';
import { AngularFireAuth } from '@angular/fire/auth';
import { Storage } from '@ionic/storage';



@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html'
})
export class DriversComponent implements AfterViewInit {
  @ViewChild('content') content: IonContent;
  public driverList: Array<Driver>;
  public driver: Driver;
  public isUpdate: boolean;
  public uid: string;
  public filtertag: any;
  public percentages: Array<number>;
  showAddPannel: boolean;
  title: string;
  admin: any;
  ssn: number;
  phone: number;

  customAlertOptions: any = {
    header: 'Filter',
  };
  constructor(private driverService: DriverService,
    private firestoreService: FirestoreService,
    private authService: AuthenticationService,
    private util: UtilService,
    private menuCtrl: MenuController,
    private fireAuth: AngularFireAuth,
    private storage: Storage) {
    this.percentages = Array(100).fill(0).map((x, i) => i);
    this.driver = this.newDriver();
    this.rememberCredentials();
    this.showAddPannel = false;
    this.title = 'Conductores disponibles';
  }

  ngAfterViewInit() {
    this.getUID();
  }


  rememberCredentials() {
    this.storage.get('admin_login').then((val) => {
      if (val) {
        this.admin = JSON.parse(val);
      }
    });
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true, 'start');
    this.menuCtrl.enable(true, 'end');
  }

  scroll() {
    this.content.scrollToTop(300);
  }

  addDriver() {
    if (this.driver.id &&
      this.driver.name.trim().length > 0 &&
      this.driver.password !== '' &&
      this.driver.password.length >= 6 &&
      this.util.isNumber(this.ssn)
    ) {
      if (this.phone) {
        if (this.util.isNumber(this.phone)) {
          this.driver.phone = this.phone.toString();
        } else {
          this.util.presentToast('Por favor revise los datos.', true, 'bottom', 2100);
          return;
        }
      }
      this.driver.uid = this.uid;
      this.driver.name = this.driver.name[0].toUpperCase() + this.driver.name.slice(1);
      this.driver.last_name = this.driver.last_name[0].toUpperCase() + this.driver.last_name.slice(1);
      this.driver.admin_email = this.admin.email;
      this.driver.ssn = this.ssn.toString();
      this.driverService.create(this.driver).then(
        _ => {
          this.showAddPannel = false;
          this.util.presentToast('Chofer asignado a su cuenta', true, 'bottom', 2100);
          this.driver = this.newDriver();
        }
      ).catch(err => {
        console.log(err);
      });
    } else {
      this.util.presentToast('Por favor revise los datos.', true, 'bottom', 2100);
    }
  }

  newDriver() {
    this.ssn = null;
    return {
      id: UUID.UUID(),
      ssn: '',
      name: '',
      last_name: '',
      uid: '',
      percentage: 30,
      phone: '',
      password: '',
      admin_email: ''
    };
  }

  deleteDriver(id, ssn) {
    this.util.removeConfirm(id, ssn).then(res => {
      if (res === 'ok') {
        this.driverService.delete(id).then(success => this.util.presentToast('Chofer eliminado', null, null, 3000));
      }
    });
  }

  getDriverList() {
    this.driverService.getDrivers(this.uid).subscribe(driverList => {
      this.driverList = driverList;
    });
  }

  getUID() {
    this.util.userid.subscribe(data => {
      if (data) {
        this.uid = data;
        this.getDriverList();
      } else {
        this.util.navigate('login', false);
      }
    });
  }

  showAdd(show: boolean) {
    this.showAddPannel = show;
    if (show) {
      this.title = 'Registrar conductor';
    } else {
      this.title = 'Conductores disponibles';
    }
  }
}
