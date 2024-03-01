import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

interface IFilter {
  kategori: string[],
  urutkan: string[],
}

@Component({
  selector: 'app-modal-filter-letak',
  templateUrl: './modal-filter-letak.component.html',
  styleUrls: ['./modal-filter-letak.component.scss'],
})
export class ModalFilterLetakComponent  implements OnInit {

  kategori: string[];
  urutkan: string[] = ['A-Z', 'Z-A', 'Baru Ditambahkan', 'Terlama Ditambahkan',];

  data_filter: IFilter;
  selected_kategori: string[];
  selected_urutkan: string;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
  ) {
    this.kategori = this.navParams.get('kategori');
    this.selected_kategori = this.navParams.get('selected_kategori');
    this.selected_urutkan = this.navParams.get('selected_urutkan');
    this.data_filter = {
      kategori: this.kategori,
      urutkan: this.urutkan,
    };
  }

  ngOnInit() {
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  handlePilihKategori(value: string) {
    if (this.selected_kategori.includes(value)) {
      this.selected_kategori = this.selected_kategori.filter((kategori: string) => kategori !== value);
    } else {
      this.selected_kategori.push(value);
    }
  }

  handlePilihUrutkan(value: string) {
    this.selected_urutkan = value;
  }

  resetFilter(){
    this.modalCtrl.dismiss({
      filter: {
        kategori: [],
        urutkan: 'A-Z',
      },
    });

  }

  confirmFilterOptions(){
    this.modalCtrl.dismiss({
      filter: {
        kategori: this.selected_kategori,
        urutkan: this.selected_urutkan,
      },
    });
  }

}
