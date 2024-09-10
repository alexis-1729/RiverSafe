import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AlertaService {

 
  private apiUrl = 'https://ingetec-itsz.com/Riversafe/public/APIU/getUserpos';
  private apiUrl2 = 'https://ingetec-itsz.com/Riversafe/public/APIU/getUserest';
  private apiUrl3 = 'https://ingetec-itsz.com/Riversafe/public/APIU/idalert';
  private apiUrl4 = 'https://ingetec-itsz.com/Riversafe/public/APIU/saveUserpos';
  private apiUrl5 = 'https://ingetec-itsz.com/Riversafe/public/APIU/associateToken';
  private apiUrl6 = 'https://ingetec-itsz.com/Riversafe/public/APIU/sendNotification';

  constructor(private http: HttpClient) { }

  savePos(user_id:string, latitud:number, longitud:number):Observable<any>{
    const body ={
      user_id:user_id,
      latitud:latitud,
      longitud:longitud
    }
    return this.http.post(this.apiUrl4,body);
  }
  getPos(user_id:string): Observable<any>{
    const body={
      user_id:user_id
    }
    return this.http.post(this.apiUrl,body);
  }
  getUserest(est_id:string): Observable<any>{
    const body={
      est_id:est_id
    }
    return this.http.post(this.apiUrl2, body);
  }

  envialert(userpos_id:string):Observable<any>{
    const body={
      userpos_id:userpos_id
    }
    return this.http.post<any>(this.apiUrl3,body);
  }
  saveToken(token:any, user_id:string):Observable<any>{
    const body={
      token:token
      ,user_id:user_id
    }
    return this.http.post<any>(this.apiUrl5,body);
  }

  sendNoti(token:any, title:any, body:any){
    const dt={
      to:token,
      title:title,
      body:body
    }
return this.http.post<any>(this.apiUrl6, dt);
  }
}
