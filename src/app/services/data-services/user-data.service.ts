/**
 * Ionic4 Firebase Starter Kit (https://store.enappd.com/product/firebase-starter-kitionic4-firebase-starter)
 *
 * Copyright © 2019-present Enappd. All rights reserved.
 *
 * This source code is licensed as per the terms found in the
 * LICENSE.md file in the root directory of this source tree.
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseDataService } from './base-data.service';
import { UserModel } from 'src/app/models/user.model';
import { FirestoreService } from '../firestore/firestore.service';

@Injectable()
export class UserDataService extends BaseDataService<UserModel> {
    constructor(private firestore: FirestoreService) {
        super('users');
    }

    public get(): Observable<UserModel[]> {
        return this.firestore.get<UserModel>(this.baseCollection);
    }

    public getOne(id: string): Observable<UserModel> {
        return this.firestore.getOne<UserModel>(this.baseCollection, id);
    }

    public update(data: Partial<UserModel>): Promise<void> {
        return this.firestore.update<UserModel>(this.baseCollection, data.id, data);
    }

    public delete(id: string): Promise<any> {
        return this.firestore.delete(this.baseCollection, id);
    }

    public create(data: any): Promise<void> {
        return this.firestore.create(this.baseCollection, data);
    }
}
