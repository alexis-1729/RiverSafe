import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
 import { HttpHeaders } from '@angular/common/http';
 
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost/riversf/public/APIU/login'; //ruta de la api
  private apiUrl2 = 'http://localhost/riversf/public/APIU/registrar';
  private apiUrl3 = 'http://localhost/riversf/public/APIU/saveUserpos';
  constructor(private http: HttpClient) { }
    
  //logear 

    login(username: string, password: string): Observable<any> {
       const headers = new HttpHeaders({
         'Content-Type': 'application/json'
       });
  
      const body = {
        username: username,
        password: password
      };
      // { headers: headers }
      return this.http.post<any>(this.apiUrl, body);
    }

    //registrar
    registrar(name:string, apellido:string, username: string,
      email:string, celular:string, password: string, 
      selectedRio:string, est_id:string, cuenta_id:string, repassword:string): Observable<any> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });
 
     const body = {
      name:name,
      apellido:apellido,
       username: username,
       email:email,
       celular:celular,
       password: password,
       rioid:selectedRio,
       est_id:est_id,
       cuenta_id:cuenta_id,
       repassword:repassword
     };
     // { headers: headers }
     return this.http.post<any>(this.apiUrl2, body);
   }

   savePos(user_id:string, latitud:number, longitud:number): Observable<any>{
    const body = {
      user_id:user_id,
      latitud:latitud,
      longitud: longitud
     };

     return this.http.post<any>(this.apiUrl3, body);

   }

}
