import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DataSharingService } from 'src/services/Database/data-sharing.service';
import { DatabaseService } from 'src/services/Database/database.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  dataJasa: any = [];

  constructor(private alertCtrl: AlertController,
    private router: Router,
    private databaseService: DatabaseService,
    private dataSharingService: DataSharingService) {
    this.databaseService.getAllJasa().then((data) => {
      this.dataJasa = data;
    });
  }

  ngOnInit() {
    this.dataSharingService.refreshedData.subscribe(() => {
      this.databaseService.getAllJasa().then((data) => {
        this.dataJasa = data;
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
            this.databaseService.getJasaByKategori(data).then((data) => {
              this.dataJasa = data;
            });
          }
        }
      ]
    });
    alert.present();
  }

  onSearchJasa(event: any) {
    const keyword = event.target.value;
    if (keyword.length == 0) {
      this.databaseService.getAllJasa().then((data) => {
        this.dataJasa = data;
      });
      return;
    }
    this.databaseService.searchJasa(keyword).then((data) => {
      this.dataJasa = data;
    });
  }

  goToTambahJasa() {
    this.router.navigateByUrl('/jasa/create');
  }

  goToShowJasa(id: number) {
    this.router.navigateByUrl(`/jasa/show/${id}`);
  }
}
