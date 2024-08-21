

import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { MenuService } from '../services/menu.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private navCtrl: NavController,
    private storage: Storage, private menuS:MenuService) {
    this.storage.create(); //inicializar almacenammiento
   }

   ngOnInit(){
    this.menuS.habilitarMenu(false);
   }

  login() {
    this.authService.login(this.username, this.password).subscribe(response => {
      if (response.status === 'success') {
        this.storage.set('user_id', response.data.user_id);
        this.storage.set('username', response.data.username);
        this.storage.set('cuenta_id', response.data.cuenta_id);
        this.storage.set('user_rioid', response.data.user_rioid);
        this.storage.set('user_nombre', response.data.user_nombre);
        this.storage.set('user_email', response.data.user_email);
        this.storage.set('est_id', response.data.est_id);
        this.storage.set('user_apellido', response.data.user_apellido);
        this.storage.set('token', response.data.token);
        this.menuS.habilitarMenu(true);
        this.navCtrl.navigateForward('/home');
      } else {
        // Mostrar mensaje de error
        console.log('Login fallido:', response.message);
      }
    }, error => {
      console.error('Error en la petición:', error);
    });
  }

  goToRegister() {
    // Lógica para manejar el clic en el botón de registro
    console.log('Registro botón/enlace clicado');
    this.navCtrl.navigateForward('/register'); // Navegar a la página de registro
  }
}