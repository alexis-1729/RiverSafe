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
     
      riverubi_id:string = '';
      disDt: any[] = [];//lsita de dispositivos
      userLocation: { lat: number; lng: number } = { lat: 0, lng: 0 };
      rivers: any[] = []; //lista de rios 
      riverst: any[] = []; 
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
   await this.getUserLocation();
    this.ejecutar();
  }

    //------------------------------------------------------------------------------------------------
  //funcion para obtener un rio en especifico
  async obtenerRio(){
    //conexion al servidor para que retorne los datos del rio segun sea el seleccionado
    this.riogetService.getRio(this.rioid).subscribe(response =>{
      if(response.status == 'success'){
        //cargo los datos
        //id de ubicacion
        this.riverubi_id = response.data.riverubi_id;
        console.log('Operacion obtenerRio exitoso');
      }else{
        console.log('Error', response.message);
      }
    }, error =>{
      console.error('Error en la peticion', error);
    });
  }


  //obtine los dispositivos mediante el id del rio
  async obtenerDispositivos(id:string){
   // return new Promise((resolve=>{
  //   setTimeout(()=>{
   console.log(id);
      this.riogetService.getListaDispositivos(id).subscribe(response=>{
        if(response.status == 'success'){
           //proceso de mandar datos del arreglo retornado
           //obtengo los datos de la tabla dispositivos
           for(let i = 0;  i < response.data.length; i++)
           this.disDt.push(response.data[i]);
          //  console.log(response.data);
           //console.log('dispositivo obtenido');
           //console.log(this.disDt.length);
           this.storage.set('disp', this.disDt);
         }else{
           console.log('Obtencion de datos fallida', response.message);
         }
       }, error=>{
         console.log('Erro en la peticion', error);
       });
   //     resolve(true);
   //   },1000);
   // })); 
  
   }
    
 


//Obtiene la ubicación actual del usuario y la asigna a userLocation
//y guarda en la base de datos.
async getUserLocation() {
  try {
    const position = await this.geolocation.getCurrentPosition();
    this.userLocation.lat = position.coords.latitude;
    this.userLocation.lng = position.coords.longitude;
    this.alert.savePos(this.userId,this.userLocation.lat,this.userLocation.lng).subscribe(response=>{
      if(response.status == 'success'){
        console.log('ubicacion registrada con exito');
      }else console.log('error al guardar ubicacion');
    });
  } catch (error) {
    console.error('Error obteniendo la ubicación:', error);
  }
}

//!!!!Añadir funcion para obtener rios
//funcion para obtener los rios
 async getRivers() {
  return new Promise((resolve=>{
    setTimeout(()=>{
      this.riogetService.getListaRios().subscribe(response=>{
        if(response.status=='success'){
       this.rivers= response.data;
          console.log('operacion exitos getrivers');
       }else{
        console.log('obtencion de datos fallida', response.message);
       }
      });

      resolve(true);
    },2000);
    

  }));
  }

   //Convierte grados a radianes, necesario para los cálculos trigonométricos.
   deg2rad(deg: number): number {
     // console.log('calculando cordenada polar');
    return deg * (Math.PI / 180);
  }
    //Implementa la fórmula del Haversine para calcular la distancia entre dos puntos geográficos.

  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
   // console.log('calculando distancias');
   //console.log(lat1, ' ', lng1, ' ', lat2, ' ', lng2);
    const R = 6371; // Radio de la Tierra en kilómetros
    lat1 = this.deg2rad(lat1);
    lng1 = this.deg2rad(lng1);
    lat2 = this.deg2rad(lat2);
    lng2 = this.deg2rad(lng2);
    const dLat = lat2 - lat1;
    const dLng = lng2 - lng1;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distancia en kilómetros

   // console.log('distancia entre el rio y el user ',distance);
    return distance;
  }
  
  
