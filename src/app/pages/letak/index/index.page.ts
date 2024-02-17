import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/services/Database/local-storage.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage implements OnInit {
  platform: any = null;

  constructor(private localStorage: LocalStorageService,) { }

  async ngOnInit() {
    this.platform = await this.localStorage.get('os');
  }

}
