import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseDataService } from './base-data.service';
import { Driver } from '../../models/driver.model';
import { FirestoreService, FirestoreQuery } from '../firestore/firestore.service';
import { UtilService } from '../util/util.service';


@Injectable()
export class DriverService extends BaseDataService<Driver> {
    constructor(private firestore: FirestoreService, private util: UtilService) {
        super('driver');
    }

    public getDrivers(uid: string): Observable<any> {
        let query: FirestoreQuery;
        query = {
            'field': 'uid',
            'operation': '==',
            'searchKey': uid
        };
        return this.firestore.runQuery(this.baseCollection, query);
    }

    public get(): Observable<any> {
        return this.firestore.get<Driver>(this.baseCollection);
    }

    public getOne(id: string): Observable<Driver> {
        return this.firestore.getOne<Driver>(this.baseCollection, id);
    }

    public update(data: Partial<Driver>): Promise<void> {
        return this.firestore.update<Driver>(this.baseCollection, data.id, data);
    }

    public delete(id: string): Promise<any> {
        return this.firestore.delete(this.baseCollection, id);
    }

    public create(data: Driver): Promise<void> {
        return this.firestore.create(this.baseCollection, data);
    }

    public driverLogin(ssn: string, password: string) {
        return this.firestore.store.collection<Driver>('driver',
            ref => ref.where('ssn', '==', ssn)
                .where('password', '==', password)).valueChanges();
    }

    public getDriversOnce(uid: string) {
      return this.firestore.store.collection<Driver>('driver',
      ref => ref.where('uid', '==', uid)).get();
    }
}

