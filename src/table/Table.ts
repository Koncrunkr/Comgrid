import { MessageIn } from '../util/websocket/MessageTopic';
import { TableResponse } from '../util/request/CreateTableRequest';
import { getSavedUser, resolveUser, slice2DArray } from '../util/Util';
import { Cell } from './Cell';
import { cellWidth } from '../util/Constants';
import { Union } from './Union';
import { WebSocketAwaiter } from './WebSocketAwaiter';
import { UnionIn, UnionOut } from '../util/websocket/CellUnionTopic';
import { getState, User } from '../util/State';
import { getHttpClient } from '../util/HttpClient';
import { HttpError } from '../error/HttpError';
import { TableInfoRequest } from '../util/request/TableInfoRequest';
import { CellUnionsRequest } from '../util/request/CellUnionsRequest';
import { TableMessagesRequest } from '../util/request/TableMessagesRequest';

export class Table {
  public readonly cells: Cell[][] = [];
  public readonly unions: Union[] = [];

  public readonly width: number;
  public readonly height: number;
  public readonly id: number;

  private readonly awaiter;

  readonly currentUser: User;

  constructor(table: TableResponse, unions: UnionIn[], messages: MessageIn[]) {
    this.id = table.id;
    this.width = table.width;
    this.height = table.height;

    this.awaiter = new WebSocketAwaiter(this);

    this.currentUser = getSavedUser(localStorage.getItem('userId')!);

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

  public addUnion(union: UnionIn | UnionOut): Union {
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
        let bottom = y === unionCells.length - 1 || unionCells.length === 1;
        let top = y === 0 || unionCells.length === 1;
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
    return newUnion;
  }

  updateMessage(x: number, y: number, clientWidth: number, text: string): boolean {
    const existingText = this.getCell(x, y).text();
    if (!text || text === '') {
      if (!existingText || existingText === '') {
        return false;
      }
    }
    if (!this.growIfNeeded(x, y, clientWidth)) return false;

    this.getCell(x, y).setMessage(text, this.currentUser);

    this.awaiter.sendMessageToServer({
      chatId: this.id,
      x: x,
      y: y,
      text: text,
    });

    return true;
  }

  growIfNeeded(x: number, y: number, clientWidth: number): boolean {
    if (clientWidth <= cellWidth) return true;
    if (x === this.width - 1) return false;
    for (let i = 0; i < this.unions.length; i++) {
      if (this.unions[i].contains(x, y)) {
        const maxWidth = cellWidth * (this.unions[i].xTo - x + 1);
        if (clientWidth <= maxWidth) return true;

        return this.grow(this.unions[i]);
      }
    }

    // union is not found, then create one, if there is space
    const nextCell = this.getCell(x + 1, y);
    if (this.inUnion(nextCell)) {
      // there is union right next to our cell, don't do anything
      return false;
    }

    if (nextCell.text()) {
      // if there is other message, don't do anything
      return false;
    }
    // there is no union right to our cell
    const newUnion = this.addUnion({
      id: undefined,
      chatId: this.id,
      creatorId: this.currentUser.id,
      xcoordLeftTop: x,
      xcoordRightBottom: x + 1,
      ycoordLeftTop: y,
      ycoordRightBottom: y,
    });
    this.awaiter.sendUnionToServer(newUnion);

    return true;
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

  private grow(union: Union) {
    if (union.xTo === this.width - 1) return false;

    // noinspection JSSuspiciousNameCombination
    const nextColumn = slice2DArray(
      this.cells,
      union.yFrom,
      union.yTo,
      union.xTo + 1,
      union.xTo + 1,
    ).flat();

    if (Table.anyHasMessage(nextColumn)) {
      return false;
    }

    if (this.anyInUnion(nextColumn)) {
      return false;
    }

    union.appendColumn(nextColumn);
    this.awaiter.sendUnionToServer(union);
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

  getContiguousCellToRight(x: number, y: number) {
    const cell = this.getCell(x, y);
    const union = this.getUnion(cell);
    if (union) {
      const contiguousX = union.xTo + 1;
      if (contiguousX === this.width) {
        return null;
      }
      return this.getCell(contiguousX, y);
    }
    if (x + 1 === this.width) return null;

    return this.getCell(x + 1, y);
  }

  getContiguousCellToLeft(x: number, y: number) {
    const cell = this.getCell(x, y);
    const union = this.getUnion(cell);
    if (x === 0) return null;
    if (union) {
      const contiguousX = union.xFrom - 1;
      if (contiguousX === -1) {
        return null;
      }
      return this.getCell(contiguousX, y);
    }

    return this.getCell(x - 1, y);
  }

  setIdForUnion(union: UnionIn) {
    for (let i = 0; i < this.unions.length; i++) {
      if (
        Union.bordersEqual(
          {
            chatId: this.id,
            xcoordLeftTop: this.unions[i].xFrom,
            xcoordRightBottom: this.unions[i].xTo,
            ycoordLeftTop: this.unions[i].yFrom,
            ycoordRightBottom: this.unions[i].yTo,
          },
          union,
        )
      ) {
        this.unions[i].id = union.id;
        return;
      }
    }
    console.log(
      'Something went wrong for setting id for union: ' + JSON.stringify(union),
    );
  }

  private static anyHasMessage(cells: Cell[]) {
    for (let i = 0; i < cells.length; i++) {
      const text = cells[i].text();
      if (text !== undefined && text.length !== 0) {
        return true;
      }
    }
    return false;
  }

  static async load(id: number): Promise<Table> {
    let http = getHttpClient();
    const state = await getState().whenReady();
    if (!state.authorized) {
      throw new HttpError({ status: 403, errorText: 'Unauthorized' });
    }

    const table = await http.proceedRequest(
      new TableInfoRequest({
        chatId: id,
      }),
    );
    const unions = await http.proceedRequest(
      new CellUnionsRequest({
        chatId: id,
        xcoordLeftTop: 0,
        ycoordLeftTop: 0,
        xcoordRightBottom: table.width - 1,
        ycoordRightBottom: table.height - 1,
      }),
    );
    const messages = await http.proceedRequest(
      new TableMessagesRequest({
        chatId: id,
        xcoordLeftTop: 0,
        ycoordLeftTop: 0,
        xcoordRightBottom: table.width - 1,
        ycoordRightBottom: table.height - 1,
      }),
    );
    for (let i = messages.length - 1; i >= 0; i--) {
      await resolveUser(messages[i].senderId);
    }
    for (let i = unions.length - 1; i >= 0; i--) {
      await resolveUser(unions[i].creatorId);
    }

    return new Table(table, unions, messages);
  }

  private getUnion(cell: Cell) {
    for (let i = 0; i < this.unions.length; i++) {
      if (this.unions[i].contains(cell.x, cell.y)) {
        return this.unions[i];
      }
    }
    return null;
  }

  private inUnion(cell: Cell) {
    return this.getUnion(cell) != null;
  }
}
