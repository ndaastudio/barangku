import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, PopoverController } from '@ionic/angular';
import { DataSharingService } from 'src/services/Database/data-sharing.service';
import { DatabaseService } from 'src/services/Database/database.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.page.html',
  styleUrls: ['./show.page.scss'],
})
export class ShowBarangPage implements OnInit {
  id: any = this.route.snapshot.paramMap.get('id');
  dataBarang: any = [];

  constructor(private databaseService: DatabaseService,
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private dataSharingService: DataSharingService,
    private router: Router,
    private popoverCtrl: PopoverController) {
    this.databaseService.getBarangById(this.id).then((data) => {
      this.dataBarang = data;
    });
  }

  ngOnInit() {
    this.dataSharingService.refreshedData.subscribe(() => {
      this.databaseService.getBarangById(this.id).then((data) => {
        this.dataBarang = data;
      });
    });
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
          handler: (data) => {
            this.dataBarang.progress = data;
            this.databaseService.updateBarang(this.dataBarang).then(() => {
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

  deleteGambar() {
  }
}
