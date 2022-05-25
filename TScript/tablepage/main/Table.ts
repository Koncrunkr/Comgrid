import { Cell } from "../cell/Cell";
import { TableMod } from "./TableMod";
import { Action, ActionType } from "../utilities/Action";
import { WebSocketClient } from "../../util/WebSocketClient";
import { formatDateTime, getParam, resolveUser } from "../../util/Util";
import { UserTopic } from "../../util/websocket/UserTopic";
import { getHttpClient, HttpClient } from "../../util/HttpClient";
import {AddParticipantRequest} from "../../util/request/AddParticipantRequest";
import {drawParticipants, settings} from "./TablePage";
import { CellUnionTopic, size, UnionOut } from "../../util/websocket/CellUnionTopic";
import { MessageIn, MessageTopic } from "../../util/websocket/MessageTopic";
import { GetLinkRequest } from "../../util/request/GetLinkRequest";
import { DeleteLinkRequest } from "../../util/request/DeleteLinkRequest";
import { SearchMessagesRequest } from "../../util/request/SearchMessagesRequest";
import { apiLink } from "../../util/Constants";

export class Table {
    private readonly userTopic: UserTopic;
    private readonly messageTopic: MessageTopic;
    private readonly cellUnionTopic: CellUnionTopic;

    private $tableContainer = $('main');
    public readonly cells: Cell[][] = [];
    public mod: TableMod;
    public readonly selectedCells: Cell[] = [];
    private actions: Action[] = [];
    public readonly width: number;
    public readonly height: number;
    private _$popover = $('#popover');
    private readonly _colorParticipants = [];

    public readonly websocket: WebSocketClient = new WebSocketClient("https://comgrid.ru:8443/websocket");
    private readonly http: HttpClient = getHttpClient();

    constructor(private _store) {
        [this.messageTopic, this.userTopic, this.cellUnionTopic] = this.setWebsocketSubscriptions();

        this.width = _store.width;
        this.height = _store.height;
        this.fillTable(_store.cellsUnions, _store.decorations, _store.messages);
        let $body = $('body');
        $body.on('mouseup', () => this.onBodyMouseup());
        $body.on('keydown', (event) => this.onBodyKeydown(event));
        $('#page-name').text(_store.name);
        $(document).prop("title", _store.name);
        $('#add-to-table-form').on('submit', () => this.addParticipant());
        $('#invitation-create-button').on('click', () => this.createInvitation());
        $('#invitation-disable-button').on('click', () => this.deleteInvitation());
        document.getElementById('search-messages-button')
          .addEventListener('click', () => this.searchMessages())
        document.getElementById('open-search-messages')
          .addEventListener('click', () => Table.changeMessagesSearchState());
        document.getElementById('close-search-button')
          .addEventListener('click', () => Table.closeSearchMessages());


        this._$popover.on('mouseup', (event) => {
            event.preventDefault();
            event.stopPropagation();
            return false;
        });
    }

    private setWebsocketSubscriptions(): [MessageTopic, UserTopic, CellUnionTopic] {
        let tableId = parseInt(getParam('id'));

        const tableReceiveTopic = new MessageTopic(tableId);
        this.websocket.subscribe(tableReceiveTopic, message => {
            if (message.senderId !== localStorage.getItem("userId"))
                this.cells[message.x][message.y].addMessage(message.text, message.senderId);
        })

        const cellUnionReceiveTopic = new CellUnionTopic(tableId);
        this.websocket.subscribe(cellUnionReceiveTopic, message => {
            this.createUnion(message);
        })

        const userTopic = new UserTopic(localStorage.getItem("userId"))
        this.websocket.subscribe(userTopic, message => console.log(message))
        return [tableReceiveTopic, userTopic, cellUnionReceiveTopic]
    }

    private addParticipant(): boolean {
        this.http.proceedRequest(
            new AddParticipantRequest({chatId: this._store.id, userId: $('#id-input').val().toString()}),
            (code, errorText) => alert(errorText)
        ).then(drawParticipants);
        return false;
    }

    private createInvitation(): void {
        this.http.proceedRequest(
            new GetLinkRequest({chatId: this._store.id}),
            (code, errorText) => alert(errorText)
        ).then(response => {
            $('#invitation-link-keeper').text(
                `https://comgrid.ru/pages/invite?code=${response.code}&chatId=${this._store.id}`
            );
        })
    }

    private deleteInvitation(): void {
        this.http.proceedRequest(
            new DeleteLinkRequest({chatId: this._store.id}),
            (code, errorText) => alert(errorText)
        ).then(() => {
            $('#invitation-link-keeper').text("");
        })
    }

    private fillTable(cellsUnions, decorations, messages): void {
        this.fillStartTable();
        this.union(cellsUnions);
        this.addMessages(messages);
        this.decorate(decorations);
    }

    private fillStartTable(): void {
        this.cells.length = this.width;
        for (let x = 0; x < this.width; x++) {
            this.cells[x] = new Array<Cell>(this.height);
            let $row = document.createElement('row');
            $row.className = 'comgrid-row';
            this.$tableContainer.append($row);
            for (let y = 0; y < this.height; y++) {
                this.cells[x][y] = new Cell(x, y, $row, this);
            }
        }
    }

    private union(cellsUnions): void {
        cellsUnions.forEach(union => this.createUnion(union));
    }

    private createUnion(cellsUnion): void {
        for (let x = cellsUnion.xcoordLeftTop; x <= cellsUnion.xcoordRightBottom; x++) {
            for (let y = cellsUnion.ycoordLeftTop; y <= cellsUnion.ycoordRightBottom; y++) {
                this.getCell(x, y).selectWithFriends(true);
            }
        }
        this.selectDown(true);
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
        messages.forEach(message => {
            this.getCell(message.x, message.y).addMessage(message.text, message.senderId);
        });
    }

