import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    this.storage = await this.storage.create();
  }

  public set(key: string, value: any) {
    return this.storage?.set(key, value);
  }

  public get(key: string) {
    return this.storage?.get(key);
  }

  public remove(key: string) {
    return this.storage?.remove(key);
  }

  public async clear() {
    const isPlatform = await this.storage?.get('os');
    if (isPlatform) {
      this.storage.forEach((value, key) => {
        if (key !== 'os') {
          this.storage?.remove(key);
        }
      });
    } else {
      this.storage?.clear();
    }
  }
}
