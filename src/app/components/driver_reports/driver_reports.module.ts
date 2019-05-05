import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DriverReportsComponent } from './driver_reports.component';
import { SharedModule } from '../../shared/shared.module';
import { DatePipe } from '@angular/common';


const routes: Routes = [
  {
    path: '',
    component: DriverReportsComponent
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
  declarations: [DriverReportsComponent],
  providers: [DatePipe]
})
export class DriverReportsComponentModule {}

