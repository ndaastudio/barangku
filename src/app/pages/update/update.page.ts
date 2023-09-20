import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/services/Database/local-storage.service';

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

  constructor(private localStorage: LocalStorageService) { }

  async ngOnInit() {
    const data = await this.localStorage.get('update');
    const profile = await this.localStorage.get('profile');
    this.currentVersion = data.currentVersion;
    this.latestVersion = data.latestVersion;
    this.urlUpdate = data.urlUpdate;
    this.user = profile.nama;
  }

  goToUpdate() {
    window.open(this.urlUpdate, '_system');
  }

}
