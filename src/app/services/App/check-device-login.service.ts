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
export class CheckDeviceLoginService {

  constructor(private auth: AuthService,
    private profilApi: ProfilService,
    private localStorage: LocalStorageService,
    private notif: LocalNotifService,
    private router: Router,
    private alertCtrl: AlertController) {
  }

  public async initCheckDeviceLogin(): Promise<void> {
    const token = await this.localStorage.get('access_token');
    const profile = await this.profilApi.getProfile(token);
    const deviceId = (await Device.getId()).identifier;
    if (profile.device_login !== deviceId) {
      await this.auth.logout(token);
      await this.localStorage.clear();
      await this.notif.deleteAll();
      await this.router.navigateByUrl('/login');
      await showAlert(this.alertCtrl, 'Error!', 'Akun Anda telah login di perangkat lain, silahkan login kembali');
    }
  }
}
