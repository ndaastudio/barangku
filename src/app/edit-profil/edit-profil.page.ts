import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { APIService } from 'src/services/API/api.service';
import { StorageService } from 'src/services/LocalStorage/storage.service';

@Component({
  selector: 'app-edit-profil',
  templateUrl: './edit-profil.page.html',
  styleUrls: ['./edit-profil.page.scss'],
})
export class EditProfilPage implements OnInit {
  nama: any;
  email: any;
  nomor_telepon: any;
  jenis_akun: any;
  password: any;

  constructor(private modalCtrl: ModalController,
    private storageService: StorageService,
    private apiService: APIService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController) {
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: [{
        text: 'OK',
      }]
    });
    await alert.present();
  }

  async showLoading(message: string) {
    const loading = await this.loadingCtrl.create({
      message: message,
    });
    await loading.present();
  }

  async ngOnInit() {
    const profile = await this.storageService.get('profile');
    this.nama = profile.nama;
    this.email = profile.email;
    this.nomor_telepon = profile.nomor_telepon;
    this.jenis_akun = profile.jenis_akun;
  }

  async submitGantiPw() {
    if (this.password) {
      this.showLoading('Sedang memproses...');
      const profile = await this.storageService.get('profile');
      const token = await this.storageService.get('access_token');
      const phoneNumber = profile.nomor_telepon;
      const data = {
        nomor_telepon: phoneNumber,
        password: this.password
      }
      this.apiService.gantiPw(data, token).then((result) => {
        this.password = '';
        this.loadingCtrl.dismiss();
        this.modalCtrl.dismiss();
        this.showAlert('Berhasil!', result.message);
        this.storageService.set('profile', result.data);
      }).catch((error) => {
        this.loadingCtrl.dismiss();
        this.showAlert('Error!', error.error.message);
      });
    } else {
      this.showAlert('Error!', 'Password tidak boleh kosong');
    }
  }
}
