import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { RiogetService } from '../services/rioget.service';
import { NavController } from '@ionic/angular';

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
  constructor(private storage: Storage, 
    
    private riogetService : RiogetService) {}

  async ngOnInit() {
    await this.storage.create();
    //recuperacion de datos
    this.userId = await this.storage.get('user_id');
    this.usuario = await this.storage.get('username');
    this.cuentaid = await this.storage.get('cuenta_id');
    this.rioid = await this.storage.get('user_rioid');
    this.nombre = await this.storage.get('user_nombre');
    this.email = await this.storage.get('user_email');
    this.estadoId = await this.storage.get('est_id');
    this.apellido = await this.storage.get('user_apellido');
  }

  async obtenerRio(){
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

}
