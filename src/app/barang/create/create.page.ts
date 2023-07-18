import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DataSharingService } from 'src/services/Database/data-sharing.service';
import { DatabaseService } from 'src/services/Database/database.service';
import { NotificationService } from 'src/services/Notification/notification.service';
import { PhotoService } from 'src/services/Photo/photo.service';

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
  pickedPhoto: boolean = false;
  dataImage: any = [];

  constructor(private databaseService: DatabaseService,
    private alertCtrl: AlertController,
    private router: Router,
    private dataSharingService: DataSharingService,
    private photoService: PhotoService,
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
      this.databaseService.createBarang(data).then((id) => {
        if (this.pickedPhoto) {
          this.dataImage.forEach((dataGambar: any) => {
            const date = new Date().getTime();
            this.photoService.savePicture(dataGambar, `${this.nama_barang}-${date}.jpeg`).then((dataSave: any) => {
              this.databaseService.createGambarBarang(id, dataSave);
            });
          });
        }
        let date = new Date(data.jadwal_notifikasi);
        this.notificationService.scheduleNotification('Pengingat!', `Jangan lupa ${this.nama_barang.toLowerCase()} ${this.status.toLowerCase()}`, id, new Date(date.getTime()));
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
    this.photoService.addNewToGallery().then((data) => {
      this.dataImage.push(data);
      this.pickedPhoto = true;
    });
  }

  async deleteImage(index: number) {
    const alert = await this.alertCtrl.create({
      header: 'Hapus',
      message: 'Apakah anda yakin ingin menghapus gambar ini?',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
        },
        {
          text: 'Ya',
          handler: () => {
            this.dataImage.splice(index, 1);
          }
        }
      ]
    });
    await alert.present();
  }

  customCounterFormatter(inputLength: number, maxLength: number) {
    return `${maxLength - inputLength} karakter tersisa`;
  }

  countInputNama() {
    const maxLength = 15 - 1;
    const inputLength = this.nama_barang.length;
    if (inputLength > maxLength) {
      this.nama_barang = this.nama_barang.slice(0, maxLength);
    }
  }
  countInputKategori() {
    const maxLength = 15 - 1;
    const inputLength = this.kategori_lainnya.length;
    if (inputLength > maxLength) {
      this.kategori_lainnya = this.kategori_lainnya.slice(0, maxLength);
    }
  }
  countInputStatus() {
    const maxLength = 15 - 1;
    const inputLength = this.extend_status.length;
    if (inputLength > maxLength) {
      this.extend_status = this.extend_status.slice(0, maxLength);
    }
  }
  countInputJumlah() {
    const maxLength = 10 - 1;
    const inputLength = this.jumlah_barang.length;
    if (inputLength > maxLength) {
      this.jumlah_barang = this.jumlah_barang.slice(0, maxLength);
    }
  }
  countInputLetak() {
    const maxLength = 15 - 1;
    const inputLength = this.letak_barang.length;
    if (inputLength > maxLength) {
      this.letak_barang = this.letak_barang.slice(0, maxLength);
    }
  }
}
