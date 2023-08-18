import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  public async getByKodeDaftar(kodeDaftar: string): Promise<any> {
    return await this.http.get<any>(`${environment.apiURL}/kode-daftar/${kodeDaftar}`, this.httpHeader).toPromise();
  }

  public async register(data: any): Promise<any> {
    return await this.http.post<any>(`${environment.apiURL}/register`, data, this.httpHeader).toPromise();
  }

  public async login(data: any): Promise<any> {
    return await this.http.post<any>(`${environment.apiURL}/login`, data, this.httpHeader).toPromise();
  }

  public async logout(token: string): Promise<any> {
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

  public async checkExpiredAkun(token: string, idAkun: number): Promise<any> {
    const httpHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return await this.http.get<any>(`${environment.apiURL}/akun/cek-expired/${idAkun}`, httpHeaders).toPromise();
  }
}
