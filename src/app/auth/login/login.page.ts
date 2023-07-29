import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Device } from '@capacitor/device';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { APIService } from 'src/services/API/api.service';
import { StorageService } from 'src/services/LocalStorage/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  nomor_telepon: any;
  password: any;
  registered_email: any;

  constructor(private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private apiService: APIService,
    private router: Router,
    private storageService: StorageService,
    private modalCtrl: ModalController) {
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

  async showLoading(message: string) {
    const loading = await this.loadingCtrl.create({
      message: message,
    });
    await loading.present();
  }

  async checkLoggedIn() {
    const token = await this.storageService.get('access_token');
    if (token) {
      this.router.navigateByUrl('/tabs/tab1');
    }
  }

  ngOnInit() {
    this.checkLoggedIn();
  }

  async submitLogin() {
    if (this.nomor_telepon && this.password) {
      this.showLoading('Loading...');
      const data = {
        nomor_telepon: `0${this.nomor_telepon}`,
        password: this.password,
        device_login: (await Device.getId()).identifier
      };
      this.apiService.loginAkun(data).then((result: any) => {
        this.storageService.set('access_token', result.access_token);
        this.storageService.set('profile', result.data);
        this.nomor_telepon = '';
        this.password = '';
        this.loadingCtrl.dismiss();
        this.router.navigateByUrl('/tabs/tab1');
      }).catch((error: any) => {
        this.loadingCtrl.dismiss();
        this.showAlert('Error!', error.error.message);
      });
    } else {
      this.showAlert('Error!', 'Tidak boleh ada yang kosong');
    }
  }

  submitResetPassword() {
    if (this.registered_email) {
      this.showLoading('Sedang memproses...');
      const data = {
        email: this.registered_email
      };
      this.apiService.sendKodeLupaPw(data).then((result: any) => {
        this.registered_email = '';
        this.loadingCtrl.dismiss();
        this.modalCtrl.dismiss();
        this.showAlert('Berhasil!', result.message).then(() => {
          this.router.navigateByUrl('/verif-lupa-pw');
        });
      }).catch((error: any) => {
        this.loadingCtrl.dismiss();
        this.showAlert('Error!', error.error.message);
      });
    } else {
      this.showAlert('Error!', 'Tidak boleh ada yang kosong');
    }
  }

  goToVerifLupaPw() {
    this.modalCtrl.dismiss();
    this.router.navigateByUrl('/verif-lupa-pw');
  }
}
