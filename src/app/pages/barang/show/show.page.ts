import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, AnimationController, PopoverController } from '@ionic/angular';
import { formatDate } from 'src/app/helpers/functions';
import { DataRefreshService } from 'src/app/services/Database/data-refresh.service';
import { LocalNotifService } from 'src/app/services/App/local-notif.service';
import { BarangService as SQLiteBarang } from 'src/app/services/Database/SQLite/barang.service';
import { PhotoService } from 'src/app/services/App/photo.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.page.html',
  styleUrls: ['./show.page.scss'],
})
export class ShowBarangPage implements OnInit {
  id: any = this.route.snapshot.paramMap.get('id');
  dataBarang: any = [];
  dataImage: any = [];
  isViewFull: boolean = false;
  urlFullImage: any;
  formatTanggal: Function = formatDate;

  constructor(private sqliteBarang: SQLiteBarang,
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private dataRefresh: DataRefreshService,
    private router: Router,
    private popoverCtrl: PopoverController,
    private notif: LocalNotifService,
    private photo: PhotoService,
    private animationCtrl: AnimationController,) {
  }

  ngOnInit() {
    this.initGetData();
    this.dataRefresh.refreshedData.subscribe(() => {
      this.initGetData();
    });
  }

  async initGetData() {
    const data = await this.sqliteBarang.getById(this.id);
    this.dataBarang = data;
    const resultGambar = await this.sqliteBarang.getGambarById(this.id);
    this.dataImage = [];
    resultGambar.forEach(async (data: any) => {
      const loadedGambar = await this.photo.load(data.gambar);
      this.dataImage.push(loadedGambar);
    });
  }

  async hapusData() {
    this.popoverCtrl.dismiss();
    const alertHapusData = await this.alertCtrl.create({
      header: 'Konfirmasi',
      message: 'Anda yakin ingin menghapus data ini?',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          cssClass: '!text-gray-500'
        },
        {
          text: 'Ya',
          handler: async () => {
            await this.sqliteBarang.deleteById(this.id);
            this.dataImage.forEach(async (dataGambar: any) => {
              await this.photo.delete(dataGambar.fileName);
              await this.sqliteBarang.deleteGambarByName(dataGambar.fileName);
            });
            await this.notif.delete(this.id);
            await this.router.navigateByUrl('/tabs/barang');
            this.dataRefresh.refresh();
          },
          cssClass: '!text-red-500'
        }
      ]
    });
    await alertHapusData.present();
  }

  async ubahProgress() {
    this.popoverCtrl.dismiss();
    const alertUbahProgress = await this.alertCtrl.create({
      header: 'Ubah Progress',
      inputs: [
        {
          name: 'progress',
          type: 'radio',
          label: 'Belum',
          value: 0,
          checked: this.dataBarang.progress == 0 ? true : false
        },
        {
          name: 'progress',
          type: 'radio',
          label: 'Selesai',
          value: 1,
          checked: this.dataBarang.progress == 1 ? true : false
        }
      ],
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          cssClass: '!text-gray-500'
        },
        {
          text: 'Pilih',
          handler: async (dataOpsi) => {
            this.dataBarang.progress = dataOpsi;
            await this.sqliteBarang.update(this.dataBarang);
            if (dataOpsi == 0) {
              let date = new Date(this.dataBarang.jadwal_notifikasi);
              await this.notif.delete(this.id);
              await this.notif.create('1', 'Pengingat!', `Jangan lupa ${this.dataBarang.nama_barang.toLowerCase()} ${this.dataBarang.status.toLowerCase()}`, this.id, new Date(date.getTime()), `/barang/show/${this.id}`);
            } else if (dataOpsi == 1) {
              await this.notif.delete(this.id);
            }
            this.dataRefresh.refresh();
          }
        }
      ]
    });
    alertUbahProgress.present();
  }

  goToEditBarang() {
    this.popoverCtrl.dismiss();
    this.router.navigateByUrl(`/barang/edit/${this.id}`);
  }

  viewFull(isFull: boolean, index: number | undefined) {
    this.isViewFull = isFull;
    if (index != undefined) {
      this.urlFullImage = this.dataImage[index].webviewPath;
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
