import {Cell} from "./Cell";
import {store} from "./TablePage";
import {Direction} from "./Direction";
import {event} from "jquery";

export class CellDrawer {
    private $cell: HTMLElement;
    private $span: HTMLElement;

    constructor(
        $row: HTMLElement,
        private keeper: Cell
    ) {
        this.init($row);
    }

    private init($row): void {
        this.$span = this.$createSpan();
        this.$cell = this.$createCell(this.$span);
        $row.append(this.$cell);
    }

    private $createSpan(): HTMLElement {
        let $span = document.createElement('span');
        $span.className = 'text-nowrap no-show-focus';
        $span.onkeydown = (event) => this.keeper.onKeydown(event);
        $span.onblur = () => this.keeper.onBlur($span.textContent);
        $span.oninput = (event) => this.keeper.onInput(event);
        $span.contentEditable = 'true';
        return $span;
    }

    private $createCell($span: HTMLElement): HTMLElement {
        let $cell = document.createElement('div');
        $cell.className = 'comgrid-cell border-top border-left border-right border-bottom text-dark';
        $cell.onmouseenter = () => this.keeper.onMouseenter();
        $cell.onmousedown = () => this.keeper.onMousedown();
        $cell.ondragstart = () => false;
        $cell.append($span);
        return $cell;
    }

    public focus(): void {
        this.$span.focus();
    }

    public select(): void {
        this.$cell.classList.remove(...store.noSelectedClasses);
        this.$cell.classList.add(...store.selectedClasses);
    }

    public selectNone(): void {
        this.$cell.classList.remove(...store.selectedClasses);
        this.$cell.classList.add(...store.noSelectedClasses);
    }

    public isEmpty(): boolean {
        return this.$span.textContent.length === 0;
    }

    public removeBorders(...directions: Direction[]): void {
        directions.forEach((direction) => this.removeBorder(direction));
    }

    public removeBorder(direction: Direction): void {
        switch (direction) {
            case Direction.bottom:
                this.$cell.classList.remove('border-bottom');
                return;
            case Direction.left:
                this.$cell.classList.remove('border-left');
                return;
            case Direction.right:
                this.$cell.classList.remove('border-right');
                return;
            case Direction.top:
                this.$cell.classList.remove('border-top');
                return;
        }
    }

    public addBorders(...directions: Direction[]): void {
        directions.forEach((direction) => this.addBorder(direction));
    }

    public addBorder(direction: Direction): void {
        switch (direction) {
            case Direction.bottom:
                this.$cell.classList.add('border-bottom');
                return;
            case Direction.left:
                this.$cell.classList.add('border-left');
                return;
            case Direction.right:
                this.$cell.classList.add('border-right');
                return;
            case Direction.top:
                this.$cell.classList.add('border-top');
                return;
        }
    }

    public block(): void {
        this.$span.contentEditable = 'false';
        this.$span.classList.add('user-select-none');
        this.$cell.ondblclick = () => this.keeper.onDoubleClick();
    }

    public blockNo(): void {
        this.$span.contentEditable = 'true';
        this.$span.classList.remove('user-select-none');
        this.$cell.ondblclick = null;
    }

    public undoWrite(): void {
        let lastSpaceIndex = this.$span.textContent.lastIndexOf(' ');
        if(lastSpaceIndex < 0) this.$span.textContent = '';
        else this.$span.textContent = this.$span.textContent.substr(0, lastSpaceIndex);
    }

    public undoDelete(text): void {
        this.$span.textContent += text;
    }
}