import {Injectable} from "@angular/core"
import * as io from "socket.io-client"
import { Observable } from "rxjs"

@Injectable({ providedIn: 'root'})

export class WebSocketService {

    socket: WebSocket;
    url: string = 'ws://10.7.119.12/ws/alarm_report/'

    constructor() {
        this.socket = new WebSocket(this.url)
    }
    
    listen(): Observable<any> {
        
        return new Observable((subscriber) => {
            this.socket.onmessage = ((data: any) => {
                subscriber.next(data)
            })
        })
    }

    emit(data: any) {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(data)
        }
    }
}