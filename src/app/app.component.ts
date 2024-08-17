import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { MenuController } from '@ionic/angular';
import { MenuService } from './services/menu.service';


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
  //acceder a datos del login
   constructor(private menu: MenuController, private menuService: MenuService) {
   }

   ngOnInit(){
    this.menuService.getMenu().subscribe((isEnable)=>{
      if(isEnable){
        this.menu.enable(true);
      }else{
        this.menu.enable(false);
      }
    });

    }
   }
  


