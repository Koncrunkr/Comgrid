import {Cell} from "./Cell";
import {TableMod} from "./TableMod";
import {Action, ActionType} from "./Action";

export class Table {
    private $tableContainer = $('main');
    public readonly cells: Cell[][] = [];
    public mod: TableMod;
    public readonly selectedCells: Cell[] = [];
    private actions: Action[] = [];

    constructor(
        public readonly width: number,
        public readonly height: number
    ) {
        this.fillTable();
        let $body = $('body');
        $body.on('mouseup', () => this.onBodyMouseup());
        $body.on('keydown', (event) => this.onBodyKeydown(event));
    }

    private fillTable(): void {
        this.cells.length = 0;
        for (let i = 0; i < this.height; i++) {
            this.cells.push([]);
            let $row = document.createElement('row');
            $row.className = 'comgrid-row';
            this.$tableContainer.append($row);
            for (let j = 0; j < this.width; j++) {
                this.cells[i].push(new Cell(i, j, $row, this));
            }
        }
    }

    private onBodyMouseup(): void {
        this.mod = TableMod.none;
        let clone = this.selectedCells.map(elem => elem);
        while (this.selectedCells.length > 0) {
            let cell = this.selectedCells.pop();
            cell.setFriends(clone);
            cell.selectNone();
        }
    }

    private onBodyKeydown(event): void {
        if (event.ctrlKey && event.code === 'KeyZ') {
            event.preventDefault();
            this.popAction();
        }
    }

    public getCell(x: number, y: number): Cell {
        if (x >= 0 && x < this.height && y >= 0 && y < this.width)
            return this.cells[x][y];
        return null;
    }

    public pushAction(action: Action) {
        let lastAction = this.actions[this.actions.length - 1];
        if (lastAction != null && lastAction[0] === ActionType.write && action[0] <= ActionType.writeWithSpace
            && lastAction[1] === action[1] && lastAction[2] === action[2])
            this.actions.pop();
        this.actions.push(action);
    }

    public popAction() {
        let action = this.actions.pop();
        switch (action[0]) {
            case ActionType.write:
                this.undoWrite(action[1], action[2]);
                return;
            // case ActionType.delete:
            //     this.undoDelete(action[1], action[2], action[3]);
            //     return;
            case ActionType.writeWithSpace:
                this.undoWrite(action[1], action[2]);
                return;
        }
    }

    private undoWrite(x: number, y: number) {
        this.getCell(x, y).undoWrite();
    }

    private undoDelete(x: number, y: number, text: string) {
        this.getCell(x, y).undoDelete(text);
    }
}