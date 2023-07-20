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
  dataJasa: any = [];
  nama_jasa: any;
  kategori: any;
  kategori_lainnya: any;
  jumlah_jasa: any;
  letak_jasa: any;
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
    this.databaseService.getJasaById(this.id).then((data) => {
      this.dataJasa = data;
      this.nama_jasa = data.nama_jasa;
      this.kategori = data.kategori !== 'Opsi Lainnya' ? data.kategori : '';
      this.kategori_lainnya = data.kategori;
      this.jumlah_jasa = data.jumlah_jasa;
      this.letak_jasa = data.letak_jasa;
      this.keterangan = data.keterangan;
      this.jadwal_rencana = data.jadwal_rencana;
      this.jadwal_notifikasi = data.jadwal_notifikasi;
      this.databaseService.getGambarJasaById(this.id).then((resultGambar: any) => {
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
    if (this.jadwal_notifikasi !== this.dataJasa.jadwal_notifikasi) {
      const jadwalNotifikasi = this.reminder == 'Jadwal Rencana' ? this.jadwal_rencana : this.jadwal_notifikasi;
      let date = new Date(jadwalNotifikasi);
      this.notificationService.scheduleNotification('2', 'Pengingat!', `Jangan lupa ${this.nama_jasa.toLowerCase()}`, this.id, new Date(date.getTime()));
    }
    this.dataJasa.nama_jasa = this.nama_jasa;
    this.dataJasa.kategori = this.kategori == 'Opsi Lainnya' ? this.kategori_lainnya : this.kategori;
    this.dataJasa.jumlah_jasa = this.jumlah_jasa;
    this.dataJasa.letak_jasa = this.letak_jasa;
    this.dataJasa.keterangan = this.keterangan;
    this.dataJasa.jadwal_rencana = this.jadwal_rencana;
    this.dataJasa.jadwal_notifikasi = this.reminder == 'Jadwal Rencana' ? this.jadwal_rencana : this.jadwal_notifikasi;
    this.databaseService.updateJasa(this.dataJasa).then(() => {
      if (this.pickedPhoto) {
        this.otherImage.forEach((dataGambar: any) => {
          const date = new Date().getTime();
          this.photoService.savePicture(dataGambar, `${this.nama_jasa}-${date}.jpeg`).then((dataSave: any) => {
            this.databaseService.createGambarJasa(this.id, dataSave);
          });
        });
      }
      this.dataSharingService.refresh();
      this.router.navigateByUrl(`/jasa/show/${this.id}`);
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
            this.databaseService.deleteGambarJasaByName(this.dataImage[index].fileName).then(() => {
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
