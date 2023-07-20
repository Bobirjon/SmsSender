import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post('http://10.7.119.12:8000/auth/token/login/', { username, password } );
  }

  logout() {
    return this.http.get('http://10.7.119.12:8000/auth/token/logout/')
  }

  getData() {
    return this.http.get('http://10.7.119.12:8000/smssender/alarmreport/')
  }

  getSms(id: number) {
    return this.http.get(`${'http://10.7.119.12:8000/smssender/alarmreport'}/${id}`)
  }

  updateSms(id: number, data: any) {
    return this.http.put(`${'http://10.7.119.12:8000/smssender/alarmreport'}/${id}/`, data)
  }

  postData(body: any) {
    return this.http.post('http://10.7.119.12:8000/smssender/alarmreport/', body)
  }
  
  getUser() {
    return this.http.get('http://10.7.119.12:8000/auth/users/me ')
  }

  sendSms(body: any) {
    return this.http.post('http://10.7.119.12:8000/smssender/smssend/', body)
  }
}