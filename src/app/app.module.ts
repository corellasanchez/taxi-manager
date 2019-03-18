/**
 * Ionic4 Firebase Starter Kit (https://store.enappd.com/product/firebase-starter-kitionic4-firebase-starter)
 *
 * Copyright © 2019-present Enappd. All rights reserved.
 *
 * This source code is licensed as per the terms found in the
 * LICENSE.md file in the root directory of this source tree.
 */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AuthenticationService } from './services/firestore/firebase-authentication.service';
import { UserDataService } from './services/data-services/user-data.service';

import { FirestoreService } from './services/firestore/firestore.service';
import { CarService } from './services/data-services/car.service';
import { DriverService } from './services/data-services/driver.service';
import { StorageService } from './services/firestore/filestorage.service';
import { AngularFireStorageModule } from '@angular/fire/storage';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.config),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    UserDataService,
    CarService,
    DriverService,
    AuthenticationService,
    FirestoreService,
    StorageService,
    { provide: FirestoreSettingsToken, useValue: {} }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {


 }
