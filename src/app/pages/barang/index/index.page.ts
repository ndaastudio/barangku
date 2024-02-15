import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { DataRefreshService } from 'src/app/services/Database/data-refresh.service';
import { formatDate, formatTime, showAlert, showLoading } from '../../../helpers/functions';
import { BarangService as SQLiteBarang } from 'src/app/services/Database/SQLite/barang.service';
import { PhotoService } from 'src/app/services/App/photo.service';
import { CheckAkunService } from 'src/app/services/App/check-akun.service';
import { LocalStorageService } from 'src/app/services/Database/local-storage.service';
import { LocalNotifService } from 'src/app/services/App/local-notif.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage implements OnInit {
  selectedKategori: any = [];
  selectedProgress: any = null;
  selectedWaktu: any = null;
  optionFilterKategori: any = [];
  optionFilterProgress: any = [0, 1];
  optionFilterWaktu: any = ['Notifikasi Terdekat', 'Notifikasi Terjauh', 'Baru Ditambahkan', 'Terlama Ditambahkan'];
  isOptionsFilterOpen: boolean = false;
  platform: any = null;
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
    private loadingCtrl: LoadingController,
    private localStorage: LocalStorageService,
    private notif: LocalNotifService,
    private modalCtrl: ModalController) {
  }

  async ngOnInit() {
    this.platform = await this.localStorage.get('os');
    await this.photo.initPermissions();
    this.isLoaded = false;
    await showLoading(this.loadingCtrl, 'Memuat data...');
    try {
      await this.checkAkun.initCheckDeviceLogin();
      await this.checkAkun.initCheckExpiredDataUpload();
    } catch (error: any) {
      await this.loadingCtrl.dismiss();
      if (error.status == 401) {
        await this.localStorage.clear();
        await this.notif.deleteAll();
        return showAlert(this.alertCtrl, 'Error!', 'Sesi anda telah berakhir, silahkan login kembali').then(() => {
          this.router.navigateByUrl('/login');
        });
      }
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
    this.optionFilterKategori = this.dataBarang.map((barang: any) => barang.kategori).filter((value: any, index: any, self: any) => self.indexOf(value) === index);
  }

  async confirmFilterOptions() {
    this.modalCtrl.dismiss();
    if (this.selectedKategori.length == 0 && this.selectedProgress == null && this.selectedWaktu == null) {
      this.initGetData();
      return;
    }
    const data = await this.sqliteBarang.multipleFilter(this.selectedKategori, this.selectedProgress, this.selectedWaktu);
    this.dataBarang = data;
    this.isSearchBarang = true;
  }

  handlePilihKategori(value: string) {
    if (this.selectedKategori.includes(value)) {
      this.selectedKategori = this.selectedKategori.filter((kategori: string) => kategori !== value);
    } else {
      this.selectedKategori.push(value);
    }
  }

  handlePilihProgress(value: string) {
    if (this.selectedProgress === value) {
      this.selectedProgress = null;
      return;
    }
    this.selectedProgress = value;
  }

  handlePilihWaktu(value: string) {
    if (this.selectedWaktu === value) {
      this.selectedWaktu = null;
      return;
    }
    this.selectedWaktu = value;
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

  setOpenOptionsFilter(isOpen: boolean) {
    this.isOptionsFilterOpen = isOpen;
  }

  onWillDismissModal(isOpen: boolean) {
    this.isOptionsFilterOpen = isOpen;
  }
}
