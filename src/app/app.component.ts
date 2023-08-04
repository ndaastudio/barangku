import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { LocalNotifications } from '@capacitor/local-notifications';
import { InitDbService } from './services/Database/SQLite/init-db.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private sqlite: InitDbService,
    private platform: Platform,
    private router: Router) {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (this.router.url === '/' || this.router.url === '/login' || this.router.url === '/tabs/barang' || this.router.url === '/tabs/jasa' || this.router.url === '/tabs/profil' || this.router.url === '/update') {
        App.minimizeApp();
      }
    });
    const setStatusBarStyleDark = async () => {
      await StatusBar.setStyle({ style: Style.Dark });
    };
    setStatusBarStyleDark();
    const setBackgroundColor = async () => {
      await StatusBar.setBackgroundColor({ color: '#30a2ff' });
    }
    setBackgroundColor();
    const notifListener = async () => {
      await LocalNotifications.addListener("localNotificationActionPerformed", async (payload) => {
        await this.router.navigateByUrl(payload.notification.extra.url);
      });
    }
    notifListener();
  }

  ngOnInit() {
    this.sqlite.init();
  }
}
