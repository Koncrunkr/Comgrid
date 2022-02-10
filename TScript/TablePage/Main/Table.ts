import {Cell} from "../Cell/Cell";
import {TableMod} from "./TableMod";
import {Action, ActionType} from "../Utilities/Action";

export class Table {
    private $tableContainer = $('main');
    public readonly cells: Cell[][] = [];
    public mod: TableMod;
    public readonly selectedCells: Cell[] = [];
    private actions: Action[] = [];
    public readonly width: number;
    public readonly height: number;
    private _$popover = $('#popover');

    constructor(private _store) {
        this.width = _store.width;
        this.height = _store.height;
        this.fillTable(_store.cellsUnions, _store.decorations, _store.messages);
        let $body = $('body');
        $body.on('mouseup', () => this.onBodyMouseup());
        $body.on('keydown', (event) => this.onBodyKeydown(event));
        this._$popover.on('mouseup', (event) => {
            event.preventDefault();
            event.stopPropagation();
            return false;
        });
    }

    private fillTable(cellsUnions, decorations, messages): void {
        this.fillStartTable();
        this.union(cellsUnions);
        this.decorate(decorations);
        this.addMessages(messages);
    }

    private fillStartTable(): void {
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

    private union(cellsUnions): void {
        cellsUnions.forEach(union => this.createUnion(union));
    }

    private createUnion(cellsUnion): void {
        for (let i = cellsUnion.leftUpX; i <= cellsUnion.rightDownX; i++)
            for (let j = cellsUnion.leftUpY; j <= cellsUnion.rightDownY; j++)
                this.getCell(i, j).selectWithFriends(true);
        this.selectDown();
    }

    private decorate(decorations): void {
        decorations.forEach(decoration => this.decorateOne(decoration));
    }

    private decorateOne(decoration): void {
        for (let i = decoration.leftUpX; i <= decoration.rightDownX; i++)
            for (let j = decoration.leftUpY; j <= decoration.rightDownY; j++)
                this.getCell(i, j).addDecor(decoration.cssText);
    }

    private addMessages(messages): void {
        messages.forEach(message => this.getCell(message.x, message.y).addMessage(message.text));
    }

    private onBodyMouseup(): void {
        this.mod = TableMod.none;
        this.selectDown();
        this.hidePopover();
    }

    private selectDown(): void {
        let clone = this.selectedCells.map(elem => elem);
        let style = clone[0].getCssStyle();
        while (this.selectedCells.length > 0) {
            let cell = this.selectedCells.pop();
            cell.setFriends(clone);
            cell.selectNone();
            cell.addDecor(style);
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

    public showPopover(x: number, y: number, cell: Cell){
        this._$popover.removeClass('d-none');
        this._$popover.attr('style', `left: ${cell.screenX + 16}px; top: ${cell.screenY + 16}px;`);
        this._$popover.find('#coords').text(`${x}, ${y}`);

        let $input = this._$popover.find('#cssStyleInput');
        $input.val(cell.getCssStyle());
        $input.off('change');
        $input.on('change', () => cell.addDecorWithFriends($input.val()));

        let $button1 = this._$popover.find('#editTextButton');
        $button1.off('click');
        $button1.on('click', () => {
            cell.focus();
            this.hidePopover();
        });

        let $button2 = this._$popover.find('#divideButton');
        $button2.off('click');
        $button2.on('click', () => {
            cell.separateWithFriends();
            cell.focus();
            this.hidePopover();
        })
    }

    public hidePopover(){
        this._$popover.addClass('d-none');
    }
}