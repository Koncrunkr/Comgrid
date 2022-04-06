import SockJS from "sockjs-client";
import {CompatClient, Stomp} from "@stomp/stompjs";
import {Topic} from "./websocket/Topic";


export class WebSocketClient{
    private readonly socket: WebSocket
    private readonly stompClient: CompatClient
    private connected: boolean = false
    private subscribers = new Array<() => unknown>()
    constructor(apiLink: string) {
        this.socket = new SockJS(apiLink);
        this.stompClient = Stomp.over(this.socket)
        this.stompClient.connect({}, () => {
            for (let subscriber of this.subscribers) {
                subscriber()
            }}
        )
    }

    private disconnect(){
        this.connected = false
    }

    subscribe<In, Out>(topic: Topic<In, Out>, onMessage: (In) => unknown){
        if(this.stompClient.connected) {
            this.stompClient.subscribe(topic.destination(), message => {
                const str = new TextDecoder().decode(message.binaryBody)
                onMessage(topic.proceedMessage(str))
            })
        }else{
            this.subscribers.push(() => {
                this.stompClient.subscribe(topic.destination(), message => {
                    const str = new TextDecoder().decode(message.binaryBody)
                    onMessage(topic.proceedMessage(str))
                })
            })
        }
    }

    sendMessage<In, Out>(topic: Topic<In, Out>, message: Out){
        this.stompClient.send(topic.receive(), {}, JSON.stringify(message))
    }
}

