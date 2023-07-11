import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DataSharingService } from 'src/services/Database/data-sharing.service';
import { DatabaseService } from 'src/services/Database/database.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class TambahJasaPage implements OnInit {
  nama_jasa: any;
  kategori: any;
  kategori_lainnya: any;
  jumlah_jasa: any;
  letak_jasa: any;
  keterangan: any;
  jadwal_rencana: any;
  jadwal_notifikasi: any;
  reminder: any;

  constructor(private databaseService: DatabaseService,
    private alertCtrl: AlertController,
    private router: Router,
    private dataSharingService: DataSharingService) {
  }

  ngOnInit() {
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  saveToDatabase() {
    if (this.nama_jasa && this.kategori && this.jumlah_jasa && this.letak_jasa && this.keterangan && this.jadwal_rencana && this.reminder) {
      const data = {
        nama_jasa: this.nama_jasa,
        kategori: this.kategori == 'Opsi Lainnya' ? this.kategori_lainnya : this.kategori,
        jumlah_jasa: this.jumlah_jasa,
        letak_jasa: this.letak_jasa,
        keterangan: this.keterangan,
        jadwal_rencana: this.jadwal_rencana,
        jadwal_notifikasi: this.reminder == 'Jadwal Rencana' ? this.jadwal_rencana : this.jadwal_notifikasi,
      };
      this.databaseService.createJasa(data).then(() => {
        this.nama_jasa = '';
        this.kategori = '';
        this.jumlah_jasa = '';
        this.letak_jasa = '';
        this.keterangan = '';
        this.jadwal_rencana = '';
        this.reminder = '';
        this.jadwal_notifikasi = '';
        this.dataSharingService.refresh();
        this.router.navigateByUrl('/tabs/tab2');
      }).catch((error) => {
        this.showAlert('Error!', error);
      });
    } else {
      this.showAlert('Error!', 'Tidak boleh ada yang kosong');
    }
  }

  pickGambar() {
    this.showAlert('Error!', 'Fitur ini belum tersedia');
  }
}
