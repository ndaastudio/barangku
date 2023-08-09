import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, AnimationController } from '@ionic/angular';
import { DataRefreshService } from 'src/app/services/Database/data-refresh.service';
import { LocalNotifService } from 'src/app/services/App/local-notif.service';
import { PhotoService } from 'src/app/services/App/photo.service';
import { JasaService as SQLiteJasa } from 'src/app/services/Database/SQLite/jasa.service';
import { getCurrentDateTime } from 'src/app/helpers/functions';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  id: any = this.route.snapshot.paramMap.get('id');
  dataJasa: any = [];
  nama_jasa: any = null;
  kategori: any = null;
  kategori_lainnya: any = null;
  jumlah_jasa: any = null;
  letak_jasa: any = null;
  keterangan: any = null;
  jadwal_rencana: any = null;
  jadwal_notifikasi: any = null;
  reminder: any = null;
  pickedPhoto: boolean = false;
  dataImage: any = [];
  otherImage: any = [];
  isViewFull: boolean = false;
  urlFullImage: any = null;
  getToday: string = getCurrentDateTime();

  constructor(private sqliteJasa: SQLiteJasa,
    private dataRefresh: DataRefreshService,
    private router: Router,
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private notif: LocalNotifService,
    private photo: PhotoService,
    private animationCtrl: AnimationController,) {
  }

  async ngOnInit() {
    const data = await this.sqliteJasa.getById(this.id);
    this.dataJasa = data;
    this.nama_jasa = data.nama_jasa;
    this.kategori = data.kategori;
    this.kategori_lainnya = data.kategori_lainnya;
    this.jumlah_jasa = data.jumlah_jasa;
    this.letak_jasa = data.letak_jasa;
    this.keterangan = data.keterangan;
    this.jadwal_rencana = data.jadwal_rencana;
    this.jadwal_notifikasi = data.jadwal_notifikasi;
    this.reminder = data.reminder;
    const resultGambar = await this.sqliteJasa.getGambarById(this.id);
    resultGambar.forEach(async (data: any) => {
      const loadedGambar = await this.photo.load(data.gambar);
      this.dataImage.push(loadedGambar);
    });
  }

  async saveToDatabase() {
    if (this.jadwal_notifikasi !== this.dataJasa.jadwal_notifikasi) {
      const jadwalNotifikasi = this.reminder == 'Jadwal Rencana' ? this.jadwal_rencana : this.jadwal_notifikasi;
      const date = new Date(jadwalNotifikasi);
      await this.notif.delete(this.id);
      await this.notif.create('2', 'Pengingat!', `Jangan lupa ${this.nama_jasa.toLowerCase()}`, this.id, new Date(date.getTime()), `/jasa/show/${this.id}`);
    }
    this.dataJasa.nama_jasa = this.nama_jasa;
    this.dataJasa.kategori = this.kategori;
    this.dataJasa.kategori_lainnya = this.kategori_lainnya;
    this.dataJasa.jumlah_jasa = this.jumlah_jasa;
    this.dataJasa.letak_jasa = this.letak_jasa;
    this.dataJasa.keterangan = this.keterangan;
    this.dataJasa.jadwal_rencana = this.jadwal_rencana;
    this.dataJasa.jadwal_notifikasi = this.reminder == 'Jadwal Rencana' ? this.jadwal_rencana : this.jadwal_notifikasi;
    this.dataJasa.reminder = this.reminder;
    await this.sqliteJasa.update(this.dataJasa);
    if (this.pickedPhoto) {
      this.otherImage.forEach(async (dataGambar: any) => {
        const date = new Date().getTime();
        const dataSave = await this.photo.save(dataGambar, `${this.nama_jasa}-${date}.jpeg`);
        await this.sqliteJasa.createGambar(this.id, dataSave);
      });
    }
    await this.router.navigateByUrl(`/jasa/show/${this.id}`);
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
            await this.sqliteJasa.deleteGambarByName(this.dataImage[index].fileName);
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
    const inputLength = this.nama_jasa.length;
    if (inputLength > maxLength) {
      this.nama_jasa = this.nama_jasa.slice(0, maxLength);
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
    const inputLength = this.jumlah_jasa.length;
    if (inputLength > maxLength) {
      this.jumlah_jasa = this.jumlah_jasa.slice(0, maxLength);
    }
  }
  countInputLetak() {
    const maxLength = 30 - 1;
    const inputLength = this.letak_jasa.length;
    if (inputLength > maxLength) {
      this.letak_jasa = this.letak_jasa.slice(0, maxLength);
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
