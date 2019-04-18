import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseDataService } from './base-data.service';
import { Income } from '../../models/income.model';
import { FirestoreService, FirestoreQuery } from '../firestore/firestore.service';
import { UtilService } from '../util/util.service';
import * as moment from 'moment';


@Injectable()
export class IncomeService extends BaseDataService<Income> {
    constructor(private firestore: FirestoreService, private util: UtilService) {
        super('income');
    }

    public getIncomes(uid: string): Observable<any> {
        let query: FirestoreQuery;
        query = {
            'field': 'uid',
            'operation': '==',
            'searchKey': uid
        };
        return this.firestore.runQuery(this.baseCollection, query);
    }

    public get(): Observable<any> {
        return this.firestore.get<Income>(this.baseCollection);
    }

    public getOne(id: string): Observable<Income> {
        return this.firestore.getOne<Income>(this.baseCollection, id);
    }

    public update(data: Partial<Income>): Promise<void> {
        return this.firestore.update<Income>(this.baseCollection, data.id, data);
    }

    public delete(id: string): Promise<any> {
        return this.firestore.delete(this.baseCollection, id);
    }

    public create(data: Income): Promise<void> {
        return this.firestore.create(this.baseCollection, data);
    }

    public getDriverDayIncomes(driver_id, uid): Observable<any> {

        const start = moment().startOf('day').toDate(); // set to 12:00 am today
        const end = moment().endOf('day').toDate(); // set to 23:59 pm today
        console.log(this.util.timestampFormat(start), this.util.timestampFormat(end), driver_id, uid);
        return this.firestore.store.collection<Income>('Incomes',
            ref => ref.where('date', '>', this.util.timestampFormat(start))
                .where('date', '<', this.util.timestampFormat(end))
                .where('driver_id', '==', driver_id)
        ).valueChanges();
    }

    public getAllDayIncomes(uid): Observable<any> {

        const start = moment().startOf('day').toDate(); // set to 12:00 am today
        const end = moment().endOf('day').toDate(); // set to 23:59 pm today
        return this.firestore.store.collection<Income>('Incomes',
            ref => ref.where('date', '>', this.util.timestampFormat(start))
                .where('date', '<', this.util.timestampFormat(end))
                .where('owner_id', '==', uid)
        ).valueChanges();
    }
}

