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
                if (text.length !== 0)
                    _this.block();
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
                if (event.inputType[0] === 'i')
                    if (event.data === ' ')
                        _this.table.pushAction([Action_1.ActionType.writeWithSpace, _this.x, _this.y]);
                    else
                        _this.table.pushAction([Action_1.ActionType.write, _this.x, _this.y]);
                else if (event.inputType[0] === 'd')
                    _this.table.pushAction([Action_1.ActionType.delete, _this.x, _this.y, event.dataTransfer.getData('text/html')]);
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
var Table = /** @class */ (function () {
    function Table(_store) {
        var _this = this;
        this._store = _store;
        this.$tableContainer = $('main');
        this.cells = [];
        this.selectedCells = [];
        this.actions = [];
        this._$popover = $('#popover');
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
        if (lastAction != null && lastAction[0] === Action_1.ActionType.write && action[0] <= Action_1.ActionType.writeWithSpace
            && lastAction[1] === action[1] && lastAction[2] === action[2])
            this.actions.pop();
        this.actions.push(action);
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
},{"../cell/Cell":1,"../utilities/Action":6,"./TableMod":4}],4:[function(require,module,exports){
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
    decorations: [
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
        table = new Table_1.Table(exports.store);
    });
});
function loadTable() {
    var chatId = parseInt(getParam('id'));
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
    var chatId = parseInt(getParam('id'));
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
function getParam(name) {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}
},{"../../util/HttpClient":8,"../../util/request/IsLoggedInRequest":9,"../../util/request/TableInfoRequest":10,"../../util/request/TableMessagesRequest":11,"./Table":3}],6:[function(require,module,exports){
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
},{"../HttpClient":8}],10:[function(require,module,exports){
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
},{"../HttpClient":8}],11:[function(require,module,exports){
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
        this.body = body;
        this.endpoint = '/message/list';
        this.headers = {
            "Content-Type": "application/json"
        };
        this.methodType = HttpClient_1.MethodType.POST;
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
},{"../HttpClient":8}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJUU2NyaXB0L3RhYmxlcGFnZS9jZWxsL0NlbGwudHMiLCJUU2NyaXB0L3RhYmxlcGFnZS9jZWxsL0NlbGxEcmF3ZXIudHMiLCJUU2NyaXB0L3RhYmxlcGFnZS9tYWluL1RhYmxlLnRzIiwiVFNjcmlwdC90YWJsZXBhZ2UvbWFpbi9UYWJsZU1vZC50cyIsIlRTY3JpcHQvdGFibGVwYWdlL21haW4vVGFibGVQYWdlLnRzIiwiVFNjcmlwdC90YWJsZXBhZ2UvdXRpbGl0aWVzL0FjdGlvbi50cyIsIlRTY3JpcHQvdGFibGVwYWdlL3V0aWxpdGllcy9EaXJlY3Rpb24udHMiLCJUU2NyaXB0L3V0aWwvSHR0cENsaWVudC50cyIsIlRTY3JpcHQvdXRpbC9yZXF1ZXN0L0lzTG9nZ2VkSW5SZXF1ZXN0LnRzIiwiVFNjcmlwdC91dGlsL3JlcXVlc3QvVGFibGVJbmZvUmVxdWVzdC50cyIsIlRTY3JpcHQvdXRpbC9yZXF1ZXN0L1RhYmxlTWVzc2FnZXNSZXF1ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FDQUEsMkNBQXdDO0FBRXhDLDZDQUEwQztBQUMxQyxvREFBaUQ7QUFDakQsOENBQStDO0FBSy9DO0lBTUksY0FDb0IsQ0FBUyxFQUNULENBQVMsRUFDekIsSUFBaUIsRUFDRCxLQUFZO1FBSFosTUFBQyxHQUFELENBQUMsQ0FBUTtRQUNULE1BQUMsR0FBRCxDQUFDLENBQVE7UUFFVCxVQUFLLEdBQUwsS0FBSyxDQUFPO1FBRTVCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSx1QkFBVSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQsc0JBQVcsMkJBQVM7YUFBcEI7WUFBQSxpQkFVQztZQVRHLE9BQU8sQ0FBQyxVQUFBLEtBQUs7Z0JBQ1QsSUFBSSxLQUFLLENBQUMsT0FBTztvQkFBRSxPQUFPO2dCQUMxQixJQUFJLEtBQUssQ0FBQyxR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SUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7UUFDeEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMscUJBQVMsQ0FBQyxHQUFHLEVBQUUscUJBQVMsQ0FBQyxNQUFNLEVBQUUscUJBQVMsQ0FBQyxJQUFJLEVBQUUscUJBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUN4RixJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFJLElBQUssT0FBQSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQTVDLENBQTRDLENBQUMsSUFBSSxJQUFJO1lBQzVFLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLHFCQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUMsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSSxJQUFLLE9BQUEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUE1QyxDQUE0QyxDQUFDLElBQUksSUFBSTtZQUM1RSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxxQkFBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdDLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFDLElBQUksSUFBSyxPQUFBLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUksQ0FBQyxDQUFDLENBQUMsRUFBNUMsQ0FBNEMsQ0FBQyxJQUFJLElBQUk7WUFDNUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMscUJBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFJ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aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCB7Q2VsbERyYXdlcn0gZnJvbSBcIi4vQ2VsbERyYXdlclwiO1xyXG5pbXBvcnQge1RhYmxlfSBmcm9tIFwiLi4vbWFpbi9UYWJsZVwiO1xyXG5pbXBvcnQge1RhYmxlTW9kfSBmcm9tIFwiLi4vbWFpbi9UYWJsZU1vZFwiO1xyXG5pbXBvcnQge0RpcmVjdGlvbn0gZnJvbSBcIi4uL3V0aWxpdGllcy9EaXJlY3Rpb25cIjtcclxuaW1wb3J0IHtBY3Rpb25UeXBlfSBmcm9tIFwiLi4vdXRpbGl0aWVzL0FjdGlvblwiO1xyXG5pbXBvcnQge2Nzc30gZnJvbSBcImpxdWVyeVwiO1xyXG5cclxudHlwZSBvblRyaWdnZXIgPSAoZXZlbnQ/OiBhbnkpID0+IHZvaWQgfCBib29sZWFuXHJcblxyXG5leHBvcnQgY2xhc3MgQ2VsbCB7XHJcbiAgICBwcml2YXRlIGRyYXdlcjogQ2VsbERyYXdlcjtcclxuICAgIHByaXZhdGUgX2ZyaWVuZHM6IENlbGxbXTtcclxuICAgIHByaXZhdGUgX2Jsb2NrZWQ6IGJvb2xlYW47XHJcbiAgICBwcml2YXRlIF9zZWxlY3RlZDogYm9vbGVhbjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwdWJsaWMgcmVhZG9ubHkgeDogbnVtYmVyLFxyXG4gICAgICAgIHB1YmxpYyByZWFkb25seSB5OiBudW1iZXIsXHJcbiAgICAgICAgJHJvdzogSFRNTEVsZW1lbnQsXHJcbiAgICAgICAgcHVibGljIHJlYWRvbmx5IHRhYmxlOiBUYWJsZVxyXG4gICAgKSB7XHJcbiAgICAgICAgdGhpcy5kcmF3ZXIgPSBuZXcgQ2VsbERyYXdlcigkcm93LCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG9uS2V5ZG93bigpOiBvblRyaWdnZXIge1xyXG4gICAgICAgIHJldHVybiAoZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXZlbnQuY3RybEtleSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAoZXZlbnQuc2hpZnRLZXkpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKGV2ZW50LmNvZGUgPT09ICdBcnJvd1VwJykgdGhpcy50YWJsZS5nZXRDZWxsKHRoaXMueCAtIDEsIHRoaXMueSkuZm9jdXMoKTtcclxuICAgICAgICAgICAgaWYgKGV2ZW50LmNvZGUgPT09ICdBcnJvd0Rvd24nIHx8IGV2ZW50LmNvZGUgPT09ICdFbnRlcicpIHRoaXMudGFibGUuZ2V0Q2VsbCh0aGlzLnggKyAxLCB0aGlzLnkpLmZvY3VzKCk7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pc0VtcHR5KCkpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKGV2ZW50LmNvZGUgPT09ICdBcnJvd0xlZnQnKSB0aGlzLnRhYmxlLmdldENlbGwodGhpcy54LCB0aGlzLnkgLSAxKS5mb2N1cygpO1xyXG4gICAgICAgICAgICBpZiAoZXZlbnQuY29kZSA9PT0gJ0Fycm93UmlnaHQnKSB0aGlzLnRhYmxlLmdldENlbGwodGhpcy54LCB0aGlzLnkgKyAxKS5mb2N1cygpO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBvbk1vdXNlZW50ZXIoKTogb25UcmlnZ2VyIHtcclxuICAgICAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy50YWJsZS5tb2QgIT09IFRhYmxlTW9kLnNlbGVjdGluZykgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdFdpdGhGcmllbmRzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgb25Nb3VzZWRvd24oKTogb25UcmlnZ2VyIHtcclxuICAgICAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnRhYmxlLm1vZCA9IFRhYmxlTW9kLnNlbGVjdGluZztcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RXaXRoRnJpZW5kcygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG9uRG91YmxlQ2xpY2soKTogb25UcmlnZ2VyIHtcclxuICAgICAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmZvY3VzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgb25CbHVyKCk6IG9uVHJpZ2dlciB7XHJcbiAgICAgICAgcmV0dXJuICh0ZXh0OiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgaWYodGV4dC5sZW5ndGggIT09IDApXHJcbiAgICAgICAgICAgICAgICB0aGlzLmJsb2NrKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgb25JbnB1dCgpOiBvblRyaWdnZXIge1xyXG4gICAgICAgIHJldHVybiAoZXZlbnQ6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhldmVudC5pbnB1dFR5cGUpO1xyXG4gICAgICAgICAgICBpZihldmVudC5pbnB1dFR5cGVbMF0gPT09ICdpJylcclxuICAgICAgICAgICAgICAgIGlmKGV2ZW50LmRhdGEgPT09ICcgJykgdGhpcy50YWJsZS5wdXNoQWN0aW9uKFtBY3Rpb25UeXBlLndyaXRlV2l0aFNwYWNlLCB0aGlzLngsIHRoaXMueV0pO1xyXG4gICAgICAgICAgICAgICAgZWxzZSB0aGlzLnRhYmxlLnB1c2hBY3Rpb24oW0FjdGlvblR5cGUud3JpdGUsIHRoaXMueCwgdGhpcy55XSk7XHJcbiAgICAgICAgICAgIGVsc2UgaWYoZXZlbnQuaW5wdXRUeXBlWzBdID09PSAnZCcpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRhYmxlLnB1c2hBY3Rpb24oW0FjdGlvblR5cGUuZGVsZXRlLCB0aGlzLngsIHRoaXMueSwgZXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoJ3RleHQvaHRtbCcpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgb25Db250ZXh0bWVudSgpOiBvblRyaWdnZXIge1xyXG4gICAgICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudGFibGUuc2hvd1BvcG92ZXIodGhpcy54LCB0aGlzLnksIHRoaXMpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBmb2N1cygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmRyYXdlci5ibG9ja05vKCk7XHJcbiAgICAgICAgdGhpcy5kcmF3ZXIuZm9jdXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VsZWN0V2l0aEZyaWVuZHMoeWVzOiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLl9mcmllbmRzID09IG51bGwgfHwgdGhpcy5fZnJpZW5kcy5sZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgIHllcyA/IHRoaXMuc2VsZWN0KCkgOiB0aGlzLnNlbGVjdE5vbmUoKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuX2ZyaWVuZHMuZm9yRWFjaCgoZnJpZW5kKSA9PiB5ZXMgPyBmcmllbmQuc2VsZWN0KCkgOiBmcmllbmQuc2VsZWN0Tm9uZSgpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0RnJpZW5kcyhmcmllbmRzOiBDZWxsW10pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9mcmllbmRzID0gZnJpZW5kcztcclxuICAgICAgICB0aGlzLmRyYXdlci5hZGRCb3JkZXJzKERpcmVjdGlvbi50b3AsIERpcmVjdGlvbi5ib3R0b20sIERpcmVjdGlvbi5sZWZ0LCBEaXJlY3Rpb24ucmlnaHQpXHJcbiAgICAgICAgaWYgKGZyaWVuZHMuZmluZCgoY2VsbCkgPT4gKGNlbGwueCA9PT0gdGhpcy54ICYmIGNlbGwueSA9PT0gdGhpcy55ICsgMSkpICE9IG51bGwpXHJcbiAgICAgICAgICAgIHRoaXMuZHJhd2VyLnJlbW92ZUJvcmRlcihEaXJlY3Rpb24ucmlnaHQpO1xyXG4gICAgICAgIGlmIChmcmllbmRzLmZpbmQoKGNlbGwpID0+IChjZWxsLnggPT09IHRoaXMueCAmJiBjZWxsLnkgPT09IHRoaXMueSAtIDEpKSAhPSBudWxsKVxyXG4gICAgICAgICAgICB0aGlzLmRyYXdlci5yZW1vdmVCb3JkZXIoRGlyZWN0aW9uLmxlZnQpO1xyXG4gICAgICAgIGlmIChmcmllbmRzLmZpbmQoKGNlbGwpID0+IChjZWxsLnggPT09IHRoaXMueCAtIDEgJiYgY2VsbC55ID09PSB0aGlzLnkpKSAhPSBudWxsKVxyXG4gICAgICAgICAgICB0aGlzLmRyYXdlci5yZW1vdmVCb3JkZXIoRGlyZWN0aW9uLnRvcCk7XHJcbiAgICAgICAgaWYgKGZyaWVuZHMuZmluZCgoY2VsbCkgPT4gKGNlbGwueCA9PT0gdGhpcy54ICsgMSAmJiBjZWxsLnkgPT09IHRoaXMueSkpICE9IG51bGwpXHJcbiAgICAgICAgICAgIHRoaXMuZHJhd2VyLnJlbW92ZUJvcmRlcihEaXJlY3Rpb24uYm90dG9tKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VsZWN0KCk6IHZvaWQge1xyXG4gICAgICAgIGlmKHRoaXMuX3NlbGVjdGVkKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMudGFibGUuc2VsZWN0ZWRDZWxscy5wdXNoKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuZHJhd2VyLnNlbGVjdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZWxlY3ROb25lKCk6IHZvaWQge1xyXG4gICAgICAgIGlmKCF0aGlzLl9zZWxlY3RlZCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5kcmF3ZXIuc2VsZWN0Tm9uZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpc0VtcHR5KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRyYXdlci5pc0VtcHR5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBibG9jaygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmRyYXdlci5ibG9jaygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYmxvY2tObygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmRyYXdlci5ibG9ja05vKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVuZG9Xcml0ZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmRyYXdlci51bmRvV3JpdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdW5kb0RlbGV0ZSh0ZXh0OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmRyYXdlci51bmRvRGVsZXRlKHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGREZWNvcihjc3NTdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmRyYXdlci5hZGREZWNvcihjc3NTdHJpbmcpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGREZWNvcldpdGhGcmllbmRzKGNzc1N0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLl9mcmllbmRzID09IG51bGwgfHwgdGhpcy5fZnJpZW5kcy5sZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgIHRoaXMuYWRkRGVjb3IoY3NzU3RyaW5nKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuX2ZyaWVuZHMuZm9yRWFjaCgoZnJpZW5kKSA9PiBmcmllbmQuYWRkRGVjb3IoY3NzU3RyaW5nKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZE1lc3NhZ2UodGV4dCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZHJhd2VyLmFkZE1lc3NhZ2UodGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldENzc1N0eWxlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZHJhd2VyLmdldENzc1N0eWxlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBzY3JlZW5YKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZHJhd2VyLnNjcmVlblg7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBzY3JlZW5ZKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZHJhd2VyLnNjcmVlblk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXBhcmF0ZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnNldEZyaWVuZHMoW3RoaXNdKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VwYXJhdGVXaXRob3V0RnJpZW5kcygpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5fZnJpZW5kcyAhPSBudWxsKXtcclxuICAgICAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5fZnJpZW5kcy5pbmRleE9mKHRoaXMpO1xyXG4gICAgICAgICAgICB0aGlzLl9mcmllbmRzLnNwbGljZShpbmRleCwgaW5kZXgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNlcGFyYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNlcGFyYXRlV2l0aEZyaWVuZHMoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2ZyaWVuZHMgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgIGxldCBjbG9uZSA9IHRoaXMuX2ZyaWVuZHM7XHJcbiAgICAgICAgY2xvbmUuZm9yRWFjaCgoZWxlbSkgPT4gZWxlbS5zZXBhcmF0ZSgpKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7Q2VsbH0gZnJvbSBcIi4vQ2VsbFwiO1xyXG5pbXBvcnQge3N0b3JlfSBmcm9tIFwiLi4vbWFpbi9UYWJsZVBhZ2VcIjtcclxuaW1wb3J0IHtEaXJlY3Rpb259IGZyb20gXCIuLi91dGlsaXRpZXMvRGlyZWN0aW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ2VsbERyYXdlciB7XHJcbiAgICBwcml2YXRlICRjZWxsOiBIVE1MRWxlbWVudDtcclxuICAgIHByaXZhdGUgJHNwYW46IEhUTUxFbGVtZW50O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICRyb3c6IEhUTUxFbGVtZW50LFxyXG4gICAgICAgIHByaXZhdGUga2VlcGVyOiBDZWxsXHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLmluaXQoJHJvdyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0KCRyb3cpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLiRzcGFuID0gdGhpcy4kY3JlYXRlU3BhbigpO1xyXG4gICAgICAgIHRoaXMuJGNlbGwgPSB0aGlzLiRjcmVhdGVDZWxsKHRoaXMuJHNwYW4pO1xyXG4gICAgICAgICRyb3cuYXBwZW5kKHRoaXMuJGNlbGwpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgJGNyZWF0ZVNwYW4oKTogSFRNTEVsZW1lbnQge1xyXG4gICAgICAgIGxldCAkc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICAkc3Bhbi5jbGFzc05hbWUgPSAndGV4dC1ub3dyYXAgbm8tc2hvdy1mb2N1cyc7XHJcbiAgICAgICAgJHNwYW4ub25rZXlkb3duID0gKGV2ZW50KSA9PiB0aGlzLmtlZXBlci5vbktleWRvd24oZXZlbnQpO1xyXG4gICAgICAgICRzcGFuLm9uYmx1ciA9ICgpID0+IHRoaXMua2VlcGVyLm9uQmx1cigkc3Bhbi50ZXh0Q29udGVudCk7XHJcbiAgICAgICAgJHNwYW4ub25pbnB1dCA9IChldmVudCkgPT4gdGhpcy5rZWVwZXIub25JbnB1dChldmVudCk7XHJcbiAgICAgICAgJHNwYW4uY29udGVudEVkaXRhYmxlID0gJ3RydWUnO1xyXG4gICAgICAgIHJldHVybiAkc3BhbjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlICRjcmVhdGVDZWxsKCRzcGFuOiBIVE1MRWxlbWVudCk6IEhUTUxFbGVtZW50IHtcclxuICAgICAgICBsZXQgJGNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAkY2VsbC5jbGFzc05hbWUgPSAnY29tZ3JpZC1jZWxsIGJvcmRlci10b3AgYm9yZGVyLWxlZnQgYm9yZGVyLXJpZ2h0IGJvcmRlci1ib3R0b20gdGV4dC1kYXJrJztcclxuICAgICAgICAkY2VsbC5vbm1vdXNlZW50ZXIgPSAoKSA9PiB0aGlzLmtlZXBlci5vbk1vdXNlZW50ZXIoKTtcclxuICAgICAgICAkY2VsbC5vbm1vdXNlZG93biA9ICgpID0+IHRoaXMua2VlcGVyLm9uTW91c2Vkb3duKCk7XHJcbiAgICAgICAgJGNlbGwub25kcmFnc3RhcnQgPSAoKSA9PiBmYWxzZTtcclxuICAgICAgICAkY2VsbC5vbmNvbnRleHRtZW51ID0gKCkgPT4gdGhpcy5rZWVwZXIub25Db250ZXh0bWVudSgpO1xyXG4gICAgICAgICRjZWxsLmFwcGVuZCgkc3Bhbik7XHJcbiAgICAgICAgcmV0dXJuICRjZWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBmb2N1cygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLiRzcGFuLmZvY3VzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNlbGVjdCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLiRjZWxsLmNsYXNzTGlzdC5yZW1vdmUoLi4uc3RvcmUubm9TZWxlY3RlZENsYXNzZXMpO1xyXG4gICAgICAgIHRoaXMuJGNlbGwuY2xhc3NMaXN0LmFkZCguLi5zdG9yZS5zZWxlY3RlZENsYXNzZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZWxlY3ROb25lKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuJGNlbGwuY2xhc3NMaXN0LnJlbW92ZSguLi5zdG9yZS5zZWxlY3RlZENsYXNzZXMpO1xyXG4gICAgICAgIHRoaXMuJGNlbGwuY2xhc3NMaXN0LmFkZCguLi5zdG9yZS5ub1NlbGVjdGVkQ2xhc3Nlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGlzRW1wdHkoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuJHNwYW4udGV4dENvbnRlbnQubGVuZ3RoID09PSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmVCb3JkZXJzKC4uLmRpcmVjdGlvbnM6IERpcmVjdGlvbltdKTogdm9pZCB7XHJcbiAgICAgICAgZGlyZWN0aW9ucy5mb3JFYWNoKChkaXJlY3Rpb24pID0+IHRoaXMucmVtb3ZlQm9yZGVyKGRpcmVjdGlvbikpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmVCb3JkZXIoZGlyZWN0aW9uOiBEaXJlY3Rpb24pOiB2b2lkIHtcclxuICAgICAgICBzd2l0Y2ggKGRpcmVjdGlvbikge1xyXG4gICAgICAgICAgICBjYXNlIERpcmVjdGlvbi5ib3R0b206XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRjZWxsLmNsYXNzTGlzdC5yZW1vdmUoJ2JvcmRlci1ib3R0b20nKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24ubGVmdDpcclxuICAgICAgICAgICAgICAgIHRoaXMuJGNlbGwuY2xhc3NMaXN0LnJlbW92ZSgnYm9yZGVyLWxlZnQnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24ucmlnaHQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRjZWxsLmNsYXNzTGlzdC5yZW1vdmUoJ2JvcmRlci1yaWdodCcpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBjYXNlIERpcmVjdGlvbi50b3A6XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRjZWxsLmNsYXNzTGlzdC5yZW1vdmUoJ2JvcmRlci10b3AnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZEJvcmRlcnMoLi4uZGlyZWN0aW9uczogRGlyZWN0aW9uW10pOiB2b2lkIHtcclxuICAgICAgICBkaXJlY3Rpb25zLmZvckVhY2goKGRpcmVjdGlvbikgPT4gdGhpcy5hZGRCb3JkZXIoZGlyZWN0aW9uKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZEJvcmRlcihkaXJlY3Rpb246IERpcmVjdGlvbik6IHZvaWQge1xyXG4gICAgICAgIHN3aXRjaCAoZGlyZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLmJvdHRvbTpcclxuICAgICAgICAgICAgICAgIHRoaXMuJGNlbGwuY2xhc3NMaXN0LmFkZCgnYm9yZGVyLWJvdHRvbScpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBjYXNlIERpcmVjdGlvbi5sZWZ0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy4kY2VsbC5jbGFzc0xpc3QuYWRkKCdib3JkZXItbGVmdCcpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBjYXNlIERpcmVjdGlvbi5yaWdodDpcclxuICAgICAgICAgICAgICAgIHRoaXMuJGNlbGwuY2xhc3NMaXN0LmFkZCgnYm9yZGVyLXJpZ2h0Jyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLnRvcDpcclxuICAgICAgICAgICAgICAgIHRoaXMuJGNlbGwuY2xhc3NMaXN0LmFkZCgnYm9yZGVyLXRvcCcpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYmxvY2soKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy4kc3Bhbi5jb250ZW50RWRpdGFibGUgPSAnZmFsc2UnO1xyXG4gICAgICAgIHRoaXMuJHNwYW4uY2xhc3NMaXN0LmFkZCgndXNlci1zZWxlY3Qtbm9uZScpO1xyXG4gICAgICAgIHRoaXMuJGNlbGwub25kYmxjbGljayA9ICgpID0+IHRoaXMua2VlcGVyLm9uRG91YmxlQ2xpY2soKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYmxvY2tObygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLiRzcGFuLmNvbnRlbnRFZGl0YWJsZSA9ICd0cnVlJztcclxuICAgICAgICB0aGlzLiRzcGFuLmNsYXNzTGlzdC5yZW1vdmUoJ3VzZXItc2VsZWN0LW5vbmUnKTtcclxuICAgICAgICB0aGlzLiRjZWxsLm9uZGJsY2xpY2sgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1bmRvV3JpdGUoKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGxhc3RTcGFjZUluZGV4ID0gdGhpcy4kc3Bhbi50ZXh0Q29udGVudC5sYXN0SW5kZXhPZignICcpO1xyXG4gICAgICAgIGlmKGxhc3RTcGFjZUluZGV4IDwgMCkgdGhpcy4kc3Bhbi50ZXh0Q29udGVudCA9ICcnO1xyXG4gICAgICAgIGVsc2UgdGhpcy4kc3Bhbi50ZXh0Q29udGVudCA9IHRoaXMuJHNwYW4udGV4dENvbnRlbnQuc3Vic3RyKDAsIGxhc3RTcGFjZUluZGV4KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdW5kb0RlbGV0ZSh0ZXh0KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy4kc3Bhbi50ZXh0Q29udGVudCArPSB0ZXh0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGREZWNvcihjc3NTdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLiRjZWxsLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIGNzc1N0cmluZyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZE1lc3NhZ2UodGV4dCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuJHNwYW4udGV4dENvbnRlbnQgPSB0ZXh0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDc3NTdHlsZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLiRjZWxsLmdldEF0dHJpYnV0ZSgnc3R5bGUnKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHNjcmVlblgoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy4kY2VsbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS54O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgc2NyZWVuWSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLiRjZWxsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQge0NlbGx9IGZyb20gXCIuLi9jZWxsL0NlbGxcIjtcclxuaW1wb3J0IHtUYWJsZU1vZH0gZnJvbSBcIi4vVGFibGVNb2RcIjtcclxuaW1wb3J0IHtBY3Rpb24sIEFjdGlvblR5cGV9IGZyb20gXCIuLi91dGlsaXRpZXMvQWN0aW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVGFibGUge1xyXG4gICAgcHJpdmF0ZSAkdGFibGVDb250YWluZXIgPSAkKCdtYWluJyk7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgY2VsbHM6IENlbGxbXVtdID0gW107XHJcbiAgICBwdWJsaWMgbW9kOiBUYWJsZU1vZDtcclxuICAgIHB1YmxpYyByZWFkb25seSBzZWxlY3RlZENlbGxzOiBDZWxsW10gPSBbXTtcclxuICAgIHByaXZhdGUgYWN0aW9uczogQWN0aW9uW10gPSBbXTtcclxuICAgIHB1YmxpYyByZWFkb25seSB3aWR0aDogbnVtYmVyO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGhlaWdodDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfJHBvcG92ZXIgPSAkKCcjcG9wb3ZlcicpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX3N0b3JlKSB7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IF9zdG9yZS53aWR0aDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IF9zdG9yZS5oZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5maWxsVGFibGUoX3N0b3JlLmNlbGxzVW5pb25zLCBfc3RvcmUuZGVjb3JhdGlvbnMsIF9zdG9yZS5tZXNzYWdlcyk7XHJcbiAgICAgICAgbGV0ICRib2R5ID0gJCgnYm9keScpO1xyXG4gICAgICAgICRib2R5Lm9uKCdtb3VzZXVwJywgKCkgPT4gdGhpcy5vbkJvZHlNb3VzZXVwKCkpO1xyXG4gICAgICAgICRib2R5Lm9uKCdrZXlkb3duJywgKGV2ZW50KSA9PiB0aGlzLm9uQm9keUtleWRvd24oZXZlbnQpKTtcclxuICAgICAgICAkKCcjcGFnZS1uYW1lJykudGV4dChfc3RvcmUubmFtZSk7XHJcbiAgICAgICAgdGhpcy5fJHBvcG92ZXIub24oJ21vdXNldXAnLCAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGZpbGxUYWJsZShjZWxsc1VuaW9ucywgZGVjb3JhdGlvbnMsIG1lc3NhZ2VzKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5maWxsU3RhcnRUYWJsZSgpO1xyXG4gICAgICAgIHRoaXMudW5pb24oY2VsbHNVbmlvbnMpO1xyXG4gICAgICAgIHRoaXMuZGVjb3JhdGUoZGVjb3JhdGlvbnMpO1xyXG4gICAgICAgIHRoaXMuYWRkTWVzc2FnZXMobWVzc2FnZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZmlsbFN0YXJ0VGFibGUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5jZWxscy5sZW5ndGggPSAwO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5oZWlnaHQ7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmNlbGxzLnB1c2goW10pO1xyXG4gICAgICAgICAgICBsZXQgJHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3JvdycpO1xyXG4gICAgICAgICAgICAkcm93LmNsYXNzTmFtZSA9ICdjb21ncmlkLXJvdyc7XHJcbiAgICAgICAgICAgIHRoaXMuJHRhYmxlQ29udGFpbmVyLmFwcGVuZCgkcm93KTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLndpZHRoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2VsbHNbaV0ucHVzaChuZXcgQ2VsbChpLCBqLCAkcm93LCB0aGlzKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1bmlvbihjZWxsc1VuaW9ucyk6IHZvaWQge1xyXG4gICAgICAgIGNlbGxzVW5pb25zLmZvckVhY2godW5pb24gPT4gdGhpcy5jcmVhdGVVbmlvbih1bmlvbikpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlVW5pb24oY2VsbHNVbmlvbik6IHZvaWQge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSBjZWxsc1VuaW9uLmxlZnRVcFg7IGkgPD0gY2VsbHNVbmlvbi5yaWdodERvd25YOyBpKyspXHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSBjZWxsc1VuaW9uLmxlZnRVcFk7IGogPD0gY2VsbHNVbmlvbi5yaWdodERvd25ZOyBqKyspXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldENlbGwoaSwgaikuc2VsZWN0V2l0aEZyaWVuZHModHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5zZWxlY3REb3duKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkZWNvcmF0ZShkZWNvcmF0aW9ucyk6IHZvaWQge1xyXG4gICAgICAgIGRlY29yYXRpb25zLmZvckVhY2goZGVjb3JhdGlvbiA9PiB0aGlzLmRlY29yYXRlT25lKGRlY29yYXRpb24pKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRlY29yYXRlT25lKGRlY29yYXRpb24pOiB2b2lkIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gZGVjb3JhdGlvbi5sZWZ0VXBYOyBpIDw9IGRlY29yYXRpb24ucmlnaHREb3duWDsgaSsrKVxyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gZGVjb3JhdGlvbi5sZWZ0VXBZOyBqIDw9IGRlY29yYXRpb24ucmlnaHREb3duWTsgaisrKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRDZWxsKGksIGopLmFkZERlY29yKGRlY29yYXRpb24uY3NzVGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhZGRNZXNzYWdlcyhtZXNzYWdlcyk6IHZvaWQge1xyXG4gICAgICAgIG1lc3NhZ2VzLmZvckVhY2gobWVzc2FnZSA9PiB0aGlzLmdldENlbGwobWVzc2FnZS54LCBtZXNzYWdlLnkpLmFkZE1lc3NhZ2UobWVzc2FnZS50ZXh0KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvbkJvZHlNb3VzZXVwKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMubW9kID0gVGFibGVNb2Qubm9uZTtcclxuICAgICAgICB0aGlzLnNlbGVjdERvd24oKTtcclxuICAgICAgICB0aGlzLmhpZGVQb3BvdmVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZWxlY3REb3duKCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBjbG9uZSA9IHRoaXMuc2VsZWN0ZWRDZWxscy5tYXAoZWxlbSA9PiBlbGVtKTtcclxuICAgICAgICBsZXQgc3R5bGUgPSBjbG9uZVswXS5nZXRDc3NTdHlsZSgpO1xyXG4gICAgICAgIHdoaWxlICh0aGlzLnNlbGVjdGVkQ2VsbHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBsZXQgY2VsbCA9IHRoaXMuc2VsZWN0ZWRDZWxscy5wb3AoKTtcclxuICAgICAgICAgICAgY2VsbC5zZXRGcmllbmRzKGNsb25lKTtcclxuICAgICAgICAgICAgY2VsbC5zZWxlY3ROb25lKCk7XHJcbiAgICAgICAgICAgIGNlbGwuYWRkRGVjb3Ioc3R5bGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uQm9keUtleWRvd24oZXZlbnQpOiB2b2lkIHtcclxuICAgICAgICBpZiAoZXZlbnQuY3RybEtleSAmJiBldmVudC5jb2RlID09PSAnS2V5WicpIHtcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5wb3BBY3Rpb24oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldENlbGwoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBDZWxsIHtcclxuICAgICAgICBpZiAoeCA+PSAwICYmIHggPCB0aGlzLmhlaWdodCAmJiB5ID49IDAgJiYgeSA8IHRoaXMud2lkdGgpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNlbGxzW3hdW3ldO1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwdXNoQWN0aW9uKGFjdGlvbjogQWN0aW9uKSB7XHJcbiAgICAgICAgbGV0IGxhc3RBY3Rpb24gPSB0aGlzLmFjdGlvbnNbdGhpcy5hY3Rpb25zLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgIGlmIChsYXN0QWN0aW9uICE9IG51bGwgJiYgbGFzdEFjdGlvblswXSA9PT0gQWN0aW9uVHlwZS53cml0ZSAmJiBhY3Rpb25bMF0gPD0gQWN0aW9uVHlwZS53cml0ZVdpdGhTcGFjZVxyXG4gICAgICAgICAgICAmJiBsYXN0QWN0aW9uWzFdID09PSBhY3Rpb25bMV0gJiYgbGFzdEFjdGlvblsyXSA9PT0gYWN0aW9uWzJdKVxyXG4gICAgICAgICAgICB0aGlzLmFjdGlvbnMucG9wKCk7XHJcbiAgICAgICAgdGhpcy5hY3Rpb25zLnB1c2goYWN0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcG9wQWN0aW9uKCkge1xyXG4gICAgICAgIGxldCBhY3Rpb24gPSB0aGlzLmFjdGlvbnMucG9wKCk7XHJcbiAgICAgICAgc3dpdGNoIChhY3Rpb25bMF0pIHtcclxuICAgICAgICAgICAgY2FzZSBBY3Rpb25UeXBlLndyaXRlOlxyXG4gICAgICAgICAgICAgICAgdGhpcy51bmRvV3JpdGUoYWN0aW9uWzFdLCBhY3Rpb25bMl0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAvLyBjYXNlIEFjdGlvblR5cGUuZGVsZXRlOlxyXG4gICAgICAgICAgICAvLyAgICAgdGhpcy51bmRvRGVsZXRlKGFjdGlvblsxXSwgYWN0aW9uWzJdLCBhY3Rpb25bM10pO1xyXG4gICAgICAgICAgICAvLyAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBjYXNlIEFjdGlvblR5cGUud3JpdGVXaXRoU3BhY2U6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVuZG9Xcml0ZShhY3Rpb25bMV0sIGFjdGlvblsyXSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdW5kb1dyaXRlKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5nZXRDZWxsKHgsIHkpLnVuZG9Xcml0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdW5kb0RlbGV0ZSh4OiBudW1iZXIsIHk6IG51bWJlciwgdGV4dDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5nZXRDZWxsKHgsIHkpLnVuZG9EZWxldGUodGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNob3dQb3BvdmVyKHg6IG51bWJlciwgeTogbnVtYmVyLCBjZWxsOiBDZWxsKXtcclxuICAgICAgICB0aGlzLl8kcG9wb3Zlci5yZW1vdmVDbGFzcygnZC1ub25lJyk7XHJcbiAgICAgICAgdGhpcy5fJHBvcG92ZXIuYXR0cignc3R5bGUnLCBgbGVmdDogJHtjZWxsLnNjcmVlblggKyAxNn1weDsgdG9wOiAke2NlbGwuc2NyZWVuWSArIDE2fXB4O2ApO1xyXG4gICAgICAgIHRoaXMuXyRwb3BvdmVyLmZpbmQoJyNjb29yZHMnKS50ZXh0KGAke3h9LCAke3l9YCk7XHJcblxyXG4gICAgICAgIGxldCAkaW5wdXQgPSB0aGlzLl8kcG9wb3Zlci5maW5kKCcjY3NzU3R5bGVJbnB1dCcpO1xyXG4gICAgICAgICRpbnB1dC52YWwoY2VsbC5nZXRDc3NTdHlsZSgpKTtcclxuICAgICAgICAkaW5wdXQub2ZmKCdjaGFuZ2UnKTtcclxuICAgICAgICAkaW5wdXQub24oJ2NoYW5nZScsICgpID0+IGNlbGwuYWRkRGVjb3JXaXRoRnJpZW5kcygkaW5wdXQudmFsKCkpKTtcclxuXHJcbiAgICAgICAgbGV0ICRidXR0b24xID0gdGhpcy5fJHBvcG92ZXIuZmluZCgnI2VkaXRUZXh0QnV0dG9uJyk7XHJcbiAgICAgICAgJGJ1dHRvbjEub2ZmKCdjbGljaycpO1xyXG4gICAgICAgICRidXR0b24xLm9uKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgY2VsbC5mb2N1cygpO1xyXG4gICAgICAgICAgICB0aGlzLmhpZGVQb3BvdmVyKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCAkYnV0dG9uMiA9IHRoaXMuXyRwb3BvdmVyLmZpbmQoJyNkaXZpZGVCdXR0b24nKTtcclxuICAgICAgICAkYnV0dG9uMi5vZmYoJ2NsaWNrJyk7XHJcbiAgICAgICAgJGJ1dHRvbjIub24oJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjZWxsLnNlcGFyYXRlV2l0aEZyaWVuZHMoKTtcclxuICAgICAgICAgICAgY2VsbC5mb2N1cygpO1xyXG4gICAgICAgICAgICB0aGlzLmhpZGVQb3BvdmVyKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGhpZGVQb3BvdmVyKCl7XHJcbiAgICAgICAgdGhpcy5fJHBvcG92ZXIuYWRkQ2xhc3MoJ2Qtbm9uZScpO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGVudW0gVGFibGVNb2R7XHJcbiAgICBub25lLFxyXG4gICAgc2VsZWN0aW5nXHJcbn0iLCJpbXBvcnQge1RhYmxlfSBmcm9tIFwiLi9UYWJsZVwiO1xyXG5pbXBvcnQge0h0dHBDbGllbnR9IGZyb20gXCIuLi8uLi91dGlsL0h0dHBDbGllbnRcIjtcclxuaW1wb3J0IHtUYWJsZUluZm9SZXF1ZXN0fSBmcm9tIFwiLi4vLi4vdXRpbC9yZXF1ZXN0L1RhYmxlSW5mb1JlcXVlc3RcIjtcclxuaW1wb3J0IHtJc0xvZ2dlZEluUmVxdWVzdH0gZnJvbSBcIi4uLy4uL3V0aWwvcmVxdWVzdC9Jc0xvZ2dlZEluUmVxdWVzdFwiO1xyXG5pbXBvcnQge1RhYmxlTWVzc2FnZXNSZXF1ZXN0fSBmcm9tIFwiLi4vLi4vdXRpbC9yZXF1ZXN0L1RhYmxlTWVzc2FnZXNSZXF1ZXN0XCI7XHJcblxyXG5sZXQgdGFibGU7XHJcbmNvbnN0IGxpbmsgPSBcImh0dHBzOi8vY29tZ3JpZC5ydTo4NDQzXCI7XHJcbmxldCBjZWxsc1VuaW9ucyA9IFtcclxuICAgIHtcclxuICAgICAgICBsZWZ0VXBYOiAxMSxcclxuICAgICAgICBsZWZ0VXBZOiAxNCxcclxuICAgICAgICByaWdodERvd25YOiAxNyxcclxuICAgICAgICByaWdodERvd25ZOiAxN1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBsZWZ0VXBYOiAyMixcclxuICAgICAgICBsZWZ0VXBZOiAxNyxcclxuICAgICAgICByaWdodERvd25YOiAyNCxcclxuICAgICAgICByaWdodERvd25ZOiAzMFxyXG4gICAgfVxyXG5dO1xyXG5leHBvcnQgbGV0IHN0b3JlOiBhbnkgPSB7XHJcbiAgICBoZWlnaHQ6IDUwLFxyXG4gICAgd2lkdGg6IDUwLFxyXG4gICAgY2VsbHNVbmlvbnM6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxlZnRVcFg6IDExLFxyXG4gICAgICAgICAgICBsZWZ0VXBZOiAxNCxcclxuICAgICAgICAgICAgcmlnaHREb3duWDogMTcsXHJcbiAgICAgICAgICAgIHJpZ2h0RG93blk6IDE3XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxlZnRVcFg6IDIyLFxyXG4gICAgICAgICAgICBsZWZ0VXBZOiAxNyxcclxuICAgICAgICAgICAgcmlnaHREb3duWDogMjQsXHJcbiAgICAgICAgICAgIHJpZ2h0RG93blk6IDMwXHJcbiAgICAgICAgfVxyXG4gICAgXSxcclxuICAgIGRlY29yYXRpb25zOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZWZ0VXBYOiAxMSxcclxuICAgICAgICAgICAgbGVmdFVwWTogMTQsXHJcbiAgICAgICAgICAgIHJpZ2h0RG93blg6IDE3LFxyXG4gICAgICAgICAgICByaWdodERvd25ZOiAxNyxcclxuICAgICAgICAgICAgY3NzVGV4dDogXCJiYWNrZ3JvdW5kLWNvbG9yOiBibHVlOyBjb2xvcjogeWVsbG93ICFpbXBvcnRhbnQ7IGJvcmRlci1jb2xvcjogcmVkICFpbXBvcnRhbnQ7XCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGVmdFVwWDogMzEsXHJcbiAgICAgICAgICAgIGxlZnRVcFk6IDQxLFxyXG4gICAgICAgICAgICByaWdodERvd25YOiAzMSxcclxuICAgICAgICAgICAgcmlnaHREb3duWTogNDEsXHJcbiAgICAgICAgICAgIGNzc1RleHQ6IFwiYmFja2dyb3VuZC1jb2xvcjogcmdiKDIwNCwxMSwxMSk7IGNvbG9yOiBncmVlbiAhaW1wb3J0YW50OyBib3JkZXItY29sb3I6IGJsdWUgIWltcG9ydGFudDtcIlxyXG4gICAgICAgIH1cclxuICAgIF0sXHJcbiAgICBtZXNzYWdlczogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgeDogMjIsXHJcbiAgICAgICAgICAgIHk6IDE3LFxyXG4gICAgICAgICAgICB0ZXh0OiBcItCg0LXQsdGP0YLQsCwg0L/RgNC40LLQtdGCLCDRh9GC0L4g0LfQsNC00LDQu9C4INC/0L4g0L/RgNC10LrRgNCw0YHQvdC+0Lkg0LbQuNC30L3QuCDQsdC10Lcg0LfQsNCx0L7Rgj9cIlxyXG4gICAgICAgIH1cclxuICAgIF0sXHJcbiAgICBzZWxlY3RlZENsYXNzZXM6IFsnYmctZGFyaycsICd0ZXh0LWxpZ2h0J10sXHJcbiAgICBub1NlbGVjdGVkQ2xhc3NlczogWyd0ZXh0LWRhcmsnXVxyXG59XHJcblxyXG5jb25zdCBodHRwQ2xpZW50ID0gbmV3IEh0dHBDbGllbnQobGluayk7XHJcbiQod2luZG93KS5vbignbG9hZCcsICgpID0+IHtcclxuICAgIGh0dHBDbGllbnQucHJvY2VlZFJlcXVlc3QoXHJcbiAgICAgICAgbmV3IElzTG9nZ2VkSW5SZXF1ZXN0KCksXHJcbiAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICBhbGVydChcIllvdSdyZSBub3QgbG9nZ2VkIGluLCBwbGVhc2UgbG9nIGluXCIpXHJcbiAgICAgICAgfVxyXG4gICAgKS50aGVuKGxvYWRUYWJsZSlcclxuICAgIC50aGVuKGxvYWRUYWJsZU1lc3NhZ2VzKVxyXG4gICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiVGFibGUgbWVzc2FnZXNcIilcclxuICAgICAgICBzdG9yZS5jZWxsc1VuaW9ucyA9IGNlbGxzVW5pb25zO1xyXG4gICAgICAgIHRhYmxlID0gbmV3IFRhYmxlKHN0b3JlKTtcclxuICAgIH0pXHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gbG9hZFRhYmxlKCl7XHJcbiAgICBsZXQgY2hhdElkID0gcGFyc2VJbnQoZ2V0UGFyYW0oJ2lkJykpO1xyXG4gICAgcmV0dXJuIGh0dHBDbGllbnQucHJvY2VlZFJlcXVlc3QoXHJcbiAgICAgICAgbmV3IFRhYmxlSW5mb1JlcXVlc3Qoe1xyXG4gICAgICAgICAgICBjaGF0SWQ6IGNoYXRJZFxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIChjb2RlLCBlcnJvclRleHQpID0+IHtcclxuICAgICAgICAgICAgaWYoY29kZSA9PT0gNDA0KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRhYmxlIG5vdCBmb3VuZFwiKVxyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBFcnJvcjogJyR7Y29kZX0sICR7ZXJyb3JUZXh0fScgd2hpbGUgbG9hZGluZyB0YWJsZSBpbmZvYClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICkudGhlbigodGFibGUpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyh0YWJsZSlcclxuICAgICAgICBzdG9yZSA9IHRhYmxlXHJcbiAgICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gbG9hZFRhYmxlTWVzc2FnZXMoKXtcclxuICAgIGxldCBjaGF0SWQgPSBwYXJzZUludChnZXRQYXJhbSgnaWQnKSk7XHJcbiAgICByZXR1cm4gaHR0cENsaWVudC5wcm9jZWVkUmVxdWVzdChcclxuICAgICAgICBuZXcgVGFibGVNZXNzYWdlc1JlcXVlc3Qoe1xyXG4gICAgICAgICAgICBjaGF0SWQ6IGNoYXRJZCxcclxuICAgICAgICAgICAgeGNvb3JkTGVmdFRvcDogMCxcclxuICAgICAgICAgICAgeWNvb3JkTGVmdFRvcDogMCxcclxuICAgICAgICAgICAgeGNvb3JkUmlnaHRCb3R0b206IHN0b3JlLndpZHRoIC0gMSxcclxuICAgICAgICAgICAgeWNvb3JkUmlnaHRCb3R0b206IHN0b3JlLmhlaWdodCAtIDEsXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgKGNvZGUsIGVycm9yVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBpZihjb2RlID09PSA0MDApe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY29kZSArIFwiLCBcIiArIGVycm9yVGV4dClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihjb2RlID09PSA0MDQpe1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJjb2RlOiBcIiArIGNvZGUgKyBcIiwgZXJyb3I6IFwiICsgZXJyb3JUZXh0KTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY29kZTogXCIgKyBjb2RlICsgXCIsIGVycm9yOiBcIiArIGVycm9yVGV4dCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZihjb2RlID09PSA0MDMgJiYgZXJyb3JUZXh0ID09PSBcImFjY2Vzcy5jaGF0LnJlYWRfbWVzc2FnZXNcIil7XHJcbiAgICAgICAgICAgICAgICBhbGVydChcIllvdSBkb24ndCBoYXZlIGVub3VnaCByaWdodHMgdG8gYWNjZXNzIHRoaXMgY2hhdFwiKVxyXG4gICAgICAgICAgICB9ZWxzZSBpZihcclxuICAgICAgICAgICAgICAgIGNvZGUgPT09IDQyMiAmJiAoZXJyb3JUZXh0ID09PSBcIm91dF9vZl9ib3VuZHNcIiB8fFxyXG4gICAgICAgICAgICAgICAgZXJyb3JUZXh0ID09PSBcInRpbWUubmVnYXRpdmUtb3ItZnV0dXJlXCJcclxuICAgICAgICAgICAgKSl7IC8vIHNob3VsZCBub3QgaGFwcGVuXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgaGVpZ2h0OiAke3N0b3JlLmhlaWdodCAtIDF9LCB3aWR0aDogJHtzdG9yZS53aWR0aCAtIDF9YClcclxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiU2hvdWxkIG5vdCBoYXBwZW4sIHNlZSBjb25zb2xlXCIpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICApLnRoZW4oKG1lc3NhZ2VzKSA9PiB7XHJcbiAgICAgICAgc3RvcmUubWVzc2FnZXMgPSBtZXNzYWdlc1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFBhcmFtKG5hbWU6IHN0cmluZyk6IHN0cmluZ3tcclxuICAgIGNvbnN0IHVybFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaClcclxuICAgIHJldHVybiB1cmxQYXJhbXMuZ2V0KG5hbWUpXHJcbn1cclxuIiwiXHJcbmV4cG9ydCBlbnVtIEFjdGlvblR5cGUge1xyXG4gICAgd3JpdGUsXHJcbiAgICB3cml0ZVdpdGhTcGFjZSxcclxuICAgIGRlbGV0ZSxcclxuICAgIHVuaW9uXHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIEFjdGlvbiA9IFthY3Rpb25UeXBlOiBBY3Rpb25UeXBlLCBjZWxsWDogbnVtYmVyLCBjZWxsWTogbnVtYmVyLCBpbmZvPzogYW55XTsiLCJleHBvcnQgZW51bSBEaXJlY3Rpb257XHJcbiAgICBsZWZ0LFxyXG4gICAgcmlnaHQsXHJcbiAgICB0b3AsXHJcbiAgICBib3R0b21cclxufSIsImltcG9ydCB7UmVxdWVzdFdyYXBwZXJ9IGZyb20gXCIuL3JlcXVlc3QvUmVxdWVzdFwiO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBIdHRwQ2xpZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgYXBpTGluazogc3RyaW5nKSB7fVxyXG5cclxuICAgIGFzeW5jIHByb2NlZWRSZXF1ZXN0PFQ+KFxyXG4gICAgICAgIHJlcXVlc3Q6IFJlcXVlc3RXcmFwcGVyPFQ+LFxyXG4gICAgICAgIG9uRmFpbHVyZTogKGNvZGU6IG51bWJlciwgZXJyb3JUZXh0OiBzdHJpbmcpID0+IHVua25vd24gPVxyXG4gICAgICAgICAgICAoY29kZSwgZXJyb3JUZXh0KSA9PiBhbGVydChgY29kZTogJHtjb2RlfSwgZXJyb3I6ICR7ZXJyb3JUZXh0fWApLFxyXG4gICAgICAgIG9uTmV0d29ya0ZhaWx1cmU6IChyZWFzb24pID0+IHVua25vd24gPVxyXG4gICAgICAgICAgICAocmVhc29uKSA9PiBhbGVydChgbmV0d29yayBlcnJvcjogJHtyZWFzb259YClcclxuICAgICk6IFByb21pc2U8VD57XHJcbiAgICAgICAgY29uc3QgZmluYWxMaW5rID0gbmV3IFVSTCh0aGlzLmFwaUxpbmsgKyByZXF1ZXN0LmVuZHBvaW50KVxyXG4gICAgICAgIGlmKHJlcXVlc3QucGFyYW1ldGVycyAhPSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIGZpbmFsTGluay5zZWFyY2ggPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHJlcXVlc3QucGFyYW1ldGVycykudG9TdHJpbmcoKVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhyZXF1ZXN0KVxyXG4gICAgICAgIHJldHVybiBmZXRjaChcclxuICAgICAgICAgICAgZmluYWxMaW5rLnRvU3RyaW5nKCksXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcImluY2x1ZGVcIixcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogcmVxdWVzdC5tZXRob2RUeXBlLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyczogcmVxdWVzdC5oZWFkZXJzLFxyXG4gICAgICAgICAgICAgICAgYm9keTogcmVxdWVzdC5ib2R5XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApLnRoZW4oKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnByb2NlZWRSZXF1ZXN0KHJlc3BvbnNlKVxyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLnRleHQoKS50aGVuKHRleHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG9uRmFpbHVyZShyZXNwb25zZS5zdGF0dXMsIHRleHQpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHRleHQpXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGVudW0gTWV0aG9kVHlwZXtcclxuICAgIFBPU1Q9XCJQT1NUXCIsXHJcbiAgICBHRVQ9XCJHRVRcIixcclxuICAgIFBBVENIPVwiUEFUQ0hcIixcclxuICAgIFBVVD1cIlBVVFwiLFxyXG59IiwiaW1wb3J0IHtSZXF1ZXN0V3JhcHBlcn0gZnJvbSBcIi4vUmVxdWVzdFwiO1xyXG5pbXBvcnQge01ldGhvZFR5cGV9IGZyb20gXCIuLi9IdHRwQ2xpZW50XCI7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIElzTG9nZ2VkSW5SZXF1ZXN0IGltcGxlbWVudHMgUmVxdWVzdFdyYXBwZXI8bnVtYmVyPntcclxuICAgIHJlYWRvbmx5IGVuZHBvaW50OiBzdHJpbmcgPSAnL3VzZXIvbG9naW4nO1xyXG4gICAgcmVhZG9ubHkgbWV0aG9kVHlwZTogTWV0aG9kVHlwZSA9IE1ldGhvZFR5cGUuR0VUO1xyXG5cclxuICAgIGFzeW5jIHByb2NlZWRSZXF1ZXN0KHJlc3BvbnNlOiBSZXNwb25zZSk6IFByb21pc2U8bnVtYmVyPiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnN0YXR1cztcclxuICAgIH1cclxufSIsImltcG9ydCB7TWV0aG9kVHlwZX0gZnJvbSBcIi4uL0h0dHBDbGllbnRcIjtcclxuaW1wb3J0IHtSZXF1ZXN0V3JhcHBlcn0gZnJvbSBcIi4vUmVxdWVzdFwiO1xyXG5pbXBvcnQge1RhYmxlUmVzcG9uc2V9IGZyb20gXCIuL0NyZWF0ZVRhYmxlUmVxdWVzdFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRhYmxlSW5mb1JlcXVlc3QgaW1wbGVtZW50cyBSZXF1ZXN0V3JhcHBlcjxUYWJsZVJlc3BvbnNlPiB7XHJcbiAgICByZWFkb25seSBwYXJhbWV0ZXJzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHBhcmFtZXRlcnM6IHtcclxuICAgICAgICAgICAgY2hhdElkOiBudW1iZXIsXHJcbiAgICAgICAgICAgIGluY2x1ZGVQYXJ0aWNpcGFudHM/OiBib29sZWFuXHJcbiAgICAgICAgfVxyXG4gICAgKSB7XHJcbiAgICAgICAgbGV0IHBhcmFtczogYW55ID0ge31cclxuICAgICAgICBwYXJhbXMuY2hhdElkID0gcGFyYW1ldGVycy5jaGF0SWQudG9TdHJpbmcoKVxyXG4gICAgICAgIGlmKHBhcmFtZXRlcnMuaW5jbHVkZVBhcnRpY2lwYW50cylcclxuICAgICAgICAgICAgcGFyYW1zLmluY2x1ZGVQYXJ0aWNpcGFudHMgPSBwYXJhbWV0ZXJzLmluY2x1ZGVQYXJ0aWNpcGFudHM/LnRvU3RyaW5nKClcclxuXHJcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzID0gcGFyYW1zO1xyXG4gICAgfVxyXG5cclxuICAgIHJlYWRvbmx5IGVuZHBvaW50OiBzdHJpbmcgPSBcIi90YWJsZS9pbmZvXCI7XHJcbiAgICByZWFkb25seSBtZXRob2RUeXBlOiBNZXRob2RUeXBlID0gTWV0aG9kVHlwZS5HRVQ7XHJcblxyXG4gICAgYXN5bmMgcHJvY2VlZFJlcXVlc3QocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTxUYWJsZVJlc3BvbnNlPiB7XHJcbiAgICAgICAgY29uc3QgdGV4dCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKVxyXG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHRleHQpIGFzIFRhYmxlUmVzcG9uc2VcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQge1JlcXVlc3RXcmFwcGVyfSBmcm9tIFwiLi9SZXF1ZXN0XCI7XHJcbmltcG9ydCB7TWV0aG9kVHlwZX0gZnJvbSBcIi4uL0h0dHBDbGllbnRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBNZXNzYWdlUmVzcG9uc2V7XHJcbiAgICByZWFkb25seSBpZCE6IG51bWJlclxyXG4gICAgcmVhZG9ubHkgeCE6IG51bWJlclxyXG4gICAgcmVhZG9ubHkgeSE6IG51bWJlclxyXG4gICAgcmVhZG9ubHkgY2hhdElkITogbnVtYmVyXHJcbiAgICByZWFkb25seSB0aW1lITogRGF0ZVxyXG4gICAgcmVhZG9ubHkgc2VuZGVySWQhOiBzdHJpbmdcclxuICAgIHJlYWRvbmx5IHRleHQhOiBzdHJpbmdcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRhYmxlTWVzc2FnZXNSZXF1ZXN0IGltcGxlbWVudHMgUmVxdWVzdFdyYXBwZXI8TWVzc2FnZVJlc3BvbnNlW10+e1xyXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgYm9keToge1xyXG4gICAgICAgIGNoYXRJZDogbnVtYmVyLFxyXG4gICAgICAgIHhjb29yZExlZnRUb3A6IG51bWJlcixcclxuICAgICAgICB5Y29vcmRMZWZ0VG9wOiBudW1iZXIsXHJcbiAgICAgICAgeGNvb3JkUmlnaHRCb3R0b206IG51bWJlcixcclxuICAgICAgICB5Y29vcmRSaWdodEJvdHRvbTogbnVtYmVyLFxyXG4gICAgICAgIHNpbmNlRGF0ZVRpbWVNaWxsaXM/OiBudW1iZXIsXHJcbiAgICAgICAgdW50aWxEYXRlVGltZU1pbGxpcz86IG51bWJlcixcclxuICAgIH0pIHt9XHJcbiAgICByZWFkb25seSBlbmRwb2ludDogc3RyaW5nID0gJy9tZXNzYWdlL2xpc3QnO1xyXG4gICAgcmVhZG9ubHkgaGVhZGVyczogSGVhZGVyc0luaXQgPSB7XHJcbiAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcclxuICAgIH07XHJcbiAgICByZWFkb25seSBtZXRob2RUeXBlOiBNZXRob2RUeXBlID0gTWV0aG9kVHlwZS5QT1NUO1xyXG5cclxuICAgIGFzeW5jIHByb2NlZWRSZXF1ZXN0KHJlc3BvbnNlOiBSZXNwb25zZSk6IFByb21pc2U8TWVzc2FnZVJlc3BvbnNlW10+IHtcclxuICAgICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xyXG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHRleHQpIGFzIE1lc3NhZ2VSZXNwb25zZVtdO1xyXG4gICAgfVxyXG5cclxufSJdfQ==
