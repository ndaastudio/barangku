import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AnimationController, LoadingController } from '@ionic/angular';
import { getCurrentDateTime, showAlert, showLoading } from 'src/app/helpers/functions';
import { CheckAkunService } from 'src/app/services/App/check-akun.service';
import { CheckUpdateService } from 'src/app/services/App/check-update.service';
import { LocalNotifService } from 'src/app/services/App/local-notif.service';
import { PhotoService } from 'src/app/services/App/photo.service';
import { BarangService as SQLiteBarang } from 'src/app/services/Database/SQLite/barang.service';
import { DataRefreshService } from 'src/app/services/Database/data-refresh.service';
import { LocalStorageService } from 'src/app/services/Database/local-storage.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
  platform: any = null;
  nama_barang: any = null;
  kategori: any = null;
  kategori_lainnya: any = null;
  status: any = null;
  extend_status: any = null;
  jumlah_barang: any = null;
  letak_barang: any = null;
  keterangan: any = null;
  jadwal_rencana: any = null;
  jadwal_notifikasi: any = null;
  reminder: any = null;
  pickedPhoto: boolean = false;
  dataImage: any = [];
  isViewFull: boolean = false;
  urlFullImage: any;
  getToday: string = getCurrentDateTime();
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
  optionsStatus: any = [
    'Dibeli',
    'Dijual',
    'Disedekahkan',
    'Diberikan',
    'Dihadiahkan',
    'Dibuang',
    'Dipinjamkan',
    'Diperbaiki',
    'Dipindahkan',
    'Dikembalikan',
    'Diambil'
  ].sort();
  optionsExtendStatus: any = {
    Dibeli: 'dimana',
    Dijual: 'kepada siapa',
    Disedekahkan: 'kepada siapa',
    Diberikan: 'kepada siapa',
    Dihadiahkan: 'kepada siapa',
    Dibuang: 'kemana',
    Dipinjamkan: 'kepada siapa',
    Diperbaiki: 'dimana',
    Dipindahkan: 'kemana',
    Dikembalikan: 'kepada siapa',
    Diambil: 'dimana'
  }
  optionsLetak: any = {
    Dibeli: 'Akan diletakkan dimana',
    Dijual: 'Letak barang saat ini',
    Disedekahkan: 'Letak barang saat ini',
    Diberikan: 'Letak barang saat ini',
    Dihadiahkan: 'Letak barang saat ini',
    Dibuang: 'Letak barang saat ini',
    Dipinjamkan: 'Letak barang saat ini',
    Diperbaiki: 'Letak barang saat ini',
    Dipindahkan: 'Letak barang saat ini',
    Dikembalikan: 'Letak barang saat ini',
    Diambil: 'Akan diambil dimana'
  }

  constructor(private sqliteBarang: SQLiteBarang,
    private alertCtrl: AlertController,
    private router: Router,
    private dataRefresh: DataRefreshService,
    private photo: PhotoService,
    private notif: LocalNotifService,
    private animationCtrl: AnimationController,
    private checkUpdate: CheckUpdateService,
    private checkAkun: CheckAkunService,
    private loadingCtrl: LoadingController,
    private localStorage: LocalStorageService) {
  }

  async ngOnInit() {
    this.platform = await this.localStorage.get('os');
  }

  async saveToDatabase() {
    if (this.nama_barang && this.kategori && this.status && this.extend_status && this.jumlah_barang && this.letak_barang && this.jadwal_rencana && this.reminder) {
      await showLoading(this.loadingCtrl, 'Loading...');
      try {
        const isUpdate = await this.checkUpdate.isUpdate();
        if (isUpdate) {
          await this.loadingCtrl.dismiss();
          await this.router.navigateByUrl('/update');
          return;
        }
        const isExpiredAkun = await this.checkAkun.initCheckExpiredAkun();
        if (isExpiredAkun) {
          await this.loadingCtrl.dismiss();
          await this.router.navigateByUrl('/login');
          await showAlert(this.alertCtrl, 'Error!', 'Akun anda telah expired, silahkan hubungi admin');
          return;
        }
      } catch (error) {
        await this.loadingCtrl.dismiss();
        return showAlert(this.alertCtrl, 'Error!', 'Periksa koneksi internet anda');
      }
      try {
        const data = {
          nama_barang: this.nama_barang,
          kategori: this.kategori,
          kategori_lainnya: this.kategori_lainnya,
          status: this.status,
          extend_status: this.extend_status,
          jumlah_barang: this.jumlah_barang,
          letak_barang: this.letak_barang,
          keterangan: this.keterangan,
          jadwal_rencana: this.jadwal_rencana,
          jadwal_notifikasi: this.reminder == 'Jadwal Rencana' ? this.jadwal_rencana : this.jadwal_notifikasi,
          reminder: this.reminder
        };
        const idBarang = await this.sqliteBarang.create(data);
        if (this.pickedPhoto) {
          this.dataImage.forEach(async (dataGambar: any) => {
            const date = new Date().getTime();
            const dataSave = await this.photo.save(dataGambar, `${this.nama_barang}-${date}.jpeg`);
            await this.sqliteBarang.createGambar(idBarang, dataSave);
          });
        }
        const date = new Date(data.jadwal_notifikasi);
        const notifTime = date.getTime();
        const nowTime = new Date().getTime();
        if (notifTime > nowTime) {
          await this.notif.create('1', 'Pengingat!', `Jangan lupa ${data.nama_barang.toLowerCase()} ${data.status.toLowerCase()}`, idBarang, new Date(date.getTime()), `/barang/show/${idBarang}`).then(() => {
            this.nama_barang = null;
            this.kategori = null;
            this.kategori_lainnya = null;
            this.status = null;
            this.extend_status = null;
            this.jumlah_barang = null;
            this.letak_barang = null;
            this.keterangan = null;
            this.jadwal_rencana = null;
            this.jadwal_notifikasi = null;
            this.reminder = null;
            this.pickedPhoto = false;
            this.dataImage = [];
          });
        }
        await this.loadingCtrl.dismiss();
        await this.router.navigateByUrl('/tabs/barang');
        this.dataRefresh.refresh();
      } catch (error: any) {
        await this.loadingCtrl.dismiss();
        showAlert(this.alertCtrl, 'Error!', error.message);
      }
    } else {
      showAlert(this.alertCtrl, 'Error!', 'Tidak boleh ada yang kosong');
    }
  }

  async pickGambar() {
    const data = await this.photo.capture();
    this.dataImage.push(data);
    this.pickedPhoto = true;
  }

  async deleteImage(index: number) {
    const alertDeleteImage = await this.alertCtrl.create({
      header: 'Hapus',
      message: 'Apakah anda yakin ingin menghapus gambar ini?',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          cssClass: '!text-gray-500'
        },
        {
          text: 'Ya',
          handler: () => {
            this.dataImage.splice(index, 1);
          },
          cssClass: '!text-red-500'
        }
      ]
    });
    await alertDeleteImage.present();
  }

  customCounterFormatter(inputLength: number, maxLength: number) {
    return `${maxLength - inputLength} karakter tersisa`;
  }

  countInputNama() {
    const maxLength = 50 - 1;
    const inputLength = this.nama_barang.length;
    if (inputLength > maxLength) {
      this.nama_barang = this.nama_barang.slice(0, maxLength);
    }
  }
  countInputKategori() {
    const maxLength = 30 - 1;
    const inputLength = this.kategori_lainnya.length;
    if (inputLength > maxLength) {
      this.kategori_lainnya = this.kategori_lainnya.slice(0, maxLength);
    }
  }
  countInputStatus() {
    const maxLength = 50 - 1;
    const inputLength = this.extend_status.length;
    if (inputLength > maxLength) {
      this.extend_status = this.extend_status.slice(0, maxLength);
    }
  }
  countInputJumlah() {
    const maxLength = 30 - 1;
    const inputLength = this.jumlah_barang.length;
    if (inputLength > maxLength) {
      this.jumlah_barang = this.jumlah_barang.slice(0, maxLength);
    }
  }
  countInputLetak() {
    const maxLength = 50 - 1;
    const inputLength = this.letak_barang.length;
    if (inputLength > maxLength) {
      this.letak_barang = this.letak_barang.slice(0, maxLength);
    }
  }

  viewFull(isFull: boolean, index: number | undefined) {
    this.isViewFull = isFull;
    if (index != undefined) {
      this.urlFullImage = this.dataImage[index].webPath;
    }
  }

  enterAnimation = (baseEl: HTMLElement) => {
    const root = baseEl.shadowRoot;
    const backdropAnimation = this.animationCtrl
      .create()
      .addElement(root?.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');
    const wrapperAnimation = this.animationCtrl
      .create()
      .addElement(root?.querySelector('.modal-wrapper')!)
      .keyframes([
        { offset: 0, opacity: '0', transform: 'scale(0)' },
        { offset: 1, opacity: '0.99', transform: 'scale(1)' },
      ]);
    return this.animationCtrl
      .create()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(300)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  leaveAnimation = (baseEl: HTMLElement) => {
    return this.enterAnimation(baseEl).direction('reverse');
  };
}
