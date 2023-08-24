import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { DataRefreshService } from 'src/app/services/Database/data-refresh.service';
import { formatDate, formatTime, showAlert, showLoading } from '../../../helpers/functions';
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
  isSearchBarang: boolean = false;
  isLoaded: boolean = false;
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
  optionsIconStatus: any = {
    Dibeli: 'location-sharp',
    Dijual: 'person-sharp',
    Disedekahkan: 'person-sharp',
    Diberikan: 'person-sharp',
    Dihadiahkan: 'person-sharp',
    Dibuang: 'location-sharp',
    Dipinjamkan: 'person-sharp',
    Diperbaiki: 'location-sharp',
    Dipindahkan: 'location-sharp',
    Dikembalikan: 'person-sharp',
    Diambil: 'location-sharp'
  }

  constructor(private alertCtrl: AlertController,
    private router: Router,
    private sqliteBarang: SQLiteBarang,
    private dataRefresh: DataRefreshService,
    private photo: PhotoService,
    private checkAkun: CheckAkunService,
    private loadingCtrl: LoadingController,) {
  }

  async ngOnInit() {
    await this.photo.initPermissions();
    this.isLoaded = false;
    await showLoading(this.loadingCtrl, 'Memuat data...');
    try {
      await this.checkAkun.initCheckDeviceLogin();
      await this.checkAkun.initCheckExpiredDataUpload();
    } catch (error) {
      await this.loadingCtrl.dismiss();
      return showAlert(this.alertCtrl, 'Error!', 'Periksa koneksi internet anda');
    }
    await this.initGetData();
    await this.loadingCtrl.dismiss();
    this.isLoaded = true;
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
      this.initGetData();
      this.isSearchBarang = false;
      return;
    }
    const data = await this.sqliteBarang.search(keyword);
    this.dataBarang = data;
    this.isSearchBarang = true;
  }

  async handleRefresh(event: any) {
    this.isLoaded = false;
    this.dataBarang = [];
    setTimeout(async () => {
      await event.target.complete();
      await this.ngOnInit();
    }, 1500);
  }
}
