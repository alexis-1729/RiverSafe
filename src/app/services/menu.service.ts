import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private menuEnabled = new BehaviorSubject<boolean>(this.getMenuStateFromStorage());

  constructor() { }

   habilitarMenu(isEnable: boolean){
    this.menuEnabled.next(isEnable);
    this.saveMenuStateToStorage(isEnable);
  }

  getMenu(){
    return this.menuEnabled.asObservable();
  }

  private saveMenuStateToStorage(isEnabled: boolean) {
    localStorage.setItem('menuEnabled', JSON.stringify(isEnabled));
  }

  // Obtener el estado del menú desde localStorage
  private getMenuStateFromStorage(): boolean {
    const storedState = localStorage.getItem('menuEnabled');
    return storedState ? JSON.parse(storedState) : false;
  }
}
