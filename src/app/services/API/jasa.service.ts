import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class JasaService {

  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  public async deleteDataById(idUser: number, token: string, idJasa: number): Promise<any> {
    const httpHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return await this.http.delete<any>(`${environment.apiURL}/jasa/hapus/${idUser}/${idJasa}`, httpHeaders).toPromise();
  }

  public async deleteGambarById(idUser: number, token: string, idGambarJasa: number): Promise<any> {
    const httpHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return await this.http.delete<any>(`${environment.apiURL}/gambar-jasa/hapus/${idUser}/${idGambarJasa}`, httpHeaders).toPromise();
  }

  public async upData(data: any, token: string): Promise<any> {
    const httpHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return await this.http.post<any>(`${environment.apiURL}/jasa/upload`, data, httpHeaders).toPromise();
  }

  public async upGambar(data: any, token: string): Promise<any> {
    const httpHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return await this.http.post<any>(`${environment.apiURL}/gambar-jasa/upload`, data, httpHeaders).toPromise();
  }
}
