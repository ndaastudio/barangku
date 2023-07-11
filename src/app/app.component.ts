import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { App } from '@capacitor/app';
import { DatabaseService } from 'src/services/Database/database.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private database: DatabaseService,
    private platform: Platform,
    private router: Router) {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (this.router.url === '/' || this.router.url === '/tabs/tab1' || this.router.url === '/tabs/tab2' || this.router.url === '/tabs/tab3') {
        App.exitApp();
      }
    });
  }

  ngOnInit() {
    this.database.init();
  }
}
