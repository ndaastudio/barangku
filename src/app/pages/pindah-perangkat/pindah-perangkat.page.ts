import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { showAlert, showLoading } from 'src/app/helpers/functions';
import { SyncDataService } from 'src/app/services/App/sync-data.service';
import { DataRefreshService } from 'src/app/services/Database/data-refresh.service';
import { LocalStorageService } from 'src/app/services/Database/local-storage.service';

@Component({
  selector: 'app-pindah-perangkat',
  templateUrl: './pindah-perangkat.page.html',
  styleUrls: ['./pindah-perangkat.page.scss'],
})
export class PindahPerangkatPage implements OnInit {
  platform: any = null;

  constructor(private alertCtrl: AlertController,
    private sync: SyncDataService,
    private loadingCtrl: LoadingController,
    private dataRefresh: DataRefreshService,
    private localStorage: LocalStorageService) {
  }

  async ngOnInit() {
    this.platform = await this.localStorage.get('os');
  }

  async uploadData() {
    const alertUploadData = await this.alertCtrl.create({
      header: 'Upload Data',
      message: 'Lanjutkan untuk mengupload data?',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          cssClass: '!text-gray-500',
        },
        {
          text: 'Ya',
          handler: async () => {
            await alertUploadData.dismiss();
            try {
              await showLoading(this.loadingCtrl, 'Loading...');
              await this.sync.updateDataServer();
              await this.loadingCtrl.dismiss();
              await showAlert(this.alertCtrl, 'Berhasil!', 'Data telah diupload ke server');
            } catch (error: any) {
              await this.loadingCtrl.dismiss();
              await showAlert(this.alertCtrl, 'Error!', error.error.message);
            }
          }
        },
      ]
    });
    await alertUploadData.present();
  }

  async downloadData() {
    const alertDownloadData = await this.alertCtrl.create({
      header: 'Download Data',
      message: 'Lanjutkan untuk mendownload data?',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          cssClass: '!text-gray-500',
        },
        {
          text: 'Ya',
          handler: async () => {
            await alertDownloadData.dismiss();
            try {
              await showLoading(this.loadingCtrl, 'Loading...');
              await this.sync.updateDataLocal();
              await this.loadingCtrl.dismiss();
              await showAlert(this.alertCtrl, 'Berhasil!', 'Data telah didownload dari server');
              this.dataRefresh.refresh();
            } catch (error: any) {
              await this.loadingCtrl.dismiss();
              await showAlert(this.alertCtrl, 'Error!', error.error.message);
            }
          }
        },
      ]
    });
    await alertDownloadData.present();
  }
}
