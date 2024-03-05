import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, AnimationController } from '@ionic/angular';
import { DataRefreshService } from 'src/app/services/Database/data-refresh.service';
import { LetakService as SQLiteLetakBarang } from 'src/app/services/Database/SQLite/letak.service';
import { PhotoService } from 'src/app/services/App/photo.service';
import { getCurrentDateTime, showAlert } from 'src/app/helpers/functions';
import { LocalStorageService } from 'src/app/services/Database/local-storage.service';

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
  jumlah_barang: any = null;
  letak_barang: any = null;
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

  constructor(private sqliteLetakBarang: SQLiteLetakBarang,
    private dataRefresh: DataRefreshService,
    private router: Router,
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private photo: PhotoService,
    private animationCtrl: AnimationController,
    private localStorage: LocalStorageService) {
  }

  async ngOnInit() {
    this.platform = await this.localStorage.get('os');
    const data = await this.sqliteLetakBarang.getById(this.id);
    this.dataBarang = data;
    this.nama_barang = data.nama_barang;
    this.kategori = data.kategori;
    this.kategori_lainnya = data.kategori_lainnya;
    this.jumlah_barang = data.jumlah_barang;
    this.letak_barang = data.letak_barang;
    const resultGambar = await this.sqliteLetakBarang.getGambarById(this.id);
    resultGambar.forEach(async (data: any) => {
      this.dataImage.push({ fileName: data.fileName, url: data.url });
    });
  }

  async saveToDatabase() {
    if (this.nama_barang && this.kategori && this.jumlah_barang && this.letak_barang) {
      this.dataBarang.nama_barang = this.nama_barang;
      this.dataBarang.kategori = this.kategori;
      this.dataBarang.kategori_lainnya = this.kategori_lainnya;
      this.dataBarang.jumlah_barang = this.jumlah_barang;
      this.dataBarang.letak_barang = this.letak_barang;
      await this.sqliteLetakBarang.update(this.dataBarang);
      if (this.pickedPhoto) {
        this.otherImage.forEach(async (dataGambar: any) => {
          const date = new Date().getTime();
          const dataSave = await this.photo.save(dataGambar, `${this.nama_barang}-${date}.jpeg`);
          await this.sqliteLetakBarang.createGambar(this.id, dataSave.fileName, dataSave.url);
        });
      }
      await this.router.navigateByUrl(`/letak/show/${this.id}`);
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
            await this.sqliteLetakBarang.deleteGambarByName(this.dataImage[index].fileName);
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
      this.urlFullImage = pathSource == 'webviewPath' ? this.dataImage[index].url : this.otherImage[index].webPath;
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
