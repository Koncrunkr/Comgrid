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
                throw new TypeError("".concat(result.text().then(function (haha) { return haha; })));
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
                throw new TypeError("".concat(result.text().then(function (haha) { return haha; })));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJUU2NyaXB0L1RhYmxlUGFnZS9DZWxsL0NlbGwudHMiLCJUU2NyaXB0L1RhYmxlUGFnZS9DZWxsL0NlbGxEcmF3ZXIudHMiLCJUU2NyaXB0L1RhYmxlUGFnZS9NYWluL1RhYmxlLnRzIiwiVFNjcmlwdC9UYWJsZVBhZ2UvTWFpbi9UYWJsZU1vZC50cyIsIlRTY3JpcHQvVGFibGVQYWdlL01haW4vVGFibGVQYWdlLnRzIiwiVFNjcmlwdC9UYWJsZVBhZ2UvVXRpbGl0aWVzL0FjdGlvbi50cyIsIlRTY3JpcHQvVGFibGVQYWdlL1V0aWxpdGllcy9EaXJlY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNBQSwyQ0FBd0M7QUFFeEMsNkNBQTBDO0FBQzFDLG9EQUFpRDtBQUNqRCw4Q0FBK0M7QUFLL0M7SUFNSSxjQUNvQixDQUFTLEVBQ1QsQ0FBUyxFQUN6QixJQUFpQixFQUNELEtBQVk7UUFIWixNQUFDLEdBQUQsQ0FBQyxDQUFRO1FBQ1QsTUFBQyxHQUFELENBQUMsQ0FBUTtRQUVULFVBQUssR0FBTCxLQUFLLENBQU87UUFFNUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLHVCQUFVLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRCxzQkFBVywyQkFBUzthQUFwQjtZQUFBLGlCQVVDO1lBVEcsT0FBTyxDQUFDLFVBQUEsS0FBSztnQkFDVCxJQUFJLEtBQUssQ0FBQyxPQUFPO29CQUFFLE9BQU87Z0JBQzFCLElBQUksS0FBSyxDQUFDLFFBQVE7b0JBQUUsT0FBTztnQkFDM0IsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLFNBQVM7b0JBQUUsS0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUM3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QUksT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFDLElBQUksSUFBSyxPQUFBLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBNUMsQ0FBNEMsQ0FBQyxJQUFJLElBQUk7WUFDNUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMscUJBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFJLElBQUssT0FBQSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQTVDLENBQTRDLENBQUMsSUFBSSxJQUFJO1lBQzVFLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLHFCQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0MsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSSxJQUFLLE9BQUEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSSxDQUFDLENBQUMsQ0FBQyxFQUE1QyxDQUE0QyxDQUFDLElBQUksSUFBSTtZQUM1RSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxxQkFBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVDLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFDLElBQUksSUFBSyxPQUFBLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUksQ0FBQyxDQUFDLENBQUMsRUFBNUMsQ0FBNEMsQ0FBQyxJQUFJLElBQUk7WUFDNUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZ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QyxFQUxXLFVBQVUsR0FBVixrQkFBVSxLQUFWLGtCQUFVLFFBS3JCOzs7OztBQ05ELElBQVksU0FLWDtBQUxELFdBQVksU0FBUztJQUNqQix5Q0FBSSxDQUFBO0lBQ0osMkNBQUssQ0FBQTtJQUNMLHVDQUFHLENBQUE7SUFDSCw2Q0FBTSxDQUFBO0FBQ1YsQ0FBQyxFQUxXLFNBQVMsR0FBVCxpQkFBUyxLQUFULGlCQUFTLFFBS3BCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IHtDZWxsRHJhd2VyfSBmcm9tIFwiLi9DZWxsRHJhd2VyXCI7XHJcbmltcG9ydCB7VGFibGV9IGZyb20gXCIuLi9NYWluL1RhYmxlXCI7XHJcbmltcG9ydCB7VGFibGVNb2R9IGZyb20gXCIuLi9NYWluL1RhYmxlTW9kXCI7XHJcbmltcG9ydCB7RGlyZWN0aW9ufSBmcm9tIFwiLi4vVXRpbGl0aWVzL0RpcmVjdGlvblwiO1xyXG5pbXBvcnQge0FjdGlvblR5cGV9IGZyb20gXCIuLi9VdGlsaXRpZXMvQWN0aW9uXCI7XHJcbmltcG9ydCB7Y3NzfSBmcm9tIFwianF1ZXJ5XCI7XHJcblxyXG50eXBlIG9uVHJpZ2dlciA9IChldmVudD86IGFueSkgPT4gdm9pZCB8IGJvb2xlYW5cclxuXHJcbmV4cG9ydCBjbGFzcyBDZWxsIHtcclxuICAgIHByaXZhdGUgZHJhd2VyOiBDZWxsRHJhd2VyO1xyXG4gICAgcHJpdmF0ZSBfZnJpZW5kczogQ2VsbFtdO1xyXG4gICAgcHJpdmF0ZSBfYmxvY2tlZDogYm9vbGVhbjtcclxuICAgIHByaXZhdGUgX3NlbGVjdGVkOiBib29sZWFuO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHB1YmxpYyByZWFkb25seSB4OiBudW1iZXIsXHJcbiAgICAgICAgcHVibGljIHJlYWRvbmx5IHk6IG51bWJlcixcclxuICAgICAgICAkcm93OiBIVE1MRWxlbWVudCxcclxuICAgICAgICBwdWJsaWMgcmVhZG9ubHkgdGFibGU6IFRhYmxlXHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLmRyYXdlciA9IG5ldyBDZWxsRHJhd2VyKCRyb3csIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgb25LZXlkb3duKCk6IG9uVHJpZ2dlciB7XHJcbiAgICAgICAgcmV0dXJuIChldmVudCA9PiB7XHJcbiAgICAgICAgICAgIGlmIChldmVudC5jdHJsS2V5KSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmIChldmVudC5zaGlmdEtleSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAoZXZlbnQuY29kZSA9PT0gJ0Fycm93VXAnKSB0aGlzLnRhYmxlLmdldENlbGwodGhpcy54IC0gMSwgdGhpcy55KS5mb2N1cygpO1xyXG4gICAgICAgICAgICBpZiAoZXZlbnQuY29kZSA9PT0gJ0Fycm93RG93bicgfHwgZXZlbnQuY29kZSA9PT0gJ0VudGVyJykgdGhpcy50YWJsZS5nZXRDZWxsKHRoaXMueCArIDEsIHRoaXMueSkuZm9jdXMoKTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmlzRW1wdHkoKSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAoZXZlbnQuY29kZSA9PT0gJ0Fycm93TGVmdCcpIHRoaXMudGFibGUuZ2V0Q2VsbCh0aGlzLngsIHRoaXMueSAtIDEpLmZvY3VzKCk7XHJcbiAgICAgICAgICAgIGlmIChldmVudC5jb2RlID09PSAnQXJyb3dSaWdodCcpIHRoaXMudGFibGUuZ2V0Q2VsbCh0aGlzLngsIHRoaXMueSArIDEpLmZvY3VzKCk7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG9uTW91c2VlbnRlcigpOiBvblRyaWdnZXIge1xyXG4gICAgICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRhYmxlLm1vZCAhPT0gVGFibGVNb2Quc2VsZWN0aW5nKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0V2l0aEZyaWVuZHMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBvbk1vdXNlZG93bigpOiBvblRyaWdnZXIge1xyXG4gICAgICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudGFibGUubW9kID0gVGFibGVNb2Quc2VsZWN0aW5nO1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdFdpdGhGcmllbmRzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgb25Eb3VibGVDbGljaygpOiBvblRyaWdnZXIge1xyXG4gICAgICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZm9jdXMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBvbkJsdXIoKTogb25UcmlnZ2VyIHtcclxuICAgICAgICByZXR1cm4gKHRleHQ6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICBpZih0ZXh0Lmxlbmd0aCAhPT0gMClcclxuICAgICAgICAgICAgICAgIHRoaXMuYmxvY2soKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBvbklucHV0KCk6IG9uVHJpZ2dlciB7XHJcbiAgICAgICAgcmV0dXJuIChldmVudDogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LmlucHV0VHlwZSk7XHJcbiAgICAgICAgICAgIGlmKGV2ZW50LmlucHV0VHlwZVswXSA9PT0gJ2knKVxyXG4gICAgICAgICAgICAgICAgaWYoZXZlbnQuZGF0YSA9PT0gJyAnKSB0aGlzLnRhYmxlLnB1c2hBY3Rpb24oW0FjdGlvblR5cGUud3JpdGVXaXRoU3BhY2UsIHRoaXMueCwgdGhpcy55XSk7XHJcbiAgICAgICAgICAgICAgICBlbHNlIHRoaXMudGFibGUucHVzaEFjdGlvbihbQWN0aW9uVHlwZS53cml0ZSwgdGhpcy54LCB0aGlzLnldKTtcclxuICAgICAgICAgICAgZWxzZSBpZihldmVudC5pbnB1dFR5cGVbMF0gPT09ICdkJylcclxuICAgICAgICAgICAgICAgIHRoaXMudGFibGUucHVzaEFjdGlvbihbQWN0aW9uVHlwZS5kZWxldGUsIHRoaXMueCwgdGhpcy55LCBldmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YSgndGV4dC9odG1sJyldKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBvbkNvbnRleHRtZW51KCk6IG9uVHJpZ2dlciB7XHJcbiAgICAgICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy50YWJsZS5zaG93UG9wb3Zlcih0aGlzLngsIHRoaXMueSwgdGhpcyk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGZvY3VzKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZHJhd2VyLmJsb2NrTm8oKTtcclxuICAgICAgICB0aGlzLmRyYXdlci5mb2N1cygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZWxlY3RXaXRoRnJpZW5kcyh5ZXM6IGJvb2xlYW4gPSB0cnVlKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2ZyaWVuZHMgPT0gbnVsbCB8fCB0aGlzLl9mcmllbmRzLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgeWVzID8gdGhpcy5zZWxlY3QoKSA6IHRoaXMuc2VsZWN0Tm9uZSgpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5fZnJpZW5kcy5mb3JFYWNoKChmcmllbmQpID0+IHllcyA/IGZyaWVuZC5zZWxlY3QoKSA6IGZyaWVuZC5zZWxlY3ROb25lKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRGcmllbmRzKGZyaWVuZHM6IENlbGxbXSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2ZyaWVuZHMgPSBmcmllbmRzO1xyXG4gICAgICAgIHRoaXMuZHJhd2VyLmFkZEJvcmRlcnMoRGlyZWN0aW9uLnRvcCwgRGlyZWN0aW9uLmJvdHRvbSwgRGlyZWN0aW9uLmxlZnQsIERpcmVjdGlvbi5yaWdodClcclxuICAgICAgICBpZiAoZnJpZW5kcy5maW5kKChjZWxsKSA9PiAoY2VsbC54ID09PSB0aGlzLnggJiYgY2VsbC55ID09PSB0aGlzLnkgKyAxKSkgIT0gbnVsbClcclxuICAgICAgICAgICAgdGhpcy5kcmF3ZXIucmVtb3ZlQm9yZGVyKERpcmVjdGlvbi5yaWdodCk7XHJcbiAgICAgICAgaWYgKGZyaWVuZHMuZmluZCgoY2VsbCkgPT4gKGNlbGwueCA9PT0gdGhpcy54ICYmIGNlbGwueSA9PT0gdGhpcy55IC0gMSkpICE9IG51bGwpXHJcbiAgICAgICAgICAgIHRoaXMuZHJhd2VyLnJlbW92ZUJvcmRlcihEaXJlY3Rpb24ubGVmdCk7XHJcbiAgICAgICAgaWYgKGZyaWVuZHMuZmluZCgoY2VsbCkgPT4gKGNlbGwueCA9PT0gdGhpcy54IC0gMSAmJiBjZWxsLnkgPT09IHRoaXMueSkpICE9IG51bGwpXHJcbiAgICAgICAgICAgIHRoaXMuZHJhd2VyLnJlbW92ZUJvcmRlcihEaXJlY3Rpb24udG9wKTtcclxuICAgICAgICBpZiAoZnJpZW5kcy5maW5kKChjZWxsKSA9PiAoY2VsbC54ID09PSB0aGlzLnggKyAxICYmIGNlbGwueSA9PT0gdGhpcy55KSkgIT0gbnVsbClcclxuICAgICAgICAgICAgdGhpcy5kcmF3ZXIucmVtb3ZlQm9yZGVyKERpcmVjdGlvbi5ib3R0b20pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZWxlY3QoKTogdm9pZCB7XHJcbiAgICAgICAgaWYodGhpcy5fc2VsZWN0ZWQpIHJldHVybjtcclxuICAgICAgICB0aGlzLl9zZWxlY3RlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy50YWJsZS5zZWxlY3RlZENlbGxzLnB1c2godGhpcyk7XHJcbiAgICAgICAgdGhpcy5kcmF3ZXIuc2VsZWN0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNlbGVjdE5vbmUoKTogdm9pZCB7XHJcbiAgICAgICAgaWYoIXRoaXMuX3NlbGVjdGVkKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmRyYXdlci5zZWxlY3ROb25lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGlzRW1wdHkoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZHJhd2VyLmlzRW1wdHkoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGJsb2NrKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZHJhd2VyLmJsb2NrKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBibG9ja05vKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZHJhd2VyLmJsb2NrTm8oKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdW5kb1dyaXRlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZHJhd2VyLnVuZG9Xcml0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1bmRvRGVsZXRlKHRleHQ6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZHJhd2VyLnVuZG9EZWxldGUodGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZERlY29yKGNzc1N0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZHJhd2VyLmFkZERlY29yKGNzc1N0cmluZyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZERlY29yV2l0aEZyaWVuZHMoY3NzU3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2ZyaWVuZHMgPT0gbnVsbCB8fCB0aGlzLl9mcmllbmRzLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgdGhpcy5hZGREZWNvcihjc3NTdHJpbmcpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5fZnJpZW5kcy5mb3JFYWNoKChmcmllbmQpID0+IGZyaWVuZC5hZGREZWNvcihjc3NTdHJpbmcpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkTWVzc2FnZSh0ZXh0KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5kcmF3ZXIuYWRkTWVzc2FnZSh0ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q3NzU3R5bGUoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kcmF3ZXIuZ2V0Q3NzU3R5bGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHNjcmVlblgoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kcmF3ZXIuc2NyZWVuWDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHNjcmVlblkoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kcmF3ZXIuc2NyZWVuWTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNlcGFyYXRlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuc2V0RnJpZW5kcyhbdGhpc10pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXBhcmF0ZVdpdGhvdXRGcmllbmRzKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLl9mcmllbmRzICE9IG51bGwpe1xyXG4gICAgICAgICAgICBsZXQgaW5kZXggPSB0aGlzLl9mcmllbmRzLmluZGV4T2YodGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZyaWVuZHMuc3BsaWNlKGluZGV4LCBpbmRleCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2VwYXJhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VwYXJhdGVXaXRoRnJpZW5kcygpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5fZnJpZW5kcyA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgbGV0IGNsb25lID0gdGhpcy5fZnJpZW5kcztcclxuICAgICAgICBjbG9uZS5mb3JFYWNoKChlbGVtKSA9PiBlbGVtLnNlcGFyYXRlKCkpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHtDZWxsfSBmcm9tIFwiLi9DZWxsXCI7XHJcbmltcG9ydCB7c3RvcmV9IGZyb20gXCIuLi9NYWluL1RhYmxlUGFnZVwiO1xyXG5pbXBvcnQge0RpcmVjdGlvbn0gZnJvbSBcIi4uL1V0aWxpdGllcy9EaXJlY3Rpb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDZWxsRHJhd2VyIHtcclxuICAgIHByaXZhdGUgJGNlbGw6IEhUTUxFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSAkc3BhbjogSFRNTEVsZW1lbnQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgJHJvdzogSFRNTEVsZW1lbnQsXHJcbiAgICAgICAgcHJpdmF0ZSBrZWVwZXI6IENlbGxcclxuICAgICkge1xyXG4gICAgICAgIHRoaXMuaW5pdCgkcm93KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXQoJHJvdyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuJHNwYW4gPSB0aGlzLiRjcmVhdGVTcGFuKCk7XHJcbiAgICAgICAgdGhpcy4kY2VsbCA9IHRoaXMuJGNyZWF0ZUNlbGwodGhpcy4kc3Bhbik7XHJcbiAgICAgICAgJHJvdy5hcHBlbmQodGhpcy4kY2VsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSAkY3JlYXRlU3BhbigpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgICAgbGV0ICRzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgICRzcGFuLmNsYXNzTmFtZSA9ICd0ZXh0LW5vd3JhcCBuby1zaG93LWZvY3VzJztcclxuICAgICAgICAkc3Bhbi5vbmtleWRvd24gPSAoZXZlbnQpID0+IHRoaXMua2VlcGVyLm9uS2V5ZG93bihldmVudCk7XHJcbiAgICAgICAgJHNwYW4ub25ibHVyID0gKCkgPT4gdGhpcy5rZWVwZXIub25CbHVyKCRzcGFuLnRleHRDb250ZW50KTtcclxuICAgICAgICAkc3Bhbi5vbmlucHV0ID0gKGV2ZW50KSA9PiB0aGlzLmtlZXBlci5vbklucHV0KGV2ZW50KTtcclxuICAgICAgICAkc3Bhbi5jb250ZW50RWRpdGFibGUgPSAndHJ1ZSc7XHJcbiAgICAgICAgcmV0dXJuICRzcGFuO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgJGNyZWF0ZUNlbGwoJHNwYW46IEhUTUxFbGVtZW50KTogSFRNTEVsZW1lbnQge1xyXG4gICAgICAgIGxldCAkY2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICRjZWxsLmNsYXNzTmFtZSA9ICdjb21ncmlkLWNlbGwgYm9yZGVyLXRvcCBib3JkZXItbGVmdCBib3JkZXItcmlnaHQgYm9yZGVyLWJvdHRvbSB0ZXh0LWRhcmsnO1xyXG4gICAgICAgICRjZWxsLm9ubW91c2VlbnRlciA9ICgpID0+IHRoaXMua2VlcGVyLm9uTW91c2VlbnRlcigpO1xyXG4gICAgICAgICRjZWxsLm9ubW91c2Vkb3duID0gKCkgPT4gdGhpcy5rZWVwZXIub25Nb3VzZWRvd24oKTtcclxuICAgICAgICAkY2VsbC5vbmRyYWdzdGFydCA9ICgpID0+IGZhbHNlO1xyXG4gICAgICAgICRjZWxsLm9uY29udGV4dG1lbnUgPSAoKSA9PiB0aGlzLmtlZXBlci5vbkNvbnRleHRtZW51KCk7XHJcbiAgICAgICAgJGNlbGwuYXBwZW5kKCRzcGFuKTtcclxuICAgICAgICByZXR1cm4gJGNlbGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGZvY3VzKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuJHNwYW4uZm9jdXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VsZWN0KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuJGNlbGwuY2xhc3NMaXN0LnJlbW92ZSguLi5zdG9yZS5ub1NlbGVjdGVkQ2xhc3Nlcyk7XHJcbiAgICAgICAgdGhpcy4kY2VsbC5jbGFzc0xpc3QuYWRkKC4uLnN0b3JlLnNlbGVjdGVkQ2xhc3Nlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNlbGVjdE5vbmUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy4kY2VsbC5jbGFzc0xpc3QucmVtb3ZlKC4uLnN0b3JlLnNlbGVjdGVkQ2xhc3Nlcyk7XHJcbiAgICAgICAgdGhpcy4kY2VsbC5jbGFzc0xpc3QuYWRkKC4uLnN0b3JlLm5vU2VsZWN0ZWRDbGFzc2VzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaXNFbXB0eSgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy4kc3Bhbi50ZXh0Q29udGVudC5sZW5ndGggPT09IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbW92ZUJvcmRlcnMoLi4uZGlyZWN0aW9uczogRGlyZWN0aW9uW10pOiB2b2lkIHtcclxuICAgICAgICBkaXJlY3Rpb25zLmZvckVhY2goKGRpcmVjdGlvbikgPT4gdGhpcy5yZW1vdmVCb3JkZXIoZGlyZWN0aW9uKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbW92ZUJvcmRlcihkaXJlY3Rpb246IERpcmVjdGlvbik6IHZvaWQge1xyXG4gICAgICAgIHN3aXRjaCAoZGlyZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLmJvdHRvbTpcclxuICAgICAgICAgICAgICAgIHRoaXMuJGNlbGwuY2xhc3NMaXN0LnJlbW92ZSgnYm9yZGVyLWJvdHRvbScpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBjYXNlIERpcmVjdGlvbi5sZWZ0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy4kY2VsbC5jbGFzc0xpc3QucmVtb3ZlKCdib3JkZXItbGVmdCcpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBjYXNlIERpcmVjdGlvbi5yaWdodDpcclxuICAgICAgICAgICAgICAgIHRoaXMuJGNlbGwuY2xhc3NMaXN0LnJlbW92ZSgnYm9yZGVyLXJpZ2h0Jyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLnRvcDpcclxuICAgICAgICAgICAgICAgIHRoaXMuJGNlbGwuY2xhc3NMaXN0LnJlbW92ZSgnYm9yZGVyLXRvcCcpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkQm9yZGVycyguLi5kaXJlY3Rpb25zOiBEaXJlY3Rpb25bXSk6IHZvaWQge1xyXG4gICAgICAgIGRpcmVjdGlvbnMuZm9yRWFjaCgoZGlyZWN0aW9uKSA9PiB0aGlzLmFkZEJvcmRlcihkaXJlY3Rpb24pKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkQm9yZGVyKGRpcmVjdGlvbjogRGlyZWN0aW9uKTogdm9pZCB7XHJcbiAgICAgICAgc3dpdGNoIChkaXJlY3Rpb24pIHtcclxuICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24uYm90dG9tOlxyXG4gICAgICAgICAgICAgICAgdGhpcy4kY2VsbC5jbGFzc0xpc3QuYWRkKCdib3JkZXItYm90dG9tJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLmxlZnQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRjZWxsLmNsYXNzTGlzdC5hZGQoJ2JvcmRlci1sZWZ0Jyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLnJpZ2h0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy4kY2VsbC5jbGFzc0xpc3QuYWRkKCdib3JkZXItcmlnaHQnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24udG9wOlxyXG4gICAgICAgICAgICAgICAgdGhpcy4kY2VsbC5jbGFzc0xpc3QuYWRkKCdib3JkZXItdG9wJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBibG9jaygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLiRzcGFuLmNvbnRlbnRFZGl0YWJsZSA9ICdmYWxzZSc7XHJcbiAgICAgICAgdGhpcy4kc3Bhbi5jbGFzc0xpc3QuYWRkKCd1c2VyLXNlbGVjdC1ub25lJyk7XHJcbiAgICAgICAgdGhpcy4kY2VsbC5vbmRibGNsaWNrID0gKCkgPT4gdGhpcy5rZWVwZXIub25Eb3VibGVDbGljaygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBibG9ja05vKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuJHNwYW4uY29udGVudEVkaXRhYmxlID0gJ3RydWUnO1xyXG4gICAgICAgIHRoaXMuJHNwYW4uY2xhc3NMaXN0LnJlbW92ZSgndXNlci1zZWxlY3Qtbm9uZScpO1xyXG4gICAgICAgIHRoaXMuJGNlbGwub25kYmxjbGljayA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVuZG9Xcml0ZSgpOiB2b2lkIHtcclxuICAgICAgICBsZXQgbGFzdFNwYWNlSW5kZXggPSB0aGlzLiRzcGFuLnRleHRDb250ZW50Lmxhc3RJbmRleE9mKCcgJyk7XHJcbiAgICAgICAgaWYobGFzdFNwYWNlSW5kZXggPCAwKSB0aGlzLiRzcGFuLnRleHRDb250ZW50ID0gJyc7XHJcbiAgICAgICAgZWxzZSB0aGlzLiRzcGFuLnRleHRDb250ZW50ID0gdGhpcy4kc3Bhbi50ZXh0Q29udGVudC5zdWJzdHIoMCwgbGFzdFNwYWNlSW5kZXgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1bmRvRGVsZXRlKHRleHQpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLiRzcGFuLnRleHRDb250ZW50ICs9IHRleHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZERlY29yKGNzc1N0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuJGNlbGwuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgY3NzU3RyaW5nKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkTWVzc2FnZSh0ZXh0KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy4kc3Bhbi50ZXh0Q29udGVudCA9IHRleHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldENzc1N0eWxlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuJGNlbGwuZ2V0QXR0cmlidXRlKCdzdHlsZScpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgc2NyZWVuWCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLiRjZWxsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLng7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBzY3JlZW5ZKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuJGNlbGwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueTtcclxuICAgIH1cclxufSIsImltcG9ydCB7Q2VsbH0gZnJvbSBcIi4uL0NlbGwvQ2VsbFwiO1xyXG5pbXBvcnQge1RhYmxlTW9kfSBmcm9tIFwiLi9UYWJsZU1vZFwiO1xyXG5pbXBvcnQge0FjdGlvbiwgQWN0aW9uVHlwZX0gZnJvbSBcIi4uL1V0aWxpdGllcy9BY3Rpb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUYWJsZSB7XHJcbiAgICBwcml2YXRlICR0YWJsZUNvbnRhaW5lciA9ICQoJ21haW4nKTtcclxuICAgIHB1YmxpYyByZWFkb25seSBjZWxsczogQ2VsbFtdW10gPSBbXTtcclxuICAgIHB1YmxpYyBtb2Q6IFRhYmxlTW9kO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IHNlbGVjdGVkQ2VsbHM6IENlbGxbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBhY3Rpb25zOiBBY3Rpb25bXSA9IFtdO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IHdpZHRoOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgaGVpZ2h0OiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF8kcG9wb3ZlciA9ICQoJyNwb3BvdmVyJyk7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfc3RvcmUpIHtcclxuICAgICAgICB0aGlzLndpZHRoID0gX3N0b3JlLndpZHRoO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gX3N0b3JlLmhlaWdodDtcclxuICAgICAgICB0aGlzLmZpbGxUYWJsZShfc3RvcmUuY2VsbHNVbmlvbnMsIF9zdG9yZS5kZWNvcmF0aW9ucywgX3N0b3JlLm1lc3NhZ2VzKTtcclxuICAgICAgICBsZXQgJGJvZHkgPSAkKCdib2R5Jyk7XHJcbiAgICAgICAgJGJvZHkub24oJ21vdXNldXAnLCAoKSA9PiB0aGlzLm9uQm9keU1vdXNldXAoKSk7XHJcbiAgICAgICAgJGJvZHkub24oJ2tleWRvd24nLCAoZXZlbnQpID0+IHRoaXMub25Cb2R5S2V5ZG93bihldmVudCkpO1xyXG4gICAgICAgICQoJyNwYWdlLW5hbWUnKS50ZXh0KF9zdG9yZS5uYW1lKTtcclxuICAgICAgICB0aGlzLl8kcG9wb3Zlci5vbignbW91c2V1cCcsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZmlsbFRhYmxlKGNlbGxzVW5pb25zLCBkZWNvcmF0aW9ucywgbWVzc2FnZXMpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmZpbGxTdGFydFRhYmxlKCk7XHJcbiAgICAgICAgdGhpcy51bmlvbihjZWxsc1VuaW9ucyk7XHJcbiAgICAgICAgdGhpcy5kZWNvcmF0ZShkZWNvcmF0aW9ucyk7XHJcbiAgICAgICAgdGhpcy5hZGRNZXNzYWdlcyhtZXNzYWdlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBmaWxsU3RhcnRUYWJsZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmNlbGxzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhlaWdodDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2VsbHMucHVzaChbXSk7XHJcbiAgICAgICAgICAgIGxldCAkcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncm93Jyk7XHJcbiAgICAgICAgICAgICRyb3cuY2xhc3NOYW1lID0gJ2NvbWdyaWQtcm93JztcclxuICAgICAgICAgICAgdGhpcy4kdGFibGVDb250YWluZXIuYXBwZW5kKCRyb3cpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMud2lkdGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jZWxsc1tpXS5wdXNoKG5ldyBDZWxsKGksIGosICRyb3csIHRoaXMpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVuaW9uKGNlbGxzVW5pb25zKTogdm9pZCB7XHJcbiAgICAgICAgY2VsbHNVbmlvbnMuZm9yRWFjaCh1bmlvbiA9PiB0aGlzLmNyZWF0ZVVuaW9uKHVuaW9uKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVVbmlvbihjZWxsc1VuaW9uKTogdm9pZCB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IGNlbGxzVW5pb24ubGVmdFVwWDsgaSA8PSBjZWxsc1VuaW9uLnJpZ2h0RG93blg7IGkrKylcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IGNlbGxzVW5pb24ubGVmdFVwWTsgaiA8PSBjZWxsc1VuaW9uLnJpZ2h0RG93blk7IGorKylcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q2VsbChpLCBqKS5zZWxlY3RXaXRoRnJpZW5kcyh0cnVlKTtcclxuICAgICAgICB0aGlzLnNlbGVjdERvd24oKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRlY29yYXRlKGRlY29yYXRpb25zKTogdm9pZCB7XHJcbiAgICAgICAgZGVjb3JhdGlvbnMuZm9yRWFjaChkZWNvcmF0aW9uID0+IHRoaXMuZGVjb3JhdGVPbmUoZGVjb3JhdGlvbikpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZGVjb3JhdGVPbmUoZGVjb3JhdGlvbik6IHZvaWQge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSBkZWNvcmF0aW9uLmxlZnRVcFg7IGkgPD0gZGVjb3JhdGlvbi5yaWdodERvd25YOyBpKyspXHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSBkZWNvcmF0aW9uLmxlZnRVcFk7IGogPD0gZGVjb3JhdGlvbi5yaWdodERvd25ZOyBqKyspXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldENlbGwoaSwgaikuYWRkRGVjb3IoZGVjb3JhdGlvbi5jc3NUZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFkZE1lc3NhZ2VzKG1lc3NhZ2VzKTogdm9pZCB7XHJcbiAgICAgICAgbWVzc2FnZXMuZm9yRWFjaChtZXNzYWdlID0+IHRoaXMuZ2V0Q2VsbChtZXNzYWdlLngsIG1lc3NhZ2UueSkuYWRkTWVzc2FnZShtZXNzYWdlLnRleHQpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uQm9keU1vdXNldXAoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5tb2QgPSBUYWJsZU1vZC5ub25lO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0RG93bigpO1xyXG4gICAgICAgIHRoaXMuaGlkZVBvcG92ZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNlbGVjdERvd24oKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGNsb25lID0gdGhpcy5zZWxlY3RlZENlbGxzLm1hcChlbGVtID0+IGVsZW0pO1xyXG4gICAgICAgIGxldCBzdHlsZSA9IGNsb25lWzBdLmdldENzc1N0eWxlKCk7XHJcbiAgICAgICAgd2hpbGUgKHRoaXMuc2VsZWN0ZWRDZWxscy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGxldCBjZWxsID0gdGhpcy5zZWxlY3RlZENlbGxzLnBvcCgpO1xyXG4gICAgICAgICAgICBjZWxsLnNldEZyaWVuZHMoY2xvbmUpO1xyXG4gICAgICAgICAgICBjZWxsLnNlbGVjdE5vbmUoKTtcclxuICAgICAgICAgICAgY2VsbC5hZGREZWNvcihzdHlsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25Cb2R5S2V5ZG93bihldmVudCk6IHZvaWQge1xyXG4gICAgICAgIGlmIChldmVudC5jdHJsS2V5ICYmIGV2ZW50LmNvZGUgPT09ICdLZXlaJykge1xyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLnBvcEFjdGlvbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q2VsbCh4OiBudW1iZXIsIHk6IG51bWJlcik6IENlbGwge1xyXG4gICAgICAgIGlmICh4ID49IDAgJiYgeCA8IHRoaXMuaGVpZ2h0ICYmIHkgPj0gMCAmJiB5IDwgdGhpcy53aWR0aClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2VsbHNbeF1beV07XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHB1c2hBY3Rpb24oYWN0aW9uOiBBY3Rpb24pIHtcclxuICAgICAgICBsZXQgbGFzdEFjdGlvbiA9IHRoaXMuYWN0aW9uc1t0aGlzLmFjdGlvbnMubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgaWYgKGxhc3RBY3Rpb24gIT0gbnVsbCAmJiBsYXN0QWN0aW9uWzBdID09PSBBY3Rpb25UeXBlLndyaXRlICYmIGFjdGlvblswXSA8PSBBY3Rpb25UeXBlLndyaXRlV2l0aFNwYWNlXHJcbiAgICAgICAgICAgICYmIGxhc3RBY3Rpb25bMV0gPT09IGFjdGlvblsxXSAmJiBsYXN0QWN0aW9uWzJdID09PSBhY3Rpb25bMl0pXHJcbiAgICAgICAgICAgIHRoaXMuYWN0aW9ucy5wb3AoKTtcclxuICAgICAgICB0aGlzLmFjdGlvbnMucHVzaChhY3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwb3BBY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IGFjdGlvbiA9IHRoaXMuYWN0aW9ucy5wb3AoKTtcclxuICAgICAgICBzd2l0Y2ggKGFjdGlvblswXSkge1xyXG4gICAgICAgICAgICBjYXNlIEFjdGlvblR5cGUud3JpdGU6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVuZG9Xcml0ZShhY3Rpb25bMV0sIGFjdGlvblsyXSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIC8vIGNhc2UgQWN0aW9uVHlwZS5kZWxldGU6XHJcbiAgICAgICAgICAgIC8vICAgICB0aGlzLnVuZG9EZWxldGUoYWN0aW9uWzFdLCBhY3Rpb25bMl0sIGFjdGlvblszXSk7XHJcbiAgICAgICAgICAgIC8vICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIGNhc2UgQWN0aW9uVHlwZS53cml0ZVdpdGhTcGFjZTpcclxuICAgICAgICAgICAgICAgIHRoaXMudW5kb1dyaXRlKGFjdGlvblsxXSwgYWN0aW9uWzJdKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1bmRvV3JpdGUoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmdldENlbGwoeCwgeSkudW5kb1dyaXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1bmRvRGVsZXRlKHg6IG51bWJlciwgeTogbnVtYmVyLCB0ZXh0OiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmdldENlbGwoeCwgeSkudW5kb0RlbGV0ZSh0ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2hvd1BvcG92ZXIoeDogbnVtYmVyLCB5OiBudW1iZXIsIGNlbGw6IENlbGwpe1xyXG4gICAgICAgIHRoaXMuXyRwb3BvdmVyLnJlbW92ZUNsYXNzKCdkLW5vbmUnKTtcclxuICAgICAgICB0aGlzLl8kcG9wb3Zlci5hdHRyKCdzdHlsZScsIGBsZWZ0OiAke2NlbGwuc2NyZWVuWCArIDE2fXB4OyB0b3A6ICR7Y2VsbC5zY3JlZW5ZICsgMTZ9cHg7YCk7XHJcbiAgICAgICAgdGhpcy5fJHBvcG92ZXIuZmluZCgnI2Nvb3JkcycpLnRleHQoYCR7eH0sICR7eX1gKTtcclxuXHJcbiAgICAgICAgbGV0ICRpbnB1dCA9IHRoaXMuXyRwb3BvdmVyLmZpbmQoJyNjc3NTdHlsZUlucHV0Jyk7XHJcbiAgICAgICAgJGlucHV0LnZhbChjZWxsLmdldENzc1N0eWxlKCkpO1xyXG4gICAgICAgICRpbnB1dC5vZmYoJ2NoYW5nZScpO1xyXG4gICAgICAgICRpbnB1dC5vbignY2hhbmdlJywgKCkgPT4gY2VsbC5hZGREZWNvcldpdGhGcmllbmRzKCRpbnB1dC52YWwoKSkpO1xyXG5cclxuICAgICAgICBsZXQgJGJ1dHRvbjEgPSB0aGlzLl8kcG9wb3Zlci5maW5kKCcjZWRpdFRleHRCdXR0b24nKTtcclxuICAgICAgICAkYnV0dG9uMS5vZmYoJ2NsaWNrJyk7XHJcbiAgICAgICAgJGJ1dHRvbjEub24oJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjZWxsLmZvY3VzKCk7XHJcbiAgICAgICAgICAgIHRoaXMuaGlkZVBvcG92ZXIoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbGV0ICRidXR0b24yID0gdGhpcy5fJHBvcG92ZXIuZmluZCgnI2RpdmlkZUJ1dHRvbicpO1xyXG4gICAgICAgICRidXR0b24yLm9mZignY2xpY2snKTtcclxuICAgICAgICAkYnV0dG9uMi5vbignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNlbGwuc2VwYXJhdGVXaXRoRnJpZW5kcygpO1xyXG4gICAgICAgICAgICBjZWxsLmZvY3VzKCk7XHJcbiAgICAgICAgICAgIHRoaXMuaGlkZVBvcG92ZXIoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaGlkZVBvcG92ZXIoKXtcclxuICAgICAgICB0aGlzLl8kcG9wb3Zlci5hZGRDbGFzcygnZC1ub25lJyk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZW51bSBUYWJsZU1vZHtcclxuICAgIG5vbmUsXHJcbiAgICBzZWxlY3RpbmdcclxufSIsImltcG9ydCB7VGFibGV9IGZyb20gXCIuL1RhYmxlXCI7XHJcblxyXG5sZXQgdGFibGU7XHJcbmNvbnN0IGxpbmsgPSBcImh0dHBzOi8vY29tZ3JpZC5ydTo4NDQzXCI7XHJcbmxldCBjZWxsc1VuaW9ucyA9IFtcclxuICAgIHtcclxuICAgICAgICBsZWZ0VXBYOiAxMSxcclxuICAgICAgICBsZWZ0VXBZOiAxNCxcclxuICAgICAgICByaWdodERvd25YOiAxNyxcclxuICAgICAgICByaWdodERvd25ZOiAxN1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBsZWZ0VXBYOiAyMixcclxuICAgICAgICBsZWZ0VXBZOiAxNyxcclxuICAgICAgICByaWdodERvd25YOiAyNCxcclxuICAgICAgICByaWdodERvd25ZOiAzMFxyXG4gICAgfVxyXG5dO1xyXG5leHBvcnQgbGV0IHN0b3JlID0ge1xyXG4gICAgaGVpZ2h0OiA1MCxcclxuICAgIHdpZHRoOiA1MCxcclxuICAgIGNlbGxzVW5pb25zOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZWZ0VXBYOiAxMSxcclxuICAgICAgICAgICAgbGVmdFVwWTogMTQsXHJcbiAgICAgICAgICAgIHJpZ2h0RG93blg6IDE3LFxyXG4gICAgICAgICAgICByaWdodERvd25ZOiAxN1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZWZ0VXBYOiAyMixcclxuICAgICAgICAgICAgbGVmdFVwWTogMTcsXHJcbiAgICAgICAgICAgIHJpZ2h0RG93blg6IDI0LFxyXG4gICAgICAgICAgICByaWdodERvd25ZOiAzMFxyXG4gICAgICAgIH1cclxuICAgIF0sXHJcbiAgICBkZWNvcmF0aW9uczogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGVmdFVwWDogMTEsXHJcbiAgICAgICAgICAgIGxlZnRVcFk6IDE0LFxyXG4gICAgICAgICAgICByaWdodERvd25YOiAxNyxcclxuICAgICAgICAgICAgcmlnaHREb3duWTogMTcsXHJcbiAgICAgICAgICAgIGNzc1RleHQ6IFwiYmFja2dyb3VuZC1jb2xvcjogYmx1ZTsgY29sb3I6IHllbGxvdyAhaW1wb3J0YW50OyBib3JkZXItY29sb3I6IHJlZCAhaW1wb3J0YW50O1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxlZnRVcFg6IDMxLFxyXG4gICAgICAgICAgICBsZWZ0VXBZOiA0MSxcclxuICAgICAgICAgICAgcmlnaHREb3duWDogMzEsXHJcbiAgICAgICAgICAgIHJpZ2h0RG93blk6IDQxLFxyXG4gICAgICAgICAgICBjc3NUZXh0OiBcImJhY2tncm91bmQtY29sb3I6IHJnYigyMDQsMTEsMTEpOyBjb2xvcjogZ3JlZW4gIWltcG9ydGFudDsgYm9yZGVyLWNvbG9yOiBibHVlICFpbXBvcnRhbnQ7XCJcclxuICAgICAgICB9XHJcbiAgICBdLFxyXG4gICAgbWVzc2FnZXM6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHg6IDIyLFxyXG4gICAgICAgICAgICB5OiAxNyxcclxuICAgICAgICAgICAgdGV4dDogXCLQoNC10LHRj9GC0LAsINC/0YDQuNCy0LXRgiwg0YfRgtC+INC30LDQtNCw0LvQuCDQv9C+INC/0YDQtdC60YDQsNGB0L3QvtC5INC20LjQt9C90Lgg0LHQtdC3INC30LDQsdC+0YI/XCJcclxuICAgICAgICB9XHJcbiAgICBdLFxyXG4gICAgc2VsZWN0ZWRDbGFzc2VzOiBbJ2JnLWRhcmsnLCAndGV4dC1saWdodCddLFxyXG4gICAgbm9TZWxlY3RlZENsYXNzZXM6IFsndGV4dC1kYXJrJ11cclxufVxyXG5cclxuJCh3aW5kb3cpLm9uKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgY2hlY2tBdXRob3JpemF0aW9uKClcclxuICAgIC50aGVuKCgpID0+IGdldFRhYmxlSW5mbygpKVxyXG4gICAgLnRoZW4oKCkgPT4gZ2V0VGFibGVNZXNzYWdlcygpKVxyXG4gICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiVGFibGUgbWVzc2FnZXNcIilcclxuICAgICAgICBzdG9yZS5jZWxsc1VuaW9ucyA9IGNlbGxzVW5pb25zO1xyXG4gICAgICAgIHRhYmxlID0gbmV3IFRhYmxlKHN0b3JlKTtcclxuICAgIH0pXHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gY2hlY2tBdXRob3JpemF0aW9uKCkge1xyXG4gICAgcmV0dXJuIGZldGNoKFxyXG4gICAgICAgIGxpbmsgKyBcIi91c2VyL2xvZ2luXCIsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjcmVkZW50aWFsczogXCJpbmNsdWRlXCIsXHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgaGVhZGVyczoge1wiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwifVxyXG4gICAgICAgIH1cclxuICAgICkudGhlbigocmVzcG9uc2UpID0+e1xyXG4gICAgICAgIGlmKHJlc3BvbnNlLnN0YXR1cyAhPT0gMjAwKXtcclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBsaW5rICsgXCIvb2F1dGgyL2F1dGhvcml6YXRpb24vZ29vZ2xlXCJcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KClcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0UGFyYW0obmFtZTogc3RyaW5nKTogc3RyaW5ne1xyXG4gICAgY29uc3QgdXJsUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKVxyXG4gICAgcmV0dXJuIHVybFBhcmFtcy5nZXQobmFtZSlcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0VGFibGVJbmZvKCkge1xyXG4gICAgY29uc3QgaWQgPSBnZXRQYXJhbShcImlkXCIpXHJcbiAgICByZXR1cm4gZmV0Y2goXHJcbiAgICAgICAgbGluayArIFwiL3RhYmxlL2luZm8/Y2hhdElkPVwiICsgaWQsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjcmVkZW50aWFsczogXCJpbmNsdWRlXCIsXHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgaGVhZGVyczoge1wiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwifVxyXG4gICAgICAgIH1cclxuICAgICkudGhlbigocmVzdWx0KSA9PntcclxuICAgICAgICByZXN1bHQudGV4dCgpLnRoZW4oKHRleHQpID0+IHtcclxuICAgICAgICAgICAgaWYocmVzdWx0LnN0YXR1cyA9PSAyMDApe1xyXG4gICAgICAgICAgICAgICAgc3RvcmUgPSBKU09OLnBhcnNlKHRleHQpXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzdG9yZSlcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQuc3RhdHVzICsgXCIsIFwiICsgdGV4dClcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYCR7cmVzdWx0LnRleHQoKS50aGVuKGhhaGEgPT4gaGFoYSl9YClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0VGFibGVNZXNzYWdlcygpIHtcclxuICAgIGNvbnN0IGlkID0gZ2V0UGFyYW0oXCJpZFwiKVxyXG4gICAgcmV0dXJuIGZldGNoKFxyXG4gICAgICAgIGxpbmsgKyBcIi9tZXNzYWdlL2xpc3RcIixcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcImluY2x1ZGVcIixcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgaGVhZGVyczoge1wiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwifSxcclxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgICAgICAgICAgY2hhdElkOiAraWQsXHJcbiAgICAgICAgICAgICAgICB4Q29vcmRMZWZ0VG9wOiAwLFxyXG4gICAgICAgICAgICAgICAgeUNvb3JkTGVmdFRvcDogMCxcclxuICAgICAgICAgICAgICAgIHhDb29yZFJpZ2h0Qm90dG9tOiBzdG9yZS5oZWlnaHQgLSAxLFxyXG4gICAgICAgICAgICAgICAgeUNvb3JkTGVmdEJvdHRvbTogc3RvcmUud2lkdGggLSAxXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgKS50aGVuKChyZXN1bHQpID0+XHJcbiAgICAgICAgcmVzdWx0LnRleHQoKS50aGVuKCh0ZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGlmKHJlc3VsdC5zdGF0dXMgPT0gMjAwKXtcclxuICAgICAgICAgICAgICAgIHN0b3JlLm1lc3NhZ2VzID0gSlNPTi5wYXJzZSh0ZXh0KVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coc3RvcmUubWVzc2FnZXMpXHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0LnN0YXR1cyArIFwiLCBcIiArIHRleHQpXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGAke3Jlc3VsdC50ZXh0KCkudGhlbihoYWhhID0+IGhhaGEpfWApXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgKTtcclxufSIsIlxyXG5leHBvcnQgZW51bSBBY3Rpb25UeXBlIHtcclxuICAgIHdyaXRlLFxyXG4gICAgd3JpdGVXaXRoU3BhY2UsXHJcbiAgICBkZWxldGUsXHJcbiAgICB1bmlvblxyXG59XHJcblxyXG5leHBvcnQgdHlwZSBBY3Rpb24gPSBbYWN0aW9uVHlwZTogQWN0aW9uVHlwZSwgY2VsbFg6IG51bWJlciwgY2VsbFk6IG51bWJlciwgaW5mbz86IGFueV07IiwiZXhwb3J0IGVudW0gRGlyZWN0aW9ue1xyXG4gICAgbGVmdCxcclxuICAgIHJpZ2h0LFxyXG4gICAgdG9wLFxyXG4gICAgYm90dG9tXHJcbn0iXX0=
