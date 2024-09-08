import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private alertController: AlertController, private storage: Storage) {}

  async ngOnInit() {
    await this.storage.create();
    const showPopup = await this.storage.get('showPopup');

    // Si la preferencia no existe o el usuario ha decidido mostrar el popup de nuevo
    if (showPopup !== false) {
      this.showAlert();
    }
  }

  async showAlert() {
    const alert = await this.alertController.create({
      header: 'ATENCIÓN. IMPORTANTE LEER',
      message: `Les queremos recordar que los datos aquí presentados son vistos tanto por ustedes ciudadanos como por las autoridades. Todos estos datos deben ser comprobados antes por las autoridades correspondientes , en este caso, los municipios cercanos. No se alarmen y tomen precauciones hasta esperar el aviso de las autoridades por medio de la app u otros, gracias.`,
      buttons: [
        {
          text: 'Aceptar',
          handler: async () => {
            const doNotShowAgain = (document.getElementById('checkbox') as HTMLInputElement).checked;
            if (doNotShowAgain) {
              await this.storage.set('showPopup', false);
            } else {
              await this.storage.set('showPopup', true);
            }
          }
        }
      ],
      cssClass: 'custom-alert' // Añadimos una clase para estilos personalizados
    });

    await alert.present();
    // Añadir un checkbox personalizado después de que el alert se presente
    const alertElement = document.querySelector('ion-alert');
    if (alertElement) {
      const checkboxHtml = `
        <ion-item>
          <ion-checkbox id="checkbox"></ion-checkbox>
          <ion-label>No mostrar de nuevo</ion-label>
        </ion-item>
      `;
      alertElement.querySelector('.alert-message')?.insertAdjacentHTML('beforeend', checkboxHtml);
    }
  }
}
