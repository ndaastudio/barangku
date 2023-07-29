import { Component } from '@angular/core';
import { APIService } from 'src/services/API/api.service';
import { StorageService } from 'src/services/LocalStorage/storage.service';
import { NotificationService } from 'src/services/Notification/notification.service';
import { Router } from '@angular/router';
import { Device } from '@capacitor/device';
import { showAlert } from '../helpers/functions';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private apiService: APIService,
    private storageService: StorageService,
    private notificationService: NotificationService,
    private router: Router,
    private alertCtrl: AlertController) {
    this.initCheckDeviceLogin();
  }

  async initCheckDeviceLogin() {
    const token = await this.storageService.get('access_token');
    const profile = await this.apiService.getUserProfile(token);
    const deviceId = (await Device.getId()).identifier;
    if (profile.device_login !== deviceId) {
      await this.apiService.logoutAkun(token);
      await this.storageService.clear();
      await this.notificationService.cancelAllNotifications();
      await this.router.navigateByUrl('/login');
      await showAlert(this.alertCtrl, 'Error!', 'Akun Anda telah login di perangkat lain, silahkan login kembali');
    }
  }
}
