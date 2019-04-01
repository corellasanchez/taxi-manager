import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseDataService } from './base-data.service';
import { Expense } from '../../models/expense.model';
import { FirestoreService, FirestoreQuery } from '../firestore/firestore.service';
import { UtilService } from '../util/util.service';


@Injectable()
export class ExpenseService extends BaseDataService<Expense> {
    constructor(private firestore: FirestoreService, private util: UtilService) {
        super('expense');
    }

    public getExpenses(uid: string): Observable<any> {
        let query: FirestoreQuery;
        query = {
        'field' : 'uid',
        'operation' : '==',
        'searchKey' : uid};
        return this.firestore.runQuery(this.baseCollection, query );
    }

    public get(): Observable<any> {
        return this.firestore.get<Expense>(this.baseCollection);
    }

    public getOne(id: string): Observable<Expense> {
        return this.firestore.getOne<Expense> (this.baseCollection, id);
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
}

