import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonicSafeString, AlertInput, AnimationController, PopoverController } from '@ionic/angular';
import { formatDate, formatTime } from 'src/app/helpers/functions';
import { DataRefreshService } from 'src/app/services/Database/data-refresh.service';
import { LocalNotifService } from 'src/app/services/App/local-notif.service';
import { BarangService as SQLiteBarang } from 'src/app/services/Database/SQLite/barang.service';
import { PhotoService } from 'src/app/services/App/photo.service';
import { LocalStorageService } from 'src/app/services/Database/local-storage.service';

interface INotif{
  id: number,
  id_barang: number,
  jadwal_notifikasi: string,
};

@Component({
  selector: 'app-show',
  templateUrl: './show.page.html',
  styleUrls: ['./show.page.scss'],
})
export class ShowPage implements OnInit {
  platform: any = null;
  id: any = this.route.snapshot.paramMap.get('id');
  dataBarang: any = [];
  dataImage: any = [];
  isViewFull: boolean = false;
  urlFullImage: any;
  formatTanggal: Function = formatDate;
  formatJam: Function = formatTime;
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
  dataNotifikasi: INotif[] = [];
  buffer: any;

  constructor(private sqliteBarang: SQLiteBarang,
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private dataRefresh: DataRefreshService,
    private router: Router,
    private popoverCtrl: PopoverController,
    private notif: LocalNotifService,
    private photo: PhotoService,
    private animationCtrl: AnimationController,
    private localStorage: LocalStorageService) {
  }

  async ngOnInit() {
    this.platform = await this.localStorage.get('os');
    this.initGetData();
    this.dataRefresh.refreshedData.subscribe(() => {
      this.initGetData();
    });
  }

  async initGetData() {
    const data = await this.sqliteBarang.getById(this.id);
    this.dataBarang = data;    
    const dataNotif = await this.sqliteBarang.getNotifByIdBarang(this.id);
    this.dataNotifikasi = dataNotif;
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
            await this.router.navigateByUrl('/barang');
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
              // delete notif tunda
              // cek apakah ada notifikasi tunda
              if(this.dataNotifikasi.length > 1) {
                // ambil list tunda notif
                let list_notif = this.dataNotifikasi.slice(1);
                // ambil list id tunda notif dan jadikan sebuah string dengan format: id, id, id, ...
                let list_id_notif = list_notif.map(notif => notif.id).join(", ");
                await this.sqliteBarang.deleteNotifByListId(list_id_notif);
              }
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

  async tundaAksi() {
    // generate input for alert tunda
    let input_tunda: AlertInput[] = [];
    for (let i = 0; i < 7; i++) {
      input_tunda[i] = {
        label: `${i+1} Hari`,
        type: 'radio',
        value: i+1,
      };
    }

    let message_alert = 'Silahkan pilih waktu notifikasi pengingat aksi selanjutnya! <br> <span class="text-sm text-amber-400">*pengingat ini akan terulang maksimal sebanyak 5</span>';

    const alertTundaAksi = await this.alertCtrl.create({
      header: "Tunda Aksi",
      message: new IonicSafeString(message_alert),
      inputs: input_tunda,
      buttons: [
        {
          text: 'Cancel',          
          cssClass: '!text-gray-500',
          role: 'cancel',
        },
        {
          text: 'Save',
          role: 'confirm',
          handler: async (value) => {
            // save tunda ke database
            // ambil data jadwal_notifikasi utama     
            let old_notif = new Date(this.dataNotifikasi[0].jadwal_notifikasi);
            // ulangi create notif sebanyak 5 kali dengan masing-masing interval "value" hari
            for(let i = 1; i <= 5; i++){
              // tambahkan sebanyak "value" hari dari jadwal_notifikasi utama
              old_notif.setDate(old_notif.getDate() + value);
              // convert date menjadi string "yyyy/mm/ddThh:ii:ss"
              let tunda_notif = old_notif.toISOString();              
              let data_tunda = {
                id_barang: this.id,
                jadwal_notifikasi: tunda_notif,
              };
              // simpan data ke sql storage tabel notifications
              await this.sqliteBarang.createNotif(data_tunda);
            }
            // refresh data barang
            this.dataRefresh.refresh();
          },
        },
      ]
    });

    await alertTundaAksi.present();

  }
}
