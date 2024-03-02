import { Injectable } from '@angular/core';
import { SQLiteObject } from "@awesome-cordova-plugins/sqlite/ngx";
import { BehaviorSubject } from 'rxjs';
import { IGambarLetakBarang, ILetakBarang } from 'src/app/interfaces/i-letak-barang';

@Injectable({
  providedIn: 'root'
})
export class LetakService {

  private db!: SQLiteObject;
  letak_barang: BehaviorSubject<ILetakBarang | null> = new BehaviorSubject<ILetakBarang | null>(null);
  list_letak_barang: BehaviorSubject<ILetakBarang[]> = new BehaviorSubject<ILetakBarang[]>([]);
  gambar_letak_barang: BehaviorSubject<IGambarLetakBarang[]> = new BehaviorSubject<IGambarLetakBarang[]>([]);

  constructor() { }

  init(db: SQLiteObject) {
    this.db = db;
  }

  public async createTable() {
    try {
      await this.db.executeSql(`CREATE TABLE IF NOT EXISTS letak_barang (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nama_barang TEXT,
            kategori TEXT,
            kategori_lainnya TEXT DEFAULT NULL,
            jumlah_barang TEXT,
            letak_barang TEXT
        );`, []);
    } catch (error: any) {
      alert(error.message);
    }
  }

  public async createTableGambar() {
    try {
      await this.db.executeSql(`CREATE TABLE IF NOT EXISTS gambar_letak_barang (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_letak_barang INTEGER,
            gambar TEXT,
            FOREIGN KEY (id_letak_barang) REFERENCES letak_barang (id)
        );`, []);
    } catch (error: any) {
      alert(error.message);
    }
  }

  public async createGambar(id: number, nama: string) {
    try {
      const sql = `INSERT INTO gambar_letak_barang (id_letak_barang, gambar) VALUES (?, ?);`;
      const results = await this.db.executeSql(sql, [id, nama]);
      return results.insertId;
    } catch (error) {
      alert(error);
      return false;
    }
  }

  public async getGambarById(id: number) {
    try {
      this.gambar_letak_barang.next([]);
      const sql = `SELECT * FROM gambar_letak_barang WHERE id_letak_barang = ?;`;
      const results = await this.db.executeSql(sql, [id]);
      let data = [];
      for (let i = 0; i < results.rows.length; i++) {
        data.push(results.rows.item(i));
      }
      this.gambar_letak_barang.next(data);
      return data;
    } catch (error: any) {
      // debuging
      // throw new Error(JSON.stringify(error));
      // publish
      throw new Error("Terjadi kesalahan sistem! Silahkan hubungi admin Barangku!");
      // return [];
    }
  }

  public async deleteGambarByName(fileName: string) {
    try {
      const sql = `DELETE FROM gambar_letak_barang WHERE gambar = ?;`;
      await this.db.executeSql(sql, [fileName]);
      return true;
    } catch (error) {
      alert(error);
      return false;
    }
  }

  public async create(data: any) {
    try {
      const sql = `INSERT INTO letak_barang (nama_barang, kategori, kategori_lainnya, jumlah_barang, letak_barang) VALUES (?, ?, ?, ?, ?);`;
      const results = await this.db.executeSql(sql, [data.nama_barang, data.kategori, data.kategori_lainnya, data.jumlah_barang, data.letak_barang]);
      return results.insertId;
    } catch (error) {
      alert(error);
      return false;
    }
  }

  public async createWithCustomId(data: any) {
    try {
      const sql = `INSERT INTO letak_barang (id, nama_barang, kategori, kategori_lainnya, jumlah_barang, letak_barang) VALUES (?, ?, ?, ?, ?, ?);`;
      const results = await this.db.executeSql(sql, [data.id_letak_barang, data.nama_barang, data.kategori, data.kategori_lainnya, data.jumlah_barang, data.letak_barang]);
      return results;
    } catch (error) {
      alert(error);
      return false;
    }
  }

