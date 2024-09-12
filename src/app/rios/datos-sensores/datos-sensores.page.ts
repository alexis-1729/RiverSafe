import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart,ChartOptions, ChartType, ChartDataset } from 'chart.js';
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
  dispositivos: any[] = [];

  public lineChartData: ChartDataset[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Nivel del Agua' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Temperatura' },
    // Datos estáticos de ejemplo; se debe conectar a la base de datos para usar datos reales
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
  ) {}

  async ngOnInit() {
    await this.storage.create();
    console.log('Hola');
    this.disDt = await this.storage.get('disp');
    this.route.paramMap.subscribe(params => {
      this.river = JSON.parse(params.get('river') || '{}');
      // Datos de ejemplo, conectar esto a la base de datos
      this.dispositivos = [
        { nombre: 'Dispositivo 1', nivelAgua: 170, velocidadCorriente: 6 },
        { nombre: 'Dispositivo 2', nivelAgua: 50, velocidadCorriente: 18 },
        { nombre: 'Dispositivo 3', nivelAgua: 110, velocidadCorriente: 9 }
      ];
    });
    this.obtenerSesores();
    this.updateChartLabels(); // Actualiza las etiquetas del gráfico
    this.scheduleDailyUpdate(); // Programa la actualización diaria del gráfico
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

  //sistema de calculo de peligro
  calcularNivelPeligro(nivelAgua: number, velocidadCorriente: number): number {
    if (nivelAgua >= 200 && velocidadCorriente <= 4) {
      return 1; // Nivel 1 - Seguro
    } else if (nivelAgua >= 150 && nivelAgua < 200 && velocidadCorriente >= 5 && velocidadCorriente <= 8) {
      return 2; // Nivel 2 - Seguro
    } else if (nivelAgua >= 100 && nivelAgua < 150 && velocidadCorriente >= 9 && velocidadCorriente <= 13) {
      return 3; // Nivel 3 - Precaución
    } else if (nivelAgua >= 51 && nivelAgua < 100 && velocidadCorriente >= 14 && velocidadCorriente <= 17) {
      return 4; // Nivel 4 - Precaución
    } else if (nivelAgua <= 50 && velocidadCorriente >= 18) {
      return 5; // Nivel 5 - Peligro
    }
    return 1; // Nivel predeterminado si no hay coincidencia
  }

  //colores
  obtenerColor(nivelPeligro: number): string {
    switch (nivelPeligro) {
      case 1:
      case 2:
        return 'rgba(0, 255, 0, 0.3)'; // Verde traslúcido
      case 3:
      case 4:
        return 'rgba(255, 255, 0, 0.3)'; // Amarillo traslúcido
      case 5:
        return 'rgba(255, 0, 0, 0.3)'; // Rojo traslúcido
      default:
        return 'rgba(0, 255, 0, 0.3)'; // Predeterminado
    }
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
