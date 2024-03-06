import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { showAlert, showLoading } from 'src/app/helpers/functions';
import { AuthService } from 'src/app/services/API/auth.service';
import { CheckUpdateService } from 'src/app/services/App/check-update.service';
import { LocalNotifService } from 'src/app/services/App/local-notif.service';
import { BarangService as SQLiteBarang } from 'src/app/services/Database/SQLite/barang.service';
import { LocalStorageService } from 'src/app/services/Database/local-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  platform: any = null;
  nomor_telepon: any = null;
  password: any = null;
  registered_email: any = null;
  isShowPw: boolean = false;
  inputTypePw: string = 'password';
  isModalOpen: boolean = false;

  constructor(private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private auth: AuthService,
    private router: Router,
    private localStorage: LocalStorageService,
    private modalCtrl: ModalController,
    private sqliteBarang: SQLiteBarang,
    private notif: LocalNotifService,
    private checkUpdate: CheckUpdateService,
  ) {
  }

  async ngOnInit() {
    this.platform = await this.localStorage.get('os');
  }

  async submitLogin(konfirmasiLogin?: number) {
    if (this.nomor_telepon && this.password) {
      try {
        await showLoading(this.loadingCtrl, 'Loading...');
        const isUpdate = await this.checkUpdate.isUpdate();
        if (isUpdate) {
          await this.loadingCtrl.dismiss();
          await this.router.navigateByUrl('/update');
          return;
        }
        const data = {
          nomor_telepon: `0${this.nomor_telepon}`,
          password: this.password,
          konfirmasi_login: konfirmasiLogin ? konfirmasiLogin : 0
        };
        const results = await this.auth.login(data);
        if (!results.status) {
          if (results.message.confirm) {
            await this.loadingCtrl.dismiss();
            await this.presentConfirm(results.message.confirm);
            return;
          }
        }
        const dataBarang = await this.sqliteBarang.getAll();
        dataBarang.forEach(async (barang) => {
          let notifications = await this.sqliteBarang.getNotifByIdBarang(barang.id);
          notifications.forEach(async (notif) => {
            await this.notif.create('1', 'Pengingat!', `Jangan lupa ${barang.nama_barang.toLowerCase()} ${barang.status.toLowerCase()}`, notif.id, new Date(notif.jadwal_notifikasi), `/barang/show/${barang.id}`);
          });
        });
        this.localStorage.set('access_token', results.access_token);
        this.localStorage.set('profile', results.data);
        this.nomor_telepon = null;
        this.password = null;
        await this.loadingCtrl.dismiss();
        await this.router.navigateByUrl('/tabs/barang');
      } catch (error: any) {
        await this.loadingCtrl.dismiss();
        await showAlert(this.alertCtrl, 'Error!', error.error.message);
      };
    } else {
      showAlert(this.alertCtrl, 'Error!', 'Tidak boleh ada yang kosong');
    }
  }

  async submitResetPassword() {
    if (this.registered_email) {
      try {
        await showLoading(this.loadingCtrl, 'Sedang memproses...');
        const isUpdate = await this.checkUpdate.isUpdate();
        if (isUpdate) {
          await this.loadingCtrl.dismiss();
          await this.router.navigateByUrl('/update');
          return;
        }
        const data = {
          email: this.registered_email
        };
        const results = await this.auth.sendKodeLupaPw(data);
        this.registered_email = null;
        await this.loadingCtrl.dismiss();
        await this.modalCtrl.dismiss();
        await showAlert(this.alertCtrl, 'Berhasil!', results.message).then(() => {
          this.router.navigateByUrl('/verif-lupa-pw');
        });
      } catch (error: any) {
        await this.loadingCtrl.dismiss();
        await showAlert(this.alertCtrl, 'Error!', error.error.message);
      }
    } else {
      showAlert(this.alertCtrl, 'Error!', 'Tidak boleh ada yang kosong');
    }
  }

  goToVerifLupaPw() {
    this.modalCtrl.dismiss();
    this.router.navigateByUrl('/verif-lupa-pw');
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

  setOpenModal(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  onWillDismissModal(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  async presentConfirm(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Konfirmasi Login',
      message: message,
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          cssClass: '!text-gray-500'
        }, {
          text: 'Ya',
          handler: () => {
            this.submitLogin(1);
          }
        }
      ]
    });

    await alert.present();
  }
}
