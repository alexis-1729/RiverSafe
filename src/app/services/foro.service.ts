import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ForoService {

  private apiUrl = 'https://ingetec-itsz.com/Riversafe/public/APIU/crearMensaje';
  private apiUrl2 = 'https://ingetec-itsz.com/Riversafe/public/APIU/listaMensaje';
  private apiUrl3 = 'https://ingetec-itsz.com/Riversafe/public/APIU/eliminarMensaje';
  private apiUrl4 = 'https://ingetec-itsz.com/Riversafe/public/APIU/responderMensaje';
  constructor(private http: HttpClient) { }

  crearMensaje(user:string, rio:string, mensaje:string, titulo:string): Observable<any>{
    const body = {
      user: user,
      rio: rio,
      mensaje:  mensaje,
      titulo:titulo
    }
    return this.http.post(this.apiUrl, body);
  }

  getMensajes(admin: string): Observable<any>{
    const body={
      admin:admin
    }
    return this.http.post(this.apiUrl2, body);
  }

  responderMensaje(id:string): Observable<any>{
    const body ={
      id:id
    }
    return this.http.post(this.apiUrl4,body);
  }
  eliminarMensaje(id:string): Observable<any>{
    const body={
      id:id
    }
    return this.http.post(this.apiUrl3, body);
  }
}
