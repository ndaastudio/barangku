import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, PopoverController } from '@ionic/angular';
import { DataSharingService } from 'src/services/Database/data-sharing.service';
import { DatabaseService } from 'src/services/Database/database.service';
import { NotificationService } from 'src/services/Notification/notification.service';
import { PhotoService } from 'src/services/Photo/photo.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.page.html',
  styleUrls: ['./show.page.scss'],
})
export class ShowBarangPage implements OnInit {
  id: any = this.route.snapshot.paramMap.get('id');
  dataBarang: any = [];
  dataImage: any = [];

  constructor(private databaseService: DatabaseService,
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private dataSharingService: DataSharingService,
    private router: Router,
    private popoverCtrl: PopoverController,
    private notificationService: NotificationService,
    private photoService: PhotoService) {
    this.databaseService.getBarangById(this.id).then((data) => {
      this.dataBarang = data;
      this.dataBarang.jadwal_rencana = this.formatDate(data.jadwal_rencana);
      this.databaseService.getGambarBarangById(this.id).then((resultGambar: any) => {
        resultGambar.forEach((data: any) => {
          this.photoService.loadPicture(data.gambar).then((loadedGambar) => {
            this.dataImage.push(loadedGambar);
          });
        });
      });
    });
  }

  ngOnInit() {
    this.dataSharingService.refreshedData.subscribe(() => {
      this.databaseService.getBarangById(this.id).then((data) => {
        this.dataBarang = data;
        this.dataBarang.jadwal_rencana = this.formatDate(data.jadwal_rencana);
        this.databaseService.getGambarBarangById(this.id).then((resultGambar: any) => {
          resultGambar.forEach((data: any) => {
            this.photoService.loadPicture(data.gambar).then((loadedGambar) => {
              this.dataImage.push(loadedGambar);
            });
          });
        });
      });
    });
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: ['OK']
    })
    alert.present();
  }

  hapusData() {
    this.popoverCtrl.dismiss();
    this.alertCtrl.create({
      header: 'Konfirmasi',
      message: 'Anda yakin ingin menghapus data ini?',
      buttons: [
        {
          text: 'BATAL',
          role: 'cancel',
        },
        {
          text: 'YA',
          handler: () => {
            this.databaseService.deleteBarangById(this.id).then(() => {
              this.dataImage.forEach((dataGambar: any) => {
                this.photoService.deletePicture(dataGambar.fileName);
                this.databaseService.deleteGambarBarangByName(dataGambar.fileName);
              });
              this.notificationService.cancelNotification(this.id);
              this.dataSharingService.refresh();
              this.router.navigateByUrl('/tabs/tab1');
            });
          }
        }
      ]
    }).then((alert) => {
      alert.present();
    }
    );
  }

  async ubahProgress() {
    this.popoverCtrl.dismiss();
    const alert = await this.alertCtrl.create({
      header: 'Ubah Progress',
      inputs: [
        {
          name: 'progress',
          type: 'radio',
          label: 'Belum',
          value: 0,
          checked: false
        },
        {
          name: 'progress',
          type: 'radio',
          label: 'Selesai',
          value: 1,
          checked: false
        }
      ],
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
        },
        {
          text: 'Pilih',
          handler: (dataOpsi) => {
            this.dataBarang.progress = dataOpsi;
            this.databaseService.updateBarang(this.dataBarang).then(() => {
              if (dataOpsi == 0) {
                let date = new Date(this.dataBarang.jadwal_notifikasi);
                this.notificationService.scheduleNotification('1', 'Pengingat!', `Jangan lupa ${this.dataBarang.nama_barang.toLowerCase()} ${this.dataBarang.status.toLowerCase()}`, this.id, new Date(date.getTime()));
              } else if (dataOpsi == 1) {
                this.notificationService.cancelNotification(this.id);
              }
              this.dataSharingService.refresh();
            });
          }
        }
      ]
    });
    alert.present();
  }

  goToEditBarang() {
    this.popoverCtrl.dismiss();
    this.router.navigateByUrl(`/barang/edit/${this.id}`);
  }

  formatDate(date: string) {
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const year = date.substring(0, 4);
    const month = monthNames[parseInt(date.substring(5, 7)) - 1];
    const day = date.substring(8, 10);
    return `${day} ${month} ${year}`;
  }
}
