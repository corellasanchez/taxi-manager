import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
