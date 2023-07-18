import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DataSharingService } from 'src/services/Database/data-sharing.service';
import { DatabaseService } from 'src/services/Database/database.service';
import { NotificationService } from 'src/services/Notification/notification.service';

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
    private dataSharingService: DataSharingService,
    private notificationService: NotificationService) {
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
      this.databaseService.createJasa(data).then((id) => {
        let date = new Date(data.jadwal_notifikasi);
        this.notificationService.scheduleNotification('Pengingat!', `Jangan lupa ${this.nama_jasa.toLowerCase()}`, id, new Date(date.getTime()));
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

  customCounterFormatter(inputLength: number, maxLength: number) {
    return `${maxLength - inputLength} karakter tersisa`;
  }

  countInputNama() {
    const maxLength = 15 - 1;
    const inputLength = this.nama_jasa.length;
    if (inputLength > maxLength) {
      this.nama_jasa = this.nama_jasa.slice(0, maxLength);
    }
  }
  countInputKategori() {
    const maxLength = 15 - 1;
    const inputLength = this.kategori_lainnya.length;
    if (inputLength > maxLength) {
      this.kategori_lainnya = this.kategori_lainnya.slice(0, maxLength);
    }
  }
  countInputJumlah() {
    const maxLength = 10 - 1;
    const inputLength = this.jumlah_jasa.length;
    if (inputLength > maxLength) {
      this.jumlah_jasa = this.jumlah_jasa.slice(0, maxLength);
    }
  }
  countInputLetak() {
    const maxLength = 15 - 1;
    const inputLength = this.letak_jasa.length;
    if (inputLength > maxLength) {
      this.letak_jasa = this.letak_jasa.slice(0, maxLength);
    }
  }
}
