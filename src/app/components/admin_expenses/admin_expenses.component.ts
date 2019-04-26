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
  selector: 'app-admin-expenses',
  templateUrl: './admin_expenses.component.html'
})
export class AdminExpensesComponent implements OnInit {
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
    this.title = 'Gastos del día';
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
  // id: string,
  // amount: string,
  // business_name: string,
  // car_plate: string,
  // date: any,
  // description: string,
  // driver_id: string,
  // driver_name: string,
  // invoice_number: string,
  // notes: string,
  // quantity: string,
  // type: string

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
      this.title = 'Gastos del día';

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
        'Comisión para el conductor',
        'Comida',
        'Otros'
      ];
  }



  getExpenseList() {
    this.expenseService.getAllDayExpenses(this.uid).subscribe(data => {
      this.expenseList = data;
    });
  }

  getUID() {
    this.util.userid.subscribe(data => {

      if (!this.uid) {
        if (data) {
          this.uid = data;
          this.getExpenseList();
          console.log(this.uid);
        }
      }
    });
  }

}
