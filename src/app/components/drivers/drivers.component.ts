import { Component, ViewChild, OnInit } from '@angular/core';
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
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss'],
})
export class DriversComponent implements OnInit {
  @ViewChild('content') content: IonContent;
  public driverList: Array<Driver>;
  public driver: Driver;
  public isUpdate: boolean;
  public uid: string;
  public filtertag: any;
  private percentages: Array<number>;
  showAddPannel: boolean;
  title: string;
  admin: any;

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

  ngOnInit() {
    this.getUID();
  }

  rememberCredentials() {
    this.storage.get('admin').then((val) => {
      if (val) {
        this.admin = JSON.parse(val);
      }
    });
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true, 'start');
    this.menuCtrl.enable(true, 'end');
    this.content.scrollToTop(300);
  }

  scroll() {
    this.content.scrollToTop(300);
  }

  addDriver() {
    this.util.openLoader();
    if (this.driver.id &&
      this.driver.name.trim().length > 0 &&
      this.driver.password !== '' &&
      this.driver.password.length >= 6
    ) {
      this.driver.uid = this.uid;
      this.driver.name = this.driver.name[0].toUpperCase() + this.driver.name.slice(1);
      this.driver.last_name = this.driver.last_name[0].toUpperCase() + this.driver.last_name.slice(1);
      this.driver.admin_email = this.admin.email;
      this.driverService.create(this.driver).then(
        _ => {
          this.showAddPannel = false;
          this.util.closeLoading();
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
    this.util.removeConform(id, ssn).then(res => {
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
      if (!data) {
        this.util.navigate('login', false);
      } else {
        this.uid = data;
        this.getDriverList();
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
