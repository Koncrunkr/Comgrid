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
        this.connect()
    }

    public connect(){
        this.stompClient.activate()
    }

    private disconnect(){
        this.connected = false
    }

    subscribe<In, Out>(topic: Topic<In, Out>, onMessage: (In) => unknown){
        if(this.stompClient.active){
            this.stompClient.subscribe(topic.destination(), message => onMessage(topic.proceedMessage(message)))
        }else{
            this.stompClient.onConnect = (frame) => {
                this.stompClient.onConnect(frame)
                this.stompClient.subscribe(topic.destination(), message => onMessage(topic.proceedMessage(message)))
            }
        }
    }

    sendMessage<In, Out>(topic: Topic<In, Out>, message: Out){
        this.stompClient.send(topic.receive(), {}, JSON.stringify(message))
    }
}

