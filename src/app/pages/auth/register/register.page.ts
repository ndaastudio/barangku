import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Browser } from '@capacitor/browser';
import { AuthService } from 'src/app/services/API/auth.service';
import { showAlert, showLoading } from 'src/app/helpers/functions';
import { LocalStorageService } from 'src/app/services/Database/local-storage.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  platform: any = null;
  nama: any = null;
  email: any = null;
  nomor_telepon: any = null;
  password: any = null;
  konfirmasi_password: any = null;
  kode_daftar: any = null;
  setuju: any = null;
  isValidKodeDaftar: boolean = false;
  isShowPw: boolean = false;
  inputTypePw: string = 'password';
  isShowConfirmPw: boolean = false;
  inputTypeConfirmPw: string = 'password';

  constructor(private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private auth: AuthService,
    private router: Router,
    private localStorage: LocalStorageService,) {
  }

  async ngOnInit() {
    this.platform = await this.localStorage.get('os');
  }

  async submitDaftar() {
    if (this.nama && this.email && this.nomor_telepon && this.password && this.konfirmasi_password) {
      if (this.setuju) {
        if (this.password == this.konfirmasi_password) {
          try {
            await showLoading(this.loadingCtrl, 'Sedang mendaftar...');
            const data = {
              nama: this.nama,
              email: this.email,
              nomor_telepon: this.nomor_telepon,
              password: this.password,
            };
            const results = await this.auth.register(data);
            this.nama = null;
            this.password = null;
            this.konfirmasi_password = null;
            this.setuju = false;
            await this.loadingCtrl.dismiss();
            await showAlert(this.alertCtrl, 'Berhasil!', results.message).then(() => {
              this.router.navigateByUrl('/login');
            });
          } catch (error: any) {
            await this.loadingCtrl.dismiss();
            await showAlert(this.alertCtrl, 'Error!', error.error.message);
          }
        } else {
          showAlert(this.alertCtrl, 'Error!', 'Konfirmasi password tidak sama');
        }
      } else {
        showAlert(this.alertCtrl, 'Error!', 'Harus menyetujui persyaratan');
      }
    } else {
      showAlert(this.alertCtrl, 'Error!', 'Tidak boleh ada yang kosong');
    }
  }

  async cekKodeDaftar() {
    if (this.kode_daftar) {
      try {
        await showLoading(this.loadingCtrl, 'Memeriksa kode daftar...');
        const results = await this.auth.getByKodeDaftar(this.kode_daftar);
        await this.loadingCtrl.dismiss();
        this.isValidKodeDaftar = true;
        this.nomor_telepon = results.data.nomor_telepon;
      } catch (error: any) {
        await this.loadingCtrl.dismiss();
        await showAlert(this.alertCtrl, 'Error!', error.error.message);
      }
    } else {
      showAlert(this.alertCtrl, 'Error!', 'Tidak boleh ada yang kosong');
    }
  }

  async hubungiAdmin() {
    const alertHubungiAdmin = await this.alertCtrl.create({
      header: 'Hubungi Admin',
      message: 'Lanjutkan untuk menghubungi admin?',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          cssClass: '!text-gray-500',
        }, {
          text: 'Ya',
          handler: () => {
            const waAdmin = `https://wa.me/6281367676651/?text=${encodeURIComponent('Halo admin, saya ingin mendaftar aplikasi Barangku. Bagaimana cara saya mendapatkan kode daftar? Terima kasih')}`;
            this.openBrowser(waAdmin);
          }
        }
      ]
    });
    await alertHubungiAdmin.present();
  }

  async openBrowser(url: string) {
    await Browser.open({ url: url });
  }

  syaratDanKetentuan() {
    this.openBrowser('https://barangku.web.id/syarat-dan-ketentuan');
  }

  showHidePw() {
    if (this.isShowPw) {
      this.inputTypePw = 'password';
      this.isShowPw = false;
    } else {
      this.inputTypePw = 'text';
      this.isShowPw = true;
    }
  }

  showHideConfirmPw() {
    if (this.isShowConfirmPw) {
      this.inputTypeConfirmPw = 'password';
      this.isShowConfirmPw = false;
    } else {
      this.inputTypeConfirmPw = 'text';
      this.isShowConfirmPw = true;
    }
  }
}
