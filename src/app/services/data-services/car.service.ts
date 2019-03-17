import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseDataService } from './base-data.service';
import { Car } from '../../models/car.model';
import { FirestoreService, FirestoreQuery } from '../firestore/firestore.service';
import { UtilService } from '../util/util.service';


@Injectable()
export class CarService extends BaseDataService<Car> {
    constructor(private firestore: FirestoreService, private util: UtilService) {
        super('car');
    }

    public getCars(uid: string): Observable<any> {
        let query: FirestoreQuery;
        query = {
        'field' : 'uid',
        'operation' : '==',
        'searchKey' : uid};
        return this.firestore.runQuery(this.baseCollection, query );
    }

    public get(): Observable<any> {
        return this.firestore.get<Car>(this.baseCollection);
    }

    public getOne(id: string): Observable<Car> {
        return this.firestore.getOne<Car> (this.baseCollection, id);
    }

    public update(data: Partial<Car>): Promise<void> {
        return this.firestore.update<Car>(this.baseCollection, data.id, data);
    }

    public delete(id: string): Promise<any> {
        return this.firestore.delete(this.baseCollection, id);
    }

    public create(data: Car): Promise<void> {
        return this.firestore.create(this.baseCollection, data);
    }
}

