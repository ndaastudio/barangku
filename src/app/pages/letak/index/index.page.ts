import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LetakService as SQLiteLetakBarang } from 'src/app/services/Database/SQLite/letak.service';
import { LocalStorageService } from 'src/app/services/Database/local-storage.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage implements OnInit {
  platform: any = null;

  constructor(private localStorage: LocalStorageService,
    private router: Router,
    private sqliteLetakBarang: SQLiteLetakBarang,) { }

  async ngOnInit() {
    this.platform = await this.localStorage.get('os');
  }

  goToTambahBarang() {
    this.router.navigateByUrl('/letak/create');
  }

}
