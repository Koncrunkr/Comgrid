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
    return fetch(link + "/table/messages", {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJUU2NyaXB0L1RhYmxlUGFnZS9DZWxsL0NlbGwudHMiLCJUU2NyaXB0L1RhYmxlUGFnZS9DZWxsL0NlbGxEcmF3ZXIudHMiLCJUU2NyaXB0L1RhYmxlUGFnZS9NYWluL1RhYmxlLnRzIiwiVFNjcmlwdC9UYWJsZVBhZ2UvTWFpbi9UYWJsZU1vZC50cyIsIlRTY3JpcHQvVGFibGVQYWdlL01haW4vVGFibGVQYWdlLnRzIiwiVFNjcmlwdC9UYWJsZVBhZ2UvVXRpbGl0aWVzL0FjdGlvbi50cyIsIlRTY3JpcHQvVGFibGVQYWdlL1V0aWxpdGllcy9EaXJlY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNBQSwyQ0FBd0M7QUFFeEMsNkNBQTBDO0FBQzFDLG9EQUFpRDtBQUNqRCw4Q0FBK0M7QUFLL0M7SUFNSSxjQUNvQixDQUFTLEVBQ1QsQ0FBUyxFQUN6QixJQUFpQixFQUNELEtBQVk7UUFIWixNQUFDLEdBQUQsQ0FBQyxDQUFRO1FBQ1QsTUFBQyxHQUFELENBQUMsQ0FBUTtRQUVULFVBQUssR0FBTCxLQUFLLENBQU87UUFFNUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLHVCQUFVLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRCxzQkFBVywyQkFBUzthQUFwQjtZQUFBLGlCQVVDO1lBVEcsT0FBTyxDQUFDLFVBQUEsS0FBSztnQkFDVCxJQUFJLEtBQUssQ0FBQyxPQUFPO29CQUFFLE9BQU87Z0JBQzFCLElBQUksS0FBSyxDQUFDLFFBQVE7b0JBQUUsT0FBTztnQkFDM0IsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLFNBQVM7b0JBQUUsS0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUM3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QUksT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFDLElBQUksSUFBSyxPQUFBLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBNUMsQ0FBNEMsQ0FBQyxJQUFJLElBQUk7WUFDNUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMscUJBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFJLElBQUssT0FBQSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQTVDLENBQTRDLENBQUMsSUFBSSxJQUFJO1lBQzVFLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLHFCQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0MsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSSxJQUFLLE9BQUEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSSxDQUFDLENBQUMsQ0FBQyxFQUE1QyxDQUE0QyxDQUFDLElBQUksSUFBSTtZQUM1RSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxxQkFBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVDLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFDLElBQUksSUFBSyxPQUFBLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUksQ0FBQyxDQUFDLENBQUMsRUFBNUMsQ0FBNEMsQ0FBQyxJQUFJLElBQUk7WUFDNUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZ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Q0FBQTtJQUNKLDJDQUFLLENBQUE7SUFDTCx1Q0FBRyxDQUFBO0lBQ0gsNkNBQU0sQ0FBQTtBQUNWLENBQUMsRUFMVyxTQUFTLEdBQVQsaUJBQVMsS0FBVCxpQkFBUyxRQUtwQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCB7Q2VsbERyYXdlcn0gZnJvbSBcIi4vQ2VsbERyYXdlclwiO1xyXG5pbXBvcnQge1RhYmxlfSBmcm9tIFwiLi4vTWFpbi9UYWJsZVwiO1xyXG5pbXBvcnQge1RhYmxlTW9kfSBmcm9tIFwiLi4vTWFpbi9UYWJsZU1vZFwiO1xyXG5pbXBvcnQge0RpcmVjdGlvbn0gZnJvbSBcIi4uL1V0aWxpdGllcy9EaXJlY3Rpb25cIjtcclxuaW1wb3J0IHtBY3Rpb25UeXBlfSBmcm9tIFwiLi4vVXRpbGl0aWVzL0FjdGlvblwiO1xyXG5pbXBvcnQge2Nzc30gZnJvbSBcImpxdWVyeVwiO1xyXG5cclxudHlwZSBvblRyaWdnZXIgPSAoZXZlbnQ/OiBhbnkpID0+IHZvaWQgfCBib29sZWFuXHJcblxyXG5leHBvcnQgY2xhc3MgQ2VsbCB7XHJcbiAgICBwcml2YXRlIGRyYXdlcjogQ2VsbERyYXdlcjtcclxuICAgIHByaXZhdGUgX2ZyaWVuZHM6IENlbGxbXTtcclxuICAgIHByaXZhdGUgX2Jsb2NrZWQ6IGJvb2xlYW47XHJcbiAgICBwcml2YXRlIF9zZWxlY3RlZDogYm9vbGVhbjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwdWJsaWMgcmVhZG9ubHkgeDogbnVtYmVyLFxyXG4gICAgICAgIHB1YmxpYyByZWFkb25seSB5OiBudW1iZXIsXHJcbiAgICAgICAgJHJvdzogSFRNTEVsZW1lbnQsXHJcbiAgICAgICAgcHVibGljIHJlYWRvbmx5IHRhYmxlOiBUYWJsZVxyXG4gICAgKSB7XHJcbiAgICAgICAgdGhpcy5kcmF3ZXIgPSBuZXcgQ2VsbERyYXdlcigkcm93LCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG9uS2V5ZG93bigpOiBvblRyaWdnZXIge1xyXG4gICAgICAgIHJldHVybiAoZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXZlbnQuY3RybEtleSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAoZXZlbnQuc2hpZnRLZXkpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKGV2ZW50LmNvZGUgPT09ICdBcnJvd1VwJykgdGhpcy50YWJsZS5nZXRDZWxsKHRoaXMueCAtIDEsIHRoaXMueSkuZm9jdXMoKTtcclxuICAgICAgICAgICAgaWYgKGV2ZW50LmNvZGUgPT09ICdBcnJvd0Rvd24nIHx8IGV2ZW50LmNvZGUgPT09ICdFbnRlcicpIHRoaXMudGFibGUuZ2V0Q2VsbCh0aGlzLnggKyAxLCB0aGlzLnkpLmZvY3VzKCk7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pc0VtcHR5KCkpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKGV2ZW50LmNvZGUgPT09ICdBcnJvd0xlZnQnKSB0aGlzLnRhYmxlLmdldENlbGwodGhpcy54LCB0aGlzLnkgLSAxKS5mb2N1cygpO1xyXG4gICAgICAgICAgICBpZiAoZXZlbnQuY29kZSA9PT0gJ0Fycm93UmlnaHQnKSB0aGlzLnRhYmxlLmdldENlbGwodGhpcy54LCB0aGlzLnkgKyAxKS5mb2N1cygpO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBvbk1vdXNlZW50ZXIoKTogb25UcmlnZ2VyIHtcclxuICAgICAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy50YWJsZS5tb2QgIT09IFRhYmxlTW9kLnNlbGVjdGluZykgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdFdpdGhGcmllbmRzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgb25Nb3VzZWRvd24oKTogb25UcmlnZ2VyIHtcclxuICAgICAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnRhYmxlLm1vZCA9IFRhYmxlTW9kLnNlbGVjdGluZztcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RXaXRoRnJpZW5kcygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG9uRG91YmxlQ2xpY2soKTogb25UcmlnZ2VyIHtcclxuICAgICAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmZvY3VzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgb25CbHVyKCk6IG9uVHJpZ2dlciB7XHJcbiAgICAgICAgcmV0dXJuICh0ZXh0OiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgaWYodGV4dC5sZW5ndGggIT09IDApXHJcbiAgICAgICAgICAgICAgICB0aGlzLmJsb2NrKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgb25JbnB1dCgpOiBvblRyaWdnZXIge1xyXG4gICAgICAgIHJldHVybiAoZXZlbnQ6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhldmVudC5pbnB1dFR5cGUpO1xyXG4gICAgICAgICAgICBpZihldmVudC5pbnB1dFR5cGVbMF0gPT09ICdpJylcclxuICAgICAgICAgICAgICAgIGlmKGV2ZW50LmRhdGEgPT09ICcgJykgdGhpcy50YWJsZS5wdXNoQWN0aW9uKFtBY3Rpb25UeXBlLndyaXRlV2l0aFNwYWNlLCB0aGlzLngsIHRoaXMueV0pO1xyXG4gICAgICAgICAgICAgICAgZWxzZSB0aGlzLnRhYmxlLnB1c2hBY3Rpb24oW0FjdGlvblR5cGUud3JpdGUsIHRoaXMueCwgdGhpcy55XSk7XHJcbiAgICAgICAgICAgIGVsc2UgaWYoZXZlbnQuaW5wdXRUeXBlWzBdID09PSAnZCcpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRhYmxlLnB1c2hBY3Rpb24oW0FjdGlvblR5cGUuZGVsZXRlLCB0aGlzLngsIHRoaXMueSwgZXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoJ3RleHQvaHRtbCcpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgb25Db250ZXh0bWVudSgpOiBvblRyaWdnZXIge1xyXG4gICAgICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudGFibGUuc2hvd1BvcG92ZXIodGhpcy54LCB0aGlzLnksIHRoaXMpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBmb2N1cygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmRyYXdlci5ibG9ja05vKCk7XHJcbiAgICAgICAgdGhpcy5kcmF3ZXIuZm9jdXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VsZWN0V2l0aEZyaWVuZHMoeWVzOiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLl9mcmllbmRzID09IG51bGwgfHwgdGhpcy5fZnJpZW5kcy5sZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgIHllcyA/IHRoaXMuc2VsZWN0KCkgOiB0aGlzLnNlbGVjdE5vbmUoKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuX2ZyaWVuZHMuZm9yRWFjaCgoZnJpZW5kKSA9PiB5ZXMgPyBmcmllbmQuc2VsZWN0KCkgOiBmcmllbmQuc2VsZWN0Tm9uZSgpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0RnJpZW5kcyhmcmllbmRzOiBDZWxsW10pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9mcmllbmRzID0gZnJpZW5kcztcclxuICAgICAgICB0aGlzLmRyYXdlci5hZGRCb3JkZXJzKERpcmVjdGlvbi50b3AsIERpcmVjdGlvbi5ib3R0b20sIERpcmVjdGlvbi5sZWZ0LCBEaXJlY3Rpb24ucmlnaHQpXHJcbiAgICAgICAgaWYgKGZyaWVuZHMuZmluZCgoY2VsbCkgPT4gKGNlbGwueCA9PT0gdGhpcy54ICYmIGNlbGwueSA9PT0gdGhpcy55ICsgMSkpICE9IG51bGwpXHJcbiAgICAgICAgICAgIHRoaXMuZHJhd2VyLnJlbW92ZUJvcmRlcihEaXJlY3Rpb24ucmlnaHQpO1xyXG4gICAgICAgIGlmIChmcmllbmRzLmZpbmQoKGNlbGwpID0+IChjZWxsLnggPT09IHRoaXMueCAmJiBjZWxsLnkgPT09IHRoaXMueSAtIDEpKSAhPSBudWxsKVxyXG4gICAgICAgICAgICB0aGlzLmRyYXdlci5yZW1vdmVCb3JkZXIoRGlyZWN0aW9uLmxlZnQpO1xyXG4gICAgICAgIGlmIChmcmllbmRzLmZpbmQoKGNlbGwpID0+IChjZWxsLnggPT09IHRoaXMueCAtIDEgJiYgY2VsbC55ID09PSB0aGlzLnkpKSAhPSBudWxsKVxyXG4gICAgICAgICAgICB0aGlzLmRyYXdlci5yZW1vdmVCb3JkZXIoRGlyZWN0aW9uLnRvcCk7XHJcbiAgICAgICAgaWYgKGZyaWVuZHMuZmluZCgoY2VsbCkgPT4gKGNlbGwueCA9PT0gdGhpcy54ICsgMSAmJiBjZWxsLnkgPT09IHRoaXMueSkpICE9IG51bGwpXHJcbiAgICAgICAgICAgIHRoaXMuZHJhd2VyLnJlbW92ZUJvcmRlcihEaXJlY3Rpb24uYm90dG9tKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VsZWN0KCk6IHZvaWQge1xyXG4gICAgICAgIGlmKHRoaXMuX3NlbGVjdGVkKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMudGFibGUuc2VsZWN0ZWRDZWxscy5wdXNoKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuZHJhd2VyLnNlbGVjdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZWxlY3ROb25lKCk6IHZvaWQge1xyXG4gICAgICAgIGlmKCF0aGlzLl9zZWxlY3RlZCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5kcmF3ZXIuc2VsZWN0Tm9uZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpc0VtcHR5KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRyYXdlci5pc0VtcHR5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBibG9jaygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmRyYXdlci5ibG9jaygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYmxvY2tObygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmRyYXdlci5ibG9ja05vKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVuZG9Xcml0ZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmRyYXdlci51bmRvV3JpdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdW5kb0RlbGV0ZSh0ZXh0OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmRyYXdlci51bmRvRGVsZXRlKHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGREZWNvcihjc3NTdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmRyYXdlci5hZGREZWNvcihjc3NTdHJpbmcpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGREZWNvcldpdGhGcmllbmRzKGNzc1N0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLl9mcmllbmRzID09IG51bGwgfHwgdGhpcy5fZnJpZW5kcy5sZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgIHRoaXMuYWRkRGVjb3IoY3NzU3RyaW5nKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuX2ZyaWVuZHMuZm9yRWFjaCgoZnJpZW5kKSA9PiBmcmllbmQuYWRkRGVjb3IoY3NzU3RyaW5nKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZE1lc3NhZ2UodGV4dCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZHJhd2VyLmFkZE1lc3NhZ2UodGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldENzc1N0eWxlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZHJhd2VyLmdldENzc1N0eWxlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBzY3JlZW5YKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZHJhd2VyLnNjcmVlblg7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBzY3JlZW5ZKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZHJhd2VyLnNjcmVlblk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXBhcmF0ZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnNldEZyaWVuZHMoW3RoaXNdKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VwYXJhdGVXaXRob3V0RnJpZW5kcygpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5fZnJpZW5kcyAhPSBudWxsKXtcclxuICAgICAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5fZnJpZW5kcy5pbmRleE9mKHRoaXMpO1xyXG4gICAgICAgICAgICB0aGlzLl9mcmllbmRzLnNwbGljZShpbmRleCwgaW5kZXgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNlcGFyYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNlcGFyYXRlV2l0aEZyaWVuZHMoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2ZyaWVuZHMgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgIGxldCBjbG9uZSA9IHRoaXMuX2ZyaWVuZHM7XHJcbiAgICAgICAgY2xvbmUuZm9yRWFjaCgoZWxlbSkgPT4gZWxlbS5zZXBhcmF0ZSgpKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7Q2VsbH0gZnJvbSBcIi4vQ2VsbFwiO1xyXG5pbXBvcnQge3N0b3JlfSBmcm9tIFwiLi4vTWFpbi9UYWJsZVBhZ2VcIjtcclxuaW1wb3J0IHtEaXJlY3Rpb259IGZyb20gXCIuLi9VdGlsaXRpZXMvRGlyZWN0aW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ2VsbERyYXdlciB7XHJcbiAgICBwcml2YXRlICRjZWxsOiBIVE1MRWxlbWVudDtcclxuICAgIHByaXZhdGUgJHNwYW46IEhUTUxFbGVtZW50O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICRyb3c6IEhUTUxFbGVtZW50LFxyXG4gICAgICAgIHByaXZhdGUga2VlcGVyOiBDZWxsXHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLmluaXQoJHJvdyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0KCRyb3cpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLiRzcGFuID0gdGhpcy4kY3JlYXRlU3BhbigpO1xyXG4gICAgICAgIHRoaXMuJGNlbGwgPSB0aGlzLiRjcmVhdGVDZWxsKHRoaXMuJHNwYW4pO1xyXG4gICAgICAgICRyb3cuYXBwZW5kKHRoaXMuJGNlbGwpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgJGNyZWF0ZVNwYW4oKTogSFRNTEVsZW1lbnQge1xyXG4gICAgICAgIGxldCAkc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICAkc3Bhbi5jbGFzc05hbWUgPSAndGV4dC1ub3dyYXAgbm8tc2hvdy1mb2N1cyc7XHJcbiAgICAgICAgJHNwYW4ub25rZXlkb3duID0gKGV2ZW50KSA9PiB0aGlzLmtlZXBlci5vbktleWRvd24oZXZlbnQpO1xyXG4gICAgICAgICRzcGFuLm9uYmx1ciA9ICgpID0+IHRoaXMua2VlcGVyLm9uQmx1cigkc3Bhbi50ZXh0Q29udGVudCk7XHJcbiAgICAgICAgJHNwYW4ub25pbnB1dCA9IChldmVudCkgPT4gdGhpcy5rZWVwZXIub25JbnB1dChldmVudCk7XHJcbiAgICAgICAgJHNwYW4uY29udGVudEVkaXRhYmxlID0gJ3RydWUnO1xyXG4gICAgICAgIHJldHVybiAkc3BhbjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlICRjcmVhdGVDZWxsKCRzcGFuOiBIVE1MRWxlbWVudCk6IEhUTUxFbGVtZW50IHtcclxuICAgICAgICBsZXQgJGNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAkY2VsbC5jbGFzc05hbWUgPSAnY29tZ3JpZC1jZWxsIGJvcmRlci10b3AgYm9yZGVyLWxlZnQgYm9yZGVyLXJpZ2h0IGJvcmRlci1ib3R0b20gdGV4dC1kYXJrJztcclxuICAgICAgICAkY2VsbC5vbm1vdXNlZW50ZXIgPSAoKSA9PiB0aGlzLmtlZXBlci5vbk1vdXNlZW50ZXIoKTtcclxuICAgICAgICAkY2VsbC5vbm1vdXNlZG93biA9ICgpID0+IHRoaXMua2VlcGVyLm9uTW91c2Vkb3duKCk7XHJcbiAgICAgICAgJGNlbGwub25kcmFnc3RhcnQgPSAoKSA9PiBmYWxzZTtcclxuICAgICAgICAkY2VsbC5vbmNvbnRleHRtZW51ID0gKCkgPT4gdGhpcy5rZWVwZXIub25Db250ZXh0bWVudSgpO1xyXG4gICAgICAgICRjZWxsLmFwcGVuZCgkc3Bhbik7XHJcbiAgICAgICAgcmV0dXJuICRjZWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBmb2N1cygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLiRzcGFuLmZvY3VzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNlbGVjdCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLiRjZWxsLmNsYXNzTGlzdC5yZW1vdmUoLi4uc3RvcmUubm9TZWxlY3RlZENsYXNzZXMpO1xyXG4gICAgICAgIHRoaXMuJGNlbGwuY2xhc3NMaXN0LmFkZCguLi5zdG9yZS5zZWxlY3RlZENsYXNzZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZWxlY3ROb25lKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuJGNlbGwuY2xhc3NMaXN0LnJlbW92ZSguLi5zdG9yZS5zZWxlY3RlZENsYXNzZXMpO1xyXG4gICAgICAgIHRoaXMuJGNlbGwuY2xhc3NMaXN0LmFkZCguLi5zdG9yZS5ub1NlbGVjdGVkQ2xhc3Nlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGlzRW1wdHkoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuJHNwYW4udGV4dENvbnRlbnQubGVuZ3RoID09PSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmVCb3JkZXJzKC4uLmRpcmVjdGlvbnM6IERpcmVjdGlvbltdKTogdm9pZCB7XHJcbiAgICAgICAgZGlyZWN0aW9ucy5mb3JFYWNoKChkaXJlY3Rpb24pID0+IHRoaXMucmVtb3ZlQm9yZGVyKGRpcmVjdGlvbikpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmVCb3JkZXIoZGlyZWN0aW9uOiBEaXJlY3Rpb24pOiB2b2lkIHtcclxuICAgICAgICBzd2l0Y2ggKGRpcmVjdGlvbikge1xyXG4gICAgICAgICAgICBjYXNlIERpcmVjdGlvbi5ib3R0b206XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRjZWxsLmNsYXNzTGlzdC5yZW1vdmUoJ2JvcmRlci1ib3R0b20nKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24ubGVmdDpcclxuICAgICAgICAgICAgICAgIHRoaXMuJGNlbGwuY2xhc3NMaXN0LnJlbW92ZSgnYm9yZGVyLWxlZnQnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24ucmlnaHQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRjZWxsLmNsYXNzTGlzdC5yZW1vdmUoJ2JvcmRlci1yaWdodCcpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBjYXNlIERpcmVjdGlvbi50b3A6XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRjZWxsLmNsYXNzTGlzdC5yZW1vdmUoJ2JvcmRlci10b3AnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZEJvcmRlcnMoLi4uZGlyZWN0aW9uczogRGlyZWN0aW9uW10pOiB2b2lkIHtcclxuICAgICAgICBkaXJlY3Rpb25zLmZvckVhY2goKGRpcmVjdGlvbikgPT4gdGhpcy5hZGRCb3JkZXIoZGlyZWN0aW9uKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZEJvcmRlcihkaXJlY3Rpb246IERpcmVjdGlvbik6IHZvaWQge1xyXG4gICAgICAgIHN3aXRjaCAoZGlyZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLmJvdHRvbTpcclxuICAgICAgICAgICAgICAgIHRoaXMuJGNlbGwuY2xhc3NMaXN0LmFkZCgnYm9yZGVyLWJvdHRvbScpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBjYXNlIERpcmVjdGlvbi5sZWZ0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy4kY2VsbC5jbGFzc0xpc3QuYWRkKCdib3JkZXItbGVmdCcpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBjYXNlIERpcmVjdGlvbi5yaWdodDpcclxuICAgICAgICAgICAgICAgIHRoaXMuJGNlbGwuY2xhc3NMaXN0LmFkZCgnYm9yZGVyLXJpZ2h0Jyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLnRvcDpcclxuICAgICAgICAgICAgICAgIHRoaXMuJGNlbGwuY2xhc3NMaXN0LmFkZCgnYm9yZGVyLXRvcCcpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYmxvY2soKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy4kc3Bhbi5jb250ZW50RWRpdGFibGUgPSAnZmFsc2UnO1xyXG4gICAgICAgIHRoaXMuJHNwYW4uY2xhc3NMaXN0LmFkZCgndXNlci1zZWxlY3Qtbm9uZScpO1xyXG4gICAgICAgIHRoaXMuJGNlbGwub25kYmxjbGljayA9ICgpID0+IHRoaXMua2VlcGVyLm9uRG91YmxlQ2xpY2soKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYmxvY2tObygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLiRzcGFuLmNvbnRlbnRFZGl0YWJsZSA9ICd0cnVlJztcclxuICAgICAgICB0aGlzLiRzcGFuLmNsYXNzTGlzdC5yZW1vdmUoJ3VzZXItc2VsZWN0LW5vbmUnKTtcclxuICAgICAgICB0aGlzLiRjZWxsLm9uZGJsY2xpY2sgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1bmRvV3JpdGUoKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGxhc3RTcGFjZUluZGV4ID0gdGhpcy4kc3Bhbi50ZXh0Q29udGVudC5sYXN0SW5kZXhPZignICcpO1xyXG4gICAgICAgIGlmKGxhc3RTcGFjZUluZGV4IDwgMCkgdGhpcy4kc3Bhbi50ZXh0Q29udGVudCA9ICcnO1xyXG4gICAgICAgIGVsc2UgdGhpcy4kc3Bhbi50ZXh0Q29udGVudCA9IHRoaXMuJHNwYW4udGV4dENvbnRlbnQuc3Vic3RyKDAsIGxhc3RTcGFjZUluZGV4KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdW5kb0RlbGV0ZSh0ZXh0KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy4kc3Bhbi50ZXh0Q29udGVudCArPSB0ZXh0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGREZWNvcihjc3NTdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLiRjZWxsLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIGNzc1N0cmluZyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZE1lc3NhZ2UodGV4dCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuJHNwYW4udGV4dENvbnRlbnQgPSB0ZXh0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDc3NTdHlsZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLiRjZWxsLmdldEF0dHJpYnV0ZSgnc3R5bGUnKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHNjcmVlblgoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy4kY2VsbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS54O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgc2NyZWVuWSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLiRjZWxsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQge0NlbGx9IGZyb20gXCIuLi9DZWxsL0NlbGxcIjtcclxuaW1wb3J0IHtUYWJsZU1vZH0gZnJvbSBcIi4vVGFibGVNb2RcIjtcclxuaW1wb3J0IHtBY3Rpb24sIEFjdGlvblR5cGV9IGZyb20gXCIuLi9VdGlsaXRpZXMvQWN0aW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVGFibGUge1xyXG4gICAgcHJpdmF0ZSAkdGFibGVDb250YWluZXIgPSAkKCdtYWluJyk7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgY2VsbHM6IENlbGxbXVtdID0gW107XHJcbiAgICBwdWJsaWMgbW9kOiBUYWJsZU1vZDtcclxuICAgIHB1YmxpYyByZWFkb25seSBzZWxlY3RlZENlbGxzOiBDZWxsW10gPSBbXTtcclxuICAgIHByaXZhdGUgYWN0aW9uczogQWN0aW9uW10gPSBbXTtcclxuICAgIHB1YmxpYyByZWFkb25seSB3aWR0aDogbnVtYmVyO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGhlaWdodDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfJHBvcG92ZXIgPSAkKCcjcG9wb3ZlcicpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX3N0b3JlKSB7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IF9zdG9yZS53aWR0aDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IF9zdG9yZS5oZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5maWxsVGFibGUoX3N0b3JlLmNlbGxzVW5pb25zLCBfc3RvcmUuZGVjb3JhdGlvbnMsIF9zdG9yZS5tZXNzYWdlcyk7XHJcbiAgICAgICAgbGV0ICRib2R5ID0gJCgnYm9keScpO1xyXG4gICAgICAgICRib2R5Lm9uKCdtb3VzZXVwJywgKCkgPT4gdGhpcy5vbkJvZHlNb3VzZXVwKCkpO1xyXG4gICAgICAgICRib2R5Lm9uKCdrZXlkb3duJywgKGV2ZW50KSA9PiB0aGlzLm9uQm9keUtleWRvd24oZXZlbnQpKTtcclxuICAgICAgICAkKCcjcGFnZS1uYW1lJykudGV4dChfc3RvcmUubmFtZSk7XHJcbiAgICAgICAgdGhpcy5fJHBvcG92ZXIub24oJ21vdXNldXAnLCAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGZpbGxUYWJsZShjZWxsc1VuaW9ucywgZGVjb3JhdGlvbnMsIG1lc3NhZ2VzKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5maWxsU3RhcnRUYWJsZSgpO1xyXG4gICAgICAgIHRoaXMudW5pb24oY2VsbHNVbmlvbnMpO1xyXG4gICAgICAgIHRoaXMuZGVjb3JhdGUoZGVjb3JhdGlvbnMpO1xyXG4gICAgICAgIHRoaXMuYWRkTWVzc2FnZXMobWVzc2FnZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZmlsbFN0YXJ0VGFibGUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5jZWxscy5sZW5ndGggPSAwO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5oZWlnaHQ7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmNlbGxzLnB1c2goW10pO1xyXG4gICAgICAgICAgICBsZXQgJHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3JvdycpO1xyXG4gICAgICAgICAgICAkcm93LmNsYXNzTmFtZSA9ICdjb21ncmlkLXJvdyc7XHJcbiAgICAgICAgICAgIHRoaXMuJHRhYmxlQ29udGFpbmVyLmFwcGVuZCgkcm93KTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLndpZHRoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2VsbHNbaV0ucHVzaChuZXcgQ2VsbChpLCBqLCAkcm93LCB0aGlzKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1bmlvbihjZWxsc1VuaW9ucyk6IHZvaWQge1xyXG4gICAgICAgIGNlbGxzVW5pb25zLmZvckVhY2godW5pb24gPT4gdGhpcy5jcmVhdGVVbmlvbih1bmlvbikpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlVW5pb24oY2VsbHNVbmlvbik6IHZvaWQge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSBjZWxsc1VuaW9uLmxlZnRVcFg7IGkgPD0gY2VsbHNVbmlvbi5yaWdodERvd25YOyBpKyspXHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSBjZWxsc1VuaW9uLmxlZnRVcFk7IGogPD0gY2VsbHNVbmlvbi5yaWdodERvd25ZOyBqKyspXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldENlbGwoaSwgaikuc2VsZWN0V2l0aEZyaWVuZHModHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5zZWxlY3REb3duKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkZWNvcmF0ZShkZWNvcmF0aW9ucyk6IHZvaWQge1xyXG4gICAgICAgIGRlY29yYXRpb25zLmZvckVhY2goZGVjb3JhdGlvbiA9PiB0aGlzLmRlY29yYXRlT25lKGRlY29yYXRpb24pKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRlY29yYXRlT25lKGRlY29yYXRpb24pOiB2b2lkIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gZGVjb3JhdGlvbi5sZWZ0VXBYOyBpIDw9IGRlY29yYXRpb24ucmlnaHREb3duWDsgaSsrKVxyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gZGVjb3JhdGlvbi5sZWZ0VXBZOyBqIDw9IGRlY29yYXRpb24ucmlnaHREb3duWTsgaisrKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRDZWxsKGksIGopLmFkZERlY29yKGRlY29yYXRpb24uY3NzVGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhZGRNZXNzYWdlcyhtZXNzYWdlcyk6IHZvaWQge1xyXG4gICAgICAgIG1lc3NhZ2VzLmZvckVhY2gobWVzc2FnZSA9PiB0aGlzLmdldENlbGwobWVzc2FnZS54LCBtZXNzYWdlLnkpLmFkZE1lc3NhZ2UobWVzc2FnZS50ZXh0KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvbkJvZHlNb3VzZXVwKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMubW9kID0gVGFibGVNb2Qubm9uZTtcclxuICAgICAgICB0aGlzLnNlbGVjdERvd24oKTtcclxuICAgICAgICB0aGlzLmhpZGVQb3BvdmVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZWxlY3REb3duKCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBjbG9uZSA9IHRoaXMuc2VsZWN0ZWRDZWxscy5tYXAoZWxlbSA9PiBlbGVtKTtcclxuICAgICAgICBsZXQgc3R5bGUgPSBjbG9uZVswXS5nZXRDc3NTdHlsZSgpO1xyXG4gICAgICAgIHdoaWxlICh0aGlzLnNlbGVjdGVkQ2VsbHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBsZXQgY2VsbCA9IHRoaXMuc2VsZWN0ZWRDZWxscy5wb3AoKTtcclxuICAgICAgICAgICAgY2VsbC5zZXRGcmllbmRzKGNsb25lKTtcclxuICAgICAgICAgICAgY2VsbC5zZWxlY3ROb25lKCk7XHJcbiAgICAgICAgICAgIGNlbGwuYWRkRGVjb3Ioc3R5bGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uQm9keUtleWRvd24oZXZlbnQpOiB2b2lkIHtcclxuICAgICAgICBpZiAoZXZlbnQuY3RybEtleSAmJiBldmVudC5jb2RlID09PSAnS2V5WicpIHtcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5wb3BBY3Rpb24oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldENlbGwoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBDZWxsIHtcclxuICAgICAgICBpZiAoeCA+PSAwICYmIHggPCB0aGlzLmhlaWdodCAmJiB5ID49IDAgJiYgeSA8IHRoaXMud2lkdGgpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNlbGxzW3hdW3ldO1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwdXNoQWN0aW9uKGFjdGlvbjogQWN0aW9uKSB7XHJcbiAgICAgICAgbGV0IGxhc3RBY3Rpb24gPSB0aGlzLmFjdGlvbnNbdGhpcy5hY3Rpb25zLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgIGlmIChsYXN0QWN0aW9uICE9IG51bGwgJiYgbGFzdEFjdGlvblswXSA9PT0gQWN0aW9uVHlwZS53cml0ZSAmJiBhY3Rpb25bMF0gPD0gQWN0aW9uVHlwZS53cml0ZVdpdGhTcGFjZVxyXG4gICAgICAgICAgICAmJiBsYXN0QWN0aW9uWzFdID09PSBhY3Rpb25bMV0gJiYgbGFzdEFjdGlvblsyXSA9PT0gYWN0aW9uWzJdKVxyXG4gICAgICAgICAgICB0aGlzLmFjdGlvbnMucG9wKCk7XHJcbiAgICAgICAgdGhpcy5hY3Rpb25zLnB1c2goYWN0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcG9wQWN0aW9uKCkge1xyXG4gICAgICAgIGxldCBhY3Rpb24gPSB0aGlzLmFjdGlvbnMucG9wKCk7XHJcbiAgICAgICAgc3dpdGNoIChhY3Rpb25bMF0pIHtcclxuICAgICAgICAgICAgY2FzZSBBY3Rpb25UeXBlLndyaXRlOlxyXG4gICAgICAgICAgICAgICAgdGhpcy51bmRvV3JpdGUoYWN0aW9uWzFdLCBhY3Rpb25bMl0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAvLyBjYXNlIEFjdGlvblR5cGUuZGVsZXRlOlxyXG4gICAgICAgICAgICAvLyAgICAgdGhpcy51bmRvRGVsZXRlKGFjdGlvblsxXSwgYWN0aW9uWzJdLCBhY3Rpb25bM10pO1xyXG4gICAgICAgICAgICAvLyAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBjYXNlIEFjdGlvblR5cGUud3JpdGVXaXRoU3BhY2U6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVuZG9Xcml0ZShhY3Rpb25bMV0sIGFjdGlvblsyXSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdW5kb1dyaXRlKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5nZXRDZWxsKHgsIHkpLnVuZG9Xcml0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdW5kb0RlbGV0ZSh4OiBudW1iZXIsIHk6IG51bWJlciwgdGV4dDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5nZXRDZWxsKHgsIHkpLnVuZG9EZWxldGUodGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNob3dQb3BvdmVyKHg6IG51bWJlciwgeTogbnVtYmVyLCBjZWxsOiBDZWxsKXtcclxuICAgICAgICB0aGlzLl8kcG9wb3Zlci5yZW1vdmVDbGFzcygnZC1ub25lJyk7XHJcbiAgICAgICAgdGhpcy5fJHBvcG92ZXIuYXR0cignc3R5bGUnLCBgbGVmdDogJHtjZWxsLnNjcmVlblggKyAxNn1weDsgdG9wOiAke2NlbGwuc2NyZWVuWSArIDE2fXB4O2ApO1xyXG4gICAgICAgIHRoaXMuXyRwb3BvdmVyLmZpbmQoJyNjb29yZHMnKS50ZXh0KGAke3h9LCAke3l9YCk7XHJcblxyXG4gICAgICAgIGxldCAkaW5wdXQgPSB0aGlzLl8kcG9wb3Zlci5maW5kKCcjY3NzU3R5bGVJbnB1dCcpO1xyXG4gICAgICAgICRpbnB1dC52YWwoY2VsbC5nZXRDc3NTdHlsZSgpKTtcclxuICAgICAgICAkaW5wdXQub2ZmKCdjaGFuZ2UnKTtcclxuICAgICAgICAkaW5wdXQub24oJ2NoYW5nZScsICgpID0+IGNlbGwuYWRkRGVjb3JXaXRoRnJpZW5kcygkaW5wdXQudmFsKCkpKTtcclxuXHJcbiAgICAgICAgbGV0ICRidXR0b24xID0gdGhpcy5fJHBvcG92ZXIuZmluZCgnI2VkaXRUZXh0QnV0dG9uJyk7XHJcbiAgICAgICAgJGJ1dHRvbjEub2ZmKCdjbGljaycpO1xyXG4gICAgICAgICRidXR0b24xLm9uKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgY2VsbC5mb2N1cygpO1xyXG4gICAgICAgICAgICB0aGlzLmhpZGVQb3BvdmVyKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCAkYnV0dG9uMiA9IHRoaXMuXyRwb3BvdmVyLmZpbmQoJyNkaXZpZGVCdXR0b24nKTtcclxuICAgICAgICAkYnV0dG9uMi5vZmYoJ2NsaWNrJyk7XHJcbiAgICAgICAgJGJ1dHRvbjIub24oJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjZWxsLnNlcGFyYXRlV2l0aEZyaWVuZHMoKTtcclxuICAgICAgICAgICAgY2VsbC5mb2N1cygpO1xyXG4gICAgICAgICAgICB0aGlzLmhpZGVQb3BvdmVyKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGhpZGVQb3BvdmVyKCl7XHJcbiAgICAgICAgdGhpcy5fJHBvcG92ZXIuYWRkQ2xhc3MoJ2Qtbm9uZScpO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGVudW0gVGFibGVNb2R7XHJcbiAgICBub25lLFxyXG4gICAgc2VsZWN0aW5nXHJcbn0iLCJpbXBvcnQge1RhYmxlfSBmcm9tIFwiLi9UYWJsZVwiO1xyXG5cclxubGV0IHRhYmxlO1xyXG5jb25zdCBsaW5rID0gXCJodHRwczovL2NvbWdyaWQucnU6ODQ0M1wiO1xyXG5sZXQgY2VsbHNVbmlvbnMgPSBbXHJcbiAgICB7XHJcbiAgICAgICAgbGVmdFVwWDogMTEsXHJcbiAgICAgICAgbGVmdFVwWTogMTQsXHJcbiAgICAgICAgcmlnaHREb3duWDogMTcsXHJcbiAgICAgICAgcmlnaHREb3duWTogMTdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgbGVmdFVwWDogMjIsXHJcbiAgICAgICAgbGVmdFVwWTogMTcsXHJcbiAgICAgICAgcmlnaHREb3duWDogMjQsXHJcbiAgICAgICAgcmlnaHREb3duWTogMzBcclxuICAgIH1cclxuXTtcclxuZXhwb3J0IGxldCBzdG9yZSA9IHtcclxuICAgIGhlaWdodDogNTAsXHJcbiAgICB3aWR0aDogNTAsXHJcbiAgICBjZWxsc1VuaW9uczogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGVmdFVwWDogMTEsXHJcbiAgICAgICAgICAgIGxlZnRVcFk6IDE0LFxyXG4gICAgICAgICAgICByaWdodERvd25YOiAxNyxcclxuICAgICAgICAgICAgcmlnaHREb3duWTogMTdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGVmdFVwWDogMjIsXHJcbiAgICAgICAgICAgIGxlZnRVcFk6IDE3LFxyXG4gICAgICAgICAgICByaWdodERvd25YOiAyNCxcclxuICAgICAgICAgICAgcmlnaHREb3duWTogMzBcclxuICAgICAgICB9XHJcbiAgICBdLFxyXG4gICAgZGVjb3JhdGlvbnM6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxlZnRVcFg6IDExLFxyXG4gICAgICAgICAgICBsZWZ0VXBZOiAxNCxcclxuICAgICAgICAgICAgcmlnaHREb3duWDogMTcsXHJcbiAgICAgICAgICAgIHJpZ2h0RG93blk6IDE3LFxyXG4gICAgICAgICAgICBjc3NUZXh0OiBcImJhY2tncm91bmQtY29sb3I6IGJsdWU7IGNvbG9yOiB5ZWxsb3cgIWltcG9ydGFudDsgYm9yZGVyLWNvbG9yOiByZWQgIWltcG9ydGFudDtcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZWZ0VXBYOiAzMSxcclxuICAgICAgICAgICAgbGVmdFVwWTogNDEsXHJcbiAgICAgICAgICAgIHJpZ2h0RG93blg6IDMxLFxyXG4gICAgICAgICAgICByaWdodERvd25ZOiA0MSxcclxuICAgICAgICAgICAgY3NzVGV4dDogXCJiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMjA0LDExLDExKTsgY29sb3I6IGdyZWVuICFpbXBvcnRhbnQ7IGJvcmRlci1jb2xvcjogYmx1ZSAhaW1wb3J0YW50O1wiXHJcbiAgICAgICAgfVxyXG4gICAgXSxcclxuICAgIG1lc3NhZ2VzOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB4OiAyMixcclxuICAgICAgICAgICAgeTogMTcsXHJcbiAgICAgICAgICAgIHRleHQ6IFwi0KDQtdCx0Y/RgtCwLCDQv9GA0LjQstC10YIsINGH0YLQviDQt9Cw0LTQsNC70Lgg0L/QviDQv9GA0LXQutGA0LDRgdC90L7QuSDQttC40LfQvdC4INCx0LXQtyDQt9Cw0LHQvtGCP1wiXHJcbiAgICAgICAgfVxyXG4gICAgXSxcclxuICAgIHNlbGVjdGVkQ2xhc3NlczogWydiZy1kYXJrJywgJ3RleHQtbGlnaHQnXSxcclxuICAgIG5vU2VsZWN0ZWRDbGFzc2VzOiBbJ3RleHQtZGFyayddXHJcbn1cclxuXHJcbiQod2luZG93KS5vbignbG9hZCcsICgpID0+IHtcclxuICAgIGNoZWNrQXV0aG9yaXphdGlvbigpXHJcbiAgICAudGhlbigoKSA9PiBnZXRUYWJsZUluZm8oKSlcclxuICAgIC50aGVuKCgpID0+IGdldFRhYmxlTWVzc2FnZXMoKSlcclxuICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlRhYmxlIG1lc3NhZ2VzXCIpXHJcbiAgICAgICAgc3RvcmUuY2VsbHNVbmlvbnMgPSBjZWxsc1VuaW9ucztcclxuICAgICAgICB0YWJsZSA9IG5ldyBUYWJsZShzdG9yZSk7XHJcbiAgICB9KVxyXG59KTtcclxuXHJcbmZ1bmN0aW9uIGNoZWNrQXV0aG9yaXphdGlvbigpIHtcclxuICAgIHJldHVybiBmZXRjaChcclxuICAgICAgICBsaW5rICsgXCIvdXNlci9sb2dpblwiLFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwiaW5jbHVkZVwiLFxyXG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIn1cclxuICAgICAgICB9XHJcbiAgICApLnRoZW4oKHJlc3BvbnNlKSA9PntcclxuICAgICAgICBpZihyZXNwb25zZS5zdGF0dXMgIT09IDIwMCl7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gbGluayArIFwiL29hdXRoMi9hdXRob3JpemF0aW9uL2dvb2dsZVwiXHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCgpXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFBhcmFtKG5hbWU6IHN0cmluZyk6IHN0cmluZ3tcclxuICAgIGNvbnN0IHVybFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaClcclxuICAgIHJldHVybiB1cmxQYXJhbXMuZ2V0KG5hbWUpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFRhYmxlSW5mbygpIHtcclxuICAgIGNvbnN0IGlkID0gZ2V0UGFyYW0oXCJpZFwiKVxyXG4gICAgcmV0dXJuIGZldGNoKFxyXG4gICAgICAgIGxpbmsgKyBcIi90YWJsZS9pbmZvP2NoYXRJZD1cIiArIGlkLFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwiaW5jbHVkZVwiLFxyXG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIn1cclxuICAgICAgICB9XHJcbiAgICApLnRoZW4oKHJlc3VsdCkgPT57XHJcbiAgICAgICAgcmVzdWx0LnRleHQoKS50aGVuKCh0ZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGlmKHJlc3VsdC5zdGF0dXMgPT0gMjAwKXtcclxuICAgICAgICAgICAgICAgIHN0b3JlID0gSlNPTi5wYXJzZSh0ZXh0KVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coc3RvcmUpXHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0LnN0YXR1cyArIFwiLCBcIiArIHRleHQpXHJcbiAgICAgICAgICAgICAgICBhbGVydChcIkVycm9yIG9jY3VycmVkOiBzZWUgY29uc29sZSBmb3IgbW9yZSBkZXRhaWxzXCIpXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiRXJyb3Igb2NjdXJyZWQ6IHNlZSBjb25zb2xlIGZvciBtb3JlIGRldGFpbHNcIilcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0VGFibGVNZXNzYWdlcygpIHtcclxuICAgIGNvbnN0IGlkID0gZ2V0UGFyYW0oXCJpZFwiKVxyXG4gICAgcmV0dXJuIGZldGNoKFxyXG4gICAgICAgIGxpbmsgKyBcIi90YWJsZS9tZXNzYWdlc1wiLFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwiaW5jbHVkZVwiLFxyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJ9LFxyXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICAgICAgICBjaGF0SWQ6ICtpZCxcclxuICAgICAgICAgICAgICAgIHhDb29yZExlZnRUb3A6IDAsXHJcbiAgICAgICAgICAgICAgICB5Q29vcmRMZWZ0VG9wOiAwLFxyXG4gICAgICAgICAgICAgICAgeENvb3JkUmlnaHRCb3R0b206IHN0b3JlLmhlaWdodCAtIDEsXHJcbiAgICAgICAgICAgICAgICB5Q29vcmRMZWZ0Qm90dG9tOiBzdG9yZS53aWR0aCAtIDFcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICApLnRoZW4oKHJlc3VsdCkgPT5cclxuICAgICAgICByZXN1bHQudGV4dCgpLnRoZW4oKHRleHQpID0+IHtcclxuICAgICAgICAgICAgaWYocmVzdWx0LnN0YXR1cyA9PSAyMDApe1xyXG4gICAgICAgICAgICAgICAgc3RvcmUubWVzc2FnZXMgPSBKU09OLnBhcnNlKHRleHQpXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzdG9yZS5tZXNzYWdlcylcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQuc3RhdHVzICsgXCIsIFwiICsgdGV4dClcclxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3Igb2NjdXJyZWQ6IHNlZSBjb25zb2xlIGZvciBtb3JlIGRldGFpbHNcIilcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJFcnJvciBvY2N1cnJlZDogc2VlIGNvbnNvbGUgZm9yIG1vcmUgZGV0YWlsc1wiKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICk7XHJcbn0iLCJcclxuZXhwb3J0IGVudW0gQWN0aW9uVHlwZSB7XHJcbiAgICB3cml0ZSxcclxuICAgIHdyaXRlV2l0aFNwYWNlLFxyXG4gICAgZGVsZXRlLFxyXG4gICAgdW5pb25cclxufVxyXG5cclxuZXhwb3J0IHR5cGUgQWN0aW9uID0gW2FjdGlvblR5cGU6IEFjdGlvblR5cGUsIGNlbGxYOiBudW1iZXIsIGNlbGxZOiBudW1iZXIsIGluZm8/OiBhbnldOyIsImV4cG9ydCBlbnVtIERpcmVjdGlvbntcclxuICAgIGxlZnQsXHJcbiAgICByaWdodCxcclxuICAgIHRvcCxcclxuICAgIGJvdHRvbVxyXG59Il19
