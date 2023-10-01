import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { LocalStorageService } from 'src/app/services/Database/local-storage.service';
import { LocalNotifService } from 'src/app/services/App/local-notif.service';
import { showAlert, showLoading } from '../../../helpers/functions';
import { AuthService } from 'src/app/services/API/auth.service';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage implements OnInit {
  platform: any = null;
  nama: any;
  email: any;
  nomor_telepon: any;
  jenis_akun: any;

  constructor(private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private localStorage: LocalStorageService,
    private auth: AuthService,
    private notif: LocalNotifService,) {
  }

  async ngOnInit() {
    this.platform = await this.localStorage.get('os');
    const profile = await this.localStorage.get('profile');
    this.nama = profile.nama;
    this.email = profile.email;
    this.nomor_telepon = profile.nomor_telepon;
    this.jenis_akun = profile.jenis_akun;
  }

  goToEditProfil() {
    this.router.navigateByUrl('/profil/edit');
  }

  async submitKeluar() {
    const alertKeluar = await this.alertCtrl.create({
      header: 'Keluar',
      message: 'Anda yakin ingin keluar?',
      buttons: [{
        text: 'Batal',
        role: 'cancel',
        cssClass: '!text-gray-500'
      },
      {
        text: 'Ya',
        cssClass: '!text-red-500',
        handler: async () => {
          await alertKeluar.dismiss();
          try {
            const token = await this.localStorage.get('access_token');
            await showLoading(this.loadingCtrl, 'Loading...');
            await this.auth.logout(token);
            await this.notif.deleteAll();
            await this.localStorage.clear();
            await this.loadingCtrl.dismiss();
            await this.router.navigateByUrl('/login');
          } catch (error: any) {
            await this.loadingCtrl.dismiss();
            await showAlert(this.alertCtrl, 'Error!', error.error.message);
          }
        }
      }]
    });
    await alertKeluar.present();
  }

  goToPindahPerangkat() {
    this.router.navigateByUrl('/pindah-perangkat');
  }

  async openBrowser(url: string) {
    await Browser.open({ url: url });
  }

  async submitHapusAkun() {
    const alertHapusAkun = await this.alertCtrl.create({
      header: 'Hapus Akun',
      message: 'Anda akan dialihkan ke website Barangku untuk menghapus akun. Lanjutkan?',
      buttons: [{
        text: 'Batal',
        role: 'cancel',
        cssClass: '!text-gray-500'
      },
      {
        text: 'Ya',
        handler: async () => {
          this.openBrowser('https://barangku.web.id/hapus-akun');
        }
      }]
    });
    await alertHapusAkun.present();
  }
}
