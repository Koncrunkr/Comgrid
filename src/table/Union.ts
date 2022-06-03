import { Cell } from './Cell';
import { Table } from './Table';
import { UnionOut } from '../util/websocket/CellUnionTopic';

export class Union {
  constructor(
    public id: number | undefined,
    private readonly cells: Cell[][],
    private readonly table: Table,
    private readonly _xFrom: number,
    private _xTo: number,
    private readonly _yFrom: number,
    private readonly _yTo: number,
  ) {}

  get xFrom(): number {
    return this._xFrom;
  }

  get xTo(): number {
    return this._xTo;
  }

  get yFrom(): number {
    return this._yFrom;
  }

  get yTo(): number {
    return this._yTo;
  }

  static bordersEqual(first: UnionOut, second: UnionOut) {
    return (
      first.xcoordLeftTop === second.xcoordLeftTop &&
      first.xcoordRightBottom === second.xcoordRightBottom &&
      first.ycoordLeftTop === second.ycoordLeftTop &&
      first.ycoordRightBottom === second.ycoordRightBottom
    );
  }

  contains(x: number, y: number): boolean {
    return this._xFrom <= x && x <= this._xTo && this._yFrom <= y && y <= this._yTo;
  }

  appendColumn(column: Cell[]) {
    if (column.length !== this.cells.length) {
      throw new TypeError(
        "Cells size don't match: " + column.length + ', ' + this.cells.length,
      );
    }
    this._xTo++;

    for (let i = 0; i < this.cells.length; i++) {
      const cells = this.cells[i];
      cells[cells.length - 1].makeUnion(this, {
        top: i !== column.length - 1 || column.length === 1,
        bottom: i !== 0 || column.length === 1,
        right: false,
        left: this._xFrom === this._xTo,
      });
      cells.push(column[i]);
      column[i].makeUnion(this, {
        top: i !== column.length - 1 || column.length === 1,
        bottom: i !== 0 || column.length === 1,
        left: this._xTo === this.table.width - 1,
        right: true,
      });
    }
  }

  toMessage(): UnionOut {
    return {
      id: this.id,
      chatId: this.table.id,
      xcoordLeftTop: this.xFrom,
      ycoordLeftTop: this.yFrom,
      xcoordRightBottom: this.xTo,
      ycoordRightBottom: this.yTo,
    };
  }
}
