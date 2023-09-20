import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  public async getVersion(): Promise<any> {
    return await this.http.get<any>(`${environment.apiURL}/cek-update-app`, this.httpHeader).toPromise();
  }
}
