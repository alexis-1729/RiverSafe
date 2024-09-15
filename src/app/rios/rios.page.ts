import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { RiogetService } from '../services/rioget.service';
import { NavController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AlertaService } from '../services/alerta.service';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-rios',
  templateUrl: './rios.page.html',
  styleUrls: ['./rios.page.scss'],
})
export class RiosPage implements OnInit {
  // Variables de sesión
  userId: string = '';
  cuentaid: string = '';
  estadoId: string = '';
  usuario: string = '';
  nombre: string = '';
  apellido: string = '';
  rioid: string = '';
  email: string = '';
  riverubi_id: string = '';
  disDt: any[] = []; // Lista de dispositivos
  userLocation: { lat: number; lng: number } = { lat: 0, lng: 0 };
  rivers: any[] = []; // Lista de ríos
  riverst: any[] = []; // Ríos filtrados
  sensores: any[] = [];
  usuarios: any[] = [];
  userspos: any[] = [];
  tok: any;
  titl: any = 'peligro rio';
  body: any = 'Favor de realizar las medidas preventivas';
  rios: any[] = [];
  rioUbilat: any;
  rioUbilng: any;

  constructor(
    private storage: Storage,
    private riogetService: RiogetService,
    private geolocation: Geolocation,
    private alert: AlertaService,
    private authS: AuthService,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {
    await this.storage.create();
    this.userId = await this.storage.get('user_id');
    this.usuario = await this.storage.get('username');
    this.cuentaid = await this.storage.get('cuenta_id');
    this.rioid = await this.storage.get('user_rioid');
    this.nombre = await this.storage.get('user_nombre');
    this.email = await this.storage.get('user_email');
    this.estadoId = await this.storage.get('est_id');
    this.apellido = await this.storage.get('user_apellido');
    await this.getUserLocation();
    this.ejecutar();

    // Datos de ejemplo
    this.rios = [
      {
        nombre: 'Río 1',
        dispositivos: [
          { nivelAgua: 170, velocidadCorriente: 6 },
          { nivelAgua: 70, velocidadCorriente: 14 },
          { nivelAgua: 110, velocidadCorriente: 9 }
        ]
      },
      {
        nombre: 'Río 2',
        dispositivos: [
          { nivelAgua: 200, velocidadCorriente: 3 },
          { nivelAgua: 150, velocidadCorriente: 7 },
          { nivelAgua: 123, velocidadCorriente: 8 }
        ]
      }
    ];
  }

  async obtenerRio() {
    this.riogetService.getRio(this.rioid).subscribe(response => {
      if (response.status == 'success') {
        this.riverubi_id = response.data.riverubi_id;
        console.log('Operación obtenerRio exitosa');
      } else {
        console.log('Error', response.message);
      }
    }, error => {
      console.error('Error en la petición', error);
    });
  }

 
  async obtenerDispositivos(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.riogetService.getListaDispositivos(id).subscribe(response => {
        if (response.status == 'success') {
          console.log('Datos de dispositivos recibidos:', response.data); // Verificar aquí
  
          // Limpiar disDt antes de agregar los nuevos dispositivos
          this.disDt = [];
          for (let i = 0; i < response.data.length; i++) {
            this.disDt.push(response.data[i]);
          }
  
          this.storage.set('disp', this.disDt);
          resolve();
        } else {
          console.log('Obtención de datos fallida', response.message);
          reject();
        }
      });
    });
  }
  

  async getUserLocation() {
    try {
      const position = await this.geolocation.getCurrentPosition();
      this.userLocation.lat = position.coords.latitude;
      this.userLocation.lng = position.coords.longitude;
      this.alert.savePos(this.userId, this.userLocation.lat, this.userLocation.lng).subscribe(response => {
        if (response.status == 'success') {
          console.log('Ubicación registrada con éxito');
        } else {
          console.log('Error al guardar ubicación');
        }
      });
    } catch (error) {
      console.error('Error obteniendo la ubicación:', error);
    }
  }

  async getRivers() {
    return new Promise(resolve => {
      setTimeout(() => {
        this.riogetService.getListaRios().subscribe(response => {
          if (response.status == 'success') {
            this.rivers = response.data;
            console.log('Operación exitosa getRivers');
          } else {
            console.log('Obtención de datos fallida', response.message);
          }
        });
        resolve(true);
      }, 2000);
    });
  }

  async filterRivers() {
    return new Promise(resolve => {
      setTimeout(async () => {
        if (!this.userLocation) {
          console.log('User location is not defined yet.');
          return;
        }
  
        this.riverst = [];
  
        const riverPromises = this.rivers.map(async (riv: any) => {
          const response = await this.riogetService.getUbi(riv.riverubi_id).toPromise();
  
          if (response.status == 'success') {
            const transformedRiver = {
              lat: response.data.ubi_latitud,
              lng: response.data.ubi_longitud
            };
  
            await this.obtenerDispositivos(riv.monitoreo_id);
            console.log('ID del monitoreo:', riv.monitoreo_id); // Verificar que el ID es correcto

            if (this.isNearUser(transformedRiver, this.userLocation.lat, this.userLocation.lng)) {
              // Limpiar disDt antes de obtener nuevos dispositivos
              await this.obtenerDispositivos(riv.monitoreo_id);
  
              // Calcular el nivel máximo de alerta entre los dispositivos
              const alertInfo = this.calcularNivelMaximo(this.disDt);
  
              // Añadir el río a la lista con el nivel de alerta correcto
              this.riverst.push({
                nombre: riv.monitoreo_nombre,
                longitud: transformedRiver.lng,
                latitud: transformedRiver.lat,
                alertLevel: alertInfo.nivel, // Usar el nivel de alerta más alto
                dispositivo: alertInfo.dispositivo
              });
            } else {
              console.log('El río no está cerca');
            }
          } else {
            console.log('Obtención de datos fallida', response.message);
          }
        });
  
        await Promise.all(riverPromises);
  
        resolve(true);
      }, 2000);
    });
  }
  
  
  async ejecutar() {
    try {
      await this.getRivers();
      await this.filterRivers();
      console.log('Termino la ejecución');
    } catch (error) {
      console.log('Error', error);
    }
  }

  // Cálculo de nivel de peligro y colores
  calcularNivelMaximo(dispositivos: any[]): { nivel: number, dispositivo: any } {
    if (!dispositivos || dispositivos.length === 0) {
      return { nivel: 1, dispositivo: null }; // Valor predeterminado
    }
  
    let maxAlert = dispositivos[0];
    dispositivos.forEach(d => {
      const nivelActual = this.calcularNivelPeligro(d.nivelAgua, d.velocidadCorriente);
      if (nivelActual > this.calcularNivelPeligro(maxAlert.nivelAgua, maxAlert.velocidadCorriente)) {
        maxAlert = d;
      }
    });
  
    const nivelMax = this.calcularNivelPeligro(maxAlert.nivelAgua, maxAlert.velocidadCorriente);
  
    return { nivel: nivelMax, dispositivo: maxAlert };
  }
  
  /*getColorForAlertLevel(nivel: number): string {
    if (nivel <= 2) {
      return 'green';
    } else if (nivel <= 4) {
      return 'yellow';
    } else {
      return 'red';
    }
  }*/
  
  
  calcularNivelPeligro(nivelAgua: number, velocidadCorriente: number): number {
    if (nivelAgua >= 200 && velocidadCorriente <= 4) {
      return 1;
    } else if (nivelAgua >= 150 && nivelAgua < 200 && velocidadCorriente >= 5 && velocidadCorriente <= 8) {
      return 2;
    } else if (nivelAgua >= 100 && nivelAgua < 150 && velocidadCorriente >= 9 && velocidadCorriente <= 13) {
      return 3;
    } else if (nivelAgua >= 51 && nivelAgua < 100 && velocidadCorriente >= 14 && velocidadCorriente <= 17) {
      return 4;
    } else if (nivelAgua <= 50 && velocidadCorriente >= 18) {
      return 5;
    }
    return 1;
  }

  /*obtenerColor(nivelPeligro: number): string {
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
        return 'rgba(0, 255, 0, 0.3)'; // Predeterminado verde
    }
  }*/

    
  // Función para obtener la clase de alerta para el estilo de los ríos
  getAlertaClass(alertLevel: number): string {
  

    if (alertLevel <= 2) {
      return 'green-alert';  // Clase para verde
    } else if (alertLevel <= 4) {
      return 'yellow-alert'; // Clase para amarillo
    } else {
      return 'red-alert';    // Clase para rojo
    }
  }
  
  
  
  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distancia en kilómetros
    return distance;
  }

  isNearUser(riverCoords: { lat: number; lng: number }, userLat: number, userLng: number): boolean {
    const maxDistance = 100; // Distancia máxima en kilómetros
    const distance = this.calculateDistance(riverCoords.lat, riverCoords.lng, userLat, userLng);
    return distance <= maxDistance;
  }
}


  //funcion para obtener los sensores de los rios cercanos
  // async obtenerSesores(){
  //    console.log(this.disDt);
  //    for(let i = 0; i < this.disDt.length; i++){
  //     this.riogetService.getSensor(this.disDt[i]).subscribe(response=>{
  //       if(response.status == 'success'){
  //         console.log(response.data.length);
  //         for(let i = 0; i <response.data.length; i++){
  //           this.sensores.push({
  //             nivelAgua:response.data[i].sens_nivel,
  //             temperatura:response.data[i].sens_temp,
  //             velocidadCorriente:response.data[i].sens_vel,
  //           });
  //         }
  //         // console.log(this.sensores);
  //         this.storage.set('sen', this.sensores);
  //           console.log('operacion obtencion de sensores por dispositivo ');
  //       }else{
  //         console.log('Operacion Fallida');
  //       }
  //     });
  //    }
     
     
  //  }

 