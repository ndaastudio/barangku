import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  nama: any;
  nomor_telepon: any;
  password: any;
  konfirmasi_password: any;
  kode_daftar: any;
  isValidKodeDaftar: boolean = false;

  constructor(private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) {
  }

  async showLoading(message: string) {
    const loading = await this.loadingCtrl.create({
      message: message,
    });
    await loading.present();
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  ngOnInit() {
  }

  submitDaftar() {
    if (this.nama && this.nomor_telepon && this.password && this.konfirmasi_password) {
      if (this.password == this.konfirmasi_password) {
        this.showLoading('Sedang mendaftar...');
        setTimeout(() => {
          this.loadingCtrl.dismiss();
          this.showAlert('Berhasil!', 'Akun telah didaftarkan');
        }, 1500);
      } else {
        this.showAlert('Error!', 'Konfirmasi password tidak sama');
      }
    } else {
      this.showAlert('Error!', 'Tidak boleh ada yang kosong');
    }
  }

  cekKodeDaftar() {
    if (this.kode_daftar) {
      this.showLoading('Memeriksa kode daftar...');
      setTimeout(() => {
        this.loadingCtrl.dismiss();
        this.isValidKodeDaftar = true;
        this.nomor_telepon = '081234567890';
      }, 1500);
    } else {
      this.showAlert('Error!', 'Tidak boleh ada yang kosong');
    }
  }

  hubungiAdmin() {
  }

}
