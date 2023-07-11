import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DataSharingService } from 'src/services/Database/data-sharing.service';
import { DatabaseService } from 'src/services/Database/database.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  id: any = this.route.snapshot.paramMap.get('id');
  dataBarang: any = [];
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
    private dataSharingService: DataSharingService,
    private router: Router,
    private route: ActivatedRoute,
    private alertCtrl: AlertController) {
  }

  ngOnInit() {
    this.databaseService.getBarangById(this.id).then((data) => {
      this.dataBarang = data;
      this.nama_barang = data.nama_barang;
      this.kategori = data.kategori !== 'Opsi Lainnya' ? data.kategori : '';
      this.kategori_lainnya = data.kategori;
      this.status = data.status;
      this.extend_status = data.extend_status;
      this.jumlah_barang = data.jumlah_barang;
      this.letak_barang = data.letak_barang;
      this.keterangan = data.keterangan;
      this.jadwal_rencana = data.jadwal_rencana;
      this.jadwal_notifikasi = data.jadwal_notifikasi;
    });
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
    this.dataBarang.nama_barang = this.nama_barang;
    this.dataBarang.kategori = this.kategori == 'Opsi Lainnya' ? this.kategori_lainnya : this.kategori;
    this.dataBarang.status = this.status;
    this.dataBarang.extend_status = this.status == 'Dibuang' ? 'ke ' : (this.status == 'Dibeli' ? 'di ' : 'kepada ') + this.extend_status;
    this.dataBarang.jumlah_barang = this.jumlah_barang;
    this.dataBarang.letak_barang = this.letak_barang;
    this.dataBarang.keterangan = this.keterangan;
    this.dataBarang.jadwal_rencana = this.jadwal_rencana;
    this.dataBarang.jadwal_notifikasi = this.reminder == 'Jadwal Rencana' ? this.jadwal_rencana : this.jadwal_notifikasi;
    this.databaseService.updateBarang(this.dataBarang).then(() => {
      this.dataSharingService.refresh();
      this.router.navigateByUrl(`/barang/show/${this.id}`);
    });
  }

  pickGambar() {
    this.showAlert('Error!', 'Fitur ini belum tersedia');
  }
}

