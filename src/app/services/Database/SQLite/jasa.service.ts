import { Injectable } from '@angular/core';
import { SQLiteObject } from "@awesome-cordova-plugins/sqlite/ngx";

@Injectable({
  providedIn: 'root'
})
export class JasaService {

  private db!: SQLiteObject;

  constructor() { }

  init(db: SQLiteObject) {
    this.db = db;
  }

  public async createTable() {
    try {
      await this.db.executeSql(`CREATE TABLE IF NOT EXISTS jasa (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nama_jasa TEXT,
            kategori TEXT,
            jumlah_jasa TEXT,
            letak_jasa TEXT,
            keterangan TEXT,
            jadwal_rencana DATETIME,
            jadwal_notifikasi DATETIME DEFAULT NULL,
            progress INTEGER DEFAULT 0
        );`, []);
    } catch (error) {
      alert(error);
    }
  }

  public async createTableGambar() {
    try {
      await this.db.executeSql(`CREATE TABLE IF NOT EXISTS gambar_jasa (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_jasa INTEGER,
            gambar TEXT,
            FOREIGN KEY (id_jasa) REFERENCES jasa (id)
        );`, []);
    } catch (error) {
      alert(error);
    }
  }

  public async createGambar(id: number, nama: string) {
    try {
      const sql = `INSERT INTO gambar_jasa (id_jasa, gambar) VALUES (?, ?);`;
      const results = await this.db.executeSql(sql, [id, nama]);
      return results.insertId;
    } catch (error) {
      alert(error);
      return false;
    }
  }

  public async getGambarById(id: number) {
    try {
      const sql = `SELECT * FROM gambar_jasa WHERE id_jasa = ?;`;
      const results = await this.db.executeSql(sql, [id]);
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

  public async deleteGambarByName(fileName: string) {
    try {
      const sql = `DELETE FROM gambar_jasa WHERE gambar = ?;`;
      await this.db.executeSql(sql, [fileName]);
      return true;
    } catch (error) {
      alert(error);
      return false;
    }
  }

  public async create(data: any) {
    try {
      const sql = `INSERT INTO jasa (nama_jasa, kategori, jumlah_jasa, letak_jasa, keterangan, jadwal_rencana, jadwal_notifikasi) VALUES (?, ?, ?, ?, ?, ?, ?);`;
      const results = await this.db.executeSql(sql, [data.nama_jasa, data.kategori, data.jumlah_jasa, data.letak_jasa, data.keterangan, data.jadwal_rencana, data.jadwal_notifikasi]);
      return results.insertId;
    } catch (error) {
      alert(error);
      return false;
    }
  }

  public async createWithCustomId(data: any) {
    try {
      const sql = `INSERT INTO jasa (id, nama_jasa, kategori, kategori_lainnya, jumlah_jasa, letak_jasa, keterangan, jadwal_rencana, jadwal_notifikasi, reminder, progress) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
      const results = await this.db.executeSql(sql, [data.id_jasa, data.nama_jasa, data.kategori, data.kategori_lainnya, data.jumlah_jasa, data.letak_jasa, data.keterangan, data.jadwal_rencana, data.jadwal_notifikasi, data.reminder, data.progress]);
      return results;
    } catch (error) {
      alert(error);
      return false;
    }
  }

  public async getAll() {
    try {
      const sql = `SELECT * FROM jasa ORDER BY id DESC;`;
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

  public async getAllGambar() {
    try {
      const sql = `SELECT * FROM gambar_jasa;`;
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

  public async getByKategori(kategori: string) {
    try {
      const sql = `SELECT * FROM jasa WHERE kategori = ?;`;
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

  public async getById(id: number) {
    try {
      const sql = `SELECT * FROM jasa WHERE id = ?;`;
      const results = await this.db.executeSql(sql, [id]);
      return results.rows.item(0);
    } catch (error) {
      alert(error);
      return null;
    }
  }

  public async update(data: any) {
    try {
      const sql = `UPDATE jasa SET nama_jasa = ?, kategori = ?, jumlah_jasa = ?, letak_jasa = ?, keterangan = ?, jadwal_rencana = ?, jadwal_notifikasi = ?, progress = ? WHERE id = ?;`;
      await this.db.executeSql(sql, [data.nama_jasa, data.kategori, data.jumlah_jasa, data.letak_jasa, data.keterangan, data.jadwal_rencana, data.jadwal_notifikasi, data.progress, data.id]);
      return true;
    } catch (error) {
      alert(error);
      return false;
    }
  }

  public async deleteAll() {
    try {
      const sql = `DELETE FROM jasa;`;
      await this.db.executeSql(sql, []);
      return true;
    } catch (error) {
      alert(error);
      return false;
    }
  }

  public async deleteAllGambar() {
    try {
      const sql = `DELETE FROM gambar_jasa;`;
      await this.db.executeSql(sql, []);
      return true;
    } catch (error) {
      alert(error);
      return false;
    }
  }

  public async deleteById(id: number) {
    try {
      const sql = `DELETE FROM jasa WHERE id = ?;`;
      await this.db.executeSql(sql, [id]);
      return true;
    } catch (error) {
      alert(error);
      return false;
    }
  }

  public async deleteGambarById(id: number) {
    try {
      const sql = `DELETE FROM gambar_jasa WHERE id = ?;`;
      await this.db.executeSql(sql, [id]);
      return true;
    } catch (error) {
      alert(error);
      return false;
    }
  }

  public async search(keyword: string) {
    try {
      const sql = `SELECT * FROM jasa WHERE nama_jasa LIKE ? OR kategori LIKE ?;`;
      const results = await this.db.executeSql(sql, ['%' + keyword + '%', '%' + keyword + '%']);
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
