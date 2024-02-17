import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  tabs: any;

  constructor(
  ) { }

  async ngOnInit() {
    this.tabs = [
      { url: 'barang', icon: 'color-wand', label: 'Aksi' },
      { url: 'letak', icon: 'file-tray-stacked', label: 'Letak' },
      { url: 'galeri', icon: 'images', label: 'Galeri' },
      { url: 'analytic', icon: 'stats-chart', label: 'Statistik' },
    ];
  }

}
