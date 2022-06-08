import { CompatClient, Stomp } from '@stomp/stompjs';
import { Topic } from './websocket/Topic';
import { getState } from './State';

export class WebSocketClient {
  // @ts-ignore
  private socket: WebSocket;
  private readonly stompClient: CompatClient;
  private connected: boolean = false;
  private subscribers = new Array<() => unknown>();

  constructor(apiLink: string) {
    this.stompClient = Stomp.over(() => {
      return (this.socket = new WebSocket(apiLink));
    });
    this.stompClient.debug = () => {};
    getState()
      .whenReady()
      .then(state => {
        this.stompClient.connect(state.getAuthorizationHeader(), () => {
          for (let subscriber of this.subscribers) {
            subscriber();
          }
        });
      });
  }

  subscribe<MessageIn, MessageOut>(
    topic: Topic<MessageIn, MessageOut>,
    onMessage: (message: MessageIn) => unknown,
  ) {
    if (this.stompClient.connected) {
      this.stompClient.subscribe(
        topic.receiveDestination(),
        message => {
          const str = new TextDecoder().decode(message.binaryBody);
          onMessage(topic.proceedMessage(str));
        },
        getState().getAuthorizationHeader(),
      );
    } else {
      this.subscribers.push(() => {
        this.stompClient.subscribe(
          topic.receiveDestination(),
          message => {
            const str = new TextDecoder().decode(message.binaryBody);
            onMessage(topic.proceedMessage(str));
          },
          getState().getAuthorizationHeader(),
        );
      });
    }
  }

  sendMessage<MessageIn, MessageOut>(
    topic: Topic<MessageIn, MessageOut>,
    message: MessageOut,
  ) {
    this.stompClient.send(
      topic.sendDestination(message),
      getState().getAuthorizationHeader(),
      JSON.stringify(message),
    );
  }

  private disconnect() {
    this.connected = false;
  }
}
