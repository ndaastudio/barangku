import { Injectable } from '@angular/core';
import { ProfilService as APIProfil } from '../API/profil.service';
import { BarangService as APIBarang } from '../API/barang.service';
import { LocalNotifService } from './local-notif.service';
import { LocalStorageService } from '../Database/local-storage.service';
import { BarangService as SQLiteBarang } from '../Database/SQLite/barang.service';

@Injectable({
  providedIn: 'root'
})
export class SyncDataService {

  constructor(private apiProfil: APIProfil,
    private apiBarang: APIBarang,
    private notif: LocalNotifService,
    private localStorage: LocalStorageService,
    private sqliteBarang: SQLiteBarang) {
  }

  private async getDataServer(): Promise<any> {
    const profile = await this.localStorage.get('profile');
    const token = await this.localStorage.get('access_token');
    return await this.apiProfil.downloadAllData(profile.id, token);
  }

  private async getDataLocal(): Promise<any> {
    const data = {
      barang: await this.sqliteBarang.getAll(),
      gambar_barang: await this.sqliteBarang.getAllGambar(),
    }
    return data;
  }

  public async updateDataLocal(): Promise<any> {
    const token = await this.localStorage.get('access_token');
    const profile = await this.localStorage.get('profile');
    const server = await this.getDataServer();
    const dataServer = {
      barang: server.data.barang,
      gambarBarang: server.data.gambar_barang,
    }
    dataServer.barang.forEach(async (barang: any) => {
      await this.sqliteBarang.deleteById(barang.id_barang);
      await this.notif.delete(barang.id_barang);
      await this.sqliteBarang.createWithCustomId(barang);
      const date = new Date(barang.jadwal_notifikasi);
      await this.notif.delete(barang.id_barang);
      await this.notif.create('1', 'Pengingat!', `Jangan lupa ${barang.nama_barang.toLowerCase()} ${barang.status.toLowerCase()}`, barang.id_barang, new Date(date.getTime()), `/barang/show/${barang.id_barang}`);
    });
    dataServer.gambarBarang.forEach(async (gambarBarang: any) => {
      await this.sqliteBarang.deleteGambarById(gambarBarang.id_gambar_barang);
      await this.sqliteBarang.createGambar(gambarBarang.barang_id, gambarBarang.gambar);
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
      gambarBarang: local.gambar_barang,
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
    const lastSinkron = await this.apiProfil.upDatetimeSinkron({ akun_id: profile.id }, token);
    profile.tanggal_sinkron = lastSinkron.tanggal_sinkron;
    await this.localStorage.set('profile', profile);
  }
}
