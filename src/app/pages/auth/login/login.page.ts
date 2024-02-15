import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Device } from '@capacitor/device';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { showAlert, showLoading } from 'src/app/helpers/functions';
import { AuthService } from 'src/app/services/API/auth.service';
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
    private notif: LocalNotifService) {
  }

  async ngOnInit() {
    this.platform = await this.localStorage.get('os');
  }

  async submitLogin() {
    if (this.nomor_telepon && this.password) {
      try {
        await showLoading(this.loadingCtrl, 'Loading...');
        const data = {
          nomor_telepon: `0${this.nomor_telepon}`,
          password: this.password,
          device_login: (await Device.getId()).identifier
        };
        const results = await this.auth.login(data);
        const dataBarang = await this.sqliteBarang.getAll();
        dataBarang.forEach(async (barang) => {
          await this.notif.create('1', 'Pengingat!', `Jangan lupa ${barang.nama_barang.toLowerCase()} ${barang.status.toLowerCase()}`, barang.id, new Date(barang.jadwal_notifikasi), `/barang/show/${barang.id}`);
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
}
