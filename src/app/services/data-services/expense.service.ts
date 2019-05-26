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
    console.log(this.util.timestampFormat(start), this.util.timestampFormat(end), driver_id, uid);
    return this.firestore.store.collection<Expense>('expenses',
      ref => ref.where('date', '>', this.util.timestampFormat(start))
        .where('date', '<', this.util.timestampFormat(end))
        .where('driver_id', '==', driver_id)
    ).valueChanges();
  }

  // public getDriverCommission(driver_id: string, uid, type: string): Observable<any> {
  //   let start: any;
  //   let end: any;

  //   if (type === 'week') {
  //     start = moment().startOf('week').toDate(); // set to 12:00 am today
  //     end = moment().endOf('week').toDate(); // set to 23:59 pm today
  //   } else { // month
  //     start = moment().startOf('month').toDate(); // set to 12:00 am today
  //     end = moment().endOf('month').toDate(); // set to 23:59 pm today
  //   }
  //   console.log(start, end, driver_id, uid);
  //   return this.firestore.store.collection<Expense>('expenses',
  //     ref => ref.where('date', '>', this.util.timestampFormat(start))
  //       .where('date', '<', this.util.timestampFormat(end))
  //       .where('driver_id', '==', driver_id)
  //       .where('type', '==', 'Comision para el conductor')
  //       .where('owner_id', '==', uid)
  //   ).valueChanges();
  // }


  // public getDriverMonthCommission(driver_id: string, uid): Observable<any> {
  //   let start: any;
  //   let end: any;

  //   // month
  //   start = moment().startOf('month').toDate(); // set to 12:00 am today
  //   end = moment().endOf('month').toDate(); // set to 23:59 pm today

  //   return this.firestore.store.collection<Expense>('expenses',
  //     ref => ref.where('date', '>', this.util.timestampFormat(start))
  //       .where('date', '<', this.util.timestampFormat(end))
  //       .where('driver_id', '==', driver_id)
  //       .where('type', '==', 'Comision para el conductor')
  //       .where('owner_id', '==', uid)
  //   ).valueChanges();
  // }

  public getAllDayExpenses(uid): Observable<any> {

    const start = moment().startOf('day').toDate(); // set to 12:00 am today
    const end = moment().endOf('day').toDate(); // set to 23:59 pm today
    return this.firestore.store.collection<Expense>('expenses',
      ref => ref.where('date', '>', this.util.timestampFormat(start))
        .where('date', '<', this.util.timestampFormat(end))
        .where('owner_id', '==', uid)
    ).valueChanges();
  }


  // public getDriversWeeklyCommission(uid): Observable<any> {
  //   let start: any;
  //   let end: any;

  //     start = moment().startOf('week').toDate(); // set to 12:00 am today
  //     end = moment().endOf('week').toDate(); // set to 23:59 pm today
  //     console.log(start, end, uid);

  //   return this.firestore.store.collection<Expense>('expenses',
  //     ref => ref.where('date', '>', this.util.timestampFormat(start))
  //       .where('date', '<', this.util.timestampFormat(end))
  //       .where('type', '==', 'Comision para el conductor')
  //       .where('owner_id', '==', uid)
  //   ).valueChanges();
  // }



public getDriverCommissionsOnce(driver_id: string, uid, type: string): Observable<any> {
  let start: any;
  let end: any;

  if (type === 'week') {
    start = moment().startOf('week').toDate(); // set to 12:00 am today
    end = moment().endOf('week').toDate(); // set to 23:59 pm today
  } else { // month
    start = moment().startOf('month').toDate(); // set to 12:00 am today
    end = moment().endOf('month').toDate(); // set to 23:59 pm today
  }
  console.log(start, end, driver_id, uid);
  return this.firestore.store.collection<Expense>('expenses',
    ref => ref.where('date', '>', this.util.timestampFormat(start))
      .where('date', '<', this.util.timestampFormat(end))
      .where('driver_id', '==', driver_id)
      .where('type', '==', 'Comision para el conductor')
      .where('owner_id', '==', uid)
  ).get();
}


}
