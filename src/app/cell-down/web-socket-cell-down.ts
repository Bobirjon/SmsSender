// websocket.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket$: WebSocketSubject<any>
  // private socket: WebSocket;
  // private dataSubject = new BehaviorSubject<any[]>([])
  readonly wsUrl = 'ws://10.7.119.12/ws2/celldown/';
  // public data$ = this.dataSubject.asObservable()
  constructor() {
    this.socket$ = new WebSocketSubject(this.wsUrl)
    // this.socket = new WebSocket(this.wsUrl);

    // this.socket.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   console.log('open websocket');
      
    //   this.dataSubject.next(data); // Update the BehaviorSubject with the new data
    };

    public getDataStream(): Observable<any> {
      return this.socket$.asObservable();
    }

    public closeConnection() {
      this.socket$.complete()
    }

    // this.socket.onclose = () => {
    //   console.log('WebSocket connection closed');
    // };
  }

  // closeConnection() {
  //   if (this.socket) {
  //     this.socket.close();
  //   }
  //   console.log('closed');
    
  // }

