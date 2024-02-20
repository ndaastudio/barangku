import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { BarangService as SQLiteBarang } from 'src/app/services/Database/SQLite/barang.service';
import { LocalStorageService } from 'src/app/services/Database/local-storage.service';
import { DataRefreshService } from 'src/app/services/Database/data-refresh.service';

@Component({
  selector: 'app-analytic',
  templateUrl: './analytic.page.html',
  styleUrls: ['./analytic.page.scss'],
})
export class AnalyticPage implements OnInit {
  platform: any = null;
  chart: any;
  labels: string[] = [];
  data: number[] = [];

  constructor(
    private localStorage: LocalStorageService,
    private sqliteBarang: SQLiteBarang,
    private dataRefresh: DataRefreshService,
  ) { }

  async ngOnInit() {
    this.platform = await this.localStorage.get('os');
    await this.getDataChart();
    await this.createChart();
    this.dataRefresh.refreshedData.subscribe(async () => {
      await this.chart.destroy();
      await this.getDataChart();
      await this.createChart();
    });
  }

  async createChart() {
    this.chart = new Chart('statistik-barang', {
      type: 'doughnut',
      data: {
        labels: this.labels,
        datasets: [{
          label: 'Jumlah Barang',
          data: this.data,
          hoverOffset: 4
        }]
      }
    });
  }

  async getDataChart() {
    const results = await this.sqliteBarang.getKategoriAndCount();
    this.labels = results.map((result: any) => result.kategori);
    this.data = results.map((result: any) => result.jumlah);
  }

  async handleRefresh(event: any) {
    await this.chart.destroy();
    this.data = [];
    this.labels = [];
    setTimeout(async () => {
      await event.target.complete();
      await this.ngOnInit();
    }, 1500);
  }
}
