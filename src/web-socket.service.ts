import { Injectable } from "@angular/core"
import * as io from "socket.io-client"
import { Observable, Subject } from "rxjs"

@Injectable({ providedIn: 'root' })

export class WebSocketService {

    socket: WebSocket;
    url: string = 'ws://10.7.119.12/ws/alarm_report/'
    dataSubject = new Subject<any>()

    constructor() {
        this.socket = new WebSocket(this.url)
        this.socket.addEventListener('message', (event) => {
            const data = JSON.parse(event.data)
            this.dataSubject.next(data)
        })
    }

    getDataObservable() {
        return this.dataSubject.asObservable();
    }
}