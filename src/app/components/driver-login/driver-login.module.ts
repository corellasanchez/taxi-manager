import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DriverLoginPage } from './driver-login.page';

import { NumberDirective } from '../../directives/number.directive';


const routes: Routes = [
  {
    path: '',
    component: DriverLoginPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DriverLoginPage, NumberDirective]
})
export class DriverLoginPageModule {}
