import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
 import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RiogetService {

  private apiUrl = 'http://localhost/riversf/public/APIU/obtenerRios';
  private apiURL2 = 'http://localhost/riversf/public/APIU/obtenerListaRios';
  constructor(private http: HttpClient) { }

  getRio(rioid:string): Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body ={
      rioid : rioid
    }
    return this.http.post<any>(this.apiUrl, body);
  }

  getListaRios(): Observable<any>{
    return this.http.get(this.apiURL2);
  }

}
