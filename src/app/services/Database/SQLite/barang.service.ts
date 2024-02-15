import { Injectable } from '@angular/core';
import { SQLiteObject } from "@awesome-cordova-plugins/sqlite/ngx";

@Injectable({
  providedIn: 'root'
})
export class BarangService {

  private db!: SQLiteObject;

  constructor() { }

  init(db: SQLiteObject) {
    this.db = db;
  }

  public async createTable() {
    try {
      await this.db.executeSql(`CREATE TABLE IF NOT EXISTS barang (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nama_barang TEXT,
            kategori TEXT,
            kategori_lainnya TEXT DEFAULT NULL,
            status TEXT,
            extend_status TEXT,
            jumlah_barang TEXT,
            letak_barang TEXT,
            keterangan TEXT,
            jadwal_rencana DATETIME,
            jadwal_notifikasi DATETIME,
            reminder TEXT,
            progress INTEGER DEFAULT 0
        );`, []);
    } catch (error) {
      alert(error);
    }
  }

  public async createTableGambar() {
    try {
      await this.db.executeSql(`CREATE TABLE IF NOT EXISTS gambar_barang (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_barang INTEGER,
            gambar TEXT,
            FOREIGN KEY (id_barang) REFERENCES barang (id)
        );`, []);
    } catch (error) {
      alert(error);
    }
  }

  public async createGambar(id: number, nama: string) {
    try {
      const sql = `INSERT INTO gambar_barang (id_barang, gambar) VALUES (?, ?);`;
      const results = await this.db.executeSql(sql, [id, nama]);
      return results.insertId;
    } catch (error) {
      alert(error);
      return false;
    }
  }

  public async getGambarById(id: number) {
    try {
      const sql = `SELECT * FROM gambar_barang WHERE id_barang = ?;`;
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
      const sql = `DELETE FROM gambar_barang WHERE gambar = ?;`;
      await this.db.executeSql(sql, [fileName]);
      return true;
    } catch (error) {
      alert(error);
      return false;
    }
  }

  public async create(data: any) {
    try {
      const sql = `INSERT INTO barang (nama_barang, kategori, kategori_lainnya, status, extend_status, jumlah_barang, letak_barang, keterangan, jadwal_rencana, jadwal_notifikasi, reminder) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
      const results = await this.db.executeSql(sql, [data.nama_barang, data.kategori, data.kategori_lainnya, data.status, data.extend_status, data.jumlah_barang, data.letak_barang, data.keterangan, data.jadwal_rencana, data.jadwal_notifikasi, data.reminder]);
      return results.insertId;
    } catch (error) {
      alert(error);
      return false;
    }
  }

  public async createWithCustomId(data: any) {
    try {
      const sql = `INSERT INTO barang (id, nama_barang, kategori, kategori_lainnya, status, extend_status, jumlah_barang, letak_barang, keterangan, jadwal_rencana, jadwal_notifikasi, reminder, progress) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
      const results = await this.db.executeSql(sql, [data.id_barang, data.nama_barang, data.kategori, data.kategori_lainnya, data.status, data.extend_status, data.jumlah_barang, data.letak_barang, data.keterangan, data.jadwal_rencana, data.jadwal_notifikasi, data.reminder, data.progress]);
      return results;
    } catch (error) {
      alert(error);
      return false;
    }
  }

  public async getAll() {
    try {
      const sql = `SELECT * FROM barang ORDER BY id DESC;`;
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
      const sql = `SELECT * FROM gambar_barang;`;
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
      const sql = `SELECT * FROM barang WHERE id = ?;`;
      const results = await this.db.executeSql(sql, [id]);
      return results.rows.item(0);
    } catch (error) {
      alert(error);
      return null;
    }
  }

  public async getByKategori(kategori: string) {
    try {
      const sql = `SELECT * FROM barang WHERE kategori = ?;`;
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
      const sql = `UPDATE barang SET nama_barang = ?, kategori = ?, kategori_lainnya = ?, status = ?, extend_status = ?, jumlah_barang = ?, letak_barang = ?, keterangan = ?, jadwal_rencana = ?, jadwal_notifikasi = ?, reminder = ?, progress = ? WHERE id = ?;`;
      await this.db.executeSql(sql, [data.nama_barang, data.kategori, data.kategori_lainnya, data.status, data.extend_status, data.jumlah_barang, data.letak_barang, data.keterangan, data.jadwal_rencana, data.jadwal_notifikasi, data.reminder, data.progress, data.id]);
      return true;
    } catch (error) {
      alert(error);
      return false;
    }
  }

  public async deleteById(id: number) {
    try {
      const sql = `DELETE FROM barang WHERE id = ?;`;
      await this.db.executeSql(sql, [id]);
      return true;
    } catch (error) {
      alert(error);
      return false;
    }
  }

  public async deleteGambarById(id: number) {
    try {
      const sql = `DELETE FROM gambar_barang WHERE id = ?;`;
      await this.db.executeSql(sql, [id]);
      return true;
    } catch (error) {
      alert(error);
      return false;
    }
  }

  public async search(keyword: string) {
    try {
      const sql = `SELECT * FROM barang WHERE nama_barang LIKE ? OR kategori LIKE ? OR kategori_lainnya LIKE ?;`;
      const results = await this.db.executeSql(sql, ['%' + keyword + '%', '%' + keyword + '%', '%' + keyword + '%']);
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

  public async multipleFilter(kategori?: string[], progress?: string, waktu?: string) {
    try {
      if (!kategori) kategori = [];

      let baseQuery = `SELECT * FROM barang `;
      let whereClause = '';
      let whereValues = [];

      if (kategori.length > 0) {
        whereClause += `kategori IN (${kategori.map(() => '?').join(', ')}) `;
        whereValues.push(...kategori);
      }

      if (progress) {
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

      if (waktu) {
        if (waktu == 'Notifikasi Terdekat') {
          baseQuery += `ORDER BY ABS(julianday(jadwal_notifikasi) - julianday('now')) DESC`;
        }
        if (waktu == 'Notifikasi Terjauh') {
          baseQuery += `ORDER BY ABS(julianday(jadwal_notifikasi) - julianday('now')) ASC`;
        }
        if (waktu == 'Baru Ditambahkan') {
          baseQuery += `ORDER BY id DESC`;
        }
        if (waktu == 'Terlama Ditambahkan') {
          baseQuery += `ORDER BY id ASC`;
        }
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

}
