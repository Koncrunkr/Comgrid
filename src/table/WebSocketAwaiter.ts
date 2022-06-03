import { Union } from './Union';
import { MessageIn, MessageOut, MessageTopic } from '../util/websocket/MessageTopic';
import { CellUnionTopic, UnionIn, UnionOut } from '../util/websocket/CellUnionTopic';
import { UserTopic } from '../util/websocket/UserTopic';
import { WebSocketClient } from '../util/WebSocketClient';
import { apiLink } from '../util/Constants';
import { Table } from './Table';
import { CookieValue } from '../util/CookieValue';
import { messagesIdEqual } from '../util/Util';

export class WebSocketAwaiter {
  public readonly websocket: WebSocketClient = new WebSocketClient(
    apiLink + '/websocket',
  );
  private readonly userTopic: UserTopic;
  private readonly messageTopic: MessageTopic;
  private readonly cellUnionTopic: CellUnionTopic;

  private readonly outcomingUnions: CookieValue<(UnionOut & { retries?: number })[]>;
  private readonly outcomingMessages: CookieValue<(MessageOut & { retries?: number })[]>;

  constructor(private readonly table: Table) {
    [this.messageTopic, this.userTopic, this.cellUnionTopic] =
      this.setWebsocketSubscriptions();

    this.outcomingUnions = new CookieValue<(UnionOut & { retries?: number })[]>(
      `outcoming_unions_${table.id}`,
      [],
      7,
    );
    this.outcomingMessages = new CookieValue<(MessageOut & { retries?: number })[]>(
      `outcoming_messages_${table.id}`,
      [],
      7,
    );
  }

  sendUnionToServer(union: Union) {
    const unionMessage = union.toMessage();
    this.outcomingUnions.update(list => {
      list.push(unionMessage);
      return list;
    });
    this.handleOutcomingUnion(union);
    this.websocket.sendMessage(this.cellUnionTopic, unionMessage);
  }

  sendMessageToServer(message: MessageOut) {
    this.outcomingMessages.update(list => {
      list.push(message);
      return list;
    });
    this.handleOutcomingMessage(message);
    this.websocket.sendMessage(this.messageTopic, message);
  }

  private setWebsocketSubscriptions(): [MessageTopic, UserTopic, CellUnionTopic] {
    let tableId = this.table.id;

    const messageReceiveTopic = new MessageTopic(tableId);
    this.websocket.subscribe(messageReceiveTopic, this.handleIncomingMessage);

    const cellUnionReceiveTopic = new CellUnionTopic(tableId);
    this.websocket.subscribe(cellUnionReceiveTopic, this.handleIncomingCellUnions);

    const userTopic = new UserTopic(localStorage.getItem('userId')!);
    this.websocket.subscribe(userTopic, message => console.log(message));
    return [messageReceiveTopic, userTopic, cellUnionReceiveTopic];
  }

  private handleOutcomingUnion(union: Union) {
    setTimeout(() => {
      this.outcomingUnions.update(unionOuts => {
        for (let i = 0; i < unionOuts.length; i++) {
          if (unionOuts[i].id === union.id) {
            const retries = unionOuts[i].retries ?? 1;
            if (retries > 10) {
              // TODO: message is not sent, mark it as unsent and suggest to resend
              return unionOuts;
            }
            // TODO: message is not sent YET, mark it as pending
            console.log(
              'Union ' + union.id + ' is still delivering, for: ' + retries + ' seconds',
            );
            unionOuts[i].retries = retries + 1;
            this.handleOutcomingUnion(union);
            return unionOuts;
          }
        }
        return unionOuts;
      });
    }, 1000);
  }

  private handleIncomingCellUnions(union: UnionIn) {
    let isNew = true;
    this.outcomingUnions.update(outUnions => {
      for (let i = 0; i < outUnions.length; i++) {
        if (outUnions[i].id === union.id) {
          if (!Union.bordersEqual(union, outUnions[i])) {
            // incoming union is different from ours, skip
            // TODO: maybe handle it?
            return outUnions;
          }
          outUnions.splice(i);
          isNew = false;
          return outUnions;
        }
      }
      return outUnions;
    });

    if (isNew) {
      this.table.addUnion(union);
    }
  }

  private handleOutcomingMessage(message: MessageOut) {
    setTimeout(() => {
      this.outcomingMessages.update(outMessages => {
        for (let i = 0; i < outMessages.length; i++) {
          if (messagesIdEqual(message, outMessages[i])) {
            const retries = outMessages[i].retries ?? 1;
            if (retries > 10) {
              // TODO: message is not sent, mark it as unsent and suggest to resend
              return outMessages;
            }
            // TODO: message is not sent YET, mark it as pending
            console.log(
              `Message (${message.x}, ${message.y}, ${message.chatId}) is still delivering, for: ${retries} seconds`,
            );
            outMessages[i].retries = retries + 1;
            this.handleOutcomingMessage(message);
            return outMessages;
          }
        }
        return outMessages;
      });
    });
  }

  private handleIncomingMessage(message: MessageIn) {
    let isNew = true;
    this.outcomingMessages.update(outMessages => {
      for (let i = 0; i < outMessages.length; i++) {
        if (messagesIdEqual(outMessages[i], message)) {
          if (message.text !== outMessages[i].text) {
            // incoming message is different from ours, skip
            // TODO: maybe handle it?
            return outMessages;
          }
          outMessages.splice(i);
          isNew = false;
          return outMessages;
        }
      }
      return outMessages;
    });

    if (isNew) {
      this.table.addMessage(message);
    }
  }
}
