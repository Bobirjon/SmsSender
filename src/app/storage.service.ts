import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public isLoggedIn$: BehaviorSubject<boolean>;

  constructor() {
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    this.isLoggedIn$ = new BehaviorSubject(isLoggedIn);
  }

  public saveToken(token: string): void {
    sessionStorage.removeItem('token')
    sessionStorage.setItem('token', token['auth_token'])
    localStorage.setItem('loggedIn', 'true');
    this.isLoggedIn$.next(true); 
  }

  public deleteToken() {
    sessionStorage.removeItem('token')
    localStorage.setItem('loggedIn', 'false');
    this.isLoggedIn$.next(false);
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