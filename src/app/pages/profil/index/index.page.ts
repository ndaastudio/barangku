import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { LocalStorageService } from 'src/app/services/Database/local-storage.service';
import { LocalNotifService } from 'src/app/services/App/local-notif.service';
import { formatDate, showAlert, showLoading } from '../../../helpers/functions';
import { AuthService } from 'src/app/services/API/auth.service';
import { SyncDataService } from 'src/app/services/App/sync-data.service';
import { DataRefreshService } from 'src/app/services/Database/data-refresh.service';

@Component({
  selector: 'app-index',
  templateUrl: 'index.page.html',
  styleUrls: ['index.page.scss']
})
export class Tab3Page {
  nama: any;
  email: any;
  nomor_telepon: any;
  jenis_akun: any;
  tanggal_sinkron: any;

  constructor(private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private localStorage: LocalStorageService,
    private auth: AuthService,
    private notif: LocalNotifService,
    private sync: SyncDataService,
    private dataRefresh: DataRefreshService,) {
  }

  async ngOnInit() {
    const profile = await this.localStorage.get('profile');
    this.nama = profile.nama;
    this.email = profile.email;
    this.nomor_telepon = profile.nomor_telepon;
    this.jenis_akun = profile.jenis_akun;
    this.tanggal_sinkron = formatDate(profile.tanggal_sinkron);
  }

  goToEditProfil() {
    this.router.navigateByUrl('/edit-profil');
  }

  async submitSinkronisasi() {
    const alertSinkronData = await this.alertCtrl.create({
      header: 'Sinkron Data',
      message: 'Silahkan pilih opsi yang diinginkan untuk melakukan sinkronisasi data',
      buttons: [{
        text: 'Download',
        handler: async () => {
          await alertSinkronData.dismiss();
          try {
            await showLoading(this.loadingCtrl, 'Loading...');
            await this.sync.updateDataLocal();
            await this.loadingCtrl.dismiss();
            await this.ngOnInit();
            await showAlert(this.alertCtrl, 'Berhasil!', 'Data di aplikasi sudah sinkron dengan data di server');
            this.dataRefresh.refresh();
          } catch (error: any) {
            await this.loadingCtrl.dismiss();
            await showAlert(this.alertCtrl, 'Error!', error.error.message);
          }
        }
      },
      {
        text: 'Upload',
        handler: async () => {
          await alertSinkronData.dismiss();
          try {
            await showLoading(this.loadingCtrl, 'Loading...');
            await this.sync.updateDataServer();
            await this.loadingCtrl.dismiss();
            await showAlert(this.alertCtrl, 'Berhasil!', 'Data di server sudah sinkron dengan data di aplikasi');
          } catch (error: any) {
            await this.loadingCtrl.dismiss();
            await showAlert(this.alertCtrl, 'Error!', error.error.message);
          }
        }
      }]
    });
    await alertSinkronData.present();
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
}
