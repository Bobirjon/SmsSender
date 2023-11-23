import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SortDirection } from '@angular/material/sort';


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
    return this.http.get(this.URLsender + 'smssender/alarmreport/?limit=1000&offset=0')
  }

  getDataTest( 
    level: string, 
    type: string, 
    description: string, reason: string, 
    problem: string, createdAt: any, startTime: any, 
    endTime: any, 
    region: string,
    ordering: string,
    order: string,
    page: number,
    perpage: number,): Observable<any> {

    // const url = this.URLsender + `smssender/alarmreport/?level__contains=${level}
    // &type__contains=${type}&problem__contains=${problem}&reason__contains=${reason}
    // &description__contains=${description}&region__contains=${region}
    // &start_time__contains=${startTime}&end_time__contains=${endTime}
    // &created_at__contains=${createdAt}&ordering=${order}${ordering}
    // &page=${page}&page_size=${perpage}`
    const url = this.URLsender + `smssender/alarmreport/?level__contains=${level}
      &type__contains=${type}&description__contains=${description}
      &region__contains=${region}&createdat_in=${createdAt}
      &starttime_in=${startTime}&endtime_in=${endTime}
      &problem__contains=${problem}&reason__contains=${reason}
      &ordering=${order}${ordering}&page=${page}&page_size=${perpage}`
    
    return this.http.get(url)

  }

  getFilteredData() {
    return this.http.get(this.URLsender + 'smssender/alarmreport/?is_complete=false&limit=1000&offset=0')
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
    return this.http.get(this.URLsender + 'auth/users/me')
  }

  sendSms(body: any) {
    return this.http.post(this.URLsender + 'smssender/send/', body)
  }

  postReceiverData(body: any) {
    return this.http.post(this.URLsender + 'smssender/receiver/', body)
  }

  getreceiverData() {
    return this.http.get(this.URLsender + 'smssender/receiver/')
  }

  deleteReceiver(id: number) {
    return this.http.delete((`${this.URLsender + 'smssender/receiver'}/${id}/`))
  }

  sendTestSMS(body: any) {
    return this.http.post(this.URLsender + 'smssender/sendsms/', body) 
  }

  exportExcel(startTime: any, endTime: any) {
    console.log((`${this.URLsender + 'smssender/alarmreport/'}?
    end_time__range=${startTime},${endTime}&page_size=1000`));

    const url = this.URLsender + 
            `smssender/alarmreport/?end_time__range=${startTime},${endTime}&page_size=1000`
    
    return this.http.get(url)
  }

  deleteData(id: number) {
    return this.http.delete(`${this.URLsender + 'smssender/alarmreport'}/${id}/`)
  }
}