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

  public tokenExpired(token: string) {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

  public saveToken(token: string): void {
    localStorage.setItem('token', token['auth_token'])
    localStorage.setItem('loggedIn', 'true');
    this.isLoggedIn$.next(true); 
  }

  public deleteToken() {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.setItem('loggedIn', 'false');
    this.isLoggedIn$.next(false);
  }

  public getToken(): string {
    return localStorage .getItem('token')
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

  public isNewForm(isNew: boolean) {
    console.log(isNew);
    
    return isNew  
  }

}