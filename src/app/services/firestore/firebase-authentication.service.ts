import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Subject, BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { UserDataService } from '../data-services/user-data.service';
import { User } from 'firebase';
import { resolve } from 'url';
import { UtilService } from '../util/util.service';

export class AuthInfo {
    constructor(public $uid: string) { }

    isLoggedIn() {
        return !!this.$uid;
    }
}

@Injectable()
export class AuthenticationService {
    static UNKNOWN_USER = new AuthInfo(null);
    public authInfo$: BehaviorSubject<AuthInfo> = new BehaviorSubject<AuthInfo>(AuthenticationService.UNKNOWN_USER);

    constructor(private fireAuth: AngularFireAuth, private userDataServ: UserDataService, private util: UtilService) {

        this.fireAuth.authState.pipe(
            take(1)
        ).subscribe(user => {
            if (user) {
                this.authInfo$.next(new AuthInfo(user.uid));
            }
        });
    }
    public forgotPassoword(email: string) {
        this.fireAuth.auth.sendPasswordResetEmail(email).then(() => {
            this.util.presentToast('Revisa tu correo.', true, 'bottom', 2100);
        }).catch(err => {

            switch (err.code) {
                case 'auth/invalid-email': {
                    this.util.presentToast('Ingresa un correo válido.', true, 'bottom', 5100);
                    break;
                }
                case 'auth/user-not-found': {
                    this.util.presentToast('Este correo no se ha registrado aún.', true, 'bottom', 5100);
                    break;
                }
                default: {
                    this.util.presentToast(`${err}`, true, 'bottom', 2100);
                    break;
                }
            }
        });

    }

    public createAccount(email: string, password: string): Promise<any> {
        // tslint:disable-next-line:no-shadowed-variable
        return new Promise<any>((resolve, reject) => {
            this.fireAuth.auth.createUserWithEmailAndPassword(email, password)
                .then(res => {
                    if (res.user) {
                        this.authInfo$.next(new AuthInfo(res.user.uid));
                        this.userDataServ.create({
                            email: email,
                            id: res.user.uid,
                            username: res.user.displayName
                        });
                        resolve(res.user);
                    }
                })
                .catch(err => {

                    this.authInfo$.next(AuthenticationService.UNKNOWN_USER);
                    reject(`creation failed ${err}`);
                });
        });
    }

    public login(email: string, password: string): Promise<any> {
        // tslint:disable-next-line:no-shadowed-variable
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
                    switch (err.code) {
                        case 'auth/wrong-password': {
                            reject('Contraseña Inválida.');
                            break;
                        }
                        case 'auth/user-not-found': {
                            reject('Este correo no esta registrado.');
                            break;
                        }
                        default: {
                            reject(`login failed ${err}`);
                            break;
                        }
                    }
                });
        });
    }

    public logout(): Promise<void> {
        this.authInfo$.next(AuthenticationService.UNKNOWN_USER);
        return this.fireAuth.auth.signOut();
    }

    public checkAuth() {
        // tslint:disable-next-line:no-shadowed-variable
        return new Promise(resolve => {
            this.fireAuth.auth.onAuthStateChanged(user => {
                resolve(user);
            });
        });
    }
}