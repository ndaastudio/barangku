import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
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
  ) { }

  async ngOnInit() {
    this.platform = await this.localStorage.get('os');
    this.createChart();
  }

  createChart() {
    this.chart = new Chart('statistik-barang', {
      type: 'doughnut',
      data: {
        labels: [
          'Elektronik',
          'Fashion',
          'Otomotif'
        ],
        datasets: [{
          label: 'Jumlah Barang',
          data: [10, 2, 3],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          hoverOffset: 4
        }]
      }
    });
  }
}
