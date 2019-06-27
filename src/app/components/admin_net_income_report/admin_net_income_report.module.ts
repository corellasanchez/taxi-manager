import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AdminNetIncomeComponent } from './admin_net_income.component';
import { SharedModule } from '../../shared/shared.module';
import { DatePipe } from '@angular/common';


const routes: Routes = [
  {
    path: '',
    component: AdminNetIncomeComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [AdminNetIncomeComponent],
  providers: [DatePipe]
})
export class AdminNetIncomeReportsModule {}

