import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProfilService {

  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  public async downloadAllData(idUser: number, token: string): Promise<any> {
    const httpHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return await this.http.get<any>(`${environment.apiURL}/download-data/${idUser}`, httpHeaders).toPromise();
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

  public async getProfile(token: string): Promise<any> {
    const httpHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return await this.http.get<any>(`${environment.apiURL}/profile`, httpHeaders).toPromise();
  }
}
