import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { showAlert, showLoading } from 'src/app/helpers/functions';
import { AuthService } from 'src/app/services/API/auth.service';
import { LocalStorageService } from 'src/app/services/Database/local-storage.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditProfilPage implements OnInit {
  nama: any;
  email: any;
  nomor_telepon: any;
  jenis_akun: any;
  password_lama: any;
  password_baru: any;
  konfirmasi_password_baru: any;

  constructor(private modalCtrl: ModalController,
    private localStorage: LocalStorageService,
    private auth: AuthService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController) {
  }

  async ngOnInit() {
    const profile = await this.localStorage.get('profile');
    this.nama = profile.nama;
    this.email = profile.email;
    this.nomor_telepon = profile.nomor_telepon;
    this.jenis_akun = profile.jenis_akun;
  }

  async submitGantiPw() {
    if (this.password_baru && this.password_lama && this.konfirmasi_password_baru) {
      try {
        await showLoading(this.loadingCtrl, 'Sedang memproses...');
        const profile = await this.localStorage.get('profile');
        const token = await this.localStorage.get('access_token');
        const phoneNumber = profile.nomor_telepon;
        const data = {
          nomor_telepon: phoneNumber,
          password_lama: this.password_lama,
          password_baru: this.password_baru,
          konfirmasi_password_baru: this.konfirmasi_password_baru,
        }
        const results = await this.auth.gantiPw(data, token);
        this.password_lama = '';
        this.password_baru = '';
        this.konfirmasi_password_baru = '';
        await this.loadingCtrl.dismiss();
        await this.modalCtrl.dismiss();
        await showAlert(this.alertCtrl, 'Berhasil!', results.message);
        await this.localStorage.set('profile', results.data);
      } catch (error: any) {
        await this.loadingCtrl.dismiss();
        await showAlert(this.alertCtrl, 'Error!', error.error.message);
      };
    } else {
      showAlert(this.alertCtrl, 'Error!', 'Tidak boleh ada data yang kosong');
    }
  }
}
