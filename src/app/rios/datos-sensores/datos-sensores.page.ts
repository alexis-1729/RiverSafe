import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { RiogetService } from 'src/app/services/rioget.service';
import { NavController } from '@ionic/angular';
import { Geolocation } from'@ionic-native/geolocation/ngx';
import { AlertaService } from 'src/app/services/alerta.service';
@Component({
  selector: 'app-datos-sensores',
  templateUrl: './datos-sensores.page.html',
  styleUrls: ['./datos-sensores.page.scss'],
})
export class DatosSensoresPage implements OnInit {

  
      disDt: any[] = [];//lsita de dispositivos     
      sensores: any[] = [];
      riverst: any[] = [];
  constructor(private storage: Storage, private riogetService : RiogetService,
    private geolocation: Geolocation, private alert: AlertaService) { }

    async ngOnInit() {
      await this.storage.create();
      console.log('hola');
      this.disDt = await this.storage.get('disp');
      this.obtenerSesores();
  }

  async obtenerSesores(){
    console.log(this.disDt);
    for(let i = 0; i < this.disDt.length; i++){
     this.riogetService.getSensor(this.disDt[i]).subscribe(response=>{
       if(response.status == 'success'){
         console.log(response.data.length);
         for(let i = 0; i <response.data.length; i++){
           this.sensores.push({
             nivelAgua:response.data[i].sens_nivel,
             temperatura:response.data[i].sens_temp,
             velocidadCorriente:response.data[i].sens_vel,
           });
         }
         // console.log(this.sensores);
         this.storage.set('sen', this.sensores);
           console.log('operacion obtencion de sensores por dispositivo ');
       }else{
         console.log('Operacion Fallida');
       }
     });
    }
    
    
  }
  

  

 

 
}
