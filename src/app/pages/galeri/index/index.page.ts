import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/services/Database/local-storage.service';
import { BarangService as SQLiteBarang } from 'src/app/services/Database/SQLite/barang.service';
import { PhotoService } from 'src/app/services/App/photo.service';
import { AnimationController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DataRefreshService } from 'src/app/services/Database/data-refresh.service';
import { LetakService as SQLiteLetakBarang } from 'src/app/services/Database/SQLite/letak.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage implements OnInit {
  platform: any = null;
  dataGaleri: any = [];
  isViewFull: boolean = false;
  urlFullImage: any;
  idBarang: any;
  segment: string = 'aksi';
  dataAksi: any = [];
  dataLetak: any = [];

  constructor(private localStorage: LocalStorageService,
    private sqliteBarang: SQLiteBarang,
    private sqliteLetakBarang: SQLiteLetakBarang,
    private photo: PhotoService,
    private animationCtrl: AnimationController,
    private router: Router,
    private dataRefresh: DataRefreshService,
  ) { }

  async ngOnInit() {
    this.platform = await this.localStorage.get('os');
    this.initGetData();
    this.dataRefresh.refreshedData.subscribe(() => {
      this.initGetData();
    });
  }

  async initGetData() {
    this.dataAksi = await this.sqliteBarang.getAllGambar();
    this.dataLetak = await this.sqliteLetakBarang.getAllGambar();
    this.segmentChanged();
  }

  segmentChanged() {
    const resultsGaleri = this.segment == 'aksi' ? this.dataAksi : this.dataLetak;
    this.dataGaleri = [];
    resultsGaleri.forEach(async (data: any) => {
      const loadedGambar = await this.photo.load(data.gambar);
      this.dataGaleri.push({ id: data.id_barang, gambar: loadedGambar });
    });
  }

  async handleRefresh(event: any) {
    this.dataGaleri = [];
    setTimeout(async () => {
      await event.target.complete();
      await this.ngOnInit();
    }, 1500);
  }

  viewFull(isFull: boolean, index: number | undefined, id: number | undefined) {
    this.isViewFull = isFull;
    if (index != undefined) {
      this.urlFullImage = this.dataGaleri[index].gambar.webviewPath;
      this.idBarang = id;
    }
  }

  goToShowBarang(id: number) {
    this.router.navigateByUrl(`/barang/show/${id}`);
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

}
