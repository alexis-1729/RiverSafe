import { Component, OnInit } from '@angular/core';
import { RiogetService } from '../services/rioget.service';
import { AuthService } from '../services/auth.service';
import { Storage } from '@ionic/storage-angular';
import { NavController } from '@ionic/angular';
import { MenuService } from '../services/menu.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(private rioService: RiogetService, private authS: AuthService,
    private storage: Storage, private navCtrl: NavController, private menuS:MenuService) {
      this.storage.create();
     }
  selectedRio: string = '';
  selectedRioInfo: any; 
  rios: any[] = []; //almacena la lsita de rios

  //datos del formulario
  name: string = '';
  apellido: string = '';
  username: string = '';
  email: string = '';
  celular: string = '';
  password: string = '';
  repassword: string = '';
  ngOnInit() {
    this.menuS.habilitarMenu(false);
    //carga la lista llamando a la funcion
    this.loadRios();
  }

  

  loadRios() {
    this.rioService.getListaRios().subscribe(
      (response) => {
        if (response.status === 'success') {
          this.rios = response.data;  // Asigna la lista de ríos a la variable rios
        }
      },
      (error) => {
        console.error('Error al cargar la lista de ríos', error);
      }
    );
  }

  register(){
    //obtengo informacion del rio seleccionado
    this.selectedRioInfo = this.rios.find(rio => rio.monitoreo_id === this.selectedRio);
    //agregar validaciones

    //envio de datos al servicio
    this.authS.registrar(this.name, this.apellido, this.username, 
      this.email, this.celular, this.password, this.selectedRio, 
      this.selectedRioInfo.est_id, "2", this.repassword).subscribe(response => {
        if (response.status === 'success') {
          //guarda los datos de la nueva sesion
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
          console.log('registro fallido:', response.message);
        }
      }, error => {
        console.error('Error en la petición:', error);
      });
    }



  }

