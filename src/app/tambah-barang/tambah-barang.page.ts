import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tambah-barang',
  templateUrl: './tambah-barang.page.html',
  styleUrls: ['./tambah-barang.page.scss'],
})
export class TambahBarangPage implements OnInit {
  kategori: any;
  status: any;
  reminder: any;

  constructor() { }

  ngOnInit() {
  }
}
