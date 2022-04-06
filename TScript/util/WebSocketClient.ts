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

    public connect<In, Out>(topic: Topic<In, Out>, onMessage: (In) => unknown){
        this.stompClient.connect({},
            (frame) => {
                this.stompClient.subscribe(topic.destination(), message => {
                    const str = new TextDecoder().decode(message.binaryBody)
                    onMessage(topic.proceedMessage(str))
                })
                this.connected = true
            },
            this.disconnect,
            this.disconnect
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
            const currentOnConnect = this.stompClient.onConnect
            this.stompClient.onConnect = (frame) => this.stompClient.subscribe(topic.destination(), message => {
                currentOnConnect(frame)
                const str = new TextDecoder().decode(message.binaryBody)
                onMessage(topic.proceedMessage(str))
            })
        }
    }

    sendMessage<In, Out>(topic: Topic<In, Out>, message: Out){
        this.stompClient.send(topic.receive(), {}, JSON.stringify(message))
    }
}

