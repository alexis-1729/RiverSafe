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
  private apiUrl3 = 'http://localhost/riversf/public/APIU/getDispositivos';
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

  getListaDispositivos(monitoreo_id:string){
    const body ={
      monitoreo_id : monitoreo_id
    }
      return this.http.post<any>(this.apiUrl3, body);
  }

}
