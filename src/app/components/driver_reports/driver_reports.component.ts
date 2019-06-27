import * as moment from 'moment';
import { Chart } from 'chart.js';
import { Component, ViewChild, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MenuController, IonContent } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { UUID } from 'angular2-uuid';

import { ExpenseService } from '../../services/data-services/expense.service';
import { Expense } from '../../models/expense.model';
import { UserDataService } from '../../services/data-services/user-data.service';
import { UtilService } from '../../services/util/util.service';

@Component({
  selector: 'app-driver-reports',
  templateUrl: './driver_reports.component.html'
})
export class DriverReportsComponent implements OnInit {

  @ViewChild('content') content: IonContent;
  @ViewChild('weekBarCanvas') weekBarCanvas;
  @ViewChild('monthBarCanvas') monthBarCanvas;

  public weekCommissions: Array<Expense>;
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
  tab: string;
  pieChartData: any;
  totalWeekCommissions: number;
  barCharLabels = [];
  barCharValues = [];
  monthCommissions: any;
  totalMonthCommissions: number;
  weekSubscription: boolean;
  monthSubscription: boolean;

  constructor(
    private expenseService: ExpenseService,
    private util: UtilService,
    private menuCtrl: MenuController,
    private storage: Storage,
    private userService: UserDataService,
    private datePipe: DatePipe) {

    this.title = 'Reportes';
    this.tab = 'week';
    this.weekSubscription = false;
    this.monthSubscription = false;
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true, 'start');
    this.menuCtrl.enable(true, 'end');
    // this.content.scrollToTop(300);
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
              this.getWeekCommissions();
            });
          });
        });
      });
    }
  }

  getWeekCommissions() {
    this.util.showLoader();
    this.expenseService.getDriverCommissionsOnce(this.driver.id, this.uid, 'week').subscribe(data => {
      this.totalWeekCommissions = 0;

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
      this.util.hideLoader();
      this.barCharLabels = DaysOfWeek.map(day => day.day);
      this.barCharValues = DaysOfWeek.map(day => day.total);
      this.util.buildBarChart('weekBar', 'Comisión por día', this.weekBarCanvas, this.barCharLabels, this.barCharValues);
    });

  }

  getMonthCommissions() {
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
      this.util.buildBarChart('monthBar', 'Comisión por semana', this.monthBarCanvas, labels, values);
    });
  }

  getUID() {
    this.getDriverInfo();
  }

  showReport(type: string) {
    this.tab = type;
    if (type === 'month') {
      this.getMonthCommissions();
    } else {
      this.getWeekCommissions();
    }
  }
}
