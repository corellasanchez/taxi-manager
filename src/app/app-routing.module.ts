import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GuardsService } from './guards/guards.service';

const routes: Routes = [
  { path: '', redirectTo: 'cars', pathMatch: 'full' },
  // { path: 'home', loadChildren: './components/home/home.module#HomePageModule' , canActivate: [GuardsService] },
  { path: 'signup', loadChildren: './components/signup/signup.module#SignupPageModule' },
  { path: 'login', loadChildren: './components/login/login.module#LoginPageModule' },
  { path: 'driver-login', loadChildren: './components/driver-login/driver-login.module#DriverLoginPageModule' },
  { path: 'cars', loadChildren: './components/cars/cars.module#CarsComponentModule' },
  { path: 'drivers', loadChildren: './components/drivers/drivers.module#DriversComponentModule' },
  { path: 'driver-lobby', loadChildren: './components/driver-lobby/driver-lobby.module#DriverLobbyComponentModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
