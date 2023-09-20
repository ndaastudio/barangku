import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/Database/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private localStorage: LocalStorageService,
    private router: Router) {
  }

  canActivate(): Promise<boolean> {
    return this.isLoggedIn();
  }

  async isLoggedIn(): Promise<boolean> {
    const token = await this.localStorage.get('access_token');
    if (token) {
      this.router.navigateByUrl('/barang');
      return false;
    }
    return true;
  }

}