  public async getAll() {
    try {
      this.list_letak_barang.next([]);
      const sql = `SELECT * FROM letak_barang ORDER BY nama_barang ASC;`;
      const results = await this.db.executeSql(sql, []);
      let data = [];
      for (let i = 0; i < results.rows.length; i++) {
        data.push(results.rows.item(i));
      }
      this.list_letak_barang.next(data);
      return true;
    } catch (error: any) {
      return error.message;
    }
  }

  public async getAllGambar() {
    try {
      const sql = `SELECT * FROM gambar_letak_barang;`;
      const results = await this.db.executeSql(sql, []);
      let data = [];
      for (let i = 0; i < results.rows.length; i++) {
        data.push(results.rows.item(i));
      }
      return data;
    } catch (error) {
      alert(error);
      return [];
    }
  }

  public async getById(id: number) {
    try {
      this.letak_barang.next(null);
      const sql = `SELECT * FROM letak_barang WHERE id = ?;`;
      const results = await this.db.executeSql(sql, [id]);
      this.letak_barang.next(results.rows.item(0));
      return results.rows.item(0);
    } catch (error) {
      // debuging
      // throw new Error(JSON.stringify(error));
      // publish
      throw new Error("Terjadi kesalahan sistem! Silahkan hubungi admin Barangku!");
    }
  }

  public async getByKategori(kategori: string) {
    try {
      const sql = `SELECT * FROM letak_barang WHERE kategori = ?;`;
      const results = await this.db.executeSql(sql, [kategori]);
      let data = [];
      for (let i = 0; i < results.rows.length; i++) {
        data.push(results.rows.item(i));
      }
      return data;
    } catch (error) {
      alert(error);
      return null;
    }
  }

  public async update(data: any) {
    try {
      const sql = `UPDATE letak_barang SET nama_barang = ?, kategori = ?, kategori_lainnya = ?, jumlah_barang = ?, letak_barang = ? WHERE id = ?;`;
      await this.db.executeSql(sql, [data.nama_barang, data.kategori, data.kategori_lainnya, data.jumlah_barang, data.letak_barang, data.id]);
      return true;
    } catch (error) {
      // alert(error);
      // return false;
      return new Error("Terjadi kesalahan sistem! Silahkan hubungi admin Barangku!");
    }
  }

  public async deleteById(id: number) {
    try {
      const sql = `DELETE FROM letak_barang WHERE id = ?;`;
      await this.db.executeSql(sql, [id]);
      return true;
    } catch (error) {
      alert(error);
      return false;
    }
  }

  public async deleteGambarById(id: number) {
    try {
      const sql = `DELETE FROM gambar_letak_barang WHERE id = ?;`;
      await this.db.executeSql(sql, [id]);
      return true;
    } catch (error) {
      alert(error);
      return false;
    }
  }

  public async multipleFilter(kategori?: string[], progress?: number) {
    try {
      if (!kategori) kategori = [];

      let baseQuery = `SELECT * FROM barang `;
      let whereClause = '';
      let whereValues = [];

      if (kategori.length > 0) {
        whereClause += `kategori IN (${kategori.map(() => '?').join(', ')}) `;
        whereValues.push(...kategori);
      }

      if (progress !== null) {
        if (whereClause.length > 0) {
          whereClause += `AND progress = ? `;
        } else {
          whereClause += `progress = ? `;
        }
        whereValues.push(progress);
      }

      if (whereClause.length > 0) {
        baseQuery += `WHERE ${whereClause} `;
      }

      const results = await this.db.executeSql(baseQuery, whereValues);

      let data = [];

      for (let i = 0; i < results.rows.length; i++) {
        data.push(results.rows.item(i));
      }

      return data;
    } catch (error) {
      alert(error);
      return [];
    }
  }

  public async getKategoriAndCount() {
    try {
      const sql = `SELECT kategori, COUNT(*) as jumlah FROM letak_barang GROUP BY kategori;`;
      const results = await this.db.executeSql(sql, []);
      let data = [];
      for (let i = 0; i < results.rows.length; i++) {
        data.push(results.rows.item(i));
      }
      return data;
    } catch (error) {
      alert(error);
      return [];
    }
  }
}
