import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AdminCommissionReportsComponent } from './admin_commission.component';
import { SharedModule } from '../../shared/shared.module';
import { DatePipe } from '@angular/common';
import { DriverPipe } from './../../filter/driver.pipe';


const routes: Routes = [
  {
    path: '',
    component: AdminCommissionReportsComponent
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
  declarations: [AdminCommissionReportsComponent, DriverPipe],
  providers: [DatePipe]
})
export class AdminCommissionReportsModule {}

