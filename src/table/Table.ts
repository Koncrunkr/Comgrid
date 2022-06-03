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
  public readonly cells: Cell[][] = [];
  public readonly unions: Union[] = [];
  public readonly websocket: WebSocketClient = new WebSocketClient(
    apiLink + '/websocket',
  );
  private readonly userTopic: UserTopic;
  private readonly messageTopic: MessageTopic;
  private readonly cellUnionTopic: CellUnionTopic;
  private readonly width: number;
  private readonly height: number;
  private readonly http: HttpClient = getHttpClient();

  constructor(table: TableResponse, unions: UnionResponse[], messages: MessageIn[]) {
    [this.messageTopic, this.userTopic, this.cellUnionTopic] =
      this.setWebsocketSubscriptions();

    this.width = table.width;
    this.height = table.height;

    this.fillTable(messages, unions);
  }

  public getCell(x: number, y: number): Cell {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) return this.cells[y][x];
    throw new TypeError('Out of bounds for ' + x + ', ' + y);
  }

  addMessage(message: MessageIn) {
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

  public addUnion(union: UnionIn) {
    const unionCells = slice2DArray(
      this.cells,
      union.ycoordLeftTop,
      union.ycoordRightBottom,
      union.xcoordLeftTop,
      union.xcoordRightBottom,
    );
    const newUnion = new Union(
      union.id,
      unionCells,
      this,
      union.xcoordLeftTop,
      union.xcoordRightBottom,
      union.ycoordLeftTop,
      union.ycoordRightBottom,
    );
    this.unions.push(newUnion);

    for (let y = 0; y < unionCells.length; y++) {
      for (let x = 0; x < unionCells[y].length; x++) {
        let bottom = y === unionCells.length - 1;
        let top = y === 0;
        let right = x === unionCells[y].length - 1;
        let left = x === 0;
        unionCells[y][x].makeUnion(newUnion, {
          top,
          bottom,
          left,
          right,
        });
      }
    }
  }

  growIfNeeded(x: number, y: number, clientWidth: number): boolean {
    if (clientWidth <= cellWidth) return true;
    for (let i = 0; i < this.unions.length; i++) {
      if (this.unions[i].contains(x, y)) {
        const maxWidth = cellWidth * (this.unions[i].xTo - x + 1);
        if (clientWidth <= maxWidth) return true;

        return this.grow(x, y, clientWidth, this.unions[i]);
      }
    }
    return false;
  }

  private fillTable(messages: MessageIn[], unions: UnionIn[]) {
    this.fillTableInitial();
    this.addUnions(unions);
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

  private addUnions(unions: UnionIn[]) {
    for (const union of unions) {
      this.addUnion(union);
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

  private grow(x: number, y: number, clientWidth: number, union: Union) {
    if (union.xTo === this.width - 1) return false;

    // noinspection JSSuspiciousNameCombination
    const slice = slice2DArray(
      this.cells,
      union.yFrom,
      union.yTo,
      union.xTo + 1,
      union.xTo + 1,
    ).flat();

    if (this.anyInUnion(slice)) {
      return false;
    }

    union.appendColumn(slice);
    return true;
  }

  private anyInUnion(cells: Cell[]) {
    for (let i = 0; i < cells.length; i++) {
      if (this.inUnion(cells[i])) {
        return true;
      }
    }
    return false;
  }

  private inUnion(cell: Cell) {
    for (let i = 0; i < this.unions.length; i++) {
      if (this.unions[i].contains(cell.x, cell.y)) {
        return true;
      }
    }
    return false;
  }
}
