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
        chatid: chatId,
        xcoordLeftTop: 0,
        ycoordLeftTop: 0,
        xcoordRightBottom: exports.store.width - 1,
        ycoordRightBottom: exports.store.height - 1,
    }), function (code, errorText) {
        if (code === 403 && errorText === "access.chat.read_messages") {
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
                return [2 /*return*/, fetch(finalLink.toString(), {
                        credentials: "include",
                        method: request.methodType,
                        headers: request.headers,
                        body: request.body
                    }).then(function (response) {
                        if (response.status === 200) {
                            return request.proceedRequest(response);
                            // if(response.headers.get("Content-Type").startsWith("image")) {
                            //     response.blob().then(blob => {
                            //         onSuccess(blob)
                            //     })
                            // }else {
                            //     response.text().then(text => {
                            //         onSuccess(text)
                            //     })
                            // }
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
    function TableInfoRequest(body) {
        this.endpoint = "/table/info";
        this.methodType = HttpClient_1.MethodType.GET;
        this.body = JSON.stringify(body);
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
        this.endpoint = '/messages/list';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJUU2NyaXB0L3RhYmxlcGFnZS9jZWxsL0NlbGwudHMiLCJUU2NyaXB0L3RhYmxlcGFnZS9jZWxsL0NlbGxEcmF3ZXIudHMiLCJUU2NyaXB0L3RhYmxlcGFnZS9tYWluL1RhYmxlLnRzIiwiVFNjcmlwdC90YWJsZXBhZ2UvbWFpbi9UYWJsZU1vZC50cyIsIlRTY3JpcHQvdGFibGVwYWdlL21haW4vVGFibGVQYWdlLnRzIiwiVFNjcmlwdC90YWJsZXBhZ2UvdXRpbGl0aWVzL0FjdGlvbi50cyIsIlRTY3JpcHQvdGFibGVwYWdlL3V0aWxpdGllcy9EaXJlY3Rpb24udHMiLCJUU2NyaXB0L3V0aWwvSHR0cENsaWVudC50cyIsIlRTY3JpcHQvdXRpbC9yZXF1ZXN0L0lzTG9nZ2VkSW5SZXF1ZXN0LnRzIiwiVFNjcmlwdC91dGlsL3JlcXVlc3QvVGFibGVJbmZvUmVxdWVzdC50cyIsIlRTY3JpcHQvdXRpbC9yZXF1ZXN0L1RhYmxlTWVzc2FnZXNSZXF1ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FDQUEsMkNBQXdDO0FBRXhDLDZDQUEwQztBQUMxQyxvREFBaUQ7QUFDakQsOENBQStDO0FBSy9DO0lBTUksY0FDb0IsQ0FBUyxFQUNULENBQVMsRUFDekIsSUFBaUIsRUFDRCxLQUFZO1FBSFosTUFBQyxHQUFELENBQUMsQ0FBUTtRQUNULE1BQUMsR0FBRCxDQUFDLENBQVE7UUFFVCxVQUFLLEdBQUwsS0FBSyxDQUFPO1FBRTVCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSx1QkFBVSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQsc0JBQVcsMkJBQVM7YUFBcEI7WUFBQSxpQkFVQztZQVRHLE9BQU8sQ0FBQyxVQUFBLEtBQUs7Z0JBQ1QsSUFBSSxLQUFLLENBQUMsT0FBTztvQkFBRSxPQUFPO2dCQUMxQixJQUFJLEtBQUssQ0FBQyxR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SUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7UUFDeEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMscUJBQVMsQ0FBQyxHQUFHLEVBQUUscUJBQVMsQ0FBQyxNQUFNLEVBQUUscUJBQVMsQ0FBQyxJQUFJLEVBQUUscUJBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUN4RixJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFJLElBQUssT0FBQSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQTVDLENBQTRDLENBQUMsSUFBSSxJQUFJO1lBQzVFLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLHFCQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUMsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSSxJQUFLLE9BQUEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUE1QyxDQUE0QyxDQUFDLElBQUksSUFBSTtZQUM1RSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxxQkFBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdDLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFDLElBQUksSUFBSyxPQUFBLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUksQ0FBQyxDQUFDLENBQUMsRUFBNUMsQ0FBNEMsQ0FBQyxJQUFJLElBQUk7WUFDNUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMscUJBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFJ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Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0g3Qiw0Q0FBeUM7QUFFekM7SUFBQTtJQVFBLENBQUM7SUFBRCxzQkFBQztBQUFELENBUkEsQUFRQyxJQUFBO0FBUlksMENBQWU7QUFVNUI7SUFDSSw4QkFBcUIsSUFRcEI7UUFSb0IsU0FBSSxHQUFKLElBQUksQ0FReEI7UUFDUSxhQUFRLEdBQVcsZ0JBQWdCLENBQUM7UUFDcEMsWUFBTyxHQUFnQjtZQUM1QixjQUFjLEVBQUUsa0JBQWtCO1NBQ3JDLENBQUM7UUFDTyxlQUFVLEdBQWUsdUJBQVUsQ0FBQyxJQUFJLENBQUM7SUFMOUMsQ0FBQztJQU9DLDZDQUFjLEdBQXBCLFVBQXFCLFFBQWtCOzs7Ozs0QkFDdEIscUJBQU0sUUFBUSxDQUFDLElBQUksRUFBRSxFQUFBOzt3QkFBNUIsSUFBSSxHQUFHLFNBQXFCO3dCQUNsQyxzQkFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBc0IsRUFBQzs7OztLQUNoRDtJQUVMLDJCQUFDO0FBQUQsQ0FyQkEsQUFxQkMsSUFBQTtBQXJCWSxvREFBb0IiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQge0NlbGxEcmF3ZXJ9IGZyb20gXCIuL0NlbGxEcmF3ZXJcIjtcclxuaW1wb3J0IHtUYWJsZX0gZnJvbSBcIi4uL21haW4vVGFibGVcIjtcclxuaW1wb3J0IHtUYWJsZU1vZH0gZnJvbSBcIi4uL21haW4vVGFibGVNb2RcIjtcclxuaW1wb3J0IHtEaXJlY3Rpb259IGZyb20gXCIuLi91dGlsaXRpZXMvRGlyZWN0aW9uXCI7XHJcbmltcG9ydCB7QWN0aW9uVHlwZX0gZnJvbSBcIi4uL3V0aWxpdGllcy9BY3Rpb25cIjtcclxuaW1wb3J0IHtjc3N9IGZyb20gXCJqcXVlcnlcIjtcclxuXHJcbnR5cGUgb25UcmlnZ2VyID0gKGV2ZW50PzogYW55KSA9PiB2b2lkIHwgYm9vbGVhblxyXG5cclxuZXhwb3J0IGNsYXNzIENlbGwge1xyXG4gICAgcHJpdmF0ZSBkcmF3ZXI6IENlbGxEcmF3ZXI7XHJcbiAgICBwcml2YXRlIF9mcmllbmRzOiBDZWxsW107XHJcbiAgICBwcml2YXRlIF9ibG9ja2VkOiBib29sZWFuO1xyXG4gICAgcHJpdmF0ZSBfc2VsZWN0ZWQ6IGJvb2xlYW47XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHVibGljIHJlYWRvbmx5IHg6IG51bWJlcixcclxuICAgICAgICBwdWJsaWMgcmVhZG9ubHkgeTogbnVtYmVyLFxyXG4gICAgICAgICRyb3c6IEhUTUxFbGVtZW50LFxyXG4gICAgICAgIHB1YmxpYyByZWFkb25seSB0YWJsZTogVGFibGVcclxuICAgICkge1xyXG4gICAgICAgIHRoaXMuZHJhd2VyID0gbmV3IENlbGxEcmF3ZXIoJHJvdywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBvbktleWRvd24oKTogb25UcmlnZ2VyIHtcclxuICAgICAgICByZXR1cm4gKGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgaWYgKGV2ZW50LmN0cmxLZXkpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKGV2ZW50LnNoaWZ0S2V5KSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmIChldmVudC5jb2RlID09PSAnQXJyb3dVcCcpIHRoaXMudGFibGUuZ2V0Q2VsbCh0aGlzLnggLSAxLCB0aGlzLnkpLmZvY3VzKCk7XHJcbiAgICAgICAgICAgIGlmIChldmVudC5jb2RlID09PSAnQXJyb3dEb3duJyB8fCBldmVudC5jb2RlID09PSAnRW50ZXInKSB0aGlzLnRhYmxlLmdldENlbGwodGhpcy54ICsgMSwgdGhpcy55KS5mb2N1cygpO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNFbXB0eSgpKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmIChldmVudC5jb2RlID09PSAnQXJyb3dMZWZ0JykgdGhpcy50YWJsZS5nZXRDZWxsKHRoaXMueCwgdGhpcy55IC0gMSkuZm9jdXMoKTtcclxuICAgICAgICAgICAgaWYgKGV2ZW50LmNvZGUgPT09ICdBcnJvd1JpZ2h0JykgdGhpcy50YWJsZS5nZXRDZWxsKHRoaXMueCwgdGhpcy55ICsgMSkuZm9jdXMoKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgb25Nb3VzZWVudGVyKCk6IG9uVHJpZ2dlciB7XHJcbiAgICAgICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudGFibGUubW9kICE9PSBUYWJsZU1vZC5zZWxlY3RpbmcpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RXaXRoRnJpZW5kcygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG9uTW91c2Vkb3duKCk6IG9uVHJpZ2dlciB7XHJcbiAgICAgICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy50YWJsZS5tb2QgPSBUYWJsZU1vZC5zZWxlY3Rpbmc7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0V2l0aEZyaWVuZHMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBvbkRvdWJsZUNsaWNrKCk6IG9uVHJpZ2dlciB7XHJcbiAgICAgICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5mb2N1cygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG9uQmx1cigpOiBvblRyaWdnZXIge1xyXG4gICAgICAgIHJldHVybiAodGV4dDogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKHRleHQubGVuZ3RoICE9PSAwKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5ibG9jaygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG9uSW5wdXQoKTogb25UcmlnZ2VyIHtcclxuICAgICAgICByZXR1cm4gKGV2ZW50OiBhbnkpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZXZlbnQuaW5wdXRUeXBlKTtcclxuICAgICAgICAgICAgaWYoZXZlbnQuaW5wdXRUeXBlWzBdID09PSAnaScpXHJcbiAgICAgICAgICAgICAgICBpZihldmVudC5kYXRhID09PSAnICcpIHRoaXMudGFibGUucHVzaEFjdGlvbihbQWN0aW9uVHlwZS53cml0ZVdpdGhTcGFjZSwgdGhpcy54LCB0aGlzLnldKTtcclxuICAgICAgICAgICAgICAgIGVsc2UgdGhpcy50YWJsZS5wdXNoQWN0aW9uKFtBY3Rpb25UeXBlLndyaXRlLCB0aGlzLngsIHRoaXMueV0pO1xyXG4gICAgICAgICAgICBlbHNlIGlmKGV2ZW50LmlucHV0VHlwZVswXSA9PT0gJ2QnKVxyXG4gICAgICAgICAgICAgICAgdGhpcy50YWJsZS5wdXNoQWN0aW9uKFtBY3Rpb25UeXBlLmRlbGV0ZSwgdGhpcy54LCB0aGlzLnksIGV2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKCd0ZXh0L2h0bWwnKV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG9uQ29udGV4dG1lbnUoKTogb25UcmlnZ2VyIHtcclxuICAgICAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnRhYmxlLnNob3dQb3BvdmVyKHRoaXMueCwgdGhpcy55LCB0aGlzKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZm9jdXMoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5kcmF3ZXIuYmxvY2tObygpO1xyXG4gICAgICAgIHRoaXMuZHJhd2VyLmZvY3VzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNlbGVjdFdpdGhGcmllbmRzKHllczogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5fZnJpZW5kcyA9PSBudWxsIHx8IHRoaXMuX2ZyaWVuZHMubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICB5ZXMgPyB0aGlzLnNlbGVjdCgpIDogdGhpcy5zZWxlY3ROb25lKCk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLl9mcmllbmRzLmZvckVhY2goKGZyaWVuZCkgPT4geWVzID8gZnJpZW5kLnNlbGVjdCgpIDogZnJpZW5kLnNlbGVjdE5vbmUoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldEZyaWVuZHMoZnJpZW5kczogQ2VsbFtdKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fZnJpZW5kcyA9IGZyaWVuZHM7XHJcbiAgICAgICAgdGhpcy5kcmF3ZXIuYWRkQm9yZGVycyhEaXJlY3Rpb24udG9wLCBEaXJlY3Rpb24uYm90dG9tLCBEaXJlY3Rpb24ubGVmdCwgRGlyZWN0aW9uLnJpZ2h0KVxyXG4gICAgICAgIGlmIChmcmllbmRzLmZpbmQoKGNlbGwpID0+IChjZWxsLnggPT09IHRoaXMueCAmJiBjZWxsLnkgPT09IHRoaXMueSArIDEpKSAhPSBudWxsKVxyXG4gICAgICAgICAgICB0aGlzLmRyYXdlci5yZW1vdmVCb3JkZXIoRGlyZWN0aW9uLnJpZ2h0KTtcclxuICAgICAgICBpZiAoZnJpZW5kcy5maW5kKChjZWxsKSA9PiAoY2VsbC54ID09PSB0aGlzLnggJiYgY2VsbC55ID09PSB0aGlzLnkgLSAxKSkgIT0gbnVsbClcclxuICAgICAgICAgICAgdGhpcy5kcmF3ZXIucmVtb3ZlQm9yZGVyKERpcmVjdGlvbi5sZWZ0KTtcclxuICAgICAgICBpZiAoZnJpZW5kcy5maW5kKChjZWxsKSA9PiAoY2VsbC54ID09PSB0aGlzLnggLSAxICYmIGNlbGwueSA9PT0gdGhpcy55KSkgIT0gbnVsbClcclxuICAgICAgICAgICAgdGhpcy5kcmF3ZXIucmVtb3ZlQm9yZGVyKERpcmVjdGlvbi50b3ApO1xyXG4gICAgICAgIGlmIChmcmllbmRzLmZpbmQoKGNlbGwpID0+IChjZWxsLnggPT09IHRoaXMueCArIDEgJiYgY2VsbC55ID09PSB0aGlzLnkpKSAhPSBudWxsKVxyXG4gICAgICAgICAgICB0aGlzLmRyYXdlci5yZW1vdmVCb3JkZXIoRGlyZWN0aW9uLmJvdHRvbSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNlbGVjdCgpOiB2b2lkIHtcclxuICAgICAgICBpZih0aGlzLl9zZWxlY3RlZCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnRhYmxlLnNlbGVjdGVkQ2VsbHMucHVzaCh0aGlzKTtcclxuICAgICAgICB0aGlzLmRyYXdlci5zZWxlY3QoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VsZWN0Tm9uZSgpOiB2b2lkIHtcclxuICAgICAgICBpZighdGhpcy5fc2VsZWN0ZWQpIHJldHVybjtcclxuICAgICAgICB0aGlzLl9zZWxlY3RlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZHJhd2VyLnNlbGVjdE5vbmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaXNFbXB0eSgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kcmF3ZXIuaXNFbXB0eSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYmxvY2soKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5kcmF3ZXIuYmxvY2soKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGJsb2NrTm8oKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5kcmF3ZXIuYmxvY2tObygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1bmRvV3JpdGUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5kcmF3ZXIudW5kb1dyaXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVuZG9EZWxldGUodGV4dDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5kcmF3ZXIudW5kb0RlbGV0ZSh0ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkRGVjb3IoY3NzU3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5kcmF3ZXIuYWRkRGVjb3IoY3NzU3RyaW5nKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkRGVjb3JXaXRoRnJpZW5kcyhjc3NTdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5fZnJpZW5kcyA9PSBudWxsIHx8IHRoaXMuX2ZyaWVuZHMubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICB0aGlzLmFkZERlY29yKGNzc1N0cmluZyk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLl9mcmllbmRzLmZvckVhY2goKGZyaWVuZCkgPT4gZnJpZW5kLmFkZERlY29yKGNzc1N0cmluZykpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRNZXNzYWdlKHRleHQpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmRyYXdlci5hZGRNZXNzYWdlKHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDc3NTdHlsZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRyYXdlci5nZXRDc3NTdHlsZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgc2NyZWVuWCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRyYXdlci5zY3JlZW5YO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgc2NyZWVuWSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRyYXdlci5zY3JlZW5ZO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2VwYXJhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5zZXRGcmllbmRzKFt0aGlzXSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNlcGFyYXRlV2l0aG91dEZyaWVuZHMoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2ZyaWVuZHMgIT0gbnVsbCl7XHJcbiAgICAgICAgICAgIGxldCBpbmRleCA9IHRoaXMuX2ZyaWVuZHMuaW5kZXhPZih0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5fZnJpZW5kcy5zcGxpY2UoaW5kZXgsIGluZGV4KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZXBhcmF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXBhcmF0ZVdpdGhGcmllbmRzKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLl9mcmllbmRzID09IG51bGwpIHJldHVybjtcclxuICAgICAgICBsZXQgY2xvbmUgPSB0aGlzLl9mcmllbmRzO1xyXG4gICAgICAgIGNsb25lLmZvckVhY2goKGVsZW0pID0+IGVsZW0uc2VwYXJhdGUoKSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQge0NlbGx9IGZyb20gXCIuL0NlbGxcIjtcclxuaW1wb3J0IHtzdG9yZX0gZnJvbSBcIi4uL21haW4vVGFibGVQYWdlXCI7XHJcbmltcG9ydCB7RGlyZWN0aW9ufSBmcm9tIFwiLi4vdXRpbGl0aWVzL0RpcmVjdGlvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENlbGxEcmF3ZXIge1xyXG4gICAgcHJpdmF0ZSAkY2VsbDogSFRNTEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlICRzcGFuOiBIVE1MRWxlbWVudDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICAkcm93OiBIVE1MRWxlbWVudCxcclxuICAgICAgICBwcml2YXRlIGtlZXBlcjogQ2VsbFxyXG4gICAgKSB7XHJcbiAgICAgICAgdGhpcy5pbml0KCRyb3cpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdCgkcm93KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy4kc3BhbiA9IHRoaXMuJGNyZWF0ZVNwYW4oKTtcclxuICAgICAgICB0aGlzLiRjZWxsID0gdGhpcy4kY3JlYXRlQ2VsbCh0aGlzLiRzcGFuKTtcclxuICAgICAgICAkcm93LmFwcGVuZCh0aGlzLiRjZWxsKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlICRjcmVhdGVTcGFuKCk6IEhUTUxFbGVtZW50IHtcclxuICAgICAgICBsZXQgJHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgJHNwYW4uY2xhc3NOYW1lID0gJ3RleHQtbm93cmFwIG5vLXNob3ctZm9jdXMnO1xyXG4gICAgICAgICRzcGFuLm9ua2V5ZG93biA9IChldmVudCkgPT4gdGhpcy5rZWVwZXIub25LZXlkb3duKGV2ZW50KTtcclxuICAgICAgICAkc3Bhbi5vbmJsdXIgPSAoKSA9PiB0aGlzLmtlZXBlci5vbkJsdXIoJHNwYW4udGV4dENvbnRlbnQpO1xyXG4gICAgICAgICRzcGFuLm9uaW5wdXQgPSAoZXZlbnQpID0+IHRoaXMua2VlcGVyLm9uSW5wdXQoZXZlbnQpO1xyXG4gICAgICAgICRzcGFuLmNvbnRlbnRFZGl0YWJsZSA9ICd0cnVlJztcclxuICAgICAgICByZXR1cm4gJHNwYW47XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSAkY3JlYXRlQ2VsbCgkc3BhbjogSFRNTEVsZW1lbnQpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgICAgbGV0ICRjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgJGNlbGwuY2xhc3NOYW1lID0gJ2NvbWdyaWQtY2VsbCBib3JkZXItdG9wIGJvcmRlci1sZWZ0IGJvcmRlci1yaWdodCBib3JkZXItYm90dG9tIHRleHQtZGFyayc7XHJcbiAgICAgICAgJGNlbGwub25tb3VzZWVudGVyID0gKCkgPT4gdGhpcy5rZWVwZXIub25Nb3VzZWVudGVyKCk7XHJcbiAgICAgICAgJGNlbGwub25tb3VzZWRvd24gPSAoKSA9PiB0aGlzLmtlZXBlci5vbk1vdXNlZG93bigpO1xyXG4gICAgICAgICRjZWxsLm9uZHJhZ3N0YXJ0ID0gKCkgPT4gZmFsc2U7XHJcbiAgICAgICAgJGNlbGwub25jb250ZXh0bWVudSA9ICgpID0+IHRoaXMua2VlcGVyLm9uQ29udGV4dG1lbnUoKTtcclxuICAgICAgICAkY2VsbC5hcHBlbmQoJHNwYW4pO1xyXG4gICAgICAgIHJldHVybiAkY2VsbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZm9jdXMoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy4kc3Bhbi5mb2N1cygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZWxlY3QoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy4kY2VsbC5jbGFzc0xpc3QucmVtb3ZlKC4uLnN0b3JlLm5vU2VsZWN0ZWRDbGFzc2VzKTtcclxuICAgICAgICB0aGlzLiRjZWxsLmNsYXNzTGlzdC5hZGQoLi4uc3RvcmUuc2VsZWN0ZWRDbGFzc2VzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VsZWN0Tm9uZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLiRjZWxsLmNsYXNzTGlzdC5yZW1vdmUoLi4uc3RvcmUuc2VsZWN0ZWRDbGFzc2VzKTtcclxuICAgICAgICB0aGlzLiRjZWxsLmNsYXNzTGlzdC5hZGQoLi4uc3RvcmUubm9TZWxlY3RlZENsYXNzZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpc0VtcHR5KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLiRzcGFuLnRleHRDb250ZW50Lmxlbmd0aCA9PT0gMDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVtb3ZlQm9yZGVycyguLi5kaXJlY3Rpb25zOiBEaXJlY3Rpb25bXSk6IHZvaWQge1xyXG4gICAgICAgIGRpcmVjdGlvbnMuZm9yRWFjaCgoZGlyZWN0aW9uKSA9PiB0aGlzLnJlbW92ZUJvcmRlcihkaXJlY3Rpb24pKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVtb3ZlQm9yZGVyKGRpcmVjdGlvbjogRGlyZWN0aW9uKTogdm9pZCB7XHJcbiAgICAgICAgc3dpdGNoIChkaXJlY3Rpb24pIHtcclxuICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24uYm90dG9tOlxyXG4gICAgICAgICAgICAgICAgdGhpcy4kY2VsbC5jbGFzc0xpc3QucmVtb3ZlKCdib3JkZXItYm90dG9tJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLmxlZnQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRjZWxsLmNsYXNzTGlzdC5yZW1vdmUoJ2JvcmRlci1sZWZ0Jyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLnJpZ2h0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy4kY2VsbC5jbGFzc0xpc3QucmVtb3ZlKCdib3JkZXItcmlnaHQnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24udG9wOlxyXG4gICAgICAgICAgICAgICAgdGhpcy4kY2VsbC5jbGFzc0xpc3QucmVtb3ZlKCdib3JkZXItdG9wJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRCb3JkZXJzKC4uLmRpcmVjdGlvbnM6IERpcmVjdGlvbltdKTogdm9pZCB7XHJcbiAgICAgICAgZGlyZWN0aW9ucy5mb3JFYWNoKChkaXJlY3Rpb24pID0+IHRoaXMuYWRkQm9yZGVyKGRpcmVjdGlvbikpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRCb3JkZXIoZGlyZWN0aW9uOiBEaXJlY3Rpb24pOiB2b2lkIHtcclxuICAgICAgICBzd2l0Y2ggKGRpcmVjdGlvbikge1xyXG4gICAgICAgICAgICBjYXNlIERpcmVjdGlvbi5ib3R0b206XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRjZWxsLmNsYXNzTGlzdC5hZGQoJ2JvcmRlci1ib3R0b20nKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24ubGVmdDpcclxuICAgICAgICAgICAgICAgIHRoaXMuJGNlbGwuY2xhc3NMaXN0LmFkZCgnYm9yZGVyLWxlZnQnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24ucmlnaHQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRjZWxsLmNsYXNzTGlzdC5hZGQoJ2JvcmRlci1yaWdodCcpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBjYXNlIERpcmVjdGlvbi50b3A6XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRjZWxsLmNsYXNzTGlzdC5hZGQoJ2JvcmRlci10b3AnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGJsb2NrKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuJHNwYW4uY29udGVudEVkaXRhYmxlID0gJ2ZhbHNlJztcclxuICAgICAgICB0aGlzLiRzcGFuLmNsYXNzTGlzdC5hZGQoJ3VzZXItc2VsZWN0LW5vbmUnKTtcclxuICAgICAgICB0aGlzLiRjZWxsLm9uZGJsY2xpY2sgPSAoKSA9PiB0aGlzLmtlZXBlci5vbkRvdWJsZUNsaWNrKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGJsb2NrTm8oKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy4kc3Bhbi5jb250ZW50RWRpdGFibGUgPSAndHJ1ZSc7XHJcbiAgICAgICAgdGhpcy4kc3Bhbi5jbGFzc0xpc3QucmVtb3ZlKCd1c2VyLXNlbGVjdC1ub25lJyk7XHJcbiAgICAgICAgdGhpcy4kY2VsbC5vbmRibGNsaWNrID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdW5kb1dyaXRlKCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBsYXN0U3BhY2VJbmRleCA9IHRoaXMuJHNwYW4udGV4dENvbnRlbnQubGFzdEluZGV4T2YoJyAnKTtcclxuICAgICAgICBpZihsYXN0U3BhY2VJbmRleCA8IDApIHRoaXMuJHNwYW4udGV4dENvbnRlbnQgPSAnJztcclxuICAgICAgICBlbHNlIHRoaXMuJHNwYW4udGV4dENvbnRlbnQgPSB0aGlzLiRzcGFuLnRleHRDb250ZW50LnN1YnN0cigwLCBsYXN0U3BhY2VJbmRleCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVuZG9EZWxldGUodGV4dCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuJHNwYW4udGV4dENvbnRlbnQgKz0gdGV4dDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkRGVjb3IoY3NzU3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy4kY2VsbC5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCBjc3NTdHJpbmcpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRNZXNzYWdlKHRleHQpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLiRzcGFuLnRleHRDb250ZW50ID0gdGV4dDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q3NzU3R5bGUoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy4kY2VsbC5nZXRBdHRyaWJ1dGUoJ3N0eWxlJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBzY3JlZW5YKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuJGNlbGwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHNjcmVlblkoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy4kY2VsbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS55O1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHtDZWxsfSBmcm9tIFwiLi4vY2VsbC9DZWxsXCI7XHJcbmltcG9ydCB7VGFibGVNb2R9IGZyb20gXCIuL1RhYmxlTW9kXCI7XHJcbmltcG9ydCB7QWN0aW9uLCBBY3Rpb25UeXBlfSBmcm9tIFwiLi4vdXRpbGl0aWVzL0FjdGlvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRhYmxlIHtcclxuICAgIHByaXZhdGUgJHRhYmxlQ29udGFpbmVyID0gJCgnbWFpbicpO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGNlbGxzOiBDZWxsW11bXSA9IFtdO1xyXG4gICAgcHVibGljIG1vZDogVGFibGVNb2Q7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgc2VsZWN0ZWRDZWxsczogQ2VsbFtdID0gW107XHJcbiAgICBwcml2YXRlIGFjdGlvbnM6IEFjdGlvbltdID0gW107XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgd2lkdGg6IG51bWJlcjtcclxuICAgIHB1YmxpYyByZWFkb25seSBoZWlnaHQ6IG51bWJlcjtcclxuICAgIHByaXZhdGUgXyRwb3BvdmVyID0gJCgnI3BvcG92ZXInKTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9zdG9yZSkge1xyXG4gICAgICAgIHRoaXMud2lkdGggPSBfc3RvcmUud2lkdGg7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBfc3RvcmUuaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuZmlsbFRhYmxlKF9zdG9yZS5jZWxsc1VuaW9ucywgX3N0b3JlLmRlY29yYXRpb25zLCBfc3RvcmUubWVzc2FnZXMpO1xyXG4gICAgICAgIGxldCAkYm9keSA9ICQoJ2JvZHknKTtcclxuICAgICAgICAkYm9keS5vbignbW91c2V1cCcsICgpID0+IHRoaXMub25Cb2R5TW91c2V1cCgpKTtcclxuICAgICAgICAkYm9keS5vbigna2V5ZG93bicsIChldmVudCkgPT4gdGhpcy5vbkJvZHlLZXlkb3duKGV2ZW50KSk7XHJcbiAgICAgICAgJCgnI3BhZ2UtbmFtZScpLnRleHQoX3N0b3JlLm5hbWUpO1xyXG4gICAgICAgIHRoaXMuXyRwb3BvdmVyLm9uKCdtb3VzZXVwJywgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBmaWxsVGFibGUoY2VsbHNVbmlvbnMsIGRlY29yYXRpb25zLCBtZXNzYWdlcyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZmlsbFN0YXJ0VGFibGUoKTtcclxuICAgICAgICB0aGlzLnVuaW9uKGNlbGxzVW5pb25zKTtcclxuICAgICAgICB0aGlzLmRlY29yYXRlKGRlY29yYXRpb25zKTtcclxuICAgICAgICB0aGlzLmFkZE1lc3NhZ2VzKG1lc3NhZ2VzKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGZpbGxTdGFydFRhYmxlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY2VsbHMubGVuZ3RoID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGVpZ2h0OyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5jZWxscy5wdXNoKFtdKTtcclxuICAgICAgICAgICAgbGV0ICRyb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdyb3cnKTtcclxuICAgICAgICAgICAgJHJvdy5jbGFzc05hbWUgPSAnY29tZ3JpZC1yb3cnO1xyXG4gICAgICAgICAgICB0aGlzLiR0YWJsZUNvbnRhaW5lci5hcHBlbmQoJHJvdyk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy53aWR0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNlbGxzW2ldLnB1c2gobmV3IENlbGwoaSwgaiwgJHJvdywgdGhpcykpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdW5pb24oY2VsbHNVbmlvbnMpOiB2b2lkIHtcclxuICAgICAgICBjZWxsc1VuaW9ucy5mb3JFYWNoKHVuaW9uID0+IHRoaXMuY3JlYXRlVW5pb24odW5pb24pKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZVVuaW9uKGNlbGxzVW5pb24pOiB2b2lkIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gY2VsbHNVbmlvbi5sZWZ0VXBYOyBpIDw9IGNlbGxzVW5pb24ucmlnaHREb3duWDsgaSsrKVxyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gY2VsbHNVbmlvbi5sZWZ0VXBZOyBqIDw9IGNlbGxzVW5pb24ucmlnaHREb3duWTsgaisrKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRDZWxsKGksIGopLnNlbGVjdFdpdGhGcmllbmRzKHRydWUpO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0RG93bigpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZGVjb3JhdGUoZGVjb3JhdGlvbnMpOiB2b2lkIHtcclxuICAgICAgICBkZWNvcmF0aW9ucy5mb3JFYWNoKGRlY29yYXRpb24gPT4gdGhpcy5kZWNvcmF0ZU9uZShkZWNvcmF0aW9uKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkZWNvcmF0ZU9uZShkZWNvcmF0aW9uKTogdm9pZCB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IGRlY29yYXRpb24ubGVmdFVwWDsgaSA8PSBkZWNvcmF0aW9uLnJpZ2h0RG93blg7IGkrKylcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IGRlY29yYXRpb24ubGVmdFVwWTsgaiA8PSBkZWNvcmF0aW9uLnJpZ2h0RG93blk7IGorKylcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q2VsbChpLCBqKS5hZGREZWNvcihkZWNvcmF0aW9uLmNzc1RleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYWRkTWVzc2FnZXMobWVzc2FnZXMpOiB2b2lkIHtcclxuICAgICAgICBtZXNzYWdlcy5mb3JFYWNoKG1lc3NhZ2UgPT4gdGhpcy5nZXRDZWxsKG1lc3NhZ2UueCwgbWVzc2FnZS55KS5hZGRNZXNzYWdlKG1lc3NhZ2UudGV4dCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25Cb2R5TW91c2V1cCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLm1vZCA9IFRhYmxlTW9kLm5vbmU7XHJcbiAgICAgICAgdGhpcy5zZWxlY3REb3duKCk7XHJcbiAgICAgICAgdGhpcy5oaWRlUG9wb3ZlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2VsZWN0RG93bigpOiB2b2lkIHtcclxuICAgICAgICBsZXQgY2xvbmUgPSB0aGlzLnNlbGVjdGVkQ2VsbHMubWFwKGVsZW0gPT4gZWxlbSk7XHJcbiAgICAgICAgbGV0IHN0eWxlID0gY2xvbmVbMF0uZ2V0Q3NzU3R5bGUoKTtcclxuICAgICAgICB3aGlsZSAodGhpcy5zZWxlY3RlZENlbGxzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgbGV0IGNlbGwgPSB0aGlzLnNlbGVjdGVkQ2VsbHMucG9wKCk7XHJcbiAgICAgICAgICAgIGNlbGwuc2V0RnJpZW5kcyhjbG9uZSk7XHJcbiAgICAgICAgICAgIGNlbGwuc2VsZWN0Tm9uZSgpO1xyXG4gICAgICAgICAgICBjZWxsLmFkZERlY29yKHN0eWxlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvbkJvZHlLZXlkb3duKGV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgaWYgKGV2ZW50LmN0cmxLZXkgJiYgZXZlbnQuY29kZSA9PT0gJ0tleVonKSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMucG9wQWN0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDZWxsKHg6IG51bWJlciwgeTogbnVtYmVyKTogQ2VsbCB7XHJcbiAgICAgICAgaWYgKHggPj0gMCAmJiB4IDwgdGhpcy5oZWlnaHQgJiYgeSA+PSAwICYmIHkgPCB0aGlzLndpZHRoKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jZWxsc1t4XVt5XTtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcHVzaEFjdGlvbihhY3Rpb246IEFjdGlvbikge1xyXG4gICAgICAgIGxldCBsYXN0QWN0aW9uID0gdGhpcy5hY3Rpb25zW3RoaXMuYWN0aW9ucy5sZW5ndGggLSAxXTtcclxuICAgICAgICBpZiAobGFzdEFjdGlvbiAhPSBudWxsICYmIGxhc3RBY3Rpb25bMF0gPT09IEFjdGlvblR5cGUud3JpdGUgJiYgYWN0aW9uWzBdIDw9IEFjdGlvblR5cGUud3JpdGVXaXRoU3BhY2VcclxuICAgICAgICAgICAgJiYgbGFzdEFjdGlvblsxXSA9PT0gYWN0aW9uWzFdICYmIGxhc3RBY3Rpb25bMl0gPT09IGFjdGlvblsyXSlcclxuICAgICAgICAgICAgdGhpcy5hY3Rpb25zLnBvcCgpO1xyXG4gICAgICAgIHRoaXMuYWN0aW9ucy5wdXNoKGFjdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHBvcEFjdGlvbigpIHtcclxuICAgICAgICBsZXQgYWN0aW9uID0gdGhpcy5hY3Rpb25zLnBvcCgpO1xyXG4gICAgICAgIHN3aXRjaCAoYWN0aW9uWzBdKSB7XHJcbiAgICAgICAgICAgIGNhc2UgQWN0aW9uVHlwZS53cml0ZTpcclxuICAgICAgICAgICAgICAgIHRoaXMudW5kb1dyaXRlKGFjdGlvblsxXSwgYWN0aW9uWzJdKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgLy8gY2FzZSBBY3Rpb25UeXBlLmRlbGV0ZTpcclxuICAgICAgICAgICAgLy8gICAgIHRoaXMudW5kb0RlbGV0ZShhY3Rpb25bMV0sIGFjdGlvblsyXSwgYWN0aW9uWzNdKTtcclxuICAgICAgICAgICAgLy8gICAgIHJldHVybjtcclxuICAgICAgICAgICAgY2FzZSBBY3Rpb25UeXBlLndyaXRlV2l0aFNwYWNlOlxyXG4gICAgICAgICAgICAgICAgdGhpcy51bmRvV3JpdGUoYWN0aW9uWzFdLCBhY3Rpb25bMl0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVuZG9Xcml0ZSh4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuZ2V0Q2VsbCh4LCB5KS51bmRvV3JpdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVuZG9EZWxldGUoeDogbnVtYmVyLCB5OiBudW1iZXIsIHRleHQ6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuZ2V0Q2VsbCh4LCB5KS51bmRvRGVsZXRlKHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzaG93UG9wb3Zlcih4OiBudW1iZXIsIHk6IG51bWJlciwgY2VsbDogQ2VsbCl7XHJcbiAgICAgICAgdGhpcy5fJHBvcG92ZXIucmVtb3ZlQ2xhc3MoJ2Qtbm9uZScpO1xyXG4gICAgICAgIHRoaXMuXyRwb3BvdmVyLmF0dHIoJ3N0eWxlJywgYGxlZnQ6ICR7Y2VsbC5zY3JlZW5YICsgMTZ9cHg7IHRvcDogJHtjZWxsLnNjcmVlblkgKyAxNn1weDtgKTtcclxuICAgICAgICB0aGlzLl8kcG9wb3Zlci5maW5kKCcjY29vcmRzJykudGV4dChgJHt4fSwgJHt5fWApO1xyXG5cclxuICAgICAgICBsZXQgJGlucHV0ID0gdGhpcy5fJHBvcG92ZXIuZmluZCgnI2Nzc1N0eWxlSW5wdXQnKTtcclxuICAgICAgICAkaW5wdXQudmFsKGNlbGwuZ2V0Q3NzU3R5bGUoKSk7XHJcbiAgICAgICAgJGlucHV0Lm9mZignY2hhbmdlJyk7XHJcbiAgICAgICAgJGlucHV0Lm9uKCdjaGFuZ2UnLCAoKSA9PiBjZWxsLmFkZERlY29yV2l0aEZyaWVuZHMoJGlucHV0LnZhbCgpKSk7XHJcblxyXG4gICAgICAgIGxldCAkYnV0dG9uMSA9IHRoaXMuXyRwb3BvdmVyLmZpbmQoJyNlZGl0VGV4dEJ1dHRvbicpO1xyXG4gICAgICAgICRidXR0b24xLm9mZignY2xpY2snKTtcclxuICAgICAgICAkYnV0dG9uMS5vbignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNlbGwuZm9jdXMoKTtcclxuICAgICAgICAgICAgdGhpcy5oaWRlUG9wb3ZlcigpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsZXQgJGJ1dHRvbjIgPSB0aGlzLl8kcG9wb3Zlci5maW5kKCcjZGl2aWRlQnV0dG9uJyk7XHJcbiAgICAgICAgJGJ1dHRvbjIub2ZmKCdjbGljaycpO1xyXG4gICAgICAgICRidXR0b24yLm9uKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgY2VsbC5zZXBhcmF0ZVdpdGhGcmllbmRzKCk7XHJcbiAgICAgICAgICAgIGNlbGwuZm9jdXMoKTtcclxuICAgICAgICAgICAgdGhpcy5oaWRlUG9wb3ZlcigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBoaWRlUG9wb3Zlcigpe1xyXG4gICAgICAgIHRoaXMuXyRwb3BvdmVyLmFkZENsYXNzKCdkLW5vbmUnKTtcclxuICAgIH1cclxufSIsImV4cG9ydCBlbnVtIFRhYmxlTW9ke1xyXG4gICAgbm9uZSxcclxuICAgIHNlbGVjdGluZ1xyXG59IiwiaW1wb3J0IHtUYWJsZX0gZnJvbSBcIi4vVGFibGVcIjtcclxuaW1wb3J0IHtIdHRwQ2xpZW50fSBmcm9tIFwiLi4vLi4vdXRpbC9IdHRwQ2xpZW50XCI7XHJcbmltcG9ydCB7VGFibGVJbmZvUmVxdWVzdH0gZnJvbSBcIi4uLy4uL3V0aWwvcmVxdWVzdC9UYWJsZUluZm9SZXF1ZXN0XCI7XHJcbmltcG9ydCB7SXNMb2dnZWRJblJlcXVlc3R9IGZyb20gXCIuLi8uLi91dGlsL3JlcXVlc3QvSXNMb2dnZWRJblJlcXVlc3RcIjtcclxuaW1wb3J0IHtUYWJsZU1lc3NhZ2VzUmVxdWVzdH0gZnJvbSBcIi4uLy4uL3V0aWwvcmVxdWVzdC9UYWJsZU1lc3NhZ2VzUmVxdWVzdFwiO1xyXG5cclxubGV0IHRhYmxlO1xyXG5jb25zdCBsaW5rID0gXCJodHRwczovL2NvbWdyaWQucnU6ODQ0M1wiO1xyXG5sZXQgY2VsbHNVbmlvbnMgPSBbXHJcbiAgICB7XHJcbiAgICAgICAgbGVmdFVwWDogMTEsXHJcbiAgICAgICAgbGVmdFVwWTogMTQsXHJcbiAgICAgICAgcmlnaHREb3duWDogMTcsXHJcbiAgICAgICAgcmlnaHREb3duWTogMTdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgbGVmdFVwWDogMjIsXHJcbiAgICAgICAgbGVmdFVwWTogMTcsXHJcbiAgICAgICAgcmlnaHREb3duWDogMjQsXHJcbiAgICAgICAgcmlnaHREb3duWTogMzBcclxuICAgIH1cclxuXTtcclxuZXhwb3J0IGxldCBzdG9yZTogYW55ID0ge1xyXG4gICAgaGVpZ2h0OiA1MCxcclxuICAgIHdpZHRoOiA1MCxcclxuICAgIGNlbGxzVW5pb25zOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZWZ0VXBYOiAxMSxcclxuICAgICAgICAgICAgbGVmdFVwWTogMTQsXHJcbiAgICAgICAgICAgIHJpZ2h0RG93blg6IDE3LFxyXG4gICAgICAgICAgICByaWdodERvd25ZOiAxN1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZWZ0VXBYOiAyMixcclxuICAgICAgICAgICAgbGVmdFVwWTogMTcsXHJcbiAgICAgICAgICAgIHJpZ2h0RG93blg6IDI0LFxyXG4gICAgICAgICAgICByaWdodERvd25ZOiAzMFxyXG4gICAgICAgIH1cclxuICAgIF0sXHJcbiAgICBkZWNvcmF0aW9uczogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGVmdFVwWDogMTEsXHJcbiAgICAgICAgICAgIGxlZnRVcFk6IDE0LFxyXG4gICAgICAgICAgICByaWdodERvd25YOiAxNyxcclxuICAgICAgICAgICAgcmlnaHREb3duWTogMTcsXHJcbiAgICAgICAgICAgIGNzc1RleHQ6IFwiYmFja2dyb3VuZC1jb2xvcjogYmx1ZTsgY29sb3I6IHllbGxvdyAhaW1wb3J0YW50OyBib3JkZXItY29sb3I6IHJlZCAhaW1wb3J0YW50O1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxlZnRVcFg6IDMxLFxyXG4gICAgICAgICAgICBsZWZ0VXBZOiA0MSxcclxuICAgICAgICAgICAgcmlnaHREb3duWDogMzEsXHJcbiAgICAgICAgICAgIHJpZ2h0RG93blk6IDQxLFxyXG4gICAgICAgICAgICBjc3NUZXh0OiBcImJhY2tncm91bmQtY29sb3I6IHJnYigyMDQsMTEsMTEpOyBjb2xvcjogZ3JlZW4gIWltcG9ydGFudDsgYm9yZGVyLWNvbG9yOiBibHVlICFpbXBvcnRhbnQ7XCJcclxuICAgICAgICB9XHJcbiAgICBdLFxyXG4gICAgbWVzc2FnZXM6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHg6IDIyLFxyXG4gICAgICAgICAgICB5OiAxNyxcclxuICAgICAgICAgICAgdGV4dDogXCLQoNC10LHRj9GC0LAsINC/0YDQuNCy0LXRgiwg0YfRgtC+INC30LDQtNCw0LvQuCDQv9C+INC/0YDQtdC60YDQsNGB0L3QvtC5INC20LjQt9C90Lgg0LHQtdC3INC30LDQsdC+0YI/XCJcclxuICAgICAgICB9XHJcbiAgICBdLFxyXG4gICAgc2VsZWN0ZWRDbGFzc2VzOiBbJ2JnLWRhcmsnLCAndGV4dC1saWdodCddLFxyXG4gICAgbm9TZWxlY3RlZENsYXNzZXM6IFsndGV4dC1kYXJrJ11cclxufVxyXG5cclxuY29uc3QgaHR0cENsaWVudCA9IG5ldyBIdHRwQ2xpZW50KGxpbmspO1xyXG4kKHdpbmRvdykub24oJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICBodHRwQ2xpZW50LnByb2NlZWRSZXF1ZXN0KFxyXG4gICAgICAgIG5ldyBJc0xvZ2dlZEluUmVxdWVzdCgpLFxyXG4gICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgYWxlcnQoXCJZb3UncmUgbm90IGxvZ2dlZCBpbiwgcGxlYXNlIGxvZyBpblwiKVxyXG4gICAgICAgIH1cclxuICAgICkudGhlbihsb2FkVGFibGUpXHJcbiAgICAudGhlbihsb2FkVGFibGVNZXNzYWdlcylcclxuICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlRhYmxlIG1lc3NhZ2VzXCIpXHJcbiAgICAgICAgc3RvcmUuY2VsbHNVbmlvbnMgPSBjZWxsc1VuaW9ucztcclxuICAgICAgICB0YWJsZSA9IG5ldyBUYWJsZShzdG9yZSk7XHJcbiAgICB9KVxyXG59KTtcclxuXHJcbmZ1bmN0aW9uIGxvYWRUYWJsZSgpe1xyXG4gICAgbGV0IGNoYXRJZCA9IHBhcnNlSW50KGdldFBhcmFtKCdpZCcpKTtcclxuICAgIHJldHVybiBodHRwQ2xpZW50LnByb2NlZWRSZXF1ZXN0KFxyXG4gICAgICAgIG5ldyBUYWJsZUluZm9SZXF1ZXN0KHtcclxuICAgICAgICAgICAgY2hhdElkOiBjaGF0SWRcclxuICAgICAgICB9KSxcclxuICAgICAgICAoY29kZSwgZXJyb3JUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGlmKGNvZGUgPT09IDQwNCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJUYWJsZSBub3QgZm91bmRcIilcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3I6ICcke2NvZGV9LCAke2Vycm9yVGV4dH0nIHdoaWxlIGxvYWRpbmcgdGFibGUgaW5mb2ApXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICApLnRoZW4oKHRhYmxlKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2codGFibGUpXHJcbiAgICAgICAgc3RvcmUgPSB0YWJsZVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvYWRUYWJsZU1lc3NhZ2VzKCl7XHJcbiAgICBsZXQgY2hhdElkID0gcGFyc2VJbnQoZ2V0UGFyYW0oJ2lkJykpO1xyXG4gICAgcmV0dXJuIGh0dHBDbGllbnQucHJvY2VlZFJlcXVlc3QoXHJcbiAgICAgICAgbmV3IFRhYmxlTWVzc2FnZXNSZXF1ZXN0KHtcclxuICAgICAgICAgICAgY2hhdGlkOiBjaGF0SWQsXHJcbiAgICAgICAgICAgIHhjb29yZExlZnRUb3A6IDAsXHJcbiAgICAgICAgICAgIHljb29yZExlZnRUb3A6IDAsXHJcbiAgICAgICAgICAgIHhjb29yZFJpZ2h0Qm90dG9tOiBzdG9yZS53aWR0aCAtIDEsXHJcbiAgICAgICAgICAgIHljb29yZFJpZ2h0Qm90dG9tOiBzdG9yZS5oZWlnaHQgLSAxLFxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIChjb2RlLCBlcnJvclRleHQpID0+IHtcclxuICAgICAgICAgICAgaWYoY29kZSA9PT0gNDAzICYmIGVycm9yVGV4dCA9PT0gXCJhY2Nlc3MuY2hhdC5yZWFkX21lc3NhZ2VzXCIpe1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJZb3UgZG9uJ3QgaGF2ZSBlbm91Z2ggcmlnaHRzIHRvIGFjY2VzcyB0aGlzIGNoYXRcIilcclxuICAgICAgICAgICAgfWVsc2UgaWYoY29kZSA9PT0gNDIyICYmIChlcnJvclRleHQgPT09IFwib3V0X29mX2JvdW5kc1wiIHx8XHJcbiAgICAgICAgICAgICAgICBlcnJvclRleHQgPT09IFwidGltZS5uZWdhdGl2ZS1vci1mdXR1cmVcIlxyXG4gICAgICAgICAgICApKXsgLy8gc2hvdWxkIG5vdCBoYXBwZW5cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBoZWlnaHQ6ICR7c3RvcmUuaGVpZ2h0IC0gMX0sIHdpZHRoOiAke3N0b3JlLndpZHRoIC0gMX1gKVxyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJTaG91bGQgbm90IGhhcHBlbiwgc2VlIGNvbnNvbGVcIilcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICkudGhlbigobWVzc2FnZXMpID0+IHtcclxuICAgICAgICBzdG9yZS5tZXNzYWdlcyA9IG1lc3NhZ2VzXHJcbiAgICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0UGFyYW0obmFtZTogc3RyaW5nKTogc3RyaW5ne1xyXG4gICAgY29uc3QgdXJsUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKVxyXG4gICAgcmV0dXJuIHVybFBhcmFtcy5nZXQobmFtZSlcclxufVxyXG4iLCJcclxuZXhwb3J0IGVudW0gQWN0aW9uVHlwZSB7XHJcbiAgICB3cml0ZSxcclxuICAgIHdyaXRlV2l0aFNwYWNlLFxyXG4gICAgZGVsZXRlLFxyXG4gICAgdW5pb25cclxufVxyXG5cclxuZXhwb3J0IHR5cGUgQWN0aW9uID0gW2FjdGlvblR5cGU6IEFjdGlvblR5cGUsIGNlbGxYOiBudW1iZXIsIGNlbGxZOiBudW1iZXIsIGluZm8/OiBhbnldOyIsImV4cG9ydCBlbnVtIERpcmVjdGlvbntcclxuICAgIGxlZnQsXHJcbiAgICByaWdodCxcclxuICAgIHRvcCxcclxuICAgIGJvdHRvbVxyXG59IiwiaW1wb3J0IHtSZXF1ZXN0V3JhcHBlcn0gZnJvbSBcIi4vcmVxdWVzdC9SZXF1ZXN0XCI7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEh0dHBDbGllbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBhcGlMaW5rOiBzdHJpbmcpIHt9XHJcblxyXG4gICAgYXN5bmMgcHJvY2VlZFJlcXVlc3Q8VD4oXHJcbiAgICAgICAgcmVxdWVzdDogUmVxdWVzdFdyYXBwZXI8VD4sXHJcbiAgICAgICAgb25GYWlsdXJlOiAoY29kZTogbnVtYmVyLCBlcnJvclRleHQ6IHN0cmluZykgPT4gdW5rbm93biA9XHJcbiAgICAgICAgICAgIChjb2RlLCBlcnJvclRleHQpID0+IGFsZXJ0KGBjb2RlOiAke2NvZGV9LCBlcnJvcjogJHtlcnJvclRleHR9YCksXHJcbiAgICAgICAgb25OZXR3b3JrRmFpbHVyZTogKHJlYXNvbikgPT4gdW5rbm93biA9XHJcbiAgICAgICAgICAgIChyZWFzb24pID0+IGFsZXJ0KGBuZXR3b3JrIGVycm9yOiAke3JlYXNvbn1gKVxyXG4gICAgKTogUHJvbWlzZTxUPntcclxuICAgICAgICBjb25zdCBmaW5hbExpbmsgPSBuZXcgVVJMKHRoaXMuYXBpTGluayArIHJlcXVlc3QuZW5kcG9pbnQpXHJcbiAgICAgICAgaWYocmVxdWVzdC5wYXJhbWV0ZXJzICE9IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgZmluYWxMaW5rLnNlYXJjaCA9IG5ldyBVUkxTZWFyY2hQYXJhbXMocmVxdWVzdC5wYXJhbWV0ZXJzKS50b1N0cmluZygpXHJcblxyXG4gICAgICAgIHJldHVybiBmZXRjaChcclxuICAgICAgICAgICAgZmluYWxMaW5rLnRvU3RyaW5nKCksXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcImluY2x1ZGVcIixcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogcmVxdWVzdC5tZXRob2RUeXBlLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyczogcmVxdWVzdC5oZWFkZXJzLFxyXG4gICAgICAgICAgICAgICAgYm9keTogcmVxdWVzdC5ib2R5XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApLnRoZW4oKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnByb2NlZWRSZXF1ZXN0KHJlc3BvbnNlKVxyXG4gICAgICAgICAgICAgICAgLy8gaWYocmVzcG9uc2UuaGVhZGVycy5nZXQoXCJDb250ZW50LVR5cGVcIikuc3RhcnRzV2l0aChcImltYWdlXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgcmVzcG9uc2UuYmxvYigpLnRoZW4oYmxvYiA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIG9uU3VjY2VzcyhibG9iKVxyXG4gICAgICAgICAgICAgICAgLy8gICAgIH0pXHJcbiAgICAgICAgICAgICAgICAvLyB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgcmVzcG9uc2UudGV4dCgpLnRoZW4odGV4dCA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIG9uU3VjY2Vzcyh0ZXh0KVxyXG4gICAgICAgICAgICAgICAgLy8gICAgIH0pXHJcbiAgICAgICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UudGV4dCgpLnRoZW4odGV4dCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgb25GYWlsdXJlKHJlc3BvbnNlLnN0YXR1cywgdGV4dClcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QodGV4dClcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZW51bSBNZXRob2RUeXBle1xyXG4gICAgUE9TVD1cIlBPU1RcIixcclxuICAgIEdFVD1cIkdFVFwiLFxyXG4gICAgUEFUQ0g9XCJQQVRDSFwiLFxyXG4gICAgUFVUPVwiUFVUXCIsXHJcbn0iLCJpbXBvcnQge1JlcXVlc3RXcmFwcGVyfSBmcm9tIFwiLi9SZXF1ZXN0XCI7XHJcbmltcG9ydCB7TWV0aG9kVHlwZX0gZnJvbSBcIi4uL0h0dHBDbGllbnRcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgSXNMb2dnZWRJblJlcXVlc3QgaW1wbGVtZW50cyBSZXF1ZXN0V3JhcHBlcjxudW1iZXI+e1xyXG4gICAgcmVhZG9ubHkgZW5kcG9pbnQ6IHN0cmluZyA9ICcvdXNlci9sb2dpbic7XHJcbiAgICByZWFkb25seSBtZXRob2RUeXBlOiBNZXRob2RUeXBlID0gTWV0aG9kVHlwZS5HRVQ7XHJcblxyXG4gICAgYXN5bmMgcHJvY2VlZFJlcXVlc3QocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTxudW1iZXI+IHtcclxuICAgICAgICByZXR1cm4gcmVzcG9uc2Uuc3RhdHVzO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHtNZXRob2RUeXBlfSBmcm9tIFwiLi4vSHR0cENsaWVudFwiO1xyXG5pbXBvcnQge1JlcXVlc3RXcmFwcGVyfSBmcm9tIFwiLi9SZXF1ZXN0XCI7XHJcbmltcG9ydCB7VGFibGVSZXNwb25zZX0gZnJvbSBcIi4vQ3JlYXRlVGFibGVSZXF1ZXN0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVGFibGVJbmZvUmVxdWVzdCBpbXBsZW1lbnRzIFJlcXVlc3RXcmFwcGVyPFRhYmxlUmVzcG9uc2U+IHtcclxuICAgIHJlYWRvbmx5IGJvZHk6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBib2R5OiB7XHJcbiAgICAgICAgICAgIGNoYXRJZDogbnVtYmVyLFxyXG4gICAgICAgICAgICBpbmNsdWRlUGFydGljaXBhbnRzPzogYm9vbGVhblxyXG4gICAgICAgIH1cclxuICAgICkge1xyXG4gICAgICAgIHRoaXMuYm9keSA9IEpTT04uc3RyaW5naWZ5KGJvZHkpXHJcbiAgICB9XHJcblxyXG4gICAgcmVhZG9ubHkgZW5kcG9pbnQ6IHN0cmluZyA9IFwiL3RhYmxlL2luZm9cIjtcclxuICAgIHJlYWRvbmx5IG1ldGhvZFR5cGU6IE1ldGhvZFR5cGUgPSBNZXRob2RUeXBlLkdFVDtcclxuXHJcbiAgICBhc3luYyBwcm9jZWVkUmVxdWVzdChyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPFRhYmxlUmVzcG9uc2U+IHtcclxuICAgICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpXHJcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodGV4dCkgYXMgVGFibGVSZXNwb25zZVxyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCB7UmVxdWVzdFdyYXBwZXJ9IGZyb20gXCIuL1JlcXVlc3RcIjtcclxuaW1wb3J0IHtNZXRob2RUeXBlfSBmcm9tIFwiLi4vSHR0cENsaWVudFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1lc3NhZ2VSZXNwb25zZXtcclxuICAgIHJlYWRvbmx5IGlkITogbnVtYmVyXHJcbiAgICByZWFkb25seSB4ITogbnVtYmVyXHJcbiAgICByZWFkb25seSB5ITogbnVtYmVyXHJcbiAgICByZWFkb25seSBjaGF0SWQhOiBudW1iZXJcclxuICAgIHJlYWRvbmx5IHRpbWUhOiBEYXRlXHJcbiAgICByZWFkb25seSBzZW5kZXJJZCE6IHN0cmluZ1xyXG4gICAgcmVhZG9ubHkgdGV4dCE6IHN0cmluZ1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVGFibGVNZXNzYWdlc1JlcXVlc3QgaW1wbGVtZW50cyBSZXF1ZXN0V3JhcHBlcjxNZXNzYWdlUmVzcG9uc2VbXT57XHJcbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBib2R5OiB7XHJcbiAgICAgICAgY2hhdGlkOiBudW1iZXIsXHJcbiAgICAgICAgeGNvb3JkTGVmdFRvcDogbnVtYmVyLFxyXG4gICAgICAgIHljb29yZExlZnRUb3A6IG51bWJlcixcclxuICAgICAgICB4Y29vcmRSaWdodEJvdHRvbTogbnVtYmVyLFxyXG4gICAgICAgIHljb29yZFJpZ2h0Qm90dG9tOiBudW1iZXIsXHJcbiAgICAgICAgc2luY2VEYXRlVGltZU1pbGxpcz86IG51bWJlcixcclxuICAgICAgICB1bnRpbERhdGVUaW1lTWlsbGlzPzogbnVtYmVyLFxyXG4gICAgfSkge31cclxuICAgIHJlYWRvbmx5IGVuZHBvaW50OiBzdHJpbmcgPSAnL21lc3NhZ2VzL2xpc3QnO1xyXG4gICAgcmVhZG9ubHkgaGVhZGVyczogSGVhZGVyc0luaXQgPSB7XHJcbiAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcclxuICAgIH07XHJcbiAgICByZWFkb25seSBtZXRob2RUeXBlOiBNZXRob2RUeXBlID0gTWV0aG9kVHlwZS5QT1NUO1xyXG5cclxuICAgIGFzeW5jIHByb2NlZWRSZXF1ZXN0KHJlc3BvbnNlOiBSZXNwb25zZSk6IFByb21pc2U8TWVzc2FnZVJlc3BvbnNlW10+IHtcclxuICAgICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xyXG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHRleHQpIGFzIE1lc3NhZ2VSZXNwb25zZVtdO1xyXG4gICAgfVxyXG5cclxufSJdfQ==
