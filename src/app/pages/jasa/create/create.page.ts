import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AnimationController } from '@ionic/angular';
import { DataRefreshService } from 'src/app/services/Database/data-refresh.service';
import { LocalNotifService } from 'src/app/services/App/local-notif.service';
import { JasaService as SQLiteJasa } from 'src/app/services/Database/SQLite/jasa.service';
import { PhotoService } from 'src/app/services/App/photo.service';
import { showAlert } from 'src/app/helpers/functions';
import { CheckUpdateService } from 'src/app/services/App/check-update.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class TambahJasaPage implements OnInit {
  nama_jasa: any;
  kategori: any;
  kategori_lainnya: any;
  jumlah_jasa: any;
  letak_jasa: any;
  keterangan: any;
  jadwal_rencana: any;
  jadwal_notifikasi: any;
  reminder: any;
  pickedPhoto: boolean = false;
  dataImage: any = [];
  isViewFull: boolean = false;
  urlFullImage: any;

  constructor(private sqliteJasa: SQLiteJasa,
    private alertCtrl: AlertController,
    private router: Router,
    private dataRefresh: DataRefreshService,
    private notif: LocalNotifService,
    private photo: PhotoService,
    private animationCtrl: AnimationController,
    private checkUpdate: CheckUpdateService) {
  }

  ngOnInit() {
  }

  async saveToDatabase() {
    if (this.nama_jasa && this.kategori && this.jumlah_jasa && this.letak_jasa && this.keterangan && this.jadwal_rencana && this.reminder) {
      try {
        const isUpdate = await this.checkUpdate.isUpdate();
        const data = {
          nama_jasa: this.nama_jasa,
          kategori: this.kategori == 'Opsi Lainnya' ? this.kategori_lainnya : this.kategori,
          jumlah_jasa: this.jumlah_jasa,
          letak_jasa: this.letak_jasa,
          keterangan: this.keterangan,
          jadwal_rencana: this.jadwal_rencana,
          jadwal_notifikasi: this.reminder == 'Jadwal Rencana' ? this.jadwal_rencana : this.jadwal_notifikasi,
        };
        const idJasa = await this.sqliteJasa.create(data);
        if (this.pickedPhoto) {
          this.dataImage.forEach(async (dataGambar: any) => {
            const date = new Date().getTime();
            const dataSave = await this.photo.save(dataGambar, `${this.nama_jasa}-${date}.jpeg`);
            await this.sqliteJasa.createGambar(idJasa, dataSave);
          });
        }
        const date = new Date(data.jadwal_notifikasi);
        await this.notif.create('2', 'Pengingat!', `Jangan lupa ${this.nama_jasa.toLowerCase()}`, idJasa, new Date(date.getTime()), `/jasa/show/${idJasa}`);
        this.nama_jasa = '';
        this.kategori = '';
        this.jumlah_jasa = '';
        this.letak_jasa = '';
        this.keterangan = '';
        this.jadwal_rencana = '';
        this.reminder = '';
        this.jadwal_notifikasi = '';
        this.pickedPhoto = false;
        this.dataImage = [];
        if (isUpdate) {
          await this.router.navigateByUrl('/update');
        } else {
          await this.router.navigateByUrl('/tabs/jasa');
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
        },
        {
          text: 'Ya',
          handler: () => {
            this.dataImage.splice(index, 1);
          }
        }
      ]
    });
    await alertDeleteImage.present();
  }

  customCounterFormatter(inputLength: number, maxLength: number) {
    return `${maxLength - inputLength} karakter tersisa`;
  }

  countInputNama() {
    const maxLength = 15 - 1;
    const inputLength = this.nama_jasa.length;
    if (inputLength > maxLength) {
      this.nama_jasa = this.nama_jasa.slice(0, maxLength);
    }
  }
  countInputKategori() {
    const maxLength = 15 - 1;
    const inputLength = this.kategori_lainnya.length;
    if (inputLength > maxLength) {
      this.kategori_lainnya = this.kategori_lainnya.slice(0, maxLength);
    }
  }
  countInputJumlah() {
    const maxLength = 10 - 1;
    const inputLength = this.jumlah_jasa.length;
    if (inputLength > maxLength) {
      this.jumlah_jasa = this.jumlah_jasa.slice(0, maxLength);
    }
  }
  countInputLetak() {
    const maxLength = 15 - 1;
    const inputLength = this.letak_jasa.length;
    if (inputLength > maxLength) {
      this.letak_jasa = this.letak_jasa.slice(0, maxLength);
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