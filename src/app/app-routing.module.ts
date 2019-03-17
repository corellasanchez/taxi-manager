/**
 * Ionic4 Firebase Starter Kit (https://store.enappd.com/product/firebase-starter-kitionic4-firebase-starter)
 *
 * Copyright © 2019-present Enappd. All rights reserved.
 *
 * This source code is licensed as per the terms found in the
 * LICENSE.md file in the root directory of this source tree.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GuardsService } from './guards/guards.service';

const routes: Routes = [
  { path: '', redirectTo: 'cars', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' , canActivate: [GuardsService] },
  { path: 'signup', loadChildren: './signup/signup.module#SignupPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'cars', loadChildren: './cars/cars.module#CarsComponentModule' },
  { path: 'images', loadChildren: './image-upload/image-upload.module#ImageUploadPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
