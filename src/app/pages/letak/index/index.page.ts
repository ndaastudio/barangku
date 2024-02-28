import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LetakService as SQLiteLetakBarang } from 'src/app/services/Database/SQLite/letak.service';
import { LocalStorageService } from 'src/app/services/Database/local-storage.service';
import { showError, showLoading } from '../../../helpers/functions';
import { DataRefreshService } from 'src/app/services/Database/data-refresh.service';
import { ILetakBarang } from 'src/app/interfaces/i-letak-barang';

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
  selectedWaktu: any = null;
  selectedAbjad: any = 'A-Z';
  optionFilterKategori: any = [];
  optionFilterWaktu: any = ['Baru Ditambahkan', 'Terlama Ditambahkan'];
  optionFilterAbjad: any = ['A-Z', 'Z-A'];
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
  items: ILetakBarang[] = [];

  constructor(
    private localStorage: LocalStorageService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private dataRefresh: DataRefreshService,
    private navCtrl: NavController,
    private router: Router,
    private sqliteLetakBarang: SQLiteLetakBarang,
    private alertCtrl: AlertController,
  ) { }

  async ngOnInit() {
    this.platform = await this.localStorage.get('os');
    this.isLoaded = false;
    this.sqliteLetakBarang.list_letak_barang.subscribe((list) => {
      this.dataLetakBarang = list;
      this.items = this.dataLetakBarang;
      if (this.dataLetakBarang.length > 0) {
        this.optionFilterKategori = this.dataLetakBarang.map((barang: any) => barang.kategori).filter((value: any, index: any, self: any) => self.indexOf(value) === index);
      }
    });
    this.loadData();
  }

  async loadData() {
    await showLoading(this.loadingCtrl, 'Memuat data...');
    this.sqliteLetakBarang.getAll().then(async () => {
      await this.loadingCtrl.dismiss();
      this.isLoaded = true;
    }).catch((error) => {
      showError(this.alertCtrl, 'Error', error);
    });
  }

  async onSearchBarang(event: any) {
    const keyword: string | undefined = event.target.value;
    if (keyword === undefined) {
      this.dataLetakBarang = [...this.items];
      this.isSearchBarang = false;
    } else {
      const normalizedQuery = keyword.toLowerCase();
      this.dataLetakBarang = this.items.filter(item => {
        return item.nama_barang.toLowerCase().includes(normalizedQuery) || item.letak_barang.toLowerCase().includes(normalizedQuery) || (item.kategori == 'Opsi Lainnya' ? item.kategori_lainnya.toLowerCase().includes(normalizedQuery) :  item.kategori.toLowerCase().includes(normalizedQuery));
      });
      this.isSearchBarang = true;
    }
  }

  async handleRefresh(event: any) {
    this.isLoaded = false;
    this.dataLetakBarang = [];
    setTimeout(async () => {
      await event.target.complete();
      await this.loadData();
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

  handlePilihAbjad(value: string) {
    if (this.selectedAbjad === value) {
      this.selectedAbjad = null;
      return;
    }
    this.selectedAbjad = value;
  }

  setOpenOptionsFilter(isOpen: boolean) {
    this.isOptionsFilterOpen = isOpen;
  }

  onWillDismissModal(isOpen: boolean) {
    this.isOptionsFilterOpen = isOpen;
  }

  goToDetail(id: number) {
    this.navCtrl.navigateForward(['letak/show/' + id])
  }

  goToTambahBarang() {
    this.router.navigateByUrl('/letak/create');
  }

}
