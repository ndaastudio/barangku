import { Injectable } from '@angular/core';
import { LocalStorageService } from 'src/app/services/Database/local-storage.service';
import { LocalNotifService } from 'src/app/services/App/local-notif.service';
import { Router } from '@angular/router';
import { Device } from '@capacitor/device';
import { showAlert } from '../../helpers/functions';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../../services/API/auth.service';
import { ProfilService } from '../../services/API/profil.service';

@Injectable({
  providedIn: 'root'
})
export class CheckAkunService {
  token: any = null;
  profile: any = null;

  constructor(private auth: AuthService,
    private profilApi: ProfilService,
    private localStorage: LocalStorageService,
    private notif: LocalNotifService,
    private router: Router,
    private alertCtrl: AlertController) {
    this.initApi();
  }

  private async initApi(): Promise<void> {
    this.token = await this.localStorage.get('access_token');
    this.profile = await this.profilApi.getProfile(this.token);
  }

  public async initCheckDeviceLogin(): Promise<void> {
    const deviceId = (await Device.getId()).identifier;
    if (this.profile.device_login !== deviceId) {
      await this.auth.logout(this.token);
      await this.localStorage.clear();
      await this.notif.deleteAll();
      await this.router.navigateByUrl('/login');
      await showAlert(this.alertCtrl, 'Error!', 'Akun anda telah login di perangkat lain, silahkan login kembali');
    }
  }

  public async initCheckExpiredDataUpload(): Promise<void> {
    if (this.profile.tanggal_sinkron) {
      const currentTime = new Date();
      const lastUploadTime = this.profile.tanggal_sinkron;
      const expiredTime = new Date(lastUploadTime);
      expiredTime.setDate(expiredTime.getDate() + 2);
      if (currentTime > expiredTime) {
        await this.profilApi.deleteAllData(this.token, this.profile.id);
      }
    }
  }

  public async initCheckExpiredAkun(): Promise<void> {
    const currentDate = new Date();
    const expiredDate = new Date(this.profile.limit_akun);
    if (currentDate > expiredDate) {
      await this.profilApi.deleteAllData(this.token, this.profile.id);
      await this.auth.logout(this.token);
      await this.localStorage.clear();
      await this.notif.deleteAll();
      await this.router.navigateByUrl('/login');
      await showAlert(this.alertCtrl, 'Error!', 'Akun anda telah expired, silahkan hubungi admin untuk mengaktifkan kembali akun anda');
    }
  }
}
