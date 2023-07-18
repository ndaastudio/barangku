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
      this.dataJasa.forEach((jasa: any) => {
        jasa.jadwal_rencana = this.formatDate(jasa.jadwal_rencana);
      });
    });
  }

  ngOnInit() {
    this.dataSharingService.refreshedData.subscribe(() => {
      this.databaseService.getAllJasa().then((data) => {
        this.dataJasa = data;
        this.dataJasa.forEach((jasa: any) => {
          jasa.jadwal_rencana = this.formatDate(jasa.jadwal_rencana);
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
          handler: (dataOpsi) => {
            if (dataOpsi) {
              this.databaseService.getJasaByKategori(dataOpsi).then((data) => {
                if (data?.length == 0) {
                  this.showAlert('Error!', `Tidak ada jasa dengan kategori "${dataOpsi}"`);
                } else {
                  this.dataJasa = data;
                  this.dataJasa.forEach((jasa: any) => {
                    jasa.jadwal_rencana = this.formatDate(jasa.jadwal_rencana);
                  });
                }
              });
            } else {
              this.databaseService.getAllJasa().then((data) => {
                this.dataJasa = data;
                this.dataJasa.forEach((jasa: any) => {
                  jasa.jadwal_rencana = this.formatDate(jasa.jadwal_rencana);
                });
              });
            }
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

  formatDate(date: string) {
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const year = date.substring(0, 4);
    const month = monthNames[parseInt(date.substring(5, 7)) - 1];
    const day = date.substring(8, 10);
    return `${day} ${month} ${year}`;
  }
}
