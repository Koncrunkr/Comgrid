(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cell = void 0;
var CellDrawer_1 = require("./CellDrawer");
var TableMod_1 = require("../Main/TableMod");
var Direction_1 = require("../Utilities/Direction");
var Action_1 = require("../Utilities/Action");
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
},{"../Main/TableMod":4,"../Utilities/Action":6,"../Utilities/Direction":7,"./CellDrawer":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CellDrawer = void 0;
var TablePage_1 = require("../Main/TablePage");
var Direction_1 = require("../Utilities/Direction");
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
},{"../Main/TablePage":5,"../Utilities/Direction":7}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = void 0;
var Cell_1 = require("../Cell/Cell");
var TableMod_1 = require("./TableMod");
var Action_1 = require("../Utilities/Action");
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
},{"../Cell/Cell":1,"../Utilities/Action":6,"./TableMod":4}],4:[function(require,module,exports){
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
$(window).on('load', function () {
    checkAuthorization()
        .then(function () { return getTableInfo(); })
        .then(function () { return getTableMessages(); })
        .then(function () {
        console.log("Table messages");
        exports.store.cellsUnions = cellsUnions;
        table = new Table_1.Table(exports.store);
    });
});
function checkAuthorization() {
    return fetch(link + "/user/login", {
        credentials: "include",
        method: "GET",
        headers: { "Content-Type": "application/json" }
    }).then(function (response) {
        if (response.status !== 200) {
            window.location.href = link + "/oauth2/authorization/google";
            return Promise.reject();
        }
    });
}
function getParam(name) {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}
function getTableInfo() {
    var id = getParam("id");
    return fetch(link + "/table/info?chatId=" + id, {
        credentials: "include",
        method: "GET",
        headers: { "Content-Type": "application/json" }
    }).then(function (result) {
        result.text().then(function (text) {
            if (result.status == 200) {
                exports.store = JSON.parse(text);
                console.log(exports.store);
            }
            else {
                console.log(result.status + ", " + text);
                alert("Error occurred: see console for more details");
                throw new TypeError("Error occurred: see console for more details");
            }
        });
    });
}
function getTableMessages() {
    var id = getParam("id");
    return fetch(link + "/message/list", {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chatId: +id,
            xCoordLeftTop: 0,
            yCoordLeftTop: 0,
            xCoordRightBottom: exports.store.height - 1,
            yCoordLeftBottom: exports.store.width - 1
        })
    }).then(function (result) {
        return result.text().then(function (text) {
            if (result.status == 200) {
                exports.store.messages = JSON.parse(text);
                console.log(exports.store.messages);
            }
            else {
                console.log(result.status + ", " + text);
                alert("Error occurred: see console for more details");
                throw new TypeError("Error occurred: see console for more details");
            }
        });
    });
}
},{"./Table":3}],6:[function(require,module,exports){
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
},{}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJUU2NyaXB0L1RhYmxlUGFnZS9DZWxsL0NlbGwudHMiLCJUU2NyaXB0L1RhYmxlUGFnZS9DZWxsL0NlbGxEcmF3ZXIudHMiLCJUU2NyaXB0L1RhYmxlUGFnZS9NYWluL1RhYmxlLnRzIiwiVFNjcmlwdC9UYWJsZVBhZ2UvTWFpbi9UYWJsZU1vZC50cyIsIlRTY3JpcHQvVGFibGVQYWdlL01haW4vVGFibGVQYWdlLnRzIiwiVFNjcmlwdC9UYWJsZVBhZ2UvVXRpbGl0aWVzL0FjdGlvbi50cyIsIlRTY3JpcHQvVGFibGVQYWdlL1V0aWxpdGllcy9EaXJlY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNBQSwyQ0FBd0M7QUFFeEMsNkNBQTBDO0FBQzFDLG9EQUFpRDtBQUNqRCw4Q0FBK0M7QUFLL0M7SUFNSSxjQUNvQixDQUFTLEVBQ1QsQ0FBUyxFQUN6QixJQUFpQixFQUNELEtBQVk7UUFIWixNQUFDLEdBQUQsQ0FBQyxDQUFRO1FBQ1QsTUFBQyxHQUFELENBQUMsQ0FBUTtRQUVULFVBQUssR0FBTCxLQUFLLENBQU87UUFFNUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLHVCQUFVLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRCxzQkFBVywyQkFBUzthQUFwQjtZQUFBLGlCQVVDO1lBVEcsT0FBTyxDQUFDLFVBQUEsS0FBSztnQkFDVCxJQUFJLEtBQUssQ0FBQyxPQUFPO29CQUFFLE9BQU87Z0JBQzFCLElBQUksS0FBSyxDQUFDLFFBQVE7b0JBQUUsT0FBTztnQkFDM0IsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLFNBQVM7b0JBQUUsS0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUM3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QUksT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFDLElBQUksSUFBSyxPQUFBLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBNUMsQ0FBNEMsQ0FBQyxJQUFJLElBQUk7WUFDNUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMscUJBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFJLElBQUssT0FBQSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQTVDLENBQTRDLENBQUMsSUFBSSxJQUFJO1lBQzVFLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLHFCQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0MsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSSxJQUFLLE9BQUEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSSxDQUFDLENBQUMsQ0FBQyxFQUE1QyxDQUE0QyxDQUFDLElBQUksSUFBSTtZQUM1RSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxxQkFBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVDLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFDLElBQUksSUFBSyxPQUFBLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUksQ0FBQyxDQUFDLENBQUMsRUFBNUMsQ0FBNEMsQ0FBQyxJQUFJLElBQUk7WUFDNUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZ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QUE7SUFDSiwyQ0FBSyxDQUFBO0lBQ0wsdUNBQUcsQ0FBQTtJQUNILDZDQUFNLENBQUE7QUFDVixDQUFDLEVBTFcsU0FBUyxHQUFULGlCQUFTLEtBQVQsaUJBQVMsUUFLcEIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQge0NlbGxEcmF3ZXJ9IGZyb20gXCIuL0NlbGxEcmF3ZXJcIjtcclxuaW1wb3J0IHtUYWJsZX0gZnJvbSBcIi4uL01haW4vVGFibGVcIjtcclxuaW1wb3J0IHtUYWJsZU1vZH0gZnJvbSBcIi4uL01haW4vVGFibGVNb2RcIjtcclxuaW1wb3J0IHtEaXJlY3Rpb259IGZyb20gXCIuLi9VdGlsaXRpZXMvRGlyZWN0aW9uXCI7XHJcbmltcG9ydCB7QWN0aW9uVHlwZX0gZnJvbSBcIi4uL1V0aWxpdGllcy9BY3Rpb25cIjtcclxuaW1wb3J0IHtjc3N9IGZyb20gXCJqcXVlcnlcIjtcclxuXHJcbnR5cGUgb25UcmlnZ2VyID0gKGV2ZW50PzogYW55KSA9PiB2b2lkIHwgYm9vbGVhblxyXG5cclxuZXhwb3J0IGNsYXNzIENlbGwge1xyXG4gICAgcHJpdmF0ZSBkcmF3ZXI6IENlbGxEcmF3ZXI7XHJcbiAgICBwcml2YXRlIF9mcmllbmRzOiBDZWxsW107XHJcbiAgICBwcml2YXRlIF9ibG9ja2VkOiBib29sZWFuO1xyXG4gICAgcHJpdmF0ZSBfc2VsZWN0ZWQ6IGJvb2xlYW47XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHVibGljIHJlYWRvbmx5IHg6IG51bWJlcixcclxuICAgICAgICBwdWJsaWMgcmVhZG9ubHkgeTogbnVtYmVyLFxyXG4gICAgICAgICRyb3c6IEhUTUxFbGVtZW50LFxyXG4gICAgICAgIHB1YmxpYyByZWFkb25seSB0YWJsZTogVGFibGVcclxuICAgICkge1xyXG4gICAgICAgIHRoaXMuZHJhd2VyID0gbmV3IENlbGxEcmF3ZXIoJHJvdywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBvbktleWRvd24oKTogb25UcmlnZ2VyIHtcclxuICAgICAgICByZXR1cm4gKGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgaWYgKGV2ZW50LmN0cmxLZXkpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKGV2ZW50LnNoaWZ0S2V5KSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmIChldmVudC5jb2RlID09PSAnQXJyb3dVcCcpIHRoaXMudGFibGUuZ2V0Q2VsbCh0aGlzLnggLSAxLCB0aGlzLnkpLmZvY3VzKCk7XHJcbiAgICAgICAgICAgIGlmIChldmVudC5jb2RlID09PSAnQXJyb3dEb3duJyB8fCBldmVudC5jb2RlID09PSAnRW50ZXInKSB0aGlzLnRhYmxlLmdldENlbGwodGhpcy54ICsgMSwgdGhpcy55KS5mb2N1cygpO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNFbXB0eSgpKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmIChldmVudC5jb2RlID09PSAnQXJyb3dMZWZ0JykgdGhpcy50YWJsZS5nZXRDZWxsKHRoaXMueCwgdGhpcy55IC0gMSkuZm9jdXMoKTtcclxuICAgICAgICAgICAgaWYgKGV2ZW50LmNvZGUgPT09ICdBcnJvd1JpZ2h0JykgdGhpcy50YWJsZS5nZXRDZWxsKHRoaXMueCwgdGhpcy55ICsgMSkuZm9jdXMoKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgb25Nb3VzZWVudGVyKCk6IG9uVHJpZ2dlciB7XHJcbiAgICAgICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudGFibGUubW9kICE9PSBUYWJsZU1vZC5zZWxlY3RpbmcpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RXaXRoRnJpZW5kcygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG9uTW91c2Vkb3duKCk6IG9uVHJpZ2dlciB7XHJcbiAgICAgICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy50YWJsZS5tb2QgPSBUYWJsZU1vZC5zZWxlY3Rpbmc7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0V2l0aEZyaWVuZHMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBvbkRvdWJsZUNsaWNrKCk6IG9uVHJpZ2dlciB7XHJcbiAgICAgICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5mb2N1cygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG9uQmx1cigpOiBvblRyaWdnZXIge1xyXG4gICAgICAgIHJldHVybiAodGV4dDogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKHRleHQubGVuZ3RoICE9PSAwKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5ibG9jaygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG9uSW5wdXQoKTogb25UcmlnZ2VyIHtcclxuICAgICAgICByZXR1cm4gKGV2ZW50OiBhbnkpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZXZlbnQuaW5wdXRUeXBlKTtcclxuICAgICAgICAgICAgaWYoZXZlbnQuaW5wdXRUeXBlWzBdID09PSAnaScpXHJcbiAgICAgICAgICAgICAgICBpZihldmVudC5kYXRhID09PSAnICcpIHRoaXMudGFibGUucHVzaEFjdGlvbihbQWN0aW9uVHlwZS53cml0ZVdpdGhTcGFjZSwgdGhpcy54LCB0aGlzLnldKTtcclxuICAgICAgICAgICAgICAgIGVsc2UgdGhpcy50YWJsZS5wdXNoQWN0aW9uKFtBY3Rpb25UeXBlLndyaXRlLCB0aGlzLngsIHRoaXMueV0pO1xyXG4gICAgICAgICAgICBlbHNlIGlmKGV2ZW50LmlucHV0VHlwZVswXSA9PT0gJ2QnKVxyXG4gICAgICAgICAgICAgICAgdGhpcy50YWJsZS5wdXNoQWN0aW9uKFtBY3Rpb25UeXBlLmRlbGV0ZSwgdGhpcy54LCB0aGlzLnksIGV2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKCd0ZXh0L2h0bWwnKV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG9uQ29udGV4dG1lbnUoKTogb25UcmlnZ2VyIHtcclxuICAgICAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnRhYmxlLnNob3dQb3BvdmVyKHRoaXMueCwgdGhpcy55LCB0aGlzKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZm9jdXMoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5kcmF3ZXIuYmxvY2tObygpO1xyXG4gICAgICAgIHRoaXMuZHJhd2VyLmZvY3VzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNlbGVjdFdpdGhGcmllbmRzKHllczogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5fZnJpZW5kcyA9PSBudWxsIHx8IHRoaXMuX2ZyaWVuZHMubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICB5ZXMgPyB0aGlzLnNlbGVjdCgpIDogdGhpcy5zZWxlY3ROb25lKCk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLl9mcmllbmRzLmZvckVhY2goKGZyaWVuZCkgPT4geWVzID8gZnJpZW5kLnNlbGVjdCgpIDogZnJpZW5kLnNlbGVjdE5vbmUoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldEZyaWVuZHMoZnJpZW5kczogQ2VsbFtdKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fZnJpZW5kcyA9IGZyaWVuZHM7XHJcbiAgICAgICAgdGhpcy5kcmF3ZXIuYWRkQm9yZGVycyhEaXJlY3Rpb24udG9wLCBEaXJlY3Rpb24uYm90dG9tLCBEaXJlY3Rpb24ubGVmdCwgRGlyZWN0aW9uLnJpZ2h0KVxyXG4gICAgICAgIGlmIChmcmllbmRzLmZpbmQoKGNlbGwpID0+IChjZWxsLnggPT09IHRoaXMueCAmJiBjZWxsLnkgPT09IHRoaXMueSArIDEpKSAhPSBudWxsKVxyXG4gICAgICAgICAgICB0aGlzLmRyYXdlci5yZW1vdmVCb3JkZXIoRGlyZWN0aW9uLnJpZ2h0KTtcclxuICAgICAgICBpZiAoZnJpZW5kcy5maW5kKChjZWxsKSA9PiAoY2VsbC54ID09PSB0aGlzLnggJiYgY2VsbC55ID09PSB0aGlzLnkgLSAxKSkgIT0gbnVsbClcclxuICAgICAgICAgICAgdGhpcy5kcmF3ZXIucmVtb3ZlQm9yZGVyKERpcmVjdGlvbi5sZWZ0KTtcclxuICAgICAgICBpZiAoZnJpZW5kcy5maW5kKChjZWxsKSA9PiAoY2VsbC54ID09PSB0aGlzLnggLSAxICYmIGNlbGwueSA9PT0gdGhpcy55KSkgIT0gbnVsbClcclxuICAgICAgICAgICAgdGhpcy5kcmF3ZXIucmVtb3ZlQm9yZGVyKERpcmVjdGlvbi50b3ApO1xyXG4gICAgICAgIGlmIChmcmllbmRzLmZpbmQoKGNlbGwpID0+IChjZWxsLnggPT09IHRoaXMueCArIDEgJiYgY2VsbC55ID09PSB0aGlzLnkpKSAhPSBudWxsKVxyXG4gICAgICAgICAgICB0aGlzLmRyYXdlci5yZW1vdmVCb3JkZXIoRGlyZWN0aW9uLmJvdHRvbSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNlbGVjdCgpOiB2b2lkIHtcclxuICAgICAgICBpZih0aGlzLl9zZWxlY3RlZCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnRhYmxlLnNlbGVjdGVkQ2VsbHMucHVzaCh0aGlzKTtcclxuICAgICAgICB0aGlzLmRyYXdlci5zZWxlY3QoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VsZWN0Tm9uZSgpOiB2b2lkIHtcclxuICAgICAgICBpZighdGhpcy5fc2VsZWN0ZWQpIHJldHVybjtcclxuICAgICAgICB0aGlzLl9zZWxlY3RlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZHJhd2VyLnNlbGVjdE5vbmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaXNFbXB0eSgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kcmF3ZXIuaXNFbXB0eSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYmxvY2soKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5kcmF3ZXIuYmxvY2soKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGJsb2NrTm8oKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5kcmF3ZXIuYmxvY2tObygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1bmRvV3JpdGUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5kcmF3ZXIudW5kb1dyaXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVuZG9EZWxldGUodGV4dDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5kcmF3ZXIudW5kb0RlbGV0ZSh0ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkRGVjb3IoY3NzU3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5kcmF3ZXIuYWRkRGVjb3IoY3NzU3RyaW5nKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkRGVjb3JXaXRoRnJpZW5kcyhjc3NTdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5fZnJpZW5kcyA9PSBudWxsIHx8IHRoaXMuX2ZyaWVuZHMubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICB0aGlzLmFkZERlY29yKGNzc1N0cmluZyk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLl9mcmllbmRzLmZvckVhY2goKGZyaWVuZCkgPT4gZnJpZW5kLmFkZERlY29yKGNzc1N0cmluZykpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRNZXNzYWdlKHRleHQpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmRyYXdlci5hZGRNZXNzYWdlKHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDc3NTdHlsZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRyYXdlci5nZXRDc3NTdHlsZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgc2NyZWVuWCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRyYXdlci5zY3JlZW5YO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgc2NyZWVuWSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRyYXdlci5zY3JlZW5ZO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2VwYXJhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5zZXRGcmllbmRzKFt0aGlzXSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNlcGFyYXRlV2l0aG91dEZyaWVuZHMoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2ZyaWVuZHMgIT0gbnVsbCl7XHJcbiAgICAgICAgICAgIGxldCBpbmRleCA9IHRoaXMuX2ZyaWVuZHMuaW5kZXhPZih0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5fZnJpZW5kcy5zcGxpY2UoaW5kZXgsIGluZGV4KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZXBhcmF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXBhcmF0ZVdpdGhGcmllbmRzKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLl9mcmllbmRzID09IG51bGwpIHJldHVybjtcclxuICAgICAgICBsZXQgY2xvbmUgPSB0aGlzLl9mcmllbmRzO1xyXG4gICAgICAgIGNsb25lLmZvckVhY2goKGVsZW0pID0+IGVsZW0uc2VwYXJhdGUoKSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQge0NlbGx9IGZyb20gXCIuL0NlbGxcIjtcclxuaW1wb3J0IHtzdG9yZX0gZnJvbSBcIi4uL01haW4vVGFibGVQYWdlXCI7XHJcbmltcG9ydCB7RGlyZWN0aW9ufSBmcm9tIFwiLi4vVXRpbGl0aWVzL0RpcmVjdGlvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENlbGxEcmF3ZXIge1xyXG4gICAgcHJpdmF0ZSAkY2VsbDogSFRNTEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlICRzcGFuOiBIVE1MRWxlbWVudDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICAkcm93OiBIVE1MRWxlbWVudCxcclxuICAgICAgICBwcml2YXRlIGtlZXBlcjogQ2VsbFxyXG4gICAgKSB7XHJcbiAgICAgICAgdGhpcy5pbml0KCRyb3cpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdCgkcm93KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy4kc3BhbiA9IHRoaXMuJGNyZWF0ZVNwYW4oKTtcclxuICAgICAgICB0aGlzLiRjZWxsID0gdGhpcy4kY3JlYXRlQ2VsbCh0aGlzLiRzcGFuKTtcclxuICAgICAgICAkcm93LmFwcGVuZCh0aGlzLiRjZWxsKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlICRjcmVhdGVTcGFuKCk6IEhUTUxFbGVtZW50IHtcclxuICAgICAgICBsZXQgJHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgJHNwYW4uY2xhc3NOYW1lID0gJ3RleHQtbm93cmFwIG5vLXNob3ctZm9jdXMnO1xyXG4gICAgICAgICRzcGFuLm9ua2V5ZG93biA9IChldmVudCkgPT4gdGhpcy5rZWVwZXIub25LZXlkb3duKGV2ZW50KTtcclxuICAgICAgICAkc3Bhbi5vbmJsdXIgPSAoKSA9PiB0aGlzLmtlZXBlci5vbkJsdXIoJHNwYW4udGV4dENvbnRlbnQpO1xyXG4gICAgICAgICRzcGFuLm9uaW5wdXQgPSAoZXZlbnQpID0+IHRoaXMua2VlcGVyLm9uSW5wdXQoZXZlbnQpO1xyXG4gICAgICAgICRzcGFuLmNvbnRlbnRFZGl0YWJsZSA9ICd0cnVlJztcclxuICAgICAgICByZXR1cm4gJHNwYW47XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSAkY3JlYXRlQ2VsbCgkc3BhbjogSFRNTEVsZW1lbnQpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgICAgbGV0ICRjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgJGNlbGwuY2xhc3NOYW1lID0gJ2NvbWdyaWQtY2VsbCBib3JkZXItdG9wIGJvcmRlci1sZWZ0IGJvcmRlci1yaWdodCBib3JkZXItYm90dG9tIHRleHQtZGFyayc7XHJcbiAgICAgICAgJGNlbGwub25tb3VzZWVudGVyID0gKCkgPT4gdGhpcy5rZWVwZXIub25Nb3VzZWVudGVyKCk7XHJcbiAgICAgICAgJGNlbGwub25tb3VzZWRvd24gPSAoKSA9PiB0aGlzLmtlZXBlci5vbk1vdXNlZG93bigpO1xyXG4gICAgICAgICRjZWxsLm9uZHJhZ3N0YXJ0ID0gKCkgPT4gZmFsc2U7XHJcbiAgICAgICAgJGNlbGwub25jb250ZXh0bWVudSA9ICgpID0+IHRoaXMua2VlcGVyLm9uQ29udGV4dG1lbnUoKTtcclxuICAgICAgICAkY2VsbC5hcHBlbmQoJHNwYW4pO1xyXG4gICAgICAgIHJldHVybiAkY2VsbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZm9jdXMoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy4kc3Bhbi5mb2N1cygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZWxlY3QoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy4kY2VsbC5jbGFzc0xpc3QucmVtb3ZlKC4uLnN0b3JlLm5vU2VsZWN0ZWRDbGFzc2VzKTtcclxuICAgICAgICB0aGlzLiRjZWxsLmNsYXNzTGlzdC5hZGQoLi4uc3RvcmUuc2VsZWN0ZWRDbGFzc2VzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VsZWN0Tm9uZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLiRjZWxsLmNsYXNzTGlzdC5yZW1vdmUoLi4uc3RvcmUuc2VsZWN0ZWRDbGFzc2VzKTtcclxuICAgICAgICB0aGlzLiRjZWxsLmNsYXNzTGlzdC5hZGQoLi4uc3RvcmUubm9TZWxlY3RlZENsYXNzZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpc0VtcHR5KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLiRzcGFuLnRleHRDb250ZW50Lmxlbmd0aCA9PT0gMDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVtb3ZlQm9yZGVycyguLi5kaXJlY3Rpb25zOiBEaXJlY3Rpb25bXSk6IHZvaWQge1xyXG4gICAgICAgIGRpcmVjdGlvbnMuZm9yRWFjaCgoZGlyZWN0aW9uKSA9PiB0aGlzLnJlbW92ZUJvcmRlcihkaXJlY3Rpb24pKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVtb3ZlQm9yZGVyKGRpcmVjdGlvbjogRGlyZWN0aW9uKTogdm9pZCB7XHJcbiAgICAgICAgc3dpdGNoIChkaXJlY3Rpb24pIHtcclxuICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24uYm90dG9tOlxyXG4gICAgICAgICAgICAgICAgdGhpcy4kY2VsbC5jbGFzc0xpc3QucmVtb3ZlKCdib3JkZXItYm90dG9tJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLmxlZnQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRjZWxsLmNsYXNzTGlzdC5yZW1vdmUoJ2JvcmRlci1sZWZ0Jyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLnJpZ2h0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy4kY2VsbC5jbGFzc0xpc3QucmVtb3ZlKCdib3JkZXItcmlnaHQnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24udG9wOlxyXG4gICAgICAgICAgICAgICAgdGhpcy4kY2VsbC5jbGFzc0xpc3QucmVtb3ZlKCdib3JkZXItdG9wJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRCb3JkZXJzKC4uLmRpcmVjdGlvbnM6IERpcmVjdGlvbltdKTogdm9pZCB7XHJcbiAgICAgICAgZGlyZWN0aW9ucy5mb3JFYWNoKChkaXJlY3Rpb24pID0+IHRoaXMuYWRkQm9yZGVyKGRpcmVjdGlvbikpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRCb3JkZXIoZGlyZWN0aW9uOiBEaXJlY3Rpb24pOiB2b2lkIHtcclxuICAgICAgICBzd2l0Y2ggKGRpcmVjdGlvbikge1xyXG4gICAgICAgICAgICBjYXNlIERpcmVjdGlvbi5ib3R0b206XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRjZWxsLmNsYXNzTGlzdC5hZGQoJ2JvcmRlci1ib3R0b20nKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24ubGVmdDpcclxuICAgICAgICAgICAgICAgIHRoaXMuJGNlbGwuY2xhc3NMaXN0LmFkZCgnYm9yZGVyLWxlZnQnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24ucmlnaHQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRjZWxsLmNsYXNzTGlzdC5hZGQoJ2JvcmRlci1yaWdodCcpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBjYXNlIERpcmVjdGlvbi50b3A6XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRjZWxsLmNsYXNzTGlzdC5hZGQoJ2JvcmRlci10b3AnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGJsb2NrKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuJHNwYW4uY29udGVudEVkaXRhYmxlID0gJ2ZhbHNlJztcclxuICAgICAgICB0aGlzLiRzcGFuLmNsYXNzTGlzdC5hZGQoJ3VzZXItc2VsZWN0LW5vbmUnKTtcclxuICAgICAgICB0aGlzLiRjZWxsLm9uZGJsY2xpY2sgPSAoKSA9PiB0aGlzLmtlZXBlci5vbkRvdWJsZUNsaWNrKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGJsb2NrTm8oKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy4kc3Bhbi5jb250ZW50RWRpdGFibGUgPSAndHJ1ZSc7XHJcbiAgICAgICAgdGhpcy4kc3Bhbi5jbGFzc0xpc3QucmVtb3ZlKCd1c2VyLXNlbGVjdC1ub25lJyk7XHJcbiAgICAgICAgdGhpcy4kY2VsbC5vbmRibGNsaWNrID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdW5kb1dyaXRlKCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBsYXN0U3BhY2VJbmRleCA9IHRoaXMuJHNwYW4udGV4dENvbnRlbnQubGFzdEluZGV4T2YoJyAnKTtcclxuICAgICAgICBpZihsYXN0U3BhY2VJbmRleCA8IDApIHRoaXMuJHNwYW4udGV4dENvbnRlbnQgPSAnJztcclxuICAgICAgICBlbHNlIHRoaXMuJHNwYW4udGV4dENvbnRlbnQgPSB0aGlzLiRzcGFuLnRleHRDb250ZW50LnN1YnN0cigwLCBsYXN0U3BhY2VJbmRleCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVuZG9EZWxldGUodGV4dCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuJHNwYW4udGV4dENvbnRlbnQgKz0gdGV4dDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkRGVjb3IoY3NzU3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy4kY2VsbC5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCBjc3NTdHJpbmcpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRNZXNzYWdlKHRleHQpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLiRzcGFuLnRleHRDb250ZW50ID0gdGV4dDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q3NzU3R5bGUoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy4kY2VsbC5nZXRBdHRyaWJ1dGUoJ3N0eWxlJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBzY3JlZW5YKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuJGNlbGwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHNjcmVlblkoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy4kY2VsbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS55O1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHtDZWxsfSBmcm9tIFwiLi4vQ2VsbC9DZWxsXCI7XHJcbmltcG9ydCB7VGFibGVNb2R9IGZyb20gXCIuL1RhYmxlTW9kXCI7XHJcbmltcG9ydCB7QWN0aW9uLCBBY3Rpb25UeXBlfSBmcm9tIFwiLi4vVXRpbGl0aWVzL0FjdGlvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRhYmxlIHtcclxuICAgIHByaXZhdGUgJHRhYmxlQ29udGFpbmVyID0gJCgnbWFpbicpO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGNlbGxzOiBDZWxsW11bXSA9IFtdO1xyXG4gICAgcHVibGljIG1vZDogVGFibGVNb2Q7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgc2VsZWN0ZWRDZWxsczogQ2VsbFtdID0gW107XHJcbiAgICBwcml2YXRlIGFjdGlvbnM6IEFjdGlvbltdID0gW107XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgd2lkdGg6IG51bWJlcjtcclxuICAgIHB1YmxpYyByZWFkb25seSBoZWlnaHQ6IG51bWJlcjtcclxuICAgIHByaXZhdGUgXyRwb3BvdmVyID0gJCgnI3BvcG92ZXInKTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9zdG9yZSkge1xyXG4gICAgICAgIHRoaXMud2lkdGggPSBfc3RvcmUud2lkdGg7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBfc3RvcmUuaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuZmlsbFRhYmxlKF9zdG9yZS5jZWxsc1VuaW9ucywgX3N0b3JlLmRlY29yYXRpb25zLCBfc3RvcmUubWVzc2FnZXMpO1xyXG4gICAgICAgIGxldCAkYm9keSA9ICQoJ2JvZHknKTtcclxuICAgICAgICAkYm9keS5vbignbW91c2V1cCcsICgpID0+IHRoaXMub25Cb2R5TW91c2V1cCgpKTtcclxuICAgICAgICAkYm9keS5vbigna2V5ZG93bicsIChldmVudCkgPT4gdGhpcy5vbkJvZHlLZXlkb3duKGV2ZW50KSk7XHJcbiAgICAgICAgJCgnI3BhZ2UtbmFtZScpLnRleHQoX3N0b3JlLm5hbWUpO1xyXG4gICAgICAgIHRoaXMuXyRwb3BvdmVyLm9uKCdtb3VzZXVwJywgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBmaWxsVGFibGUoY2VsbHNVbmlvbnMsIGRlY29yYXRpb25zLCBtZXNzYWdlcyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZmlsbFN0YXJ0VGFibGUoKTtcclxuICAgICAgICB0aGlzLnVuaW9uKGNlbGxzVW5pb25zKTtcclxuICAgICAgICB0aGlzLmRlY29yYXRlKGRlY29yYXRpb25zKTtcclxuICAgICAgICB0aGlzLmFkZE1lc3NhZ2VzKG1lc3NhZ2VzKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGZpbGxTdGFydFRhYmxlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY2VsbHMubGVuZ3RoID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGVpZ2h0OyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5jZWxscy5wdXNoKFtdKTtcclxuICAgICAgICAgICAgbGV0ICRyb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdyb3cnKTtcclxuICAgICAgICAgICAgJHJvdy5jbGFzc05hbWUgPSAnY29tZ3JpZC1yb3cnO1xyXG4gICAgICAgICAgICB0aGlzLiR0YWJsZUNvbnRhaW5lci5hcHBlbmQoJHJvdyk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy53aWR0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNlbGxzW2ldLnB1c2gobmV3IENlbGwoaSwgaiwgJHJvdywgdGhpcykpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdW5pb24oY2VsbHNVbmlvbnMpOiB2b2lkIHtcclxuICAgICAgICBjZWxsc1VuaW9ucy5mb3JFYWNoKHVuaW9uID0+IHRoaXMuY3JlYXRlVW5pb24odW5pb24pKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZVVuaW9uKGNlbGxzVW5pb24pOiB2b2lkIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gY2VsbHNVbmlvbi5sZWZ0VXBYOyBpIDw9IGNlbGxzVW5pb24ucmlnaHREb3duWDsgaSsrKVxyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gY2VsbHNVbmlvbi5sZWZ0VXBZOyBqIDw9IGNlbGxzVW5pb24ucmlnaHREb3duWTsgaisrKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRDZWxsKGksIGopLnNlbGVjdFdpdGhGcmllbmRzKHRydWUpO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0RG93bigpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZGVjb3JhdGUoZGVjb3JhdGlvbnMpOiB2b2lkIHtcclxuICAgICAgICBkZWNvcmF0aW9ucy5mb3JFYWNoKGRlY29yYXRpb24gPT4gdGhpcy5kZWNvcmF0ZU9uZShkZWNvcmF0aW9uKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkZWNvcmF0ZU9uZShkZWNvcmF0aW9uKTogdm9pZCB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IGRlY29yYXRpb24ubGVmdFVwWDsgaSA8PSBkZWNvcmF0aW9uLnJpZ2h0RG93blg7IGkrKylcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IGRlY29yYXRpb24ubGVmdFVwWTsgaiA8PSBkZWNvcmF0aW9uLnJpZ2h0RG93blk7IGorKylcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q2VsbChpLCBqKS5hZGREZWNvcihkZWNvcmF0aW9uLmNzc1RleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYWRkTWVzc2FnZXMobWVzc2FnZXMpOiB2b2lkIHtcclxuICAgICAgICBtZXNzYWdlcy5mb3JFYWNoKG1lc3NhZ2UgPT4gdGhpcy5nZXRDZWxsKG1lc3NhZ2UueCwgbWVzc2FnZS55KS5hZGRNZXNzYWdlKG1lc3NhZ2UudGV4dCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25Cb2R5TW91c2V1cCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLm1vZCA9IFRhYmxlTW9kLm5vbmU7XHJcbiAgICAgICAgdGhpcy5zZWxlY3REb3duKCk7XHJcbiAgICAgICAgdGhpcy5oaWRlUG9wb3ZlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2VsZWN0RG93bigpOiB2b2lkIHtcclxuICAgICAgICBsZXQgY2xvbmUgPSB0aGlzLnNlbGVjdGVkQ2VsbHMubWFwKGVsZW0gPT4gZWxlbSk7XHJcbiAgICAgICAgbGV0IHN0eWxlID0gY2xvbmVbMF0uZ2V0Q3NzU3R5bGUoKTtcclxuICAgICAgICB3aGlsZSAodGhpcy5zZWxlY3RlZENlbGxzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgbGV0IGNlbGwgPSB0aGlzLnNlbGVjdGVkQ2VsbHMucG9wKCk7XHJcbiAgICAgICAgICAgIGNlbGwuc2V0RnJpZW5kcyhjbG9uZSk7XHJcbiAgICAgICAgICAgIGNlbGwuc2VsZWN0Tm9uZSgpO1xyXG4gICAgICAgICAgICBjZWxsLmFkZERlY29yKHN0eWxlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvbkJvZHlLZXlkb3duKGV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgaWYgKGV2ZW50LmN0cmxLZXkgJiYgZXZlbnQuY29kZSA9PT0gJ0tleVonKSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMucG9wQWN0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDZWxsKHg6IG51bWJlciwgeTogbnVtYmVyKTogQ2VsbCB7XHJcbiAgICAgICAgaWYgKHggPj0gMCAmJiB4IDwgdGhpcy5oZWlnaHQgJiYgeSA+PSAwICYmIHkgPCB0aGlzLndpZHRoKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jZWxsc1t4XVt5XTtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcHVzaEFjdGlvbihhY3Rpb246IEFjdGlvbikge1xyXG4gICAgICAgIGxldCBsYXN0QWN0aW9uID0gdGhpcy5hY3Rpb25zW3RoaXMuYWN0aW9ucy5sZW5ndGggLSAxXTtcclxuICAgICAgICBpZiAobGFzdEFjdGlvbiAhPSBudWxsICYmIGxhc3RBY3Rpb25bMF0gPT09IEFjdGlvblR5cGUud3JpdGUgJiYgYWN0aW9uWzBdIDw9IEFjdGlvblR5cGUud3JpdGVXaXRoU3BhY2VcclxuICAgICAgICAgICAgJiYgbGFzdEFjdGlvblsxXSA9PT0gYWN0aW9uWzFdICYmIGxhc3RBY3Rpb25bMl0gPT09IGFjdGlvblsyXSlcclxuICAgICAgICAgICAgdGhpcy5hY3Rpb25zLnBvcCgpO1xyXG4gICAgICAgIHRoaXMuYWN0aW9ucy5wdXNoKGFjdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHBvcEFjdGlvbigpIHtcclxuICAgICAgICBsZXQgYWN0aW9uID0gdGhpcy5hY3Rpb25zLnBvcCgpO1xyXG4gICAgICAgIHN3aXRjaCAoYWN0aW9uWzBdKSB7XHJcbiAgICAgICAgICAgIGNhc2UgQWN0aW9uVHlwZS53cml0ZTpcclxuICAgICAgICAgICAgICAgIHRoaXMudW5kb1dyaXRlKGFjdGlvblsxXSwgYWN0aW9uWzJdKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgLy8gY2FzZSBBY3Rpb25UeXBlLmRlbGV0ZTpcclxuICAgICAgICAgICAgLy8gICAgIHRoaXMudW5kb0RlbGV0ZShhY3Rpb25bMV0sIGFjdGlvblsyXSwgYWN0aW9uWzNdKTtcclxuICAgICAgICAgICAgLy8gICAgIHJldHVybjtcclxuICAgICAgICAgICAgY2FzZSBBY3Rpb25UeXBlLndyaXRlV2l0aFNwYWNlOlxyXG4gICAgICAgICAgICAgICAgdGhpcy51bmRvV3JpdGUoYWN0aW9uWzFdLCBhY3Rpb25bMl0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVuZG9Xcml0ZSh4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuZ2V0Q2VsbCh4LCB5KS51bmRvV3JpdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVuZG9EZWxldGUoeDogbnVtYmVyLCB5OiBudW1iZXIsIHRleHQ6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuZ2V0Q2VsbCh4LCB5KS51bmRvRGVsZXRlKHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzaG93UG9wb3Zlcih4OiBudW1iZXIsIHk6IG51bWJlciwgY2VsbDogQ2VsbCl7XHJcbiAgICAgICAgdGhpcy5fJHBvcG92ZXIucmVtb3ZlQ2xhc3MoJ2Qtbm9uZScpO1xyXG4gICAgICAgIHRoaXMuXyRwb3BvdmVyLmF0dHIoJ3N0eWxlJywgYGxlZnQ6ICR7Y2VsbC5zY3JlZW5YICsgMTZ9cHg7IHRvcDogJHtjZWxsLnNjcmVlblkgKyAxNn1weDtgKTtcclxuICAgICAgICB0aGlzLl8kcG9wb3Zlci5maW5kKCcjY29vcmRzJykudGV4dChgJHt4fSwgJHt5fWApO1xyXG5cclxuICAgICAgICBsZXQgJGlucHV0ID0gdGhpcy5fJHBvcG92ZXIuZmluZCgnI2Nzc1N0eWxlSW5wdXQnKTtcclxuICAgICAgICAkaW5wdXQudmFsKGNlbGwuZ2V0Q3NzU3R5bGUoKSk7XHJcbiAgICAgICAgJGlucHV0Lm9mZignY2hhbmdlJyk7XHJcbiAgICAgICAgJGlucHV0Lm9uKCdjaGFuZ2UnLCAoKSA9PiBjZWxsLmFkZERlY29yV2l0aEZyaWVuZHMoJGlucHV0LnZhbCgpKSk7XHJcblxyXG4gICAgICAgIGxldCAkYnV0dG9uMSA9IHRoaXMuXyRwb3BvdmVyLmZpbmQoJyNlZGl0VGV4dEJ1dHRvbicpO1xyXG4gICAgICAgICRidXR0b24xLm9mZignY2xpY2snKTtcclxuICAgICAgICAkYnV0dG9uMS5vbignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNlbGwuZm9jdXMoKTtcclxuICAgICAgICAgICAgdGhpcy5oaWRlUG9wb3ZlcigpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsZXQgJGJ1dHRvbjIgPSB0aGlzLl8kcG9wb3Zlci5maW5kKCcjZGl2aWRlQnV0dG9uJyk7XHJcbiAgICAgICAgJGJ1dHRvbjIub2ZmKCdjbGljaycpO1xyXG4gICAgICAgICRidXR0b24yLm9uKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgY2VsbC5zZXBhcmF0ZVdpdGhGcmllbmRzKCk7XHJcbiAgICAgICAgICAgIGNlbGwuZm9jdXMoKTtcclxuICAgICAgICAgICAgdGhpcy5oaWRlUG9wb3ZlcigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBoaWRlUG9wb3Zlcigpe1xyXG4gICAgICAgIHRoaXMuXyRwb3BvdmVyLmFkZENsYXNzKCdkLW5vbmUnKTtcclxuICAgIH1cclxufSIsImV4cG9ydCBlbnVtIFRhYmxlTW9ke1xyXG4gICAgbm9uZSxcclxuICAgIHNlbGVjdGluZ1xyXG59IiwiaW1wb3J0IHtUYWJsZX0gZnJvbSBcIi4vVGFibGVcIjtcclxuXHJcbmxldCB0YWJsZTtcclxuY29uc3QgbGluayA9IFwiaHR0cHM6Ly9jb21ncmlkLnJ1Ojg0NDNcIjtcclxubGV0IGNlbGxzVW5pb25zID0gW1xyXG4gICAge1xyXG4gICAgICAgIGxlZnRVcFg6IDExLFxyXG4gICAgICAgIGxlZnRVcFk6IDE0LFxyXG4gICAgICAgIHJpZ2h0RG93blg6IDE3LFxyXG4gICAgICAgIHJpZ2h0RG93blk6IDE3XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIGxlZnRVcFg6IDIyLFxyXG4gICAgICAgIGxlZnRVcFk6IDE3LFxyXG4gICAgICAgIHJpZ2h0RG93blg6IDI0LFxyXG4gICAgICAgIHJpZ2h0RG93blk6IDMwXHJcbiAgICB9XHJcbl07XHJcbmV4cG9ydCBsZXQgc3RvcmUgPSB7XHJcbiAgICBoZWlnaHQ6IDUwLFxyXG4gICAgd2lkdGg6IDUwLFxyXG4gICAgY2VsbHNVbmlvbnM6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxlZnRVcFg6IDExLFxyXG4gICAgICAgICAgICBsZWZ0VXBZOiAxNCxcclxuICAgICAgICAgICAgcmlnaHREb3duWDogMTcsXHJcbiAgICAgICAgICAgIHJpZ2h0RG93blk6IDE3XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxlZnRVcFg6IDIyLFxyXG4gICAgICAgICAgICBsZWZ0VXBZOiAxNyxcclxuICAgICAgICAgICAgcmlnaHREb3duWDogMjQsXHJcbiAgICAgICAgICAgIHJpZ2h0RG93blk6IDMwXHJcbiAgICAgICAgfVxyXG4gICAgXSxcclxuICAgIGRlY29yYXRpb25zOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZWZ0VXBYOiAxMSxcclxuICAgICAgICAgICAgbGVmdFVwWTogMTQsXHJcbiAgICAgICAgICAgIHJpZ2h0RG93blg6IDE3LFxyXG4gICAgICAgICAgICByaWdodERvd25ZOiAxNyxcclxuICAgICAgICAgICAgY3NzVGV4dDogXCJiYWNrZ3JvdW5kLWNvbG9yOiBibHVlOyBjb2xvcjogeWVsbG93ICFpbXBvcnRhbnQ7IGJvcmRlci1jb2xvcjogcmVkICFpbXBvcnRhbnQ7XCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGVmdFVwWDogMzEsXHJcbiAgICAgICAgICAgIGxlZnRVcFk6IDQxLFxyXG4gICAgICAgICAgICByaWdodERvd25YOiAzMSxcclxuICAgICAgICAgICAgcmlnaHREb3duWTogNDEsXHJcbiAgICAgICAgICAgIGNzc1RleHQ6IFwiYmFja2dyb3VuZC1jb2xvcjogcmdiKDIwNCwxMSwxMSk7IGNvbG9yOiBncmVlbiAhaW1wb3J0YW50OyBib3JkZXItY29sb3I6IGJsdWUgIWltcG9ydGFudDtcIlxyXG4gICAgICAgIH1cclxuICAgIF0sXHJcbiAgICBtZXNzYWdlczogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgeDogMjIsXHJcbiAgICAgICAgICAgIHk6IDE3LFxyXG4gICAgICAgICAgICB0ZXh0OiBcItCg0LXQsdGP0YLQsCwg0L/RgNC40LLQtdGCLCDRh9GC0L4g0LfQsNC00LDQu9C4INC/0L4g0L/RgNC10LrRgNCw0YHQvdC+0Lkg0LbQuNC30L3QuCDQsdC10Lcg0LfQsNCx0L7Rgj9cIlxyXG4gICAgICAgIH1cclxuICAgIF0sXHJcbiAgICBzZWxlY3RlZENsYXNzZXM6IFsnYmctZGFyaycsICd0ZXh0LWxpZ2h0J10sXHJcbiAgICBub1NlbGVjdGVkQ2xhc3NlczogWyd0ZXh0LWRhcmsnXVxyXG59XHJcblxyXG4kKHdpbmRvdykub24oJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICBjaGVja0F1dGhvcml6YXRpb24oKVxyXG4gICAgLnRoZW4oKCkgPT4gZ2V0VGFibGVJbmZvKCkpXHJcbiAgICAudGhlbigoKSA9PiBnZXRUYWJsZU1lc3NhZ2VzKCkpXHJcbiAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJUYWJsZSBtZXNzYWdlc1wiKVxyXG4gICAgICAgIHN0b3JlLmNlbGxzVW5pb25zID0gY2VsbHNVbmlvbnM7XHJcbiAgICAgICAgdGFibGUgPSBuZXcgVGFibGUoc3RvcmUpO1xyXG4gICAgfSlcclxufSk7XHJcblxyXG5mdW5jdGlvbiBjaGVja0F1dGhvcml6YXRpb24oKSB7XHJcbiAgICByZXR1cm4gZmV0Y2goXHJcbiAgICAgICAgbGluayArIFwiL3VzZXIvbG9naW5cIixcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcImluY2x1ZGVcIixcclxuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJ9XHJcbiAgICAgICAgfVxyXG4gICAgKS50aGVuKChyZXNwb25zZSkgPT57XHJcbiAgICAgICAgaWYocmVzcG9uc2Uuc3RhdHVzICE9PSAyMDApe1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGxpbmsgKyBcIi9vYXV0aDIvYXV0aG9yaXphdGlvbi9nb29nbGVcIlxyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoKVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRQYXJhbShuYW1lOiBzdHJpbmcpOiBzdHJpbmd7XHJcbiAgICBjb25zdCB1cmxQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpXHJcbiAgICByZXR1cm4gdXJsUGFyYW1zLmdldChuYW1lKVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRUYWJsZUluZm8oKSB7XHJcbiAgICBjb25zdCBpZCA9IGdldFBhcmFtKFwiaWRcIilcclxuICAgIHJldHVybiBmZXRjaChcclxuICAgICAgICBsaW5rICsgXCIvdGFibGUvaW5mbz9jaGF0SWQ9XCIgKyBpZCxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcImluY2x1ZGVcIixcclxuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJ9XHJcbiAgICAgICAgfVxyXG4gICAgKS50aGVuKChyZXN1bHQpID0+e1xyXG4gICAgICAgIHJlc3VsdC50ZXh0KCkudGhlbigodGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBpZihyZXN1bHQuc3RhdHVzID09IDIwMCl7XHJcbiAgICAgICAgICAgICAgICBzdG9yZSA9IEpTT04ucGFyc2UodGV4dClcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHN0b3JlKVxyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdC5zdGF0dXMgKyBcIiwgXCIgKyB0ZXh0KVxyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBvY2N1cnJlZDogc2VlIGNvbnNvbGUgZm9yIG1vcmUgZGV0YWlsc1wiKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkVycm9yIG9jY3VycmVkOiBzZWUgY29uc29sZSBmb3IgbW9yZSBkZXRhaWxzXCIpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFRhYmxlTWVzc2FnZXMoKSB7XHJcbiAgICBjb25zdCBpZCA9IGdldFBhcmFtKFwiaWRcIilcclxuICAgIHJldHVybiBmZXRjaChcclxuICAgICAgICBsaW5rICsgXCIvbWVzc2FnZS9saXN0XCIsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjcmVkZW50aWFsczogXCJpbmNsdWRlXCIsXHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIn0sXHJcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgICAgICAgIGNoYXRJZDogK2lkLFxyXG4gICAgICAgICAgICAgICAgeENvb3JkTGVmdFRvcDogMCxcclxuICAgICAgICAgICAgICAgIHlDb29yZExlZnRUb3A6IDAsXHJcbiAgICAgICAgICAgICAgICB4Q29vcmRSaWdodEJvdHRvbTogc3RvcmUuaGVpZ2h0IC0gMSxcclxuICAgICAgICAgICAgICAgIHlDb29yZExlZnRCb3R0b206IHN0b3JlLndpZHRoIC0gMVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICkudGhlbigocmVzdWx0KSA9PlxyXG4gICAgICAgIHJlc3VsdC50ZXh0KCkudGhlbigodGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBpZihyZXN1bHQuc3RhdHVzID09IDIwMCl7XHJcbiAgICAgICAgICAgICAgICBzdG9yZS5tZXNzYWdlcyA9IEpTT04ucGFyc2UodGV4dClcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHN0b3JlLm1lc3NhZ2VzKVxyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdC5zdGF0dXMgKyBcIiwgXCIgKyB0ZXh0KVxyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBvY2N1cnJlZDogc2VlIGNvbnNvbGUgZm9yIG1vcmUgZGV0YWlsc1wiKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkVycm9yIG9jY3VycmVkOiBzZWUgY29uc29sZSBmb3IgbW9yZSBkZXRhaWxzXCIpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgKTtcclxufSIsIlxyXG5leHBvcnQgZW51bSBBY3Rpb25UeXBlIHtcclxuICAgIHdyaXRlLFxyXG4gICAgd3JpdGVXaXRoU3BhY2UsXHJcbiAgICBkZWxldGUsXHJcbiAgICB1bmlvblxyXG59XHJcblxyXG5leHBvcnQgdHlwZSBBY3Rpb24gPSBbYWN0aW9uVHlwZTogQWN0aW9uVHlwZSwgY2VsbFg6IG51bWJlciwgY2VsbFk6IG51bWJlciwgaW5mbz86IGFueV07IiwiZXhwb3J0IGVudW0gRGlyZWN0aW9ue1xyXG4gICAgbGVmdCxcclxuICAgIHJpZ2h0LFxyXG4gICAgdG9wLFxyXG4gICAgYm90dG9tXHJcbn0iXX0=
