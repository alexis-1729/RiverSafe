import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
// No necesitas importar 'Label' aquí

@Component({
  selector: 'app-datos-sensores',
  templateUrl: './datos-sensores.page.html',
  styleUrls: ['./datos-sensores.page.scss'],
})
export class DatosSensoresPage implements OnInit {
  river: any;

  public lineChartData: ChartDataset[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Nivel del Agua' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Temperatura' },
    // Numeros de ejemplo estaticos, se requiere conectar con la base de datos para que linechartdata contenga los datos reales
  ];

  public lineChartLabels: string[] = [];  // Define las etiquetas como un array de strings

  public lineChartOptions: (ChartOptions & { annotation?: any }) = {
    responsive: true,
  };

  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';

  constructor(private route: ActivatedRoute) {
    this.updateChartLabels(); // Actualizar las etiquetas del gráfico
    this.scheduleDailyUpdate(); // Programar la actualización diaria del gráfico
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.river = JSON.parse(params.get('river') || '{}');
    });
  }

  updateChartLabels() {
    const labels = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      labels.push(this.formatDate(date));
    }

    this.lineChartLabels = labels;
  }

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son 0-indexados
    return `${day}-${month}`;
  }

  scheduleDailyUpdate() {
    const now = new Date();
    const millisTillMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0).getTime() - now.getTime();
    
    setTimeout(() => {
      this.updateChartLabels();
      this.scheduleDailyUpdate();
    }, millisTillMidnight);
  }
}
