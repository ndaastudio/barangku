import { Injectable } from '@angular/core';
import { UpdateService as APIUpdate } from '../API/update.service';
import { App } from '@capacitor/app';
import { LocalStorageService } from 'src/app/services/Database/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CheckUpdateService {
  platform: any = null;

  constructor(private apiUpdate: APIUpdate,
    private localStorage: LocalStorageService,) {
  }

  public async isUpdate(): Promise<boolean> {
    this.platform = await this.localStorage.get('os');
    const getUpdate = await this.apiUpdate.getVersion();
    const appVersion = (await App.getInfo()).version;
    const data = {
      android: {
        currentVersion: appVersion,
        latestVersion: getUpdate.data.android_latest_version,
        urlUpdate: getUpdate.data.android_url_update
      },
      ios: {
        currentVersion: appVersion,
        latestVersion: getUpdate.data.ios_latest_version,
        urlUpdate: getUpdate.data.ios_url_update
      }
    }
    if (this.platform == 'android') {
      if (parseFloat(data.android.currentVersion) < parseFloat(data.android.latestVersion)) {
        await this.localStorage.set('update', data.android);
        return true;
      }
    } else {
      if (parseFloat(data.ios.currentVersion) < parseFloat(data.ios.latestVersion)) {
        await this.localStorage.set('update', data.ios);
        return true;
      }
    }
    return false;
  }
}
