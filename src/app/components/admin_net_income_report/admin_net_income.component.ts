import * as moment from 'moment';
import { Chart } from 'chart.js';
import { Component, ViewChild, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MenuController, IonContent } from '@ionic/angular';

import { ExpenseService } from '../../services/data-services/expense.service';
import { IncomeService } from '../../services/data-services/income.service';
import { Expense } from '../../models/expense.model';
import { Income } from '../../models/income.model';
import { UtilService } from '../../services/util/util.service';
import { NumberValueAccessor } from '@angular/forms/src/directives';

@Component({
  selector: 'app-net-income-reports',
  templateUrl: './admin_net_income_report.component.html'
})
export class AdminNetIncomeComponent implements OnInit {

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
  totalMonthIncome: number;
  totalRangeIncome: number;
  totalMonthNetIncome: number;
  barCharLabels = [];
  barCharValues = [];
  monthExpenses: any;
  monthIncomes: any;
  rangeIncomes: any;
  totalRangeNetIncome: number;
  totalMonthExpenses: number;
  weekSubscription: boolean;
  monthSubscription: boolean;
  totalRangeExpenses: number;
  rangeExpenses: any;
  start_date: any;
  end_date: any;

  constructor(
    private expenseService: ExpenseService,
    private incomeService: IncomeService,
    private util: UtilService,
    private menuCtrl: MenuController,
    private datePipe: DatePipe) {

    this.title = 'Ingreso Neto';
    this.tab = 'month';
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

  showAdd(show: boolean) {
    this.showAddPannel = show;
    if (show) {
      this.title = 'Registrar un gasto';

    } else {
      this.title = 'Gastos de hoy';

    }
  }

  getMonthNetIncome() {
    this.expenseService.getExpensesOfPeriodOnce(this.uid, 'month').subscribe(data => {
      this.totalMonthExpenses = 0;
      this.monthExpenses = [];
      data.docs.map(doc => {
        this.monthExpenses.push(doc.data());
      });
      this.monthExpenses.map(expense => {
        this.totalMonthExpenses += Number(expense.amount);
      });
    });

    this.incomeService.getIncomeOfPeriodOnce(this.uid, 'month').subscribe(data => {
      this.totalMonthIncome = 0;

      this.monthIncomes = [];
      data.docs.map(doc => {
        this.monthIncomes.push(doc.data());
      });

      this.monthIncomes.map(income => {
        this.totalMonthIncome += Number(income.amount);
      });
      const currentMonth = this.datePipe.transform(new Date(), 'MMMM') + ' ' + this.datePipe.transform(new Date(), 'y');
      const labels = [currentMonth];
      const datasets = [
        {
          label: 'Gastos',
          backgroundColor: '#f53d3d',
          data: [this.totalMonthExpenses]
        }, {
          label: 'Ingreso Bruto',
          backgroundColor: '#488aff',
          data: [this.totalMonthIncome]
        }
      ];

      this.totalMonthNetIncome = this.totalMonthIncome - this.totalMonthExpenses;
      this.util.buildGroupedBarChart('monthBarCanvas', 'Ingreso neto mensual', this.monthBarCanvas, labels, datasets);
    });
  }


  getRangeNetIncome() {
    this.totalRangeNetIncome = 0;
    this.totalRangeExpenses = 0;
    this.totalRangeIncome = 0;
    this.rangeExpenses = [];
    this.rangeIncomes = [];

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
          this.totalRangeExpenses += Number(expense.amount);
        });
      });
      this.incomeService.getIncomeOfPeriodOnce(
        this.uid,
        'range',
        this.start_date,
        this.end_date
      ).subscribe(data => {
        data.docs.map(doc => {
          this.rangeIncomes.push(doc.data());
        });

        this.rangeIncomes.map(income => {
          this.totalRangeIncome += Number(income.amount);
        });
        const labels = ['Datos del periodo' ];
        const datasets = [
          {
            label: 'Gastos',
            backgroundColor: '#f53d3d',
            data: [this.totalRangeExpenses]
          }, {
            label: 'Ingreso Bruto',
            backgroundColor: '#488aff',
            data: [this.totalRangeIncome]
          }
        ];

        this.totalRangeNetIncome = this.totalRangeIncome - this.totalRangeExpenses;
        this.util.buildGroupedBarChart('rangeBarCanvas', 'Ingreso neto mensual', this.rangeBarCanvas, labels, datasets);

      });
    }
  }

  getUID() {
    this.util.userid.subscribe(data => {
      if (!this.uid) {
        if (data) {
          this.uid = data;
          this.getMonthNetIncome();
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
        this.getMonthNetIncome();
        break;
      case 'range':
        this.getRangeNetIncome();
        break;
      default:
        break;
    }
  }
}
