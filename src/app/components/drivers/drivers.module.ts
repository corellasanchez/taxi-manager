import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';


import { DriversComponent } from './drivers.component';
import { NumberDirective } from '../../directives/number.directive';


const routes: Routes = [
  {
    path: '',
    component: DriversComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DriversComponent, NumberDirective]
})
export class DriversComponentModule {}

