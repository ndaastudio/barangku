import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(private alertCtrl: AlertController,
    private router: Router) { }

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
          label: 'Kebutuhan Jasa',
          value: 'Kebutuhan Jasa',
          checked: false
        },
        {
          name: 'kategori',
          type: 'radio',
          label: 'Kebutuhan Pribadi',
          value: 'Kebutuhan Pribadi',
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
            console.log(data);
          }
        }
      ]
    });
    alert.present();
  }

  goToTambahBarang() {
    this.router.navigateByUrl('/tambah-barang');
  }

  goToShowBarang() {
    this.router.navigateByUrl('/show-barang');
  }
}
