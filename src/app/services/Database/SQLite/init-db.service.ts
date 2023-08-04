import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from "@awesome-cordova-plugins/sqlite/ngx";
import { BarangService } from './barang.service';
import { JasaService } from './jasa.service';

@Injectable({
  providedIn: 'root'
})
export class InitDbService {

  private db!: SQLiteObject;

  constructor(private sqlite: SQLite,
    private barang: BarangService,
    private jasa: JasaService) {
  }

  async init() {
    try {
      this.db = await this.sqlite.create({
        name: 'barangku.db',
        location: 'default'
      });
      this.barang.init(this.db);
      this.jasa.init(this.db);
      await this.barang.createTable();
      await this.barang.createTableGambar();
      await this.jasa.createTable();
      await this.jasa.createTableGambar();
    } catch (error) {
      alert(error);
    }
  }
}
