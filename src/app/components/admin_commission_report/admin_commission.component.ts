import * as moment from 'moment';
import { Chart } from 'chart.js';
import { Component, ViewChild, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MenuController, IonContent } from '@ionic/angular';

import { ExpenseService } from '../../services/data-services/expense.service';
import { Expense } from '../../models/expense.model';
import { UtilService } from '../../services/util/util.service';
import { DriverService } from '../../services/data-services/driver.service';

@Component({
  selector: 'app-admin-com-reports',
  templateUrl: './admin_commission_report.component.html'
})
export class AdminCommissionReportsComponent implements OnInit {

  @ViewChild('content') content: IonContent;
  @ViewChild('weekBarCanvas') weekBarCanvas;
  @ViewChild('monthBarCanvas') monthBarCanvas;
  @ViewChild('rangeBarCanvas') rangeBarCanvas;

  public weekCommissions: Array<Expense>;
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
  totalWeekCommissions: number;
  barCharLabels = [];
  barCharValues = [];
  monthCommissions: any;
  totalMonthCommissions: number;
  weekSubscription: boolean;
  monthSubscription: boolean;
  totalRangeCommissions: number;
  rangeCommissions: any;
  start_date: any;
  end_date: any;

  constructor(
    private expenseService: ExpenseService,
    private driverService: DriverService,
    private util: UtilService,
    private menuCtrl: MenuController,
    private datePipe: DatePipe) {

    this.title = 'Comisiones';
    this.tab = 'week';
    this.weekSubscription = false;
    this.monthSubscription = false;
  }

  ionViewDidEnter() {
    if (this.uid) {
      this.getDrivers();
    }
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

  getWeekCommissions() {
    this.util.showLoader();
    this.expenseService.getDriverCommissionsOnce(this.driver.id, this.uid, 'week').subscribe(data => {
      this.totalWeekCommissions = 0;
      this.weekSubscription = true;
      this.weekCommissions = [];

      data.docs.map(doc => {
        this.weekCommissions.push(doc.data());
      });

      const DaysOfWeek = [];
      this.weekCommissions.map(dayOfWeek => {
        const dayName = this.datePipe.transform(new Date(dayOfWeek.date.seconds * 1000), 'EEE');
        const dayElement = DaysOfWeek.find(x => x.day === dayName);
        if (!dayElement) {
          DaysOfWeek.push({ day: dayName, total: Number(dayOfWeek.amount) });
        } else {
          dayElement.total += Number(dayOfWeek.amount);
        }
        this.totalWeekCommissions += Number(dayOfWeek.amount);
      });
      this.barCharLabels = DaysOfWeek.map(day => day.day);
      this.barCharValues = DaysOfWeek.map(day => day.total);
      this.util.buildBarChart('weekBarCanvas', 'Comisión por día', this.weekBarCanvas, this.barCharLabels, this.barCharValues);
      this.util.hideLoader();
    });

  }

  getMonthCommissions() {
    this.util.showLoader();
    this.expenseService.getDriverCommissionsOnce(this.driver.id, this.uid, 'month').subscribe(data => {
      this.monthSubscription = true;
      this.totalMonthCommissions = 0;
      this.monthCommissions = [];
      data.docs.map(doc => {
        this.monthCommissions.push(doc.data());
      });
      const weeksOfMonth = [];
      this.monthCommissions.map(weekOfMonth => {
        const weekNumber = this.datePipe.transform(new Date(weekOfMonth.date.seconds * 1000), 'W');
        const weekElement = weeksOfMonth.find(x => x.week === 'Sem. ' + weekNumber);
        if (!weekElement) {
          weeksOfMonth.push({ week: 'Sem. ' + weekNumber, total: Number(weekOfMonth.amount) });
        } else {
          weekElement.total += Number(weekOfMonth.amount);
        }
        this.totalMonthCommissions += Number(weekOfMonth.amount);
      });

      const labels = weeksOfMonth.map(i => i.week);
      const values = weeksOfMonth.map(i => i.total);
      this.util.buildBarChart('monthBarCanvas', 'Comisión por semana', this.monthBarCanvas, labels, values);
      this.util.hideLoader();
    });

  }

  getRangeCommissions() {
    this.totalRangeCommissions = 0;
    this.rangeCommissions = [];

    console.log(this.driver.id);

    if (this.start_date && this.end_date) {
      this.util.showLoader();
      this.expenseService.getDriverCommissionsOnce(
        this.driver.id,
        this.uid,
        'range',
        this.start_date,
        this.end_date).subscribe(data => {

          data.docs.map(doc => {
            this.rangeCommissions.push(doc.data());
          });

          const monthsOfYear = [];
          this.weekCommissions.map(monthOfYear => {
            const monthName = this.datePipe.transform(new Date(monthOfYear.date.seconds * 1000), 'MMMM');
            console.log('M', monthName);
            const monthElement = monthsOfYear.find(x => x.month === monthName);
            if (!monthElement) {
              monthsOfYear.push({ month: monthName, total: Number(monthOfYear.amount) });
            } else {
              monthElement.total += Number(monthOfYear.amount);
            }
            this.totalRangeCommissions += Number(monthOfYear.amount);
          });
          this.barCharLabels = monthsOfYear.map(month => month.month);
          this.barCharValues = monthsOfYear.map(month => month.total);
          this.util.buildBarChart('rangeBarCanvas', 'Comisión por mes', this.rangeBarCanvas, this.barCharLabels, this.barCharValues);
          this.util.hideLoader();
        });

    }

  }

  getUID() {
    this.util.userid.subscribe(data => {
      if (!this.uid) {
        if (data) {
          this.uid = data;
          this.getDrivers();
        }
      }
    });
  }

  getDrivers() {
    this.driverService.getDriversOnce(this.uid).subscribe(data => {
      this.drivers = [];
      if (data) {
        data.docs.map(doc => {
          this.drivers.push(doc.data());
        });
        if (this.drivers.length > 0) {
          this.driver = this.drivers[0];
        }
      }
    });
  }

  showReport(type?: string) {
    if (type) {
      this.tab = type;
    }
    console.log(this.tab);
    if (this.driver) {
      switch (this.tab) {
        case 'month':
          this.getMonthCommissions();
          break;
        case 'week':
          this.getWeekCommissions();
          break;
        case 'range':
          this.getRangeCommissions();
          break;
        default:
          break;
      }
    }
  }
}
