import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from 'src/services/LocalStorage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private storageService: StorageService,
    private router: Router) { }

  canActivate(): Promise<boolean> {
    return this.isLoggedIn();
  }

  async isLoggedIn(): Promise<boolean> {
    const token = await this.storageService.get('access_token');
    if (token) {
      this.router.navigateByUrl('/tabs/tab1');
      return false;
    }
    return true;
  }

}
