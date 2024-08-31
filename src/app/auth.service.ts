import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, filter } from 'rxjs';
import { SortDirection } from '@angular/material/sort';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  URLsender = 'http://10.7.119.12/api/';

  constructor(private http: HttpClient) {

  }

  login(username: string, password: string): Observable<any> {
    localStorage.setItem('role', username)
    return this.http.post(this.URLsender + 'auth/token/login/', { username, password });
  }

  logout() {
    return this.http.get(this.URLsender + 'auth/token/logout/')
  }

  getData() {
    return this.http.get(this.URLsender + 'smssender/alarmreport/?limit=1000&offset=0')
  }

  getTemplateSMS() {
    return this.http.get(this.URLsender + 'smssender/alarmreport/?is_send_sms=false')
  }

  getDataTest(
    level: string,
    type: string,
    description: string,
    reason: string,
    problem: string,
    createdAt: string,
    startTime: string,
    endTime: string,
    region: string,
    informed: string,
    id: string,
    order: string,
    ordering: string,
    page: number,
    perpage: number,
  ): Observable<any> {

    const url = this.URLsender + `smssender/alarmreport/?ordering=${order}${ordering}&page=${page}&page_size=${perpage}
      &level__icontains=${level}&type__icontains=${type}&description__icontains=${description}&reason__icontains=${reason}
      &problem__icontains=${problem}&createdat_in=${createdAt}&starttime_in=${startTime}&endtime_in=${endTime}
      &region__icontains=${region}&informed__icontains=${informed}&id=${id}`
    console.log(url);
    
    return this.http.get(url)
  }

  getRecievers(
    nameFilter: string,
    numberFilter: string,
    networkFilter: string,
    criteriaFilter: string,
    notificationFilter: string,
    regionFilter: string,
    ordering: string,
    order: string,
    page: number,
    perpage: number
  ): Observable<any> {
    const url = this.URLsender + `smssender/receiver/?name__icontains=${nameFilter}
      &tel_number__icontains=${numberFilter}&network=${networkFilter}
      &criteria=${criteriaFilter}&notification=${notificationFilter}
      &region=${regionFilter}&ordering=${order}${ordering}&page=${page}&page_size=${perpage}`
    console.log(url);
    
    return this.http.get(url)
  }

  getFilteredData() {
    return this.http.get(this.URLsender + 'smssender/alarmreport/?is_complete=false&is_send_sms=true&page_size=500')
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

  // exportExcel(startTime: any, endTime: any) {
  //   const url = this.URLsender +
  //     `smssender/alarmreport/?end_time__range=${startTime},${endTime}&page=${page}&page_size=${perpage}`

  //   return this.http.get(url)
  // }

  exportExcel(startTime: any, endTime: any, page: any, perpage: any) {
    const dataAll = startTime + ',' + endTime
    const params = {
      end_time__range: dataAll,
      page: page,
      page_size: perpage
    }
    const url = this.URLsender +
      `smssender/alarmreport`

    return this.http.get(url, { params })
  }

  deleteData(id: number) {
    return this.http.delete(`${this.URLsender + 'smssender/alarmreport'}/${id}/`)
  }

  postNewIdeas(body: any) {
    return this.http.post(this.URLsender + 'smssender/newtask/', body)
  }

  getNewIdeas() {
    return this.http.get(this.URLsender + 'smssender/newtask/')
  }

  updateNewIdeas(id: number, data: any) {
    return this.http.put(`${this.URLsender + 'smssender/newtask'}/${id}/`, data)
  }

  deleteNewIdeas(id: number) {
    return this.http.delete(`${this.URLsender + 'smssender/newtask'}/${id}/`)
  }

  getKPI() {
    return this.http.get(this.URLsender + 'smssender/userkpi2/kpi2')
  }

  getLog() {
    console.log(this.URLsender + 'smssender/userkpi2/log2');
    
    return this.http.get(this.URLsender + 'smssender/userkpi2/log2')
  }

  getUsers() {
    return this.http.get(this.URLsender + 'auth/users/')
  }

  testting(data: any) {
    return this.http.get("http://10.7.119.12/api/smssender/effectedsites  ", data)
    
  }

  PostSelectedCase(data: any) {
    return this.http.post(this.URLsender + 'smssender/selectedcase/add/', data)
  }

  GetSelectedCase( page: number, perpage: number) {
    const url = this.URLsender + `smssender/selectedcase/list/?page=${page}&page_size=${perpage}`
    return this.http.get(url)
  }

  updateComment(id: number, data: any) {
    return this.http.put(`${this.URLsender + 'smssender/selectedcase'}/${id}/`, data)
  }

  getCorrection( page: number, perpage: number) {
    const url = this.URLsender + `smssender/smslog/?page=${page}&page_size=${perpage}`
    return this.http.get(url)
  }

  changeCorrectionType(id: number, data: any) {
    return this.http.put(`${this.URLsender + 'smssender/smslog'}/${id}/`, data)
  }

  getCurrentAlarm() {
    return this.http.get('http://10.7.119.12/api2/umbrella/activealarm/')
  }

  getCellDown(power:string, dg:string, battery: string, comment: string, alarmType: string, siteName: string) {
    let url = 'http://10.7.119.12/api2/umbrella/celldown/' +
              `?dg_empty=${dg}&power_empty=${power}&battery_empty=${battery}` +
              `&comment_empty=${comment}&alarmtype=${alarmType}&site=${siteName}`
              
    return this.http.get(url)
  }

  getChronicSites() {
    return this.http.get('http://10.7.119.12/api2/umbrella/chronicsite/')
  }

  getDoorOpen(
    sitename: string, worktype: string, entertime: string, 
    username: string, organization : string, number: string, regions: any,
    sort: string, order: SortDirection, page: number, pageSize: any
  ) {
    const url = 'http://10.7.119.12/api2/doorcontrol/sitevisit/'
    const requestUrl = `${url}?ordering=${order}${sort}&page=${page}&page_size=${pageSize}&visitor__username__icontains=${username}&visitor__phonenumber__icontains=${number}&sitename__icontains=${sitename}&worktype__icontains=${worktype}&entertime__gte=${entertime}&region__icontains=${regions}`
    console.log(requestUrl);
    
    return this.http.get(requestUrl)
  }


  updateExitDoorOpen(id: any, body: any) {
    const url = 'http://10.7.119.12/api2/doorcontrol/sitevisit/'
    const requestUrl = `${url}${id}/`
    return this.http.patch(requestUrl ,body)
  }

  updateCommentDoorOpen(id: any, body: any) {
    console.log(id);
    console.log(body);
    
    const url = 'http://10.7.119.12/api2/doorcontrol/sitevisit/'
    const requestUrl = `${url}${id.id}/`
    console.log(requestUrl);
    
    return this.http.patch(requestUrl ,body)
  }

  rtmcReport(){
    return this.http.get('http://10.7.119.12/api2/umbrella/sitedownbyregion/')
  }

}