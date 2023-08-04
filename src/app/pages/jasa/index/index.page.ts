import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DataRefreshService } from 'src/app/services/Database/data-refresh.service';
import { formatDate, showAlert, truncateString } from '../../../helpers/functions';
import { JasaService as SQLiteJasa } from 'src/app/services/Database/SQLite/jasa.service';

@Component({
  selector: 'app-index',
  templateUrl: 'index.page.html',
  styleUrls: ['index.page.scss']
})
export class Tab2Page {
  dataJasa: any = [];
  formatTanggal: Function = formatDate;
  limitText: Function = truncateString;

  constructor(private alertCtrl: AlertController,
    private router: Router,
    private sqliteJasa: SQLiteJasa,
    private dataRefresh: DataRefreshService) {
  }

  ngOnInit() {
    this.initGetData();
    this.dataRefresh.refreshedData.subscribe(() => {
      this.initGetData();
    });
  }

  async initGetData() {
    const data = await this.sqliteJasa.getAll();
    this.dataJasa = data;
  }

  async showKategori() {
    const alertShowKategori = await this.alertCtrl.create({
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
          cssClass: '!text-gray-500'
        },
        {
          text: 'Pilih',
          handler: async (dataOpsi) => {
            if (dataOpsi) {
              const data = await this.sqliteJasa.getByKategori(dataOpsi);
              if (data?.length == 0) {
                showAlert(this.alertCtrl, 'Error!', `Tidak ada jasa dengan kategori "${dataOpsi}"`);
              } else {
                this.dataJasa = data;
              }
            } else {
              const data = await this.sqliteJasa.getAll();
              this.dataJasa = data;
            }
          }
        }
      ]
    });
    alertShowKategori.present();
  }

  async onSearchJasa(event: any) {
    const keyword = event.target.value;
    if (keyword.length == 0) {
      const data = await this.sqliteJasa.getAll();
      this.dataJasa = data;
      return;
    }
    const data = await this.sqliteJasa.search(keyword);
    this.dataJasa = data;
  }

  goToTambahJasa() {
    this.router.navigateByUrl('/jasa/create');
  }

  goToShowJasa(id: number) {
    this.router.navigateByUrl(`/jasa/show/${id}`);
  }
}
