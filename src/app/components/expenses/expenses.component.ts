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
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss'],
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

  constructor(
    private expenseService: ExpenseService,
    private util: UtilService,
    private menuCtrl: MenuController,
    private storage: Storage,
    private userService: UserDataService) {

    this.setExpenseTypes();
    this.expense = this.newExpense();
    this.showAddPannel = false;
    this.title = 'Gastos registrados hoy';
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
    // if (this.expense.id.trim().length > 0 && this.expense.model.trim().length > 0) {
    //   this.expense.uid = this.uid;
    //   this.expense.id = this.expense.id.toUpperCase();
    //   this.expense.brand = this.expense.brand.toUpperCase();
    //   this.expense.model = this.expense.model[0].toUpperCase() + this.expense.model.slice(1);
    //   this.expenseService.create(this.expense).then(
    //     _ => {
    //       this.showAddPannel = false;
    //       this.util.presentToast('Vehículo Agregado', true, 'bottom', 2100);
    //       this.expense = this.newExpense();
    //     }
    //   ).catch(err => {
    //   });
    // } else {
    //   this.util.presentToast('Por favor revise los datos.', true, 'bottom', 2100);
    // }
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
      id: null,
      amount: '',
      business_name: '',
      car_plate: '',
      date:  this.util.timestamp(),
      description: '',
      driver_id: '',
      driver_name: '',
      invoice_number: '',
      notes: '',
      quantity: '1',
      type: 'Gasolina'
    };
  }

  deleteExpense(id) {
    this.util.removeConform(id).then(res => {
      if (res === 'ok') {
        this.expenseService.delete(id).then(success => this.util.presentToast('Vehículo eliminado', null, null, 3000));
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
            });
          });
        });
      });
    }
  }


  getExpenseList() {
    this.expenseService.getExpenses(this.uid).subscribe(expenseList => {
      this.expenseList = expenseList;
      this.util.closeLoading();
    });
  }

  getUID() {
    this.util.userid.subscribe(data => {

      if (!this.uid && !this.driver) {
        if (data) {
          this.uid = data;
          this.getExpenseList();
        } else {
          // is a driver
          this.getDriverInfo();
          this.getCarInfo();
        }
      }
    });
  }

}
