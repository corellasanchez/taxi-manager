/**
 * Ionic4 Firebase Starter Kit (https://store.enappd.com/product/firebase-starter-kitionic4-firebase-starter)
 *
 * Copyright © 2019-present Enappd. All rights reserved.
 *
 * This source code is licensed as per the terms found in the
 * LICENSE.md file in the root directory of this source tree.
 */
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { BaseDataService } from "./base-data.service";
import { UserDto } from "src/app/models/user.model";
import { FirestoreService } from "../firestore/firestore.service";

@Injectable()
export class UserDataService extends BaseDataService<UserDto> {
    constructor(private firestore: FirestoreService) {
        super('users');
    }

    public get(): Observable<UserDto[]> {
        return this.firestore.get<UserDto>(this.baseCollection);
    }

    public getOne(id: string): Observable<UserDto> {
        return this.firestore.getOne<UserDto>(this.baseCollection, id);
    }

    public update(data: Partial<UserDto>): Promise<void> {
        return this.firestore.update<UserDto>(this.baseCollection, data.id, data);
    }

    public delete(id: string): Promise<any> {
        return this.firestore.delete(this.baseCollection, id);
    }
    
    public create(data: UserDto): Promise<void> {
        return this.firestore.create(this.baseCollection, data);
    }
}