import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/services/LocalStorage/storage.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss'],
})
export class UpdatePage implements OnInit {
  user: any;
  currentVersion: any;
  latestVersion: any;
  urlUpdate: any;

  constructor(private storageService: StorageService) { }

  async ngOnInit() {
    const data = await this.storageService.get('update');
    const profile = await this.storageService.get('profile');
    this.currentVersion = data.currentVersion;
    this.latestVersion = data.latestVersion;
    this.urlUpdate = data.urlUpdate;
    this.user = profile.nama;
  }

  goToUpdate() {
    window.open(this.urlUpdate, '_system');
  }

}
