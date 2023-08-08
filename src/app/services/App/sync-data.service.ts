import { Injectable } from '@angular/core';
import { ProfilService as APIProfil } from '../API/profil.service';
import { BarangService as APIBarang } from '../API/barang.service';
import { JasaService as APIJasa } from '../API/jasa.service';
import { LocalNotifService } from './local-notif.service';
import { LocalStorageService } from '../Database/local-storage.service';
import { BarangService as SQLiteBarang } from '../Database/SQLite/barang.service';
import { JasaService as SQLiteJasa } from '../Database/SQLite/jasa.service';

@Injectable({
  providedIn: 'root'
})
export class SyncDataService {

  constructor(private apiProfil: APIProfil,
    private apiBarang: APIBarang,
    private apiJasa: APIJasa,
    private notif: LocalNotifService,
    private localStorage: LocalStorageService,
    private sqliteBarang: SQLiteBarang,
    private sqliteJasa: SQLiteJasa) {
  }

  private async getDataServer(): Promise<any> {
    const profile = await this.localStorage.get('profile');
    const token = await this.localStorage.get('access_token');
    return await this.apiProfil.downloadAllData(profile.id, token);
  }

  private async getDataLocal(): Promise<any> {
    const data = {
      barang: await this.sqliteBarang.getAll(),
      jasa: await this.sqliteJasa.getAll(),
      gambar_barang: await this.sqliteBarang.getAllGambar(),
      gambar_jasa: await this.sqliteJasa.getAllGambar(),
    }
    return data;
  }

  public async updateDataLocal(): Promise<any> {
    const token = await this.localStorage.get('access_token');
    const profile = await this.localStorage.get('profile');
    const server = await this.getDataServer();
    const dataServer = {
      barang: server.data.barang,
      jasa: server.data.jasa,
      gambarBarang: server.data.gambar_barang,
      gambarJasa: server.data.gambar_jasa,
    }
    dataServer.barang.forEach(async (barang: any) => {
      try {
        await this.sqliteBarang.deleteById(barang.id_barang);
        await this.notif.delete(barang.id_barang);
        await this.sqliteBarang.createWithCustomId(barang);
        const date = new Date(barang.jadwal_notifikasi);
        await this.notif.delete(barang.id_barang);
        await this.notif.create('1', 'Pengingat!', `Jangan lupa ${barang.nama_barang.toLowerCase()} ${barang.status.toLowerCase()}`, barang.id_barang, new Date(date.getTime()), `/barang/show/${barang.id_barang}`);
      } catch (error) {
        alert(error);
      }
    });
    dataServer.jasa.forEach(async (jasa: any) => {
      await this.sqliteJasa.deleteById(jasa.id_jasa);
      await this.notif.delete(jasa.id_jasa);
      await this.sqliteJasa.createWithCustomId(jasa);
      const date = new Date(jasa.jadwal_notifikasi);
      this.notif.create('2', 'Pengingat!', `Jangan lupa ${jasa.nama_jasa.toLowerCase()}`, jasa.id_jasa, new Date(date.getTime()), `/jasa/show/${jasa.id_jasa}`);
    });
    await this.sqliteBarang.deleteAllGambar();
    dataServer.gambarBarang.forEach(async (gambarBarang: any) => {
      await this.sqliteBarang.deleteGambarById(gambarBarang.id_gambar_barang);
      await this.sqliteBarang.createGambar(gambarBarang.barang_id, gambarBarang.gambar);
    });
    await this.sqliteJasa.deleteAllGambar();
    dataServer.gambarJasa.forEach(async (gambarJasa: any) => {
      await this.sqliteJasa.deleteGambarById(gambarJasa.id_gambar_jasa);
      await this.sqliteJasa.createGambar(gambarJasa.jasa_id, gambarJasa.gambar);
    });
    const lastSinkron = await this.apiProfil.upDatetimeSinkron({ akun_id: profile.id }, token);
    profile.tanggal_sinkron = lastSinkron.tanggal_sinkron;
    await this.localStorage.set('profile', profile);
  }

  public async updateDataServer(): Promise<any> {
    const token = await this.localStorage.get('access_token');
    const profile = await this.localStorage.get('profile');
    const local = await this.getDataLocal();
    const dataLocal = {
      barang: local.barang,
      jasa: local.jasa,
      gambarBarang: local.gambar_barang,
      gambarJasa: local.gambar_jasa,
    }
    dataLocal.barang.forEach(async (barang: any) => {
      await this.apiBarang.deleteDataById(profile.id, token, barang.id);
      const data = {
        id_barang: barang.id,
        akun_id: profile.id,
        nama_barang: barang.nama_barang,
        kategori: barang.kategori,
        kategori_lainnya: barang.kategori_lainnya,
        status: barang.status,
        extend_status: barang.extend_status,
        jumlah_barang: barang.jumlah_barang,
        letak_barang: barang.letak_barang,
        keterangan: barang.keterangan,
        jadwal_rencana: barang.jadwal_rencana,
        jadwal_notifikasi: barang.jadwal_notifikasi,
        reminder: barang.reminder,
        progress: barang.progress,
      };
      await this.apiBarang.upData(data, token);
    });
    dataLocal.jasa.forEach(async (jasa: any) => {
      await this.apiJasa.deleteDataById(profile.id, token, jasa.id);
      const data = {
        id_jasa: jasa.id,
        akun_id: profile.id,
        nama_jasa: jasa.nama_jasa,
        kategori: jasa.kategori,
        kategori_lainnya: jasa.kategori_lainnya,
        jumlah_jasa: jasa.jumlah_jasa,
        letak_jasa: jasa.letak_jasa,
        keterangan: jasa.keterangan,
        jadwal_rencana: jasa.jadwal_rencana,
        jadwal_notifikasi: jasa.jadwal_notifikasi,
        reminder: jasa.reminder,
        progress: jasa.progress,
      };
      await this.apiJasa.upData(data, token);
    });
    dataLocal.gambarBarang.forEach(async (gambarBarang: any) => {
      await this.apiBarang.deleteGambarById(profile.id, token, gambarBarang.id);
      const data = {
        id_gambar_barang: gambarBarang.id,
        akun_id: profile.id,
        barang_id: gambarBarang.id_barang,
        gambar: gambarBarang.gambar,
      };
      await this.apiBarang.upGambar(data, token);
    });
    dataLocal.gambarJasa.forEach(async (gambarJasa: any) => {
      await this.apiJasa.deleteGambarById(profile.id, token, gambarJasa.id);
      const data = {
        id_gambar_jasa: gambarJasa.id,
        akun_id: profile.id,
        jasa_id: gambarJasa.id_jasa,
        gambar: gambarJasa.gambar,
      };
      await this.apiJasa.upGambar(data, token);
    });
    const lastSinkron = await this.apiProfil.upDatetimeSinkron({ akun_id: profile.id }, token);
    profile.tanggal_sinkron = lastSinkron.tanggal_sinkron;
    await this.localStorage.set('profile', profile);
  }
}
