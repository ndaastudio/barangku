import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from "@awesome-cordova-plugins/sqlite/ngx";
import { BarangService } from './barang.service';

@Injectable({
  providedIn: 'root'
})
export class InitDbService {

  private db!: SQLiteObject;

  constructor(private sqlite: SQLite,
    private barang: BarangService) {
  }

  async init() {
    try {
      this.db = await this.sqlite.create({
        name: 'barangku.db',
        location: 'default'
      });
      this.barang.init(this.db);
      await this.barang.createTable();
      await this.barang.createTableGambar();
    } catch (error) {
      alert(error);
    }
  }
}
