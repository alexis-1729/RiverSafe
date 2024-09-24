import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
//import { AlertService } from '../services/alert.service'; // cambiar por el servicio de notificaciones push up

@Component({
  selector: 'app-alerta-dispositivo',
  templateUrl: './alerta-dispositivo.page.html',
  styleUrls: ['./alerta-dispositivo.page.scss'],
})
export class AlertaDispositivoPage implements OnInit {
  selectedDevices: string[] = []; // Dispositivos seleccionados
  alertTitle: string = ''; // Título de la alerta
  alertMessage: string = ''; // Mensaje de la alerta
  nombreUsuario: string = 'riverAdmin'; // Nombre de usuario (lo puedes obtener dinámicamente)

  constructor(
    private alertController: AlertController,
    private router: Router,
    // private alertService: AlertService // Servicio para enviar la alerta
  ) {}

  ngOnInit() {}

  async confirmarEnvio() {
    const alert = await this.alertController.create({
      header: '¿ESTÁ SEGURO DE ENVIAR ESTA ALERTA?',
      message: `Acepto que yo ${this.nombreUsuario} estoy mandando esta alerta luego de haber leído y seguido el protocolo necesario.`,
      inputs: [
        {
          name: 'confirmacion',
          type: 'checkbox',
          label: `Acepto que yo ${this.nombreUsuario} estoy enviando esta alerta.`,
          value: 'confirmar',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Estoy seguro',
          handler: (data) => {
            if (data.includes('confirmar')) {
              this.enviarAlerta(); // Envía la alerta
              return true;
            } else {
              return false;
            }
          },
          cssClass: 'alert-button',
        },
      ],
    });

    await alert.present();
  }

  enviarAlerta() {
    const alertData = {
      titulo: this.alertTitle,
      mensaje: this.alertMessage,
    };

    // Envía la alerta utilizando el servicio
    /*this.alertService.enviarAlerta(alertData).subscribe(response => {
      if (response.status === 'success') {
        this.router.navigate(['/datos-sensores']); // Redirige a la página de datos sensores
        console.log('Alerta enviada con éxito');
      } else {
        console.log('Error al enviar la alerta', response.message);
      }
    });
  }*/
}
}


