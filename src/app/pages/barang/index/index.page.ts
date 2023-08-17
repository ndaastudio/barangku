import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DataRefreshService } from 'src/app/services/Database/data-refresh.service';
import { formatDate, formatTime, showAlert } from '../../../helpers/functions';
import { BarangService as SQLiteBarang } from 'src/app/services/Database/SQLite/barang.service';
import { PhotoService } from 'src/app/services/App/photo.service';
import { CheckAkunService } from 'src/app/services/App/check-akun.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage implements OnInit {
  dataBarang: any = [];
  formatTanggal: Function = formatDate;
  formatJam: Function = formatTime;
  optionsKategori: any = [
    'Fashion',
    'Kuliner',
    'Elektronik',
    'Kesehatan',
    'Olahraga',
    'Otomotif',
    'Kecantikan',
    'Pendidikan',
    'Peralatan',
    'Office',
  ].sort();

  constructor(private alertCtrl: AlertController,
    private router: Router,
    private sqliteBarang: SQLiteBarang,
    private dataRefresh: DataRefreshService,
    private photo: PhotoService,
    private checkAkun: CheckAkunService) {
    this.checkAkun.initCheckExpiredAkun();
    this.checkAkun.initCheckDeviceLogin();
    this.checkAkun.initCheckExpiredDataUpload();
  }

  ngOnInit() {
    this.photo.initPermissions();
    this.initGetData();
    this.dataRefresh.refreshedData.subscribe(() => {
      this.initGetData();
    });
  }

  async initGetData() {
    const data = await this.sqliteBarang.getAll();
    this.dataBarang = data;
  }

  async showKategori() {
    const alertShowKategori = await this.alertCtrl.create({
      header: 'Pilih Kategori',
      inputs: this.optionsKategori.map((kategori: any) => {
        return {
          name: 'kategori',
          type: 'radio',
          label: kategori,
          value: kategori
        }
      }),
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          cssClass: '!text-gray-500'
        },
        {
          text: 'Pilih',
          handler: async (dataOpsi) => {
            if (dataOpsi) {
              const data = await this.sqliteBarang.getByKategori(dataOpsi);
              if (data?.length == 0) {
                showAlert(this.alertCtrl, 'Error!', `Tidak ada barang dengan kategori "${dataOpsi}"`);
              } else {
                this.dataBarang = data;
              }
            } else {
              const data = await this.sqliteBarang.getAll();
              this.dataBarang = data;
            }
          }
        }
      ]
    });
    alertShowKategori.present();
  }

  goToTambahBarang() {
    this.router.navigateByUrl('/barang/create');
  }

  goToShowBarang(id: number) {
    this.router.navigateByUrl(`/barang/show/${id}`);
  }

  async onSearchBarang(event: any) {
    const keyword = event.target.value;
    if (keyword.length == 0) {
      const data = await this.sqliteBarang.getAll();
      this.dataBarang = data;
      return;
    }
    const data = await this.sqliteBarang.search(keyword);
    this.dataBarang = data;
  }
}
