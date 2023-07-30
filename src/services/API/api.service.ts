import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class APIService {

    httpHeader = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };
    constructor(private http: HttpClient) { }

    public async getAkunByKodeDaftar(kodeDaftar: string): Promise<any> {
        return await this.http.get<any>(`${environment.apiURL}/kode-daftar/${kodeDaftar}`, this.httpHeader).toPromise();
    }

    public async registerAkun(data: any): Promise<any> {
        return await this.http.post<any>(`${environment.apiURL}/register`, data, this.httpHeader).toPromise();
    }

    public async loginAkun(data: any): Promise<any> {
        return await this.http.post<any>(`${environment.apiURL}/login`, data, this.httpHeader).toPromise();
    }

    public async logoutAkun(token: string): Promise<any> {
        const httpHeaders = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            })
        };
        return await this.http.post<any>(`${environment.apiURL}/logout`, null, httpHeaders).toPromise();
    }

    public async sendKodeLupaPw(data: any): Promise<any> {
        return await this.http.post<any>(`${environment.apiURL}/lupa-password`, data, this.httpHeader).toPromise();
    }

    public async verifKodeLupaPw(data: any): Promise<any> {
        return await this.http.post<any>(`${environment.apiURL}/verif-lupa-pw`, data, this.httpHeader).toPromise();
    }

    public async gantiPw(data: any, token: string): Promise<any> {
        const httpHeaders = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            })
        };
        return await this.http.post<any>(`${environment.apiURL}/ganti-pw`, data, httpHeaders).toPromise();
    }

    public async downloadAllData(idUser: number, token: string): Promise<any> {
        const httpHeaders = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            })
        };
        return await this.http.get<any>(`${environment.apiURL}/download-data/${idUser}`, httpHeaders).toPromise();
    }

    public async deleteBarangById(idUser: number, token: string, idBarang: number): Promise<any> {
        const httpHeaders = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            })
        };
        return await this.http.delete<any>(`${environment.apiURL}/barang/hapus/${idUser}/${idBarang}`, httpHeaders).toPromise();
    }

    public async upDataBarang(data: any, token: string): Promise<any> {
        const httpHeaders = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            })
        };
        return await this.http.post<any>(`${environment.apiURL}/barang/upload`, data, httpHeaders).toPromise();
    }

    public async deleteGambarBarangById(idUser: number, token: string, idGambarBarang: number): Promise<any> {
        const httpHeaders = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            })
        };
        return await this.http.delete<any>(`${environment.apiURL}/gambar-barang/hapus/${idUser}/${idGambarBarang}`, httpHeaders).toPromise();
    }

    public async upGambarBarang(data: any, token: string): Promise<any> {
        const httpHeaders = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            })
        };
        return await this.http.post<any>(`${environment.apiURL}/gambar-barang/upload`, data, httpHeaders).toPromise();
    }

    public async deleteJasaById(idUser: number, token: string, idJasa: number): Promise<any> {
        const httpHeaders = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            })
        };
        return await this.http.delete<any>(`${environment.apiURL}/jasa/hapus/${idUser}/${idJasa}`, httpHeaders).toPromise();
    }

    public async upDataJasa(data: any, token: string): Promise<any> {
        const httpHeaders = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            })
        };
        return await this.http.post<any>(`${environment.apiURL}/jasa/upload`, data, httpHeaders).toPromise();
    }

    public async deleteGambarJasaById(idUser: number, token: string, idGambarJasa: number): Promise<any> {
        const httpHeaders = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            })
        };
        return await this.http.delete<any>(`${environment.apiURL}/gambar-jasa/hapus/${idUser}/${idGambarJasa}`, httpHeaders).toPromise();
    }

    public async upGambarJasa(data: any, token: string): Promise<any> {
        const httpHeaders = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            })
        };
        return await this.http.post<any>(`${environment.apiURL}/gambar-jasa/upload`, data, httpHeaders).toPromise();
    }

    public async upDatetimeSinkron(data: any, token: string): Promise<any> {
        const httpHeaders = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            })
        };
        return await this.http.post<any>(`${environment.apiURL}/akun/sinkron`, data, httpHeaders).toPromise();
    }

    public async getUserProfile(token: string): Promise<any> {
        const httpHeaders = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            })
        };
        return await this.http.get<any>(`${environment.apiURL}/profile`, httpHeaders).toPromise();
    }
}