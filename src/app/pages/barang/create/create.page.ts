import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AnimationController } from '@ionic/angular';
import { getCurrentDateTime, showAlert } from 'src/app/helpers/functions';
import { CheckUpdateService } from 'src/app/services/App/check-update.service';
import { LocalNotifService } from 'src/app/services/App/local-notif.service';
import { PhotoService } from 'src/app/services/App/photo.service';
import { BarangService as SQLiteBarang } from 'src/app/services/Database/SQLite/barang.service';
import { DataRefreshService } from 'src/app/services/Database/data-refresh.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class TambahBarangPage implements OnInit {
  nama_barang: any;
  kategori: any;
  kategori_lainnya: any;
  status: any;
  extend_status: any;
  jumlah_barang: any;
  letak_barang: any;
  keterangan: any;
  jadwal_rencana: any;
  jadwal_notifikasi: any;
  reminder: any;
  pickedPhoto: boolean = false;
  dataImage: any = [];
  isViewFull: boolean = false;
  urlFullImage: any;
  getToday: string = getCurrentDateTime();

  constructor(private sqliteBarang: SQLiteBarang,
    private alertCtrl: AlertController,
    private router: Router,
    private dataRefresh: DataRefreshService,
    private photo: PhotoService,
    private notif: LocalNotifService,
    private animationCtrl: AnimationController,
    private checkUpdate: CheckUpdateService) {
  }

  ngOnInit() {
  }

  async saveToDatabase() {
    if (this.nama_barang && this.kategori && this.status && this.extend_status && this.jumlah_barang && this.letak_barang && this.jadwal_rencana && this.reminder) {
      try {
        const isUpdate = await this.checkUpdate.isUpdate();
        const data = {
          nama_barang: this.nama_barang,
          kategori: this.kategori == 'Opsi Lainnya' ? this.kategori_lainnya : this.kategori,
          status: this.status,
          extend_status: this.status == 'Dibuang' ? 'ke ' : (this.status == 'Dibeli' ? 'di ' : 'kepada ') + this.extend_status,
          jumlah_barang: this.jumlah_barang,
          letak_barang: this.letak_barang,
          keterangan: this.keterangan,
          jadwal_rencana: this.jadwal_rencana,
          jadwal_notifikasi: this.reminder == 'Jadwal Rencana' ? this.jadwal_rencana : this.jadwal_notifikasi,
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
        await this.notif.create('1', 'Pengingat!', `Jangan lupa ${this.nama_barang.toLowerCase()} ${this.status.toLowerCase()}`, idBarang, new Date(date.getTime()), `/barang/show/${idBarang}`);
        this.nama_barang = '';
        this.kategori = '';
        this.status = '';
        this.extend_status = '';
        this.jumlah_barang = '';
        this.letak_barang = '';
        this.keterangan = '';
        this.jadwal_rencana = '';
        this.reminder = '';
        this.jadwal_notifikasi = '';
        this.pickedPhoto = false;
        this.dataImage = [];
        if (isUpdate) {
          await this.router.navigateByUrl('/update');
        } else {
          await this.router.navigateByUrl('/tabs/barang');
        }
        this.dataRefresh.refresh();
      } catch (error: any) {
        showAlert(this.alertCtrl, 'Error!', error);
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
    const maxLength = 30 - 1;
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
    const maxLength = 30 - 1;
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
