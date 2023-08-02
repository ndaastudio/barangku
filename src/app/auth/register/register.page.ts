import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { APIService } from 'src/services/API/api.service';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  nama: any;
  email: any;
  nomor_telepon: any;
  password: any;
  konfirmasi_password: any;
  kode_daftar: any;
  setuju: any;
  isValidKodeDaftar: boolean = false;

  constructor(private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private apiService: APIService,
    private router: Router) {
  }

  async showLoading(message: string) {
    const loading = await this.loadingCtrl.create({
      message: message,
    });
    await loading.present();
  }

  async showAlert(header: string, message: string): Promise<void> {
    return new Promise<void>(async (resolve) => {
      const alert = await this.alertCtrl.create({
        header: header,
        message: message,
        buttons: [{
          text: 'OK',
          handler: () => {
            resolve();
          }
        }]
      });
      await alert.present();
    });
  }

  ngOnInit() {
  }

  submitDaftar() {
    if (this.nama && this.email && this.nomor_telepon && this.password && this.konfirmasi_password) {
      if (this.setuju) {
        if (this.password == this.konfirmasi_password) {
          this.showLoading('Sedang mendaftar...');
          const data = {
            nama: this.nama,
            email: this.email,
            nomor_telepon: this.nomor_telepon,
            password: this.password,
          };
          this.apiService.registerAkun(data).then((result: any) => {
            this.nama = '';
            this.password = '';
            this.konfirmasi_password = '';
            this.setuju = false;
            this.loadingCtrl.dismiss().then(() => {
              this.showAlert('Berhasil!', result.message).then(() => {
                this.router.navigateByUrl('/login');
              });
            });
          }).catch((error: any) => {
            this.loadingCtrl.dismiss();
            this.showAlert('Error!', error.error.message);
          });
        } else {
          this.showAlert('Error!', 'Konfirmasi password tidak sama');
        }
      } else {
        this.showAlert('Error!', 'Harus menyetujui persyaratan');
      }
    } else {
      this.showAlert('Error!', 'Tidak boleh ada yang kosong');
    }
  }

  cekKodeDaftar() {
    if (this.kode_daftar) {
      this.showLoading('Memeriksa kode daftar...');
      this.apiService.getAkunByKodeDaftar(this.kode_daftar).then((result: any) => {
        this.loadingCtrl.dismiss();
        this.isValidKodeDaftar = true;
        this.nomor_telepon = result.data.nomor_telepon;
      }).catch((error: any) => {
        this.loadingCtrl.dismiss();
        this.showAlert('Error!', error.error.message);
      });
    } else {
      this.showAlert('Error!', 'Tidak boleh ada yang kosong');
    }
  }

  hubungiAdmin() {
    const waAdmin = `https://wa.me/6285214283748/?text=${encodeURIComponent('Halo admin, saya ingin mendaftar aplikasi Barangku. Bagaimana cara saya mendapatkan kode daftar? Terima kasih')}`;
    this.openBrowser(waAdmin);
  }

  async openBrowser(url: string) {
    await Browser.open({ url: url });
  }

}
