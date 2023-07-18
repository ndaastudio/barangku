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
      this.dataBarang.forEach((barang: any) => {
        barang.jadwal_rencana = this.formatDate(barang.jadwal_rencana);
      });
    });
  }

  ngOnInit() {
    this.dataSharingService.refreshedData.subscribe(() => {
      this.databaseService.getAllBarang().then((data) => {
        this.dataBarang = data;
        this.dataBarang.forEach((barang: any) => {
          barang.jadwal_rencana = this.formatDate(barang.jadwal_rencana);
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
                  this.dataBarang.forEach((barang: any) => {
                    barang.jadwal_rencana = this.formatDate(barang.jadwal_rencana);
                  });
                }
              });
            } else {
              this.databaseService.getAllBarang().then((data) => {
                this.dataBarang = data;
                this.dataBarang.forEach((barang: any) => {
                  barang.jadwal_rencana = this.formatDate(barang.jadwal_rencana);
                });
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

  formatDate(date: string) {
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const year = date.substring(0, 4);
    const month = monthNames[parseInt(date.substring(5, 7)) - 1];
    const day = date.substring(8, 10);
    return `${day} ${month} ${year}`;
  }
}
