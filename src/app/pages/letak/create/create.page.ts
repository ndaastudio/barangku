import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/services/Database/local-storage.service';
import { Router } from '@angular/router';
import { AlertController, AnimationController, LoadingController } from '@ionic/angular';
import { getCurrentDateTime, showAlert, showLoading } from 'src/app/helpers/functions';
import { CheckAkunService } from 'src/app/services/App/check-akun.service';
import { CheckUpdateService } from 'src/app/services/App/check-update.service';
import { PhotoService } from 'src/app/services/App/photo.service';
import { LetakService as SQLiteLetakBarang } from 'src/app/services/Database/SQLite/letak.service';
import { DataRefreshService } from 'src/app/services/Database/data-refresh.service';

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
  jumlah_barang: any = null;
  letak_barang: any = null;
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

  constructor(private sqliteLetakBarang: SQLiteLetakBarang,
    private alertCtrl: AlertController,
    private router: Router,
    private dataRefresh: DataRefreshService,
    private photo: PhotoService,
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
    if (this.nama_barang && this.kategori && this.jumlah_barang && this.letak_barang) {
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
          jumlah_barang: this.jumlah_barang,
          letak_barang: this.letak_barang,
        };
        const idBarang = await this.sqliteLetakBarang.create(data);
        if (this.pickedPhoto) {
          this.dataImage.forEach(async (dataGambar: any) => {
            const date = new Date().getTime();
            const dataSave = await this.photo.save(dataGambar, `${this.nama_barang}-${date}.jpeg`);
            await this.sqliteLetakBarang.createGambar(idBarang, dataSave.fileName, dataSave.path);
          });
        }
        this.nama_barang = null;
        this.kategori = null;
        this.kategori_lainnya = null;
        this.jumlah_barang = null;
        this.letak_barang = null;
        this.pickedPhoto = false;
        this.dataImage = [];
        await this.loadingCtrl.dismiss();
        await this.router.navigateByUrl('/tabs/letak');
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
