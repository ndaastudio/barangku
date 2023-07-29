import { Injectable } from "@angular/core";
import { APIService } from "../API/api.service";
import { StorageService } from "../LocalStorage/storage.service";
import { DatabaseService } from "./database.service";
import { NotificationService } from "../Notification/notification.service";

@Injectable({
    providedIn: 'root'
})

export class SinkronService {

    constructor(private apiService: APIService,
        private storageService: StorageService,
        private databaseService: DatabaseService,
        private notificationService: NotificationService) {
    }

    private async getDataServer(): Promise<any> {
        const profile = await this.storageService.get('profile');
        const token = await this.storageService.get('access_token');
        return await this.apiService.downloadAllData(profile.id, token);
    }

    private async getDataLocal(): Promise<any> {
        const data = {
            barang: await this.databaseService.getAllBarang(),
            jasa: await this.databaseService.getAllJasa(),
            gambar_barang: await this.databaseService.getAllGambarBarang(),
            gambar_jasa: await this.databaseService.getAllGambarJasa(),
        }
        return data;
    }

    public async updateDataLocal(): Promise<any> {
        const token = await this.storageService.get('access_token');
        const profile = await this.storageService.get('profile');
        const server = await this.getDataServer();
        const local = await this.getDataLocal();
        const dataServer = {
            barang: server.data.barang,
            jasa: server.data.jasa,
            gambarBarang: server.data.gambar_barang,
            gambarJasa: server.data.gambar_jasa,
        }
        const dataLocal = {
            barang: local.barang,
            jasa: local.jasa,
            gambarBarang: local.gambar_barang,
            gambarJasa: local.gambar_jasa,
        }
        if (dataServer.barang.length > dataLocal.barang.length) {
            await this.databaseService.deleteAllBarang();
            dataServer.barang.forEach(async (barang: any) => {
                await this.notificationService.cancelNotification(barang.id_barang);
                await this.databaseService.createBarangWithCustomId(barang);
                const date = new Date(barang.jadwal_notifikasi);
                await this.notificationService.scheduleNotification('1', 'Pengingat!', `Jangan lupa ${barang.nama_barang.toLowerCase()} ${barang.status.toLowerCase()}`, barang.id_barang, new Date(date.getTime()));
            });
        }
        if (dataServer.jasa.length > dataLocal.jasa.length) {
            await this.databaseService.deleteAllJasa();
            dataServer.jasa.forEach(async (jasa: any) => {
                await this.notificationService.cancelNotification(jasa.id_jasa);
                await this.databaseService.createJasaWithCustomId(jasa);
                const date = new Date(jasa.jadwal_notifikasi);
                this.notificationService.scheduleNotification('2', 'Pengingat!', `Jangan lupa ${jasa.nama_jasa.toLowerCase()}`, jasa.id_jasa, new Date(date.getTime()));
            });
        }
        if (dataServer.gambarBarang.length > dataLocal.gambarBarang.length) {
            await this.databaseService.deleteAllGambarBarang();
            dataServer.gambarBarang.forEach(async (gambarBarang: any) => {
                await this.databaseService.createGambarBarang(gambarBarang.barang_id, gambarBarang.gambar);
            });
        }
        if (dataServer.gambarJasa.length > dataLocal.gambarJasa.length) {
            await this.databaseService.deleteAllGambarJasa();
            dataServer.gambarJasa.forEach(async (gambarJasa: any) => {
                await this.databaseService.createGambarJasa(gambarJasa.jasa_id, gambarJasa.gambar);
            });
        }
        const lastSinkron = await this.apiService.upDatetimeSinkron({ akun_id: profile.id }, token);
        profile.tanggal_sinkron = lastSinkron.tanggal_sinkron;
        await this.storageService.set('profile', profile);
    }

    public async updateDataServer(): Promise<any> {
        const token = await this.storageService.get('access_token');
        const profile = await this.storageService.get('profile');
        const server = await this.getDataServer();
        const local = await this.getDataLocal();
        const dataServer = {
            barang: server.data.barang,
            jasa: server.data.jasa,
            gambarBarang: server.data.gambar_barang,
            gambarJasa: server.data.gambar_jasa,
        }
        const dataLocal = {
            barang: local.barang,
            jasa: local.jasa,
            gambarBarang: local.gambar_barang,
            gambarJasa: local.gambar_jasa,
        }
        if (dataLocal.barang.length > dataServer.barang.length) {
            await this.apiService.deleteAllBarang(profile.id, token);
            dataLocal.barang.forEach(async (barang: any) => {
                const data = {
                    id_barang: barang.id,
                    akun_id: profile.id,
                    nama_barang: barang.nama_barang,
                    kategori: barang.kategori,
                    status: barang.status,
                    extend_status: barang.extend_status,
                    jumlah_barang: barang.jumlah_barang,
                    letak_barang: barang.letak_barang,
                    keterangan: barang.keterangan,
                    jadwal_rencana: barang.jadwal_rencana,
                    jadwal_notifikasi: barang.jadwal_notifikasi,
                    progress: barang.progress,
                };
                await this.apiService.upDataBarang(data, token);
            });
        }
        if (dataLocal.jasa.length > dataServer.jasa.length) {
            await this.apiService.deleteAllJasa(profile.id, token);
            dataLocal.jasa.forEach(async (jasa: any) => {
                const data = {
                    id_jasa: jasa.id,
                    akun_id: profile.id,
                    nama_jasa: jasa.nama_jasa,
                    kategori: jasa.kategori,
                    jumlah_jasa: jasa.jumlah_jasa,
                    letak_jasa: jasa.letak_jasa,
                    keterangan: jasa.keterangan,
                    jadwal_rencana: jasa.jadwal_rencana,
                    jadwal_notifikasi: jasa.jadwal_notifikasi,
                    progress: jasa.progress,
                };
                await this.apiService.upDataJasa(data, token);
            });
        }
        if (dataLocal.gambarBarang.length > dataServer.gambarBarang.length) {
            await this.apiService.deleteAllGambarBarang(profile.id, token);
            dataLocal.gambarBarang.forEach(async (gambarBarang: any) => {
                const data = {
                    akun_id: profile.id,
                    barang_id: gambarBarang.id_barang,
                    gambar: gambarBarang.gambar,
                };
                await this.apiService.upGambarBarang(data, token);
            });
        }
        if (dataLocal.gambarJasa.length > dataServer.gambarJasa.length) {
            await this.apiService.deleteAllGambarJasa(profile.id, token);
            dataLocal.gambarJasa.forEach(async (gambarJasa: any) => {
                const data = {
                    akun_id: profile.id,
                    jasa_id: gambarJasa.id_jasa,
                    gambar: gambarJasa.gambar,
                };
                await this.apiService.upGambarJasa(data, token);
            });
        }
        const lastSinkron = await this.apiService.upDatetimeSinkron({ akun_id: profile.id }, token);
        profile.tanggal_sinkron = lastSinkron.tanggal_sinkron;
        await this.storageService.set('profile', profile);
    }
}