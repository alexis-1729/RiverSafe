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
  constructor(private storage: Storage, 
    private userId: String,
    private cuentaid: String,
    private estadoId:String,
    private usuario: String,
    private nombre:String,
    private apellido:String,
    private rioid:String,
    private email:String,
    private riogetService : RiogetService) {}

  async ngOnInit() {
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

  obtenerRio(){
    this.riogetService.getRio(this.rioid).subscribe(response =>{
      if(response.status == 'sucess'){
        //cargo los datos
      }else{
        console.log('Error', response.message);
      }
    }, error =>{
      console.error('Error en la peticion', error);
    });
  }

}
