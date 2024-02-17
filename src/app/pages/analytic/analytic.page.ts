import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { BarangService as SQLiteBarang } from 'src/app/services/Database/SQLite/barang.service';
import { LocalStorageService } from 'src/app/services/Database/local-storage.service';

@Component({
  selector: 'app-analytic',
  templateUrl: './analytic.page.html',
  styleUrls: ['./analytic.page.scss'],
})
export class AnalyticPage implements OnInit {
  platform: any = null;
  chart: any;

  constructor(
    private localStorage: LocalStorageService,
    private sqliteBarang: SQLiteBarang
  ) { }

  async ngOnInit() {
    this.platform = await this.localStorage.get('os');
    this.createChart();
  }

  async createChart() {
    const results = await this.sqliteBarang.getKategoriAndCount();
    const labels = results.map((result: any) => result.kategori);
    const data = results.map((result: any) => result.jumlah);
    this.chart = new Chart('statistik-barang', {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          label: 'Jumlah Barang',
          data: data,
          hoverOffset: 4
        }]
      }
    });
  }
}
