import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AlertaService {

  private apiUrl = 'http://localhost/riversf/public/APIU/getUserpos'
  private apiUrl2 = 'http://localhost/riversf/public/APIU/getUserest'
  private apiUrl3 = 'http://localhost/riversf/public/APIU/idalert';
  constructor(private http: HttpClient) { }

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
}
