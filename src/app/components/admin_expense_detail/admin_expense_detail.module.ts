import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AdminExpenseDetailComponent } from './admin_expense_detail.component';
import { SharedModule } from '../../shared/shared.module';
import { DatePipe } from '@angular/common';


const routes: Routes = [
  {
    path: '',
    component: AdminExpenseDetailComponent
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
  declarations: [AdminExpenseDetailComponent],
  providers: [DatePipe]
})
export class AdminExpenseDetailModule {}