//Recibe un objeto river con las propiedades lat y lng. Calcula la distancia entre la ubicación del usuario (this.userLocation) 
  //y el río, y determina si el río está dentro de un rango aceptable (maxDistance).
  isNearUser(river: { lat: number, lng: number },userlat:any, userlng:any): boolean {
    //console.log('near user');
    const distance = this.calculateDistance(river.lat, river.lng, userlat, userlng);
    const maxDistance = 50; // Distancia máxima en kilómetros para considerar que un río está "cerca"
    return distance <= maxDistance;
  }
  
  // rivid:any[]=[];
  async filterRivers() {
   return new Promise((resolve =>{
    setTimeout(()=>{
      if (!this.userLocation) {
        console.log('User location is not defined yet.');
        return;
      }
        this.rivers.forEach((riv: any)=>{
          //console.log(riv.riverubi_id, ' id');
         this.riogetService.getUbi(riv.riverubi_id).subscribe(response=>{
            if(response.status == 'success'){
              //console.log(response.data.ubi_latitud);
              const transformedRiver = {
                lat: response.data.ubi_latitud,
                lng: response.data.ubi_longitud
                
              };
              //console.log(transformedRiver.lat,' ', transformedRiver.lng);
  
              if(this.isNearUser(transformedRiver, this.userLocation.lat, this.userLocation.lng)){
                //llamado a la funcion para para almacenar los dispositivos
                //con el rio cercano
                this.riverst.push({
                  nombre:riv.monitoreo_nombre,
                  longitud:transformedRiver.lng,
                  latitud:transformedRiver.lat
                });
                // this.rivid.push(riv.riverubi_id);
               this.obtenerDispositivos(riv.monitoreo_id);
              }else console.log('no esta cerca');
            }else{
              console.log('Obtencion de datos fallida', response.message);
            }
         });
      });
    //  
      resolve(true);
    },2000);
   }));
    // Filtra los ríos basados en la ubicación del usuario
   
  }

  async ejecutar(){
    try{
      await this.getRivers();
      await this.filterRivers();
      console.log('termino');
      // this.storage.set('rio',this.rivid);
    }catch(error){
console.log('error', error);
    }
    // console.log(this.disDt.length);
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


  //preocedimiento para una alerta
  //-----------------------------------------------
  usuarios: any[] = [];
  alerta(){
    if(this.cuentaid == '1' || this.cuentaid == '3'){
      //obtengo el id del rio que monitoreo
        this.alert.getUserest(this.estadoId).subscribe(response =>{
          if(response.status == 'success'){
            //obtengo users por el estado que monitorea mi admin
            this.usuarios = response.data;
            console.log('operacion obtencion de usuarios por estado exitosa');
          }else{
            console.log('operacion fallida', response.message);
          }
        });
    }
  }
  //se obtienen las posiscion actuales de los users 
  userspos: any[] = [];
   getPos(){
    this.usuarios.forEach((user:any)=>{
      this.alert.getPos(user.user_id).subscribe(response=>{
        if(response.status == 'success'){
          // this.userspos = response.data;
         this.userspos.push({
           user_id: response.data.user_id,
           latitud: response.data.latitud,
           longitud: response.data.longitud,
           userpos_id:response.data.userpos_id
        });
      console.log('operacion getpos exitosa')
      }else{
        console.log('error', response.message);
      }
      });
    });
   }
   rioUbilat:any;
   rioUbilng:any;

   //metodo para filtrar usuarios cercanos a un rio en cuestion
   rioAdmin(){
    this.riogetService.getUbi(this.riverubi_id).subscribe(response =>{
      if(response.status == 'success'){
        this.rioUbilat=  response.data.ubi_latitud;
        this.rioUbilng =  response.data.ubi_longitud;
        console.log('se obtuvo la posicion del rio admin', this.riverubi_id);
      }
    });
   }

 filtrarUsers(){ 
    this.userspos.forEach(pos =>{
      const transformedRiver = {
        lat: pos.latitud,
        lng: pos.longitud
      };
      if(this.isNearUser(transformedRiver,this.rioUbilat, this.rioUbilng)){
        console.log('el user esta cerca ', transformedRiver.lat, ' ', transformedRiver.lng);
          // this.alert.envialert(pos.userpos_id);
      }
    })
  }

  // ----------------------------------------
  //USO DE FIREBASE
  tok:any;
  //solicita permiso y despues envia un token para asociarlo al user
    pushNoti(){
      PushNotifications.requestPermissions().then(permission => {
        if (permission.receive === 'granted') {
          PushNotifications.register();
          console.log('permiso concedido');
        }
      });
      PushNotifications.addListener('registration', (token: Token) => {
        // Aquí envías el token a tu backend (API en CodeIgniter)
        this.tok = token.value;
        this.alert.saveToken(token.value, this.userId).subscribe(response=>{
          if(response.status == 'success'){
            console.log('se asocio el token');
          }else console.log('fallo al asociarlo');
        });
      });
    }

//envia la notificacion
    titl:any = 'peligro rio';
    body:any ='Favor de realizar las medidas preventivas';
    sendAlert(){
      this.alert.sendNoti(this.tok, this.titl,this.body);
    }
  
}
