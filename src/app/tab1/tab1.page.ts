import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DataSharingService } from 'src/services/Database/data-sharing.service';
import { DatabaseService } from 'src/services/Database/database.service';
import { formatDate } from '../helpers/functions';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  dataBarang: any = [];
  formatTanggal: Function = formatDate;

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

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: ['OK']
    })
    alert.present();
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
          handler: (dataOpsi) => {
            if (dataOpsi) {
              this.databaseService.getBarangByKategori(dataOpsi).then((data) => {
                if (data?.length == 0) {
                  this.showAlert('Error!', `Tidak ada barang dengan kategori "${dataOpsi}"`);
                } else {
                  this.dataBarang = data;
                }
              });
            } else {
              this.databaseService.getAllBarang().then((data) => {
                this.dataBarang = data;
              });
            }
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

  onSearchBarang(event: any) {
    const keyword = event.target.value;
    if (keyword.length == 0) {
      this.databaseService.getAllBarang().then((data) => {
        this.dataBarang = data;
      });
      return;
    }
    this.databaseService.searchBarang(keyword).then((data) => {
      this.dataBarang = data;
    });
  }
}
