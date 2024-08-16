import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
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
  // constructor(private storage: Storage) {}
  

}
