import SockJS from "sockjs-client";
import {CompatClient, Stomp} from "@stomp/stompjs";
import {Topic} from "./websocket/Topic";
import { getState, State } from "../authorization/State";


export class WebSocketClient{
    private readonly socket: WebSocket
    private readonly stompClient: CompatClient
    private connected: boolean = false
    private subscribers = new Array<() => unknown>()
    constructor(apiLink: string) {
        this.socket = new SockJS(apiLink);
        this.stompClient = Stomp.over(this.socket)
        getState().whenReady().then((state) => {
            this.stompClient.connect(state.getAuthorizationHeader(), () => {
                for (let subscriber of this.subscribers) {
                    subscriber()
                }}
            )
        })
    }

    private disconnect(){
        this.connected = false
    }

    subscribe<MessageIn, MessageOut>(topic: Topic<MessageIn, MessageOut>, onMessage: (MessageIn) => unknown){
        if(this.stompClient.connected) {
            this.stompClient.subscribe(
              topic.receiveDestination(),
              message => {
                const str = new TextDecoder().decode(message.binaryBody)
                onMessage(topic.proceedMessage(str))
              },
              getState().getAuthorizationHeader()
            )
        }else{
            this.subscribers.push(() => {
                this.stompClient.subscribe(
                  topic.receiveDestination(),
                  message => {
                      const str = new TextDecoder().decode(message.binaryBody)
                      onMessage(topic.proceedMessage(str))
                  },
                  getState().getAuthorizationHeader()
                )
            })
        }
    }

    sendMessage<MessageIn, MessageOut>(topic: Topic<MessageIn, MessageOut>, message: MessageOut){
        this.stompClient.send(topic.sendDestination(), getState().getAuthorizationHeader(), JSON.stringify(message))
    }
}

