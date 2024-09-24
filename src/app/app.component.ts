import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { MenuController } from '@ionic/angular';
import { MenuService } from './services/menu.service';
import { NavController } from '@ionic/angular';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {


  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Rios', url: '/rios', icon: 'earth' },
    
    
  ];

  usuario:string = "";
  //acceder a datos del login
   constructor(private menu: MenuController, 
    private menuService: MenuService,
  private storage:Storage,
  private navCtrl: NavController,
private auth:AuthService) {
   }

   async ngOnInit(){
    this.menuService.getMenu().subscribe((isEnable)=>{
      if(isEnable){
        this.menu.enable(true);
      }else{
        this.menu.enable(false);
      }
    });

    }

    async logout(){
      this.auth.logout().subscribe(response=>{
        if(response.status=='success'){
          console.log('sesion cerrada');
          this.navCtrl.navigateRoot('/login');
        }
      })
    }



   }
  