    public getColor(authorId): string {
        let i = -1;
        for (i = 0; i < this._colorParticipants.length; i++) {
            if (this._colorParticipants[i][0] == authorId)
                break;
        }
        if (i !== this._colorParticipants.length)
            return this._colorParticipants[i][1];
        let colorMap = settings.colorMap;
        this._colorParticipants.push([authorId, colorMap[i % colorMap.length]]);
        return colorMap[i % colorMap.length];
    }

    private onBodyMouseup(): void {
        this.mod = TableMod.none;
        this.selectDown();
        this.hidePopover();
    }

    private selectDown(loading = false): void {
        let clone = this.selectedCells.map(elem => elem);
        if (clone.length === 0)
            return;
        let style = clone[0].getCssStyle();
        while (this.selectedCells.length > 0) {
            let cell = this.selectedCells.pop();
            cell.setFriends(clone);
            cell.selectNone();
            cell.addDecor(style);
        }
        if (!loading) {
            let union = this.getUnionByArr(clone)
            if(size(union) === 1)
                return;
            this.websocket.sendMessage(this.cellUnionTopic, union);
        }
    }

    private getUnionByArr(array: Cell[]): UnionOut {
        return {
            chatId: this._store.id,
            xcoordLeftTop: array.reduce((result, current) => current.x < result ? current.x : result, array[0].x),
            ycoordLeftTop: array.reduce((result, current) => current.y < result ? current.y : result, array[0].y),
            xcoordRightBottom: array.reduce((result, current) => current.x > result ? current.x : result, array[0].x),
            ycoordRightBottom: array.reduce((result, current) => current.y > result ? current.y : result, array[0].y)
        }
    }

    private onBodyKeydown(event): void {
        if (event.ctrlKey && event.code === 'KeyZ') {
            event.preventDefault();
            this.popAction();
        }
    }

    public getCell(x: number, y: number): Cell {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height)
            return this.cells[x][y];
        return null;
    }

    public pushAction(action: Action) {
        let lastAction = this.actions[this.actions.length - 1];
        if (
              lastAction != null &&
              lastAction[0] === ActionType.write &&
              action[0] <= ActionType.writeWithSpace &&
              lastAction[1] === action[1] &&
              lastAction[2] === action[2]
        ) {
            this.actions.pop();
        }

        this.actions.push(action);

        if(
            ((action[0] === ActionType.write ||
            action[0] === ActionType.writeWithSpace ) && this.cells[action[1]][action[2]].text !== '') ||
            action[0] === ActionType.delete
        ){
            this.websocket.sendMessage(this.messageTopic, {
                x: action[1],
                y: action[2],
                chatId: parseInt(getParam("id")),
                text: this.cells[action[1]][action[2]].text
            })
        }
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
        });

        let $button3 = this._$popover.find('#clearButton');
        $button3.off('click');
        $button3.on('click', () => {
            cell.clearWithFriends();
            this.hidePopover();
        })
    }

    public hidePopover(){
        this._$popover.addClass('d-none');
    }

    private async searchMessages() {
        const text = $('#message-text-input').val() as string;
        // @ts-ignore
        const checkbox = document.querySelector('#exact-match-input').checked;

        if(!text) {
            alert("Enter any text!");
            return
        }
        const request = new SearchMessagesRequest({
            text: text,
            chatId: parseInt(getParam('id')),
            exactMatch: checkbox,
            chunkNumber: 0,
        });
        const messages: MessageIn[] = await this.http.proceedRequest(request, (code, errorText) => {
            alert(`Error happened while creating table: ${code}, ${errorText}`)
        });
        let $container = $('.search-message-container');
        $container.html('');
        for (let message of messages) {
            const sender = await resolveUser(message.senderId);
            let $message = $('.search-item').clone();
            $message.removeClass('search-item d-none');
            const link = $message.find('a');
            // link.attr('href', '#' + message.x + "-" + message.y);
            link.on('click', () => {
                const element = document.getElementById(message.x + "-" + message.y);
                const y = element.getBoundingClientRect().top + window.scrollY;
                window.scroll({
                    top: y - window.screenY/2,
                    behavior: 'smooth'
                });
            })
            $message.find('.message-sender').text(sender.name);
            $message.find('.message-text').text(message.text);
            $message.find('.message-time').text(formatDateTime(message.created));
            let $img = $message.find('img');
            if(sender.avatar.startsWith("/")) {
                $img.attr('src', apiLink + sender.avatar);
            }else{
                $img.attr('src', sender.avatar);
            }
            $container.append($message);
            $img[0].onload = () => {
                let width = $img[0].getBoundingClientRect().width;
                $img.height(width);
                $img.width(width);
            }
            window.addEventListener('resize', () => {
                let width = $img[0].getBoundingClientRect().width;
                $img.height(width);
                $img.width(width);
            })
            $container.append($message);
            $message.on('mouseenter', () => {
                $message.removeClass('bg-light')
            });
            $message.on('mouseleave', () => {
                $message.addClass('bg-light')
            });
        }
    }

    static openSearchMessages() {
        document.getElementById('search-messages-sidenav').style.width = "250px";
        document.getElementById('main-div').style.marginLeft = "250px";
    }
    static closeSearchMessages() {
        document.getElementById('search-messages-sidenav').style.width = "0";
        document.getElementById('main-div').style.marginLeft = "0";
    }

    static changeMessagesSearchState() {
        const sidenav = document.getElementById('search-messages-sidenav');
        if(sidenav.style.width == '250px'){
            Table.closeSearchMessages()
        }else if(sidenav.style.width == '0px' || sidenav.style.width.length === 0){
            Table.openSearchMessages()
        }
    }
}