import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket$: WebSocketSubject<any>;

  constructor() {
    this.socket$ = webSocket('ws://10.7.119.12/ws/alarm_report/');
  }

  sendMessage(message: any): void {
    
    this.socket$.next(message);
  }

  receiveMessage(): Observable<any> {
    return this.socket$.asObservable();
  }
}
