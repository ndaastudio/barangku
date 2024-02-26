import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from "@awesome-cordova-plugins/sqlite/ngx";
import { BarangService } from './barang.service';
import { showError } from 'src/app/helpers/functions';
import { AlertController } from '@ionic/angular';
import { LetakService } from './letak.service';

@Injectable({
  providedIn: 'root'
})
export class InitDbService {

  private db!: SQLiteObject;

  constructor(
    private sqlite: SQLite,
    private barang: BarangService,
    private alertCtrl: AlertController,
    private letak: LetakService,
    ) {
  }

  async init() {
    try {
      this.db = await this.sqlite.create({
        name: 'barangku.db',
        location: 'default'
      });
      this.barang.init(this.db);
      this.letak.init(this.db);
      await this.barang.createTable();
      await this.barang.createTableNotif();
      await this.barang.createTableGambar();
    } catch (error: any) {
      showError(this.alertCtrl, 'Error', error);
    }
  }
}
