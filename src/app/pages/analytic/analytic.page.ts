import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { BarangService as SQLiteBarang } from 'src/app/services/Database/SQLite/barang.service';
import { LocalStorageService } from 'src/app/services/Database/local-storage.service';
import { DataRefreshService } from 'src/app/services/Database/data-refresh.service';
import { LetakService as SQLiteLetakBarang } from 'src/app/services/Database/SQLite/letak.service';

@Component({
  selector: 'app-analytic',
  templateUrl: './analytic.page.html',
  styleUrls: ['./analytic.page.scss'],
})
export class AnalyticPage implements OnInit {
  platform: any = null;
  chartAksi: any;
  labelsAksi: string[] = [];
  dataAksi: number[] = [];
  chartLetak: any;
  labelsLetak: string[] = [];
  dataLetak: number[] = [];
  segment: string = 'aksi';

  constructor(
    private localStorage: LocalStorageService,
    private sqliteBarang: SQLiteBarang,
    private dataRefresh: DataRefreshService,
    private sqliteLetakBarang: SQLiteLetakBarang
  ) { }

  async ngOnInit() {
    this.platform = await this.localStorage.get('os');
    await this.getDataChart();
    await this.createChart();
    this.dataRefresh.refreshedData.subscribe(async () => {
      await this.chartAksi.destroy();
      await this.chartLetak.destroy();
      await this.getDataChart();
      await this.createChart();
    });
  }

  async createChart() {
    this.chartAksi = new Chart('statistik-barangAksi', {
      type: 'doughnut',
      data: {
        labels: this.labelsAksi,
        datasets: [{
          label: 'Jumlah Barang',
          data: this.dataAksi,
          hoverOffset: 4
        }]
      }
    });
    this.chartLetak = new Chart('statistik-barangLetak', {
      type: 'doughnut',
      data: {
        labels: this.labelsLetak,
        datasets: [{
          label: 'Jumlah Barang',
          data: this.dataLetak,
          hoverOffset: 4
        }]
      }
    });
  }

  async getDataChart() {
    const resultsAksi = await this.sqliteBarang.getKategoriAndCount();
    this.labelsAksi = resultsAksi.map((result: any) => result.kategori);
    this.dataAksi = resultsAksi.map((result: any) => result.jumlah);

    const resultsLetak = await this.sqliteLetakBarang.getKategoriAndCount();
    this.labelsLetak = resultsLetak.map((result: any) => result.kategori);
    this.dataLetak = resultsLetak.map((result: any) => result.jumlah);
  }

  async handleRefresh(event: any) {
    await this.chartAksi.destroy();
    await this.chartLetak.destroy();
    this.dataAksi = [];
    this.labelsAksi = [];
    this.dataLetak = [];
    this.labelsLetak = [];
    setTimeout(async () => {
      await event.target.complete();
      await this.ngOnInit();
    }, 1500);
  }
}
