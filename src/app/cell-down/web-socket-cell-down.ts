// websocket.service.ts

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: WebSocket;
  readonly wsUrl = 'ws://10.7.119.12/ws2/celldown/';

  constructor() {
    this.socket = new WebSocket(this.wsUrl);
  }

  // Method to send a message through the websocket
  sendMessage(message: any) {
    this.socket.send(message);
  }

  // Method to handle incoming messages
  listen(): Observable<any> {
    return new Observable(observer => {
       this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          observer.next(data);
        } catch (error) {
          observer.error(error);
        }
      };
      this.socket.onerror = (event) => observer.error(event);
      this.socket.onclose = () => observer.complete();
    });
  }

  // Method to close the websocket connection
  close() {
    this.socket.close();
  }
}
