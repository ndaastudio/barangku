import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DataSharingService } from 'src/services/Database/data-sharing.service';
import { DatabaseService } from 'src/services/Database/database.service';
import { NotificationService } from 'src/services/Notification/notification.service';
import { PhotoService } from 'src/services/Photo/photo.service';

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
  pickedPhoto: boolean = false;
  dataImage: any = [];
  otherImage: any = [];

  constructor(private databaseService: DatabaseService,
    private dataSharingService: DataSharingService,
    private router: Router,
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private notificationService: NotificationService,
    private photoService: PhotoService) {
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
      this.databaseService.getGambarBarangById(this.id).then((resultGambar: any) => {
        resultGambar.forEach((data: any) => {
          this.photoService.loadPicture(data.gambar).then((loadedGambar) => {
            this.dataImage.push(loadedGambar);
          });
        });
      });
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
    if (this.jadwal_notifikasi !== this.dataBarang.jadwal_notifikasi) {
      const jadwalNotifikasi = this.reminder == 'Jadwal Rencana' ? this.jadwal_rencana : this.jadwal_notifikasi;
      let date = new Date(jadwalNotifikasi);
      this.notificationService.scheduleNotification('1', 'Pengingat!', `Jangan lupa ${this.nama_barang.toLowerCase()} ${this.status.toLowerCase()}`, this.id, new Date(date.getTime()));
    }
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
      if (this.pickedPhoto) {
        this.otherImage.forEach((dataGambar: any) => {
          const date = new Date().getTime();
          this.photoService.savePicture(dataGambar, `${this.nama_barang}-${date}.jpeg`).then((dataSave: any) => {
            this.databaseService.createGambarBarang(this.id, dataSave);
          });
        });
      }
      this.dataSharingService.refresh();
      this.router.navigateByUrl(`/barang/show/${this.id}`);
    });
  }

  pickGambar() {
    this.photoService.addNewToGallery().then((data) => {
      this.otherImage.push(data);
      this.pickedPhoto = true;
    });
  }

  async deleteImageFromDatabase(index: number) {
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
            this.databaseService.deleteGambarBarangByName(this.dataImage[index].fileName).then(() => {
              this.photoService.deletePicture(this.dataImage[index].fileName).then(() => {
                this.dataImage.splice(index, 1);
              });
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteImageFromArray(index: number) {
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
            this.otherImage.splice(index, 1);
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

