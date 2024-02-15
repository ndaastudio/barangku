import { Injectable } from '@angular/core';
import { ProfilService as APIProfil } from '../API/profil.service';
import { BarangService as APIBarang } from '../API/barang.service';
import { LocalNotifService } from './local-notif.service';
import { LocalStorageService } from '../Database/local-storage.service';
import { BarangService as SQLiteBarang } from '../Database/SQLite/barang.service';
import { INotification } from 'src/app/interfaces/i-notification';

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
      notifications: await this.sqliteBarang.getAllNotif(),
      gambar_barang: await this.sqliteBarang.getAllGambar(),
    }
    return data;
  }

  public async updateDataLocal(): Promise<any> {
    const server = await this.getDataServer();
    const dataServer = {
      barang: server.data.barang,
      notifications: server.data.notifications,
      gambarBarang: server.data.gambar_barang,
    }
    dataServer.barang.forEach(async (barang: any) => {
      await this.sqliteBarang.deleteById(barang.id_barang);
      let notif_barang = dataServer.notifications.filter((notif: INotification) => notif.id_barang == barang.id_barang);
      notif_barang.forEach(async (notif: INotification) => {
        await this.sqliteBarang.createNotifWithCustomId(notif);
        await this.notif.delete(notif.id);
        const date = new Date(notif.jadwal_notifikasi);
        await this.notif.create('1', 'Pengingat!', `Jangan lupa ${barang.nama_barang.toLowerCase()} ${barang.status.toLowerCase()}`, notif.id, new Date(date.getTime()), `/barang/show/${barang.id_barang}`);
      });
      await this.sqliteBarang.createWithCustomId(barang);
      });
    dataServer.gambarBarang.forEach(async (gambarBarang: any) => {
      await this.sqliteBarang.deleteGambarById(gambarBarang.id_gambar_barang);
      await this.sqliteBarang.createGambar(gambarBarang.barang_id, gambarBarang.gambar);
    });
  }

  public async updateDataServer(): Promise<any> {
    const token = await this.localStorage.get('access_token');
    const profile = await this.localStorage.get('profile');
    const local = await this.getDataLocal();
    const dataLocal = {
      barang: local.barang,
      notifications: local.notifications,
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
        reminder: barang.reminder,
        progress: barang.progress,
      };
      await this.apiBarang.upData(data, token);
    });    
    dataLocal.notifications.forEach(async (notif: INotification) => {
      await this.apiBarang.deleteNotifById(profile.id, token, notif.id);
      const data = {
        id: notif.id,
        barang_id: notif.id_barang,
        jadwal_notifikasi: notif.jadwal_notifikasi
      };
      await this.apiBarang.upNotif(data, token);
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
    await this.apiProfil.upDatetimeSinkron({ akun_id: profile.id }, token);
  }
}
