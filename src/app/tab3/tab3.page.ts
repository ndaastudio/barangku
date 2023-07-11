import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { APIService } from 'src/services/API/api.service';
import { StorageService } from 'src/services/LocalStorage/storage.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  nama: any;
  email: any;
  nomor_telepon: any;
  jenis_akun: any;

  constructor(private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private storageService: StorageService,
    private apiService: APIService) {
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: [{
        text: 'OK',
      }]
    });
    await alert.present();
  }

  async showLoading(message: string) {
    const loading = await this.loadingCtrl.create({
      message: message,
    });
    await loading.present();
  }

  async ngOnInit() {
    const profile = await this.storageService.get('profile');
    this.nama = profile.nama;
    this.email = profile.email;
    this.nomor_telepon = profile.nomor_telepon;
    this.jenis_akun = profile.jenis_akun;
  }

  goToEditProfil() {
    this.router.navigateByUrl('/edit-profil');
  }

  submitSinkronisasi() {
    this.showAlert('Error!', 'Fitur ini belum tersedia');
  }

  async submitKeluar() {
    const alert = await this.alertCtrl.create({
      header: 'Keluar',
      message: 'Anda yakin ingin keluar?',
      buttons: [{
        text: 'OK',
        handler: async () => {
          const token = await this.storageService.get('access_token');
          this.showLoading('Loading...');
          this.apiService.logoutAkun(token).then(() => {
            this.storageService.clear();
            this.loadingCtrl.dismiss();
            this.router.navigateByUrl('/login');
          }).catch((error) => {
            this.loadingCtrl.dismiss();
            this.showAlert('Error!', error.error.message);
          });
        }
      },
      {
        text: 'Batal',
        role: 'cancel',
      }]
    });
    await alert.present();
  }
}
