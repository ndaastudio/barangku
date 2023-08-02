import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { APIService } from 'src/services/API/api.service';
import { DataSharingService } from 'src/services/Database/data-sharing.service';
import { SinkronService } from 'src/services/Database/sinkron.service';
import { StorageService } from 'src/services/LocalStorage/storage.service';
import { NotificationService } from 'src/services/Notification/notification.service';
import { formatDate, showAlert, showLoading } from '../helpers/functions';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
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
    private storageService: StorageService,
    private apiService: APIService,
    private notificationService: NotificationService,
    private dataSharingService: DataSharingService,
    private sinkronService: SinkronService,) {
  }

  async ngOnInit() {
    const profile = await this.storageService.get('profile');
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
            await this.sinkronService.updateDataLocal();
            await this.ngOnInit();
            await this.loadingCtrl.dismiss();
            await showAlert(this.alertCtrl, 'Berhasil!', 'Data di aplikasi sudah sinkron dengan data di server');
            this.dataSharingService.refresh();
          } catch (error: any) {
            await this.loadingCtrl.dismiss();
            await showAlert(this.alertCtrl, 'Error!', error);
          }
        }
      },
      {
        text: 'Upload',
        handler: async () => {
          await alertSinkronData.dismiss();
          try {
            await showLoading(this.loadingCtrl, 'Loading...');
            await this.sinkronService.updateDataServer();
            await this.ngOnInit();
            await this.loadingCtrl.dismiss();
            await showAlert(this.alertCtrl, 'Berhasil!', 'Data di server sudah sinkron dengan data di aplikasi');
          } catch (error: any) {
            await this.loadingCtrl.dismiss();
            await showAlert(this.alertCtrl, 'Error!', error);
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
        text: 'OK',
        handler: async () => {
          await alertKeluar.dismiss();
          try {
            const token = await this.storageService.get('access_token');
            await showLoading(this.loadingCtrl, 'Loading...');
            await this.apiService.logoutAkun(token);
            await this.notificationService.cancelAllNotifications();
            await this.storageService.clear();
            await this.loadingCtrl.dismiss();
            await this.router.navigateByUrl('/login');
          } catch (error: any) {
            await this.loadingCtrl.dismiss();
            await showAlert(this.alertCtrl, 'Error!', error.error.message);
          }
        }
      },
      {
        text: 'Batal',
        role: 'cancel',
      }]
    });
    await alertKeluar.present();
  }
}
