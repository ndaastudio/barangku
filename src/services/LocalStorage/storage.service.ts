import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
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

    public clear() {
        return this.storage?.clear();
    }
}