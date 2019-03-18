import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { CarsComponent } from './cars.component';
import { UppercaseDirective } from '../../directives/uppercase.directive';


const routes: Routes = [
  {
    path: '',
    component: CarsComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CarsComponent, UppercaseDirective]
})
export class CarsComponentModule {}

