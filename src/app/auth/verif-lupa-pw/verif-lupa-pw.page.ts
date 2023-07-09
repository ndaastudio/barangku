import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { APIService } from 'src/services/API/api.service';

@Component({
  selector: 'app-verif-lupa-pw',
  templateUrl: './verif-lupa-pw.page.html',
  styleUrls: ['./verif-lupa-pw.page.scss'],
})
export class VerifLupaPwPage implements OnInit {
  kode_lupa_password: any;
  password_baru: any;
  konfirmasi_password_baru: any;

  constructor(private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private apiService: APIService,
    private router: Router) {
  }

  ngOnInit() {
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

  submitResetPassword() {
    if (this.kode_lupa_password && this.password_baru && this.konfirmasi_password_baru) {
      if (this.password_baru == this.konfirmasi_password_baru) {
        this.showLoading('Sedang memproses...');
        const data = {
          kode_lupa_password: this.kode_lupa_password,
          password_baru: this.password_baru,
        };
        this.apiService.verifKodeLupaPw(data).then((result: any) => {
          this.kode_lupa_password = '';
          this.password_baru = '';
          this.konfirmasi_password_baru = '';
          this.loadingCtrl.dismiss();
          this.showAlert('Berhasil!', result.message).then(() => {
            this.router.navigateByUrl('/login');
          });
        }).catch((error: any) => {
          this.loadingCtrl.dismiss();
          this.showAlert('Error!', error.error.message);
        });
      } else {
        this.showAlert('Error!', 'Konfirmasi password baru tidak sama');
      }
    } else {
      this.showAlert('Error!', 'Tidak boleh ada yang kosong');
    }
  }

}
