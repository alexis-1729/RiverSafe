import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart,ChartOptions, ChartType, ChartDataset } from 'chart.js';
import { Storage } from '@ionic/storage-angular';
import { RiogetService } from 'src/app/services/rioget.service';
import { AlertaService } from 'src/app/services/alerta.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-datos-sensores',
  templateUrl: './datos-sensores.page.html',
  styleUrls: ['./datos-sensores.page.scss'],
})
export class DatosSensoresPage implements OnInit {
  river: any;
  dispositivos: any[] = [];
  nivelA:any[]=[];
  velocidad:any[]=[];
  // Definir correctamente el tipo de ChartDataset
  public lineChartData: ChartDataset<'line'>[] = [
    { data: this.nivelA, label: 'Nivel del Agua' },
    { data: this.velocidad, label: 'Velocidad del Agua' },
  ];

  public lineChartLabels: string[] = [];

  public lineChartOptions: (ChartOptions & { annotation?: any }) = {
    responsive: true,
  };

  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';  // Tipo de gráfico

  disDt: any[] = [];
  sensores: any[] = [];
  riverst: any[] = [];
  first = false;
  constructor(
    private route: ActivatedRoute,
    private storage: Storage,
    private riogetService: RiogetService,
    private alert: AlertaService,
    private router: Router // Inyecta el Router en el constructor
  ) {}

  async ngOnInit() {
    await this.storage.create();
    this.disDt = await this.storage.get('disp') || [];  // Verificar que 'disp' tenga datos
    this.ejecutar();
  }

  navigateToAlertaDispositivo() {
    this.router.navigate(['/alerta-dispositivo']); // Navega a la página de alerta-dispositivo
  }

  
    async ejecutar(){
      try{
        await this.obtenerSesores();
        for(let i = 0; i < this.dispositivos.length; i++){
          this.velocidad.push(this.dispositivos[i].velocidadCorriente);
          this.nivelA.push(this.dispositivos[i].nivelAgua);
        }
        await this.iniciar();
        console.log("termino");
        
      }catch(error){
        console.log("error", error);
      }
    }
 async iniciar(){
  return new Promise(resolve =>{
    setTimeout(()=>{
      this.route.paramMap.subscribe(params => {
        this.river = JSON.parse(params.get('river') || '{}');
        // DATOS DE EJEMPLO ESTATICOS, CAMBIAR POR LOS DATOS REALES
        // this.dispositivos = [
        //   { nombre: 'Dispositivo 2', nivelAgua: 200, velocidadCorriente: 3 },
        //   { nombre: 'Dispositivo 2', nivelAgua: 170, velocidadCorriente: 6 },
        //   { nombre: 'Dispositivo 3', nivelAgua: 110, velocidadCorriente: 10 }
        // ];
        for(let i = 0; i < this.sensores.length; i++){
          this.dispositivos.push({
            nombre: this.sensores[i].nombre,
            nivelAgua: this.sensores[i].nivelAgua,
            velocidadCorriente: this.sensores[i].velocidadCorriente
          });
        }
        
      });
      resolve(true);
    }, 2000);
    this.updateChartLabels();
    this.scheduleDailyUpdate();
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
    const month = String(date.getMonth() + 1).padStart(2, '0');
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
    return 1; // Nivel predeterminado
  }

  obtenerColor(nivelPeligro: number): string {
    switch (nivelPeligro) {
      case 1:
      case 2:
        return 'rgba(0, 255, 0, 0.3)'; // Verde
      case 3:
      case 4:
        return 'rgba(255, 255, 0, 0.3)'; // Amarillo
      case 5:
        return 'rgba(255, 0, 0, 0.3)'; // Rojo
      default:
        return 'rgba(0, 255, 0, 0.3)'; // Predeterminado
    }
  }

  async obtenerSesores() {
    if (!this.disDt || this.disDt.length === 0) {
      console.error('No hay dispositivos disponibles para obtener sensores.');
      return;
    }

    console.log(this.disDt);
    for (let i = 0; i < this.disDt.length; i++) {
      this.riogetService.getSensor(this.disDt[i]).subscribe(response => {
        if (response.status === 'success') {
          console.log(response.data.length);
          response.data.forEach((sensor: { sens_nivel: any; sens_temp: any; sens_vel: any; }) => {
            this.sensores.push({
              nombre:'Dispositivo',
              nivelAgua: sensor.sens_nivel,
              // temperatura: sensor.sens_temp,
              velocidadCorriente: sensor.sens_vel,
            });
          });
          this.storage.set('sen', this.sensores);
          console.log('Operación de obtención de sensores por dispositivo exitosa.');
        } else {
          console.log('Operación fallida o no se encontraron sensores del dia');
        }
      });
    }

    
  }
}
