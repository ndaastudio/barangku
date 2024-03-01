import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, AnimationController, IonInput, LoadingController, NavController, Platform, PopoverController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { showError, showLoading } from 'src/app/helpers/functions';
import { IGambarLetakBarang, ILetakBarang } from 'src/app/interfaces/i-letak-barang';
import { LetakService } from 'src/app/services/Database/SQLite/letak.service';
import { LocalStorageService } from 'src/app/services/Database/local-storage.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.page.html',
  styleUrls: ['./show.page.scss'],
})
export class ShowPage implements OnInit, OnDestroy {
  @ViewChild('inputPindahLokasi') inputPindahLokasi!: IonInput;
  private subscribtions = new Subscription();
  
  isViewFull: boolean = false;
  urlFullImage: any;
  platform: any;
  id: number;
  letak_barang?: ILetakBarang | null;
  gambar_letak_barang?: IGambarLetakBarang[];
  isLoaded: boolean = false;

  // pindah lokasi
  isModalPindahkanOpen: boolean = false;
  formPindah: FormGroup | any;

  constructor(
    private localStorage: LocalStorageService,
    private animationCtrl: AnimationController,
    private activatedRoute: ActivatedRoute,
    private letakBarangService: LetakService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private popoverCtrl: PopoverController,
    private navCtrl: NavController,
    private router: Router,
    private fb: FormBuilder,
    ) {
      this.id = parseInt(this.activatedRoute.snapshot.params['id']);
      this.formPindah = this.fb.group({
        lokasi_pindah_barang: [null, [Validators.required, Validators.maxLength(50)]],
      });
     }

  async ngOnInit() {
    this.isLoaded = false;
    this.platform = await this.localStorage.get('os');
    let letak_barang_subs = this.letakBarangService.letak_barang.subscribe((detail) => {
      this.letak_barang = detail;
    });
    this.subscribtions.add(letak_barang_subs);
    let gambar_letak_barang_subs = this.letakBarangService.gambar_letak_barang.subscribe((gambar) => {
      this.gambar_letak_barang = gambar;
    });
    this.subscribtions.add(gambar_letak_barang_subs);
    await this.loadData();
  }

  ngOnDestroy(): void {
    this.subscribtions.unsubscribe();
  }

  async loadData(){
    try{
      await showLoading(this.loadingCtrl, 'Memuat data...');
      await this.letakBarangService.getById(this.id);
      await this.letakBarangService.getGambarById(this.id);
      setTimeout(async ()=>{
        this.isLoaded = true;
      }, 500);
    } catch (e: any) {
      showError(this.alertCtrl, 'Error', e);
    }    
    setTimeout(async ()=>{
      await this.loadingCtrl.dismiss();
    }, 500);
  }

  async handleRefresh(event: any) {
    this.isLoaded = false;
    setTimeout(async () => {
      await event.target.complete();
      await this.loadData();
    }, 500);
  }

  goToEditLetakBarang(){
    this.popoverCtrl.dismiss();
    this.navCtrl.navigateForward([`/letak/edit/${this.id}`]);
  }

  async hapusData(){
    this.popoverCtrl.dismiss();
    const alertHapusData = await this.alertCtrl.create({
      header: 'Konfirmasi',
      message: 'Anda yakin ingin menghapus data ini?',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          cssClass: '!text-gray-500'
        },
        {
          text: 'Ya',
          handler: async () => {
            // proses delete
            // hapus gambar
            this.gambar_letak_barang?.forEach(async (gambar) => {
              await this.letakBarangService.deleteGambarById(gambar.id);
            });
            // hapus letak barang
            await this.letakBarangService.deleteById(this.id);
            await this.letakBarangService.getAll();
            await this.letakBarangService.getById(this.id);
            await this.router.navigateByUrl('/tabs/barang');
          },
          cssClass: '!text-red-500'
        }
      ]
    });
    await alertHapusData.present();
  }

  onWillDismissModalPindahkan(isOpen: boolean){
    this.isModalPindahkanOpen = isOpen;
  }

  setOpenModalPindahkan(isOpen: boolean){
    this.formPindah.patchValue({ lokasi_pindah_barang: null });
    this.isModalPindahkanOpen = isOpen;
  }

  onDidModalPindahkanPresent() {
    this.inputPindahLokasi.setFocus();
  }

  ubahLokasi(){
    this.isModalPindahkanOpen = false;

  }

  viewFull(isFull: boolean, index: number | undefined) {
    this.isViewFull = isFull;
    if (index != undefined) {
      this.urlFullImage = 'assets/images/upload.png';
    }
  }

  enterAnimation = (baseEl: HTMLElement) => {
    const root = baseEl.shadowRoot;
    const backdropAnimation = this.animationCtrl
      .create()
      .addElement(root?.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');
    const wrapperAnimation = this.animationCtrl
      .create()
      .addElement(root?.querySelector('.modal-wrapper')!)
      .keyframes([
        { offset: 0, opacity: '0', transform: 'scale(0)' },
        { offset: 1, opacity: '0.99', transform: 'scale(1)' },
      ]);
    return this.animationCtrl
      .create()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(300)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  leaveAnimation = (baseEl: HTMLElement) => {
    return this.enterAnimation(baseEl).direction('reverse');
  };
    
  get lokasi_pindah_barang() {
    return this.formPindah.get('lokasi_pindah_barang');
  }

}
