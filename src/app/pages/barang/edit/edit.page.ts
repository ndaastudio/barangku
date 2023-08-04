import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, AnimationController } from '@ionic/angular';
import { DataRefreshService } from 'src/app/services/Database/data-refresh.service';
import { LocalNotifService } from 'src/app/services/App/local-notif.service';
import { BarangService as SQLiteBarang } from 'src/app/services/Database/SQLite/barang.service';
import { PhotoService } from 'src/app/services/App/photo.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  id: any = this.route.snapshot.paramMap.get('id');
  dataBarang: any = [];
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
  otherImage: any = [];
  isViewFull: boolean = false;
  urlFullImage: any;

  constructor(private sqliteBarang: SQLiteBarang,
    private dataRefresh: DataRefreshService,
    private router: Router,
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private notif: LocalNotifService,
    private photo: PhotoService,
    private animationCtrl: AnimationController,) {
  }

  async ngOnInit() {
    const data = await this.sqliteBarang.getById(this.id);
    this.dataBarang = data;
    const resultGambar = await this.sqliteBarang.getGambarById(this.id);
    resultGambar.forEach(async (data: any) => {
      const loadedGambar = await this.photo.load(data.gambar);
      this.dataImage.push(loadedGambar);
    });
  }

  async saveToDatabase() {
    if (this.jadwal_notifikasi !== this.dataBarang.jadwal_notifikasi) {
      const jadwalNotifikasi = this.reminder == 'Jadwal Rencana' ? this.jadwal_rencana : this.jadwal_notifikasi;
      const date = new Date(jadwalNotifikasi);
      await this.notif.delete(this.id);
      await this.notif.create('1', 'Pengingat!', `Jangan lupa ${this.nama_barang.toLowerCase()} ${this.status.toLowerCase()}`, this.id, new Date(date.getTime()), `/barang/show/${this.id}`);
    }
    this.dataBarang.nama_barang = this.nama_barang;
    this.dataBarang.kategori = this.kategori == 'Opsi Lainnya' ? this.kategori_lainnya : this.kategori;
    this.dataBarang.status = this.status;
    this.dataBarang.extend_status = this.status == 'Dibuang' ? 'ke ' : (this.status == 'Dibeli' ? 'di ' : 'kepada ') + this.extend_status;
    this.dataBarang.jumlah_barang = this.jumlah_barang;
    this.dataBarang.letak_barang = this.letak_barang;
    this.dataBarang.keterangan = this.keterangan;
    this.dataBarang.jadwal_rencana = this.jadwal_rencana;
    this.dataBarang.jadwal_notifikasi = this.reminder == 'Jadwal Rencana' ? this.jadwal_rencana : this.jadwal_notifikasi;
    await this.sqliteBarang.update(this.dataBarang);
    if (this.pickedPhoto) {
      this.otherImage.forEach(async (dataGambar: any) => {
        const date = new Date().getTime();
        const dataSave = await this.photo.save(dataGambar, `${this.nama_barang}-${date}.jpeg`);
        await this.sqliteBarang.createGambar(this.id, dataSave);
      });
    }
    await this.router.navigateByUrl(`/barang/show/${this.id}`);
    this.dataRefresh.refresh();
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

