import { Component, OnDestroy } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService } from './services/firestore/firebase-authentication.service';
import { UtilService } from './services/util/util.service';
import { Storage } from '@ionic/storage';
import { MenuController } from '@ionic/angular';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'})
export class AppComponent implements OnDestroy {

  public appMenu = [];

  rol: string;

  constructor(
    private authService: AuthenticationService,
    private util: UtilService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private menuCtrl: MenuController
  ) {
    this.initializeApp();
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true, 'start');
    this.menuCtrl.enable(true, 'end');
  }

  logout() {
    this.menuCtrl.close();
    this.authService.logout().then(() => {
        this.util.navigate('login', false);
    });
  }

  getRol() {
    this.authService.authInfo$.subscribe(user => {
      if (user.$uid) {
        this.appMenu = [
          { title: 'Vehículos', url: '/cars', icon: 'car' },
          { title: 'Conductores', url: '/drivers', icon: 'contacts' },
          { title: 'Gastos del día', url: '/admin_expenses', icon: 'paper' },
          { title: 'Comisiones', url: '/admin_commissions_report', icon: 'paper' },
          { title: 'Ingreso Neto', url: '/admin_net_income_report', icon: 'cash' }
        ];
      } else {
        this.appMenu = [
          { title: 'Registrar Gasto', url: '/expenses', icon: 'paper' },
          { title: 'Cierre de turno', url: '/income', icon: 'speedometer' },
          { title: 'Comisiones', url: '/driver_reports', icon: 'calendar' },
        ];
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.getRol();
    });
  }

  ngOnDestroy() {
    this.authService.authInfo$.unsubscribe();
  }

}
