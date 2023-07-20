import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {}



  clean(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    sessionStorage.removeItem('token')
    sessionStorage.setItem('token', token['auth_token'])    
  }

  public deleteToken() {
    sessionStorage.removeItem('token')
  }

  public getToken(): string {
    return sessionStorage.getItem('token')
  }

  public getNotification(notif: any){
    let notification:any
    switch(notif) {
      case "A2" : {
        notification = ['A2','A3', 'A4', 'A5']
        break;
      }
      case "A3" : {
        notification = ['A3', 'A4', 'A5']
        break;
      }
      case "A4" : {
        notification = ['A4', 'A5']
        break;
      }
      case "A5" : {
        notification = ['A5']
        break;
      }
    }
    return notification
  }

}