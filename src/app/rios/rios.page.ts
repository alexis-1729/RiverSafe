import { Component, OnInit } from '@angular/core';

import { Storage } from '@ionic/storage-angular';
import { RiogetService } from '../services/rioget.service';
import { NavController } from '@ionic/angular';
import { Geolocation } from'@ionic-native/geolocation/ngx';
import { AlertaService } from '../services/alerta.service';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import { AuthService } from '../services/auth.service';
//instale geolocation de ionic para saber la ubicacion del usuario


@Component({
  selector: 'app-rios',
  templateUrl: './rios.page.html',
  styleUrls: ['./rios.page.scss'],
})
export class RiosPage implements OnInit {
  //Variables para guardar los datos de sesion
      userId: string = '';
      cuentaid: string = '';
      estadoId:string = '';
      usuario: string = '';
      nombre:string = '';
      apellido:string = '';
      rioid:string = '';
      email:string = '';
      monitoreo_id:string = '';
      disDt: any[] = [];//lsita de dispositivos
      userLocation: { lat: number; lng: number } = { lat: 0, lng: 0 };
      rivers: any[] = []; //lista de rios 
      sensores: any[] = [];
    //constructor que inicializa algunos servicios  
  constructor(private storage: Storage, private riogetService : RiogetService,
    private geolocation: Geolocation, private alert: AlertaService,
  private authS:AuthService) {
      
   }


   //funcion que inicia al abrir la pagina rios
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

  //--------------------------------------------
  //notificaciones push
    // Método para inicializar y configurar notificaciones push
   
    //------------------------------------------------------------------------------------------------
  //funcion para obtener un rio en especifico
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


  //obtine los dispositivos mediante el id del rio
  obtenerDispositivos(id:string){
    this.riogetService.getListaDispositivos(id).subscribe(response=>{
      if(response.status == 'success'){
        //proceso de mandar datos del arreglo retornado
        //obtengo los datos de la tabla dispositivos
        const datos = response.data;

        datos.foreach((dispositivo: any)=>{
          this.disDt.push({
            sensor_id:dispositivo.circuito_id,
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
    
 


//Obtiene la ubicación actual del usuario y la asigna a userLocation.
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
}

//!!!!Añadir funcion para obtener rios
//funcion para obtener los rios
  getRivers() {
    this.riogetService.getListaRios().subscribe(response=>{
      if(response.status=='success'){
     this.rivers= response.data;
        
     }else{
      console.log('obtencion de datos fallida', response.message);
     }
    });
    return this.rivers;

  }

   //Convierte grados a radianes, necesario para los cálculos trigonométricos.
   deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
    //Implementa la fórmula del Haversine para calcular la distancia entre dos puntos geográficos.

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
  
  
//Recibe un objeto river con las propiedades lat y lng. Calcula la distancia entre la ubicación del usuario (this.userLocation) 
  //y el río, y determina si el río está dentro de un rango aceptable (maxDistance).
  isNearUser(river: { lat: number, lng: number }): boolean {
    const distance = this.calculateDistance(river.lat, river.lng, this.userLocation.lat, this.userLocation.lng);
    const maxDistance = 50; // Distancia máxima en kilómetros para considerar que un río está "cerca"
    return distance <= maxDistance;
  }
  
  
  filterRivers() {
    // Filtra los ríos basados en la ubicación del usuario
    if (!this.userLocation) {
      console.warn('User location is not defined yet.');
      return;
    }
      this.rivers.forEach((riv: any)=>{
       this.riogetService.getUbi(riv.riverubi_id).subscribe(response=>{
          if(response.status == 'success'){
            const transformedRiver = {
              lat: response.data.ubi_latitud,
              lng: response.data.ubi_longitud
            };

            if(this.isNearUser(transformedRiver)){
              //llamado a la funcion para para almacenar los dispositivos
              //con el rio cercano
              this.obtenerDispositivos(riv.data.monitoreo_id);
            }
          }else{
            console.log('Obtencion de datos fallida', response.message);
          }
       });
      
    });
  }

  //funcion para obtener los sensores de los rios cercanos
  obtenerSesores(){
    this.disDt.forEach(disp =>{
      this.riogetService.getSensor(disp.sensor_id).subscribe(response=>{
        if(response.status == 'success'){
            this.sensores = response.data;
        }else{
          console.log('Operacion Fallida');
        }
      });
    })
  }

  //preocedimiento para una alerta
  //-----------------------------------------------
  usuarios: any[] = [];
  alerta(){
    if(this.cuentaid == '1' || this.cuentaid == '3'){
      //obtengo el id del rio que monitoreo
        this.alert.getUserest(this.estadoId).subscribe(response =>{
          if(response.status == 'success'){
            //obtengo user por el estado que monitorea mi admin
            this.usuarios = response.data;
            
          }else{
            console.log('operacion fallida', response.message);
          }
        });
    }
  }
  //se obtiene la posiscion actual del user 
  userspos: any[] = [];
   getPos(){
    this.usuarios.forEach((user:any)=>{
      this.alert.getPos(user.user_id).subscribe(response=>{
        if(response.status == 'success'){
        this.userspos.push({
          user_id: response.data.user_id,
          lattitud: response.data.latitud,
          longitud: response.data.longitud,
          userpos_id:response.data.userpos_id
       });
      }else{
        console.log('error', response.message);
      }
      });
    });
   }

   //metodo para filtrar usuarios cercanos a un rio en cuestion
  filtrarUsers(){
    this.userspos.forEach(pos =>{
      const transformedRiver = {
        lat: pos.latitud,
        lng: pos.longitud
      };
      if(this.isNearUser(transformedRiver)){
          this.alert.envialert(pos.userpos_id);
      }
    })
  }
  
}
