import * as moment from 'moment';
import { Chart } from 'chart.js';
import { Component, ViewChild, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MenuController, IonContent } from '@ionic/angular';

import { ExpenseService } from '../../services/data-services/expense.service';
import { Expense } from '../../models/expense.model';
import { UtilService } from '../../services/util/util.service';
import { NumberValueAccessor } from '@angular/forms/src/directives';

@Component({
  selector: 'app-expense_detail-reports',
  templateUrl: './admin_expense_detail.component.html'
})
export class AdminExpenseDetailComponent implements OnInit {

  @ViewChild('content') content: IonContent;
  @ViewChild('weekBarCanvas') weekBarCanvas;
  @ViewChild('monthBarCanvas') monthBarCanvas;
  @ViewChild('rangeBarCanvas') rangeBarCanvas;

  public weekExpenses: Array<Expense>;
  public expense: Expense;
  public isUpdate: boolean;
  public uid: string;
  title: string;
  showAddPannel: boolean;
  expenseTypes: Array<string>;
  driver: any;
  drivers: any;
  admin: any;
  car: any;
  isAdmin: boolean;
  tab: string;
  pieChartData: any;
  totalWeekExpenses: number;
  barCharLabels = [];
  barCharValues = [];
  pieCharLabels: Array<string>;
  pieCharValues: Array<number>;
  monthExpenses: any;
  totalMonthExpenses: number;
  weekSubscription: boolean;
  monthSubscription: boolean;
  totalRangeExpenses: number;
  rangeExpenses: any;
  start_date: any;
  end_date: any;
  colors: Array<any>;
  expenseByCategory: Array<any>;
  rangeExpenseByCategory: Array<any>;
  rangePieCharLabels: Array<string>;
  rangePieCharValues: Array<number>;

  constructor(
    private expenseService: ExpenseService,
    private util: UtilService,
    private menuCtrl: MenuController,
    private datePipe: DatePipe) {

    this.title = 'Detalle de Gastos';
    this.tab = 'month';
    this.colors = [
      '#AEEA00',
      '#F57F17',
      '#01579B',
      '#64DD17',
      '#311B92',
      '#880E4F',
      '#1A237E',
      '#0D47A1',
      '#006064',
      '#1B5E20',
      '#827717',
      '#E65100',
      '#3E2723',
      '#212121',
      '#263238'
    ];
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true, 'start');
    this.menuCtrl.enable(true, 'end');
  }

  ngOnInit() {
    this.getUID();
  }

  scroll() {
    this.content.scrollToTop(300);
  }

  getMonthExpenses() {
    this.totalMonthExpenses = 0;
    this.monthExpenses = [];
    this.expenseByCategory = [];
    this.pieCharLabels = [];
    this.pieCharValues = [];

    this.expenseService.getExpensesOfPeriodOnce(this.uid, 'month').subscribe(data => {
      data.docs.map(doc => {
        this.monthExpenses.push(doc.data());
      });
      this.monthExpenses.map(expense => {

        const categoryElement = this.expenseByCategory.find(x => x.type === expense.type);

        if (!categoryElement) {
          this.expenseByCategory.push({ type: expense.type, total: Number(expense.amount) });
        } else {
          categoryElement.total += expense.amount;
        }
        this.totalMonthExpenses += Number(expense.amount);
      });

      this.pieCharLabels = this.expenseByCategory.map(el => el.type);
      this.pieCharValues = this.expenseByCategory.map(ele => ele.total);
      // tslint:disable-next-line:max-line-length
      this.util.buildPieBarChart('monthBarCanvas', 'Ingreso neto mensual', this.monthBarCanvas, this.pieCharLabels, this.pieCharValues, this.colors);
    });
  }


  getRangeExpenses() {

    this.totalRangeExpenses = 0;
    this.rangeExpenses = [];
    this.rangeExpenseByCategory = [];
    this.rangePieCharLabels = [];
    this.rangePieCharValues = [];

    if (this.start_date && this.end_date) {
      this.expenseService.getExpensesOfPeriodOnce(
        this.uid,
        'range',
        this.start_date,
        this.end_date
      ).subscribe(data => {
        data.docs.map(doc => {
          this.rangeExpenses.push(doc.data());
        });
        this.rangeExpenses.map(expense => {

          const categoryElement = this.rangeExpenseByCategory.find(x => x.type === expense.type);

          if (!categoryElement) {
            this.rangeExpenseByCategory.push({ type: expense.type, total: Number(expense.amount) });
          } else {
            categoryElement.total += expense.amount;
          }
          this.totalRangeExpenses += Number(expense.amount);
        });

        this.rangePieCharLabels = this.rangeExpenseByCategory.map(el => el.type);
        this.rangePieCharValues = this.rangeExpenseByCategory.map(ele => ele.total);
        // tslint:disable-next-line:max-line-length
        this.util.buildPieBarChart('rangeBarCanvas', 'Detalle del gasto', this.rangeBarCanvas, this.rangePieCharLabels, this.rangePieCharValues, this.colors);
      });
    }
  }

  getUID() {
    this.util.userid.subscribe(data => {
      if (!this.uid) {
        if (data) {
          this.uid = data;
          this.getMonthExpenses();
        }
      }
    });
  }


  showReport(type?: string) {
    if (type) {
      this.tab = type;
    }

    switch (this.tab) {
      case 'month':
        this.getMonthExpenses();
        break;
      case 'range':
        this.getRangeExpenses();
        break;
      default:
        break;
    }
  }
}
