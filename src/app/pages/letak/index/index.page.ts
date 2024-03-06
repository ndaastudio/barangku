import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LetakService as SQLiteLetakBarang } from 'src/app/services/Database/SQLite/letak.service';
import { LocalStorageService } from 'src/app/services/Database/local-storage.service';
import { showError, showLoading } from '../../../helpers/functions';
import { ILetakBarang } from 'src/app/interfaces/i-letak-barang';
import { ModalFilterLetakComponent } from 'src/app/components/modal-filter-letak/modal-filter-letak.component';
import { Subscription } from 'rxjs';

interface IFilter {
  kategori: string[],
  urutkan: string,
}

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage implements OnInit, OnDestroy {
  private subscribtions = new Subscription();

  isLoaded: boolean = false;
  platform: any = null;
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

  keyword: string | undefined;
  searchedBarang: ILetakBarang[] = [];
  isSearchBarang: boolean = false;

  //filter
  isFilterBarang: boolean = false;
  filteredBarang: ILetakBarang[] = [];

  optionFilterKategori: any = [];

  selectedFilter: IFilter = {
    kategori: [],
    urutkan: 'A-Z',
  };

  constructor(
    private localStorage: LocalStorageService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private router: Router,
    private sqliteLetakBarang: SQLiteLetakBarang,
    private alertCtrl: AlertController,
  ) { }

  async ngOnInit() {
    this.platform = await this.localStorage.get('os');
    this.isLoaded = false;
    let list_letak_barang_subs = this.sqliteLetakBarang.list_letak_barang.subscribe((list) => {
      this.dataLetakBarang = list;
      this.items = this.dataLetakBarang;
      if (this.dataLetakBarang.length > 0) {
        this.optionFilterKategori = this.dataLetakBarang.map((barang: any) => barang.kategori).filter((value: any, index: any, self: any) => self.indexOf(value) === index);
      }
    });
    this.subscribtions.add(list_letak_barang_subs);
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subscribtions.unsubscribe();
  }

  async loadData() {
    await showLoading(this.loadingCtrl, 'Memuat data...');
    this.sqliteLetakBarang.getAll().then(async () => {
      if (this.isSearchBarang) {
        await this.onSearchBarang({ target: { value: this.keyword } });
      }
      if(this.isFilterBarang){
        this.filterBarang();
      }
      await this.loadingCtrl.dismiss();
      this.isLoaded = true;
    }).catch((error) => {
      showError(this.alertCtrl, 'Error', error);
    });
  }

  async onSearchBarang(event: any) {
    this.keyword = event.target.value;
    let default_list = this.isFilterBarang ? this.filteredBarang : this.items;
    if (this.keyword === undefined) {
      this.dataLetakBarang = [...default_list];
      this.searchedBarang = [];
      this.isSearchBarang = false;
    } else {
      const normalizedQuery = this.keyword.toLowerCase();
      this.dataLetakBarang = default_list.filter(item => {
        return item.nama_barang.toLowerCase().includes(normalizedQuery) || item.letak_barang.toLowerCase().includes(normalizedQuery) || (item.kategori == 'Opsi Lainnya' ? item.kategori_lainnya.toLowerCase().includes(normalizedQuery) : item.kategori.toLowerCase().includes(normalizedQuery));
      });
      this.searchedBarang = [...this.dataLetakBarang];
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

  async openFilter() {
    const selected_kategori = this.selectedFilter.kategori.map((cat) => cat);
    let modalFilter = await this.modalCtrl.create({
      id: 'modal-filter-letak',
      component: ModalFilterLetakComponent,
      componentProps: {
        'kategori': this.optionFilterKategori,
        'selected_kategori': selected_kategori,
        'selected_urutkan': this.selectedFilter.urutkan,
      },
      backdropDismiss: false,
    });

    await modalFilter.present();

    const { data } = await modalFilter.onDidDismiss();
    if (data) {
      // do filter
      this.selectedFilter = data.filter;
      this.filterBarang();
    }
  }

  filterBarang() {
    let default_list = this.isSearchBarang ? this.searchedBarang : this.items;
    if (this.selectedFilter.kategori.length > 0) {
      this.dataLetakBarang = default_list.filter(item => {
        return (this.selectedFilter.kategori.includes(item.kategori) || this.selectedFilter.kategori.includes(item.kategori_lainnya));
      });
      this.filteredBarang = [...this.dataLetakBarang];
      this.isFilterBarang = true;
    } else {
      this.dataLetakBarang = default_list;
      this.filteredBarang = [];
      this.isFilterBarang = false;
    }

    switch (this.selectedFilter.urutkan) {
      case 'A-Z':
        this.dataLetakBarang = this.dataLetakBarang.sort((a: ILetakBarang, b: ILetakBarang) => (a.nama_barang > b.nama_barang) ? 1 : -1);
        break;
      case 'Z-A':
        this.dataLetakBarang = this.dataLetakBarang.sort((a: ILetakBarang, b: ILetakBarang) => b.nama_barang.localeCompare(a.nama_barang));
        break;
      case 'Baru Ditambahkan':
        this.dataLetakBarang = this.dataLetakBarang.sort((a: ILetakBarang, b: ILetakBarang) => b.id - a.id);
        break;
      case 'Terlama Ditambahkan':
        this.dataLetakBarang = this.dataLetakBarang.sort((a: ILetakBarang, b: ILetakBarang) => a.id - b.id);
        break;
    }
  }

  goToDetail(id: number) {
    this.navCtrl.navigateForward(['letak/show/' + id])
  }

  goToTambahBarang() {
    this.router.navigateByUrl('/letak/create');
  }

}
