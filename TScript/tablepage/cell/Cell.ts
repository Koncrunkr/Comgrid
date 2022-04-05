import {CellDrawer} from "./CellDrawer";
import {Table} from "../main/Table";
import {TableMod} from "../main/TableMod";
import {Direction} from "../utilities/Direction";
import {ActionType} from "../utilities/Action";
import {css} from "jquery";

type onTrigger = (event?: any) => void | boolean

export class Cell {
    private drawer: CellDrawer;
    private _friends: Cell[];
    private _blocked: boolean;
    private _selected: boolean;

    constructor(
        public readonly x: number,
        public readonly y: number,
        $row: HTMLElement,
        public readonly table: Table
    ) {
        this.drawer = new CellDrawer($row, this);
    }

    public get onKeydown(): onTrigger {
        return (event => {
            if (event.ctrlKey) return;
            if (event.shiftKey) return;
            if (event.code === 'ArrowUp') this.table.getCell(this.x - 1, this.y).focus();
            if (event.code === 'ArrowDown' || event.code === 'Enter') this.table.getCell(this.x + 1, this.y).focus();
            if (!this.isEmpty()) return;
            if (event.code === 'ArrowLeft') this.table.getCell(this.x, this.y - 1).focus();
            if (event.code === 'ArrowRight') this.table.getCell(this.x, this.y + 1).focus();
        })
    }

    public get onMouseenter(): onTrigger {
        return () => {
            if (this.table.mod !== TableMod.selecting) return;
            this.selectWithFriends();
        }
    }

    public get onMousedown(): onTrigger {
        return () => {
            this.table.mod = TableMod.selecting;
            this.selectWithFriends();
        }
    }

    public get onDoubleClick(): onTrigger {
        return () => {
            this.focus();
        }
    }

    public get onBlur(): onTrigger {
        return (text: string) => {
            if(text.length !== 0) {
                this.block();
            }
        }
    }

    public get onInput(): onTrigger {
        return (event: any) => {
            console.log(event.inputType);
            if(event.inputType[0] === 'i') {
                if (event.data === ' ') {
                    this.table.pushAction([ActionType.writeWithSpace, this.x, this.y]);
                }else {
                    this.table.pushAction([ActionType.write, this.x, this.y]);
                }
            }else if(event.inputType[0] === 'd') {
                this.table.pushAction([ActionType.delete, this.x, this.y]);
            }
        }
    }

    public get onContextmenu(): onTrigger {
        return () => {
            this.table.showPopover(this.x, this.y, this);
            return false;
        }
    }

    public focus(): void {
        this.drawer.blockNo();
        this.drawer.focus();
    }

    public selectWithFriends(yes: boolean = true): void {
        if (this._friends == null || this._friends.length === 0)
            yes ? this.select() : this.selectNone();
        else
            this._friends.forEach((friend) => yes ? friend.select() : friend.selectNone());
    }

    public setFriends(friends: Cell[]): void {
        this._friends = friends;
        this.drawer.addBorders(Direction.top, Direction.bottom, Direction.left, Direction.right)
        if (friends.find((cell) => (cell.x === this.x && cell.y === this.y + 1)) != null)
            this.drawer.removeBorder(Direction.right);
        if (friends.find((cell) => (cell.x === this.x && cell.y === this.y - 1)) != null)
            this.drawer.removeBorder(Direction.left);
        if (friends.find((cell) => (cell.x === this.x - 1 && cell.y === this.y)) != null)
            this.drawer.removeBorder(Direction.top);
        if (friends.find((cell) => (cell.x === this.x + 1 && cell.y === this.y)) != null)
            this.drawer.removeBorder(Direction.bottom);
    }

    public select(): void {
        if(this._selected) return;
        this._selected = true;
        this.table.selectedCells.push(this);
        this.drawer.select();
    }

    public selectNone(): void {
        if(!this._selected) return;
        this._selected = false;
        this.drawer.selectNone();
    }

    public isEmpty(): boolean {
        return this.drawer.isEmpty();
    }

    private block(): void {
        this.drawer.block();
    }

    private blockNo(): void {
        this.drawer.blockNo();
    }

    public undoWrite(): void {
        this.drawer.undoWrite();
    }

    public undoDelete(text: string): void {
        this.drawer.undoDelete(text);
    }

    public addDecor(cssString): void {
        this.drawer.addDecor(cssString);
    }

    public addDecorWithFriends(cssString): void {
        if (this._friends == null || this._friends.length === 0)
            this.addDecor(cssString);
        else
            this._friends.forEach((friend) => friend.addDecor(cssString));
    }

    public addMessage(text): void {
        this.drawer.addMessage(text);
    }

    public getCssStyle(): string {
        return this.drawer.getCssStyle();
    }

    public get screenX(): number {
        return this.drawer.screenX;
    }

    public get screenY(): number {
        return this.drawer.screenY;
    }

    private separate(): void {
        this.setFriends([this]);
    }

    public separateWithoutFriends(): void {
        if (this._friends != null){
            let index = this._friends.indexOf(this);
            this._friends.splice(index, index);
        }
        this.separate();
    }

    public separateWithFriends(): void {
        if (this._friends == null) return;
        let clone = this._friends;
        clone.forEach((elem) => elem.separate());
    }

    public get text(): string{
        return this.drawer.text;
    }
    public set text(text: string){
        this.drawer.text = text;
    }
}