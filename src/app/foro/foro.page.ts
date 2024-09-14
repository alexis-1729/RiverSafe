import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
@Component({
  selector: 'app-foro',
  templateUrl: './foro.page.html',
  styleUrls: ['./foro.page.scss'],
})
export class ForoPage implements OnInit {
  mensajes: any[] = [
    { titulo: 'Primera Conversación', contenido: 'Contenido del mensaje...', finalizado: false },
    { titulo: 'Consulta de Usuario', contenido: 'Contenido del mensaje...', finalizado: true }
  ];

  cuenta :string = '';
  isAdmin: boolean = false; // Lógica para determinar si el usuario es administrador

  constructor(    private storage: Storage,
  ) { 

  }

  async ngOnInit() {
    // Aquí se cargará los mensajes desde la base de datos o servicio
    await this.storage.create();
    this.cuenta = await this.storage.get('cuenta_id');
    this.cargarMensajes();
    // Aquí se debería establecer la lógica para verificar si el usuario es admin
    this.verificarSiEsAdmin();
  }

  cargarMensajes() {
    // Lógica para cargar mensajes desde un servicio o base de datos
    console.log('Cargando mensajes...');
    // Ejemplo: podrías hacer una solicitud HTTP para obtener los mensajes
  }

  verificarSiEsAdmin() {
    // Aquí deberías tener la lógica para determinar si el usuario actual es un administrador
    // Ejemplo: esta lógica podría estar basada en algún servicio de autenticación
    if(this.cuenta == '1')
    this.isAdmin = true; // Cambiar según la lógica de autenticación real
    else this.isAdmin = false;
  }

  responderMensaje(mensajes: any) {
    console.log('Responder mensajes:', mensajes);
    // Lógica para permitir que los administradores respondan un mensaje
    if (!this.isAdmin) {
      alert('Solo los administradores pueden responder a los mensajes.');
      return;
    }
    // Aquí agregarías el código para permitir la respuesta
  }

  crearMensaje() {
    console.log('Crear mensajes');
    // Redirige a la página para crear un nuevo mensaje
    // Aquí deberías usar el Router de Angular o alguna otra lógica de navegación
  }

  cerrarHilo(mensajes: any) {
    mensajes.finalizado = true;
    console.log('Cerrando hilo:', mensajes);

    // Aquí se debe actualizar el estado del mensaje en la base de datos
    // Ejemplo: enviar una solicitud HTTP para actualizar el estado de finalización
  }
}
