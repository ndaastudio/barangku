import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, PopoverController } from '@ionic/angular';
import { DataSharingService } from 'src/services/Database/data-sharing.service';
import { DatabaseService } from 'src/services/Database/database.service';
import { NotificationService } from 'src/services/Notification/notification.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.page.html',
  styleUrls: ['./show.page.scss'],
})
export class ShowJasaPage implements OnInit {
  id: any = this.route.snapshot.paramMap.get('id');
  dataJasa: any = [];

  constructor(private databaseService: DatabaseService,
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private dataSharingService: DataSharingService,
    private router: Router,
    private popoverCtrl: PopoverController,
    private notificationService: NotificationService) {
    this.databaseService.getJasaById(this.id).then((data) => {
      this.dataJasa = data;
      this.dataJasa.jadwal_rencana = this.formatDate(data.jadwal_rencana);
    });
  }

  ngOnInit() {
    this.dataSharingService.refreshedData.subscribe(() => {
      this.databaseService.getJasaById(this.id).then((data) => {
        this.dataJasa = data;
        this.dataJasa.jadwal_rencana = this.formatDate(data.jadwal_rencana);
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
            this.databaseService.deleteJasaById(this.id).then(() => {
              this.notificationService.cancelNotification(this.id);
              this.dataSharingService.refresh();
              this.router.navigateByUrl('/tabs/tab2');
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
            this.dataJasa.progress = dataOpsi;
            this.databaseService.updateJasa(this.dataJasa).then(() => {
              if (dataOpsi == 0) {
                let date = new Date(this.dataJasa.jadwal_notifikasi);
                this.notificationService.scheduleNotification('Pengingat!', `Jangan lupa ${this.dataJasa.nama_jasa.toLowerCase()}`, this.id, new Date(date.getTime()))
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

  goToEditJasa() {
    this.popoverCtrl.dismiss();
    this.router.navigateByUrl(`/jasa/edit/${this.id}`);
  }

  deleteGambar() {
    this.showAlert('Error!', 'Fitur ini belum tersedia');
  }

  formatDate(date: string) {
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const year = date.substring(0, 4);
    const month = monthNames[parseInt(date.substring(5, 7)) - 1];
    const day = date.substring(8, 10);
    return `${day} ${month} ${year}`;
  }
}