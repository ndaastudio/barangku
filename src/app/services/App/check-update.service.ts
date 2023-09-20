import { Injectable } from '@angular/core';
import { UpdateService as APIUpdate } from '../API/update.service';
import { App } from '@capacitor/app';
import { LocalStorageService } from 'src/app/services/Database/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CheckUpdateService {

  constructor(private apiUpdate: APIUpdate,
    private localStorage: LocalStorageService,) {
  }

  public async isUpdate(): Promise<boolean> {
    const getUpdate = await this.apiUpdate.getVersion();
    const data = {
      currentVersion: (await App.getInfo()).version,
      latestVersion: getUpdate.data.latest_version,
      urlUpdate: getUpdate.data.url_update
    }
    if (parseFloat(data.currentVersion) < parseFloat(data.latestVersion)) {
      await this.localStorage.set('update', data);
      return true;
    }
    return false;
  }
}
