import * as moment from 'moment';

import { Component, ViewChild, OnInit } from '@angular/core';
import { MenuController, IonContent } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { UUID } from 'angular2-uuid';

import { IncomeService } from '../../services/data-services/income.service';
import { Income } from '../../models/income.model';
import { Expense } from '../../models/expense.model';
import { UserDataService } from '../../services/data-services/user-data.service';
import { UtilService } from '../../services/util/util.service';
import { ExpenseService } from '../../services/data-services/expense.service';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html'
})

export class IncomeComponent implements OnInit {
  @ViewChild('content') content: IonContent;
  public incomeList: Array<Income>;
  public income: Income;
  public expense: Expense;
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
  total_hours: any;
  total_millage: any;
  driverShiftPercentage: any;
  min_year: any;

  constructor(
    private incomeService: IncomeService,
    private expenseService: ExpenseService,
    private util: UtilService,
    private menuCtrl: MenuController,
    private storage: Storage,
    private userService: UserDataService) {
    this.income = this.newIncome();
    this.expense = this.newExpense();
    this.calculateTotalHours();
    this.calculateTotalMillage();
    this.showAddPannel = false;
    this.title = 'Cierre de turno';
    this.min_year = new Date().getFullYear() - 1;
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

  newIncome() {
    this.total_hours = 0;
    this.total_millage = 0;
    this.driverShiftPercentage = 0;
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
      owner_id: '',
      worked_hours: '',
      total_milage: '',
      work_shift_percent: '',
      expense_id: ''
    };
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
      type: 'Comision para el conductor',
      owner_id: ''
    };
  }

  getIncomeList() {
    this.incomeService.getDriverDayIncomes(this.driver.id, this.uid).subscribe(data => {
      this.incomeList = data;
    });
  }

  getUID() {
    this.getDriverInfo();
    this.getCarInfo();
  }

  calculateTotalHours() {
    const initial_date = moment(this.start_date);
    const end_date = moment(this.end_date);
    const difference = moment.duration(end_date.diff(initial_date));
    this.total_hours = Number(difference.asHours()).toFixed(1);
    const decimal = this.total_hours - Math.floor(this.total_hours);
    if (decimal === 0) {
      this.total_hours = Number(difference.asHours()).toFixed();
    }
  }

  calculateTotalMillage() {
    this.total_millage = Number(this.income.final_mileage) - Number(this.income.initial_mileage);
  }

  addIncome() {
    this.addDriverPercentExpense();
  }

  addDriverPercentExpense() {
     this.calculatePercentageExpense();
    if (this.driverShiftPercentage > 0) {
      this.setExpenseValues();
      this.expenseService.create(this.expense).then(
        _ => {
          // this.util.presentToast('Comisión para el conductor anadida con éxito', true, 'bottom', 2100);
          this.saveIncome();
        }
      )
      .catch(err => {
      });
    } else {
      this.saveIncome();
    }
  }

  saveIncome() {
    this.setIncomeValues();
    this.incomeService.create(this.income).then(
      _ => {
        this.showAddPannel = false;
        this.util.presentToast('Cierre registrado con éxito', true, 'bottom', 2100);
        this.income = this.newIncome();
        this.expense = this.newExpense();
      }
    ).catch(err => {
    });
  }

  setExpenseValues() {
    this.expense.amount = this.driverShiftPercentage;
    this.expense.car_plate = this.car.id;
    this.expense.driver_id = this.driver.id;
    this.expense.driver_name = this.driver.name + ' ' + this.driver.last_name;
    this.expense.owner_id = this.uid;
    this.expense.date = this.util.timestampFromMillis(Number(moment(this.start_date).format('x')));
    this.expense.description = this.driver.percentage + '%' + ' de comisión de ₡' + this.income.amount;
  }

  calculatePercentageExpense() {
    if (this.driver.percentage > 0 && Number(this.income.amount) > 0) {
      this.driverShiftPercentage = Number(this.income.amount) * Number(this.driver.percentage) / 100;
      this.driverShiftPercentage = this.driverShiftPercentage.toFixed();
    } else {
      this.driverShiftPercentage = 0;
    }
  }

  showAdd(show: boolean) {
    this.showAddPannel = show;
    if (show) {
      this.title = 'Registrar cierre';

    } else {
      this.title = 'Cierre de turno';
    }
  }

  setIncomeValues() {
    this.income.car_plate = this.car.id;
    this.income.driver_id = this.driver.id;
    this.income.driver_name = this.driver.name + ' ' + this.driver.last_name;
    this.income.owner_id = this.uid;
    this.income.start_date = this.util.timestampFromMillis(Number(moment(this.start_date).format('x')));
    this.income.end_date = this.util.timestampFromMillis(Number(moment(this.end_date).format('x')));
    this.income.worked_hours = this.total_hours;
    this.income.total_milage = this.total_millage;
    this.income.work_shift_percent = this.driverShiftPercentage;
    this.income.expense_id = this.expense.id;
  }

  getDateFormat(date: string) {
    return moment(this.start_date);
  }

  deleteIncome(income: any) {
    this.util.removeConfirm(income.id, 'Cierre por un monto de ' + income.amount).then(res => {
      if (res === 'ok') {
        if (income.work_shift_percent > 0 && income.expense_id) {
          this.expenseService.delete(income.expense_id);
        }
        this.incomeService.delete(income.id).then(success => this.util.presentToast('Cierre anulado', null, null, 3000));
      }
    });
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
}
