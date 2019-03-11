/**
 * Ionic4 Firebase Starter Kit (https://store.enappd.com/product/firebase-starter-kitionic4-firebase-starter)
 *
 * Copyright © 2019-present Enappd. All rights reserved.
 *
 * This source code is licensed as per the terms found in the
 * LICENSE.md file in the root directory of this source tree.
 */
import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Subject, BehaviorSubject } from "rxjs";
import { take } from "rxjs/operators";
import { UserDataService } from "../data-services/user-data.service";
import { User } from "firebase";
import { resolve } from 'url';
import { utilService } from '../util/util.service';

export class AuthInfo {
    constructor(public $uid:string) {}

    isLoggedIn() {
        return !!this.$uid;
    }
}

@Injectable()
export class AuthenticationService {
    static UNKNOWN_USER = new AuthInfo(null);
    public authInfo$: BehaviorSubject<AuthInfo> = new BehaviorSubject<AuthInfo>(AuthenticationService.UNKNOWN_USER);

    constructor(private fireAuth: AngularFireAuth, private userDataServ: UserDataService,private util:utilService) {
        
        this.fireAuth.authState.pipe(
            take(1)
        ).subscribe(user => {
            if (user) {
                this.authInfo$.next(new AuthInfo(user.uid));
            }
        });
    }
    public forgotPassoword(email:string){
        this.fireAuth.auth.sendPasswordResetEmail(email).then(()=>{
           this.util.presentToast('Email Sent',true ,'bottom',2100)
        }).catch(err => this.util.presentToast(`${err}`,true,'bottom',2100));

    }

    public createAccount(email: string, password: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.fireAuth.auth.createUserWithEmailAndPassword(email, password)
                .then(res => {
                    if (res.user) {
                        this.authInfo$.next(new AuthInfo(res.user.uid));
                        this.userDataServ.create({
                            email: email,
                            id: res.user.uid,
                            username: res.user.displayName
                          })
                        resolve(res.user);
                    }
                })
                .catch(err => {
                    
                    this.authInfo$.next(AuthenticationService.UNKNOWN_USER);
                    reject(`creation failed ${err}`)
                });
        });
    }

    public login(email: string, password: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.fireAuth.auth.signInWithEmailAndPassword(email, password)
                .then(res => {
                    if (res.user) {
                        this.authInfo$.next(new AuthInfo(res.user.uid));
                        resolve(res.user);
                    }
                })
                .catch(err => {
                    
                    this.authInfo$.next(AuthenticationService.UNKNOWN_USER);
                    reject(`login failed ${err}`)
                });
        });
    }

    public logout(): Promise<void> {
        this.authInfo$.next(AuthenticationService.UNKNOWN_USER);
        return this.fireAuth.auth.signOut();
    }
    public checkAuth() {
        return new Promise(resolve => {
            this.fireAuth.auth.onAuthStateChanged(user => {
                resolve(user);
             })    
        })
    }
}
