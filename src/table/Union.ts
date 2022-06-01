import { Cell } from './Cell';
import { Table } from './Table';

export class Union {
  constructor(private readonly cells: Cell[], private readonly table: Table) {}
  iterateOverCells(): IterableIterator<Cell> {
    return this.cells[Symbol.iterator]();
  }
}
