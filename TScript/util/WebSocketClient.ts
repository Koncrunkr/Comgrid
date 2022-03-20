import SockJS from "sockjs-client";
import {CompatClient, Stomp} from "@stomp/stompjs";
import {Topic} from "./websocket/Topic";


export class WebSocketClient{
    private readonly socket: WebSocket
    private readonly stompClient: CompatClient
    private connected: boolean = false
    constructor(apiLink: string) {
        this.socket = new SockJS(apiLink);
        this.stompClient = Stomp.over(this.socket)

    }

    private connect(){
        this.stompClient.connect({},
            (frame) => {
                this.connected = true
            },
            this.disconnect,
            this.disconnect
        )
    }

    private disconnect(){
        this.connected = false
    }

    subscribe(topic: Topic, onMessage: (message) => unknown){
        this.stompClient.subscribe(topic.destination(), onMessage)
    }

    sendMessage(topic: Topic, message: any){
        this.stompClient.send(topic.destination(), {}, JSON.stringify(message))
    }
}

