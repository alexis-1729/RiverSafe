import { Component, OnInit } from '@angular/core';

import { Storage } from '@ionic/storage-angular';
import { RiogetService } from '../services/rioget.service';
import { NavController } from '@ionic/angular';
import { Geolocation } from'@ionic-native/geolocation/ngx';
//instale geolocation de ionic para saber la ubicacion del usuario


@Component({
  selector: 'app-rios',
  templateUrl: './rios.page.html',
  styleUrls: ['./rios.page.scss'],
})
export class RiosPage implements OnInit {
      userId: string = '';
      cuentaid: string = '';
      estadoId:string = '';
      usuario: string = '';
      nombre:string = '';
      apellido:string = '';
      rioid:string = '';
      email:string = '';
      monitoreo_id:string = '';
      disDt: any[] = [];
      userLocation: { lat: number; lng: number } = { lat: 0, lng: 0 };
      rivers: any[] = [];  // Aquí pondremos los datos de los ríos
  constructor(private storage: Storage, private riogetService : RiogetService,
    private geolocation: Geolocation) {
   }


  async ngOnInit() {
    await this.storage.create();
    //recuperacion de datos del login o registro para poder tener disponibles los datos en cualquier pagina
    this.userId = await this.storage.get('user_id');
    this.usuario = await this.storage.get('username');
    this.cuentaid = await this.storage.get('cuenta_id');
    this.rioid = await this.storage.get('user_rioid');
    this.nombre = await this.storage.get('user_nombre');
    this.email = await this.storage.get('user_email');
    this.estadoId = await this.storage.get('est_id');
    this.apellido = await this.storage.get('user_apellido');
    
    this.getUserLocation();
    
  }

  async obtenerRio(){
    //conexion al servidor para que retorne los datos del rio segun sea el seleccionado
    this.riogetService.getRio(this.rioid).subscribe(response =>{
      if(response.status == 'sucess'){
        //cargo los datos
        this.storage.set('monitoreo_id', response.data.monitoreo_id);
        this.monitoreo_id = response.data.monitoreo_id;
      }else{
        console.log('Error', response.message);
      }
    }, error =>{
      console.error('Error en la peticion', error);
    });
  }

  obtenerDispositivos(){
    //se obtnienen los dispositivos segun sea el rio seleccionado
    this.riogetService.getListaDispositivos(this.monitoreo_id).subscribe(response=>{
      if(response.status == 'success'){
        //proceso de mandar datos del arreglo retornado
        //obtengo los datos de la tabla dispositivos
        const datos = response.data;

        datos.foreach((dispositivo: any)=>{
          this.disDt.push({
            sensor_id:dispositivo.sensor_id,
            circuito_nombre:dispositivo.circuito_nombre            
        });
        });
      }else{
        console.log('Obtencion de datos fallida', response.message);
      }
    }, error=>{
      console.log('Erro en la peticion', error);
    });
  }
    
 



async getUserLocation() {
  try {
    const position = await this.geolocation.getCurrentPosition();
    this.userLocation.lat = position.coords.latitude;
    this.userLocation.lng = position.coords.longitude;
    console.log('Latitud:', this.userLocation.lat);
    console.log('Longitud:', this.userLocation.lng);
  } catch (error) {
    console.error('Error obteniendo la ubicación:', error);
  }
  // this.geolocation.getCurrentPosition().then((resp) => {
  //   this.userLocation = {
  //     lat: resp.coords.latitude,
  //     lng: resp.coords.longitude
  //   };
  // }).catch((error) => {
  //   console.error('Error getting location', error);
  //   // En caso de error se pueden asignar valores por defecto o manejar el error de otra manera
  //   this.userLocation = { lat: 0, lng: 0 };
  // });
}
//Obtiene la ubicación actual del usuario y la asigna a userLocation.

  //IMPORTANTE LEER
  //Falta colocar userLocation en el login y que al iniciar sesion te pregunte sobre la ubicacion para que esta parte y las siguientes funcionen correctamente



  getRivers() {
    // Retorna un array de objetos con datos de los ríos y dispositivos
    return [
      { nombre: 'Río Amazonas', estado: 'Activo', longitud: -70.5, latitud: -3.5, dispositivos: [/* datos dispositivos */] },
      // Más ríos...
      // este es un ejemplo, reemplazar por el rio chiquito y sus coordenadadas correctas
      //Tambien falta colocar justo aqui la conexion al servidor para los dispositivos
    ];

  }

  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distancia en kilómetros
    return distance;
  }
  //Implementa la fórmula del Haversine para calcular la distancia entre dos puntos geográficos.
  
  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
  //Convierte grados a radianes, necesario para los cálculos trigonométricos.
  

  isNearUser(river: { lat: number, lng: number }): boolean {
    const distance = this.calculateDistance(river.lat, river.lng, this.userLocation.lat, this.userLocation.lng);
    const maxDistance = 50; // Distancia máxima en kilómetros para considerar que un río está "cerca"
    return distance <= maxDistance;
  }
  //Recibe un objeto river con las propiedades lat y lng. Calcula la distancia entre la ubicación del usuario (this.userLocation) 
  //y el río, y determina si el río está dentro de un rango aceptable (maxDistance).
  
  filterRivers() {
    // Filtra los ríos basados en la ubicación del usuario
    if (!this.userLocation) {
      console.warn('User location is not defined yet.');
      return;
    }
    this.rivers = this.getRivers().filter(river => {
      const transformedRiver = {
        lat: river.latitud,
        lng: river.longitud
      };
      return this.isNearUser(transformedRiver);
    });
  }
  
}
