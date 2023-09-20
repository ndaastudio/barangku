import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class BarangService {

  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  public async deleteDataById(idUser: number, token: string, idBarang: number): Promise<any> {
    const httpHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return await this.http.delete<any>(`${environment.apiURL}/barang/hapus/${idUser}/${idBarang}`, httpHeaders).toPromise();
  }

  public async deleteGambarById(idUser: number, token: string, idGambarBarang: number): Promise<any> {
    const httpHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return await this.http.delete<any>(`${environment.apiURL}/gambar-barang/hapus/${idUser}/${idGambarBarang}`, httpHeaders).toPromise();
  }

  public async upData(data: any, token: string): Promise<any> {
    const httpHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return await this.http.post<any>(`${environment.apiURL}/barang/upload`, data, httpHeaders).toPromise();
  }

  public async upGambar(data: any, token: string): Promise<any> {
    const httpHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return await this.http.post<any>(`${environment.apiURL}/gambar-barang/upload`, data, httpHeaders).toPromise();
  }
}
