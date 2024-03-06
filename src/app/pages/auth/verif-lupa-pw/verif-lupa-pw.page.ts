import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { showAlert, showLoading } from 'src/app/helpers/functions';
import { AuthService } from 'src/app/services/API/auth.service';
import { CheckUpdateService } from 'src/app/services/App/check-update.service';
import { LocalStorageService } from 'src/app/services/Database/local-storage.service';

@Component({
  selector: 'app-verif-lupa-pw',
  templateUrl: './verif-lupa-pw.page.html',
  styleUrls: ['./verif-lupa-pw.page.scss'],
})
export class VerifLupaPwPage implements OnInit {
  platform: any = null;
  kode_lupa_password: any = null;
  password_baru: any = null;
  konfirmasi_password_baru: any = null;
  isShowPw: boolean = false;
  inputTypePw: string = 'password';
  isShowConfirmPw: boolean = false;
  inputTypeConfirmPw: string = 'password';

  constructor(private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private auth: AuthService,
    private router: Router,
    private localStorage: LocalStorageService,
    private checkUpdate: CheckUpdateService,) {
  }

  async ngOnInit() {
    this.platform = await this.localStorage.get('os');
  }

  async submitResetPassword() {
    if (this.kode_lupa_password && this.password_baru && this.konfirmasi_password_baru) {
      if (this.password_baru == this.konfirmasi_password_baru) {
        try {
          showLoading(this.loadingCtrl, 'Sedang memproses...');
          const isUpdate = await this.checkUpdate.isUpdate();
          if (isUpdate) {
            await this.loadingCtrl.dismiss();
            await this.router.navigateByUrl('/update');
            return;
          }
          const data = {
            kode_lupa_password: this.kode_lupa_password,
            password_baru: this.password_baru,
          };
          const results = await this.auth.verifKodeLupaPw(data);
          this.kode_lupa_password = null;
          this.password_baru = null;
          this.konfirmasi_password_baru = null;
          await this.loadingCtrl.dismiss();
          await showAlert(this.alertCtrl, 'Berhasil!', results.message).then(() => {
            this.router.navigateByUrl('/login');
          });
        } catch (error: any) {
          await this.loadingCtrl.dismiss();
          await showAlert(this.alertCtrl, 'Error!', error.error.message);
        }
      } else {
        showAlert(this.alertCtrl, 'Error!', 'Konfirmasi password baru tidak sama');
      }
    } else {
      showAlert(this.alertCtrl, 'Error!', 'Tidak boleh ada yang kosong');
    }
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
