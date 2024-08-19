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
  private apiUrl4 = 'http://localhost/riversf/public/APIU/obtenerubi';
  private apiUrl5 = 'http://localhost/riversf/public/APIU/obtenSensorDia';
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

  getListaDispositivos(monitoreo_id:string): Observable<any>{
    const body ={
      monitoreo_id : monitoreo_id
    }
      return this.http.post<any>(this.apiUrl3, body);
  }

  getUbi(riverubi_id:string): Observable<any>{
    const body={
      riverubi_id:riverubi_id
    }
    return this.http.post(this.apiUrl4, body);
  }

  getSensor(sensor_id:string): Observable<any>{
    const body={
      sensor_id_id:sensor_id
    }
    return this.http.post(this.apiUrl5, body);
  }

}
