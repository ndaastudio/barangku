import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, AnimationController } from '@ionic/angular';
import { DataRefreshService } from 'src/app/services/Database/data-refresh.service';
import { LocalNotifService } from 'src/app/services/App/local-notif.service';
import { BarangService as SQLiteBarang } from 'src/app/services/Database/SQLite/barang.service';
import { PhotoService } from 'src/app/services/App/photo.service';
import { getCurrentDateTime, showAlert } from 'src/app/helpers/functions';
import { LocalStorageService } from 'src/app/services/Database/local-storage.service';
import { INotification } from 'src/app/interfaces/i-notification';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  platform: any = null;
  id: any = this.route.snapshot.paramMap.get('id');
  dataBarang: any = [];
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
  otherImage: any = [];
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
  dataNotifikasi: INotification[] = [];
  id_notif: number = 0;

  constructor(private sqliteBarang: SQLiteBarang,
    private dataRefresh: DataRefreshService,
    private router: Router,
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private notif: LocalNotifService,
    private photo: PhotoService,
    private animationCtrl: AnimationController,
    private localStorage: LocalStorageService) {
  }

  async ngOnInit() {
    this.platform = await this.localStorage.get('os');
    const data = await this.sqliteBarang.getById(this.id);
    this.dataBarang = data;
    this.nama_barang = data.nama_barang;
    this.kategori = data.kategori;
    this.kategori_lainnya = data.kategori_lainnya;
    this.status = data.status;
    this.extend_status = data.extend_status;
    this.jumlah_barang = data.jumlah_barang;
    this.letak_barang = data.letak_barang;
    this.keterangan = data.keterangan;
    this.jadwal_rencana = data.jadwal_rencana;
    this.reminder = data.reminder;
    const dataNotif = await this.sqliteBarang.getNotifByIdBarang(this.id);
    this.dataNotifikasi = dataNotif;
    this.jadwal_notifikasi = this.dataNotifikasi[0].jadwal_notifikasi;
    this.id_notif = this.dataNotifikasi[0].id;
    const resultGambar = await this.sqliteBarang.getGambarById(this.id);
    resultGambar.forEach(async (data: any) => {
      this.dataImage.push(data.gambar);
    });
  }

  async saveToDatabase() {
    if (this.nama_barang && this.kategori && this.status && this.extend_status && this.jumlah_barang && this.letak_barang && this.jadwal_rencana && this.reminder) {
      this.dataBarang.nama_barang = this.nama_barang;
      this.dataBarang.kategori = this.kategori;
      this.dataBarang.kategori_lainnya = this.kategori_lainnya;
      this.dataBarang.status = this.status;
      this.dataBarang.extend_status = this.extend_status;
      this.dataBarang.jumlah_barang = this.jumlah_barang;
      this.dataBarang.letak_barang = this.letak_barang;
      this.dataBarang.keterangan = this.keterangan;
      this.dataBarang.jadwal_rencana = this.jadwal_rencana;
      this.dataBarang.reminder = this.reminder;
      const jadwalNotifikasi = this.reminder == 'Jadwal Rencana' ? this.jadwal_rencana : this.jadwal_notifikasi;
      const date = new Date(jadwalNotifikasi);
      const notifTime = date.getTime();
      const nowTime = new Date().getTime();
      // update notifikasi
      await this.notif.delete(this.id_notif);
      if (notifTime > nowTime) {
        await this.notif.create('1', 'Pengingat!', `Jangan lupa ${this.nama_barang.toLowerCase()} ${this.status.toLowerCase()}`, this.id_notif, new Date(date.getTime()), `/barang/show/${this.id}`);
      }
      // update database notifikasi
      let data_notif: INotification = {
        id: this.id_notif,
        id_barang: this.id,
        jadwal_notifikasi: jadwalNotifikasi,
      };
      await this.sqliteBarang.updateNotif(data_notif);
      // update barang
      await this.sqliteBarang.update(this.dataBarang);
      if (this.pickedPhoto) {
        this.otherImage.forEach(async (dataGambar: any) => {
          const date = new Date().getTime();
          const dataSave = await this.photo.save(dataGambar, `${this.nama_barang}-${date}.jpeg`);
          await this.sqliteBarang.createGambar(this.id, dataSave.fileName, dataSave.path);
        });
      }
      await this.router.navigateByUrl(`/barang/show/${this.id}`);
      this.dataRefresh.refresh();
    } else {
      showAlert(this.alertCtrl, 'Error!', 'Tidak boleh ada yang kosong');
    }
  }

  async pickGambar() {
    const data = await this.photo.capture();
    this.otherImage.push(data);
    this.pickedPhoto = true;
  }

  async deleteImageFromDatabase(index: number) {
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
          handler: async () => {
            await this.sqliteBarang.deleteGambarByName(this.dataImage[index].fileName);
            await this.photo.delete(this.dataImage[index].fileName);
            await this.dataImage.splice(index, 1);
          },
          cssClass: '!text-red-500'
        }
      ]
    });
    await alertDeleteImage.present();
  }

  async deleteImageFromArray(index: number) {
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
            this.otherImage.splice(index, 1);
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

  viewFull(isFull: boolean, index: number | undefined, pathSource: string | undefined) {
    this.isViewFull = isFull;
    if (index != undefined && pathSource != undefined) {
      this.urlFullImage = pathSource == 'webviewPath' ? this.dataImage[index].webviewPath : this.otherImage[index].webPath;
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

