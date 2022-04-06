(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cell = void 0;
var CellDrawer_1 = require("./CellDrawer");
var TableMod_1 = require("../main/TableMod");
var Direction_1 = require("../utilities/Direction");
var Action_1 = require("../utilities/Action");
var Cell = /** @class */ (function () {
    function Cell(x, y, $row, table) {
        this.x = x;
        this.y = y;
        this.table = table;
        this.drawer = new CellDrawer_1.CellDrawer($row, this);
    }
    Object.defineProperty(Cell.prototype, "onKeydown", {
        get: function () {
            var _this = this;
            return (function (event) {
                if (event.ctrlKey)
                    return;
                if (event.shiftKey)
                    return;
                if (event.code === 'ArrowUp')
                    _this.table.getCell(_this.x - 1, _this.y).focus();
                if (event.code === 'ArrowDown' || event.code === 'Enter')
                    _this.table.getCell(_this.x + 1, _this.y).focus();
                if (!_this.isEmpty())
                    return;
                if (event.code === 'ArrowLeft')
                    _this.table.getCell(_this.x, _this.y - 1).focus();
                if (event.code === 'ArrowRight')
                    _this.table.getCell(_this.x, _this.y + 1).focus();
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Cell.prototype, "onMouseenter", {
        get: function () {
            var _this = this;
            return function () {
                if (_this.table.mod !== TableMod_1.TableMod.selecting)
                    return;
                _this.selectWithFriends();
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Cell.prototype, "onMousedown", {
        get: function () {
            var _this = this;
            return function () {
                _this.table.mod = TableMod_1.TableMod.selecting;
                _this.selectWithFriends();
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Cell.prototype, "onDoubleClick", {
        get: function () {
            var _this = this;
            return function () {
                _this.focus();
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Cell.prototype, "onBlur", {
        get: function () {
            var _this = this;
            return function (text) {
                if (text.length !== 0) {
                    _this.block();
                }
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Cell.prototype, "onInput", {
        get: function () {
            var _this = this;
            return function (event) {
                console.log(event.inputType);
                if (event.inputType[0] === 'i') {
                    if (event.data === ' ') {
                        _this.table.pushAction([Action_1.ActionType.writeWithSpace, _this.x, _this.y]);
                    }
                    else {
                        _this.table.pushAction([Action_1.ActionType.write, _this.x, _this.y]);
                    }
                }
                else if (event.inputType[0] === 'd') {
                    _this.table.pushAction([Action_1.ActionType.delete, _this.x, _this.y]);
                }
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Cell.prototype, "onContextmenu", {
        get: function () {
            var _this = this;
            return function () {
                _this.table.showPopover(_this.x, _this.y, _this);
                return false;
            };
        },
        enumerable: false,
        configurable: true
    });
    Cell.prototype.focus = function () {
        this.drawer.blockNo();
        this.drawer.focus();
    };
    Cell.prototype.selectWithFriends = function (yes) {
        if (yes === void 0) { yes = true; }
        if (this._friends == null || this._friends.length === 0)
            yes ? this.select() : this.selectNone();
        else
            this._friends.forEach(function (friend) { return yes ? friend.select() : friend.selectNone(); });
    };
    Cell.prototype.setFriends = function (friends) {
        var _this = this;
        this._friends = friends;
        this.drawer.addBorders(Direction_1.Direction.top, Direction_1.Direction.bottom, Direction_1.Direction.left, Direction_1.Direction.right);
        if (friends.find(function (cell) { return (cell.x === _this.x && cell.y === _this.y + 1); }) != null)
            this.drawer.removeBorder(Direction_1.Direction.right);
        if (friends.find(function (cell) { return (cell.x === _this.x && cell.y === _this.y - 1); }) != null)
            this.drawer.removeBorder(Direction_1.Direction.left);
        if (friends.find(function (cell) { return (cell.x === _this.x - 1 && cell.y === _this.y); }) != null)
            this.drawer.removeBorder(Direction_1.Direction.top);
        if (friends.find(function (cell) { return (cell.x === _this.x + 1 && cell.y === _this.y); }) != null)
            this.drawer.removeBorder(Direction_1.Direction.bottom);
    };
    Cell.prototype.select = function () {
        if (this._selected)
            return;
        this._selected = true;
        this.table.selectedCells.push(this);
        this.drawer.select();
    };
    Cell.prototype.selectNone = function () {
        if (!this._selected)
            return;
        this._selected = false;
        this.drawer.selectNone();
    };
    Cell.prototype.isEmpty = function () {
        return this.drawer.isEmpty();
    };
    Cell.prototype.block = function () {
        this.drawer.block();
    };
    Cell.prototype.blockNo = function () {
        this.drawer.blockNo();
    };
    Cell.prototype.undoWrite = function () {
        this.drawer.undoWrite();
    };
    Cell.prototype.undoDelete = function (text) {
        this.drawer.undoDelete(text);
    };
    Cell.prototype.addDecor = function (cssString) {
        this.drawer.addDecor(cssString);
    };
    Cell.prototype.addDecorWithFriends = function (cssString) {
        if (this._friends == null || this._friends.length === 0)
            this.addDecor(cssString);
        else
            this._friends.forEach(function (friend) { return friend.addDecor(cssString); });
    };
    Cell.prototype.addMessage = function (text) {
        this.drawer.addMessage(text);
    };
    Cell.prototype.getCssStyle = function () {
        return this.drawer.getCssStyle();
    };
    Object.defineProperty(Cell.prototype, "screenX", {
        get: function () {
            return this.drawer.screenX;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Cell.prototype, "screenY", {
        get: function () {
            return this.drawer.screenY;
        },
        enumerable: false,
        configurable: true
    });
    Cell.prototype.separate = function () {
        this.setFriends([this]);
    };
    Cell.prototype.separateWithoutFriends = function () {
        if (this._friends != null) {
            var index = this._friends.indexOf(this);
            this._friends.splice(index, index);
        }
        this.separate();
    };
    Cell.prototype.separateWithFriends = function () {
        if (this._friends == null)
            return;
        var clone = this._friends;
        clone.forEach(function (elem) { return elem.separate(); });
    };
    Object.defineProperty(Cell.prototype, "text", {
        get: function () {
            return this.drawer.text;
        },
        set: function (text) {
            this.drawer.text = text;
        },
        enumerable: false,
        configurable: true
    });
    return Cell;
}());
exports.Cell = Cell;
},{"../main/TableMod":4,"../utilities/Action":6,"../utilities/Direction":7,"./CellDrawer":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CellDrawer = void 0;
var TablePage_1 = require("../main/TablePage");
var Direction_1 = require("../utilities/Direction");
var CellDrawer = /** @class */ (function () {
    function CellDrawer($row, keeper) {
        this.keeper = keeper;
        this.init($row);
    }
    CellDrawer.prototype.init = function ($row) {
        this.$span = this.$createSpan();
        this.$cell = this.$createCell(this.$span);
        $row.append(this.$cell);
    };
    CellDrawer.prototype.$createSpan = function () {
        var _this = this;
        var $span = document.createElement('span');
        $span.className = 'text-nowrap no-show-focus';
        $span.onkeydown = function (event) { return _this.keeper.onKeydown(event); };
        $span.onblur = function () { return _this.keeper.onBlur($span.textContent); };
        $span.oninput = function (event) { return _this.keeper.onInput(event); };
        $span.contentEditable = 'true';
        return $span;
    };
    CellDrawer.prototype.$createCell = function ($span) {
        var _this = this;
        var $cell = document.createElement('div');
        $cell.className = 'comgrid-cell border-top border-left border-right border-bottom text-dark';
        $cell.onmouseenter = function () { return _this.keeper.onMouseenter(); };
        $cell.onmousedown = function () { return _this.keeper.onMousedown(); };
        $cell.ondragstart = function () { return false; };
        $cell.oncontextmenu = function () { return _this.keeper.onContextmenu(); };
        $cell.append($span);
        return $cell;
    };
    CellDrawer.prototype.focus = function () {
        this.$span.focus();
    };
    CellDrawer.prototype.select = function () {
        var _a, _b;
        (_a = this.$cell.classList).remove.apply(_a, TablePage_1.store.noSelectedClasses);
        (_b = this.$cell.classList).add.apply(_b, TablePage_1.store.selectedClasses);
    };
    CellDrawer.prototype.selectNone = function () {
        var _a, _b;
        (_a = this.$cell.classList).remove.apply(_a, TablePage_1.store.selectedClasses);
        (_b = this.$cell.classList).add.apply(_b, TablePage_1.store.noSelectedClasses);
    };
    CellDrawer.prototype.isEmpty = function () {
        return this.$span.textContent.length === 0;
    };
    CellDrawer.prototype.removeBorders = function () {
        var _this = this;
        var directions = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            directions[_i] = arguments[_i];
        }
        directions.forEach(function (direction) { return _this.removeBorder(direction); });
    };
    CellDrawer.prototype.removeBorder = function (direction) {
        switch (direction) {
            case Direction_1.Direction.bottom:
                this.$cell.classList.remove('border-bottom');
                return;
            case Direction_1.Direction.left:
                this.$cell.classList.remove('border-left');
                return;
            case Direction_1.Direction.right:
                this.$cell.classList.remove('border-right');
                return;
            case Direction_1.Direction.top:
                this.$cell.classList.remove('border-top');
                return;
        }
    };
    CellDrawer.prototype.addBorders = function () {
        var _this = this;
        var directions = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            directions[_i] = arguments[_i];
        }
        directions.forEach(function (direction) { return _this.addBorder(direction); });
    };
    CellDrawer.prototype.addBorder = function (direction) {
        switch (direction) {
            case Direction_1.Direction.bottom:
                this.$cell.classList.add('border-bottom');
                return;
            case Direction_1.Direction.left:
                this.$cell.classList.add('border-left');
                return;
            case Direction_1.Direction.right:
                this.$cell.classList.add('border-right');
                return;
            case Direction_1.Direction.top:
                this.$cell.classList.add('border-top');
                return;
        }
    };
    CellDrawer.prototype.block = function () {
        var _this = this;
        this.$span.contentEditable = 'false';
        this.$span.classList.add('user-select-none');
        this.$cell.ondblclick = function () { return _this.keeper.onDoubleClick(); };
    };
    CellDrawer.prototype.blockNo = function () {
        this.$span.contentEditable = 'true';
        this.$span.classList.remove('user-select-none');
        this.$cell.ondblclick = null;
    };
    CellDrawer.prototype.undoWrite = function () {
        var lastSpaceIndex = this.$span.textContent.lastIndexOf(' ');
        if (lastSpaceIndex < 0)
            this.$span.textContent = '';
        else
            this.$span.textContent = this.$span.textContent.substr(0, lastSpaceIndex);
    };
    CellDrawer.prototype.undoDelete = function (text) {
        this.$span.textContent += text;
    };
    CellDrawer.prototype.addDecor = function (cssString) {
        this.$cell.setAttribute("style", cssString);
    };
    CellDrawer.prototype.addMessage = function (text) {
        this.$span.textContent = text;
    };
    CellDrawer.prototype.getCssStyle = function () {
        return this.$cell.getAttribute('style');
    };
    Object.defineProperty(CellDrawer.prototype, "screenX", {
        get: function () {
            return this.$cell.getBoundingClientRect().x;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CellDrawer.prototype, "screenY", {
        get: function () {
            return this.$cell.getBoundingClientRect().y;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CellDrawer.prototype, "text", {
        get: function () {
            return this.$span.textContent;
        },
        set: function (text) {
            this.$span.textContent = text;
        },
        enumerable: false,
        configurable: true
    });
    return CellDrawer;
}());
exports.CellDrawer = CellDrawer;
},{"../main/TablePage":5,"../utilities/Direction":7}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = void 0;
var Cell_1 = require("../cell/Cell");
var TableMod_1 = require("./TableMod");
var Action_1 = require("../utilities/Action");
var WebSocketClient_1 = require("../../util/WebSocketClient");
var TableTopic_1 = require("../../util/websocket/TableTopic");
var Util_1 = require("../../util/Util");
var UserTopic_1 = require("../../util/websocket/UserTopic");
var HttpClient_1 = require("../../util/HttpClient");
var UserInfoRequest_1 = require("../../util/request/UserInfoRequest");
var Table = /** @class */ (function () {
    function Table(_store) {
        var _this = this;
        this._store = _store;
        this.$tableContainer = $('main');
        this.cells = [];
        this.selectedCells = [];
        this.actions = [];
        this._$popover = $('#popover');
        this.websocket = new WebSocketClient_1.WebSocketClient("https://comgrid.ru:8443/websocket");
        this.http = new HttpClient_1.HttpClient("https://comgrid.ru:8443");
        this.tableTopic = new TableTopic_1.TableTopic(parseInt((0, Util_1.getParam)('id')));
        this.websocket.subscribe(this.tableTopic, function (message) {
            console.log(message);
            _this.cells[message.x][message.y].text = message.text;
        });
        this.http.proceedRequest(new UserInfoRequest_1.UserInfoRequest({})).then(function (user) {
            _this.userTopic = new UserTopic_1.UserTopic(user.id);
            _this.websocket.subscribe(_this.userTopic, function (message) {
                console.log(message);
            });
        });
        this.width = _store.width;
        this.height = _store.height;
        this.fillTable(_store.cellsUnions, _store.decorations, _store.messages);
        var $body = $('body');
        $body.on('mouseup', function () { return _this.onBodyMouseup(); });
        $body.on('keydown', function (event) { return _this.onBodyKeydown(event); });
        $('#page-name').text(_store.name);
        this._$popover.on('mouseup', function (event) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        });
    }
    Table.prototype.fillTable = function (cellsUnions, decorations, messages) {
        this.fillStartTable();
        this.union(cellsUnions);
        this.decorate(decorations);
        this.addMessages(messages);
    };
    Table.prototype.fillStartTable = function () {
        this.cells.length = 0;
        for (var i = 0; i < this.height; i++) {
            this.cells.push([]);
            var $row = document.createElement('row');
            $row.className = 'comgrid-row';
            this.$tableContainer.append($row);
            for (var j = 0; j < this.width; j++) {
                this.cells[i].push(new Cell_1.Cell(i, j, $row, this));
            }
        }
    };
    Table.prototype.union = function (cellsUnions) {
        var _this = this;
        cellsUnions.forEach(function (union) { return _this.createUnion(union); });
    };
    Table.prototype.createUnion = function (cellsUnion) {
        for (var i = cellsUnion.leftUpX; i <= cellsUnion.rightDownX; i++)
            for (var j = cellsUnion.leftUpY; j <= cellsUnion.rightDownY; j++)
                this.getCell(i, j).selectWithFriends(true);
        this.selectDown();
    };
    Table.prototype.decorate = function (decorations) {
        var _this = this;
        decorations.forEach(function (decoration) { return _this.decorateOne(decoration); });
    };
    Table.prototype.decorateOne = function (decoration) {
        for (var i = decoration.leftUpX; i <= decoration.rightDownX; i++)
            for (var j = decoration.leftUpY; j <= decoration.rightDownY; j++)
                this.getCell(i, j).addDecor(decoration.cssText);
    };
    Table.prototype.addMessages = function (messages) {
        var _this = this;
        messages.forEach(function (message) { return _this.getCell(message.x, message.y).addMessage(message.text); });
    };
    Table.prototype.onBodyMouseup = function () {
        this.mod = TableMod_1.TableMod.none;
        this.selectDown();
        this.hidePopover();
    };
    Table.prototype.selectDown = function () {
        var clone = this.selectedCells.map(function (elem) { return elem; });
        var style = clone[0].getCssStyle();
        while (this.selectedCells.length > 0) {
            var cell = this.selectedCells.pop();
            cell.setFriends(clone);
            cell.selectNone();
            cell.addDecor(style);
        }
    };
    Table.prototype.onBodyKeydown = function (event) {
        if (event.ctrlKey && event.code === 'KeyZ') {
            event.preventDefault();
            this.popAction();
        }
    };
    Table.prototype.getCell = function (x, y) {
        if (x >= 0 && x < this.height && y >= 0 && y < this.width)
            return this.cells[x][y];
        return null;
    };
    Table.prototype.pushAction = function (action) {
        var lastAction = this.actions[this.actions.length - 1];
        if (lastAction != null &&
            lastAction[0] === Action_1.ActionType.write &&
            action[0] <= Action_1.ActionType.writeWithSpace &&
            lastAction[1] === action[1] &&
            lastAction[2] === action[2]) {
            this.actions.pop();
        }
        this.actions.push(action);
        if (action[0] === Action_1.ActionType.write ||
            action[0] === Action_1.ActionType.writeWithSpace ||
            action[0] === Action_1.ActionType.delete) {
            this.websocket.sendMessage(this.tableTopic, {
                x: action[1],
                y: action[2],
                chatId: (0, Util_1.getParam)("id"),
                text: this.cells[action[1]][action[2]].text
            });
        }
    };
    Table.prototype.popAction = function () {
        var action = this.actions.pop();
        switch (action[0]) {
            case Action_1.ActionType.write:
                this.undoWrite(action[1], action[2]);
                return;
            // case ActionType.delete:
            //     this.undoDelete(action[1], action[2], action[3]);
            //     return;
            case Action_1.ActionType.writeWithSpace:
                this.undoWrite(action[1], action[2]);
                return;
        }
    };
    Table.prototype.undoWrite = function (x, y) {
        this.getCell(x, y).undoWrite();
    };
    Table.prototype.undoDelete = function (x, y, text) {
        this.getCell(x, y).undoDelete(text);
    };
    Table.prototype.showPopover = function (x, y, cell) {
        var _this = this;
        this._$popover.removeClass('d-none');
        this._$popover.attr('style', "left: ".concat(cell.screenX + 16, "px; top: ").concat(cell.screenY + 16, "px;"));
        this._$popover.find('#coords').text("".concat(x, ", ").concat(y));
        var $input = this._$popover.find('#cssStyleInput');
        $input.val(cell.getCssStyle());
        $input.off('change');
        $input.on('change', function () { return cell.addDecorWithFriends($input.val()); });
        var $button1 = this._$popover.find('#editTextButton');
        $button1.off('click');
        $button1.on('click', function () {
            cell.focus();
            _this.hidePopover();
        });
        var $button2 = this._$popover.find('#divideButton');
        $button2.off('click');
        $button2.on('click', function () {
            cell.separateWithFriends();
            cell.focus();
            _this.hidePopover();
        });
    };
    Table.prototype.hidePopover = function () {
        this._$popover.addClass('d-none');
    };
    return Table;
}());
exports.Table = Table;
},{"../../util/HttpClient":8,"../../util/Util":9,"../../util/WebSocketClient":10,"../../util/request/UserInfoRequest":14,"../../util/websocket/TableTopic":15,"../../util/websocket/UserTopic":17,"../cell/Cell":1,"../utilities/Action":6,"./TableMod":4}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableMod = void 0;
var TableMod;
(function (TableMod) {
    TableMod[TableMod["none"] = 0] = "none";
    TableMod[TableMod["selecting"] = 1] = "selecting";
})(TableMod = exports.TableMod || (exports.TableMod = {}));
},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
var Table_1 = require("./Table");
var HttpClient_1 = require("../../util/HttpClient");
var TableInfoRequest_1 = require("../../util/request/TableInfoRequest");
var IsLoggedInRequest_1 = require("../../util/request/IsLoggedInRequest");
var TableMessagesRequest_1 = require("../../util/request/TableMessagesRequest");
var Util_1 = require("../../util/Util");
var table;
var link = "https://comgrid.ru:8443";
var cellsUnions = [
    {
        leftUpX: 11,
        leftUpY: 14,
        rightDownX: 17,
        rightDownY: 17
    },
    {
        leftUpX: 22,
        leftUpY: 17,
        rightDownX: 24,
        rightDownY: 30
    }
];
var decorations = [
    {
        leftUpX: 11,
        leftUpY: 14,
        rightDownX: 17,
        rightDownY: 17,
        cssText: "background-color: blue; color: yellow !important; border-color: red !important;"
    },
    {
        leftUpX: 31,
        leftUpY: 41,
        rightDownX: 31,
        rightDownY: 41,
        cssText: "background-color: rgb(204,11,11); color: green !important; border-color: blue !important;"
    }
];
exports.store = {
    height: 50,
    width: 50,
    cellsUnions: [
        {
            leftUpX: 11,
            leftUpY: 14,
            rightDownX: 17,
            rightDownY: 17
        },
        {
            leftUpX: 22,
            leftUpY: 17,
            rightDownX: 24,
            rightDownY: 30
        }
    ],
    messages: [
        {
            x: 22,
            y: 17,
            text: "Ребята, привет, что задали по прекрасной жизни без забот?"
        }
    ],
    selectedClasses: ['bg-dark', 'text-light'],
    noSelectedClasses: ['text-dark']
};
var httpClient = new HttpClient_1.HttpClient(link);
$(window).on('load', function () {
    httpClient.proceedRequest(new IsLoggedInRequest_1.IsLoggedInRequest(), function () {
        alert("You're not logged in, please log in");
    }).then(loadTable)
        .then(loadTableMessages)
        .then(function () {
        console.log("Table messages");
        exports.store.cellsUnions = cellsUnions;
        exports.store.decorations = decorations;
        table = new Table_1.Table(exports.store);
    });
});
function loadTable() {
    var chatId = parseInt((0, Util_1.getParam)('id'));
    return httpClient.proceedRequest(new TableInfoRequest_1.TableInfoRequest({
        chatId: chatId
    }), function (code, errorText) {
        if (code === 404) {
            console.log("Table not found");
        }
        else {
            console.log("Error: '".concat(code, ", ").concat(errorText, "' while loading table info"));
        }
    }).then(function (table) {
        console.log(table);
        exports.store = table;
    });
}
function loadTableMessages() {
    var chatId = parseInt((0, Util_1.getParam)('id'));
    return httpClient.proceedRequest(new TableMessagesRequest_1.TableMessagesRequest({
        chatId: chatId,
        xcoordLeftTop: 0,
        ycoordLeftTop: 0,
        xcoordRightBottom: exports.store.width - 1,
        ycoordRightBottom: exports.store.height - 1,
    }), function (code, errorText) {
        if (code === 400) {
            console.log(code + ", " + errorText);
        }
        if (code === 404) {
            alert("code: " + code + ", error: " + errorText);
            console.log("code: " + code + ", error: " + errorText);
        }
        else if (code === 403 && errorText === "access.chat.read_messages") {
            alert("You don't have enough rights to access this chat");
        }
        else if (code === 422 && (errorText === "out_of_bounds" ||
            errorText === "time.negative-or-future")) { // should not happen
            console.log("height: ".concat(exports.store.height - 1, ", width: ").concat(exports.store.width - 1));
            alert("Should not happen, see console");
        }
    }).then(function (messages) {
        exports.store.messages = messages;
    });
}
},{"../../util/HttpClient":8,"../../util/Util":9,"../../util/request/IsLoggedInRequest":11,"../../util/request/TableInfoRequest":12,"../../util/request/TableMessagesRequest":13,"./Table":3}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionType = void 0;
var ActionType;
(function (ActionType) {
    ActionType[ActionType["write"] = 0] = "write";
    ActionType[ActionType["writeWithSpace"] = 1] = "writeWithSpace";
    ActionType[ActionType["delete"] = 2] = "delete";
    ActionType[ActionType["union"] = 3] = "union";
})(ActionType = exports.ActionType || (exports.ActionType = {}));
},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Direction = void 0;
var Direction;
(function (Direction) {
    Direction[Direction["left"] = 0] = "left";
    Direction[Direction["right"] = 1] = "right";
    Direction[Direction["top"] = 2] = "top";
    Direction[Direction["bottom"] = 3] = "bottom";
})(Direction = exports.Direction || (exports.Direction = {}));
},{}],8:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MethodType = exports.HttpClient = void 0;
var HttpClient = /** @class */ (function () {
    function HttpClient(apiLink) {
        this.apiLink = apiLink;
    }
    HttpClient.prototype.proceedRequest = function (request, onFailure, onNetworkFailure) {
        if (onFailure === void 0) { onFailure = function (code, errorText) { return alert("code: ".concat(code, ", error: ").concat(errorText)); }; }
        if (onNetworkFailure === void 0) { onNetworkFailure = function (reason) { return alert("network error: ".concat(reason)); }; }
        return __awaiter(this, void 0, void 0, function () {
            var finalLink;
            return __generator(this, function (_a) {
                finalLink = new URL(this.apiLink + request.endpoint);
                if (request.parameters != undefined)
                    finalLink.search = new URLSearchParams(request.parameters).toString();
                console.log(request);
                return [2 /*return*/, fetch(finalLink.toString(), {
                        credentials: "include",
                        method: request.methodType,
                        headers: request.headers,
                        body: request.body
                    }).then(function (response) {
                        if (response.status === 200) {
                            return request.proceedRequest(response);
                        }
                        else {
                            response.text().then(function (text) {
                                onFailure(response.status, text);
                                return Promise.reject(text);
                            });
                        }
                    })];
            });
        });
    };
    return HttpClient;
}());
exports.HttpClient = HttpClient;
var MethodType;
(function (MethodType) {
    MethodType["POST"] = "POST";
    MethodType["GET"] = "GET";
    MethodType["PATCH"] = "PATCH";
    MethodType["PUT"] = "PUT";
})(MethodType = exports.MethodType || (exports.MethodType = {}));
},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParam = void 0;
function getParam(name) {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}
exports.getParam = getParam;
},{}],10:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketClient = void 0;
var sockjs_client_1 = __importDefault(require("sockjs-client"));
var stompjs_1 = require("@stomp/stompjs");
var WebSocketClient = /** @class */ (function () {
    function WebSocketClient(apiLink) {
        this.connected = false;
        this.socket = new sockjs_client_1.default(apiLink);
        this.stompClient = stompjs_1.Stomp.over(this.socket);
        this.stompClient.connect();
    }
    WebSocketClient.prototype.connect = function (topic, onMessage) {
        var _this = this;
        this.stompClient.connect({}, function (frame) {
            _this.stompClient.subscribe(topic.destination(), function (message) {
                var str = new TextDecoder().decode(message.binaryBody);
                onMessage(topic.proceedMessage(str));
            });
            _this.connected = true;
        }, this.disconnect, this.disconnect);
    };
    WebSocketClient.prototype.disconnect = function () {
        this.connected = false;
    };
    WebSocketClient.prototype.subscribe = function (topic, onMessage) {
        var _this = this;
        if (this.stompClient.connected) {
            console.log("Connected");
            this.stompClient.subscribe(topic.destination(), function (message) {
                var str = new TextDecoder().decode(message.binaryBody);
                onMessage(topic.proceedMessage(str));
            });
        }
        else {
            console.log("not connected");
            var currentOnConnect_1 = this.stompClient.onConnect;
            this.stompClient.onConnect = function (frame) { return _this.stompClient.subscribe(topic.destination(), function (message) {
                currentOnConnect_1(frame);
                var str = new TextDecoder().decode(message.binaryBody);
                onMessage(topic.proceedMessage(str));
            }); };
        }
    };
    WebSocketClient.prototype.sendMessage = function (topic, message) {
        this.stompClient.send(topic.receive(), {}, JSON.stringify(message));
    };
    return WebSocketClient;
}());
exports.WebSocketClient = WebSocketClient;
},{"@stomp/stompjs":18,"sockjs-client":23}],11:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsLoggedInRequest = void 0;
var HttpClient_1 = require("../HttpClient");
var IsLoggedInRequest = /** @class */ (function () {
    function IsLoggedInRequest() {
        this.endpoint = '/user/login';
        this.methodType = HttpClient_1.MethodType.GET;
    }
    IsLoggedInRequest.prototype.proceedRequest = function (response) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, response.status];
            });
        });
    };
    return IsLoggedInRequest;
}());
exports.IsLoggedInRequest = IsLoggedInRequest;
},{"../HttpClient":8}],12:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableInfoRequest = void 0;
var HttpClient_1 = require("../HttpClient");
var TableInfoRequest = /** @class */ (function () {
    function TableInfoRequest(parameters) {
        var _a;
        this.endpoint = "/table/info";
        this.methodType = HttpClient_1.MethodType.GET;
        var params = {};
        params.chatId = parameters.chatId.toString();
        if (parameters.includeParticipants)
            params.includeParticipants = (_a = parameters.includeParticipants) === null || _a === void 0 ? void 0 : _a.toString();
        this.parameters = params;
    }
    TableInfoRequest.prototype.proceedRequest = function (response) {
        return __awaiter(this, void 0, void 0, function () {
            var text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, response.text()];
                    case 1:
                        text = _a.sent();
                        return [2 /*return*/, JSON.parse(text)];
                }
            });
        });
    };
    return TableInfoRequest;
}());
exports.TableInfoRequest = TableInfoRequest;
},{"../HttpClient":8}],13:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableMessagesRequest = exports.MessageResponse = void 0;
var HttpClient_1 = require("../HttpClient");
var MessageResponse = /** @class */ (function () {
    function MessageResponse() {
    }
    return MessageResponse;
}());
exports.MessageResponse = MessageResponse;
var TableMessagesRequest = /** @class */ (function () {
    function TableMessagesRequest(body) {
        this.endpoint = '/message/list';
        this.headers = {
            "Content-Type": "application/json"
        };
        this.methodType = HttpClient_1.MethodType.POST;
        this.body = JSON.stringify(body);
    }
    TableMessagesRequest.prototype.proceedRequest = function (response) {
        return __awaiter(this, void 0, void 0, function () {
            var text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, response.text()];
                    case 1:
                        text = _a.sent();
                        return [2 /*return*/, JSON.parse(text)];
                }
            });
        });
    };
    return TableMessagesRequest;
}());
exports.TableMessagesRequest = TableMessagesRequest;
},{"../HttpClient":8}],14:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInfoRequest = exports.UserResponse = void 0;
var HttpClient_1 = require("../HttpClient");
var UserResponse = /** @class */ (function () {
    function UserResponse() {
    }
    return UserResponse;
}());
exports.UserResponse = UserResponse;
var UserInfoRequest = /** @class */ (function () {
    function UserInfoRequest(parameters) {
        var _a;
        this.endpoint = "/user/info";
        this.methodType = HttpClient_1.MethodType.GET;
        var params = {};
        if (parameters.includeChats)
            params.includeChats = (_a = parameters.includeChats) === null || _a === void 0 ? void 0 : _a.toString();
        this.parameters = params;
    }
    UserInfoRequest.prototype.proceedRequest = function (response) {
        return __awaiter(this, void 0, void 0, function () {
            var text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, response.text()];
                    case 1:
                        text = _a.sent();
                        return [2 /*return*/, JSON.parse(text)];
                }
            });
        });
    };
    return UserInfoRequest;
}());
exports.UserInfoRequest = UserInfoRequest;
},{"../HttpClient":8}],15:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableTopic = exports.MessageOut = exports.MessageIn = void 0;
var Topic_1 = require("./Topic");
var MessageIn = /** @class */ (function () {
    function MessageIn() {
    }
    return MessageIn;
}());
exports.MessageIn = MessageIn;
var MessageOut = /** @class */ (function () {
    function MessageOut() {
    }
    return MessageOut;
}());
exports.MessageOut = MessageOut;
var TableTopic = /** @class */ (function (_super) {
    __extends(TableTopic, _super);
    function TableTopic(tableId) {
        var _this = _super.call(this, "/connection/table_message/{id}", "/connection/table_message/edit_or_send", tableId) || this;
        _this.tableId = tableId;
        return _this;
    }
    TableTopic.prototype.proceedMessage = function (message) {
        console.log(message);
        return JSON.parse(message);
    };
    return TableTopic;
}(Topic_1.Topic));
exports.TableTopic = TableTopic;
},{"./Topic":16}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Topic = void 0;
var Topic = /** @class */ (function () {
    function Topic(destinationPath, receivePath, identifier) {
        this.destinationPath = destinationPath;
        this.receivePath = receivePath;
        this.identifier = identifier;
    }
    Topic.prototype.destination = function () {
        return this.destinationPath.replace("{id}", this.identifier);
    };
    Topic.prototype.receive = function () {
        return this.receivePath;
    };
    return Topic;
}());
exports.Topic = Topic;
},{}],17:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTopic = void 0;
var Topic_1 = require("./Topic");
var UserTopic = /** @class */ (function (_super) {
    __extends(UserTopic, _super);
    function UserTopic(userId) {
        return _super.call(this, "/connection/user/{id}", "", userId) || this;
    }
    UserTopic.prototype.proceedMessage = function (message) {
        return message;
    };
    return UserTopic;
}(Topic_1.Topic));
exports.UserTopic = UserTopic;
},{"./Topic":16}],18:[function(require,module,exports){
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("StompJs", [], factory);
	else if(typeof exports === 'object')
		exports["StompJs"] = factory();
	else
		root["StompJs"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/augment-websocket.ts":
/*!**********************************!*\
  !*** ./src/augment-websocket.ts ***!
  \**********************************/
/*! exports provided: augmentWebsocket */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "augmentWebsocket", function() { return augmentWebsocket; });
/**
 * @internal
 */
function augmentWebsocket(webSocket, debug) {
    webSocket.terminate = function () {
        const noOp = () => { };
        // set all callbacks to no op
        this.onerror = noOp;
        this.onmessage = noOp;
        this.onopen = noOp;
        const ts = new Date();
        const origOnClose = this.onclose;
        // Track delay in actual closure of the socket
        this.onclose = closeEvent => {
            const delay = new Date().getTime() - ts.getTime();
            debug(`Discarded socket closed after ${delay}ms, with code/reason: ${closeEvent.code}/${closeEvent.reason}`);
        };
        this.close();
        origOnClose.call(this, {
            code: 4001,
            reason: 'Heartbeat failure, discarding the socket',
            wasClean: false,
        });
    };
}


/***/ }),

/***/ "./src/byte.ts":
/*!*********************!*\
  !*** ./src/byte.ts ***!
  \*********************/
/*! exports provided: BYTE */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BYTE", function() { return BYTE; });
/**
 * Some byte values, used as per STOMP specifications.
 *
 * Part of `@stomp/stompjs`.
 *
 * @internal
 */
const BYTE = {
    // LINEFEED byte (octet 10)
    LF: '\x0A',
    // NULL byte (octet 0)
    NULL: '\x00',
};


/***/ }),

/***/ "./src/client.ts":
/*!***********************!*\
  !*** ./src/client.ts ***!
  \***********************/
/*! exports provided: Client */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Client", function() { return Client; });
/* harmony import */ var _stomp_handler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./stomp-handler */ "./src/stomp-handler.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types */ "./src/types.ts");
/* harmony import */ var _versions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./versions */ "./src/versions.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



/**
 * STOMP Client Class.
 *
 * Part of `@stomp/stompjs`.
 */
class Client {
    /**
     * Create an instance.
     */
    constructor(conf = {}) {
        /**
         * STOMP versions to attempt during STOMP handshake. By default versions `1.0`, `1.1`, and `1.2` are attempted.
         *
         * Example:
         * ```javascript
         *        // Try only versions 1.0 and 1.1
         *        client.stompVersions = new Versions(['1.0', '1.1'])
         * ```
         */
        this.stompVersions = _versions__WEBPACK_IMPORTED_MODULE_2__["Versions"].default;
        /**
         * Will retry if Stomp connection is not established in specified milliseconds.
         * Default 0, which implies wait for ever.
         */
        this.connectionTimeout = 0;
        /**
         *  automatically reconnect with delay in milliseconds, set to 0 to disable.
         */
        this.reconnectDelay = 5000;
        /**
         * Incoming heartbeat interval in milliseconds. Set to 0 to disable.
         */
        this.heartbeatIncoming = 10000;
        /**
         * Outgoing heartbeat interval in milliseconds. Set to 0 to disable.
         */
        this.heartbeatOutgoing = 10000;
        /**
         * This switches on a non standard behavior while sending WebSocket packets.
         * It splits larger (text) packets into chunks of [maxWebSocketChunkSize]{@link Client#maxWebSocketChunkSize}.
         * Only Java Spring brokers seems to use this mode.
         *
         * WebSockets, by itself, split large (text) packets,
         * so it is not needed with a truly compliant STOMP/WebSocket broker.
         * Actually setting it for such broker will cause large messages to fail.
         *
         * `false` by default.
         *
         * Binary frames are never split.
         */
        this.splitLargeFrames = false;
        /**
         * See [splitLargeFrames]{@link Client#splitLargeFrames}.
         * This has no effect if [splitLargeFrames]{@link Client#splitLargeFrames} is `false`.
         */
        this.maxWebSocketChunkSize = 8 * 1024;
        /**
         * Usually the
         * [type of WebSocket frame]{@link https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send#Parameters}
         * is automatically decided by type of the payload.
         * Default is `false`, which should work with all compliant brokers.
         *
         * Set this flag to force binary frames.
         */
        this.forceBinaryWSFrames = false;
        /**
         * A bug in ReactNative chops a string on occurrence of a NULL.
         * See issue [https://github.com/stomp-js/stompjs/issues/89]{@link https://github.com/stomp-js/stompjs/issues/89}.
         * This makes incoming WebSocket messages invalid STOMP packets.
         * Setting this flag attempts to reverse the damage by appending a NULL.
         * If the broker splits a large message into multiple WebSocket messages,
         * this flag will cause data loss and abnormal termination of connection.
         *
         * This is not an ideal solution, but a stop gap until the underlying issue is fixed at ReactNative library.
         */
        this.appendMissingNULLonIncoming = false;
        /**
         * Activation state.
         *
         * It will usually be ACTIVE or INACTIVE.
         * When deactivating it may go from ACTIVE to INACTIVE without entering DEACTIVATING.
         */
        this.state = _types__WEBPACK_IMPORTED_MODULE_1__["ActivationState"].INACTIVE;
        // Dummy callbacks
        const noOp = () => { };
        this.debug = noOp;
        this.beforeConnect = noOp;
        this.onConnect = noOp;
        this.onDisconnect = noOp;
        this.onUnhandledMessage = noOp;
        this.onUnhandledReceipt = noOp;
        this.onUnhandledFrame = noOp;
        this.onStompError = noOp;
        this.onWebSocketClose = noOp;
        this.onWebSocketError = noOp;
        this.logRawCommunication = false;
        this.onChangeState = noOp;
        // These parameters would typically get proper values before connect is called
        this.connectHeaders = {};
        this._disconnectHeaders = {};
        // Apply configuration
        this.configure(conf);
    }
    /**
     * Underlying WebSocket instance, READONLY.
     */
    get webSocket() {
        return this._stompHandler ? this._stompHandler._webSocket : undefined;
    }
    /**
     * Disconnection headers.
     */
    get disconnectHeaders() {
        return this._disconnectHeaders;
    }
    set disconnectHeaders(value) {
        this._disconnectHeaders = value;
        if (this._stompHandler) {
            this._stompHandler.disconnectHeaders = this._disconnectHeaders;
        }
    }
    /**
     * `true` if there is a active connection with STOMP Broker
     */
    get connected() {
        return !!this._stompHandler && this._stompHandler.connected;
    }
    /**
     * version of STOMP protocol negotiated with the server, READONLY
     */
    get connectedVersion() {
        return this._stompHandler ? this._stompHandler.connectedVersion : undefined;
    }
    /**
     * if the client is active (connected or going to reconnect)
     */
    get active() {
        return this.state === _types__WEBPACK_IMPORTED_MODULE_1__["ActivationState"].ACTIVE;
    }
    _changeState(state) {
        this.state = state;
        this.onChangeState(state);
    }
    /**
     * Update configuration.
     */
    configure(conf) {
        // bulk assign all properties to this
        Object.assign(this, conf);
    }
    /**
     * Initiate the connection with the broker.
     * If the connection breaks, as per [Client#reconnectDelay]{@link Client#reconnectDelay},
     * it will keep trying to reconnect.
     *
     * Call [Client#deactivate]{@link Client#deactivate} to disconnect and stop reconnection attempts.
     */
    activate() {
        if (this.state === _types__WEBPACK_IMPORTED_MODULE_1__["ActivationState"].DEACTIVATING) {
            this.debug('Still DEACTIVATING, please await call to deactivate before trying to re-activate');
            throw new Error('Still DEACTIVATING, can not activate now');
        }
        if (this.active) {
            this.debug('Already ACTIVE, ignoring request to activate');
            return;
        }
        this._changeState(_types__WEBPACK_IMPORTED_MODULE_1__["ActivationState"].ACTIVE);
        this._connect();
    }
    _connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connected) {
                this.debug('STOMP: already connected, nothing to do');
                return;
            }
            yield this.beforeConnect();
            if (!this.active) {
                this.debug('Client has been marked inactive, will not attempt to connect');
                return;
            }
            // setup connection watcher
            if (this.connectionTimeout > 0) {
                // clear first
                if (this._connectionWatcher) {
                    clearTimeout(this._connectionWatcher);
                }
                this._connectionWatcher = setTimeout(() => {
                    if (this.connected) {
                        return;
                    }
                    // Connection not established, close the underlying socket
                    // a reconnection will be attempted
                    this.debug(`Connection not established in ${this.connectionTimeout}ms, closing socket`);
                    this.forceDisconnect();
                }, this.connectionTimeout);
            }
            this.debug('Opening Web Socket...');
            // Get the actual WebSocket (or a similar object)
            const webSocket = this._createWebSocket();
            this._stompHandler = new _stomp_handler__WEBPACK_IMPORTED_MODULE_0__["StompHandler"](this, webSocket, {
                debug: this.debug,
                stompVersions: this.stompVersions,
                connectHeaders: this.connectHeaders,
                disconnectHeaders: this._disconnectHeaders,
                heartbeatIncoming: this.heartbeatIncoming,
                heartbeatOutgoing: this.heartbeatOutgoing,
                splitLargeFrames: this.splitLargeFrames,
                maxWebSocketChunkSize: this.maxWebSocketChunkSize,
                forceBinaryWSFrames: this.forceBinaryWSFrames,
                logRawCommunication: this.logRawCommunication,
                appendMissingNULLonIncoming: this.appendMissingNULLonIncoming,
                discardWebsocketOnCommFailure: this.discardWebsocketOnCommFailure,
                onConnect: frame => {
                    // Successfully connected, stop the connection watcher
                    if (this._connectionWatcher) {
                        clearTimeout(this._connectionWatcher);
                        this._connectionWatcher = undefined;
                    }
                    if (!this.active) {
                        this.debug('STOMP got connected while deactivate was issued, will disconnect now');
                        this._disposeStompHandler();
                        return;
                    }
                    this.onConnect(frame);
                },
                onDisconnect: frame => {
                    this.onDisconnect(frame);
                },
                onStompError: frame => {
                    this.onStompError(frame);
                },
                onWebSocketClose: evt => {
                    this._stompHandler = undefined; // a new one will be created in case of a reconnect
                    if (this.state === _types__WEBPACK_IMPORTED_MODULE_1__["ActivationState"].DEACTIVATING) {
                        // Mark deactivation complete
                        this._resolveSocketClose();
                        this._resolveSocketClose = undefined;
                        this._changeState(_types__WEBPACK_IMPORTED_MODULE_1__["ActivationState"].INACTIVE);
                    }
                    this.onWebSocketClose(evt);
                    // The callback is called before attempting to reconnect, this would allow the client
                    // to be `deactivated` in the callback.
                    if (this.active) {
                        this._schedule_reconnect();
                    }
                },
                onWebSocketError: evt => {
                    this.onWebSocketError(evt);
                },
                onUnhandledMessage: message => {
                    this.onUnhandledMessage(message);
                },
                onUnhandledReceipt: frame => {
                    this.onUnhandledReceipt(frame);
                },
                onUnhandledFrame: frame => {
                    this.onUnhandledFrame(frame);
                },
            });
            this._stompHandler.start();
        });
    }
    _createWebSocket() {
        let webSocket;
        if (this.webSocketFactory) {
            webSocket = this.webSocketFactory();
        }
        else {
            webSocket = new WebSocket(this.brokerURL, this.stompVersions.protocolVersions());
        }
        webSocket.binaryType = 'arraybuffer';
        return webSocket;
    }
    _schedule_reconnect() {
        if (this.reconnectDelay > 0) {
            this.debug(`STOMP: scheduling reconnection in ${this.reconnectDelay}ms`);
            this._reconnector = setTimeout(() => {
                this._connect();
            }, this.reconnectDelay);
        }
    }
    /**
     * Disconnect if connected and stop auto reconnect loop.
     * Appropriate callbacks will be invoked if underlying STOMP connection was connected.
     *
     * This call is async, it will resolve immediately if there is no underlying active websocket,
     * otherwise, it will resolve after underlying websocket is properly disposed.
     *
     * To reactivate you can call [Client#activate]{@link Client#activate}.
     */
    deactivate() {
        return __awaiter(this, void 0, void 0, function* () {
            let retPromise;
            if (this.state !== _types__WEBPACK_IMPORTED_MODULE_1__["ActivationState"].ACTIVE) {
                this.debug(`Already ${_types__WEBPACK_IMPORTED_MODULE_1__["ActivationState"][this.state]}, ignoring call to deactivate`);
                return Promise.resolve();
            }
            this._changeState(_types__WEBPACK_IMPORTED_MODULE_1__["ActivationState"].DEACTIVATING);
            // Clear if a reconnection was scheduled
            if (this._reconnector) {
                clearTimeout(this._reconnector);
            }
            if (this._stompHandler &&
                this.webSocket.readyState !== _types__WEBPACK_IMPORTED_MODULE_1__["StompSocketState"].CLOSED) {
                // we need to wait for underlying websocket to close
                retPromise = new Promise((resolve, reject) => {
                    this._resolveSocketClose = resolve;
                });
            }
            else {
                // indicate that auto reconnect loop should terminate
                this._changeState(_types__WEBPACK_IMPORTED_MODULE_1__["ActivationState"].INACTIVE);
                return Promise.resolve();
            }
            this._disposeStompHandler();
            return retPromise;
        });
    }
    /**
     * Force disconnect if there is an active connection by directly closing the underlying WebSocket.
     * This is different than a normal disconnect where a DISCONNECT sequence is carried out with the broker.
     * After forcing disconnect, automatic reconnect will be attempted.
     * To stop further reconnects call [Client#deactivate]{@link Client#deactivate} as well.
     */
    forceDisconnect() {
        if (this._stompHandler) {
            this._stompHandler.forceDisconnect();
        }
    }
    _disposeStompHandler() {
        // Dispose STOMP Handler
        if (this._stompHandler) {
            this._stompHandler.dispose();
            this._stompHandler = null;
        }
    }
    /**
     * Send a message to a named destination. Refer to your STOMP broker documentation for types
     * and naming of destinations.
     *
     * STOMP protocol specifies and suggests some headers and also allows broker specific headers.
     *
     * `body` must be String.
     * You will need to covert the payload to string in case it is not string (e.g. JSON).
     *
     * To send a binary message body use binaryBody parameter. It should be a
     * [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array).
     * Sometimes brokers may not support binary frames out of the box.
     * Please check your broker documentation.
     *
     * `content-length` header is automatically added to the STOMP Frame sent to the broker.
     * Set `skipContentLengthHeader` to indicate that `content-length` header should not be added.
     * For binary messages `content-length` header is always added.
     *
     * Caution: The broker will, most likely, report an error and disconnect if message body has NULL octet(s)
     * and `content-length` header is missing.
     *
     * ```javascript
     *        client.publish({destination: "/queue/test", headers: {priority: 9}, body: "Hello, STOMP"});
     *
     *        // Only destination is mandatory parameter
     *        client.publish({destination: "/queue/test", body: "Hello, STOMP"});
     *
     *        // Skip content-length header in the frame to the broker
     *        client.publish({"/queue/test", body: "Hello, STOMP", skipContentLengthHeader: true});
     *
     *        var binaryData = generateBinaryData(); // This need to be of type Uint8Array
     *        // setting content-type header is not mandatory, however a good practice
     *        client.publish({destination: '/topic/special', binaryBody: binaryData,
     *                         headers: {'content-type': 'application/octet-stream'}});
     * ```
     */
    publish(params) {
        this._stompHandler.publish(params);
    }
    /**
     * STOMP brokers may carry out operation asynchronously and allow requesting for acknowledgement.
     * To request an acknowledgement, a `receipt` header needs to be sent with the actual request.
     * The value (say receipt-id) for this header needs to be unique for each use. Typically a sequence, a UUID, a
     * random number or a combination may be used.
     *
     * A complaint broker will send a RECEIPT frame when an operation has actually been completed.
     * The operation needs to be matched based in the value of the receipt-id.
     *
     * This method allow watching for a receipt and invoke the callback
     * when corresponding receipt has been received.
     *
     * The actual {@link FrameImpl} will be passed as parameter to the callback.
     *
     * Example:
     * ```javascript
     *        // Subscribing with acknowledgement
     *        let receiptId = randomText();
     *
     *        client.watchForReceipt(receiptId, function() {
     *          // Will be called after server acknowledges
     *        });
     *
     *        client.subscribe(TEST.destination, onMessage, {receipt: receiptId});
     *
     *
     *        // Publishing with acknowledgement
     *        receiptId = randomText();
     *
     *        client.watchForReceipt(receiptId, function() {
     *          // Will be called after server acknowledges
     *        });
     *        client.publish({destination: TEST.destination, headers: {receipt: receiptId}, body: msg});
     * ```
     */
    watchForReceipt(receiptId, callback) {
        this._stompHandler.watchForReceipt(receiptId, callback);
    }
    /**
     * Subscribe to a STOMP Broker location. The callback will be invoked for each received message with
     * the {@link IMessage} as argument.
     *
     * Note: The library will generate an unique ID if there is none provided in the headers.
     *       To use your own ID, pass it using the headers argument.
     *
     * ```javascript
     *        callback = function(message) {
     *        // called when the client receives a STOMP message from the server
     *          if (message.body) {
     *            alert("got message with body " + message.body)
     *          } else {
     *            alert("got empty message");
     *          }
     *        });
     *
     *        var subscription = client.subscribe("/queue/test", callback);
     *
     *        // Explicit subscription id
     *        var mySubId = 'my-subscription-id-001';
     *        var subscription = client.subscribe(destination, callback, { id: mySubId });
     * ```
     */
    subscribe(destination, callback, headers = {}) {
        return this._stompHandler.subscribe(destination, callback, headers);
    }
    /**
     * It is preferable to unsubscribe from a subscription by calling
     * `unsubscribe()` directly on {@link StompSubscription} returned by `client.subscribe()`:
     *
     * ```javascript
     *        var subscription = client.subscribe(destination, onmessage);
     *        // ...
     *        subscription.unsubscribe();
     * ```
     *
     * See: http://stomp.github.com/stomp-specification-1.2.html#UNSUBSCRIBE UNSUBSCRIBE Frame
     */
    unsubscribe(id, headers = {}) {
        this._stompHandler.unsubscribe(id, headers);
    }
    /**
     * Start a transaction, the returned {@link ITransaction} has methods - [commit]{@link ITransaction#commit}
     * and [abort]{@link ITransaction#abort}.
     *
     * `transactionId` is optional, if not passed the library will generate it internally.
     */
    begin(transactionId) {
        return this._stompHandler.begin(transactionId);
    }
    /**
     * Commit a transaction.
     *
     * It is preferable to commit a transaction by calling [commit]{@link ITransaction#commit} directly on
     * {@link ITransaction} returned by [client.begin]{@link Client#begin}.
     *
     * ```javascript
     *        var tx = client.begin(txId);
     *        //...
     *        tx.commit();
     * ```
     */
    commit(transactionId) {
        this._stompHandler.commit(transactionId);
    }
    /**
     * Abort a transaction.
     * It is preferable to abort a transaction by calling [abort]{@link ITransaction#abort} directly on
     * {@link ITransaction} returned by [client.begin]{@link Client#begin}.
     *
     * ```javascript
     *        var tx = client.begin(txId);
     *        //...
     *        tx.abort();
     * ```
     */
    abort(transactionId) {
        this._stompHandler.abort(transactionId);
    }
    /**
     * ACK a message. It is preferable to acknowledge a message by calling [ack]{@link IMessage#ack} directly
     * on the {@link IMessage} handled by a subscription callback:
     *
     * ```javascript
     *        var callback = function (message) {
     *          // process the message
     *          // acknowledge it
     *          message.ack();
     *        };
     *        client.subscribe(destination, callback, {'ack': 'client'});
     * ```
     */
    ack(messageId, subscriptionId, headers = {}) {
        this._stompHandler.ack(messageId, subscriptionId, headers);
    }
    /**
     * NACK a message. It is preferable to acknowledge a message by calling [nack]{@link IMessage#nack} directly
     * on the {@link IMessage} handled by a subscription callback:
     *
     * ```javascript
     *        var callback = function (message) {
     *          // process the message
     *          // an error occurs, nack it
     *          message.nack();
     *        };
     *        client.subscribe(destination, callback, {'ack': 'client'});
     * ```
     */
    nack(messageId, subscriptionId, headers = {}) {
        this._stompHandler.nack(messageId, subscriptionId, headers);
    }
}


/***/ }),

/***/ "./src/compatibility/compat-client.ts":
/*!********************************************!*\
  !*** ./src/compatibility/compat-client.ts ***!
  \********************************************/
/*! exports provided: CompatClient */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CompatClient", function() { return CompatClient; });
/* harmony import */ var _client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../client */ "./src/client.ts");
/* harmony import */ var _heartbeat_info__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./heartbeat-info */ "./src/compatibility/heartbeat-info.ts");


/**
 * Available for backward compatibility, please shift to using {@link Client}.
 *
 * **Deprecated**
 *
 * Part of `@stomp/stompjs`.
 *
 * To upgrade, please follow the [Upgrade Guide](../additional-documentation/upgrading.html)
 */
class CompatClient extends _client__WEBPACK_IMPORTED_MODULE_0__["Client"] {
    /**
     * Available for backward compatibility, please shift to using {@link Client}
     * and [Client#webSocketFactory]{@link Client#webSocketFactory}.
     *
     * **Deprecated**
     *
     * @internal
     */
    constructor(webSocketFactory) {
        super();
        /**
         * It is no op now. No longer needed. Large packets work out of the box.
         */
        this.maxWebSocketFrameSize = 16 * 1024;
        this._heartbeatInfo = new _heartbeat_info__WEBPACK_IMPORTED_MODULE_1__["HeartbeatInfo"](this);
        this.reconnect_delay = 0;
        this.webSocketFactory = webSocketFactory;
        // Default from previous version
        this.debug = (...message) => {
            console.log(...message);
        };
    }
    _parseConnect(...args) {
        let closeEventCallback;
        let connectCallback;
        let errorCallback;
        let headers = {};
        if (args.length < 2) {
            throw new Error('Connect requires at least 2 arguments');
        }
        if (typeof args[1] === 'function') {
            [headers, connectCallback, errorCallback, closeEventCallback] = args;
        }
        else {
            switch (args.length) {
                case 6:
                    [
                        headers.login,
                        headers.passcode,
                        connectCallback,
                        errorCallback,
                        closeEventCallback,
                        headers.host,
                    ] = args;
                    break;
                default:
                    [
                        headers.login,
                        headers.passcode,
                        connectCallback,
                        errorCallback,
                        closeEventCallback,
                    ] = args;
            }
        }
        return [headers, connectCallback, errorCallback, closeEventCallback];
    }
    /**
     * Available for backward compatibility, please shift to using [Client#activate]{@link Client#activate}.
     *
     * **Deprecated**
     *
     * The `connect` method accepts different number of arguments and types. See the Overloads list. Use the
     * version with headers to pass your broker specific options.
     *
     * overloads:
     * - connect(headers, connectCallback)
     * - connect(headers, connectCallback, errorCallback)
     * - connect(login, passcode, connectCallback)
     * - connect(login, passcode, connectCallback, errorCallback)
     * - connect(login, passcode, connectCallback, errorCallback, closeEventCallback)
     * - connect(login, passcode, connectCallback, errorCallback, closeEventCallback, host)
     *
     * params:
     * - headers, see [Client#connectHeaders]{@link Client#connectHeaders}
     * - connectCallback, see [Client#onConnect]{@link Client#onConnect}
     * - errorCallback, see [Client#onStompError]{@link Client#onStompError}
     * - closeEventCallback, see [Client#onWebSocketClose]{@link Client#onWebSocketClose}
     * - login [String], see [Client#connectHeaders](../classes/Client.html#connectHeaders)
     * - passcode [String], [Client#connectHeaders](../classes/Client.html#connectHeaders)
     * - host [String], see [Client#connectHeaders](../classes/Client.html#connectHeaders)
     *
     * To upgrade, please follow the [Upgrade Guide](../additional-documentation/upgrading.html)
     */
    connect(...args) {
        const out = this._parseConnect(...args);
        if (out[0]) {
            this.connectHeaders = out[0];
        }
        if (out[1]) {
            this.onConnect = out[1];
        }
        if (out[2]) {
            this.onStompError = out[2];
        }
        if (out[3]) {
            this.onWebSocketClose = out[3];
        }
        super.activate();
    }
    /**
     * Available for backward compatibility, please shift to using [Client#deactivate]{@link Client#deactivate}.
     *
     * **Deprecated**
     *
     * See:
     * [Client#onDisconnect]{@link Client#onDisconnect}, and
     * [Client#disconnectHeaders]{@link Client#disconnectHeaders}
     *
     * To upgrade, please follow the [Upgrade Guide](../additional-documentation/upgrading.html)
     */
    disconnect(disconnectCallback, headers = {}) {
        if (disconnectCallback) {
            this.onDisconnect = disconnectCallback;
        }
        this.disconnectHeaders = headers;
        super.deactivate();
    }
    /**
     * Available for backward compatibility, use [Client#publish]{@link Client#publish}.
     *
     * Send a message to a named destination. Refer to your STOMP broker documentation for types
     * and naming of destinations. The headers will, typically, be available to the subscriber.
     * However, there may be special purpose headers corresponding to your STOMP broker.
     *
     *  **Deprecated**, use [Client#publish]{@link Client#publish}
     *
     * Note: Body must be String. You will need to covert the payload to string in case it is not string (e.g. JSON)
     *
     * ```javascript
     *        client.send("/queue/test", {priority: 9}, "Hello, STOMP");
     *
     *        // If you want to send a message with a body, you must also pass the headers argument.
     *        client.send("/queue/test", {}, "Hello, STOMP");
     * ```
     *
     * To upgrade, please follow the [Upgrade Guide](../additional-documentation/upgrading.html)
     */
    send(destination, headers = {}, body = '') {
        headers = Object.assign({}, headers);
        const skipContentLengthHeader = headers['content-length'] === false;
        if (skipContentLengthHeader) {
            delete headers['content-length'];
        }
        this.publish({
            destination,
            headers: headers,
            body,
            skipContentLengthHeader,
        });
    }
    /**
     * Available for backward compatibility, renamed to [Client#reconnectDelay]{@link Client#reconnectDelay}.
     *
     * **Deprecated**
     */
    set reconnect_delay(value) {
        this.reconnectDelay = value;
    }
    /**
     * Available for backward compatibility, renamed to [Client#webSocket]{@link Client#webSocket}.
     *
     * **Deprecated**
     */
    get ws() {
        return this.webSocket;
    }
    /**
     * Available for backward compatibility, renamed to [Client#connectedVersion]{@link Client#connectedVersion}.
     *
     * **Deprecated**
     */
    get version() {
        return this.connectedVersion;
    }
    /**
     * Available for backward compatibility, renamed to [Client#onUnhandledMessage]{@link Client#onUnhandledMessage}.
     *
     * **Deprecated**
     */
    get onreceive() {
        return this.onUnhandledMessage;
    }
    /**
     * Available for backward compatibility, renamed to [Client#onUnhandledMessage]{@link Client#onUnhandledMessage}.
     *
     * **Deprecated**
     */
    set onreceive(value) {
        this.onUnhandledMessage = value;
    }
    /**
     * Available for backward compatibility, renamed to [Client#onUnhandledReceipt]{@link Client#onUnhandledReceipt}.
     * Prefer using [Client#watchForReceipt]{@link Client#watchForReceipt}.
     *
     * **Deprecated**
     */
    get onreceipt() {
        return this.onUnhandledReceipt;
    }
    /**
     * Available for backward compatibility, renamed to [Client#onUnhandledReceipt]{@link Client#onUnhandledReceipt}.
     *
     * **Deprecated**
     */
    set onreceipt(value) {
        this.onUnhandledReceipt = value;
    }
    /**
     * Available for backward compatibility, renamed to [Client#heartbeatIncoming]{@link Client#heartbeatIncoming}
     * [Client#heartbeatOutgoing]{@link Client#heartbeatOutgoing}.
     *
     * **Deprecated**
     */
    get heartbeat() {
        return this._heartbeatInfo;
    }
    /**
     * Available for backward compatibility, renamed to [Client#heartbeatIncoming]{@link Client#heartbeatIncoming}
     * [Client#heartbeatOutgoing]{@link Client#heartbeatOutgoing}.
     *
     * **Deprecated**
     */
    set heartbeat(value) {
        this.heartbeatIncoming = value.incoming;
        this.heartbeatOutgoing = value.outgoing;
    }
}


/***/ }),

/***/ "./src/compatibility/heartbeat-info.ts":
/*!*********************************************!*\
  !*** ./src/compatibility/heartbeat-info.ts ***!
  \*********************************************/
/*! exports provided: HeartbeatInfo */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HeartbeatInfo", function() { return HeartbeatInfo; });
/**
 * Part of `@stomp/stompjs`.
 *
 * @internal
 */
class HeartbeatInfo {
    constructor(client) {
        this.client = client;
    }
    get outgoing() {
        return this.client.heartbeatOutgoing;
    }
    set outgoing(value) {
        this.client.heartbeatOutgoing = value;
    }
    get incoming() {
        return this.client.heartbeatIncoming;
    }
    set incoming(value) {
        this.client.heartbeatIncoming = value;
    }
}


/***/ }),

/***/ "./src/compatibility/stomp.ts":
/*!************************************!*\
  !*** ./src/compatibility/stomp.ts ***!
  \************************************/
/*! exports provided: Stomp */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Stomp", function() { return Stomp; });
/* harmony import */ var _versions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../versions */ "./src/versions.ts");
/* harmony import */ var _compat_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./compat-client */ "./src/compatibility/compat-client.ts");


/**
 * STOMP Class, acts like a factory to create {@link Client}.
 *
 * Part of `@stomp/stompjs`.
 *
 * **Deprecated**
 *
 * It will be removed in next major version. Please switch to {@link Client}.
 */
class Stomp {
    /**
     * This method creates a WebSocket client that is connected to
     * the STOMP server located at the url.
     *
     * ```javascript
     *        var url = "ws://localhost:61614/stomp";
     *        var client = Stomp.client(url);
     * ```
     *
     * **Deprecated**
     *
     * It will be removed in next major version. Please switch to {@link Client}
     * using [Client#brokerURL]{@link Client#brokerURL}.
     */
    static client(url, protocols) {
        // This is a hack to allow another implementation than the standard
        // HTML5 WebSocket class.
        //
        // It is possible to use another class by calling
        //
        //     Stomp.WebSocketClass = MozWebSocket
        //
        // *prior* to call `Stomp.client()`.
        //
        // This hack is deprecated and `Stomp.over()` method should be used
        // instead.
        // See remarks on the function Stomp.over
        if (protocols == null) {
            protocols = _versions__WEBPACK_IMPORTED_MODULE_0__["Versions"].default.protocolVersions();
        }
        const wsFn = () => {
            const klass = Stomp.WebSocketClass || WebSocket;
            return new klass(url, protocols);
        };
        return new _compat_client__WEBPACK_IMPORTED_MODULE_1__["CompatClient"](wsFn);
    }
    /**
     * This method is an alternative to [Stomp#client]{@link Stomp#client} to let the user
     * specify the WebSocket to use (either a standard HTML5 WebSocket or
     * a similar object).
     *
     * In order to support reconnection, the function Client._connect should be callable more than once.
     * While reconnecting
     * a new instance of underlying transport (TCP Socket, WebSocket or SockJS) will be needed. So, this function
     * alternatively allows passing a function that should return a new instance of the underlying socket.
     *
     * ```javascript
     *        var client = Stomp.over(function(){
     *          return new WebSocket('ws://localhost:15674/ws')
     *        });
     * ```
     *
     * **Deprecated**
     *
     * It will be removed in next major version. Please switch to {@link Client}
     * using [Client#webSocketFactory]{@link Client#webSocketFactory}.
     */
    static over(ws) {
        let wsFn;
        if (typeof ws === 'function') {
            wsFn = ws;
        }
        else {
            console.warn('Stomp.over did not receive a factory, auto reconnect will not work. ' +
                'Please see https://stomp-js.github.io/api-docs/latest/classes/Stomp.html#over');
            wsFn = () => ws;
        }
        return new _compat_client__WEBPACK_IMPORTED_MODULE_1__["CompatClient"](wsFn);
    }
}
/**
 * In case you need to use a non standard class for WebSocket.
 *
 * For example when using within NodeJS environment:
 *
 * ```javascript
 *        StompJs = require('../../esm5/');
 *        Stomp = StompJs.Stomp;
 *        Stomp.WebSocketClass = require('websocket').w3cwebsocket;
 * ```
 *
 * **Deprecated**
 *
 *
 * It will be removed in next major version. Please switch to {@link Client}
 * using [Client#webSocketFactory]{@link Client#webSocketFactory}.
 */
// tslint:disable-next-line:variable-name
Stomp.WebSocketClass = null;


/***/ }),

/***/ "./src/frame-impl.ts":
/*!***************************!*\
  !*** ./src/frame-impl.ts ***!
  \***************************/
/*! exports provided: FrameImpl */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FrameImpl", function() { return FrameImpl; });
/* harmony import */ var _byte__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./byte */ "./src/byte.ts");

/**
 * Frame class represents a STOMP frame.
 *
 * @internal
 */
class FrameImpl {
    /**
     * Frame constructor. `command`, `headers` and `body` are available as properties.
     *
     * @internal
     */
    constructor(params) {
        const { command, headers, body, binaryBody, escapeHeaderValues, skipContentLengthHeader, } = params;
        this.command = command;
        this.headers = Object.assign({}, headers || {});
        if (binaryBody) {
            this._binaryBody = binaryBody;
            this.isBinaryBody = true;
        }
        else {
            this._body = body || '';
            this.isBinaryBody = false;
        }
        this.escapeHeaderValues = escapeHeaderValues || false;
        this.skipContentLengthHeader = skipContentLengthHeader || false;
    }
    /**
     * body of the frame
     */
    get body() {
        if (!this._body && this.isBinaryBody) {
            this._body = new TextDecoder().decode(this._binaryBody);
        }
        return this._body;
    }
    /**
     * body as Uint8Array
     */
    get binaryBody() {
        if (!this._binaryBody && !this.isBinaryBody) {
            this._binaryBody = new TextEncoder().encode(this._body);
        }
        return this._binaryBody;
    }
    /**
     * deserialize a STOMP Frame from raw data.
     *
     * @internal
     */
    static fromRawFrame(rawFrame, escapeHeaderValues) {
        const headers = {};
        const trim = (str) => str.replace(/^\s+|\s+$/g, '');
        // In case of repeated headers, as per standards, first value need to be used
        for (const header of rawFrame.headers.reverse()) {
            const idx = header.indexOf(':');
            const key = trim(header[0]);
            let value = trim(header[1]);
            if (escapeHeaderValues &&
                rawFrame.command !== 'CONNECT' &&
                rawFrame.command !== 'CONNECTED') {
                value = FrameImpl.hdrValueUnEscape(value);
            }
            headers[key] = value;
        }
        return new FrameImpl({
            command: rawFrame.command,
            headers,
            binaryBody: rawFrame.binaryBody,
            escapeHeaderValues,
        });
    }
    /**
     * @internal
     */
    toString() {
        return this.serializeCmdAndHeaders();
    }
    /**
     * serialize this Frame in a format suitable to be passed to WebSocket.
     * If the body is string the output will be string.
     * If the body is binary (i.e. of type Unit8Array) it will be serialized to ArrayBuffer.
     *
     * @internal
     */
    serialize() {
        const cmdAndHeaders = this.serializeCmdAndHeaders();
        if (this.isBinaryBody) {
            return FrameImpl.toUnit8Array(cmdAndHeaders, this._binaryBody).buffer;
        }
        else {
            return cmdAndHeaders + this._body + _byte__WEBPACK_IMPORTED_MODULE_0__["BYTE"].NULL;
        }
    }
    serializeCmdAndHeaders() {
        const lines = [this.command];
        if (this.skipContentLengthHeader) {
            delete this.headers['content-length'];
        }
        for (const name of Object.keys(this.headers || {})) {
            const value = this.headers[name];
            if (this.escapeHeaderValues &&
                this.command !== 'CONNECT' &&
                this.command !== 'CONNECTED') {
                lines.push(`${name}:${FrameImpl.hdrValueEscape(`${value}`)}`);
            }
            else {
                lines.push(`${name}:${value}`);
            }
        }
        if (this.isBinaryBody ||
            (!this.isBodyEmpty() && !this.skipContentLengthHeader)) {
            lines.push(`content-length:${this.bodyLength()}`);
        }
        return lines.join(_byte__WEBPACK_IMPORTED_MODULE_0__["BYTE"].LF) + _byte__WEBPACK_IMPORTED_MODULE_0__["BYTE"].LF + _byte__WEBPACK_IMPORTED_MODULE_0__["BYTE"].LF;
    }
    isBodyEmpty() {
        return this.bodyLength() === 0;
    }
    bodyLength() {
        const binaryBody = this.binaryBody;
        return binaryBody ? binaryBody.length : 0;
    }
    /**
     * Compute the size of a UTF-8 string by counting its number of bytes
     * (and not the number of characters composing the string)
     */
    static sizeOfUTF8(s) {
        return s ? new TextEncoder().encode(s).length : 0;
    }
    static toUnit8Array(cmdAndHeaders, binaryBody) {
        const uint8CmdAndHeaders = new TextEncoder().encode(cmdAndHeaders);
        const nullTerminator = new Uint8Array([0]);
        const uint8Frame = new Uint8Array(uint8CmdAndHeaders.length + binaryBody.length + nullTerminator.length);
        uint8Frame.set(uint8CmdAndHeaders);
        uint8Frame.set(binaryBody, uint8CmdAndHeaders.length);
        uint8Frame.set(nullTerminator, uint8CmdAndHeaders.length + binaryBody.length);
        return uint8Frame;
    }
    /**
     * Serialize a STOMP frame as per STOMP standards, suitable to be sent to the STOMP broker.
     *
     * @internal
     */
    static marshall(params) {
        const frame = new FrameImpl(params);
        return frame.serialize();
    }
    /**
     *  Escape header values
     */
    static hdrValueEscape(str) {
        return str
            .replace(/\\/g, '\\\\')
            .replace(/\r/g, '\\r')
            .replace(/\n/g, '\\n')
            .replace(/:/g, '\\c');
    }
    /**
     * UnEscape header values
     */
    static hdrValueUnEscape(str) {
        return str
            .replace(/\\r/g, '\r')
            .replace(/\\n/g, '\n')
            .replace(/\\c/g, ':')
            .replace(/\\\\/g, '\\');
    }
}


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! exports provided: Client, FrameImpl, Parser, StompConfig, StompHeaders, StompSubscription, StompSocketState, ActivationState, Versions, CompatClient, Stomp */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./client */ "./src/client.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Client", function() { return _client__WEBPACK_IMPORTED_MODULE_0__["Client"]; });

/* harmony import */ var _frame_impl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./frame-impl */ "./src/frame-impl.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FrameImpl", function() { return _frame_impl__WEBPACK_IMPORTED_MODULE_1__["FrameImpl"]; });

/* harmony import */ var _parser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./parser */ "./src/parser.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Parser", function() { return _parser__WEBPACK_IMPORTED_MODULE_2__["Parser"]; });

/* harmony import */ var _stomp_config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./stomp-config */ "./src/stomp-config.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "StompConfig", function() { return _stomp_config__WEBPACK_IMPORTED_MODULE_3__["StompConfig"]; });

/* harmony import */ var _stomp_headers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./stomp-headers */ "./src/stomp-headers.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "StompHeaders", function() { return _stomp_headers__WEBPACK_IMPORTED_MODULE_4__["StompHeaders"]; });

/* harmony import */ var _stomp_subscription__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./stomp-subscription */ "./src/stomp-subscription.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "StompSubscription", function() { return _stomp_subscription__WEBPACK_IMPORTED_MODULE_5__["StompSubscription"]; });

/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./types */ "./src/types.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "StompSocketState", function() { return _types__WEBPACK_IMPORTED_MODULE_6__["StompSocketState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ActivationState", function() { return _types__WEBPACK_IMPORTED_MODULE_6__["ActivationState"]; });

/* harmony import */ var _versions__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./versions */ "./src/versions.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Versions", function() { return _versions__WEBPACK_IMPORTED_MODULE_7__["Versions"]; });

/* harmony import */ var _compatibility_compat_client__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./compatibility/compat-client */ "./src/compatibility/compat-client.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CompatClient", function() { return _compatibility_compat_client__WEBPACK_IMPORTED_MODULE_8__["CompatClient"]; });

/* harmony import */ var _compatibility_stomp__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./compatibility/stomp */ "./src/compatibility/stomp.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Stomp", function() { return _compatibility_stomp__WEBPACK_IMPORTED_MODULE_9__["Stomp"]; });









// Compatibility code




/***/ }),

/***/ "./src/parser.ts":
/*!***********************!*\
  !*** ./src/parser.ts ***!
  \***********************/
/*! exports provided: Parser */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Parser", function() { return Parser; });
/**
 * @internal
 */
const NULL = 0;
/**
 * @internal
 */
const LF = 10;
/**
 * @internal
 */
const CR = 13;
/**
 * @internal
 */
const COLON = 58;
/**
 * This is an evented, rec descent parser.
 * A stream of Octets can be passed and whenever it recognizes
 * a complete Frame or an incoming ping it will invoke the registered callbacks.
 *
 * All incoming Octets are fed into _onByte function.
 * Depending on current state the _onByte function keeps changing.
 * Depending on the state it keeps accumulating into _token and _results.
 * State is indicated by current value of _onByte, all states are named as _collect.
 *
 * STOMP standards https://stomp.github.io/stomp-specification-1.2.html
 * imply that all lengths are considered in bytes (instead of string lengths).
 * So, before actual parsing, if the incoming data is String it is converted to Octets.
 * This allows faithful implementation of the protocol and allows NULL Octets to be present in the body.
 *
 * There is no peek function on the incoming data.
 * When a state change occurs based on an Octet without consuming the Octet,
 * the Octet, after state change, is fed again (_reinjectByte).
 * This became possible as the state change can be determined by inspecting just one Octet.
 *
 * There are two modes to collect the body, if content-length header is there then it by counting Octets
 * otherwise it is determined by NULL terminator.
 *
 * Following the standards, the command and headers are converted to Strings
 * and the body is returned as Octets.
 * Headers are returned as an array and not as Hash - to allow multiple occurrence of an header.
 *
 * This parser does not use Regular Expressions as that can only operate on Strings.
 *
 * It handles if multiple STOMP frames are given as one chunk, a frame is split into multiple chunks, or
 * any combination there of. The parser remembers its state (any partial frame) and continues when a new chunk
 * is pushed.
 *
 * Typically the higher level function will convert headers to Hash, handle unescaping of header values
 * (which is protocol version specific), and convert body to text.
 *
 * Check the parser.spec.js to understand cases that this parser is supposed to handle.
 *
 * Part of `@stomp/stompjs`.
 *
 * @internal
 */
class Parser {
    constructor(onFrame, onIncomingPing) {
        this.onFrame = onFrame;
        this.onIncomingPing = onIncomingPing;
        this._encoder = new TextEncoder();
        this._decoder = new TextDecoder();
        this._token = [];
        this._initState();
    }
    parseChunk(segment, appendMissingNULLonIncoming = false) {
        let chunk;
        if (segment instanceof ArrayBuffer) {
            chunk = new Uint8Array(segment);
        }
        else {
            chunk = this._encoder.encode(segment);
        }
        // See https://github.com/stomp-js/stompjs/issues/89
        // Remove when underlying issue is fixed.
        //
        // Send a NULL byte, if the last byte of a Text frame was not NULL.F
        if (appendMissingNULLonIncoming && chunk[chunk.length - 1] !== 0) {
            const chunkWithNull = new Uint8Array(chunk.length + 1);
            chunkWithNull.set(chunk, 0);
            chunkWithNull[chunk.length] = 0;
            chunk = chunkWithNull;
        }
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < chunk.length; i++) {
            const byte = chunk[i];
            this._onByte(byte);
        }
    }
    // The following implements a simple Rec Descent Parser.
    // The grammar is simple and just one byte tells what should be the next state
    _collectFrame(byte) {
        if (byte === NULL) {
            // Ignore
            return;
        }
        if (byte === CR) {
            // Ignore CR
            return;
        }
        if (byte === LF) {
            // Incoming Ping
            this.onIncomingPing();
            return;
        }
        this._onByte = this._collectCommand;
        this._reinjectByte(byte);
    }
    _collectCommand(byte) {
        if (byte === CR) {
            // Ignore CR
            return;
        }
        if (byte === LF) {
            this._results.command = this._consumeTokenAsUTF8();
            this._onByte = this._collectHeaders;
            return;
        }
        this._consumeByte(byte);
    }
    _collectHeaders(byte) {
        if (byte === CR) {
            // Ignore CR
            return;
        }
        if (byte === LF) {
            this._setupCollectBody();
            return;
        }
        this._onByte = this._collectHeaderKey;
        this._reinjectByte(byte);
    }
    _reinjectByte(byte) {
        this._onByte(byte);
    }
    _collectHeaderKey(byte) {
        if (byte === COLON) {
            this._headerKey = this._consumeTokenAsUTF8();
            this._onByte = this._collectHeaderValue;
            return;
        }
        this._consumeByte(byte);
    }
    _collectHeaderValue(byte) {
        if (byte === CR) {
            // Ignore CR
            return;
        }
        if (byte === LF) {
            this._results.headers.push([this._headerKey, this._consumeTokenAsUTF8()]);
            this._headerKey = undefined;
            this._onByte = this._collectHeaders;
            return;
        }
        this._consumeByte(byte);
    }
    _setupCollectBody() {
        const contentLengthHeader = this._results.headers.filter((header) => {
            return header[0] === 'content-length';
        })[0];
        if (contentLengthHeader) {
            this._bodyBytesRemaining = parseInt(contentLengthHeader[1], 10);
            this._onByte = this._collectBodyFixedSize;
        }
        else {
            this._onByte = this._collectBodyNullTerminated;
        }
    }
    _collectBodyNullTerminated(byte) {
        if (byte === NULL) {
            this._retrievedBody();
            return;
        }
        this._consumeByte(byte);
    }
    _collectBodyFixedSize(byte) {
        // It is post decrement, so that we discard the trailing NULL octet
        if (this._bodyBytesRemaining-- === 0) {
            this._retrievedBody();
            return;
        }
        this._consumeByte(byte);
    }
    _retrievedBody() {
        this._results.binaryBody = this._consumeTokenAsRaw();
        this.onFrame(this._results);
        this._initState();
    }
    // Rec Descent Parser helpers
    _consumeByte(byte) {
        this._token.push(byte);
    }
    _consumeTokenAsUTF8() {
        return this._decoder.decode(this._consumeTokenAsRaw());
    }
    _consumeTokenAsRaw() {
        const rawResult = new Uint8Array(this._token);
        this._token = [];
        return rawResult;
    }
    _initState() {
        this._results = {
            command: undefined,
            headers: [],
            binaryBody: undefined,
        };
        this._token = [];
        this._headerKey = undefined;
        this._onByte = this._collectFrame;
    }
}


/***/ }),

/***/ "./src/stomp-config.ts":
/*!*****************************!*\
  !*** ./src/stomp-config.ts ***!
  \*****************************/
/*! exports provided: StompConfig */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StompConfig", function() { return StompConfig; });
/**
 * Configuration options for STOMP Client, each key corresponds to
 * field by the same name in {@link Client}. This can be passed to
 * the constructor of {@link Client} or to [Client#configure]{@link Client#configure}.
 *
 * There used to be a class with the same name in `@stomp/ng2-stompjs`, which has been replaced by
 * {@link RxStompConfig} and {@link InjectableRxStompConfig}.
 *
 * Part of `@stomp/stompjs`.
 */
class StompConfig {
}


/***/ }),

/***/ "./src/stomp-handler.ts":
/*!******************************!*\
  !*** ./src/stomp-handler.ts ***!
  \******************************/
/*! exports provided: StompHandler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StompHandler", function() { return StompHandler; });
/* harmony import */ var _byte__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./byte */ "./src/byte.ts");
/* harmony import */ var _frame_impl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./frame-impl */ "./src/frame-impl.ts");
/* harmony import */ var _parser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./parser */ "./src/parser.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./types */ "./src/types.ts");
/* harmony import */ var _versions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./versions */ "./src/versions.ts");
/* harmony import */ var _augment_websocket__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./augment-websocket */ "./src/augment-websocket.ts");






/**
 * The STOMP protocol handler
 *
 * Part of `@stomp/stompjs`.
 *
 * @internal
 */
class StompHandler {
    constructor(_client, _webSocket, config = {}) {
        this._client = _client;
        this._webSocket = _webSocket;
        this._serverFrameHandlers = {
            // [CONNECTED Frame](http://stomp.github.com/stomp-specification-1.2.html#CONNECTED_Frame)
            CONNECTED: frame => {
                this.debug(`connected to server ${frame.headers.server}`);
                this._connected = true;
                this._connectedVersion = frame.headers.version;
                // STOMP version 1.2 needs header values to be escaped
                if (this._connectedVersion === _versions__WEBPACK_IMPORTED_MODULE_4__["Versions"].V1_2) {
                    this._escapeHeaderValues = true;
                }
                this._setupHeartbeat(frame.headers);
                this.onConnect(frame);
            },
            // [MESSAGE Frame](http://stomp.github.com/stomp-specification-1.2.html#MESSAGE)
            MESSAGE: frame => {
                // the callback is registered when the client calls
                // `subscribe()`.
                // If there is no registered subscription for the received message,
                // the default `onUnhandledMessage` callback is used that the client can set.
                // This is useful for subscriptions that are automatically created
                // on the browser side (e.g. [RabbitMQ's temporary
                // queues](http://www.rabbitmq.com/stomp.html)).
                const subscription = frame.headers.subscription;
                const onReceive = this._subscriptions[subscription] || this.onUnhandledMessage;
                // bless the frame to be a Message
                const message = frame;
                const client = this;
                const messageId = this._connectedVersion === _versions__WEBPACK_IMPORTED_MODULE_4__["Versions"].V1_2
                    ? message.headers.ack
                    : message.headers['message-id'];
                // add `ack()` and `nack()` methods directly to the returned frame
                // so that a simple call to `message.ack()` can acknowledge the message.
                message.ack = (headers = {}) => {
                    return client.ack(messageId, subscription, headers);
                };
                message.nack = (headers = {}) => {
                    return client.nack(messageId, subscription, headers);
                };
                onReceive(message);
            },
            // [RECEIPT Frame](http://stomp.github.com/stomp-specification-1.2.html#RECEIPT)
            RECEIPT: frame => {
                const callback = this._receiptWatchers[frame.headers['receipt-id']];
                if (callback) {
                    callback(frame);
                    // Server will acknowledge only once, remove the callback
                    delete this._receiptWatchers[frame.headers['receipt-id']];
                }
                else {
                    this.onUnhandledReceipt(frame);
                }
            },
            // [ERROR Frame](http://stomp.github.com/stomp-specification-1.2.html#ERROR)
            ERROR: frame => {
                this.onStompError(frame);
            },
        };
        // used to index subscribers
        this._counter = 0;
        // subscription callbacks indexed by subscriber's ID
        this._subscriptions = {};
        // receipt-watchers indexed by receipts-ids
        this._receiptWatchers = {};
        this._partialData = '';
        this._escapeHeaderValues = false;
        this._lastServerActivityTS = Date.now();
        this.configure(config);
    }
    get connectedVersion() {
        return this._connectedVersion;
    }
    get connected() {
        return this._connected;
    }
    configure(conf) {
        // bulk assign all properties to this
        Object.assign(this, conf);
    }
    start() {
        const parser = new _parser__WEBPACK_IMPORTED_MODULE_2__["Parser"](
        // On Frame
        rawFrame => {
            const frame = _frame_impl__WEBPACK_IMPORTED_MODULE_1__["FrameImpl"].fromRawFrame(rawFrame, this._escapeHeaderValues);
            // if this.logRawCommunication is set, the rawChunk is logged at this._webSocket.onmessage
            if (!this.logRawCommunication) {
                this.debug(`<<< ${frame}`);
            }
            const serverFrameHandler = this._serverFrameHandlers[frame.command] || this.onUnhandledFrame;
            serverFrameHandler(frame);
        }, 
        // On Incoming Ping
        () => {
            this.debug('<<< PONG');
        });
        this._webSocket.onmessage = (evt) => {
            this.debug('Received data');
            this._lastServerActivityTS = Date.now();
            if (this.logRawCommunication) {
                const rawChunkAsString = evt.data instanceof ArrayBuffer
                    ? new TextDecoder().decode(evt.data)
                    : evt.data;
                this.debug(`<<< ${rawChunkAsString}`);
            }
            parser.parseChunk(evt.data, this.appendMissingNULLonIncoming);
        };
        this._onclose = (closeEvent) => {
            this.debug(`Connection closed to ${this._client.brokerURL}`);
            this._cleanUp();
            this.onWebSocketClose(closeEvent);
        };
        this._webSocket.onclose = this._onclose;
        this._webSocket.onerror = (errorEvent) => {
            this.onWebSocketError(errorEvent);
        };
        this._webSocket.onopen = () => {
            // Clone before updating
            const connectHeaders = Object.assign({}, this.connectHeaders);
            this.debug('Web Socket Opened...');
            connectHeaders['accept-version'] = this.stompVersions.supportedVersions();
            connectHeaders['heart-beat'] = [
                this.heartbeatOutgoing,
                this.heartbeatIncoming,
            ].join(',');
            this._transmit({ command: 'CONNECT', headers: connectHeaders });
        };
    }
    _setupHeartbeat(headers) {
        if (headers.version !== _versions__WEBPACK_IMPORTED_MODULE_4__["Versions"].V1_1 &&
            headers.version !== _versions__WEBPACK_IMPORTED_MODULE_4__["Versions"].V1_2) {
            return;
        }
        // It is valid for the server to not send this header
        // https://stomp.github.io/stomp-specification-1.2.html#Heart-beating
        if (!headers['heart-beat']) {
            return;
        }
        // heart-beat header received from the server looks like:
        //
        //     heart-beat: sx, sy
        const [serverOutgoing, serverIncoming] = headers['heart-beat']
            .split(',')
            .map((v) => parseInt(v, 10));
        if (this.heartbeatOutgoing !== 0 && serverIncoming !== 0) {
            const ttl = Math.max(this.heartbeatOutgoing, serverIncoming);
            this.debug(`send PING every ${ttl}ms`);
            this._pinger = setInterval(() => {
                if (this._webSocket.readyState === _types__WEBPACK_IMPORTED_MODULE_3__["StompSocketState"].OPEN) {
                    this._webSocket.send(_byte__WEBPACK_IMPORTED_MODULE_0__["BYTE"].LF);
                    this.debug('>>> PING');
                }
            }, ttl);
        }
        if (this.heartbeatIncoming !== 0 && serverOutgoing !== 0) {
            const ttl = Math.max(this.heartbeatIncoming, serverOutgoing);
            this.debug(`check PONG every ${ttl}ms`);
            this._ponger = setInterval(() => {
                const delta = Date.now() - this._lastServerActivityTS;
                // We wait twice the TTL to be flexible on window's setInterval calls
                if (delta > ttl * 2) {
                    this.debug(`did not receive server activity for the last ${delta}ms`);
                    this._closeOrDiscardWebsocket();
                }
            }, ttl);
        }
    }
    _closeOrDiscardWebsocket() {
        if (this.discardWebsocketOnCommFailure) {
            this.debug('Discarding websocket, the underlying socket may linger for a while');
            this._discardWebsocket();
        }
        else {
            this.debug('Issuing close on the websocket');
            this._closeWebsocket();
        }
    }
    forceDisconnect() {
        if (this._webSocket) {
            if (this._webSocket.readyState === _types__WEBPACK_IMPORTED_MODULE_3__["StompSocketState"].CONNECTING ||
                this._webSocket.readyState === _types__WEBPACK_IMPORTED_MODULE_3__["StompSocketState"].OPEN) {
                this._closeOrDiscardWebsocket();
            }
        }
    }
    _closeWebsocket() {
        this._webSocket.onmessage = () => { }; // ignore messages
        this._webSocket.close();
    }
    _discardWebsocket() {
        if (!this._webSocket.terminate) {
            Object(_augment_websocket__WEBPACK_IMPORTED_MODULE_5__["augmentWebsocket"])(this._webSocket, (msg) => this.debug(msg));
        }
        this._webSocket.terminate();
    }
    _transmit(params) {
        const { command, headers, body, binaryBody, skipContentLengthHeader } = params;
        const frame = new _frame_impl__WEBPACK_IMPORTED_MODULE_1__["FrameImpl"]({
            command,
            headers,
            body,
            binaryBody,
            escapeHeaderValues: this._escapeHeaderValues,
            skipContentLengthHeader,
        });
        let rawChunk = frame.serialize();
        if (this.logRawCommunication) {
            this.debug(`>>> ${rawChunk}`);
        }
        else {
            this.debug(`>>> ${frame}`);
        }
        if (this.forceBinaryWSFrames && typeof rawChunk === 'string') {
            rawChunk = new TextEncoder().encode(rawChunk);
        }
        if (typeof rawChunk !== 'string' || !this.splitLargeFrames) {
            this._webSocket.send(rawChunk);
        }
        else {
            let out = rawChunk;
            while (out.length > 0) {
                const chunk = out.substring(0, this.maxWebSocketChunkSize);
                out = out.substring(this.maxWebSocketChunkSize);
                this._webSocket.send(chunk);
                this.debug(`chunk sent = ${chunk.length}, remaining = ${out.length}`);
            }
        }
    }
    dispose() {
        if (this.connected) {
            try {
                // clone before updating
                const disconnectHeaders = Object.assign({}, this.disconnectHeaders);
                if (!disconnectHeaders.receipt) {
                    disconnectHeaders.receipt = `close-${this._counter++}`;
                }
                this.watchForReceipt(disconnectHeaders.receipt, frame => {
                    this._closeWebsocket();
                    this._cleanUp();
                    this.onDisconnect(frame);
                });
                this._transmit({ command: 'DISCONNECT', headers: disconnectHeaders });
            }
            catch (error) {
                this.debug(`Ignoring error during disconnect ${error}`);
            }
        }
        else {
            if (this._webSocket.readyState === _types__WEBPACK_IMPORTED_MODULE_3__["StompSocketState"].CONNECTING ||
                this._webSocket.readyState === _types__WEBPACK_IMPORTED_MODULE_3__["StompSocketState"].OPEN) {
                this._closeWebsocket();
            }
        }
    }
    _cleanUp() {
        this._connected = false;
        if (this._pinger) {
            clearInterval(this._pinger);
        }
        if (this._ponger) {
            clearInterval(this._ponger);
        }
    }
    publish(params) {
        const { destination, headers, body, binaryBody, skipContentLengthHeader } = params;
        const hdrs = Object.assign({ destination }, headers);
        this._transmit({
            command: 'SEND',
            headers: hdrs,
            body,
            binaryBody,
            skipContentLengthHeader,
        });
    }
    watchForReceipt(receiptId, callback) {
        this._receiptWatchers[receiptId] = callback;
    }
    subscribe(destination, callback, headers = {}) {
        headers = Object.assign({}, headers);
        if (!headers.id) {
            headers.id = `sub-${this._counter++}`;
        }
        headers.destination = destination;
        this._subscriptions[headers.id] = callback;
        this._transmit({ command: 'SUBSCRIBE', headers });
        const client = this;
        return {
            id: headers.id,
            unsubscribe(hdrs) {
                return client.unsubscribe(headers.id, hdrs);
            },
        };
    }
    unsubscribe(id, headers = {}) {
        headers = Object.assign({}, headers);
        delete this._subscriptions[id];
        headers.id = id;
        this._transmit({ command: 'UNSUBSCRIBE', headers });
    }
    begin(transactionId) {
        const txId = transactionId || `tx-${this._counter++}`;
        this._transmit({
            command: 'BEGIN',
            headers: {
                transaction: txId,
            },
        });
        const client = this;
        return {
            id: txId,
            commit() {
                client.commit(txId);
            },
            abort() {
                client.abort(txId);
            },
        };
    }
    commit(transactionId) {
        this._transmit({
            command: 'COMMIT',
            headers: {
                transaction: transactionId,
            },
        });
    }
    abort(transactionId) {
        this._transmit({
            command: 'ABORT',
            headers: {
                transaction: transactionId,
            },
        });
    }
    ack(messageId, subscriptionId, headers = {}) {
        headers = Object.assign({}, headers);
        if (this._connectedVersion === _versions__WEBPACK_IMPORTED_MODULE_4__["Versions"].V1_2) {
            headers.id = messageId;
        }
        else {
            headers['message-id'] = messageId;
        }
        headers.subscription = subscriptionId;
        this._transmit({ command: 'ACK', headers });
    }
    nack(messageId, subscriptionId, headers = {}) {
        headers = Object.assign({}, headers);
        if (this._connectedVersion === _versions__WEBPACK_IMPORTED_MODULE_4__["Versions"].V1_2) {
            headers.id = messageId;
        }
        else {
            headers['message-id'] = messageId;
        }
        headers.subscription = subscriptionId;
        return this._transmit({ command: 'NACK', headers });
    }
}


/***/ }),

/***/ "./src/stomp-headers.ts":
/*!******************************!*\
  !*** ./src/stomp-headers.ts ***!
  \******************************/
/*! exports provided: StompHeaders */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StompHeaders", function() { return StompHeaders; });
/**
 * STOMP headers. Many functions calls will accept headers as parameters.
 * The headers sent by Broker will be available as [IFrame#headers]{@link IFrame#headers}.
 *
 * `key` and `value` must be valid strings.
 * In addition, `key` must not contain `CR`, `LF`, or `:`.
 *
 * Part of `@stomp/stompjs`.
 */
class StompHeaders {
}


/***/ }),

/***/ "./src/stomp-subscription.ts":
/*!***********************************!*\
  !*** ./src/stomp-subscription.ts ***!
  \***********************************/
/*! exports provided: StompSubscription */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StompSubscription", function() { return StompSubscription; });
/**
 * Call [Client#subscribe]{@link Client#subscribe} to create a StompSubscription.
 *
 * Part of `@stomp/stompjs`.
 */
class StompSubscription {
}


/***/ }),

/***/ "./src/types.ts":
/*!**********************!*\
  !*** ./src/types.ts ***!
  \**********************/
/*! exports provided: StompSocketState, ActivationState */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StompSocketState", function() { return StompSocketState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ActivationState", function() { return ActivationState; });
/**
 * Possible states for the IStompSocket
 */
var StompSocketState;
(function (StompSocketState) {
    StompSocketState[StompSocketState["CONNECTING"] = 0] = "CONNECTING";
    StompSocketState[StompSocketState["OPEN"] = 1] = "OPEN";
    StompSocketState[StompSocketState["CLOSING"] = 2] = "CLOSING";
    StompSocketState[StompSocketState["CLOSED"] = 3] = "CLOSED";
})(StompSocketState || (StompSocketState = {}));
/**
 * Possible activation state
 */
var ActivationState;
(function (ActivationState) {
    ActivationState[ActivationState["ACTIVE"] = 0] = "ACTIVE";
    ActivationState[ActivationState["DEACTIVATING"] = 1] = "DEACTIVATING";
    ActivationState[ActivationState["INACTIVE"] = 2] = "INACTIVE";
})(ActivationState || (ActivationState = {}));


/***/ }),

/***/ "./src/versions.ts":
/*!*************************!*\
  !*** ./src/versions.ts ***!
  \*************************/
/*! exports provided: Versions */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Versions", function() { return Versions; });
/**
 * Supported STOMP versions
 *
 * Part of `@stomp/stompjs`.
 */
class Versions {
    /**
     * Takes an array of string of versions, typical elements '1.0', '1.1', or '1.2'
     *
     * You will an instance if this class if you want to override supported versions to be declared during
     * STOMP handshake.
     */
    constructor(versions) {
        this.versions = versions;
    }
    /**
     * Used as part of CONNECT STOMP Frame
     */
    supportedVersions() {
        return this.versions.join(',');
    }
    /**
     * Used while creating a WebSocket
     */
    protocolVersions() {
        return this.versions.map(x => `v${x.replace('.', '')}.stomp`);
    }
}
/**
 * Indicates protocol version 1.0
 */
Versions.V1_0 = '1.0';
/**
 * Indicates protocol version 1.1
 */
Versions.V1_1 = '1.1';
/**
 * Indicates protocol version 1.2
 */
Versions.V1_2 = '1.2';
/**
 * @internal
 */
Versions.default = new Versions([
    Versions.V1_0,
    Versions.V1_1,
    Versions.V1_2,
]);


/***/ }),

/***/ 0:
/*!****************************!*\
  !*** multi ./src/index.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /home/kdeepak/MyWork/Tech/stomp/stompjs/src/index.ts */"./src/index.ts");


/***/ })

/******/ });
});

},{}],19:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}

},{}],20:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],21:[function(require,module,exports){
'use strict';

var has = Object.prototype.hasOwnProperty
  , undef;

/**
 * Decode a URI encoded string.
 *
 * @param {String} input The URI encoded string.
 * @returns {String|Null} The decoded string.
 * @api private
 */
function decode(input) {
  try {
    return decodeURIComponent(input.replace(/\+/g, ' '));
  } catch (e) {
    return null;
  }
}

/**
 * Attempts to encode a given input.
 *
 * @param {String} input The string that needs to be encoded.
 * @returns {String|Null} The encoded string.
 * @api private
 */
function encode(input) {
  try {
    return encodeURIComponent(input);
  } catch (e) {
    return null;
  }
}

/**
 * Simple query string parser.
 *
 * @param {String} query The query string that needs to be parsed.
 * @returns {Object}
 * @api public
 */
function querystring(query) {
  var parser = /([^=?#&]+)=?([^&]*)/g
    , result = {}
    , part;

  while (part = parser.exec(query)) {
    var key = decode(part[1])
      , value = decode(part[2]);

    //
    // Prevent overriding of existing properties. This ensures that build-in
    // methods like `toString` or __proto__ are not overriden by malicious
    // querystrings.
    //
    // In the case if failed decoding, we want to omit the key/value pairs
    // from the result.
    //
    if (key === null || value === null || key in result) continue;
    result[key] = value;
  }

  return result;
}

/**
 * Transform a query string to an object.
 *
 * @param {Object} obj Object that should be transformed.
 * @param {String} prefix Optional prefix.
 * @returns {String}
 * @api public
 */
function querystringify(obj, prefix) {
  prefix = prefix || '';

  var pairs = []
    , value
    , key;

  //
  // Optionally prefix with a '?' if needed
  //
  if ('string' !== typeof prefix) prefix = '?';

  for (key in obj) {
    if (has.call(obj, key)) {
      value = obj[key];

      //
      // Edge cases where we actually want to encode the value to an empty
      // string instead of the stringified value.
      //
      if (!value && (value === null || value === undef || isNaN(value))) {
        value = '';
      }

      key = encode(key);
      value = encode(value);

      //
      // If we failed to encode the strings, we should bail out as we don't
      // want to add invalid strings to the query.
      //
      if (key === null || value === null) continue;
      pairs.push(key +'='+ value);
    }
  }

  return pairs.length ? prefix + pairs.join('&') : '';
}

//
// Expose the module.
//
exports.stringify = querystringify;
exports.parse = querystring;

},{}],22:[function(require,module,exports){
'use strict';

/**
 * Check if we're required to add a port number.
 *
 * @see https://url.spec.whatwg.org/#default-port
 * @param {Number|String} port Port number we need to check
 * @param {String} protocol Protocol we need to check against.
 * @returns {Boolean} Is it a default port for the given protocol
 * @api private
 */
module.exports = function required(port, protocol) {
  protocol = protocol.split(':')[0];
  port = +port;

  if (!port) return false;

  switch (protocol) {
    case 'http':
    case 'ws':
    return port !== 80;

    case 'https':
    case 'wss':
    return port !== 443;

    case 'ftp':
    return port !== 21;

    case 'gopher':
    return port !== 70;

    case 'file':
    return false;
  }

  return port !== 0;
};

},{}],23:[function(require,module,exports){
(function (global){(function (){
'use strict';

var transportList = require('./transport-list');

module.exports = require('./main')(transportList);

// TODO can't get rid of this until all servers do
if ('_sockjs_onload' in global) {
  setTimeout(global._sockjs_onload, 1);
}

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./main":36,"./transport-list":38}],24:[function(require,module,exports){
'use strict';

var inherits = require('inherits')
  , Event = require('./event')
  ;

function CloseEvent() {
  Event.call(this);
  this.initEvent('close', false, false);
  this.wasClean = false;
  this.code = 0;
  this.reason = '';
}

inherits(CloseEvent, Event);

module.exports = CloseEvent;

},{"./event":26,"inherits":19}],25:[function(require,module,exports){
'use strict';

var inherits = require('inherits')
  , EventTarget = require('./eventtarget')
  ;

function EventEmitter() {
  EventTarget.call(this);
}

inherits(EventEmitter, EventTarget);

EventEmitter.prototype.removeAllListeners = function(type) {
  if (type) {
    delete this._listeners[type];
  } else {
    this._listeners = {};
  }
};

EventEmitter.prototype.once = function(type, listener) {
  var self = this
    , fired = false;

  function g() {
    self.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  this.on(type, g);
};

EventEmitter.prototype.emit = function() {
  var type = arguments[0];
  var listeners = this._listeners[type];
  if (!listeners) {
    return;
  }
  // equivalent of Array.prototype.slice.call(arguments, 1);
  var l = arguments.length;
  var args = new Array(l - 1);
  for (var ai = 1; ai < l; ai++) {
    args[ai - 1] = arguments[ai];
  }
  for (var i = 0; i < listeners.length; i++) {
    listeners[i].apply(this, args);
  }
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener = EventTarget.prototype.addEventListener;
EventEmitter.prototype.removeListener = EventTarget.prototype.removeEventListener;

module.exports.EventEmitter = EventEmitter;

},{"./eventtarget":27,"inherits":19}],26:[function(require,module,exports){
'use strict';

function Event(eventType) {
  this.type = eventType;
}

Event.prototype.initEvent = function(eventType, canBubble, cancelable) {
  this.type = eventType;
  this.bubbles = canBubble;
  this.cancelable = cancelable;
  this.timeStamp = +new Date();
  return this;
};

Event.prototype.stopPropagation = function() {};
Event.prototype.preventDefault = function() {};

Event.CAPTURING_PHASE = 1;
Event.AT_TARGET = 2;
Event.BUBBLING_PHASE = 3;

module.exports = Event;

},{}],27:[function(require,module,exports){
'use strict';

/* Simplified implementation of DOM2 EventTarget.
 *   http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget
 */

function EventTarget() {
  this._listeners = {};
}

EventTarget.prototype.addEventListener = function(eventType, listener) {
  if (!(eventType in this._listeners)) {
    this._listeners[eventType] = [];
  }
  var arr = this._listeners[eventType];
  // #4
  if (arr.indexOf(listener) === -1) {
    // Make a copy so as not to interfere with a current dispatchEvent.
    arr = arr.concat([listener]);
  }
  this._listeners[eventType] = arr;
};

EventTarget.prototype.removeEventListener = function(eventType, listener) {
  var arr = this._listeners[eventType];
  if (!arr) {
    return;
  }
  var idx = arr.indexOf(listener);
  if (idx !== -1) {
    if (arr.length > 1) {
      // Make a copy so as not to interfere with a current dispatchEvent.
      this._listeners[eventType] = arr.slice(0, idx).concat(arr.slice(idx + 1));
    } else {
      delete this._listeners[eventType];
    }
    return;
  }
};

EventTarget.prototype.dispatchEvent = function() {
  var event = arguments[0];
  var t = event.type;
  // equivalent of Array.prototype.slice.call(arguments, 0);
  var args = arguments.length === 1 ? [event] : Array.apply(null, arguments);
  // TODO: This doesn't match the real behavior; per spec, onfoo get
  // their place in line from the /first/ time they're set from
  // non-null. Although WebKit bumps it to the end every time it's
  // set.
  if (this['on' + t]) {
    this['on' + t].apply(this, args);
  }
  if (t in this._listeners) {
    // Grab a reference to the listeners list. removeEventListener may alter the list.
    var listeners = this._listeners[t];
    for (var i = 0; i < listeners.length; i++) {
      listeners[i].apply(this, args);
    }
  }
};

module.exports = EventTarget;

},{}],28:[function(require,module,exports){
'use strict';

var inherits = require('inherits')
  , Event = require('./event')
  ;

function TransportMessageEvent(data) {
  Event.call(this);
  this.initEvent('message', false, false);
  this.data = data;
}

inherits(TransportMessageEvent, Event);

module.exports = TransportMessageEvent;

},{"./event":26,"inherits":19}],29:[function(require,module,exports){
'use strict';

var iframeUtils = require('./utils/iframe')
  ;

function FacadeJS(transport) {
  this._transport = transport;
  transport.on('message', this._transportMessage.bind(this));
  transport.on('close', this._transportClose.bind(this));
}

FacadeJS.prototype._transportClose = function(code, reason) {
  iframeUtils.postMessage('c', JSON.stringify([code, reason]));
};
FacadeJS.prototype._transportMessage = function(frame) {
  iframeUtils.postMessage('t', frame);
};
FacadeJS.prototype._send = function(data) {
  this._transport.send(data);
};
FacadeJS.prototype._close = function() {
  this._transport.close();
  this._transport.removeAllListeners();
};

module.exports = FacadeJS;

},{"./utils/iframe":69}],30:[function(require,module,exports){
(function (process){(function (){
'use strict';

var urlUtils = require('./utils/url')
  , eventUtils = require('./utils/event')
  , FacadeJS = require('./facade')
  , InfoIframeReceiver = require('./info-iframe-receiver')
  , iframeUtils = require('./utils/iframe')
  , loc = require('./location')
  ;

var debug = function() {};
if (process.env.NODE_ENV !== 'production') {
  debug = require('debug')('sockjs-client:iframe-bootstrap');
}

module.exports = function(SockJS, availableTransports) {
  var transportMap = {};
  availableTransports.forEach(function(at) {
    if (at.facadeTransport) {
      transportMap[at.facadeTransport.transportName] = at.facadeTransport;
    }
  });

  // hard-coded for the info iframe
  // TODO see if we can make this more dynamic
  transportMap[InfoIframeReceiver.transportName] = InfoIframeReceiver;
  var parentOrigin;

  /* eslint-disable camelcase */
  SockJS.bootstrap_iframe = function() {
    /* eslint-enable camelcase */
    var facade;
    iframeUtils.currentWindowId = loc.hash.slice(1);
    var onMessage = function(e) {
      if (e.source !== parent) {
        return;
      }
      if (typeof parentOrigin === 'undefined') {
        parentOrigin = e.origin;
      }
      if (e.origin !== parentOrigin) {
        return;
      }

      var iframeMessage;
      try {
        iframeMessage = JSON.parse(e.data);
      } catch (ignored) {
        debug('bad json', e.data);
        return;
      }

      if (iframeMessage.windowId !== iframeUtils.currentWindowId) {
        return;
      }
      switch (iframeMessage.type) {
      case 's':
        var p;
        try {
          p = JSON.parse(iframeMessage.data);
        } catch (ignored) {
          debug('bad json', iframeMessage.data);
          break;
        }
        var version = p[0];
        var transport = p[1];
        var transUrl = p[2];
        var baseUrl = p[3];
        debug(version, transport, transUrl, baseUrl);
        // change this to semver logic
        if (version !== SockJS.version) {
          throw new Error('Incompatible SockJS! Main site uses:' +
                    ' "' + version + '", the iframe:' +
                    ' "' + SockJS.version + '".');
        }

        if (!urlUtils.isOriginEqual(transUrl, loc.href) ||
            !urlUtils.isOriginEqual(baseUrl, loc.href)) {
          throw new Error('Can\'t connect to different domain from within an ' +
                    'iframe. (' + loc.href + ', ' + transUrl + ', ' + baseUrl + ')');
        }
        facade = new FacadeJS(new transportMap[transport](transUrl, baseUrl));
        break;
      case 'm':
        facade._send(iframeMessage.data);
        break;
      case 'c':
        if (facade) {
          facade._close();
        }
        facade = null;
        break;
      }
    };

    eventUtils.attachEvent('message', onMessage);

    // Start
    iframeUtils.postMessage('s');
  };
};

}).call(this)}).call(this,require('_process'))

},{"./facade":29,"./info-iframe-receiver":32,"./location":35,"./utils/event":68,"./utils/iframe":69,"./utils/url":74,"_process":20,"debug":76}],31:[function(require,module,exports){
(function (process){(function (){
'use strict';

var EventEmitter = require('events').EventEmitter
  , inherits = require('inherits')
  , objectUtils = require('./utils/object')
  ;

var debug = function() {};
if (process.env.NODE_ENV !== 'production') {
  debug = require('debug')('sockjs-client:info-ajax');
}

function InfoAjax(url, AjaxObject) {
  EventEmitter.call(this);

  var self = this;
  var t0 = +new Date();
  this.xo = new AjaxObject('GET', url);

  this.xo.once('finish', function(status, text) {
    var info, rtt;
    if (status === 200) {
      rtt = (+new Date()) - t0;
      if (text) {
        try {
          info = JSON.parse(text);
        } catch (e) {
          debug('bad json', text);
        }
      }

      if (!objectUtils.isObject(info)) {
        info = {};
      }
    }
    self.emit('finish', info, rtt);
    self.removeAllListeners();
  });
}

inherits(InfoAjax, EventEmitter);

InfoAjax.prototype.close = function() {
  this.removeAllListeners();
  this.xo.close();
};

module.exports = InfoAjax;

}).call(this)}).call(this,require('_process'))

},{"./utils/object":71,"_process":20,"debug":76,"events":25,"inherits":19}],32:[function(require,module,exports){
'use strict';

var inherits = require('inherits')
  , EventEmitter = require('events').EventEmitter
  , XHRLocalObject = require('./transport/sender/xhr-local')
  , InfoAjax = require('./info-ajax')
  ;

function InfoReceiverIframe(transUrl) {
  var self = this;
  EventEmitter.call(this);

  this.ir = new InfoAjax(transUrl, XHRLocalObject);
  this.ir.once('finish', function(info, rtt) {
    self.ir = null;
    self.emit('message', JSON.stringify([info, rtt]));
  });
}

inherits(InfoReceiverIframe, EventEmitter);

InfoReceiverIframe.transportName = 'iframe-info-receiver';

InfoReceiverIframe.prototype.close = function() {
  if (this.ir) {
    this.ir.close();
    this.ir = null;
  }
  this.removeAllListeners();
};

module.exports = InfoReceiverIframe;

},{"./info-ajax":31,"./transport/sender/xhr-local":59,"events":25,"inherits":19}],33:[function(require,module,exports){
(function (process,global){(function (){
'use strict';

var EventEmitter = require('events').EventEmitter
  , inherits = require('inherits')
  , utils = require('./utils/event')
  , IframeTransport = require('./transport/iframe')
  , InfoReceiverIframe = require('./info-iframe-receiver')
  ;

var debug = function() {};
if (process.env.NODE_ENV !== 'production') {
  debug = require('debug')('sockjs-client:info-iframe');
}

function InfoIframe(baseUrl, url) {
  var self = this;
  EventEmitter.call(this);

  var go = function() {
    var ifr = self.ifr = new IframeTransport(InfoReceiverIframe.transportName, url, baseUrl);

    ifr.once('message', function(msg) {
      if (msg) {
        var d;
        try {
          d = JSON.parse(msg);
        } catch (e) {
          debug('bad json', msg);
          self.emit('finish');
          self.close();
          return;
        }

        var info = d[0], rtt = d[1];
        self.emit('finish', info, rtt);
      }
      self.close();
    });

    ifr.once('close', function() {
      self.emit('finish');
      self.close();
    });
  };

  // TODO this seems the same as the 'needBody' from transports
  if (!global.document.body) {
    utils.attachEvent('load', go);
  } else {
    go();
  }
}

inherits(InfoIframe, EventEmitter);

InfoIframe.enabled = function() {
  return IframeTransport.enabled();
};

InfoIframe.prototype.close = function() {
  if (this.ifr) {
    this.ifr.close();
  }
  this.removeAllListeners();
  this.ifr = null;
};

module.exports = InfoIframe;

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./info-iframe-receiver":32,"./transport/iframe":44,"./utils/event":68,"_process":20,"debug":76,"events":25,"inherits":19}],34:[function(require,module,exports){
(function (process){(function (){
'use strict';

var EventEmitter = require('events').EventEmitter
  , inherits = require('inherits')
  , urlUtils = require('./utils/url')
  , XDR = require('./transport/sender/xdr')
  , XHRCors = require('./transport/sender/xhr-cors')
  , XHRLocal = require('./transport/sender/xhr-local')
  , XHRFake = require('./transport/sender/xhr-fake')
  , InfoIframe = require('./info-iframe')
  , InfoAjax = require('./info-ajax')
  ;

var debug = function() {};
if (process.env.NODE_ENV !== 'production') {
  debug = require('debug')('sockjs-client:info-receiver');
}

function InfoReceiver(baseUrl, urlInfo) {
  debug(baseUrl);
  var self = this;
  EventEmitter.call(this);

  setTimeout(function() {
    self.doXhr(baseUrl, urlInfo);
  }, 0);
}

inherits(InfoReceiver, EventEmitter);

// TODO this is currently ignoring the list of available transports and the whitelist

InfoReceiver._getReceiver = function(baseUrl, url, urlInfo) {
  // determine method of CORS support (if needed)
  if (urlInfo.sameOrigin) {
    return new InfoAjax(url, XHRLocal);
  }
  if (XHRCors.enabled) {
    return new InfoAjax(url, XHRCors);
  }
  if (XDR.enabled && urlInfo.sameScheme) {
    return new InfoAjax(url, XDR);
  }
  if (InfoIframe.enabled()) {
    return new InfoIframe(baseUrl, url);
  }
  return new InfoAjax(url, XHRFake);
};

InfoReceiver.prototype.doXhr = function(baseUrl, urlInfo) {
  var self = this
    , url = urlUtils.addPath(baseUrl, '/info')
    ;
  debug('doXhr', url);

  this.xo = InfoReceiver._getReceiver(baseUrl, url, urlInfo);

  this.timeoutRef = setTimeout(function() {
    debug('timeout');
    self._cleanup(false);
    self.emit('finish');
  }, InfoReceiver.timeout);

  this.xo.once('finish', function(info, rtt) {
    debug('finish', info, rtt);
    self._cleanup(true);
    self.emit('finish', info, rtt);
  });
};

InfoReceiver.prototype._cleanup = function(wasClean) {
  debug('_cleanup');
  clearTimeout(this.timeoutRef);
  this.timeoutRef = null;
  if (!wasClean && this.xo) {
    this.xo.close();
  }
  this.xo = null;
};

InfoReceiver.prototype.close = function() {
  debug('close');
  this.removeAllListeners();
  this._cleanup(false);
};

InfoReceiver.timeout = 8000;

module.exports = InfoReceiver;

}).call(this)}).call(this,require('_process'))

},{"./info-ajax":31,"./info-iframe":33,"./transport/sender/xdr":56,"./transport/sender/xhr-cors":57,"./transport/sender/xhr-fake":58,"./transport/sender/xhr-local":59,"./utils/url":74,"_process":20,"debug":76,"events":25,"inherits":19}],35:[function(require,module,exports){
(function (global){(function (){
'use strict';

module.exports = global.location || {
  origin: 'http://localhost:80'
, protocol: 'http:'
, host: 'localhost'
, port: 80
, href: 'http://localhost/'
, hash: ''
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],36:[function(require,module,exports){
(function (process,global){(function (){
'use strict';

require('./shims');

var URL = require('url-parse')
  , inherits = require('inherits')
  , random = require('./utils/random')
  , escape = require('./utils/escape')
  , urlUtils = require('./utils/url')
  , eventUtils = require('./utils/event')
  , transport = require('./utils/transport')
  , objectUtils = require('./utils/object')
  , browser = require('./utils/browser')
  , log = require('./utils/log')
  , Event = require('./event/event')
  , EventTarget = require('./event/eventtarget')
  , loc = require('./location')
  , CloseEvent = require('./event/close')
  , TransportMessageEvent = require('./event/trans-message')
  , InfoReceiver = require('./info-receiver')
  ;

var debug = function() {};
if (process.env.NODE_ENV !== 'production') {
  debug = require('debug')('sockjs-client:main');
}

var transports;

// follow constructor steps defined at http://dev.w3.org/html5/websockets/#the-websocket-interface
function SockJS(url, protocols, options) {
  if (!(this instanceof SockJS)) {
    return new SockJS(url, protocols, options);
  }
  if (arguments.length < 1) {
    throw new TypeError("Failed to construct 'SockJS: 1 argument required, but only 0 present");
  }
  EventTarget.call(this);

  this.readyState = SockJS.CONNECTING;
  this.extensions = '';
  this.protocol = '';

  // non-standard extension
  options = options || {};
  if (options.protocols_whitelist) {
    log.warn("'protocols_whitelist' is DEPRECATED. Use 'transports' instead.");
  }
  this._transportsWhitelist = options.transports;
  this._transportOptions = options.transportOptions || {};
  this._timeout = options.timeout || 0;

  var sessionId = options.sessionId || 8;
  if (typeof sessionId === 'function') {
    this._generateSessionId = sessionId;
  } else if (typeof sessionId === 'number') {
    this._generateSessionId = function() {
      return random.string(sessionId);
    };
  } else {
    throw new TypeError('If sessionId is used in the options, it needs to be a number or a function.');
  }

  this._server = options.server || random.numberString(1000);

  // Step 1 of WS spec - parse and validate the url. Issue #8
  var parsedUrl = new URL(url);
  if (!parsedUrl.host || !parsedUrl.protocol) {
    throw new SyntaxError("The URL '" + url + "' is invalid");
  } else if (parsedUrl.hash) {
    throw new SyntaxError('The URL must not contain a fragment');
  } else if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw new SyntaxError("The URL's scheme must be either 'http:' or 'https:'. '" + parsedUrl.protocol + "' is not allowed.");
  }

  var secure = parsedUrl.protocol === 'https:';
  // Step 2 - don't allow secure origin with an insecure protocol
  if (loc.protocol === 'https:' && !secure) {
    // exception is 127.0.0.0/8 and ::1 urls
    if (!urlUtils.isLoopbackAddr(parsedUrl.hostname)) {
      throw new Error('SecurityError: An insecure SockJS connection may not be initiated from a page loaded over HTTPS');
    }
  }

  // Step 3 - check port access - no need here
  // Step 4 - parse protocols argument
  if (!protocols) {
    protocols = [];
  } else if (!Array.isArray(protocols)) {
    protocols = [protocols];
  }

  // Step 5 - check protocols argument
  var sortedProtocols = protocols.sort();
  sortedProtocols.forEach(function(proto, i) {
    if (!proto) {
      throw new SyntaxError("The protocols entry '" + proto + "' is invalid.");
    }
    if (i < (sortedProtocols.length - 1) && proto === sortedProtocols[i + 1]) {
      throw new SyntaxError("The protocols entry '" + proto + "' is duplicated.");
    }
  });

  // Step 6 - convert origin
  var o = urlUtils.getOrigin(loc.href);
  this._origin = o ? o.toLowerCase() : null;

  // remove the trailing slash
  parsedUrl.set('pathname', parsedUrl.pathname.replace(/\/+$/, ''));

  // store the sanitized url
  this.url = parsedUrl.href;
  debug('using url', this.url);

  // Step 7 - start connection in background
  // obtain server info
  // http://sockjs.github.io/sockjs-protocol/sockjs-protocol-0.3.3.html#section-26
  this._urlInfo = {
    nullOrigin: !browser.hasDomain()
  , sameOrigin: urlUtils.isOriginEqual(this.url, loc.href)
  , sameScheme: urlUtils.isSchemeEqual(this.url, loc.href)
  };

  this._ir = new InfoReceiver(this.url, this._urlInfo);
  this._ir.once('finish', this._receiveInfo.bind(this));
}

inherits(SockJS, EventTarget);

function userSetCode(code) {
  return code === 1000 || (code >= 3000 && code <= 4999);
}

SockJS.prototype.close = function(code, reason) {
  // Step 1
  if (code && !userSetCode(code)) {
    throw new Error('InvalidAccessError: Invalid code');
  }
  // Step 2.4 states the max is 123 bytes, but we are just checking length
  if (reason && reason.length > 123) {
    throw new SyntaxError('reason argument has an invalid length');
  }

  // Step 3.1
  if (this.readyState === SockJS.CLOSING || this.readyState === SockJS.CLOSED) {
    return;
  }

  // TODO look at docs to determine how to set this
  var wasClean = true;
  this._close(code || 1000, reason || 'Normal closure', wasClean);
};

SockJS.prototype.send = function(data) {
  // #13 - convert anything non-string to string
  // TODO this currently turns objects into [object Object]
  if (typeof data !== 'string') {
    data = '' + data;
  }
  if (this.readyState === SockJS.CONNECTING) {
    throw new Error('InvalidStateError: The connection has not been established yet');
  }
  if (this.readyState !== SockJS.OPEN) {
    return;
  }
  this._transport.send(escape.quote(data));
};

SockJS.version = require('./version');

SockJS.CONNECTING = 0;
SockJS.OPEN = 1;
SockJS.CLOSING = 2;
SockJS.CLOSED = 3;

SockJS.prototype._receiveInfo = function(info, rtt) {
  debug('_receiveInfo', rtt);
  this._ir = null;
  if (!info) {
    this._close(1002, 'Cannot connect to server');
    return;
  }

  // establish a round-trip timeout (RTO) based on the
  // round-trip time (RTT)
  this._rto = this.countRTO(rtt);
  // allow server to override url used for the actual transport
  this._transUrl = info.base_url ? info.base_url : this.url;
  info = objectUtils.extend(info, this._urlInfo);
  debug('info', info);
  // determine list of desired and supported transports
  var enabledTransports = transports.filterToEnabled(this._transportsWhitelist, info);
  this._transports = enabledTransports.main;
  debug(this._transports.length + ' enabled transports');

  this._connect();
};

SockJS.prototype._connect = function() {
  for (var Transport = this._transports.shift(); Transport; Transport = this._transports.shift()) {
    debug('attempt', Transport.transportName);
    if (Transport.needBody) {
      if (!global.document.body ||
          (typeof global.document.readyState !== 'undefined' &&
            global.document.readyState !== 'complete' &&
            global.document.readyState !== 'interactive')) {
        debug('waiting for body');
        this._transports.unshift(Transport);
        eventUtils.attachEvent('load', this._connect.bind(this));
        return;
      }
    }

    // calculate timeout based on RTO and round trips. Default to 5s
    var timeoutMs = Math.max(this._timeout, (this._rto * Transport.roundTrips) || 5000);
    this._transportTimeoutId = setTimeout(this._transportTimeout.bind(this), timeoutMs);
    debug('using timeout', timeoutMs);

    var transportUrl = urlUtils.addPath(this._transUrl, '/' + this._server + '/' + this._generateSessionId());
    var options = this._transportOptions[Transport.transportName];
    debug('transport url', transportUrl);
    var transportObj = new Transport(transportUrl, this._transUrl, options);
    transportObj.on('message', this._transportMessage.bind(this));
    transportObj.once('close', this._transportClose.bind(this));
    transportObj.transportName = Transport.transportName;
    this._transport = transportObj;

    return;
  }
  this._close(2000, 'All transports failed', false);
};

SockJS.prototype._transportTimeout = function() {
  debug('_transportTimeout');
  if (this.readyState === SockJS.CONNECTING) {
    if (this._transport) {
      this._transport.close();
    }

    this._transportClose(2007, 'Transport timed out');
  }
};

SockJS.prototype._transportMessage = function(msg) {
  debug('_transportMessage', msg);
  var self = this
    , type = msg.slice(0, 1)
    , content = msg.slice(1)
    , payload
    ;

  // first check for messages that don't need a payload
  switch (type) {
    case 'o':
      this._open();
      return;
    case 'h':
      this.dispatchEvent(new Event('heartbeat'));
      debug('heartbeat', this.transport);
      return;
  }

  if (content) {
    try {
      payload = JSON.parse(content);
    } catch (e) {
      debug('bad json', content);
    }
  }

  if (typeof payload === 'undefined') {
    debug('empty payload', content);
    return;
  }

  switch (type) {
    case 'a':
      if (Array.isArray(payload)) {
        payload.forEach(function(p) {
          debug('message', self.transport, p);
          self.dispatchEvent(new TransportMessageEvent(p));
        });
      }
      break;
    case 'm':
      debug('message', this.transport, payload);
      this.dispatchEvent(new TransportMessageEvent(payload));
      break;
    case 'c':
      if (Array.isArray(payload) && payload.length === 2) {
        this._close(payload[0], payload[1], true);
      }
      break;
  }
};

SockJS.prototype._transportClose = function(code, reason) {
  debug('_transportClose', this.transport, code, reason);
  if (this._transport) {
    this._transport.removeAllListeners();
    this._transport = null;
    this.transport = null;
  }

  if (!userSetCode(code) && code !== 2000 && this.readyState === SockJS.CONNECTING) {
    this._connect();
    return;
  }

  this._close(code, reason);
};

SockJS.prototype._open = function() {
  debug('_open', this._transport && this._transport.transportName, this.readyState);
  if (this.readyState === SockJS.CONNECTING) {
    if (this._transportTimeoutId) {
      clearTimeout(this._transportTimeoutId);
      this._transportTimeoutId = null;
    }
    this.readyState = SockJS.OPEN;
    this.transport = this._transport.transportName;
    this.dispatchEvent(new Event('open'));
    debug('connected', this.transport);
  } else {
    // The server might have been restarted, and lost track of our
    // connection.
    this._close(1006, 'Server lost session');
  }
};

SockJS.prototype._close = function(code, reason, wasClean) {
  debug('_close', this.transport, code, reason, wasClean, this.readyState);
  var forceFail = false;

  if (this._ir) {
    forceFail = true;
    this._ir.close();
    this._ir = null;
  }
  if (this._transport) {
    this._transport.close();
    this._transport = null;
    this.transport = null;
  }

  if (this.readyState === SockJS.CLOSED) {
    throw new Error('InvalidStateError: SockJS has already been closed');
  }

  this.readyState = SockJS.CLOSING;
  setTimeout(function() {
    this.readyState = SockJS.CLOSED;

    if (forceFail) {
      this.dispatchEvent(new Event('error'));
    }

    var e = new CloseEvent('close');
    e.wasClean = wasClean || false;
    e.code = code || 1000;
    e.reason = reason;

    this.dispatchEvent(e);
    this.onmessage = this.onclose = this.onerror = null;
    debug('disconnected');
  }.bind(this), 0);
};

// See: http://www.erg.abdn.ac.uk/~gerrit/dccp/notes/ccid2/rto_estimator/
// and RFC 2988.
SockJS.prototype.countRTO = function(rtt) {
  // In a local environment, when using IE8/9 and the `jsonp-polling`
  // transport the time needed to establish a connection (the time that pass
  // from the opening of the transport to the call of `_dispatchOpen`) is
  // around 200msec (the lower bound used in the article above) and this
  // causes spurious timeouts. For this reason we calculate a value slightly
  // larger than that used in the article.
  if (rtt > 100) {
    return 4 * rtt; // rto > 400msec
  }
  return 300 + rtt; // 300msec < rto <= 400msec
};

module.exports = function(availableTransports) {
  transports = transport(availableTransports);
  require('./iframe-bootstrap')(SockJS, availableTransports);
  return SockJS;
};

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./event/close":24,"./event/event":26,"./event/eventtarget":27,"./event/trans-message":28,"./iframe-bootstrap":30,"./info-receiver":34,"./location":35,"./shims":37,"./utils/browser":66,"./utils/escape":67,"./utils/event":68,"./utils/log":70,"./utils/object":71,"./utils/random":72,"./utils/transport":73,"./utils/url":74,"./version":75,"_process":20,"debug":76,"inherits":19,"url-parse":79}],37:[function(require,module,exports){
/* eslint-disable */
/* jscs: disable */
'use strict';

// pulled specific shims from https://github.com/es-shims/es5-shim

var ArrayPrototype = Array.prototype;
var ObjectPrototype = Object.prototype;
var FunctionPrototype = Function.prototype;
var StringPrototype = String.prototype;
var array_slice = ArrayPrototype.slice;

var _toString = ObjectPrototype.toString;
var isFunction = function (val) {
    return ObjectPrototype.toString.call(val) === '[object Function]';
};
var isArray = function isArray(obj) {
    return _toString.call(obj) === '[object Array]';
};
var isString = function isString(obj) {
    return _toString.call(obj) === '[object String]';
};

var supportsDescriptors = Object.defineProperty && (function () {
    try {
        Object.defineProperty({}, 'x', {});
        return true;
    } catch (e) { /* this is ES3 */
        return false;
    }
}());

// Define configurable, writable and non-enumerable props
// if they don't exist.
var defineProperty;
if (supportsDescriptors) {
    defineProperty = function (object, name, method, forceAssign) {
        if (!forceAssign && (name in object)) { return; }
        Object.defineProperty(object, name, {
            configurable: true,
            enumerable: false,
            writable: true,
            value: method
        });
    };
} else {
    defineProperty = function (object, name, method, forceAssign) {
        if (!forceAssign && (name in object)) { return; }
        object[name] = method;
    };
}
var defineProperties = function (object, map, forceAssign) {
    for (var name in map) {
        if (ObjectPrototype.hasOwnProperty.call(map, name)) {
          defineProperty(object, name, map[name], forceAssign);
        }
    }
};

var toObject = function (o) {
    if (o == null) { // this matches both null and undefined
        throw new TypeError("can't convert " + o + ' to object');
    }
    return Object(o);
};

//
// Util
// ======
//

// ES5 9.4
// http://es5.github.com/#x9.4
// http://jsperf.com/to-integer

function toInteger(num) {
    var n = +num;
    if (n !== n) { // isNaN
        n = 0;
    } else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
    }
    return n;
}

function ToUint32(x) {
    return x >>> 0;
}

//
// Function
// ========
//

// ES-5 15.3.4.5
// http://es5.github.com/#x15.3.4.5

function Empty() {}

defineProperties(FunctionPrototype, {
    bind: function bind(that) { // .length is 1
        // 1. Let Target be the this value.
        var target = this;
        // 2. If IsCallable(Target) is false, throw a TypeError exception.
        if (!isFunction(target)) {
            throw new TypeError('Function.prototype.bind called on incompatible ' + target);
        }
        // 3. Let A be a new (possibly empty) internal list of all of the
        //   argument values provided after thisArg (arg1, arg2 etc), in order.
        // XXX slicedArgs will stand in for "A" if used
        var args = array_slice.call(arguments, 1); // for normal call
        // 4. Let F be a new native ECMAScript object.
        // 11. Set the [[Prototype]] internal property of F to the standard
        //   built-in Function prototype object as specified in 15.3.3.1.
        // 12. Set the [[Call]] internal property of F as described in
        //   15.3.4.5.1.
        // 13. Set the [[Construct]] internal property of F as described in
        //   15.3.4.5.2.
        // 14. Set the [[HasInstance]] internal property of F as described in
        //   15.3.4.5.3.
        var binder = function () {

            if (this instanceof bound) {
                // 15.3.4.5.2 [[Construct]]
                // When the [[Construct]] internal method of a function object,
                // F that was created using the bind function is called with a
                // list of arguments ExtraArgs, the following steps are taken:
                // 1. Let target be the value of F's [[TargetFunction]]
                //   internal property.
                // 2. If target has no [[Construct]] internal method, a
                //   TypeError exception is thrown.
                // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the
                //   list boundArgs in the same order followed by the same
                //   values as the list ExtraArgs in the same order.
                // 5. Return the result of calling the [[Construct]] internal
                //   method of target providing args as the arguments.

                var result = target.apply(
                    this,
                    args.concat(array_slice.call(arguments))
                );
                if (Object(result) === result) {
                    return result;
                }
                return this;

            } else {
                // 15.3.4.5.1 [[Call]]
                // When the [[Call]] internal method of a function object, F,
                // which was created using the bind function is called with a
                // this value and a list of arguments ExtraArgs, the following
                // steps are taken:
                // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 2. Let boundThis be the value of F's [[BoundThis]] internal
                //   property.
                // 3. Let target be the value of F's [[TargetFunction]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the
                //   list boundArgs in the same order followed by the same
                //   values as the list ExtraArgs in the same order.
                // 5. Return the result of calling the [[Call]] internal method
                //   of target providing boundThis as the this value and
                //   providing args as the arguments.

                // equiv: target.call(this, ...boundArgs, ...args)
                return target.apply(
                    that,
                    args.concat(array_slice.call(arguments))
                );

            }

        };

        // 15. If the [[Class]] internal property of Target is "Function", then
        //     a. Let L be the length property of Target minus the length of A.
        //     b. Set the length own property of F to either 0 or L, whichever is
        //       larger.
        // 16. Else set the length own property of F to 0.

        var boundLength = Math.max(0, target.length - args.length);

        // 17. Set the attributes of the length own property of F to the values
        //   specified in 15.3.5.1.
        var boundArgs = [];
        for (var i = 0; i < boundLength; i++) {
            boundArgs.push('$' + i);
        }

        // XXX Build a dynamic function with desired amount of arguments is the only
        // way to set the length property of a function.
        // In environments where Content Security Policies enabled (Chrome extensions,
        // for ex.) all use of eval or Function costructor throws an exception.
        // However in all of these environments Function.prototype.bind exists
        // and so this code will never be executed.
        var bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this, arguments); }')(binder);

        if (target.prototype) {
            Empty.prototype = target.prototype;
            bound.prototype = new Empty();
            // Clean up dangling references.
            Empty.prototype = null;
        }

        // TODO
        // 18. Set the [[Extensible]] internal property of F to true.

        // TODO
        // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
        // 20. Call the [[DefineOwnProperty]] internal method of F with
        //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
        //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
        //   false.
        // 21. Call the [[DefineOwnProperty]] internal method of F with
        //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
        //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
        //   and false.

        // TODO
        // NOTE Function objects created using Function.prototype.bind do not
        // have a prototype property or the [[Code]], [[FormalParameters]], and
        // [[Scope]] internal properties.
        // XXX can't delete prototype in pure-js.

        // 22. Return F.
        return bound;
    }
});

//
// Array
// =====
//

// ES5 15.4.3.2
// http://es5.github.com/#x15.4.3.2
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
defineProperties(Array, { isArray: isArray });


var boxedString = Object('a');
var splitString = boxedString[0] !== 'a' || !(0 in boxedString);

var properlyBoxesContext = function properlyBoxed(method) {
    // Check node 0.6.21 bug where third parameter is not boxed
    var properlyBoxesNonStrict = true;
    var properlyBoxesStrict = true;
    if (method) {
        method.call('foo', function (_, __, context) {
            if (typeof context !== 'object') { properlyBoxesNonStrict = false; }
        });

        method.call([1], function () {
            'use strict';
            properlyBoxesStrict = typeof this === 'string';
        }, 'x');
    }
    return !!method && properlyBoxesNonStrict && properlyBoxesStrict;
};

defineProperties(ArrayPrototype, {
    forEach: function forEach(fun /*, thisp*/) {
        var object = toObject(this),
            self = splitString && isString(this) ? this.split('') : object,
            thisp = arguments[1],
            i = -1,
            length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (!isFunction(fun)) {
            throw new TypeError(); // TODO message
        }

        while (++i < length) {
            if (i in self) {
                // Invoke the callback function with call, passing arguments:
                // context, property value, property key, thisArg object
                // context
                fun.call(thisp, self[i], i, object);
            }
        }
    }
}, !properlyBoxesContext(ArrayPrototype.forEach));

// ES5 15.4.4.14
// http://es5.github.com/#x15.4.4.14
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
var hasFirefox2IndexOfBug = Array.prototype.indexOf && [0, 1].indexOf(1, 2) !== -1;
defineProperties(ArrayPrototype, {
    indexOf: function indexOf(sought /*, fromIndex */ ) {
        var self = splitString && isString(this) ? this.split('') : toObject(this),
            length = self.length >>> 0;

        if (!length) {
            return -1;
        }

        var i = 0;
        if (arguments.length > 1) {
            i = toInteger(arguments[1]);
        }

        // handle negative indices
        i = i >= 0 ? i : Math.max(0, length + i);
        for (; i < length; i++) {
            if (i in self && self[i] === sought) {
                return i;
            }
        }
        return -1;
    }
}, hasFirefox2IndexOfBug);

//
// String
// ======
//

// ES5 15.5.4.14
// http://es5.github.com/#x15.5.4.14

// [bugfix, IE lt 9, firefox 4, Konqueror, Opera, obscure browsers]
// Many browsers do not split properly with regular expressions or they
// do not perform the split correctly under obscure conditions.
// See http://blog.stevenlevithan.com/archives/cross-browser-split
// I've tested in many browsers and this seems to cover the deviant ones:
//    'ab'.split(/(?:ab)*/) should be ["", ""], not [""]
//    '.'.split(/(.?)(.?)/) should be ["", ".", "", ""], not ["", ""]
//    'tesst'.split(/(s)*/) should be ["t", undefined, "e", "s", "t"], not
//       [undefined, "t", undefined, "e", ...]
//    ''.split(/.?/) should be [], not [""]
//    '.'.split(/()()/) should be ["."], not ["", "", "."]

var string_split = StringPrototype.split;
if (
    'ab'.split(/(?:ab)*/).length !== 2 ||
    '.'.split(/(.?)(.?)/).length !== 4 ||
    'tesst'.split(/(s)*/)[1] === 't' ||
    'test'.split(/(?:)/, -1).length !== 4 ||
    ''.split(/.?/).length ||
    '.'.split(/()()/).length > 1
) {
    (function () {
        var compliantExecNpcg = /()??/.exec('')[1] === void 0; // NPCG: nonparticipating capturing group

        StringPrototype.split = function (separator, limit) {
            var string = this;
            if (separator === void 0 && limit === 0) {
                return [];
            }

            // If `separator` is not a regex, use native split
            if (_toString.call(separator) !== '[object RegExp]') {
                return string_split.call(this, separator, limit);
            }

            var output = [],
                flags = (separator.ignoreCase ? 'i' : '') +
                        (separator.multiline  ? 'm' : '') +
                        (separator.extended   ? 'x' : '') + // Proposed for ES6
                        (separator.sticky     ? 'y' : ''), // Firefox 3+
                lastLastIndex = 0,
                // Make `global` and avoid `lastIndex` issues by working with a copy
                separator2, match, lastIndex, lastLength;
            separator = new RegExp(separator.source, flags + 'g');
            string += ''; // Type-convert
            if (!compliantExecNpcg) {
                // Doesn't need flags gy, but they don't hurt
                separator2 = new RegExp('^' + separator.source + '$(?!\\s)', flags);
            }
            /* Values for `limit`, per the spec:
             * If undefined: 4294967295 // Math.pow(2, 32) - 1
             * If 0, Infinity, or NaN: 0
             * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
             * If negative number: 4294967296 - Math.floor(Math.abs(limit))
             * If other: Type-convert, then use the above rules
             */
            limit = limit === void 0 ?
                -1 >>> 0 : // Math.pow(2, 32) - 1
                ToUint32(limit);
            while (match = separator.exec(string)) {
                // `separator.lastIndex` is not reliable cross-browser
                lastIndex = match.index + match[0].length;
                if (lastIndex > lastLastIndex) {
                    output.push(string.slice(lastLastIndex, match.index));
                    // Fix browsers whose `exec` methods don't consistently return `undefined` for
                    // nonparticipating capturing groups
                    if (!compliantExecNpcg && match.length > 1) {
                        match[0].replace(separator2, function () {
                            for (var i = 1; i < arguments.length - 2; i++) {
                                if (arguments[i] === void 0) {
                                    match[i] = void 0;
                                }
                            }
                        });
                    }
                    if (match.length > 1 && match.index < string.length) {
                        ArrayPrototype.push.apply(output, match.slice(1));
                    }
                    lastLength = match[0].length;
                    lastLastIndex = lastIndex;
                    if (output.length >= limit) {
                        break;
                    }
                }
                if (separator.lastIndex === match.index) {
                    separator.lastIndex++; // Avoid an infinite loop
                }
            }
            if (lastLastIndex === string.length) {
                if (lastLength || !separator.test('')) {
                    output.push('');
                }
            } else {
                output.push(string.slice(lastLastIndex));
            }
            return output.length > limit ? output.slice(0, limit) : output;
        };
    }());

// [bugfix, chrome]
// If separator is undefined, then the result array contains just one String,
// which is the this value (converted to a String). If limit is not undefined,
// then the output array is truncated so that it contains no more than limit
// elements.
// "0".split(undefined, 0) -> []
} else if ('0'.split(void 0, 0).length) {
    StringPrototype.split = function split(separator, limit) {
        if (separator === void 0 && limit === 0) { return []; }
        return string_split.call(this, separator, limit);
    };
}

// ECMA-262, 3rd B.2.3
// Not an ECMAScript standard, although ECMAScript 3rd Edition has a
// non-normative section suggesting uniform semantics and it should be
// normalized across all browsers
// [bugfix, IE lt 9] IE < 9 substr() with negative value not working in IE
var string_substr = StringPrototype.substr;
var hasNegativeSubstrBug = ''.substr && '0b'.substr(-1) !== 'b';
defineProperties(StringPrototype, {
    substr: function substr(start, length) {
        return string_substr.call(
            this,
            start < 0 ? ((start = this.length + start) < 0 ? 0 : start) : start,
            length
        );
    }
}, hasNegativeSubstrBug);

},{}],38:[function(require,module,exports){
'use strict';

module.exports = [
  // streaming transports
  require('./transport/websocket')
, require('./transport/xhr-streaming')
, require('./transport/xdr-streaming')
, require('./transport/eventsource')
, require('./transport/lib/iframe-wrap')(require('./transport/eventsource'))

  // polling transports
, require('./transport/htmlfile')
, require('./transport/lib/iframe-wrap')(require('./transport/htmlfile'))
, require('./transport/xhr-polling')
, require('./transport/xdr-polling')
, require('./transport/lib/iframe-wrap')(require('./transport/xhr-polling'))
, require('./transport/jsonp-polling')
];

},{"./transport/eventsource":42,"./transport/htmlfile":43,"./transport/jsonp-polling":45,"./transport/lib/iframe-wrap":48,"./transport/websocket":60,"./transport/xdr-polling":61,"./transport/xdr-streaming":62,"./transport/xhr-polling":63,"./transport/xhr-streaming":64}],39:[function(require,module,exports){
(function (process,global){(function (){
'use strict';

var EventEmitter = require('events').EventEmitter
  , inherits = require('inherits')
  , utils = require('../../utils/event')
  , urlUtils = require('../../utils/url')
  , XHR = global.XMLHttpRequest
  ;

var debug = function() {};
if (process.env.NODE_ENV !== 'production') {
  debug = require('debug')('sockjs-client:browser:xhr');
}

function AbstractXHRObject(method, url, payload, opts) {
  debug(method, url);
  var self = this;
  EventEmitter.call(this);

  setTimeout(function () {
    self._start(method, url, payload, opts);
  }, 0);
}

inherits(AbstractXHRObject, EventEmitter);

AbstractXHRObject.prototype._start = function(method, url, payload, opts) {
  var self = this;

  try {
    this.xhr = new XHR();
  } catch (x) {
    // intentionally empty
  }

  if (!this.xhr) {
    debug('no xhr');
    this.emit('finish', 0, 'no xhr support');
    this._cleanup();
    return;
  }

  // several browsers cache POSTs
  url = urlUtils.addQuery(url, 't=' + (+new Date()));

  // Explorer tends to keep connection open, even after the
  // tab gets closed: http://bugs.jquery.com/ticket/5280
  this.unloadRef = utils.unloadAdd(function() {
    debug('unload cleanup');
    self._cleanup(true);
  });
  try {
    this.xhr.open(method, url, true);
    if (this.timeout && 'timeout' in this.xhr) {
      this.xhr.timeout = this.timeout;
      this.xhr.ontimeout = function() {
        debug('xhr timeout');
        self.emit('finish', 0, '');
        self._cleanup(false);
      };
    }
  } catch (e) {
    debug('exception', e);
    // IE raises an exception on wrong port.
    this.emit('finish', 0, '');
    this._cleanup(false);
    return;
  }

  if ((!opts || !opts.noCredentials) && AbstractXHRObject.supportsCORS) {
    debug('withCredentials');
    // Mozilla docs says https://developer.mozilla.org/en/XMLHttpRequest :
    // "This never affects same-site requests."

    this.xhr.withCredentials = true;
  }
  if (opts && opts.headers) {
    for (var key in opts.headers) {
      this.xhr.setRequestHeader(key, opts.headers[key]);
    }
  }

  this.xhr.onreadystatechange = function() {
    if (self.xhr) {
      var x = self.xhr;
      var text, status;
      debug('readyState', x.readyState);
      switch (x.readyState) {
      case 3:
        // IE doesn't like peeking into responseText or status
        // on Microsoft.XMLHTTP and readystate=3
        try {
          status = x.status;
          text = x.responseText;
        } catch (e) {
          // intentionally empty
        }
        debug('status', status);
        // IE returns 1223 for 204: http://bugs.jquery.com/ticket/1450
        if (status === 1223) {
          status = 204;
        }

        // IE does return readystate == 3 for 404 answers.
        if (status === 200 && text && text.length > 0) {
          debug('chunk');
          self.emit('chunk', status, text);
        }
        break;
      case 4:
        status = x.status;
        debug('status', status);
        // IE returns 1223 for 204: http://bugs.jquery.com/ticket/1450
        if (status === 1223) {
          status = 204;
        }
        // IE returns this for a bad port
        // http://msdn.microsoft.com/en-us/library/windows/desktop/aa383770(v=vs.85).aspx
        if (status === 12005 || status === 12029) {
          status = 0;
        }

        debug('finish', status, x.responseText);
        self.emit('finish', status, x.responseText);
        self._cleanup(false);
        break;
      }
    }
  };

  try {
    self.xhr.send(payload);
  } catch (e) {
    self.emit('finish', 0, '');
    self._cleanup(false);
  }
};

AbstractXHRObject.prototype._cleanup = function(abort) {
  debug('cleanup');
  if (!this.xhr) {
    return;
  }
  this.removeAllListeners();
  utils.unloadDel(this.unloadRef);

  // IE needs this field to be a function
  this.xhr.onreadystatechange = function() {};
  if (this.xhr.ontimeout) {
    this.xhr.ontimeout = null;
  }

  if (abort) {
    try {
      this.xhr.abort();
    } catch (x) {
      // intentionally empty
    }
  }
  this.unloadRef = this.xhr = null;
};

AbstractXHRObject.prototype.close = function() {
  debug('close');
  this._cleanup(true);
};

AbstractXHRObject.enabled = !!XHR;
// override XMLHttpRequest for IE6/7
// obfuscate to avoid firewalls
var axo = ['Active'].concat('Object').join('X');
if (!AbstractXHRObject.enabled && (axo in global)) {
  debug('overriding xmlhttprequest');
  XHR = function() {
    try {
      return new global[axo]('Microsoft.XMLHTTP');
    } catch (e) {
      return null;
    }
  };
  AbstractXHRObject.enabled = !!new XHR();
}

var cors = false;
try {
  cors = 'withCredentials' in new XHR();
} catch (ignored) {
  // intentionally empty
}

AbstractXHRObject.supportsCORS = cors;

module.exports = AbstractXHRObject;

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../utils/event":68,"../../utils/url":74,"_process":20,"debug":76,"events":25,"inherits":19}],40:[function(require,module,exports){
(function (global){(function (){
module.exports = global.EventSource;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],41:[function(require,module,exports){
(function (global){(function (){
'use strict';

var Driver = global.WebSocket || global.MozWebSocket;
if (Driver) {
	module.exports = function WebSocketBrowserDriver(url) {
		return new Driver(url);
	};
} else {
	module.exports = undefined;
}

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],42:[function(require,module,exports){
'use strict';

var inherits = require('inherits')
  , AjaxBasedTransport = require('./lib/ajax-based')
  , EventSourceReceiver = require('./receiver/eventsource')
  , XHRCorsObject = require('./sender/xhr-cors')
  , EventSourceDriver = require('eventsource')
  ;

function EventSourceTransport(transUrl) {
  if (!EventSourceTransport.enabled()) {
    throw new Error('Transport created when disabled');
  }

  AjaxBasedTransport.call(this, transUrl, '/eventsource', EventSourceReceiver, XHRCorsObject);
}

inherits(EventSourceTransport, AjaxBasedTransport);

EventSourceTransport.enabled = function() {
  return !!EventSourceDriver;
};

EventSourceTransport.transportName = 'eventsource';
EventSourceTransport.roundTrips = 2;

module.exports = EventSourceTransport;

},{"./lib/ajax-based":46,"./receiver/eventsource":51,"./sender/xhr-cors":57,"eventsource":40,"inherits":19}],43:[function(require,module,exports){
'use strict';

var inherits = require('inherits')
  , HtmlfileReceiver = require('./receiver/htmlfile')
  , XHRLocalObject = require('./sender/xhr-local')
  , AjaxBasedTransport = require('./lib/ajax-based')
  ;

function HtmlFileTransport(transUrl) {
  if (!HtmlfileReceiver.enabled) {
    throw new Error('Transport created when disabled');
  }
  AjaxBasedTransport.call(this, transUrl, '/htmlfile', HtmlfileReceiver, XHRLocalObject);
}

inherits(HtmlFileTransport, AjaxBasedTransport);

HtmlFileTransport.enabled = function(info) {
  return HtmlfileReceiver.enabled && info.sameOrigin;
};

HtmlFileTransport.transportName = 'htmlfile';
HtmlFileTransport.roundTrips = 2;

module.exports = HtmlFileTransport;

},{"./lib/ajax-based":46,"./receiver/htmlfile":52,"./sender/xhr-local":59,"inherits":19}],44:[function(require,module,exports){
(function (process){(function (){
'use strict';

// Few cool transports do work only for same-origin. In order to make
// them work cross-domain we shall use iframe, served from the
// remote domain. New browsers have capabilities to communicate with
// cross domain iframe using postMessage(). In IE it was implemented
// from IE 8+, but of course, IE got some details wrong:
//    http://msdn.microsoft.com/en-us/library/cc197015(v=VS.85).aspx
//    http://stevesouders.com/misc/test-postmessage.php

var inherits = require('inherits')
  , EventEmitter = require('events').EventEmitter
  , version = require('../version')
  , urlUtils = require('../utils/url')
  , iframeUtils = require('../utils/iframe')
  , eventUtils = require('../utils/event')
  , random = require('../utils/random')
  ;

var debug = function() {};
if (process.env.NODE_ENV !== 'production') {
  debug = require('debug')('sockjs-client:transport:iframe');
}

function IframeTransport(transport, transUrl, baseUrl) {
  if (!IframeTransport.enabled()) {
    throw new Error('Transport created when disabled');
  }
  EventEmitter.call(this);

  var self = this;
  this.origin = urlUtils.getOrigin(baseUrl);
  this.baseUrl = baseUrl;
  this.transUrl = transUrl;
  this.transport = transport;
  this.windowId = random.string(8);

  var iframeUrl = urlUtils.addPath(baseUrl, '/iframe.html') + '#' + this.windowId;
  debug(transport, transUrl, iframeUrl);

  this.iframeObj = iframeUtils.createIframe(iframeUrl, function(r) {
    debug('err callback');
    self.emit('close', 1006, 'Unable to load an iframe (' + r + ')');
    self.close();
  });

  this.onmessageCallback = this._message.bind(this);
  eventUtils.attachEvent('message', this.onmessageCallback);
}

inherits(IframeTransport, EventEmitter);

IframeTransport.prototype.close = function() {
  debug('close');
  this.removeAllListeners();
  if (this.iframeObj) {
    eventUtils.detachEvent('message', this.onmessageCallback);
    try {
      // When the iframe is not loaded, IE raises an exception
      // on 'contentWindow'.
      this.postMessage('c');
    } catch (x) {
      // intentionally empty
    }
    this.iframeObj.cleanup();
    this.iframeObj = null;
    this.onmessageCallback = this.iframeObj = null;
  }
};

IframeTransport.prototype._message = function(e) {
  debug('message', e.data);
  if (!urlUtils.isOriginEqual(e.origin, this.origin)) {
    debug('not same origin', e.origin, this.origin);
    return;
  }

  var iframeMessage;
  try {
    iframeMessage = JSON.parse(e.data);
  } catch (ignored) {
    debug('bad json', e.data);
    return;
  }

  if (iframeMessage.windowId !== this.windowId) {
    debug('mismatched window id', iframeMessage.windowId, this.windowId);
    return;
  }

  switch (iframeMessage.type) {
  case 's':
    this.iframeObj.loaded();
    // window global dependency
    this.postMessage('s', JSON.stringify([
      version
    , this.transport
    , this.transUrl
    , this.baseUrl
    ]));
    break;
  case 't':
    this.emit('message', iframeMessage.data);
    break;
  case 'c':
    var cdata;
    try {
      cdata = JSON.parse(iframeMessage.data);
    } catch (ignored) {
      debug('bad json', iframeMessage.data);
      return;
    }
    this.emit('close', cdata[0], cdata[1]);
    this.close();
    break;
  }
};

IframeTransport.prototype.postMessage = function(type, data) {
  debug('postMessage', type, data);
  this.iframeObj.post(JSON.stringify({
    windowId: this.windowId
  , type: type
  , data: data || ''
  }), this.origin);
};

IframeTransport.prototype.send = function(message) {
  debug('send', message);
  this.postMessage('m', message);
};

IframeTransport.enabled = function() {
  return iframeUtils.iframeEnabled;
};

IframeTransport.transportName = 'iframe';
IframeTransport.roundTrips = 2;

module.exports = IframeTransport;

}).call(this)}).call(this,require('_process'))

},{"../utils/event":68,"../utils/iframe":69,"../utils/random":72,"../utils/url":74,"../version":75,"_process":20,"debug":76,"events":25,"inherits":19}],45:[function(require,module,exports){
(function (global){(function (){
'use strict';

// The simplest and most robust transport, using the well-know cross
// domain hack - JSONP. This transport is quite inefficient - one
// message could use up to one http request. But at least it works almost
// everywhere.
// Known limitations:
//   o you will get a spinning cursor
//   o for Konqueror a dumb timer is needed to detect errors

var inherits = require('inherits')
  , SenderReceiver = require('./lib/sender-receiver')
  , JsonpReceiver = require('./receiver/jsonp')
  , jsonpSender = require('./sender/jsonp')
  ;

function JsonPTransport(transUrl) {
  if (!JsonPTransport.enabled()) {
    throw new Error('Transport created when disabled');
  }
  SenderReceiver.call(this, transUrl, '/jsonp', jsonpSender, JsonpReceiver);
}

inherits(JsonPTransport, SenderReceiver);

JsonPTransport.enabled = function() {
  return !!global.document;
};

JsonPTransport.transportName = 'jsonp-polling';
JsonPTransport.roundTrips = 1;
JsonPTransport.needBody = true;

module.exports = JsonPTransport;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./lib/sender-receiver":50,"./receiver/jsonp":53,"./sender/jsonp":55,"inherits":19}],46:[function(require,module,exports){
(function (process){(function (){
'use strict';

var inherits = require('inherits')
  , urlUtils = require('../../utils/url')
  , SenderReceiver = require('./sender-receiver')
  ;

var debug = function() {};
if (process.env.NODE_ENV !== 'production') {
  debug = require('debug')('sockjs-client:ajax-based');
}

function createAjaxSender(AjaxObject) {
  return function(url, payload, callback) {
    debug('create ajax sender', url, payload);
    var opt = {};
    if (typeof payload === 'string') {
      opt.headers = {'Content-type': 'text/plain'};
    }
    var ajaxUrl = urlUtils.addPath(url, '/xhr_send');
    var xo = new AjaxObject('POST', ajaxUrl, payload, opt);
    xo.once('finish', function(status) {
      debug('finish', status);
      xo = null;

      if (status !== 200 && status !== 204) {
        return callback(new Error('http status ' + status));
      }
      callback();
    });
    return function() {
      debug('abort');
      xo.close();
      xo = null;

      var err = new Error('Aborted');
      err.code = 1000;
      callback(err);
    };
  };
}

function AjaxBasedTransport(transUrl, urlSuffix, Receiver, AjaxObject) {
  SenderReceiver.call(this, transUrl, urlSuffix, createAjaxSender(AjaxObject), Receiver, AjaxObject);
}

inherits(AjaxBasedTransport, SenderReceiver);

module.exports = AjaxBasedTransport;

}).call(this)}).call(this,require('_process'))

},{"../../utils/url":74,"./sender-receiver":50,"_process":20,"debug":76,"inherits":19}],47:[function(require,module,exports){
(function (process){(function (){
'use strict';

var inherits = require('inherits')
  , EventEmitter = require('events').EventEmitter
  ;

var debug = function() {};
if (process.env.NODE_ENV !== 'production') {
  debug = require('debug')('sockjs-client:buffered-sender');
}

function BufferedSender(url, sender) {
  debug(url);
  EventEmitter.call(this);
  this.sendBuffer = [];
  this.sender = sender;
  this.url = url;
}

inherits(BufferedSender, EventEmitter);

BufferedSender.prototype.send = function(message) {
  debug('send', message);
  this.sendBuffer.push(message);
  if (!this.sendStop) {
    this.sendSchedule();
  }
};

// For polling transports in a situation when in the message callback,
// new message is being send. If the sending connection was started
// before receiving one, it is possible to saturate the network and
// timeout due to the lack of receiving socket. To avoid that we delay
// sending messages by some small time, in order to let receiving
// connection be started beforehand. This is only a halfmeasure and
// does not fix the big problem, but it does make the tests go more
// stable on slow networks.
BufferedSender.prototype.sendScheduleWait = function() {
  debug('sendScheduleWait');
  var self = this;
  var tref;
  this.sendStop = function() {
    debug('sendStop');
    self.sendStop = null;
    clearTimeout(tref);
  };
  tref = setTimeout(function() {
    debug('timeout');
    self.sendStop = null;
    self.sendSchedule();
  }, 25);
};

BufferedSender.prototype.sendSchedule = function() {
  debug('sendSchedule', this.sendBuffer.length);
  var self = this;
  if (this.sendBuffer.length > 0) {
    var payload = '[' + this.sendBuffer.join(',') + ']';
    this.sendStop = this.sender(this.url, payload, function(err) {
      self.sendStop = null;
      if (err) {
        debug('error', err);
        self.emit('close', err.code || 1006, 'Sending error: ' + err);
        self.close();
      } else {
        self.sendScheduleWait();
      }
    });
    this.sendBuffer = [];
  }
};

BufferedSender.prototype._cleanup = function() {
  debug('_cleanup');
  this.removeAllListeners();
};

BufferedSender.prototype.close = function() {
  debug('close');
  this._cleanup();
  if (this.sendStop) {
    this.sendStop();
    this.sendStop = null;
  }
};

module.exports = BufferedSender;

}).call(this)}).call(this,require('_process'))

},{"_process":20,"debug":76,"events":25,"inherits":19}],48:[function(require,module,exports){
(function (global){(function (){
'use strict';

var inherits = require('inherits')
  , IframeTransport = require('../iframe')
  , objectUtils = require('../../utils/object')
  ;

module.exports = function(transport) {

  function IframeWrapTransport(transUrl, baseUrl) {
    IframeTransport.call(this, transport.transportName, transUrl, baseUrl);
  }

  inherits(IframeWrapTransport, IframeTransport);

  IframeWrapTransport.enabled = function(url, info) {
    if (!global.document) {
      return false;
    }

    var iframeInfo = objectUtils.extend({}, info);
    iframeInfo.sameOrigin = true;
    return transport.enabled(iframeInfo) && IframeTransport.enabled();
  };

  IframeWrapTransport.transportName = 'iframe-' + transport.transportName;
  IframeWrapTransport.needBody = true;
  IframeWrapTransport.roundTrips = IframeTransport.roundTrips + transport.roundTrips - 1; // html, javascript (2) + transport - no CORS (1)

  IframeWrapTransport.facadeTransport = transport;

  return IframeWrapTransport;
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../utils/object":71,"../iframe":44,"inherits":19}],49:[function(require,module,exports){
(function (process){(function (){
'use strict';

var inherits = require('inherits')
  , EventEmitter = require('events').EventEmitter
  ;

var debug = function() {};
if (process.env.NODE_ENV !== 'production') {
  debug = require('debug')('sockjs-client:polling');
}

function Polling(Receiver, receiveUrl, AjaxObject) {
  debug(receiveUrl);
  EventEmitter.call(this);
  this.Receiver = Receiver;
  this.receiveUrl = receiveUrl;
  this.AjaxObject = AjaxObject;
  this._scheduleReceiver();
}

inherits(Polling, EventEmitter);

Polling.prototype._scheduleReceiver = function() {
  debug('_scheduleReceiver');
  var self = this;
  var poll = this.poll = new this.Receiver(this.receiveUrl, this.AjaxObject);

  poll.on('message', function(msg) {
    debug('message', msg);
    self.emit('message', msg);
  });

  poll.once('close', function(code, reason) {
    debug('close', code, reason, self.pollIsClosing);
    self.poll = poll = null;

    if (!self.pollIsClosing) {
      if (reason === 'network') {
        self._scheduleReceiver();
      } else {
        self.emit('close', code || 1006, reason);
        self.removeAllListeners();
      }
    }
  });
};

Polling.prototype.abort = function() {
  debug('abort');
  this.removeAllListeners();
  this.pollIsClosing = true;
  if (this.poll) {
    this.poll.abort();
  }
};

module.exports = Polling;

}).call(this)}).call(this,require('_process'))

},{"_process":20,"debug":76,"events":25,"inherits":19}],50:[function(require,module,exports){
(function (process){(function (){
'use strict';

var inherits = require('inherits')
  , urlUtils = require('../../utils/url')
  , BufferedSender = require('./buffered-sender')
  , Polling = require('./polling')
  ;

var debug = function() {};
if (process.env.NODE_ENV !== 'production') {
  debug = require('debug')('sockjs-client:sender-receiver');
}

function SenderReceiver(transUrl, urlSuffix, senderFunc, Receiver, AjaxObject) {
  var pollUrl = urlUtils.addPath(transUrl, urlSuffix);
  debug(pollUrl);
  var self = this;
  BufferedSender.call(this, transUrl, senderFunc);

  this.poll = new Polling(Receiver, pollUrl, AjaxObject);
  this.poll.on('message', function(msg) {
    debug('poll message', msg);
    self.emit('message', msg);
  });
  this.poll.once('close', function(code, reason) {
    debug('poll close', code, reason);
    self.poll = null;
    self.emit('close', code, reason);
    self.close();
  });
}

inherits(SenderReceiver, BufferedSender);

SenderReceiver.prototype.close = function() {
  BufferedSender.prototype.close.call(this);
  debug('close');
  this.removeAllListeners();
  if (this.poll) {
    this.poll.abort();
    this.poll = null;
  }
};

module.exports = SenderReceiver;

}).call(this)}).call(this,require('_process'))

},{"../../utils/url":74,"./buffered-sender":47,"./polling":49,"_process":20,"debug":76,"inherits":19}],51:[function(require,module,exports){
(function (process){(function (){
'use strict';

var inherits = require('inherits')
  , EventEmitter = require('events').EventEmitter
  , EventSourceDriver = require('eventsource')
  ;

var debug = function() {};
if (process.env.NODE_ENV !== 'production') {
  debug = require('debug')('sockjs-client:receiver:eventsource');
}

function EventSourceReceiver(url) {
  debug(url);
  EventEmitter.call(this);

  var self = this;
  var es = this.es = new EventSourceDriver(url);
  es.onmessage = function(e) {
    debug('message', e.data);
    self.emit('message', decodeURI(e.data));
  };
  es.onerror = function(e) {
    debug('error', es.readyState, e);
    // ES on reconnection has readyState = 0 or 1.
    // on network error it's CLOSED = 2
    var reason = (es.readyState !== 2 ? 'network' : 'permanent');
    self._cleanup();
    self._close(reason);
  };
}

inherits(EventSourceReceiver, EventEmitter);

EventSourceReceiver.prototype.abort = function() {
  debug('abort');
  this._cleanup();
  this._close('user');
};

EventSourceReceiver.prototype._cleanup = function() {
  debug('cleanup');
  var es = this.es;
  if (es) {
    es.onmessage = es.onerror = null;
    es.close();
    this.es = null;
  }
};

EventSourceReceiver.prototype._close = function(reason) {
  debug('close', reason);
  var self = this;
  // Safari and chrome < 15 crash if we close window before
  // waiting for ES cleanup. See:
  // https://code.google.com/p/chromium/issues/detail?id=89155
  setTimeout(function() {
    self.emit('close', null, reason);
    self.removeAllListeners();
  }, 200);
};

module.exports = EventSourceReceiver;

}).call(this)}).call(this,require('_process'))

},{"_process":20,"debug":76,"events":25,"eventsource":40,"inherits":19}],52:[function(require,module,exports){
(function (process,global){(function (){
'use strict';

var inherits = require('inherits')
  , iframeUtils = require('../../utils/iframe')
  , urlUtils = require('../../utils/url')
  , EventEmitter = require('events').EventEmitter
  , random = require('../../utils/random')
  ;

var debug = function() {};
if (process.env.NODE_ENV !== 'production') {
  debug = require('debug')('sockjs-client:receiver:htmlfile');
}

function HtmlfileReceiver(url) {
  debug(url);
  EventEmitter.call(this);
  var self = this;
  iframeUtils.polluteGlobalNamespace();

  this.id = 'a' + random.string(6);
  url = urlUtils.addQuery(url, 'c=' + decodeURIComponent(iframeUtils.WPrefix + '.' + this.id));

  debug('using htmlfile', HtmlfileReceiver.htmlfileEnabled);
  var constructFunc = HtmlfileReceiver.htmlfileEnabled ?
      iframeUtils.createHtmlfile : iframeUtils.createIframe;

  global[iframeUtils.WPrefix][this.id] = {
    start: function() {
      debug('start');
      self.iframeObj.loaded();
    }
  , message: function(data) {
      debug('message', data);
      self.emit('message', data);
    }
  , stop: function() {
      debug('stop');
      self._cleanup();
      self._close('network');
    }
  };
  this.iframeObj = constructFunc(url, function() {
    debug('callback');
    self._cleanup();
    self._close('permanent');
  });
}

inherits(HtmlfileReceiver, EventEmitter);

HtmlfileReceiver.prototype.abort = function() {
  debug('abort');
  this._cleanup();
  this._close('user');
};

HtmlfileReceiver.prototype._cleanup = function() {
  debug('_cleanup');
  if (this.iframeObj) {
    this.iframeObj.cleanup();
    this.iframeObj = null;
  }
  delete global[iframeUtils.WPrefix][this.id];
};

HtmlfileReceiver.prototype._close = function(reason) {
  debug('_close', reason);
  this.emit('close', null, reason);
  this.removeAllListeners();
};

HtmlfileReceiver.htmlfileEnabled = false;

// obfuscate to avoid firewalls
var axo = ['Active'].concat('Object').join('X');
if (axo in global) {
  try {
    HtmlfileReceiver.htmlfileEnabled = !!new global[axo]('htmlfile');
  } catch (x) {
    // intentionally empty
  }
}

HtmlfileReceiver.enabled = HtmlfileReceiver.htmlfileEnabled || iframeUtils.iframeEnabled;

module.exports = HtmlfileReceiver;

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../utils/iframe":69,"../../utils/random":72,"../../utils/url":74,"_process":20,"debug":76,"events":25,"inherits":19}],53:[function(require,module,exports){
(function (process,global){(function (){
'use strict';

var utils = require('../../utils/iframe')
  , random = require('../../utils/random')
  , browser = require('../../utils/browser')
  , urlUtils = require('../../utils/url')
  , inherits = require('inherits')
  , EventEmitter = require('events').EventEmitter
  ;

var debug = function() {};
if (process.env.NODE_ENV !== 'production') {
  debug = require('debug')('sockjs-client:receiver:jsonp');
}

function JsonpReceiver(url) {
  debug(url);
  var self = this;
  EventEmitter.call(this);

  utils.polluteGlobalNamespace();

  this.id = 'a' + random.string(6);
  var urlWithId = urlUtils.addQuery(url, 'c=' + encodeURIComponent(utils.WPrefix + '.' + this.id));

  global[utils.WPrefix][this.id] = this._callback.bind(this);
  this._createScript(urlWithId);

  // Fallback mostly for Konqueror - stupid timer, 35 seconds shall be plenty.
  this.timeoutId = setTimeout(function() {
    debug('timeout');
    self._abort(new Error('JSONP script loaded abnormally (timeout)'));
  }, JsonpReceiver.timeout);
}

inherits(JsonpReceiver, EventEmitter);

JsonpReceiver.prototype.abort = function() {
  debug('abort');
  if (global[utils.WPrefix][this.id]) {
    var err = new Error('JSONP user aborted read');
    err.code = 1000;
    this._abort(err);
  }
};

JsonpReceiver.timeout = 35000;
JsonpReceiver.scriptErrorTimeout = 1000;

JsonpReceiver.prototype._callback = function(data) {
  debug('_callback', data);
  this._cleanup();

  if (this.aborting) {
    return;
  }

  if (data) {
    debug('message', data);
    this.emit('message', data);
  }
  this.emit('close', null, 'network');
  this.removeAllListeners();
};

JsonpReceiver.prototype._abort = function(err) {
  debug('_abort', err);
  this._cleanup();
  this.aborting = true;
  this.emit('close', err.code, err.message);
  this.removeAllListeners();
};

JsonpReceiver.prototype._cleanup = function() {
  debug('_cleanup');
  clearTimeout(this.timeoutId);
  if (this.script2) {
    this.script2.parentNode.removeChild(this.script2);
    this.script2 = null;
  }
  if (this.script) {
    var script = this.script;
    // Unfortunately, you can't really abort script loading of
    // the script.
    script.parentNode.removeChild(script);
    script.onreadystatechange = script.onerror =
        script.onload = script.onclick = null;
    this.script = null;
  }
  delete global[utils.WPrefix][this.id];
};

JsonpReceiver.prototype._scriptError = function() {
  debug('_scriptError');
  var self = this;
  if (this.errorTimer) {
    return;
  }

  this.errorTimer = setTimeout(function() {
    if (!self.loadedOkay) {
      self._abort(new Error('JSONP script loaded abnormally (onerror)'));
    }
  }, JsonpReceiver.scriptErrorTimeout);
};

JsonpReceiver.prototype._createScript = function(url) {
  debug('_createScript', url);
  var self = this;
  var script = this.script = global.document.createElement('script');
  var script2;  // Opera synchronous load trick.

  script.id = 'a' + random.string(8);
  script.src = url;
  script.type = 'text/javascript';
  script.charset = 'UTF-8';
  script.onerror = this._scriptError.bind(this);
  script.onload = function() {
    debug('onload');
    self._abort(new Error('JSONP script loaded abnormally (onload)'));
  };

  // IE9 fires 'error' event after onreadystatechange or before, in random order.
  // Use loadedOkay to determine if actually errored
  script.onreadystatechange = function() {
    debug('onreadystatechange', script.readyState);
    if (/loaded|closed/.test(script.readyState)) {
      if (script && script.htmlFor && script.onclick) {
        self.loadedOkay = true;
        try {
          // In IE, actually execute the script.
          script.onclick();
        } catch (x) {
          // intentionally empty
        }
      }
      if (script) {
        self._abort(new Error('JSONP script loaded abnormally (onreadystatechange)'));
      }
    }
  };
  // IE: event/htmlFor/onclick trick.
  // One can't rely on proper order for onreadystatechange. In order to
  // make sure, set a 'htmlFor' and 'event' properties, so that
  // script code will be installed as 'onclick' handler for the
  // script object. Later, onreadystatechange, manually execute this
  // code. FF and Chrome doesn't work with 'event' and 'htmlFor'
  // set. For reference see:
  //   http://jaubourg.net/2010/07/loading-script-as-onclick-handler-of.html
  // Also, read on that about script ordering:
  //   http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
  if (typeof script.async === 'undefined' && global.document.attachEvent) {
    // According to mozilla docs, in recent browsers script.async defaults
    // to 'true', so we may use it to detect a good browser:
    // https://developer.mozilla.org/en/HTML/Element/script
    if (!browser.isOpera()) {
      // Naively assume we're in IE
      try {
        script.htmlFor = script.id;
        script.event = 'onclick';
      } catch (x) {
        // intentionally empty
      }
      script.async = true;
    } else {
      // Opera, second sync script hack
      script2 = this.script2 = global.document.createElement('script');
      script2.text = "try{var a = document.getElementById('" + script.id + "'); if(a)a.onerror();}catch(x){};";
      script.async = script2.async = false;
    }
  }
  if (typeof script.async !== 'undefined') {
    script.async = true;
  }

  var head = global.document.getElementsByTagName('head')[0];
  head.insertBefore(script, head.firstChild);
  if (script2) {
    head.insertBefore(script2, head.firstChild);
  }
};

module.exports = JsonpReceiver;

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../utils/browser":66,"../../utils/iframe":69,"../../utils/random":72,"../../utils/url":74,"_process":20,"debug":76,"events":25,"inherits":19}],54:[function(require,module,exports){
(function (process){(function (){
'use strict';

var inherits = require('inherits')
  , EventEmitter = require('events').EventEmitter
  ;

var debug = function() {};
if (process.env.NODE_ENV !== 'production') {
  debug = require('debug')('sockjs-client:receiver:xhr');
}

function XhrReceiver(url, AjaxObject) {
  debug(url);
  EventEmitter.call(this);
  var self = this;

  this.bufferPosition = 0;

  this.xo = new AjaxObject('POST', url, null);
  this.xo.on('chunk', this._chunkHandler.bind(this));
  this.xo.once('finish', function(status, text) {
    debug('finish', status, text);
    self._chunkHandler(status, text);
    self.xo = null;
    var reason = status === 200 ? 'network' : 'permanent';
    debug('close', reason);
    self.emit('close', null, reason);
    self._cleanup();
  });
}

inherits(XhrReceiver, EventEmitter);

XhrReceiver.prototype._chunkHandler = function(status, text) {
  debug('_chunkHandler', status);
  if (status !== 200 || !text) {
    return;
  }

  for (var idx = -1; ; this.bufferPosition += idx + 1) {
    var buf = text.slice(this.bufferPosition);
    idx = buf.indexOf('\n');
    if (idx === -1) {
      break;
    }
    var msg = buf.slice(0, idx);
    if (msg) {
      debug('message', msg);
      this.emit('message', msg);
    }
  }
};

XhrReceiver.prototype._cleanup = function() {
  debug('_cleanup');
  this.removeAllListeners();
};

XhrReceiver.prototype.abort = function() {
  debug('abort');
  if (this.xo) {
    this.xo.close();
    debug('close');
    this.emit('close', null, 'user');
    this.xo = null;
  }
  this._cleanup();
};

module.exports = XhrReceiver;

}).call(this)}).call(this,require('_process'))

},{"_process":20,"debug":76,"events":25,"inherits":19}],55:[function(require,module,exports){
(function (process,global){(function (){
'use strict';

var random = require('../../utils/random')
  , urlUtils = require('../../utils/url')
  ;

var debug = function() {};
if (process.env.NODE_ENV !== 'production') {
  debug = require('debug')('sockjs-client:sender:jsonp');
}

var form, area;

function createIframe(id) {
  debug('createIframe', id);
  try {
    // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
    return global.document.createElement('<iframe name="' + id + '">');
  } catch (x) {
    var iframe = global.document.createElement('iframe');
    iframe.name = id;
    return iframe;
  }
}

function createForm() {
  debug('createForm');
  form = global.document.createElement('form');
  form.style.display = 'none';
  form.style.position = 'absolute';
  form.method = 'POST';
  form.enctype = 'application/x-www-form-urlencoded';
  form.acceptCharset = 'UTF-8';

  area = global.document.createElement('textarea');
  area.name = 'd';
  form.appendChild(area);

  global.document.body.appendChild(form);
}

module.exports = function(url, payload, callback) {
  debug(url, payload);
  if (!form) {
    createForm();
  }
  var id = 'a' + random.string(8);
  form.target = id;
  form.action = urlUtils.addQuery(urlUtils.addPath(url, '/jsonp_send'), 'i=' + id);

  var iframe = createIframe(id);
  iframe.id = id;
  iframe.style.display = 'none';
  form.appendChild(iframe);

  try {
    area.value = payload;
  } catch (e) {
    // seriously broken browsers get here
  }
  form.submit();

  var completed = function(err) {
    debug('completed', id, err);
    if (!iframe.onerror) {
      return;
    }
    iframe.onreadystatechange = iframe.onerror = iframe.onload = null;
    // Opera mini doesn't like if we GC iframe
    // immediately, thus this timeout.
    setTimeout(function() {
      debug('cleaning up', id);
      iframe.parentNode.removeChild(iframe);
      iframe = null;
    }, 500);
    area.value = '';
    // It is not possible to detect if the iframe succeeded or
    // failed to submit our form.
    callback(err);
  };
  iframe.onerror = function() {
    debug('onerror', id);
    completed();
  };
  iframe.onload = function() {
    debug('onload', id);
    completed();
  };
  iframe.onreadystatechange = function(e) {
    debug('onreadystatechange', id, iframe.readyState, e);
    if (iframe.readyState === 'complete') {
      completed();
    }
  };
  return function() {
    debug('aborted', id);
    completed(new Error('Aborted'));
  };
};

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../utils/random":72,"../../utils/url":74,"_process":20,"debug":76}],56:[function(require,module,exports){
(function (process,global){(function (){
'use strict';

var EventEmitter = require('events').EventEmitter
  , inherits = require('inherits')
  , eventUtils = require('../../utils/event')
  , browser = require('../../utils/browser')
  , urlUtils = require('../../utils/url')
  ;

var debug = function() {};
if (process.env.NODE_ENV !== 'production') {
  debug = require('debug')('sockjs-client:sender:xdr');
}

// References:
//   http://ajaxian.com/archives/100-line-ajax-wrapper
//   http://msdn.microsoft.com/en-us/library/cc288060(v=VS.85).aspx

function XDRObject(method, url, payload) {
  debug(method, url);
  var self = this;
  EventEmitter.call(this);

  setTimeout(function() {
    self._start(method, url, payload);
  }, 0);
}

inherits(XDRObject, EventEmitter);

XDRObject.prototype._start = function(method, url, payload) {
  debug('_start');
  var self = this;
  var xdr = new global.XDomainRequest();
  // IE caches even POSTs
  url = urlUtils.addQuery(url, 't=' + (+new Date()));

  xdr.onerror = function() {
    debug('onerror');
    self._error();
  };
  xdr.ontimeout = function() {
    debug('ontimeout');
    self._error();
  };
  xdr.onprogress = function() {
    debug('progress', xdr.responseText);
    self.emit('chunk', 200, xdr.responseText);
  };
  xdr.onload = function() {
    debug('load');
    self.emit('finish', 200, xdr.responseText);
    self._cleanup(false);
  };
  this.xdr = xdr;
  this.unloadRef = eventUtils.unloadAdd(function() {
    self._cleanup(true);
  });
  try {
    // Fails with AccessDenied if port number is bogus
    this.xdr.open(method, url);
    if (this.timeout) {
      this.xdr.timeout = this.timeout;
    }
    this.xdr.send(payload);
  } catch (x) {
    this._error();
  }
};

XDRObject.prototype._error = function() {
  this.emit('finish', 0, '');
  this._cleanup(false);
};

XDRObject.prototype._cleanup = function(abort) {
  debug('cleanup', abort);
  if (!this.xdr) {
    return;
  }
  this.removeAllListeners();
  eventUtils.unloadDel(this.unloadRef);

  this.xdr.ontimeout = this.xdr.onerror = this.xdr.onprogress = this.xdr.onload = null;
  if (abort) {
    try {
      this.xdr.abort();
    } catch (x) {
      // intentionally empty
    }
  }
  this.unloadRef = this.xdr = null;
};

XDRObject.prototype.close = function() {
  debug('close');
  this._cleanup(true);
};

// IE 8/9 if the request target uses the same scheme - #79
XDRObject.enabled = !!(global.XDomainRequest && browser.hasDomain());

module.exports = XDRObject;

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../utils/browser":66,"../../utils/event":68,"../../utils/url":74,"_process":20,"debug":76,"events":25,"inherits":19}],57:[function(require,module,exports){
'use strict';

var inherits = require('inherits')
  , XhrDriver = require('../driver/xhr')
  ;

function XHRCorsObject(method, url, payload, opts) {
  XhrDriver.call(this, method, url, payload, opts);
}

inherits(XHRCorsObject, XhrDriver);

XHRCorsObject.enabled = XhrDriver.enabled && XhrDriver.supportsCORS;

module.exports = XHRCorsObject;

},{"../driver/xhr":39,"inherits":19}],58:[function(require,module,exports){
'use strict';

var EventEmitter = require('events').EventEmitter
  , inherits = require('inherits')
  ;

function XHRFake(/* method, url, payload, opts */) {
  var self = this;
  EventEmitter.call(this);

  this.to = setTimeout(function() {
    self.emit('finish', 200, '{}');
  }, XHRFake.timeout);
}

inherits(XHRFake, EventEmitter);

XHRFake.prototype.close = function() {
  clearTimeout(this.to);
};

XHRFake.timeout = 2000;

module.exports = XHRFake;

},{"events":25,"inherits":19}],59:[function(require,module,exports){
'use strict';

var inherits = require('inherits')
  , XhrDriver = require('../driver/xhr')
  ;

function XHRLocalObject(method, url, payload /*, opts */) {
  XhrDriver.call(this, method, url, payload, {
    noCredentials: true
  });
}

inherits(XHRLocalObject, XhrDriver);

XHRLocalObject.enabled = XhrDriver.enabled;

module.exports = XHRLocalObject;

},{"../driver/xhr":39,"inherits":19}],60:[function(require,module,exports){
(function (process){(function (){
'use strict';

var utils = require('../utils/event')
  , urlUtils = require('../utils/url')
  , inherits = require('inherits')
  , EventEmitter = require('events').EventEmitter
  , WebsocketDriver = require('./driver/websocket')
  ;

var debug = function() {};
if (process.env.NODE_ENV !== 'production') {
  debug = require('debug')('sockjs-client:websocket');
}

function WebSocketTransport(transUrl, ignore, options) {
  if (!WebSocketTransport.enabled()) {
    throw new Error('Transport created when disabled');
  }

  EventEmitter.call(this);
  debug('constructor', transUrl);

  var self = this;
  var url = urlUtils.addPath(transUrl, '/websocket');
  if (url.slice(0, 5) === 'https') {
    url = 'wss' + url.slice(5);
  } else {
    url = 'ws' + url.slice(4);
  }
  this.url = url;

  this.ws = new WebsocketDriver(this.url, [], options);
  this.ws.onmessage = function(e) {
    debug('message event', e.data);
    self.emit('message', e.data);
  };
  // Firefox has an interesting bug. If a websocket connection is
  // created after onunload, it stays alive even when user
  // navigates away from the page. In such situation let's lie -
  // let's not open the ws connection at all. See:
  // https://github.com/sockjs/sockjs-client/issues/28
  // https://bugzilla.mozilla.org/show_bug.cgi?id=696085
  this.unloadRef = utils.unloadAdd(function() {
    debug('unload');
    self.ws.close();
  });
  this.ws.onclose = function(e) {
    debug('close event', e.code, e.reason);
    self.emit('close', e.code, e.reason);
    self._cleanup();
  };
  this.ws.onerror = function(e) {
    debug('error event', e);
    self.emit('close', 1006, 'WebSocket connection broken');
    self._cleanup();
  };
}

inherits(WebSocketTransport, EventEmitter);

WebSocketTransport.prototype.send = function(data) {
  var msg = '[' + data + ']';
  debug('send', msg);
  this.ws.send(msg);
};

WebSocketTransport.prototype.close = function() {
  debug('close');
  var ws = this.ws;
  this._cleanup();
  if (ws) {
    ws.close();
  }
};

WebSocketTransport.prototype._cleanup = function() {
  debug('_cleanup');
  var ws = this.ws;
  if (ws) {
    ws.onmessage = ws.onclose = ws.onerror = null;
  }
  utils.unloadDel(this.unloadRef);
  this.unloadRef = this.ws = null;
  this.removeAllListeners();
};

WebSocketTransport.enabled = function() {
  debug('enabled');
  return !!WebsocketDriver;
};
WebSocketTransport.transportName = 'websocket';

// In theory, ws should require 1 round trip. But in chrome, this is
// not very stable over SSL. Most likely a ws connection requires a
// separate SSL connection, in which case 2 round trips are an
// absolute minumum.
WebSocketTransport.roundTrips = 2;

module.exports = WebSocketTransport;

}).call(this)}).call(this,require('_process'))

},{"../utils/event":68,"../utils/url":74,"./driver/websocket":41,"_process":20,"debug":76,"events":25,"inherits":19}],61:[function(require,module,exports){
'use strict';

var inherits = require('inherits')
  , AjaxBasedTransport = require('./lib/ajax-based')
  , XdrStreamingTransport = require('./xdr-streaming')
  , XhrReceiver = require('./receiver/xhr')
  , XDRObject = require('./sender/xdr')
  ;

function XdrPollingTransport(transUrl) {
  if (!XDRObject.enabled) {
    throw new Error('Transport created when disabled');
  }
  AjaxBasedTransport.call(this, transUrl, '/xhr', XhrReceiver, XDRObject);
}

inherits(XdrPollingTransport, AjaxBasedTransport);

XdrPollingTransport.enabled = XdrStreamingTransport.enabled;
XdrPollingTransport.transportName = 'xdr-polling';
XdrPollingTransport.roundTrips = 2; // preflight, ajax

module.exports = XdrPollingTransport;

},{"./lib/ajax-based":46,"./receiver/xhr":54,"./sender/xdr":56,"./xdr-streaming":62,"inherits":19}],62:[function(require,module,exports){
'use strict';

var inherits = require('inherits')
  , AjaxBasedTransport = require('./lib/ajax-based')
  , XhrReceiver = require('./receiver/xhr')
  , XDRObject = require('./sender/xdr')
  ;

// According to:
//   http://stackoverflow.com/questions/1641507/detect-browser-support-for-cross-domain-xmlhttprequests
//   http://hacks.mozilla.org/2009/07/cross-site-xmlhttprequest-with-cors/

function XdrStreamingTransport(transUrl) {
  if (!XDRObject.enabled) {
    throw new Error('Transport created when disabled');
  }
  AjaxBasedTransport.call(this, transUrl, '/xhr_streaming', XhrReceiver, XDRObject);
}

inherits(XdrStreamingTransport, AjaxBasedTransport);

XdrStreamingTransport.enabled = function(info) {
  if (info.cookie_needed || info.nullOrigin) {
    return false;
  }
  return XDRObject.enabled && info.sameScheme;
};

XdrStreamingTransport.transportName = 'xdr-streaming';
XdrStreamingTransport.roundTrips = 2; // preflight, ajax

module.exports = XdrStreamingTransport;

},{"./lib/ajax-based":46,"./receiver/xhr":54,"./sender/xdr":56,"inherits":19}],63:[function(require,module,exports){
'use strict';

var inherits = require('inherits')
  , AjaxBasedTransport = require('./lib/ajax-based')
  , XhrReceiver = require('./receiver/xhr')
  , XHRCorsObject = require('./sender/xhr-cors')
  , XHRLocalObject = require('./sender/xhr-local')
  ;

function XhrPollingTransport(transUrl) {
  if (!XHRLocalObject.enabled && !XHRCorsObject.enabled) {
    throw new Error('Transport created when disabled');
  }
  AjaxBasedTransport.call(this, transUrl, '/xhr', XhrReceiver, XHRCorsObject);
}

inherits(XhrPollingTransport, AjaxBasedTransport);

XhrPollingTransport.enabled = function(info) {
  if (info.nullOrigin) {
    return false;
  }

  if (XHRLocalObject.enabled && info.sameOrigin) {
    return true;
  }
  return XHRCorsObject.enabled;
};

XhrPollingTransport.transportName = 'xhr-polling';
XhrPollingTransport.roundTrips = 2; // preflight, ajax

module.exports = XhrPollingTransport;

},{"./lib/ajax-based":46,"./receiver/xhr":54,"./sender/xhr-cors":57,"./sender/xhr-local":59,"inherits":19}],64:[function(require,module,exports){
(function (global){(function (){
'use strict';

var inherits = require('inherits')
  , AjaxBasedTransport = require('./lib/ajax-based')
  , XhrReceiver = require('./receiver/xhr')
  , XHRCorsObject = require('./sender/xhr-cors')
  , XHRLocalObject = require('./sender/xhr-local')
  , browser = require('../utils/browser')
  ;

function XhrStreamingTransport(transUrl) {
  if (!XHRLocalObject.enabled && !XHRCorsObject.enabled) {
    throw new Error('Transport created when disabled');
  }
  AjaxBasedTransport.call(this, transUrl, '/xhr_streaming', XhrReceiver, XHRCorsObject);
}

inherits(XhrStreamingTransport, AjaxBasedTransport);

XhrStreamingTransport.enabled = function(info) {
  if (info.nullOrigin) {
    return false;
  }
  // Opera doesn't support xhr-streaming #60
  // But it might be able to #92
  if (browser.isOpera()) {
    return false;
  }

  return XHRCorsObject.enabled;
};

XhrStreamingTransport.transportName = 'xhr-streaming';
XhrStreamingTransport.roundTrips = 2; // preflight, ajax

// Safari gets confused when a streaming ajax request is started
// before onload. This causes the load indicator to spin indefinetely.
// Only require body when used in a browser
XhrStreamingTransport.needBody = !!global.document;

module.exports = XhrStreamingTransport;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../utils/browser":66,"./lib/ajax-based":46,"./receiver/xhr":54,"./sender/xhr-cors":57,"./sender/xhr-local":59,"inherits":19}],65:[function(require,module,exports){
(function (global){(function (){
'use strict';

if (global.crypto && global.crypto.getRandomValues) {
  module.exports.randomBytes = function(length) {
    var bytes = new Uint8Array(length);
    global.crypto.getRandomValues(bytes);
    return bytes;
  };
} else {
  module.exports.randomBytes = function(length) {
    var bytes = new Array(length);
    for (var i = 0; i < length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
    return bytes;
  };
}

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],66:[function(require,module,exports){
(function (global){(function (){
'use strict';

module.exports = {
  isOpera: function() {
    return global.navigator &&
      /opera/i.test(global.navigator.userAgent);
  }

, isKonqueror: function() {
    return global.navigator &&
      /konqueror/i.test(global.navigator.userAgent);
  }

  // #187 wrap document.domain in try/catch because of WP8 from file:///
, hasDomain: function () {
    // non-browser client always has a domain
    if (!global.document) {
      return true;
    }

    try {
      return !!global.document.domain;
    } catch (e) {
      return false;
    }
  }
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],67:[function(require,module,exports){
'use strict';

// Some extra characters that Chrome gets wrong, and substitutes with
// something else on the wire.
// eslint-disable-next-line no-control-regex, no-misleading-character-class
var extraEscapable = /[\x00-\x1f\ud800-\udfff\ufffe\uffff\u0300-\u0333\u033d-\u0346\u034a-\u034c\u0350-\u0352\u0357-\u0358\u035c-\u0362\u0374\u037e\u0387\u0591-\u05af\u05c4\u0610-\u0617\u0653-\u0654\u0657-\u065b\u065d-\u065e\u06df-\u06e2\u06eb-\u06ec\u0730\u0732-\u0733\u0735-\u0736\u073a\u073d\u073f-\u0741\u0743\u0745\u0747\u07eb-\u07f1\u0951\u0958-\u095f\u09dc-\u09dd\u09df\u0a33\u0a36\u0a59-\u0a5b\u0a5e\u0b5c-\u0b5d\u0e38-\u0e39\u0f43\u0f4d\u0f52\u0f57\u0f5c\u0f69\u0f72-\u0f76\u0f78\u0f80-\u0f83\u0f93\u0f9d\u0fa2\u0fa7\u0fac\u0fb9\u1939-\u193a\u1a17\u1b6b\u1cda-\u1cdb\u1dc0-\u1dcf\u1dfc\u1dfe\u1f71\u1f73\u1f75\u1f77\u1f79\u1f7b\u1f7d\u1fbb\u1fbe\u1fc9\u1fcb\u1fd3\u1fdb\u1fe3\u1feb\u1fee-\u1fef\u1ff9\u1ffb\u1ffd\u2000-\u2001\u20d0-\u20d1\u20d4-\u20d7\u20e7-\u20e9\u2126\u212a-\u212b\u2329-\u232a\u2adc\u302b-\u302c\uaab2-\uaab3\uf900-\ufa0d\ufa10\ufa12\ufa15-\ufa1e\ufa20\ufa22\ufa25-\ufa26\ufa2a-\ufa2d\ufa30-\ufa6d\ufa70-\ufad9\ufb1d\ufb1f\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufb4e\ufff0-\uffff]/g
  , extraLookup;

// This may be quite slow, so let's delay until user actually uses bad
// characters.
var unrollLookup = function(escapable) {
  var i;
  var unrolled = {};
  var c = [];
  for (i = 0; i < 65536; i++) {
    c.push( String.fromCharCode(i) );
  }
  escapable.lastIndex = 0;
  c.join('').replace(escapable, function(a) {
    unrolled[ a ] = '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
    return '';
  });
  escapable.lastIndex = 0;
  return unrolled;
};

// Quote string, also taking care of unicode characters that browsers
// often break. Especially, take care of unicode surrogates:
// http://en.wikipedia.org/wiki/Mapping_of_Unicode_characters#Surrogates
module.exports = {
  quote: function(string) {
    var quoted = JSON.stringify(string);

    // In most cases this should be very fast and good enough.
    extraEscapable.lastIndex = 0;
    if (!extraEscapable.test(quoted)) {
      return quoted;
    }

    if (!extraLookup) {
      extraLookup = unrollLookup(extraEscapable);
    }

    return quoted.replace(extraEscapable, function(a) {
      return extraLookup[a];
    });
  }
};

},{}],68:[function(require,module,exports){
(function (global){(function (){
'use strict';

var random = require('./random');

var onUnload = {}
  , afterUnload = false
    // detect google chrome packaged apps because they don't allow the 'unload' event
  , isChromePackagedApp = global.chrome && global.chrome.app && global.chrome.app.runtime
  ;

module.exports = {
  attachEvent: function(event, listener) {
    if (typeof global.addEventListener !== 'undefined') {
      global.addEventListener(event, listener, false);
    } else if (global.document && global.attachEvent) {
      // IE quirks.
      // According to: http://stevesouders.com/misc/test-postmessage.php
      // the message gets delivered only to 'document', not 'window'.
      global.document.attachEvent('on' + event, listener);
      // I get 'window' for ie8.
      global.attachEvent('on' + event, listener);
    }
  }

, detachEvent: function(event, listener) {
    if (typeof global.addEventListener !== 'undefined') {
      global.removeEventListener(event, listener, false);
    } else if (global.document && global.detachEvent) {
      global.document.detachEvent('on' + event, listener);
      global.detachEvent('on' + event, listener);
    }
  }

, unloadAdd: function(listener) {
    if (isChromePackagedApp) {
      return null;
    }

    var ref = random.string(8);
    onUnload[ref] = listener;
    if (afterUnload) {
      setTimeout(this.triggerUnloadCallbacks, 0);
    }
    return ref;
  }

, unloadDel: function(ref) {
    if (ref in onUnload) {
      delete onUnload[ref];
    }
  }

, triggerUnloadCallbacks: function() {
    for (var ref in onUnload) {
      onUnload[ref]();
      delete onUnload[ref];
    }
  }
};

var unloadTriggered = function() {
  if (afterUnload) {
    return;
  }
  afterUnload = true;
  module.exports.triggerUnloadCallbacks();
};

// 'unload' alone is not reliable in opera within an iframe, but we
// can't use `beforeunload` as IE fires it on javascript: links.
if (!isChromePackagedApp) {
  module.exports.attachEvent('unload', unloadTriggered);
}

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./random":72}],69:[function(require,module,exports){
(function (process,global){(function (){
'use strict';

var eventUtils = require('./event')
  , browser = require('./browser')
  ;

var debug = function() {};
if (process.env.NODE_ENV !== 'production') {
  debug = require('debug')('sockjs-client:utils:iframe');
}

module.exports = {
  WPrefix: '_jp'
, currentWindowId: null

, polluteGlobalNamespace: function() {
    if (!(module.exports.WPrefix in global)) {
      global[module.exports.WPrefix] = {};
    }
  }

, postMessage: function(type, data) {
    if (global.parent !== global) {
      global.parent.postMessage(JSON.stringify({
        windowId: module.exports.currentWindowId
      , type: type
      , data: data || ''
      }), '*');
    } else {
      debug('Cannot postMessage, no parent window.', type, data);
    }
  }

, createIframe: function(iframeUrl, errorCallback) {
    var iframe = global.document.createElement('iframe');
    var tref, unloadRef;
    var unattach = function() {
      debug('unattach');
      clearTimeout(tref);
      // Explorer had problems with that.
      try {
        iframe.onload = null;
      } catch (x) {
        // intentionally empty
      }
      iframe.onerror = null;
    };
    var cleanup = function() {
      debug('cleanup');
      if (iframe) {
        unattach();
        // This timeout makes chrome fire onbeforeunload event
        // within iframe. Without the timeout it goes straight to
        // onunload.
        setTimeout(function() {
          if (iframe) {
            iframe.parentNode.removeChild(iframe);
          }
          iframe = null;
        }, 0);
        eventUtils.unloadDel(unloadRef);
      }
    };
    var onerror = function(err) {
      debug('onerror', err);
      if (iframe) {
        cleanup();
        errorCallback(err);
      }
    };
    var post = function(msg, origin) {
      debug('post', msg, origin);
      setTimeout(function() {
        try {
          // When the iframe is not loaded, IE raises an exception
          // on 'contentWindow'.
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage(msg, origin);
          }
        } catch (x) {
          // intentionally empty
        }
      }, 0);
    };

    iframe.src = iframeUrl;
    iframe.style.display = 'none';
    iframe.style.position = 'absolute';
    iframe.onerror = function() {
      onerror('onerror');
    };
    iframe.onload = function() {
      debug('onload');
      // `onload` is triggered before scripts on the iframe are
      // executed. Give it few seconds to actually load stuff.
      clearTimeout(tref);
      tref = setTimeout(function() {
        onerror('onload timeout');
      }, 2000);
    };
    global.document.body.appendChild(iframe);
    tref = setTimeout(function() {
      onerror('timeout');
    }, 15000);
    unloadRef = eventUtils.unloadAdd(cleanup);
    return {
      post: post
    , cleanup: cleanup
    , loaded: unattach
    };
  }

/* eslint no-undef: "off", new-cap: "off" */
, createHtmlfile: function(iframeUrl, errorCallback) {
    var axo = ['Active'].concat('Object').join('X');
    var doc = new global[axo]('htmlfile');
    var tref, unloadRef;
    var iframe;
    var unattach = function() {
      clearTimeout(tref);
      iframe.onerror = null;
    };
    var cleanup = function() {
      if (doc) {
        unattach();
        eventUtils.unloadDel(unloadRef);
        iframe.parentNode.removeChild(iframe);
        iframe = doc = null;
        CollectGarbage();
      }
    };
    var onerror = function(r) {
      debug('onerror', r);
      if (doc) {
        cleanup();
        errorCallback(r);
      }
    };
    var post = function(msg, origin) {
      try {
        // When the iframe is not loaded, IE raises an exception
        // on 'contentWindow'.
        setTimeout(function() {
          if (iframe && iframe.contentWindow) {
              iframe.contentWindow.postMessage(msg, origin);
          }
        }, 0);
      } catch (x) {
        // intentionally empty
      }
    };

    doc.open();
    doc.write('<html><s' + 'cript>' +
              'document.domain="' + global.document.domain + '";' +
              '</s' + 'cript></html>');
    doc.close();
    doc.parentWindow[module.exports.WPrefix] = global[module.exports.WPrefix];
    var c = doc.createElement('div');
    doc.body.appendChild(c);
    iframe = doc.createElement('iframe');
    c.appendChild(iframe);
    iframe.src = iframeUrl;
    iframe.onerror = function() {
      onerror('onerror');
    };
    tref = setTimeout(function() {
      onerror('timeout');
    }, 15000);
    unloadRef = eventUtils.unloadAdd(cleanup);
    return {
      post: post
    , cleanup: cleanup
    , loaded: unattach
    };
  }
};

module.exports.iframeEnabled = false;
if (global.document) {
  // postMessage misbehaves in konqueror 4.6.5 - the messages are delivered with
  // huge delay, or not at all.
  module.exports.iframeEnabled = (typeof global.postMessage === 'function' ||
    typeof global.postMessage === 'object') && (!browser.isKonqueror());
}

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./browser":66,"./event":68,"_process":20,"debug":76}],70:[function(require,module,exports){
(function (global){(function (){
'use strict';

var logObject = {};
['log', 'debug', 'warn'].forEach(function (level) {
  var levelExists;

  try {
    levelExists = global.console && global.console[level] && global.console[level].apply;
  } catch(e) {
    // do nothing
  }

  logObject[level] = levelExists ? function () {
    return global.console[level].apply(global.console, arguments);
  } : (level === 'log' ? function () {} : logObject.log);
});

module.exports = logObject;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],71:[function(require,module,exports){
'use strict';

module.exports = {
  isObject: function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  }

, extend: function(obj) {
    if (!this.isObject(obj)) {
      return obj;
    }
    var source, prop;
    for (var i = 1, length = arguments.length; i < length; i++) {
      source = arguments[i];
      for (prop in source) {
        if (Object.prototype.hasOwnProperty.call(source, prop)) {
          obj[prop] = source[prop];
        }
      }
    }
    return obj;
  }
};

},{}],72:[function(require,module,exports){
'use strict';

var crypto = require('crypto');

// This string has length 32, a power of 2, so the modulus doesn't introduce a
// bias.
var _randomStringChars = 'abcdefghijklmnopqrstuvwxyz012345';
module.exports = {
  string: function(length) {
    var max = _randomStringChars.length;
    var bytes = crypto.randomBytes(length);
    var ret = [];
    for (var i = 0; i < length; i++) {
      ret.push(_randomStringChars.substr(bytes[i] % max, 1));
    }
    return ret.join('');
  }

, number: function(max) {
    return Math.floor(Math.random() * max);
  }

, numberString: function(max) {
    var t = ('' + (max - 1)).length;
    var p = new Array(t + 1).join('0');
    return (p + this.number(max)).slice(-t);
  }
};

},{"crypto":65}],73:[function(require,module,exports){
(function (process){(function (){
'use strict';

var debug = function() {};
if (process.env.NODE_ENV !== 'production') {
  debug = require('debug')('sockjs-client:utils:transport');
}

module.exports = function(availableTransports) {
  return {
    filterToEnabled: function(transportsWhitelist, info) {
      var transports = {
        main: []
      , facade: []
      };
      if (!transportsWhitelist) {
        transportsWhitelist = [];
      } else if (typeof transportsWhitelist === 'string') {
        transportsWhitelist = [transportsWhitelist];
      }

      availableTransports.forEach(function(trans) {
        if (!trans) {
          return;
        }

        if (trans.transportName === 'websocket' && info.websocket === false) {
          debug('disabled from server', 'websocket');
          return;
        }

        if (transportsWhitelist.length &&
            transportsWhitelist.indexOf(trans.transportName) === -1) {
          debug('not in whitelist', trans.transportName);
          return;
        }

        if (trans.enabled(info)) {
          debug('enabled', trans.transportName);
          transports.main.push(trans);
          if (trans.facadeTransport) {
            transports.facade.push(trans.facadeTransport);
          }
        } else {
          debug('disabled', trans.transportName);
        }
      });
      return transports;
    }
  };
};

}).call(this)}).call(this,require('_process'))

},{"_process":20,"debug":76}],74:[function(require,module,exports){
(function (process){(function (){
'use strict';

var URL = require('url-parse');

var debug = function() {};
if (process.env.NODE_ENV !== 'production') {
  debug = require('debug')('sockjs-client:utils:url');
}

module.exports = {
  getOrigin: function(url) {
    if (!url) {
      return null;
    }

    var p = new URL(url);
    if (p.protocol === 'file:') {
      return null;
    }

    var port = p.port;
    if (!port) {
      port = (p.protocol === 'https:') ? '443' : '80';
    }

    return p.protocol + '//' + p.hostname + ':' + port;
  }

, isOriginEqual: function(a, b) {
    var res = this.getOrigin(a) === this.getOrigin(b);
    debug('same', a, b, res);
    return res;
  }

, isSchemeEqual: function(a, b) {
    return (a.split(':')[0] === b.split(':')[0]);
  }

, addPath: function (url, path) {
    var qs = url.split('?');
    return qs[0] + path + (qs[1] ? '?' + qs[1] : '');
  }

, addQuery: function (url, q) {
    return url + (url.indexOf('?') === -1 ? ('?' + q) : ('&' + q));
  }

, isLoopbackAddr: function (addr) {
    return /^127\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr) || /^\[::1\]$/.test(addr);
  }
};

}).call(this)}).call(this,require('_process'))

},{"_process":20,"debug":76,"url-parse":79}],75:[function(require,module,exports){
module.exports = '1.6.0';

},{}],76:[function(require,module,exports){
(function (process){(function (){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
/**
 * Colors.
 */

exports.colors = ['#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC', '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF', '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC', '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF', '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC', '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033', '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366', '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933', '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC', '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF', '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'];
/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */
// eslint-disable-next-line complexity

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
    return true;
  } // Internet Explorer and Edge do not support colors.


  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  } // Is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632


  return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
  typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
  // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
}
/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */


function formatArgs(args) {
  args[0] = (this.useColors ? '%c' : '') + this.namespace + (this.useColors ? ' %c' : ' ') + args[0] + (this.useColors ? '%c ' : ' ') + '+' + module.exports.humanize(this.diff);

  if (!this.useColors) {
    return;
  }

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit'); // The final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into

  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function (match) {
    if (match === '%%') {
      return;
    }

    index++;

    if (match === '%c') {
      // We only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });
  args.splice(lastC, 0, c);
}
/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */


function log() {
  var _console;

  // This hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return (typeof console === "undefined" ? "undefined" : _typeof(console)) === 'object' && console.log && (_console = console).log.apply(_console, arguments);
}
/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */


function save(namespaces) {
  try {
    if (namespaces) {
      exports.storage.setItem('debug', namespaces);
    } else {
      exports.storage.removeItem('debug');
    }
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  }
}
/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */


function load() {
  var r;

  try {
    r = exports.storage.getItem('debug');
  } catch (error) {} // Swallow
  // XXX (@Qix-) should we be logging these?
  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG


  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}
/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */


function localstorage() {
  try {
    // TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
    // The Browser also has localStorage in the global context.
    return localStorage;
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  }
}

module.exports = require('./common')(exports);
var formatters = module.exports.formatters;
/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
  try {
    return JSON.stringify(v);
  } catch (error) {
    return '[UnexpectedJSONParseError]: ' + error.message;
  }
};


}).call(this)}).call(this,require('_process'))

},{"./common":77,"_process":20}],77:[function(require,module,exports){
"use strict";

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */
function setup(env) {
  createDebug.debug = createDebug;
  createDebug.default = createDebug;
  createDebug.coerce = coerce;
  createDebug.disable = disable;
  createDebug.enable = enable;
  createDebug.enabled = enabled;
  createDebug.humanize = require('ms');
  Object.keys(env).forEach(function (key) {
    createDebug[key] = env[key];
  });
  /**
  * Active `debug` instances.
  */

  createDebug.instances = [];
  /**
  * The currently active debug mode names, and names to skip.
  */

  createDebug.names = [];
  createDebug.skips = [];
  /**
  * Map of special "%n" handling functions, for the debug "format" argument.
  *
  * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
  */

  createDebug.formatters = {};
  /**
  * Selects a color for a debug namespace
  * @param {String} namespace The namespace string for the for the debug instance to be colored
  * @return {Number|String} An ANSI color code for the given namespace
  * @api private
  */

  function selectColor(namespace) {
    var hash = 0;

    for (var i = 0; i < namespace.length; i++) {
      hash = (hash << 5) - hash + namespace.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }

    return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
  }

  createDebug.selectColor = selectColor;
  /**
  * Create a debugger with the given `namespace`.
  *
  * @param {String} namespace
  * @return {Function}
  * @api public
  */

  function createDebug(namespace) {
    var prevTime;

    function debug() {
      // Disabled?
      if (!debug.enabled) {
        return;
      }

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var self = debug; // Set `diff` timestamp

      var curr = Number(new Date());
      var ms = curr - (prevTime || curr);
      self.diff = ms;
      self.prev = prevTime;
      self.curr = curr;
      prevTime = curr;
      args[0] = createDebug.coerce(args[0]);

      if (typeof args[0] !== 'string') {
        // Anything else let's inspect with %O
        args.unshift('%O');
      } // Apply any `formatters` transformations


      var index = 0;
      args[0] = args[0].replace(/%([a-zA-Z%])/g, function (match, format) {
        // If we encounter an escaped % then don't increase the array index
        if (match === '%%') {
          return match;
        }

        index++;
        var formatter = createDebug.formatters[format];

        if (typeof formatter === 'function') {
          var val = args[index];
          match = formatter.call(self, val); // Now we need to remove `args[index]` since it's inlined in the `format`

          args.splice(index, 1);
          index--;
        }

        return match;
      }); // Apply env-specific formatting (colors, etc.)

      createDebug.formatArgs.call(self, args);
      var logFn = self.log || createDebug.log;
      logFn.apply(self, args);
    }

    debug.namespace = namespace;
    debug.enabled = createDebug.enabled(namespace);
    debug.useColors = createDebug.useColors();
    debug.color = selectColor(namespace);
    debug.destroy = destroy;
    debug.extend = extend; // Debug.formatArgs = formatArgs;
    // debug.rawLog = rawLog;
    // env-specific initialization logic for debug instances

    if (typeof createDebug.init === 'function') {
      createDebug.init(debug);
    }

    createDebug.instances.push(debug);
    return debug;
  }

  function destroy() {
    var index = createDebug.instances.indexOf(this);

    if (index !== -1) {
      createDebug.instances.splice(index, 1);
      return true;
    }

    return false;
  }

  function extend(namespace, delimiter) {
    return createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
  }
  /**
  * Enables a debug mode by namespaces. This can include modes
  * separated by a colon and wildcards.
  *
  * @param {String} namespaces
  * @api public
  */


  function enable(namespaces) {
    createDebug.save(namespaces);
    createDebug.names = [];
    createDebug.skips = [];
    var i;
    var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
    var len = split.length;

    for (i = 0; i < len; i++) {
      if (!split[i]) {
        // ignore empty strings
        continue;
      }

      namespaces = split[i].replace(/\*/g, '.*?');

      if (namespaces[0] === '-') {
        createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
      } else {
        createDebug.names.push(new RegExp('^' + namespaces + '$'));
      }
    }

    for (i = 0; i < createDebug.instances.length; i++) {
      var instance = createDebug.instances[i];
      instance.enabled = createDebug.enabled(instance.namespace);
    }
  }
  /**
  * Disable debug output.
  *
  * @api public
  */


  function disable() {
    createDebug.enable('');
  }
  /**
  * Returns true if the given mode name is enabled, false otherwise.
  *
  * @param {String} name
  * @return {Boolean}
  * @api public
  */


  function enabled(name) {
    if (name[name.length - 1] === '*') {
      return true;
    }

    var i;
    var len;

    for (i = 0, len = createDebug.skips.length; i < len; i++) {
      if (createDebug.skips[i].test(name)) {
        return false;
      }
    }

    for (i = 0, len = createDebug.names.length; i < len; i++) {
      if (createDebug.names[i].test(name)) {
        return true;
      }
    }

    return false;
  }
  /**
  * Coerce `val`.
  *
  * @param {Mixed} val
  * @return {Mixed}
  * @api private
  */


  function coerce(val) {
    if (val instanceof Error) {
      return val.stack || val.message;
    }

    return val;
  }

  createDebug.enable(createDebug.load());
  return createDebug;
}

module.exports = setup;


},{"ms":78}],78:[function(require,module,exports){
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function (val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}

},{}],79:[function(require,module,exports){
(function (global){(function (){
'use strict';

var required = require('requires-port')
  , qs = require('querystringify')
  , controlOrWhitespace = /^[\x00-\x20\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/
  , CRHTLF = /[\n\r\t]/g
  , slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//
  , port = /:\d+$/
  , protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\\/]+)?([\S\s]*)/i
  , windowsDriveLetter = /^[a-zA-Z]:/;

/**
 * Remove control characters and whitespace from the beginning of a string.
 *
 * @param {Object|String} str String to trim.
 * @returns {String} A new string representing `str` stripped of control
 *     characters and whitespace from its beginning.
 * @public
 */
function trimLeft(str) {
  return (str ? str : '').toString().replace(controlOrWhitespace, '');
}

/**
 * These are the parse rules for the URL parser, it informs the parser
 * about:
 *
 * 0. The char it Needs to parse, if it's a string it should be done using
 *    indexOf, RegExp using exec and NaN means set as current value.
 * 1. The property we should set when parsing this value.
 * 2. Indication if it's backwards or forward parsing, when set as number it's
 *    the value of extra chars that should be split off.
 * 3. Inherit from location if non existing in the parser.
 * 4. `toLowerCase` the resulting value.
 */
var rules = [
  ['#', 'hash'],                        // Extract from the back.
  ['?', 'query'],                       // Extract from the back.
  function sanitize(address, url) {     // Sanitize what is left of the address
    return isSpecial(url.protocol) ? address.replace(/\\/g, '/') : address;
  },
  ['/', 'pathname'],                    // Extract from the back.
  ['@', 'auth', 1],                     // Extract from the front.
  [NaN, 'host', undefined, 1, 1],       // Set left over value.
  [/:(\d*)$/, 'port', undefined, 1],    // RegExp the back.
  [NaN, 'hostname', undefined, 1, 1]    // Set left over.
];

/**
 * These properties should not be copied or inherited from. This is only needed
 * for all non blob URL's as a blob URL does not include a hash, only the
 * origin.
 *
 * @type {Object}
 * @private
 */
var ignore = { hash: 1, query: 1 };

/**
 * The location object differs when your code is loaded through a normal page,
 * Worker or through a worker using a blob. And with the blobble begins the
 * trouble as the location object will contain the URL of the blob, not the
 * location of the page where our code is loaded in. The actual origin is
 * encoded in the `pathname` so we can thankfully generate a good "default"
 * location from it so we can generate proper relative URL's again.
 *
 * @param {Object|String} loc Optional default location object.
 * @returns {Object} lolcation object.
 * @public
 */
function lolcation(loc) {
  var globalVar;

  if (typeof window !== 'undefined') globalVar = window;
  else if (typeof global !== 'undefined') globalVar = global;
  else if (typeof self !== 'undefined') globalVar = self;
  else globalVar = {};

  var location = globalVar.location || {};
  loc = loc || location;

  var finaldestination = {}
    , type = typeof loc
    , key;

  if ('blob:' === loc.protocol) {
    finaldestination = new Url(unescape(loc.pathname), {});
  } else if ('string' === type) {
    finaldestination = new Url(loc, {});
    for (key in ignore) delete finaldestination[key];
  } else if ('object' === type) {
    for (key in loc) {
      if (key in ignore) continue;
      finaldestination[key] = loc[key];
    }

    if (finaldestination.slashes === undefined) {
      finaldestination.slashes = slashes.test(loc.href);
    }
  }

  return finaldestination;
}

/**
 * Check whether a protocol scheme is special.
 *
 * @param {String} The protocol scheme of the URL
 * @return {Boolean} `true` if the protocol scheme is special, else `false`
 * @private
 */
function isSpecial(scheme) {
  return (
    scheme === 'file:' ||
    scheme === 'ftp:' ||
    scheme === 'http:' ||
    scheme === 'https:' ||
    scheme === 'ws:' ||
    scheme === 'wss:'
  );
}

/**
 * @typedef ProtocolExtract
 * @type Object
 * @property {String} protocol Protocol matched in the URL, in lowercase.
 * @property {Boolean} slashes `true` if protocol is followed by "//", else `false`.
 * @property {String} rest Rest of the URL that is not part of the protocol.
 */

/**
 * Extract protocol information from a URL with/without double slash ("//").
 *
 * @param {String} address URL we want to extract from.
 * @param {Object} location
 * @return {ProtocolExtract} Extracted information.
 * @private
 */
function extractProtocol(address, location) {
  address = trimLeft(address);
  address = address.replace(CRHTLF, '');
  location = location || {};

  var match = protocolre.exec(address);
  var protocol = match[1] ? match[1].toLowerCase() : '';
  var forwardSlashes = !!match[2];
  var otherSlashes = !!match[3];
  var slashesCount = 0;
  var rest;

  if (forwardSlashes) {
    if (otherSlashes) {
      rest = match[2] + match[3] + match[4];
      slashesCount = match[2].length + match[3].length;
    } else {
      rest = match[2] + match[4];
      slashesCount = match[2].length;
    }
  } else {
    if (otherSlashes) {
      rest = match[3] + match[4];
      slashesCount = match[3].length;
    } else {
      rest = match[4]
    }
  }

  if (protocol === 'file:') {
    if (slashesCount >= 2) {
      rest = rest.slice(2);
    }
  } else if (isSpecial(protocol)) {
    rest = match[4];
  } else if (protocol) {
    if (forwardSlashes) {
      rest = rest.slice(2);
    }
  } else if (slashesCount >= 2 && isSpecial(location.protocol)) {
    rest = match[4];
  }

  return {
    protocol: protocol,
    slashes: forwardSlashes || isSpecial(protocol),
    slashesCount: slashesCount,
    rest: rest
  };
}

/**
 * Resolve a relative URL pathname against a base URL pathname.
 *
 * @param {String} relative Pathname of the relative URL.
 * @param {String} base Pathname of the base URL.
 * @return {String} Resolved pathname.
 * @private
 */
function resolve(relative, base) {
  if (relative === '') return base;

  var path = (base || '/').split('/').slice(0, -1).concat(relative.split('/'))
    , i = path.length
    , last = path[i - 1]
    , unshift = false
    , up = 0;

  while (i--) {
    if (path[i] === '.') {
      path.splice(i, 1);
    } else if (path[i] === '..') {
      path.splice(i, 1);
      up++;
    } else if (up) {
      if (i === 0) unshift = true;
      path.splice(i, 1);
      up--;
    }
  }

  if (unshift) path.unshift('');
  if (last === '.' || last === '..') path.push('');

  return path.join('/');
}

/**
 * The actual URL instance. Instead of returning an object we've opted-in to
 * create an actual constructor as it's much more memory efficient and
 * faster and it pleases my OCD.
 *
 * It is worth noting that we should not use `URL` as class name to prevent
 * clashes with the global URL instance that got introduced in browsers.
 *
 * @constructor
 * @param {String} address URL we want to parse.
 * @param {Object|String} [location] Location defaults for relative paths.
 * @param {Boolean|Function} [parser] Parser for the query string.
 * @private
 */
function Url(address, location, parser) {
  address = trimLeft(address);
  address = address.replace(CRHTLF, '');

  if (!(this instanceof Url)) {
    return new Url(address, location, parser);
  }

  var relative, extracted, parse, instruction, index, key
    , instructions = rules.slice()
    , type = typeof location
    , url = this
    , i = 0;

  //
  // The following if statements allows this module two have compatibility with
  // 2 different API:
  //
  // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
  //    where the boolean indicates that the query string should also be parsed.
  //
  // 2. The `URL` interface of the browser which accepts a URL, object as
  //    arguments. The supplied object will be used as default values / fall-back
  //    for relative paths.
  //
  if ('object' !== type && 'string' !== type) {
    parser = location;
    location = null;
  }

  if (parser && 'function' !== typeof parser) parser = qs.parse;

  location = lolcation(location);

  //
  // Extract protocol information before running the instructions.
  //
  extracted = extractProtocol(address || '', location);
  relative = !extracted.protocol && !extracted.slashes;
  url.slashes = extracted.slashes || relative && location.slashes;
  url.protocol = extracted.protocol || location.protocol || '';
  address = extracted.rest;

  //
  // When the authority component is absent the URL starts with a path
  // component.
  //
  if (
    extracted.protocol === 'file:' && (
      extracted.slashesCount !== 2 || windowsDriveLetter.test(address)) ||
    (!extracted.slashes &&
      (extracted.protocol ||
        extracted.slashesCount < 2 ||
        !isSpecial(url.protocol)))
  ) {
    instructions[3] = [/(.*)/, 'pathname'];
  }

  for (; i < instructions.length; i++) {
    instruction = instructions[i];

    if (typeof instruction === 'function') {
      address = instruction(address, url);
      continue;
    }

    parse = instruction[0];
    key = instruction[1];

    if (parse !== parse) {
      url[key] = address;
    } else if ('string' === typeof parse) {
      index = parse === '@'
        ? address.lastIndexOf(parse)
        : address.indexOf(parse);

      if (~index) {
        if ('number' === typeof instruction[2]) {
          url[key] = address.slice(0, index);
          address = address.slice(index + instruction[2]);
        } else {
          url[key] = address.slice(index);
          address = address.slice(0, index);
        }
      }
    } else if ((index = parse.exec(address))) {
      url[key] = index[1];
      address = address.slice(0, index.index);
    }

    url[key] = url[key] || (
      relative && instruction[3] ? location[key] || '' : ''
    );

    //
    // Hostname, host and protocol should be lowercased so they can be used to
    // create a proper `origin`.
    //
    if (instruction[4]) url[key] = url[key].toLowerCase();
  }

  //
  // Also parse the supplied query string in to an object. If we're supplied
  // with a custom parser as function use that instead of the default build-in
  // parser.
  //
  if (parser) url.query = parser(url.query);

  //
  // If the URL is relative, resolve the pathname against the base URL.
  //
  if (
      relative
    && location.slashes
    && url.pathname.charAt(0) !== '/'
    && (url.pathname !== '' || location.pathname !== '')
  ) {
    url.pathname = resolve(url.pathname, location.pathname);
  }

  //
  // Default to a / for pathname if none exists. This normalizes the URL
  // to always have a /
  //
  if (url.pathname.charAt(0) !== '/' && isSpecial(url.protocol)) {
    url.pathname = '/' + url.pathname;
  }

  //
  // We should not add port numbers if they are already the default port number
  // for a given protocol. As the host also contains the port number we're going
  // override it with the hostname which contains no port number.
  //
  if (!required(url.port, url.protocol)) {
    url.host = url.hostname;
    url.port = '';
  }

  //
  // Parse down the `auth` for the username and password.
  //
  url.username = url.password = '';

  if (url.auth) {
    index = url.auth.indexOf(':');

    if (~index) {
      url.username = url.auth.slice(0, index);
      url.username = encodeURIComponent(decodeURIComponent(url.username));

      url.password = url.auth.slice(index + 1);
      url.password = encodeURIComponent(decodeURIComponent(url.password))
    } else {
      url.username = encodeURIComponent(decodeURIComponent(url.auth));
    }

    url.auth = url.password ? url.username +':'+ url.password : url.username;
  }

  url.origin = url.protocol !== 'file:' && isSpecial(url.protocol) && url.host
    ? url.protocol +'//'+ url.host
    : 'null';

  //
  // The href is just the compiled result.
  //
  url.href = url.toString();
}

/**
 * This is convenience method for changing properties in the URL instance to
 * insure that they all propagate correctly.
 *
 * @param {String} part          Property we need to adjust.
 * @param {Mixed} value          The newly assigned value.
 * @param {Boolean|Function} fn  When setting the query, it will be the function
 *                               used to parse the query.
 *                               When setting the protocol, double slash will be
 *                               removed from the final url if it is true.
 * @returns {URL} URL instance for chaining.
 * @public
 */
function set(part, value, fn) {
  var url = this;

  switch (part) {
    case 'query':
      if ('string' === typeof value && value.length) {
        value = (fn || qs.parse)(value);
      }

      url[part] = value;
      break;

    case 'port':
      url[part] = value;

      if (!required(value, url.protocol)) {
        url.host = url.hostname;
        url[part] = '';
      } else if (value) {
        url.host = url.hostname +':'+ value;
      }

      break;

    case 'hostname':
      url[part] = value;

      if (url.port) value += ':'+ url.port;
      url.host = value;
      break;

    case 'host':
      url[part] = value;

      if (port.test(value)) {
        value = value.split(':');
        url.port = value.pop();
        url.hostname = value.join(':');
      } else {
        url.hostname = value;
        url.port = '';
      }

      break;

    case 'protocol':
      url.protocol = value.toLowerCase();
      url.slashes = !fn;
      break;

    case 'pathname':
    case 'hash':
      if (value) {
        var char = part === 'pathname' ? '/' : '#';
        url[part] = value.charAt(0) !== char ? char + value : value;
      } else {
        url[part] = value;
      }
      break;

    case 'username':
    case 'password':
      url[part] = encodeURIComponent(value);
      break;

    case 'auth':
      var index = value.indexOf(':');

      if (~index) {
        url.username = value.slice(0, index);
        url.username = encodeURIComponent(decodeURIComponent(url.username));

        url.password = value.slice(index + 1);
        url.password = encodeURIComponent(decodeURIComponent(url.password));
      } else {
        url.username = encodeURIComponent(decodeURIComponent(value));
      }
  }

  for (var i = 0; i < rules.length; i++) {
    var ins = rules[i];

    if (ins[4]) url[ins[1]] = url[ins[1]].toLowerCase();
  }

  url.auth = url.password ? url.username +':'+ url.password : url.username;

  url.origin = url.protocol !== 'file:' && isSpecial(url.protocol) && url.host
    ? url.protocol +'//'+ url.host
    : 'null';

  url.href = url.toString();

  return url;
}

/**
 * Transform the properties back in to a valid and full URL string.
 *
 * @param {Function} stringify Optional query stringify function.
 * @returns {String} Compiled version of the URL.
 * @public
 */
function toString(stringify) {
  if (!stringify || 'function' !== typeof stringify) stringify = qs.stringify;

  var query
    , url = this
    , host = url.host
    , protocol = url.protocol;

  if (protocol && protocol.charAt(protocol.length - 1) !== ':') protocol += ':';

  var result =
    protocol +
    ((url.protocol && url.slashes) || isSpecial(url.protocol) ? '//' : '');

  if (url.username) {
    result += url.username;
    if (url.password) result += ':'+ url.password;
    result += '@';
  } else if (url.password) {
    result += ':'+ url.password;
    result += '@';
  } else if (
    url.protocol !== 'file:' &&
    isSpecial(url.protocol) &&
    !host &&
    url.pathname !== '/'
  ) {
    //
    // Add back the empty userinfo, otherwise the original invalid URL
    // might be transformed into a valid one with `url.pathname` as host.
    //
    result += '@';
  }

  //
  // Trailing colon is removed from `url.host` when it is parsed. If it still
  // ends with a colon, then add back the trailing colon that was removed. This
  // prevents an invalid URL from being transformed into a valid one.
  //
  if (host[host.length - 1] === ':' || (port.test(url.hostname) && !url.port)) {
    host += ':';
  }

  result += host + url.pathname;

  query = 'object' === typeof url.query ? stringify(url.query) : url.query;
  if (query) result += '?' !== query.charAt(0) ? '?'+ query : query;

  if (url.hash) result += url.hash;

  return result;
}

Url.prototype = { set: set, toString: toString };

//
// Expose the URL parser and some additional properties that might be useful for
// others or testing.
//
Url.extractProtocol = extractProtocol;
Url.location = lolcation;
Url.trimLeft = trimLeft;
Url.qs = qs;

module.exports = Url;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"querystringify":21,"requires-port":22}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJUU2NyaXB0L3RhYmxlcGFnZS9jZWxsL0NlbGwudHMiLCJUU2NyaXB0L3RhYmxlcGFnZS9jZWxsL0NlbGxEcmF3ZXIudHMiLCJUU2NyaXB0L3RhYmxlcGFnZS9tYWluL1RhYmxlLnRzIiwiVFNjcmlwdC90YWJsZXBhZ2UvbWFpbi9UYWJsZU1vZC50cyIsIlRTY3JpcHQvdGFibGVwYWdlL21haW4vVGFibGVQYWdlLnRzIiwiVFNjcmlwdC90YWJsZXBhZ2UvdXRpbGl0aWVzL0FjdGlvbi50cyIsIlRTY3JpcHQvdGFibGVwYWdlL3V0aWxpdGllcy9EaXJlY3Rpb24udHMiLCJUU2NyaXB0L3V0aWwvSHR0cENsaWVudC50cyIsIlRTY3JpcHQvdXRpbC9VdGlsLnRzIiwiVFNjcmlwdC91dGlsL1dlYlNvY2tldENsaWVudC50cyIsIlRTY3JpcHQvdXRpbC9yZXF1ZXN0L0lzTG9nZ2VkSW5SZXF1ZXN0LnRzIiwiVFNjcmlwdC91dGlsL3JlcXVlc3QvVGFibGVJbmZvUmVxdWVzdC50cyIsIlRTY3JpcHQvdXRpbC9yZXF1ZXN0L1RhYmxlTWVzc2FnZXNSZXF1ZXN0LnRzIiwiVFNjcmlwdC91dGlsL3JlcXVlc3QvVXNlckluZm9SZXF1ZXN0LnRzIiwiVFNjcmlwdC91dGlsL3dlYnNvY2tldC9UYWJsZVRvcGljLnRzIiwiVFNjcmlwdC91dGlsL3dlYnNvY2tldC9Ub3BpYy50cyIsIlRTY3JpcHQvdXRpbC93ZWJzb2NrZXQvVXNlclRvcGljLnRzIiwibm9kZV9tb2R1bGVzL0BzdG9tcC9zdG9tcGpzL2J1bmRsZXMvc3RvbXAudW1kLmpzIiwibm9kZV9tb2R1bGVzL2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3F1ZXJ5c3RyaW5naWZ5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3JlcXVpcmVzLXBvcnQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvc29ja2pzLWNsaWVudC9saWIvZW50cnkuanMiLCJub2RlX21vZHVsZXMvc29ja2pzLWNsaWVudC9saWIvZXZlbnQvY2xvc2UuanMiLCJub2RlX21vZHVsZXMvc29ja2pzLWNsaWVudC9saWIvZXZlbnQvZW1pdHRlci5qcyIsIm5vZGVfbW9kdWxlcy9zb2NranMtY2xpZW50L2xpYi9ldmVudC9ldmVudC5qcyIsIm5vZGVfbW9kdWxlcy9zb2NranMtY2xpZW50L2xpYi9ldmVudC9ldmVudHRhcmdldC5qcyIsIm5vZGVfbW9kdWxlcy9zb2NranMtY2xpZW50L2xpYi9ldmVudC90cmFucy1tZXNzYWdlLmpzIiwibm9kZV9tb2R1bGVzL3NvY2tqcy1jbGllbnQvbGliL2ZhY2FkZS5qcyIsIm5vZGVfbW9kdWxlcy9zb2NranMtY2xpZW50L2xpYi9pZnJhbWUtYm9vdHN0cmFwLmpzIiwibm9kZV9tb2R1bGVzL3NvY2tqcy1jbGllbnQvbGliL2luZm8tYWpheC5qcyIsIm5vZGVfbW9kdWxlcy9zb2NranMtY2xpZW50L2xpYi9pbmZvLWlmcmFtZS1yZWNlaXZlci5qcyIsIm5vZGVfbW9kdWxlcy9zb2NranMtY2xpZW50L2xpYi9pbmZvLWlmcmFtZS5qcyIsIm5vZGVfbW9kdWxlcy9zb2NranMtY2xpZW50L2xpYi9pbmZvLXJlY2VpdmVyLmpzIiwibm9kZV9tb2R1bGVzL3NvY2tqcy1jbGllbnQvbGliL2xvY2F0aW9uLmpzIiwibm9kZV9tb2R1bGVzL3NvY2tqcy1jbGllbnQvbGliL21haW4uanMiLCJub2RlX21vZHVsZXMvc29ja2pzLWNsaWVudC9saWIvc2hpbXMuanMiLCJub2RlX21vZHVsZXMvc29ja2pzLWNsaWVudC9saWIvdHJhbnNwb3J0LWxpc3QuanMiLCJub2RlX21vZHVsZXMvc29ja2pzLWNsaWVudC9saWIvdHJhbnNwb3J0L2Jyb3dzZXIvYWJzdHJhY3QteGhyLmpzIiwibm9kZV9tb2R1bGVzL3NvY2tqcy1jbGllbnQvbGliL3RyYW5zcG9ydC9icm93c2VyL2V2ZW50c291cmNlLmpzIiwibm9kZV9tb2R1bGVzL3NvY2tqcy1jbGllbnQvbGliL3RyYW5zcG9ydC9icm93c2VyL3dlYnNvY2tldC5qcyIsIm5vZGVfbW9kdWxlcy9zb2NranMtY2xpZW50L2xpYi90cmFuc3BvcnQvZXZlbnRzb3VyY2UuanMiLCJub2RlX21vZHVsZXMvc29ja2pzLWNsaWVudC9saWIvdHJhbnNwb3J0L2h0bWxmaWxlLmpzIiwibm9kZV9tb2R1bGVzL3NvY2tqcy1jbGllbnQvbGliL3RyYW5zcG9ydC9pZnJhbWUuanMiLCJub2RlX21vZHVsZXMvc29ja2pzLWNsaWVudC9saWIvdHJhbnNwb3J0L2pzb25wLXBvbGxpbmcuanMiLCJub2RlX21vZHVsZXMvc29ja2pzLWNsaWVudC9saWIvdHJhbnNwb3J0L2xpYi9hamF4LWJhc2VkLmpzIiwibm9kZV9tb2R1bGVzL3NvY2tqcy1jbGllbnQvbGliL3RyYW5zcG9ydC9saWIvYnVmZmVyZWQtc2VuZGVyLmpzIiwibm9kZV9tb2R1bGVzL3NvY2tqcy1jbGllbnQvbGliL3RyYW5zcG9ydC9saWIvaWZyYW1lLXdyYXAuanMiLCJub2RlX21vZHVsZXMvc29ja2pzLWNsaWVudC9saWIvdHJhbnNwb3J0L2xpYi9wb2xsaW5nLmpzIiwibm9kZV9tb2R1bGVzL3NvY2tqcy1jbGllbnQvbGliL3RyYW5zcG9ydC9saWIvc2VuZGVyLXJlY2VpdmVyLmpzIiwibm9kZV9tb2R1bGVzL3NvY2tqcy1jbGllbnQvbGliL3RyYW5zcG9ydC9yZWNlaXZlci9ldmVudHNvdXJjZS5qcyIsIm5vZGVfbW9kdWxlcy9zb2NranMtY2xpZW50L2xpYi90cmFuc3BvcnQvcmVjZWl2ZXIvaHRtbGZpbGUuanMiLCJub2RlX21vZHVsZXMvc29ja2pzLWNsaWVudC9saWIvdHJhbnNwb3J0L3JlY2VpdmVyL2pzb25wLmpzIiwibm9kZV9tb2R1bGVzL3NvY2tqcy1jbGllbnQvbGliL3RyYW5zcG9ydC9yZWNlaXZlci94aHIuanMiLCJub2RlX21vZHVsZXMvc29ja2pzLWNsaWVudC9saWIvdHJhbnNwb3J0L3NlbmRlci9qc29ucC5qcyIsIm5vZGVfbW9kdWxlcy9zb2NranMtY2xpZW50L2xpYi90cmFuc3BvcnQvc2VuZGVyL3hkci5qcyIsIm5vZGVfbW9kdWxlcy9zb2NranMtY2xpZW50L2xpYi90cmFuc3BvcnQvc2VuZGVyL3hoci1jb3JzLmpzIiwibm9kZV9tb2R1bGVzL3NvY2tqcy1jbGllbnQvbGliL3RyYW5zcG9ydC9zZW5kZXIveGhyLWZha2UuanMiLCJub2RlX21vZHVsZXMvc29ja2pzLWNsaWVudC9saWIvdHJhbnNwb3J0L3NlbmRlci94aHItbG9jYWwuanMiLCJub2RlX21vZHVsZXMvc29ja2pzLWNsaWVudC9saWIvdHJhbnNwb3J0L3dlYnNvY2tldC5qcyIsIm5vZGVfbW9kdWxlcy9zb2NranMtY2xpZW50L2xpYi90cmFuc3BvcnQveGRyLXBvbGxpbmcuanMiLCJub2RlX21vZHVsZXMvc29ja2pzLWNsaWVudC9saWIvdHJhbnNwb3J0L3hkci1zdHJlYW1pbmcuanMiLCJub2RlX21vZHVsZXMvc29ja2pzLWNsaWVudC9saWIvdHJhbnNwb3J0L3hoci1wb2xsaW5nLmpzIiwibm9kZV9tb2R1bGVzL3NvY2tqcy1jbGllbnQvbGliL3RyYW5zcG9ydC94aHItc3RyZWFtaW5nLmpzIiwibm9kZV9tb2R1bGVzL3NvY2tqcy1jbGllbnQvbGliL3V0aWxzL2Jyb3dzZXItY3J5cHRvLmpzIiwibm9kZV9tb2R1bGVzL3NvY2tqcy1jbGllbnQvbGliL3V0aWxzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvc29ja2pzLWNsaWVudC9saWIvdXRpbHMvZXNjYXBlLmpzIiwibm9kZV9tb2R1bGVzL3NvY2tqcy1jbGllbnQvbGliL3V0aWxzL2V2ZW50LmpzIiwibm9kZV9tb2R1bGVzL3NvY2tqcy1jbGllbnQvbGliL3V0aWxzL2lmcmFtZS5qcyIsIm5vZGVfbW9kdWxlcy9zb2NranMtY2xpZW50L2xpYi91dGlscy9sb2cuanMiLCJub2RlX21vZHVsZXMvc29ja2pzLWNsaWVudC9saWIvdXRpbHMvb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL3NvY2tqcy1jbGllbnQvbGliL3V0aWxzL3JhbmRvbS5qcyIsIm5vZGVfbW9kdWxlcy9zb2NranMtY2xpZW50L2xpYi91dGlscy90cmFuc3BvcnQuanMiLCJub2RlX21vZHVsZXMvc29ja2pzLWNsaWVudC9saWIvdXRpbHMvdXJsLmpzIiwibm9kZV9tb2R1bGVzL3NvY2tqcy1jbGllbnQvbGliL3ZlcnNpb24uanMiLCJub2RlX21vZHVsZXMvc29ja2pzLWNsaWVudC9ub2RlX21vZHVsZXMvZGVidWcvc3JjL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvc29ja2pzLWNsaWVudC9ub2RlX21vZHVsZXMvZGVidWcvc3JjL2NvbW1vbi5qcyIsIm5vZGVfbW9kdWxlcy9zb2NranMtY2xpZW50L25vZGVfbW9kdWxlcy9tcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy91cmwtcGFyc2UvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNBQSwyQ0FBd0M7QUFFeEMsNkNBQTBDO0FBQzFDLG9EQUFpRDtBQUNqRCw4Q0FBK0M7QUFLL0M7SUFNSSxjQUNvQixDQUFTLEVBQ1QsQ0FBUyxFQUN6QixJQUFpQixFQUNELEtBQVk7UUFIWixNQUFDLEdBQUQsQ0FBQyxDQUFRO1FBQ1QsTUFBQyxHQUFELENBQUMsQ0FBUTtRQUVULFVBQUssR0FBTCxLQUFLLENBQU87UUFFNUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLHVCQUFVLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRCxzQkFBVywyQkFBUzthQUFwQjtZQUFBLGlCQVVDO1lBVEcsT0FBTyxDQUFDLFVBQUEsS0FBSztnQkFDVCxJQUFJLEtBQUssQ0FBQyxPQUFPO29CQUFFLE9BQU87Z0JBQzFCLElBQUksS0FBSyxDQUFDLFFBQVE7b0JBQUUsT0FBTztnQkFDM0IsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLFNBQVM7b0JBQUUsS0FBSSxDQUFDLEtBQUssQ0FB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LHFCQUFTLENBQUMsR0FBRyxFQUFFLHFCQUFTLENBQUMsTUFBTSxFQUFFLHFCQUFTLENBQUMsSUFBSSxFQUFFLHFCQUFTLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDeEYsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSSxJQUFLLE9BQUEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUE1QyxDQUE0QyxDQUFDLElBQUksSUFBSTtZQUM1RSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxxQkFBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlDLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFDLElBQUksSUFBSyxPQUFBLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBNUMsQ0FBNEMsQ0FBQyxJQUFJLElBQUk7WUFDNUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMscUJBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFJLElBQUssT0FBQSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFJLENBQUMsQ0FBQyxDQUFDLEVBQTVDLENBQTRDLENBQUMsSUFBSSxJQUFJO1lBQzVFLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLHFCQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDNUMsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSSxJQUFLLE9BQUEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSSxDQUFDLENBQUMsQ0FBQyxFQUE1QyxDQUE0QyxDQUFDLElBQUksSUFBSTtZQUM1RSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxxQkFBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFTSxxQkFBTSxHQUFiO1FBQ0ksSUFBRyxJQUFJLENBQUMsU0FBUztZQUFFLE9BQU87UUFDMUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDdEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVNLHlCQUFVLEdBQWpCO1FBQ0ksSUFBRyxDQUFDLElBQUksQ0FBQyxTQUFTO1lBQUUsT0FBTztRQUMzQixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztRQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFFTSxzQkFBTyxHQUFkO1FBQ0ksT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2pDLENBQUM7SUFFTyxvQkFBSyxHQUFiO1FBQ0ksSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBRU8sc0JBQU8sR0FBZjtRQUNJLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVNLHdCQUFTLEdBQWhCO1FBQ0ksSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBRU0seUJBQVUsR0FBakIsVUFBa0IsSUFBWTtRQUMxQixJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRU0sdUJBQVEsR0FBZixVQUFnQixTQUFTO1FBQ3JCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFTSxrQ0FBbUIsR0FBMUIsVUFBMkIsU0FBUztRQUNoQyxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxLQUFLLENBQUM7WUFDbkQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQzs7WUFFekIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQyxNQUFNLElBQUssT0FBQSxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUExQixDQUEwQixDQUFDLENBQUM7SUFDdEUsQ0FBQztJQUVNLHlCQUFVLEdBQWpCLFVBQWtCLElBQUk7UUFDbEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVNLDBCQUFXLEdBQWxCO1FBQ0ksT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3JDLENBQUM7SUFFRCxzQkFBVyx5QkFBTzthQUFsQjtZQUNJLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDL0IsQ0FBQzs7O09BQUE7SUFFRCxzQkFBVyx5QkFBTzthQUFsQjtZQUNJLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDL0IsQ0FBQzs7O09BQUE7SUFFTyx1QkFBUSxHQUFoQjtRQUNJLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFTSxxQ0FBc0IsR0FBN0I7UUFDSSxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxFQUFDO1lBQ3RCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3hDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztTQUN0QztRQUNELElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBRU0sa0NBQW1CLEdBQTFCO1FBQ0ksSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUk7WUFBRSxPQUFPO1FBQ2xDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDMUIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksSUFBSyxPQUFBLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBZixDQUFlLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQsc0JBQVcsc0JBQUk7YUFBZjtZQUNJLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDNUIsQ0FBQzthQUNELFVBQWdCLElBQVk7WUFDeEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQzVCLENBQUM7OztPQUhBO0lBSUwsV0FBQztBQUFELENBMUxBLEFBMExDLElBQUE7QUExTFksb0JBQUk7Ozs7O0FDUmpCLCtDQUF3QztBQUN4QyxvREFBaUQ7QUFFakQ7SUFJSSxvQkFDSSxJQUFpQixFQUNULE1BQVk7UUFBWixXQUFNLEdBQU4sTUFBTSxDQUFNO1FBRXBCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEIsQ0FBQztJQUVPLHlCQUFJLEdBQVosVUFBYSxJQUFJO1FBQ2IsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDaEMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMxQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRU8sZ0NBQVcsR0FBbkI7UUFBQSxpQkFRQztRQVBHLElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDM0MsS0FBSyxDQUFDLFNBQVMsR0FBRywyQkFBMkIsQ0FBQztRQUM5QyxLQUFLLENBQUMsU0FBUyxHQUFHLFVBQUMsS0FBSyxJQUFLLE9BQUEsS0FBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQTVCLENBQTRCLENBQUM7UUFDMUQsS0FBSyxDQUFDLE1BQU0sR0FBRyxjQUFNLE9BQUEsS0FBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUFyQyxDQUFxQyxDQUFDO1FBQzNELEtBQUssQ0FBQyxPQUFPLEdBQUcsVUFBQyxLQUFLLElBQUssT0FBQSxLQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBMUIsQ0FBMEIsQ0FBQztRQUN0RCxLQUFLLENBQUMsZUFBZSxHQUFHLE1BQU0sQ0FBQztRQUMvQixPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRU8sZ0NBQVcsR0FBbkIsVUFBb0IsS0FBa0I7UUFBdEMsaUJBU0M7UUFSRyxJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsMEVBQTBFLENBQUM7UUFDN0YsS0FBSyxDQUFDLFlBQVksR0FBRyxjQUFNLE9BQUEsS0FBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsRUFBMUIsQ0FBMEIsQ0FBQztRQUN0RCxLQUFLLENBQUMsV0FBVyxHQUFHLGNBQU0sT0FBQSxLQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxFQUF6QixDQUF5QixDQUFDO1FBQ3BELEtBQUssQ0FBQyxXQUFXLEdBQUcsY0FBTSxPQUFBLEtBQUssRUFBTCxDQUFLLENBQUM7UUFDaEMsS0FBSyxDQUFDLGFBQWEsR0FBRyxjQUFNLE9BQUEsS0FBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsRUFBM0IsQ0FBMkIsQ0FBQztRQUN4RCxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3BCLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFTSwwQkFBSyxHQUFaO1FBQ0ksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBRU0sMkJBQU0sR0FBYjs7UUFDSSxDQUFBLEtBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUEsQ0FBQyxNQUFNLFdBQUksaUJBQUssQ0FBQyxpQkFBaUIsRUFBRTtRQUN4RCxDQUFBLEtBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUEsQ0FBQyxHQUFHLFdBQUksaUJBQUssQ0FBQyxlQUFlLEVBQUU7SUFDdkQsQ0FBQztJQUVNLCtCQUFVLEdBQWpCOztRQUNJLENBQUEsS0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQSxDQUFDLE1BQU0sV0FBSSxpQkFBSyxDQUFDLGVBQWUsRUFBRTtRQUN0RCxDQUFBLEtBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUEsQ0FBQyxHQUFHLFdBQUksaUJBQUssQ0FBQyxpQkFBaUIsRUFBRTtJQUN6RCxDQUFDO0lBRU0sNEJBQU8sR0FBZDtRQUNJLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRU0sa0NBQWEsR0FBcEI7UUFBQSxpQkFFQztRQUZvQixvQkFBMEI7YUFBMUIsVUFBMEIsRUFBMUIscUJBQTBCLEVBQTFCLElBQTBCO1lBQTFCLCtCQUEwQjs7UUFDM0MsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFDLFNBQVMsSUFBSyxPQUFBLEtBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLEVBQTVCLENBQTRCLENBQUMsQ0FBQztJQUNwRSxDQUFDO0lBRU0saUNBQVksR0FBbkIsVUFBb0IsU0FBb0I7UUFDcEMsUUFBUSxTQUFTLEVBQUU7WUFDZixLQUFLLHFCQUFTLENBQUMsTUFBTTtnQkFDakIsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO2dCQUM3QyxPQUFPO1lBQ1gsS0FBSyxxQkFBUyxDQUFDLElBQUk7Z0JBQ2YsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUMzQyxPQUFPO1lBQ1gsS0FBSyxxQkFBUyxDQUFDLEtBQUs7Z0JBQ2hCLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQztnQkFDNUMsT0FBTztZQUNYLEtBQUsscUJBQVMsQ0FBQyxHQUFHO2dCQUNkLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDMUMsT0FBTztTQUNkO0lBQ0wsQ0FBQztJQUVNLCtCQUFVLEdBQWpCO1FBQUEsaUJBRUM7UUFGaUIsb0JBQTBCO2FBQTFCLFVBQTBCLEVBQTFCLHFCQUEwQixFQUExQixJQUEwQjtZQUExQiwrQkFBMEI7O1FBQ3hDLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBQyxTQUFTLElBQUssT0FBQSxLQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxFQUF6QixDQUF5QixDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVNLDhCQUFTLEdBQWhCLFVBQWlCLFNBQW9CO1FBQ2pDLFFBQVEsU0FBUyxFQUFFO1lBQ2YsS0FBSyxxQkFBUyxDQUFDLE1BQU07Z0JBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFDMUMsT0FBTztZQUNYLEtBQUsscUJBQVMsQ0FBQyxJQUFJO2dCQUNmLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDeEMsT0FBTztZQUNYLEtBQUsscUJBQVMsQ0FBQyxLQUFLO2dCQUNoQixJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7Z0JBQ3pDLE9BQU87WUFDWCxLQUFLLHFCQUFTLENBQUMsR0FBRztnQkFDZCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQ3ZDLE9BQU87U0FDZDtJQUNMLENBQUM7SUFFTSwwQkFBSyxHQUFaO1FBQUEsaUJBSUM7UUFIRyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUM7UUFDckMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDN0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsY0FBTSxPQUFBLEtBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLEVBQTNCLENBQTJCLENBQUM7SUFDOUQsQ0FBQztJQUVNLDRCQUFPLEdBQWQ7UUFDSSxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUM7UUFDcEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0lBQ2pDLENBQUM7SUFFTSw4QkFBUyxHQUFoQjtRQUNJLElBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM3RCxJQUFHLGNBQWMsR0FBRyxDQUFDO1lBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDOztZQUM5QyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQ25GLENBQUM7SUFFTSwrQkFBVSxHQUFqQixVQUFrQixJQUFJO1FBQ2xCLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQztJQUNuQyxDQUFDO0lBRU0sNkJBQVEsR0FBZixVQUFnQixTQUFTO1FBQ3JCLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRU0sK0JBQVUsR0FBakIsVUFBa0IsSUFBSTtRQUNsQixJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7SUFDbEMsQ0FBQztJQUVNLGdDQUFXLEdBQWxCO1FBQ0ksT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRUQsc0JBQVcsK0JBQU87YUFBbEI7WUFDSSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDaEQsQ0FBQzs7O09BQUE7SUFFRCxzQkFBVywrQkFBTzthQUFsQjtZQUNJLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNoRCxDQUFDOzs7T0FBQTtJQUVELHNCQUFXLDRCQUFJO2FBQWY7WUFDSSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDO1FBQ2xDLENBQUM7YUFDRCxVQUFnQixJQUFZO1lBQ3hCLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztRQUNsQyxDQUFDOzs7T0FIQTtJQUlMLGlCQUFDO0FBQUQsQ0FsSkEsQUFrSkMsSUFBQTtBQWxKWSxnQ0FBVTs7Ozs7QUNKdkIscUNBQW9DO0FBQ3BDLHVDQUFzQztBQUN0Qyw4Q0FBeUQ7QUFDekQsOERBQTZEO0FBQzdELDhEQUE2RDtBQUM3RCx3Q0FBMkM7QUFDM0MsNERBQTJEO0FBQzNELG9EQUFtRDtBQUNuRCxzRUFBcUU7QUFFckU7SUFjSSxlQUFvQixNQUFNO1FBQTFCLGlCQTBCQztRQTFCbUIsV0FBTSxHQUFOLE1BQU0sQ0FBQTtRQVhsQixvQkFBZSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNwQixVQUFLLEdBQWEsRUFBRSxDQUFDO1FBRXJCLGtCQUFhLEdBQVcsRUFBRSxDQUFDO1FBQ25DLFlBQU8sR0FBYSxFQUFFLENBQUM7UUFHdkIsY0FBUyxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNsQixjQUFTLEdBQW9CLElBQUksaUNBQWUsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO1FBQ3JGLFNBQUksR0FBZSxJQUFJLHVCQUFVLENBQUMseUJBQXlCLENBQUMsQ0FBQztRQUcxRSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksdUJBQVUsQ0FBQyxRQUFRLENBQUMsSUFBQSxlQUFRLEVBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsVUFBQSxPQUFPO1lBQzdDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDckIsS0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQ3pELENBQUMsQ0FBQyxDQUFBO1FBQ0YsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQ3RCLElBQUksaUNBQWUsQ0FBQyxFQUFFLENBQUMsQ0FDeEIsQ0FBQyxJQUFJLENBQUMsVUFBQSxJQUFJO1lBQ1AsS0FBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLHFCQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQ3ZDLEtBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEtBQUksQ0FBQyxTQUFTLEVBQUUsVUFBQSxPQUFPO2dCQUM1QyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBQ3hCLENBQUMsQ0FBQyxDQUFBO1FBQ04sQ0FBQyxDQUFDLENBQUE7UUFDRixJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDMUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQzVCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN4RSxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEIsS0FBSyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsY0FBTSxPQUFBLEtBQUksQ0FBQyxhQUFhLEVBQUUsRUFBcEIsQ0FBb0IsQ0FBQyxDQUFDO1FBQ2hELEtBQUssQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLFVBQUMsS0FBSyxJQUFLLE9BQUEsS0FBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsRUFBekIsQ0FBeUIsQ0FBQyxDQUFDO1FBQzFELENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxVQUFDLEtBQUs7WUFDL0IsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3ZCLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUN4QixPQUFPLEtBQUssQ0FBQztRQUNqQixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTyx5QkFBUyxHQUFqQixVQUFrQixXQUFXLEVBQUUsV0FBVyxFQUFFLFFBQVE7UUFDaEQsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUMzQixJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFTyw4QkFBYyxHQUF0QjtRQUNJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUN0QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNsQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNwQixJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3pDLElBQUksQ0FBQyxTQUFTLEdBQUcsYUFBYSxDQUFDO1lBQy9CLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNqQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLFdBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO2FBQ2xEO1NBQ0o7SUFDTCxDQUFDO0lBRU8scUJBQUssR0FBYixVQUFjLFdBQVc7UUFBekIsaUJBRUM7UUFERyxXQUFXLENBQUMsT0FBTyxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBdkIsQ0FBdUIsQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFTywyQkFBVyxHQUFuQixVQUFvQixVQUFVO1FBQzFCLEtBQUssSUFBSSxDQUFDLEdBQUcsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksVUFBVSxDQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUU7WUFDNUQsS0FBSyxJQUFJLENBQUMsR0FBRyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxVQUFVLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBRTtnQkFDNUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkQsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFFTyx3QkFBUSxHQUFoQixVQUFpQixXQUFXO1FBQTVCLGlCQUVDO1FBREcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFBLFVBQVUsSUFBSSxPQUFBLEtBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLEVBQTVCLENBQTRCLENBQUMsQ0FBQztJQUNwRSxDQUFDO0lBRU8sMkJBQVcsR0FBbkIsVUFBb0IsVUFBVTtRQUMxQixLQUFLLElBQUksQ0FBQyxHQUFHLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFO1lBQzVELEtBQUssSUFBSSxDQUFDLEdBQUcsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksVUFBVSxDQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUU7Z0JBQzVELElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUVPLDJCQUFXLEdBQW5CLFVBQW9CLFFBQVE7UUFBNUIsaUJBRUM7UUFERyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUEsT0FBTyxJQUFJLE9BQUEsS0FBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUEzRCxDQUEyRCxDQUFDLENBQUM7SUFDN0YsQ0FBQztJQUVPLDZCQUFhLEdBQXJCO1FBQ0ksSUFBSSxDQUFDLEdBQUcsR0FBRyxtQkFBUSxDQUFDLElBQUksQ0FBQztRQUN6QixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbEIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFFTywwQkFBVSxHQUFsQjtRQUNJLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsSUFBSSxFQUFKLENBQUksQ0FBQyxDQUFDO1FBQ2pELElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNuQyxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNsQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ3BDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdkIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDeEI7SUFDTCxDQUFDO0lBRU8sNkJBQWEsR0FBckIsVUFBc0IsS0FBSztRQUN2QixJQUFJLEtBQUssQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxNQUFNLEVBQUU7WUFDeEMsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztTQUNwQjtJQUNMLENBQUM7SUFFTSx1QkFBTyxHQUFkLFVBQWUsQ0FBUyxFQUFFLENBQVM7UUFDL0IsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLO1lBQ3JELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU0sMEJBQVUsR0FBakIsVUFBa0IsTUFBYztRQUM1QixJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELElBQ00sVUFBVSxJQUFJLElBQUk7WUFDbEIsVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFLLG1CQUFVLENBQUMsS0FBSztZQUNsQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksbUJBQVUsQ0FBQyxjQUFjO1lBQ3RDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzNCLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQy9CO1lBQ0UsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztTQUN0QjtRQUVELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTFCLElBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLG1CQUFVLENBQUMsS0FBSztZQUMvQixNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssbUJBQVUsQ0FBQyxjQUFjO1lBQ3ZDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxtQkFBVSxDQUFDLE1BQU0sRUFDaEM7WUFDRyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUN4QyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDWixDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDWixNQUFNLEVBQUUsSUFBQSxlQUFRLEVBQUMsSUFBSSxDQUFDO2dCQUN0QixJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJO2FBQzlDLENBQUMsQ0FBQTtTQUNMO0lBQ0wsQ0FBQztJQUVNLHlCQUFTLEdBQWhCO1FBQ0ksSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNoQyxRQUFRLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNmLEtBQUssbUJBQVUsQ0FBQyxLQUFLO2dCQUNqQixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDckMsT0FBTztZQUNYLDBCQUEwQjtZQUMxQix3REFBd0Q7WUFDeEQsY0FBYztZQUNkLEtBQUssbUJBQVUsQ0FBQyxjQUFjO2dCQUMxQixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDckMsT0FBTztTQUNkO0lBQ0wsQ0FBQztJQUVPLHlCQUFTLEdBQWpCLFVBQWtCLENBQVMsRUFBRSxDQUFTO1FBQ2xDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ25DLENBQUM7SUFFTywwQkFBVSxHQUFsQixVQUFtQixDQUFTLEVBQUUsQ0FBUyxFQUFFLElBQVk7UUFDakQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFTSwyQkFBVyxHQUFsQixVQUFtQixDQUFTLEVBQUUsQ0FBUyxFQUFFLElBQVU7UUFBbkQsaUJBd0JDO1FBdkJHLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxnQkFBUyxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsc0JBQVksSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLFFBQUssQ0FBQyxDQUFDO1FBQzNGLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFHLENBQUMsZUFBSyxDQUFDLENBQUUsQ0FBQyxDQUFDO1FBRWxELElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDbkQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztRQUMvQixNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3JCLE1BQU0sQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLGNBQU0sT0FBQSxJQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQXRDLENBQXNDLENBQUMsQ0FBQztRQUVsRSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ3RELFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdEIsUUFBUSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUU7WUFDakIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2IsS0FBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDcEQsUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN0QixRQUFRLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRTtZQUNqQixJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztZQUMzQixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDYixLQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU0sMkJBQVcsR0FBbEI7UUFDSSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBQ0wsWUFBQztBQUFELENBcE1BLEFBb01DLElBQUE7QUFwTVksc0JBQUs7Ozs7O0FDVmxCLElBQVksUUFHWDtBQUhELFdBQVksUUFBUTtJQUNoQix1Q0FBSSxDQUFBO0lBQ0osaURBQVMsQ0FBQTtBQUNiLENBQUMsRUFIVyxRQUFRLEdBQVIsZ0JBQVEsS0FBUixnQkFBUSxRQUduQjs7Ozs7QUNIRCxpQ0FBOEI7QUFDOUIsb0RBQWlEO0FBQ2pELHdFQUFxRTtBQUNyRSwwRUFBdUU7QUFDdkUsZ0ZBQTZFO0FBQzdFLHdDQUEyQztBQUUzQyxJQUFJLEtBQUssQ0FBQztBQUNWLElBQU0sSUFBSSxHQUFHLHlCQUF5QixDQUFDO0FBQ3ZDLElBQU0sV0FBVyxHQUFHO0lBQ2hCO1FBQ0ksT0FBTyxFQUFFLEVBQUU7UUFDWCxPQUFPLEVBQUUsRUFBRTtRQUNYLFVBQVUsRUFBRSxFQUFFO1FBQ2QsVUFBVSxFQUFFLEVBQUU7S0FDakI7SUFDRDtRQUNJLE9BQU8sRUFBRSxFQUFFO1FBQ1gsT0FBTyxFQUFFLEVBQUU7UUFDWCxVQUFVLEVBQUUsRUFBRTtRQUNkLFVBQVUsRUFBRSxFQUFFO0tBQ2pCO0NBQ0osQ0FBQztBQUNGLElBQU0sV0FBVyxHQUFHO0lBQ2hCO1FBQ0ksT0FBTyxFQUFFLEVBQUU7UUFDWCxPQUFPLEVBQUUsRUFBRTtRQUNYLFVBQVUsRUFBRSxFQUFFO1FBQ2QsVUFBVSxFQUFFLEVBQUU7UUFDZCxPQUFPLEVBQUUsaUZBQWlGO0tBQzdGO0lBQ0Q7UUFDSSxPQUFPLEVBQUUsRUFBRTtRQUNYLE9BQU8sRUFBRSxFQUFFO1FBQ1gsVUFBVSxFQUFFLEVBQUU7UUFDZCxVQUFVLEVBQUUsRUFBRTtRQUNkLE9BQU8sRUFBRSwyRkFBMkY7S0FDdkc7Q0FDSixDQUFBO0FBQ1UsUUFBQSxLQUFLLEdBQVE7SUFDcEIsTUFBTSxFQUFFLEVBQUU7SUFDVixLQUFLLEVBQUUsRUFBRTtJQUNULFdBQVcsRUFBRTtRQUNUO1lBQ0ksT0FBTyxFQUFFLEVBQUU7WUFDWCxPQUFPLEVBQUUsRUFBRTtZQUNYLFVBQVUsRUFBRSxFQUFFO1lBQ2QsVUFBVSxFQUFFLEVBQUU7U0FDakI7UUFDRDtZQUNJLE9BQU8sRUFBRSxFQUFFO1lBQ1gsT0FBTyxFQUFFLEVBQUU7WUFDWCxVQUFVLEVBQUUsRUFBRTtZQUNkLFVBQVUsRUFBRSxFQUFFO1NBQ2pCO0tBQ0o7SUFDRCxRQUFRLEVBQUU7UUFDTjtZQUNJLENBQUMsRUFBRSxFQUFFO1lBQ0wsQ0FBQyxFQUFFLEVBQUU7WUFDTCxJQUFJLEVBQUUsMkRBQTJEO1NBQ3BFO0tBQ0o7SUFDRCxlQUFlLEVBQUUsQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDO0lBQzFDLGlCQUFpQixFQUFFLENBQUMsV0FBVyxDQUFDO0NBQ25DLENBQUE7QUFFRCxJQUFNLFVBQVUsR0FBRyxJQUFJLHVCQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDeEMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUU7SUFDakIsVUFBVSxDQUFDLGNBQWMsQ0FDckIsSUFBSSxxQ0FBaUIsRUFBRSxFQUN2QjtRQUNJLEtBQUssQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFBO0lBQ2hELENBQUMsQ0FDSixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7U0FDaEIsSUFBSSxDQUFDLGlCQUFpQixDQUFDO1NBQ3ZCLElBQUksQ0FBQztRQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtRQUM3QixhQUFLLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUNoQyxhQUFLLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUNoQyxLQUFLLEdBQUcsSUFBSSxhQUFLLENBQUMsYUFBSyxDQUFDLENBQUM7SUFDN0IsQ0FBQyxDQUFDLENBQUE7QUFDTixDQUFDLENBQUMsQ0FBQztBQUVILFNBQVMsU0FBUztJQUNkLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxJQUFBLGVBQVEsRUFBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3RDLE9BQU8sVUFBVSxDQUFDLGNBQWMsQ0FDNUIsSUFBSSxtQ0FBZ0IsQ0FBQztRQUNqQixNQUFNLEVBQUUsTUFBTTtLQUNqQixDQUFDLEVBQ0YsVUFBQyxJQUFJLEVBQUUsU0FBUztRQUNaLElBQUcsSUFBSSxLQUFLLEdBQUcsRUFBRTtZQUNiLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtTQUNqQzthQUFJO1lBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBVyxJQUFJLGVBQUssU0FBUywrQkFBNEIsQ0FBQyxDQUFBO1NBQ3pFO0lBQ0wsQ0FBQyxDQUNKLENBQUMsSUFBSSxDQUFDLFVBQUMsS0FBSztRQUNULE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDbEIsYUFBSyxHQUFHLEtBQUssQ0FBQTtJQUNqQixDQUFDLENBQUMsQ0FBQztBQUNQLENBQUM7QUFFRCxTQUFTLGlCQUFpQjtJQUN0QixJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsSUFBQSxlQUFRLEVBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN0QyxPQUFPLFVBQVUsQ0FBQyxjQUFjLENBQzVCLElBQUksMkNBQW9CLENBQUM7UUFDckIsTUFBTSxFQUFFLE1BQU07UUFDZCxhQUFhLEVBQUUsQ0FBQztRQUNoQixhQUFhLEVBQUUsQ0FBQztRQUNoQixpQkFBaUIsRUFBRSxhQUFLLENBQUMsS0FBSyxHQUFHLENBQUM7UUFDbEMsaUJBQWlCLEVBQUUsYUFBSyxDQUFDLE1BQU0sR0FBRyxDQUFDO0tBQ3RDLENBQUMsRUFDRixVQUFDLElBQUksRUFBRSxTQUFTO1FBQ1osSUFBRyxJQUFJLEtBQUssR0FBRyxFQUFDO1lBQ1osT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFHLFNBQVMsQ0FBQyxDQUFBO1NBQ3ZDO1FBQ0QsSUFBRyxJQUFJLEtBQUssR0FBRyxFQUFDO1lBQ1osS0FBSyxDQUFDLFFBQVEsR0FBRyxJQUFJLEdBQUcsV0FBVyxHQUFHLFNBQVMsQ0FBQyxDQUFDO1lBQ2pELE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxXQUFXLEdBQUcsU0FBUyxDQUFDLENBQUM7U0FDMUQ7YUFBTSxJQUFHLElBQUksS0FBSyxHQUFHLElBQUksU0FBUyxLQUFLLDJCQUEyQixFQUFDO1lBQ2hFLEtBQUssQ0FBQyxrREFBa0QsQ0FBQyxDQUFBO1NBQzVEO2FBQUssSUFDRixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxLQUFLLGVBQWU7WUFDOUMsU0FBUyxLQUFLLHlCQUF5QixDQUMxQyxFQUFDLEVBQUUsb0JBQW9CO1lBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQVcsYUFBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLHNCQUFZLGFBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFFLENBQUMsQ0FBQTtZQUNyRSxLQUFLLENBQUMsZ0NBQWdDLENBQUMsQ0FBQTtTQUMxQztJQUNMLENBQUMsQ0FDSixDQUFDLElBQUksQ0FBQyxVQUFDLFFBQVE7UUFDWixhQUFLLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQTtJQUM3QixDQUFDLENBQUMsQ0FBQztBQUNQLENBQUM7Ozs7O0FDcElELElBQVksVUFLWDtBQUxELFdBQVksVUFBVTtJQUNsQiw2Q0FBSyxDQUFBO0lBQ0wsK0RBQWMsQ0FBQTtJQUNkLCtDQUFNLENBQUE7SUFDTiw2Q0FBSyxDQUFBO0FBQ1QsQ0FBQyxFQUxXLFVBQVUsR0FBVixrQkFBVSxLQUFWLGtCQUFVLFFBS3JCOzs7OztBQ05ELElBQVksU0FLWDtBQUxELFdBQVksU0FBUztJQUNqQix5Q0FBSSxDQUFBO0lBQ0osMkNBQUssQ0FBQTtJQUNMLHVDQUFHLENBQUE7SUFDSCw2Q0FBTSxDQUFBO0FBQ1YsQ0FBQyxFQUxXLFNBQVMsR0FBVCxpQkFBUyxLQUFULGlCQUFTLFFBS3BCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0ZEO0lBQ0ksb0JBQTZCLE9BQWU7UUFBZixZQUFPLEdBQVAsT0FBTyxDQUFRO0lBQUcsQ0FBQztJQUUxQyxtQ0FBYyxHQUFwQixVQUNJLE9BQTBCLEVBQzFCLFNBQ29FLEVBQ3BFLGdCQUNpRDtRQUhqRCwwQkFBQSxFQUFBLHNCQUNLLElBQUksRUFBRSxTQUFTLElBQUssT0FBQSxLQUFLLENBQUMsZ0JBQVMsSUFBSSxzQkFBWSxTQUFTLENBQUUsQ0FBQyxFQUEzQyxDQUEyQztRQUNwRSxpQ0FBQSxFQUFBLDZCQUNLLE1BQU0sSUFBSyxPQUFBLEtBQUssQ0FBQyx5QkFBa0IsTUFBTSxDQUFFLENBQUMsRUFBakMsQ0FBaUM7Ozs7Z0JBRTNDLFNBQVMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtnQkFDMUQsSUFBRyxPQUFPLENBQUMsVUFBVSxJQUFJLFNBQVM7b0JBQzlCLFNBQVMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxlQUFlLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFBO2dCQUV6RSxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFBO2dCQUNwQixzQkFBTyxLQUFLLENBQ1IsU0FBUyxDQUFDLFFBQVEsRUFBRSxFQUNwQjt3QkFDSSxXQUFXLEVBQUUsU0FBUzt3QkFDdEIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxVQUFVO3dCQUMxQixPQUFPLEVBQUUsT0FBTyxDQUFDLE9BQU87d0JBQ3hCLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSTtxQkFDckIsQ0FDSixDQUFDLElBQUksQ0FBQyxVQUFDLFFBQVE7d0JBQ1osSUFBRyxRQUFRLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBQzs0QkFDdkIsT0FBTyxPQUFPLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFBO3lCQUMxQzs2QkFBSTs0QkFDRCxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUEsSUFBSTtnQ0FDckIsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUE7Z0NBQ2hDLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTs0QkFDL0IsQ0FBQyxDQUFDLENBQUE7eUJBQ0w7b0JBQ0wsQ0FBQyxDQUFDLEVBQUE7OztLQUNMO0lBQ0wsaUJBQUM7QUFBRCxDQWxDQSxBQWtDQyxJQUFBO0FBbENZLGdDQUFVO0FBb0N2QixJQUFZLFVBS1g7QUFMRCxXQUFZLFVBQVU7SUFDbEIsMkJBQVcsQ0FBQTtJQUNYLHlCQUFTLENBQUE7SUFDVCw2QkFBYSxDQUFBO0lBQ2IseUJBQVMsQ0FBQTtBQUNiLENBQUMsRUFMVyxVQUFVLEdBQVYsa0JBQVUsS0FBVixrQkFBVSxRQUtyQjs7Ozs7QUN4Q0QsU0FBZ0IsUUFBUSxDQUFDLElBQVk7SUFDbkMsSUFBTSxTQUFTLEdBQUcsSUFBSSxlQUFlLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUM3RCxPQUFPLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDNUIsQ0FBQztBQUhELDRCQUdDOzs7Ozs7OztBQ1BELGdFQUFtQztBQUNuQywwQ0FBbUQ7QUFJbkQ7SUFJSSx5QkFBWSxPQUFlO1FBRG5CLGNBQVMsR0FBWSxLQUFLLENBQUE7UUFFOUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLHVCQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxlQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUMxQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFBO0lBQzlCLENBQUM7SUFFTSxpQ0FBTyxHQUFkLFVBQXdCLEtBQXFCLEVBQUUsU0FBMEI7UUFBekUsaUJBWUM7UUFYRyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQ3ZCLFVBQUMsS0FBSztZQUNGLEtBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsRUFBRSxVQUFBLE9BQU87Z0JBQ25ELElBQU0sR0FBRyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQTtnQkFDeEQsU0FBUyxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtZQUN4QyxDQUFDLENBQUMsQ0FBQTtZQUNGLEtBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFBO1FBQ3pCLENBQUMsRUFDRCxJQUFJLENBQUMsVUFBVSxFQUNmLElBQUksQ0FBQyxVQUFVLENBQ2xCLENBQUE7SUFDTCxDQUFDO0lBRU8sb0NBQVUsR0FBbEI7UUFDSSxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQTtJQUMxQixDQUFDO0lBRUQsbUNBQVMsR0FBVCxVQUFtQixLQUFxQixFQUFFLFNBQTBCO1FBQXBFLGlCQWdCQztRQWZHLElBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUU7WUFDM0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQTtZQUN4QixJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLEVBQUUsVUFBQSxPQUFPO2dCQUNuRCxJQUFNLEdBQUcsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUE7Z0JBQ3hELFNBQVMsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7WUFDeEMsQ0FBQyxDQUFDLENBQUE7U0FDTDthQUFJO1lBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQTtZQUM1QixJQUFNLGtCQUFnQixHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFBO1lBQ25ELElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxHQUFHLFVBQUMsS0FBSyxJQUFLLE9BQUEsS0FBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxFQUFFLFVBQUEsT0FBTztnQkFDM0Ysa0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUE7Z0JBQ3ZCLElBQU0sR0FBRyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQTtnQkFDeEQsU0FBUyxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtZQUN4QyxDQUFDLENBQUMsRUFKc0MsQ0FJdEMsQ0FBQTtTQUNMO0lBQ0wsQ0FBQztJQUVELHFDQUFXLEdBQVgsVUFBcUIsS0FBcUIsRUFBRSxPQUFZO1FBQ3BELElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO0lBQ3ZFLENBQUM7SUFDTCxzQkFBQztBQUFELENBakRBLEFBaURDLElBQUE7QUFqRFksMENBQWU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSjVCLDRDQUF5QztBQUd6QztJQUFBO1FBQ2EsYUFBUSxHQUFXLGFBQWEsQ0FBQztRQUNqQyxlQUFVLEdBQWUsdUJBQVUsQ0FBQyxHQUFHLENBQUM7SUFLckQsQ0FBQztJQUhTLDBDQUFjLEdBQXBCLFVBQXFCLFFBQWtCOzs7Z0JBQ25DLHNCQUFPLFFBQVEsQ0FBQyxNQUFNLEVBQUM7OztLQUMxQjtJQUNMLHdCQUFDO0FBQUQsQ0FQQSxBQU9DLElBQUE7QUFQWSw4Q0FBaUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSjlCLDRDQUF5QztBQUl6QztJQUdJLDBCQUNJLFVBR0M7O1FBVUksYUFBUSxHQUFXLGFBQWEsQ0FBQztRQUNqQyxlQUFVLEdBQWUsdUJBQVUsQ0FBQyxHQUFHLENBQUM7UUFUN0MsSUFBSSxNQUFNLEdBQVEsRUFBRSxDQUFBO1FBQ3BCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQTtRQUM1QyxJQUFHLFVBQVUsQ0FBQyxtQkFBbUI7WUFDN0IsTUFBTSxDQUFDLG1CQUFtQixHQUFHLE1BQUEsVUFBVSxDQUFDLG1CQUFtQiwwQ0FBRSxRQUFRLEVBQUUsQ0FBQTtRQUUzRSxJQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQztJQUM3QixDQUFDO0lBS0sseUNBQWMsR0FBcEIsVUFBcUIsUUFBa0I7Ozs7OzRCQUN0QixxQkFBTSxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUE7O3dCQUE1QixJQUFJLEdBQUcsU0FBcUI7d0JBQ2xDLHNCQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFrQixFQUFBOzs7O0tBQzNDO0lBRUwsdUJBQUM7QUFBRCxDQXpCQSxBQXlCQyxJQUFBO0FBekJZLDRDQUFnQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNIN0IsNENBQXlDO0FBRXpDO0lBQUE7SUFRQSxDQUFDO0lBQUQsc0JBQUM7QUFBRCxDQVJBLEFBUUMsSUFBQTtBQVJZLDBDQUFlO0FBVTVCO0lBRUksOEJBQVksSUFRWDtRQUdRLGFBQVEsR0FBVyxlQUFlLENBQUM7UUFDbkMsWUFBTyxHQUFnQjtZQUM1QixjQUFjLEVBQUUsa0JBQWtCO1NBQ3JDLENBQUM7UUFDTyxlQUFVLEdBQWUsdUJBQVUsQ0FBQyxJQUFJLENBQUM7UUFOOUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3BDLENBQUM7SUFPSyw2Q0FBYyxHQUFwQixVQUFxQixRQUFrQjs7Ozs7NEJBQ3RCLHFCQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBQTs7d0JBQTVCLElBQUksR0FBRyxTQUFxQjt3QkFDbEMsc0JBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQXNCLEVBQUM7Ozs7S0FDaEQ7SUFFTCwyQkFBQztBQUFELENBeEJBLEFBd0JDLElBQUE7QUF4Qlksb0RBQW9COzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1hqQyw0Q0FBeUM7QUFFekM7SUFBQTtJQU9BLENBQUM7SUFBRCxtQkFBQztBQUFELENBUEEsQUFPQyxJQUFBO0FBUFksb0NBQVk7QUFTekI7SUFHSSx5QkFBWSxVQUFzQzs7UUFRekMsYUFBUSxHQUFXLFlBQVksQ0FBQztRQUNoQyxlQUFVLEdBQWUsdUJBQVUsQ0FBQyxHQUFHLENBQUM7UUFSN0MsSUFBSSxNQUFNLEdBQVEsRUFBRSxDQUFBO1FBQ3BCLElBQUcsVUFBVSxDQUFDLFlBQVk7WUFDdEIsTUFBTSxDQUFDLFlBQVksR0FBRyxNQUFBLFVBQVUsQ0FBQyxZQUFZLDBDQUFFLFFBQVEsRUFBRSxDQUFBO1FBRTdELElBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFBO0lBQzVCLENBQUM7SUFLSyx3Q0FBYyxHQUFwQixVQUFxQixRQUFrQjs7Ozs7NEJBQ3RCLHFCQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBQTs7d0JBQTVCLElBQUksR0FBRyxTQUFxQjt3QkFDbEMsc0JBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQWlCLEVBQUM7Ozs7S0FDM0M7SUFDTCxzQkFBQztBQUFELENBbEJBLEFBa0JDLElBQUE7QUFsQlksMENBQWU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDYjVCLGlDQUE4QjtBQUU5QjtJQUFBO0lBUUEsQ0FBQztJQUFELGdCQUFDO0FBQUQsQ0FSQSxBQVFDLElBQUE7QUFSWSw4QkFBUztBQVN0QjtJQUFBO0lBS0EsQ0FBQztJQUFELGlCQUFDO0FBQUQsQ0FMQSxBQUtDLElBQUE7QUFMWSxnQ0FBVTtBQU92QjtJQUFnQyw4QkFBNEI7SUFDeEQsb0JBQXFCLE9BQWU7UUFBcEMsWUFDSSxrQkFBTSxnQ0FBZ0MsRUFBRSx3Q0FBd0MsRUFBRSxPQUFPLENBQUMsU0FDN0Y7UUFGb0IsYUFBTyxHQUFQLE9BQU8sQ0FBUTs7SUFFcEMsQ0FBQztJQUVELG1DQUFjLEdBQWQsVUFBZSxPQUFPO1FBQ2xCLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBYyxDQUFDO0lBQzVDLENBQUM7SUFDTCxpQkFBQztBQUFELENBVEEsQUFTQyxDQVQrQixhQUFLLEdBU3BDO0FBVFksZ0NBQVU7Ozs7O0FDbEJ2QjtJQUNJLGVBQ2EsZUFBdUIsRUFDdkIsV0FBbUIsRUFDbkIsVUFBZTtRQUZmLG9CQUFlLEdBQWYsZUFBZSxDQUFRO1FBQ3ZCLGdCQUFXLEdBQVgsV0FBVyxDQUFRO1FBQ25CLGVBQVUsR0FBVixVQUFVLENBQUs7SUFDekIsQ0FBQztJQUVKLDJCQUFXLEdBQVg7UUFDSSxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7SUFDaEUsQ0FBQztJQUNELHVCQUFPLEdBQVA7UUFDSSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDNUIsQ0FBQztJQUdMLFlBQUM7QUFBRCxDQWZBLEFBZUMsSUFBQTtBQWZxQixzQkFBSzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBM0IsaUNBQThCO0FBRzlCO0lBQStCLDZCQUFtQjtJQUk5QyxtQkFBWSxNQUFjO2VBQ3RCLGtCQUFNLHVCQUF1QixFQUFFLEVBQUUsRUFBRSxNQUFNLENBQUM7SUFDOUMsQ0FBQztJQUxELGtDQUFjLEdBQWQsVUFBZSxPQUFPO1FBQ2xCLE9BQU8sT0FBTyxDQUFBO0lBQ2xCLENBQUM7SUFJTCxnQkFBQztBQUFELENBUEEsQUFPQyxDQVA4QixhQUFLLEdBT25DO0FBUFksOEJBQVM7O0FDSHRCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3puRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNyR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3BZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcGNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNqTUE7QUFDQTs7Ozs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDNUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDdkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3ZMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3ZHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3pMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNuREE7QUFDQTs7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNwTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDelBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNsS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCB7Q2VsbERyYXdlcn0gZnJvbSBcIi4vQ2VsbERyYXdlclwiO1xyXG5pbXBvcnQge1RhYmxlfSBmcm9tIFwiLi4vbWFpbi9UYWJsZVwiO1xyXG5pbXBvcnQge1RhYmxlTW9kfSBmcm9tIFwiLi4vbWFpbi9UYWJsZU1vZFwiO1xyXG5pbXBvcnQge0RpcmVjdGlvbn0gZnJvbSBcIi4uL3V0aWxpdGllcy9EaXJlY3Rpb25cIjtcclxuaW1wb3J0IHtBY3Rpb25UeXBlfSBmcm9tIFwiLi4vdXRpbGl0aWVzL0FjdGlvblwiO1xyXG5pbXBvcnQge2Nzc30gZnJvbSBcImpxdWVyeVwiO1xyXG5cclxudHlwZSBvblRyaWdnZXIgPSAoZXZlbnQ/OiBhbnkpID0+IHZvaWQgfCBib29sZWFuXHJcblxyXG5leHBvcnQgY2xhc3MgQ2VsbCB7XHJcbiAgICBwcml2YXRlIGRyYXdlcjogQ2VsbERyYXdlcjtcclxuICAgIHByaXZhdGUgX2ZyaWVuZHM6IENlbGxbXTtcclxuICAgIHByaXZhdGUgX2Jsb2NrZWQ6IGJvb2xlYW47XHJcbiAgICBwcml2YXRlIF9zZWxlY3RlZDogYm9vbGVhbjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwdWJsaWMgcmVhZG9ubHkgeDogbnVtYmVyLFxyXG4gICAgICAgIHB1YmxpYyByZWFkb25seSB5OiBudW1iZXIsXHJcbiAgICAgICAgJHJvdzogSFRNTEVsZW1lbnQsXHJcbiAgICAgICAgcHVibGljIHJlYWRvbmx5IHRhYmxlOiBUYWJsZVxyXG4gICAgKSB7XHJcbiAgICAgICAgdGhpcy5kcmF3ZXIgPSBuZXcgQ2VsbERyYXdlcigkcm93LCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG9uS2V5ZG93bigpOiBvblRyaWdnZXIge1xyXG4gICAgICAgIHJldHVybiAoZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXZlbnQuY3RybEtleSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAoZXZlbnQuc2hpZnRLZXkpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKGV2ZW50LmNvZGUgPT09ICdBcnJvd1VwJykgdGhpcy50YWJsZS5nZXRDZWxsKHRoaXMueCAtIDEsIHRoaXMueSkuZm9jdXMoKTtcclxuICAgICAgICAgICAgaWYgKGV2ZW50LmNvZGUgPT09ICdBcnJvd0Rvd24nIHx8IGV2ZW50LmNvZGUgPT09ICdFbnRlcicpIHRoaXMudGFibGUuZ2V0Q2VsbCh0aGlzLnggKyAxLCB0aGlzLnkpLmZvY3VzKCk7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pc0VtcHR5KCkpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKGV2ZW50LmNvZGUgPT09ICdBcnJvd0xlZnQnKSB0aGlzLnRhYmxlLmdldENlbGwodGhpcy54LCB0aGlzLnkgLSAxKS5mb2N1cygpO1xyXG4gICAgICAgICAgICBpZiAoZXZlbnQuY29kZSA9PT0gJ0Fycm93UmlnaHQnKSB0aGlzLnRhYmxlLmdldENlbGwodGhpcy54LCB0aGlzLnkgKyAxKS5mb2N1cygpO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBvbk1vdXNlZW50ZXIoKTogb25UcmlnZ2VyIHtcclxuICAgICAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy50YWJsZS5tb2QgIT09IFRhYmxlTW9kLnNlbGVjdGluZykgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdFdpdGhGcmllbmRzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgb25Nb3VzZWRvd24oKTogb25UcmlnZ2VyIHtcclxuICAgICAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnRhYmxlLm1vZCA9IFRhYmxlTW9kLnNlbGVjdGluZztcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RXaXRoRnJpZW5kcygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG9uRG91YmxlQ2xpY2soKTogb25UcmlnZ2VyIHtcclxuICAgICAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmZvY3VzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgb25CbHVyKCk6IG9uVHJpZ2dlciB7XHJcbiAgICAgICAgcmV0dXJuICh0ZXh0OiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgaWYodGV4dC5sZW5ndGggIT09IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYmxvY2soKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG9uSW5wdXQoKTogb25UcmlnZ2VyIHtcclxuICAgICAgICByZXR1cm4gKGV2ZW50OiBhbnkpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZXZlbnQuaW5wdXRUeXBlKTtcclxuICAgICAgICAgICAgaWYoZXZlbnQuaW5wdXRUeXBlWzBdID09PSAnaScpIHtcclxuICAgICAgICAgICAgICAgIGlmIChldmVudC5kYXRhID09PSAnICcpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRhYmxlLnB1c2hBY3Rpb24oW0FjdGlvblR5cGUud3JpdGVXaXRoU3BhY2UsIHRoaXMueCwgdGhpcy55XSk7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50YWJsZS5wdXNoQWN0aW9uKFtBY3Rpb25UeXBlLndyaXRlLCB0aGlzLngsIHRoaXMueV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9ZWxzZSBpZihldmVudC5pbnB1dFR5cGVbMF0gPT09ICdkJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50YWJsZS5wdXNoQWN0aW9uKFtBY3Rpb25UeXBlLmRlbGV0ZSwgdGhpcy54LCB0aGlzLnldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG9uQ29udGV4dG1lbnUoKTogb25UcmlnZ2VyIHtcclxuICAgICAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnRhYmxlLnNob3dQb3BvdmVyKHRoaXMueCwgdGhpcy55LCB0aGlzKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZm9jdXMoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5kcmF3ZXIuYmxvY2tObygpO1xyXG4gICAgICAgIHRoaXMuZHJhd2VyLmZvY3VzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNlbGVjdFdpdGhGcmllbmRzKHllczogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5fZnJpZW5kcyA9PSBudWxsIHx8IHRoaXMuX2ZyaWVuZHMubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICB5ZXMgPyB0aGlzLnNlbGVjdCgpIDogdGhpcy5zZWxlY3ROb25lKCk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLl9mcmllbmRzLmZvckVhY2goKGZyaWVuZCkgPT4geWVzID8gZnJpZW5kLnNlbGVjdCgpIDogZnJpZW5kLnNlbGVjdE5vbmUoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldEZyaWVuZHMoZnJpZW5kczogQ2VsbFtdKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fZnJpZW5kcyA9IGZyaWVuZHM7XHJcbiAgICAgICAgdGhpcy5kcmF3ZXIuYWRkQm9yZGVycyhEaXJlY3Rpb24udG9wLCBEaXJlY3Rpb24uYm90dG9tLCBEaXJlY3Rpb24ubGVmdCwgRGlyZWN0aW9uLnJpZ2h0KVxyXG4gICAgICAgIGlmIChmcmllbmRzLmZpbmQoKGNlbGwpID0+IChjZWxsLnggPT09IHRoaXMueCAmJiBjZWxsLnkgPT09IHRoaXMueSArIDEpKSAhPSBudWxsKVxyXG4gICAgICAgICAgICB0aGlzLmRyYXdlci5yZW1vdmVCb3JkZXIoRGlyZWN0aW9uLnJpZ2h0KTtcclxuICAgICAgICBpZiAoZnJpZW5kcy5maW5kKChjZWxsKSA9PiAoY2VsbC54ID09PSB0aGlzLnggJiYgY2VsbC55ID09PSB0aGlzLnkgLSAxKSkgIT0gbnVsbClcclxuICAgICAgICAgICAgdGhpcy5kcmF3ZXIucmVtb3ZlQm9yZGVyKERpcmVjdGlvbi5sZWZ0KTtcclxuICAgICAgICBpZiAoZnJpZW5kcy5maW5kKChjZWxsKSA9PiAoY2VsbC54ID09PSB0aGlzLnggLSAxICYmIGNlbGwueSA9PT0gdGhpcy55KSkgIT0gbnVsbClcclxuICAgICAgICAgICAgdGhpcy5kcmF3ZXIucmVtb3ZlQm9yZGVyKERpcmVjdGlvbi50b3ApO1xyXG4gICAgICAgIGlmIChmcmllbmRzLmZpbmQoKGNlbGwpID0+IChjZWxsLnggPT09IHRoaXMueCArIDEgJiYgY2VsbC55ID09PSB0aGlzLnkpKSAhPSBudWxsKVxyXG4gICAgICAgICAgICB0aGlzLmRyYXdlci5yZW1vdmVCb3JkZXIoRGlyZWN0aW9uLmJvdHRvbSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNlbGVjdCgpOiB2b2lkIHtcclxuICAgICAgICBpZih0aGlzLl9zZWxlY3RlZCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnRhYmxlLnNlbGVjdGVkQ2VsbHMucHVzaCh0aGlzKTtcclxuICAgICAgICB0aGlzLmRyYXdlci5zZWxlY3QoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VsZWN0Tm9uZSgpOiB2b2lkIHtcclxuICAgICAgICBpZighdGhpcy5fc2VsZWN0ZWQpIHJldHVybjtcclxuICAgICAgICB0aGlzLl9zZWxlY3RlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZHJhd2VyLnNlbGVjdE5vbmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaXNFbXB0eSgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kcmF3ZXIuaXNFbXB0eSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYmxvY2soKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5kcmF3ZXIuYmxvY2soKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGJsb2NrTm8oKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5kcmF3ZXIuYmxvY2tObygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1bmRvV3JpdGUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5kcmF3ZXIudW5kb1dyaXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVuZG9EZWxldGUodGV4dDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5kcmF3ZXIudW5kb0RlbGV0ZSh0ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkRGVjb3IoY3NzU3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5kcmF3ZXIuYWRkRGVjb3IoY3NzU3RyaW5nKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkRGVjb3JXaXRoRnJpZW5kcyhjc3NTdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5fZnJpZW5kcyA9PSBudWxsIHx8IHRoaXMuX2ZyaWVuZHMubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICB0aGlzLmFkZERlY29yKGNzc1N0cmluZyk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLl9mcmllbmRzLmZvckVhY2goKGZyaWVuZCkgPT4gZnJpZW5kLmFkZERlY29yKGNzc1N0cmluZykpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRNZXNzYWdlKHRleHQpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmRyYXdlci5hZGRNZXNzYWdlKHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDc3NTdHlsZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRyYXdlci5nZXRDc3NTdHlsZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgc2NyZWVuWCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRyYXdlci5zY3JlZW5YO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgc2NyZWVuWSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRyYXdlci5zY3JlZW5ZO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2VwYXJhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5zZXRGcmllbmRzKFt0aGlzXSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNlcGFyYXRlV2l0aG91dEZyaWVuZHMoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2ZyaWVuZHMgIT0gbnVsbCl7XHJcbiAgICAgICAgICAgIGxldCBpbmRleCA9IHRoaXMuX2ZyaWVuZHMuaW5kZXhPZih0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5fZnJpZW5kcy5zcGxpY2UoaW5kZXgsIGluZGV4KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZXBhcmF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXBhcmF0ZVdpdGhGcmllbmRzKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLl9mcmllbmRzID09IG51bGwpIHJldHVybjtcclxuICAgICAgICBsZXQgY2xvbmUgPSB0aGlzLl9mcmllbmRzO1xyXG4gICAgICAgIGNsb25lLmZvckVhY2goKGVsZW0pID0+IGVsZW0uc2VwYXJhdGUoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB0ZXh0KCk6IHN0cmluZ3tcclxuICAgICAgICByZXR1cm4gdGhpcy5kcmF3ZXIudGV4dDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXQgdGV4dCh0ZXh0OiBzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMuZHJhd2VyLnRleHQgPSB0ZXh0O1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHtDZWxsfSBmcm9tIFwiLi9DZWxsXCI7XHJcbmltcG9ydCB7c3RvcmV9IGZyb20gXCIuLi9tYWluL1RhYmxlUGFnZVwiO1xyXG5pbXBvcnQge0RpcmVjdGlvbn0gZnJvbSBcIi4uL3V0aWxpdGllcy9EaXJlY3Rpb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDZWxsRHJhd2VyIHtcclxuICAgIHByaXZhdGUgJGNlbGw6IEhUTUxFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSAkc3BhbjogSFRNTEVsZW1lbnQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgJHJvdzogSFRNTEVsZW1lbnQsXHJcbiAgICAgICAgcHJpdmF0ZSBrZWVwZXI6IENlbGxcclxuICAgICkge1xyXG4gICAgICAgIHRoaXMuaW5pdCgkcm93KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXQoJHJvdyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuJHNwYW4gPSB0aGlzLiRjcmVhdGVTcGFuKCk7XHJcbiAgICAgICAgdGhpcy4kY2VsbCA9IHRoaXMuJGNyZWF0ZUNlbGwodGhpcy4kc3Bhbik7XHJcbiAgICAgICAgJHJvdy5hcHBlbmQodGhpcy4kY2VsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSAkY3JlYXRlU3BhbigpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgICAgbGV0ICRzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgICRzcGFuLmNsYXNzTmFtZSA9ICd0ZXh0LW5vd3JhcCBuby1zaG93LWZvY3VzJztcclxuICAgICAgICAkc3Bhbi5vbmtleWRvd24gPSAoZXZlbnQpID0+IHRoaXMua2VlcGVyLm9uS2V5ZG93bihldmVudCk7XHJcbiAgICAgICAgJHNwYW4ub25ibHVyID0gKCkgPT4gdGhpcy5rZWVwZXIub25CbHVyKCRzcGFuLnRleHRDb250ZW50KTtcclxuICAgICAgICAkc3Bhbi5vbmlucHV0ID0gKGV2ZW50KSA9PiB0aGlzLmtlZXBlci5vbklucHV0KGV2ZW50KTtcclxuICAgICAgICAkc3Bhbi5jb250ZW50RWRpdGFibGUgPSAndHJ1ZSc7XHJcbiAgICAgICAgcmV0dXJuICRzcGFuO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgJGNyZWF0ZUNlbGwoJHNwYW46IEhUTUxFbGVtZW50KTogSFRNTEVsZW1lbnQge1xyXG4gICAgICAgIGxldCAkY2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICRjZWxsLmNsYXNzTmFtZSA9ICdjb21ncmlkLWNlbGwgYm9yZGVyLXRvcCBib3JkZXItbGVmdCBib3JkZXItcmlnaHQgYm9yZGVyLWJvdHRvbSB0ZXh0LWRhcmsnO1xyXG4gICAgICAgICRjZWxsLm9ubW91c2VlbnRlciA9ICgpID0+IHRoaXMua2VlcGVyLm9uTW91c2VlbnRlcigpO1xyXG4gICAgICAgICRjZWxsLm9ubW91c2Vkb3duID0gKCkgPT4gdGhpcy5rZWVwZXIub25Nb3VzZWRvd24oKTtcclxuICAgICAgICAkY2VsbC5vbmRyYWdzdGFydCA9ICgpID0+IGZhbHNlO1xyXG4gICAgICAgICRjZWxsLm9uY29udGV4dG1lbnUgPSAoKSA9PiB0aGlzLmtlZXBlci5vbkNvbnRleHRtZW51KCk7XHJcbiAgICAgICAgJGNlbGwuYXBwZW5kKCRzcGFuKTtcclxuICAgICAgICByZXR1cm4gJGNlbGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGZvY3VzKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuJHNwYW4uZm9jdXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VsZWN0KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuJGNlbGwuY2xhc3NMaXN0LnJlbW92ZSguLi5zdG9yZS5ub1NlbGVjdGVkQ2xhc3Nlcyk7XHJcbiAgICAgICAgdGhpcy4kY2VsbC5jbGFzc0xpc3QuYWRkKC4uLnN0b3JlLnNlbGVjdGVkQ2xhc3Nlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNlbGVjdE5vbmUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy4kY2VsbC5jbGFzc0xpc3QucmVtb3ZlKC4uLnN0b3JlLnNlbGVjdGVkQ2xhc3Nlcyk7XHJcbiAgICAgICAgdGhpcy4kY2VsbC5jbGFzc0xpc3QuYWRkKC4uLnN0b3JlLm5vU2VsZWN0ZWRDbGFzc2VzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaXNFbXB0eSgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy4kc3Bhbi50ZXh0Q29udGVudC5sZW5ndGggPT09IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbW92ZUJvcmRlcnMoLi4uZGlyZWN0aW9uczogRGlyZWN0aW9uW10pOiB2b2lkIHtcclxuICAgICAgICBkaXJlY3Rpb25zLmZvckVhY2goKGRpcmVjdGlvbikgPT4gdGhpcy5yZW1vdmVCb3JkZXIoZGlyZWN0aW9uKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbW92ZUJvcmRlcihkaXJlY3Rpb246IERpcmVjdGlvbik6IHZvaWQge1xyXG4gICAgICAgIHN3aXRjaCAoZGlyZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLmJvdHRvbTpcclxuICAgICAgICAgICAgICAgIHRoaXMuJGNlbGwuY2xhc3NMaXN0LnJlbW92ZSgnYm9yZGVyLWJvdHRvbScpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBjYXNlIERpcmVjdGlvbi5sZWZ0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy4kY2VsbC5jbGFzc0xpc3QucmVtb3ZlKCdib3JkZXItbGVmdCcpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBjYXNlIERpcmVjdGlvbi5yaWdodDpcclxuICAgICAgICAgICAgICAgIHRoaXMuJGNlbGwuY2xhc3NMaXN0LnJlbW92ZSgnYm9yZGVyLXJpZ2h0Jyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLnRvcDpcclxuICAgICAgICAgICAgICAgIHRoaXMuJGNlbGwuY2xhc3NMaXN0LnJlbW92ZSgnYm9yZGVyLXRvcCcpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkQm9yZGVycyguLi5kaXJlY3Rpb25zOiBEaXJlY3Rpb25bXSk6IHZvaWQge1xyXG4gICAgICAgIGRpcmVjdGlvbnMuZm9yRWFjaCgoZGlyZWN0aW9uKSA9PiB0aGlzLmFkZEJvcmRlcihkaXJlY3Rpb24pKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkQm9yZGVyKGRpcmVjdGlvbjogRGlyZWN0aW9uKTogdm9pZCB7XHJcbiAgICAgICAgc3dpdGNoIChkaXJlY3Rpb24pIHtcclxuICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24uYm90dG9tOlxyXG4gICAgICAgICAgICAgICAgdGhpcy4kY2VsbC5jbGFzc0xpc3QuYWRkKCdib3JkZXItYm90dG9tJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLmxlZnQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRjZWxsLmNsYXNzTGlzdC5hZGQoJ2JvcmRlci1sZWZ0Jyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLnJpZ2h0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy4kY2VsbC5jbGFzc0xpc3QuYWRkKCdib3JkZXItcmlnaHQnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24udG9wOlxyXG4gICAgICAgICAgICAgICAgdGhpcy4kY2VsbC5jbGFzc0xpc3QuYWRkKCdib3JkZXItdG9wJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBibG9jaygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLiRzcGFuLmNvbnRlbnRFZGl0YWJsZSA9ICdmYWxzZSc7XHJcbiAgICAgICAgdGhpcy4kc3Bhbi5jbGFzc0xpc3QuYWRkKCd1c2VyLXNlbGVjdC1ub25lJyk7XHJcbiAgICAgICAgdGhpcy4kY2VsbC5vbmRibGNsaWNrID0gKCkgPT4gdGhpcy5rZWVwZXIub25Eb3VibGVDbGljaygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBibG9ja05vKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuJHNwYW4uY29udGVudEVkaXRhYmxlID0gJ3RydWUnO1xyXG4gICAgICAgIHRoaXMuJHNwYW4uY2xhc3NMaXN0LnJlbW92ZSgndXNlci1zZWxlY3Qtbm9uZScpO1xyXG4gICAgICAgIHRoaXMuJGNlbGwub25kYmxjbGljayA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVuZG9Xcml0ZSgpOiB2b2lkIHtcclxuICAgICAgICBsZXQgbGFzdFNwYWNlSW5kZXggPSB0aGlzLiRzcGFuLnRleHRDb250ZW50Lmxhc3RJbmRleE9mKCcgJyk7XHJcbiAgICAgICAgaWYobGFzdFNwYWNlSW5kZXggPCAwKSB0aGlzLiRzcGFuLnRleHRDb250ZW50ID0gJyc7XHJcbiAgICAgICAgZWxzZSB0aGlzLiRzcGFuLnRleHRDb250ZW50ID0gdGhpcy4kc3Bhbi50ZXh0Q29udGVudC5zdWJzdHIoMCwgbGFzdFNwYWNlSW5kZXgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1bmRvRGVsZXRlKHRleHQpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLiRzcGFuLnRleHRDb250ZW50ICs9IHRleHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZERlY29yKGNzc1N0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuJGNlbGwuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgY3NzU3RyaW5nKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkTWVzc2FnZSh0ZXh0KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy4kc3Bhbi50ZXh0Q29udGVudCA9IHRleHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldENzc1N0eWxlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuJGNlbGwuZ2V0QXR0cmlidXRlKCdzdHlsZScpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgc2NyZWVuWCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLiRjZWxsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLng7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBzY3JlZW5ZKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuJGNlbGwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHRleHQoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy4kc3Bhbi50ZXh0Q29udGVudDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXQgdGV4dCh0ZXh0OiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLiRzcGFuLnRleHRDb250ZW50ID0gdGV4dDtcclxuICAgIH1cclxufSIsImltcG9ydCB7IENlbGwgfSBmcm9tIFwiLi4vY2VsbC9DZWxsXCI7XHJcbmltcG9ydCB7IFRhYmxlTW9kIH0gZnJvbSBcIi4vVGFibGVNb2RcIjtcclxuaW1wb3J0IHsgQWN0aW9uLCBBY3Rpb25UeXBlIH0gZnJvbSBcIi4uL3V0aWxpdGllcy9BY3Rpb25cIjtcclxuaW1wb3J0IHsgV2ViU29ja2V0Q2xpZW50IH0gZnJvbSBcIi4uLy4uL3V0aWwvV2ViU29ja2V0Q2xpZW50XCI7XHJcbmltcG9ydCB7IFRhYmxlVG9waWMgfSBmcm9tIFwiLi4vLi4vdXRpbC93ZWJzb2NrZXQvVGFibGVUb3BpY1wiO1xyXG5pbXBvcnQgeyBnZXRQYXJhbSB9IGZyb20gXCIuLi8uLi91dGlsL1V0aWxcIjtcclxuaW1wb3J0IHsgVXNlclRvcGljIH0gZnJvbSBcIi4uLy4uL3V0aWwvd2Vic29ja2V0L1VzZXJUb3BpY1wiO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSBcIi4uLy4uL3V0aWwvSHR0cENsaWVudFwiO1xyXG5pbXBvcnQgeyBVc2VySW5mb1JlcXVlc3QgfSBmcm9tIFwiLi4vLi4vdXRpbC9yZXF1ZXN0L1VzZXJJbmZvUmVxdWVzdFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRhYmxlIHtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgdGFibGVUb3BpYzogVGFibGVUb3BpYztcclxuICAgIHByaXZhdGUgdXNlclRvcGljOiBVc2VyVG9waWM7XHJcbiAgICBwcml2YXRlICR0YWJsZUNvbnRhaW5lciA9ICQoJ21haW4nKTtcclxuICAgIHB1YmxpYyByZWFkb25seSBjZWxsczogQ2VsbFtdW10gPSBbXTtcclxuICAgIHB1YmxpYyBtb2Q6IFRhYmxlTW9kO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IHNlbGVjdGVkQ2VsbHM6IENlbGxbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBhY3Rpb25zOiBBY3Rpb25bXSA9IFtdO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IHdpZHRoOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgaGVpZ2h0OiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF8kcG9wb3ZlciA9ICQoJyNwb3BvdmVyJyk7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgd2Vic29ja2V0OiBXZWJTb2NrZXRDbGllbnQgPSBuZXcgV2ViU29ja2V0Q2xpZW50KFwiaHR0cHM6Ly9jb21ncmlkLnJ1Ojg0NDMvd2Vic29ja2V0XCIpO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBodHRwOiBIdHRwQ2xpZW50ID0gbmV3IEh0dHBDbGllbnQoXCJodHRwczovL2NvbWdyaWQucnU6ODQ0M1wiKTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9zdG9yZSkge1xyXG4gICAgICAgIHRoaXMudGFibGVUb3BpYyA9IG5ldyBUYWJsZVRvcGljKHBhcnNlSW50KGdldFBhcmFtKCdpZCcpKSk7XHJcbiAgICAgICAgdGhpcy53ZWJzb2NrZXQuc3Vic2NyaWJlKHRoaXMudGFibGVUb3BpYywgbWVzc2FnZSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB0aGlzLmNlbGxzW21lc3NhZ2UueF1bbWVzc2FnZS55XS50ZXh0ID0gbWVzc2FnZS50ZXh0O1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgdGhpcy5odHRwLnByb2NlZWRSZXF1ZXN0KFxyXG4gICAgICAgICAgbmV3IFVzZXJJbmZvUmVxdWVzdCh7fSksXHJcbiAgICAgICAgKS50aGVuKHVzZXIgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnVzZXJUb3BpYyA9IG5ldyBVc2VyVG9waWModXNlci5pZClcclxuICAgICAgICAgICAgdGhpcy53ZWJzb2NrZXQuc3Vic2NyaWJlKHRoaXMudXNlclRvcGljLCBtZXNzYWdlID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuICAgICAgICB0aGlzLndpZHRoID0gX3N0b3JlLndpZHRoO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gX3N0b3JlLmhlaWdodDtcclxuICAgICAgICB0aGlzLmZpbGxUYWJsZShfc3RvcmUuY2VsbHNVbmlvbnMsIF9zdG9yZS5kZWNvcmF0aW9ucywgX3N0b3JlLm1lc3NhZ2VzKTtcclxuICAgICAgICBsZXQgJGJvZHkgPSAkKCdib2R5Jyk7XHJcbiAgICAgICAgJGJvZHkub24oJ21vdXNldXAnLCAoKSA9PiB0aGlzLm9uQm9keU1vdXNldXAoKSk7XHJcbiAgICAgICAgJGJvZHkub24oJ2tleWRvd24nLCAoZXZlbnQpID0+IHRoaXMub25Cb2R5S2V5ZG93bihldmVudCkpO1xyXG4gICAgICAgICQoJyNwYWdlLW5hbWUnKS50ZXh0KF9zdG9yZS5uYW1lKTtcclxuICAgICAgICB0aGlzLl8kcG9wb3Zlci5vbignbW91c2V1cCcsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZmlsbFRhYmxlKGNlbGxzVW5pb25zLCBkZWNvcmF0aW9ucywgbWVzc2FnZXMpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmZpbGxTdGFydFRhYmxlKCk7XHJcbiAgICAgICAgdGhpcy51bmlvbihjZWxsc1VuaW9ucyk7XHJcbiAgICAgICAgdGhpcy5kZWNvcmF0ZShkZWNvcmF0aW9ucyk7XHJcbiAgICAgICAgdGhpcy5hZGRNZXNzYWdlcyhtZXNzYWdlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBmaWxsU3RhcnRUYWJsZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmNlbGxzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhlaWdodDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2VsbHMucHVzaChbXSk7XHJcbiAgICAgICAgICAgIGxldCAkcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncm93Jyk7XHJcbiAgICAgICAgICAgICRyb3cuY2xhc3NOYW1lID0gJ2NvbWdyaWQtcm93JztcclxuICAgICAgICAgICAgdGhpcy4kdGFibGVDb250YWluZXIuYXBwZW5kKCRyb3cpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMud2lkdGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jZWxsc1tpXS5wdXNoKG5ldyBDZWxsKGksIGosICRyb3csIHRoaXMpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVuaW9uKGNlbGxzVW5pb25zKTogdm9pZCB7XHJcbiAgICAgICAgY2VsbHNVbmlvbnMuZm9yRWFjaCh1bmlvbiA9PiB0aGlzLmNyZWF0ZVVuaW9uKHVuaW9uKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVVbmlvbihjZWxsc1VuaW9uKTogdm9pZCB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IGNlbGxzVW5pb24ubGVmdFVwWDsgaSA8PSBjZWxsc1VuaW9uLnJpZ2h0RG93blg7IGkrKylcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IGNlbGxzVW5pb24ubGVmdFVwWTsgaiA8PSBjZWxsc1VuaW9uLnJpZ2h0RG93blk7IGorKylcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q2VsbChpLCBqKS5zZWxlY3RXaXRoRnJpZW5kcyh0cnVlKTtcclxuICAgICAgICB0aGlzLnNlbGVjdERvd24oKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRlY29yYXRlKGRlY29yYXRpb25zKTogdm9pZCB7XHJcbiAgICAgICAgZGVjb3JhdGlvbnMuZm9yRWFjaChkZWNvcmF0aW9uID0+IHRoaXMuZGVjb3JhdGVPbmUoZGVjb3JhdGlvbikpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZGVjb3JhdGVPbmUoZGVjb3JhdGlvbik6IHZvaWQge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSBkZWNvcmF0aW9uLmxlZnRVcFg7IGkgPD0gZGVjb3JhdGlvbi5yaWdodERvd25YOyBpKyspXHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSBkZWNvcmF0aW9uLmxlZnRVcFk7IGogPD0gZGVjb3JhdGlvbi5yaWdodERvd25ZOyBqKyspXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldENlbGwoaSwgaikuYWRkRGVjb3IoZGVjb3JhdGlvbi5jc3NUZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFkZE1lc3NhZ2VzKG1lc3NhZ2VzKTogdm9pZCB7XHJcbiAgICAgICAgbWVzc2FnZXMuZm9yRWFjaChtZXNzYWdlID0+IHRoaXMuZ2V0Q2VsbChtZXNzYWdlLngsIG1lc3NhZ2UueSkuYWRkTWVzc2FnZShtZXNzYWdlLnRleHQpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uQm9keU1vdXNldXAoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5tb2QgPSBUYWJsZU1vZC5ub25lO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0RG93bigpO1xyXG4gICAgICAgIHRoaXMuaGlkZVBvcG92ZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNlbGVjdERvd24oKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGNsb25lID0gdGhpcy5zZWxlY3RlZENlbGxzLm1hcChlbGVtID0+IGVsZW0pO1xyXG4gICAgICAgIGxldCBzdHlsZSA9IGNsb25lWzBdLmdldENzc1N0eWxlKCk7XHJcbiAgICAgICAgd2hpbGUgKHRoaXMuc2VsZWN0ZWRDZWxscy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGxldCBjZWxsID0gdGhpcy5zZWxlY3RlZENlbGxzLnBvcCgpO1xyXG4gICAgICAgICAgICBjZWxsLnNldEZyaWVuZHMoY2xvbmUpO1xyXG4gICAgICAgICAgICBjZWxsLnNlbGVjdE5vbmUoKTtcclxuICAgICAgICAgICAgY2VsbC5hZGREZWNvcihzdHlsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25Cb2R5S2V5ZG93bihldmVudCk6IHZvaWQge1xyXG4gICAgICAgIGlmIChldmVudC5jdHJsS2V5ICYmIGV2ZW50LmNvZGUgPT09ICdLZXlaJykge1xyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLnBvcEFjdGlvbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q2VsbCh4OiBudW1iZXIsIHk6IG51bWJlcik6IENlbGwge1xyXG4gICAgICAgIGlmICh4ID49IDAgJiYgeCA8IHRoaXMuaGVpZ2h0ICYmIHkgPj0gMCAmJiB5IDwgdGhpcy53aWR0aClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2VsbHNbeF1beV07XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHB1c2hBY3Rpb24oYWN0aW9uOiBBY3Rpb24pIHtcclxuICAgICAgICBsZXQgbGFzdEFjdGlvbiA9IHRoaXMuYWN0aW9uc1t0aGlzLmFjdGlvbnMubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgIGxhc3RBY3Rpb24gIT0gbnVsbCAmJlxyXG4gICAgICAgICAgICAgIGxhc3RBY3Rpb25bMF0gPT09IEFjdGlvblR5cGUud3JpdGUgJiZcclxuICAgICAgICAgICAgICBhY3Rpb25bMF0gPD0gQWN0aW9uVHlwZS53cml0ZVdpdGhTcGFjZSAmJlxyXG4gICAgICAgICAgICAgIGxhc3RBY3Rpb25bMV0gPT09IGFjdGlvblsxXSAmJlxyXG4gICAgICAgICAgICAgIGxhc3RBY3Rpb25bMl0gPT09IGFjdGlvblsyXVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICB0aGlzLmFjdGlvbnMucG9wKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmFjdGlvbnMucHVzaChhY3Rpb24pO1xyXG5cclxuICAgICAgICBpZihhY3Rpb25bMF0gPT09IEFjdGlvblR5cGUud3JpdGUgfHxcclxuICAgICAgICAgIGFjdGlvblswXSA9PT0gQWN0aW9uVHlwZS53cml0ZVdpdGhTcGFjZSB8fFxyXG4gICAgICAgICAgYWN0aW9uWzBdID09PSBBY3Rpb25UeXBlLmRlbGV0ZVxyXG4gICAgICAgICl7XHJcbiAgICAgICAgICAgIHRoaXMud2Vic29ja2V0LnNlbmRNZXNzYWdlKHRoaXMudGFibGVUb3BpYywge1xyXG4gICAgICAgICAgICAgICAgeDogYWN0aW9uWzFdLFxyXG4gICAgICAgICAgICAgICAgeTogYWN0aW9uWzJdLFxyXG4gICAgICAgICAgICAgICAgY2hhdElkOiBnZXRQYXJhbShcImlkXCIpLFxyXG4gICAgICAgICAgICAgICAgdGV4dDogdGhpcy5jZWxsc1thY3Rpb25bMV1dW2FjdGlvblsyXV0udGV4dFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcG9wQWN0aW9uKCkge1xyXG4gICAgICAgIGxldCBhY3Rpb24gPSB0aGlzLmFjdGlvbnMucG9wKCk7XHJcbiAgICAgICAgc3dpdGNoIChhY3Rpb25bMF0pIHtcclxuICAgICAgICAgICAgY2FzZSBBY3Rpb25UeXBlLndyaXRlOlxyXG4gICAgICAgICAgICAgICAgdGhpcy51bmRvV3JpdGUoYWN0aW9uWzFdLCBhY3Rpb25bMl0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAvLyBjYXNlIEFjdGlvblR5cGUuZGVsZXRlOlxyXG4gICAgICAgICAgICAvLyAgICAgdGhpcy51bmRvRGVsZXRlKGFjdGlvblsxXSwgYWN0aW9uWzJdLCBhY3Rpb25bM10pO1xyXG4gICAgICAgICAgICAvLyAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBjYXNlIEFjdGlvblR5cGUud3JpdGVXaXRoU3BhY2U6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVuZG9Xcml0ZShhY3Rpb25bMV0sIGFjdGlvblsyXSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdW5kb1dyaXRlKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5nZXRDZWxsKHgsIHkpLnVuZG9Xcml0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdW5kb0RlbGV0ZSh4OiBudW1iZXIsIHk6IG51bWJlciwgdGV4dDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5nZXRDZWxsKHgsIHkpLnVuZG9EZWxldGUodGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNob3dQb3BvdmVyKHg6IG51bWJlciwgeTogbnVtYmVyLCBjZWxsOiBDZWxsKXtcclxuICAgICAgICB0aGlzLl8kcG9wb3Zlci5yZW1vdmVDbGFzcygnZC1ub25lJyk7XHJcbiAgICAgICAgdGhpcy5fJHBvcG92ZXIuYXR0cignc3R5bGUnLCBgbGVmdDogJHtjZWxsLnNjcmVlblggKyAxNn1weDsgdG9wOiAke2NlbGwuc2NyZWVuWSArIDE2fXB4O2ApO1xyXG4gICAgICAgIHRoaXMuXyRwb3BvdmVyLmZpbmQoJyNjb29yZHMnKS50ZXh0KGAke3h9LCAke3l9YCk7XHJcblxyXG4gICAgICAgIGxldCAkaW5wdXQgPSB0aGlzLl8kcG9wb3Zlci5maW5kKCcjY3NzU3R5bGVJbnB1dCcpO1xyXG4gICAgICAgICRpbnB1dC52YWwoY2VsbC5nZXRDc3NTdHlsZSgpKTtcclxuICAgICAgICAkaW5wdXQub2ZmKCdjaGFuZ2UnKTtcclxuICAgICAgICAkaW5wdXQub24oJ2NoYW5nZScsICgpID0+IGNlbGwuYWRkRGVjb3JXaXRoRnJpZW5kcygkaW5wdXQudmFsKCkpKTtcclxuXHJcbiAgICAgICAgbGV0ICRidXR0b24xID0gdGhpcy5fJHBvcG92ZXIuZmluZCgnI2VkaXRUZXh0QnV0dG9uJyk7XHJcbiAgICAgICAgJGJ1dHRvbjEub2ZmKCdjbGljaycpO1xyXG4gICAgICAgICRidXR0b24xLm9uKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgY2VsbC5mb2N1cygpO1xyXG4gICAgICAgICAgICB0aGlzLmhpZGVQb3BvdmVyKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCAkYnV0dG9uMiA9IHRoaXMuXyRwb3BvdmVyLmZpbmQoJyNkaXZpZGVCdXR0b24nKTtcclxuICAgICAgICAkYnV0dG9uMi5vZmYoJ2NsaWNrJyk7XHJcbiAgICAgICAgJGJ1dHRvbjIub24oJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjZWxsLnNlcGFyYXRlV2l0aEZyaWVuZHMoKTtcclxuICAgICAgICAgICAgY2VsbC5mb2N1cygpO1xyXG4gICAgICAgICAgICB0aGlzLmhpZGVQb3BvdmVyKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGhpZGVQb3BvdmVyKCl7XHJcbiAgICAgICAgdGhpcy5fJHBvcG92ZXIuYWRkQ2xhc3MoJ2Qtbm9uZScpO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGVudW0gVGFibGVNb2R7XHJcbiAgICBub25lLFxyXG4gICAgc2VsZWN0aW5nXHJcbn0iLCJpbXBvcnQge1RhYmxlfSBmcm9tIFwiLi9UYWJsZVwiO1xyXG5pbXBvcnQge0h0dHBDbGllbnR9IGZyb20gXCIuLi8uLi91dGlsL0h0dHBDbGllbnRcIjtcclxuaW1wb3J0IHtUYWJsZUluZm9SZXF1ZXN0fSBmcm9tIFwiLi4vLi4vdXRpbC9yZXF1ZXN0L1RhYmxlSW5mb1JlcXVlc3RcIjtcclxuaW1wb3J0IHtJc0xvZ2dlZEluUmVxdWVzdH0gZnJvbSBcIi4uLy4uL3V0aWwvcmVxdWVzdC9Jc0xvZ2dlZEluUmVxdWVzdFwiO1xyXG5pbXBvcnQge1RhYmxlTWVzc2FnZXNSZXF1ZXN0fSBmcm9tIFwiLi4vLi4vdXRpbC9yZXF1ZXN0L1RhYmxlTWVzc2FnZXNSZXF1ZXN0XCI7XHJcbmltcG9ydCB7IGdldFBhcmFtIH0gZnJvbSBcIi4uLy4uL3V0aWwvVXRpbFwiO1xyXG5cclxubGV0IHRhYmxlO1xyXG5jb25zdCBsaW5rID0gXCJodHRwczovL2NvbWdyaWQucnU6ODQ0M1wiO1xyXG5jb25zdCBjZWxsc1VuaW9ucyA9IFtcclxuICAgIHtcclxuICAgICAgICBsZWZ0VXBYOiAxMSxcclxuICAgICAgICBsZWZ0VXBZOiAxNCxcclxuICAgICAgICByaWdodERvd25YOiAxNyxcclxuICAgICAgICByaWdodERvd25ZOiAxN1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBsZWZ0VXBYOiAyMixcclxuICAgICAgICBsZWZ0VXBZOiAxNyxcclxuICAgICAgICByaWdodERvd25YOiAyNCxcclxuICAgICAgICByaWdodERvd25ZOiAzMFxyXG4gICAgfVxyXG5dO1xyXG5jb25zdCBkZWNvcmF0aW9ucyA9IFtcclxuICAgIHtcclxuICAgICAgICBsZWZ0VXBYOiAxMSxcclxuICAgICAgICBsZWZ0VXBZOiAxNCxcclxuICAgICAgICByaWdodERvd25YOiAxNyxcclxuICAgICAgICByaWdodERvd25ZOiAxNyxcclxuICAgICAgICBjc3NUZXh0OiBcImJhY2tncm91bmQtY29sb3I6IGJsdWU7IGNvbG9yOiB5ZWxsb3cgIWltcG9ydGFudDsgYm9yZGVyLWNvbG9yOiByZWQgIWltcG9ydGFudDtcIlxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBsZWZ0VXBYOiAzMSxcclxuICAgICAgICBsZWZ0VXBZOiA0MSxcclxuICAgICAgICByaWdodERvd25YOiAzMSxcclxuICAgICAgICByaWdodERvd25ZOiA0MSxcclxuICAgICAgICBjc3NUZXh0OiBcImJhY2tncm91bmQtY29sb3I6IHJnYigyMDQsMTEsMTEpOyBjb2xvcjogZ3JlZW4gIWltcG9ydGFudDsgYm9yZGVyLWNvbG9yOiBibHVlICFpbXBvcnRhbnQ7XCJcclxuICAgIH1cclxuXVxyXG5leHBvcnQgbGV0IHN0b3JlOiBhbnkgPSB7XHJcbiAgICBoZWlnaHQ6IDUwLFxyXG4gICAgd2lkdGg6IDUwLFxyXG4gICAgY2VsbHNVbmlvbnM6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxlZnRVcFg6IDExLFxyXG4gICAgICAgICAgICBsZWZ0VXBZOiAxNCxcclxuICAgICAgICAgICAgcmlnaHREb3duWDogMTcsXHJcbiAgICAgICAgICAgIHJpZ2h0RG93blk6IDE3XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxlZnRVcFg6IDIyLFxyXG4gICAgICAgICAgICBsZWZ0VXBZOiAxNyxcclxuICAgICAgICAgICAgcmlnaHREb3duWDogMjQsXHJcbiAgICAgICAgICAgIHJpZ2h0RG93blk6IDMwXHJcbiAgICAgICAgfVxyXG4gICAgXSxcclxuICAgIG1lc3NhZ2VzOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB4OiAyMixcclxuICAgICAgICAgICAgeTogMTcsXHJcbiAgICAgICAgICAgIHRleHQ6IFwi0KDQtdCx0Y/RgtCwLCDQv9GA0LjQstC10YIsINGH0YLQviDQt9Cw0LTQsNC70Lgg0L/QviDQv9GA0LXQutGA0LDRgdC90L7QuSDQttC40LfQvdC4INCx0LXQtyDQt9Cw0LHQvtGCP1wiXHJcbiAgICAgICAgfVxyXG4gICAgXSxcclxuICAgIHNlbGVjdGVkQ2xhc3NlczogWydiZy1kYXJrJywgJ3RleHQtbGlnaHQnXSxcclxuICAgIG5vU2VsZWN0ZWRDbGFzc2VzOiBbJ3RleHQtZGFyayddXHJcbn1cclxuXHJcbmNvbnN0IGh0dHBDbGllbnQgPSBuZXcgSHR0cENsaWVudChsaW5rKTtcclxuJCh3aW5kb3cpLm9uKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgaHR0cENsaWVudC5wcm9jZWVkUmVxdWVzdChcclxuICAgICAgICBuZXcgSXNMb2dnZWRJblJlcXVlc3QoKSxcclxuICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiWW91J3JlIG5vdCBsb2dnZWQgaW4sIHBsZWFzZSBsb2cgaW5cIilcclxuICAgICAgICB9XHJcbiAgICApLnRoZW4obG9hZFRhYmxlKVxyXG4gICAgLnRoZW4obG9hZFRhYmxlTWVzc2FnZXMpXHJcbiAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJUYWJsZSBtZXNzYWdlc1wiKVxyXG4gICAgICAgIHN0b3JlLmNlbGxzVW5pb25zID0gY2VsbHNVbmlvbnM7XHJcbiAgICAgICAgc3RvcmUuZGVjb3JhdGlvbnMgPSBkZWNvcmF0aW9ucztcclxuICAgICAgICB0YWJsZSA9IG5ldyBUYWJsZShzdG9yZSk7XHJcbiAgICB9KVxyXG59KTtcclxuXHJcbmZ1bmN0aW9uIGxvYWRUYWJsZSgpe1xyXG4gICAgbGV0IGNoYXRJZCA9IHBhcnNlSW50KGdldFBhcmFtKCdpZCcpKTtcclxuICAgIHJldHVybiBodHRwQ2xpZW50LnByb2NlZWRSZXF1ZXN0KFxyXG4gICAgICAgIG5ldyBUYWJsZUluZm9SZXF1ZXN0KHtcclxuICAgICAgICAgICAgY2hhdElkOiBjaGF0SWRcclxuICAgICAgICB9KSxcclxuICAgICAgICAoY29kZSwgZXJyb3JUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGlmKGNvZGUgPT09IDQwNCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJUYWJsZSBub3QgZm91bmRcIilcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3I6ICcke2NvZGV9LCAke2Vycm9yVGV4dH0nIHdoaWxlIGxvYWRpbmcgdGFibGUgaW5mb2ApXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICApLnRoZW4oKHRhYmxlKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2codGFibGUpXHJcbiAgICAgICAgc3RvcmUgPSB0YWJsZVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvYWRUYWJsZU1lc3NhZ2VzKCl7XHJcbiAgICBsZXQgY2hhdElkID0gcGFyc2VJbnQoZ2V0UGFyYW0oJ2lkJykpO1xyXG4gICAgcmV0dXJuIGh0dHBDbGllbnQucHJvY2VlZFJlcXVlc3QoXHJcbiAgICAgICAgbmV3IFRhYmxlTWVzc2FnZXNSZXF1ZXN0KHtcclxuICAgICAgICAgICAgY2hhdElkOiBjaGF0SWQsXHJcbiAgICAgICAgICAgIHhjb29yZExlZnRUb3A6IDAsXHJcbiAgICAgICAgICAgIHljb29yZExlZnRUb3A6IDAsXHJcbiAgICAgICAgICAgIHhjb29yZFJpZ2h0Qm90dG9tOiBzdG9yZS53aWR0aCAtIDEsXHJcbiAgICAgICAgICAgIHljb29yZFJpZ2h0Qm90dG9tOiBzdG9yZS5oZWlnaHQgLSAxLFxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIChjb2RlLCBlcnJvclRleHQpID0+IHtcclxuICAgICAgICAgICAgaWYoY29kZSA9PT0gNDAwKXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNvZGUgKyBcIiwgXCIgKyBlcnJvclRleHQpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYoY29kZSA9PT0gNDA0KXtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiY29kZTogXCIgKyBjb2RlICsgXCIsIGVycm9yOiBcIiArIGVycm9yVGV4dCk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImNvZGU6IFwiICsgY29kZSArIFwiLCBlcnJvcjogXCIgKyBlcnJvclRleHQpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYoY29kZSA9PT0gNDAzICYmIGVycm9yVGV4dCA9PT0gXCJhY2Nlc3MuY2hhdC5yZWFkX21lc3NhZ2VzXCIpe1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJZb3UgZG9uJ3QgaGF2ZSBlbm91Z2ggcmlnaHRzIHRvIGFjY2VzcyB0aGlzIGNoYXRcIilcclxuICAgICAgICAgICAgfWVsc2UgaWYoXHJcbiAgICAgICAgICAgICAgICBjb2RlID09PSA0MjIgJiYgKGVycm9yVGV4dCA9PT0gXCJvdXRfb2ZfYm91bmRzXCIgfHxcclxuICAgICAgICAgICAgICAgIGVycm9yVGV4dCA9PT0gXCJ0aW1lLm5lZ2F0aXZlLW9yLWZ1dHVyZVwiXHJcbiAgICAgICAgICAgICkpeyAvLyBzaG91bGQgbm90IGhhcHBlblxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYGhlaWdodDogJHtzdG9yZS5oZWlnaHQgLSAxfSwgd2lkdGg6ICR7c3RvcmUud2lkdGggLSAxfWApXHJcbiAgICAgICAgICAgICAgICBhbGVydChcIlNob3VsZCBub3QgaGFwcGVuLCBzZWUgY29uc29sZVwiKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgKS50aGVuKChtZXNzYWdlcykgPT4ge1xyXG4gICAgICAgIHN0b3JlLm1lc3NhZ2VzID0gbWVzc2FnZXNcclxuICAgIH0pO1xyXG59XHJcbiIsIlxyXG5leHBvcnQgZW51bSBBY3Rpb25UeXBlIHtcclxuICAgIHdyaXRlLFxyXG4gICAgd3JpdGVXaXRoU3BhY2UsXHJcbiAgICBkZWxldGUsXHJcbiAgICB1bmlvblxyXG59XHJcblxyXG5leHBvcnQgdHlwZSBBY3Rpb24gPSBbYWN0aW9uVHlwZTogQWN0aW9uVHlwZSwgY2VsbFg6IG51bWJlciwgY2VsbFk6IG51bWJlciwgaW5mbz86IGFueV07IiwiZXhwb3J0IGVudW0gRGlyZWN0aW9ue1xyXG4gICAgbGVmdCxcclxuICAgIHJpZ2h0LFxyXG4gICAgdG9wLFxyXG4gICAgYm90dG9tXHJcbn0iLCJpbXBvcnQge1JlcXVlc3RXcmFwcGVyfSBmcm9tIFwiLi9yZXF1ZXN0L1JlcXVlc3RcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgSHR0cENsaWVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGFwaUxpbms6IHN0cmluZykge31cclxuXHJcbiAgICBhc3luYyBwcm9jZWVkUmVxdWVzdDxUPihcclxuICAgICAgICByZXF1ZXN0OiBSZXF1ZXN0V3JhcHBlcjxUPixcclxuICAgICAgICBvbkZhaWx1cmU6IChjb2RlOiBudW1iZXIsIGVycm9yVGV4dDogc3RyaW5nKSA9PiB1bmtub3duID1cclxuICAgICAgICAgICAgKGNvZGUsIGVycm9yVGV4dCkgPT4gYWxlcnQoYGNvZGU6ICR7Y29kZX0sIGVycm9yOiAke2Vycm9yVGV4dH1gKSxcclxuICAgICAgICBvbk5ldHdvcmtGYWlsdXJlOiAocmVhc29uKSA9PiB1bmtub3duID1cclxuICAgICAgICAgICAgKHJlYXNvbikgPT4gYWxlcnQoYG5ldHdvcmsgZXJyb3I6ICR7cmVhc29ufWApXHJcbiAgICApOiBQcm9taXNlPFQ+e1xyXG4gICAgICAgIGNvbnN0IGZpbmFsTGluayA9IG5ldyBVUkwodGhpcy5hcGlMaW5rICsgcmVxdWVzdC5lbmRwb2ludClcclxuICAgICAgICBpZihyZXF1ZXN0LnBhcmFtZXRlcnMgIT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICBmaW5hbExpbmsuc2VhcmNoID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhyZXF1ZXN0LnBhcmFtZXRlcnMpLnRvU3RyaW5nKClcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2cocmVxdWVzdClcclxuICAgICAgICByZXR1cm4gZmV0Y2goXHJcbiAgICAgICAgICAgIGZpbmFsTGluay50b1N0cmluZygpLFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjcmVkZW50aWFsczogXCJpbmNsdWRlXCIsXHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6IHJlcXVlc3QubWV0aG9kVHlwZSxcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHJlcXVlc3QuaGVhZGVycyxcclxuICAgICAgICAgICAgICAgIGJvZHk6IHJlcXVlc3QuYm9keVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKS50aGVuKChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICBpZihyZXNwb25zZS5zdGF0dXMgPT09IDIwMCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wcm9jZWVkUmVxdWVzdChyZXNwb25zZSlcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICByZXNwb25zZS50ZXh0KCkudGhlbih0ZXh0ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBvbkZhaWx1cmUocmVzcG9uc2Uuc3RhdHVzLCB0ZXh0KVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCh0ZXh0KVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIE1ldGhvZFR5cGV7XHJcbiAgICBQT1NUPVwiUE9TVFwiLFxyXG4gICAgR0VUPVwiR0VUXCIsXHJcbiAgICBQQVRDSD1cIlBBVENIXCIsXHJcbiAgICBQVVQ9XCJQVVRcIixcclxufSIsIlxyXG5cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGFyYW0obmFtZTogc3RyaW5nKTogc3RyaW5ne1xyXG4gIGNvbnN0IHVybFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaClcclxuICByZXR1cm4gdXJsUGFyYW1zLmdldChuYW1lKVxyXG59IiwiaW1wb3J0IFNvY2tKUyBmcm9tIFwic29ja2pzLWNsaWVudFwiO1xyXG5pbXBvcnQge0NvbXBhdENsaWVudCwgU3RvbXB9IGZyb20gXCJAc3RvbXAvc3RvbXBqc1wiO1xyXG5pbXBvcnQge1RvcGljfSBmcm9tIFwiLi93ZWJzb2NrZXQvVG9waWNcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgV2ViU29ja2V0Q2xpZW50e1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBzb2NrZXQ6IFdlYlNvY2tldFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBzdG9tcENsaWVudDogQ29tcGF0Q2xpZW50XHJcbiAgICBwcml2YXRlIGNvbm5lY3RlZDogYm9vbGVhbiA9IGZhbHNlXHJcbiAgICBjb25zdHJ1Y3RvcihhcGlMaW5rOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnNvY2tldCA9IG5ldyBTb2NrSlMoYXBpTGluayk7XHJcbiAgICAgICAgdGhpcy5zdG9tcENsaWVudCA9IFN0b21wLm92ZXIodGhpcy5zb2NrZXQpXHJcbiAgICAgICAgdGhpcy5zdG9tcENsaWVudC5jb25uZWN0KClcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY29ubmVjdDxJbiwgT3V0Pih0b3BpYzogVG9waWM8SW4sIE91dD4sIG9uTWVzc2FnZTogKEluKSA9PiB1bmtub3duKXtcclxuICAgICAgICB0aGlzLnN0b21wQ2xpZW50LmNvbm5lY3Qoe30sXHJcbiAgICAgICAgICAgIChmcmFtZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdG9tcENsaWVudC5zdWJzY3JpYmUodG9waWMuZGVzdGluYXRpb24oKSwgbWVzc2FnZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3RyID0gbmV3IFRleHREZWNvZGVyKCkuZGVjb2RlKG1lc3NhZ2UuYmluYXJ5Qm9keSlcclxuICAgICAgICAgICAgICAgICAgICBvbk1lc3NhZ2UodG9waWMucHJvY2VlZE1lc3NhZ2Uoc3RyKSlcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbm5lY3RlZCA9IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdGhpcy5kaXNjb25uZWN0LFxyXG4gICAgICAgICAgICB0aGlzLmRpc2Nvbm5lY3RcclxuICAgICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkaXNjb25uZWN0KCl7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0ZWQgPSBmYWxzZVxyXG4gICAgfVxyXG5cclxuICAgIHN1YnNjcmliZTxJbiwgT3V0Pih0b3BpYzogVG9waWM8SW4sIE91dD4sIG9uTWVzc2FnZTogKEluKSA9PiB1bmtub3duKXtcclxuICAgICAgICBpZih0aGlzLnN0b21wQ2xpZW50LmNvbm5lY3RlZCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvbm5lY3RlZFwiKVxyXG4gICAgICAgICAgICB0aGlzLnN0b21wQ2xpZW50LnN1YnNjcmliZSh0b3BpYy5kZXN0aW5hdGlvbigpLCBtZXNzYWdlID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHN0ciA9IG5ldyBUZXh0RGVjb2RlcigpLmRlY29kZShtZXNzYWdlLmJpbmFyeUJvZHkpXHJcbiAgICAgICAgICAgICAgICBvbk1lc3NhZ2UodG9waWMucHJvY2VlZE1lc3NhZ2Uoc3RyKSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJub3QgY29ubmVjdGVkXCIpXHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRPbkNvbm5lY3QgPSB0aGlzLnN0b21wQ2xpZW50Lm9uQ29ubmVjdFxyXG4gICAgICAgICAgICB0aGlzLnN0b21wQ2xpZW50Lm9uQ29ubmVjdCA9IChmcmFtZSkgPT4gdGhpcy5zdG9tcENsaWVudC5zdWJzY3JpYmUodG9waWMuZGVzdGluYXRpb24oKSwgbWVzc2FnZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50T25Db25uZWN0KGZyYW1lKVxyXG4gICAgICAgICAgICAgICAgY29uc3Qgc3RyID0gbmV3IFRleHREZWNvZGVyKCkuZGVjb2RlKG1lc3NhZ2UuYmluYXJ5Qm9keSlcclxuICAgICAgICAgICAgICAgIG9uTWVzc2FnZSh0b3BpYy5wcm9jZWVkTWVzc2FnZShzdHIpKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZW5kTWVzc2FnZTxJbiwgT3V0Pih0b3BpYzogVG9waWM8SW4sIE91dD4sIG1lc3NhZ2U6IE91dCl7XHJcbiAgICAgICAgdGhpcy5zdG9tcENsaWVudC5zZW5kKHRvcGljLnJlY2VpdmUoKSwge30sIEpTT04uc3RyaW5naWZ5KG1lc3NhZ2UpKVxyXG4gICAgfVxyXG59XHJcblxyXG4iLCJpbXBvcnQge1JlcXVlc3RXcmFwcGVyfSBmcm9tIFwiLi9SZXF1ZXN0XCI7XHJcbmltcG9ydCB7TWV0aG9kVHlwZX0gZnJvbSBcIi4uL0h0dHBDbGllbnRcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgSXNMb2dnZWRJblJlcXVlc3QgaW1wbGVtZW50cyBSZXF1ZXN0V3JhcHBlcjxudW1iZXI+e1xyXG4gICAgcmVhZG9ubHkgZW5kcG9pbnQ6IHN0cmluZyA9ICcvdXNlci9sb2dpbic7XHJcbiAgICByZWFkb25seSBtZXRob2RUeXBlOiBNZXRob2RUeXBlID0gTWV0aG9kVHlwZS5HRVQ7XHJcblxyXG4gICAgYXN5bmMgcHJvY2VlZFJlcXVlc3QocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTxudW1iZXI+IHtcclxuICAgICAgICByZXR1cm4gcmVzcG9uc2Uuc3RhdHVzO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHtNZXRob2RUeXBlfSBmcm9tIFwiLi4vSHR0cENsaWVudFwiO1xyXG5pbXBvcnQge1JlcXVlc3RXcmFwcGVyfSBmcm9tIFwiLi9SZXF1ZXN0XCI7XHJcbmltcG9ydCB7VGFibGVSZXNwb25zZX0gZnJvbSBcIi4vQ3JlYXRlVGFibGVSZXF1ZXN0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVGFibGVJbmZvUmVxdWVzdCBpbXBsZW1lbnRzIFJlcXVlc3RXcmFwcGVyPFRhYmxlUmVzcG9uc2U+IHtcclxuICAgIHJlYWRvbmx5IHBhcmFtZXRlcnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcGFyYW1ldGVyczoge1xyXG4gICAgICAgICAgICBjaGF0SWQ6IG51bWJlcixcclxuICAgICAgICAgICAgaW5jbHVkZVBhcnRpY2lwYW50cz86IGJvb2xlYW5cclxuICAgICAgICB9XHJcbiAgICApIHtcclxuICAgICAgICBsZXQgcGFyYW1zOiBhbnkgPSB7fVxyXG4gICAgICAgIHBhcmFtcy5jaGF0SWQgPSBwYXJhbWV0ZXJzLmNoYXRJZC50b1N0cmluZygpXHJcbiAgICAgICAgaWYocGFyYW1ldGVycy5pbmNsdWRlUGFydGljaXBhbnRzKVxyXG4gICAgICAgICAgICBwYXJhbXMuaW5jbHVkZVBhcnRpY2lwYW50cyA9IHBhcmFtZXRlcnMuaW5jbHVkZVBhcnRpY2lwYW50cz8udG9TdHJpbmcoKVxyXG5cclxuICAgICAgICB0aGlzLnBhcmFtZXRlcnMgPSBwYXJhbXM7XHJcbiAgICB9XHJcblxyXG4gICAgcmVhZG9ubHkgZW5kcG9pbnQ6IHN0cmluZyA9IFwiL3RhYmxlL2luZm9cIjtcclxuICAgIHJlYWRvbmx5IG1ldGhvZFR5cGU6IE1ldGhvZFR5cGUgPSBNZXRob2RUeXBlLkdFVDtcclxuXHJcbiAgICBhc3luYyBwcm9jZWVkUmVxdWVzdChyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPFRhYmxlUmVzcG9uc2U+IHtcclxuICAgICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpXHJcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodGV4dCkgYXMgVGFibGVSZXNwb25zZVxyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCB7UmVxdWVzdFdyYXBwZXJ9IGZyb20gXCIuL1JlcXVlc3RcIjtcclxuaW1wb3J0IHtNZXRob2RUeXBlfSBmcm9tIFwiLi4vSHR0cENsaWVudFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1lc3NhZ2VSZXNwb25zZXtcclxuICAgIHJlYWRvbmx5IGlkITogbnVtYmVyXHJcbiAgICByZWFkb25seSB4ITogbnVtYmVyXHJcbiAgICByZWFkb25seSB5ITogbnVtYmVyXHJcbiAgICByZWFkb25seSBjaGF0SWQhOiBudW1iZXJcclxuICAgIHJlYWRvbmx5IHRpbWUhOiBEYXRlXHJcbiAgICByZWFkb25seSBzZW5kZXJJZCE6IHN0cmluZ1xyXG4gICAgcmVhZG9ubHkgdGV4dCE6IHN0cmluZ1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVGFibGVNZXNzYWdlc1JlcXVlc3QgaW1wbGVtZW50cyBSZXF1ZXN0V3JhcHBlcjxNZXNzYWdlUmVzcG9uc2VbXT57XHJcbiAgICByZWFkb25seSBib2R5OiBhbnlcclxuICAgIGNvbnN0cnVjdG9yKGJvZHk6IHtcclxuICAgICAgICBjaGF0SWQ6IG51bWJlcixcclxuICAgICAgICB4Y29vcmRMZWZ0VG9wOiBudW1iZXIsXHJcbiAgICAgICAgeWNvb3JkTGVmdFRvcDogbnVtYmVyLFxyXG4gICAgICAgIHhjb29yZFJpZ2h0Qm90dG9tOiBudW1iZXIsXHJcbiAgICAgICAgeWNvb3JkUmlnaHRCb3R0b206IG51bWJlcixcclxuICAgICAgICBzaW5jZURhdGVUaW1lTWlsbGlzPzogbnVtYmVyLFxyXG4gICAgICAgIHVudGlsRGF0ZVRpbWVNaWxsaXM/OiBudW1iZXIsXHJcbiAgICB9KSB7XHJcbiAgICAgICAgdGhpcy5ib2R5ID0gSlNPTi5zdHJpbmdpZnkoYm9keSlcclxuICAgIH1cclxuICAgIHJlYWRvbmx5IGVuZHBvaW50OiBzdHJpbmcgPSAnL21lc3NhZ2UvbGlzdCc7XHJcbiAgICByZWFkb25seSBoZWFkZXJzOiBIZWFkZXJzSW5pdCA9IHtcclxuICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxyXG4gICAgfTtcclxuICAgIHJlYWRvbmx5IG1ldGhvZFR5cGU6IE1ldGhvZFR5cGUgPSBNZXRob2RUeXBlLlBPU1Q7XHJcblxyXG4gICAgYXN5bmMgcHJvY2VlZFJlcXVlc3QocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTxNZXNzYWdlUmVzcG9uc2VbXT4ge1xyXG4gICAgICAgIGNvbnN0IHRleHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XHJcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodGV4dCkgYXMgTWVzc2FnZVJlc3BvbnNlW107XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHtSZXF1ZXN0V3JhcHBlcn0gZnJvbSBcIi4vUmVxdWVzdFwiO1xyXG5pbXBvcnQge1RhYmxlUmVzcG9uc2V9IGZyb20gXCIuL0NyZWF0ZVRhYmxlUmVxdWVzdFwiO1xyXG5pbXBvcnQge01ldGhvZFR5cGV9IGZyb20gXCIuLi9IdHRwQ2xpZW50XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVXNlclJlc3BvbnNle1xyXG4gICAgcmVhZG9ubHkgaWQhOiBzdHJpbmdcclxuICAgIHJlYWRvbmx5IG5hbWUhOiBzdHJpbmdcclxuICAgIHJlYWRvbmx5IGVtYWlsITogc3RyaW5nXHJcbiAgICByZWFkb25seSBhdmF0YXIhOiBzdHJpbmdcclxuICAgIHJlYWRvbmx5IGNyZWF0ZWQhOiBEYXRlXHJcbiAgICByZWFkb25seSBjaGF0cz86IFRhYmxlUmVzcG9uc2VbXVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVXNlckluZm9SZXF1ZXN0IGltcGxlbWVudHMgUmVxdWVzdFdyYXBwZXI8VXNlclJlc3BvbnNlPntcclxuICAgIHJlYWRvbmx5IHBhcmFtZXRlcnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXJhbWV0ZXJzOiB7IGluY2x1ZGVDaGF0cz86IGJvb2xlYW4gfSkge1xyXG4gICAgICAgIGxldCBwYXJhbXM6IGFueSA9IHt9XHJcbiAgICAgICAgaWYocGFyYW1ldGVycy5pbmNsdWRlQ2hhdHMpXHJcbiAgICAgICAgICAgIHBhcmFtcy5pbmNsdWRlQ2hhdHMgPSBwYXJhbWV0ZXJzLmluY2x1ZGVDaGF0cz8udG9TdHJpbmcoKVxyXG5cclxuICAgICAgICB0aGlzLnBhcmFtZXRlcnMgPSBwYXJhbXNcclxuICAgIH1cclxuXHJcbiAgICByZWFkb25seSBlbmRwb2ludDogc3RyaW5nID0gXCIvdXNlci9pbmZvXCI7XHJcbiAgICByZWFkb25seSBtZXRob2RUeXBlOiBNZXRob2RUeXBlID0gTWV0aG9kVHlwZS5HRVQ7XHJcblxyXG4gICAgYXN5bmMgcHJvY2VlZFJlcXVlc3QocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTxVc2VyUmVzcG9uc2U+IHtcclxuICAgICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xyXG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHRleHQpIGFzIFVzZXJSZXNwb25zZTtcclxuICAgIH1cclxufSIsImltcG9ydCB7VG9waWN9IGZyb20gXCIuL1RvcGljXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTWVzc2FnZUluIHtcclxuICAgIGlkITogbnVtYmVyXHJcbiAgICB4ITogbnVtYmVyXHJcbiAgICB5ITogbnVtYmVyXHJcbiAgICBjaGF0SWQhOiBudW1iZXJcclxuICAgIHRpbWUhOiBEYXRlXHJcbiAgICBzZW5kZXJJZCE6IHN0cmluZ1xyXG4gICAgdGV4dCE6IHN0cmluZ1xyXG59XHJcbmV4cG9ydCBjbGFzcyBNZXNzYWdlT3V0IHtcclxuICAgIHghOiBudW1iZXJcclxuICAgIHkhOiBudW1iZXJcclxuICAgIGNoYXRJZCE6IG51bWJlclxyXG4gICAgdGV4dCE6IHN0cmluZ1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVGFibGVUb3BpYyBleHRlbmRzIFRvcGljPE1lc3NhZ2VJbiwgTWVzc2FnZU91dD57XHJcbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSB0YWJsZUlkOiBudW1iZXIpIHtcclxuICAgICAgICBzdXBlcihcIi9jb25uZWN0aW9uL3RhYmxlX21lc3NhZ2Uve2lkfVwiLCBcIi9jb25uZWN0aW9uL3RhYmxlX21lc3NhZ2UvZWRpdF9vcl9zZW5kXCIsIHRhYmxlSWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb2NlZWRNZXNzYWdlKG1lc3NhZ2UpOiBNZXNzYWdlSW4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UpO1xyXG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKG1lc3NhZ2UpIGFzIE1lc3NhZ2VJbjtcclxuICAgIH1cclxufSIsImV4cG9ydCBhYnN0cmFjdCBjbGFzcyBUb3BpYzxSZWNlaXZlZE1lc3NhZ2UsIFNlbnRNZXNzYWdlPiB7XHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICByZWFkb25seSBkZXN0aW5hdGlvblBhdGg6IHN0cmluZyxcclxuICAgICAgICByZWFkb25seSByZWNlaXZlUGF0aDogc3RyaW5nLFxyXG4gICAgICAgIHJlYWRvbmx5IGlkZW50aWZpZXI6IGFueVxyXG4gICAgKSB7fVxyXG5cclxuICAgIGRlc3RpbmF0aW9uKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVzdGluYXRpb25QYXRoLnJlcGxhY2UoXCJ7aWR9XCIsIHRoaXMuaWRlbnRpZmllcilcclxuICAgIH1cclxuICAgIHJlY2VpdmUoKTogc3RyaW5ne1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlY2VpdmVQYXRoO1xyXG4gICAgfVxyXG5cclxuICAgIGFic3RyYWN0IHByb2NlZWRNZXNzYWdlKG1lc3NhZ2UpOiBSZWNlaXZlZE1lc3NhZ2VcclxufSIsImltcG9ydCB7VG9waWN9IGZyb20gXCIuL1RvcGljXCI7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFVzZXJUb3BpYyBleHRlbmRzIFRvcGljPGFueSwgdW5rbm93bj57XHJcbiAgICBwcm9jZWVkTWVzc2FnZShtZXNzYWdlKTogYW55IHtcclxuICAgICAgICByZXR1cm4gbWVzc2FnZVxyXG4gICAgfVxyXG4gICAgY29uc3RydWN0b3IodXNlcklkOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihcIi9jb25uZWN0aW9uL3VzZXIve2lkfVwiLCBcIlwiLCB1c2VySWQpO1xyXG4gICAgfVxyXG59IiwiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoXCJTdG9tcEpzXCIsIFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIlN0b21wSnNcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiU3RvbXBKc1wiXSA9IGZhY3RvcnkoKTtcbn0pKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyA/IHNlbGYgOiB0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiAvKioqKioqLyAoZnVuY3Rpb24obW9kdWxlcykgeyAvLyB3ZWJwYWNrQm9vdHN0cmFwXG4vKioqKioqLyBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbi8qKioqKiovIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4vKioqKioqLyBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4vKioqKioqLyBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbi8qKioqKiovIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuLyoqKioqKi8gXHRcdH1cbi8qKioqKiovIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuLyoqKioqKi8gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbi8qKioqKiovIFx0XHRcdGk6IG1vZHVsZUlkLFxuLyoqKioqKi8gXHRcdFx0bDogZmFsc2UsXG4vKioqKioqLyBcdFx0XHRleHBvcnRzOiB7fVxuLyoqKioqKi8gXHRcdH07XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuLyoqKioqKi8gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4vKioqKioqLyBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuLyoqKioqKi8gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbi8qKioqKiovIFx0fVxuLyoqKioqKi9cbi8qKioqKiovXG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuLyoqKioqKi8gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbi8qKioqKiovIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuLyoqKioqKi8gXHRcdH1cbi8qKioqKiovIFx0fTtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuLyoqKioqKi8gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuLyoqKioqKi8gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4vKioqKioqLyBcdFx0fVxuLyoqKioqKi8gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4vKioqKioqLyBcdH07XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3Rcbi8qKioqKiovIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4vKioqKioqLyBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuLyoqKioqKi8gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3Rcbi8qKioqKiovIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuLyoqKioqKi8gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuLyoqKioqKi8gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4vKioqKioqLyBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbi8qKioqKiovIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4vKioqKioqLyBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuLyoqKioqKi8gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbi8qKioqKiovIFx0XHRyZXR1cm4gbnM7XG4vKioqKioqLyBcdH07XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbi8qKioqKiovIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbi8qKioqKiovIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4vKioqKioqLyBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbi8qKioqKiovIFx0XHRyZXR1cm4gZ2V0dGVyO1xuLyoqKioqKi8gXHR9O1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG4vKioqKioqL1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vKioqKioqLyBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuLyoqKioqKi8gfSlcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqLyAoe1xuXG4vKioqLyBcIi4vc3JjL2F1Z21lbnQtd2Vic29ja2V0LnRzXCI6XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vc3JjL2F1Z21lbnQtd2Vic29ja2V0LnRzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyohIGV4cG9ydHMgcHJvdmlkZWQ6IGF1Z21lbnRXZWJzb2NrZXQgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIF9fd2VicGFja19leHBvcnRzX18sIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXCJ1c2Ugc3RyaWN0XCI7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIoX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4vKiBoYXJtb255IGV4cG9ydCAoYmluZGluZykgKi8gX193ZWJwYWNrX3JlcXVpcmVfXy5kKF9fd2VicGFja19leHBvcnRzX18sIFwiYXVnbWVudFdlYnNvY2tldFwiLCBmdW5jdGlvbigpIHsgcmV0dXJuIGF1Z21lbnRXZWJzb2NrZXQ7IH0pO1xuLyoqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZnVuY3Rpb24gYXVnbWVudFdlYnNvY2tldCh3ZWJTb2NrZXQsIGRlYnVnKSB7XG4gICAgd2ViU29ja2V0LnRlcm1pbmF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc3Qgbm9PcCA9ICgpID0+IHsgfTtcbiAgICAgICAgLy8gc2V0IGFsbCBjYWxsYmFja3MgdG8gbm8gb3BcbiAgICAgICAgdGhpcy5vbmVycm9yID0gbm9PcDtcbiAgICAgICAgdGhpcy5vbm1lc3NhZ2UgPSBub09wO1xuICAgICAgICB0aGlzLm9ub3BlbiA9IG5vT3A7XG4gICAgICAgIGNvbnN0IHRzID0gbmV3IERhdGUoKTtcbiAgICAgICAgY29uc3Qgb3JpZ09uQ2xvc2UgPSB0aGlzLm9uY2xvc2U7XG4gICAgICAgIC8vIFRyYWNrIGRlbGF5IGluIGFjdHVhbCBjbG9zdXJlIG9mIHRoZSBzb2NrZXRcbiAgICAgICAgdGhpcy5vbmNsb3NlID0gY2xvc2VFdmVudCA9PiB7XG4gICAgICAgICAgICBjb25zdCBkZWxheSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gdHMuZ2V0VGltZSgpO1xuICAgICAgICAgICAgZGVidWcoYERpc2NhcmRlZCBzb2NrZXQgY2xvc2VkIGFmdGVyICR7ZGVsYXl9bXMsIHdpdGggY29kZS9yZWFzb246ICR7Y2xvc2VFdmVudC5jb2RlfS8ke2Nsb3NlRXZlbnQucmVhc29ufWApO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgIG9yaWdPbkNsb3NlLmNhbGwodGhpcywge1xuICAgICAgICAgICAgY29kZTogNDAwMSxcbiAgICAgICAgICAgIHJlYXNvbjogJ0hlYXJ0YmVhdCBmYWlsdXJlLCBkaXNjYXJkaW5nIHRoZSBzb2NrZXQnLFxuICAgICAgICAgICAgd2FzQ2xlYW46IGZhbHNlLFxuICAgICAgICB9KTtcbiAgICB9O1xufVxuXG5cbi8qKiovIH0pLFxuXG4vKioqLyBcIi4vc3JjL2J5dGUudHNcIjpcbi8qISoqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiAuL3NyYy9ieXRlLnRzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKiovXG4vKiEgZXhwb3J0cyBwcm92aWRlZDogQllURSAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgX193ZWJwYWNrX2V4cG9ydHNfXywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cInVzZSBzdHJpY3RcIjtcbl9fd2VicGFja19yZXF1aXJlX18ucihfX3dlYnBhY2tfZXhwb3J0c19fKTtcbi8qIGhhcm1vbnkgZXhwb3J0IChiaW5kaW5nKSAqLyBfX3dlYnBhY2tfcmVxdWlyZV9fLmQoX193ZWJwYWNrX2V4cG9ydHNfXywgXCJCWVRFXCIsIGZ1bmN0aW9uKCkgeyByZXR1cm4gQllURTsgfSk7XG4vKipcbiAqIFNvbWUgYnl0ZSB2YWx1ZXMsIHVzZWQgYXMgcGVyIFNUT01QIHNwZWNpZmljYXRpb25zLlxuICpcbiAqIFBhcnQgb2YgYEBzdG9tcC9zdG9tcGpzYC5cbiAqXG4gKiBAaW50ZXJuYWxcbiAqL1xuY29uc3QgQllURSA9IHtcbiAgICAvLyBMSU5FRkVFRCBieXRlIChvY3RldCAxMClcbiAgICBMRjogJ1xceDBBJyxcbiAgICAvLyBOVUxMIGJ5dGUgKG9jdGV0IDApXG4gICAgTlVMTDogJ1xceDAwJyxcbn07XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIFwiLi9zcmMvY2xpZW50LnRzXCI6XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiAuL3NyYy9jbGllbnQudHMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqL1xuLyohIGV4cG9ydHMgcHJvdmlkZWQ6IENsaWVudCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgX193ZWJwYWNrX2V4cG9ydHNfXywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cInVzZSBzdHJpY3RcIjtcbl9fd2VicGFja19yZXF1aXJlX18ucihfX3dlYnBhY2tfZXhwb3J0c19fKTtcbi8qIGhhcm1vbnkgZXhwb3J0IChiaW5kaW5nKSAqLyBfX3dlYnBhY2tfcmVxdWlyZV9fLmQoX193ZWJwYWNrX2V4cG9ydHNfXywgXCJDbGllbnRcIiwgZnVuY3Rpb24oKSB7IHJldHVybiBDbGllbnQ7IH0pO1xuLyogaGFybW9ueSBpbXBvcnQgKi8gdmFyIF9zdG9tcF9oYW5kbGVyX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuL3N0b21wLWhhbmRsZXIgKi8gXCIuL3NyYy9zdG9tcC1oYW5kbGVyLnRzXCIpO1xuLyogaGFybW9ueSBpbXBvcnQgKi8gdmFyIF90eXBlc19fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMV9fID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi90eXBlcyAqLyBcIi4vc3JjL3R5cGVzLnRzXCIpO1xuLyogaGFybW9ueSBpbXBvcnQgKi8gdmFyIF92ZXJzaW9uc19fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMl9fID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi92ZXJzaW9ucyAqLyBcIi4vc3JjL3ZlcnNpb25zLnRzXCIpO1xudmFyIF9fYXdhaXRlciA9ICh1bmRlZmluZWQgJiYgdW5kZWZpbmVkLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuXG5cblxuLyoqXG4gKiBTVE9NUCBDbGllbnQgQ2xhc3MuXG4gKlxuICogUGFydCBvZiBgQHN0b21wL3N0b21wanNgLlxuICovXG5jbGFzcyBDbGllbnQge1xuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhbiBpbnN0YW5jZS5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcihjb25mID0ge30pIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNUT01QIHZlcnNpb25zIHRvIGF0dGVtcHQgZHVyaW5nIFNUT01QIGhhbmRzaGFrZS4gQnkgZGVmYXVsdCB2ZXJzaW9ucyBgMS4wYCwgYDEuMWAsIGFuZCBgMS4yYCBhcmUgYXR0ZW1wdGVkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBFeGFtcGxlOlxuICAgICAgICAgKiBgYGBqYXZhc2NyaXB0XG4gICAgICAgICAqICAgICAgICAvLyBUcnkgb25seSB2ZXJzaW9ucyAxLjAgYW5kIDEuMVxuICAgICAgICAgKiAgICAgICAgY2xpZW50LnN0b21wVmVyc2lvbnMgPSBuZXcgVmVyc2lvbnMoWycxLjAnLCAnMS4xJ10pXG4gICAgICAgICAqIGBgYFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5zdG9tcFZlcnNpb25zID0gX3ZlcnNpb25zX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8yX19bXCJWZXJzaW9uc1wiXS5kZWZhdWx0O1xuICAgICAgICAvKipcbiAgICAgICAgICogV2lsbCByZXRyeSBpZiBTdG9tcCBjb25uZWN0aW9uIGlzIG5vdCBlc3RhYmxpc2hlZCBpbiBzcGVjaWZpZWQgbWlsbGlzZWNvbmRzLlxuICAgICAgICAgKiBEZWZhdWx0IDAsIHdoaWNoIGltcGxpZXMgd2FpdCBmb3IgZXZlci5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuY29ubmVjdGlvblRpbWVvdXQgPSAwO1xuICAgICAgICAvKipcbiAgICAgICAgICogIGF1dG9tYXRpY2FsbHkgcmVjb25uZWN0IHdpdGggZGVsYXkgaW4gbWlsbGlzZWNvbmRzLCBzZXQgdG8gMCB0byBkaXNhYmxlLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5yZWNvbm5lY3REZWxheSA9IDUwMDA7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbmNvbWluZyBoZWFydGJlYXQgaW50ZXJ2YWwgaW4gbWlsbGlzZWNvbmRzLiBTZXQgdG8gMCB0byBkaXNhYmxlLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5oZWFydGJlYXRJbmNvbWluZyA9IDEwMDAwO1xuICAgICAgICAvKipcbiAgICAgICAgICogT3V0Z29pbmcgaGVhcnRiZWF0IGludGVydmFsIGluIG1pbGxpc2Vjb25kcy4gU2V0IHRvIDAgdG8gZGlzYWJsZS5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuaGVhcnRiZWF0T3V0Z29pbmcgPSAxMDAwMDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoaXMgc3dpdGNoZXMgb24gYSBub24gc3RhbmRhcmQgYmVoYXZpb3Igd2hpbGUgc2VuZGluZyBXZWJTb2NrZXQgcGFja2V0cy5cbiAgICAgICAgICogSXQgc3BsaXRzIGxhcmdlciAodGV4dCkgcGFja2V0cyBpbnRvIGNodW5rcyBvZiBbbWF4V2ViU29ja2V0Q2h1bmtTaXplXXtAbGluayBDbGllbnQjbWF4V2ViU29ja2V0Q2h1bmtTaXplfS5cbiAgICAgICAgICogT25seSBKYXZhIFNwcmluZyBicm9rZXJzIHNlZW1zIHRvIHVzZSB0aGlzIG1vZGUuXG4gICAgICAgICAqXG4gICAgICAgICAqIFdlYlNvY2tldHMsIGJ5IGl0c2VsZiwgc3BsaXQgbGFyZ2UgKHRleHQpIHBhY2tldHMsXG4gICAgICAgICAqIHNvIGl0IGlzIG5vdCBuZWVkZWQgd2l0aCBhIHRydWx5IGNvbXBsaWFudCBTVE9NUC9XZWJTb2NrZXQgYnJva2VyLlxuICAgICAgICAgKiBBY3R1YWxseSBzZXR0aW5nIGl0IGZvciBzdWNoIGJyb2tlciB3aWxsIGNhdXNlIGxhcmdlIG1lc3NhZ2VzIHRvIGZhaWwuXG4gICAgICAgICAqXG4gICAgICAgICAqIGBmYWxzZWAgYnkgZGVmYXVsdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQmluYXJ5IGZyYW1lcyBhcmUgbmV2ZXIgc3BsaXQuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnNwbGl0TGFyZ2VGcmFtZXMgPSBmYWxzZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNlZSBbc3BsaXRMYXJnZUZyYW1lc117QGxpbmsgQ2xpZW50I3NwbGl0TGFyZ2VGcmFtZXN9LlxuICAgICAgICAgKiBUaGlzIGhhcyBubyBlZmZlY3QgaWYgW3NwbGl0TGFyZ2VGcmFtZXNde0BsaW5rIENsaWVudCNzcGxpdExhcmdlRnJhbWVzfSBpcyBgZmFsc2VgLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5tYXhXZWJTb2NrZXRDaHVua1NpemUgPSA4ICogMTAyNDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFVzdWFsbHkgdGhlXG4gICAgICAgICAqIFt0eXBlIG9mIFdlYlNvY2tldCBmcmFtZV17QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dlYlNvY2tldC9zZW5kI1BhcmFtZXRlcnN9XG4gICAgICAgICAqIGlzIGF1dG9tYXRpY2FsbHkgZGVjaWRlZCBieSB0eXBlIG9mIHRoZSBwYXlsb2FkLlxuICAgICAgICAgKiBEZWZhdWx0IGlzIGBmYWxzZWAsIHdoaWNoIHNob3VsZCB3b3JrIHdpdGggYWxsIGNvbXBsaWFudCBicm9rZXJzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBTZXQgdGhpcyBmbGFnIHRvIGZvcmNlIGJpbmFyeSBmcmFtZXMuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmZvcmNlQmluYXJ5V1NGcmFtZXMgPSBmYWxzZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgYnVnIGluIFJlYWN0TmF0aXZlIGNob3BzIGEgc3RyaW5nIG9uIG9jY3VycmVuY2Ugb2YgYSBOVUxMLlxuICAgICAgICAgKiBTZWUgaXNzdWUgW2h0dHBzOi8vZ2l0aHViLmNvbS9zdG9tcC1qcy9zdG9tcGpzL2lzc3Vlcy84OV17QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL3N0b21wLWpzL3N0b21wanMvaXNzdWVzLzg5fS5cbiAgICAgICAgICogVGhpcyBtYWtlcyBpbmNvbWluZyBXZWJTb2NrZXQgbWVzc2FnZXMgaW52YWxpZCBTVE9NUCBwYWNrZXRzLlxuICAgICAgICAgKiBTZXR0aW5nIHRoaXMgZmxhZyBhdHRlbXB0cyB0byByZXZlcnNlIHRoZSBkYW1hZ2UgYnkgYXBwZW5kaW5nIGEgTlVMTC5cbiAgICAgICAgICogSWYgdGhlIGJyb2tlciBzcGxpdHMgYSBsYXJnZSBtZXNzYWdlIGludG8gbXVsdGlwbGUgV2ViU29ja2V0IG1lc3NhZ2VzLFxuICAgICAgICAgKiB0aGlzIGZsYWcgd2lsbCBjYXVzZSBkYXRhIGxvc3MgYW5kIGFibm9ybWFsIHRlcm1pbmF0aW9uIG9mIGNvbm5lY3Rpb24uXG4gICAgICAgICAqXG4gICAgICAgICAqIFRoaXMgaXMgbm90IGFuIGlkZWFsIHNvbHV0aW9uLCBidXQgYSBzdG9wIGdhcCB1bnRpbCB0aGUgdW5kZXJseWluZyBpc3N1ZSBpcyBmaXhlZCBhdCBSZWFjdE5hdGl2ZSBsaWJyYXJ5LlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5hcHBlbmRNaXNzaW5nTlVMTG9uSW5jb21pbmcgPSBmYWxzZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFjdGl2YXRpb24gc3RhdGUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEl0IHdpbGwgdXN1YWxseSBiZSBBQ1RJVkUgb3IgSU5BQ1RJVkUuXG4gICAgICAgICAqIFdoZW4gZGVhY3RpdmF0aW5nIGl0IG1heSBnbyBmcm9tIEFDVElWRSB0byBJTkFDVElWRSB3aXRob3V0IGVudGVyaW5nIERFQUNUSVZBVElORy5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuc3RhdGUgPSBfdHlwZXNfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzFfX1tcIkFjdGl2YXRpb25TdGF0ZVwiXS5JTkFDVElWRTtcbiAgICAgICAgLy8gRHVtbXkgY2FsbGJhY2tzXG4gICAgICAgIGNvbnN0IG5vT3AgPSAoKSA9PiB7IH07XG4gICAgICAgIHRoaXMuZGVidWcgPSBub09wO1xuICAgICAgICB0aGlzLmJlZm9yZUNvbm5lY3QgPSBub09wO1xuICAgICAgICB0aGlzLm9uQ29ubmVjdCA9IG5vT3A7XG4gICAgICAgIHRoaXMub25EaXNjb25uZWN0ID0gbm9PcDtcbiAgICAgICAgdGhpcy5vblVuaGFuZGxlZE1lc3NhZ2UgPSBub09wO1xuICAgICAgICB0aGlzLm9uVW5oYW5kbGVkUmVjZWlwdCA9IG5vT3A7XG4gICAgICAgIHRoaXMub25VbmhhbmRsZWRGcmFtZSA9IG5vT3A7XG4gICAgICAgIHRoaXMub25TdG9tcEVycm9yID0gbm9PcDtcbiAgICAgICAgdGhpcy5vbldlYlNvY2tldENsb3NlID0gbm9PcDtcbiAgICAgICAgdGhpcy5vbldlYlNvY2tldEVycm9yID0gbm9PcDtcbiAgICAgICAgdGhpcy5sb2dSYXdDb21tdW5pY2F0aW9uID0gZmFsc2U7XG4gICAgICAgIHRoaXMub25DaGFuZ2VTdGF0ZSA9IG5vT3A7XG4gICAgICAgIC8vIFRoZXNlIHBhcmFtZXRlcnMgd291bGQgdHlwaWNhbGx5IGdldCBwcm9wZXIgdmFsdWVzIGJlZm9yZSBjb25uZWN0IGlzIGNhbGxlZFxuICAgICAgICB0aGlzLmNvbm5lY3RIZWFkZXJzID0ge307XG4gICAgICAgIHRoaXMuX2Rpc2Nvbm5lY3RIZWFkZXJzID0ge307XG4gICAgICAgIC8vIEFwcGx5IGNvbmZpZ3VyYXRpb25cbiAgICAgICAgdGhpcy5jb25maWd1cmUoY29uZik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFVuZGVybHlpbmcgV2ViU29ja2V0IGluc3RhbmNlLCBSRUFET05MWS5cbiAgICAgKi9cbiAgICBnZXQgd2ViU29ja2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3RvbXBIYW5kbGVyID8gdGhpcy5fc3RvbXBIYW5kbGVyLl93ZWJTb2NrZXQgOiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIERpc2Nvbm5lY3Rpb24gaGVhZGVycy5cbiAgICAgKi9cbiAgICBnZXQgZGlzY29ubmVjdEhlYWRlcnMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kaXNjb25uZWN0SGVhZGVycztcbiAgICB9XG4gICAgc2V0IGRpc2Nvbm5lY3RIZWFkZXJzKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX2Rpc2Nvbm5lY3RIZWFkZXJzID0gdmFsdWU7XG4gICAgICAgIGlmICh0aGlzLl9zdG9tcEhhbmRsZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX3N0b21wSGFuZGxlci5kaXNjb25uZWN0SGVhZGVycyA9IHRoaXMuX2Rpc2Nvbm5lY3RIZWFkZXJzO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGB0cnVlYCBpZiB0aGVyZSBpcyBhIGFjdGl2ZSBjb25uZWN0aW9uIHdpdGggU1RPTVAgQnJva2VyXG4gICAgICovXG4gICAgZ2V0IGNvbm5lY3RlZCgpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5fc3RvbXBIYW5kbGVyICYmIHRoaXMuX3N0b21wSGFuZGxlci5jb25uZWN0ZWQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHZlcnNpb24gb2YgU1RPTVAgcHJvdG9jb2wgbmVnb3RpYXRlZCB3aXRoIHRoZSBzZXJ2ZXIsIFJFQURPTkxZXG4gICAgICovXG4gICAgZ2V0IGNvbm5lY3RlZFZlcnNpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdG9tcEhhbmRsZXIgPyB0aGlzLl9zdG9tcEhhbmRsZXIuY29ubmVjdGVkVmVyc2lvbiA6IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogaWYgdGhlIGNsaWVudCBpcyBhY3RpdmUgKGNvbm5lY3RlZCBvciBnb2luZyB0byByZWNvbm5lY3QpXG4gICAgICovXG4gICAgZ2V0IGFjdGl2ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUgPT09IF90eXBlc19fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMV9fW1wiQWN0aXZhdGlvblN0YXRlXCJdLkFDVElWRTtcbiAgICB9XG4gICAgX2NoYW5nZVN0YXRlKHN0YXRlKSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICAgICAgdGhpcy5vbkNoYW5nZVN0YXRlKHN0YXRlKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVXBkYXRlIGNvbmZpZ3VyYXRpb24uXG4gICAgICovXG4gICAgY29uZmlndXJlKGNvbmYpIHtcbiAgICAgICAgLy8gYnVsayBhc3NpZ24gYWxsIHByb3BlcnRpZXMgdG8gdGhpc1xuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIGNvbmYpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJbml0aWF0ZSB0aGUgY29ubmVjdGlvbiB3aXRoIHRoZSBicm9rZXIuXG4gICAgICogSWYgdGhlIGNvbm5lY3Rpb24gYnJlYWtzLCBhcyBwZXIgW0NsaWVudCNyZWNvbm5lY3REZWxheV17QGxpbmsgQ2xpZW50I3JlY29ubmVjdERlbGF5fSxcbiAgICAgKiBpdCB3aWxsIGtlZXAgdHJ5aW5nIHRvIHJlY29ubmVjdC5cbiAgICAgKlxuICAgICAqIENhbGwgW0NsaWVudCNkZWFjdGl2YXRlXXtAbGluayBDbGllbnQjZGVhY3RpdmF0ZX0gdG8gZGlzY29ubmVjdCBhbmQgc3RvcCByZWNvbm5lY3Rpb24gYXR0ZW1wdHMuXG4gICAgICovXG4gICAgYWN0aXZhdGUoKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlID09PSBfdHlwZXNfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzFfX1tcIkFjdGl2YXRpb25TdGF0ZVwiXS5ERUFDVElWQVRJTkcpIHtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoJ1N0aWxsIERFQUNUSVZBVElORywgcGxlYXNlIGF3YWl0IGNhbGwgdG8gZGVhY3RpdmF0ZSBiZWZvcmUgdHJ5aW5nIHRvIHJlLWFjdGl2YXRlJyk7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N0aWxsIERFQUNUSVZBVElORywgY2FuIG5vdCBhY3RpdmF0ZSBub3cnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5hY3RpdmUpIHtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoJ0FscmVhZHkgQUNUSVZFLCBpZ25vcmluZyByZXF1ZXN0IHRvIGFjdGl2YXRlJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY2hhbmdlU3RhdGUoX3R5cGVzX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8xX19bXCJBY3RpdmF0aW9uU3RhdGVcIl0uQUNUSVZFKTtcbiAgICAgICAgdGhpcy5fY29ubmVjdCgpO1xuICAgIH1cbiAgICBfY29ubmVjdCgpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbm5lY3RlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGVidWcoJ1NUT01QOiBhbHJlYWR5IGNvbm5lY3RlZCwgbm90aGluZyB0byBkbycpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHlpZWxkIHRoaXMuYmVmb3JlQ29ubmVjdCgpO1xuICAgICAgICAgICAgaWYgKCF0aGlzLmFjdGl2ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGVidWcoJ0NsaWVudCBoYXMgYmVlbiBtYXJrZWQgaW5hY3RpdmUsIHdpbGwgbm90IGF0dGVtcHQgdG8gY29ubmVjdCcpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHNldHVwIGNvbm5lY3Rpb24gd2F0Y2hlclxuICAgICAgICAgICAgaWYgKHRoaXMuY29ubmVjdGlvblRpbWVvdXQgPiAwKSB7XG4gICAgICAgICAgICAgICAgLy8gY2xlYXIgZmlyc3RcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fY29ubmVjdGlvbldhdGNoZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX2Nvbm5lY3Rpb25XYXRjaGVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbldhdGNoZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY29ubmVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gQ29ubmVjdGlvbiBub3QgZXN0YWJsaXNoZWQsIGNsb3NlIHRoZSB1bmRlcmx5aW5nIHNvY2tldFxuICAgICAgICAgICAgICAgICAgICAvLyBhIHJlY29ubmVjdGlvbiB3aWxsIGJlIGF0dGVtcHRlZFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlYnVnKGBDb25uZWN0aW9uIG5vdCBlc3RhYmxpc2hlZCBpbiAke3RoaXMuY29ubmVjdGlvblRpbWVvdXR9bXMsIGNsb3Npbmcgc29ja2V0YCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZm9yY2VEaXNjb25uZWN0KCk7XG4gICAgICAgICAgICAgICAgfSwgdGhpcy5jb25uZWN0aW9uVGltZW91dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmRlYnVnKCdPcGVuaW5nIFdlYiBTb2NrZXQuLi4nKTtcbiAgICAgICAgICAgIC8vIEdldCB0aGUgYWN0dWFsIFdlYlNvY2tldCAob3IgYSBzaW1pbGFyIG9iamVjdClcbiAgICAgICAgICAgIGNvbnN0IHdlYlNvY2tldCA9IHRoaXMuX2NyZWF0ZVdlYlNvY2tldCgpO1xuICAgICAgICAgICAgdGhpcy5fc3RvbXBIYW5kbGVyID0gbmV3IF9zdG9tcF9oYW5kbGVyX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX19bXCJTdG9tcEhhbmRsZXJcIl0odGhpcywgd2ViU29ja2V0LCB7XG4gICAgICAgICAgICAgICAgZGVidWc6IHRoaXMuZGVidWcsXG4gICAgICAgICAgICAgICAgc3RvbXBWZXJzaW9uczogdGhpcy5zdG9tcFZlcnNpb25zLFxuICAgICAgICAgICAgICAgIGNvbm5lY3RIZWFkZXJzOiB0aGlzLmNvbm5lY3RIZWFkZXJzLFxuICAgICAgICAgICAgICAgIGRpc2Nvbm5lY3RIZWFkZXJzOiB0aGlzLl9kaXNjb25uZWN0SGVhZGVycyxcbiAgICAgICAgICAgICAgICBoZWFydGJlYXRJbmNvbWluZzogdGhpcy5oZWFydGJlYXRJbmNvbWluZyxcbiAgICAgICAgICAgICAgICBoZWFydGJlYXRPdXRnb2luZzogdGhpcy5oZWFydGJlYXRPdXRnb2luZyxcbiAgICAgICAgICAgICAgICBzcGxpdExhcmdlRnJhbWVzOiB0aGlzLnNwbGl0TGFyZ2VGcmFtZXMsXG4gICAgICAgICAgICAgICAgbWF4V2ViU29ja2V0Q2h1bmtTaXplOiB0aGlzLm1heFdlYlNvY2tldENodW5rU2l6ZSxcbiAgICAgICAgICAgICAgICBmb3JjZUJpbmFyeVdTRnJhbWVzOiB0aGlzLmZvcmNlQmluYXJ5V1NGcmFtZXMsXG4gICAgICAgICAgICAgICAgbG9nUmF3Q29tbXVuaWNhdGlvbjogdGhpcy5sb2dSYXdDb21tdW5pY2F0aW9uLFxuICAgICAgICAgICAgICAgIGFwcGVuZE1pc3NpbmdOVUxMb25JbmNvbWluZzogdGhpcy5hcHBlbmRNaXNzaW5nTlVMTG9uSW5jb21pbmcsXG4gICAgICAgICAgICAgICAgZGlzY2FyZFdlYnNvY2tldE9uQ29tbUZhaWx1cmU6IHRoaXMuZGlzY2FyZFdlYnNvY2tldE9uQ29tbUZhaWx1cmUsXG4gICAgICAgICAgICAgICAgb25Db25uZWN0OiBmcmFtZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFN1Y2Nlc3NmdWxseSBjb25uZWN0ZWQsIHN0b3AgdGhlIGNvbm5lY3Rpb24gd2F0Y2hlclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fY29ubmVjdGlvbldhdGNoZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9jb25uZWN0aW9uV2F0Y2hlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uV2F0Y2hlciA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlYnVnKCdTVE9NUCBnb3QgY29ubmVjdGVkIHdoaWxlIGRlYWN0aXZhdGUgd2FzIGlzc3VlZCwgd2lsbCBkaXNjb25uZWN0IG5vdycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGlzcG9zZVN0b21wSGFuZGxlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25Db25uZWN0KGZyYW1lKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG9uRGlzY29ubmVjdDogZnJhbWUgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uRGlzY29ubmVjdChmcmFtZSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvblN0b21wRXJyb3I6IGZyYW1lID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vblN0b21wRXJyb3IoZnJhbWUpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgb25XZWJTb2NrZXRDbG9zZTogZXZ0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3RvbXBIYW5kbGVyID0gdW5kZWZpbmVkOyAvLyBhIG5ldyBvbmUgd2lsbCBiZSBjcmVhdGVkIGluIGNhc2Ugb2YgYSByZWNvbm5lY3RcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUgPT09IF90eXBlc19fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMV9fW1wiQWN0aXZhdGlvblN0YXRlXCJdLkRFQUNUSVZBVElORykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWFyayBkZWFjdGl2YXRpb24gY29tcGxldGVcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3Jlc29sdmVTb2NrZXRDbG9zZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzb2x2ZVNvY2tldENsb3NlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhbmdlU3RhdGUoX3R5cGVzX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8xX19bXCJBY3RpdmF0aW9uU3RhdGVcIl0uSU5BQ1RJVkUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25XZWJTb2NrZXRDbG9zZShldnQpO1xuICAgICAgICAgICAgICAgICAgICAvLyBUaGUgY2FsbGJhY2sgaXMgY2FsbGVkIGJlZm9yZSBhdHRlbXB0aW5nIHRvIHJlY29ubmVjdCwgdGhpcyB3b3VsZCBhbGxvdyB0aGUgY2xpZW50XG4gICAgICAgICAgICAgICAgICAgIC8vIHRvIGJlIGBkZWFjdGl2YXRlZGAgaW4gdGhlIGNhbGxiYWNrLlxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5hY3RpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NjaGVkdWxlX3JlY29ubmVjdCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvbldlYlNvY2tldEVycm9yOiBldnQgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uV2ViU29ja2V0RXJyb3IoZXZ0KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG9uVW5oYW5kbGVkTWVzc2FnZTogbWVzc2FnZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25VbmhhbmRsZWRNZXNzYWdlKG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgb25VbmhhbmRsZWRSZWNlaXB0OiBmcmFtZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25VbmhhbmRsZWRSZWNlaXB0KGZyYW1lKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG9uVW5oYW5kbGVkRnJhbWU6IGZyYW1lID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vblVuaGFuZGxlZEZyYW1lKGZyYW1lKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9zdG9tcEhhbmRsZXIuc3RhcnQoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIF9jcmVhdGVXZWJTb2NrZXQoKSB7XG4gICAgICAgIGxldCB3ZWJTb2NrZXQ7XG4gICAgICAgIGlmICh0aGlzLndlYlNvY2tldEZhY3RvcnkpIHtcbiAgICAgICAgICAgIHdlYlNvY2tldCA9IHRoaXMud2ViU29ja2V0RmFjdG9yeSgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgd2ViU29ja2V0ID0gbmV3IFdlYlNvY2tldCh0aGlzLmJyb2tlclVSTCwgdGhpcy5zdG9tcFZlcnNpb25zLnByb3RvY29sVmVyc2lvbnMoKSk7XG4gICAgICAgIH1cbiAgICAgICAgd2ViU29ja2V0LmJpbmFyeVR5cGUgPSAnYXJyYXlidWZmZXInO1xuICAgICAgICByZXR1cm4gd2ViU29ja2V0O1xuICAgIH1cbiAgICBfc2NoZWR1bGVfcmVjb25uZWN0KCkge1xuICAgICAgICBpZiAodGhpcy5yZWNvbm5lY3REZWxheSA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoYFNUT01QOiBzY2hlZHVsaW5nIHJlY29ubmVjdGlvbiBpbiAke3RoaXMucmVjb25uZWN0RGVsYXl9bXNgKTtcbiAgICAgICAgICAgIHRoaXMuX3JlY29ubmVjdG9yID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY29ubmVjdCgpO1xuICAgICAgICAgICAgfSwgdGhpcy5yZWNvbm5lY3REZWxheSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogRGlzY29ubmVjdCBpZiBjb25uZWN0ZWQgYW5kIHN0b3AgYXV0byByZWNvbm5lY3QgbG9vcC5cbiAgICAgKiBBcHByb3ByaWF0ZSBjYWxsYmFja3Mgd2lsbCBiZSBpbnZva2VkIGlmIHVuZGVybHlpbmcgU1RPTVAgY29ubmVjdGlvbiB3YXMgY29ubmVjdGVkLlxuICAgICAqXG4gICAgICogVGhpcyBjYWxsIGlzIGFzeW5jLCBpdCB3aWxsIHJlc29sdmUgaW1tZWRpYXRlbHkgaWYgdGhlcmUgaXMgbm8gdW5kZXJseWluZyBhY3RpdmUgd2Vic29ja2V0LFxuICAgICAqIG90aGVyd2lzZSwgaXQgd2lsbCByZXNvbHZlIGFmdGVyIHVuZGVybHlpbmcgd2Vic29ja2V0IGlzIHByb3Blcmx5IGRpc3Bvc2VkLlxuICAgICAqXG4gICAgICogVG8gcmVhY3RpdmF0ZSB5b3UgY2FuIGNhbGwgW0NsaWVudCNhY3RpdmF0ZV17QGxpbmsgQ2xpZW50I2FjdGl2YXRlfS5cbiAgICAgKi9cbiAgICBkZWFjdGl2YXRlKCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgbGV0IHJldFByb21pc2U7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZSAhPT0gX3R5cGVzX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8xX19bXCJBY3RpdmF0aW9uU3RhdGVcIl0uQUNUSVZFKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgQWxyZWFkeSAke190eXBlc19fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMV9fW1wiQWN0aXZhdGlvblN0YXRlXCJdW3RoaXMuc3RhdGVdfSwgaWdub3JpbmcgY2FsbCB0byBkZWFjdGl2YXRlYCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fY2hhbmdlU3RhdGUoX3R5cGVzX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8xX19bXCJBY3RpdmF0aW9uU3RhdGVcIl0uREVBQ1RJVkFUSU5HKTtcbiAgICAgICAgICAgIC8vIENsZWFyIGlmIGEgcmVjb25uZWN0aW9uIHdhcyBzY2hlZHVsZWRcbiAgICAgICAgICAgIGlmICh0aGlzLl9yZWNvbm5lY3Rvcikge1xuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9yZWNvbm5lY3Rvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5fc3RvbXBIYW5kbGVyICYmXG4gICAgICAgICAgICAgICAgdGhpcy53ZWJTb2NrZXQucmVhZHlTdGF0ZSAhPT0gX3R5cGVzX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8xX19bXCJTdG9tcFNvY2tldFN0YXRlXCJdLkNMT1NFRCkge1xuICAgICAgICAgICAgICAgIC8vIHdlIG5lZWQgdG8gd2FpdCBmb3IgdW5kZXJseWluZyB3ZWJzb2NrZXQgdG8gY2xvc2VcbiAgICAgICAgICAgICAgICByZXRQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZXNvbHZlU29ja2V0Q2xvc2UgPSByZXNvbHZlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gaW5kaWNhdGUgdGhhdCBhdXRvIHJlY29ubmVjdCBsb29wIHNob3VsZCB0ZXJtaW5hdGVcbiAgICAgICAgICAgICAgICB0aGlzLl9jaGFuZ2VTdGF0ZShfdHlwZXNfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzFfX1tcIkFjdGl2YXRpb25TdGF0ZVwiXS5JTkFDVElWRSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fZGlzcG9zZVN0b21wSGFuZGxlcigpO1xuICAgICAgICAgICAgcmV0dXJuIHJldFByb21pc2U7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBGb3JjZSBkaXNjb25uZWN0IGlmIHRoZXJlIGlzIGFuIGFjdGl2ZSBjb25uZWN0aW9uIGJ5IGRpcmVjdGx5IGNsb3NpbmcgdGhlIHVuZGVybHlpbmcgV2ViU29ja2V0LlxuICAgICAqIFRoaXMgaXMgZGlmZmVyZW50IHRoYW4gYSBub3JtYWwgZGlzY29ubmVjdCB3aGVyZSBhIERJU0NPTk5FQ1Qgc2VxdWVuY2UgaXMgY2FycmllZCBvdXQgd2l0aCB0aGUgYnJva2VyLlxuICAgICAqIEFmdGVyIGZvcmNpbmcgZGlzY29ubmVjdCwgYXV0b21hdGljIHJlY29ubmVjdCB3aWxsIGJlIGF0dGVtcHRlZC5cbiAgICAgKiBUbyBzdG9wIGZ1cnRoZXIgcmVjb25uZWN0cyBjYWxsIFtDbGllbnQjZGVhY3RpdmF0ZV17QGxpbmsgQ2xpZW50I2RlYWN0aXZhdGV9IGFzIHdlbGwuXG4gICAgICovXG4gICAgZm9yY2VEaXNjb25uZWN0KCkge1xuICAgICAgICBpZiAodGhpcy5fc3RvbXBIYW5kbGVyKSB7XG4gICAgICAgICAgICB0aGlzLl9zdG9tcEhhbmRsZXIuZm9yY2VEaXNjb25uZWN0KCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgX2Rpc3Bvc2VTdG9tcEhhbmRsZXIoKSB7XG4gICAgICAgIC8vIERpc3Bvc2UgU1RPTVAgSGFuZGxlclxuICAgICAgICBpZiAodGhpcy5fc3RvbXBIYW5kbGVyKSB7XG4gICAgICAgICAgICB0aGlzLl9zdG9tcEhhbmRsZXIuZGlzcG9zZSgpO1xuICAgICAgICAgICAgdGhpcy5fc3RvbXBIYW5kbGVyID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZW5kIGEgbWVzc2FnZSB0byBhIG5hbWVkIGRlc3RpbmF0aW9uLiBSZWZlciB0byB5b3VyIFNUT01QIGJyb2tlciBkb2N1bWVudGF0aW9uIGZvciB0eXBlc1xuICAgICAqIGFuZCBuYW1pbmcgb2YgZGVzdGluYXRpb25zLlxuICAgICAqXG4gICAgICogU1RPTVAgcHJvdG9jb2wgc3BlY2lmaWVzIGFuZCBzdWdnZXN0cyBzb21lIGhlYWRlcnMgYW5kIGFsc28gYWxsb3dzIGJyb2tlciBzcGVjaWZpYyBoZWFkZXJzLlxuICAgICAqXG4gICAgICogYGJvZHlgIG11c3QgYmUgU3RyaW5nLlxuICAgICAqIFlvdSB3aWxsIG5lZWQgdG8gY292ZXJ0IHRoZSBwYXlsb2FkIHRvIHN0cmluZyBpbiBjYXNlIGl0IGlzIG5vdCBzdHJpbmcgKGUuZy4gSlNPTikuXG4gICAgICpcbiAgICAgKiBUbyBzZW5kIGEgYmluYXJ5IG1lc3NhZ2UgYm9keSB1c2UgYmluYXJ5Qm9keSBwYXJhbWV0ZXIuIEl0IHNob3VsZCBiZSBhXG4gICAgICogW1VpbnQ4QXJyYXldKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL1VpbnQ4QXJyYXkpLlxuICAgICAqIFNvbWV0aW1lcyBicm9rZXJzIG1heSBub3Qgc3VwcG9ydCBiaW5hcnkgZnJhbWVzIG91dCBvZiB0aGUgYm94LlxuICAgICAqIFBsZWFzZSBjaGVjayB5b3VyIGJyb2tlciBkb2N1bWVudGF0aW9uLlxuICAgICAqXG4gICAgICogYGNvbnRlbnQtbGVuZ3RoYCBoZWFkZXIgaXMgYXV0b21hdGljYWxseSBhZGRlZCB0byB0aGUgU1RPTVAgRnJhbWUgc2VudCB0byB0aGUgYnJva2VyLlxuICAgICAqIFNldCBgc2tpcENvbnRlbnRMZW5ndGhIZWFkZXJgIHRvIGluZGljYXRlIHRoYXQgYGNvbnRlbnQtbGVuZ3RoYCBoZWFkZXIgc2hvdWxkIG5vdCBiZSBhZGRlZC5cbiAgICAgKiBGb3IgYmluYXJ5IG1lc3NhZ2VzIGBjb250ZW50LWxlbmd0aGAgaGVhZGVyIGlzIGFsd2F5cyBhZGRlZC5cbiAgICAgKlxuICAgICAqIENhdXRpb246IFRoZSBicm9rZXIgd2lsbCwgbW9zdCBsaWtlbHksIHJlcG9ydCBhbiBlcnJvciBhbmQgZGlzY29ubmVjdCBpZiBtZXNzYWdlIGJvZHkgaGFzIE5VTEwgb2N0ZXQocylcbiAgICAgKiBhbmQgYGNvbnRlbnQtbGVuZ3RoYCBoZWFkZXIgaXMgbWlzc2luZy5cbiAgICAgKlxuICAgICAqIGBgYGphdmFzY3JpcHRcbiAgICAgKiAgICAgICAgY2xpZW50LnB1Ymxpc2goe2Rlc3RpbmF0aW9uOiBcIi9xdWV1ZS90ZXN0XCIsIGhlYWRlcnM6IHtwcmlvcml0eTogOX0sIGJvZHk6IFwiSGVsbG8sIFNUT01QXCJ9KTtcbiAgICAgKlxuICAgICAqICAgICAgICAvLyBPbmx5IGRlc3RpbmF0aW9uIGlzIG1hbmRhdG9yeSBwYXJhbWV0ZXJcbiAgICAgKiAgICAgICAgY2xpZW50LnB1Ymxpc2goe2Rlc3RpbmF0aW9uOiBcIi9xdWV1ZS90ZXN0XCIsIGJvZHk6IFwiSGVsbG8sIFNUT01QXCJ9KTtcbiAgICAgKlxuICAgICAqICAgICAgICAvLyBTa2lwIGNvbnRlbnQtbGVuZ3RoIGhlYWRlciBpbiB0aGUgZnJhbWUgdG8gdGhlIGJyb2tlclxuICAgICAqICAgICAgICBjbGllbnQucHVibGlzaCh7XCIvcXVldWUvdGVzdFwiLCBib2R5OiBcIkhlbGxvLCBTVE9NUFwiLCBza2lwQ29udGVudExlbmd0aEhlYWRlcjogdHJ1ZX0pO1xuICAgICAqXG4gICAgICogICAgICAgIHZhciBiaW5hcnlEYXRhID0gZ2VuZXJhdGVCaW5hcnlEYXRhKCk7IC8vIFRoaXMgbmVlZCB0byBiZSBvZiB0eXBlIFVpbnQ4QXJyYXlcbiAgICAgKiAgICAgICAgLy8gc2V0dGluZyBjb250ZW50LXR5cGUgaGVhZGVyIGlzIG5vdCBtYW5kYXRvcnksIGhvd2V2ZXIgYSBnb29kIHByYWN0aWNlXG4gICAgICogICAgICAgIGNsaWVudC5wdWJsaXNoKHtkZXN0aW5hdGlvbjogJy90b3BpYy9zcGVjaWFsJywgYmluYXJ5Qm9keTogYmluYXJ5RGF0YSxcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7J2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nfX0pO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1Ymxpc2gocGFyYW1zKSB7XG4gICAgICAgIHRoaXMuX3N0b21wSGFuZGxlci5wdWJsaXNoKHBhcmFtcyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNUT01QIGJyb2tlcnMgbWF5IGNhcnJ5IG91dCBvcGVyYXRpb24gYXN5bmNocm9ub3VzbHkgYW5kIGFsbG93IHJlcXVlc3RpbmcgZm9yIGFja25vd2xlZGdlbWVudC5cbiAgICAgKiBUbyByZXF1ZXN0IGFuIGFja25vd2xlZGdlbWVudCwgYSBgcmVjZWlwdGAgaGVhZGVyIG5lZWRzIHRvIGJlIHNlbnQgd2l0aCB0aGUgYWN0dWFsIHJlcXVlc3QuXG4gICAgICogVGhlIHZhbHVlIChzYXkgcmVjZWlwdC1pZCkgZm9yIHRoaXMgaGVhZGVyIG5lZWRzIHRvIGJlIHVuaXF1ZSBmb3IgZWFjaCB1c2UuIFR5cGljYWxseSBhIHNlcXVlbmNlLCBhIFVVSUQsIGFcbiAgICAgKiByYW5kb20gbnVtYmVyIG9yIGEgY29tYmluYXRpb24gbWF5IGJlIHVzZWQuXG4gICAgICpcbiAgICAgKiBBIGNvbXBsYWludCBicm9rZXIgd2lsbCBzZW5kIGEgUkVDRUlQVCBmcmFtZSB3aGVuIGFuIG9wZXJhdGlvbiBoYXMgYWN0dWFsbHkgYmVlbiBjb21wbGV0ZWQuXG4gICAgICogVGhlIG9wZXJhdGlvbiBuZWVkcyB0byBiZSBtYXRjaGVkIGJhc2VkIGluIHRoZSB2YWx1ZSBvZiB0aGUgcmVjZWlwdC1pZC5cbiAgICAgKlxuICAgICAqIFRoaXMgbWV0aG9kIGFsbG93IHdhdGNoaW5nIGZvciBhIHJlY2VpcHQgYW5kIGludm9rZSB0aGUgY2FsbGJhY2tcbiAgICAgKiB3aGVuIGNvcnJlc3BvbmRpbmcgcmVjZWlwdCBoYXMgYmVlbiByZWNlaXZlZC5cbiAgICAgKlxuICAgICAqIFRoZSBhY3R1YWwge0BsaW5rIEZyYW1lSW1wbH0gd2lsbCBiZSBwYXNzZWQgYXMgcGFyYW1ldGVyIHRvIHRoZSBjYWxsYmFjay5cbiAgICAgKlxuICAgICAqIEV4YW1wbGU6XG4gICAgICogYGBgamF2YXNjcmlwdFxuICAgICAqICAgICAgICAvLyBTdWJzY3JpYmluZyB3aXRoIGFja25vd2xlZGdlbWVudFxuICAgICAqICAgICAgICBsZXQgcmVjZWlwdElkID0gcmFuZG9tVGV4dCgpO1xuICAgICAqXG4gICAgICogICAgICAgIGNsaWVudC53YXRjaEZvclJlY2VpcHQocmVjZWlwdElkLCBmdW5jdGlvbigpIHtcbiAgICAgKiAgICAgICAgICAvLyBXaWxsIGJlIGNhbGxlZCBhZnRlciBzZXJ2ZXIgYWNrbm93bGVkZ2VzXG4gICAgICogICAgICAgIH0pO1xuICAgICAqXG4gICAgICogICAgICAgIGNsaWVudC5zdWJzY3JpYmUoVEVTVC5kZXN0aW5hdGlvbiwgb25NZXNzYWdlLCB7cmVjZWlwdDogcmVjZWlwdElkfSk7XG4gICAgICpcbiAgICAgKlxuICAgICAqICAgICAgICAvLyBQdWJsaXNoaW5nIHdpdGggYWNrbm93bGVkZ2VtZW50XG4gICAgICogICAgICAgIHJlY2VpcHRJZCA9IHJhbmRvbVRleHQoKTtcbiAgICAgKlxuICAgICAqICAgICAgICBjbGllbnQud2F0Y2hGb3JSZWNlaXB0KHJlY2VpcHRJZCwgZnVuY3Rpb24oKSB7XG4gICAgICogICAgICAgICAgLy8gV2lsbCBiZSBjYWxsZWQgYWZ0ZXIgc2VydmVyIGFja25vd2xlZGdlc1xuICAgICAqICAgICAgICB9KTtcbiAgICAgKiAgICAgICAgY2xpZW50LnB1Ymxpc2goe2Rlc3RpbmF0aW9uOiBURVNULmRlc3RpbmF0aW9uLCBoZWFkZXJzOiB7cmVjZWlwdDogcmVjZWlwdElkfSwgYm9keTogbXNnfSk7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgd2F0Y2hGb3JSZWNlaXB0KHJlY2VpcHRJZCwgY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5fc3RvbXBIYW5kbGVyLndhdGNoRm9yUmVjZWlwdChyZWNlaXB0SWQsIGNhbGxiYWNrKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU3Vic2NyaWJlIHRvIGEgU1RPTVAgQnJva2VyIGxvY2F0aW9uLiBUaGUgY2FsbGJhY2sgd2lsbCBiZSBpbnZva2VkIGZvciBlYWNoIHJlY2VpdmVkIG1lc3NhZ2Ugd2l0aFxuICAgICAqIHRoZSB7QGxpbmsgSU1lc3NhZ2V9IGFzIGFyZ3VtZW50LlxuICAgICAqXG4gICAgICogTm90ZTogVGhlIGxpYnJhcnkgd2lsbCBnZW5lcmF0ZSBhbiB1bmlxdWUgSUQgaWYgdGhlcmUgaXMgbm9uZSBwcm92aWRlZCBpbiB0aGUgaGVhZGVycy5cbiAgICAgKiAgICAgICBUbyB1c2UgeW91ciBvd24gSUQsIHBhc3MgaXQgdXNpbmcgdGhlIGhlYWRlcnMgYXJndW1lbnQuXG4gICAgICpcbiAgICAgKiBgYGBqYXZhc2NyaXB0XG4gICAgICogICAgICAgIGNhbGxiYWNrID0gZnVuY3Rpb24obWVzc2FnZSkge1xuICAgICAqICAgICAgICAvLyBjYWxsZWQgd2hlbiB0aGUgY2xpZW50IHJlY2VpdmVzIGEgU1RPTVAgbWVzc2FnZSBmcm9tIHRoZSBzZXJ2ZXJcbiAgICAgKiAgICAgICAgICBpZiAobWVzc2FnZS5ib2R5KSB7XG4gICAgICogICAgICAgICAgICBhbGVydChcImdvdCBtZXNzYWdlIHdpdGggYm9keSBcIiArIG1lc3NhZ2UuYm9keSlcbiAgICAgKiAgICAgICAgICB9IGVsc2Uge1xuICAgICAqICAgICAgICAgICAgYWxlcnQoXCJnb3QgZW1wdHkgbWVzc2FnZVwiKTtcbiAgICAgKiAgICAgICAgICB9XG4gICAgICogICAgICAgIH0pO1xuICAgICAqXG4gICAgICogICAgICAgIHZhciBzdWJzY3JpcHRpb24gPSBjbGllbnQuc3Vic2NyaWJlKFwiL3F1ZXVlL3Rlc3RcIiwgY2FsbGJhY2spO1xuICAgICAqXG4gICAgICogICAgICAgIC8vIEV4cGxpY2l0IHN1YnNjcmlwdGlvbiBpZFxuICAgICAqICAgICAgICB2YXIgbXlTdWJJZCA9ICdteS1zdWJzY3JpcHRpb24taWQtMDAxJztcbiAgICAgKiAgICAgICAgdmFyIHN1YnNjcmlwdGlvbiA9IGNsaWVudC5zdWJzY3JpYmUoZGVzdGluYXRpb24sIGNhbGxiYWNrLCB7IGlkOiBteVN1YklkIH0pO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHN1YnNjcmliZShkZXN0aW5hdGlvbiwgY2FsbGJhY2ssIGhlYWRlcnMgPSB7fSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3RvbXBIYW5kbGVyLnN1YnNjcmliZShkZXN0aW5hdGlvbiwgY2FsbGJhY2ssIGhlYWRlcnMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJdCBpcyBwcmVmZXJhYmxlIHRvIHVuc3Vic2NyaWJlIGZyb20gYSBzdWJzY3JpcHRpb24gYnkgY2FsbGluZ1xuICAgICAqIGB1bnN1YnNjcmliZSgpYCBkaXJlY3RseSBvbiB7QGxpbmsgU3RvbXBTdWJzY3JpcHRpb259IHJldHVybmVkIGJ5IGBjbGllbnQuc3Vic2NyaWJlKClgOlxuICAgICAqXG4gICAgICogYGBgamF2YXNjcmlwdFxuICAgICAqICAgICAgICB2YXIgc3Vic2NyaXB0aW9uID0gY2xpZW50LnN1YnNjcmliZShkZXN0aW5hdGlvbiwgb25tZXNzYWdlKTtcbiAgICAgKiAgICAgICAgLy8gLi4uXG4gICAgICogICAgICAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogU2VlOiBodHRwOi8vc3RvbXAuZ2l0aHViLmNvbS9zdG9tcC1zcGVjaWZpY2F0aW9uLTEuMi5odG1sI1VOU1VCU0NSSUJFIFVOU1VCU0NSSUJFIEZyYW1lXG4gICAgICovXG4gICAgdW5zdWJzY3JpYmUoaWQsIGhlYWRlcnMgPSB7fSkge1xuICAgICAgICB0aGlzLl9zdG9tcEhhbmRsZXIudW5zdWJzY3JpYmUoaWQsIGhlYWRlcnMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTdGFydCBhIHRyYW5zYWN0aW9uLCB0aGUgcmV0dXJuZWQge0BsaW5rIElUcmFuc2FjdGlvbn0gaGFzIG1ldGhvZHMgLSBbY29tbWl0XXtAbGluayBJVHJhbnNhY3Rpb24jY29tbWl0fVxuICAgICAqIGFuZCBbYWJvcnRde0BsaW5rIElUcmFuc2FjdGlvbiNhYm9ydH0uXG4gICAgICpcbiAgICAgKiBgdHJhbnNhY3Rpb25JZGAgaXMgb3B0aW9uYWwsIGlmIG5vdCBwYXNzZWQgdGhlIGxpYnJhcnkgd2lsbCBnZW5lcmF0ZSBpdCBpbnRlcm5hbGx5LlxuICAgICAqL1xuICAgIGJlZ2luKHRyYW5zYWN0aW9uSWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0b21wSGFuZGxlci5iZWdpbih0cmFuc2FjdGlvbklkKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29tbWl0IGEgdHJhbnNhY3Rpb24uXG4gICAgICpcbiAgICAgKiBJdCBpcyBwcmVmZXJhYmxlIHRvIGNvbW1pdCBhIHRyYW5zYWN0aW9uIGJ5IGNhbGxpbmcgW2NvbW1pdF17QGxpbmsgSVRyYW5zYWN0aW9uI2NvbW1pdH0gZGlyZWN0bHkgb25cbiAgICAgKiB7QGxpbmsgSVRyYW5zYWN0aW9ufSByZXR1cm5lZCBieSBbY2xpZW50LmJlZ2luXXtAbGluayBDbGllbnQjYmVnaW59LlxuICAgICAqXG4gICAgICogYGBgamF2YXNjcmlwdFxuICAgICAqICAgICAgICB2YXIgdHggPSBjbGllbnQuYmVnaW4odHhJZCk7XG4gICAgICogICAgICAgIC8vLi4uXG4gICAgICogICAgICAgIHR4LmNvbW1pdCgpO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIGNvbW1pdCh0cmFuc2FjdGlvbklkKSB7XG4gICAgICAgIHRoaXMuX3N0b21wSGFuZGxlci5jb21taXQodHJhbnNhY3Rpb25JZCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFib3J0IGEgdHJhbnNhY3Rpb24uXG4gICAgICogSXQgaXMgcHJlZmVyYWJsZSB0byBhYm9ydCBhIHRyYW5zYWN0aW9uIGJ5IGNhbGxpbmcgW2Fib3J0XXtAbGluayBJVHJhbnNhY3Rpb24jYWJvcnR9IGRpcmVjdGx5IG9uXG4gICAgICoge0BsaW5rIElUcmFuc2FjdGlvbn0gcmV0dXJuZWQgYnkgW2NsaWVudC5iZWdpbl17QGxpbmsgQ2xpZW50I2JlZ2lufS5cbiAgICAgKlxuICAgICAqIGBgYGphdmFzY3JpcHRcbiAgICAgKiAgICAgICAgdmFyIHR4ID0gY2xpZW50LmJlZ2luKHR4SWQpO1xuICAgICAqICAgICAgICAvLy4uLlxuICAgICAqICAgICAgICB0eC5hYm9ydCgpO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIGFib3J0KHRyYW5zYWN0aW9uSWQpIHtcbiAgICAgICAgdGhpcy5fc3RvbXBIYW5kbGVyLmFib3J0KHRyYW5zYWN0aW9uSWQpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBQ0sgYSBtZXNzYWdlLiBJdCBpcyBwcmVmZXJhYmxlIHRvIGFja25vd2xlZGdlIGEgbWVzc2FnZSBieSBjYWxsaW5nIFthY2tde0BsaW5rIElNZXNzYWdlI2Fja30gZGlyZWN0bHlcbiAgICAgKiBvbiB0aGUge0BsaW5rIElNZXNzYWdlfSBoYW5kbGVkIGJ5IGEgc3Vic2NyaXB0aW9uIGNhbGxiYWNrOlxuICAgICAqXG4gICAgICogYGBgamF2YXNjcmlwdFxuICAgICAqICAgICAgICB2YXIgY2FsbGJhY2sgPSBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAqICAgICAgICAgIC8vIHByb2Nlc3MgdGhlIG1lc3NhZ2VcbiAgICAgKiAgICAgICAgICAvLyBhY2tub3dsZWRnZSBpdFxuICAgICAqICAgICAgICAgIG1lc3NhZ2UuYWNrKCk7XG4gICAgICogICAgICAgIH07XG4gICAgICogICAgICAgIGNsaWVudC5zdWJzY3JpYmUoZGVzdGluYXRpb24sIGNhbGxiYWNrLCB7J2Fjayc6ICdjbGllbnQnfSk7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgYWNrKG1lc3NhZ2VJZCwgc3Vic2NyaXB0aW9uSWQsIGhlYWRlcnMgPSB7fSkge1xuICAgICAgICB0aGlzLl9zdG9tcEhhbmRsZXIuYWNrKG1lc3NhZ2VJZCwgc3Vic2NyaXB0aW9uSWQsIGhlYWRlcnMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBOQUNLIGEgbWVzc2FnZS4gSXQgaXMgcHJlZmVyYWJsZSB0byBhY2tub3dsZWRnZSBhIG1lc3NhZ2UgYnkgY2FsbGluZyBbbmFja117QGxpbmsgSU1lc3NhZ2UjbmFja30gZGlyZWN0bHlcbiAgICAgKiBvbiB0aGUge0BsaW5rIElNZXNzYWdlfSBoYW5kbGVkIGJ5IGEgc3Vic2NyaXB0aW9uIGNhbGxiYWNrOlxuICAgICAqXG4gICAgICogYGBgamF2YXNjcmlwdFxuICAgICAqICAgICAgICB2YXIgY2FsbGJhY2sgPSBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAqICAgICAgICAgIC8vIHByb2Nlc3MgdGhlIG1lc3NhZ2VcbiAgICAgKiAgICAgICAgICAvLyBhbiBlcnJvciBvY2N1cnMsIG5hY2sgaXRcbiAgICAgKiAgICAgICAgICBtZXNzYWdlLm5hY2soKTtcbiAgICAgKiAgICAgICAgfTtcbiAgICAgKiAgICAgICAgY2xpZW50LnN1YnNjcmliZShkZXN0aW5hdGlvbiwgY2FsbGJhY2ssIHsnYWNrJzogJ2NsaWVudCd9KTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBuYWNrKG1lc3NhZ2VJZCwgc3Vic2NyaXB0aW9uSWQsIGhlYWRlcnMgPSB7fSkge1xuICAgICAgICB0aGlzLl9zdG9tcEhhbmRsZXIubmFjayhtZXNzYWdlSWQsIHN1YnNjcmlwdGlvbklkLCBoZWFkZXJzKTtcbiAgICB9XG59XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIFwiLi9zcmMvY29tcGF0aWJpbGl0eS9jb21wYXQtY2xpZW50LnRzXCI6XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiAuL3NyYy9jb21wYXRpYmlsaXR5L2NvbXBhdC1jbGllbnQudHMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyohIGV4cG9ydHMgcHJvdmlkZWQ6IENvbXBhdENsaWVudCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgX193ZWJwYWNrX2V4cG9ydHNfXywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cInVzZSBzdHJpY3RcIjtcbl9fd2VicGFja19yZXF1aXJlX18ucihfX3dlYnBhY2tfZXhwb3J0c19fKTtcbi8qIGhhcm1vbnkgZXhwb3J0IChiaW5kaW5nKSAqLyBfX3dlYnBhY2tfcmVxdWlyZV9fLmQoX193ZWJwYWNrX2V4cG9ydHNfXywgXCJDb21wYXRDbGllbnRcIiwgZnVuY3Rpb24oKSB7IHJldHVybiBDb21wYXRDbGllbnQ7IH0pO1xuLyogaGFybW9ueSBpbXBvcnQgKi8gdmFyIF9jbGllbnRfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfXyA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4uL2NsaWVudCAqLyBcIi4vc3JjL2NsaWVudC50c1wiKTtcbi8qIGhhcm1vbnkgaW1wb3J0ICovIHZhciBfaGVhcnRiZWF0X2luZm9fX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzFfXyA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4vaGVhcnRiZWF0LWluZm8gKi8gXCIuL3NyYy9jb21wYXRpYmlsaXR5L2hlYXJ0YmVhdC1pbmZvLnRzXCIpO1xuXG5cbi8qKlxuICogQXZhaWxhYmxlIGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5LCBwbGVhc2Ugc2hpZnQgdG8gdXNpbmcge0BsaW5rIENsaWVudH0uXG4gKlxuICogKipEZXByZWNhdGVkKipcbiAqXG4gKiBQYXJ0IG9mIGBAc3RvbXAvc3RvbXBqc2AuXG4gKlxuICogVG8gdXBncmFkZSwgcGxlYXNlIGZvbGxvdyB0aGUgW1VwZ3JhZGUgR3VpZGVdKC4uL2FkZGl0aW9uYWwtZG9jdW1lbnRhdGlvbi91cGdyYWRpbmcuaHRtbClcbiAqL1xuY2xhc3MgQ29tcGF0Q2xpZW50IGV4dGVuZHMgX2NsaWVudF9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMF9fW1wiQ2xpZW50XCJdIHtcbiAgICAvKipcbiAgICAgKiBBdmFpbGFibGUgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHksIHBsZWFzZSBzaGlmdCB0byB1c2luZyB7QGxpbmsgQ2xpZW50fVxuICAgICAqIGFuZCBbQ2xpZW50I3dlYlNvY2tldEZhY3Rvcnlde0BsaW5rIENsaWVudCN3ZWJTb2NrZXRGYWN0b3J5fS5cbiAgICAgKlxuICAgICAqICoqRGVwcmVjYXRlZCoqXG4gICAgICpcbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcih3ZWJTb2NrZXRGYWN0b3J5KSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJdCBpcyBubyBvcCBub3cuIE5vIGxvbmdlciBuZWVkZWQuIExhcmdlIHBhY2tldHMgd29yayBvdXQgb2YgdGhlIGJveC5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMubWF4V2ViU29ja2V0RnJhbWVTaXplID0gMTYgKiAxMDI0O1xuICAgICAgICB0aGlzLl9oZWFydGJlYXRJbmZvID0gbmV3IF9oZWFydGJlYXRfaW5mb19fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMV9fW1wiSGVhcnRiZWF0SW5mb1wiXSh0aGlzKTtcbiAgICAgICAgdGhpcy5yZWNvbm5lY3RfZGVsYXkgPSAwO1xuICAgICAgICB0aGlzLndlYlNvY2tldEZhY3RvcnkgPSB3ZWJTb2NrZXRGYWN0b3J5O1xuICAgICAgICAvLyBEZWZhdWx0IGZyb20gcHJldmlvdXMgdmVyc2lvblxuICAgICAgICB0aGlzLmRlYnVnID0gKC4uLm1lc3NhZ2UpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKC4uLm1lc3NhZ2UpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBfcGFyc2VDb25uZWN0KC4uLmFyZ3MpIHtcbiAgICAgICAgbGV0IGNsb3NlRXZlbnRDYWxsYmFjaztcbiAgICAgICAgbGV0IGNvbm5lY3RDYWxsYmFjaztcbiAgICAgICAgbGV0IGVycm9yQ2FsbGJhY2s7XG4gICAgICAgIGxldCBoZWFkZXJzID0ge307XG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ29ubmVjdCByZXF1aXJlcyBhdCBsZWFzdCAyIGFyZ3VtZW50cycpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgYXJnc1sxXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgW2hlYWRlcnMsIGNvbm5lY3RDYWxsYmFjaywgZXJyb3JDYWxsYmFjaywgY2xvc2VFdmVudENhbGxiYWNrXSA9IGFyZ3M7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgY2FzZSA2OlxuICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzLmxvZ2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVycy5wYXNzY29kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbm5lY3RDYWxsYmFjayxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yQ2FsbGJhY2ssXG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9zZUV2ZW50Q2FsbGJhY2ssXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzLmhvc3QsXG4gICAgICAgICAgICAgICAgICAgIF0gPSBhcmdzO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzLmxvZ2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVycy5wYXNzY29kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbm5lY3RDYWxsYmFjayxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yQ2FsbGJhY2ssXG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9zZUV2ZW50Q2FsbGJhY2ssXG4gICAgICAgICAgICAgICAgICAgIF0gPSBhcmdzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbaGVhZGVycywgY29ubmVjdENhbGxiYWNrLCBlcnJvckNhbGxiYWNrLCBjbG9zZUV2ZW50Q2FsbGJhY2tdO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBdmFpbGFibGUgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHksIHBsZWFzZSBzaGlmdCB0byB1c2luZyBbQ2xpZW50I2FjdGl2YXRlXXtAbGluayBDbGllbnQjYWN0aXZhdGV9LlxuICAgICAqXG4gICAgICogKipEZXByZWNhdGVkKipcbiAgICAgKlxuICAgICAqIFRoZSBgY29ubmVjdGAgbWV0aG9kIGFjY2VwdHMgZGlmZmVyZW50IG51bWJlciBvZiBhcmd1bWVudHMgYW5kIHR5cGVzLiBTZWUgdGhlIE92ZXJsb2FkcyBsaXN0LiBVc2UgdGhlXG4gICAgICogdmVyc2lvbiB3aXRoIGhlYWRlcnMgdG8gcGFzcyB5b3VyIGJyb2tlciBzcGVjaWZpYyBvcHRpb25zLlxuICAgICAqXG4gICAgICogb3ZlcmxvYWRzOlxuICAgICAqIC0gY29ubmVjdChoZWFkZXJzLCBjb25uZWN0Q2FsbGJhY2spXG4gICAgICogLSBjb25uZWN0KGhlYWRlcnMsIGNvbm5lY3RDYWxsYmFjaywgZXJyb3JDYWxsYmFjaylcbiAgICAgKiAtIGNvbm5lY3QobG9naW4sIHBhc3Njb2RlLCBjb25uZWN0Q2FsbGJhY2spXG4gICAgICogLSBjb25uZWN0KGxvZ2luLCBwYXNzY29kZSwgY29ubmVjdENhbGxiYWNrLCBlcnJvckNhbGxiYWNrKVxuICAgICAqIC0gY29ubmVjdChsb2dpbiwgcGFzc2NvZGUsIGNvbm5lY3RDYWxsYmFjaywgZXJyb3JDYWxsYmFjaywgY2xvc2VFdmVudENhbGxiYWNrKVxuICAgICAqIC0gY29ubmVjdChsb2dpbiwgcGFzc2NvZGUsIGNvbm5lY3RDYWxsYmFjaywgZXJyb3JDYWxsYmFjaywgY2xvc2VFdmVudENhbGxiYWNrLCBob3N0KVxuICAgICAqXG4gICAgICogcGFyYW1zOlxuICAgICAqIC0gaGVhZGVycywgc2VlIFtDbGllbnQjY29ubmVjdEhlYWRlcnNde0BsaW5rIENsaWVudCNjb25uZWN0SGVhZGVyc31cbiAgICAgKiAtIGNvbm5lY3RDYWxsYmFjaywgc2VlIFtDbGllbnQjb25Db25uZWN0XXtAbGluayBDbGllbnQjb25Db25uZWN0fVxuICAgICAqIC0gZXJyb3JDYWxsYmFjaywgc2VlIFtDbGllbnQjb25TdG9tcEVycm9yXXtAbGluayBDbGllbnQjb25TdG9tcEVycm9yfVxuICAgICAqIC0gY2xvc2VFdmVudENhbGxiYWNrLCBzZWUgW0NsaWVudCNvbldlYlNvY2tldENsb3NlXXtAbGluayBDbGllbnQjb25XZWJTb2NrZXRDbG9zZX1cbiAgICAgKiAtIGxvZ2luIFtTdHJpbmddLCBzZWUgW0NsaWVudCNjb25uZWN0SGVhZGVyc10oLi4vY2xhc3Nlcy9DbGllbnQuaHRtbCNjb25uZWN0SGVhZGVycylcbiAgICAgKiAtIHBhc3Njb2RlIFtTdHJpbmddLCBbQ2xpZW50I2Nvbm5lY3RIZWFkZXJzXSguLi9jbGFzc2VzL0NsaWVudC5odG1sI2Nvbm5lY3RIZWFkZXJzKVxuICAgICAqIC0gaG9zdCBbU3RyaW5nXSwgc2VlIFtDbGllbnQjY29ubmVjdEhlYWRlcnNdKC4uL2NsYXNzZXMvQ2xpZW50Lmh0bWwjY29ubmVjdEhlYWRlcnMpXG4gICAgICpcbiAgICAgKiBUbyB1cGdyYWRlLCBwbGVhc2UgZm9sbG93IHRoZSBbVXBncmFkZSBHdWlkZV0oLi4vYWRkaXRpb25hbC1kb2N1bWVudGF0aW9uL3VwZ3JhZGluZy5odG1sKVxuICAgICAqL1xuICAgIGNvbm5lY3QoLi4uYXJncykge1xuICAgICAgICBjb25zdCBvdXQgPSB0aGlzLl9wYXJzZUNvbm5lY3QoLi4uYXJncyk7XG4gICAgICAgIGlmIChvdXRbMF0pIHtcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdEhlYWRlcnMgPSBvdXRbMF07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG91dFsxXSkge1xuICAgICAgICAgICAgdGhpcy5vbkNvbm5lY3QgPSBvdXRbMV07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG91dFsyXSkge1xuICAgICAgICAgICAgdGhpcy5vblN0b21wRXJyb3IgPSBvdXRbMl07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG91dFszXSkge1xuICAgICAgICAgICAgdGhpcy5vbldlYlNvY2tldENsb3NlID0gb3V0WzNdO1xuICAgICAgICB9XG4gICAgICAgIHN1cGVyLmFjdGl2YXRlKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEF2YWlsYWJsZSBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eSwgcGxlYXNlIHNoaWZ0IHRvIHVzaW5nIFtDbGllbnQjZGVhY3RpdmF0ZV17QGxpbmsgQ2xpZW50I2RlYWN0aXZhdGV9LlxuICAgICAqXG4gICAgICogKipEZXByZWNhdGVkKipcbiAgICAgKlxuICAgICAqIFNlZTpcbiAgICAgKiBbQ2xpZW50I29uRGlzY29ubmVjdF17QGxpbmsgQ2xpZW50I29uRGlzY29ubmVjdH0sIGFuZFxuICAgICAqIFtDbGllbnQjZGlzY29ubmVjdEhlYWRlcnNde0BsaW5rIENsaWVudCNkaXNjb25uZWN0SGVhZGVyc31cbiAgICAgKlxuICAgICAqIFRvIHVwZ3JhZGUsIHBsZWFzZSBmb2xsb3cgdGhlIFtVcGdyYWRlIEd1aWRlXSguLi9hZGRpdGlvbmFsLWRvY3VtZW50YXRpb24vdXBncmFkaW5nLmh0bWwpXG4gICAgICovXG4gICAgZGlzY29ubmVjdChkaXNjb25uZWN0Q2FsbGJhY2ssIGhlYWRlcnMgPSB7fSkge1xuICAgICAgICBpZiAoZGlzY29ubmVjdENhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLm9uRGlzY29ubmVjdCA9IGRpc2Nvbm5lY3RDYWxsYmFjaztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRpc2Nvbm5lY3RIZWFkZXJzID0gaGVhZGVycztcbiAgICAgICAgc3VwZXIuZGVhY3RpdmF0ZSgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBdmFpbGFibGUgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHksIHVzZSBbQ2xpZW50I3B1Ymxpc2hde0BsaW5rIENsaWVudCNwdWJsaXNofS5cbiAgICAgKlxuICAgICAqIFNlbmQgYSBtZXNzYWdlIHRvIGEgbmFtZWQgZGVzdGluYXRpb24uIFJlZmVyIHRvIHlvdXIgU1RPTVAgYnJva2VyIGRvY3VtZW50YXRpb24gZm9yIHR5cGVzXG4gICAgICogYW5kIG5hbWluZyBvZiBkZXN0aW5hdGlvbnMuIFRoZSBoZWFkZXJzIHdpbGwsIHR5cGljYWxseSwgYmUgYXZhaWxhYmxlIHRvIHRoZSBzdWJzY3JpYmVyLlxuICAgICAqIEhvd2V2ZXIsIHRoZXJlIG1heSBiZSBzcGVjaWFsIHB1cnBvc2UgaGVhZGVycyBjb3JyZXNwb25kaW5nIHRvIHlvdXIgU1RPTVAgYnJva2VyLlxuICAgICAqXG4gICAgICogICoqRGVwcmVjYXRlZCoqLCB1c2UgW0NsaWVudCNwdWJsaXNoXXtAbGluayBDbGllbnQjcHVibGlzaH1cbiAgICAgKlxuICAgICAqIE5vdGU6IEJvZHkgbXVzdCBiZSBTdHJpbmcuIFlvdSB3aWxsIG5lZWQgdG8gY292ZXJ0IHRoZSBwYXlsb2FkIHRvIHN0cmluZyBpbiBjYXNlIGl0IGlzIG5vdCBzdHJpbmcgKGUuZy4gSlNPTilcbiAgICAgKlxuICAgICAqIGBgYGphdmFzY3JpcHRcbiAgICAgKiAgICAgICAgY2xpZW50LnNlbmQoXCIvcXVldWUvdGVzdFwiLCB7cHJpb3JpdHk6IDl9LCBcIkhlbGxvLCBTVE9NUFwiKTtcbiAgICAgKlxuICAgICAqICAgICAgICAvLyBJZiB5b3Ugd2FudCB0byBzZW5kIGEgbWVzc2FnZSB3aXRoIGEgYm9keSwgeW91IG11c3QgYWxzbyBwYXNzIHRoZSBoZWFkZXJzIGFyZ3VtZW50LlxuICAgICAqICAgICAgICBjbGllbnQuc2VuZChcIi9xdWV1ZS90ZXN0XCIsIHt9LCBcIkhlbGxvLCBTVE9NUFwiKTtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIFRvIHVwZ3JhZGUsIHBsZWFzZSBmb2xsb3cgdGhlIFtVcGdyYWRlIEd1aWRlXSguLi9hZGRpdGlvbmFsLWRvY3VtZW50YXRpb24vdXBncmFkaW5nLmh0bWwpXG4gICAgICovXG4gICAgc2VuZChkZXN0aW5hdGlvbiwgaGVhZGVycyA9IHt9LCBib2R5ID0gJycpIHtcbiAgICAgICAgaGVhZGVycyA9IE9iamVjdC5hc3NpZ24oe30sIGhlYWRlcnMpO1xuICAgICAgICBjb25zdCBza2lwQ29udGVudExlbmd0aEhlYWRlciA9IGhlYWRlcnNbJ2NvbnRlbnQtbGVuZ3RoJ10gPT09IGZhbHNlO1xuICAgICAgICBpZiAoc2tpcENvbnRlbnRMZW5ndGhIZWFkZXIpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBoZWFkZXJzWydjb250ZW50LWxlbmd0aCddO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucHVibGlzaCh7XG4gICAgICAgICAgICBkZXN0aW5hdGlvbixcbiAgICAgICAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gICAgICAgICAgICBib2R5LFxuICAgICAgICAgICAgc2tpcENvbnRlbnRMZW5ndGhIZWFkZXIsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBdmFpbGFibGUgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHksIHJlbmFtZWQgdG8gW0NsaWVudCNyZWNvbm5lY3REZWxheV17QGxpbmsgQ2xpZW50I3JlY29ubmVjdERlbGF5fS5cbiAgICAgKlxuICAgICAqICoqRGVwcmVjYXRlZCoqXG4gICAgICovXG4gICAgc2V0IHJlY29ubmVjdF9kZWxheSh2YWx1ZSkge1xuICAgICAgICB0aGlzLnJlY29ubmVjdERlbGF5ID0gdmFsdWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEF2YWlsYWJsZSBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eSwgcmVuYW1lZCB0byBbQ2xpZW50I3dlYlNvY2tldF17QGxpbmsgQ2xpZW50I3dlYlNvY2tldH0uXG4gICAgICpcbiAgICAgKiAqKkRlcHJlY2F0ZWQqKlxuICAgICAqL1xuICAgIGdldCB3cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMud2ViU29ja2V0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBdmFpbGFibGUgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHksIHJlbmFtZWQgdG8gW0NsaWVudCNjb25uZWN0ZWRWZXJzaW9uXXtAbGluayBDbGllbnQjY29ubmVjdGVkVmVyc2lvbn0uXG4gICAgICpcbiAgICAgKiAqKkRlcHJlY2F0ZWQqKlxuICAgICAqL1xuICAgIGdldCB2ZXJzaW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25uZWN0ZWRWZXJzaW9uO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBdmFpbGFibGUgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHksIHJlbmFtZWQgdG8gW0NsaWVudCNvblVuaGFuZGxlZE1lc3NhZ2Vde0BsaW5rIENsaWVudCNvblVuaGFuZGxlZE1lc3NhZ2V9LlxuICAgICAqXG4gICAgICogKipEZXByZWNhdGVkKipcbiAgICAgKi9cbiAgICBnZXQgb25yZWNlaXZlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vblVuaGFuZGxlZE1lc3NhZ2U7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEF2YWlsYWJsZSBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eSwgcmVuYW1lZCB0byBbQ2xpZW50I29uVW5oYW5kbGVkTWVzc2FnZV17QGxpbmsgQ2xpZW50I29uVW5oYW5kbGVkTWVzc2FnZX0uXG4gICAgICpcbiAgICAgKiAqKkRlcHJlY2F0ZWQqKlxuICAgICAqL1xuICAgIHNldCBvbnJlY2VpdmUodmFsdWUpIHtcbiAgICAgICAgdGhpcy5vblVuaGFuZGxlZE1lc3NhZ2UgPSB2YWx1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQXZhaWxhYmxlIGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5LCByZW5hbWVkIHRvIFtDbGllbnQjb25VbmhhbmRsZWRSZWNlaXB0XXtAbGluayBDbGllbnQjb25VbmhhbmRsZWRSZWNlaXB0fS5cbiAgICAgKiBQcmVmZXIgdXNpbmcgW0NsaWVudCN3YXRjaEZvclJlY2VpcHRde0BsaW5rIENsaWVudCN3YXRjaEZvclJlY2VpcHR9LlxuICAgICAqXG4gICAgICogKipEZXByZWNhdGVkKipcbiAgICAgKi9cbiAgICBnZXQgb25yZWNlaXB0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vblVuaGFuZGxlZFJlY2VpcHQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEF2YWlsYWJsZSBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eSwgcmVuYW1lZCB0byBbQ2xpZW50I29uVW5oYW5kbGVkUmVjZWlwdF17QGxpbmsgQ2xpZW50I29uVW5oYW5kbGVkUmVjZWlwdH0uXG4gICAgICpcbiAgICAgKiAqKkRlcHJlY2F0ZWQqKlxuICAgICAqL1xuICAgIHNldCBvbnJlY2VpcHQodmFsdWUpIHtcbiAgICAgICAgdGhpcy5vblVuaGFuZGxlZFJlY2VpcHQgPSB2YWx1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQXZhaWxhYmxlIGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5LCByZW5hbWVkIHRvIFtDbGllbnQjaGVhcnRiZWF0SW5jb21pbmdde0BsaW5rIENsaWVudCNoZWFydGJlYXRJbmNvbWluZ31cbiAgICAgKiBbQ2xpZW50I2hlYXJ0YmVhdE91dGdvaW5nXXtAbGluayBDbGllbnQjaGVhcnRiZWF0T3V0Z29pbmd9LlxuICAgICAqXG4gICAgICogKipEZXByZWNhdGVkKipcbiAgICAgKi9cbiAgICBnZXQgaGVhcnRiZWF0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faGVhcnRiZWF0SW5mbztcbiAgICB9XG4gICAgLyoqXG4gICAgICogQXZhaWxhYmxlIGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5LCByZW5hbWVkIHRvIFtDbGllbnQjaGVhcnRiZWF0SW5jb21pbmdde0BsaW5rIENsaWVudCNoZWFydGJlYXRJbmNvbWluZ31cbiAgICAgKiBbQ2xpZW50I2hlYXJ0YmVhdE91dGdvaW5nXXtAbGluayBDbGllbnQjaGVhcnRiZWF0T3V0Z29pbmd9LlxuICAgICAqXG4gICAgICogKipEZXByZWNhdGVkKipcbiAgICAgKi9cbiAgICBzZXQgaGVhcnRiZWF0KHZhbHVlKSB7XG4gICAgICAgIHRoaXMuaGVhcnRiZWF0SW5jb21pbmcgPSB2YWx1ZS5pbmNvbWluZztcbiAgICAgICAgdGhpcy5oZWFydGJlYXRPdXRnb2luZyA9IHZhbHVlLm91dGdvaW5nO1xuICAgIH1cbn1cblxuXG4vKioqLyB9KSxcblxuLyoqKi8gXCIuL3NyYy9jb21wYXRpYmlsaXR5L2hlYXJ0YmVhdC1pbmZvLnRzXCI6XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9zcmMvY29tcGF0aWJpbGl0eS9oZWFydGJlYXQtaW5mby50cyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyohIGV4cG9ydHMgcHJvdmlkZWQ6IEhlYXJ0YmVhdEluZm8gKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIF9fd2VicGFja19leHBvcnRzX18sIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXCJ1c2Ugc3RyaWN0XCI7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIoX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4vKiBoYXJtb255IGV4cG9ydCAoYmluZGluZykgKi8gX193ZWJwYWNrX3JlcXVpcmVfXy5kKF9fd2VicGFja19leHBvcnRzX18sIFwiSGVhcnRiZWF0SW5mb1wiLCBmdW5jdGlvbigpIHsgcmV0dXJuIEhlYXJ0YmVhdEluZm87IH0pO1xuLyoqXG4gKiBQYXJ0IG9mIGBAc3RvbXAvc3RvbXBqc2AuXG4gKlxuICogQGludGVybmFsXG4gKi9cbmNsYXNzIEhlYXJ0YmVhdEluZm8ge1xuICAgIGNvbnN0cnVjdG9yKGNsaWVudCkge1xuICAgICAgICB0aGlzLmNsaWVudCA9IGNsaWVudDtcbiAgICB9XG4gICAgZ2V0IG91dGdvaW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGllbnQuaGVhcnRiZWF0T3V0Z29pbmc7XG4gICAgfVxuICAgIHNldCBvdXRnb2luZyh2YWx1ZSkge1xuICAgICAgICB0aGlzLmNsaWVudC5oZWFydGJlYXRPdXRnb2luZyA9IHZhbHVlO1xuICAgIH1cbiAgICBnZXQgaW5jb21pbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsaWVudC5oZWFydGJlYXRJbmNvbWluZztcbiAgICB9XG4gICAgc2V0IGluY29taW5nKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuY2xpZW50LmhlYXJ0YmVhdEluY29taW5nID0gdmFsdWU7XG4gICAgfVxufVxuXG5cbi8qKiovIH0pLFxuXG4vKioqLyBcIi4vc3JjL2NvbXBhdGliaWxpdHkvc3RvbXAudHNcIjpcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiAuL3NyYy9jb21wYXRpYmlsaXR5L3N0b21wLnRzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKiEgZXhwb3J0cyBwcm92aWRlZDogU3RvbXAgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIF9fd2VicGFja19leHBvcnRzX18sIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXCJ1c2Ugc3RyaWN0XCI7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIoX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4vKiBoYXJtb255IGV4cG9ydCAoYmluZGluZykgKi8gX193ZWJwYWNrX3JlcXVpcmVfXy5kKF9fd2VicGFja19leHBvcnRzX18sIFwiU3RvbXBcIiwgZnVuY3Rpb24oKSB7IHJldHVybiBTdG9tcDsgfSk7XG4vKiBoYXJtb255IGltcG9ydCAqLyB2YXIgX3ZlcnNpb25zX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuLi92ZXJzaW9ucyAqLyBcIi4vc3JjL3ZlcnNpb25zLnRzXCIpO1xuLyogaGFybW9ueSBpbXBvcnQgKi8gdmFyIF9jb21wYXRfY2xpZW50X19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8xX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuL2NvbXBhdC1jbGllbnQgKi8gXCIuL3NyYy9jb21wYXRpYmlsaXR5L2NvbXBhdC1jbGllbnQudHNcIik7XG5cblxuLyoqXG4gKiBTVE9NUCBDbGFzcywgYWN0cyBsaWtlIGEgZmFjdG9yeSB0byBjcmVhdGUge0BsaW5rIENsaWVudH0uXG4gKlxuICogUGFydCBvZiBgQHN0b21wL3N0b21wanNgLlxuICpcbiAqICoqRGVwcmVjYXRlZCoqXG4gKlxuICogSXQgd2lsbCBiZSByZW1vdmVkIGluIG5leHQgbWFqb3IgdmVyc2lvbi4gUGxlYXNlIHN3aXRjaCB0byB7QGxpbmsgQ2xpZW50fS5cbiAqL1xuY2xhc3MgU3RvbXAge1xuICAgIC8qKlxuICAgICAqIFRoaXMgbWV0aG9kIGNyZWF0ZXMgYSBXZWJTb2NrZXQgY2xpZW50IHRoYXQgaXMgY29ubmVjdGVkIHRvXG4gICAgICogdGhlIFNUT01QIHNlcnZlciBsb2NhdGVkIGF0IHRoZSB1cmwuXG4gICAgICpcbiAgICAgKiBgYGBqYXZhc2NyaXB0XG4gICAgICogICAgICAgIHZhciB1cmwgPSBcIndzOi8vbG9jYWxob3N0OjYxNjE0L3N0b21wXCI7XG4gICAgICogICAgICAgIHZhciBjbGllbnQgPSBTdG9tcC5jbGllbnQodXJsKTtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqICoqRGVwcmVjYXRlZCoqXG4gICAgICpcbiAgICAgKiBJdCB3aWxsIGJlIHJlbW92ZWQgaW4gbmV4dCBtYWpvciB2ZXJzaW9uLiBQbGVhc2Ugc3dpdGNoIHRvIHtAbGluayBDbGllbnR9XG4gICAgICogdXNpbmcgW0NsaWVudCNicm9rZXJVUkxde0BsaW5rIENsaWVudCNicm9rZXJVUkx9LlxuICAgICAqL1xuICAgIHN0YXRpYyBjbGllbnQodXJsLCBwcm90b2NvbHMpIHtcbiAgICAgICAgLy8gVGhpcyBpcyBhIGhhY2sgdG8gYWxsb3cgYW5vdGhlciBpbXBsZW1lbnRhdGlvbiB0aGFuIHRoZSBzdGFuZGFyZFxuICAgICAgICAvLyBIVE1MNSBXZWJTb2NrZXQgY2xhc3MuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIEl0IGlzIHBvc3NpYmxlIHRvIHVzZSBhbm90aGVyIGNsYXNzIGJ5IGNhbGxpbmdcbiAgICAgICAgLy9cbiAgICAgICAgLy8gICAgIFN0b21wLldlYlNvY2tldENsYXNzID0gTW96V2ViU29ja2V0XG4gICAgICAgIC8vXG4gICAgICAgIC8vICpwcmlvciogdG8gY2FsbCBgU3RvbXAuY2xpZW50KClgLlxuICAgICAgICAvL1xuICAgICAgICAvLyBUaGlzIGhhY2sgaXMgZGVwcmVjYXRlZCBhbmQgYFN0b21wLm92ZXIoKWAgbWV0aG9kIHNob3VsZCBiZSB1c2VkXG4gICAgICAgIC8vIGluc3RlYWQuXG4gICAgICAgIC8vIFNlZSByZW1hcmtzIG9uIHRoZSBmdW5jdGlvbiBTdG9tcC5vdmVyXG4gICAgICAgIGlmIChwcm90b2NvbHMgPT0gbnVsbCkge1xuICAgICAgICAgICAgcHJvdG9jb2xzID0gX3ZlcnNpb25zX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX19bXCJWZXJzaW9uc1wiXS5kZWZhdWx0LnByb3RvY29sVmVyc2lvbnMoKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB3c0ZuID0gKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qga2xhc3MgPSBTdG9tcC5XZWJTb2NrZXRDbGFzcyB8fCBXZWJTb2NrZXQ7XG4gICAgICAgICAgICByZXR1cm4gbmV3IGtsYXNzKHVybCwgcHJvdG9jb2xzKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIG5ldyBfY29tcGF0X2NsaWVudF9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMV9fW1wiQ29tcGF0Q2xpZW50XCJdKHdzRm4pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUaGlzIG1ldGhvZCBpcyBhbiBhbHRlcm5hdGl2ZSB0byBbU3RvbXAjY2xpZW50XXtAbGluayBTdG9tcCNjbGllbnR9IHRvIGxldCB0aGUgdXNlclxuICAgICAqIHNwZWNpZnkgdGhlIFdlYlNvY2tldCB0byB1c2UgKGVpdGhlciBhIHN0YW5kYXJkIEhUTUw1IFdlYlNvY2tldCBvclxuICAgICAqIGEgc2ltaWxhciBvYmplY3QpLlxuICAgICAqXG4gICAgICogSW4gb3JkZXIgdG8gc3VwcG9ydCByZWNvbm5lY3Rpb24sIHRoZSBmdW5jdGlvbiBDbGllbnQuX2Nvbm5lY3Qgc2hvdWxkIGJlIGNhbGxhYmxlIG1vcmUgdGhhbiBvbmNlLlxuICAgICAqIFdoaWxlIHJlY29ubmVjdGluZ1xuICAgICAqIGEgbmV3IGluc3RhbmNlIG9mIHVuZGVybHlpbmcgdHJhbnNwb3J0IChUQ1AgU29ja2V0LCBXZWJTb2NrZXQgb3IgU29ja0pTKSB3aWxsIGJlIG5lZWRlZC4gU28sIHRoaXMgZnVuY3Rpb25cbiAgICAgKiBhbHRlcm5hdGl2ZWx5IGFsbG93cyBwYXNzaW5nIGEgZnVuY3Rpb24gdGhhdCBzaG91bGQgcmV0dXJuIGEgbmV3IGluc3RhbmNlIG9mIHRoZSB1bmRlcmx5aW5nIHNvY2tldC5cbiAgICAgKlxuICAgICAqIGBgYGphdmFzY3JpcHRcbiAgICAgKiAgICAgICAgdmFyIGNsaWVudCA9IFN0b21wLm92ZXIoZnVuY3Rpb24oKXtcbiAgICAgKiAgICAgICAgICByZXR1cm4gbmV3IFdlYlNvY2tldCgnd3M6Ly9sb2NhbGhvc3Q6MTU2NzQvd3MnKVxuICAgICAqICAgICAgICB9KTtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqICoqRGVwcmVjYXRlZCoqXG4gICAgICpcbiAgICAgKiBJdCB3aWxsIGJlIHJlbW92ZWQgaW4gbmV4dCBtYWpvciB2ZXJzaW9uLiBQbGVhc2Ugc3dpdGNoIHRvIHtAbGluayBDbGllbnR9XG4gICAgICogdXNpbmcgW0NsaWVudCN3ZWJTb2NrZXRGYWN0b3J5XXtAbGluayBDbGllbnQjd2ViU29ja2V0RmFjdG9yeX0uXG4gICAgICovXG4gICAgc3RhdGljIG92ZXIod3MpIHtcbiAgICAgICAgbGV0IHdzRm47XG4gICAgICAgIGlmICh0eXBlb2Ygd3MgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHdzRm4gPSB3cztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignU3RvbXAub3ZlciBkaWQgbm90IHJlY2VpdmUgYSBmYWN0b3J5LCBhdXRvIHJlY29ubmVjdCB3aWxsIG5vdCB3b3JrLiAnICtcbiAgICAgICAgICAgICAgICAnUGxlYXNlIHNlZSBodHRwczovL3N0b21wLWpzLmdpdGh1Yi5pby9hcGktZG9jcy9sYXRlc3QvY2xhc3Nlcy9TdG9tcC5odG1sI292ZXInKTtcbiAgICAgICAgICAgIHdzRm4gPSAoKSA9PiB3cztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IF9jb21wYXRfY2xpZW50X19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8xX19bXCJDb21wYXRDbGllbnRcIl0od3NGbik7XG4gICAgfVxufVxuLyoqXG4gKiBJbiBjYXNlIHlvdSBuZWVkIHRvIHVzZSBhIG5vbiBzdGFuZGFyZCBjbGFzcyBmb3IgV2ViU29ja2V0LlxuICpcbiAqIEZvciBleGFtcGxlIHdoZW4gdXNpbmcgd2l0aGluIE5vZGVKUyBlbnZpcm9ubWVudDpcbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiAgICAgICAgU3RvbXBKcyA9IHJlcXVpcmUoJy4uLy4uL2VzbTUvJyk7XG4gKiAgICAgICAgU3RvbXAgPSBTdG9tcEpzLlN0b21wO1xuICogICAgICAgIFN0b21wLldlYlNvY2tldENsYXNzID0gcmVxdWlyZSgnd2Vic29ja2V0JykudzNjd2Vic29ja2V0O1xuICogYGBgXG4gKlxuICogKipEZXByZWNhdGVkKipcbiAqXG4gKlxuICogSXQgd2lsbCBiZSByZW1vdmVkIGluIG5leHQgbWFqb3IgdmVyc2lvbi4gUGxlYXNlIHN3aXRjaCB0byB7QGxpbmsgQ2xpZW50fVxuICogdXNpbmcgW0NsaWVudCN3ZWJTb2NrZXRGYWN0b3J5XXtAbGluayBDbGllbnQjd2ViU29ja2V0RmFjdG9yeX0uXG4gKi9cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lXG5TdG9tcC5XZWJTb2NrZXRDbGFzcyA9IG51bGw7XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIFwiLi9zcmMvZnJhbWUtaW1wbC50c1wiOlxuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vc3JjL2ZyYW1lLWltcGwudHMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qISBleHBvcnRzIHByb3ZpZGVkOiBGcmFtZUltcGwgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIF9fd2VicGFja19leHBvcnRzX18sIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXCJ1c2Ugc3RyaWN0XCI7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIoX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4vKiBoYXJtb255IGV4cG9ydCAoYmluZGluZykgKi8gX193ZWJwYWNrX3JlcXVpcmVfXy5kKF9fd2VicGFja19leHBvcnRzX18sIFwiRnJhbWVJbXBsXCIsIGZ1bmN0aW9uKCkgeyByZXR1cm4gRnJhbWVJbXBsOyB9KTtcbi8qIGhhcm1vbnkgaW1wb3J0ICovIHZhciBfYnl0ZV9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMF9fID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi9ieXRlICovIFwiLi9zcmMvYnl0ZS50c1wiKTtcblxuLyoqXG4gKiBGcmFtZSBjbGFzcyByZXByZXNlbnRzIGEgU1RPTVAgZnJhbWUuXG4gKlxuICogQGludGVybmFsXG4gKi9cbmNsYXNzIEZyYW1lSW1wbCB7XG4gICAgLyoqXG4gICAgICogRnJhbWUgY29uc3RydWN0b3IuIGBjb21tYW5kYCwgYGhlYWRlcnNgIGFuZCBgYm9keWAgYXJlIGF2YWlsYWJsZSBhcyBwcm9wZXJ0aWVzLlxuICAgICAqXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgY29uc3RydWN0b3IocGFyYW1zKSB7XG4gICAgICAgIGNvbnN0IHsgY29tbWFuZCwgaGVhZGVycywgYm9keSwgYmluYXJ5Qm9keSwgZXNjYXBlSGVhZGVyVmFsdWVzLCBza2lwQ29udGVudExlbmd0aEhlYWRlciwgfSA9IHBhcmFtcztcbiAgICAgICAgdGhpcy5jb21tYW5kID0gY29tbWFuZDtcbiAgICAgICAgdGhpcy5oZWFkZXJzID0gT2JqZWN0LmFzc2lnbih7fSwgaGVhZGVycyB8fCB7fSk7XG4gICAgICAgIGlmIChiaW5hcnlCb2R5KSB7XG4gICAgICAgICAgICB0aGlzLl9iaW5hcnlCb2R5ID0gYmluYXJ5Qm9keTtcbiAgICAgICAgICAgIHRoaXMuaXNCaW5hcnlCb2R5ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2JvZHkgPSBib2R5IHx8ICcnO1xuICAgICAgICAgICAgdGhpcy5pc0JpbmFyeUJvZHkgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVzY2FwZUhlYWRlclZhbHVlcyA9IGVzY2FwZUhlYWRlclZhbHVlcyB8fCBmYWxzZTtcbiAgICAgICAgdGhpcy5za2lwQ29udGVudExlbmd0aEhlYWRlciA9IHNraXBDb250ZW50TGVuZ3RoSGVhZGVyIHx8IGZhbHNlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBib2R5IG9mIHRoZSBmcmFtZVxuICAgICAqL1xuICAgIGdldCBib2R5KCkge1xuICAgICAgICBpZiAoIXRoaXMuX2JvZHkgJiYgdGhpcy5pc0JpbmFyeUJvZHkpIHtcbiAgICAgICAgICAgIHRoaXMuX2JvZHkgPSBuZXcgVGV4dERlY29kZXIoKS5kZWNvZGUodGhpcy5fYmluYXJ5Qm9keSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2JvZHk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGJvZHkgYXMgVWludDhBcnJheVxuICAgICAqL1xuICAgIGdldCBiaW5hcnlCb2R5KCkge1xuICAgICAgICBpZiAoIXRoaXMuX2JpbmFyeUJvZHkgJiYgIXRoaXMuaXNCaW5hcnlCb2R5KSB7XG4gICAgICAgICAgICB0aGlzLl9iaW5hcnlCb2R5ID0gbmV3IFRleHRFbmNvZGVyKCkuZW5jb2RlKHRoaXMuX2JvZHkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9iaW5hcnlCb2R5O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBkZXNlcmlhbGl6ZSBhIFNUT01QIEZyYW1lIGZyb20gcmF3IGRhdGEuXG4gICAgICpcbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBzdGF0aWMgZnJvbVJhd0ZyYW1lKHJhd0ZyYW1lLCBlc2NhcGVIZWFkZXJWYWx1ZXMpIHtcbiAgICAgICAgY29uc3QgaGVhZGVycyA9IHt9O1xuICAgICAgICBjb25zdCB0cmltID0gKHN0cikgPT4gc3RyLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKTtcbiAgICAgICAgLy8gSW4gY2FzZSBvZiByZXBlYXRlZCBoZWFkZXJzLCBhcyBwZXIgc3RhbmRhcmRzLCBmaXJzdCB2YWx1ZSBuZWVkIHRvIGJlIHVzZWRcbiAgICAgICAgZm9yIChjb25zdCBoZWFkZXIgb2YgcmF3RnJhbWUuaGVhZGVycy5yZXZlcnNlKCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGlkeCA9IGhlYWRlci5pbmRleE9mKCc6Jyk7XG4gICAgICAgICAgICBjb25zdCBrZXkgPSB0cmltKGhlYWRlclswXSk7XG4gICAgICAgICAgICBsZXQgdmFsdWUgPSB0cmltKGhlYWRlclsxXSk7XG4gICAgICAgICAgICBpZiAoZXNjYXBlSGVhZGVyVmFsdWVzICYmXG4gICAgICAgICAgICAgICAgcmF3RnJhbWUuY29tbWFuZCAhPT0gJ0NPTk5FQ1QnICYmXG4gICAgICAgICAgICAgICAgcmF3RnJhbWUuY29tbWFuZCAhPT0gJ0NPTk5FQ1RFRCcpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IEZyYW1lSW1wbC5oZHJWYWx1ZVVuRXNjYXBlKHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGhlYWRlcnNba2V5XSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgRnJhbWVJbXBsKHtcbiAgICAgICAgICAgIGNvbW1hbmQ6IHJhd0ZyYW1lLmNvbW1hbmQsXG4gICAgICAgICAgICBoZWFkZXJzLFxuICAgICAgICAgICAgYmluYXJ5Qm9keTogcmF3RnJhbWUuYmluYXJ5Qm9keSxcbiAgICAgICAgICAgIGVzY2FwZUhlYWRlclZhbHVlcyxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXJpYWxpemVDbWRBbmRIZWFkZXJzKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHNlcmlhbGl6ZSB0aGlzIEZyYW1lIGluIGEgZm9ybWF0IHN1aXRhYmxlIHRvIGJlIHBhc3NlZCB0byBXZWJTb2NrZXQuXG4gICAgICogSWYgdGhlIGJvZHkgaXMgc3RyaW5nIHRoZSBvdXRwdXQgd2lsbCBiZSBzdHJpbmcuXG4gICAgICogSWYgdGhlIGJvZHkgaXMgYmluYXJ5IChpLmUuIG9mIHR5cGUgVW5pdDhBcnJheSkgaXQgd2lsbCBiZSBzZXJpYWxpemVkIHRvIEFycmF5QnVmZmVyLlxuICAgICAqXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgc2VyaWFsaXplKCkge1xuICAgICAgICBjb25zdCBjbWRBbmRIZWFkZXJzID0gdGhpcy5zZXJpYWxpemVDbWRBbmRIZWFkZXJzKCk7XG4gICAgICAgIGlmICh0aGlzLmlzQmluYXJ5Qm9keSkge1xuICAgICAgICAgICAgcmV0dXJuIEZyYW1lSW1wbC50b1VuaXQ4QXJyYXkoY21kQW5kSGVhZGVycywgdGhpcy5fYmluYXJ5Qm9keSkuYnVmZmVyO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGNtZEFuZEhlYWRlcnMgKyB0aGlzLl9ib2R5ICsgX2J5dGVfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfX1tcIkJZVEVcIl0uTlVMTDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzZXJpYWxpemVDbWRBbmRIZWFkZXJzKCkge1xuICAgICAgICBjb25zdCBsaW5lcyA9IFt0aGlzLmNvbW1hbmRdO1xuICAgICAgICBpZiAodGhpcy5za2lwQ29udGVudExlbmd0aEhlYWRlcikge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuaGVhZGVyc1snY29udGVudC1sZW5ndGgnXTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IG5hbWUgb2YgT2JqZWN0LmtleXModGhpcy5oZWFkZXJzIHx8IHt9KSkge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmhlYWRlcnNbbmFtZV07XG4gICAgICAgICAgICBpZiAodGhpcy5lc2NhcGVIZWFkZXJWYWx1ZXMgJiZcbiAgICAgICAgICAgICAgICB0aGlzLmNvbW1hbmQgIT09ICdDT05ORUNUJyAmJlxuICAgICAgICAgICAgICAgIHRoaXMuY29tbWFuZCAhPT0gJ0NPTk5FQ1RFRCcpIHtcbiAgICAgICAgICAgICAgICBsaW5lcy5wdXNoKGAke25hbWV9OiR7RnJhbWVJbXBsLmhkclZhbHVlRXNjYXBlKGAke3ZhbHVlfWApfWApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbGluZXMucHVzaChgJHtuYW1lfToke3ZhbHVlfWApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmlzQmluYXJ5Qm9keSB8fFxuICAgICAgICAgICAgKCF0aGlzLmlzQm9keUVtcHR5KCkgJiYgIXRoaXMuc2tpcENvbnRlbnRMZW5ndGhIZWFkZXIpKSB7XG4gICAgICAgICAgICBsaW5lcy5wdXNoKGBjb250ZW50LWxlbmd0aDoke3RoaXMuYm9keUxlbmd0aCgpfWApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsaW5lcy5qb2luKF9ieXRlX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX19bXCJCWVRFXCJdLkxGKSArIF9ieXRlX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX19bXCJCWVRFXCJdLkxGICsgX2J5dGVfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfX1tcIkJZVEVcIl0uTEY7XG4gICAgfVxuICAgIGlzQm9keUVtcHR5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ib2R5TGVuZ3RoKCkgPT09IDA7XG4gICAgfVxuICAgIGJvZHlMZW5ndGgoKSB7XG4gICAgICAgIGNvbnN0IGJpbmFyeUJvZHkgPSB0aGlzLmJpbmFyeUJvZHk7XG4gICAgICAgIHJldHVybiBiaW5hcnlCb2R5ID8gYmluYXJ5Qm9keS5sZW5ndGggOiAwO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb21wdXRlIHRoZSBzaXplIG9mIGEgVVRGLTggc3RyaW5nIGJ5IGNvdW50aW5nIGl0cyBudW1iZXIgb2YgYnl0ZXNcbiAgICAgKiAoYW5kIG5vdCB0aGUgbnVtYmVyIG9mIGNoYXJhY3RlcnMgY29tcG9zaW5nIHRoZSBzdHJpbmcpXG4gICAgICovXG4gICAgc3RhdGljIHNpemVPZlVURjgocykge1xuICAgICAgICByZXR1cm4gcyA/IG5ldyBUZXh0RW5jb2RlcigpLmVuY29kZShzKS5sZW5ndGggOiAwO1xuICAgIH1cbiAgICBzdGF0aWMgdG9Vbml0OEFycmF5KGNtZEFuZEhlYWRlcnMsIGJpbmFyeUJvZHkpIHtcbiAgICAgICAgY29uc3QgdWludDhDbWRBbmRIZWFkZXJzID0gbmV3IFRleHRFbmNvZGVyKCkuZW5jb2RlKGNtZEFuZEhlYWRlcnMpO1xuICAgICAgICBjb25zdCBudWxsVGVybWluYXRvciA9IG5ldyBVaW50OEFycmF5KFswXSk7XG4gICAgICAgIGNvbnN0IHVpbnQ4RnJhbWUgPSBuZXcgVWludDhBcnJheSh1aW50OENtZEFuZEhlYWRlcnMubGVuZ3RoICsgYmluYXJ5Qm9keS5sZW5ndGggKyBudWxsVGVybWluYXRvci5sZW5ndGgpO1xuICAgICAgICB1aW50OEZyYW1lLnNldCh1aW50OENtZEFuZEhlYWRlcnMpO1xuICAgICAgICB1aW50OEZyYW1lLnNldChiaW5hcnlCb2R5LCB1aW50OENtZEFuZEhlYWRlcnMubGVuZ3RoKTtcbiAgICAgICAgdWludDhGcmFtZS5zZXQobnVsbFRlcm1pbmF0b3IsIHVpbnQ4Q21kQW5kSGVhZGVycy5sZW5ndGggKyBiaW5hcnlCb2R5Lmxlbmd0aCk7XG4gICAgICAgIHJldHVybiB1aW50OEZyYW1lO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXJpYWxpemUgYSBTVE9NUCBmcmFtZSBhcyBwZXIgU1RPTVAgc3RhbmRhcmRzLCBzdWl0YWJsZSB0byBiZSBzZW50IHRvIHRoZSBTVE9NUCBicm9rZXIuXG4gICAgICpcbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBzdGF0aWMgbWFyc2hhbGwocGFyYW1zKSB7XG4gICAgICAgIGNvbnN0IGZyYW1lID0gbmV3IEZyYW1lSW1wbChwYXJhbXMpO1xuICAgICAgICByZXR1cm4gZnJhbWUuc2VyaWFsaXplKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqICBFc2NhcGUgaGVhZGVyIHZhbHVlc1xuICAgICAqL1xuICAgIHN0YXRpYyBoZHJWYWx1ZUVzY2FwZShzdHIpIHtcbiAgICAgICAgcmV0dXJuIHN0clxuICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFwvZywgJ1xcXFxcXFxcJylcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXHIvZywgJ1xcXFxyJylcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXG4vZywgJ1xcXFxuJylcbiAgICAgICAgICAgIC5yZXBsYWNlKC86L2csICdcXFxcYycpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBVbkVzY2FwZSBoZWFkZXIgdmFsdWVzXG4gICAgICovXG4gICAgc3RhdGljIGhkclZhbHVlVW5Fc2NhcGUoc3RyKSB7XG4gICAgICAgIHJldHVybiBzdHJcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcci9nLCAnXFxyJylcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcbi9nLCAnXFxuJylcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcYy9nLCAnOicpXG4gICAgICAgICAgICAucmVwbGFjZSgvXFxcXFxcXFwvZywgJ1xcXFwnKTtcbiAgICB9XG59XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIFwiLi9zcmMvaW5kZXgudHNcIjpcbi8qISoqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9zcmMvaW5kZXgudHMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKiovXG4vKiEgZXhwb3J0cyBwcm92aWRlZDogQ2xpZW50LCBGcmFtZUltcGwsIFBhcnNlciwgU3RvbXBDb25maWcsIFN0b21wSGVhZGVycywgU3RvbXBTdWJzY3JpcHRpb24sIFN0b21wU29ja2V0U3RhdGUsIEFjdGl2YXRpb25TdGF0ZSwgVmVyc2lvbnMsIENvbXBhdENsaWVudCwgU3RvbXAgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIF9fd2VicGFja19leHBvcnRzX18sIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXCJ1c2Ugc3RyaWN0XCI7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIoX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4vKiBoYXJtb255IGltcG9ydCAqLyB2YXIgX2NsaWVudF9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMF9fID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi9jbGllbnQgKi8gXCIuL3NyYy9jbGllbnQudHNcIik7XG4vKiBoYXJtb255IHJlZXhwb3J0IChzYWZlKSAqLyBfX3dlYnBhY2tfcmVxdWlyZV9fLmQoX193ZWJwYWNrX2V4cG9ydHNfXywgXCJDbGllbnRcIiwgZnVuY3Rpb24oKSB7IHJldHVybiBfY2xpZW50X19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX19bXCJDbGllbnRcIl07IH0pO1xuXG4vKiBoYXJtb255IGltcG9ydCAqLyB2YXIgX2ZyYW1lX2ltcGxfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzFfXyA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4vZnJhbWUtaW1wbCAqLyBcIi4vc3JjL2ZyYW1lLWltcGwudHNcIik7XG4vKiBoYXJtb255IHJlZXhwb3J0IChzYWZlKSAqLyBfX3dlYnBhY2tfcmVxdWlyZV9fLmQoX193ZWJwYWNrX2V4cG9ydHNfXywgXCJGcmFtZUltcGxcIiwgZnVuY3Rpb24oKSB7IHJldHVybiBfZnJhbWVfaW1wbF9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMV9fW1wiRnJhbWVJbXBsXCJdOyB9KTtcblxuLyogaGFybW9ueSBpbXBvcnQgKi8gdmFyIF9wYXJzZXJfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzJfXyA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4vcGFyc2VyICovIFwiLi9zcmMvcGFyc2VyLnRzXCIpO1xuLyogaGFybW9ueSByZWV4cG9ydCAoc2FmZSkgKi8gX193ZWJwYWNrX3JlcXVpcmVfXy5kKF9fd2VicGFja19leHBvcnRzX18sIFwiUGFyc2VyXCIsIGZ1bmN0aW9uKCkgeyByZXR1cm4gX3BhcnNlcl9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMl9fW1wiUGFyc2VyXCJdOyB9KTtcblxuLyogaGFybW9ueSBpbXBvcnQgKi8gdmFyIF9zdG9tcF9jb25maWdfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4vc3RvbXAtY29uZmlnICovIFwiLi9zcmMvc3RvbXAtY29uZmlnLnRzXCIpO1xuLyogaGFybW9ueSByZWV4cG9ydCAoc2FmZSkgKi8gX193ZWJwYWNrX3JlcXVpcmVfXy5kKF9fd2VicGFja19leHBvcnRzX18sIFwiU3RvbXBDb25maWdcIiwgZnVuY3Rpb24oKSB7IHJldHVybiBfc3RvbXBfY29uZmlnX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8zX19bXCJTdG9tcENvbmZpZ1wiXTsgfSk7XG5cbi8qIGhhcm1vbnkgaW1wb3J0ICovIHZhciBfc3RvbXBfaGVhZGVyc19fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfNF9fID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi9zdG9tcC1oZWFkZXJzICovIFwiLi9zcmMvc3RvbXAtaGVhZGVycy50c1wiKTtcbi8qIGhhcm1vbnkgcmVleHBvcnQgKHNhZmUpICovIF9fd2VicGFja19yZXF1aXJlX18uZChfX3dlYnBhY2tfZXhwb3J0c19fLCBcIlN0b21wSGVhZGVyc1wiLCBmdW5jdGlvbigpIHsgcmV0dXJuIF9zdG9tcF9oZWFkZXJzX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV80X19bXCJTdG9tcEhlYWRlcnNcIl07IH0pO1xuXG4vKiBoYXJtb255IGltcG9ydCAqLyB2YXIgX3N0b21wX3N1YnNjcmlwdGlvbl9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfNV9fID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi9zdG9tcC1zdWJzY3JpcHRpb24gKi8gXCIuL3NyYy9zdG9tcC1zdWJzY3JpcHRpb24udHNcIik7XG4vKiBoYXJtb255IHJlZXhwb3J0IChzYWZlKSAqLyBfX3dlYnBhY2tfcmVxdWlyZV9fLmQoX193ZWJwYWNrX2V4cG9ydHNfXywgXCJTdG9tcFN1YnNjcmlwdGlvblwiLCBmdW5jdGlvbigpIHsgcmV0dXJuIF9zdG9tcF9zdWJzY3JpcHRpb25fX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzVfX1tcIlN0b21wU3Vic2NyaXB0aW9uXCJdOyB9KTtcblxuLyogaGFybW9ueSBpbXBvcnQgKi8gdmFyIF90eXBlc19fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfNl9fID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi90eXBlcyAqLyBcIi4vc3JjL3R5cGVzLnRzXCIpO1xuLyogaGFybW9ueSByZWV4cG9ydCAoc2FmZSkgKi8gX193ZWJwYWNrX3JlcXVpcmVfXy5kKF9fd2VicGFja19leHBvcnRzX18sIFwiU3RvbXBTb2NrZXRTdGF0ZVwiLCBmdW5jdGlvbigpIHsgcmV0dXJuIF90eXBlc19fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfNl9fW1wiU3RvbXBTb2NrZXRTdGF0ZVwiXTsgfSk7XG5cbi8qIGhhcm1vbnkgcmVleHBvcnQgKHNhZmUpICovIF9fd2VicGFja19yZXF1aXJlX18uZChfX3dlYnBhY2tfZXhwb3J0c19fLCBcIkFjdGl2YXRpb25TdGF0ZVwiLCBmdW5jdGlvbigpIHsgcmV0dXJuIF90eXBlc19fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfNl9fW1wiQWN0aXZhdGlvblN0YXRlXCJdOyB9KTtcblxuLyogaGFybW9ueSBpbXBvcnQgKi8gdmFyIF92ZXJzaW9uc19fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfN19fID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi92ZXJzaW9ucyAqLyBcIi4vc3JjL3ZlcnNpb25zLnRzXCIpO1xuLyogaGFybW9ueSByZWV4cG9ydCAoc2FmZSkgKi8gX193ZWJwYWNrX3JlcXVpcmVfXy5kKF9fd2VicGFja19leHBvcnRzX18sIFwiVmVyc2lvbnNcIiwgZnVuY3Rpb24oKSB7IHJldHVybiBfdmVyc2lvbnNfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzdfX1tcIlZlcnNpb25zXCJdOyB9KTtcblxuLyogaGFybW9ueSBpbXBvcnQgKi8gdmFyIF9jb21wYXRpYmlsaXR5X2NvbXBhdF9jbGllbnRfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzhfXyA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4vY29tcGF0aWJpbGl0eS9jb21wYXQtY2xpZW50ICovIFwiLi9zcmMvY29tcGF0aWJpbGl0eS9jb21wYXQtY2xpZW50LnRzXCIpO1xuLyogaGFybW9ueSByZWV4cG9ydCAoc2FmZSkgKi8gX193ZWJwYWNrX3JlcXVpcmVfXy5kKF9fd2VicGFja19leHBvcnRzX18sIFwiQ29tcGF0Q2xpZW50XCIsIGZ1bmN0aW9uKCkgeyByZXR1cm4gX2NvbXBhdGliaWxpdHlfY29tcGF0X2NsaWVudF9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfOF9fW1wiQ29tcGF0Q2xpZW50XCJdOyB9KTtcblxuLyogaGFybW9ueSBpbXBvcnQgKi8gdmFyIF9jb21wYXRpYmlsaXR5X3N0b21wX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV85X18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuL2NvbXBhdGliaWxpdHkvc3RvbXAgKi8gXCIuL3NyYy9jb21wYXRpYmlsaXR5L3N0b21wLnRzXCIpO1xuLyogaGFybW9ueSByZWV4cG9ydCAoc2FmZSkgKi8gX193ZWJwYWNrX3JlcXVpcmVfXy5kKF9fd2VicGFja19leHBvcnRzX18sIFwiU3RvbXBcIiwgZnVuY3Rpb24oKSB7IHJldHVybiBfY29tcGF0aWJpbGl0eV9zdG9tcF9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfOV9fW1wiU3RvbXBcIl07IH0pO1xuXG5cblxuXG5cblxuXG5cblxuLy8gQ29tcGF0aWJpbGl0eSBjb2RlXG5cblxuXG5cbi8qKiovIH0pLFxuXG4vKioqLyBcIi4vc3JjL3BhcnNlci50c1wiOlxuLyohKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9zcmMvcGFyc2VyLnRzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qISBleHBvcnRzIHByb3ZpZGVkOiBQYXJzZXIgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIF9fd2VicGFja19leHBvcnRzX18sIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXCJ1c2Ugc3RyaWN0XCI7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIoX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4vKiBoYXJtb255IGV4cG9ydCAoYmluZGluZykgKi8gX193ZWJwYWNrX3JlcXVpcmVfXy5kKF9fd2VicGFja19leHBvcnRzX18sIFwiUGFyc2VyXCIsIGZ1bmN0aW9uKCkgeyByZXR1cm4gUGFyc2VyOyB9KTtcbi8qKlxuICogQGludGVybmFsXG4gKi9cbmNvbnN0IE5VTEwgPSAwO1xuLyoqXG4gKiBAaW50ZXJuYWxcbiAqL1xuY29uc3QgTEYgPSAxMDtcbi8qKlxuICogQGludGVybmFsXG4gKi9cbmNvbnN0IENSID0gMTM7XG4vKipcbiAqIEBpbnRlcm5hbFxuICovXG5jb25zdCBDT0xPTiA9IDU4O1xuLyoqXG4gKiBUaGlzIGlzIGFuIGV2ZW50ZWQsIHJlYyBkZXNjZW50IHBhcnNlci5cbiAqIEEgc3RyZWFtIG9mIE9jdGV0cyBjYW4gYmUgcGFzc2VkIGFuZCB3aGVuZXZlciBpdCByZWNvZ25pemVzXG4gKiBhIGNvbXBsZXRlIEZyYW1lIG9yIGFuIGluY29taW5nIHBpbmcgaXQgd2lsbCBpbnZva2UgdGhlIHJlZ2lzdGVyZWQgY2FsbGJhY2tzLlxuICpcbiAqIEFsbCBpbmNvbWluZyBPY3RldHMgYXJlIGZlZCBpbnRvIF9vbkJ5dGUgZnVuY3Rpb24uXG4gKiBEZXBlbmRpbmcgb24gY3VycmVudCBzdGF0ZSB0aGUgX29uQnl0ZSBmdW5jdGlvbiBrZWVwcyBjaGFuZ2luZy5cbiAqIERlcGVuZGluZyBvbiB0aGUgc3RhdGUgaXQga2VlcHMgYWNjdW11bGF0aW5nIGludG8gX3Rva2VuIGFuZCBfcmVzdWx0cy5cbiAqIFN0YXRlIGlzIGluZGljYXRlZCBieSBjdXJyZW50IHZhbHVlIG9mIF9vbkJ5dGUsIGFsbCBzdGF0ZXMgYXJlIG5hbWVkIGFzIF9jb2xsZWN0LlxuICpcbiAqIFNUT01QIHN0YW5kYXJkcyBodHRwczovL3N0b21wLmdpdGh1Yi5pby9zdG9tcC1zcGVjaWZpY2F0aW9uLTEuMi5odG1sXG4gKiBpbXBseSB0aGF0IGFsbCBsZW5ndGhzIGFyZSBjb25zaWRlcmVkIGluIGJ5dGVzIChpbnN0ZWFkIG9mIHN0cmluZyBsZW5ndGhzKS5cbiAqIFNvLCBiZWZvcmUgYWN0dWFsIHBhcnNpbmcsIGlmIHRoZSBpbmNvbWluZyBkYXRhIGlzIFN0cmluZyBpdCBpcyBjb252ZXJ0ZWQgdG8gT2N0ZXRzLlxuICogVGhpcyBhbGxvd3MgZmFpdGhmdWwgaW1wbGVtZW50YXRpb24gb2YgdGhlIHByb3RvY29sIGFuZCBhbGxvd3MgTlVMTCBPY3RldHMgdG8gYmUgcHJlc2VudCBpbiB0aGUgYm9keS5cbiAqXG4gKiBUaGVyZSBpcyBubyBwZWVrIGZ1bmN0aW9uIG9uIHRoZSBpbmNvbWluZyBkYXRhLlxuICogV2hlbiBhIHN0YXRlIGNoYW5nZSBvY2N1cnMgYmFzZWQgb24gYW4gT2N0ZXQgd2l0aG91dCBjb25zdW1pbmcgdGhlIE9jdGV0LFxuICogdGhlIE9jdGV0LCBhZnRlciBzdGF0ZSBjaGFuZ2UsIGlzIGZlZCBhZ2FpbiAoX3JlaW5qZWN0Qnl0ZSkuXG4gKiBUaGlzIGJlY2FtZSBwb3NzaWJsZSBhcyB0aGUgc3RhdGUgY2hhbmdlIGNhbiBiZSBkZXRlcm1pbmVkIGJ5IGluc3BlY3RpbmcganVzdCBvbmUgT2N0ZXQuXG4gKlxuICogVGhlcmUgYXJlIHR3byBtb2RlcyB0byBjb2xsZWN0IHRoZSBib2R5LCBpZiBjb250ZW50LWxlbmd0aCBoZWFkZXIgaXMgdGhlcmUgdGhlbiBpdCBieSBjb3VudGluZyBPY3RldHNcbiAqIG90aGVyd2lzZSBpdCBpcyBkZXRlcm1pbmVkIGJ5IE5VTEwgdGVybWluYXRvci5cbiAqXG4gKiBGb2xsb3dpbmcgdGhlIHN0YW5kYXJkcywgdGhlIGNvbW1hbmQgYW5kIGhlYWRlcnMgYXJlIGNvbnZlcnRlZCB0byBTdHJpbmdzXG4gKiBhbmQgdGhlIGJvZHkgaXMgcmV0dXJuZWQgYXMgT2N0ZXRzLlxuICogSGVhZGVycyBhcmUgcmV0dXJuZWQgYXMgYW4gYXJyYXkgYW5kIG5vdCBhcyBIYXNoIC0gdG8gYWxsb3cgbXVsdGlwbGUgb2NjdXJyZW5jZSBvZiBhbiBoZWFkZXIuXG4gKlxuICogVGhpcyBwYXJzZXIgZG9lcyBub3QgdXNlIFJlZ3VsYXIgRXhwcmVzc2lvbnMgYXMgdGhhdCBjYW4gb25seSBvcGVyYXRlIG9uIFN0cmluZ3MuXG4gKlxuICogSXQgaGFuZGxlcyBpZiBtdWx0aXBsZSBTVE9NUCBmcmFtZXMgYXJlIGdpdmVuIGFzIG9uZSBjaHVuaywgYSBmcmFtZSBpcyBzcGxpdCBpbnRvIG11bHRpcGxlIGNodW5rcywgb3JcbiAqIGFueSBjb21iaW5hdGlvbiB0aGVyZSBvZi4gVGhlIHBhcnNlciByZW1lbWJlcnMgaXRzIHN0YXRlIChhbnkgcGFydGlhbCBmcmFtZSkgYW5kIGNvbnRpbnVlcyB3aGVuIGEgbmV3IGNodW5rXG4gKiBpcyBwdXNoZWQuXG4gKlxuICogVHlwaWNhbGx5IHRoZSBoaWdoZXIgbGV2ZWwgZnVuY3Rpb24gd2lsbCBjb252ZXJ0IGhlYWRlcnMgdG8gSGFzaCwgaGFuZGxlIHVuZXNjYXBpbmcgb2YgaGVhZGVyIHZhbHVlc1xuICogKHdoaWNoIGlzIHByb3RvY29sIHZlcnNpb24gc3BlY2lmaWMpLCBhbmQgY29udmVydCBib2R5IHRvIHRleHQuXG4gKlxuICogQ2hlY2sgdGhlIHBhcnNlci5zcGVjLmpzIHRvIHVuZGVyc3RhbmQgY2FzZXMgdGhhdCB0aGlzIHBhcnNlciBpcyBzdXBwb3NlZCB0byBoYW5kbGUuXG4gKlxuICogUGFydCBvZiBgQHN0b21wL3N0b21wanNgLlxuICpcbiAqIEBpbnRlcm5hbFxuICovXG5jbGFzcyBQYXJzZXIge1xuICAgIGNvbnN0cnVjdG9yKG9uRnJhbWUsIG9uSW5jb21pbmdQaW5nKSB7XG4gICAgICAgIHRoaXMub25GcmFtZSA9IG9uRnJhbWU7XG4gICAgICAgIHRoaXMub25JbmNvbWluZ1BpbmcgPSBvbkluY29taW5nUGluZztcbiAgICAgICAgdGhpcy5fZW5jb2RlciA9IG5ldyBUZXh0RW5jb2RlcigpO1xuICAgICAgICB0aGlzLl9kZWNvZGVyID0gbmV3IFRleHREZWNvZGVyKCk7XG4gICAgICAgIHRoaXMuX3Rva2VuID0gW107XG4gICAgICAgIHRoaXMuX2luaXRTdGF0ZSgpO1xuICAgIH1cbiAgICBwYXJzZUNodW5rKHNlZ21lbnQsIGFwcGVuZE1pc3NpbmdOVUxMb25JbmNvbWluZyA9IGZhbHNlKSB7XG4gICAgICAgIGxldCBjaHVuaztcbiAgICAgICAgaWYgKHNlZ21lbnQgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xuICAgICAgICAgICAgY2h1bmsgPSBuZXcgVWludDhBcnJheShzZWdtZW50KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNodW5rID0gdGhpcy5fZW5jb2Rlci5lbmNvZGUoc2VnbWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9zdG9tcC1qcy9zdG9tcGpzL2lzc3Vlcy84OVxuICAgICAgICAvLyBSZW1vdmUgd2hlbiB1bmRlcmx5aW5nIGlzc3VlIGlzIGZpeGVkLlxuICAgICAgICAvL1xuICAgICAgICAvLyBTZW5kIGEgTlVMTCBieXRlLCBpZiB0aGUgbGFzdCBieXRlIG9mIGEgVGV4dCBmcmFtZSB3YXMgbm90IE5VTEwuRlxuICAgICAgICBpZiAoYXBwZW5kTWlzc2luZ05VTExvbkluY29taW5nICYmIGNodW5rW2NodW5rLmxlbmd0aCAtIDFdICE9PSAwKSB7XG4gICAgICAgICAgICBjb25zdCBjaHVua1dpdGhOdWxsID0gbmV3IFVpbnQ4QXJyYXkoY2h1bmsubGVuZ3RoICsgMSk7XG4gICAgICAgICAgICBjaHVua1dpdGhOdWxsLnNldChjaHVuaywgMCk7XG4gICAgICAgICAgICBjaHVua1dpdGhOdWxsW2NodW5rLmxlbmd0aF0gPSAwO1xuICAgICAgICAgICAgY2h1bmsgPSBjaHVua1dpdGhOdWxsO1xuICAgICAgICB9XG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpwcmVmZXItZm9yLW9mXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2h1bmsubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGJ5dGUgPSBjaHVua1tpXTtcbiAgICAgICAgICAgIHRoaXMuX29uQnl0ZShieXRlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBUaGUgZm9sbG93aW5nIGltcGxlbWVudHMgYSBzaW1wbGUgUmVjIERlc2NlbnQgUGFyc2VyLlxuICAgIC8vIFRoZSBncmFtbWFyIGlzIHNpbXBsZSBhbmQganVzdCBvbmUgYnl0ZSB0ZWxscyB3aGF0IHNob3VsZCBiZSB0aGUgbmV4dCBzdGF0ZVxuICAgIF9jb2xsZWN0RnJhbWUoYnl0ZSkge1xuICAgICAgICBpZiAoYnl0ZSA9PT0gTlVMTCkge1xuICAgICAgICAgICAgLy8gSWdub3JlXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJ5dGUgPT09IENSKSB7XG4gICAgICAgICAgICAvLyBJZ25vcmUgQ1JcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYnl0ZSA9PT0gTEYpIHtcbiAgICAgICAgICAgIC8vIEluY29taW5nIFBpbmdcbiAgICAgICAgICAgIHRoaXMub25JbmNvbWluZ1BpbmcoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9vbkJ5dGUgPSB0aGlzLl9jb2xsZWN0Q29tbWFuZDtcbiAgICAgICAgdGhpcy5fcmVpbmplY3RCeXRlKGJ5dGUpO1xuICAgIH1cbiAgICBfY29sbGVjdENvbW1hbmQoYnl0ZSkge1xuICAgICAgICBpZiAoYnl0ZSA9PT0gQ1IpIHtcbiAgICAgICAgICAgIC8vIElnbm9yZSBDUlxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChieXRlID09PSBMRikge1xuICAgICAgICAgICAgdGhpcy5fcmVzdWx0cy5jb21tYW5kID0gdGhpcy5fY29uc3VtZVRva2VuQXNVVEY4KCk7XG4gICAgICAgICAgICB0aGlzLl9vbkJ5dGUgPSB0aGlzLl9jb2xsZWN0SGVhZGVycztcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jb25zdW1lQnl0ZShieXRlKTtcbiAgICB9XG4gICAgX2NvbGxlY3RIZWFkZXJzKGJ5dGUpIHtcbiAgICAgICAgaWYgKGJ5dGUgPT09IENSKSB7XG4gICAgICAgICAgICAvLyBJZ25vcmUgQ1JcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYnl0ZSA9PT0gTEYpIHtcbiAgICAgICAgICAgIHRoaXMuX3NldHVwQ29sbGVjdEJvZHkoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9vbkJ5dGUgPSB0aGlzLl9jb2xsZWN0SGVhZGVyS2V5O1xuICAgICAgICB0aGlzLl9yZWluamVjdEJ5dGUoYnl0ZSk7XG4gICAgfVxuICAgIF9yZWluamVjdEJ5dGUoYnl0ZSkge1xuICAgICAgICB0aGlzLl9vbkJ5dGUoYnl0ZSk7XG4gICAgfVxuICAgIF9jb2xsZWN0SGVhZGVyS2V5KGJ5dGUpIHtcbiAgICAgICAgaWYgKGJ5dGUgPT09IENPTE9OKSB7XG4gICAgICAgICAgICB0aGlzLl9oZWFkZXJLZXkgPSB0aGlzLl9jb25zdW1lVG9rZW5Bc1VURjgoKTtcbiAgICAgICAgICAgIHRoaXMuX29uQnl0ZSA9IHRoaXMuX2NvbGxlY3RIZWFkZXJWYWx1ZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jb25zdW1lQnl0ZShieXRlKTtcbiAgICB9XG4gICAgX2NvbGxlY3RIZWFkZXJWYWx1ZShieXRlKSB7XG4gICAgICAgIGlmIChieXRlID09PSBDUikge1xuICAgICAgICAgICAgLy8gSWdub3JlIENSXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJ5dGUgPT09IExGKSB7XG4gICAgICAgICAgICB0aGlzLl9yZXN1bHRzLmhlYWRlcnMucHVzaChbdGhpcy5faGVhZGVyS2V5LCB0aGlzLl9jb25zdW1lVG9rZW5Bc1VURjgoKV0pO1xuICAgICAgICAgICAgdGhpcy5faGVhZGVyS2V5ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgdGhpcy5fb25CeXRlID0gdGhpcy5fY29sbGVjdEhlYWRlcnM7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY29uc3VtZUJ5dGUoYnl0ZSk7XG4gICAgfVxuICAgIF9zZXR1cENvbGxlY3RCb2R5KCkge1xuICAgICAgICBjb25zdCBjb250ZW50TGVuZ3RoSGVhZGVyID0gdGhpcy5fcmVzdWx0cy5oZWFkZXJzLmZpbHRlcigoaGVhZGVyKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyWzBdID09PSAnY29udGVudC1sZW5ndGgnO1xuICAgICAgICB9KVswXTtcbiAgICAgICAgaWYgKGNvbnRlbnRMZW5ndGhIZWFkZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2JvZHlCeXRlc1JlbWFpbmluZyA9IHBhcnNlSW50KGNvbnRlbnRMZW5ndGhIZWFkZXJbMV0sIDEwKTtcbiAgICAgICAgICAgIHRoaXMuX29uQnl0ZSA9IHRoaXMuX2NvbGxlY3RCb2R5Rml4ZWRTaXplO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fb25CeXRlID0gdGhpcy5fY29sbGVjdEJvZHlOdWxsVGVybWluYXRlZDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBfY29sbGVjdEJvZHlOdWxsVGVybWluYXRlZChieXRlKSB7XG4gICAgICAgIGlmIChieXRlID09PSBOVUxMKSB7XG4gICAgICAgICAgICB0aGlzLl9yZXRyaWV2ZWRCb2R5KCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY29uc3VtZUJ5dGUoYnl0ZSk7XG4gICAgfVxuICAgIF9jb2xsZWN0Qm9keUZpeGVkU2l6ZShieXRlKSB7XG4gICAgICAgIC8vIEl0IGlzIHBvc3QgZGVjcmVtZW50LCBzbyB0aGF0IHdlIGRpc2NhcmQgdGhlIHRyYWlsaW5nIE5VTEwgb2N0ZXRcbiAgICAgICAgaWYgKHRoaXMuX2JvZHlCeXRlc1JlbWFpbmluZy0tID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLl9yZXRyaWV2ZWRCb2R5KCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY29uc3VtZUJ5dGUoYnl0ZSk7XG4gICAgfVxuICAgIF9yZXRyaWV2ZWRCb2R5KCkge1xuICAgICAgICB0aGlzLl9yZXN1bHRzLmJpbmFyeUJvZHkgPSB0aGlzLl9jb25zdW1lVG9rZW5Bc1JhdygpO1xuICAgICAgICB0aGlzLm9uRnJhbWUodGhpcy5fcmVzdWx0cyk7XG4gICAgICAgIHRoaXMuX2luaXRTdGF0ZSgpO1xuICAgIH1cbiAgICAvLyBSZWMgRGVzY2VudCBQYXJzZXIgaGVscGVyc1xuICAgIF9jb25zdW1lQnl0ZShieXRlKSB7XG4gICAgICAgIHRoaXMuX3Rva2VuLnB1c2goYnl0ZSk7XG4gICAgfVxuICAgIF9jb25zdW1lVG9rZW5Bc1VURjgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWNvZGVyLmRlY29kZSh0aGlzLl9jb25zdW1lVG9rZW5Bc1JhdygpKTtcbiAgICB9XG4gICAgX2NvbnN1bWVUb2tlbkFzUmF3KCkge1xuICAgICAgICBjb25zdCByYXdSZXN1bHQgPSBuZXcgVWludDhBcnJheSh0aGlzLl90b2tlbik7XG4gICAgICAgIHRoaXMuX3Rva2VuID0gW107XG4gICAgICAgIHJldHVybiByYXdSZXN1bHQ7XG4gICAgfVxuICAgIF9pbml0U3RhdGUoKSB7XG4gICAgICAgIHRoaXMuX3Jlc3VsdHMgPSB7XG4gICAgICAgICAgICBjb21tYW5kOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBoZWFkZXJzOiBbXSxcbiAgICAgICAgICAgIGJpbmFyeUJvZHk6IHVuZGVmaW5lZCxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fdG9rZW4gPSBbXTtcbiAgICAgICAgdGhpcy5faGVhZGVyS2V5ID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLl9vbkJ5dGUgPSB0aGlzLl9jb2xsZWN0RnJhbWU7XG4gICAgfVxufVxuXG5cbi8qKiovIH0pLFxuXG4vKioqLyBcIi4vc3JjL3N0b21wLWNvbmZpZy50c1wiOlxuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9zcmMvc3RvbXAtY29uZmlnLnRzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qISBleHBvcnRzIHByb3ZpZGVkOiBTdG9tcENvbmZpZyAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgX193ZWJwYWNrX2V4cG9ydHNfXywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cInVzZSBzdHJpY3RcIjtcbl9fd2VicGFja19yZXF1aXJlX18ucihfX3dlYnBhY2tfZXhwb3J0c19fKTtcbi8qIGhhcm1vbnkgZXhwb3J0IChiaW5kaW5nKSAqLyBfX3dlYnBhY2tfcmVxdWlyZV9fLmQoX193ZWJwYWNrX2V4cG9ydHNfXywgXCJTdG9tcENvbmZpZ1wiLCBmdW5jdGlvbigpIHsgcmV0dXJuIFN0b21wQ29uZmlnOyB9KTtcbi8qKlxuICogQ29uZmlndXJhdGlvbiBvcHRpb25zIGZvciBTVE9NUCBDbGllbnQsIGVhY2gga2V5IGNvcnJlc3BvbmRzIHRvXG4gKiBmaWVsZCBieSB0aGUgc2FtZSBuYW1lIGluIHtAbGluayBDbGllbnR9LiBUaGlzIGNhbiBiZSBwYXNzZWQgdG9cbiAqIHRoZSBjb25zdHJ1Y3RvciBvZiB7QGxpbmsgQ2xpZW50fSBvciB0byBbQ2xpZW50I2NvbmZpZ3VyZV17QGxpbmsgQ2xpZW50I2NvbmZpZ3VyZX0uXG4gKlxuICogVGhlcmUgdXNlZCB0byBiZSBhIGNsYXNzIHdpdGggdGhlIHNhbWUgbmFtZSBpbiBgQHN0b21wL25nMi1zdG9tcGpzYCwgd2hpY2ggaGFzIGJlZW4gcmVwbGFjZWQgYnlcbiAqIHtAbGluayBSeFN0b21wQ29uZmlnfSBhbmQge0BsaW5rIEluamVjdGFibGVSeFN0b21wQ29uZmlnfS5cbiAqXG4gKiBQYXJ0IG9mIGBAc3RvbXAvc3RvbXBqc2AuXG4gKi9cbmNsYXNzIFN0b21wQ29uZmlnIHtcbn1cblxuXG4vKioqLyB9KSxcblxuLyoqKi8gXCIuL3NyYy9zdG9tcC1oYW5kbGVyLnRzXCI6XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9zcmMvc3RvbXAtaGFuZGxlci50cyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyohIGV4cG9ydHMgcHJvdmlkZWQ6IFN0b21wSGFuZGxlciAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgX193ZWJwYWNrX2V4cG9ydHNfXywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cInVzZSBzdHJpY3RcIjtcbl9fd2VicGFja19yZXF1aXJlX18ucihfX3dlYnBhY2tfZXhwb3J0c19fKTtcbi8qIGhhcm1vbnkgZXhwb3J0IChiaW5kaW5nKSAqLyBfX3dlYnBhY2tfcmVxdWlyZV9fLmQoX193ZWJwYWNrX2V4cG9ydHNfXywgXCJTdG9tcEhhbmRsZXJcIiwgZnVuY3Rpb24oKSB7IHJldHVybiBTdG9tcEhhbmRsZXI7IH0pO1xuLyogaGFybW9ueSBpbXBvcnQgKi8gdmFyIF9ieXRlX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuL2J5dGUgKi8gXCIuL3NyYy9ieXRlLnRzXCIpO1xuLyogaGFybW9ueSBpbXBvcnQgKi8gdmFyIF9mcmFtZV9pbXBsX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8xX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuL2ZyYW1lLWltcGwgKi8gXCIuL3NyYy9mcmFtZS1pbXBsLnRzXCIpO1xuLyogaGFybW9ueSBpbXBvcnQgKi8gdmFyIF9wYXJzZXJfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzJfXyA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC4vcGFyc2VyICovIFwiLi9zcmMvcGFyc2VyLnRzXCIpO1xuLyogaGFybW9ueSBpbXBvcnQgKi8gdmFyIF90eXBlc19fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfM19fID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi90eXBlcyAqLyBcIi4vc3JjL3R5cGVzLnRzXCIpO1xuLyogaGFybW9ueSBpbXBvcnQgKi8gdmFyIF92ZXJzaW9uc19fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfNF9fID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi92ZXJzaW9ucyAqLyBcIi4vc3JjL3ZlcnNpb25zLnRzXCIpO1xuLyogaGFybW9ueSBpbXBvcnQgKi8gdmFyIF9hdWdtZW50X3dlYnNvY2tldF9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfNV9fID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi9hdWdtZW50LXdlYnNvY2tldCAqLyBcIi4vc3JjL2F1Z21lbnQtd2Vic29ja2V0LnRzXCIpO1xuXG5cblxuXG5cblxuLyoqXG4gKiBUaGUgU1RPTVAgcHJvdG9jb2wgaGFuZGxlclxuICpcbiAqIFBhcnQgb2YgYEBzdG9tcC9zdG9tcGpzYC5cbiAqXG4gKiBAaW50ZXJuYWxcbiAqL1xuY2xhc3MgU3RvbXBIYW5kbGVyIHtcbiAgICBjb25zdHJ1Y3RvcihfY2xpZW50LCBfd2ViU29ja2V0LCBjb25maWcgPSB7fSkge1xuICAgICAgICB0aGlzLl9jbGllbnQgPSBfY2xpZW50O1xuICAgICAgICB0aGlzLl93ZWJTb2NrZXQgPSBfd2ViU29ja2V0O1xuICAgICAgICB0aGlzLl9zZXJ2ZXJGcmFtZUhhbmRsZXJzID0ge1xuICAgICAgICAgICAgLy8gW0NPTk5FQ1RFRCBGcmFtZV0oaHR0cDovL3N0b21wLmdpdGh1Yi5jb20vc3RvbXAtc3BlY2lmaWNhdGlvbi0xLjIuaHRtbCNDT05ORUNURURfRnJhbWUpXG4gICAgICAgICAgICBDT05ORUNURUQ6IGZyYW1lID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlYnVnKGBjb25uZWN0ZWQgdG8gc2VydmVyICR7ZnJhbWUuaGVhZGVycy5zZXJ2ZXJ9YCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fY29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb25uZWN0ZWRWZXJzaW9uID0gZnJhbWUuaGVhZGVycy52ZXJzaW9uO1xuICAgICAgICAgICAgICAgIC8vIFNUT01QIHZlcnNpb24gMS4yIG5lZWRzIGhlYWRlciB2YWx1ZXMgdG8gYmUgZXNjYXBlZFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jb25uZWN0ZWRWZXJzaW9uID09PSBfdmVyc2lvbnNfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzRfX1tcIlZlcnNpb25zXCJdLlYxXzIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXNjYXBlSGVhZGVyVmFsdWVzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0dXBIZWFydGJlYXQoZnJhbWUuaGVhZGVycyk7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkNvbm5lY3QoZnJhbWUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8vIFtNRVNTQUdFIEZyYW1lXShodHRwOi8vc3RvbXAuZ2l0aHViLmNvbS9zdG9tcC1zcGVjaWZpY2F0aW9uLTEuMi5odG1sI01FU1NBR0UpXG4gICAgICAgICAgICBNRVNTQUdFOiBmcmFtZSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gdGhlIGNhbGxiYWNrIGlzIHJlZ2lzdGVyZWQgd2hlbiB0aGUgY2xpZW50IGNhbGxzXG4gICAgICAgICAgICAgICAgLy8gYHN1YnNjcmliZSgpYC5cbiAgICAgICAgICAgICAgICAvLyBJZiB0aGVyZSBpcyBubyByZWdpc3RlcmVkIHN1YnNjcmlwdGlvbiBmb3IgdGhlIHJlY2VpdmVkIG1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgLy8gdGhlIGRlZmF1bHQgYG9uVW5oYW5kbGVkTWVzc2FnZWAgY2FsbGJhY2sgaXMgdXNlZCB0aGF0IHRoZSBjbGllbnQgY2FuIHNldC5cbiAgICAgICAgICAgICAgICAvLyBUaGlzIGlzIHVzZWZ1bCBmb3Igc3Vic2NyaXB0aW9ucyB0aGF0IGFyZSBhdXRvbWF0aWNhbGx5IGNyZWF0ZWRcbiAgICAgICAgICAgICAgICAvLyBvbiB0aGUgYnJvd3NlciBzaWRlIChlLmcuIFtSYWJiaXRNUSdzIHRlbXBvcmFyeVxuICAgICAgICAgICAgICAgIC8vIHF1ZXVlc10oaHR0cDovL3d3dy5yYWJiaXRtcS5jb20vc3RvbXAuaHRtbCkpLlxuICAgICAgICAgICAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IGZyYW1lLmhlYWRlcnMuc3Vic2NyaXB0aW9uO1xuICAgICAgICAgICAgICAgIGNvbnN0IG9uUmVjZWl2ZSA9IHRoaXMuX3N1YnNjcmlwdGlvbnNbc3Vic2NyaXB0aW9uXSB8fCB0aGlzLm9uVW5oYW5kbGVkTWVzc2FnZTtcbiAgICAgICAgICAgICAgICAvLyBibGVzcyB0aGUgZnJhbWUgdG8gYmUgYSBNZXNzYWdlXG4gICAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGZyYW1lO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNsaWVudCA9IHRoaXM7XG4gICAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZUlkID0gdGhpcy5fY29ubmVjdGVkVmVyc2lvbiA9PT0gX3ZlcnNpb25zX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV80X19bXCJWZXJzaW9uc1wiXS5WMV8yXG4gICAgICAgICAgICAgICAgICAgID8gbWVzc2FnZS5oZWFkZXJzLmFja1xuICAgICAgICAgICAgICAgICAgICA6IG1lc3NhZ2UuaGVhZGVyc1snbWVzc2FnZS1pZCddO1xuICAgICAgICAgICAgICAgIC8vIGFkZCBgYWNrKClgIGFuZCBgbmFjaygpYCBtZXRob2RzIGRpcmVjdGx5IHRvIHRoZSByZXR1cm5lZCBmcmFtZVxuICAgICAgICAgICAgICAgIC8vIHNvIHRoYXQgYSBzaW1wbGUgY2FsbCB0byBgbWVzc2FnZS5hY2soKWAgY2FuIGFja25vd2xlZGdlIHRoZSBtZXNzYWdlLlxuICAgICAgICAgICAgICAgIG1lc3NhZ2UuYWNrID0gKGhlYWRlcnMgPSB7fSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2xpZW50LmFjayhtZXNzYWdlSWQsIHN1YnNjcmlwdGlvbiwgaGVhZGVycyk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBtZXNzYWdlLm5hY2sgPSAoaGVhZGVycyA9IHt9KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjbGllbnQubmFjayhtZXNzYWdlSWQsIHN1YnNjcmlwdGlvbiwgaGVhZGVycyk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBvblJlY2VpdmUobWVzc2FnZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLy8gW1JFQ0VJUFQgRnJhbWVdKGh0dHA6Ly9zdG9tcC5naXRodWIuY29tL3N0b21wLXNwZWNpZmljYXRpb24tMS4yLmh0bWwjUkVDRUlQVClcbiAgICAgICAgICAgIFJFQ0VJUFQ6IGZyYW1lID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBjYWxsYmFjayA9IHRoaXMuX3JlY2VpcHRXYXRjaGVyc1tmcmFtZS5oZWFkZXJzWydyZWNlaXB0LWlkJ11dO1xuICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhmcmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNlcnZlciB3aWxsIGFja25vd2xlZGdlIG9ubHkgb25jZSwgcmVtb3ZlIHRoZSBjYWxsYmFja1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fcmVjZWlwdFdhdGNoZXJzW2ZyYW1lLmhlYWRlcnNbJ3JlY2VpcHQtaWQnXV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uVW5oYW5kbGVkUmVjZWlwdChmcmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8vIFtFUlJPUiBGcmFtZV0oaHR0cDovL3N0b21wLmdpdGh1Yi5jb20vc3RvbXAtc3BlY2lmaWNhdGlvbi0xLjIuaHRtbCNFUlJPUilcbiAgICAgICAgICAgIEVSUk9SOiBmcmFtZSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5vblN0b21wRXJyb3IoZnJhbWUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgLy8gdXNlZCB0byBpbmRleCBzdWJzY3JpYmVyc1xuICAgICAgICB0aGlzLl9jb3VudGVyID0gMDtcbiAgICAgICAgLy8gc3Vic2NyaXB0aW9uIGNhbGxiYWNrcyBpbmRleGVkIGJ5IHN1YnNjcmliZXIncyBJRFxuICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb25zID0ge307XG4gICAgICAgIC8vIHJlY2VpcHQtd2F0Y2hlcnMgaW5kZXhlZCBieSByZWNlaXB0cy1pZHNcbiAgICAgICAgdGhpcy5fcmVjZWlwdFdhdGNoZXJzID0ge307XG4gICAgICAgIHRoaXMuX3BhcnRpYWxEYXRhID0gJyc7XG4gICAgICAgIHRoaXMuX2VzY2FwZUhlYWRlclZhbHVlcyA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9sYXN0U2VydmVyQWN0aXZpdHlUUyA9IERhdGUubm93KCk7XG4gICAgICAgIHRoaXMuY29uZmlndXJlKGNvbmZpZyk7XG4gICAgfVxuICAgIGdldCBjb25uZWN0ZWRWZXJzaW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY29ubmVjdGVkVmVyc2lvbjtcbiAgICB9XG4gICAgZ2V0IGNvbm5lY3RlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Nvbm5lY3RlZDtcbiAgICB9XG4gICAgY29uZmlndXJlKGNvbmYpIHtcbiAgICAgICAgLy8gYnVsayBhc3NpZ24gYWxsIHByb3BlcnRpZXMgdG8gdGhpc1xuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIGNvbmYpO1xuICAgIH1cbiAgICBzdGFydCgpIHtcbiAgICAgICAgY29uc3QgcGFyc2VyID0gbmV3IF9wYXJzZXJfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzJfX1tcIlBhcnNlclwiXShcbiAgICAgICAgLy8gT24gRnJhbWVcbiAgICAgICAgcmF3RnJhbWUgPT4ge1xuICAgICAgICAgICAgY29uc3QgZnJhbWUgPSBfZnJhbWVfaW1wbF9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMV9fW1wiRnJhbWVJbXBsXCJdLmZyb21SYXdGcmFtZShyYXdGcmFtZSwgdGhpcy5fZXNjYXBlSGVhZGVyVmFsdWVzKTtcbiAgICAgICAgICAgIC8vIGlmIHRoaXMubG9nUmF3Q29tbXVuaWNhdGlvbiBpcyBzZXQsIHRoZSByYXdDaHVuayBpcyBsb2dnZWQgYXQgdGhpcy5fd2ViU29ja2V0Lm9ubWVzc2FnZVxuICAgICAgICAgICAgaWYgKCF0aGlzLmxvZ1Jhd0NvbW11bmljYXRpb24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlYnVnKGA8PDwgJHtmcmFtZX1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHNlcnZlckZyYW1lSGFuZGxlciA9IHRoaXMuX3NlcnZlckZyYW1lSGFuZGxlcnNbZnJhbWUuY29tbWFuZF0gfHwgdGhpcy5vblVuaGFuZGxlZEZyYW1lO1xuICAgICAgICAgICAgc2VydmVyRnJhbWVIYW5kbGVyKGZyYW1lKTtcbiAgICAgICAgfSwgXG4gICAgICAgIC8vIE9uIEluY29taW5nIFBpbmdcbiAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5kZWJ1ZygnPDw8IFBPTkcnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX3dlYlNvY2tldC5vbm1lc3NhZ2UgPSAoZXZ0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRlYnVnKCdSZWNlaXZlZCBkYXRhJyk7XG4gICAgICAgICAgICB0aGlzLl9sYXN0U2VydmVyQWN0aXZpdHlUUyA9IERhdGUubm93KCk7XG4gICAgICAgICAgICBpZiAodGhpcy5sb2dSYXdDb21tdW5pY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmF3Q2h1bmtBc1N0cmluZyA9IGV2dC5kYXRhIGluc3RhbmNlb2YgQXJyYXlCdWZmZXJcbiAgICAgICAgICAgICAgICAgICAgPyBuZXcgVGV4dERlY29kZXIoKS5kZWNvZGUoZXZ0LmRhdGEpXG4gICAgICAgICAgICAgICAgICAgIDogZXZ0LmRhdGE7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgPDw8ICR7cmF3Q2h1bmtBc1N0cmluZ31gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBhcnNlci5wYXJzZUNodW5rKGV2dC5kYXRhLCB0aGlzLmFwcGVuZE1pc3NpbmdOVUxMb25JbmNvbWluZyk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX29uY2xvc2UgPSAoY2xvc2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgQ29ubmVjdGlvbiBjbG9zZWQgdG8gJHt0aGlzLl9jbGllbnQuYnJva2VyVVJMfWApO1xuICAgICAgICAgICAgdGhpcy5fY2xlYW5VcCgpO1xuICAgICAgICAgICAgdGhpcy5vbldlYlNvY2tldENsb3NlKGNsb3NlRXZlbnQpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLl93ZWJTb2NrZXQub25jbG9zZSA9IHRoaXMuX29uY2xvc2U7XG4gICAgICAgIHRoaXMuX3dlYlNvY2tldC5vbmVycm9yID0gKGVycm9yRXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMub25XZWJTb2NrZXRFcnJvcihlcnJvckV2ZW50KTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fd2ViU29ja2V0Lm9ub3BlbiA9ICgpID0+IHtcbiAgICAgICAgICAgIC8vIENsb25lIGJlZm9yZSB1cGRhdGluZ1xuICAgICAgICAgICAgY29uc3QgY29ubmVjdEhlYWRlcnMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmNvbm5lY3RIZWFkZXJzKTtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoJ1dlYiBTb2NrZXQgT3BlbmVkLi4uJyk7XG4gICAgICAgICAgICBjb25uZWN0SGVhZGVyc1snYWNjZXB0LXZlcnNpb24nXSA9IHRoaXMuc3RvbXBWZXJzaW9ucy5zdXBwb3J0ZWRWZXJzaW9ucygpO1xuICAgICAgICAgICAgY29ubmVjdEhlYWRlcnNbJ2hlYXJ0LWJlYXQnXSA9IFtcbiAgICAgICAgICAgICAgICB0aGlzLmhlYXJ0YmVhdE91dGdvaW5nLFxuICAgICAgICAgICAgICAgIHRoaXMuaGVhcnRiZWF0SW5jb21pbmcsXG4gICAgICAgICAgICBdLmpvaW4oJywnKTtcbiAgICAgICAgICAgIHRoaXMuX3RyYW5zbWl0KHsgY29tbWFuZDogJ0NPTk5FQ1QnLCBoZWFkZXJzOiBjb25uZWN0SGVhZGVycyB9KTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgX3NldHVwSGVhcnRiZWF0KGhlYWRlcnMpIHtcbiAgICAgICAgaWYgKGhlYWRlcnMudmVyc2lvbiAhPT0gX3ZlcnNpb25zX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV80X19bXCJWZXJzaW9uc1wiXS5WMV8xICYmXG4gICAgICAgICAgICBoZWFkZXJzLnZlcnNpb24gIT09IF92ZXJzaW9uc19fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfNF9fW1wiVmVyc2lvbnNcIl0uVjFfMikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIEl0IGlzIHZhbGlkIGZvciB0aGUgc2VydmVyIHRvIG5vdCBzZW5kIHRoaXMgaGVhZGVyXG4gICAgICAgIC8vIGh0dHBzOi8vc3RvbXAuZ2l0aHViLmlvL3N0b21wLXNwZWNpZmljYXRpb24tMS4yLmh0bWwjSGVhcnQtYmVhdGluZ1xuICAgICAgICBpZiAoIWhlYWRlcnNbJ2hlYXJ0LWJlYXQnXSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIGhlYXJ0LWJlYXQgaGVhZGVyIHJlY2VpdmVkIGZyb20gdGhlIHNlcnZlciBsb29rcyBsaWtlOlxuICAgICAgICAvL1xuICAgICAgICAvLyAgICAgaGVhcnQtYmVhdDogc3gsIHN5XG4gICAgICAgIGNvbnN0IFtzZXJ2ZXJPdXRnb2luZywgc2VydmVySW5jb21pbmddID0gaGVhZGVyc1snaGVhcnQtYmVhdCddXG4gICAgICAgICAgICAuc3BsaXQoJywnKVxuICAgICAgICAgICAgLm1hcCgodikgPT4gcGFyc2VJbnQodiwgMTApKTtcbiAgICAgICAgaWYgKHRoaXMuaGVhcnRiZWF0T3V0Z29pbmcgIT09IDAgJiYgc2VydmVySW5jb21pbmcgIT09IDApIHtcbiAgICAgICAgICAgIGNvbnN0IHR0bCA9IE1hdGgubWF4KHRoaXMuaGVhcnRiZWF0T3V0Z29pbmcsIHNlcnZlckluY29taW5nKTtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoYHNlbmQgUElORyBldmVyeSAke3R0bH1tc2ApO1xuICAgICAgICAgICAgdGhpcy5fcGluZ2VyID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl93ZWJTb2NrZXQucmVhZHlTdGF0ZSA9PT0gX3R5cGVzX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8zX19bXCJTdG9tcFNvY2tldFN0YXRlXCJdLk9QRU4pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fd2ViU29ja2V0LnNlbmQoX2J5dGVfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfX1tcIkJZVEVcIl0uTEYpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlYnVnKCc+Pj4gUElORycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHR0bCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuaGVhcnRiZWF0SW5jb21pbmcgIT09IDAgJiYgc2VydmVyT3V0Z29pbmcgIT09IDApIHtcbiAgICAgICAgICAgIGNvbnN0IHR0bCA9IE1hdGgubWF4KHRoaXMuaGVhcnRiZWF0SW5jb21pbmcsIHNlcnZlck91dGdvaW5nKTtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoYGNoZWNrIFBPTkcgZXZlcnkgJHt0dGx9bXNgKTtcbiAgICAgICAgICAgIHRoaXMuX3BvbmdlciA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBkZWx0YSA9IERhdGUubm93KCkgLSB0aGlzLl9sYXN0U2VydmVyQWN0aXZpdHlUUztcbiAgICAgICAgICAgICAgICAvLyBXZSB3YWl0IHR3aWNlIHRoZSBUVEwgdG8gYmUgZmxleGlibGUgb24gd2luZG93J3Mgc2V0SW50ZXJ2YWwgY2FsbHNcbiAgICAgICAgICAgICAgICBpZiAoZGVsdGEgPiB0dGwgKiAyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVidWcoYGRpZCBub3QgcmVjZWl2ZSBzZXJ2ZXIgYWN0aXZpdHkgZm9yIHRoZSBsYXN0ICR7ZGVsdGF9bXNgKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2xvc2VPckRpc2NhcmRXZWJzb2NrZXQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB0dGwpO1xuICAgICAgICB9XG4gICAgfVxuICAgIF9jbG9zZU9yRGlzY2FyZFdlYnNvY2tldCgpIHtcbiAgICAgICAgaWYgKHRoaXMuZGlzY2FyZFdlYnNvY2tldE9uQ29tbUZhaWx1cmUpIHtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoJ0Rpc2NhcmRpbmcgd2Vic29ja2V0LCB0aGUgdW5kZXJseWluZyBzb2NrZXQgbWF5IGxpbmdlciBmb3IgYSB3aGlsZScpO1xuICAgICAgICAgICAgdGhpcy5fZGlzY2FyZFdlYnNvY2tldCgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kZWJ1ZygnSXNzdWluZyBjbG9zZSBvbiB0aGUgd2Vic29ja2V0Jyk7XG4gICAgICAgICAgICB0aGlzLl9jbG9zZVdlYnNvY2tldCgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZvcmNlRGlzY29ubmVjdCgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3dlYlNvY2tldCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3dlYlNvY2tldC5yZWFkeVN0YXRlID09PSBfdHlwZXNfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzNfX1tcIlN0b21wU29ja2V0U3RhdGVcIl0uQ09OTkVDVElORyB8fFxuICAgICAgICAgICAgICAgIHRoaXMuX3dlYlNvY2tldC5yZWFkeVN0YXRlID09PSBfdHlwZXNfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzNfX1tcIlN0b21wU29ja2V0U3RhdGVcIl0uT1BFTikge1xuICAgICAgICAgICAgICAgIHRoaXMuX2Nsb3NlT3JEaXNjYXJkV2Vic29ja2V0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgX2Nsb3NlV2Vic29ja2V0KCkge1xuICAgICAgICB0aGlzLl93ZWJTb2NrZXQub25tZXNzYWdlID0gKCkgPT4geyB9OyAvLyBpZ25vcmUgbWVzc2FnZXNcbiAgICAgICAgdGhpcy5fd2ViU29ja2V0LmNsb3NlKCk7XG4gICAgfVxuICAgIF9kaXNjYXJkV2Vic29ja2V0KCkge1xuICAgICAgICBpZiAoIXRoaXMuX3dlYlNvY2tldC50ZXJtaW5hdGUpIHtcbiAgICAgICAgICAgIE9iamVjdChfYXVnbWVudF93ZWJzb2NrZXRfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzVfX1tcImF1Z21lbnRXZWJzb2NrZXRcIl0pKHRoaXMuX3dlYlNvY2tldCwgKG1zZykgPT4gdGhpcy5kZWJ1Zyhtc2cpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl93ZWJTb2NrZXQudGVybWluYXRlKCk7XG4gICAgfVxuICAgIF90cmFuc21pdChwYXJhbXMpIHtcbiAgICAgICAgY29uc3QgeyBjb21tYW5kLCBoZWFkZXJzLCBib2R5LCBiaW5hcnlCb2R5LCBza2lwQ29udGVudExlbmd0aEhlYWRlciB9ID0gcGFyYW1zO1xuICAgICAgICBjb25zdCBmcmFtZSA9IG5ldyBfZnJhbWVfaW1wbF9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMV9fW1wiRnJhbWVJbXBsXCJdKHtcbiAgICAgICAgICAgIGNvbW1hbmQsXG4gICAgICAgICAgICBoZWFkZXJzLFxuICAgICAgICAgICAgYm9keSxcbiAgICAgICAgICAgIGJpbmFyeUJvZHksXG4gICAgICAgICAgICBlc2NhcGVIZWFkZXJWYWx1ZXM6IHRoaXMuX2VzY2FwZUhlYWRlclZhbHVlcyxcbiAgICAgICAgICAgIHNraXBDb250ZW50TGVuZ3RoSGVhZGVyLFxuICAgICAgICB9KTtcbiAgICAgICAgbGV0IHJhd0NodW5rID0gZnJhbWUuc2VyaWFsaXplKCk7XG4gICAgICAgIGlmICh0aGlzLmxvZ1Jhd0NvbW11bmljYXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoYD4+PiAke3Jhd0NodW5rfWApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgPj4+ICR7ZnJhbWV9YCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZm9yY2VCaW5hcnlXU0ZyYW1lcyAmJiB0eXBlb2YgcmF3Q2h1bmsgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByYXdDaHVuayA9IG5ldyBUZXh0RW5jb2RlcigpLmVuY29kZShyYXdDaHVuayk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiByYXdDaHVuayAhPT0gJ3N0cmluZycgfHwgIXRoaXMuc3BsaXRMYXJnZUZyYW1lcykge1xuICAgICAgICAgICAgdGhpcy5fd2ViU29ja2V0LnNlbmQocmF3Q2h1bmspO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IG91dCA9IHJhd0NodW5rO1xuICAgICAgICAgICAgd2hpbGUgKG91dC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2h1bmsgPSBvdXQuc3Vic3RyaW5nKDAsIHRoaXMubWF4V2ViU29ja2V0Q2h1bmtTaXplKTtcbiAgICAgICAgICAgICAgICBvdXQgPSBvdXQuc3Vic3RyaW5nKHRoaXMubWF4V2ViU29ja2V0Q2h1bmtTaXplKTtcbiAgICAgICAgICAgICAgICB0aGlzLl93ZWJTb2NrZXQuc2VuZChjaHVuayk7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgY2h1bmsgc2VudCA9ICR7Y2h1bmsubGVuZ3RofSwgcmVtYWluaW5nID0gJHtvdXQubGVuZ3RofWApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGRpc3Bvc2UoKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbm5lY3RlZCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAvLyBjbG9uZSBiZWZvcmUgdXBkYXRpbmdcbiAgICAgICAgICAgICAgICBjb25zdCBkaXNjb25uZWN0SGVhZGVycyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGlzY29ubmVjdEhlYWRlcnMpO1xuICAgICAgICAgICAgICAgIGlmICghZGlzY29ubmVjdEhlYWRlcnMucmVjZWlwdCkge1xuICAgICAgICAgICAgICAgICAgICBkaXNjb25uZWN0SGVhZGVycy5yZWNlaXB0ID0gYGNsb3NlLSR7dGhpcy5fY291bnRlcisrfWA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMud2F0Y2hGb3JSZWNlaXB0KGRpc2Nvbm5lY3RIZWFkZXJzLnJlY2VpcHQsIGZyYW1lID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2xvc2VXZWJzb2NrZXQoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2xlYW5VcCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uRGlzY29ubmVjdChmcmFtZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fdHJhbnNtaXQoeyBjb21tYW5kOiAnRElTQ09OTkVDVCcsIGhlYWRlcnM6IGRpc2Nvbm5lY3RIZWFkZXJzIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgSWdub3JpbmcgZXJyb3IgZHVyaW5nIGRpc2Nvbm5lY3QgJHtlcnJvcn1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl93ZWJTb2NrZXQucmVhZHlTdGF0ZSA9PT0gX3R5cGVzX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8zX19bXCJTdG9tcFNvY2tldFN0YXRlXCJdLkNPTk5FQ1RJTkcgfHxcbiAgICAgICAgICAgICAgICB0aGlzLl93ZWJTb2NrZXQucmVhZHlTdGF0ZSA9PT0gX3R5cGVzX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8zX19bXCJTdG9tcFNvY2tldFN0YXRlXCJdLk9QRU4pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jbG9zZVdlYnNvY2tldCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIF9jbGVhblVwKCkge1xuICAgICAgICB0aGlzLl9jb25uZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMuX3Bpbmdlcikge1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLl9waW5nZXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9wb25nZXIpIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5fcG9uZ2VyKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwdWJsaXNoKHBhcmFtcykge1xuICAgICAgICBjb25zdCB7IGRlc3RpbmF0aW9uLCBoZWFkZXJzLCBib2R5LCBiaW5hcnlCb2R5LCBza2lwQ29udGVudExlbmd0aEhlYWRlciB9ID0gcGFyYW1zO1xuICAgICAgICBjb25zdCBoZHJzID0gT2JqZWN0LmFzc2lnbih7IGRlc3RpbmF0aW9uIH0sIGhlYWRlcnMpO1xuICAgICAgICB0aGlzLl90cmFuc21pdCh7XG4gICAgICAgICAgICBjb21tYW5kOiAnU0VORCcsXG4gICAgICAgICAgICBoZWFkZXJzOiBoZHJzLFxuICAgICAgICAgICAgYm9keSxcbiAgICAgICAgICAgIGJpbmFyeUJvZHksXG4gICAgICAgICAgICBza2lwQ29udGVudExlbmd0aEhlYWRlcixcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHdhdGNoRm9yUmVjZWlwdChyZWNlaXB0SWQsIGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuX3JlY2VpcHRXYXRjaGVyc1tyZWNlaXB0SWRdID0gY2FsbGJhY2s7XG4gICAgfVxuICAgIHN1YnNjcmliZShkZXN0aW5hdGlvbiwgY2FsbGJhY2ssIGhlYWRlcnMgPSB7fSkge1xuICAgICAgICBoZWFkZXJzID0gT2JqZWN0LmFzc2lnbih7fSwgaGVhZGVycyk7XG4gICAgICAgIGlmICghaGVhZGVycy5pZCkge1xuICAgICAgICAgICAgaGVhZGVycy5pZCA9IGBzdWItJHt0aGlzLl9jb3VudGVyKyt9YDtcbiAgICAgICAgfVxuICAgICAgICBoZWFkZXJzLmRlc3RpbmF0aW9uID0gZGVzdGluYXRpb247XG4gICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnNbaGVhZGVycy5pZF0gPSBjYWxsYmFjaztcbiAgICAgICAgdGhpcy5fdHJhbnNtaXQoeyBjb21tYW5kOiAnU1VCU0NSSUJFJywgaGVhZGVycyB9KTtcbiAgICAgICAgY29uc3QgY2xpZW50ID0gdGhpcztcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlkOiBoZWFkZXJzLmlkLFxuICAgICAgICAgICAgdW5zdWJzY3JpYmUoaGRycykge1xuICAgICAgICAgICAgICAgIHJldHVybiBjbGllbnQudW5zdWJzY3JpYmUoaGVhZGVycy5pZCwgaGRycyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgIH1cbiAgICB1bnN1YnNjcmliZShpZCwgaGVhZGVycyA9IHt9KSB7XG4gICAgICAgIGhlYWRlcnMgPSBPYmplY3QuYXNzaWduKHt9LCBoZWFkZXJzKTtcbiAgICAgICAgZGVsZXRlIHRoaXMuX3N1YnNjcmlwdGlvbnNbaWRdO1xuICAgICAgICBoZWFkZXJzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMuX3RyYW5zbWl0KHsgY29tbWFuZDogJ1VOU1VCU0NSSUJFJywgaGVhZGVycyB9KTtcbiAgICB9XG4gICAgYmVnaW4odHJhbnNhY3Rpb25JZCkge1xuICAgICAgICBjb25zdCB0eElkID0gdHJhbnNhY3Rpb25JZCB8fCBgdHgtJHt0aGlzLl9jb3VudGVyKyt9YDtcbiAgICAgICAgdGhpcy5fdHJhbnNtaXQoe1xuICAgICAgICAgICAgY29tbWFuZDogJ0JFR0lOJyxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICB0cmFuc2FjdGlvbjogdHhJZCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBjbGllbnQgPSB0aGlzO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaWQ6IHR4SWQsXG4gICAgICAgICAgICBjb21taXQoKSB7XG4gICAgICAgICAgICAgICAgY2xpZW50LmNvbW1pdCh0eElkKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhYm9ydCgpIHtcbiAgICAgICAgICAgICAgICBjbGllbnQuYWJvcnQodHhJZCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgIH1cbiAgICBjb21taXQodHJhbnNhY3Rpb25JZCkge1xuICAgICAgICB0aGlzLl90cmFuc21pdCh7XG4gICAgICAgICAgICBjb21tYW5kOiAnQ09NTUlUJyxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICB0cmFuc2FjdGlvbjogdHJhbnNhY3Rpb25JZCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBhYm9ydCh0cmFuc2FjdGlvbklkKSB7XG4gICAgICAgIHRoaXMuX3RyYW5zbWl0KHtcbiAgICAgICAgICAgIGNvbW1hbmQ6ICdBQk9SVCcsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgdHJhbnNhY3Rpb246IHRyYW5zYWN0aW9uSWQsXG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgYWNrKG1lc3NhZ2VJZCwgc3Vic2NyaXB0aW9uSWQsIGhlYWRlcnMgPSB7fSkge1xuICAgICAgICBoZWFkZXJzID0gT2JqZWN0LmFzc2lnbih7fSwgaGVhZGVycyk7XG4gICAgICAgIGlmICh0aGlzLl9jb25uZWN0ZWRWZXJzaW9uID09PSBfdmVyc2lvbnNfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzRfX1tcIlZlcnNpb25zXCJdLlYxXzIpIHtcbiAgICAgICAgICAgIGhlYWRlcnMuaWQgPSBtZXNzYWdlSWQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBoZWFkZXJzWydtZXNzYWdlLWlkJ10gPSBtZXNzYWdlSWQ7XG4gICAgICAgIH1cbiAgICAgICAgaGVhZGVycy5zdWJzY3JpcHRpb24gPSBzdWJzY3JpcHRpb25JZDtcbiAgICAgICAgdGhpcy5fdHJhbnNtaXQoeyBjb21tYW5kOiAnQUNLJywgaGVhZGVycyB9KTtcbiAgICB9XG4gICAgbmFjayhtZXNzYWdlSWQsIHN1YnNjcmlwdGlvbklkLCBoZWFkZXJzID0ge30pIHtcbiAgICAgICAgaGVhZGVycyA9IE9iamVjdC5hc3NpZ24oe30sIGhlYWRlcnMpO1xuICAgICAgICBpZiAodGhpcy5fY29ubmVjdGVkVmVyc2lvbiA9PT0gX3ZlcnNpb25zX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV80X19bXCJWZXJzaW9uc1wiXS5WMV8yKSB7XG4gICAgICAgICAgICBoZWFkZXJzLmlkID0gbWVzc2FnZUlkO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaGVhZGVyc1snbWVzc2FnZS1pZCddID0gbWVzc2FnZUlkO1xuICAgICAgICB9XG4gICAgICAgIGhlYWRlcnMuc3Vic2NyaXB0aW9uID0gc3Vic2NyaXB0aW9uSWQ7XG4gICAgICAgIHJldHVybiB0aGlzLl90cmFuc21pdCh7IGNvbW1hbmQ6ICdOQUNLJywgaGVhZGVycyB9KTtcbiAgICB9XG59XG5cblxuLyoqKi8gfSksXG5cbi8qKiovIFwiLi9zcmMvc3RvbXAtaGVhZGVycy50c1wiOlxuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vc3JjL3N0b21wLWhlYWRlcnMudHMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qISBleHBvcnRzIHByb3ZpZGVkOiBTdG9tcEhlYWRlcnMgKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIF9fd2VicGFja19leHBvcnRzX18sIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXCJ1c2Ugc3RyaWN0XCI7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIoX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4vKiBoYXJtb255IGV4cG9ydCAoYmluZGluZykgKi8gX193ZWJwYWNrX3JlcXVpcmVfXy5kKF9fd2VicGFja19leHBvcnRzX18sIFwiU3RvbXBIZWFkZXJzXCIsIGZ1bmN0aW9uKCkgeyByZXR1cm4gU3RvbXBIZWFkZXJzOyB9KTtcbi8qKlxuICogU1RPTVAgaGVhZGVycy4gTWFueSBmdW5jdGlvbnMgY2FsbHMgd2lsbCBhY2NlcHQgaGVhZGVycyBhcyBwYXJhbWV0ZXJzLlxuICogVGhlIGhlYWRlcnMgc2VudCBieSBCcm9rZXIgd2lsbCBiZSBhdmFpbGFibGUgYXMgW0lGcmFtZSNoZWFkZXJzXXtAbGluayBJRnJhbWUjaGVhZGVyc30uXG4gKlxuICogYGtleWAgYW5kIGB2YWx1ZWAgbXVzdCBiZSB2YWxpZCBzdHJpbmdzLlxuICogSW4gYWRkaXRpb24sIGBrZXlgIG11c3Qgbm90IGNvbnRhaW4gYENSYCwgYExGYCwgb3IgYDpgLlxuICpcbiAqIFBhcnQgb2YgYEBzdG9tcC9zdG9tcGpzYC5cbiAqL1xuY2xhc3MgU3RvbXBIZWFkZXJzIHtcbn1cblxuXG4vKioqLyB9KSxcblxuLyoqKi8gXCIuL3NyYy9zdG9tcC1zdWJzY3JpcHRpb24udHNcIjpcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vc3JjL3N0b21wLXN1YnNjcmlwdGlvbi50cyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKiEgZXhwb3J0cyBwcm92aWRlZDogU3RvbXBTdWJzY3JpcHRpb24gKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIF9fd2VicGFja19leHBvcnRzX18sIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXCJ1c2Ugc3RyaWN0XCI7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIoX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4vKiBoYXJtb255IGV4cG9ydCAoYmluZGluZykgKi8gX193ZWJwYWNrX3JlcXVpcmVfXy5kKF9fd2VicGFja19leHBvcnRzX18sIFwiU3RvbXBTdWJzY3JpcHRpb25cIiwgZnVuY3Rpb24oKSB7IHJldHVybiBTdG9tcFN1YnNjcmlwdGlvbjsgfSk7XG4vKipcbiAqIENhbGwgW0NsaWVudCNzdWJzY3JpYmVde0BsaW5rIENsaWVudCNzdWJzY3JpYmV9IHRvIGNyZWF0ZSBhIFN0b21wU3Vic2NyaXB0aW9uLlxuICpcbiAqIFBhcnQgb2YgYEBzdG9tcC9zdG9tcGpzYC5cbiAqL1xuY2xhc3MgU3RvbXBTdWJzY3JpcHRpb24ge1xufVxuXG5cbi8qKiovIH0pLFxuXG4vKioqLyBcIi4vc3JjL3R5cGVzLnRzXCI6XG4vKiEqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vc3JjL3R5cGVzLnRzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqL1xuLyohIGV4cG9ydHMgcHJvdmlkZWQ6IFN0b21wU29ja2V0U3RhdGUsIEFjdGl2YXRpb25TdGF0ZSAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgX193ZWJwYWNrX2V4cG9ydHNfXywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cInVzZSBzdHJpY3RcIjtcbl9fd2VicGFja19yZXF1aXJlX18ucihfX3dlYnBhY2tfZXhwb3J0c19fKTtcbi8qIGhhcm1vbnkgZXhwb3J0IChiaW5kaW5nKSAqLyBfX3dlYnBhY2tfcmVxdWlyZV9fLmQoX193ZWJwYWNrX2V4cG9ydHNfXywgXCJTdG9tcFNvY2tldFN0YXRlXCIsIGZ1bmN0aW9uKCkgeyByZXR1cm4gU3RvbXBTb2NrZXRTdGF0ZTsgfSk7XG4vKiBoYXJtb255IGV4cG9ydCAoYmluZGluZykgKi8gX193ZWJwYWNrX3JlcXVpcmVfXy5kKF9fd2VicGFja19leHBvcnRzX18sIFwiQWN0aXZhdGlvblN0YXRlXCIsIGZ1bmN0aW9uKCkgeyByZXR1cm4gQWN0aXZhdGlvblN0YXRlOyB9KTtcbi8qKlxuICogUG9zc2libGUgc3RhdGVzIGZvciB0aGUgSVN0b21wU29ja2V0XG4gKi9cbnZhciBTdG9tcFNvY2tldFN0YXRlO1xuKGZ1bmN0aW9uIChTdG9tcFNvY2tldFN0YXRlKSB7XG4gICAgU3RvbXBTb2NrZXRTdGF0ZVtTdG9tcFNvY2tldFN0YXRlW1wiQ09OTkVDVElOR1wiXSA9IDBdID0gXCJDT05ORUNUSU5HXCI7XG4gICAgU3RvbXBTb2NrZXRTdGF0ZVtTdG9tcFNvY2tldFN0YXRlW1wiT1BFTlwiXSA9IDFdID0gXCJPUEVOXCI7XG4gICAgU3RvbXBTb2NrZXRTdGF0ZVtTdG9tcFNvY2tldFN0YXRlW1wiQ0xPU0lOR1wiXSA9IDJdID0gXCJDTE9TSU5HXCI7XG4gICAgU3RvbXBTb2NrZXRTdGF0ZVtTdG9tcFNvY2tldFN0YXRlW1wiQ0xPU0VEXCJdID0gM10gPSBcIkNMT1NFRFwiO1xufSkoU3RvbXBTb2NrZXRTdGF0ZSB8fCAoU3RvbXBTb2NrZXRTdGF0ZSA9IHt9KSk7XG4vKipcbiAqIFBvc3NpYmxlIGFjdGl2YXRpb24gc3RhdGVcbiAqL1xudmFyIEFjdGl2YXRpb25TdGF0ZTtcbihmdW5jdGlvbiAoQWN0aXZhdGlvblN0YXRlKSB7XG4gICAgQWN0aXZhdGlvblN0YXRlW0FjdGl2YXRpb25TdGF0ZVtcIkFDVElWRVwiXSA9IDBdID0gXCJBQ1RJVkVcIjtcbiAgICBBY3RpdmF0aW9uU3RhdGVbQWN0aXZhdGlvblN0YXRlW1wiREVBQ1RJVkFUSU5HXCJdID0gMV0gPSBcIkRFQUNUSVZBVElOR1wiO1xuICAgIEFjdGl2YXRpb25TdGF0ZVtBY3RpdmF0aW9uU3RhdGVbXCJJTkFDVElWRVwiXSA9IDJdID0gXCJJTkFDVElWRVwiO1xufSkoQWN0aXZhdGlvblN0YXRlIHx8IChBY3RpdmF0aW9uU3RhdGUgPSB7fSkpO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyBcIi4vc3JjL3ZlcnNpb25zLnRzXCI6XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vc3JjL3ZlcnNpb25zLnRzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyohIGV4cG9ydHMgcHJvdmlkZWQ6IFZlcnNpb25zICovXG4vKioqLyAoZnVuY3Rpb24obW9kdWxlLCBfX3dlYnBhY2tfZXhwb3J0c19fLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblwidXNlIHN0cmljdFwiO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yKF9fd2VicGFja19leHBvcnRzX18pO1xuLyogaGFybW9ueSBleHBvcnQgKGJpbmRpbmcpICovIF9fd2VicGFja19yZXF1aXJlX18uZChfX3dlYnBhY2tfZXhwb3J0c19fLCBcIlZlcnNpb25zXCIsIGZ1bmN0aW9uKCkgeyByZXR1cm4gVmVyc2lvbnM7IH0pO1xuLyoqXG4gKiBTdXBwb3J0ZWQgU1RPTVAgdmVyc2lvbnNcbiAqXG4gKiBQYXJ0IG9mIGBAc3RvbXAvc3RvbXBqc2AuXG4gKi9cbmNsYXNzIFZlcnNpb25zIHtcbiAgICAvKipcbiAgICAgKiBUYWtlcyBhbiBhcnJheSBvZiBzdHJpbmcgb2YgdmVyc2lvbnMsIHR5cGljYWwgZWxlbWVudHMgJzEuMCcsICcxLjEnLCBvciAnMS4yJ1xuICAgICAqXG4gICAgICogWW91IHdpbGwgYW4gaW5zdGFuY2UgaWYgdGhpcyBjbGFzcyBpZiB5b3Ugd2FudCB0byBvdmVycmlkZSBzdXBwb3J0ZWQgdmVyc2lvbnMgdG8gYmUgZGVjbGFyZWQgZHVyaW5nXG4gICAgICogU1RPTVAgaGFuZHNoYWtlLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHZlcnNpb25zKSB7XG4gICAgICAgIHRoaXMudmVyc2lvbnMgPSB2ZXJzaW9ucztcbiAgICB9XG4gICAgLyoqXG4gICAgICogVXNlZCBhcyBwYXJ0IG9mIENPTk5FQ1QgU1RPTVAgRnJhbWVcbiAgICAgKi9cbiAgICBzdXBwb3J0ZWRWZXJzaW9ucygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmVyc2lvbnMuam9pbignLCcpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBVc2VkIHdoaWxlIGNyZWF0aW5nIGEgV2ViU29ja2V0XG4gICAgICovXG4gICAgcHJvdG9jb2xWZXJzaW9ucygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmVyc2lvbnMubWFwKHggPT4gYHYke3gucmVwbGFjZSgnLicsICcnKX0uc3RvbXBgKTtcbiAgICB9XG59XG4vKipcbiAqIEluZGljYXRlcyBwcm90b2NvbCB2ZXJzaW9uIDEuMFxuICovXG5WZXJzaW9ucy5WMV8wID0gJzEuMCc7XG4vKipcbiAqIEluZGljYXRlcyBwcm90b2NvbCB2ZXJzaW9uIDEuMVxuICovXG5WZXJzaW9ucy5WMV8xID0gJzEuMSc7XG4vKipcbiAqIEluZGljYXRlcyBwcm90b2NvbCB2ZXJzaW9uIDEuMlxuICovXG5WZXJzaW9ucy5WMV8yID0gJzEuMic7XG4vKipcbiAqIEBpbnRlcm5hbFxuICovXG5WZXJzaW9ucy5kZWZhdWx0ID0gbmV3IFZlcnNpb25zKFtcbiAgICBWZXJzaW9ucy5WMV8wLFxuICAgIFZlcnNpb25zLlYxXzEsXG4gICAgVmVyc2lvbnMuVjFfMixcbl0pO1xuXG5cbi8qKiovIH0pLFxuXG4vKioqLyAwOlxuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiBtdWx0aSAuL3NyYy9pbmRleC50cyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qISBubyBzdGF0aWMgZXhwb3J0cyBmb3VuZCAqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5tb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIC9ob21lL2tkZWVwYWsvTXlXb3JrL1RlY2gvc3RvbXAvc3RvbXBqcy9zcmMvaW5kZXgudHMgKi9cIi4vc3JjL2luZGV4LnRzXCIpO1xuXG5cbi8qKiovIH0pXG5cbi8qKioqKiovIH0pO1xufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zdG9tcC51bWQuanMubWFwIiwiaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vIGltcGxlbWVudGF0aW9uIGZyb20gc3RhbmRhcmQgbm9kZS5qcyAndXRpbCcgbW9kdWxlXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgaWYgKHN1cGVyQ3Rvcikge1xuICAgICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9O1xufSBlbHNlIHtcbiAgLy8gb2xkIHNjaG9vbCBzaGltIGZvciBvbGQgYnJvd3NlcnNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBpZiAoc3VwZXJDdG9yKSB7XG4gICAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgICAgdmFyIFRlbXBDdG9yID0gZnVuY3Rpb24gKCkge31cbiAgICAgIFRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGVcbiAgICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKClcbiAgICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvclxuICAgIH1cbiAgfVxufVxuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGhhcyA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHlcbiAgLCB1bmRlZjtcblxuLyoqXG4gKiBEZWNvZGUgYSBVUkkgZW5jb2RlZCBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGlucHV0IFRoZSBVUkkgZW5jb2RlZCBzdHJpbmcuXG4gKiBAcmV0dXJucyB7U3RyaW5nfE51bGx9IFRoZSBkZWNvZGVkIHN0cmluZy5cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBkZWNvZGUoaW5wdXQpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KGlucHV0LnJlcGxhY2UoL1xcKy9nLCAnICcpKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbi8qKlxuICogQXR0ZW1wdHMgdG8gZW5jb2RlIGEgZ2l2ZW4gaW5wdXQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGlucHV0IFRoZSBzdHJpbmcgdGhhdCBuZWVkcyB0byBiZSBlbmNvZGVkLlxuICogQHJldHVybnMge1N0cmluZ3xOdWxsfSBUaGUgZW5jb2RlZCBzdHJpbmcuXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gZW5jb2RlKGlucHV0KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChpbnB1dCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG4vKipcbiAqIFNpbXBsZSBxdWVyeSBzdHJpbmcgcGFyc2VyLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBxdWVyeSBUaGUgcXVlcnkgc3RyaW5nIHRoYXQgbmVlZHMgdG8gYmUgcGFyc2VkLlxuICogQHJldHVybnMge09iamVjdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cbmZ1bmN0aW9uIHF1ZXJ5c3RyaW5nKHF1ZXJ5KSB7XG4gIHZhciBwYXJzZXIgPSAvKFtePT8jJl0rKT0/KFteJl0qKS9nXG4gICAgLCByZXN1bHQgPSB7fVxuICAgICwgcGFydDtcblxuICB3aGlsZSAocGFydCA9IHBhcnNlci5leGVjKHF1ZXJ5KSkge1xuICAgIHZhciBrZXkgPSBkZWNvZGUocGFydFsxXSlcbiAgICAgICwgdmFsdWUgPSBkZWNvZGUocGFydFsyXSk7XG5cbiAgICAvL1xuICAgIC8vIFByZXZlbnQgb3ZlcnJpZGluZyBvZiBleGlzdGluZyBwcm9wZXJ0aWVzLiBUaGlzIGVuc3VyZXMgdGhhdCBidWlsZC1pblxuICAgIC8vIG1ldGhvZHMgbGlrZSBgdG9TdHJpbmdgIG9yIF9fcHJvdG9fXyBhcmUgbm90IG92ZXJyaWRlbiBieSBtYWxpY2lvdXNcbiAgICAvLyBxdWVyeXN0cmluZ3MuXG4gICAgLy9cbiAgICAvLyBJbiB0aGUgY2FzZSBpZiBmYWlsZWQgZGVjb2RpbmcsIHdlIHdhbnQgdG8gb21pdCB0aGUga2V5L3ZhbHVlIHBhaXJzXG4gICAgLy8gZnJvbSB0aGUgcmVzdWx0LlxuICAgIC8vXG4gICAgaWYgKGtleSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gbnVsbCB8fCBrZXkgaW4gcmVzdWx0KSBjb250aW51ZTtcbiAgICByZXN1bHRba2V5XSA9IHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBUcmFuc2Zvcm0gYSBxdWVyeSBzdHJpbmcgdG8gYW4gb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogT2JqZWN0IHRoYXQgc2hvdWxkIGJlIHRyYW5zZm9ybWVkLlxuICogQHBhcmFtIHtTdHJpbmd9IHByZWZpeCBPcHRpb25hbCBwcmVmaXguXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gcXVlcnlzdHJpbmdpZnkob2JqLCBwcmVmaXgpIHtcbiAgcHJlZml4ID0gcHJlZml4IHx8ICcnO1xuXG4gIHZhciBwYWlycyA9IFtdXG4gICAgLCB2YWx1ZVxuICAgICwga2V5O1xuXG4gIC8vXG4gIC8vIE9wdGlvbmFsbHkgcHJlZml4IHdpdGggYSAnPycgaWYgbmVlZGVkXG4gIC8vXG4gIGlmICgnc3RyaW5nJyAhPT0gdHlwZW9mIHByZWZpeCkgcHJlZml4ID0gJz8nO1xuXG4gIGZvciAoa2V5IGluIG9iaikge1xuICAgIGlmIChoYXMuY2FsbChvYmosIGtleSkpIHtcbiAgICAgIHZhbHVlID0gb2JqW2tleV07XG5cbiAgICAgIC8vXG4gICAgICAvLyBFZGdlIGNhc2VzIHdoZXJlIHdlIGFjdHVhbGx5IHdhbnQgdG8gZW5jb2RlIHRoZSB2YWx1ZSB0byBhbiBlbXB0eVxuICAgICAgLy8gc3RyaW5nIGluc3RlYWQgb2YgdGhlIHN0cmluZ2lmaWVkIHZhbHVlLlxuICAgICAgLy9cbiAgICAgIGlmICghdmFsdWUgJiYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZiB8fCBpc05hTih2YWx1ZSkpKSB7XG4gICAgICAgIHZhbHVlID0gJyc7XG4gICAgICB9XG5cbiAgICAgIGtleSA9IGVuY29kZShrZXkpO1xuICAgICAgdmFsdWUgPSBlbmNvZGUodmFsdWUpO1xuXG4gICAgICAvL1xuICAgICAgLy8gSWYgd2UgZmFpbGVkIHRvIGVuY29kZSB0aGUgc3RyaW5ncywgd2Ugc2hvdWxkIGJhaWwgb3V0IGFzIHdlIGRvbid0XG4gICAgICAvLyB3YW50IHRvIGFkZCBpbnZhbGlkIHN0cmluZ3MgdG8gdGhlIHF1ZXJ5LlxuICAgICAgLy9cbiAgICAgIGlmIChrZXkgPT09IG51bGwgfHwgdmFsdWUgPT09IG51bGwpIGNvbnRpbnVlO1xuICAgICAgcGFpcnMucHVzaChrZXkgKyc9JysgdmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBwYWlycy5sZW5ndGggPyBwcmVmaXggKyBwYWlycy5qb2luKCcmJykgOiAnJztcbn1cblxuLy9cbi8vIEV4cG9zZSB0aGUgbW9kdWxlLlxuLy9cbmV4cG9ydHMuc3RyaW5naWZ5ID0gcXVlcnlzdHJpbmdpZnk7XG5leHBvcnRzLnBhcnNlID0gcXVlcnlzdHJpbmc7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQ2hlY2sgaWYgd2UncmUgcmVxdWlyZWQgdG8gYWRkIGEgcG9ydCBudW1iZXIuXG4gKlxuICogQHNlZSBodHRwczovL3VybC5zcGVjLndoYXR3Zy5vcmcvI2RlZmF1bHQtcG9ydFxuICogQHBhcmFtIHtOdW1iZXJ8U3RyaW5nfSBwb3J0IFBvcnQgbnVtYmVyIHdlIG5lZWQgdG8gY2hlY2tcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcm90b2NvbCBQcm90b2NvbCB3ZSBuZWVkIHRvIGNoZWNrIGFnYWluc3QuXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0gSXMgaXQgYSBkZWZhdWx0IHBvcnQgZm9yIHRoZSBnaXZlbiBwcm90b2NvbFxuICogQGFwaSBwcml2YXRlXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcmVxdWlyZWQocG9ydCwgcHJvdG9jb2wpIHtcbiAgcHJvdG9jb2wgPSBwcm90b2NvbC5zcGxpdCgnOicpWzBdO1xuICBwb3J0ID0gK3BvcnQ7XG5cbiAgaWYgKCFwb3J0KSByZXR1cm4gZmFsc2U7XG5cbiAgc3dpdGNoIChwcm90b2NvbCkge1xuICAgIGNhc2UgJ2h0dHAnOlxuICAgIGNhc2UgJ3dzJzpcbiAgICByZXR1cm4gcG9ydCAhPT0gODA7XG5cbiAgICBjYXNlICdodHRwcyc6XG4gICAgY2FzZSAnd3NzJzpcbiAgICByZXR1cm4gcG9ydCAhPT0gNDQzO1xuXG4gICAgY2FzZSAnZnRwJzpcbiAgICByZXR1cm4gcG9ydCAhPT0gMjE7XG5cbiAgICBjYXNlICdnb3BoZXInOlxuICAgIHJldHVybiBwb3J0ICE9PSA3MDtcblxuICAgIGNhc2UgJ2ZpbGUnOlxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBwb3J0ICE9PSAwO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRyYW5zcG9ydExpc3QgPSByZXF1aXJlKCcuL3RyYW5zcG9ydC1saXN0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9tYWluJykodHJhbnNwb3J0TGlzdCk7XG5cbi8vIFRPRE8gY2FuJ3QgZ2V0IHJpZCBvZiB0aGlzIHVudGlsIGFsbCBzZXJ2ZXJzIGRvXG5pZiAoJ19zb2NranNfb25sb2FkJyBpbiBnbG9iYWwpIHtcbiAgc2V0VGltZW91dChnbG9iYWwuX3NvY2tqc19vbmxvYWQsIDEpO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpXG4gICwgRXZlbnQgPSByZXF1aXJlKCcuL2V2ZW50JylcbiAgO1xuXG5mdW5jdGlvbiBDbG9zZUV2ZW50KCkge1xuICBFdmVudC5jYWxsKHRoaXMpO1xuICB0aGlzLmluaXRFdmVudCgnY2xvc2UnLCBmYWxzZSwgZmFsc2UpO1xuICB0aGlzLndhc0NsZWFuID0gZmFsc2U7XG4gIHRoaXMuY29kZSA9IDA7XG4gIHRoaXMucmVhc29uID0gJyc7XG59XG5cbmluaGVyaXRzKENsb3NlRXZlbnQsIEV2ZW50KTtcblxubW9kdWxlLmV4cG9ydHMgPSBDbG9zZUV2ZW50O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpXG4gICwgRXZlbnRUYXJnZXQgPSByZXF1aXJlKCcuL2V2ZW50dGFyZ2V0JylcbiAgO1xuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIEV2ZW50VGFyZ2V0LmNhbGwodGhpcyk7XG59XG5cbmluaGVyaXRzKEV2ZW50RW1pdHRlciwgRXZlbnRUYXJnZXQpO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgaWYgKHR5cGUpIHtcbiAgICBkZWxldGUgdGhpcy5fbGlzdGVuZXJzW3R5cGVdO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuX2xpc3RlbmVycyA9IHt9O1xuICB9XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgc2VsZiA9IHRoaXNcbiAgICAsIGZpcmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZygpIHtcbiAgICBzZWxmLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgaWYgKCFmaXJlZCkge1xuICAgICAgZmlyZWQgPSB0cnVlO1xuICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICB0aGlzLm9uKHR5cGUsIGcpO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciB0eXBlID0gYXJndW1lbnRzWzBdO1xuICB2YXIgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzW3R5cGVdO1xuICBpZiAoIWxpc3RlbmVycykge1xuICAgIHJldHVybjtcbiAgfVxuICAvLyBlcXVpdmFsZW50IG9mIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gIHZhciBsID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkobCAtIDEpO1xuICBmb3IgKHZhciBhaSA9IDE7IGFpIDwgbDsgYWkrKykge1xuICAgIGFyZ3NbYWkgLSAxXSA9IGFyZ3VtZW50c1thaV07XG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0ZW5lcnMubGVuZ3RoOyBpKyspIHtcbiAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gRXZlbnRUYXJnZXQucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXI7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gRXZlbnRUYXJnZXQucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXI7XG5cbm1vZHVsZS5leHBvcnRzLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gRXZlbnQoZXZlbnRUeXBlKSB7XG4gIHRoaXMudHlwZSA9IGV2ZW50VHlwZTtcbn1cblxuRXZlbnQucHJvdG90eXBlLmluaXRFdmVudCA9IGZ1bmN0aW9uKGV2ZW50VHlwZSwgY2FuQnViYmxlLCBjYW5jZWxhYmxlKSB7XG4gIHRoaXMudHlwZSA9IGV2ZW50VHlwZTtcbiAgdGhpcy5idWJibGVzID0gY2FuQnViYmxlO1xuICB0aGlzLmNhbmNlbGFibGUgPSBjYW5jZWxhYmxlO1xuICB0aGlzLnRpbWVTdGFtcCA9ICtuZXcgRGF0ZSgpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50LnByb3RvdHlwZS5zdG9wUHJvcGFnYXRpb24gPSBmdW5jdGlvbigpIHt9O1xuRXZlbnQucHJvdG90eXBlLnByZXZlbnREZWZhdWx0ID0gZnVuY3Rpb24oKSB7fTtcblxuRXZlbnQuQ0FQVFVSSU5HX1BIQVNFID0gMTtcbkV2ZW50LkFUX1RBUkdFVCA9IDI7XG5FdmVudC5CVUJCTElOR19QSEFTRSA9IDM7XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qIFNpbXBsaWZpZWQgaW1wbGVtZW50YXRpb24gb2YgRE9NMiBFdmVudFRhcmdldC5cbiAqICAgaHR0cDovL3d3dy53My5vcmcvVFIvRE9NLUxldmVsLTItRXZlbnRzL2V2ZW50cy5odG1sI0V2ZW50cy1FdmVudFRhcmdldFxuICovXG5cbmZ1bmN0aW9uIEV2ZW50VGFyZ2V0KCkge1xuICB0aGlzLl9saXN0ZW5lcnMgPSB7fTtcbn1cblxuRXZlbnRUYXJnZXQucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudFR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghKGV2ZW50VHlwZSBpbiB0aGlzLl9saXN0ZW5lcnMpKSB7XG4gICAgdGhpcy5fbGlzdGVuZXJzW2V2ZW50VHlwZV0gPSBbXTtcbiAgfVxuICB2YXIgYXJyID0gdGhpcy5fbGlzdGVuZXJzW2V2ZW50VHlwZV07XG4gIC8vICM0XG4gIGlmIChhcnIuaW5kZXhPZihsaXN0ZW5lcikgPT09IC0xKSB7XG4gICAgLy8gTWFrZSBhIGNvcHkgc28gYXMgbm90IHRvIGludGVyZmVyZSB3aXRoIGEgY3VycmVudCBkaXNwYXRjaEV2ZW50LlxuICAgIGFyciA9IGFyci5jb25jYXQoW2xpc3RlbmVyXSk7XG4gIH1cbiAgdGhpcy5fbGlzdGVuZXJzW2V2ZW50VHlwZV0gPSBhcnI7XG59O1xuXG5FdmVudFRhcmdldC5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50VHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGFyciA9IHRoaXMuX2xpc3RlbmVyc1tldmVudFR5cGVdO1xuICBpZiAoIWFycikge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgaWR4ID0gYXJyLmluZGV4T2YobGlzdGVuZXIpO1xuICBpZiAoaWR4ICE9PSAtMSkge1xuICAgIGlmIChhcnIubGVuZ3RoID4gMSkge1xuICAgICAgLy8gTWFrZSBhIGNvcHkgc28gYXMgbm90IHRvIGludGVyZmVyZSB3aXRoIGEgY3VycmVudCBkaXNwYXRjaEV2ZW50LlxuICAgICAgdGhpcy5fbGlzdGVuZXJzW2V2ZW50VHlwZV0gPSBhcnIuc2xpY2UoMCwgaWR4KS5jb25jYXQoYXJyLnNsaWNlKGlkeCArIDEpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIHRoaXMuX2xpc3RlbmVyc1tldmVudFR5cGVdO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cbn07XG5cbkV2ZW50VGFyZ2V0LnByb3RvdHlwZS5kaXNwYXRjaEV2ZW50ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBldmVudCA9IGFyZ3VtZW50c1swXTtcbiAgdmFyIHQgPSBldmVudC50eXBlO1xuICAvLyBlcXVpdmFsZW50IG9mIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG4gIHZhciBhcmdzID0gYXJndW1lbnRzLmxlbmd0aCA9PT0gMSA/IFtldmVudF0gOiBBcnJheS5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAvLyBUT0RPOiBUaGlzIGRvZXNuJ3QgbWF0Y2ggdGhlIHJlYWwgYmVoYXZpb3I7IHBlciBzcGVjLCBvbmZvbyBnZXRcbiAgLy8gdGhlaXIgcGxhY2UgaW4gbGluZSBmcm9tIHRoZSAvZmlyc3QvIHRpbWUgdGhleSdyZSBzZXQgZnJvbVxuICAvLyBub24tbnVsbC4gQWx0aG91Z2ggV2ViS2l0IGJ1bXBzIGl0IHRvIHRoZSBlbmQgZXZlcnkgdGltZSBpdCdzXG4gIC8vIHNldC5cbiAgaWYgKHRoaXNbJ29uJyArIHRdKSB7XG4gICAgdGhpc1snb24nICsgdF0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cbiAgaWYgKHQgaW4gdGhpcy5fbGlzdGVuZXJzKSB7XG4gICAgLy8gR3JhYiBhIHJlZmVyZW5jZSB0byB0aGUgbGlzdGVuZXJzIGxpc3QuIHJlbW92ZUV2ZW50TGlzdGVuZXIgbWF5IGFsdGVyIHRoZSBsaXN0LlxuICAgIHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnNbdF07XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0ZW5lcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRUYXJnZXQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJylcbiAgLCBFdmVudCA9IHJlcXVpcmUoJy4vZXZlbnQnKVxuICA7XG5cbmZ1bmN0aW9uIFRyYW5zcG9ydE1lc3NhZ2VFdmVudChkYXRhKSB7XG4gIEV2ZW50LmNhbGwodGhpcyk7XG4gIHRoaXMuaW5pdEV2ZW50KCdtZXNzYWdlJywgZmFsc2UsIGZhbHNlKTtcbiAgdGhpcy5kYXRhID0gZGF0YTtcbn1cblxuaW5oZXJpdHMoVHJhbnNwb3J0TWVzc2FnZUV2ZW50LCBFdmVudCk7XG5cbm1vZHVsZS5leHBvcnRzID0gVHJhbnNwb3J0TWVzc2FnZUV2ZW50O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaWZyYW1lVXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzL2lmcmFtZScpXG4gIDtcblxuZnVuY3Rpb24gRmFjYWRlSlModHJhbnNwb3J0KSB7XG4gIHRoaXMuX3RyYW5zcG9ydCA9IHRyYW5zcG9ydDtcbiAgdHJhbnNwb3J0Lm9uKCdtZXNzYWdlJywgdGhpcy5fdHJhbnNwb3J0TWVzc2FnZS5iaW5kKHRoaXMpKTtcbiAgdHJhbnNwb3J0Lm9uKCdjbG9zZScsIHRoaXMuX3RyYW5zcG9ydENsb3NlLmJpbmQodGhpcykpO1xufVxuXG5GYWNhZGVKUy5wcm90b3R5cGUuX3RyYW5zcG9ydENsb3NlID0gZnVuY3Rpb24oY29kZSwgcmVhc29uKSB7XG4gIGlmcmFtZVV0aWxzLnBvc3RNZXNzYWdlKCdjJywgSlNPTi5zdHJpbmdpZnkoW2NvZGUsIHJlYXNvbl0pKTtcbn07XG5GYWNhZGVKUy5wcm90b3R5cGUuX3RyYW5zcG9ydE1lc3NhZ2UgPSBmdW5jdGlvbihmcmFtZSkge1xuICBpZnJhbWVVdGlscy5wb3N0TWVzc2FnZSgndCcsIGZyYW1lKTtcbn07XG5GYWNhZGVKUy5wcm90b3R5cGUuX3NlbmQgPSBmdW5jdGlvbihkYXRhKSB7XG4gIHRoaXMuX3RyYW5zcG9ydC5zZW5kKGRhdGEpO1xufTtcbkZhY2FkZUpTLnByb3RvdHlwZS5fY2xvc2UgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fdHJhbnNwb3J0LmNsb3NlKCk7XG4gIHRoaXMuX3RyYW5zcG9ydC5yZW1vdmVBbGxMaXN0ZW5lcnMoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRmFjYWRlSlM7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1cmxVdGlscyA9IHJlcXVpcmUoJy4vdXRpbHMvdXJsJylcbiAgLCBldmVudFV0aWxzID0gcmVxdWlyZSgnLi91dGlscy9ldmVudCcpXG4gICwgRmFjYWRlSlMgPSByZXF1aXJlKCcuL2ZhY2FkZScpXG4gICwgSW5mb0lmcmFtZVJlY2VpdmVyID0gcmVxdWlyZSgnLi9pbmZvLWlmcmFtZS1yZWNlaXZlcicpXG4gICwgaWZyYW1lVXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzL2lmcmFtZScpXG4gICwgbG9jID0gcmVxdWlyZSgnLi9sb2NhdGlvbicpXG4gIDtcblxudmFyIGRlYnVnID0gZnVuY3Rpb24oKSB7fTtcbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIGRlYnVnID0gcmVxdWlyZSgnZGVidWcnKSgnc29ja2pzLWNsaWVudDppZnJhbWUtYm9vdHN0cmFwJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oU29ja0pTLCBhdmFpbGFibGVUcmFuc3BvcnRzKSB7XG4gIHZhciB0cmFuc3BvcnRNYXAgPSB7fTtcbiAgYXZhaWxhYmxlVHJhbnNwb3J0cy5mb3JFYWNoKGZ1bmN0aW9uKGF0KSB7XG4gICAgaWYgKGF0LmZhY2FkZVRyYW5zcG9ydCkge1xuICAgICAgdHJhbnNwb3J0TWFwW2F0LmZhY2FkZVRyYW5zcG9ydC50cmFuc3BvcnROYW1lXSA9IGF0LmZhY2FkZVRyYW5zcG9ydDtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIGhhcmQtY29kZWQgZm9yIHRoZSBpbmZvIGlmcmFtZVxuICAvLyBUT0RPIHNlZSBpZiB3ZSBjYW4gbWFrZSB0aGlzIG1vcmUgZHluYW1pY1xuICB0cmFuc3BvcnRNYXBbSW5mb0lmcmFtZVJlY2VpdmVyLnRyYW5zcG9ydE5hbWVdID0gSW5mb0lmcmFtZVJlY2VpdmVyO1xuICB2YXIgcGFyZW50T3JpZ2luO1xuXG4gIC8qIGVzbGludC1kaXNhYmxlIGNhbWVsY2FzZSAqL1xuICBTb2NrSlMuYm9vdHN0cmFwX2lmcmFtZSA9IGZ1bmN0aW9uKCkge1xuICAgIC8qIGVzbGludC1lbmFibGUgY2FtZWxjYXNlICovXG4gICAgdmFyIGZhY2FkZTtcbiAgICBpZnJhbWVVdGlscy5jdXJyZW50V2luZG93SWQgPSBsb2MuaGFzaC5zbGljZSgxKTtcbiAgICB2YXIgb25NZXNzYWdlID0gZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKGUuc291cmNlICE9PSBwYXJlbnQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBwYXJlbnRPcmlnaW4gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHBhcmVudE9yaWdpbiA9IGUub3JpZ2luO1xuICAgICAgfVxuICAgICAgaWYgKGUub3JpZ2luICE9PSBwYXJlbnRPcmlnaW4pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgaWZyYW1lTWVzc2FnZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmcmFtZU1lc3NhZ2UgPSBKU09OLnBhcnNlKGUuZGF0YSk7XG4gICAgICB9IGNhdGNoIChpZ25vcmVkKSB7XG4gICAgICAgIGRlYnVnKCdiYWQganNvbicsIGUuZGF0YSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKGlmcmFtZU1lc3NhZ2Uud2luZG93SWQgIT09IGlmcmFtZVV0aWxzLmN1cnJlbnRXaW5kb3dJZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBzd2l0Y2ggKGlmcmFtZU1lc3NhZ2UudHlwZSkge1xuICAgICAgY2FzZSAncyc6XG4gICAgICAgIHZhciBwO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHAgPSBKU09OLnBhcnNlKGlmcmFtZU1lc3NhZ2UuZGF0YSk7XG4gICAgICAgIH0gY2F0Y2ggKGlnbm9yZWQpIHtcbiAgICAgICAgICBkZWJ1ZygnYmFkIGpzb24nLCBpZnJhbWVNZXNzYWdlLmRhdGEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHZhciB2ZXJzaW9uID0gcFswXTtcbiAgICAgICAgdmFyIHRyYW5zcG9ydCA9IHBbMV07XG4gICAgICAgIHZhciB0cmFuc1VybCA9IHBbMl07XG4gICAgICAgIHZhciBiYXNlVXJsID0gcFszXTtcbiAgICAgICAgZGVidWcodmVyc2lvbiwgdHJhbnNwb3J0LCB0cmFuc1VybCwgYmFzZVVybCk7XG4gICAgICAgIC8vIGNoYW5nZSB0aGlzIHRvIHNlbXZlciBsb2dpY1xuICAgICAgICBpZiAodmVyc2lvbiAhPT0gU29ja0pTLnZlcnNpb24pIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0luY29tcGF0aWJsZSBTb2NrSlMhIE1haW4gc2l0ZSB1c2VzOicgK1xuICAgICAgICAgICAgICAgICAgICAnIFwiJyArIHZlcnNpb24gKyAnXCIsIHRoZSBpZnJhbWU6JyArXG4gICAgICAgICAgICAgICAgICAgICcgXCInICsgU29ja0pTLnZlcnNpb24gKyAnXCIuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXVybFV0aWxzLmlzT3JpZ2luRXF1YWwodHJhbnNVcmwsIGxvYy5ocmVmKSB8fFxuICAgICAgICAgICAgIXVybFV0aWxzLmlzT3JpZ2luRXF1YWwoYmFzZVVybCwgbG9jLmhyZWYpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5cXCd0IGNvbm5lY3QgdG8gZGlmZmVyZW50IGRvbWFpbiBmcm9tIHdpdGhpbiBhbiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2lmcmFtZS4gKCcgKyBsb2MuaHJlZiArICcsICcgKyB0cmFuc1VybCArICcsICcgKyBiYXNlVXJsICsgJyknKTtcbiAgICAgICAgfVxuICAgICAgICBmYWNhZGUgPSBuZXcgRmFjYWRlSlMobmV3IHRyYW5zcG9ydE1hcFt0cmFuc3BvcnRdKHRyYW5zVXJsLCBiYXNlVXJsKSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbSc6XG4gICAgICAgIGZhY2FkZS5fc2VuZChpZnJhbWVNZXNzYWdlLmRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2MnOlxuICAgICAgICBpZiAoZmFjYWRlKSB7XG4gICAgICAgICAgZmFjYWRlLl9jbG9zZSgpO1xuICAgICAgICB9XG4gICAgICAgIGZhY2FkZSA9IG51bGw7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBldmVudFV0aWxzLmF0dGFjaEV2ZW50KCdtZXNzYWdlJywgb25NZXNzYWdlKTtcblxuICAgIC8vIFN0YXJ0XG4gICAgaWZyYW1lVXRpbHMucG9zdE1lc3NhZ2UoJ3MnKTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXJcbiAgLCBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJylcbiAgLCBvYmplY3RVdGlscyA9IHJlcXVpcmUoJy4vdXRpbHMvb2JqZWN0JylcbiAgO1xuXG52YXIgZGVidWcgPSBmdW5jdGlvbigpIHt9O1xuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdzb2NranMtY2xpZW50OmluZm8tYWpheCcpO1xufVxuXG5mdW5jdGlvbiBJbmZvQWpheCh1cmwsIEFqYXhPYmplY3QpIHtcbiAgRXZlbnRFbWl0dGVyLmNhbGwodGhpcyk7XG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgdDAgPSArbmV3IERhdGUoKTtcbiAgdGhpcy54byA9IG5ldyBBamF4T2JqZWN0KCdHRVQnLCB1cmwpO1xuXG4gIHRoaXMueG8ub25jZSgnZmluaXNoJywgZnVuY3Rpb24oc3RhdHVzLCB0ZXh0KSB7XG4gICAgdmFyIGluZm8sIHJ0dDtcbiAgICBpZiAoc3RhdHVzID09PSAyMDApIHtcbiAgICAgIHJ0dCA9ICgrbmV3IERhdGUoKSkgLSB0MDtcbiAgICAgIGlmICh0ZXh0KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaW5mbyA9IEpTT04ucGFyc2UodGV4dCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBkZWJ1ZygnYmFkIGpzb24nLCB0ZXh0KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIW9iamVjdFV0aWxzLmlzT2JqZWN0KGluZm8pKSB7XG4gICAgICAgIGluZm8gPSB7fTtcbiAgICAgIH1cbiAgICB9XG4gICAgc2VsZi5lbWl0KCdmaW5pc2gnLCBpbmZvLCBydHQpO1xuICAgIHNlbGYucmVtb3ZlQWxsTGlzdGVuZXJzKCk7XG4gIH0pO1xufVxuXG5pbmhlcml0cyhJbmZvQWpheCwgRXZlbnRFbWl0dGVyKTtcblxuSW5mb0FqYXgucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCk7XG4gIHRoaXMueG8uY2xvc2UoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSW5mb0FqYXg7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJylcbiAgLCBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXJcbiAgLCBYSFJMb2NhbE9iamVjdCA9IHJlcXVpcmUoJy4vdHJhbnNwb3J0L3NlbmRlci94aHItbG9jYWwnKVxuICAsIEluZm9BamF4ID0gcmVxdWlyZSgnLi9pbmZvLWFqYXgnKVxuICA7XG5cbmZ1bmN0aW9uIEluZm9SZWNlaXZlcklmcmFtZSh0cmFuc1VybCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIEV2ZW50RW1pdHRlci5jYWxsKHRoaXMpO1xuXG4gIHRoaXMuaXIgPSBuZXcgSW5mb0FqYXgodHJhbnNVcmwsIFhIUkxvY2FsT2JqZWN0KTtcbiAgdGhpcy5pci5vbmNlKCdmaW5pc2gnLCBmdW5jdGlvbihpbmZvLCBydHQpIHtcbiAgICBzZWxmLmlyID0gbnVsbDtcbiAgICBzZWxmLmVtaXQoJ21lc3NhZ2UnLCBKU09OLnN0cmluZ2lmeShbaW5mbywgcnR0XSkpO1xuICB9KTtcbn1cblxuaW5oZXJpdHMoSW5mb1JlY2VpdmVySWZyYW1lLCBFdmVudEVtaXR0ZXIpO1xuXG5JbmZvUmVjZWl2ZXJJZnJhbWUudHJhbnNwb3J0TmFtZSA9ICdpZnJhbWUtaW5mby1yZWNlaXZlcic7XG5cbkluZm9SZWNlaXZlcklmcmFtZS5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuaXIpIHtcbiAgICB0aGlzLmlyLmNsb3NlKCk7XG4gICAgdGhpcy5pciA9IG51bGw7XG4gIH1cbiAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSW5mb1JlY2VpdmVySWZyYW1lO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyXG4gICwgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpXG4gICwgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzL2V2ZW50JylcbiAgLCBJZnJhbWVUcmFuc3BvcnQgPSByZXF1aXJlKCcuL3RyYW5zcG9ydC9pZnJhbWUnKVxuICAsIEluZm9SZWNlaXZlcklmcmFtZSA9IHJlcXVpcmUoJy4vaW5mby1pZnJhbWUtcmVjZWl2ZXInKVxuICA7XG5cbnZhciBkZWJ1ZyA9IGZ1bmN0aW9uKCkge307XG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICBkZWJ1ZyA9IHJlcXVpcmUoJ2RlYnVnJykoJ3NvY2tqcy1jbGllbnQ6aW5mby1pZnJhbWUnKTtcbn1cblxuZnVuY3Rpb24gSW5mb0lmcmFtZShiYXNlVXJsLCB1cmwpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBFdmVudEVtaXR0ZXIuY2FsbCh0aGlzKTtcblxuICB2YXIgZ28gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaWZyID0gc2VsZi5pZnIgPSBuZXcgSWZyYW1lVHJhbnNwb3J0KEluZm9SZWNlaXZlcklmcmFtZS50cmFuc3BvcnROYW1lLCB1cmwsIGJhc2VVcmwpO1xuXG4gICAgaWZyLm9uY2UoJ21lc3NhZ2UnLCBmdW5jdGlvbihtc2cpIHtcbiAgICAgIGlmIChtc2cpIHtcbiAgICAgICAgdmFyIGQ7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZCA9IEpTT04ucGFyc2UobXNnKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGRlYnVnKCdiYWQganNvbicsIG1zZyk7XG4gICAgICAgICAgc2VsZi5lbWl0KCdmaW5pc2gnKTtcbiAgICAgICAgICBzZWxmLmNsb3NlKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGluZm8gPSBkWzBdLCBydHQgPSBkWzFdO1xuICAgICAgICBzZWxmLmVtaXQoJ2ZpbmlzaCcsIGluZm8sIHJ0dCk7XG4gICAgICB9XG4gICAgICBzZWxmLmNsb3NlKCk7XG4gICAgfSk7XG5cbiAgICBpZnIub25jZSgnY2xvc2UnLCBmdW5jdGlvbigpIHtcbiAgICAgIHNlbGYuZW1pdCgnZmluaXNoJyk7XG4gICAgICBzZWxmLmNsb3NlKCk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gVE9ETyB0aGlzIHNlZW1zIHRoZSBzYW1lIGFzIHRoZSAnbmVlZEJvZHknIGZyb20gdHJhbnNwb3J0c1xuICBpZiAoIWdsb2JhbC5kb2N1bWVudC5ib2R5KSB7XG4gICAgdXRpbHMuYXR0YWNoRXZlbnQoJ2xvYWQnLCBnbyk7XG4gIH0gZWxzZSB7XG4gICAgZ28oKTtcbiAgfVxufVxuXG5pbmhlcml0cyhJbmZvSWZyYW1lLCBFdmVudEVtaXR0ZXIpO1xuXG5JbmZvSWZyYW1lLmVuYWJsZWQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIElmcmFtZVRyYW5zcG9ydC5lbmFibGVkKCk7XG59O1xuXG5JbmZvSWZyYW1lLnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5pZnIpIHtcbiAgICB0aGlzLmlmci5jbG9zZSgpO1xuICB9XG4gIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCk7XG4gIHRoaXMuaWZyID0gbnVsbDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSW5mb0lmcmFtZTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlclxuICAsIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKVxuICAsIHVybFV0aWxzID0gcmVxdWlyZSgnLi91dGlscy91cmwnKVxuICAsIFhEUiA9IHJlcXVpcmUoJy4vdHJhbnNwb3J0L3NlbmRlci94ZHInKVxuICAsIFhIUkNvcnMgPSByZXF1aXJlKCcuL3RyYW5zcG9ydC9zZW5kZXIveGhyLWNvcnMnKVxuICAsIFhIUkxvY2FsID0gcmVxdWlyZSgnLi90cmFuc3BvcnQvc2VuZGVyL3hoci1sb2NhbCcpXG4gICwgWEhSRmFrZSA9IHJlcXVpcmUoJy4vdHJhbnNwb3J0L3NlbmRlci94aHItZmFrZScpXG4gICwgSW5mb0lmcmFtZSA9IHJlcXVpcmUoJy4vaW5mby1pZnJhbWUnKVxuICAsIEluZm9BamF4ID0gcmVxdWlyZSgnLi9pbmZvLWFqYXgnKVxuICA7XG5cbnZhciBkZWJ1ZyA9IGZ1bmN0aW9uKCkge307XG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICBkZWJ1ZyA9IHJlcXVpcmUoJ2RlYnVnJykoJ3NvY2tqcy1jbGllbnQ6aW5mby1yZWNlaXZlcicpO1xufVxuXG5mdW5jdGlvbiBJbmZvUmVjZWl2ZXIoYmFzZVVybCwgdXJsSW5mbykge1xuICBkZWJ1ZyhiYXNlVXJsKTtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBFdmVudEVtaXR0ZXIuY2FsbCh0aGlzKTtcblxuICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgIHNlbGYuZG9YaHIoYmFzZVVybCwgdXJsSW5mbyk7XG4gIH0sIDApO1xufVxuXG5pbmhlcml0cyhJbmZvUmVjZWl2ZXIsIEV2ZW50RW1pdHRlcik7XG5cbi8vIFRPRE8gdGhpcyBpcyBjdXJyZW50bHkgaWdub3JpbmcgdGhlIGxpc3Qgb2YgYXZhaWxhYmxlIHRyYW5zcG9ydHMgYW5kIHRoZSB3aGl0ZWxpc3RcblxuSW5mb1JlY2VpdmVyLl9nZXRSZWNlaXZlciA9IGZ1bmN0aW9uKGJhc2VVcmwsIHVybCwgdXJsSW5mbykge1xuICAvLyBkZXRlcm1pbmUgbWV0aG9kIG9mIENPUlMgc3VwcG9ydCAoaWYgbmVlZGVkKVxuICBpZiAodXJsSW5mby5zYW1lT3JpZ2luKSB7XG4gICAgcmV0dXJuIG5ldyBJbmZvQWpheCh1cmwsIFhIUkxvY2FsKTtcbiAgfVxuICBpZiAoWEhSQ29ycy5lbmFibGVkKSB7XG4gICAgcmV0dXJuIG5ldyBJbmZvQWpheCh1cmwsIFhIUkNvcnMpO1xuICB9XG4gIGlmIChYRFIuZW5hYmxlZCAmJiB1cmxJbmZvLnNhbWVTY2hlbWUpIHtcbiAgICByZXR1cm4gbmV3IEluZm9BamF4KHVybCwgWERSKTtcbiAgfVxuICBpZiAoSW5mb0lmcmFtZS5lbmFibGVkKCkpIHtcbiAgICByZXR1cm4gbmV3IEluZm9JZnJhbWUoYmFzZVVybCwgdXJsKTtcbiAgfVxuICByZXR1cm4gbmV3IEluZm9BamF4KHVybCwgWEhSRmFrZSk7XG59O1xuXG5JbmZvUmVjZWl2ZXIucHJvdG90eXBlLmRvWGhyID0gZnVuY3Rpb24oYmFzZVVybCwgdXJsSW5mbykge1xuICB2YXIgc2VsZiA9IHRoaXNcbiAgICAsIHVybCA9IHVybFV0aWxzLmFkZFBhdGgoYmFzZVVybCwgJy9pbmZvJylcbiAgICA7XG4gIGRlYnVnKCdkb1hocicsIHVybCk7XG5cbiAgdGhpcy54byA9IEluZm9SZWNlaXZlci5fZ2V0UmVjZWl2ZXIoYmFzZVVybCwgdXJsLCB1cmxJbmZvKTtcblxuICB0aGlzLnRpbWVvdXRSZWYgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgIGRlYnVnKCd0aW1lb3V0Jyk7XG4gICAgc2VsZi5fY2xlYW51cChmYWxzZSk7XG4gICAgc2VsZi5lbWl0KCdmaW5pc2gnKTtcbiAgfSwgSW5mb1JlY2VpdmVyLnRpbWVvdXQpO1xuXG4gIHRoaXMueG8ub25jZSgnZmluaXNoJywgZnVuY3Rpb24oaW5mbywgcnR0KSB7XG4gICAgZGVidWcoJ2ZpbmlzaCcsIGluZm8sIHJ0dCk7XG4gICAgc2VsZi5fY2xlYW51cCh0cnVlKTtcbiAgICBzZWxmLmVtaXQoJ2ZpbmlzaCcsIGluZm8sIHJ0dCk7XG4gIH0pO1xufTtcblxuSW5mb1JlY2VpdmVyLnByb3RvdHlwZS5fY2xlYW51cCA9IGZ1bmN0aW9uKHdhc0NsZWFuKSB7XG4gIGRlYnVnKCdfY2xlYW51cCcpO1xuICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0UmVmKTtcbiAgdGhpcy50aW1lb3V0UmVmID0gbnVsbDtcbiAgaWYgKCF3YXNDbGVhbiAmJiB0aGlzLnhvKSB7XG4gICAgdGhpcy54by5jbG9zZSgpO1xuICB9XG4gIHRoaXMueG8gPSBudWxsO1xufTtcblxuSW5mb1JlY2VpdmVyLnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuICBkZWJ1ZygnY2xvc2UnKTtcbiAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoKTtcbiAgdGhpcy5fY2xlYW51cChmYWxzZSk7XG59O1xuXG5JbmZvUmVjZWl2ZXIudGltZW91dCA9IDgwMDA7XG5cbm1vZHVsZS5leHBvcnRzID0gSW5mb1JlY2VpdmVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdsb2JhbC5sb2NhdGlvbiB8fCB7XG4gIG9yaWdpbjogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODAnXG4sIHByb3RvY29sOiAnaHR0cDonXG4sIGhvc3Q6ICdsb2NhbGhvc3QnXG4sIHBvcnQ6IDgwXG4sIGhyZWY6ICdodHRwOi8vbG9jYWxob3N0LydcbiwgaGFzaDogJydcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4vc2hpbXMnKTtcblxudmFyIFVSTCA9IHJlcXVpcmUoJ3VybC1wYXJzZScpXG4gICwgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpXG4gICwgcmFuZG9tID0gcmVxdWlyZSgnLi91dGlscy9yYW5kb20nKVxuICAsIGVzY2FwZSA9IHJlcXVpcmUoJy4vdXRpbHMvZXNjYXBlJylcbiAgLCB1cmxVdGlscyA9IHJlcXVpcmUoJy4vdXRpbHMvdXJsJylcbiAgLCBldmVudFV0aWxzID0gcmVxdWlyZSgnLi91dGlscy9ldmVudCcpXG4gICwgdHJhbnNwb3J0ID0gcmVxdWlyZSgnLi91dGlscy90cmFuc3BvcnQnKVxuICAsIG9iamVjdFV0aWxzID0gcmVxdWlyZSgnLi91dGlscy9vYmplY3QnKVxuICAsIGJyb3dzZXIgPSByZXF1aXJlKCcuL3V0aWxzL2Jyb3dzZXInKVxuICAsIGxvZyA9IHJlcXVpcmUoJy4vdXRpbHMvbG9nJylcbiAgLCBFdmVudCA9IHJlcXVpcmUoJy4vZXZlbnQvZXZlbnQnKVxuICAsIEV2ZW50VGFyZ2V0ID0gcmVxdWlyZSgnLi9ldmVudC9ldmVudHRhcmdldCcpXG4gICwgbG9jID0gcmVxdWlyZSgnLi9sb2NhdGlvbicpXG4gICwgQ2xvc2VFdmVudCA9IHJlcXVpcmUoJy4vZXZlbnQvY2xvc2UnKVxuICAsIFRyYW5zcG9ydE1lc3NhZ2VFdmVudCA9IHJlcXVpcmUoJy4vZXZlbnQvdHJhbnMtbWVzc2FnZScpXG4gICwgSW5mb1JlY2VpdmVyID0gcmVxdWlyZSgnLi9pbmZvLXJlY2VpdmVyJylcbiAgO1xuXG52YXIgZGVidWcgPSBmdW5jdGlvbigpIHt9O1xuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdzb2NranMtY2xpZW50Om1haW4nKTtcbn1cblxudmFyIHRyYW5zcG9ydHM7XG5cbi8vIGZvbGxvdyBjb25zdHJ1Y3RvciBzdGVwcyBkZWZpbmVkIGF0IGh0dHA6Ly9kZXYudzMub3JnL2h0bWw1L3dlYnNvY2tldHMvI3RoZS13ZWJzb2NrZXQtaW50ZXJmYWNlXG5mdW5jdGlvbiBTb2NrSlModXJsLCBwcm90b2NvbHMsIG9wdGlvbnMpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFNvY2tKUykpIHtcbiAgICByZXR1cm4gbmV3IFNvY2tKUyh1cmwsIHByb3RvY29scywgb3B0aW9ucyk7XG4gIH1cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAxKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkZhaWxlZCB0byBjb25zdHJ1Y3QgJ1NvY2tKUzogMSBhcmd1bWVudCByZXF1aXJlZCwgYnV0IG9ubHkgMCBwcmVzZW50XCIpO1xuICB9XG4gIEV2ZW50VGFyZ2V0LmNhbGwodGhpcyk7XG5cbiAgdGhpcy5yZWFkeVN0YXRlID0gU29ja0pTLkNPTk5FQ1RJTkc7XG4gIHRoaXMuZXh0ZW5zaW9ucyA9ICcnO1xuICB0aGlzLnByb3RvY29sID0gJyc7XG5cbiAgLy8gbm9uLXN0YW5kYXJkIGV4dGVuc2lvblxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgaWYgKG9wdGlvbnMucHJvdG9jb2xzX3doaXRlbGlzdCkge1xuICAgIGxvZy53YXJuKFwiJ3Byb3RvY29sc193aGl0ZWxpc3QnIGlzIERFUFJFQ0FURUQuIFVzZSAndHJhbnNwb3J0cycgaW5zdGVhZC5cIik7XG4gIH1cbiAgdGhpcy5fdHJhbnNwb3J0c1doaXRlbGlzdCA9IG9wdGlvbnMudHJhbnNwb3J0cztcbiAgdGhpcy5fdHJhbnNwb3J0T3B0aW9ucyA9IG9wdGlvbnMudHJhbnNwb3J0T3B0aW9ucyB8fCB7fTtcbiAgdGhpcy5fdGltZW91dCA9IG9wdGlvbnMudGltZW91dCB8fCAwO1xuXG4gIHZhciBzZXNzaW9uSWQgPSBvcHRpb25zLnNlc3Npb25JZCB8fCA4O1xuICBpZiAodHlwZW9mIHNlc3Npb25JZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHRoaXMuX2dlbmVyYXRlU2Vzc2lvbklkID0gc2Vzc2lvbklkO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBzZXNzaW9uSWQgPT09ICdudW1iZXInKSB7XG4gICAgdGhpcy5fZ2VuZXJhdGVTZXNzaW9uSWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiByYW5kb20uc3RyaW5nKHNlc3Npb25JZCk7XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJZiBzZXNzaW9uSWQgaXMgdXNlZCBpbiB0aGUgb3B0aW9ucywgaXQgbmVlZHMgdG8gYmUgYSBudW1iZXIgb3IgYSBmdW5jdGlvbi4nKTtcbiAgfVxuXG4gIHRoaXMuX3NlcnZlciA9IG9wdGlvbnMuc2VydmVyIHx8IHJhbmRvbS5udW1iZXJTdHJpbmcoMTAwMCk7XG5cbiAgLy8gU3RlcCAxIG9mIFdTIHNwZWMgLSBwYXJzZSBhbmQgdmFsaWRhdGUgdGhlIHVybC4gSXNzdWUgIzhcbiAgdmFyIHBhcnNlZFVybCA9IG5ldyBVUkwodXJsKTtcbiAgaWYgKCFwYXJzZWRVcmwuaG9zdCB8fCAhcGFyc2VkVXJsLnByb3RvY29sKSB7XG4gICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKFwiVGhlIFVSTCAnXCIgKyB1cmwgKyBcIicgaXMgaW52YWxpZFwiKTtcbiAgfSBlbHNlIGlmIChwYXJzZWRVcmwuaGFzaCkge1xuICAgIHRocm93IG5ldyBTeW50YXhFcnJvcignVGhlIFVSTCBtdXN0IG5vdCBjb250YWluIGEgZnJhZ21lbnQnKTtcbiAgfSBlbHNlIGlmIChwYXJzZWRVcmwucHJvdG9jb2wgIT09ICdodHRwOicgJiYgcGFyc2VkVXJsLnByb3RvY29sICE9PSAnaHR0cHM6Jykge1xuICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihcIlRoZSBVUkwncyBzY2hlbWUgbXVzdCBiZSBlaXRoZXIgJ2h0dHA6JyBvciAnaHR0cHM6Jy4gJ1wiICsgcGFyc2VkVXJsLnByb3RvY29sICsgXCInIGlzIG5vdCBhbGxvd2VkLlwiKTtcbiAgfVxuXG4gIHZhciBzZWN1cmUgPSBwYXJzZWRVcmwucHJvdG9jb2wgPT09ICdodHRwczonO1xuICAvLyBTdGVwIDIgLSBkb24ndCBhbGxvdyBzZWN1cmUgb3JpZ2luIHdpdGggYW4gaW5zZWN1cmUgcHJvdG9jb2xcbiAgaWYgKGxvYy5wcm90b2NvbCA9PT0gJ2h0dHBzOicgJiYgIXNlY3VyZSkge1xuICAgIC8vIGV4Y2VwdGlvbiBpcyAxMjcuMC4wLjAvOCBhbmQgOjoxIHVybHNcbiAgICBpZiAoIXVybFV0aWxzLmlzTG9vcGJhY2tBZGRyKHBhcnNlZFVybC5ob3N0bmFtZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignU2VjdXJpdHlFcnJvcjogQW4gaW5zZWN1cmUgU29ja0pTIGNvbm5lY3Rpb24gbWF5IG5vdCBiZSBpbml0aWF0ZWQgZnJvbSBhIHBhZ2UgbG9hZGVkIG92ZXIgSFRUUFMnKTtcbiAgICB9XG4gIH1cblxuICAvLyBTdGVwIDMgLSBjaGVjayBwb3J0IGFjY2VzcyAtIG5vIG5lZWQgaGVyZVxuICAvLyBTdGVwIDQgLSBwYXJzZSBwcm90b2NvbHMgYXJndW1lbnRcbiAgaWYgKCFwcm90b2NvbHMpIHtcbiAgICBwcm90b2NvbHMgPSBbXTtcbiAgfSBlbHNlIGlmICghQXJyYXkuaXNBcnJheShwcm90b2NvbHMpKSB7XG4gICAgcHJvdG9jb2xzID0gW3Byb3RvY29sc107XG4gIH1cblxuICAvLyBTdGVwIDUgLSBjaGVjayBwcm90b2NvbHMgYXJndW1lbnRcbiAgdmFyIHNvcnRlZFByb3RvY29scyA9IHByb3RvY29scy5zb3J0KCk7XG4gIHNvcnRlZFByb3RvY29scy5mb3JFYWNoKGZ1bmN0aW9uKHByb3RvLCBpKSB7XG4gICAgaWYgKCFwcm90bykge1xuICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKFwiVGhlIHByb3RvY29scyBlbnRyeSAnXCIgKyBwcm90byArIFwiJyBpcyBpbnZhbGlkLlwiKTtcbiAgICB9XG4gICAgaWYgKGkgPCAoc29ydGVkUHJvdG9jb2xzLmxlbmd0aCAtIDEpICYmIHByb3RvID09PSBzb3J0ZWRQcm90b2NvbHNbaSArIDFdKSB7XG4gICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJUaGUgcHJvdG9jb2xzIGVudHJ5ICdcIiArIHByb3RvICsgXCInIGlzIGR1cGxpY2F0ZWQuXCIpO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gU3RlcCA2IC0gY29udmVydCBvcmlnaW5cbiAgdmFyIG8gPSB1cmxVdGlscy5nZXRPcmlnaW4obG9jLmhyZWYpO1xuICB0aGlzLl9vcmlnaW4gPSBvID8gby50b0xvd2VyQ2FzZSgpIDogbnVsbDtcblxuICAvLyByZW1vdmUgdGhlIHRyYWlsaW5nIHNsYXNoXG4gIHBhcnNlZFVybC5zZXQoJ3BhdGhuYW1lJywgcGFyc2VkVXJsLnBhdGhuYW1lLnJlcGxhY2UoL1xcLyskLywgJycpKTtcblxuICAvLyBzdG9yZSB0aGUgc2FuaXRpemVkIHVybFxuICB0aGlzLnVybCA9IHBhcnNlZFVybC5ocmVmO1xuICBkZWJ1ZygndXNpbmcgdXJsJywgdGhpcy51cmwpO1xuXG4gIC8vIFN0ZXAgNyAtIHN0YXJ0IGNvbm5lY3Rpb24gaW4gYmFja2dyb3VuZFxuICAvLyBvYnRhaW4gc2VydmVyIGluZm9cbiAgLy8gaHR0cDovL3NvY2tqcy5naXRodWIuaW8vc29ja2pzLXByb3RvY29sL3NvY2tqcy1wcm90b2NvbC0wLjMuMy5odG1sI3NlY3Rpb24tMjZcbiAgdGhpcy5fdXJsSW5mbyA9IHtcbiAgICBudWxsT3JpZ2luOiAhYnJvd3Nlci5oYXNEb21haW4oKVxuICAsIHNhbWVPcmlnaW46IHVybFV0aWxzLmlzT3JpZ2luRXF1YWwodGhpcy51cmwsIGxvYy5ocmVmKVxuICAsIHNhbWVTY2hlbWU6IHVybFV0aWxzLmlzU2NoZW1lRXF1YWwodGhpcy51cmwsIGxvYy5ocmVmKVxuICB9O1xuXG4gIHRoaXMuX2lyID0gbmV3IEluZm9SZWNlaXZlcih0aGlzLnVybCwgdGhpcy5fdXJsSW5mbyk7XG4gIHRoaXMuX2lyLm9uY2UoJ2ZpbmlzaCcsIHRoaXMuX3JlY2VpdmVJbmZvLmJpbmQodGhpcykpO1xufVxuXG5pbmhlcml0cyhTb2NrSlMsIEV2ZW50VGFyZ2V0KTtcblxuZnVuY3Rpb24gdXNlclNldENvZGUoY29kZSkge1xuICByZXR1cm4gY29kZSA9PT0gMTAwMCB8fCAoY29kZSA+PSAzMDAwICYmIGNvZGUgPD0gNDk5OSk7XG59XG5cblNvY2tKUy5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbihjb2RlLCByZWFzb24pIHtcbiAgLy8gU3RlcCAxXG4gIGlmIChjb2RlICYmICF1c2VyU2V0Q29kZShjb2RlKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZEFjY2Vzc0Vycm9yOiBJbnZhbGlkIGNvZGUnKTtcbiAgfVxuICAvLyBTdGVwIDIuNCBzdGF0ZXMgdGhlIG1heCBpcyAxMjMgYnl0ZXMsIGJ1dCB3ZSBhcmUganVzdCBjaGVja2luZyBsZW5ndGhcbiAgaWYgKHJlYXNvbiAmJiByZWFzb24ubGVuZ3RoID4gMTIzKSB7XG4gICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKCdyZWFzb24gYXJndW1lbnQgaGFzIGFuIGludmFsaWQgbGVuZ3RoJyk7XG4gIH1cblxuICAvLyBTdGVwIDMuMVxuICBpZiAodGhpcy5yZWFkeVN0YXRlID09PSBTb2NrSlMuQ0xPU0lORyB8fCB0aGlzLnJlYWR5U3RhdGUgPT09IFNvY2tKUy5DTE9TRUQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBUT0RPIGxvb2sgYXQgZG9jcyB0byBkZXRlcm1pbmUgaG93IHRvIHNldCB0aGlzXG4gIHZhciB3YXNDbGVhbiA9IHRydWU7XG4gIHRoaXMuX2Nsb3NlKGNvZGUgfHwgMTAwMCwgcmVhc29uIHx8ICdOb3JtYWwgY2xvc3VyZScsIHdhc0NsZWFuKTtcbn07XG5cblNvY2tKUy5wcm90b3R5cGUuc2VuZCA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgLy8gIzEzIC0gY29udmVydCBhbnl0aGluZyBub24tc3RyaW5nIHRvIHN0cmluZ1xuICAvLyBUT0RPIHRoaXMgY3VycmVudGx5IHR1cm5zIG9iamVjdHMgaW50byBbb2JqZWN0IE9iamVjdF1cbiAgaWYgKHR5cGVvZiBkYXRhICE9PSAnc3RyaW5nJykge1xuICAgIGRhdGEgPSAnJyArIGRhdGE7XG4gIH1cbiAgaWYgKHRoaXMucmVhZHlTdGF0ZSA9PT0gU29ja0pTLkNPTk5FQ1RJTkcpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWRTdGF0ZUVycm9yOiBUaGUgY29ubmVjdGlvbiBoYXMgbm90IGJlZW4gZXN0YWJsaXNoZWQgeWV0Jyk7XG4gIH1cbiAgaWYgKHRoaXMucmVhZHlTdGF0ZSAhPT0gU29ja0pTLk9QRU4pIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdGhpcy5fdHJhbnNwb3J0LnNlbmQoZXNjYXBlLnF1b3RlKGRhdGEpKTtcbn07XG5cblNvY2tKUy52ZXJzaW9uID0gcmVxdWlyZSgnLi92ZXJzaW9uJyk7XG5cblNvY2tKUy5DT05ORUNUSU5HID0gMDtcblNvY2tKUy5PUEVOID0gMTtcblNvY2tKUy5DTE9TSU5HID0gMjtcblNvY2tKUy5DTE9TRUQgPSAzO1xuXG5Tb2NrSlMucHJvdG90eXBlLl9yZWNlaXZlSW5mbyA9IGZ1bmN0aW9uKGluZm8sIHJ0dCkge1xuICBkZWJ1ZygnX3JlY2VpdmVJbmZvJywgcnR0KTtcbiAgdGhpcy5faXIgPSBudWxsO1xuICBpZiAoIWluZm8pIHtcbiAgICB0aGlzLl9jbG9zZSgxMDAyLCAnQ2Fubm90IGNvbm5lY3QgdG8gc2VydmVyJyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gZXN0YWJsaXNoIGEgcm91bmQtdHJpcCB0aW1lb3V0IChSVE8pIGJhc2VkIG9uIHRoZVxuICAvLyByb3VuZC10cmlwIHRpbWUgKFJUVClcbiAgdGhpcy5fcnRvID0gdGhpcy5jb3VudFJUTyhydHQpO1xuICAvLyBhbGxvdyBzZXJ2ZXIgdG8gb3ZlcnJpZGUgdXJsIHVzZWQgZm9yIHRoZSBhY3R1YWwgdHJhbnNwb3J0XG4gIHRoaXMuX3RyYW5zVXJsID0gaW5mby5iYXNlX3VybCA/IGluZm8uYmFzZV91cmwgOiB0aGlzLnVybDtcbiAgaW5mbyA9IG9iamVjdFV0aWxzLmV4dGVuZChpbmZvLCB0aGlzLl91cmxJbmZvKTtcbiAgZGVidWcoJ2luZm8nLCBpbmZvKTtcbiAgLy8gZGV0ZXJtaW5lIGxpc3Qgb2YgZGVzaXJlZCBhbmQgc3VwcG9ydGVkIHRyYW5zcG9ydHNcbiAgdmFyIGVuYWJsZWRUcmFuc3BvcnRzID0gdHJhbnNwb3J0cy5maWx0ZXJUb0VuYWJsZWQodGhpcy5fdHJhbnNwb3J0c1doaXRlbGlzdCwgaW5mbyk7XG4gIHRoaXMuX3RyYW5zcG9ydHMgPSBlbmFibGVkVHJhbnNwb3J0cy5tYWluO1xuICBkZWJ1Zyh0aGlzLl90cmFuc3BvcnRzLmxlbmd0aCArICcgZW5hYmxlZCB0cmFuc3BvcnRzJyk7XG5cbiAgdGhpcy5fY29ubmVjdCgpO1xufTtcblxuU29ja0pTLnByb3RvdHlwZS5fY29ubmVjdCA9IGZ1bmN0aW9uKCkge1xuICBmb3IgKHZhciBUcmFuc3BvcnQgPSB0aGlzLl90cmFuc3BvcnRzLnNoaWZ0KCk7IFRyYW5zcG9ydDsgVHJhbnNwb3J0ID0gdGhpcy5fdHJhbnNwb3J0cy5zaGlmdCgpKSB7XG4gICAgZGVidWcoJ2F0dGVtcHQnLCBUcmFuc3BvcnQudHJhbnNwb3J0TmFtZSk7XG4gICAgaWYgKFRyYW5zcG9ydC5uZWVkQm9keSkge1xuICAgICAgaWYgKCFnbG9iYWwuZG9jdW1lbnQuYm9keSB8fFxuICAgICAgICAgICh0eXBlb2YgZ2xvYmFsLmRvY3VtZW50LnJlYWR5U3RhdGUgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgICAgICBnbG9iYWwuZG9jdW1lbnQucmVhZHlTdGF0ZSAhPT0gJ2NvbXBsZXRlJyAmJlxuICAgICAgICAgICAgZ2xvYmFsLmRvY3VtZW50LnJlYWR5U3RhdGUgIT09ICdpbnRlcmFjdGl2ZScpKSB7XG4gICAgICAgIGRlYnVnKCd3YWl0aW5nIGZvciBib2R5Jyk7XG4gICAgICAgIHRoaXMuX3RyYW5zcG9ydHMudW5zaGlmdChUcmFuc3BvcnQpO1xuICAgICAgICBldmVudFV0aWxzLmF0dGFjaEV2ZW50KCdsb2FkJywgdGhpcy5fY29ubmVjdC5iaW5kKHRoaXMpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNhbGN1bGF0ZSB0aW1lb3V0IGJhc2VkIG9uIFJUTyBhbmQgcm91bmQgdHJpcHMuIERlZmF1bHQgdG8gNXNcbiAgICB2YXIgdGltZW91dE1zID0gTWF0aC5tYXgodGhpcy5fdGltZW91dCwgKHRoaXMuX3J0byAqIFRyYW5zcG9ydC5yb3VuZFRyaXBzKSB8fCA1MDAwKTtcbiAgICB0aGlzLl90cmFuc3BvcnRUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KHRoaXMuX3RyYW5zcG9ydFRpbWVvdXQuYmluZCh0aGlzKSwgdGltZW91dE1zKTtcbiAgICBkZWJ1ZygndXNpbmcgdGltZW91dCcsIHRpbWVvdXRNcyk7XG5cbiAgICB2YXIgdHJhbnNwb3J0VXJsID0gdXJsVXRpbHMuYWRkUGF0aCh0aGlzLl90cmFuc1VybCwgJy8nICsgdGhpcy5fc2VydmVyICsgJy8nICsgdGhpcy5fZ2VuZXJhdGVTZXNzaW9uSWQoKSk7XG4gICAgdmFyIG9wdGlvbnMgPSB0aGlzLl90cmFuc3BvcnRPcHRpb25zW1RyYW5zcG9ydC50cmFuc3BvcnROYW1lXTtcbiAgICBkZWJ1ZygndHJhbnNwb3J0IHVybCcsIHRyYW5zcG9ydFVybCk7XG4gICAgdmFyIHRyYW5zcG9ydE9iaiA9IG5ldyBUcmFuc3BvcnQodHJhbnNwb3J0VXJsLCB0aGlzLl90cmFuc1VybCwgb3B0aW9ucyk7XG4gICAgdHJhbnNwb3J0T2JqLm9uKCdtZXNzYWdlJywgdGhpcy5fdHJhbnNwb3J0TWVzc2FnZS5iaW5kKHRoaXMpKTtcbiAgICB0cmFuc3BvcnRPYmoub25jZSgnY2xvc2UnLCB0aGlzLl90cmFuc3BvcnRDbG9zZS5iaW5kKHRoaXMpKTtcbiAgICB0cmFuc3BvcnRPYmoudHJhbnNwb3J0TmFtZSA9IFRyYW5zcG9ydC50cmFuc3BvcnROYW1lO1xuICAgIHRoaXMuX3RyYW5zcG9ydCA9IHRyYW5zcG9ydE9iajtcblxuICAgIHJldHVybjtcbiAgfVxuICB0aGlzLl9jbG9zZSgyMDAwLCAnQWxsIHRyYW5zcG9ydHMgZmFpbGVkJywgZmFsc2UpO1xufTtcblxuU29ja0pTLnByb3RvdHlwZS5fdHJhbnNwb3J0VGltZW91dCA9IGZ1bmN0aW9uKCkge1xuICBkZWJ1ZygnX3RyYW5zcG9ydFRpbWVvdXQnKTtcbiAgaWYgKHRoaXMucmVhZHlTdGF0ZSA9PT0gU29ja0pTLkNPTk5FQ1RJTkcpIHtcbiAgICBpZiAodGhpcy5fdHJhbnNwb3J0KSB7XG4gICAgICB0aGlzLl90cmFuc3BvcnQuY2xvc2UoKTtcbiAgICB9XG5cbiAgICB0aGlzLl90cmFuc3BvcnRDbG9zZSgyMDA3LCAnVHJhbnNwb3J0IHRpbWVkIG91dCcpO1xuICB9XG59O1xuXG5Tb2NrSlMucHJvdG90eXBlLl90cmFuc3BvcnRNZXNzYWdlID0gZnVuY3Rpb24obXNnKSB7XG4gIGRlYnVnKCdfdHJhbnNwb3J0TWVzc2FnZScsIG1zZyk7XG4gIHZhciBzZWxmID0gdGhpc1xuICAgICwgdHlwZSA9IG1zZy5zbGljZSgwLCAxKVxuICAgICwgY29udGVudCA9IG1zZy5zbGljZSgxKVxuICAgICwgcGF5bG9hZFxuICAgIDtcblxuICAvLyBmaXJzdCBjaGVjayBmb3IgbWVzc2FnZXMgdGhhdCBkb24ndCBuZWVkIGEgcGF5bG9hZFxuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlICdvJzpcbiAgICAgIHRoaXMuX29wZW4oKTtcbiAgICAgIHJldHVybjtcbiAgICBjYXNlICdoJzpcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2hlYXJ0YmVhdCcpKTtcbiAgICAgIGRlYnVnKCdoZWFydGJlYXQnLCB0aGlzLnRyYW5zcG9ydCk7XG4gICAgICByZXR1cm47XG4gIH1cblxuICBpZiAoY29udGVudCkge1xuICAgIHRyeSB7XG4gICAgICBwYXlsb2FkID0gSlNPTi5wYXJzZShjb250ZW50KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBkZWJ1ZygnYmFkIGpzb24nLCBjb250ZW50KTtcbiAgICB9XG4gIH1cblxuICBpZiAodHlwZW9mIHBheWxvYWQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgZGVidWcoJ2VtcHR5IHBheWxvYWQnLCBjb250ZW50KTtcbiAgICByZXR1cm47XG4gIH1cblxuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlICdhJzpcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHBheWxvYWQpKSB7XG4gICAgICAgIHBheWxvYWQuZm9yRWFjaChmdW5jdGlvbihwKSB7XG4gICAgICAgICAgZGVidWcoJ21lc3NhZ2UnLCBzZWxmLnRyYW5zcG9ydCwgcCk7XG4gICAgICAgICAgc2VsZi5kaXNwYXRjaEV2ZW50KG5ldyBUcmFuc3BvcnRNZXNzYWdlRXZlbnQocCkpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ20nOlxuICAgICAgZGVidWcoJ21lc3NhZ2UnLCB0aGlzLnRyYW5zcG9ydCwgcGF5bG9hZCk7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IFRyYW5zcG9ydE1lc3NhZ2VFdmVudChwYXlsb2FkKSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdjJzpcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHBheWxvYWQpICYmIHBheWxvYWQubGVuZ3RoID09PSAyKSB7XG4gICAgICAgIHRoaXMuX2Nsb3NlKHBheWxvYWRbMF0sIHBheWxvYWRbMV0sIHRydWUpO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gIH1cbn07XG5cblNvY2tKUy5wcm90b3R5cGUuX3RyYW5zcG9ydENsb3NlID0gZnVuY3Rpb24oY29kZSwgcmVhc29uKSB7XG4gIGRlYnVnKCdfdHJhbnNwb3J0Q2xvc2UnLCB0aGlzLnRyYW5zcG9ydCwgY29kZSwgcmVhc29uKTtcbiAgaWYgKHRoaXMuX3RyYW5zcG9ydCkge1xuICAgIHRoaXMuX3RyYW5zcG9ydC5yZW1vdmVBbGxMaXN0ZW5lcnMoKTtcbiAgICB0aGlzLl90cmFuc3BvcnQgPSBudWxsO1xuICAgIHRoaXMudHJhbnNwb3J0ID0gbnVsbDtcbiAgfVxuXG4gIGlmICghdXNlclNldENvZGUoY29kZSkgJiYgY29kZSAhPT0gMjAwMCAmJiB0aGlzLnJlYWR5U3RhdGUgPT09IFNvY2tKUy5DT05ORUNUSU5HKSB7XG4gICAgdGhpcy5fY29ubmVjdCgpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRoaXMuX2Nsb3NlKGNvZGUsIHJlYXNvbik7XG59O1xuXG5Tb2NrSlMucHJvdG90eXBlLl9vcGVuID0gZnVuY3Rpb24oKSB7XG4gIGRlYnVnKCdfb3BlbicsIHRoaXMuX3RyYW5zcG9ydCAmJiB0aGlzLl90cmFuc3BvcnQudHJhbnNwb3J0TmFtZSwgdGhpcy5yZWFkeVN0YXRlKTtcbiAgaWYgKHRoaXMucmVhZHlTdGF0ZSA9PT0gU29ja0pTLkNPTk5FQ1RJTkcpIHtcbiAgICBpZiAodGhpcy5fdHJhbnNwb3J0VGltZW91dElkKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5fdHJhbnNwb3J0VGltZW91dElkKTtcbiAgICAgIHRoaXMuX3RyYW5zcG9ydFRpbWVvdXRJZCA9IG51bGw7XG4gICAgfVxuICAgIHRoaXMucmVhZHlTdGF0ZSA9IFNvY2tKUy5PUEVOO1xuICAgIHRoaXMudHJhbnNwb3J0ID0gdGhpcy5fdHJhbnNwb3J0LnRyYW5zcG9ydE5hbWU7XG4gICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnb3BlbicpKTtcbiAgICBkZWJ1ZygnY29ubmVjdGVkJywgdGhpcy50cmFuc3BvcnQpO1xuICB9IGVsc2Uge1xuICAgIC8vIFRoZSBzZXJ2ZXIgbWlnaHQgaGF2ZSBiZWVuIHJlc3RhcnRlZCwgYW5kIGxvc3QgdHJhY2sgb2Ygb3VyXG4gICAgLy8gY29ubmVjdGlvbi5cbiAgICB0aGlzLl9jbG9zZSgxMDA2LCAnU2VydmVyIGxvc3Qgc2Vzc2lvbicpO1xuICB9XG59O1xuXG5Tb2NrSlMucHJvdG90eXBlLl9jbG9zZSA9IGZ1bmN0aW9uKGNvZGUsIHJlYXNvbiwgd2FzQ2xlYW4pIHtcbiAgZGVidWcoJ19jbG9zZScsIHRoaXMudHJhbnNwb3J0LCBjb2RlLCByZWFzb24sIHdhc0NsZWFuLCB0aGlzLnJlYWR5U3RhdGUpO1xuICB2YXIgZm9yY2VGYWlsID0gZmFsc2U7XG5cbiAgaWYgKHRoaXMuX2lyKSB7XG4gICAgZm9yY2VGYWlsID0gdHJ1ZTtcbiAgICB0aGlzLl9pci5jbG9zZSgpO1xuICAgIHRoaXMuX2lyID0gbnVsbDtcbiAgfVxuICBpZiAodGhpcy5fdHJhbnNwb3J0KSB7XG4gICAgdGhpcy5fdHJhbnNwb3J0LmNsb3NlKCk7XG4gICAgdGhpcy5fdHJhbnNwb3J0ID0gbnVsbDtcbiAgICB0aGlzLnRyYW5zcG9ydCA9IG51bGw7XG4gIH1cblxuICBpZiAodGhpcy5yZWFkeVN0YXRlID09PSBTb2NrSlMuQ0xPU0VEKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkU3RhdGVFcnJvcjogU29ja0pTIGhhcyBhbHJlYWR5IGJlZW4gY2xvc2VkJyk7XG4gIH1cblxuICB0aGlzLnJlYWR5U3RhdGUgPSBTb2NrSlMuQ0xPU0lORztcbiAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJlYWR5U3RhdGUgPSBTb2NrSlMuQ0xPU0VEO1xuXG4gICAgaWYgKGZvcmNlRmFpbCkge1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnZXJyb3InKSk7XG4gICAgfVxuXG4gICAgdmFyIGUgPSBuZXcgQ2xvc2VFdmVudCgnY2xvc2UnKTtcbiAgICBlLndhc0NsZWFuID0gd2FzQ2xlYW4gfHwgZmFsc2U7XG4gICAgZS5jb2RlID0gY29kZSB8fCAxMDAwO1xuICAgIGUucmVhc29uID0gcmVhc29uO1xuXG4gICAgdGhpcy5kaXNwYXRjaEV2ZW50KGUpO1xuICAgIHRoaXMub25tZXNzYWdlID0gdGhpcy5vbmNsb3NlID0gdGhpcy5vbmVycm9yID0gbnVsbDtcbiAgICBkZWJ1ZygnZGlzY29ubmVjdGVkJyk7XG4gIH0uYmluZCh0aGlzKSwgMCk7XG59O1xuXG4vLyBTZWU6IGh0dHA6Ly93d3cuZXJnLmFiZG4uYWMudWsvfmdlcnJpdC9kY2NwL25vdGVzL2NjaWQyL3J0b19lc3RpbWF0b3IvXG4vLyBhbmQgUkZDIDI5ODguXG5Tb2NrSlMucHJvdG90eXBlLmNvdW50UlRPID0gZnVuY3Rpb24ocnR0KSB7XG4gIC8vIEluIGEgbG9jYWwgZW52aXJvbm1lbnQsIHdoZW4gdXNpbmcgSUU4LzkgYW5kIHRoZSBganNvbnAtcG9sbGluZ2BcbiAgLy8gdHJhbnNwb3J0IHRoZSB0aW1lIG5lZWRlZCB0byBlc3RhYmxpc2ggYSBjb25uZWN0aW9uICh0aGUgdGltZSB0aGF0IHBhc3NcbiAgLy8gZnJvbSB0aGUgb3BlbmluZyBvZiB0aGUgdHJhbnNwb3J0IHRvIHRoZSBjYWxsIG9mIGBfZGlzcGF0Y2hPcGVuYCkgaXNcbiAgLy8gYXJvdW5kIDIwMG1zZWMgKHRoZSBsb3dlciBib3VuZCB1c2VkIGluIHRoZSBhcnRpY2xlIGFib3ZlKSBhbmQgdGhpc1xuICAvLyBjYXVzZXMgc3B1cmlvdXMgdGltZW91dHMuIEZvciB0aGlzIHJlYXNvbiB3ZSBjYWxjdWxhdGUgYSB2YWx1ZSBzbGlnaHRseVxuICAvLyBsYXJnZXIgdGhhbiB0aGF0IHVzZWQgaW4gdGhlIGFydGljbGUuXG4gIGlmIChydHQgPiAxMDApIHtcbiAgICByZXR1cm4gNCAqIHJ0dDsgLy8gcnRvID4gNDAwbXNlY1xuICB9XG4gIHJldHVybiAzMDAgKyBydHQ7IC8vIDMwMG1zZWMgPCBydG8gPD0gNDAwbXNlY1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihhdmFpbGFibGVUcmFuc3BvcnRzKSB7XG4gIHRyYW5zcG9ydHMgPSB0cmFuc3BvcnQoYXZhaWxhYmxlVHJhbnNwb3J0cyk7XG4gIHJlcXVpcmUoJy4vaWZyYW1lLWJvb3RzdHJhcCcpKFNvY2tKUywgYXZhaWxhYmxlVHJhbnNwb3J0cyk7XG4gIHJldHVybiBTb2NrSlM7XG59O1xuIiwiLyogZXNsaW50LWRpc2FibGUgKi9cbi8qIGpzY3M6IGRpc2FibGUgKi9cbid1c2Ugc3RyaWN0JztcblxuLy8gcHVsbGVkIHNwZWNpZmljIHNoaW1zIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2VzLXNoaW1zL2VzNS1zaGltXG5cbnZhciBBcnJheVByb3RvdHlwZSA9IEFycmF5LnByb3RvdHlwZTtcbnZhciBPYmplY3RQcm90b3R5cGUgPSBPYmplY3QucHJvdG90eXBlO1xudmFyIEZ1bmN0aW9uUHJvdG90eXBlID0gRnVuY3Rpb24ucHJvdG90eXBlO1xudmFyIFN0cmluZ1Byb3RvdHlwZSA9IFN0cmluZy5wcm90b3R5cGU7XG52YXIgYXJyYXlfc2xpY2UgPSBBcnJheVByb3RvdHlwZS5zbGljZTtcblxudmFyIF90b1N0cmluZyA9IE9iamVjdFByb3RvdHlwZS50b1N0cmluZztcbnZhciBpc0Z1bmN0aW9uID0gZnVuY3Rpb24gKHZhbCkge1xuICAgIHJldHVybiBPYmplY3RQcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xufTtcbnZhciBpc0FycmF5ID0gZnVuY3Rpb24gaXNBcnJheShvYmopIHtcbiAgICByZXR1cm4gX3RvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG52YXIgaXNTdHJpbmcgPSBmdW5jdGlvbiBpc1N0cmluZyhvYmopIHtcbiAgICByZXR1cm4gX3RvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgU3RyaW5nXSc7XG59O1xuXG52YXIgc3VwcG9ydHNEZXNjcmlwdG9ycyA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSAmJiAoZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSwgJ3gnLCB7fSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2ggKGUpIHsgLyogdGhpcyBpcyBFUzMgKi9cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn0oKSk7XG5cbi8vIERlZmluZSBjb25maWd1cmFibGUsIHdyaXRhYmxlIGFuZCBub24tZW51bWVyYWJsZSBwcm9wc1xuLy8gaWYgdGhleSBkb24ndCBleGlzdC5cbnZhciBkZWZpbmVQcm9wZXJ0eTtcbmlmIChzdXBwb3J0c0Rlc2NyaXB0b3JzKSB7XG4gICAgZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbiAob2JqZWN0LCBuYW1lLCBtZXRob2QsIGZvcmNlQXNzaWduKSB7XG4gICAgICAgIGlmICghZm9yY2VBc3NpZ24gJiYgKG5hbWUgaW4gb2JqZWN0KSkgeyByZXR1cm47IH1cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgbmFtZSwge1xuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHZhbHVlOiBtZXRob2RcbiAgICAgICAgfSk7XG4gICAgfTtcbn0gZWxzZSB7XG4gICAgZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbiAob2JqZWN0LCBuYW1lLCBtZXRob2QsIGZvcmNlQXNzaWduKSB7XG4gICAgICAgIGlmICghZm9yY2VBc3NpZ24gJiYgKG5hbWUgaW4gb2JqZWN0KSkgeyByZXR1cm47IH1cbiAgICAgICAgb2JqZWN0W25hbWVdID0gbWV0aG9kO1xuICAgIH07XG59XG52YXIgZGVmaW5lUHJvcGVydGllcyA9IGZ1bmN0aW9uIChvYmplY3QsIG1hcCwgZm9yY2VBc3NpZ24pIHtcbiAgICBmb3IgKHZhciBuYW1lIGluIG1hcCkge1xuICAgICAgICBpZiAoT2JqZWN0UHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobWFwLCBuYW1lKSkge1xuICAgICAgICAgIGRlZmluZVByb3BlcnR5KG9iamVjdCwgbmFtZSwgbWFwW25hbWVdLCBmb3JjZUFzc2lnbik7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG52YXIgdG9PYmplY3QgPSBmdW5jdGlvbiAobykge1xuICAgIGlmIChvID09IG51bGwpIHsgLy8gdGhpcyBtYXRjaGVzIGJvdGggbnVsbCBhbmQgdW5kZWZpbmVkXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJjYW4ndCBjb252ZXJ0IFwiICsgbyArICcgdG8gb2JqZWN0Jyk7XG4gICAgfVxuICAgIHJldHVybiBPYmplY3Qobyk7XG59O1xuXG4vL1xuLy8gVXRpbFxuLy8gPT09PT09XG4vL1xuXG4vLyBFUzUgOS40XG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3g5LjRcbi8vIGh0dHA6Ly9qc3BlcmYuY29tL3RvLWludGVnZXJcblxuZnVuY3Rpb24gdG9JbnRlZ2VyKG51bSkge1xuICAgIHZhciBuID0gK251bTtcbiAgICBpZiAobiAhPT0gbikgeyAvLyBpc05hTlxuICAgICAgICBuID0gMDtcbiAgICB9IGVsc2UgaWYgKG4gIT09IDAgJiYgbiAhPT0gKDEgLyAwKSAmJiBuICE9PSAtKDEgLyAwKSkge1xuICAgICAgICBuID0gKG4gPiAwIHx8IC0xKSAqIE1hdGguZmxvb3IoTWF0aC5hYnMobikpO1xuICAgIH1cbiAgICByZXR1cm4gbjtcbn1cblxuZnVuY3Rpb24gVG9VaW50MzIoeCkge1xuICAgIHJldHVybiB4ID4+PiAwO1xufVxuXG4vL1xuLy8gRnVuY3Rpb25cbi8vID09PT09PT09XG4vL1xuXG4vLyBFUy01IDE1LjMuNC41XG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS4zLjQuNVxuXG5mdW5jdGlvbiBFbXB0eSgpIHt9XG5cbmRlZmluZVByb3BlcnRpZXMoRnVuY3Rpb25Qcm90b3R5cGUsIHtcbiAgICBiaW5kOiBmdW5jdGlvbiBiaW5kKHRoYXQpIHsgLy8gLmxlbmd0aCBpcyAxXG4gICAgICAgIC8vIDEuIExldCBUYXJnZXQgYmUgdGhlIHRoaXMgdmFsdWUuXG4gICAgICAgIHZhciB0YXJnZXQgPSB0aGlzO1xuICAgICAgICAvLyAyLiBJZiBJc0NhbGxhYmxlKFRhcmdldCkgaXMgZmFsc2UsIHRocm93IGEgVHlwZUVycm9yIGV4Y2VwdGlvbi5cbiAgICAgICAgaWYgKCFpc0Z1bmN0aW9uKHRhcmdldCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Z1bmN0aW9uLnByb3RvdHlwZS5iaW5kIGNhbGxlZCBvbiBpbmNvbXBhdGlibGUgJyArIHRhcmdldCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gMy4gTGV0IEEgYmUgYSBuZXcgKHBvc3NpYmx5IGVtcHR5KSBpbnRlcm5hbCBsaXN0IG9mIGFsbCBvZiB0aGVcbiAgICAgICAgLy8gICBhcmd1bWVudCB2YWx1ZXMgcHJvdmlkZWQgYWZ0ZXIgdGhpc0FyZyAoYXJnMSwgYXJnMiBldGMpLCBpbiBvcmRlci5cbiAgICAgICAgLy8gWFhYIHNsaWNlZEFyZ3Mgd2lsbCBzdGFuZCBpbiBmb3IgXCJBXCIgaWYgdXNlZFxuICAgICAgICB2YXIgYXJncyA9IGFycmF5X3NsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTsgLy8gZm9yIG5vcm1hbCBjYWxsXG4gICAgICAgIC8vIDQuIExldCBGIGJlIGEgbmV3IG5hdGl2ZSBFQ01BU2NyaXB0IG9iamVjdC5cbiAgICAgICAgLy8gMTEuIFNldCB0aGUgW1tQcm90b3R5cGVdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBGIHRvIHRoZSBzdGFuZGFyZFxuICAgICAgICAvLyAgIGJ1aWx0LWluIEZ1bmN0aW9uIHByb3RvdHlwZSBvYmplY3QgYXMgc3BlY2lmaWVkIGluIDE1LjMuMy4xLlxuICAgICAgICAvLyAxMi4gU2V0IHRoZSBbW0NhbGxdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBGIGFzIGRlc2NyaWJlZCBpblxuICAgICAgICAvLyAgIDE1LjMuNC41LjEuXG4gICAgICAgIC8vIDEzLiBTZXQgdGhlIFtbQ29uc3RydWN0XV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgRiBhcyBkZXNjcmliZWQgaW5cbiAgICAgICAgLy8gICAxNS4zLjQuNS4yLlxuICAgICAgICAvLyAxNC4gU2V0IHRoZSBbW0hhc0luc3RhbmNlXV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgRiBhcyBkZXNjcmliZWQgaW5cbiAgICAgICAgLy8gICAxNS4zLjQuNS4zLlxuICAgICAgICB2YXIgYmluZGVyID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIGJvdW5kKSB7XG4gICAgICAgICAgICAgICAgLy8gMTUuMy40LjUuMiBbW0NvbnN0cnVjdF1dXG4gICAgICAgICAgICAgICAgLy8gV2hlbiB0aGUgW1tDb25zdHJ1Y3RdXSBpbnRlcm5hbCBtZXRob2Qgb2YgYSBmdW5jdGlvbiBvYmplY3QsXG4gICAgICAgICAgICAgICAgLy8gRiB0aGF0IHdhcyBjcmVhdGVkIHVzaW5nIHRoZSBiaW5kIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aXRoIGFcbiAgICAgICAgICAgICAgICAvLyBsaXN0IG9mIGFyZ3VtZW50cyBFeHRyYUFyZ3MsIHRoZSBmb2xsb3dpbmcgc3RlcHMgYXJlIHRha2VuOlxuICAgICAgICAgICAgICAgIC8vIDEuIExldCB0YXJnZXQgYmUgdGhlIHZhbHVlIG9mIEYncyBbW1RhcmdldEZ1bmN0aW9uXV1cbiAgICAgICAgICAgICAgICAvLyAgIGludGVybmFsIHByb3BlcnR5LlxuICAgICAgICAgICAgICAgIC8vIDIuIElmIHRhcmdldCBoYXMgbm8gW1tDb25zdHJ1Y3RdXSBpbnRlcm5hbCBtZXRob2QsIGFcbiAgICAgICAgICAgICAgICAvLyAgIFR5cGVFcnJvciBleGNlcHRpb24gaXMgdGhyb3duLlxuICAgICAgICAgICAgICAgIC8vIDMuIExldCBib3VuZEFyZ3MgYmUgdGhlIHZhbHVlIG9mIEYncyBbW0JvdW5kQXJnc11dIGludGVybmFsXG4gICAgICAgICAgICAgICAgLy8gICBwcm9wZXJ0eS5cbiAgICAgICAgICAgICAgICAvLyA0LiBMZXQgYXJncyBiZSBhIG5ldyBsaXN0IGNvbnRhaW5pbmcgdGhlIHNhbWUgdmFsdWVzIGFzIHRoZVxuICAgICAgICAgICAgICAgIC8vICAgbGlzdCBib3VuZEFyZ3MgaW4gdGhlIHNhbWUgb3JkZXIgZm9sbG93ZWQgYnkgdGhlIHNhbWVcbiAgICAgICAgICAgICAgICAvLyAgIHZhbHVlcyBhcyB0aGUgbGlzdCBFeHRyYUFyZ3MgaW4gdGhlIHNhbWUgb3JkZXIuXG4gICAgICAgICAgICAgICAgLy8gNS4gUmV0dXJuIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tDb25zdHJ1Y3RdXSBpbnRlcm5hbFxuICAgICAgICAgICAgICAgIC8vICAgbWV0aG9kIG9mIHRhcmdldCBwcm92aWRpbmcgYXJncyBhcyB0aGUgYXJndW1lbnRzLlxuXG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHRhcmdldC5hcHBseShcbiAgICAgICAgICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgICAgICAgICAgYXJncy5jb25jYXQoYXJyYXlfc2xpY2UuY2FsbChhcmd1bWVudHMpKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgaWYgKE9iamVjdChyZXN1bHQpID09PSByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gMTUuMy40LjUuMSBbW0NhbGxdXVxuICAgICAgICAgICAgICAgIC8vIFdoZW4gdGhlIFtbQ2FsbF1dIGludGVybmFsIG1ldGhvZCBvZiBhIGZ1bmN0aW9uIG9iamVjdCwgRixcbiAgICAgICAgICAgICAgICAvLyB3aGljaCB3YXMgY3JlYXRlZCB1c2luZyB0aGUgYmluZCBmdW5jdGlvbiBpcyBjYWxsZWQgd2l0aCBhXG4gICAgICAgICAgICAgICAgLy8gdGhpcyB2YWx1ZSBhbmQgYSBsaXN0IG9mIGFyZ3VtZW50cyBFeHRyYUFyZ3MsIHRoZSBmb2xsb3dpbmdcbiAgICAgICAgICAgICAgICAvLyBzdGVwcyBhcmUgdGFrZW46XG4gICAgICAgICAgICAgICAgLy8gMS4gTGV0IGJvdW5kQXJncyBiZSB0aGUgdmFsdWUgb2YgRidzIFtbQm91bmRBcmdzXV0gaW50ZXJuYWxcbiAgICAgICAgICAgICAgICAvLyAgIHByb3BlcnR5LlxuICAgICAgICAgICAgICAgIC8vIDIuIExldCBib3VuZFRoaXMgYmUgdGhlIHZhbHVlIG9mIEYncyBbW0JvdW5kVGhpc11dIGludGVybmFsXG4gICAgICAgICAgICAgICAgLy8gICBwcm9wZXJ0eS5cbiAgICAgICAgICAgICAgICAvLyAzLiBMZXQgdGFyZ2V0IGJlIHRoZSB2YWx1ZSBvZiBGJ3MgW1tUYXJnZXRGdW5jdGlvbl1dIGludGVybmFsXG4gICAgICAgICAgICAgICAgLy8gICBwcm9wZXJ0eS5cbiAgICAgICAgICAgICAgICAvLyA0LiBMZXQgYXJncyBiZSBhIG5ldyBsaXN0IGNvbnRhaW5pbmcgdGhlIHNhbWUgdmFsdWVzIGFzIHRoZVxuICAgICAgICAgICAgICAgIC8vICAgbGlzdCBib3VuZEFyZ3MgaW4gdGhlIHNhbWUgb3JkZXIgZm9sbG93ZWQgYnkgdGhlIHNhbWVcbiAgICAgICAgICAgICAgICAvLyAgIHZhbHVlcyBhcyB0aGUgbGlzdCBFeHRyYUFyZ3MgaW4gdGhlIHNhbWUgb3JkZXIuXG4gICAgICAgICAgICAgICAgLy8gNS4gUmV0dXJuIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tDYWxsXV0gaW50ZXJuYWwgbWV0aG9kXG4gICAgICAgICAgICAgICAgLy8gICBvZiB0YXJnZXQgcHJvdmlkaW5nIGJvdW5kVGhpcyBhcyB0aGUgdGhpcyB2YWx1ZSBhbmRcbiAgICAgICAgICAgICAgICAvLyAgIHByb3ZpZGluZyBhcmdzIGFzIHRoZSBhcmd1bWVudHMuXG5cbiAgICAgICAgICAgICAgICAvLyBlcXVpdjogdGFyZ2V0LmNhbGwodGhpcywgLi4uYm91bmRBcmdzLCAuLi5hcmdzKVxuICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXQuYXBwbHkoXG4gICAgICAgICAgICAgICAgICAgIHRoYXQsXG4gICAgICAgICAgICAgICAgICAgIGFyZ3MuY29uY2F0KGFycmF5X3NsaWNlLmNhbGwoYXJndW1lbnRzKSlcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfTtcblxuICAgICAgICAvLyAxNS4gSWYgdGhlIFtbQ2xhc3NdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBUYXJnZXQgaXMgXCJGdW5jdGlvblwiLCB0aGVuXG4gICAgICAgIC8vICAgICBhLiBMZXQgTCBiZSB0aGUgbGVuZ3RoIHByb3BlcnR5IG9mIFRhcmdldCBtaW51cyB0aGUgbGVuZ3RoIG9mIEEuXG4gICAgICAgIC8vICAgICBiLiBTZXQgdGhlIGxlbmd0aCBvd24gcHJvcGVydHkgb2YgRiB0byBlaXRoZXIgMCBvciBMLCB3aGljaGV2ZXIgaXNcbiAgICAgICAgLy8gICAgICAgbGFyZ2VyLlxuICAgICAgICAvLyAxNi4gRWxzZSBzZXQgdGhlIGxlbmd0aCBvd24gcHJvcGVydHkgb2YgRiB0byAwLlxuXG4gICAgICAgIHZhciBib3VuZExlbmd0aCA9IE1hdGgubWF4KDAsIHRhcmdldC5sZW5ndGggLSBhcmdzLmxlbmd0aCk7XG5cbiAgICAgICAgLy8gMTcuIFNldCB0aGUgYXR0cmlidXRlcyBvZiB0aGUgbGVuZ3RoIG93biBwcm9wZXJ0eSBvZiBGIHRvIHRoZSB2YWx1ZXNcbiAgICAgICAgLy8gICBzcGVjaWZpZWQgaW4gMTUuMy41LjEuXG4gICAgICAgIHZhciBib3VuZEFyZ3MgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBib3VuZExlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBib3VuZEFyZ3MucHVzaCgnJCcgKyBpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFhYWCBCdWlsZCBhIGR5bmFtaWMgZnVuY3Rpb24gd2l0aCBkZXNpcmVkIGFtb3VudCBvZiBhcmd1bWVudHMgaXMgdGhlIG9ubHlcbiAgICAgICAgLy8gd2F5IHRvIHNldCB0aGUgbGVuZ3RoIHByb3BlcnR5IG9mIGEgZnVuY3Rpb24uXG4gICAgICAgIC8vIEluIGVudmlyb25tZW50cyB3aGVyZSBDb250ZW50IFNlY3VyaXR5IFBvbGljaWVzIGVuYWJsZWQgKENocm9tZSBleHRlbnNpb25zLFxuICAgICAgICAvLyBmb3IgZXguKSBhbGwgdXNlIG9mIGV2YWwgb3IgRnVuY3Rpb24gY29zdHJ1Y3RvciB0aHJvd3MgYW4gZXhjZXB0aW9uLlxuICAgICAgICAvLyBIb3dldmVyIGluIGFsbCBvZiB0aGVzZSBlbnZpcm9ubWVudHMgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQgZXhpc3RzXG4gICAgICAgIC8vIGFuZCBzbyB0aGlzIGNvZGUgd2lsbCBuZXZlciBiZSBleGVjdXRlZC5cbiAgICAgICAgdmFyIGJvdW5kID0gRnVuY3Rpb24oJ2JpbmRlcicsICdyZXR1cm4gZnVuY3Rpb24gKCcgKyBib3VuZEFyZ3Muam9pbignLCcpICsgJyl7IHJldHVybiBiaW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfScpKGJpbmRlcik7XG5cbiAgICAgICAgaWYgKHRhcmdldC5wcm90b3R5cGUpIHtcbiAgICAgICAgICAgIEVtcHR5LnByb3RvdHlwZSA9IHRhcmdldC5wcm90b3R5cGU7XG4gICAgICAgICAgICBib3VuZC5wcm90b3R5cGUgPSBuZXcgRW1wdHkoKTtcbiAgICAgICAgICAgIC8vIENsZWFuIHVwIGRhbmdsaW5nIHJlZmVyZW5jZXMuXG4gICAgICAgICAgICBFbXB0eS5wcm90b3R5cGUgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVE9ET1xuICAgICAgICAvLyAxOC4gU2V0IHRoZSBbW0V4dGVuc2libGVdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBGIHRvIHRydWUuXG5cbiAgICAgICAgLy8gVE9ET1xuICAgICAgICAvLyAxOS4gTGV0IHRocm93ZXIgYmUgdGhlIFtbVGhyb3dUeXBlRXJyb3JdXSBmdW5jdGlvbiBPYmplY3QgKDEzLjIuMykuXG4gICAgICAgIC8vIDIwLiBDYWxsIHRoZSBbW0RlZmluZU93blByb3BlcnR5XV0gaW50ZXJuYWwgbWV0aG9kIG9mIEYgd2l0aFxuICAgICAgICAvLyAgIGFyZ3VtZW50cyBcImNhbGxlclwiLCBQcm9wZXJ0eURlc2NyaXB0b3Ige1tbR2V0XV06IHRocm93ZXIsIFtbU2V0XV06XG4gICAgICAgIC8vICAgdGhyb3dlciwgW1tFbnVtZXJhYmxlXV06IGZhbHNlLCBbW0NvbmZpZ3VyYWJsZV1dOiBmYWxzZX0sIGFuZFxuICAgICAgICAvLyAgIGZhbHNlLlxuICAgICAgICAvLyAyMS4gQ2FsbCB0aGUgW1tEZWZpbmVPd25Qcm9wZXJ0eV1dIGludGVybmFsIG1ldGhvZCBvZiBGIHdpdGhcbiAgICAgICAgLy8gICBhcmd1bWVudHMgXCJhcmd1bWVudHNcIiwgUHJvcGVydHlEZXNjcmlwdG9yIHtbW0dldF1dOiB0aHJvd2VyLFxuICAgICAgICAvLyAgIFtbU2V0XV06IHRocm93ZXIsIFtbRW51bWVyYWJsZV1dOiBmYWxzZSwgW1tDb25maWd1cmFibGVdXTogZmFsc2V9LFxuICAgICAgICAvLyAgIGFuZCBmYWxzZS5cblxuICAgICAgICAvLyBUT0RPXG4gICAgICAgIC8vIE5PVEUgRnVuY3Rpb24gb2JqZWN0cyBjcmVhdGVkIHVzaW5nIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kIGRvIG5vdFxuICAgICAgICAvLyBoYXZlIGEgcHJvdG90eXBlIHByb3BlcnR5IG9yIHRoZSBbW0NvZGVdXSwgW1tGb3JtYWxQYXJhbWV0ZXJzXV0sIGFuZFxuICAgICAgICAvLyBbW1Njb3BlXV0gaW50ZXJuYWwgcHJvcGVydGllcy5cbiAgICAgICAgLy8gWFhYIGNhbid0IGRlbGV0ZSBwcm90b3R5cGUgaW4gcHVyZS1qcy5cblxuICAgICAgICAvLyAyMi4gUmV0dXJuIEYuXG4gICAgICAgIHJldHVybiBib3VuZDtcbiAgICB9XG59KTtcblxuLy9cbi8vIEFycmF5XG4vLyA9PT09PVxuLy9cblxuLy8gRVM1IDE1LjQuMy4yXG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS40LjMuMlxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvaXNBcnJheVxuZGVmaW5lUHJvcGVydGllcyhBcnJheSwgeyBpc0FycmF5OiBpc0FycmF5IH0pO1xuXG5cbnZhciBib3hlZFN0cmluZyA9IE9iamVjdCgnYScpO1xudmFyIHNwbGl0U3RyaW5nID0gYm94ZWRTdHJpbmdbMF0gIT09ICdhJyB8fCAhKDAgaW4gYm94ZWRTdHJpbmcpO1xuXG52YXIgcHJvcGVybHlCb3hlc0NvbnRleHQgPSBmdW5jdGlvbiBwcm9wZXJseUJveGVkKG1ldGhvZCkge1xuICAgIC8vIENoZWNrIG5vZGUgMC42LjIxIGJ1ZyB3aGVyZSB0aGlyZCBwYXJhbWV0ZXIgaXMgbm90IGJveGVkXG4gICAgdmFyIHByb3Blcmx5Qm94ZXNOb25TdHJpY3QgPSB0cnVlO1xuICAgIHZhciBwcm9wZXJseUJveGVzU3RyaWN0ID0gdHJ1ZTtcbiAgICBpZiAobWV0aG9kKSB7XG4gICAgICAgIG1ldGhvZC5jYWxsKCdmb28nLCBmdW5jdGlvbiAoXywgX18sIGNvbnRleHQpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29udGV4dCAhPT0gJ29iamVjdCcpIHsgcHJvcGVybHlCb3hlc05vblN0cmljdCA9IGZhbHNlOyB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG1ldGhvZC5jYWxsKFsxXSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJ3VzZSBzdHJpY3QnO1xuICAgICAgICAgICAgcHJvcGVybHlCb3hlc1N0cmljdCA9IHR5cGVvZiB0aGlzID09PSAnc3RyaW5nJztcbiAgICAgICAgfSwgJ3gnKTtcbiAgICB9XG4gICAgcmV0dXJuICEhbWV0aG9kICYmIHByb3Blcmx5Qm94ZXNOb25TdHJpY3QgJiYgcHJvcGVybHlCb3hlc1N0cmljdDtcbn07XG5cbmRlZmluZVByb3BlcnRpZXMoQXJyYXlQcm90b3R5cGUsIHtcbiAgICBmb3JFYWNoOiBmdW5jdGlvbiBmb3JFYWNoKGZ1biAvKiwgdGhpc3AqLykge1xuICAgICAgICB2YXIgb2JqZWN0ID0gdG9PYmplY3QodGhpcyksXG4gICAgICAgICAgICBzZWxmID0gc3BsaXRTdHJpbmcgJiYgaXNTdHJpbmcodGhpcykgPyB0aGlzLnNwbGl0KCcnKSA6IG9iamVjdCxcbiAgICAgICAgICAgIHRoaXNwID0gYXJndW1lbnRzWzFdLFxuICAgICAgICAgICAgaSA9IC0xLFxuICAgICAgICAgICAgbGVuZ3RoID0gc2VsZi5sZW5ndGggPj4+IDA7XG5cbiAgICAgICAgLy8gSWYgbm8gY2FsbGJhY2sgZnVuY3Rpb24gb3IgaWYgY2FsbGJhY2sgaXMgbm90IGEgY2FsbGFibGUgZnVuY3Rpb25cbiAgICAgICAgaWYgKCFpc0Z1bmN0aW9uKGZ1bikpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTsgLy8gVE9ETyBtZXNzYWdlXG4gICAgICAgIH1cblxuICAgICAgICB3aGlsZSAoKytpIDwgbGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoaSBpbiBzZWxmKSB7XG4gICAgICAgICAgICAgICAgLy8gSW52b2tlIHRoZSBjYWxsYmFjayBmdW5jdGlvbiB3aXRoIGNhbGwsIHBhc3NpbmcgYXJndW1lbnRzOlxuICAgICAgICAgICAgICAgIC8vIGNvbnRleHQsIHByb3BlcnR5IHZhbHVlLCBwcm9wZXJ0eSBrZXksIHRoaXNBcmcgb2JqZWN0XG4gICAgICAgICAgICAgICAgLy8gY29udGV4dFxuICAgICAgICAgICAgICAgIGZ1bi5jYWxsKHRoaXNwLCBzZWxmW2ldLCBpLCBvYmplY3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSwgIXByb3Blcmx5Qm94ZXNDb250ZXh0KEFycmF5UHJvdG90eXBlLmZvckVhY2gpKTtcblxuLy8gRVM1IDE1LjQuNC4xNFxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNC40LjE0XG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9pbmRleE9mXG52YXIgaGFzRmlyZWZveDJJbmRleE9mQnVnID0gQXJyYXkucHJvdG90eXBlLmluZGV4T2YgJiYgWzAsIDFdLmluZGV4T2YoMSwgMikgIT09IC0xO1xuZGVmaW5lUHJvcGVydGllcyhBcnJheVByb3RvdHlwZSwge1xuICAgIGluZGV4T2Y6IGZ1bmN0aW9uIGluZGV4T2Yoc291Z2h0IC8qLCBmcm9tSW5kZXggKi8gKSB7XG4gICAgICAgIHZhciBzZWxmID0gc3BsaXRTdHJpbmcgJiYgaXNTdHJpbmcodGhpcykgPyB0aGlzLnNwbGl0KCcnKSA6IHRvT2JqZWN0KHRoaXMpLFxuICAgICAgICAgICAgbGVuZ3RoID0gc2VsZi5sZW5ndGggPj4+IDA7XG5cbiAgICAgICAgaWYgKCFsZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBpID0gdG9JbnRlZ2VyKGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBoYW5kbGUgbmVnYXRpdmUgaW5kaWNlc1xuICAgICAgICBpID0gaSA+PSAwID8gaSA6IE1hdGgubWF4KDAsIGxlbmd0aCArIGkpO1xuICAgICAgICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoaSBpbiBzZWxmICYmIHNlbGZbaV0gPT09IHNvdWdodCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG59LCBoYXNGaXJlZm94MkluZGV4T2ZCdWcpO1xuXG4vL1xuLy8gU3RyaW5nXG4vLyA9PT09PT1cbi8vXG5cbi8vIEVTNSAxNS41LjQuMTRcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjUuNC4xNFxuXG4vLyBbYnVnZml4LCBJRSBsdCA5LCBmaXJlZm94IDQsIEtvbnF1ZXJvciwgT3BlcmEsIG9ic2N1cmUgYnJvd3NlcnNdXG4vLyBNYW55IGJyb3dzZXJzIGRvIG5vdCBzcGxpdCBwcm9wZXJseSB3aXRoIHJlZ3VsYXIgZXhwcmVzc2lvbnMgb3IgdGhleVxuLy8gZG8gbm90IHBlcmZvcm0gdGhlIHNwbGl0IGNvcnJlY3RseSB1bmRlciBvYnNjdXJlIGNvbmRpdGlvbnMuXG4vLyBTZWUgaHR0cDovL2Jsb2cuc3RldmVubGV2aXRoYW4uY29tL2FyY2hpdmVzL2Nyb3NzLWJyb3dzZXItc3BsaXRcbi8vIEkndmUgdGVzdGVkIGluIG1hbnkgYnJvd3NlcnMgYW5kIHRoaXMgc2VlbXMgdG8gY292ZXIgdGhlIGRldmlhbnQgb25lczpcbi8vICAgICdhYicuc3BsaXQoLyg/OmFiKSovKSBzaG91bGQgYmUgW1wiXCIsIFwiXCJdLCBub3QgW1wiXCJdXG4vLyAgICAnLicuc3BsaXQoLyguPykoLj8pLykgc2hvdWxkIGJlIFtcIlwiLCBcIi5cIiwgXCJcIiwgXCJcIl0sIG5vdCBbXCJcIiwgXCJcIl1cbi8vICAgICd0ZXNzdCcuc3BsaXQoLyhzKSovKSBzaG91bGQgYmUgW1widFwiLCB1bmRlZmluZWQsIFwiZVwiLCBcInNcIiwgXCJ0XCJdLCBub3Rcbi8vICAgICAgIFt1bmRlZmluZWQsIFwidFwiLCB1bmRlZmluZWQsIFwiZVwiLCAuLi5dXG4vLyAgICAnJy5zcGxpdCgvLj8vKSBzaG91bGQgYmUgW10sIG5vdCBbXCJcIl1cbi8vICAgICcuJy5zcGxpdCgvKCkoKS8pIHNob3VsZCBiZSBbXCIuXCJdLCBub3QgW1wiXCIsIFwiXCIsIFwiLlwiXVxuXG52YXIgc3RyaW5nX3NwbGl0ID0gU3RyaW5nUHJvdG90eXBlLnNwbGl0O1xuaWYgKFxuICAgICdhYicuc3BsaXQoLyg/OmFiKSovKS5sZW5ndGggIT09IDIgfHxcbiAgICAnLicuc3BsaXQoLyguPykoLj8pLykubGVuZ3RoICE9PSA0IHx8XG4gICAgJ3Rlc3N0Jy5zcGxpdCgvKHMpKi8pWzFdID09PSAndCcgfHxcbiAgICAndGVzdCcuc3BsaXQoLyg/OikvLCAtMSkubGVuZ3RoICE9PSA0IHx8XG4gICAgJycuc3BsaXQoLy4/LykubGVuZ3RoIHx8XG4gICAgJy4nLnNwbGl0KC8oKSgpLykubGVuZ3RoID4gMVxuKSB7XG4gICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNvbXBsaWFudEV4ZWNOcGNnID0gLygpPz8vLmV4ZWMoJycpWzFdID09PSB2b2lkIDA7IC8vIE5QQ0c6IG5vbnBhcnRpY2lwYXRpbmcgY2FwdHVyaW5nIGdyb3VwXG5cbiAgICAgICAgU3RyaW5nUHJvdG90eXBlLnNwbGl0ID0gZnVuY3Rpb24gKHNlcGFyYXRvciwgbGltaXQpIHtcbiAgICAgICAgICAgIHZhciBzdHJpbmcgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKHNlcGFyYXRvciA9PT0gdm9pZCAwICYmIGxpbWl0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiBgc2VwYXJhdG9yYCBpcyBub3QgYSByZWdleCwgdXNlIG5hdGl2ZSBzcGxpdFxuICAgICAgICAgICAgaWYgKF90b1N0cmluZy5jYWxsKHNlcGFyYXRvcikgIT09ICdbb2JqZWN0IFJlZ0V4cF0nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0cmluZ19zcGxpdC5jYWxsKHRoaXMsIHNlcGFyYXRvciwgbGltaXQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0gW10sXG4gICAgICAgICAgICAgICAgZmxhZ3MgPSAoc2VwYXJhdG9yLmlnbm9yZUNhc2UgPyAnaScgOiAnJykgK1xuICAgICAgICAgICAgICAgICAgICAgICAgKHNlcGFyYXRvci5tdWx0aWxpbmUgID8gJ20nIDogJycpICtcbiAgICAgICAgICAgICAgICAgICAgICAgIChzZXBhcmF0b3IuZXh0ZW5kZWQgICA/ICd4JyA6ICcnKSArIC8vIFByb3Bvc2VkIGZvciBFUzZcbiAgICAgICAgICAgICAgICAgICAgICAgIChzZXBhcmF0b3Iuc3RpY2t5ICAgICA/ICd5JyA6ICcnKSwgLy8gRmlyZWZveCAzK1xuICAgICAgICAgICAgICAgIGxhc3RMYXN0SW5kZXggPSAwLFxuICAgICAgICAgICAgICAgIC8vIE1ha2UgYGdsb2JhbGAgYW5kIGF2b2lkIGBsYXN0SW5kZXhgIGlzc3VlcyBieSB3b3JraW5nIHdpdGggYSBjb3B5XG4gICAgICAgICAgICAgICAgc2VwYXJhdG9yMiwgbWF0Y2gsIGxhc3RJbmRleCwgbGFzdExlbmd0aDtcbiAgICAgICAgICAgIHNlcGFyYXRvciA9IG5ldyBSZWdFeHAoc2VwYXJhdG9yLnNvdXJjZSwgZmxhZ3MgKyAnZycpO1xuICAgICAgICAgICAgc3RyaW5nICs9ICcnOyAvLyBUeXBlLWNvbnZlcnRcbiAgICAgICAgICAgIGlmICghY29tcGxpYW50RXhlY05wY2cpIHtcbiAgICAgICAgICAgICAgICAvLyBEb2Vzbid0IG5lZWQgZmxhZ3MgZ3ksIGJ1dCB0aGV5IGRvbid0IGh1cnRcbiAgICAgICAgICAgICAgICBzZXBhcmF0b3IyID0gbmV3IFJlZ0V4cCgnXicgKyBzZXBhcmF0b3Iuc291cmNlICsgJyQoPyFcXFxccyknLCBmbGFncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKiBWYWx1ZXMgZm9yIGBsaW1pdGAsIHBlciB0aGUgc3BlYzpcbiAgICAgICAgICAgICAqIElmIHVuZGVmaW5lZDogNDI5NDk2NzI5NSAvLyBNYXRoLnBvdygyLCAzMikgLSAxXG4gICAgICAgICAgICAgKiBJZiAwLCBJbmZpbml0eSwgb3IgTmFOOiAwXG4gICAgICAgICAgICAgKiBJZiBwb3NpdGl2ZSBudW1iZXI6IGxpbWl0ID0gTWF0aC5mbG9vcihsaW1pdCk7IGlmIChsaW1pdCA+IDQyOTQ5NjcyOTUpIGxpbWl0IC09IDQyOTQ5NjcyOTY7XG4gICAgICAgICAgICAgKiBJZiBuZWdhdGl2ZSBudW1iZXI6IDQyOTQ5NjcyOTYgLSBNYXRoLmZsb29yKE1hdGguYWJzKGxpbWl0KSlcbiAgICAgICAgICAgICAqIElmIG90aGVyOiBUeXBlLWNvbnZlcnQsIHRoZW4gdXNlIHRoZSBhYm92ZSBydWxlc1xuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBsaW1pdCA9IGxpbWl0ID09PSB2b2lkIDAgP1xuICAgICAgICAgICAgICAgIC0xID4+PiAwIDogLy8gTWF0aC5wb3coMiwgMzIpIC0gMVxuICAgICAgICAgICAgICAgIFRvVWludDMyKGxpbWl0KTtcbiAgICAgICAgICAgIHdoaWxlIChtYXRjaCA9IHNlcGFyYXRvci5leGVjKHN0cmluZykpIHtcbiAgICAgICAgICAgICAgICAvLyBgc2VwYXJhdG9yLmxhc3RJbmRleGAgaXMgbm90IHJlbGlhYmxlIGNyb3NzLWJyb3dzZXJcbiAgICAgICAgICAgICAgICBsYXN0SW5kZXggPSBtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBpZiAobGFzdEluZGV4ID4gbGFzdExhc3RJbmRleCkge1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChzdHJpbmcuc2xpY2UobGFzdExhc3RJbmRleCwgbWF0Y2guaW5kZXgpKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gRml4IGJyb3dzZXJzIHdob3NlIGBleGVjYCBtZXRob2RzIGRvbid0IGNvbnNpc3RlbnRseSByZXR1cm4gYHVuZGVmaW5lZGAgZm9yXG4gICAgICAgICAgICAgICAgICAgIC8vIG5vbnBhcnRpY2lwYXRpbmcgY2FwdHVyaW5nIGdyb3Vwc1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWNvbXBsaWFudEV4ZWNOcGNnICYmIG1hdGNoLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoWzBdLnJlcGxhY2Uoc2VwYXJhdG9yMiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aCAtIDI7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJndW1lbnRzW2ldID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoW2ldID0gdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoLmxlbmd0aCA+IDEgJiYgbWF0Y2guaW5kZXggPCBzdHJpbmcubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBBcnJheVByb3RvdHlwZS5wdXNoLmFwcGx5KG91dHB1dCwgbWF0Y2guc2xpY2UoMSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxhc3RMZW5ndGggPSBtYXRjaFswXS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RMYXN0SW5kZXggPSBsYXN0SW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvdXRwdXQubGVuZ3RoID49IGxpbWl0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoc2VwYXJhdG9yLmxhc3RJbmRleCA9PT0gbWF0Y2guaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VwYXJhdG9yLmxhc3RJbmRleCsrOyAvLyBBdm9pZCBhbiBpbmZpbml0ZSBsb29wXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGxhc3RMYXN0SW5kZXggPT09IHN0cmluZy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBpZiAobGFzdExlbmd0aCB8fCAhc2VwYXJhdG9yLnRlc3QoJycpKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKCcnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKHN0cmluZy5zbGljZShsYXN0TGFzdEluZGV4KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0Lmxlbmd0aCA+IGxpbWl0ID8gb3V0cHV0LnNsaWNlKDAsIGxpbWl0KSA6IG91dHB1dDtcbiAgICAgICAgfTtcbiAgICB9KCkpO1xuXG4vLyBbYnVnZml4LCBjaHJvbWVdXG4vLyBJZiBzZXBhcmF0b3IgaXMgdW5kZWZpbmVkLCB0aGVuIHRoZSByZXN1bHQgYXJyYXkgY29udGFpbnMganVzdCBvbmUgU3RyaW5nLFxuLy8gd2hpY2ggaXMgdGhlIHRoaXMgdmFsdWUgKGNvbnZlcnRlZCB0byBhIFN0cmluZykuIElmIGxpbWl0IGlzIG5vdCB1bmRlZmluZWQsXG4vLyB0aGVuIHRoZSBvdXRwdXQgYXJyYXkgaXMgdHJ1bmNhdGVkIHNvIHRoYXQgaXQgY29udGFpbnMgbm8gbW9yZSB0aGFuIGxpbWl0XG4vLyBlbGVtZW50cy5cbi8vIFwiMFwiLnNwbGl0KHVuZGVmaW5lZCwgMCkgLT4gW11cbn0gZWxzZSBpZiAoJzAnLnNwbGl0KHZvaWQgMCwgMCkubGVuZ3RoKSB7XG4gICAgU3RyaW5nUHJvdG90eXBlLnNwbGl0ID0gZnVuY3Rpb24gc3BsaXQoc2VwYXJhdG9yLCBsaW1pdCkge1xuICAgICAgICBpZiAoc2VwYXJhdG9yID09PSB2b2lkIDAgJiYgbGltaXQgPT09IDApIHsgcmV0dXJuIFtdOyB9XG4gICAgICAgIHJldHVybiBzdHJpbmdfc3BsaXQuY2FsbCh0aGlzLCBzZXBhcmF0b3IsIGxpbWl0KTtcbiAgICB9O1xufVxuXG4vLyBFQ01BLTI2MiwgM3JkIEIuMi4zXG4vLyBOb3QgYW4gRUNNQVNjcmlwdCBzdGFuZGFyZCwgYWx0aG91Z2ggRUNNQVNjcmlwdCAzcmQgRWRpdGlvbiBoYXMgYVxuLy8gbm9uLW5vcm1hdGl2ZSBzZWN0aW9uIHN1Z2dlc3RpbmcgdW5pZm9ybSBzZW1hbnRpY3MgYW5kIGl0IHNob3VsZCBiZVxuLy8gbm9ybWFsaXplZCBhY3Jvc3MgYWxsIGJyb3dzZXJzXG4vLyBbYnVnZml4LCBJRSBsdCA5XSBJRSA8IDkgc3Vic3RyKCkgd2l0aCBuZWdhdGl2ZSB2YWx1ZSBub3Qgd29ya2luZyBpbiBJRVxudmFyIHN0cmluZ19zdWJzdHIgPSBTdHJpbmdQcm90b3R5cGUuc3Vic3RyO1xudmFyIGhhc05lZ2F0aXZlU3Vic3RyQnVnID0gJycuc3Vic3RyICYmICcwYicuc3Vic3RyKC0xKSAhPT0gJ2InO1xuZGVmaW5lUHJvcGVydGllcyhTdHJpbmdQcm90b3R5cGUsIHtcbiAgICBzdWJzdHI6IGZ1bmN0aW9uIHN1YnN0cihzdGFydCwgbGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBzdHJpbmdfc3Vic3RyLmNhbGwoXG4gICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgc3RhcnQgPCAwID8gKChzdGFydCA9IHRoaXMubGVuZ3RoICsgc3RhcnQpIDwgMCA/IDAgOiBzdGFydCkgOiBzdGFydCxcbiAgICAgICAgICAgIGxlbmd0aFxuICAgICAgICApO1xuICAgIH1cbn0sIGhhc05lZ2F0aXZlU3Vic3RyQnVnKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBbXG4gIC8vIHN0cmVhbWluZyB0cmFuc3BvcnRzXG4gIHJlcXVpcmUoJy4vdHJhbnNwb3J0L3dlYnNvY2tldCcpXG4sIHJlcXVpcmUoJy4vdHJhbnNwb3J0L3hoci1zdHJlYW1pbmcnKVxuLCByZXF1aXJlKCcuL3RyYW5zcG9ydC94ZHItc3RyZWFtaW5nJylcbiwgcmVxdWlyZSgnLi90cmFuc3BvcnQvZXZlbnRzb3VyY2UnKVxuLCByZXF1aXJlKCcuL3RyYW5zcG9ydC9saWIvaWZyYW1lLXdyYXAnKShyZXF1aXJlKCcuL3RyYW5zcG9ydC9ldmVudHNvdXJjZScpKVxuXG4gIC8vIHBvbGxpbmcgdHJhbnNwb3J0c1xuLCByZXF1aXJlKCcuL3RyYW5zcG9ydC9odG1sZmlsZScpXG4sIHJlcXVpcmUoJy4vdHJhbnNwb3J0L2xpYi9pZnJhbWUtd3JhcCcpKHJlcXVpcmUoJy4vdHJhbnNwb3J0L2h0bWxmaWxlJykpXG4sIHJlcXVpcmUoJy4vdHJhbnNwb3J0L3hoci1wb2xsaW5nJylcbiwgcmVxdWlyZSgnLi90cmFuc3BvcnQveGRyLXBvbGxpbmcnKVxuLCByZXF1aXJlKCcuL3RyYW5zcG9ydC9saWIvaWZyYW1lLXdyYXAnKShyZXF1aXJlKCcuL3RyYW5zcG9ydC94aHItcG9sbGluZycpKVxuLCByZXF1aXJlKCcuL3RyYW5zcG9ydC9qc29ucC1wb2xsaW5nJylcbl07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXJcbiAgLCBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJylcbiAgLCB1dGlscyA9IHJlcXVpcmUoJy4uLy4uL3V0aWxzL2V2ZW50JylcbiAgLCB1cmxVdGlscyA9IHJlcXVpcmUoJy4uLy4uL3V0aWxzL3VybCcpXG4gICwgWEhSID0gZ2xvYmFsLlhNTEh0dHBSZXF1ZXN0XG4gIDtcblxudmFyIGRlYnVnID0gZnVuY3Rpb24oKSB7fTtcbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIGRlYnVnID0gcmVxdWlyZSgnZGVidWcnKSgnc29ja2pzLWNsaWVudDpicm93c2VyOnhocicpO1xufVxuXG5mdW5jdGlvbiBBYnN0cmFjdFhIUk9iamVjdChtZXRob2QsIHVybCwgcGF5bG9hZCwgb3B0cykge1xuICBkZWJ1ZyhtZXRob2QsIHVybCk7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgRXZlbnRFbWl0dGVyLmNhbGwodGhpcyk7XG5cbiAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgc2VsZi5fc3RhcnQobWV0aG9kLCB1cmwsIHBheWxvYWQsIG9wdHMpO1xuICB9LCAwKTtcbn1cblxuaW5oZXJpdHMoQWJzdHJhY3RYSFJPYmplY3QsIEV2ZW50RW1pdHRlcik7XG5cbkFic3RyYWN0WEhST2JqZWN0LnByb3RvdHlwZS5fc3RhcnQgPSBmdW5jdGlvbihtZXRob2QsIHVybCwgcGF5bG9hZCwgb3B0cykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgdHJ5IHtcbiAgICB0aGlzLnhociA9IG5ldyBYSFIoKTtcbiAgfSBjYXRjaCAoeCkge1xuICAgIC8vIGludGVudGlvbmFsbHkgZW1wdHlcbiAgfVxuXG4gIGlmICghdGhpcy54aHIpIHtcbiAgICBkZWJ1Zygnbm8geGhyJyk7XG4gICAgdGhpcy5lbWl0KCdmaW5pc2gnLCAwLCAnbm8geGhyIHN1cHBvcnQnKTtcbiAgICB0aGlzLl9jbGVhbnVwKCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gc2V2ZXJhbCBicm93c2VycyBjYWNoZSBQT1NUc1xuICB1cmwgPSB1cmxVdGlscy5hZGRRdWVyeSh1cmwsICd0PScgKyAoK25ldyBEYXRlKCkpKTtcblxuICAvLyBFeHBsb3JlciB0ZW5kcyB0byBrZWVwIGNvbm5lY3Rpb24gb3BlbiwgZXZlbiBhZnRlciB0aGVcbiAgLy8gdGFiIGdldHMgY2xvc2VkOiBodHRwOi8vYnVncy5qcXVlcnkuY29tL3RpY2tldC81MjgwXG4gIHRoaXMudW5sb2FkUmVmID0gdXRpbHMudW5sb2FkQWRkKGZ1bmN0aW9uKCkge1xuICAgIGRlYnVnKCd1bmxvYWQgY2xlYW51cCcpO1xuICAgIHNlbGYuX2NsZWFudXAodHJ1ZSk7XG4gIH0pO1xuICB0cnkge1xuICAgIHRoaXMueGhyLm9wZW4obWV0aG9kLCB1cmwsIHRydWUpO1xuICAgIGlmICh0aGlzLnRpbWVvdXQgJiYgJ3RpbWVvdXQnIGluIHRoaXMueGhyKSB7XG4gICAgICB0aGlzLnhoci50aW1lb3V0ID0gdGhpcy50aW1lb3V0O1xuICAgICAgdGhpcy54aHIub250aW1lb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGRlYnVnKCd4aHIgdGltZW91dCcpO1xuICAgICAgICBzZWxmLmVtaXQoJ2ZpbmlzaCcsIDAsICcnKTtcbiAgICAgICAgc2VsZi5fY2xlYW51cChmYWxzZSk7XG4gICAgICB9O1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIGRlYnVnKCdleGNlcHRpb24nLCBlKTtcbiAgICAvLyBJRSByYWlzZXMgYW4gZXhjZXB0aW9uIG9uIHdyb25nIHBvcnQuXG4gICAgdGhpcy5lbWl0KCdmaW5pc2gnLCAwLCAnJyk7XG4gICAgdGhpcy5fY2xlYW51cChmYWxzZSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKCghb3B0cyB8fCAhb3B0cy5ub0NyZWRlbnRpYWxzKSAmJiBBYnN0cmFjdFhIUk9iamVjdC5zdXBwb3J0c0NPUlMpIHtcbiAgICBkZWJ1Zygnd2l0aENyZWRlbnRpYWxzJyk7XG4gICAgLy8gTW96aWxsYSBkb2NzIHNheXMgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vWE1MSHR0cFJlcXVlc3QgOlxuICAgIC8vIFwiVGhpcyBuZXZlciBhZmZlY3RzIHNhbWUtc2l0ZSByZXF1ZXN0cy5cIlxuXG4gICAgdGhpcy54aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcbiAgfVxuICBpZiAob3B0cyAmJiBvcHRzLmhlYWRlcnMpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gb3B0cy5oZWFkZXJzKSB7XG4gICAgICB0aGlzLnhoci5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgb3B0cy5oZWFkZXJzW2tleV0pO1xuICAgIH1cbiAgfVxuXG4gIHRoaXMueGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChzZWxmLnhocikge1xuICAgICAgdmFyIHggPSBzZWxmLnhocjtcbiAgICAgIHZhciB0ZXh0LCBzdGF0dXM7XG4gICAgICBkZWJ1ZygncmVhZHlTdGF0ZScsIHgucmVhZHlTdGF0ZSk7XG4gICAgICBzd2l0Y2ggKHgucmVhZHlTdGF0ZSkge1xuICAgICAgY2FzZSAzOlxuICAgICAgICAvLyBJRSBkb2Vzbid0IGxpa2UgcGVla2luZyBpbnRvIHJlc3BvbnNlVGV4dCBvciBzdGF0dXNcbiAgICAgICAgLy8gb24gTWljcm9zb2Z0LlhNTEhUVFAgYW5kIHJlYWR5c3RhdGU9M1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHN0YXR1cyA9IHguc3RhdHVzO1xuICAgICAgICAgIHRleHQgPSB4LnJlc3BvbnNlVGV4dDtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIC8vIGludGVudGlvbmFsbHkgZW1wdHlcbiAgICAgICAgfVxuICAgICAgICBkZWJ1Zygnc3RhdHVzJywgc3RhdHVzKTtcbiAgICAgICAgLy8gSUUgcmV0dXJucyAxMjIzIGZvciAyMDQ6IGh0dHA6Ly9idWdzLmpxdWVyeS5jb20vdGlja2V0LzE0NTBcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gMTIyMykge1xuICAgICAgICAgIHN0YXR1cyA9IDIwNDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElFIGRvZXMgcmV0dXJuIHJlYWR5c3RhdGUgPT0gMyBmb3IgNDA0IGFuc3dlcnMuXG4gICAgICAgIGlmIChzdGF0dXMgPT09IDIwMCAmJiB0ZXh0ICYmIHRleHQubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGRlYnVnKCdjaHVuaycpO1xuICAgICAgICAgIHNlbGYuZW1pdCgnY2h1bmsnLCBzdGF0dXMsIHRleHQpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSA0OlxuICAgICAgICBzdGF0dXMgPSB4LnN0YXR1cztcbiAgICAgICAgZGVidWcoJ3N0YXR1cycsIHN0YXR1cyk7XG4gICAgICAgIC8vIElFIHJldHVybnMgMTIyMyBmb3IgMjA0OiBodHRwOi8vYnVncy5qcXVlcnkuY29tL3RpY2tldC8xNDUwXG4gICAgICAgIGlmIChzdGF0dXMgPT09IDEyMjMpIHtcbiAgICAgICAgICBzdGF0dXMgPSAyMDQ7XG4gICAgICAgIH1cbiAgICAgICAgLy8gSUUgcmV0dXJucyB0aGlzIGZvciBhIGJhZCBwb3J0XG4gICAgICAgIC8vIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS93aW5kb3dzL2Rlc2t0b3AvYWEzODM3NzAodj12cy44NSkuYXNweFxuICAgICAgICBpZiAoc3RhdHVzID09PSAxMjAwNSB8fCBzdGF0dXMgPT09IDEyMDI5KSB7XG4gICAgICAgICAgc3RhdHVzID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlYnVnKCdmaW5pc2gnLCBzdGF0dXMsIHgucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgc2VsZi5lbWl0KCdmaW5pc2gnLCBzdGF0dXMsIHgucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgc2VsZi5fY2xlYW51cChmYWxzZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICB0cnkge1xuICAgIHNlbGYueGhyLnNlbmQocGF5bG9hZCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBzZWxmLmVtaXQoJ2ZpbmlzaCcsIDAsICcnKTtcbiAgICBzZWxmLl9jbGVhbnVwKGZhbHNlKTtcbiAgfVxufTtcblxuQWJzdHJhY3RYSFJPYmplY3QucHJvdG90eXBlLl9jbGVhbnVwID0gZnVuY3Rpb24oYWJvcnQpIHtcbiAgZGVidWcoJ2NsZWFudXAnKTtcbiAgaWYgKCF0aGlzLnhocikge1xuICAgIHJldHVybjtcbiAgfVxuICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygpO1xuICB1dGlscy51bmxvYWREZWwodGhpcy51bmxvYWRSZWYpO1xuXG4gIC8vIElFIG5lZWRzIHRoaXMgZmllbGQgdG8gYmUgYSBmdW5jdGlvblxuICB0aGlzLnhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHt9O1xuICBpZiAodGhpcy54aHIub250aW1lb3V0KSB7XG4gICAgdGhpcy54aHIub250aW1lb3V0ID0gbnVsbDtcbiAgfVxuXG4gIGlmIChhYm9ydCkge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLnhoci5hYm9ydCgpO1xuICAgIH0gY2F0Y2ggKHgpIHtcbiAgICAgIC8vIGludGVudGlvbmFsbHkgZW1wdHlcbiAgICB9XG4gIH1cbiAgdGhpcy51bmxvYWRSZWYgPSB0aGlzLnhociA9IG51bGw7XG59O1xuXG5BYnN0cmFjdFhIUk9iamVjdC5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpIHtcbiAgZGVidWcoJ2Nsb3NlJyk7XG4gIHRoaXMuX2NsZWFudXAodHJ1ZSk7XG59O1xuXG5BYnN0cmFjdFhIUk9iamVjdC5lbmFibGVkID0gISFYSFI7XG4vLyBvdmVycmlkZSBYTUxIdHRwUmVxdWVzdCBmb3IgSUU2Lzdcbi8vIG9iZnVzY2F0ZSB0byBhdm9pZCBmaXJld2FsbHNcbnZhciBheG8gPSBbJ0FjdGl2ZSddLmNvbmNhdCgnT2JqZWN0Jykuam9pbignWCcpO1xuaWYgKCFBYnN0cmFjdFhIUk9iamVjdC5lbmFibGVkICYmIChheG8gaW4gZ2xvYmFsKSkge1xuICBkZWJ1Zygnb3ZlcnJpZGluZyB4bWxodHRwcmVxdWVzdCcpO1xuICBYSFIgPSBmdW5jdGlvbigpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIG5ldyBnbG9iYWxbYXhvXSgnTWljcm9zb2Z0LlhNTEhUVFAnKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH07XG4gIEFic3RyYWN0WEhST2JqZWN0LmVuYWJsZWQgPSAhIW5ldyBYSFIoKTtcbn1cblxudmFyIGNvcnMgPSBmYWxzZTtcbnRyeSB7XG4gIGNvcnMgPSAnd2l0aENyZWRlbnRpYWxzJyBpbiBuZXcgWEhSKCk7XG59IGNhdGNoIChpZ25vcmVkKSB7XG4gIC8vIGludGVudGlvbmFsbHkgZW1wdHlcbn1cblxuQWJzdHJhY3RYSFJPYmplY3Quc3VwcG9ydHNDT1JTID0gY29ycztcblxubW9kdWxlLmV4cG9ydHMgPSBBYnN0cmFjdFhIUk9iamVjdDtcbiIsIm1vZHVsZS5leHBvcnRzID0gZ2xvYmFsLkV2ZW50U291cmNlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRHJpdmVyID0gZ2xvYmFsLldlYlNvY2tldCB8fCBnbG9iYWwuTW96V2ViU29ja2V0O1xuaWYgKERyaXZlcikge1xuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIFdlYlNvY2tldEJyb3dzZXJEcml2ZXIodXJsKSB7XG5cdFx0cmV0dXJuIG5ldyBEcml2ZXIodXJsKTtcblx0fTtcbn0gZWxzZSB7XG5cdG1vZHVsZS5leHBvcnRzID0gdW5kZWZpbmVkO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpXG4gICwgQWpheEJhc2VkVHJhbnNwb3J0ID0gcmVxdWlyZSgnLi9saWIvYWpheC1iYXNlZCcpXG4gICwgRXZlbnRTb3VyY2VSZWNlaXZlciA9IHJlcXVpcmUoJy4vcmVjZWl2ZXIvZXZlbnRzb3VyY2UnKVxuICAsIFhIUkNvcnNPYmplY3QgPSByZXF1aXJlKCcuL3NlbmRlci94aHItY29ycycpXG4gICwgRXZlbnRTb3VyY2VEcml2ZXIgPSByZXF1aXJlKCdldmVudHNvdXJjZScpXG4gIDtcblxuZnVuY3Rpb24gRXZlbnRTb3VyY2VUcmFuc3BvcnQodHJhbnNVcmwpIHtcbiAgaWYgKCFFdmVudFNvdXJjZVRyYW5zcG9ydC5lbmFibGVkKCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RyYW5zcG9ydCBjcmVhdGVkIHdoZW4gZGlzYWJsZWQnKTtcbiAgfVxuXG4gIEFqYXhCYXNlZFRyYW5zcG9ydC5jYWxsKHRoaXMsIHRyYW5zVXJsLCAnL2V2ZW50c291cmNlJywgRXZlbnRTb3VyY2VSZWNlaXZlciwgWEhSQ29yc09iamVjdCk7XG59XG5cbmluaGVyaXRzKEV2ZW50U291cmNlVHJhbnNwb3J0LCBBamF4QmFzZWRUcmFuc3BvcnQpO1xuXG5FdmVudFNvdXJjZVRyYW5zcG9ydC5lbmFibGVkID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAhIUV2ZW50U291cmNlRHJpdmVyO1xufTtcblxuRXZlbnRTb3VyY2VUcmFuc3BvcnQudHJhbnNwb3J0TmFtZSA9ICdldmVudHNvdXJjZSc7XG5FdmVudFNvdXJjZVRyYW5zcG9ydC5yb3VuZFRyaXBzID0gMjtcblxubW9kdWxlLmV4cG9ydHMgPSBFdmVudFNvdXJjZVRyYW5zcG9ydDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKVxuICAsIEh0bWxmaWxlUmVjZWl2ZXIgPSByZXF1aXJlKCcuL3JlY2VpdmVyL2h0bWxmaWxlJylcbiAgLCBYSFJMb2NhbE9iamVjdCA9IHJlcXVpcmUoJy4vc2VuZGVyL3hoci1sb2NhbCcpXG4gICwgQWpheEJhc2VkVHJhbnNwb3J0ID0gcmVxdWlyZSgnLi9saWIvYWpheC1iYXNlZCcpXG4gIDtcblxuZnVuY3Rpb24gSHRtbEZpbGVUcmFuc3BvcnQodHJhbnNVcmwpIHtcbiAgaWYgKCFIdG1sZmlsZVJlY2VpdmVyLmVuYWJsZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RyYW5zcG9ydCBjcmVhdGVkIHdoZW4gZGlzYWJsZWQnKTtcbiAgfVxuICBBamF4QmFzZWRUcmFuc3BvcnQuY2FsbCh0aGlzLCB0cmFuc1VybCwgJy9odG1sZmlsZScsIEh0bWxmaWxlUmVjZWl2ZXIsIFhIUkxvY2FsT2JqZWN0KTtcbn1cblxuaW5oZXJpdHMoSHRtbEZpbGVUcmFuc3BvcnQsIEFqYXhCYXNlZFRyYW5zcG9ydCk7XG5cbkh0bWxGaWxlVHJhbnNwb3J0LmVuYWJsZWQgPSBmdW5jdGlvbihpbmZvKSB7XG4gIHJldHVybiBIdG1sZmlsZVJlY2VpdmVyLmVuYWJsZWQgJiYgaW5mby5zYW1lT3JpZ2luO1xufTtcblxuSHRtbEZpbGVUcmFuc3BvcnQudHJhbnNwb3J0TmFtZSA9ICdodG1sZmlsZSc7XG5IdG1sRmlsZVRyYW5zcG9ydC5yb3VuZFRyaXBzID0gMjtcblxubW9kdWxlLmV4cG9ydHMgPSBIdG1sRmlsZVRyYW5zcG9ydDtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gRmV3IGNvb2wgdHJhbnNwb3J0cyBkbyB3b3JrIG9ubHkgZm9yIHNhbWUtb3JpZ2luLiBJbiBvcmRlciB0byBtYWtlXG4vLyB0aGVtIHdvcmsgY3Jvc3MtZG9tYWluIHdlIHNoYWxsIHVzZSBpZnJhbWUsIHNlcnZlZCBmcm9tIHRoZVxuLy8gcmVtb3RlIGRvbWFpbi4gTmV3IGJyb3dzZXJzIGhhdmUgY2FwYWJpbGl0aWVzIHRvIGNvbW11bmljYXRlIHdpdGhcbi8vIGNyb3NzIGRvbWFpbiBpZnJhbWUgdXNpbmcgcG9zdE1lc3NhZ2UoKS4gSW4gSUUgaXQgd2FzIGltcGxlbWVudGVkXG4vLyBmcm9tIElFIDgrLCBidXQgb2YgY291cnNlLCBJRSBnb3Qgc29tZSBkZXRhaWxzIHdyb25nOlxuLy8gICAgaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L2NjMTk3MDE1KHY9VlMuODUpLmFzcHhcbi8vICAgIGh0dHA6Ly9zdGV2ZXNvdWRlcnMuY29tL21pc2MvdGVzdC1wb3N0bWVzc2FnZS5waHBcblxudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKVxuICAsIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlclxuICAsIHZlcnNpb24gPSByZXF1aXJlKCcuLi92ZXJzaW9uJylcbiAgLCB1cmxVdGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzL3VybCcpXG4gICwgaWZyYW1lVXRpbHMgPSByZXF1aXJlKCcuLi91dGlscy9pZnJhbWUnKVxuICAsIGV2ZW50VXRpbHMgPSByZXF1aXJlKCcuLi91dGlscy9ldmVudCcpXG4gICwgcmFuZG9tID0gcmVxdWlyZSgnLi4vdXRpbHMvcmFuZG9tJylcbiAgO1xuXG52YXIgZGVidWcgPSBmdW5jdGlvbigpIHt9O1xuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdzb2NranMtY2xpZW50OnRyYW5zcG9ydDppZnJhbWUnKTtcbn1cblxuZnVuY3Rpb24gSWZyYW1lVHJhbnNwb3J0KHRyYW5zcG9ydCwgdHJhbnNVcmwsIGJhc2VVcmwpIHtcbiAgaWYgKCFJZnJhbWVUcmFuc3BvcnQuZW5hYmxlZCgpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdUcmFuc3BvcnQgY3JlYXRlZCB3aGVuIGRpc2FibGVkJyk7XG4gIH1cbiAgRXZlbnRFbWl0dGVyLmNhbGwodGhpcyk7XG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB0aGlzLm9yaWdpbiA9IHVybFV0aWxzLmdldE9yaWdpbihiYXNlVXJsKTtcbiAgdGhpcy5iYXNlVXJsID0gYmFzZVVybDtcbiAgdGhpcy50cmFuc1VybCA9IHRyYW5zVXJsO1xuICB0aGlzLnRyYW5zcG9ydCA9IHRyYW5zcG9ydDtcbiAgdGhpcy53aW5kb3dJZCA9IHJhbmRvbS5zdHJpbmcoOCk7XG5cbiAgdmFyIGlmcmFtZVVybCA9IHVybFV0aWxzLmFkZFBhdGgoYmFzZVVybCwgJy9pZnJhbWUuaHRtbCcpICsgJyMnICsgdGhpcy53aW5kb3dJZDtcbiAgZGVidWcodHJhbnNwb3J0LCB0cmFuc1VybCwgaWZyYW1lVXJsKTtcblxuICB0aGlzLmlmcmFtZU9iaiA9IGlmcmFtZVV0aWxzLmNyZWF0ZUlmcmFtZShpZnJhbWVVcmwsIGZ1bmN0aW9uKHIpIHtcbiAgICBkZWJ1ZygnZXJyIGNhbGxiYWNrJyk7XG4gICAgc2VsZi5lbWl0KCdjbG9zZScsIDEwMDYsICdVbmFibGUgdG8gbG9hZCBhbiBpZnJhbWUgKCcgKyByICsgJyknKTtcbiAgICBzZWxmLmNsb3NlKCk7XG4gIH0pO1xuXG4gIHRoaXMub25tZXNzYWdlQ2FsbGJhY2sgPSB0aGlzLl9tZXNzYWdlLmJpbmQodGhpcyk7XG4gIGV2ZW50VXRpbHMuYXR0YWNoRXZlbnQoJ21lc3NhZ2UnLCB0aGlzLm9ubWVzc2FnZUNhbGxiYWNrKTtcbn1cblxuaW5oZXJpdHMoSWZyYW1lVHJhbnNwb3J0LCBFdmVudEVtaXR0ZXIpO1xuXG5JZnJhbWVUcmFuc3BvcnQucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24oKSB7XG4gIGRlYnVnKCdjbG9zZScpO1xuICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygpO1xuICBpZiAodGhpcy5pZnJhbWVPYmopIHtcbiAgICBldmVudFV0aWxzLmRldGFjaEV2ZW50KCdtZXNzYWdlJywgdGhpcy5vbm1lc3NhZ2VDYWxsYmFjayk7XG4gICAgdHJ5IHtcbiAgICAgIC8vIFdoZW4gdGhlIGlmcmFtZSBpcyBub3QgbG9hZGVkLCBJRSByYWlzZXMgYW4gZXhjZXB0aW9uXG4gICAgICAvLyBvbiAnY29udGVudFdpbmRvdycuXG4gICAgICB0aGlzLnBvc3RNZXNzYWdlKCdjJyk7XG4gICAgfSBjYXRjaCAoeCkge1xuICAgICAgLy8gaW50ZW50aW9uYWxseSBlbXB0eVxuICAgIH1cbiAgICB0aGlzLmlmcmFtZU9iai5jbGVhbnVwKCk7XG4gICAgdGhpcy5pZnJhbWVPYmogPSBudWxsO1xuICAgIHRoaXMub25tZXNzYWdlQ2FsbGJhY2sgPSB0aGlzLmlmcmFtZU9iaiA9IG51bGw7XG4gIH1cbn07XG5cbklmcmFtZVRyYW5zcG9ydC5wcm90b3R5cGUuX21lc3NhZ2UgPSBmdW5jdGlvbihlKSB7XG4gIGRlYnVnKCdtZXNzYWdlJywgZS5kYXRhKTtcbiAgaWYgKCF1cmxVdGlscy5pc09yaWdpbkVxdWFsKGUub3JpZ2luLCB0aGlzLm9yaWdpbikpIHtcbiAgICBkZWJ1Zygnbm90IHNhbWUgb3JpZ2luJywgZS5vcmlnaW4sIHRoaXMub3JpZ2luKTtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgaWZyYW1lTWVzc2FnZTtcbiAgdHJ5IHtcbiAgICBpZnJhbWVNZXNzYWdlID0gSlNPTi5wYXJzZShlLmRhdGEpO1xuICB9IGNhdGNoIChpZ25vcmVkKSB7XG4gICAgZGVidWcoJ2JhZCBqc29uJywgZS5kYXRhKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoaWZyYW1lTWVzc2FnZS53aW5kb3dJZCAhPT0gdGhpcy53aW5kb3dJZCkge1xuICAgIGRlYnVnKCdtaXNtYXRjaGVkIHdpbmRvdyBpZCcsIGlmcmFtZU1lc3NhZ2Uud2luZG93SWQsIHRoaXMud2luZG93SWQpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHN3aXRjaCAoaWZyYW1lTWVzc2FnZS50eXBlKSB7XG4gIGNhc2UgJ3MnOlxuICAgIHRoaXMuaWZyYW1lT2JqLmxvYWRlZCgpO1xuICAgIC8vIHdpbmRvdyBnbG9iYWwgZGVwZW5kZW5jeVxuICAgIHRoaXMucG9zdE1lc3NhZ2UoJ3MnLCBKU09OLnN0cmluZ2lmeShbXG4gICAgICB2ZXJzaW9uXG4gICAgLCB0aGlzLnRyYW5zcG9ydFxuICAgICwgdGhpcy50cmFuc1VybFxuICAgICwgdGhpcy5iYXNlVXJsXG4gICAgXSkpO1xuICAgIGJyZWFrO1xuICBjYXNlICd0JzpcbiAgICB0aGlzLmVtaXQoJ21lc3NhZ2UnLCBpZnJhbWVNZXNzYWdlLmRhdGEpO1xuICAgIGJyZWFrO1xuICBjYXNlICdjJzpcbiAgICB2YXIgY2RhdGE7XG4gICAgdHJ5IHtcbiAgICAgIGNkYXRhID0gSlNPTi5wYXJzZShpZnJhbWVNZXNzYWdlLmRhdGEpO1xuICAgIH0gY2F0Y2ggKGlnbm9yZWQpIHtcbiAgICAgIGRlYnVnKCdiYWQganNvbicsIGlmcmFtZU1lc3NhZ2UuZGF0YSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuZW1pdCgnY2xvc2UnLCBjZGF0YVswXSwgY2RhdGFbMV0pO1xuICAgIHRoaXMuY2xvc2UoKTtcbiAgICBicmVhaztcbiAgfVxufTtcblxuSWZyYW1lVHJhbnNwb3J0LnByb3RvdHlwZS5wb3N0TWVzc2FnZSA9IGZ1bmN0aW9uKHR5cGUsIGRhdGEpIHtcbiAgZGVidWcoJ3Bvc3RNZXNzYWdlJywgdHlwZSwgZGF0YSk7XG4gIHRoaXMuaWZyYW1lT2JqLnBvc3QoSlNPTi5zdHJpbmdpZnkoe1xuICAgIHdpbmRvd0lkOiB0aGlzLndpbmRvd0lkXG4gICwgdHlwZTogdHlwZVxuICAsIGRhdGE6IGRhdGEgfHwgJydcbiAgfSksIHRoaXMub3JpZ2luKTtcbn07XG5cbklmcmFtZVRyYW5zcG9ydC5wcm90b3R5cGUuc2VuZCA9IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgZGVidWcoJ3NlbmQnLCBtZXNzYWdlKTtcbiAgdGhpcy5wb3N0TWVzc2FnZSgnbScsIG1lc3NhZ2UpO1xufTtcblxuSWZyYW1lVHJhbnNwb3J0LmVuYWJsZWQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIGlmcmFtZVV0aWxzLmlmcmFtZUVuYWJsZWQ7XG59O1xuXG5JZnJhbWVUcmFuc3BvcnQudHJhbnNwb3J0TmFtZSA9ICdpZnJhbWUnO1xuSWZyYW1lVHJhbnNwb3J0LnJvdW5kVHJpcHMgPSAyO1xuXG5tb2R1bGUuZXhwb3J0cyA9IElmcmFtZVRyYW5zcG9ydDtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gVGhlIHNpbXBsZXN0IGFuZCBtb3N0IHJvYnVzdCB0cmFuc3BvcnQsIHVzaW5nIHRoZSB3ZWxsLWtub3cgY3Jvc3Ncbi8vIGRvbWFpbiBoYWNrIC0gSlNPTlAuIFRoaXMgdHJhbnNwb3J0IGlzIHF1aXRlIGluZWZmaWNpZW50IC0gb25lXG4vLyBtZXNzYWdlIGNvdWxkIHVzZSB1cCB0byBvbmUgaHR0cCByZXF1ZXN0LiBCdXQgYXQgbGVhc3QgaXQgd29ya3MgYWxtb3N0XG4vLyBldmVyeXdoZXJlLlxuLy8gS25vd24gbGltaXRhdGlvbnM6XG4vLyAgIG8geW91IHdpbGwgZ2V0IGEgc3Bpbm5pbmcgY3Vyc29yXG4vLyAgIG8gZm9yIEtvbnF1ZXJvciBhIGR1bWIgdGltZXIgaXMgbmVlZGVkIHRvIGRldGVjdCBlcnJvcnNcblxudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKVxuICAsIFNlbmRlclJlY2VpdmVyID0gcmVxdWlyZSgnLi9saWIvc2VuZGVyLXJlY2VpdmVyJylcbiAgLCBKc29ucFJlY2VpdmVyID0gcmVxdWlyZSgnLi9yZWNlaXZlci9qc29ucCcpXG4gICwganNvbnBTZW5kZXIgPSByZXF1aXJlKCcuL3NlbmRlci9qc29ucCcpXG4gIDtcblxuZnVuY3Rpb24gSnNvblBUcmFuc3BvcnQodHJhbnNVcmwpIHtcbiAgaWYgKCFKc29uUFRyYW5zcG9ydC5lbmFibGVkKCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RyYW5zcG9ydCBjcmVhdGVkIHdoZW4gZGlzYWJsZWQnKTtcbiAgfVxuICBTZW5kZXJSZWNlaXZlci5jYWxsKHRoaXMsIHRyYW5zVXJsLCAnL2pzb25wJywganNvbnBTZW5kZXIsIEpzb25wUmVjZWl2ZXIpO1xufVxuXG5pbmhlcml0cyhKc29uUFRyYW5zcG9ydCwgU2VuZGVyUmVjZWl2ZXIpO1xuXG5Kc29uUFRyYW5zcG9ydC5lbmFibGVkID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAhIWdsb2JhbC5kb2N1bWVudDtcbn07XG5cbkpzb25QVHJhbnNwb3J0LnRyYW5zcG9ydE5hbWUgPSAnanNvbnAtcG9sbGluZyc7XG5Kc29uUFRyYW5zcG9ydC5yb3VuZFRyaXBzID0gMTtcbkpzb25QVHJhbnNwb3J0Lm5lZWRCb2R5ID0gdHJ1ZTtcblxubW9kdWxlLmV4cG9ydHMgPSBKc29uUFRyYW5zcG9ydDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKVxuICAsIHVybFV0aWxzID0gcmVxdWlyZSgnLi4vLi4vdXRpbHMvdXJsJylcbiAgLCBTZW5kZXJSZWNlaXZlciA9IHJlcXVpcmUoJy4vc2VuZGVyLXJlY2VpdmVyJylcbiAgO1xuXG52YXIgZGVidWcgPSBmdW5jdGlvbigpIHt9O1xuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdzb2NranMtY2xpZW50OmFqYXgtYmFzZWQnKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlQWpheFNlbmRlcihBamF4T2JqZWN0KSB7XG4gIHJldHVybiBmdW5jdGlvbih1cmwsIHBheWxvYWQsIGNhbGxiYWNrKSB7XG4gICAgZGVidWcoJ2NyZWF0ZSBhamF4IHNlbmRlcicsIHVybCwgcGF5bG9hZCk7XG4gICAgdmFyIG9wdCA9IHt9O1xuICAgIGlmICh0eXBlb2YgcGF5bG9hZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIG9wdC5oZWFkZXJzID0geydDb250ZW50LXR5cGUnOiAndGV4dC9wbGFpbid9O1xuICAgIH1cbiAgICB2YXIgYWpheFVybCA9IHVybFV0aWxzLmFkZFBhdGgodXJsLCAnL3hocl9zZW5kJyk7XG4gICAgdmFyIHhvID0gbmV3IEFqYXhPYmplY3QoJ1BPU1QnLCBhamF4VXJsLCBwYXlsb2FkLCBvcHQpO1xuICAgIHhvLm9uY2UoJ2ZpbmlzaCcsIGZ1bmN0aW9uKHN0YXR1cykge1xuICAgICAgZGVidWcoJ2ZpbmlzaCcsIHN0YXR1cyk7XG4gICAgICB4byA9IG51bGw7XG5cbiAgICAgIGlmIChzdGF0dXMgIT09IDIwMCAmJiBzdGF0dXMgIT09IDIwNCkge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2sobmV3IEVycm9yKCdodHRwIHN0YXR1cyAnICsgc3RhdHVzKSk7XG4gICAgICB9XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH0pO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGRlYnVnKCdhYm9ydCcpO1xuICAgICAgeG8uY2xvc2UoKTtcbiAgICAgIHhvID0gbnVsbDtcblxuICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcignQWJvcnRlZCcpO1xuICAgICAgZXJyLmNvZGUgPSAxMDAwO1xuICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICB9O1xuICB9O1xufVxuXG5mdW5jdGlvbiBBamF4QmFzZWRUcmFuc3BvcnQodHJhbnNVcmwsIHVybFN1ZmZpeCwgUmVjZWl2ZXIsIEFqYXhPYmplY3QpIHtcbiAgU2VuZGVyUmVjZWl2ZXIuY2FsbCh0aGlzLCB0cmFuc1VybCwgdXJsU3VmZml4LCBjcmVhdGVBamF4U2VuZGVyKEFqYXhPYmplY3QpLCBSZWNlaXZlciwgQWpheE9iamVjdCk7XG59XG5cbmluaGVyaXRzKEFqYXhCYXNlZFRyYW5zcG9ydCwgU2VuZGVyUmVjZWl2ZXIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFqYXhCYXNlZFRyYW5zcG9ydDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKVxuICAsIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlclxuICA7XG5cbnZhciBkZWJ1ZyA9IGZ1bmN0aW9uKCkge307XG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICBkZWJ1ZyA9IHJlcXVpcmUoJ2RlYnVnJykoJ3NvY2tqcy1jbGllbnQ6YnVmZmVyZWQtc2VuZGVyJyk7XG59XG5cbmZ1bmN0aW9uIEJ1ZmZlcmVkU2VuZGVyKHVybCwgc2VuZGVyKSB7XG4gIGRlYnVnKHVybCk7XG4gIEV2ZW50RW1pdHRlci5jYWxsKHRoaXMpO1xuICB0aGlzLnNlbmRCdWZmZXIgPSBbXTtcbiAgdGhpcy5zZW5kZXIgPSBzZW5kZXI7XG4gIHRoaXMudXJsID0gdXJsO1xufVxuXG5pbmhlcml0cyhCdWZmZXJlZFNlbmRlciwgRXZlbnRFbWl0dGVyKTtcblxuQnVmZmVyZWRTZW5kZXIucHJvdG90eXBlLnNlbmQgPSBmdW5jdGlvbihtZXNzYWdlKSB7XG4gIGRlYnVnKCdzZW5kJywgbWVzc2FnZSk7XG4gIHRoaXMuc2VuZEJ1ZmZlci5wdXNoKG1lc3NhZ2UpO1xuICBpZiAoIXRoaXMuc2VuZFN0b3ApIHtcbiAgICB0aGlzLnNlbmRTY2hlZHVsZSgpO1xuICB9XG59O1xuXG4vLyBGb3IgcG9sbGluZyB0cmFuc3BvcnRzIGluIGEgc2l0dWF0aW9uIHdoZW4gaW4gdGhlIG1lc3NhZ2UgY2FsbGJhY2ssXG4vLyBuZXcgbWVzc2FnZSBpcyBiZWluZyBzZW5kLiBJZiB0aGUgc2VuZGluZyBjb25uZWN0aW9uIHdhcyBzdGFydGVkXG4vLyBiZWZvcmUgcmVjZWl2aW5nIG9uZSwgaXQgaXMgcG9zc2libGUgdG8gc2F0dXJhdGUgdGhlIG5ldHdvcmsgYW5kXG4vLyB0aW1lb3V0IGR1ZSB0byB0aGUgbGFjayBvZiByZWNlaXZpbmcgc29ja2V0LiBUbyBhdm9pZCB0aGF0IHdlIGRlbGF5XG4vLyBzZW5kaW5nIG1lc3NhZ2VzIGJ5IHNvbWUgc21hbGwgdGltZSwgaW4gb3JkZXIgdG8gbGV0IHJlY2VpdmluZ1xuLy8gY29ubmVjdGlvbiBiZSBzdGFydGVkIGJlZm9yZWhhbmQuIFRoaXMgaXMgb25seSBhIGhhbGZtZWFzdXJlIGFuZFxuLy8gZG9lcyBub3QgZml4IHRoZSBiaWcgcHJvYmxlbSwgYnV0IGl0IGRvZXMgbWFrZSB0aGUgdGVzdHMgZ28gbW9yZVxuLy8gc3RhYmxlIG9uIHNsb3cgbmV0d29ya3MuXG5CdWZmZXJlZFNlbmRlci5wcm90b3R5cGUuc2VuZFNjaGVkdWxlV2FpdCA9IGZ1bmN0aW9uKCkge1xuICBkZWJ1Zygnc2VuZFNjaGVkdWxlV2FpdCcpO1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciB0cmVmO1xuICB0aGlzLnNlbmRTdG9wID0gZnVuY3Rpb24oKSB7XG4gICAgZGVidWcoJ3NlbmRTdG9wJyk7XG4gICAgc2VsZi5zZW5kU3RvcCA9IG51bGw7XG4gICAgY2xlYXJUaW1lb3V0KHRyZWYpO1xuICB9O1xuICB0cmVmID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICBkZWJ1ZygndGltZW91dCcpO1xuICAgIHNlbGYuc2VuZFN0b3AgPSBudWxsO1xuICAgIHNlbGYuc2VuZFNjaGVkdWxlKCk7XG4gIH0sIDI1KTtcbn07XG5cbkJ1ZmZlcmVkU2VuZGVyLnByb3RvdHlwZS5zZW5kU2NoZWR1bGUgPSBmdW5jdGlvbigpIHtcbiAgZGVidWcoJ3NlbmRTY2hlZHVsZScsIHRoaXMuc2VuZEJ1ZmZlci5sZW5ndGgpO1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIGlmICh0aGlzLnNlbmRCdWZmZXIubGVuZ3RoID4gMCkge1xuICAgIHZhciBwYXlsb2FkID0gJ1snICsgdGhpcy5zZW5kQnVmZmVyLmpvaW4oJywnKSArICddJztcbiAgICB0aGlzLnNlbmRTdG9wID0gdGhpcy5zZW5kZXIodGhpcy51cmwsIHBheWxvYWQsIGZ1bmN0aW9uKGVycikge1xuICAgICAgc2VsZi5zZW5kU3RvcCA9IG51bGw7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGRlYnVnKCdlcnJvcicsIGVycik7XG4gICAgICAgIHNlbGYuZW1pdCgnY2xvc2UnLCBlcnIuY29kZSB8fCAxMDA2LCAnU2VuZGluZyBlcnJvcjogJyArIGVycik7XG4gICAgICAgIHNlbGYuY2xvc2UoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlbGYuc2VuZFNjaGVkdWxlV2FpdCgpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuc2VuZEJ1ZmZlciA9IFtdO1xuICB9XG59O1xuXG5CdWZmZXJlZFNlbmRlci5wcm90b3R5cGUuX2NsZWFudXAgPSBmdW5jdGlvbigpIHtcbiAgZGVidWcoJ19jbGVhbnVwJyk7XG4gIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCk7XG59O1xuXG5CdWZmZXJlZFNlbmRlci5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpIHtcbiAgZGVidWcoJ2Nsb3NlJyk7XG4gIHRoaXMuX2NsZWFudXAoKTtcbiAgaWYgKHRoaXMuc2VuZFN0b3ApIHtcbiAgICB0aGlzLnNlbmRTdG9wKCk7XG4gICAgdGhpcy5zZW5kU3RvcCA9IG51bGw7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQnVmZmVyZWRTZW5kZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJylcbiAgLCBJZnJhbWVUcmFuc3BvcnQgPSByZXF1aXJlKCcuLi9pZnJhbWUnKVxuICAsIG9iamVjdFV0aWxzID0gcmVxdWlyZSgnLi4vLi4vdXRpbHMvb2JqZWN0JylcbiAgO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHRyYW5zcG9ydCkge1xuXG4gIGZ1bmN0aW9uIElmcmFtZVdyYXBUcmFuc3BvcnQodHJhbnNVcmwsIGJhc2VVcmwpIHtcbiAgICBJZnJhbWVUcmFuc3BvcnQuY2FsbCh0aGlzLCB0cmFuc3BvcnQudHJhbnNwb3J0TmFtZSwgdHJhbnNVcmwsIGJhc2VVcmwpO1xuICB9XG5cbiAgaW5oZXJpdHMoSWZyYW1lV3JhcFRyYW5zcG9ydCwgSWZyYW1lVHJhbnNwb3J0KTtcblxuICBJZnJhbWVXcmFwVHJhbnNwb3J0LmVuYWJsZWQgPSBmdW5jdGlvbih1cmwsIGluZm8pIHtcbiAgICBpZiAoIWdsb2JhbC5kb2N1bWVudCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBpZnJhbWVJbmZvID0gb2JqZWN0VXRpbHMuZXh0ZW5kKHt9LCBpbmZvKTtcbiAgICBpZnJhbWVJbmZvLnNhbWVPcmlnaW4gPSB0cnVlO1xuICAgIHJldHVybiB0cmFuc3BvcnQuZW5hYmxlZChpZnJhbWVJbmZvKSAmJiBJZnJhbWVUcmFuc3BvcnQuZW5hYmxlZCgpO1xuICB9O1xuXG4gIElmcmFtZVdyYXBUcmFuc3BvcnQudHJhbnNwb3J0TmFtZSA9ICdpZnJhbWUtJyArIHRyYW5zcG9ydC50cmFuc3BvcnROYW1lO1xuICBJZnJhbWVXcmFwVHJhbnNwb3J0Lm5lZWRCb2R5ID0gdHJ1ZTtcbiAgSWZyYW1lV3JhcFRyYW5zcG9ydC5yb3VuZFRyaXBzID0gSWZyYW1lVHJhbnNwb3J0LnJvdW5kVHJpcHMgKyB0cmFuc3BvcnQucm91bmRUcmlwcyAtIDE7IC8vIGh0bWwsIGphdmFzY3JpcHQgKDIpICsgdHJhbnNwb3J0IC0gbm8gQ09SUyAoMSlcblxuICBJZnJhbWVXcmFwVHJhbnNwb3J0LmZhY2FkZVRyYW5zcG9ydCA9IHRyYW5zcG9ydDtcblxuICByZXR1cm4gSWZyYW1lV3JhcFRyYW5zcG9ydDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJylcbiAgLCBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXJcbiAgO1xuXG52YXIgZGVidWcgPSBmdW5jdGlvbigpIHt9O1xuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdzb2NranMtY2xpZW50OnBvbGxpbmcnKTtcbn1cblxuZnVuY3Rpb24gUG9sbGluZyhSZWNlaXZlciwgcmVjZWl2ZVVybCwgQWpheE9iamVjdCkge1xuICBkZWJ1ZyhyZWNlaXZlVXJsKTtcbiAgRXZlbnRFbWl0dGVyLmNhbGwodGhpcyk7XG4gIHRoaXMuUmVjZWl2ZXIgPSBSZWNlaXZlcjtcbiAgdGhpcy5yZWNlaXZlVXJsID0gcmVjZWl2ZVVybDtcbiAgdGhpcy5BamF4T2JqZWN0ID0gQWpheE9iamVjdDtcbiAgdGhpcy5fc2NoZWR1bGVSZWNlaXZlcigpO1xufVxuXG5pbmhlcml0cyhQb2xsaW5nLCBFdmVudEVtaXR0ZXIpO1xuXG5Qb2xsaW5nLnByb3RvdHlwZS5fc2NoZWR1bGVSZWNlaXZlciA9IGZ1bmN0aW9uKCkge1xuICBkZWJ1ZygnX3NjaGVkdWxlUmVjZWl2ZXInKTtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgcG9sbCA9IHRoaXMucG9sbCA9IG5ldyB0aGlzLlJlY2VpdmVyKHRoaXMucmVjZWl2ZVVybCwgdGhpcy5BamF4T2JqZWN0KTtcblxuICBwb2xsLm9uKCdtZXNzYWdlJywgZnVuY3Rpb24obXNnKSB7XG4gICAgZGVidWcoJ21lc3NhZ2UnLCBtc2cpO1xuICAgIHNlbGYuZW1pdCgnbWVzc2FnZScsIG1zZyk7XG4gIH0pO1xuXG4gIHBvbGwub25jZSgnY2xvc2UnLCBmdW5jdGlvbihjb2RlLCByZWFzb24pIHtcbiAgICBkZWJ1ZygnY2xvc2UnLCBjb2RlLCByZWFzb24sIHNlbGYucG9sbElzQ2xvc2luZyk7XG4gICAgc2VsZi5wb2xsID0gcG9sbCA9IG51bGw7XG5cbiAgICBpZiAoIXNlbGYucG9sbElzQ2xvc2luZykge1xuICAgICAgaWYgKHJlYXNvbiA9PT0gJ25ldHdvcmsnKSB7XG4gICAgICAgIHNlbGYuX3NjaGVkdWxlUmVjZWl2ZXIoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlbGYuZW1pdCgnY2xvc2UnLCBjb2RlIHx8IDEwMDYsIHJlYXNvbik7XG4gICAgICAgIHNlbGYucmVtb3ZlQWxsTGlzdGVuZXJzKCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn07XG5cblBvbGxpbmcucHJvdG90eXBlLmFib3J0ID0gZnVuY3Rpb24oKSB7XG4gIGRlYnVnKCdhYm9ydCcpO1xuICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygpO1xuICB0aGlzLnBvbGxJc0Nsb3NpbmcgPSB0cnVlO1xuICBpZiAodGhpcy5wb2xsKSB7XG4gICAgdGhpcy5wb2xsLmFib3J0KCk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUG9sbGluZztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKVxuICAsIHVybFV0aWxzID0gcmVxdWlyZSgnLi4vLi4vdXRpbHMvdXJsJylcbiAgLCBCdWZmZXJlZFNlbmRlciA9IHJlcXVpcmUoJy4vYnVmZmVyZWQtc2VuZGVyJylcbiAgLCBQb2xsaW5nID0gcmVxdWlyZSgnLi9wb2xsaW5nJylcbiAgO1xuXG52YXIgZGVidWcgPSBmdW5jdGlvbigpIHt9O1xuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdzb2NranMtY2xpZW50OnNlbmRlci1yZWNlaXZlcicpO1xufVxuXG5mdW5jdGlvbiBTZW5kZXJSZWNlaXZlcih0cmFuc1VybCwgdXJsU3VmZml4LCBzZW5kZXJGdW5jLCBSZWNlaXZlciwgQWpheE9iamVjdCkge1xuICB2YXIgcG9sbFVybCA9IHVybFV0aWxzLmFkZFBhdGgodHJhbnNVcmwsIHVybFN1ZmZpeCk7XG4gIGRlYnVnKHBvbGxVcmwpO1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIEJ1ZmZlcmVkU2VuZGVyLmNhbGwodGhpcywgdHJhbnNVcmwsIHNlbmRlckZ1bmMpO1xuXG4gIHRoaXMucG9sbCA9IG5ldyBQb2xsaW5nKFJlY2VpdmVyLCBwb2xsVXJsLCBBamF4T2JqZWN0KTtcbiAgdGhpcy5wb2xsLm9uKCdtZXNzYWdlJywgZnVuY3Rpb24obXNnKSB7XG4gICAgZGVidWcoJ3BvbGwgbWVzc2FnZScsIG1zZyk7XG4gICAgc2VsZi5lbWl0KCdtZXNzYWdlJywgbXNnKTtcbiAgfSk7XG4gIHRoaXMucG9sbC5vbmNlKCdjbG9zZScsIGZ1bmN0aW9uKGNvZGUsIHJlYXNvbikge1xuICAgIGRlYnVnKCdwb2xsIGNsb3NlJywgY29kZSwgcmVhc29uKTtcbiAgICBzZWxmLnBvbGwgPSBudWxsO1xuICAgIHNlbGYuZW1pdCgnY2xvc2UnLCBjb2RlLCByZWFzb24pO1xuICAgIHNlbGYuY2xvc2UoKTtcbiAgfSk7XG59XG5cbmluaGVyaXRzKFNlbmRlclJlY2VpdmVyLCBCdWZmZXJlZFNlbmRlcik7XG5cblNlbmRlclJlY2VpdmVyLnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuICBCdWZmZXJlZFNlbmRlci5wcm90b3R5cGUuY2xvc2UuY2FsbCh0aGlzKTtcbiAgZGVidWcoJ2Nsb3NlJyk7XG4gIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCk7XG4gIGlmICh0aGlzLnBvbGwpIHtcbiAgICB0aGlzLnBvbGwuYWJvcnQoKTtcbiAgICB0aGlzLnBvbGwgPSBudWxsO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNlbmRlclJlY2VpdmVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpXG4gICwgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyXG4gICwgRXZlbnRTb3VyY2VEcml2ZXIgPSByZXF1aXJlKCdldmVudHNvdXJjZScpXG4gIDtcblxudmFyIGRlYnVnID0gZnVuY3Rpb24oKSB7fTtcbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIGRlYnVnID0gcmVxdWlyZSgnZGVidWcnKSgnc29ja2pzLWNsaWVudDpyZWNlaXZlcjpldmVudHNvdXJjZScpO1xufVxuXG5mdW5jdGlvbiBFdmVudFNvdXJjZVJlY2VpdmVyKHVybCkge1xuICBkZWJ1Zyh1cmwpO1xuICBFdmVudEVtaXR0ZXIuY2FsbCh0aGlzKTtcblxuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBlcyA9IHRoaXMuZXMgPSBuZXcgRXZlbnRTb3VyY2VEcml2ZXIodXJsKTtcbiAgZXMub25tZXNzYWdlID0gZnVuY3Rpb24oZSkge1xuICAgIGRlYnVnKCdtZXNzYWdlJywgZS5kYXRhKTtcbiAgICBzZWxmLmVtaXQoJ21lc3NhZ2UnLCBkZWNvZGVVUkkoZS5kYXRhKSk7XG4gIH07XG4gIGVzLm9uZXJyb3IgPSBmdW5jdGlvbihlKSB7XG4gICAgZGVidWcoJ2Vycm9yJywgZXMucmVhZHlTdGF0ZSwgZSk7XG4gICAgLy8gRVMgb24gcmVjb25uZWN0aW9uIGhhcyByZWFkeVN0YXRlID0gMCBvciAxLlxuICAgIC8vIG9uIG5ldHdvcmsgZXJyb3IgaXQncyBDTE9TRUQgPSAyXG4gICAgdmFyIHJlYXNvbiA9IChlcy5yZWFkeVN0YXRlICE9PSAyID8gJ25ldHdvcmsnIDogJ3Blcm1hbmVudCcpO1xuICAgIHNlbGYuX2NsZWFudXAoKTtcbiAgICBzZWxmLl9jbG9zZShyZWFzb24pO1xuICB9O1xufVxuXG5pbmhlcml0cyhFdmVudFNvdXJjZVJlY2VpdmVyLCBFdmVudEVtaXR0ZXIpO1xuXG5FdmVudFNvdXJjZVJlY2VpdmVyLnByb3RvdHlwZS5hYm9ydCA9IGZ1bmN0aW9uKCkge1xuICBkZWJ1ZygnYWJvcnQnKTtcbiAgdGhpcy5fY2xlYW51cCgpO1xuICB0aGlzLl9jbG9zZSgndXNlcicpO1xufTtcblxuRXZlbnRTb3VyY2VSZWNlaXZlci5wcm90b3R5cGUuX2NsZWFudXAgPSBmdW5jdGlvbigpIHtcbiAgZGVidWcoJ2NsZWFudXAnKTtcbiAgdmFyIGVzID0gdGhpcy5lcztcbiAgaWYgKGVzKSB7XG4gICAgZXMub25tZXNzYWdlID0gZXMub25lcnJvciA9IG51bGw7XG4gICAgZXMuY2xvc2UoKTtcbiAgICB0aGlzLmVzID0gbnVsbDtcbiAgfVxufTtcblxuRXZlbnRTb3VyY2VSZWNlaXZlci5wcm90b3R5cGUuX2Nsb3NlID0gZnVuY3Rpb24ocmVhc29uKSB7XG4gIGRlYnVnKCdjbG9zZScsIHJlYXNvbik7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgLy8gU2FmYXJpIGFuZCBjaHJvbWUgPCAxNSBjcmFzaCBpZiB3ZSBjbG9zZSB3aW5kb3cgYmVmb3JlXG4gIC8vIHdhaXRpbmcgZm9yIEVTIGNsZWFudXAuIFNlZTpcbiAgLy8gaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTg5MTU1XG4gIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgc2VsZi5lbWl0KCdjbG9zZScsIG51bGwsIHJlYXNvbik7XG4gICAgc2VsZi5yZW1vdmVBbGxMaXN0ZW5lcnMoKTtcbiAgfSwgMjAwKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRTb3VyY2VSZWNlaXZlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKVxuICAsIGlmcmFtZVV0aWxzID0gcmVxdWlyZSgnLi4vLi4vdXRpbHMvaWZyYW1lJylcbiAgLCB1cmxVdGlscyA9IHJlcXVpcmUoJy4uLy4uL3V0aWxzL3VybCcpXG4gICwgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyXG4gICwgcmFuZG9tID0gcmVxdWlyZSgnLi4vLi4vdXRpbHMvcmFuZG9tJylcbiAgO1xuXG52YXIgZGVidWcgPSBmdW5jdGlvbigpIHt9O1xuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdzb2NranMtY2xpZW50OnJlY2VpdmVyOmh0bWxmaWxlJyk7XG59XG5cbmZ1bmN0aW9uIEh0bWxmaWxlUmVjZWl2ZXIodXJsKSB7XG4gIGRlYnVnKHVybCk7XG4gIEV2ZW50RW1pdHRlci5jYWxsKHRoaXMpO1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIGlmcmFtZVV0aWxzLnBvbGx1dGVHbG9iYWxOYW1lc3BhY2UoKTtcblxuICB0aGlzLmlkID0gJ2EnICsgcmFuZG9tLnN0cmluZyg2KTtcbiAgdXJsID0gdXJsVXRpbHMuYWRkUXVlcnkodXJsLCAnYz0nICsgZGVjb2RlVVJJQ29tcG9uZW50KGlmcmFtZVV0aWxzLldQcmVmaXggKyAnLicgKyB0aGlzLmlkKSk7XG5cbiAgZGVidWcoJ3VzaW5nIGh0bWxmaWxlJywgSHRtbGZpbGVSZWNlaXZlci5odG1sZmlsZUVuYWJsZWQpO1xuICB2YXIgY29uc3RydWN0RnVuYyA9IEh0bWxmaWxlUmVjZWl2ZXIuaHRtbGZpbGVFbmFibGVkID9cbiAgICAgIGlmcmFtZVV0aWxzLmNyZWF0ZUh0bWxmaWxlIDogaWZyYW1lVXRpbHMuY3JlYXRlSWZyYW1lO1xuXG4gIGdsb2JhbFtpZnJhbWVVdGlscy5XUHJlZml4XVt0aGlzLmlkXSA9IHtcbiAgICBzdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICBkZWJ1Zygnc3RhcnQnKTtcbiAgICAgIHNlbGYuaWZyYW1lT2JqLmxvYWRlZCgpO1xuICAgIH1cbiAgLCBtZXNzYWdlOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBkZWJ1ZygnbWVzc2FnZScsIGRhdGEpO1xuICAgICAgc2VsZi5lbWl0KCdtZXNzYWdlJywgZGF0YSk7XG4gICAgfVxuICAsIHN0b3A6IGZ1bmN0aW9uKCkge1xuICAgICAgZGVidWcoJ3N0b3AnKTtcbiAgICAgIHNlbGYuX2NsZWFudXAoKTtcbiAgICAgIHNlbGYuX2Nsb3NlKCduZXR3b3JrJyk7XG4gICAgfVxuICB9O1xuICB0aGlzLmlmcmFtZU9iaiA9IGNvbnN0cnVjdEZ1bmModXJsLCBmdW5jdGlvbigpIHtcbiAgICBkZWJ1ZygnY2FsbGJhY2snKTtcbiAgICBzZWxmLl9jbGVhbnVwKCk7XG4gICAgc2VsZi5fY2xvc2UoJ3Blcm1hbmVudCcpO1xuICB9KTtcbn1cblxuaW5oZXJpdHMoSHRtbGZpbGVSZWNlaXZlciwgRXZlbnRFbWl0dGVyKTtcblxuSHRtbGZpbGVSZWNlaXZlci5wcm90b3R5cGUuYWJvcnQgPSBmdW5jdGlvbigpIHtcbiAgZGVidWcoJ2Fib3J0Jyk7XG4gIHRoaXMuX2NsZWFudXAoKTtcbiAgdGhpcy5fY2xvc2UoJ3VzZXInKTtcbn07XG5cbkh0bWxmaWxlUmVjZWl2ZXIucHJvdG90eXBlLl9jbGVhbnVwID0gZnVuY3Rpb24oKSB7XG4gIGRlYnVnKCdfY2xlYW51cCcpO1xuICBpZiAodGhpcy5pZnJhbWVPYmopIHtcbiAgICB0aGlzLmlmcmFtZU9iai5jbGVhbnVwKCk7XG4gICAgdGhpcy5pZnJhbWVPYmogPSBudWxsO1xuICB9XG4gIGRlbGV0ZSBnbG9iYWxbaWZyYW1lVXRpbHMuV1ByZWZpeF1bdGhpcy5pZF07XG59O1xuXG5IdG1sZmlsZVJlY2VpdmVyLnByb3RvdHlwZS5fY2xvc2UgPSBmdW5jdGlvbihyZWFzb24pIHtcbiAgZGVidWcoJ19jbG9zZScsIHJlYXNvbik7XG4gIHRoaXMuZW1pdCgnY2xvc2UnLCBudWxsLCByZWFzb24pO1xuICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygpO1xufTtcblxuSHRtbGZpbGVSZWNlaXZlci5odG1sZmlsZUVuYWJsZWQgPSBmYWxzZTtcblxuLy8gb2JmdXNjYXRlIHRvIGF2b2lkIGZpcmV3YWxsc1xudmFyIGF4byA9IFsnQWN0aXZlJ10uY29uY2F0KCdPYmplY3QnKS5qb2luKCdYJyk7XG5pZiAoYXhvIGluIGdsb2JhbCkge1xuICB0cnkge1xuICAgIEh0bWxmaWxlUmVjZWl2ZXIuaHRtbGZpbGVFbmFibGVkID0gISFuZXcgZ2xvYmFsW2F4b10oJ2h0bWxmaWxlJyk7XG4gIH0gY2F0Y2ggKHgpIHtcbiAgICAvLyBpbnRlbnRpb25hbGx5IGVtcHR5XG4gIH1cbn1cblxuSHRtbGZpbGVSZWNlaXZlci5lbmFibGVkID0gSHRtbGZpbGVSZWNlaXZlci5odG1sZmlsZUVuYWJsZWQgfHwgaWZyYW1lVXRpbHMuaWZyYW1lRW5hYmxlZDtcblxubW9kdWxlLmV4cG9ydHMgPSBIdG1sZmlsZVJlY2VpdmVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi8uLi91dGlscy9pZnJhbWUnKVxuICAsIHJhbmRvbSA9IHJlcXVpcmUoJy4uLy4uL3V0aWxzL3JhbmRvbScpXG4gICwgYnJvd3NlciA9IHJlcXVpcmUoJy4uLy4uL3V0aWxzL2Jyb3dzZXInKVxuICAsIHVybFV0aWxzID0gcmVxdWlyZSgnLi4vLi4vdXRpbHMvdXJsJylcbiAgLCBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJylcbiAgLCBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXJcbiAgO1xuXG52YXIgZGVidWcgPSBmdW5jdGlvbigpIHt9O1xuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdzb2NranMtY2xpZW50OnJlY2VpdmVyOmpzb25wJyk7XG59XG5cbmZ1bmN0aW9uIEpzb25wUmVjZWl2ZXIodXJsKSB7XG4gIGRlYnVnKHVybCk7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgRXZlbnRFbWl0dGVyLmNhbGwodGhpcyk7XG5cbiAgdXRpbHMucG9sbHV0ZUdsb2JhbE5hbWVzcGFjZSgpO1xuXG4gIHRoaXMuaWQgPSAnYScgKyByYW5kb20uc3RyaW5nKDYpO1xuICB2YXIgdXJsV2l0aElkID0gdXJsVXRpbHMuYWRkUXVlcnkodXJsLCAnYz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHV0aWxzLldQcmVmaXggKyAnLicgKyB0aGlzLmlkKSk7XG5cbiAgZ2xvYmFsW3V0aWxzLldQcmVmaXhdW3RoaXMuaWRdID0gdGhpcy5fY2FsbGJhY2suYmluZCh0aGlzKTtcbiAgdGhpcy5fY3JlYXRlU2NyaXB0KHVybFdpdGhJZCk7XG5cbiAgLy8gRmFsbGJhY2sgbW9zdGx5IGZvciBLb25xdWVyb3IgLSBzdHVwaWQgdGltZXIsIDM1IHNlY29uZHMgc2hhbGwgYmUgcGxlbnR5LlxuICB0aGlzLnRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgZGVidWcoJ3RpbWVvdXQnKTtcbiAgICBzZWxmLl9hYm9ydChuZXcgRXJyb3IoJ0pTT05QIHNjcmlwdCBsb2FkZWQgYWJub3JtYWxseSAodGltZW91dCknKSk7XG4gIH0sIEpzb25wUmVjZWl2ZXIudGltZW91dCk7XG59XG5cbmluaGVyaXRzKEpzb25wUmVjZWl2ZXIsIEV2ZW50RW1pdHRlcik7XG5cbkpzb25wUmVjZWl2ZXIucHJvdG90eXBlLmFib3J0ID0gZnVuY3Rpb24oKSB7XG4gIGRlYnVnKCdhYm9ydCcpO1xuICBpZiAoZ2xvYmFsW3V0aWxzLldQcmVmaXhdW3RoaXMuaWRdKSB7XG4gICAgdmFyIGVyciA9IG5ldyBFcnJvcignSlNPTlAgdXNlciBhYm9ydGVkIHJlYWQnKTtcbiAgICBlcnIuY29kZSA9IDEwMDA7XG4gICAgdGhpcy5fYWJvcnQoZXJyKTtcbiAgfVxufTtcblxuSnNvbnBSZWNlaXZlci50aW1lb3V0ID0gMzUwMDA7XG5Kc29ucFJlY2VpdmVyLnNjcmlwdEVycm9yVGltZW91dCA9IDEwMDA7XG5cbkpzb25wUmVjZWl2ZXIucHJvdG90eXBlLl9jYWxsYmFjayA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgZGVidWcoJ19jYWxsYmFjaycsIGRhdGEpO1xuICB0aGlzLl9jbGVhbnVwKCk7XG5cbiAgaWYgKHRoaXMuYWJvcnRpbmcpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoZGF0YSkge1xuICAgIGRlYnVnKCdtZXNzYWdlJywgZGF0YSk7XG4gICAgdGhpcy5lbWl0KCdtZXNzYWdlJywgZGF0YSk7XG4gIH1cbiAgdGhpcy5lbWl0KCdjbG9zZScsIG51bGwsICduZXR3b3JrJyk7XG4gIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCk7XG59O1xuXG5Kc29ucFJlY2VpdmVyLnByb3RvdHlwZS5fYWJvcnQgPSBmdW5jdGlvbihlcnIpIHtcbiAgZGVidWcoJ19hYm9ydCcsIGVycik7XG4gIHRoaXMuX2NsZWFudXAoKTtcbiAgdGhpcy5hYm9ydGluZyA9IHRydWU7XG4gIHRoaXMuZW1pdCgnY2xvc2UnLCBlcnIuY29kZSwgZXJyLm1lc3NhZ2UpO1xuICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygpO1xufTtcblxuSnNvbnBSZWNlaXZlci5wcm90b3R5cGUuX2NsZWFudXAgPSBmdW5jdGlvbigpIHtcbiAgZGVidWcoJ19jbGVhbnVwJyk7XG4gIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXRJZCk7XG4gIGlmICh0aGlzLnNjcmlwdDIpIHtcbiAgICB0aGlzLnNjcmlwdDIucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLnNjcmlwdDIpO1xuICAgIHRoaXMuc2NyaXB0MiA9IG51bGw7XG4gIH1cbiAgaWYgKHRoaXMuc2NyaXB0KSB7XG4gICAgdmFyIHNjcmlwdCA9IHRoaXMuc2NyaXB0O1xuICAgIC8vIFVuZm9ydHVuYXRlbHksIHlvdSBjYW4ndCByZWFsbHkgYWJvcnQgc2NyaXB0IGxvYWRpbmcgb2ZcbiAgICAvLyB0aGUgc2NyaXB0LlxuICAgIHNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdCk7XG4gICAgc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IHNjcmlwdC5vbmVycm9yID1cbiAgICAgICAgc2NyaXB0Lm9ubG9hZCA9IHNjcmlwdC5vbmNsaWNrID0gbnVsbDtcbiAgICB0aGlzLnNjcmlwdCA9IG51bGw7XG4gIH1cbiAgZGVsZXRlIGdsb2JhbFt1dGlscy5XUHJlZml4XVt0aGlzLmlkXTtcbn07XG5cbkpzb25wUmVjZWl2ZXIucHJvdG90eXBlLl9zY3JpcHRFcnJvciA9IGZ1bmN0aW9uKCkge1xuICBkZWJ1ZygnX3NjcmlwdEVycm9yJyk7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgaWYgKHRoaXMuZXJyb3JUaW1lcikge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRoaXMuZXJyb3JUaW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgaWYgKCFzZWxmLmxvYWRlZE9rYXkpIHtcbiAgICAgIHNlbGYuX2Fib3J0KG5ldyBFcnJvcignSlNPTlAgc2NyaXB0IGxvYWRlZCBhYm5vcm1hbGx5IChvbmVycm9yKScpKTtcbiAgICB9XG4gIH0sIEpzb25wUmVjZWl2ZXIuc2NyaXB0RXJyb3JUaW1lb3V0KTtcbn07XG5cbkpzb25wUmVjZWl2ZXIucHJvdG90eXBlLl9jcmVhdGVTY3JpcHQgPSBmdW5jdGlvbih1cmwpIHtcbiAgZGVidWcoJ19jcmVhdGVTY3JpcHQnLCB1cmwpO1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBzY3JpcHQgPSB0aGlzLnNjcmlwdCA9IGdsb2JhbC5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgdmFyIHNjcmlwdDI7ICAvLyBPcGVyYSBzeW5jaHJvbm91cyBsb2FkIHRyaWNrLlxuXG4gIHNjcmlwdC5pZCA9ICdhJyArIHJhbmRvbS5zdHJpbmcoOCk7XG4gIHNjcmlwdC5zcmMgPSB1cmw7XG4gIHNjcmlwdC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XG4gIHNjcmlwdC5jaGFyc2V0ID0gJ1VURi04JztcbiAgc2NyaXB0Lm9uZXJyb3IgPSB0aGlzLl9zY3JpcHRFcnJvci5iaW5kKHRoaXMpO1xuICBzY3JpcHQub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgZGVidWcoJ29ubG9hZCcpO1xuICAgIHNlbGYuX2Fib3J0KG5ldyBFcnJvcignSlNPTlAgc2NyaXB0IGxvYWRlZCBhYm5vcm1hbGx5IChvbmxvYWQpJykpO1xuICB9O1xuXG4gIC8vIElFOSBmaXJlcyAnZXJyb3InIGV2ZW50IGFmdGVyIG9ucmVhZHlzdGF0ZWNoYW5nZSBvciBiZWZvcmUsIGluIHJhbmRvbSBvcmRlci5cbiAgLy8gVXNlIGxvYWRlZE9rYXkgdG8gZGV0ZXJtaW5lIGlmIGFjdHVhbGx5IGVycm9yZWRcbiAgc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgIGRlYnVnKCdvbnJlYWR5c3RhdGVjaGFuZ2UnLCBzY3JpcHQucmVhZHlTdGF0ZSk7XG4gICAgaWYgKC9sb2FkZWR8Y2xvc2VkLy50ZXN0KHNjcmlwdC5yZWFkeVN0YXRlKSkge1xuICAgICAgaWYgKHNjcmlwdCAmJiBzY3JpcHQuaHRtbEZvciAmJiBzY3JpcHQub25jbGljaykge1xuICAgICAgICBzZWxmLmxvYWRlZE9rYXkgPSB0cnVlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIEluIElFLCBhY3R1YWxseSBleGVjdXRlIHRoZSBzY3JpcHQuXG4gICAgICAgICAgc2NyaXB0Lm9uY2xpY2soKTtcbiAgICAgICAgfSBjYXRjaCAoeCkge1xuICAgICAgICAgIC8vIGludGVudGlvbmFsbHkgZW1wdHlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHNjcmlwdCkge1xuICAgICAgICBzZWxmLl9hYm9ydChuZXcgRXJyb3IoJ0pTT05QIHNjcmlwdCBsb2FkZWQgYWJub3JtYWxseSAob25yZWFkeXN0YXRlY2hhbmdlKScpKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIC8vIElFOiBldmVudC9odG1sRm9yL29uY2xpY2sgdHJpY2suXG4gIC8vIE9uZSBjYW4ndCByZWx5IG9uIHByb3BlciBvcmRlciBmb3Igb25yZWFkeXN0YXRlY2hhbmdlLiBJbiBvcmRlciB0b1xuICAvLyBtYWtlIHN1cmUsIHNldCBhICdodG1sRm9yJyBhbmQgJ2V2ZW50JyBwcm9wZXJ0aWVzLCBzbyB0aGF0XG4gIC8vIHNjcmlwdCBjb2RlIHdpbGwgYmUgaW5zdGFsbGVkIGFzICdvbmNsaWNrJyBoYW5kbGVyIGZvciB0aGVcbiAgLy8gc2NyaXB0IG9iamVjdC4gTGF0ZXIsIG9ucmVhZHlzdGF0ZWNoYW5nZSwgbWFudWFsbHkgZXhlY3V0ZSB0aGlzXG4gIC8vIGNvZGUuIEZGIGFuZCBDaHJvbWUgZG9lc24ndCB3b3JrIHdpdGggJ2V2ZW50JyBhbmQgJ2h0bWxGb3InXG4gIC8vIHNldC4gRm9yIHJlZmVyZW5jZSBzZWU6XG4gIC8vICAgaHR0cDovL2phdWJvdXJnLm5ldC8yMDEwLzA3L2xvYWRpbmctc2NyaXB0LWFzLW9uY2xpY2staGFuZGxlci1vZi5odG1sXG4gIC8vIEFsc28sIHJlYWQgb24gdGhhdCBhYm91dCBzY3JpcHQgb3JkZXJpbmc6XG4gIC8vICAgaHR0cDovL3dpa2kud2hhdHdnLm9yZy93aWtpL0R5bmFtaWNfU2NyaXB0X0V4ZWN1dGlvbl9PcmRlclxuICBpZiAodHlwZW9mIHNjcmlwdC5hc3luYyA9PT0gJ3VuZGVmaW5lZCcgJiYgZ2xvYmFsLmRvY3VtZW50LmF0dGFjaEV2ZW50KSB7XG4gICAgLy8gQWNjb3JkaW5nIHRvIG1vemlsbGEgZG9jcywgaW4gcmVjZW50IGJyb3dzZXJzIHNjcmlwdC5hc3luYyBkZWZhdWx0c1xuICAgIC8vIHRvICd0cnVlJywgc28gd2UgbWF5IHVzZSBpdCB0byBkZXRlY3QgYSBnb29kIGJyb3dzZXI6XG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vSFRNTC9FbGVtZW50L3NjcmlwdFxuICAgIGlmICghYnJvd3Nlci5pc09wZXJhKCkpIHtcbiAgICAgIC8vIE5haXZlbHkgYXNzdW1lIHdlJ3JlIGluIElFXG4gICAgICB0cnkge1xuICAgICAgICBzY3JpcHQuaHRtbEZvciA9IHNjcmlwdC5pZDtcbiAgICAgICAgc2NyaXB0LmV2ZW50ID0gJ29uY2xpY2snO1xuICAgICAgfSBjYXRjaCAoeCkge1xuICAgICAgICAvLyBpbnRlbnRpb25hbGx5IGVtcHR5XG4gICAgICB9XG4gICAgICBzY3JpcHQuYXN5bmMgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBPcGVyYSwgc2Vjb25kIHN5bmMgc2NyaXB0IGhhY2tcbiAgICAgIHNjcmlwdDIgPSB0aGlzLnNjcmlwdDIgPSBnbG9iYWwuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgICBzY3JpcHQyLnRleHQgPSBcInRyeXt2YXIgYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdcIiArIHNjcmlwdC5pZCArIFwiJyk7IGlmKGEpYS5vbmVycm9yKCk7fWNhdGNoKHgpe307XCI7XG4gICAgICBzY3JpcHQuYXN5bmMgPSBzY3JpcHQyLmFzeW5jID0gZmFsc2U7XG4gICAgfVxuICB9XG4gIGlmICh0eXBlb2Ygc2NyaXB0LmFzeW5jICE9PSAndW5kZWZpbmVkJykge1xuICAgIHNjcmlwdC5hc3luYyA9IHRydWU7XG4gIH1cblxuICB2YXIgaGVhZCA9IGdsb2JhbC5kb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICBoZWFkLmluc2VydEJlZm9yZShzY3JpcHQsIGhlYWQuZmlyc3RDaGlsZCk7XG4gIGlmIChzY3JpcHQyKSB7XG4gICAgaGVhZC5pbnNlcnRCZWZvcmUoc2NyaXB0MiwgaGVhZC5maXJzdENoaWxkKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBKc29ucFJlY2VpdmVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpXG4gICwgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyXG4gIDtcblxudmFyIGRlYnVnID0gZnVuY3Rpb24oKSB7fTtcbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIGRlYnVnID0gcmVxdWlyZSgnZGVidWcnKSgnc29ja2pzLWNsaWVudDpyZWNlaXZlcjp4aHInKTtcbn1cblxuZnVuY3Rpb24gWGhyUmVjZWl2ZXIodXJsLCBBamF4T2JqZWN0KSB7XG4gIGRlYnVnKHVybCk7XG4gIEV2ZW50RW1pdHRlci5jYWxsKHRoaXMpO1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgdGhpcy5idWZmZXJQb3NpdGlvbiA9IDA7XG5cbiAgdGhpcy54byA9IG5ldyBBamF4T2JqZWN0KCdQT1NUJywgdXJsLCBudWxsKTtcbiAgdGhpcy54by5vbignY2h1bmsnLCB0aGlzLl9jaHVua0hhbmRsZXIuYmluZCh0aGlzKSk7XG4gIHRoaXMueG8ub25jZSgnZmluaXNoJywgZnVuY3Rpb24oc3RhdHVzLCB0ZXh0KSB7XG4gICAgZGVidWcoJ2ZpbmlzaCcsIHN0YXR1cywgdGV4dCk7XG4gICAgc2VsZi5fY2h1bmtIYW5kbGVyKHN0YXR1cywgdGV4dCk7XG4gICAgc2VsZi54byA9IG51bGw7XG4gICAgdmFyIHJlYXNvbiA9IHN0YXR1cyA9PT0gMjAwID8gJ25ldHdvcmsnIDogJ3Blcm1hbmVudCc7XG4gICAgZGVidWcoJ2Nsb3NlJywgcmVhc29uKTtcbiAgICBzZWxmLmVtaXQoJ2Nsb3NlJywgbnVsbCwgcmVhc29uKTtcbiAgICBzZWxmLl9jbGVhbnVwKCk7XG4gIH0pO1xufVxuXG5pbmhlcml0cyhYaHJSZWNlaXZlciwgRXZlbnRFbWl0dGVyKTtcblxuWGhyUmVjZWl2ZXIucHJvdG90eXBlLl9jaHVua0hhbmRsZXIgPSBmdW5jdGlvbihzdGF0dXMsIHRleHQpIHtcbiAgZGVidWcoJ19jaHVua0hhbmRsZXInLCBzdGF0dXMpO1xuICBpZiAoc3RhdHVzICE9PSAyMDAgfHwgIXRleHQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBmb3IgKHZhciBpZHggPSAtMTsgOyB0aGlzLmJ1ZmZlclBvc2l0aW9uICs9IGlkeCArIDEpIHtcbiAgICB2YXIgYnVmID0gdGV4dC5zbGljZSh0aGlzLmJ1ZmZlclBvc2l0aW9uKTtcbiAgICBpZHggPSBidWYuaW5kZXhPZignXFxuJyk7XG4gICAgaWYgKGlkeCA9PT0gLTEpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICB2YXIgbXNnID0gYnVmLnNsaWNlKDAsIGlkeCk7XG4gICAgaWYgKG1zZykge1xuICAgICAgZGVidWcoJ21lc3NhZ2UnLCBtc2cpO1xuICAgICAgdGhpcy5lbWl0KCdtZXNzYWdlJywgbXNnKTtcbiAgICB9XG4gIH1cbn07XG5cblhoclJlY2VpdmVyLnByb3RvdHlwZS5fY2xlYW51cCA9IGZ1bmN0aW9uKCkge1xuICBkZWJ1ZygnX2NsZWFudXAnKTtcbiAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoKTtcbn07XG5cblhoclJlY2VpdmVyLnByb3RvdHlwZS5hYm9ydCA9IGZ1bmN0aW9uKCkge1xuICBkZWJ1ZygnYWJvcnQnKTtcbiAgaWYgKHRoaXMueG8pIHtcbiAgICB0aGlzLnhvLmNsb3NlKCk7XG4gICAgZGVidWcoJ2Nsb3NlJyk7XG4gICAgdGhpcy5lbWl0KCdjbG9zZScsIG51bGwsICd1c2VyJyk7XG4gICAgdGhpcy54byA9IG51bGw7XG4gIH1cbiAgdGhpcy5fY2xlYW51cCgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBYaHJSZWNlaXZlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHJhbmRvbSA9IHJlcXVpcmUoJy4uLy4uL3V0aWxzL3JhbmRvbScpXG4gICwgdXJsVXRpbHMgPSByZXF1aXJlKCcuLi8uLi91dGlscy91cmwnKVxuICA7XG5cbnZhciBkZWJ1ZyA9IGZ1bmN0aW9uKCkge307XG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICBkZWJ1ZyA9IHJlcXVpcmUoJ2RlYnVnJykoJ3NvY2tqcy1jbGllbnQ6c2VuZGVyOmpzb25wJyk7XG59XG5cbnZhciBmb3JtLCBhcmVhO1xuXG5mdW5jdGlvbiBjcmVhdGVJZnJhbWUoaWQpIHtcbiAgZGVidWcoJ2NyZWF0ZUlmcmFtZScsIGlkKTtcbiAgdHJ5IHtcbiAgICAvLyBpZTYgZHluYW1pYyBpZnJhbWVzIHdpdGggdGFyZ2V0PVwiXCIgc3VwcG9ydCAodGhhbmtzIENocmlzIExhbWJhY2hlcilcbiAgICByZXR1cm4gZ2xvYmFsLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJzxpZnJhbWUgbmFtZT1cIicgKyBpZCArICdcIj4nKTtcbiAgfSBjYXRjaCAoeCkge1xuICAgIHZhciBpZnJhbWUgPSBnbG9iYWwuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaWZyYW1lJyk7XG4gICAgaWZyYW1lLm5hbWUgPSBpZDtcbiAgICByZXR1cm4gaWZyYW1lO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUZvcm0oKSB7XG4gIGRlYnVnKCdjcmVhdGVGb3JtJyk7XG4gIGZvcm0gPSBnbG9iYWwuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9ybScpO1xuICBmb3JtLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIGZvcm0uc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICBmb3JtLm1ldGhvZCA9ICdQT1NUJztcbiAgZm9ybS5lbmN0eXBlID0gJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCc7XG4gIGZvcm0uYWNjZXB0Q2hhcnNldCA9ICdVVEYtOCc7XG5cbiAgYXJlYSA9IGdsb2JhbC5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpO1xuICBhcmVhLm5hbWUgPSAnZCc7XG4gIGZvcm0uYXBwZW5kQ2hpbGQoYXJlYSk7XG5cbiAgZ2xvYmFsLmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZm9ybSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odXJsLCBwYXlsb2FkLCBjYWxsYmFjaykge1xuICBkZWJ1Zyh1cmwsIHBheWxvYWQpO1xuICBpZiAoIWZvcm0pIHtcbiAgICBjcmVhdGVGb3JtKCk7XG4gIH1cbiAgdmFyIGlkID0gJ2EnICsgcmFuZG9tLnN0cmluZyg4KTtcbiAgZm9ybS50YXJnZXQgPSBpZDtcbiAgZm9ybS5hY3Rpb24gPSB1cmxVdGlscy5hZGRRdWVyeSh1cmxVdGlscy5hZGRQYXRoKHVybCwgJy9qc29ucF9zZW5kJyksICdpPScgKyBpZCk7XG5cbiAgdmFyIGlmcmFtZSA9IGNyZWF0ZUlmcmFtZShpZCk7XG4gIGlmcmFtZS5pZCA9IGlkO1xuICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgZm9ybS5hcHBlbmRDaGlsZChpZnJhbWUpO1xuXG4gIHRyeSB7XG4gICAgYXJlYS52YWx1ZSA9IHBheWxvYWQ7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyBzZXJpb3VzbHkgYnJva2VuIGJyb3dzZXJzIGdldCBoZXJlXG4gIH1cbiAgZm9ybS5zdWJtaXQoKTtcblxuICB2YXIgY29tcGxldGVkID0gZnVuY3Rpb24oZXJyKSB7XG4gICAgZGVidWcoJ2NvbXBsZXRlZCcsIGlkLCBlcnIpO1xuICAgIGlmICghaWZyYW1lLm9uZXJyb3IpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWZyYW1lLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGlmcmFtZS5vbmVycm9yID0gaWZyYW1lLm9ubG9hZCA9IG51bGw7XG4gICAgLy8gT3BlcmEgbWluaSBkb2Vzbid0IGxpa2UgaWYgd2UgR0MgaWZyYW1lXG4gICAgLy8gaW1tZWRpYXRlbHksIHRodXMgdGhpcyB0aW1lb3V0LlxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICBkZWJ1ZygnY2xlYW5pbmcgdXAnLCBpZCk7XG4gICAgICBpZnJhbWUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChpZnJhbWUpO1xuICAgICAgaWZyYW1lID0gbnVsbDtcbiAgICB9LCA1MDApO1xuICAgIGFyZWEudmFsdWUgPSAnJztcbiAgICAvLyBJdCBpcyBub3QgcG9zc2libGUgdG8gZGV0ZWN0IGlmIHRoZSBpZnJhbWUgc3VjY2VlZGVkIG9yXG4gICAgLy8gZmFpbGVkIHRvIHN1Ym1pdCBvdXIgZm9ybS5cbiAgICBjYWxsYmFjayhlcnIpO1xuICB9O1xuICBpZnJhbWUub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgIGRlYnVnKCdvbmVycm9yJywgaWQpO1xuICAgIGNvbXBsZXRlZCgpO1xuICB9O1xuICBpZnJhbWUub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgZGVidWcoJ29ubG9hZCcsIGlkKTtcbiAgICBjb21wbGV0ZWQoKTtcbiAgfTtcbiAgaWZyYW1lLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKGUpIHtcbiAgICBkZWJ1Zygnb25yZWFkeXN0YXRlY2hhbmdlJywgaWQsIGlmcmFtZS5yZWFkeVN0YXRlLCBlKTtcbiAgICBpZiAoaWZyYW1lLnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScpIHtcbiAgICAgIGNvbXBsZXRlZCgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGRlYnVnKCdhYm9ydGVkJywgaWQpO1xuICAgIGNvbXBsZXRlZChuZXcgRXJyb3IoJ0Fib3J0ZWQnKSk7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyXG4gICwgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpXG4gICwgZXZlbnRVdGlscyA9IHJlcXVpcmUoJy4uLy4uL3V0aWxzL2V2ZW50JylcbiAgLCBicm93c2VyID0gcmVxdWlyZSgnLi4vLi4vdXRpbHMvYnJvd3NlcicpXG4gICwgdXJsVXRpbHMgPSByZXF1aXJlKCcuLi8uLi91dGlscy91cmwnKVxuICA7XG5cbnZhciBkZWJ1ZyA9IGZ1bmN0aW9uKCkge307XG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICBkZWJ1ZyA9IHJlcXVpcmUoJ2RlYnVnJykoJ3NvY2tqcy1jbGllbnQ6c2VuZGVyOnhkcicpO1xufVxuXG4vLyBSZWZlcmVuY2VzOlxuLy8gICBodHRwOi8vYWpheGlhbi5jb20vYXJjaGl2ZXMvMTAwLWxpbmUtYWpheC13cmFwcGVyXG4vLyAgIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9jYzI4ODA2MCh2PVZTLjg1KS5hc3B4XG5cbmZ1bmN0aW9uIFhEUk9iamVjdChtZXRob2QsIHVybCwgcGF5bG9hZCkge1xuICBkZWJ1ZyhtZXRob2QsIHVybCk7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgRXZlbnRFbWl0dGVyLmNhbGwodGhpcyk7XG5cbiAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICBzZWxmLl9zdGFydChtZXRob2QsIHVybCwgcGF5bG9hZCk7XG4gIH0sIDApO1xufVxuXG5pbmhlcml0cyhYRFJPYmplY3QsIEV2ZW50RW1pdHRlcik7XG5cblhEUk9iamVjdC5wcm90b3R5cGUuX3N0YXJ0ID0gZnVuY3Rpb24obWV0aG9kLCB1cmwsIHBheWxvYWQpIHtcbiAgZGVidWcoJ19zdGFydCcpO1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciB4ZHIgPSBuZXcgZ2xvYmFsLlhEb21haW5SZXF1ZXN0KCk7XG4gIC8vIElFIGNhY2hlcyBldmVuIFBPU1RzXG4gIHVybCA9IHVybFV0aWxzLmFkZFF1ZXJ5KHVybCwgJ3Q9JyArICgrbmV3IERhdGUoKSkpO1xuXG4gIHhkci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgZGVidWcoJ29uZXJyb3InKTtcbiAgICBzZWxmLl9lcnJvcigpO1xuICB9O1xuICB4ZHIub250aW1lb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgZGVidWcoJ29udGltZW91dCcpO1xuICAgIHNlbGYuX2Vycm9yKCk7XG4gIH07XG4gIHhkci5vbnByb2dyZXNzID0gZnVuY3Rpb24oKSB7XG4gICAgZGVidWcoJ3Byb2dyZXNzJywgeGRyLnJlc3BvbnNlVGV4dCk7XG4gICAgc2VsZi5lbWl0KCdjaHVuaycsIDIwMCwgeGRyLnJlc3BvbnNlVGV4dCk7XG4gIH07XG4gIHhkci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICBkZWJ1ZygnbG9hZCcpO1xuICAgIHNlbGYuZW1pdCgnZmluaXNoJywgMjAwLCB4ZHIucmVzcG9uc2VUZXh0KTtcbiAgICBzZWxmLl9jbGVhbnVwKGZhbHNlKTtcbiAgfTtcbiAgdGhpcy54ZHIgPSB4ZHI7XG4gIHRoaXMudW5sb2FkUmVmID0gZXZlbnRVdGlscy51bmxvYWRBZGQoZnVuY3Rpb24oKSB7XG4gICAgc2VsZi5fY2xlYW51cCh0cnVlKTtcbiAgfSk7XG4gIHRyeSB7XG4gICAgLy8gRmFpbHMgd2l0aCBBY2Nlc3NEZW5pZWQgaWYgcG9ydCBudW1iZXIgaXMgYm9ndXNcbiAgICB0aGlzLnhkci5vcGVuKG1ldGhvZCwgdXJsKTtcbiAgICBpZiAodGhpcy50aW1lb3V0KSB7XG4gICAgICB0aGlzLnhkci50aW1lb3V0ID0gdGhpcy50aW1lb3V0O1xuICAgIH1cbiAgICB0aGlzLnhkci5zZW5kKHBheWxvYWQpO1xuICB9IGNhdGNoICh4KSB7XG4gICAgdGhpcy5fZXJyb3IoKTtcbiAgfVxufTtcblxuWERST2JqZWN0LnByb3RvdHlwZS5fZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5lbWl0KCdmaW5pc2gnLCAwLCAnJyk7XG4gIHRoaXMuX2NsZWFudXAoZmFsc2UpO1xufTtcblxuWERST2JqZWN0LnByb3RvdHlwZS5fY2xlYW51cCA9IGZ1bmN0aW9uKGFib3J0KSB7XG4gIGRlYnVnKCdjbGVhbnVwJywgYWJvcnQpO1xuICBpZiAoIXRoaXMueGRyKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCk7XG4gIGV2ZW50VXRpbHMudW5sb2FkRGVsKHRoaXMudW5sb2FkUmVmKTtcblxuICB0aGlzLnhkci5vbnRpbWVvdXQgPSB0aGlzLnhkci5vbmVycm9yID0gdGhpcy54ZHIub25wcm9ncmVzcyA9IHRoaXMueGRyLm9ubG9hZCA9IG51bGw7XG4gIGlmIChhYm9ydCkge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLnhkci5hYm9ydCgpO1xuICAgIH0gY2F0Y2ggKHgpIHtcbiAgICAgIC8vIGludGVudGlvbmFsbHkgZW1wdHlcbiAgICB9XG4gIH1cbiAgdGhpcy51bmxvYWRSZWYgPSB0aGlzLnhkciA9IG51bGw7XG59O1xuXG5YRFJPYmplY3QucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24oKSB7XG4gIGRlYnVnKCdjbG9zZScpO1xuICB0aGlzLl9jbGVhbnVwKHRydWUpO1xufTtcblxuLy8gSUUgOC85IGlmIHRoZSByZXF1ZXN0IHRhcmdldCB1c2VzIHRoZSBzYW1lIHNjaGVtZSAtICM3OVxuWERST2JqZWN0LmVuYWJsZWQgPSAhIShnbG9iYWwuWERvbWFpblJlcXVlc3QgJiYgYnJvd3Nlci5oYXNEb21haW4oKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gWERST2JqZWN0O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpXG4gICwgWGhyRHJpdmVyID0gcmVxdWlyZSgnLi4vZHJpdmVyL3hocicpXG4gIDtcblxuZnVuY3Rpb24gWEhSQ29yc09iamVjdChtZXRob2QsIHVybCwgcGF5bG9hZCwgb3B0cykge1xuICBYaHJEcml2ZXIuY2FsbCh0aGlzLCBtZXRob2QsIHVybCwgcGF5bG9hZCwgb3B0cyk7XG59XG5cbmluaGVyaXRzKFhIUkNvcnNPYmplY3QsIFhockRyaXZlcik7XG5cblhIUkNvcnNPYmplY3QuZW5hYmxlZCA9IFhockRyaXZlci5lbmFibGVkICYmIFhockRyaXZlci5zdXBwb3J0c0NPUlM7XG5cbm1vZHVsZS5leHBvcnRzID0gWEhSQ29yc09iamVjdDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlclxuICAsIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKVxuICA7XG5cbmZ1bmN0aW9uIFhIUkZha2UoLyogbWV0aG9kLCB1cmwsIHBheWxvYWQsIG9wdHMgKi8pIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBFdmVudEVtaXR0ZXIuY2FsbCh0aGlzKTtcblxuICB0aGlzLnRvID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICBzZWxmLmVtaXQoJ2ZpbmlzaCcsIDIwMCwgJ3t9Jyk7XG4gIH0sIFhIUkZha2UudGltZW91dCk7XG59XG5cbmluaGVyaXRzKFhIUkZha2UsIEV2ZW50RW1pdHRlcik7XG5cblhIUkZha2UucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24oKSB7XG4gIGNsZWFyVGltZW91dCh0aGlzLnRvKTtcbn07XG5cblhIUkZha2UudGltZW91dCA9IDIwMDA7XG5cbm1vZHVsZS5leHBvcnRzID0gWEhSRmFrZTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKVxuICAsIFhockRyaXZlciA9IHJlcXVpcmUoJy4uL2RyaXZlci94aHInKVxuICA7XG5cbmZ1bmN0aW9uIFhIUkxvY2FsT2JqZWN0KG1ldGhvZCwgdXJsLCBwYXlsb2FkIC8qLCBvcHRzICovKSB7XG4gIFhockRyaXZlci5jYWxsKHRoaXMsIG1ldGhvZCwgdXJsLCBwYXlsb2FkLCB7XG4gICAgbm9DcmVkZW50aWFsczogdHJ1ZVxuICB9KTtcbn1cblxuaW5oZXJpdHMoWEhSTG9jYWxPYmplY3QsIFhockRyaXZlcik7XG5cblhIUkxvY2FsT2JqZWN0LmVuYWJsZWQgPSBYaHJEcml2ZXIuZW5hYmxlZDtcblxubW9kdWxlLmV4cG9ydHMgPSBYSFJMb2NhbE9iamVjdDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMvZXZlbnQnKVxuICAsIHVybFV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMvdXJsJylcbiAgLCBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJylcbiAgLCBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXJcbiAgLCBXZWJzb2NrZXREcml2ZXIgPSByZXF1aXJlKCcuL2RyaXZlci93ZWJzb2NrZXQnKVxuICA7XG5cbnZhciBkZWJ1ZyA9IGZ1bmN0aW9uKCkge307XG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICBkZWJ1ZyA9IHJlcXVpcmUoJ2RlYnVnJykoJ3NvY2tqcy1jbGllbnQ6d2Vic29ja2V0Jyk7XG59XG5cbmZ1bmN0aW9uIFdlYlNvY2tldFRyYW5zcG9ydCh0cmFuc1VybCwgaWdub3JlLCBvcHRpb25zKSB7XG4gIGlmICghV2ViU29ja2V0VHJhbnNwb3J0LmVuYWJsZWQoKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignVHJhbnNwb3J0IGNyZWF0ZWQgd2hlbiBkaXNhYmxlZCcpO1xuICB9XG5cbiAgRXZlbnRFbWl0dGVyLmNhbGwodGhpcyk7XG4gIGRlYnVnKCdjb25zdHJ1Y3RvcicsIHRyYW5zVXJsKTtcblxuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciB1cmwgPSB1cmxVdGlscy5hZGRQYXRoKHRyYW5zVXJsLCAnL3dlYnNvY2tldCcpO1xuICBpZiAodXJsLnNsaWNlKDAsIDUpID09PSAnaHR0cHMnKSB7XG4gICAgdXJsID0gJ3dzcycgKyB1cmwuc2xpY2UoNSk7XG4gIH0gZWxzZSB7XG4gICAgdXJsID0gJ3dzJyArIHVybC5zbGljZSg0KTtcbiAgfVxuICB0aGlzLnVybCA9IHVybDtcblxuICB0aGlzLndzID0gbmV3IFdlYnNvY2tldERyaXZlcih0aGlzLnVybCwgW10sIG9wdGlvbnMpO1xuICB0aGlzLndzLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGUpIHtcbiAgICBkZWJ1ZygnbWVzc2FnZSBldmVudCcsIGUuZGF0YSk7XG4gICAgc2VsZi5lbWl0KCdtZXNzYWdlJywgZS5kYXRhKTtcbiAgfTtcbiAgLy8gRmlyZWZveCBoYXMgYW4gaW50ZXJlc3RpbmcgYnVnLiBJZiBhIHdlYnNvY2tldCBjb25uZWN0aW9uIGlzXG4gIC8vIGNyZWF0ZWQgYWZ0ZXIgb251bmxvYWQsIGl0IHN0YXlzIGFsaXZlIGV2ZW4gd2hlbiB1c2VyXG4gIC8vIG5hdmlnYXRlcyBhd2F5IGZyb20gdGhlIHBhZ2UuIEluIHN1Y2ggc2l0dWF0aW9uIGxldCdzIGxpZSAtXG4gIC8vIGxldCdzIG5vdCBvcGVuIHRoZSB3cyBjb25uZWN0aW9uIGF0IGFsbC4gU2VlOlxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vc29ja2pzL3NvY2tqcy1jbGllbnQvaXNzdWVzLzI4XG4gIC8vIGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTY5NjA4NVxuICB0aGlzLnVubG9hZFJlZiA9IHV0aWxzLnVubG9hZEFkZChmdW5jdGlvbigpIHtcbiAgICBkZWJ1ZygndW5sb2FkJyk7XG4gICAgc2VsZi53cy5jbG9zZSgpO1xuICB9KTtcbiAgdGhpcy53cy5vbmNsb3NlID0gZnVuY3Rpb24oZSkge1xuICAgIGRlYnVnKCdjbG9zZSBldmVudCcsIGUuY29kZSwgZS5yZWFzb24pO1xuICAgIHNlbGYuZW1pdCgnY2xvc2UnLCBlLmNvZGUsIGUucmVhc29uKTtcbiAgICBzZWxmLl9jbGVhbnVwKCk7XG4gIH07XG4gIHRoaXMud3Mub25lcnJvciA9IGZ1bmN0aW9uKGUpIHtcbiAgICBkZWJ1ZygnZXJyb3IgZXZlbnQnLCBlKTtcbiAgICBzZWxmLmVtaXQoJ2Nsb3NlJywgMTAwNiwgJ1dlYlNvY2tldCBjb25uZWN0aW9uIGJyb2tlbicpO1xuICAgIHNlbGYuX2NsZWFudXAoKTtcbiAgfTtcbn1cblxuaW5oZXJpdHMoV2ViU29ja2V0VHJhbnNwb3J0LCBFdmVudEVtaXR0ZXIpO1xuXG5XZWJTb2NrZXRUcmFuc3BvcnQucHJvdG90eXBlLnNlbmQgPSBmdW5jdGlvbihkYXRhKSB7XG4gIHZhciBtc2cgPSAnWycgKyBkYXRhICsgJ10nO1xuICBkZWJ1Zygnc2VuZCcsIG1zZyk7XG4gIHRoaXMud3Muc2VuZChtc2cpO1xufTtcblxuV2ViU29ja2V0VHJhbnNwb3J0LnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuICBkZWJ1ZygnY2xvc2UnKTtcbiAgdmFyIHdzID0gdGhpcy53cztcbiAgdGhpcy5fY2xlYW51cCgpO1xuICBpZiAod3MpIHtcbiAgICB3cy5jbG9zZSgpO1xuICB9XG59O1xuXG5XZWJTb2NrZXRUcmFuc3BvcnQucHJvdG90eXBlLl9jbGVhbnVwID0gZnVuY3Rpb24oKSB7XG4gIGRlYnVnKCdfY2xlYW51cCcpO1xuICB2YXIgd3MgPSB0aGlzLndzO1xuICBpZiAod3MpIHtcbiAgICB3cy5vbm1lc3NhZ2UgPSB3cy5vbmNsb3NlID0gd3Mub25lcnJvciA9IG51bGw7XG4gIH1cbiAgdXRpbHMudW5sb2FkRGVsKHRoaXMudW5sb2FkUmVmKTtcbiAgdGhpcy51bmxvYWRSZWYgPSB0aGlzLndzID0gbnVsbDtcbiAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoKTtcbn07XG5cbldlYlNvY2tldFRyYW5zcG9ydC5lbmFibGVkID0gZnVuY3Rpb24oKSB7XG4gIGRlYnVnKCdlbmFibGVkJyk7XG4gIHJldHVybiAhIVdlYnNvY2tldERyaXZlcjtcbn07XG5XZWJTb2NrZXRUcmFuc3BvcnQudHJhbnNwb3J0TmFtZSA9ICd3ZWJzb2NrZXQnO1xuXG4vLyBJbiB0aGVvcnksIHdzIHNob3VsZCByZXF1aXJlIDEgcm91bmQgdHJpcC4gQnV0IGluIGNocm9tZSwgdGhpcyBpc1xuLy8gbm90IHZlcnkgc3RhYmxlIG92ZXIgU1NMLiBNb3N0IGxpa2VseSBhIHdzIGNvbm5lY3Rpb24gcmVxdWlyZXMgYVxuLy8gc2VwYXJhdGUgU1NMIGNvbm5lY3Rpb24sIGluIHdoaWNoIGNhc2UgMiByb3VuZCB0cmlwcyBhcmUgYW5cbi8vIGFic29sdXRlIG1pbnVtdW0uXG5XZWJTb2NrZXRUcmFuc3BvcnQucm91bmRUcmlwcyA9IDI7XG5cbm1vZHVsZS5leHBvcnRzID0gV2ViU29ja2V0VHJhbnNwb3J0O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpXG4gICwgQWpheEJhc2VkVHJhbnNwb3J0ID0gcmVxdWlyZSgnLi9saWIvYWpheC1iYXNlZCcpXG4gICwgWGRyU3RyZWFtaW5nVHJhbnNwb3J0ID0gcmVxdWlyZSgnLi94ZHItc3RyZWFtaW5nJylcbiAgLCBYaHJSZWNlaXZlciA9IHJlcXVpcmUoJy4vcmVjZWl2ZXIveGhyJylcbiAgLCBYRFJPYmplY3QgPSByZXF1aXJlKCcuL3NlbmRlci94ZHInKVxuICA7XG5cbmZ1bmN0aW9uIFhkclBvbGxpbmdUcmFuc3BvcnQodHJhbnNVcmwpIHtcbiAgaWYgKCFYRFJPYmplY3QuZW5hYmxlZCkge1xuICAgIHRocm93IG5ldyBFcnJvcignVHJhbnNwb3J0IGNyZWF0ZWQgd2hlbiBkaXNhYmxlZCcpO1xuICB9XG4gIEFqYXhCYXNlZFRyYW5zcG9ydC5jYWxsKHRoaXMsIHRyYW5zVXJsLCAnL3hocicsIFhoclJlY2VpdmVyLCBYRFJPYmplY3QpO1xufVxuXG5pbmhlcml0cyhYZHJQb2xsaW5nVHJhbnNwb3J0LCBBamF4QmFzZWRUcmFuc3BvcnQpO1xuXG5YZHJQb2xsaW5nVHJhbnNwb3J0LmVuYWJsZWQgPSBYZHJTdHJlYW1pbmdUcmFuc3BvcnQuZW5hYmxlZDtcblhkclBvbGxpbmdUcmFuc3BvcnQudHJhbnNwb3J0TmFtZSA9ICd4ZHItcG9sbGluZyc7XG5YZHJQb2xsaW5nVHJhbnNwb3J0LnJvdW5kVHJpcHMgPSAyOyAvLyBwcmVmbGlnaHQsIGFqYXhcblxubW9kdWxlLmV4cG9ydHMgPSBYZHJQb2xsaW5nVHJhbnNwb3J0O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpXG4gICwgQWpheEJhc2VkVHJhbnNwb3J0ID0gcmVxdWlyZSgnLi9saWIvYWpheC1iYXNlZCcpXG4gICwgWGhyUmVjZWl2ZXIgPSByZXF1aXJlKCcuL3JlY2VpdmVyL3hocicpXG4gICwgWERST2JqZWN0ID0gcmVxdWlyZSgnLi9zZW5kZXIveGRyJylcbiAgO1xuXG4vLyBBY2NvcmRpbmcgdG86XG4vLyAgIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTY0MTUwNy9kZXRlY3QtYnJvd3Nlci1zdXBwb3J0LWZvci1jcm9zcy1kb21haW4teG1saHR0cHJlcXVlc3RzXG4vLyAgIGh0dHA6Ly9oYWNrcy5tb3ppbGxhLm9yZy8yMDA5LzA3L2Nyb3NzLXNpdGUteG1saHR0cHJlcXVlc3Qtd2l0aC1jb3JzL1xuXG5mdW5jdGlvbiBYZHJTdHJlYW1pbmdUcmFuc3BvcnQodHJhbnNVcmwpIHtcbiAgaWYgKCFYRFJPYmplY3QuZW5hYmxlZCkge1xuICAgIHRocm93IG5ldyBFcnJvcignVHJhbnNwb3J0IGNyZWF0ZWQgd2hlbiBkaXNhYmxlZCcpO1xuICB9XG4gIEFqYXhCYXNlZFRyYW5zcG9ydC5jYWxsKHRoaXMsIHRyYW5zVXJsLCAnL3hocl9zdHJlYW1pbmcnLCBYaHJSZWNlaXZlciwgWERST2JqZWN0KTtcbn1cblxuaW5oZXJpdHMoWGRyU3RyZWFtaW5nVHJhbnNwb3J0LCBBamF4QmFzZWRUcmFuc3BvcnQpO1xuXG5YZHJTdHJlYW1pbmdUcmFuc3BvcnQuZW5hYmxlZCA9IGZ1bmN0aW9uKGluZm8pIHtcbiAgaWYgKGluZm8uY29va2llX25lZWRlZCB8fCBpbmZvLm51bGxPcmlnaW4pIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIFhEUk9iamVjdC5lbmFibGVkICYmIGluZm8uc2FtZVNjaGVtZTtcbn07XG5cblhkclN0cmVhbWluZ1RyYW5zcG9ydC50cmFuc3BvcnROYW1lID0gJ3hkci1zdHJlYW1pbmcnO1xuWGRyU3RyZWFtaW5nVHJhbnNwb3J0LnJvdW5kVHJpcHMgPSAyOyAvLyBwcmVmbGlnaHQsIGFqYXhcblxubW9kdWxlLmV4cG9ydHMgPSBYZHJTdHJlYW1pbmdUcmFuc3BvcnQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJylcbiAgLCBBamF4QmFzZWRUcmFuc3BvcnQgPSByZXF1aXJlKCcuL2xpYi9hamF4LWJhc2VkJylcbiAgLCBYaHJSZWNlaXZlciA9IHJlcXVpcmUoJy4vcmVjZWl2ZXIveGhyJylcbiAgLCBYSFJDb3JzT2JqZWN0ID0gcmVxdWlyZSgnLi9zZW5kZXIveGhyLWNvcnMnKVxuICAsIFhIUkxvY2FsT2JqZWN0ID0gcmVxdWlyZSgnLi9zZW5kZXIveGhyLWxvY2FsJylcbiAgO1xuXG5mdW5jdGlvbiBYaHJQb2xsaW5nVHJhbnNwb3J0KHRyYW5zVXJsKSB7XG4gIGlmICghWEhSTG9jYWxPYmplY3QuZW5hYmxlZCAmJiAhWEhSQ29yc09iamVjdC5lbmFibGVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdUcmFuc3BvcnQgY3JlYXRlZCB3aGVuIGRpc2FibGVkJyk7XG4gIH1cbiAgQWpheEJhc2VkVHJhbnNwb3J0LmNhbGwodGhpcywgdHJhbnNVcmwsICcveGhyJywgWGhyUmVjZWl2ZXIsIFhIUkNvcnNPYmplY3QpO1xufVxuXG5pbmhlcml0cyhYaHJQb2xsaW5nVHJhbnNwb3J0LCBBamF4QmFzZWRUcmFuc3BvcnQpO1xuXG5YaHJQb2xsaW5nVHJhbnNwb3J0LmVuYWJsZWQgPSBmdW5jdGlvbihpbmZvKSB7XG4gIGlmIChpbmZvLm51bGxPcmlnaW4pIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoWEhSTG9jYWxPYmplY3QuZW5hYmxlZCAmJiBpbmZvLnNhbWVPcmlnaW4pIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gWEhSQ29yc09iamVjdC5lbmFibGVkO1xufTtcblxuWGhyUG9sbGluZ1RyYW5zcG9ydC50cmFuc3BvcnROYW1lID0gJ3hoci1wb2xsaW5nJztcblhoclBvbGxpbmdUcmFuc3BvcnQucm91bmRUcmlwcyA9IDI7IC8vIHByZWZsaWdodCwgYWpheFxuXG5tb2R1bGUuZXhwb3J0cyA9IFhoclBvbGxpbmdUcmFuc3BvcnQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJylcbiAgLCBBamF4QmFzZWRUcmFuc3BvcnQgPSByZXF1aXJlKCcuL2xpYi9hamF4LWJhc2VkJylcbiAgLCBYaHJSZWNlaXZlciA9IHJlcXVpcmUoJy4vcmVjZWl2ZXIveGhyJylcbiAgLCBYSFJDb3JzT2JqZWN0ID0gcmVxdWlyZSgnLi9zZW5kZXIveGhyLWNvcnMnKVxuICAsIFhIUkxvY2FsT2JqZWN0ID0gcmVxdWlyZSgnLi9zZW5kZXIveGhyLWxvY2FsJylcbiAgLCBicm93c2VyID0gcmVxdWlyZSgnLi4vdXRpbHMvYnJvd3NlcicpXG4gIDtcblxuZnVuY3Rpb24gWGhyU3RyZWFtaW5nVHJhbnNwb3J0KHRyYW5zVXJsKSB7XG4gIGlmICghWEhSTG9jYWxPYmplY3QuZW5hYmxlZCAmJiAhWEhSQ29yc09iamVjdC5lbmFibGVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdUcmFuc3BvcnQgY3JlYXRlZCB3aGVuIGRpc2FibGVkJyk7XG4gIH1cbiAgQWpheEJhc2VkVHJhbnNwb3J0LmNhbGwodGhpcywgdHJhbnNVcmwsICcveGhyX3N0cmVhbWluZycsIFhoclJlY2VpdmVyLCBYSFJDb3JzT2JqZWN0KTtcbn1cblxuaW5oZXJpdHMoWGhyU3RyZWFtaW5nVHJhbnNwb3J0LCBBamF4QmFzZWRUcmFuc3BvcnQpO1xuXG5YaHJTdHJlYW1pbmdUcmFuc3BvcnQuZW5hYmxlZCA9IGZ1bmN0aW9uKGluZm8pIHtcbiAgaWYgKGluZm8ubnVsbE9yaWdpbikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBPcGVyYSBkb2Vzbid0IHN1cHBvcnQgeGhyLXN0cmVhbWluZyAjNjBcbiAgLy8gQnV0IGl0IG1pZ2h0IGJlIGFibGUgdG8gIzkyXG4gIGlmIChicm93c2VyLmlzT3BlcmEoKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBYSFJDb3JzT2JqZWN0LmVuYWJsZWQ7XG59O1xuXG5YaHJTdHJlYW1pbmdUcmFuc3BvcnQudHJhbnNwb3J0TmFtZSA9ICd4aHItc3RyZWFtaW5nJztcblhoclN0cmVhbWluZ1RyYW5zcG9ydC5yb3VuZFRyaXBzID0gMjsgLy8gcHJlZmxpZ2h0LCBhamF4XG5cbi8vIFNhZmFyaSBnZXRzIGNvbmZ1c2VkIHdoZW4gYSBzdHJlYW1pbmcgYWpheCByZXF1ZXN0IGlzIHN0YXJ0ZWRcbi8vIGJlZm9yZSBvbmxvYWQuIFRoaXMgY2F1c2VzIHRoZSBsb2FkIGluZGljYXRvciB0byBzcGluIGluZGVmaW5ldGVseS5cbi8vIE9ubHkgcmVxdWlyZSBib2R5IHdoZW4gdXNlZCBpbiBhIGJyb3dzZXJcblhoclN0cmVhbWluZ1RyYW5zcG9ydC5uZWVkQm9keSA9ICEhZ2xvYmFsLmRvY3VtZW50O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFhoclN0cmVhbWluZ1RyYW5zcG9ydDtcbiIsIid1c2Ugc3RyaWN0JztcblxuaWYgKGdsb2JhbC5jcnlwdG8gJiYgZ2xvYmFsLmNyeXB0by5nZXRSYW5kb21WYWx1ZXMpIHtcbiAgbW9kdWxlLmV4cG9ydHMucmFuZG9tQnl0ZXMgPSBmdW5jdGlvbihsZW5ndGgpIHtcbiAgICB2YXIgYnl0ZXMgPSBuZXcgVWludDhBcnJheShsZW5ndGgpO1xuICAgIGdsb2JhbC5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKGJ5dGVzKTtcbiAgICByZXR1cm4gYnl0ZXM7XG4gIH07XG59IGVsc2Uge1xuICBtb2R1bGUuZXhwb3J0cy5yYW5kb21CeXRlcyA9IGZ1bmN0aW9uKGxlbmd0aCkge1xuICAgIHZhciBieXRlcyA9IG5ldyBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGJ5dGVzW2ldID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjU2KTtcbiAgICB9XG4gICAgcmV0dXJuIGJ5dGVzO1xuICB9O1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaXNPcGVyYTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGdsb2JhbC5uYXZpZ2F0b3IgJiZcbiAgICAgIC9vcGVyYS9pLnRlc3QoZ2xvYmFsLm5hdmlnYXRvci51c2VyQWdlbnQpO1xuICB9XG5cbiwgaXNLb25xdWVyb3I6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBnbG9iYWwubmF2aWdhdG9yICYmXG4gICAgICAva29ucXVlcm9yL2kudGVzdChnbG9iYWwubmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gIH1cblxuICAvLyAjMTg3IHdyYXAgZG9jdW1lbnQuZG9tYWluIGluIHRyeS9jYXRjaCBiZWNhdXNlIG9mIFdQOCBmcm9tIGZpbGU6Ly8vXG4sIGhhc0RvbWFpbjogZnVuY3Rpb24gKCkge1xuICAgIC8vIG5vbi1icm93c2VyIGNsaWVudCBhbHdheXMgaGFzIGEgZG9tYWluXG4gICAgaWYgKCFnbG9iYWwuZG9jdW1lbnQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gISFnbG9iYWwuZG9jdW1lbnQuZG9tYWluO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIFNvbWUgZXh0cmEgY2hhcmFjdGVycyB0aGF0IENocm9tZSBnZXRzIHdyb25nLCBhbmQgc3Vic3RpdHV0ZXMgd2l0aFxuLy8gc29tZXRoaW5nIGVsc2Ugb24gdGhlIHdpcmUuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29udHJvbC1yZWdleCwgbm8tbWlzbGVhZGluZy1jaGFyYWN0ZXItY2xhc3NcbnZhciBleHRyYUVzY2FwYWJsZSA9IC9bXFx4MDAtXFx4MWZcXHVkODAwLVxcdWRmZmZcXHVmZmZlXFx1ZmZmZlxcdTAzMDAtXFx1MDMzM1xcdTAzM2QtXFx1MDM0NlxcdTAzNGEtXFx1MDM0Y1xcdTAzNTAtXFx1MDM1MlxcdTAzNTctXFx1MDM1OFxcdTAzNWMtXFx1MDM2MlxcdTAzNzRcXHUwMzdlXFx1MDM4N1xcdTA1OTEtXFx1MDVhZlxcdTA1YzRcXHUwNjEwLVxcdTA2MTdcXHUwNjUzLVxcdTA2NTRcXHUwNjU3LVxcdTA2NWJcXHUwNjVkLVxcdTA2NWVcXHUwNmRmLVxcdTA2ZTJcXHUwNmViLVxcdTA2ZWNcXHUwNzMwXFx1MDczMi1cXHUwNzMzXFx1MDczNS1cXHUwNzM2XFx1MDczYVxcdTA3M2RcXHUwNzNmLVxcdTA3NDFcXHUwNzQzXFx1MDc0NVxcdTA3NDdcXHUwN2ViLVxcdTA3ZjFcXHUwOTUxXFx1MDk1OC1cXHUwOTVmXFx1MDlkYy1cXHUwOWRkXFx1MDlkZlxcdTBhMzNcXHUwYTM2XFx1MGE1OS1cXHUwYTViXFx1MGE1ZVxcdTBiNWMtXFx1MGI1ZFxcdTBlMzgtXFx1MGUzOVxcdTBmNDNcXHUwZjRkXFx1MGY1MlxcdTBmNTdcXHUwZjVjXFx1MGY2OVxcdTBmNzItXFx1MGY3NlxcdTBmNzhcXHUwZjgwLVxcdTBmODNcXHUwZjkzXFx1MGY5ZFxcdTBmYTJcXHUwZmE3XFx1MGZhY1xcdTBmYjlcXHUxOTM5LVxcdTE5M2FcXHUxYTE3XFx1MWI2YlxcdTFjZGEtXFx1MWNkYlxcdTFkYzAtXFx1MWRjZlxcdTFkZmNcXHUxZGZlXFx1MWY3MVxcdTFmNzNcXHUxZjc1XFx1MWY3N1xcdTFmNzlcXHUxZjdiXFx1MWY3ZFxcdTFmYmJcXHUxZmJlXFx1MWZjOVxcdTFmY2JcXHUxZmQzXFx1MWZkYlxcdTFmZTNcXHUxZmViXFx1MWZlZS1cXHUxZmVmXFx1MWZmOVxcdTFmZmJcXHUxZmZkXFx1MjAwMC1cXHUyMDAxXFx1MjBkMC1cXHUyMGQxXFx1MjBkNC1cXHUyMGQ3XFx1MjBlNy1cXHUyMGU5XFx1MjEyNlxcdTIxMmEtXFx1MjEyYlxcdTIzMjktXFx1MjMyYVxcdTJhZGNcXHUzMDJiLVxcdTMwMmNcXHVhYWIyLVxcdWFhYjNcXHVmOTAwLVxcdWZhMGRcXHVmYTEwXFx1ZmExMlxcdWZhMTUtXFx1ZmExZVxcdWZhMjBcXHVmYTIyXFx1ZmEyNS1cXHVmYTI2XFx1ZmEyYS1cXHVmYTJkXFx1ZmEzMC1cXHVmYTZkXFx1ZmE3MC1cXHVmYWQ5XFx1ZmIxZFxcdWZiMWZcXHVmYjJhLVxcdWZiMzZcXHVmYjM4LVxcdWZiM2NcXHVmYjNlXFx1ZmI0MC1cXHVmYjQxXFx1ZmI0My1cXHVmYjQ0XFx1ZmI0Ni1cXHVmYjRlXFx1ZmZmMC1cXHVmZmZmXS9nXG4gICwgZXh0cmFMb29rdXA7XG5cbi8vIFRoaXMgbWF5IGJlIHF1aXRlIHNsb3csIHNvIGxldCdzIGRlbGF5IHVudGlsIHVzZXIgYWN0dWFsbHkgdXNlcyBiYWRcbi8vIGNoYXJhY3RlcnMuXG52YXIgdW5yb2xsTG9va3VwID0gZnVuY3Rpb24oZXNjYXBhYmxlKSB7XG4gIHZhciBpO1xuICB2YXIgdW5yb2xsZWQgPSB7fTtcbiAgdmFyIGMgPSBbXTtcbiAgZm9yIChpID0gMDsgaSA8IDY1NTM2OyBpKyspIHtcbiAgICBjLnB1c2goIFN0cmluZy5mcm9tQ2hhckNvZGUoaSkgKTtcbiAgfVxuICBlc2NhcGFibGUubGFzdEluZGV4ID0gMDtcbiAgYy5qb2luKCcnKS5yZXBsYWNlKGVzY2FwYWJsZSwgZnVuY3Rpb24oYSkge1xuICAgIHVucm9sbGVkWyBhIF0gPSAnXFxcXHUnICsgKCcwMDAwJyArIGEuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikpLnNsaWNlKC00KTtcbiAgICByZXR1cm4gJyc7XG4gIH0pO1xuICBlc2NhcGFibGUubGFzdEluZGV4ID0gMDtcbiAgcmV0dXJuIHVucm9sbGVkO1xufTtcblxuLy8gUXVvdGUgc3RyaW5nLCBhbHNvIHRha2luZyBjYXJlIG9mIHVuaWNvZGUgY2hhcmFjdGVycyB0aGF0IGJyb3dzZXJzXG4vLyBvZnRlbiBicmVhay4gRXNwZWNpYWxseSwgdGFrZSBjYXJlIG9mIHVuaWNvZGUgc3Vycm9nYXRlczpcbi8vIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTWFwcGluZ19vZl9Vbmljb2RlX2NoYXJhY3RlcnMjU3Vycm9nYXRlc1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHF1b3RlOiBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICB2YXIgcXVvdGVkID0gSlNPTi5zdHJpbmdpZnkoc3RyaW5nKTtcblxuICAgIC8vIEluIG1vc3QgY2FzZXMgdGhpcyBzaG91bGQgYmUgdmVyeSBmYXN0IGFuZCBnb29kIGVub3VnaC5cbiAgICBleHRyYUVzY2FwYWJsZS5sYXN0SW5kZXggPSAwO1xuICAgIGlmICghZXh0cmFFc2NhcGFibGUudGVzdChxdW90ZWQpKSB7XG4gICAgICByZXR1cm4gcXVvdGVkO1xuICAgIH1cblxuICAgIGlmICghZXh0cmFMb29rdXApIHtcbiAgICAgIGV4dHJhTG9va3VwID0gdW5yb2xsTG9va3VwKGV4dHJhRXNjYXBhYmxlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcXVvdGVkLnJlcGxhY2UoZXh0cmFFc2NhcGFibGUsIGZ1bmN0aW9uKGEpIHtcbiAgICAgIHJldHVybiBleHRyYUxvb2t1cFthXTtcbiAgICB9KTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHJhbmRvbSA9IHJlcXVpcmUoJy4vcmFuZG9tJyk7XG5cbnZhciBvblVubG9hZCA9IHt9XG4gICwgYWZ0ZXJVbmxvYWQgPSBmYWxzZVxuICAgIC8vIGRldGVjdCBnb29nbGUgY2hyb21lIHBhY2thZ2VkIGFwcHMgYmVjYXVzZSB0aGV5IGRvbid0IGFsbG93IHRoZSAndW5sb2FkJyBldmVudFxuICAsIGlzQ2hyb21lUGFja2FnZWRBcHAgPSBnbG9iYWwuY2hyb21lICYmIGdsb2JhbC5jaHJvbWUuYXBwICYmIGdsb2JhbC5jaHJvbWUuYXBwLnJ1bnRpbWVcbiAgO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYXR0YWNoRXZlbnQ6IGZ1bmN0aW9uKGV2ZW50LCBsaXN0ZW5lcikge1xuICAgIGlmICh0eXBlb2YgZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgbGlzdGVuZXIsIGZhbHNlKTtcbiAgICB9IGVsc2UgaWYgKGdsb2JhbC5kb2N1bWVudCAmJiBnbG9iYWwuYXR0YWNoRXZlbnQpIHtcbiAgICAgIC8vIElFIHF1aXJrcy5cbiAgICAgIC8vIEFjY29yZGluZyB0bzogaHR0cDovL3N0ZXZlc291ZGVycy5jb20vbWlzYy90ZXN0LXBvc3RtZXNzYWdlLnBocFxuICAgICAgLy8gdGhlIG1lc3NhZ2UgZ2V0cyBkZWxpdmVyZWQgb25seSB0byAnZG9jdW1lbnQnLCBub3QgJ3dpbmRvdycuXG4gICAgICBnbG9iYWwuZG9jdW1lbnQuYXR0YWNoRXZlbnQoJ29uJyArIGV2ZW50LCBsaXN0ZW5lcik7XG4gICAgICAvLyBJIGdldCAnd2luZG93JyBmb3IgaWU4LlxuICAgICAgZ2xvYmFsLmF0dGFjaEV2ZW50KCdvbicgKyBldmVudCwgbGlzdGVuZXIpO1xuICAgIH1cbiAgfVxuXG4sIGRldGFjaEV2ZW50OiBmdW5jdGlvbihldmVudCwgbGlzdGVuZXIpIHtcbiAgICBpZiAodHlwZW9mIGdsb2JhbC5hZGRFdmVudExpc3RlbmVyICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgZ2xvYmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVyLCBmYWxzZSk7XG4gICAgfSBlbHNlIGlmIChnbG9iYWwuZG9jdW1lbnQgJiYgZ2xvYmFsLmRldGFjaEV2ZW50KSB7XG4gICAgICBnbG9iYWwuZG9jdW1lbnQuZGV0YWNoRXZlbnQoJ29uJyArIGV2ZW50LCBsaXN0ZW5lcik7XG4gICAgICBnbG9iYWwuZGV0YWNoRXZlbnQoJ29uJyArIGV2ZW50LCBsaXN0ZW5lcik7XG4gICAgfVxuICB9XG5cbiwgdW5sb2FkQWRkOiBmdW5jdGlvbihsaXN0ZW5lcikge1xuICAgIGlmIChpc0Nocm9tZVBhY2thZ2VkQXBwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgcmVmID0gcmFuZG9tLnN0cmluZyg4KTtcbiAgICBvblVubG9hZFtyZWZdID0gbGlzdGVuZXI7XG4gICAgaWYgKGFmdGVyVW5sb2FkKSB7XG4gICAgICBzZXRUaW1lb3V0KHRoaXMudHJpZ2dlclVubG9hZENhbGxiYWNrcywgMCk7XG4gICAgfVxuICAgIHJldHVybiByZWY7XG4gIH1cblxuLCB1bmxvYWREZWw6IGZ1bmN0aW9uKHJlZikge1xuICAgIGlmIChyZWYgaW4gb25VbmxvYWQpIHtcbiAgICAgIGRlbGV0ZSBvblVubG9hZFtyZWZdO1xuICAgIH1cbiAgfVxuXG4sIHRyaWdnZXJVbmxvYWRDYWxsYmFja3M6IGZ1bmN0aW9uKCkge1xuICAgIGZvciAodmFyIHJlZiBpbiBvblVubG9hZCkge1xuICAgICAgb25VbmxvYWRbcmVmXSgpO1xuICAgICAgZGVsZXRlIG9uVW5sb2FkW3JlZl07XG4gICAgfVxuICB9XG59O1xuXG52YXIgdW5sb2FkVHJpZ2dlcmVkID0gZnVuY3Rpb24oKSB7XG4gIGlmIChhZnRlclVubG9hZCkge1xuICAgIHJldHVybjtcbiAgfVxuICBhZnRlclVubG9hZCA9IHRydWU7XG4gIG1vZHVsZS5leHBvcnRzLnRyaWdnZXJVbmxvYWRDYWxsYmFja3MoKTtcbn07XG5cbi8vICd1bmxvYWQnIGFsb25lIGlzIG5vdCByZWxpYWJsZSBpbiBvcGVyYSB3aXRoaW4gYW4gaWZyYW1lLCBidXQgd2Vcbi8vIGNhbid0IHVzZSBgYmVmb3JldW5sb2FkYCBhcyBJRSBmaXJlcyBpdCBvbiBqYXZhc2NyaXB0OiBsaW5rcy5cbmlmICghaXNDaHJvbWVQYWNrYWdlZEFwcCkge1xuICBtb2R1bGUuZXhwb3J0cy5hdHRhY2hFdmVudCgndW5sb2FkJywgdW5sb2FkVHJpZ2dlcmVkKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGV2ZW50VXRpbHMgPSByZXF1aXJlKCcuL2V2ZW50JylcbiAgLCBicm93c2VyID0gcmVxdWlyZSgnLi9icm93c2VyJylcbiAgO1xuXG52YXIgZGVidWcgPSBmdW5jdGlvbigpIHt9O1xuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdzb2NranMtY2xpZW50OnV0aWxzOmlmcmFtZScpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgV1ByZWZpeDogJ19qcCdcbiwgY3VycmVudFdpbmRvd0lkOiBudWxsXG5cbiwgcG9sbHV0ZUdsb2JhbE5hbWVzcGFjZTogZnVuY3Rpb24oKSB7XG4gICAgaWYgKCEobW9kdWxlLmV4cG9ydHMuV1ByZWZpeCBpbiBnbG9iYWwpKSB7XG4gICAgICBnbG9iYWxbbW9kdWxlLmV4cG9ydHMuV1ByZWZpeF0gPSB7fTtcbiAgICB9XG4gIH1cblxuLCBwb3N0TWVzc2FnZTogZnVuY3Rpb24odHlwZSwgZGF0YSkge1xuICAgIGlmIChnbG9iYWwucGFyZW50ICE9PSBnbG9iYWwpIHtcbiAgICAgIGdsb2JhbC5wYXJlbnQucG9zdE1lc3NhZ2UoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICB3aW5kb3dJZDogbW9kdWxlLmV4cG9ydHMuY3VycmVudFdpbmRvd0lkXG4gICAgICAsIHR5cGU6IHR5cGVcbiAgICAgICwgZGF0YTogZGF0YSB8fCAnJ1xuICAgICAgfSksICcqJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlYnVnKCdDYW5ub3QgcG9zdE1lc3NhZ2UsIG5vIHBhcmVudCB3aW5kb3cuJywgdHlwZSwgZGF0YSk7XG4gICAgfVxuICB9XG5cbiwgY3JlYXRlSWZyYW1lOiBmdW5jdGlvbihpZnJhbWVVcmwsIGVycm9yQ2FsbGJhY2spIHtcbiAgICB2YXIgaWZyYW1lID0gZ2xvYmFsLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpO1xuICAgIHZhciB0cmVmLCB1bmxvYWRSZWY7XG4gICAgdmFyIHVuYXR0YWNoID0gZnVuY3Rpb24oKSB7XG4gICAgICBkZWJ1ZygndW5hdHRhY2gnKTtcbiAgICAgIGNsZWFyVGltZW91dCh0cmVmKTtcbiAgICAgIC8vIEV4cGxvcmVyIGhhZCBwcm9ibGVtcyB3aXRoIHRoYXQuXG4gICAgICB0cnkge1xuICAgICAgICBpZnJhbWUub25sb2FkID0gbnVsbDtcbiAgICAgIH0gY2F0Y2ggKHgpIHtcbiAgICAgICAgLy8gaW50ZW50aW9uYWxseSBlbXB0eVxuICAgICAgfVxuICAgICAgaWZyYW1lLm9uZXJyb3IgPSBudWxsO1xuICAgIH07XG4gICAgdmFyIGNsZWFudXAgPSBmdW5jdGlvbigpIHtcbiAgICAgIGRlYnVnKCdjbGVhbnVwJyk7XG4gICAgICBpZiAoaWZyYW1lKSB7XG4gICAgICAgIHVuYXR0YWNoKCk7XG4gICAgICAgIC8vIFRoaXMgdGltZW91dCBtYWtlcyBjaHJvbWUgZmlyZSBvbmJlZm9yZXVubG9hZCBldmVudFxuICAgICAgICAvLyB3aXRoaW4gaWZyYW1lLiBXaXRob3V0IHRoZSB0aW1lb3V0IGl0IGdvZXMgc3RyYWlnaHQgdG9cbiAgICAgICAgLy8gb251bmxvYWQuXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKGlmcmFtZSkge1xuICAgICAgICAgICAgaWZyYW1lLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoaWZyYW1lKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWZyYW1lID0gbnVsbDtcbiAgICAgICAgfSwgMCk7XG4gICAgICAgIGV2ZW50VXRpbHMudW5sb2FkRGVsKHVubG9hZFJlZik7XG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgb25lcnJvciA9IGZ1bmN0aW9uKGVycikge1xuICAgICAgZGVidWcoJ29uZXJyb3InLCBlcnIpO1xuICAgICAgaWYgKGlmcmFtZSkge1xuICAgICAgICBjbGVhbnVwKCk7XG4gICAgICAgIGVycm9yQ2FsbGJhY2soZXJyKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHZhciBwb3N0ID0gZnVuY3Rpb24obXNnLCBvcmlnaW4pIHtcbiAgICAgIGRlYnVnKCdwb3N0JywgbXNnLCBvcmlnaW4pO1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBXaGVuIHRoZSBpZnJhbWUgaXMgbm90IGxvYWRlZCwgSUUgcmFpc2VzIGFuIGV4Y2VwdGlvblxuICAgICAgICAgIC8vIG9uICdjb250ZW50V2luZG93Jy5cbiAgICAgICAgICBpZiAoaWZyYW1lICYmIGlmcmFtZS5jb250ZW50V2luZG93KSB7XG4gICAgICAgICAgICBpZnJhbWUuY29udGVudFdpbmRvdy5wb3N0TWVzc2FnZShtc2csIG9yaWdpbik7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoICh4KSB7XG4gICAgICAgICAgLy8gaW50ZW50aW9uYWxseSBlbXB0eVxuICAgICAgICB9XG4gICAgICB9LCAwKTtcbiAgICB9O1xuXG4gICAgaWZyYW1lLnNyYyA9IGlmcmFtZVVybDtcbiAgICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICBpZnJhbWUuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgIGlmcmFtZS5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICBvbmVycm9yKCdvbmVycm9yJyk7XG4gICAgfTtcbiAgICBpZnJhbWUub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICBkZWJ1Zygnb25sb2FkJyk7XG4gICAgICAvLyBgb25sb2FkYCBpcyB0cmlnZ2VyZWQgYmVmb3JlIHNjcmlwdHMgb24gdGhlIGlmcmFtZSBhcmVcbiAgICAgIC8vIGV4ZWN1dGVkLiBHaXZlIGl0IGZldyBzZWNvbmRzIHRvIGFjdHVhbGx5IGxvYWQgc3R1ZmYuXG4gICAgICBjbGVhclRpbWVvdXQodHJlZik7XG4gICAgICB0cmVmID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgb25lcnJvcignb25sb2FkIHRpbWVvdXQnKTtcbiAgICAgIH0sIDIwMDApO1xuICAgIH07XG4gICAgZ2xvYmFsLmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcbiAgICB0cmVmID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIG9uZXJyb3IoJ3RpbWVvdXQnKTtcbiAgICB9LCAxNTAwMCk7XG4gICAgdW5sb2FkUmVmID0gZXZlbnRVdGlscy51bmxvYWRBZGQoY2xlYW51cCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHBvc3Q6IHBvc3RcbiAgICAsIGNsZWFudXA6IGNsZWFudXBcbiAgICAsIGxvYWRlZDogdW5hdHRhY2hcbiAgICB9O1xuICB9XG5cbi8qIGVzbGludCBuby11bmRlZjogXCJvZmZcIiwgbmV3LWNhcDogXCJvZmZcIiAqL1xuLCBjcmVhdGVIdG1sZmlsZTogZnVuY3Rpb24oaWZyYW1lVXJsLCBlcnJvckNhbGxiYWNrKSB7XG4gICAgdmFyIGF4byA9IFsnQWN0aXZlJ10uY29uY2F0KCdPYmplY3QnKS5qb2luKCdYJyk7XG4gICAgdmFyIGRvYyA9IG5ldyBnbG9iYWxbYXhvXSgnaHRtbGZpbGUnKTtcbiAgICB2YXIgdHJlZiwgdW5sb2FkUmVmO1xuICAgIHZhciBpZnJhbWU7XG4gICAgdmFyIHVuYXR0YWNoID0gZnVuY3Rpb24oKSB7XG4gICAgICBjbGVhclRpbWVvdXQodHJlZik7XG4gICAgICBpZnJhbWUub25lcnJvciA9IG51bGw7XG4gICAgfTtcbiAgICB2YXIgY2xlYW51cCA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKGRvYykge1xuICAgICAgICB1bmF0dGFjaCgpO1xuICAgICAgICBldmVudFV0aWxzLnVubG9hZERlbCh1bmxvYWRSZWYpO1xuICAgICAgICBpZnJhbWUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChpZnJhbWUpO1xuICAgICAgICBpZnJhbWUgPSBkb2MgPSBudWxsO1xuICAgICAgICBDb2xsZWN0R2FyYmFnZSgpO1xuICAgICAgfVxuICAgIH07XG4gICAgdmFyIG9uZXJyb3IgPSBmdW5jdGlvbihyKSB7XG4gICAgICBkZWJ1Zygnb25lcnJvcicsIHIpO1xuICAgICAgaWYgKGRvYykge1xuICAgICAgICBjbGVhbnVwKCk7XG4gICAgICAgIGVycm9yQ2FsbGJhY2socik7XG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgcG9zdCA9IGZ1bmN0aW9uKG1zZywgb3JpZ2luKSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBXaGVuIHRoZSBpZnJhbWUgaXMgbm90IGxvYWRlZCwgSUUgcmFpc2VzIGFuIGV4Y2VwdGlvblxuICAgICAgICAvLyBvbiAnY29udGVudFdpbmRvdycuXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKGlmcmFtZSAmJiBpZnJhbWUuY29udGVudFdpbmRvdykge1xuICAgICAgICAgICAgICBpZnJhbWUuY29udGVudFdpbmRvdy5wb3N0TWVzc2FnZShtc2csIG9yaWdpbik7XG4gICAgICAgICAgfVxuICAgICAgICB9LCAwKTtcbiAgICAgIH0gY2F0Y2ggKHgpIHtcbiAgICAgICAgLy8gaW50ZW50aW9uYWxseSBlbXB0eVxuICAgICAgfVxuICAgIH07XG5cbiAgICBkb2Mub3BlbigpO1xuICAgIGRvYy53cml0ZSgnPGh0bWw+PHMnICsgJ2NyaXB0PicgK1xuICAgICAgICAgICAgICAnZG9jdW1lbnQuZG9tYWluPVwiJyArIGdsb2JhbC5kb2N1bWVudC5kb21haW4gKyAnXCI7JyArXG4gICAgICAgICAgICAgICc8L3MnICsgJ2NyaXB0PjwvaHRtbD4nKTtcbiAgICBkb2MuY2xvc2UoKTtcbiAgICBkb2MucGFyZW50V2luZG93W21vZHVsZS5leHBvcnRzLldQcmVmaXhdID0gZ2xvYmFsW21vZHVsZS5leHBvcnRzLldQcmVmaXhdO1xuICAgIHZhciBjID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRvYy5ib2R5LmFwcGVuZENoaWxkKGMpO1xuICAgIGlmcmFtZSA9IGRvYy5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcbiAgICBjLmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gICAgaWZyYW1lLnNyYyA9IGlmcmFtZVVybDtcbiAgICBpZnJhbWUub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgb25lcnJvcignb25lcnJvcicpO1xuICAgIH07XG4gICAgdHJlZiA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICBvbmVycm9yKCd0aW1lb3V0Jyk7XG4gICAgfSwgMTUwMDApO1xuICAgIHVubG9hZFJlZiA9IGV2ZW50VXRpbHMudW5sb2FkQWRkKGNsZWFudXApO1xuICAgIHJldHVybiB7XG4gICAgICBwb3N0OiBwb3N0XG4gICAgLCBjbGVhbnVwOiBjbGVhbnVwXG4gICAgLCBsb2FkZWQ6IHVuYXR0YWNoXG4gICAgfTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMuaWZyYW1lRW5hYmxlZCA9IGZhbHNlO1xuaWYgKGdsb2JhbC5kb2N1bWVudCkge1xuICAvLyBwb3N0TWVzc2FnZSBtaXNiZWhhdmVzIGluIGtvbnF1ZXJvciA0LjYuNSAtIHRoZSBtZXNzYWdlcyBhcmUgZGVsaXZlcmVkIHdpdGhcbiAgLy8gaHVnZSBkZWxheSwgb3Igbm90IGF0IGFsbC5cbiAgbW9kdWxlLmV4cG9ydHMuaWZyYW1lRW5hYmxlZCA9ICh0eXBlb2YgZ2xvYmFsLnBvc3RNZXNzYWdlID09PSAnZnVuY3Rpb24nIHx8XG4gICAgdHlwZW9mIGdsb2JhbC5wb3N0TWVzc2FnZSA9PT0gJ29iamVjdCcpICYmICghYnJvd3Nlci5pc0tvbnF1ZXJvcigpKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGxvZ09iamVjdCA9IHt9O1xuWydsb2cnLCAnZGVidWcnLCAnd2FybiddLmZvckVhY2goZnVuY3Rpb24gKGxldmVsKSB7XG4gIHZhciBsZXZlbEV4aXN0cztcblxuICB0cnkge1xuICAgIGxldmVsRXhpc3RzID0gZ2xvYmFsLmNvbnNvbGUgJiYgZ2xvYmFsLmNvbnNvbGVbbGV2ZWxdICYmIGdsb2JhbC5jb25zb2xlW2xldmVsXS5hcHBseTtcbiAgfSBjYXRjaChlKSB7XG4gICAgLy8gZG8gbm90aGluZ1xuICB9XG5cbiAgbG9nT2JqZWN0W2xldmVsXSA9IGxldmVsRXhpc3RzID8gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBnbG9iYWwuY29uc29sZVtsZXZlbF0uYXBwbHkoZ2xvYmFsLmNvbnNvbGUsIGFyZ3VtZW50cyk7XG4gIH0gOiAobGV2ZWwgPT09ICdsb2cnID8gZnVuY3Rpb24gKCkge30gOiBsb2dPYmplY3QubG9nKTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGxvZ09iamVjdDtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGlzT2JqZWN0OiBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgdHlwZSA9IHR5cGVvZiBvYmo7XG4gICAgcmV0dXJuIHR5cGUgPT09ICdmdW5jdGlvbicgfHwgdHlwZSA9PT0gJ29iamVjdCcgJiYgISFvYmo7XG4gIH1cblxuLCBleHRlbmQ6IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghdGhpcy5pc09iamVjdChvYmopKSB7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICB2YXIgc291cmNlLCBwcm9wO1xuICAgIGZvciAodmFyIGkgPSAxLCBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgIGZvciAocHJvcCBpbiBzb3VyY2UpIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIHByb3ApKSB7XG4gICAgICAgICAgb2JqW3Byb3BdID0gc291cmNlW3Byb3BdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcblxuLy8gVGhpcyBzdHJpbmcgaGFzIGxlbmd0aCAzMiwgYSBwb3dlciBvZiAyLCBzbyB0aGUgbW9kdWx1cyBkb2Vzbid0IGludHJvZHVjZSBhXG4vLyBiaWFzLlxudmFyIF9yYW5kb21TdHJpbmdDaGFycyA9ICdhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NSc7XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc3RyaW5nOiBmdW5jdGlvbihsZW5ndGgpIHtcbiAgICB2YXIgbWF4ID0gX3JhbmRvbVN0cmluZ0NoYXJzLmxlbmd0aDtcbiAgICB2YXIgYnl0ZXMgPSBjcnlwdG8ucmFuZG9tQnl0ZXMobGVuZ3RoKTtcbiAgICB2YXIgcmV0ID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgcmV0LnB1c2goX3JhbmRvbVN0cmluZ0NoYXJzLnN1YnN0cihieXRlc1tpXSAlIG1heCwgMSkpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0LmpvaW4oJycpO1xuICB9XG5cbiwgbnVtYmVyOiBmdW5jdGlvbihtYXgpIHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbWF4KTtcbiAgfVxuXG4sIG51bWJlclN0cmluZzogZnVuY3Rpb24obWF4KSB7XG4gICAgdmFyIHQgPSAoJycgKyAobWF4IC0gMSkpLmxlbmd0aDtcbiAgICB2YXIgcCA9IG5ldyBBcnJheSh0ICsgMSkuam9pbignMCcpO1xuICAgIHJldHVybiAocCArIHRoaXMubnVtYmVyKG1heCkpLnNsaWNlKC10KTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGRlYnVnID0gZnVuY3Rpb24oKSB7fTtcbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIGRlYnVnID0gcmVxdWlyZSgnZGVidWcnKSgnc29ja2pzLWNsaWVudDp1dGlsczp0cmFuc3BvcnQnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihhdmFpbGFibGVUcmFuc3BvcnRzKSB7XG4gIHJldHVybiB7XG4gICAgZmlsdGVyVG9FbmFibGVkOiBmdW5jdGlvbih0cmFuc3BvcnRzV2hpdGVsaXN0LCBpbmZvKSB7XG4gICAgICB2YXIgdHJhbnNwb3J0cyA9IHtcbiAgICAgICAgbWFpbjogW11cbiAgICAgICwgZmFjYWRlOiBbXVxuICAgICAgfTtcbiAgICAgIGlmICghdHJhbnNwb3J0c1doaXRlbGlzdCkge1xuICAgICAgICB0cmFuc3BvcnRzV2hpdGVsaXN0ID0gW107XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0cmFuc3BvcnRzV2hpdGVsaXN0ID09PSAnc3RyaW5nJykge1xuICAgICAgICB0cmFuc3BvcnRzV2hpdGVsaXN0ID0gW3RyYW5zcG9ydHNXaGl0ZWxpc3RdO1xuICAgICAgfVxuXG4gICAgICBhdmFpbGFibGVUcmFuc3BvcnRzLmZvckVhY2goZnVuY3Rpb24odHJhbnMpIHtcbiAgICAgICAgaWYgKCF0cmFucykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0cmFucy50cmFuc3BvcnROYW1lID09PSAnd2Vic29ja2V0JyAmJiBpbmZvLndlYnNvY2tldCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBkZWJ1ZygnZGlzYWJsZWQgZnJvbSBzZXJ2ZXInLCAnd2Vic29ja2V0Jyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRyYW5zcG9ydHNXaGl0ZWxpc3QubGVuZ3RoICYmXG4gICAgICAgICAgICB0cmFuc3BvcnRzV2hpdGVsaXN0LmluZGV4T2YodHJhbnMudHJhbnNwb3J0TmFtZSkgPT09IC0xKSB7XG4gICAgICAgICAgZGVidWcoJ25vdCBpbiB3aGl0ZWxpc3QnLCB0cmFucy50cmFuc3BvcnROYW1lKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHJhbnMuZW5hYmxlZChpbmZvKSkge1xuICAgICAgICAgIGRlYnVnKCdlbmFibGVkJywgdHJhbnMudHJhbnNwb3J0TmFtZSk7XG4gICAgICAgICAgdHJhbnNwb3J0cy5tYWluLnB1c2godHJhbnMpO1xuICAgICAgICAgIGlmICh0cmFucy5mYWNhZGVUcmFuc3BvcnQpIHtcbiAgICAgICAgICAgIHRyYW5zcG9ydHMuZmFjYWRlLnB1c2godHJhbnMuZmFjYWRlVHJhbnNwb3J0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGVidWcoJ2Rpc2FibGVkJywgdHJhbnMudHJhbnNwb3J0TmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRyYW5zcG9ydHM7XG4gICAgfVxuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFVSTCA9IHJlcXVpcmUoJ3VybC1wYXJzZScpO1xuXG52YXIgZGVidWcgPSBmdW5jdGlvbigpIHt9O1xuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdzb2NranMtY2xpZW50OnV0aWxzOnVybCcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZ2V0T3JpZ2luOiBmdW5jdGlvbih1cmwpIHtcbiAgICBpZiAoIXVybCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdmFyIHAgPSBuZXcgVVJMKHVybCk7XG4gICAgaWYgKHAucHJvdG9jb2wgPT09ICdmaWxlOicpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHZhciBwb3J0ID0gcC5wb3J0O1xuICAgIGlmICghcG9ydCkge1xuICAgICAgcG9ydCA9IChwLnByb3RvY29sID09PSAnaHR0cHM6JykgPyAnNDQzJyA6ICc4MCc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHAucHJvdG9jb2wgKyAnLy8nICsgcC5ob3N0bmFtZSArICc6JyArIHBvcnQ7XG4gIH1cblxuLCBpc09yaWdpbkVxdWFsOiBmdW5jdGlvbihhLCBiKSB7XG4gICAgdmFyIHJlcyA9IHRoaXMuZ2V0T3JpZ2luKGEpID09PSB0aGlzLmdldE9yaWdpbihiKTtcbiAgICBkZWJ1Zygnc2FtZScsIGEsIGIsIHJlcyk7XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4sIGlzU2NoZW1lRXF1YWw6IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gKGEuc3BsaXQoJzonKVswXSA9PT0gYi5zcGxpdCgnOicpWzBdKTtcbiAgfVxuXG4sIGFkZFBhdGg6IGZ1bmN0aW9uICh1cmwsIHBhdGgpIHtcbiAgICB2YXIgcXMgPSB1cmwuc3BsaXQoJz8nKTtcbiAgICByZXR1cm4gcXNbMF0gKyBwYXRoICsgKHFzWzFdID8gJz8nICsgcXNbMV0gOiAnJyk7XG4gIH1cblxuLCBhZGRRdWVyeTogZnVuY3Rpb24gKHVybCwgcSkge1xuICAgIHJldHVybiB1cmwgKyAodXJsLmluZGV4T2YoJz8nKSA9PT0gLTEgPyAoJz8nICsgcSkgOiAoJyYnICsgcSkpO1xuICB9XG5cbiwgaXNMb29wYmFja0FkZHI6IGZ1bmN0aW9uIChhZGRyKSB7XG4gICAgcmV0dXJuIC9eMTI3XFwuKFswLTldezEsM30pXFwuKFswLTldezEsM30pXFwuKFswLTldezEsM30pJC9pLnRlc3QoYWRkcikgfHwgL15cXFs6OjFcXF0kLy50ZXN0KGFkZHIpO1xuICB9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAnMS42LjAnO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH07IH0gZWxzZSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTsgfSByZXR1cm4gX3R5cGVvZihvYmopOyB9XG5cbi8qIGVzbGludC1lbnYgYnJvd3NlciAqL1xuXG4vKipcbiAqIFRoaXMgaXMgdGhlIHdlYiBicm93c2VyIGltcGxlbWVudGF0aW9uIG9mIGBkZWJ1ZygpYC5cbiAqL1xuZXhwb3J0cy5sb2cgPSBsb2c7XG5leHBvcnRzLmZvcm1hdEFyZ3MgPSBmb3JtYXRBcmdzO1xuZXhwb3J0cy5zYXZlID0gc2F2ZTtcbmV4cG9ydHMubG9hZCA9IGxvYWQ7XG5leHBvcnRzLnVzZUNvbG9ycyA9IHVzZUNvbG9ycztcbmV4cG9ydHMuc3RvcmFnZSA9IGxvY2Fsc3RvcmFnZSgpO1xuLyoqXG4gKiBDb2xvcnMuXG4gKi9cblxuZXhwb3J0cy5jb2xvcnMgPSBbJyMwMDAwQ0MnLCAnIzAwMDBGRicsICcjMDAzM0NDJywgJyMwMDMzRkYnLCAnIzAwNjZDQycsICcjMDA2NkZGJywgJyMwMDk5Q0MnLCAnIzAwOTlGRicsICcjMDBDQzAwJywgJyMwMENDMzMnLCAnIzAwQ0M2NicsICcjMDBDQzk5JywgJyMwMENDQ0MnLCAnIzAwQ0NGRicsICcjMzMwMENDJywgJyMzMzAwRkYnLCAnIzMzMzNDQycsICcjMzMzM0ZGJywgJyMzMzY2Q0MnLCAnIzMzNjZGRicsICcjMzM5OUNDJywgJyMzMzk5RkYnLCAnIzMzQ0MwMCcsICcjMzNDQzMzJywgJyMzM0NDNjYnLCAnIzMzQ0M5OScsICcjMzNDQ0NDJywgJyMzM0NDRkYnLCAnIzY2MDBDQycsICcjNjYwMEZGJywgJyM2NjMzQ0MnLCAnIzY2MzNGRicsICcjNjZDQzAwJywgJyM2NkNDMzMnLCAnIzk5MDBDQycsICcjOTkwMEZGJywgJyM5OTMzQ0MnLCAnIzk5MzNGRicsICcjOTlDQzAwJywgJyM5OUNDMzMnLCAnI0NDMDAwMCcsICcjQ0MwMDMzJywgJyNDQzAwNjYnLCAnI0NDMDA5OScsICcjQ0MwMENDJywgJyNDQzAwRkYnLCAnI0NDMzMwMCcsICcjQ0MzMzMzJywgJyNDQzMzNjYnLCAnI0NDMzM5OScsICcjQ0MzM0NDJywgJyNDQzMzRkYnLCAnI0NDNjYwMCcsICcjQ0M2NjMzJywgJyNDQzk5MDAnLCAnI0NDOTkzMycsICcjQ0NDQzAwJywgJyNDQ0NDMzMnLCAnI0ZGMDAwMCcsICcjRkYwMDMzJywgJyNGRjAwNjYnLCAnI0ZGMDA5OScsICcjRkYwMENDJywgJyNGRjAwRkYnLCAnI0ZGMzMwMCcsICcjRkYzMzMzJywgJyNGRjMzNjYnLCAnI0ZGMzM5OScsICcjRkYzM0NDJywgJyNGRjMzRkYnLCAnI0ZGNjYwMCcsICcjRkY2NjMzJywgJyNGRjk5MDAnLCAnI0ZGOTkzMycsICcjRkZDQzAwJywgJyNGRkNDMzMnXTtcbi8qKlxuICogQ3VycmVudGx5IG9ubHkgV2ViS2l0LWJhc2VkIFdlYiBJbnNwZWN0b3JzLCBGaXJlZm94ID49IHYzMSxcbiAqIGFuZCB0aGUgRmlyZWJ1ZyBleHRlbnNpb24gKGFueSBGaXJlZm94IHZlcnNpb24pIGFyZSBrbm93blxuICogdG8gc3VwcG9ydCBcIiVjXCIgQ1NTIGN1c3RvbWl6YXRpb25zLlxuICpcbiAqIFRPRE86IGFkZCBhIGBsb2NhbFN0b3JhZ2VgIHZhcmlhYmxlIHRvIGV4cGxpY2l0bHkgZW5hYmxlL2Rpc2FibGUgY29sb3JzXG4gKi9cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjb21wbGV4aXR5XG5cbmZ1bmN0aW9uIHVzZUNvbG9ycygpIHtcbiAgLy8gTkI6IEluIGFuIEVsZWN0cm9uIHByZWxvYWQgc2NyaXB0LCBkb2N1bWVudCB3aWxsIGJlIGRlZmluZWQgYnV0IG5vdCBmdWxseVxuICAvLyBpbml0aWFsaXplZC4gU2luY2Ugd2Uga25vdyB3ZSdyZSBpbiBDaHJvbWUsIHdlJ2xsIGp1c3QgZGV0ZWN0IHRoaXMgY2FzZVxuICAvLyBleHBsaWNpdGx5XG4gIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cucHJvY2VzcyAmJiAod2luZG93LnByb2Nlc3MudHlwZSA9PT0gJ3JlbmRlcmVyJyB8fCB3aW5kb3cucHJvY2Vzcy5fX253anMpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gLy8gSW50ZXJuZXQgRXhwbG9yZXIgYW5kIEVkZ2UgZG8gbm90IHN1cHBvcnQgY29sb3JzLlxuXG5cbiAgaWYgKHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIG5hdmlnYXRvci51c2VyQWdlbnQgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLm1hdGNoKC8oZWRnZXx0cmlkZW50KVxcLyhcXGQrKS8pKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IC8vIElzIHdlYmtpdD8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTY0NTk2MDYvMzc2NzczXG4gIC8vIGRvY3VtZW50IGlzIHVuZGVmaW5lZCBpbiByZWFjdC1uYXRpdmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC1uYXRpdmUvcHVsbC8xNjMyXG5cblxuICByZXR1cm4gdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5XZWJraXRBcHBlYXJhbmNlIHx8IC8vIElzIGZpcmVidWc/IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzM5ODEyMC8zNzY3NzNcbiAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmNvbnNvbGUgJiYgKHdpbmRvdy5jb25zb2xlLmZpcmVidWcgfHwgd2luZG93LmNvbnNvbGUuZXhjZXB0aW9uICYmIHdpbmRvdy5jb25zb2xlLnRhYmxlKSB8fCAvLyBJcyBmaXJlZm94ID49IHYzMT9cbiAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9Ub29scy9XZWJfQ29uc29sZSNTdHlsaW5nX21lc3NhZ2VzXG4gIHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIG5hdmlnYXRvci51c2VyQWdlbnQgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLm1hdGNoKC9maXJlZm94XFwvKFxcZCspLykgJiYgcGFyc2VJbnQoUmVnRXhwLiQxLCAxMCkgPj0gMzEgfHwgLy8gRG91YmxlIGNoZWNrIHdlYmtpdCBpbiB1c2VyQWdlbnQganVzdCBpbiBjYXNlIHdlIGFyZSBpbiBhIHdvcmtlclxuICB0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJiBuYXZpZ2F0b3IudXNlckFnZW50ICYmIG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5tYXRjaCgvYXBwbGV3ZWJraXRcXC8oXFxkKykvKTtcbn1cbi8qKlxuICogQ29sb3JpemUgbG9nIGFyZ3VtZW50cyBpZiBlbmFibGVkLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuXG5mdW5jdGlvbiBmb3JtYXRBcmdzKGFyZ3MpIHtcbiAgYXJnc1swXSA9ICh0aGlzLnVzZUNvbG9ycyA/ICclYycgOiAnJykgKyB0aGlzLm5hbWVzcGFjZSArICh0aGlzLnVzZUNvbG9ycyA/ICcgJWMnIDogJyAnKSArIGFyZ3NbMF0gKyAodGhpcy51c2VDb2xvcnMgPyAnJWMgJyA6ICcgJykgKyAnKycgKyBtb2R1bGUuZXhwb3J0cy5odW1hbml6ZSh0aGlzLmRpZmYpO1xuXG4gIGlmICghdGhpcy51c2VDb2xvcnMpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgYyA9ICdjb2xvcjogJyArIHRoaXMuY29sb3I7XG4gIGFyZ3Muc3BsaWNlKDEsIDAsIGMsICdjb2xvcjogaW5oZXJpdCcpOyAvLyBUaGUgZmluYWwgXCIlY1wiIGlzIHNvbWV3aGF0IHRyaWNreSwgYmVjYXVzZSB0aGVyZSBjb3VsZCBiZSBvdGhlclxuICAvLyBhcmd1bWVudHMgcGFzc2VkIGVpdGhlciBiZWZvcmUgb3IgYWZ0ZXIgdGhlICVjLCBzbyB3ZSBuZWVkIHRvXG4gIC8vIGZpZ3VyZSBvdXQgdGhlIGNvcnJlY3QgaW5kZXggdG8gaW5zZXJ0IHRoZSBDU1MgaW50b1xuXG4gIHZhciBpbmRleCA9IDA7XG4gIHZhciBsYXN0QyA9IDA7XG4gIGFyZ3NbMF0ucmVwbGFjZSgvJVthLXpBLVolXS9nLCBmdW5jdGlvbiAobWF0Y2gpIHtcbiAgICBpZiAobWF0Y2ggPT09ICclJScpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpbmRleCsrO1xuXG4gICAgaWYgKG1hdGNoID09PSAnJWMnKSB7XG4gICAgICAvLyBXZSBvbmx5IGFyZSBpbnRlcmVzdGVkIGluIHRoZSAqbGFzdCogJWNcbiAgICAgIC8vICh0aGUgdXNlciBtYXkgaGF2ZSBwcm92aWRlZCB0aGVpciBvd24pXG4gICAgICBsYXN0QyA9IGluZGV4O1xuICAgIH1cbiAgfSk7XG4gIGFyZ3Muc3BsaWNlKGxhc3RDLCAwLCBjKTtcbn1cbi8qKlxuICogSW52b2tlcyBgY29uc29sZS5sb2coKWAgd2hlbiBhdmFpbGFibGUuXG4gKiBOby1vcCB3aGVuIGBjb25zb2xlLmxvZ2AgaXMgbm90IGEgXCJmdW5jdGlvblwiLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuXG5mdW5jdGlvbiBsb2coKSB7XG4gIHZhciBfY29uc29sZTtcblxuICAvLyBUaGlzIGhhY2tlcnkgaXMgcmVxdWlyZWQgZm9yIElFOC85LCB3aGVyZVxuICAvLyB0aGUgYGNvbnNvbGUubG9nYCBmdW5jdGlvbiBkb2Vzbid0IGhhdmUgJ2FwcGx5J1xuICByZXR1cm4gKHR5cGVvZiBjb25zb2xlID09PSBcInVuZGVmaW5lZFwiID8gXCJ1bmRlZmluZWRcIiA6IF90eXBlb2YoY29uc29sZSkpID09PSAnb2JqZWN0JyAmJiBjb25zb2xlLmxvZyAmJiAoX2NvbnNvbGUgPSBjb25zb2xlKS5sb2cuYXBwbHkoX2NvbnNvbGUsIGFyZ3VtZW50cyk7XG59XG4vKipcbiAqIFNhdmUgYG5hbWVzcGFjZXNgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2VzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5cbmZ1bmN0aW9uIHNhdmUobmFtZXNwYWNlcykge1xuICB0cnkge1xuICAgIGlmIChuYW1lc3BhY2VzKSB7XG4gICAgICBleHBvcnRzLnN0b3JhZ2Uuc2V0SXRlbSgnZGVidWcnLCBuYW1lc3BhY2VzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXhwb3J0cy5zdG9yYWdlLnJlbW92ZUl0ZW0oJ2RlYnVnJyk7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikgey8vIFN3YWxsb3dcbiAgICAvLyBYWFggKEBRaXgtKSBzaG91bGQgd2UgYmUgbG9nZ2luZyB0aGVzZT9cbiAgfVxufVxuLyoqXG4gKiBMb2FkIGBuYW1lc3BhY2VzYC5cbiAqXG4gKiBAcmV0dXJuIHtTdHJpbmd9IHJldHVybnMgdGhlIHByZXZpb3VzbHkgcGVyc2lzdGVkIGRlYnVnIG1vZGVzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5cbmZ1bmN0aW9uIGxvYWQoKSB7XG4gIHZhciByO1xuXG4gIHRyeSB7XG4gICAgciA9IGV4cG9ydHMuc3RvcmFnZS5nZXRJdGVtKCdkZWJ1ZycpO1xuICB9IGNhdGNoIChlcnJvcikge30gLy8gU3dhbGxvd1xuICAvLyBYWFggKEBRaXgtKSBzaG91bGQgd2UgYmUgbG9nZ2luZyB0aGVzZT9cbiAgLy8gSWYgZGVidWcgaXNuJ3Qgc2V0IGluIExTLCBhbmQgd2UncmUgaW4gRWxlY3Ryb24sIHRyeSB0byBsb2FkICRERUJVR1xuXG5cbiAgaWYgKCFyICYmIHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiAnZW52JyBpbiBwcm9jZXNzKSB7XG4gICAgciA9IHByb2Nlc3MuZW52LkRFQlVHO1xuICB9XG5cbiAgcmV0dXJuIHI7XG59XG4vKipcbiAqIExvY2Fsc3RvcmFnZSBhdHRlbXB0cyB0byByZXR1cm4gdGhlIGxvY2Fsc3RvcmFnZS5cbiAqXG4gKiBUaGlzIGlzIG5lY2Vzc2FyeSBiZWNhdXNlIHNhZmFyaSB0aHJvd3NcbiAqIHdoZW4gYSB1c2VyIGRpc2FibGVzIGNvb2tpZXMvbG9jYWxzdG9yYWdlXG4gKiBhbmQgeW91IGF0dGVtcHQgdG8gYWNjZXNzIGl0LlxuICpcbiAqIEByZXR1cm4ge0xvY2FsU3RvcmFnZX1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblxuZnVuY3Rpb24gbG9jYWxzdG9yYWdlKCkge1xuICB0cnkge1xuICAgIC8vIFRWTUxLaXQgKEFwcGxlIFRWIEpTIFJ1bnRpbWUpIGRvZXMgbm90IGhhdmUgYSB3aW5kb3cgb2JqZWN0LCBqdXN0IGxvY2FsU3RvcmFnZSBpbiB0aGUgZ2xvYmFsIGNvbnRleHRcbiAgICAvLyBUaGUgQnJvd3NlciBhbHNvIGhhcyBsb2NhbFN0b3JhZ2UgaW4gdGhlIGdsb2JhbCBjb250ZXh0LlxuICAgIHJldHVybiBsb2NhbFN0b3JhZ2U7XG4gIH0gY2F0Y2ggKGVycm9yKSB7Ly8gU3dhbGxvd1xuICAgIC8vIFhYWCAoQFFpeC0pIHNob3VsZCB3ZSBiZSBsb2dnaW5nIHRoZXNlP1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9jb21tb24nKShleHBvcnRzKTtcbnZhciBmb3JtYXR0ZXJzID0gbW9kdWxlLmV4cG9ydHMuZm9ybWF0dGVycztcbi8qKlxuICogTWFwICVqIHRvIGBKU09OLnN0cmluZ2lmeSgpYCwgc2luY2Ugbm8gV2ViIEluc3BlY3RvcnMgZG8gdGhhdCBieSBkZWZhdWx0LlxuICovXG5cbmZvcm1hdHRlcnMuaiA9IGZ1bmN0aW9uICh2KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHYpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiAnW1VuZXhwZWN0ZWRKU09OUGFyc2VFcnJvcl06ICcgKyBlcnJvci5tZXNzYWdlO1xuICB9XG59O1xuXG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBUaGlzIGlzIHRoZSBjb21tb24gbG9naWMgZm9yIGJvdGggdGhlIE5vZGUuanMgYW5kIHdlYiBicm93c2VyXG4gKiBpbXBsZW1lbnRhdGlvbnMgb2YgYGRlYnVnKClgLlxuICovXG5mdW5jdGlvbiBzZXR1cChlbnYpIHtcbiAgY3JlYXRlRGVidWcuZGVidWcgPSBjcmVhdGVEZWJ1ZztcbiAgY3JlYXRlRGVidWcuZGVmYXVsdCA9IGNyZWF0ZURlYnVnO1xuICBjcmVhdGVEZWJ1Zy5jb2VyY2UgPSBjb2VyY2U7XG4gIGNyZWF0ZURlYnVnLmRpc2FibGUgPSBkaXNhYmxlO1xuICBjcmVhdGVEZWJ1Zy5lbmFibGUgPSBlbmFibGU7XG4gIGNyZWF0ZURlYnVnLmVuYWJsZWQgPSBlbmFibGVkO1xuICBjcmVhdGVEZWJ1Zy5odW1hbml6ZSA9IHJlcXVpcmUoJ21zJyk7XG4gIE9iamVjdC5rZXlzKGVudikuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgY3JlYXRlRGVidWdba2V5XSA9IGVudltrZXldO1xuICB9KTtcbiAgLyoqXG4gICogQWN0aXZlIGBkZWJ1Z2AgaW5zdGFuY2VzLlxuICAqL1xuXG4gIGNyZWF0ZURlYnVnLmluc3RhbmNlcyA9IFtdO1xuICAvKipcbiAgKiBUaGUgY3VycmVudGx5IGFjdGl2ZSBkZWJ1ZyBtb2RlIG5hbWVzLCBhbmQgbmFtZXMgdG8gc2tpcC5cbiAgKi9cblxuICBjcmVhdGVEZWJ1Zy5uYW1lcyA9IFtdO1xuICBjcmVhdGVEZWJ1Zy5za2lwcyA9IFtdO1xuICAvKipcbiAgKiBNYXAgb2Ygc3BlY2lhbCBcIiVuXCIgaGFuZGxpbmcgZnVuY3Rpb25zLCBmb3IgdGhlIGRlYnVnIFwiZm9ybWF0XCIgYXJndW1lbnQuXG4gICpcbiAgKiBWYWxpZCBrZXkgbmFtZXMgYXJlIGEgc2luZ2xlLCBsb3dlciBvciB1cHBlci1jYXNlIGxldHRlciwgaS5lLiBcIm5cIiBhbmQgXCJOXCIuXG4gICovXG5cbiAgY3JlYXRlRGVidWcuZm9ybWF0dGVycyA9IHt9O1xuICAvKipcbiAgKiBTZWxlY3RzIGEgY29sb3IgZm9yIGEgZGVidWcgbmFtZXNwYWNlXG4gICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZSBUaGUgbmFtZXNwYWNlIHN0cmluZyBmb3IgdGhlIGZvciB0aGUgZGVidWcgaW5zdGFuY2UgdG8gYmUgY29sb3JlZFxuICAqIEByZXR1cm4ge051bWJlcnxTdHJpbmd9IEFuIEFOU0kgY29sb3IgY29kZSBmb3IgdGhlIGdpdmVuIG5hbWVzcGFjZVxuICAqIEBhcGkgcHJpdmF0ZVxuICAqL1xuXG4gIGZ1bmN0aW9uIHNlbGVjdENvbG9yKG5hbWVzcGFjZSkge1xuICAgIHZhciBoYXNoID0gMDtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmFtZXNwYWNlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBoYXNoID0gKGhhc2ggPDwgNSkgLSBoYXNoICsgbmFtZXNwYWNlLmNoYXJDb2RlQXQoaSk7XG4gICAgICBoYXNoIHw9IDA7IC8vIENvbnZlcnQgdG8gMzJiaXQgaW50ZWdlclxuICAgIH1cblxuICAgIHJldHVybiBjcmVhdGVEZWJ1Zy5jb2xvcnNbTWF0aC5hYnMoaGFzaCkgJSBjcmVhdGVEZWJ1Zy5jb2xvcnMubGVuZ3RoXTtcbiAgfVxuXG4gIGNyZWF0ZURlYnVnLnNlbGVjdENvbG9yID0gc2VsZWN0Q29sb3I7XG4gIC8qKlxuICAqIENyZWF0ZSBhIGRlYnVnZ2VyIHdpdGggdGhlIGdpdmVuIGBuYW1lc3BhY2VgLlxuICAqXG4gICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZVxuICAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICAqIEBhcGkgcHVibGljXG4gICovXG5cbiAgZnVuY3Rpb24gY3JlYXRlRGVidWcobmFtZXNwYWNlKSB7XG4gICAgdmFyIHByZXZUaW1lO1xuXG4gICAgZnVuY3Rpb24gZGVidWcoKSB7XG4gICAgICAvLyBEaXNhYmxlZD9cbiAgICAgIGlmICghZGVidWcuZW5hYmxlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICAgICAgfVxuXG4gICAgICB2YXIgc2VsZiA9IGRlYnVnOyAvLyBTZXQgYGRpZmZgIHRpbWVzdGFtcFxuXG4gICAgICB2YXIgY3VyciA9IE51bWJlcihuZXcgRGF0ZSgpKTtcbiAgICAgIHZhciBtcyA9IGN1cnIgLSAocHJldlRpbWUgfHwgY3Vycik7XG4gICAgICBzZWxmLmRpZmYgPSBtcztcbiAgICAgIHNlbGYucHJldiA9IHByZXZUaW1lO1xuICAgICAgc2VsZi5jdXJyID0gY3VycjtcbiAgICAgIHByZXZUaW1lID0gY3VycjtcbiAgICAgIGFyZ3NbMF0gPSBjcmVhdGVEZWJ1Zy5jb2VyY2UoYXJnc1swXSk7XG5cbiAgICAgIGlmICh0eXBlb2YgYXJnc1swXSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgLy8gQW55dGhpbmcgZWxzZSBsZXQncyBpbnNwZWN0IHdpdGggJU9cbiAgICAgICAgYXJncy51bnNoaWZ0KCclTycpO1xuICAgICAgfSAvLyBBcHBseSBhbnkgYGZvcm1hdHRlcnNgIHRyYW5zZm9ybWF0aW9uc1xuXG5cbiAgICAgIHZhciBpbmRleCA9IDA7XG4gICAgICBhcmdzWzBdID0gYXJnc1swXS5yZXBsYWNlKC8lKFthLXpBLVolXSkvZywgZnVuY3Rpb24gKG1hdGNoLCBmb3JtYXQpIHtcbiAgICAgICAgLy8gSWYgd2UgZW5jb3VudGVyIGFuIGVzY2FwZWQgJSB0aGVuIGRvbid0IGluY3JlYXNlIHRoZSBhcnJheSBpbmRleFxuICAgICAgICBpZiAobWF0Y2ggPT09ICclJScpIHtcbiAgICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgICAgIH1cblxuICAgICAgICBpbmRleCsrO1xuICAgICAgICB2YXIgZm9ybWF0dGVyID0gY3JlYXRlRGVidWcuZm9ybWF0dGVyc1tmb3JtYXRdO1xuXG4gICAgICAgIGlmICh0eXBlb2YgZm9ybWF0dGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgdmFyIHZhbCA9IGFyZ3NbaW5kZXhdO1xuICAgICAgICAgIG1hdGNoID0gZm9ybWF0dGVyLmNhbGwoc2VsZiwgdmFsKTsgLy8gTm93IHdlIG5lZWQgdG8gcmVtb3ZlIGBhcmdzW2luZGV4XWAgc2luY2UgaXQncyBpbmxpbmVkIGluIHRoZSBgZm9ybWF0YFxuXG4gICAgICAgICAgYXJncy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgIGluZGV4LS07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgICB9KTsgLy8gQXBwbHkgZW52LXNwZWNpZmljIGZvcm1hdHRpbmcgKGNvbG9ycywgZXRjLilcblxuICAgICAgY3JlYXRlRGVidWcuZm9ybWF0QXJncy5jYWxsKHNlbGYsIGFyZ3MpO1xuICAgICAgdmFyIGxvZ0ZuID0gc2VsZi5sb2cgfHwgY3JlYXRlRGVidWcubG9nO1xuICAgICAgbG9nRm4uYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgfVxuXG4gICAgZGVidWcubmFtZXNwYWNlID0gbmFtZXNwYWNlO1xuICAgIGRlYnVnLmVuYWJsZWQgPSBjcmVhdGVEZWJ1Zy5lbmFibGVkKG5hbWVzcGFjZSk7XG4gICAgZGVidWcudXNlQ29sb3JzID0gY3JlYXRlRGVidWcudXNlQ29sb3JzKCk7XG4gICAgZGVidWcuY29sb3IgPSBzZWxlY3RDb2xvcihuYW1lc3BhY2UpO1xuICAgIGRlYnVnLmRlc3Ryb3kgPSBkZXN0cm95O1xuICAgIGRlYnVnLmV4dGVuZCA9IGV4dGVuZDsgLy8gRGVidWcuZm9ybWF0QXJncyA9IGZvcm1hdEFyZ3M7XG4gICAgLy8gZGVidWcucmF3TG9nID0gcmF3TG9nO1xuICAgIC8vIGVudi1zcGVjaWZpYyBpbml0aWFsaXphdGlvbiBsb2dpYyBmb3IgZGVidWcgaW5zdGFuY2VzXG5cbiAgICBpZiAodHlwZW9mIGNyZWF0ZURlYnVnLmluaXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNyZWF0ZURlYnVnLmluaXQoZGVidWcpO1xuICAgIH1cblxuICAgIGNyZWF0ZURlYnVnLmluc3RhbmNlcy5wdXNoKGRlYnVnKTtcbiAgICByZXR1cm4gZGVidWc7XG4gIH1cblxuICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgIHZhciBpbmRleCA9IGNyZWF0ZURlYnVnLmluc3RhbmNlcy5pbmRleE9mKHRoaXMpO1xuXG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgY3JlYXRlRGVidWcuaW5zdGFuY2VzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiBleHRlbmQobmFtZXNwYWNlLCBkZWxpbWl0ZXIpIHtcbiAgICByZXR1cm4gY3JlYXRlRGVidWcodGhpcy5uYW1lc3BhY2UgKyAodHlwZW9mIGRlbGltaXRlciA9PT0gJ3VuZGVmaW5lZCcgPyAnOicgOiBkZWxpbWl0ZXIpICsgbmFtZXNwYWNlKTtcbiAgfVxuICAvKipcbiAgKiBFbmFibGVzIGEgZGVidWcgbW9kZSBieSBuYW1lc3BhY2VzLiBUaGlzIGNhbiBpbmNsdWRlIG1vZGVzXG4gICogc2VwYXJhdGVkIGJ5IGEgY29sb24gYW5kIHdpbGRjYXJkcy5cbiAgKlxuICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2VzXG4gICogQGFwaSBwdWJsaWNcbiAgKi9cblxuXG4gIGZ1bmN0aW9uIGVuYWJsZShuYW1lc3BhY2VzKSB7XG4gICAgY3JlYXRlRGVidWcuc2F2ZShuYW1lc3BhY2VzKTtcbiAgICBjcmVhdGVEZWJ1Zy5uYW1lcyA9IFtdO1xuICAgIGNyZWF0ZURlYnVnLnNraXBzID0gW107XG4gICAgdmFyIGk7XG4gICAgdmFyIHNwbGl0ID0gKHR5cGVvZiBuYW1lc3BhY2VzID09PSAnc3RyaW5nJyA/IG5hbWVzcGFjZXMgOiAnJykuc3BsaXQoL1tcXHMsXSsvKTtcbiAgICB2YXIgbGVuID0gc3BsaXQubGVuZ3RoO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBpZiAoIXNwbGl0W2ldKSB7XG4gICAgICAgIC8vIGlnbm9yZSBlbXB0eSBzdHJpbmdzXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBuYW1lc3BhY2VzID0gc3BsaXRbaV0ucmVwbGFjZSgvXFwqL2csICcuKj8nKTtcblxuICAgICAgaWYgKG5hbWVzcGFjZXNbMF0gPT09ICctJykge1xuICAgICAgICBjcmVhdGVEZWJ1Zy5za2lwcy5wdXNoKG5ldyBSZWdFeHAoJ14nICsgbmFtZXNwYWNlcy5zdWJzdHIoMSkgKyAnJCcpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNyZWF0ZURlYnVnLm5hbWVzLnB1c2gobmV3IFJlZ0V4cCgnXicgKyBuYW1lc3BhY2VzICsgJyQnKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChpID0gMDsgaSA8IGNyZWF0ZURlYnVnLmluc3RhbmNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGluc3RhbmNlID0gY3JlYXRlRGVidWcuaW5zdGFuY2VzW2ldO1xuICAgICAgaW5zdGFuY2UuZW5hYmxlZCA9IGNyZWF0ZURlYnVnLmVuYWJsZWQoaW5zdGFuY2UubmFtZXNwYWNlKTtcbiAgICB9XG4gIH1cbiAgLyoqXG4gICogRGlzYWJsZSBkZWJ1ZyBvdXRwdXQuXG4gICpcbiAgKiBAYXBpIHB1YmxpY1xuICAqL1xuXG5cbiAgZnVuY3Rpb24gZGlzYWJsZSgpIHtcbiAgICBjcmVhdGVEZWJ1Zy5lbmFibGUoJycpO1xuICB9XG4gIC8qKlxuICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgZ2l2ZW4gbW9kZSBuYW1lIGlzIGVuYWJsZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgKlxuICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gICogQHJldHVybiB7Qm9vbGVhbn1cbiAgKiBAYXBpIHB1YmxpY1xuICAqL1xuXG5cbiAgZnVuY3Rpb24gZW5hYmxlZChuYW1lKSB7XG4gICAgaWYgKG5hbWVbbmFtZS5sZW5ndGggLSAxXSA9PT0gJyonKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICB2YXIgaTtcbiAgICB2YXIgbGVuO1xuXG4gICAgZm9yIChpID0gMCwgbGVuID0gY3JlYXRlRGVidWcuc2tpcHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGlmIChjcmVhdGVEZWJ1Zy5za2lwc1tpXS50ZXN0KG5hbWUpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBjcmVhdGVEZWJ1Zy5uYW1lcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgaWYgKGNyZWF0ZURlYnVnLm5hbWVzW2ldLnRlc3QobmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8qKlxuICAqIENvZXJjZSBgdmFsYC5cbiAgKlxuICAqIEBwYXJhbSB7TWl4ZWR9IHZhbFxuICAqIEByZXR1cm4ge01peGVkfVxuICAqIEBhcGkgcHJpdmF0ZVxuICAqL1xuXG5cbiAgZnVuY3Rpb24gY29lcmNlKHZhbCkge1xuICAgIGlmICh2YWwgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgcmV0dXJuIHZhbC5zdGFjayB8fCB2YWwubWVzc2FnZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsO1xuICB9XG5cbiAgY3JlYXRlRGVidWcuZW5hYmxlKGNyZWF0ZURlYnVnLmxvYWQoKSk7XG4gIHJldHVybiBjcmVhdGVEZWJ1Zztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzZXR1cDtcblxuIiwiLyoqXG4gKiBIZWxwZXJzLlxuICovXG5cbnZhciBzID0gMTAwMDtcbnZhciBtID0gcyAqIDYwO1xudmFyIGggPSBtICogNjA7XG52YXIgZCA9IGggKiAyNDtcbnZhciB3ID0gZCAqIDc7XG52YXIgeSA9IGQgKiAzNjUuMjU7XG5cbi8qKlxuICogUGFyc2Ugb3IgZm9ybWF0IHRoZSBnaXZlbiBgdmFsYC5cbiAqXG4gKiBPcHRpb25zOlxuICpcbiAqICAtIGBsb25nYCB2ZXJib3NlIGZvcm1hdHRpbmcgW2ZhbHNlXVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0gdmFsXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gKiBAdGhyb3dzIHtFcnJvcn0gdGhyb3cgYW4gZXJyb3IgaWYgdmFsIGlzIG5vdCBhIG5vbi1lbXB0eSBzdHJpbmcgb3IgYSBudW1iZXJcbiAqIEByZXR1cm4ge1N0cmluZ3xOdW1iZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHZhbCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsO1xuICBpZiAodHlwZSA9PT0gJ3N0cmluZycgJiYgdmFsLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gcGFyc2UodmFsKTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSAnbnVtYmVyJyAmJiBpc0Zpbml0ZSh2YWwpKSB7XG4gICAgcmV0dXJuIG9wdGlvbnMubG9uZyA/IGZtdExvbmcodmFsKSA6IGZtdFNob3J0KHZhbCk7XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKFxuICAgICd2YWwgaXMgbm90IGEgbm9uLWVtcHR5IHN0cmluZyBvciBhIHZhbGlkIG51bWJlci4gdmFsPScgK1xuICAgICAgSlNPTi5zdHJpbmdpZnkodmFsKVxuICApO1xufTtcblxuLyoqXG4gKiBQYXJzZSB0aGUgZ2l2ZW4gYHN0cmAgYW5kIHJldHVybiBtaWxsaXNlY29uZHMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7TnVtYmVyfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gcGFyc2Uoc3RyKSB7XG4gIHN0ciA9IFN0cmluZyhzdHIpO1xuICBpZiAoc3RyLmxlbmd0aCA+IDEwMCkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbWF0Y2ggPSAvXigtPyg/OlxcZCspP1xcLj9cXGQrKSAqKG1pbGxpc2Vjb25kcz98bXNlY3M/fG1zfHNlY29uZHM/fHNlY3M/fHN8bWludXRlcz98bWlucz98bXxob3Vycz98aHJzP3xofGRheXM/fGR8d2Vla3M/fHd8eWVhcnM/fHlycz98eSk/JC9pLmV4ZWMoXG4gICAgc3RyXG4gICk7XG4gIGlmICghbWF0Y2gpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIG4gPSBwYXJzZUZsb2F0KG1hdGNoWzFdKTtcbiAgdmFyIHR5cGUgPSAobWF0Y2hbMl0gfHwgJ21zJykudG9Mb3dlckNhc2UoKTtcbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAneWVhcnMnOlxuICAgIGNhc2UgJ3llYXInOlxuICAgIGNhc2UgJ3lycyc6XG4gICAgY2FzZSAneXInOlxuICAgIGNhc2UgJ3knOlxuICAgICAgcmV0dXJuIG4gKiB5O1xuICAgIGNhc2UgJ3dlZWtzJzpcbiAgICBjYXNlICd3ZWVrJzpcbiAgICBjYXNlICd3JzpcbiAgICAgIHJldHVybiBuICogdztcbiAgICBjYXNlICdkYXlzJzpcbiAgICBjYXNlICdkYXknOlxuICAgIGNhc2UgJ2QnOlxuICAgICAgcmV0dXJuIG4gKiBkO1xuICAgIGNhc2UgJ2hvdXJzJzpcbiAgICBjYXNlICdob3VyJzpcbiAgICBjYXNlICdocnMnOlxuICAgIGNhc2UgJ2hyJzpcbiAgICBjYXNlICdoJzpcbiAgICAgIHJldHVybiBuICogaDtcbiAgICBjYXNlICdtaW51dGVzJzpcbiAgICBjYXNlICdtaW51dGUnOlxuICAgIGNhc2UgJ21pbnMnOlxuICAgIGNhc2UgJ21pbic6XG4gICAgY2FzZSAnbSc6XG4gICAgICByZXR1cm4gbiAqIG07XG4gICAgY2FzZSAnc2Vjb25kcyc6XG4gICAgY2FzZSAnc2Vjb25kJzpcbiAgICBjYXNlICdzZWNzJzpcbiAgICBjYXNlICdzZWMnOlxuICAgIGNhc2UgJ3MnOlxuICAgICAgcmV0dXJuIG4gKiBzO1xuICAgIGNhc2UgJ21pbGxpc2Vjb25kcyc6XG4gICAgY2FzZSAnbWlsbGlzZWNvbmQnOlxuICAgIGNhc2UgJ21zZWNzJzpcbiAgICBjYXNlICdtc2VjJzpcbiAgICBjYXNlICdtcyc6XG4gICAgICByZXR1cm4gbjtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufVxuXG4vKipcbiAqIFNob3J0IGZvcm1hdCBmb3IgYG1zYC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gbXNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGZtdFNob3J0KG1zKSB7XG4gIHZhciBtc0FicyA9IE1hdGguYWJzKG1zKTtcbiAgaWYgKG1zQWJzID49IGQpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChtcyAvIGQpICsgJ2QnO1xuICB9XG4gIGlmIChtc0FicyA+PSBoKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQobXMgLyBoKSArICdoJztcbiAgfVxuICBpZiAobXNBYnMgPj0gbSkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gbSkgKyAnbSc7XG4gIH1cbiAgaWYgKG1zQWJzID49IHMpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChtcyAvIHMpICsgJ3MnO1xuICB9XG4gIHJldHVybiBtcyArICdtcyc7XG59XG5cbi8qKlxuICogTG9uZyBmb3JtYXQgZm9yIGBtc2AuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG1zXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBmbXRMb25nKG1zKSB7XG4gIHZhciBtc0FicyA9IE1hdGguYWJzKG1zKTtcbiAgaWYgKG1zQWJzID49IGQpIHtcbiAgICByZXR1cm4gcGx1cmFsKG1zLCBtc0FicywgZCwgJ2RheScpO1xuICB9XG4gIGlmIChtc0FicyA+PSBoKSB7XG4gICAgcmV0dXJuIHBsdXJhbChtcywgbXNBYnMsIGgsICdob3VyJyk7XG4gIH1cbiAgaWYgKG1zQWJzID49IG0pIHtcbiAgICByZXR1cm4gcGx1cmFsKG1zLCBtc0FicywgbSwgJ21pbnV0ZScpO1xuICB9XG4gIGlmIChtc0FicyA+PSBzKSB7XG4gICAgcmV0dXJuIHBsdXJhbChtcywgbXNBYnMsIHMsICdzZWNvbmQnKTtcbiAgfVxuICByZXR1cm4gbXMgKyAnIG1zJztcbn1cblxuLyoqXG4gKiBQbHVyYWxpemF0aW9uIGhlbHBlci5cbiAqL1xuXG5mdW5jdGlvbiBwbHVyYWwobXMsIG1zQWJzLCBuLCBuYW1lKSB7XG4gIHZhciBpc1BsdXJhbCA9IG1zQWJzID49IG4gKiAxLjU7XG4gIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gbikgKyAnICcgKyBuYW1lICsgKGlzUGx1cmFsID8gJ3MnIDogJycpO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcmVxdWlyZWQgPSByZXF1aXJlKCdyZXF1aXJlcy1wb3J0JylcbiAgLCBxcyA9IHJlcXVpcmUoJ3F1ZXJ5c3RyaW5naWZ5JylcbiAgLCBjb250cm9sT3JXaGl0ZXNwYWNlID0gL15bXFx4MDAtXFx4MjBcXHUwMGEwXFx1MTY4MFxcdTIwMDAtXFx1MjAwYVxcdTIwMjhcXHUyMDI5XFx1MjAyZlxcdTIwNWZcXHUzMDAwXFx1ZmVmZl0rL1xuICAsIENSSFRMRiA9IC9bXFxuXFxyXFx0XS9nXG4gICwgc2xhc2hlcyA9IC9eW0EtWmEtel1bQS1aYS16MC05Ky0uXSo6XFwvXFwvL1xuICAsIHBvcnQgPSAvOlxcZCskL1xuICAsIHByb3RvY29scmUgPSAvXihbYS16XVthLXowLTkuKy1dKjopPyhcXC9cXC8pPyhbXFxcXC9dKyk/KFtcXFNcXHNdKikvaVxuICAsIHdpbmRvd3NEcml2ZUxldHRlciA9IC9eW2EtekEtWl06LztcblxuLyoqXG4gKiBSZW1vdmUgY29udHJvbCBjaGFyYWN0ZXJzIGFuZCB3aGl0ZXNwYWNlIGZyb20gdGhlIGJlZ2lubmluZyBvZiBhIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdHxTdHJpbmd9IHN0ciBTdHJpbmcgdG8gdHJpbS5cbiAqIEByZXR1cm5zIHtTdHJpbmd9IEEgbmV3IHN0cmluZyByZXByZXNlbnRpbmcgYHN0cmAgc3RyaXBwZWQgb2YgY29udHJvbFxuICogICAgIGNoYXJhY3RlcnMgYW5kIHdoaXRlc3BhY2UgZnJvbSBpdHMgYmVnaW5uaW5nLlxuICogQHB1YmxpY1xuICovXG5mdW5jdGlvbiB0cmltTGVmdChzdHIpIHtcbiAgcmV0dXJuIChzdHIgPyBzdHIgOiAnJykudG9TdHJpbmcoKS5yZXBsYWNlKGNvbnRyb2xPcldoaXRlc3BhY2UsICcnKTtcbn1cblxuLyoqXG4gKiBUaGVzZSBhcmUgdGhlIHBhcnNlIHJ1bGVzIGZvciB0aGUgVVJMIHBhcnNlciwgaXQgaW5mb3JtcyB0aGUgcGFyc2VyXG4gKiBhYm91dDpcbiAqXG4gKiAwLiBUaGUgY2hhciBpdCBOZWVkcyB0byBwYXJzZSwgaWYgaXQncyBhIHN0cmluZyBpdCBzaG91bGQgYmUgZG9uZSB1c2luZ1xuICogICAgaW5kZXhPZiwgUmVnRXhwIHVzaW5nIGV4ZWMgYW5kIE5hTiBtZWFucyBzZXQgYXMgY3VycmVudCB2YWx1ZS5cbiAqIDEuIFRoZSBwcm9wZXJ0eSB3ZSBzaG91bGQgc2V0IHdoZW4gcGFyc2luZyB0aGlzIHZhbHVlLlxuICogMi4gSW5kaWNhdGlvbiBpZiBpdCdzIGJhY2t3YXJkcyBvciBmb3J3YXJkIHBhcnNpbmcsIHdoZW4gc2V0IGFzIG51bWJlciBpdCdzXG4gKiAgICB0aGUgdmFsdWUgb2YgZXh0cmEgY2hhcnMgdGhhdCBzaG91bGQgYmUgc3BsaXQgb2ZmLlxuICogMy4gSW5oZXJpdCBmcm9tIGxvY2F0aW9uIGlmIG5vbiBleGlzdGluZyBpbiB0aGUgcGFyc2VyLlxuICogNC4gYHRvTG93ZXJDYXNlYCB0aGUgcmVzdWx0aW5nIHZhbHVlLlxuICovXG52YXIgcnVsZXMgPSBbXG4gIFsnIycsICdoYXNoJ10sICAgICAgICAgICAgICAgICAgICAgICAgLy8gRXh0cmFjdCBmcm9tIHRoZSBiYWNrLlxuICBbJz8nLCAncXVlcnknXSwgICAgICAgICAgICAgICAgICAgICAgIC8vIEV4dHJhY3QgZnJvbSB0aGUgYmFjay5cbiAgZnVuY3Rpb24gc2FuaXRpemUoYWRkcmVzcywgdXJsKSB7ICAgICAvLyBTYW5pdGl6ZSB3aGF0IGlzIGxlZnQgb2YgdGhlIGFkZHJlc3NcbiAgICByZXR1cm4gaXNTcGVjaWFsKHVybC5wcm90b2NvbCkgPyBhZGRyZXNzLnJlcGxhY2UoL1xcXFwvZywgJy8nKSA6IGFkZHJlc3M7XG4gIH0sXG4gIFsnLycsICdwYXRobmFtZSddLCAgICAgICAgICAgICAgICAgICAgLy8gRXh0cmFjdCBmcm9tIHRoZSBiYWNrLlxuICBbJ0AnLCAnYXV0aCcsIDFdLCAgICAgICAgICAgICAgICAgICAgIC8vIEV4dHJhY3QgZnJvbSB0aGUgZnJvbnQuXG4gIFtOYU4sICdob3N0JywgdW5kZWZpbmVkLCAxLCAxXSwgICAgICAgLy8gU2V0IGxlZnQgb3ZlciB2YWx1ZS5cbiAgWy86KFxcZCopJC8sICdwb3J0JywgdW5kZWZpbmVkLCAxXSwgICAgLy8gUmVnRXhwIHRoZSBiYWNrLlxuICBbTmFOLCAnaG9zdG5hbWUnLCB1bmRlZmluZWQsIDEsIDFdICAgIC8vIFNldCBsZWZ0IG92ZXIuXG5dO1xuXG4vKipcbiAqIFRoZXNlIHByb3BlcnRpZXMgc2hvdWxkIG5vdCBiZSBjb3BpZWQgb3IgaW5oZXJpdGVkIGZyb20uIFRoaXMgaXMgb25seSBuZWVkZWRcbiAqIGZvciBhbGwgbm9uIGJsb2IgVVJMJ3MgYXMgYSBibG9iIFVSTCBkb2VzIG5vdCBpbmNsdWRlIGEgaGFzaCwgb25seSB0aGVcbiAqIG9yaWdpbi5cbiAqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICogQHByaXZhdGVcbiAqL1xudmFyIGlnbm9yZSA9IHsgaGFzaDogMSwgcXVlcnk6IDEgfTtcblxuLyoqXG4gKiBUaGUgbG9jYXRpb24gb2JqZWN0IGRpZmZlcnMgd2hlbiB5b3VyIGNvZGUgaXMgbG9hZGVkIHRocm91Z2ggYSBub3JtYWwgcGFnZSxcbiAqIFdvcmtlciBvciB0aHJvdWdoIGEgd29ya2VyIHVzaW5nIGEgYmxvYi4gQW5kIHdpdGggdGhlIGJsb2JibGUgYmVnaW5zIHRoZVxuICogdHJvdWJsZSBhcyB0aGUgbG9jYXRpb24gb2JqZWN0IHdpbGwgY29udGFpbiB0aGUgVVJMIG9mIHRoZSBibG9iLCBub3QgdGhlXG4gKiBsb2NhdGlvbiBvZiB0aGUgcGFnZSB3aGVyZSBvdXIgY29kZSBpcyBsb2FkZWQgaW4uIFRoZSBhY3R1YWwgb3JpZ2luIGlzXG4gKiBlbmNvZGVkIGluIHRoZSBgcGF0aG5hbWVgIHNvIHdlIGNhbiB0aGFua2Z1bGx5IGdlbmVyYXRlIGEgZ29vZCBcImRlZmF1bHRcIlxuICogbG9jYXRpb24gZnJvbSBpdCBzbyB3ZSBjYW4gZ2VuZXJhdGUgcHJvcGVyIHJlbGF0aXZlIFVSTCdzIGFnYWluLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fFN0cmluZ30gbG9jIE9wdGlvbmFsIGRlZmF1bHQgbG9jYXRpb24gb2JqZWN0LlxuICogQHJldHVybnMge09iamVjdH0gbG9sY2F0aW9uIG9iamVjdC5cbiAqIEBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gbG9sY2F0aW9uKGxvYykge1xuICB2YXIgZ2xvYmFsVmFyO1xuXG4gIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykgZ2xvYmFsVmFyID0gd2luZG93O1xuICBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykgZ2xvYmFsVmFyID0gZ2xvYmFsO1xuICBlbHNlIGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIGdsb2JhbFZhciA9IHNlbGY7XG4gIGVsc2UgZ2xvYmFsVmFyID0ge307XG5cbiAgdmFyIGxvY2F0aW9uID0gZ2xvYmFsVmFyLmxvY2F0aW9uIHx8IHt9O1xuICBsb2MgPSBsb2MgfHwgbG9jYXRpb247XG5cbiAgdmFyIGZpbmFsZGVzdGluYXRpb24gPSB7fVxuICAgICwgdHlwZSA9IHR5cGVvZiBsb2NcbiAgICAsIGtleTtcblxuICBpZiAoJ2Jsb2I6JyA9PT0gbG9jLnByb3RvY29sKSB7XG4gICAgZmluYWxkZXN0aW5hdGlvbiA9IG5ldyBVcmwodW5lc2NhcGUobG9jLnBhdGhuYW1lKSwge30pO1xuICB9IGVsc2UgaWYgKCdzdHJpbmcnID09PSB0eXBlKSB7XG4gICAgZmluYWxkZXN0aW5hdGlvbiA9IG5ldyBVcmwobG9jLCB7fSk7XG4gICAgZm9yIChrZXkgaW4gaWdub3JlKSBkZWxldGUgZmluYWxkZXN0aW5hdGlvbltrZXldO1xuICB9IGVsc2UgaWYgKCdvYmplY3QnID09PSB0eXBlKSB7XG4gICAgZm9yIChrZXkgaW4gbG9jKSB7XG4gICAgICBpZiAoa2V5IGluIGlnbm9yZSkgY29udGludWU7XG4gICAgICBmaW5hbGRlc3RpbmF0aW9uW2tleV0gPSBsb2Nba2V5XTtcbiAgICB9XG5cbiAgICBpZiAoZmluYWxkZXN0aW5hdGlvbi5zbGFzaGVzID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGZpbmFsZGVzdGluYXRpb24uc2xhc2hlcyA9IHNsYXNoZXMudGVzdChsb2MuaHJlZik7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZpbmFsZGVzdGluYXRpb247XG59XG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciBhIHByb3RvY29sIHNjaGVtZSBpcyBzcGVjaWFsLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBUaGUgcHJvdG9jb2wgc2NoZW1lIG9mIHRoZSBVUkxcbiAqIEByZXR1cm4ge0Jvb2xlYW59IGB0cnVlYCBpZiB0aGUgcHJvdG9jb2wgc2NoZW1lIGlzIHNwZWNpYWwsIGVsc2UgYGZhbHNlYFxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gaXNTcGVjaWFsKHNjaGVtZSkge1xuICByZXR1cm4gKFxuICAgIHNjaGVtZSA9PT0gJ2ZpbGU6JyB8fFxuICAgIHNjaGVtZSA9PT0gJ2Z0cDonIHx8XG4gICAgc2NoZW1lID09PSAnaHR0cDonIHx8XG4gICAgc2NoZW1lID09PSAnaHR0cHM6JyB8fFxuICAgIHNjaGVtZSA9PT0gJ3dzOicgfHxcbiAgICBzY2hlbWUgPT09ICd3c3M6J1xuICApO1xufVxuXG4vKipcbiAqIEB0eXBlZGVmIFByb3RvY29sRXh0cmFjdFxuICogQHR5cGUgT2JqZWN0XG4gKiBAcHJvcGVydHkge1N0cmluZ30gcHJvdG9jb2wgUHJvdG9jb2wgbWF0Y2hlZCBpbiB0aGUgVVJMLCBpbiBsb3dlcmNhc2UuXG4gKiBAcHJvcGVydHkge0Jvb2xlYW59IHNsYXNoZXMgYHRydWVgIGlmIHByb3RvY29sIGlzIGZvbGxvd2VkIGJ5IFwiLy9cIiwgZWxzZSBgZmFsc2VgLlxuICogQHByb3BlcnR5IHtTdHJpbmd9IHJlc3QgUmVzdCBvZiB0aGUgVVJMIHRoYXQgaXMgbm90IHBhcnQgb2YgdGhlIHByb3RvY29sLlxuICovXG5cbi8qKlxuICogRXh0cmFjdCBwcm90b2NvbCBpbmZvcm1hdGlvbiBmcm9tIGEgVVJMIHdpdGgvd2l0aG91dCBkb3VibGUgc2xhc2ggKFwiLy9cIikuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGFkZHJlc3MgVVJMIHdlIHdhbnQgdG8gZXh0cmFjdCBmcm9tLlxuICogQHBhcmFtIHtPYmplY3R9IGxvY2F0aW9uXG4gKiBAcmV0dXJuIHtQcm90b2NvbEV4dHJhY3R9IEV4dHJhY3RlZCBpbmZvcm1hdGlvbi5cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGV4dHJhY3RQcm90b2NvbChhZGRyZXNzLCBsb2NhdGlvbikge1xuICBhZGRyZXNzID0gdHJpbUxlZnQoYWRkcmVzcyk7XG4gIGFkZHJlc3MgPSBhZGRyZXNzLnJlcGxhY2UoQ1JIVExGLCAnJyk7XG4gIGxvY2F0aW9uID0gbG9jYXRpb24gfHwge307XG5cbiAgdmFyIG1hdGNoID0gcHJvdG9jb2xyZS5leGVjKGFkZHJlc3MpO1xuICB2YXIgcHJvdG9jb2wgPSBtYXRjaFsxXSA/IG1hdGNoWzFdLnRvTG93ZXJDYXNlKCkgOiAnJztcbiAgdmFyIGZvcndhcmRTbGFzaGVzID0gISFtYXRjaFsyXTtcbiAgdmFyIG90aGVyU2xhc2hlcyA9ICEhbWF0Y2hbM107XG4gIHZhciBzbGFzaGVzQ291bnQgPSAwO1xuICB2YXIgcmVzdDtcblxuICBpZiAoZm9yd2FyZFNsYXNoZXMpIHtcbiAgICBpZiAob3RoZXJTbGFzaGVzKSB7XG4gICAgICByZXN0ID0gbWF0Y2hbMl0gKyBtYXRjaFszXSArIG1hdGNoWzRdO1xuICAgICAgc2xhc2hlc0NvdW50ID0gbWF0Y2hbMl0ubGVuZ3RoICsgbWF0Y2hbM10ubGVuZ3RoO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN0ID0gbWF0Y2hbMl0gKyBtYXRjaFs0XTtcbiAgICAgIHNsYXNoZXNDb3VudCA9IG1hdGNoWzJdLmxlbmd0aDtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKG90aGVyU2xhc2hlcykge1xuICAgICAgcmVzdCA9IG1hdGNoWzNdICsgbWF0Y2hbNF07XG4gICAgICBzbGFzaGVzQ291bnQgPSBtYXRjaFszXS5sZW5ndGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3QgPSBtYXRjaFs0XVxuICAgIH1cbiAgfVxuXG4gIGlmIChwcm90b2NvbCA9PT0gJ2ZpbGU6Jykge1xuICAgIGlmIChzbGFzaGVzQ291bnQgPj0gMikge1xuICAgICAgcmVzdCA9IHJlc3Quc2xpY2UoMik7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzU3BlY2lhbChwcm90b2NvbCkpIHtcbiAgICByZXN0ID0gbWF0Y2hbNF07XG4gIH0gZWxzZSBpZiAocHJvdG9jb2wpIHtcbiAgICBpZiAoZm9yd2FyZFNsYXNoZXMpIHtcbiAgICAgIHJlc3QgPSByZXN0LnNsaWNlKDIpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChzbGFzaGVzQ291bnQgPj0gMiAmJiBpc1NwZWNpYWwobG9jYXRpb24ucHJvdG9jb2wpKSB7XG4gICAgcmVzdCA9IG1hdGNoWzRdO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBwcm90b2NvbDogcHJvdG9jb2wsXG4gICAgc2xhc2hlczogZm9yd2FyZFNsYXNoZXMgfHwgaXNTcGVjaWFsKHByb3RvY29sKSxcbiAgICBzbGFzaGVzQ291bnQ6IHNsYXNoZXNDb3VudCxcbiAgICByZXN0OiByZXN0XG4gIH07XG59XG5cbi8qKlxuICogUmVzb2x2ZSBhIHJlbGF0aXZlIFVSTCBwYXRobmFtZSBhZ2FpbnN0IGEgYmFzZSBVUkwgcGF0aG5hbWUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHJlbGF0aXZlIFBhdGhuYW1lIG9mIHRoZSByZWxhdGl2ZSBVUkwuXG4gKiBAcGFyYW0ge1N0cmluZ30gYmFzZSBQYXRobmFtZSBvZiB0aGUgYmFzZSBVUkwuXG4gKiBAcmV0dXJuIHtTdHJpbmd9IFJlc29sdmVkIHBhdGhuYW1lLlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gcmVzb2x2ZShyZWxhdGl2ZSwgYmFzZSkge1xuICBpZiAocmVsYXRpdmUgPT09ICcnKSByZXR1cm4gYmFzZTtcblxuICB2YXIgcGF0aCA9IChiYXNlIHx8ICcvJykuc3BsaXQoJy8nKS5zbGljZSgwLCAtMSkuY29uY2F0KHJlbGF0aXZlLnNwbGl0KCcvJykpXG4gICAgLCBpID0gcGF0aC5sZW5ndGhcbiAgICAsIGxhc3QgPSBwYXRoW2kgLSAxXVxuICAgICwgdW5zaGlmdCA9IGZhbHNlXG4gICAgLCB1cCA9IDA7XG5cbiAgd2hpbGUgKGktLSkge1xuICAgIGlmIChwYXRoW2ldID09PSAnLicpIHtcbiAgICAgIHBhdGguc3BsaWNlKGksIDEpO1xuICAgIH0gZWxzZSBpZiAocGF0aFtpXSA9PT0gJy4uJykge1xuICAgICAgcGF0aC5zcGxpY2UoaSwgMSk7XG4gICAgICB1cCsrO1xuICAgIH0gZWxzZSBpZiAodXApIHtcbiAgICAgIGlmIChpID09PSAwKSB1bnNoaWZ0ID0gdHJ1ZTtcbiAgICAgIHBhdGguc3BsaWNlKGksIDEpO1xuICAgICAgdXAtLTtcbiAgICB9XG4gIH1cblxuICBpZiAodW5zaGlmdCkgcGF0aC51bnNoaWZ0KCcnKTtcbiAgaWYgKGxhc3QgPT09ICcuJyB8fCBsYXN0ID09PSAnLi4nKSBwYXRoLnB1c2goJycpO1xuXG4gIHJldHVybiBwYXRoLmpvaW4oJy8nKTtcbn1cblxuLyoqXG4gKiBUaGUgYWN0dWFsIFVSTCBpbnN0YW5jZS4gSW5zdGVhZCBvZiByZXR1cm5pbmcgYW4gb2JqZWN0IHdlJ3ZlIG9wdGVkLWluIHRvXG4gKiBjcmVhdGUgYW4gYWN0dWFsIGNvbnN0cnVjdG9yIGFzIGl0J3MgbXVjaCBtb3JlIG1lbW9yeSBlZmZpY2llbnQgYW5kXG4gKiBmYXN0ZXIgYW5kIGl0IHBsZWFzZXMgbXkgT0NELlxuICpcbiAqIEl0IGlzIHdvcnRoIG5vdGluZyB0aGF0IHdlIHNob3VsZCBub3QgdXNlIGBVUkxgIGFzIGNsYXNzIG5hbWUgdG8gcHJldmVudFxuICogY2xhc2hlcyB3aXRoIHRoZSBnbG9iYWwgVVJMIGluc3RhbmNlIHRoYXQgZ290IGludHJvZHVjZWQgaW4gYnJvd3NlcnMuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge1N0cmluZ30gYWRkcmVzcyBVUkwgd2Ugd2FudCB0byBwYXJzZS5cbiAqIEBwYXJhbSB7T2JqZWN0fFN0cmluZ30gW2xvY2F0aW9uXSBMb2NhdGlvbiBkZWZhdWx0cyBmb3IgcmVsYXRpdmUgcGF0aHMuXG4gKiBAcGFyYW0ge0Jvb2xlYW58RnVuY3Rpb259IFtwYXJzZXJdIFBhcnNlciBmb3IgdGhlIHF1ZXJ5IHN0cmluZy5cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIFVybChhZGRyZXNzLCBsb2NhdGlvbiwgcGFyc2VyKSB7XG4gIGFkZHJlc3MgPSB0cmltTGVmdChhZGRyZXNzKTtcbiAgYWRkcmVzcyA9IGFkZHJlc3MucmVwbGFjZShDUkhUTEYsICcnKTtcblxuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgVXJsKSkge1xuICAgIHJldHVybiBuZXcgVXJsKGFkZHJlc3MsIGxvY2F0aW9uLCBwYXJzZXIpO1xuICB9XG5cbiAgdmFyIHJlbGF0aXZlLCBleHRyYWN0ZWQsIHBhcnNlLCBpbnN0cnVjdGlvbiwgaW5kZXgsIGtleVxuICAgICwgaW5zdHJ1Y3Rpb25zID0gcnVsZXMuc2xpY2UoKVxuICAgICwgdHlwZSA9IHR5cGVvZiBsb2NhdGlvblxuICAgICwgdXJsID0gdGhpc1xuICAgICwgaSA9IDA7XG5cbiAgLy9cbiAgLy8gVGhlIGZvbGxvd2luZyBpZiBzdGF0ZW1lbnRzIGFsbG93cyB0aGlzIG1vZHVsZSB0d28gaGF2ZSBjb21wYXRpYmlsaXR5IHdpdGhcbiAgLy8gMiBkaWZmZXJlbnQgQVBJOlxuICAvL1xuICAvLyAxLiBOb2RlLmpzJ3MgYHVybC5wYXJzZWAgYXBpIHdoaWNoIGFjY2VwdHMgYSBVUkwsIGJvb2xlYW4gYXMgYXJndW1lbnRzXG4gIC8vICAgIHdoZXJlIHRoZSBib29sZWFuIGluZGljYXRlcyB0aGF0IHRoZSBxdWVyeSBzdHJpbmcgc2hvdWxkIGFsc28gYmUgcGFyc2VkLlxuICAvL1xuICAvLyAyLiBUaGUgYFVSTGAgaW50ZXJmYWNlIG9mIHRoZSBicm93c2VyIHdoaWNoIGFjY2VwdHMgYSBVUkwsIG9iamVjdCBhc1xuICAvLyAgICBhcmd1bWVudHMuIFRoZSBzdXBwbGllZCBvYmplY3Qgd2lsbCBiZSB1c2VkIGFzIGRlZmF1bHQgdmFsdWVzIC8gZmFsbC1iYWNrXG4gIC8vICAgIGZvciByZWxhdGl2ZSBwYXRocy5cbiAgLy9cbiAgaWYgKCdvYmplY3QnICE9PSB0eXBlICYmICdzdHJpbmcnICE9PSB0eXBlKSB7XG4gICAgcGFyc2VyID0gbG9jYXRpb247XG4gICAgbG9jYXRpb24gPSBudWxsO1xuICB9XG5cbiAgaWYgKHBhcnNlciAmJiAnZnVuY3Rpb24nICE9PSB0eXBlb2YgcGFyc2VyKSBwYXJzZXIgPSBxcy5wYXJzZTtcblxuICBsb2NhdGlvbiA9IGxvbGNhdGlvbihsb2NhdGlvbik7XG5cbiAgLy9cbiAgLy8gRXh0cmFjdCBwcm90b2NvbCBpbmZvcm1hdGlvbiBiZWZvcmUgcnVubmluZyB0aGUgaW5zdHJ1Y3Rpb25zLlxuICAvL1xuICBleHRyYWN0ZWQgPSBleHRyYWN0UHJvdG9jb2woYWRkcmVzcyB8fCAnJywgbG9jYXRpb24pO1xuICByZWxhdGl2ZSA9ICFleHRyYWN0ZWQucHJvdG9jb2wgJiYgIWV4dHJhY3RlZC5zbGFzaGVzO1xuICB1cmwuc2xhc2hlcyA9IGV4dHJhY3RlZC5zbGFzaGVzIHx8IHJlbGF0aXZlICYmIGxvY2F0aW9uLnNsYXNoZXM7XG4gIHVybC5wcm90b2NvbCA9IGV4dHJhY3RlZC5wcm90b2NvbCB8fCBsb2NhdGlvbi5wcm90b2NvbCB8fCAnJztcbiAgYWRkcmVzcyA9IGV4dHJhY3RlZC5yZXN0O1xuXG4gIC8vXG4gIC8vIFdoZW4gdGhlIGF1dGhvcml0eSBjb21wb25lbnQgaXMgYWJzZW50IHRoZSBVUkwgc3RhcnRzIHdpdGggYSBwYXRoXG4gIC8vIGNvbXBvbmVudC5cbiAgLy9cbiAgaWYgKFxuICAgIGV4dHJhY3RlZC5wcm90b2NvbCA9PT0gJ2ZpbGU6JyAmJiAoXG4gICAgICBleHRyYWN0ZWQuc2xhc2hlc0NvdW50ICE9PSAyIHx8IHdpbmRvd3NEcml2ZUxldHRlci50ZXN0KGFkZHJlc3MpKSB8fFxuICAgICghZXh0cmFjdGVkLnNsYXNoZXMgJiZcbiAgICAgIChleHRyYWN0ZWQucHJvdG9jb2wgfHxcbiAgICAgICAgZXh0cmFjdGVkLnNsYXNoZXNDb3VudCA8IDIgfHxcbiAgICAgICAgIWlzU3BlY2lhbCh1cmwucHJvdG9jb2wpKSlcbiAgKSB7XG4gICAgaW5zdHJ1Y3Rpb25zWzNdID0gWy8oLiopLywgJ3BhdGhuYW1lJ107XG4gIH1cblxuICBmb3IgKDsgaSA8IGluc3RydWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgIGluc3RydWN0aW9uID0gaW5zdHJ1Y3Rpb25zW2ldO1xuXG4gICAgaWYgKHR5cGVvZiBpbnN0cnVjdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgYWRkcmVzcyA9IGluc3RydWN0aW9uKGFkZHJlc3MsIHVybCk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBwYXJzZSA9IGluc3RydWN0aW9uWzBdO1xuICAgIGtleSA9IGluc3RydWN0aW9uWzFdO1xuXG4gICAgaWYgKHBhcnNlICE9PSBwYXJzZSkge1xuICAgICAgdXJsW2tleV0gPSBhZGRyZXNzO1xuICAgIH0gZWxzZSBpZiAoJ3N0cmluZycgPT09IHR5cGVvZiBwYXJzZSkge1xuICAgICAgaW5kZXggPSBwYXJzZSA9PT0gJ0AnXG4gICAgICAgID8gYWRkcmVzcy5sYXN0SW5kZXhPZihwYXJzZSlcbiAgICAgICAgOiBhZGRyZXNzLmluZGV4T2YocGFyc2UpO1xuXG4gICAgICBpZiAofmluZGV4KSB7XG4gICAgICAgIGlmICgnbnVtYmVyJyA9PT0gdHlwZW9mIGluc3RydWN0aW9uWzJdKSB7XG4gICAgICAgICAgdXJsW2tleV0gPSBhZGRyZXNzLnNsaWNlKDAsIGluZGV4KTtcbiAgICAgICAgICBhZGRyZXNzID0gYWRkcmVzcy5zbGljZShpbmRleCArIGluc3RydWN0aW9uWzJdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB1cmxba2V5XSA9IGFkZHJlc3Muc2xpY2UoaW5kZXgpO1xuICAgICAgICAgIGFkZHJlc3MgPSBhZGRyZXNzLnNsaWNlKDAsIGluZGV4KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoKGluZGV4ID0gcGFyc2UuZXhlYyhhZGRyZXNzKSkpIHtcbiAgICAgIHVybFtrZXldID0gaW5kZXhbMV07XG4gICAgICBhZGRyZXNzID0gYWRkcmVzcy5zbGljZSgwLCBpbmRleC5pbmRleCk7XG4gICAgfVxuXG4gICAgdXJsW2tleV0gPSB1cmxba2V5XSB8fCAoXG4gICAgICByZWxhdGl2ZSAmJiBpbnN0cnVjdGlvblszXSA/IGxvY2F0aW9uW2tleV0gfHwgJycgOiAnJ1xuICAgICk7XG5cbiAgICAvL1xuICAgIC8vIEhvc3RuYW1lLCBob3N0IGFuZCBwcm90b2NvbCBzaG91bGQgYmUgbG93ZXJjYXNlZCBzbyB0aGV5IGNhbiBiZSB1c2VkIHRvXG4gICAgLy8gY3JlYXRlIGEgcHJvcGVyIGBvcmlnaW5gLlxuICAgIC8vXG4gICAgaWYgKGluc3RydWN0aW9uWzRdKSB1cmxba2V5XSA9IHVybFtrZXldLnRvTG93ZXJDYXNlKCk7XG4gIH1cblxuICAvL1xuICAvLyBBbHNvIHBhcnNlIHRoZSBzdXBwbGllZCBxdWVyeSBzdHJpbmcgaW4gdG8gYW4gb2JqZWN0LiBJZiB3ZSdyZSBzdXBwbGllZFxuICAvLyB3aXRoIGEgY3VzdG9tIHBhcnNlciBhcyBmdW5jdGlvbiB1c2UgdGhhdCBpbnN0ZWFkIG9mIHRoZSBkZWZhdWx0IGJ1aWxkLWluXG4gIC8vIHBhcnNlci5cbiAgLy9cbiAgaWYgKHBhcnNlcikgdXJsLnF1ZXJ5ID0gcGFyc2VyKHVybC5xdWVyeSk7XG5cbiAgLy9cbiAgLy8gSWYgdGhlIFVSTCBpcyByZWxhdGl2ZSwgcmVzb2x2ZSB0aGUgcGF0aG5hbWUgYWdhaW5zdCB0aGUgYmFzZSBVUkwuXG4gIC8vXG4gIGlmIChcbiAgICAgIHJlbGF0aXZlXG4gICAgJiYgbG9jYXRpb24uc2xhc2hlc1xuICAgICYmIHVybC5wYXRobmFtZS5jaGFyQXQoMCkgIT09ICcvJ1xuICAgICYmICh1cmwucGF0aG5hbWUgIT09ICcnIHx8IGxvY2F0aW9uLnBhdGhuYW1lICE9PSAnJylcbiAgKSB7XG4gICAgdXJsLnBhdGhuYW1lID0gcmVzb2x2ZSh1cmwucGF0aG5hbWUsIGxvY2F0aW9uLnBhdGhuYW1lKTtcbiAgfVxuXG4gIC8vXG4gIC8vIERlZmF1bHQgdG8gYSAvIGZvciBwYXRobmFtZSBpZiBub25lIGV4aXN0cy4gVGhpcyBub3JtYWxpemVzIHRoZSBVUkxcbiAgLy8gdG8gYWx3YXlzIGhhdmUgYSAvXG4gIC8vXG4gIGlmICh1cmwucGF0aG5hbWUuY2hhckF0KDApICE9PSAnLycgJiYgaXNTcGVjaWFsKHVybC5wcm90b2NvbCkpIHtcbiAgICB1cmwucGF0aG5hbWUgPSAnLycgKyB1cmwucGF0aG5hbWU7XG4gIH1cblxuICAvL1xuICAvLyBXZSBzaG91bGQgbm90IGFkZCBwb3J0IG51bWJlcnMgaWYgdGhleSBhcmUgYWxyZWFkeSB0aGUgZGVmYXVsdCBwb3J0IG51bWJlclxuICAvLyBmb3IgYSBnaXZlbiBwcm90b2NvbC4gQXMgdGhlIGhvc3QgYWxzbyBjb250YWlucyB0aGUgcG9ydCBudW1iZXIgd2UncmUgZ29pbmdcbiAgLy8gb3ZlcnJpZGUgaXQgd2l0aCB0aGUgaG9zdG5hbWUgd2hpY2ggY29udGFpbnMgbm8gcG9ydCBudW1iZXIuXG4gIC8vXG4gIGlmICghcmVxdWlyZWQodXJsLnBvcnQsIHVybC5wcm90b2NvbCkpIHtcbiAgICB1cmwuaG9zdCA9IHVybC5ob3N0bmFtZTtcbiAgICB1cmwucG9ydCA9ICcnO1xuICB9XG5cbiAgLy9cbiAgLy8gUGFyc2UgZG93biB0aGUgYGF1dGhgIGZvciB0aGUgdXNlcm5hbWUgYW5kIHBhc3N3b3JkLlxuICAvL1xuICB1cmwudXNlcm5hbWUgPSB1cmwucGFzc3dvcmQgPSAnJztcblxuICBpZiAodXJsLmF1dGgpIHtcbiAgICBpbmRleCA9IHVybC5hdXRoLmluZGV4T2YoJzonKTtcblxuICAgIGlmICh+aW5kZXgpIHtcbiAgICAgIHVybC51c2VybmFtZSA9IHVybC5hdXRoLnNsaWNlKDAsIGluZGV4KTtcbiAgICAgIHVybC51c2VybmFtZSA9IGVuY29kZVVSSUNvbXBvbmVudChkZWNvZGVVUklDb21wb25lbnQodXJsLnVzZXJuYW1lKSk7XG5cbiAgICAgIHVybC5wYXNzd29yZCA9IHVybC5hdXRoLnNsaWNlKGluZGV4ICsgMSk7XG4gICAgICB1cmwucGFzc3dvcmQgPSBlbmNvZGVVUklDb21wb25lbnQoZGVjb2RlVVJJQ29tcG9uZW50KHVybC5wYXNzd29yZCkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHVybC51c2VybmFtZSA9IGVuY29kZVVSSUNvbXBvbmVudChkZWNvZGVVUklDb21wb25lbnQodXJsLmF1dGgpKTtcbiAgICB9XG5cbiAgICB1cmwuYXV0aCA9IHVybC5wYXNzd29yZCA/IHVybC51c2VybmFtZSArJzonKyB1cmwucGFzc3dvcmQgOiB1cmwudXNlcm5hbWU7XG4gIH1cblxuICB1cmwub3JpZ2luID0gdXJsLnByb3RvY29sICE9PSAnZmlsZTonICYmIGlzU3BlY2lhbCh1cmwucHJvdG9jb2wpICYmIHVybC5ob3N0XG4gICAgPyB1cmwucHJvdG9jb2wgKycvLycrIHVybC5ob3N0XG4gICAgOiAnbnVsbCc7XG5cbiAgLy9cbiAgLy8gVGhlIGhyZWYgaXMganVzdCB0aGUgY29tcGlsZWQgcmVzdWx0LlxuICAvL1xuICB1cmwuaHJlZiA9IHVybC50b1N0cmluZygpO1xufVxuXG4vKipcbiAqIFRoaXMgaXMgY29udmVuaWVuY2UgbWV0aG9kIGZvciBjaGFuZ2luZyBwcm9wZXJ0aWVzIGluIHRoZSBVUkwgaW5zdGFuY2UgdG9cbiAqIGluc3VyZSB0aGF0IHRoZXkgYWxsIHByb3BhZ2F0ZSBjb3JyZWN0bHkuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHBhcnQgICAgICAgICAgUHJvcGVydHkgd2UgbmVlZCB0byBhZGp1c3QuXG4gKiBAcGFyYW0ge01peGVkfSB2YWx1ZSAgICAgICAgICBUaGUgbmV3bHkgYXNzaWduZWQgdmFsdWUuXG4gKiBAcGFyYW0ge0Jvb2xlYW58RnVuY3Rpb259IGZuICBXaGVuIHNldHRpbmcgdGhlIHF1ZXJ5LCBpdCB3aWxsIGJlIHRoZSBmdW5jdGlvblxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlZCB0byBwYXJzZSB0aGUgcXVlcnkuXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaGVuIHNldHRpbmcgdGhlIHByb3RvY29sLCBkb3VibGUgc2xhc2ggd2lsbCBiZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlZCBmcm9tIHRoZSBmaW5hbCB1cmwgaWYgaXQgaXMgdHJ1ZS5cbiAqIEByZXR1cm5zIHtVUkx9IFVSTCBpbnN0YW5jZSBmb3IgY2hhaW5pbmcuXG4gKiBAcHVibGljXG4gKi9cbmZ1bmN0aW9uIHNldChwYXJ0LCB2YWx1ZSwgZm4pIHtcbiAgdmFyIHVybCA9IHRoaXM7XG5cbiAgc3dpdGNoIChwYXJ0KSB7XG4gICAgY2FzZSAncXVlcnknOlxuICAgICAgaWYgKCdzdHJpbmcnID09PSB0eXBlb2YgdmFsdWUgJiYgdmFsdWUubGVuZ3RoKSB7XG4gICAgICAgIHZhbHVlID0gKGZuIHx8IHFzLnBhcnNlKSh2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIHVybFtwYXJ0XSA9IHZhbHVlO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdwb3J0JzpcbiAgICAgIHVybFtwYXJ0XSA9IHZhbHVlO1xuXG4gICAgICBpZiAoIXJlcXVpcmVkKHZhbHVlLCB1cmwucHJvdG9jb2wpKSB7XG4gICAgICAgIHVybC5ob3N0ID0gdXJsLmhvc3RuYW1lO1xuICAgICAgICB1cmxbcGFydF0gPSAnJztcbiAgICAgIH0gZWxzZSBpZiAodmFsdWUpIHtcbiAgICAgICAgdXJsLmhvc3QgPSB1cmwuaG9zdG5hbWUgKyc6JysgdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnaG9zdG5hbWUnOlxuICAgICAgdXJsW3BhcnRdID0gdmFsdWU7XG5cbiAgICAgIGlmICh1cmwucG9ydCkgdmFsdWUgKz0gJzonKyB1cmwucG9ydDtcbiAgICAgIHVybC5ob3N0ID0gdmFsdWU7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ2hvc3QnOlxuICAgICAgdXJsW3BhcnRdID0gdmFsdWU7XG5cbiAgICAgIGlmIChwb3J0LnRlc3QodmFsdWUpKSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWUuc3BsaXQoJzonKTtcbiAgICAgICAgdXJsLnBvcnQgPSB2YWx1ZS5wb3AoKTtcbiAgICAgICAgdXJsLmhvc3RuYW1lID0gdmFsdWUuam9pbignOicpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdXJsLmhvc3RuYW1lID0gdmFsdWU7XG4gICAgICAgIHVybC5wb3J0ID0gJyc7XG4gICAgICB9XG5cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAncHJvdG9jb2wnOlxuICAgICAgdXJsLnByb3RvY29sID0gdmFsdWUudG9Mb3dlckNhc2UoKTtcbiAgICAgIHVybC5zbGFzaGVzID0gIWZuO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdwYXRobmFtZSc6XG4gICAgY2FzZSAnaGFzaCc6XG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgdmFyIGNoYXIgPSBwYXJ0ID09PSAncGF0aG5hbWUnID8gJy8nIDogJyMnO1xuICAgICAgICB1cmxbcGFydF0gPSB2YWx1ZS5jaGFyQXQoMCkgIT09IGNoYXIgPyBjaGFyICsgdmFsdWUgOiB2YWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHVybFtwYXJ0XSA9IHZhbHVlO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICd1c2VybmFtZSc6XG4gICAgY2FzZSAncGFzc3dvcmQnOlxuICAgICAgdXJsW3BhcnRdID0gZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnYXV0aCc6XG4gICAgICB2YXIgaW5kZXggPSB2YWx1ZS5pbmRleE9mKCc6Jyk7XG5cbiAgICAgIGlmICh+aW5kZXgpIHtcbiAgICAgICAgdXJsLnVzZXJuYW1lID0gdmFsdWUuc2xpY2UoMCwgaW5kZXgpO1xuICAgICAgICB1cmwudXNlcm5hbWUgPSBlbmNvZGVVUklDb21wb25lbnQoZGVjb2RlVVJJQ29tcG9uZW50KHVybC51c2VybmFtZSkpO1xuXG4gICAgICAgIHVybC5wYXNzd29yZCA9IHZhbHVlLnNsaWNlKGluZGV4ICsgMSk7XG4gICAgICAgIHVybC5wYXNzd29yZCA9IGVuY29kZVVSSUNvbXBvbmVudChkZWNvZGVVUklDb21wb25lbnQodXJsLnBhc3N3b3JkKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB1cmwudXNlcm5hbWUgPSBlbmNvZGVVUklDb21wb25lbnQoZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlKSk7XG4gICAgICB9XG4gIH1cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHJ1bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGlucyA9IHJ1bGVzW2ldO1xuXG4gICAgaWYgKGluc1s0XSkgdXJsW2luc1sxXV0gPSB1cmxbaW5zWzFdXS50b0xvd2VyQ2FzZSgpO1xuICB9XG5cbiAgdXJsLmF1dGggPSB1cmwucGFzc3dvcmQgPyB1cmwudXNlcm5hbWUgKyc6JysgdXJsLnBhc3N3b3JkIDogdXJsLnVzZXJuYW1lO1xuXG4gIHVybC5vcmlnaW4gPSB1cmwucHJvdG9jb2wgIT09ICdmaWxlOicgJiYgaXNTcGVjaWFsKHVybC5wcm90b2NvbCkgJiYgdXJsLmhvc3RcbiAgICA/IHVybC5wcm90b2NvbCArJy8vJysgdXJsLmhvc3RcbiAgICA6ICdudWxsJztcblxuICB1cmwuaHJlZiA9IHVybC50b1N0cmluZygpO1xuXG4gIHJldHVybiB1cmw7XG59XG5cbi8qKlxuICogVHJhbnNmb3JtIHRoZSBwcm9wZXJ0aWVzIGJhY2sgaW4gdG8gYSB2YWxpZCBhbmQgZnVsbCBVUkwgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN0cmluZ2lmeSBPcHRpb25hbCBxdWVyeSBzdHJpbmdpZnkgZnVuY3Rpb24uXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBDb21waWxlZCB2ZXJzaW9uIG9mIHRoZSBVUkwuXG4gKiBAcHVibGljXG4gKi9cbmZ1bmN0aW9uIHRvU3RyaW5nKHN0cmluZ2lmeSkge1xuICBpZiAoIXN0cmluZ2lmeSB8fCAnZnVuY3Rpb24nICE9PSB0eXBlb2Ygc3RyaW5naWZ5KSBzdHJpbmdpZnkgPSBxcy5zdHJpbmdpZnk7XG5cbiAgdmFyIHF1ZXJ5XG4gICAgLCB1cmwgPSB0aGlzXG4gICAgLCBob3N0ID0gdXJsLmhvc3RcbiAgICAsIHByb3RvY29sID0gdXJsLnByb3RvY29sO1xuXG4gIGlmIChwcm90b2NvbCAmJiBwcm90b2NvbC5jaGFyQXQocHJvdG9jb2wubGVuZ3RoIC0gMSkgIT09ICc6JykgcHJvdG9jb2wgKz0gJzonO1xuXG4gIHZhciByZXN1bHQgPVxuICAgIHByb3RvY29sICtcbiAgICAoKHVybC5wcm90b2NvbCAmJiB1cmwuc2xhc2hlcykgfHwgaXNTcGVjaWFsKHVybC5wcm90b2NvbCkgPyAnLy8nIDogJycpO1xuXG4gIGlmICh1cmwudXNlcm5hbWUpIHtcbiAgICByZXN1bHQgKz0gdXJsLnVzZXJuYW1lO1xuICAgIGlmICh1cmwucGFzc3dvcmQpIHJlc3VsdCArPSAnOicrIHVybC5wYXNzd29yZDtcbiAgICByZXN1bHQgKz0gJ0AnO1xuICB9IGVsc2UgaWYgKHVybC5wYXNzd29yZCkge1xuICAgIHJlc3VsdCArPSAnOicrIHVybC5wYXNzd29yZDtcbiAgICByZXN1bHQgKz0gJ0AnO1xuICB9IGVsc2UgaWYgKFxuICAgIHVybC5wcm90b2NvbCAhPT0gJ2ZpbGU6JyAmJlxuICAgIGlzU3BlY2lhbCh1cmwucHJvdG9jb2wpICYmXG4gICAgIWhvc3QgJiZcbiAgICB1cmwucGF0aG5hbWUgIT09ICcvJ1xuICApIHtcbiAgICAvL1xuICAgIC8vIEFkZCBiYWNrIHRoZSBlbXB0eSB1c2VyaW5mbywgb3RoZXJ3aXNlIHRoZSBvcmlnaW5hbCBpbnZhbGlkIFVSTFxuICAgIC8vIG1pZ2h0IGJlIHRyYW5zZm9ybWVkIGludG8gYSB2YWxpZCBvbmUgd2l0aCBgdXJsLnBhdGhuYW1lYCBhcyBob3N0LlxuICAgIC8vXG4gICAgcmVzdWx0ICs9ICdAJztcbiAgfVxuXG4gIC8vXG4gIC8vIFRyYWlsaW5nIGNvbG9uIGlzIHJlbW92ZWQgZnJvbSBgdXJsLmhvc3RgIHdoZW4gaXQgaXMgcGFyc2VkLiBJZiBpdCBzdGlsbFxuICAvLyBlbmRzIHdpdGggYSBjb2xvbiwgdGhlbiBhZGQgYmFjayB0aGUgdHJhaWxpbmcgY29sb24gdGhhdCB3YXMgcmVtb3ZlZC4gVGhpc1xuICAvLyBwcmV2ZW50cyBhbiBpbnZhbGlkIFVSTCBmcm9tIGJlaW5nIHRyYW5zZm9ybWVkIGludG8gYSB2YWxpZCBvbmUuXG4gIC8vXG4gIGlmIChob3N0W2hvc3QubGVuZ3RoIC0gMV0gPT09ICc6JyB8fCAocG9ydC50ZXN0KHVybC5ob3N0bmFtZSkgJiYgIXVybC5wb3J0KSkge1xuICAgIGhvc3QgKz0gJzonO1xuICB9XG5cbiAgcmVzdWx0ICs9IGhvc3QgKyB1cmwucGF0aG5hbWU7XG5cbiAgcXVlcnkgPSAnb2JqZWN0JyA9PT0gdHlwZW9mIHVybC5xdWVyeSA/IHN0cmluZ2lmeSh1cmwucXVlcnkpIDogdXJsLnF1ZXJ5O1xuICBpZiAocXVlcnkpIHJlc3VsdCArPSAnPycgIT09IHF1ZXJ5LmNoYXJBdCgwKSA/ICc/JysgcXVlcnkgOiBxdWVyeTtcblxuICBpZiAodXJsLmhhc2gpIHJlc3VsdCArPSB1cmwuaGFzaDtcblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5VcmwucHJvdG90eXBlID0geyBzZXQ6IHNldCwgdG9TdHJpbmc6IHRvU3RyaW5nIH07XG5cbi8vXG4vLyBFeHBvc2UgdGhlIFVSTCBwYXJzZXIgYW5kIHNvbWUgYWRkaXRpb25hbCBwcm9wZXJ0aWVzIHRoYXQgbWlnaHQgYmUgdXNlZnVsIGZvclxuLy8gb3RoZXJzIG9yIHRlc3RpbmcuXG4vL1xuVXJsLmV4dHJhY3RQcm90b2NvbCA9IGV4dHJhY3RQcm90b2NvbDtcblVybC5sb2NhdGlvbiA9IGxvbGNhdGlvbjtcblVybC50cmltTGVmdCA9IHRyaW1MZWZ0O1xuVXJsLnFzID0gcXM7XG5cbm1vZHVsZS5leHBvcnRzID0gVXJsO1xuIl19
