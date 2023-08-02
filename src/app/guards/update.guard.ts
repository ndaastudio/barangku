import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { App } from '@capacitor/app';
import { APIService } from 'src/services/API/api.service';
import { StorageService } from 'src/services/LocalStorage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class UpdateGuard implements CanActivate {

  constructor(private router: Router,
    private apiService: APIService,
    private storageService: StorageService) {
  }

  canActivate(): Promise<boolean> {
    return this.isUpdate();
  }

  async isUpdate(): Promise<boolean> {
    const getUpdate = await this.apiService.getLatestVersion();
    const data = {
      currentVersion: (await App.getInfo()).version,
      latestVersion: getUpdate.data.latest_version,
      urlUpdate: getUpdate.data.url_update
    }
    if (parseFloat(data.currentVersion) < parseFloat(data.latestVersion)) {
      await this.storageService.set('update', data);
      await this.router.navigateByUrl('/update');
      return false;
    }
    return true;
  }
}
