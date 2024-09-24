

import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { MenuService } from '../services/menu.service';
import { Geolocation } from'@ionic-native/geolocation/ngx';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  username: string = '';
  password: string = '';
  userid:string ='';
  userLocation: { lat: number; lng: number } = { lat: 0, lng: 0 };

  constructor(private authService: AuthService, private navCtrl: NavController,
    private storage: Storage, private menuS:MenuService,
    private geolocation: Geolocation) {
    this.storage.create(); //inicializar almacenammiento
   }

   ngOnInit(){
    this.menuS.habilitarMenu(false);
   }

   //calculo de ubicacion
  async getPos(){
    try {
      const position = await this.geolocation.getCurrentPosition();
      this.storage.set('userLat',position.coords.latitude);
      this.storage.set('userLng',position.coords.longitude);
      this.guardarPos(position.coords.latitude,position.coords.longitude);
      console.log('Ubicacion guardada');
    } catch (error) {
      console.error('Error obteniendo la ubicación:', error);
    }
   }
   
   async guardarPos(latitud:number, longitud:number){
    this.userid = await this.storage.get('user_id');
      this.authService.savePos(this.userid,latitud, longitud).subscribe(response =>{
        if(response.status == 'error'){
          console.log('Erro', response.message);
        }
      });
   }

   //-------------
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
       //llamada a calculo de ubicacion
        this.getPos();
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