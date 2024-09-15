import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { ForoService } from '../services/foro.service';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-foro',
  templateUrl: './foro.page.html',
  styleUrls: ['./foro.page.scss'],
})
export class ForoPage implements OnInit {
  mensajes: any[] = [];

  cuenta :string = '';
  user_id: string = ''; 
  rio_id:string = '';
  isAdmin: boolean = false; // Lógica para determinar si el usuario es administrador
  constructor(    private storage: Storage,
    private foroS: ForoService, private navCtrl:NavController
  ) { 

  }

  async ngOnInit() {
    // Aquí se cargará los mensajes desde la base de datos o servicio
    await this.storage.create();
    this.cuenta = await this.storage.get('cuenta_id');
    this.user_id = await this.storage.get('user_id');
    this.rio_id = await this.storage.get('user_rioid');
    this.verificarSiEsAdmin();
    this.cargarMensajes();
    // Aquí se debería establecer la lógica para verificar si el usuario es admin
    
  }

  cargarMensajes() {
    // Lógica para cargar mensajes desde un servicio o base de datos
    if(this.isAdmin== true){
      this.foroS.getMensajes(this.user_id).subscribe(response=>{
        if(response.status=='success'){
          for(let i = 0; i <response.data.length; i++){
            this.mensajes.push(response.data[i]);
          }
        }else{
          console.log('Error en la funcion o no se encontro mensajes');
        }
      });
    }
    // Ejemplo: podrías hacer una solicitud HTTP para obtener los mensajes
  }

  verificarSiEsAdmin() {
    // Aquí deberías tener la lógica para determinar si el usuario actual es un administrador
    // Ejemplo: esta lógica podría estar basada en algún servicio de autenticación
    if(this.cuenta == '1')
    this.isAdmin = true; // Cambiar según la lógica de autenticación real
    else this.isAdmin = false;
  }

  responderMensaje(mens: any) {
  
    // Lógica para permitir que los administradores respondan un mensaje
    if (!this.isAdmin) {
      alert('Solo los administradores pueden responder a los mensajes.');
      return;
    }else{
      this.foroS.responderMensaje(mens.id_mensaje).subscribe(response=>{
        if(response.status=='success'){
          console.log('revisado');
        }else console.log('error');
      });
    }
    // Aquí agregarías el código para permitir la respuesta
  }

  crearMensaje() {
    this.navCtrl.navigateForward('/crear-mensaje');
    // Redirige a la página para crear un nuevo mensaje
    // Aquí deberías usar el Router de Angular o alguna otra lógica de navegación
  }

  cerrarHilo(mens: any) {
    console.log("cerrando hilo");
    

    // Aquí se debe actualizar el estado del mensaje en la base de datos
    // Ejemplo: enviar una solicitud HTTP para actualizar el estado de finalización
  }
}
