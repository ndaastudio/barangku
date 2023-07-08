import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(private alertCtrl: AlertController,
    private router: Router) { }

  async showKategori() {
    const alert = await this.alertCtrl.create({
      header: 'Pilih Kategori',
      inputs: [
        {
          name: 'kategori',
          type: 'radio',
          label: 'Jasa Pendidikan',
          value: 'Jasa Pendidikan',
          checked: false
        },
        {
          name: 'kategori',
          type: 'radio',
          label: 'Jasa Kesehatan',
          value: 'Jasa Kesehatan',
          checked: false
        },
        {
          name: 'kategori',
          type: 'radio',
          label: 'Jasa Kebersihan',
          value: 'Jasa Kebersihan',
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

  goToTambahJasa() {
    this.router.navigateByUrl('/tambah-jasa');
  }

  goToShowJasa() {
    this.router.navigateByUrl('/show-jasa');
  }
}
