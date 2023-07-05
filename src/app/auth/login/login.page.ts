import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  nomor_telepon: any;
  password: any;
  registered_nomor_telepon: any;

  constructor(private alertCtrl: AlertController,
    private loadingCtrl: LoadingController) {
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async showLoading(message: string) {
    const loading = await this.loadingCtrl.create({
      message: message,
    });
    await loading.present();
  }

  ngOnInit() {
  }

  submitLogin() {
    if (this.nomor_telepon && this.password) {
      this.showLoading('Sedang login...');
      setTimeout(() => {
        this.loadingCtrl.dismiss();
        this.showAlert('Berhasil!', 'Akun terverifikasi login');
      }, 1500);
    } else {
      this.showAlert('Error!', 'Tidak boleh ada yang kosong');
    }
  }

  submitResetPassword() {
    if (this.registered_nomor_telepon) {
      this.showLoading('Sedang memproses...');
      setTimeout(() => {
        this.loadingCtrl.dismiss();
        this.showAlert('Berhasil!', 'Kata sandi baru telah dikirim ke nomor telepon Anda');
      }, 1500);
    } else {
      this.showAlert('Error!', 'Tidak boleh ada yang kosong');
    }
  }
}
