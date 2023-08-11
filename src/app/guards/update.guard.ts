import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { LocalStorageService } from '../services/Database/local-storage.service';
import { App } from '@capacitor/app';

@Injectable({
  providedIn: 'root'
})
export class UpdateGuard implements CanLoad {

  constructor(private localStorage: LocalStorageService,
    private router: Router) {
  }

  canLoad(): Promise<boolean> {
    return this.isNewUpdate();
  }

  async isNewUpdate(): Promise<boolean> {
    const data = await this.localStorage.get('update');
    if (!data) {
      return true;
    }
    const latestVersion = parseFloat(data.latestVersion);
    const currentVersion = parseFloat((await App.getInfo()).version);
    if (latestVersion > currentVersion) {
      this.router.navigateByUrl('/update');
      return false;
    }
    this.localStorage.remove('update');
    return true;
  }
}
