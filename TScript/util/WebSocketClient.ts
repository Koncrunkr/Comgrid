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

    subscribe<MessageIn, MessageOut>(topic: Topic<MessageIn, MessageOut>, onMessage: (MessageIn) => unknown){
        if(this.stompClient.connected) {
            this.stompClient.subscribe(topic.receiveDestination(), message => {
                const str = new TextDecoder().decode(message.binaryBody)
                onMessage(topic.proceedMessage(str))
            })
        }else{
            this.subscribers.push(() => {
                this.stompClient.subscribe(topic.receiveDestination(), message => {
                    const str = new TextDecoder().decode(message.binaryBody)
                    onMessage(topic.proceedMessage(str))
                })
            })
        }
    }

    sendMessage<MessageIn, MessageOut>(topic: Topic<MessageIn, MessageOut>, message: MessageOut){
        this.stompClient.send(topic.sendDestination(), {}, JSON.stringify(message))
    }
}

