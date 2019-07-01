import { NgModule } from '@angular/core';
import { PreloadAllModules, Routes, RouterModule } from '@angular/router';
import { GuardsService } from './guards/guards.service';
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // { path: 'home', loadChildren: './components/home/home.module#HomePageModule' , canActivate: [GuardsService] },
  { path: 'signup', loadChildren: './components/signup/signup.module#SignupPageModule' },
  { path: 'login', loadChildren: './components/login/login.module#LoginPageModule' },
  { path: 'driver-login', loadChildren: './components/driver-login/driver-login.module#DriverLoginPageModule' },
  { path: 'cars', loadChildren: './components/cars/cars.module#CarsComponentModule' },
  { path: 'drivers', loadChildren: './components/drivers/drivers.module#DriversComponentModule' },
  { path: 'expenses', loadChildren: './components/expenses/expenses.module#ExpensesComponentModule' },
  { path: 'admin_expenses', loadChildren: './components/admin_expenses/admin_expenses.module#AdminExpensesComponentModule' },
  { path: 'income', loadChildren: './components/income/income.module#IncomeComponentModule' },
  { path: 'driver_reports', loadChildren: './components/driver_reports/driver_reports.module#DriverReportsComponentModule' },
  {
    path: 'admin_commissions_report',
    loadChildren: './components/admin_commission_report/admin_commission_report.module#AdminCommissionReportsModule'
  },
  {
    path: 'admin_net_income_report',
    loadChildren: './components/admin_net_income_report/admin_net_income_report.module#AdminNetIncomeReportsModule'
  },
  {
    path: 'admin_expense_detail',
    loadChildren: './components/admin_expense_detail/admin_expense_detail.module#AdminExpenseDetailModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
