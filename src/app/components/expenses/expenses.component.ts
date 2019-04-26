import * as moment from 'moment';

import { Component, ViewChild, OnInit } from '@angular/core';
import { MenuController, IonContent } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { UUID } from 'angular2-uuid';

import { ExpenseService } from '../../services/data-services/expense.service';
import { Expense } from '../../models/expense.model';
import { UserDataService } from '../../services/data-services/user-data.service';
import { UtilService } from '../../services/util/util.service';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html'
})
export class ExpensesComponent implements OnInit {
  @ViewChild('content') content: IonContent;
  public expenseList: Array<Expense>;
  public expense: Expense;
  public isUpdate: boolean;
  public uid: string;
  title: string;
  showAddPannel: boolean;
  expenseTypes: Array<string>;
  driver: any;
  admin: any;
  car: any;
  isAdmin: boolean;

  constructor(
    private expenseService: ExpenseService,
    private util: UtilService,
    private menuCtrl: MenuController,
    private storage: Storage,
    private userService: UserDataService) {

    this.setExpenseTypes();
    this.expense = this.newExpense();
    this.showAddPannel = false;
    this.title = 'Mis gastos de hoy';
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

  addExpense() {

    this.setExpenseValues();
    this.expenseService.create(this.expense).then(
      _ => {
        this.showAddPannel = false;
        this.util.presentToast('Gasto agregado con éxito', true, 'bottom', 2100);
        this.expense = this.newExpense();
      }
    ).catch(err => {
    });
  }

  showAdd(show: boolean) {
    this.showAddPannel = show;
    if (show) {
      this.title = 'Registrar un gasto';

    } else {
      this.title = 'Gastos de hoy';

    }
  }

  newExpense() {
    return {
      id: UUID.UUID(),
      amount: '',
      business_name: '',
      car_plate: '',
      date: null,
      description: '',
      driver_id: '',
      driver_name: '',
      invoice_number: '',
      notes: '',
      quantity: '1',
      type: 'Gasolina',
      owner_id: ''
    };
  }

  setExpenseValues() {
    this.expense.car_plate = this.car.id;
    this.expense.driver_id = this.driver.id;
    this.expense.driver_name = this.driver.name + ' ' + this.driver.last_name;
    this.expense.owner_id = this.uid;
    this.expense.date = this.util.timestamp();
    console.log(this.expense);
  }

  deleteExpense(id, expenseNumber) {
    this.util.removeConfirm(id, expenseNumber).then(res => {
      if (res === 'ok') {
        this.expenseService.delete(id).then(success => this.util.presentToast('Gasto Eliminado', null, null, 3000));
      }
    });
  }

  setExpenseTypes() {
    // tslint:disable-next-line:max-line-length
    this.expenseTypes =
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
        'Comision para el conductor',
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
              this.getExpenseList();
            });
          });
        });
      });
    }
  }

  getExpenseList() {
    this.expenseService.getDriverDayExpenses(this.driver.id, this.uid).subscribe(data => {
      this.expenseList = data;
    });
  }

  getUID() {
    this.getDriverInfo();
    this.getCarInfo();
  }
}
