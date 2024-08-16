import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
 import { HttpHeaders } from '@angular/common/http';
 
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost/riversf/public/APIU/login'; //ruta de la api
  constructor(private http: HttpClient) { }
    

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
}
