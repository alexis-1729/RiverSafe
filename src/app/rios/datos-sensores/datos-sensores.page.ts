import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import { Storage } from '@ionic/storage-angular';
import { RiogetService } from 'src/app/services/rioget.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AlertaService } from 'src/app/services/alerta.service';
import { NavController } from '@ionic/angular';

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
    // Datos estáticos de ejemplo; deberías conectarlos a la base de datos para usar datos reales
  ];

  public lineChartLabels: string[] = [];  // Define las etiquetas como un array de strings

  public lineChartOptions: (ChartOptions & { annotation?: any }) = {
    responsive: true,
  };

  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';

  disDt: any[] = [];  // Lista de dispositivos     
  sensores: any[] = [];
  riverst: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private storage: Storage,
    private riogetService: RiogetService,
    private geolocation: Geolocation,
    private alert: AlertaService,
    private navCtrl: NavController
  ) {
    this.updateChartLabels(); // Actualizar las etiquetas del gráfico
    this.scheduleDailyUpdate(); // Programar la actualización diaria del gráfico
  }

  async ngOnInit() {
    await this.storage.create();
    console.log('Hola');
    this.disDt = await this.storage.get('disp');
    this.route.paramMap.subscribe(params => {
      this.river = JSON.parse(params.get('river') || '{}');
    });
    this.obtenerSesores();
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

  async obtenerSesores() {
    console.log(this.disDt);
    for (let i = 0; i < this.disDt.length; i++) {
      this.riogetService.getSensor(this.disDt[i]).subscribe(response => {
        if (response.status == 'success') {
          console.log(response.data.length);
          for (let i = 0; i < response.data.length; i++) {
            this.sensores.push({
              nivelAgua: response.data[i].sens_nivel,
              temperatura: response.data[i].sens_temp,
              velocidadCorriente: response.data[i].sens_vel,
            });
          }
          this.storage.set('sen', this.sensores);
          console.log('Operación de obtención de sensores por dispositivo exitosa.');
        } else {
          console.log('Operación fallida.');
        }
      });
    }
  }
}
