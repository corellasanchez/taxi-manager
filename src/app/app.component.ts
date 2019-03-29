import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService } from './services/firestore/firebase-authentication.service';
import { UtilService } from './services/util/util.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app-component.scss']
})
export class AppComponent {

  public appMenu = [];

  rol: string;

  constructor(
    private authService: AuthenticationService,
    private util: UtilService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }
  logout() {
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
        ];
      } else {
        this.appMenu = [
          { title: 'Registrar Gasto', url: '/cars', icon: 'paper' },
          { title: 'Cierre de turno', url: '/drivers', icon: 'speedometer' },
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
}
