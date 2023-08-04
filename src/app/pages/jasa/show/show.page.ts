import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, AnimationController, PopoverController } from '@ionic/angular';
import { formatDate } from 'src/app/helpers/functions';
import { DataRefreshService } from 'src/app/services/Database/data-refresh.service';
import { LocalNotifService } from 'src/app/services/App/local-notif.service';
import { PhotoService } from 'src/app/services/App/photo.service';
import { JasaService as SQLiteJasa } from 'src/app/services/Database/SQLite/jasa.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.page.html',
  styleUrls: ['./show.page.scss'],
})
export class ShowJasaPage implements OnInit {
  id: any = this.route.snapshot.paramMap.get('id');
  dataJasa: any = [];
  dataImage: any = [];
  isViewFull: boolean = false;
  urlFullImage: any;
  formatTanggal: Function = formatDate;

  constructor(private sqliteJasa: SQLiteJasa,
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
    const data = await this.sqliteJasa.getById(this.id);
    this.dataJasa = data;
    const resultGambar = await this.sqliteJasa.getGambarById(this.id);
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
        },
        {
          text: 'Ya',
          handler: async () => {
            await this.sqliteJasa.deleteById(this.id);
            this.dataImage.forEach(async (dataGambar: any) => {
              await this.photo.delete(dataGambar.fileName);
              await this.sqliteJasa.deleteGambarByName(dataGambar.fileName);
            });
            await this.notif.delete(this.id);
            await this.router.navigateByUrl('/tabs/jasa');
            this.dataRefresh.refresh();
          }
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
          checked: this.dataJasa.progress == 0 ? true : false
        },
        {
          name: 'progress',
          type: 'radio',
          label: 'Selesai',
          value: 1,
          checked: this.dataJasa.progress == 1 ? true : false
        }
      ],
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
        },
        {
          text: 'Pilih',
          handler: async (dataOpsi) => {
            this.dataJasa.progress = dataOpsi;
            await this.sqliteJasa.update(this.dataJasa);
            if (dataOpsi == 0) {
              const date = new Date(this.dataJasa.jadwal_notifikasi);
              await this.notif.delete(this.id);
              await this.notif.create('2', 'Pengingat!', `Jangan lupa ${this.dataJasa.nama_jasa.toLowerCase()}`, this.id, new Date(date.getTime()), `/jasa/show/${this.id}`)
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

  goToEditJasa() {
    this.popoverCtrl.dismiss();
    this.router.navigateByUrl(`/jasa/edit/${this.id}`);
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
