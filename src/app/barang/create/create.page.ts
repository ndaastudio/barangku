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
export class TambahBarangPage implements OnInit {
  nama_barang: any;
  kategori: any;
  kategori_lainnya: any;
  status: any;
  extend_status: any;
  jumlah_barang: any;
  letak_barang: any;
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
    if (this.nama_barang && this.kategori && this.status && this.extend_status && this.jumlah_barang && this.letak_barang && this.keterangan && this.jadwal_rencana && this.reminder) {
      const data = {
        nama_barang: this.nama_barang,
        kategori: this.kategori == 'Opsi Lainnya' ? this.kategori_lainnya : this.kategori,
        status: this.status,
        extend_status: this.status == 'Dibuang' ? 'ke ' : (this.status == 'Dibeli' ? 'di ' : 'kepada ') + this.extend_status,
        jumlah_barang: this.jumlah_barang,
        letak_barang: this.letak_barang,
        keterangan: this.keterangan,
        jadwal_rencana: this.jadwal_rencana,
        jadwal_notifikasi: this.reminder == 'Jadwal Rencana' ? this.jadwal_rencana : this.jadwal_notifikasi,
      };
      this.databaseService.createBarang(data).then(() => {
        this.nama_barang = '';
        this.kategori = '';
        this.status = '';
        this.extend_status = '';
        this.jumlah_barang = '';
        this.letak_barang = '';
        this.keterangan = '';
        this.jadwal_rencana = '';
        this.reminder = '';
        this.jadwal_notifikasi = '';
        this.dataSharingService.refresh();
        this.router.navigateByUrl('/tabs/tab1');
      }).catch((error) => {
        this.showAlert('Error!', error);
      });
    } else {
      this.showAlert('Error!', 'Tidak boleh ada yang kosong');
    }
  }

  pickGambar() {
    this.showAlert('Error!', 'Fitur belum tersedia');
  }
}
