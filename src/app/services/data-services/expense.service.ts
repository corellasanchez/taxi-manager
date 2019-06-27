import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseDataService } from './base-data.service';
import { Expense } from '../../models/expense.model';
import { FirestoreService, FirestoreQuery } from '../firestore/firestore.service';
import { UtilService } from '../util/util.service';
import * as moment from 'moment';

@Injectable()
export class ExpenseService extends BaseDataService<Expense> {
  constructor(private firestore: FirestoreService, private util: UtilService) {
    super('expenses');
  }

  public getExpenses(uid: string): Observable<any> {
    let query: FirestoreQuery;
    query = {
      'field': 'uid',
      'operation': '==',
      'searchKey': uid
    };
    return this.firestore.runQuery(this.baseCollection, query);
  }

  public get(): Observable<any> {
    return this.firestore.get<Expense>(this.baseCollection);
  }

  public getOne(id: string): Observable<Expense> {
    return this.firestore.getOne<Expense>(this.baseCollection, id);
  }

  public update(data: Partial<Expense>): Promise<void> {
    return this.firestore.update<Expense>(this.baseCollection, data.id, data);
  }

  public delete(id: string): Promise<any> {
    return this.firestore.delete(this.baseCollection, id);
  }

  public create(data: Expense): Promise<void> {
    return this.firestore.create(this.baseCollection, data);
  }

  public getDriverDayExpenses(driver_id, uid): Observable<any> {

    const start = moment().startOf('day').toDate(); // set to 12:00 am today
    const end = moment().endOf('day').toDate(); // set to 23:59 pm today
    return this.firestore.store.collection<Expense>('expenses',
      ref => ref.where('date', '>', this.util.timestampFormat(start))
        .where('date', '<', this.util.timestampFormat(end))
        .where('driver_id', '==', driver_id)
    ).valueChanges();
  }

  public getAllDayExpenses(uid): Observable<any> {

    const start = moment().startOf('day').toDate(); // set to 12:00 am today
    const end = moment().endOf('day').toDate(); // set to 23:59 pm today
    return this.firestore.store.collection<Expense>('expenses',
      ref => ref.where('date', '>', this.util.timestampFormat(start))
        .where('date', '<', this.util.timestampFormat(end))
        .where('owner_id', '==', uid)
    ).valueChanges();
  }

  public getDriverCommissionsOnce(driver_id: string, uid, type: string, start_date?: any , end_date?: any ): Observable<any> {
    let start: any;
    let end: any;

    switch (type) {
      case 'week':
        start = this.util.timestampFormat(moment().startOf('week').toDate()); // set to 12:00 am today
        end = this.util.timestampFormat(moment().endOf('week').toDate()); // set to 23:59 pm today
        break;
      case 'month':
        start = this.util.timestampFormat(moment().startOf('month').toDate()); // set to 12:00 am today
        end = this.util.timestampFormat(moment().endOf('month').toDate()); // set to 23:59 pm today
        break;
      case 'range':
        start = this.util.timestampFromMillis(Number(moment(start_date).format('x')));
        end = this.util.timestampFromMillis(Number(moment(end_date).format('x')));
        break;
      default:
        break;
    }

    return this.firestore.store.collection<Expense>('expenses',
      ref => ref.where('date', '>', start)
        .where('date', '<', end)
        .where('driver_id', '==', driver_id)
        .where('type', '==', 'Comision para el conductor')
        .where('owner_id', '==', uid)
    ).get();
  }

  public getExpensesOfPeriodOnce(uid, type: string, start_date?: any , end_date?: any ): Observable<any> {
    let start: any;
    let end: any;

    switch (type) {
      case 'month':
        start = this.util.timestampFormat(moment().startOf('month').toDate()); // set to 12:00 am today
        end = this.util.timestampFormat(moment().endOf('month').toDate()); // set to 23:59 pm today
        break;
      case 'range':
        start = this.util.timestampFromMillis(Number(moment(start_date).format('x')));
        end = this.util.timestampFromMillis(Number(moment(end_date).format('x')));
        break;
      default:
        break;
    }

    return this.firestore.store.collection<Expense>('expenses',
      ref => ref.where('date', '>', start)
        .where('date', '<', end)
        .where('owner_id', '==', uid)
    ).get();
  }
}
