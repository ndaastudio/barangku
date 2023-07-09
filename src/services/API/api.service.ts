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
        return await this.http.get<any>(`${environment.apiURL}/kode-daftar?kode_daftar=${kodeDaftar}`, this.httpHeader).toPromise();
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
}