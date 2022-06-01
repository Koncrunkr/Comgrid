import { UserTopic } from '../util/websocket/UserTopic';
import { MessageIn, MessageTopic } from '../util/websocket/MessageTopic';
import { CellUnionTopic } from '../util/websocket/CellUnionTopic';
import { WebSocketClient } from '../util/WebSocketClient';
import { getHttpClient, HttpClient } from '../util/HttpClient';
import { TableResponse } from '../util/request/CreateTableRequest';
import { UnionResponse } from '../util/request/CellUnionsRequest';
import { getParam, getSavedUser, resolveUser, slice2DArray } from '../util/Util';
import { Cell } from './Cell';
import { apiLink } from '../util/Constants';
import { Union } from './Union';

export class Table {
  private readonly userTopic: UserTopic;
  private readonly messageTopic: MessageTopic;
  private readonly cellUnionTopic: CellUnionTopic;

  private readonly width: number;
  private readonly height: number;
  public readonly cells: Cell[][] = [];
  public readonly unions: Union[] = [];

  public readonly websocket: WebSocketClient = new WebSocketClient(
    apiLink + '/websocket',
  );
  private readonly http: HttpClient = getHttpClient();

  constructor(table: TableResponse, unions: UnionResponse[], messages: MessageIn[]) {
    [this.messageTopic, this.userTopic, this.cellUnionTopic] =
      this.setWebsocketSubscriptions();

    this.width = table.width;
    this.height = table.height;

    this.fillTable(messages, unions);
  }
  private setWebsocketSubscriptions(): [MessageTopic, UserTopic, CellUnionTopic] {
    let tableId = parseInt(getParam('id')!);

    const tableReceiveTopic = new MessageTopic(tableId);
    // this.websocket.subscribe(tableReceiveTopic, message => {
    //   if (message.senderId !== localStorage.getItem('userId'))
    //     this.cells[message.x][message.y].addMessage(message.text, message.senderId);
    // });

    const cellUnionReceiveTopic = new CellUnionTopic(tableId);
    // this.websocket.subscribe(cellUnionReceiveTopic, message => {
    //   this.createUnion(message);
    // });

    const userTopic = new UserTopic(localStorage.getItem('userId')!);
    this.websocket.subscribe(userTopic, message => console.log(message));
    return [tableReceiveTopic, userTopic, cellUnionReceiveTopic];
  }

  private fillTable(messages: MessageIn[], unions: UnionResponse[]) {
    this.fillTableInitial();
    this.createUnions(unions);
    this.addMessages(messages);
  }

  private fillTableInitial() {
    this.cells.length = this.height;
    for (let y = 0; y < this.height; y++) {
      this.cells[y] = new Array<Cell>(this.width);
      for (let x = 0; x < this.width; x++) {
        this.cells[y][x] = new Cell(x, y);
      }
    }
  }

  private createUnions(unions: UnionResponse[]) {
    for (const union of unions) {
      this.createUnion(union);
    }
  }

  private addMessage(message: MessageIn) {
    try {
      this.getCell(message.x, message.y).setMessage(
        message.text,
        getSavedUser(message.senderId),
      );
    } catch (e) {
      (async () => {
        this.getCell(message.x, message.y).setMessage(
          message.text,
          await resolveUser(message.senderId),
        );
      })();
    }
  }

  private addMessages(messages: MessageIn[]) {
    try {
      for (let message of messages) {
        this.getCell(message.x, message.y).setMessage(
          message.text,
          getSavedUser(message.senderId),
        );
      }
    } catch (e) {
      (async () => {
        for (let message of messages) {
          this.getCell(message.x, message.y).setMessage(
            message.text,
            await resolveUser(message.senderId),
          );
        }
      })();
    }
  }

  public getCell(x: number, y: number): Cell {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) return this.cells[y][x];
    throw new TypeError('Out of bounds for ' + x + ', ' + y);
  }

  private createUnion(union: UnionResponse) {
    const newUnion = new Union(
      slice2DArray(
        this.cells,
        union.xcoordLeftTop,
        union.xcoordRightBottom,
        union.ycoordLeftTop,
        union.ycoordRightBottom,
      ).flat(),
      this,
    );
    this.unions.push(newUnion);

    for (let cell of newUnion.iterateOverCells()) {
      cell.makeUnion(newUnion);
    }
  }
}
