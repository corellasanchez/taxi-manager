import * as moment from 'moment';

import { Component, ViewChild, OnInit } from '@angular/core';
import { MenuController, IonContent } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { UUID } from 'angular2-uuid';

import { IncomeService } from '../../services/data-services/income.service';
import { Income } from '../../models/income.model';
import { UserDataService } from '../../services/data-services/user-data.service';
import { UtilService } from '../../services/util/util.service';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html'
})

export class IncomeComponent implements OnInit {
  @ViewChild('content') content: IonContent;
  public incomeList: Array<Income>;
  public income: Income;
  public isUpdate: boolean;
  public uid: string;
  title: string;
  showAddPannel: boolean;
  incomeTypes: Array<string>;
  driver: any;
  admin: any;
  car: any;
  isAdmin: boolean;
  start_date: any;
  end_date: any;

  constructor(
    private incomeService: IncomeService,
    private util: UtilService,
    private menuCtrl: MenuController,
    private storage: Storage,
    private userService: UserDataService) {

    this.setIncomeTypes();
    this.income = this.newIncome();
    this.showAddPannel = false;
    this.title = 'Cierre de turno';
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true, 'start');
    this.menuCtrl.enable(true, 'end');
    this.content.scrollToTop(300);
  }
  ngOnInit() {
    this.getUID();
  }

  scroll() {
    this.content.scrollToTop(300);
  }

  addIncome() {

    this.setIncomeValues();
    this.incomeService.create(this.income).then(
      _ => {
        this.showAddPannel = false;
        this.util.presentToast('Cierre registrado con éxito', true, 'bottom', 2100);
        this.income = this.newIncome();
      }
    ).catch(err => {
    });
  }

  showAdd(show: boolean) {
    this.showAddPannel = show;
    if (show) {
      this.title = 'Registrar cierre';

    } else {
      this.title = 'Cierre de turno';
    }
  }

  newIncome() {
    const currentDate = new Date().toISOString();
    this.start_date = currentDate;
    this.end_date = currentDate;
    return {
      id: UUID.UUID(),
      amount: '',
      car_plate: '',
      start_date: {},
      end_date: {},
      initial_mileage: '',
      final_mileage: '',
      driver_id: '',
      driver_name: '',
      notes: '',
      type: 'ct', // cierre de turno
      owner_id: ''
    };
  }

  setIncomeValues() {
    this.income.car_plate = this.car.id;
    this.income.driver_id = this.driver.id;
    this.income.driver_name = this.driver.name + ' ' + this.driver.last_name;
    this.income.owner_id = this.uid;
    this.income.start_date = this.util.timestampFromMillis(Number(moment(this.start_date).format('x'))) ;
    this.income.end_date = this.util.timestampFromMillis(Number(moment(this.end_date).format('x'))) ;
    console.log(this.income);
  }

  deleteIncome(id, incomeNumber) {
    this.util.removeConform(id, incomeNumber).then(res => {
      if (res === 'ok') {
        this.incomeService.delete(id).then(success => this.util.presentToast('Gasto Eliminado', null, null, 3000));
      }
    });
  }

  setIncomeTypes() {
    // tslint:disable-next-line:max-line-length
    this.incomeTypes =
      [
        'Gasolina',
        'Repuestos',
        'Reparaciones',
        'Mantenimento',
        'Lavado',
        'Equipo',
        'Parqueo',
        'Frecuencia',
        'Franquicia',
        'Poliza',
        'Productos de limpieza',
        'Gastos Médicos',
        'Comisión para el conductor',
        'Comida',
        'Otros'
      ];
  }

  getCarInfo() {
    this.car = {};
    this.storage.ready().then(ready => {
      this.storage.get('car').then((val) => {
        if (val) {
          this.car = JSON.parse(val);
        }
      });
    });
  }

  getDriverInfo() {
    this.driver = {};
    this.storage.ready().then(ready => {
      this.storage.get('driver_info').then((val) => {
        if (val) {
          this.driver = JSON.parse(val);
          this.getAdminInfo();
        }
      });
    });
  }

  getAdminInfo() {
    if (!this.admin) {
      this.userService.getOne(this.driver.uid).subscribe(admin => {
        this.storage.ready().then(ready => {
          this.storage.remove('admin_info').then(deleted => {
            this.storage.set('admin_info', JSON.stringify(admin)).then(saved => {
              this.admin = admin;
              this.uid = admin.id;
              this.getIncomeList();
            });
          });
        });
      });
    }
  }

  getIncomeList() {
    // this.incomeService.getDriverDayIncome(this.driver.id, this.uid).subscribe(data => {
    //   this.incomeList = data;
    // });
  }

  getUID() {
    this.getDriverInfo();
    this.getCarInfo();
  }

  numbersOnly(input: string) {
    input = input.toString().replace(',', '');
    input = input.replace('.', '');
    return input;
  }
}
