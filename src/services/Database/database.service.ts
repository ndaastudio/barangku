import { Injectable } from "@angular/core";
import { SQLite, SQLiteObject } from "@awesome-cordova-plugins/sqlite/ngx";

@Injectable({
    providedIn: 'root'
})

export class DatabaseService {
    private db!: SQLiteObject;

    constructor(private sqlite: SQLite) { }

    async init() {
        try {
            this.db = await this.sqlite.create({
                name: 'barangku.db',
                location: 'default'
            });
            await this.createTableBarang();
            await this.createTableGambarBarang();
            await this.createTableJasa();
            await this.createTableGambarJasa();
        } catch (error) {
            console.log(error);
        }
    }

    private async createTableBarang() {
        try {
            await this.db.executeSql(`CREATE TABLE IF NOT EXISTS barang (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nama_barang TEXT,
                kategori TEXT,
                status TEXT,
                extend_status TEXT,
                jumlah_barang TEXT,
                letak_barang TEXT,
                keterangan TEXT,
                jadwal_rencana DATETIME,
                jadwal_notifikasi DATETIME,
                progress INTEGER DEFAULT 0
            );`, []);
        } catch (error) {
            console.log(error);
        }
    }

    private async createTableGambarBarang() {
        try {
            await this.db.executeSql(`CREATE TABLE IF NOT EXISTS gambar_barang (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                id_barang INTEGER,
                gambar TEXT,
                FOREIGN KEY (id_barang) REFERENCES barang (id)
            );`, []);
        } catch (error) {
            console.log(error);
        }
    }

    private async createTableJasa() {
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
            console.log(error);
        }
    }

    private async createTableGambarJasa() {
        try {
            await this.db.executeSql(`CREATE TABLE IF NOT EXISTS gambar_jasa (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                id_jasa INTEGER,
                gambar TEXT,
                FOREIGN KEY (id_jasa) REFERENCES jasa (id)
            );`, []);
        } catch (error) {
            console.log(error);
        }
    }

    public async createBarang(data: any) {
        try {
            const sql = `INSERT INTO barang (nama_barang, kategori, status, extend_status, jumlah_barang, letak_barang, keterangan, jadwal_rencana, jadwal_notifikasi) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;
            await this.db.executeSql(sql, [data.nama_barang, data.kategori, data.status, data.extend_status, data.jumlah_barang, data.letak_barang, data.keterangan, data.jadwal_rencana, data.jadwal_notifikasi]);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    public async createJasa(data: any) {
        try {
            const sql = `INSERT INTO jasa (nama_jasa, kategori, jumlah_jasa, letak_jasa, keterangan, jadwal_rencana, jadwal_notifikasi) VALUES (?, ?, ?, ?, ?, ?, ?);`;
            await this.db.executeSql(sql, [data.nama_jasa, data.kategori, data.jumlah_jasa, data.letak_jasa, data.keterangan, data.jadwal_rencana, data.jadwal_notifikasi]);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    public async getAllBarang() {
        try {
            const sql = `SELECT * FROM barang;`;
            const result = await this.db.executeSql(sql, []);
            let data = [];
            for (let i = 0; i < result.rows.length; i++) {
                data.push(result.rows.item(i));
            }
            return data;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    public async getAllJasa() {
        try {
            const sql = `SELECT * FROM jasa;`;
            const result = await this.db.executeSql(sql, []);
            let data = [];
            for (let i = 0; i < result.rows.length; i++) {
                data.push(result.rows.item(i));
            }
            return data;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    public async getBarangById(id: number) {
        try {
            const sql = `SELECT * FROM barang WHERE id = ?;`;
            const result = await this.db.executeSql(sql, [id]);
            return result.rows.item(0);
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    public async getBarangByKategori(kategori: string) {
        try {
            const sql = `SELECT * FROM barang WHERE kategori = ?;`;
            const result = await this.db.executeSql(sql, [kategori]);
            let data = [];
            for (let i = 0; i < result.rows.length; i++) {
                data.push(result.rows.item(i));
            }
            return data;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    public async getJasaById(id: number) {
        try {
            const sql = `SELECT * FROM jasa WHERE id = ?;`;
            const result = await this.db.executeSql(sql, [id]);
            return result.rows.item(0);
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    public async updateBarang(data: any) {
        try {
            const sql = `UPDATE barang SET nama_barang = ?, kategori = ?, status = ?, jumlah_barang = ?, letak_barang = ?, keterangan = ?, jadwal_rencana = ?, jadwal_notifikasi = ?, progress = ? WHERE id = ?;`;
            await this.db.executeSql(sql, [data.nama_barang, data.kategori, data.status, data.jumlah_barang, data.letak_barang, data.keterangan, data.jadwal_rencana, data.jadwal_notifikasi, data.progress, data.id]);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    public async updateJasa(data: any) {
        try {
            const sql = `UPDATE jasa SET nama_jasa = ?, kategori = ?, jumlah_jasa = ?, letak_jasa = ?, keterangan = ?, jadwal_rencana = ?, jadwal_notifikasi = ? WHERE id = ?;`;
            await this.db.executeSql(sql, [data.nama_jasa, data.kategori, data.jumlah_jasa, data.letak_jasa, data.keterangan, data.jadwal_rencana, data.jadwal_notifikasi, data.id]);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    public async deleteBarangById(id: number) {
        try {
            const sql = `DELETE FROM barang WHERE id = ?;`;
            await this.db.executeSql(sql, [id]);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    public async deleteAllBarang() {
        try {
            const sql = `DELETE FROM barang;`;
            await this.db.executeSql(sql, []);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    public async deleteJasaById(id: number) {
        try {
            const sql = `DELETE FROM jasa WHERE id = ?;`;
            await this.db.executeSql(sql, [id]);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}