import { Injectable } from '@angular/core';
import { LocalStorageService } from 'src/app/services/Database/local-storage.service';
import { LocalNotifService } from 'src/app/services/App/local-notif.service';
// import { Router } from '@angular/router';
// import { Device } from '@capacitor/device';
// import { dismissAllLoaders, showAlert } from '../../helpers/functions';
// import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/API/auth.service';
import { ProfilService } from '../../services/API/profil.service';

@Injectable({
  providedIn: 'root'
})
export class CheckAkunService {

  constructor(private auth: AuthService,
    private apiProfil: ProfilService,
    private localStorage: LocalStorageService,
    private notif: LocalNotifService,
    // private router: Router,
    // private alertCtrl: AlertController,
    // private loadingCtrl: LoadingController
  ) {
  }

  // public async initCheckDeviceLogin(): Promise<void> {
  //   const token = await this.localStorage.get('access_token');
  //   const profile = await this.apiProfil.getProfile(token);
  //   const deviceId = (await Device.getId()).identifier;
  //   if (profile.device_login !== deviceId) {
  //     await this.auth.logout(token);
  //     await this.localStorage.clear();
  //     await this.notif.deleteAll();
  //     await dismissAllLoaders(this.loadingCtrl);
  //     await this.router.navigateByUrl('/login');
  //     await showAlert(this.alertCtrl, 'Error!', 'Akun anda telah login di perangkat lain, silahkan login kembali');
  //   }
  // }

  public async initCheckExpiredDataUpload(): Promise<void> {
    const token = await this.localStorage.get('access_token');
    const profile = await this.apiProfil.getProfile(token);
    if (profile.tanggal_sinkron) {
      this.apiProfil.checkExpiredUploadData(token, profile.id);
    }
  }

  public async initCheckExpiredAkun(): Promise<boolean> {
    const token = await this.localStorage.get('access_token');
    const profile = await this.apiProfil.getProfile(token);
    const result = await this.auth.checkExpiredAkun(token, profile.id);
    if (result.status_akun == 2) {
      await this.auth.logout(token);
      await this.localStorage.clear();
      await this.notif.deleteAll();
      return true;
    }
    return false;
  }
}
