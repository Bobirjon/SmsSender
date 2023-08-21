import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  URLsender = 'http://10.7.119.12/api/';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    localStorage.setItem('role', username)
    return this.http.post(this.URLsender + 'auth/token/login/', { username, password } );
  }

  logout() {
    return this.http.get(this.URLsender + 'auth/token/logout/')
  }

  getData() {
    return this.http.get(this.URLsender + 'smssender/alarmreport/')
  }

  getFilteredData() {
    return this.http.get(this.URLsender + 'smssender/alarmreport/?is_complete=false')
  }

  getSms(id: number) {
    return this.http.get(`${this.URLsender + 'smssender/alarmreport'}/${id}`)
  }

  updateSms(id: number, data: any) {
    return this.http.put(`${this.URLsender + 'smssender/alarmreport'}/${id}/`, data)
  }

  postData(body: any): Observable<any> {
    return this.http.post(this.URLsender + 'smssender/alarmreport/', body)
  }
  
  getUser() {
    return this.http.get(this.URLsender + 'auth/users/me ')
  }

  sendSms(body: any) {
    return this.http.post(this.URLsender + 'smssender/smssend/', body)
  }
}