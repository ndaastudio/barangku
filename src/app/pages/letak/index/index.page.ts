import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { LocalStorageService } from 'src/app/services/Database/local-storage.service';
import { showLoading } from '../../../helpers/functions';
import { DataRefreshService } from 'src/app/services/Database/data-refresh.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage implements OnInit {

  isOptionsFilterOpen: boolean = false;
  isSearchBarang: boolean = false;
  isLoaded: boolean = false;
  platform: any = null;
  selectedKategori: any = [];
  selectedProgress: any = null;
  selectedWaktu: any = null;
  optionFilterKategori: any = [];
  optionFilterProgress: any = [0, 1];
  optionFilterWaktu: any = ['Baru Ditambahkan', 'Terlama Ditambahkan'];
  optionsKategori: any = [
    'Fashion',
    'Kuliner',
    'Elektronik',
    'Kesehatan',
    'Olahraga',
    'Otomotif',
    'Kecantikan',
    'Pendidikan',
    'Peralatan',
    'Office',
  ].sort();
  dataLetakBarang: any = [];

  constructor(
    private localStorage: LocalStorageService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private dataRefresh: DataRefreshService,
    ) { }

  async ngOnInit() {
    this.platform = await this.localStorage.get('os');
    this.isLoaded = false;
    await showLoading(this.loadingCtrl, 'Memuat data...');
    await this.loadingCtrl.dismiss();
    this.isLoaded = true;
    this.dataRefresh.refreshedData.subscribe(() => {
      this.initGetData();
    });
  }

  async initGetData() {
    // const data = await this.sqliteBarang.getAll();
    // this.dataBarang = data;
    // this.optionFilterKategori = this.dataBarang.map((barang: any) => barang.kategori).filter((value: any, index: any, self: any) => self.indexOf(value) === index);
  }

  async onSearchBarang(event: any) {
    const keyword = event.target.value;
    if (keyword.length == 0) {
      // this.initGetData();
      // this.isSearchBarang = false;
      return;
    }
    // const data = await this.sqliteBarang.search(keyword);
    // this.dataBarang = data;
    // this.isSearchBarang = true;
  }

  async handleRefresh(event: any) {
    this.isLoaded = false;
    this.dataLetakBarang = [];
    setTimeout(async () => {
      await event.target.complete();
      await this.ngOnInit();
    }, 1500);
  }

  async confirmFilterOptions() {
    this.modalCtrl.dismiss();
    // if (this.selectedKategori.length == 0 && this.selectedProgress == null && this.selectedWaktu == null) {
    //   this.initGetData();
    //   return;
    // }
    // const data = await this.sqliteBarang.multipleFilter(this.selectedKategori, this.selectedProgress, this.selectedWaktu);
    // this.dataBarang = data;
    // this.isSearchBarang = true;
  }

  handlePilihKategori(value: string) {
    if (this.selectedKategori.includes(value)) {
      this.selectedKategori = this.selectedKategori.filter((kategori: string) => kategori !== value);
    } else {
      this.selectedKategori.push(value);
    }
  }

  handlePilihWaktu(value: string) {
    if (this.selectedWaktu === value) {
      this.selectedWaktu = null;
      return;
    }
    this.selectedWaktu = value;
  }

  setOpenOptionsFilter(isOpen: boolean) {
    this.isOptionsFilterOpen = isOpen;
  }

  onWillDismissModal(isOpen: boolean) {
    this.isOptionsFilterOpen = isOpen;
  }

}
