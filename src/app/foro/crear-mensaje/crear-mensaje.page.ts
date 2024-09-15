import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { ForoService } from 'src/app/services/foro.service';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-crear-mensaje',
  templateUrl: './crear-mensaje.page.html',
  styleUrls: ['./crear-mensaje.page.scss'],
})
export class CrearMensajePage {
  titulo: string = '';
  contenido: string = '';
  user: string='';
  rio: string = '';
  
  // archivos: File[] = [];

  constructor(
    private storage:Storage,
    private foroS:ForoService,
    private navCtr:NavController
  ) { }

  async ngOnInit(){
    await this.storage.create();
    this.user = await this.storage.get('user_id');
    this.rio = await this.storage.get('user_rioid');
  }
  // seleccionarArchivos(event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   if (input && input.files) {
  //     const archivosSeleccionados = Array.from(input.files);
  //     const totalSize = archivosSeleccionados.reduce((sum, file: File) => sum + file.size, 0);

  //     if (totalSize > 15 * 1024 * 1024) {
  //       // Mostrar error si supera 15 MB
  //       alert('Los archivos no pueden superar los 15 MB.');
  //       return;
  //     }

  //     this.archivos = archivosSeleccionados;
  //   }
  // }

  enviarMensaje() {
    if (this.titulo.length < 10 || this.contenido.length > 255) {
      alert('El título o mensaje excede el límite permitido.');
      return;
    }
    //console.log(this.contenido, this.titulo, this.user, this.rio);

   this.foroS.crearMensaje(this.user,this.rio, this.contenido, this.titulo).subscribe(response=>{
       if(response.status=='success'){
         console.log('Se creo un mensaje nuevo');
         this.navCtr.navigateForward('/foro');
         
     }else{
        console.log('Error en la operacion');
      }
     });
    // Lógica para enviar el mensaje con los archivos adjuntos
    
  }
}
