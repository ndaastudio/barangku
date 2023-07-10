import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DataSharingService } from 'src/services/Database/data-sharing.service';
import { DatabaseService } from 'src/services/Database/database.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  dataBarang: any = [];

  constructor(private alertCtrl: AlertController,
    private router: Router,
    private databaseService: DatabaseService,
    private dataSharingService: DataSharingService) {
    this.databaseService.getAllBarang().then((data) => {
      this.dataBarang = data;
    });
  }

  ngOnInit() {
    this.dataSharingService.refreshedData.subscribe(() => {
      this.databaseService.getAllBarang().then((data) => {
        this.dataBarang = data;
      });
    });
  }

  async showKategori() {
    const alert = await this.alertCtrl.create({
      header: 'Pilih Kategori',
      inputs: [
        {
          name: 'kategori',
          type: 'radio',
          label: 'Kebutuhan Dapur',
          value: 'Kebutuhan Dapur',
          checked: false
        },
        {
          name: 'kategori',
          type: 'radio',
          label: 'Kebutuhan Anak',
          value: 'Kebutuhan Anak',
          checked: false
        },
        {
          name: 'kategori',
          type: 'radio',
          label: 'Kebutuhan Istri',
          value: 'Kebutuhan Istri',
          checked: false
        },
      ],
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
        },
        {
          text: 'Pilih',
          handler: (data) => {
            this.databaseService.getBarangByKategori(data).then((data) => {
              this.dataBarang = data;
            });
          }
        }
      ]
    });
    alert.present();
  }

  goToTambahBarang() {
    this.router.navigateByUrl('/barang/create');
  }

  goToShowBarang(id: number) {
    this.router.navigateByUrl(`/barang/show/${id}`);
  }
}
