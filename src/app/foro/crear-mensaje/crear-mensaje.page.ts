import { Component } from '@angular/core';

@Component({
  selector: 'app-crear-mensaje',
  templateUrl: './crear-mensaje.page.html',
  styleUrls: ['./crear-mensaje.page.scss'],
})
export class CrearMensajePage {
  titulo: string = '';
  contenido: string = '';
  archivos: File[] = [];

  constructor() { }

  seleccionarArchivos(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input && input.files) {
      const archivosSeleccionados = Array.from(input.files);
      const totalSize = archivosSeleccionados.reduce((sum, file: File) => sum + file.size, 0);

      if (totalSize > 15 * 1024 * 1024) {
        // Mostrar error si supera 15 MB
        alert('Los archivos no pueden superar los 15 MB.');
        return;
      }

      this.archivos = archivosSeleccionados;
    }
  }

  enviarMensaje() {
    if (this.titulo.length > 50 || this.contenido.length > 500) {
      alert('El título o mensaje excede el límite permitido.');
      return;
    }
    // Lógica para enviar el mensaje con los archivos adjuntos
    console.log('Mensaje enviado:', this.titulo, this.contenido, this.archivos);
  }
}
