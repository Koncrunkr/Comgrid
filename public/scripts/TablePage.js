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
                _this.table.showPopover(_this.x, _this.y);
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
    Cell.prototype.addMessage = function (text) {
        this.drawer.addMessage(text);
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
    function Table(store) {
        var _this = this;
        this.$tableContainer = $('main');
        this.cells = [];
        this.selectedCells = [];
        this.actions = [];
        this._$popover = $('#popover');
        this.width = store.width;
        this.height = store.height;
        this.fillTable(store.cellsUnions, store.decorations, store.messages);
        var $body = $('body');
        $body.on('mouseup', function () { return _this.onBodyMouseup(); });
        $body.on('keydown', function (event) { return _this.onBodyKeydown(event); });
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
        while (this.selectedCells.length > 0) {
            var cell = this.selectedCells.pop();
            cell.setFriends(clone);
            cell.selectNone();
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
    Table.prototype.showPopover = function (x, y) {
        this._$popover.removeClass('d-none');
        this._$popover.attr('style', "left: ".concat(y * 32 + 16, "px; top: ").concat(x * 32 + 16, "px;"));
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
            cssText: "background-color: blue !important; color: yellow !important; border-color: red !important;"
        },
        {
            leftUpX: 31,
            leftUpY: 41,
            rightDownX: 31,
            rightDownY: 41,
            cssText: "background-color: rgb(204,11,11) !important; color: green !important; border-color: blue !important;"
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
    table = new Table_1.Table(exports.store);
});
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJUU2NyaXB0L1RhYmxlUGFnZS9DZWxsL0NlbGwudHMiLCJUU2NyaXB0L1RhYmxlUGFnZS9DZWxsL0NlbGxEcmF3ZXIudHMiLCJUU2NyaXB0L1RhYmxlUGFnZS9NYWluL1RhYmxlLnRzIiwiVFNjcmlwdC9UYWJsZVBhZ2UvTWFpbi9UYWJsZU1vZC50cyIsIlRTY3JpcHQvVGFibGVQYWdlL01haW4vVGFibGVQYWdlLnRzIiwiVFNjcmlwdC9UYWJsZVBhZ2UvVXRpbGl0aWVzL0FjdGlvbi50cyIsIlRTY3JpcHQvVGFibGVQYWdlL1V0aWxpdGllcy9EaXJlY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNBQSwyQ0FBd0M7QUFFeEMsNkNBQTBDO0FBQzFDLG9EQUFpRDtBQUNqRCw4Q0FBK0M7QUFJL0M7SUFNSSxjQUNvQixDQUFTLEVBQ1QsQ0FBUyxFQUN6QixJQUFpQixFQUNELEtBQVk7UUFIWixNQUFDLEdBQUQsQ0FBQyxDQUFRO1FBQ1QsTUFBQyxHQUFELENBQUMsQ0FBUTtRQUVULFVBQUssR0FBTCxLQUFLLENBQU87UUFFNUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLHVCQUFVLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRCxzQkFBVywyQkFBUzthQUFwQjtZQUFBLGlCQVVDO1lBVEcsT0FBTyxDQUFDLFVBQUEsS0FBSztnQkFDVCxJQUFJLEtBQUssQ0FBQyxPQUFPO29CQUFFLE9BQU87Z0JBQzFCLElBQUksS0FBSyxDQUFDLFFBQVE7b0JBQUUsT0FBTztnQkFDM0IsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLFNBQVM7b0JBQUUsS0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUM3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QUMsSUFBSSxDQUFDLFVBQUMsSUFBSSxJQUFLLE9BQUEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUE1QyxDQUE0QyxDQUFDLElBQUksSUFBSTtZQUM1RSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxxQkFBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlDLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFDLElBQUksSUFBSyxPQUFBLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBNUMsQ0FBNEMsQ0FBQyxJQUFJLElBQUk7WUFDNUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMscUJBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFJLElBQUssT0FBQSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFJLENBQUMsQ0FBQyxDQUFDLEVBQTVDLENBQTRDLENBQUMsSUFBSSxJQUFJO1lBQzVFLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLHFCQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDNUMsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSSxJQUFLLE9BQUEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSSxDQUFDLENBQUMsQ0FBQyxFQUE1QyxDQUE0QyxDQUFDLElBQUksSUFBSTtZQUM1RSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxxQkFB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O0lBQ0QsZUFBZSxFQUFFLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQztJQUMxQyxpQkFBaUIsRUFBRSxDQUFDLFdBQVcsQ0FBQztDQUNuQyxDQUFBO0FBRUQsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUU7SUFDakIsS0FBSyxHQUFHLElBQUksYUFBSyxDQUFDLGFBQUssQ0FBQyxDQUFDO0FBQzdCLENBQUMsQ0FBQyxDQUFDOzs7OztBQ2hESCxJQUFZLFVBS1g7QUFMRCxXQUFZLFVBQVU7SUFDbEIsNkNBQUssQ0FBQTtJQUNMLCtEQUFjLENBQUE7SUFDZCwrQ0FBTSxDQUFBO0lBQ04sNkNBQUssQ0FBQTtBQUNULENBQUMsRUFMVyxVQUFVLEdBQVYsa0JBQVUsS0FBVixrQkFBVSxRQUtyQjs7Ozs7QUNORCxJQUFZLFNBS1g7QUFMRCxXQUFZLFNBQVM7SUFDakIseUNBQUksQ0FBQTtJQUNKLDJDQUFLLENBQUE7SUFDTCx1Q0FBRyxDQUFBO0lBQ0gsNkNBQU0sQ0FBQTtBQUNWLENBQUMsRUFMVyxTQUFTLEdBQVQsaUJBQVMsS0FBVCxpQkFBUyxRQUtwQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCB7Q2VsbERyYXdlcn0gZnJvbSBcIi4vQ2VsbERyYXdlclwiO1xyXG5pbXBvcnQge1RhYmxlfSBmcm9tIFwiLi4vTWFpbi9UYWJsZVwiO1xyXG5pbXBvcnQge1RhYmxlTW9kfSBmcm9tIFwiLi4vTWFpbi9UYWJsZU1vZFwiO1xyXG5pbXBvcnQge0RpcmVjdGlvbn0gZnJvbSBcIi4uL1V0aWxpdGllcy9EaXJlY3Rpb25cIjtcclxuaW1wb3J0IHtBY3Rpb25UeXBlfSBmcm9tIFwiLi4vVXRpbGl0aWVzL0FjdGlvblwiO1xyXG5cclxudHlwZSBvblRyaWdnZXIgPSAoZXZlbnQ/OiBhbnkpID0+IHZvaWQgfCBib29sZWFuXHJcblxyXG5leHBvcnQgY2xhc3MgQ2VsbCB7XHJcbiAgICBwcml2YXRlIGRyYXdlcjogQ2VsbERyYXdlcjtcclxuICAgIHByaXZhdGUgX2ZyaWVuZHM6IENlbGxbXTtcclxuICAgIHByaXZhdGUgX2Jsb2NrZWQ6IGJvb2xlYW47XHJcbiAgICBwcml2YXRlIF9zZWxlY3RlZDogYm9vbGVhbjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwdWJsaWMgcmVhZG9ubHkgeDogbnVtYmVyLFxyXG4gICAgICAgIHB1YmxpYyByZWFkb25seSB5OiBudW1iZXIsXHJcbiAgICAgICAgJHJvdzogSFRNTEVsZW1lbnQsXHJcbiAgICAgICAgcHVibGljIHJlYWRvbmx5IHRhYmxlOiBUYWJsZVxyXG4gICAgKSB7XHJcbiAgICAgICAgdGhpcy5kcmF3ZXIgPSBuZXcgQ2VsbERyYXdlcigkcm93LCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG9uS2V5ZG93bigpOiBvblRyaWdnZXIge1xyXG4gICAgICAgIHJldHVybiAoZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXZlbnQuY3RybEtleSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAoZXZlbnQuc2hpZnRLZXkpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKGV2ZW50LmNvZGUgPT09ICdBcnJvd1VwJykgdGhpcy50YWJsZS5nZXRDZWxsKHRoaXMueCAtIDEsIHRoaXMueSkuZm9jdXMoKTtcclxuICAgICAgICAgICAgaWYgKGV2ZW50LmNvZGUgPT09ICdBcnJvd0Rvd24nIHx8IGV2ZW50LmNvZGUgPT09ICdFbnRlcicpIHRoaXMudGFibGUuZ2V0Q2VsbCh0aGlzLnggKyAxLCB0aGlzLnkpLmZvY3VzKCk7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pc0VtcHR5KCkpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKGV2ZW50LmNvZGUgPT09ICdBcnJvd0xlZnQnKSB0aGlzLnRhYmxlLmdldENlbGwodGhpcy54LCB0aGlzLnkgLSAxKS5mb2N1cygpO1xyXG4gICAgICAgICAgICBpZiAoZXZlbnQuY29kZSA9PT0gJ0Fycm93UmlnaHQnKSB0aGlzLnRhYmxlLmdldENlbGwodGhpcy54LCB0aGlzLnkgKyAxKS5mb2N1cygpO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBvbk1vdXNlZW50ZXIoKTogb25UcmlnZ2VyIHtcclxuICAgICAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy50YWJsZS5tb2QgIT09IFRhYmxlTW9kLnNlbGVjdGluZykgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdFdpdGhGcmllbmRzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgb25Nb3VzZWRvd24oKTogb25UcmlnZ2VyIHtcclxuICAgICAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnRhYmxlLm1vZCA9IFRhYmxlTW9kLnNlbGVjdGluZztcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RXaXRoRnJpZW5kcygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG9uRG91YmxlQ2xpY2soKTogb25UcmlnZ2VyIHtcclxuICAgICAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmZvY3VzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgb25CbHVyKCk6IG9uVHJpZ2dlciB7XHJcbiAgICAgICAgcmV0dXJuICh0ZXh0OiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgaWYodGV4dC5sZW5ndGggIT09IDApXHJcbiAgICAgICAgICAgICAgICB0aGlzLmJsb2NrKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgb25JbnB1dCgpOiBvblRyaWdnZXIge1xyXG4gICAgICAgIHJldHVybiAoZXZlbnQ6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhldmVudC5pbnB1dFR5cGUpO1xyXG4gICAgICAgICAgICBpZihldmVudC5pbnB1dFR5cGVbMF0gPT09ICdpJylcclxuICAgICAgICAgICAgICAgIGlmKGV2ZW50LmRhdGEgPT09ICcgJykgdGhpcy50YWJsZS5wdXNoQWN0aW9uKFtBY3Rpb25UeXBlLndyaXRlV2l0aFNwYWNlLCB0aGlzLngsIHRoaXMueV0pO1xyXG4gICAgICAgICAgICAgICAgZWxzZSB0aGlzLnRhYmxlLnB1c2hBY3Rpb24oW0FjdGlvblR5cGUud3JpdGUsIHRoaXMueCwgdGhpcy55XSk7XHJcbiAgICAgICAgICAgIGVsc2UgaWYoZXZlbnQuaW5wdXRUeXBlWzBdID09PSAnZCcpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRhYmxlLnB1c2hBY3Rpb24oW0FjdGlvblR5cGUuZGVsZXRlLCB0aGlzLngsIHRoaXMueSwgZXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoJ3RleHQvaHRtbCcpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgb25Db250ZXh0bWVudSgpOiBvblRyaWdnZXIge1xyXG4gICAgICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudGFibGUuc2hvd1BvcG92ZXIodGhpcy54LCB0aGlzLnkpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBmb2N1cygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmRyYXdlci5ibG9ja05vKCk7XHJcbiAgICAgICAgdGhpcy5kcmF3ZXIuZm9jdXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VsZWN0V2l0aEZyaWVuZHMoeWVzOiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLl9mcmllbmRzID09IG51bGwgfHwgdGhpcy5fZnJpZW5kcy5sZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgIHllcyA/IHRoaXMuc2VsZWN0KCkgOiB0aGlzLnNlbGVjdE5vbmUoKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuX2ZyaWVuZHMuZm9yRWFjaCgoZnJpZW5kKSA9PiB5ZXMgPyBmcmllbmQuc2VsZWN0KCkgOiBmcmllbmQuc2VsZWN0Tm9uZSgpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0RnJpZW5kcyhmcmllbmRzOiBDZWxsW10pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9mcmllbmRzID0gZnJpZW5kcztcclxuICAgICAgICB0aGlzLmRyYXdlci5hZGRCb3JkZXJzKERpcmVjdGlvbi50b3AsIERpcmVjdGlvbi5ib3R0b20sIERpcmVjdGlvbi5sZWZ0LCBEaXJlY3Rpb24ucmlnaHQpXHJcbiAgICAgICAgaWYgKGZyaWVuZHMuZmluZCgoY2VsbCkgPT4gKGNlbGwueCA9PT0gdGhpcy54ICYmIGNlbGwueSA9PT0gdGhpcy55ICsgMSkpICE9IG51bGwpXHJcbiAgICAgICAgICAgIHRoaXMuZHJhd2VyLnJlbW92ZUJvcmRlcihEaXJlY3Rpb24ucmlnaHQpO1xyXG4gICAgICAgIGlmIChmcmllbmRzLmZpbmQoKGNlbGwpID0+IChjZWxsLnggPT09IHRoaXMueCAmJiBjZWxsLnkgPT09IHRoaXMueSAtIDEpKSAhPSBudWxsKVxyXG4gICAgICAgICAgICB0aGlzLmRyYXdlci5yZW1vdmVCb3JkZXIoRGlyZWN0aW9uLmxlZnQpO1xyXG4gICAgICAgIGlmIChmcmllbmRzLmZpbmQoKGNlbGwpID0+IChjZWxsLnggPT09IHRoaXMueCAtIDEgJiYgY2VsbC55ID09PSB0aGlzLnkpKSAhPSBudWxsKVxyXG4gICAgICAgICAgICB0aGlzLmRyYXdlci5yZW1vdmVCb3JkZXIoRGlyZWN0aW9uLnRvcCk7XHJcbiAgICAgICAgaWYgKGZyaWVuZHMuZmluZCgoY2VsbCkgPT4gKGNlbGwueCA9PT0gdGhpcy54ICsgMSAmJiBjZWxsLnkgPT09IHRoaXMueSkpICE9IG51bGwpXHJcbiAgICAgICAgICAgIHRoaXMuZHJhd2VyLnJlbW92ZUJvcmRlcihEaXJlY3Rpb24uYm90dG9tKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VsZWN0KCk6IHZvaWQge1xyXG4gICAgICAgIGlmKHRoaXMuX3NlbGVjdGVkKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMudGFibGUuc2VsZWN0ZWRDZWxscy5wdXNoKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuZHJhd2VyLnNlbGVjdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZWxlY3ROb25lKCk6IHZvaWQge1xyXG4gICAgICAgIGlmKCF0aGlzLl9zZWxlY3RlZCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5kcmF3ZXIuc2VsZWN0Tm9uZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpc0VtcHR5KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRyYXdlci5pc0VtcHR5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBibG9jaygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmRyYXdlci5ibG9jaygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYmxvY2tObygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmRyYXdlci5ibG9ja05vKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVuZG9Xcml0ZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmRyYXdlci51bmRvV3JpdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdW5kb0RlbGV0ZSh0ZXh0OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmRyYXdlci51bmRvRGVsZXRlKHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGREZWNvcihjc3NTdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmRyYXdlci5hZGREZWNvcihjc3NTdHJpbmcpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRNZXNzYWdlKHRleHQpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmRyYXdlci5hZGRNZXNzYWdlKHRleHQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHtDZWxsfSBmcm9tIFwiLi9DZWxsXCI7XHJcbmltcG9ydCB7c3RvcmV9IGZyb20gXCIuLi9NYWluL1RhYmxlUGFnZVwiO1xyXG5pbXBvcnQge0RpcmVjdGlvbn0gZnJvbSBcIi4uL1V0aWxpdGllcy9EaXJlY3Rpb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDZWxsRHJhd2VyIHtcclxuICAgIHByaXZhdGUgJGNlbGw6IEhUTUxFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSAkc3BhbjogSFRNTEVsZW1lbnQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgJHJvdzogSFRNTEVsZW1lbnQsXHJcbiAgICAgICAgcHJpdmF0ZSBrZWVwZXI6IENlbGxcclxuICAgICkge1xyXG4gICAgICAgIHRoaXMuaW5pdCgkcm93KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXQoJHJvdyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuJHNwYW4gPSB0aGlzLiRjcmVhdGVTcGFuKCk7XHJcbiAgICAgICAgdGhpcy4kY2VsbCA9IHRoaXMuJGNyZWF0ZUNlbGwodGhpcy4kc3Bhbik7XHJcbiAgICAgICAgJHJvdy5hcHBlbmQodGhpcy4kY2VsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSAkY3JlYXRlU3BhbigpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgICAgbGV0ICRzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgICRzcGFuLmNsYXNzTmFtZSA9ICd0ZXh0LW5vd3JhcCBuby1zaG93LWZvY3VzJztcclxuICAgICAgICAkc3Bhbi5vbmtleWRvd24gPSAoZXZlbnQpID0+IHRoaXMua2VlcGVyLm9uS2V5ZG93bihldmVudCk7XHJcbiAgICAgICAgJHNwYW4ub25ibHVyID0gKCkgPT4gdGhpcy5rZWVwZXIub25CbHVyKCRzcGFuLnRleHRDb250ZW50KTtcclxuICAgICAgICAkc3Bhbi5vbmlucHV0ID0gKGV2ZW50KSA9PiB0aGlzLmtlZXBlci5vbklucHV0KGV2ZW50KTtcclxuICAgICAgICAkc3Bhbi5jb250ZW50RWRpdGFibGUgPSAndHJ1ZSc7XHJcbiAgICAgICAgcmV0dXJuICRzcGFuO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgJGNyZWF0ZUNlbGwoJHNwYW46IEhUTUxFbGVtZW50KTogSFRNTEVsZW1lbnQge1xyXG4gICAgICAgIGxldCAkY2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICRjZWxsLmNsYXNzTmFtZSA9ICdjb21ncmlkLWNlbGwgYm9yZGVyLXRvcCBib3JkZXItbGVmdCBib3JkZXItcmlnaHQgYm9yZGVyLWJvdHRvbSB0ZXh0LWRhcmsnO1xyXG4gICAgICAgICRjZWxsLm9ubW91c2VlbnRlciA9ICgpID0+IHRoaXMua2VlcGVyLm9uTW91c2VlbnRlcigpO1xyXG4gICAgICAgICRjZWxsLm9ubW91c2Vkb3duID0gKCkgPT4gdGhpcy5rZWVwZXIub25Nb3VzZWRvd24oKTtcclxuICAgICAgICAkY2VsbC5vbmRyYWdzdGFydCA9ICgpID0+IGZhbHNlO1xyXG4gICAgICAgICRjZWxsLm9uY29udGV4dG1lbnUgPSAoKSA9PiB0aGlzLmtlZXBlci5vbkNvbnRleHRtZW51KCk7XHJcbiAgICAgICAgJGNlbGwuYXBwZW5kKCRzcGFuKTtcclxuICAgICAgICByZXR1cm4gJGNlbGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGZvY3VzKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuJHNwYW4uZm9jdXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VsZWN0KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuJGNlbGwuY2xhc3NMaXN0LnJlbW92ZSguLi5zdG9yZS5ub1NlbGVjdGVkQ2xhc3Nlcyk7XHJcbiAgICAgICAgdGhpcy4kY2VsbC5jbGFzc0xpc3QuYWRkKC4uLnN0b3JlLnNlbGVjdGVkQ2xhc3Nlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNlbGVjdE5vbmUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy4kY2VsbC5jbGFzc0xpc3QucmVtb3ZlKC4uLnN0b3JlLnNlbGVjdGVkQ2xhc3Nlcyk7XHJcbiAgICAgICAgdGhpcy4kY2VsbC5jbGFzc0xpc3QuYWRkKC4uLnN0b3JlLm5vU2VsZWN0ZWRDbGFzc2VzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaXNFbXB0eSgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy4kc3Bhbi50ZXh0Q29udGVudC5sZW5ndGggPT09IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbW92ZUJvcmRlcnMoLi4uZGlyZWN0aW9uczogRGlyZWN0aW9uW10pOiB2b2lkIHtcclxuICAgICAgICBkaXJlY3Rpb25zLmZvckVhY2goKGRpcmVjdGlvbikgPT4gdGhpcy5yZW1vdmVCb3JkZXIoZGlyZWN0aW9uKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbW92ZUJvcmRlcihkaXJlY3Rpb246IERpcmVjdGlvbik6IHZvaWQge1xyXG4gICAgICAgIHN3aXRjaCAoZGlyZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLmJvdHRvbTpcclxuICAgICAgICAgICAgICAgIHRoaXMuJGNlbGwuY2xhc3NMaXN0LnJlbW92ZSgnYm9yZGVyLWJvdHRvbScpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBjYXNlIERpcmVjdGlvbi5sZWZ0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy4kY2VsbC5jbGFzc0xpc3QucmVtb3ZlKCdib3JkZXItbGVmdCcpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBjYXNlIERpcmVjdGlvbi5yaWdodDpcclxuICAgICAgICAgICAgICAgIHRoaXMuJGNlbGwuY2xhc3NMaXN0LnJlbW92ZSgnYm9yZGVyLXJpZ2h0Jyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLnRvcDpcclxuICAgICAgICAgICAgICAgIHRoaXMuJGNlbGwuY2xhc3NMaXN0LnJlbW92ZSgnYm9yZGVyLXRvcCcpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkQm9yZGVycyguLi5kaXJlY3Rpb25zOiBEaXJlY3Rpb25bXSk6IHZvaWQge1xyXG4gICAgICAgIGRpcmVjdGlvbnMuZm9yRWFjaCgoZGlyZWN0aW9uKSA9PiB0aGlzLmFkZEJvcmRlcihkaXJlY3Rpb24pKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkQm9yZGVyKGRpcmVjdGlvbjogRGlyZWN0aW9uKTogdm9pZCB7XHJcbiAgICAgICAgc3dpdGNoIChkaXJlY3Rpb24pIHtcclxuICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24uYm90dG9tOlxyXG4gICAgICAgICAgICAgICAgdGhpcy4kY2VsbC5jbGFzc0xpc3QuYWRkKCdib3JkZXItYm90dG9tJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLmxlZnQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRjZWxsLmNsYXNzTGlzdC5hZGQoJ2JvcmRlci1sZWZ0Jyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLnJpZ2h0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy4kY2VsbC5jbGFzc0xpc3QuYWRkKCdib3JkZXItcmlnaHQnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24udG9wOlxyXG4gICAgICAgICAgICAgICAgdGhpcy4kY2VsbC5jbGFzc0xpc3QuYWRkKCdib3JkZXItdG9wJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBibG9jaygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLiRzcGFuLmNvbnRlbnRFZGl0YWJsZSA9ICdmYWxzZSc7XHJcbiAgICAgICAgdGhpcy4kc3Bhbi5jbGFzc0xpc3QuYWRkKCd1c2VyLXNlbGVjdC1ub25lJyk7XHJcbiAgICAgICAgdGhpcy4kY2VsbC5vbmRibGNsaWNrID0gKCkgPT4gdGhpcy5rZWVwZXIub25Eb3VibGVDbGljaygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBibG9ja05vKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuJHNwYW4uY29udGVudEVkaXRhYmxlID0gJ3RydWUnO1xyXG4gICAgICAgIHRoaXMuJHNwYW4uY2xhc3NMaXN0LnJlbW92ZSgndXNlci1zZWxlY3Qtbm9uZScpO1xyXG4gICAgICAgIHRoaXMuJGNlbGwub25kYmxjbGljayA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVuZG9Xcml0ZSgpOiB2b2lkIHtcclxuICAgICAgICBsZXQgbGFzdFNwYWNlSW5kZXggPSB0aGlzLiRzcGFuLnRleHRDb250ZW50Lmxhc3RJbmRleE9mKCcgJyk7XHJcbiAgICAgICAgaWYobGFzdFNwYWNlSW5kZXggPCAwKSB0aGlzLiRzcGFuLnRleHRDb250ZW50ID0gJyc7XHJcbiAgICAgICAgZWxzZSB0aGlzLiRzcGFuLnRleHRDb250ZW50ID0gdGhpcy4kc3Bhbi50ZXh0Q29udGVudC5zdWJzdHIoMCwgbGFzdFNwYWNlSW5kZXgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1bmRvRGVsZXRlKHRleHQpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLiRzcGFuLnRleHRDb250ZW50ICs9IHRleHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZERlY29yKGNzc1N0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuJGNlbGwuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgY3NzU3RyaW5nKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkTWVzc2FnZSh0ZXh0KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy4kc3Bhbi50ZXh0Q29udGVudCA9IHRleHQ7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQge0NlbGx9IGZyb20gXCIuLi9DZWxsL0NlbGxcIjtcclxuaW1wb3J0IHtUYWJsZU1vZH0gZnJvbSBcIi4vVGFibGVNb2RcIjtcclxuaW1wb3J0IHtBY3Rpb24sIEFjdGlvblR5cGV9IGZyb20gXCIuLi9VdGlsaXRpZXMvQWN0aW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVGFibGUge1xyXG4gICAgcHJpdmF0ZSAkdGFibGVDb250YWluZXIgPSAkKCdtYWluJyk7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgY2VsbHM6IENlbGxbXVtdID0gW107XHJcbiAgICBwdWJsaWMgbW9kOiBUYWJsZU1vZDtcclxuICAgIHB1YmxpYyByZWFkb25seSBzZWxlY3RlZENlbGxzOiBDZWxsW10gPSBbXTtcclxuICAgIHByaXZhdGUgYWN0aW9uczogQWN0aW9uW10gPSBbXTtcclxuICAgIHB1YmxpYyByZWFkb25seSB3aWR0aDogbnVtYmVyO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGhlaWdodDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfJHBvcG92ZXIgPSAkKCcjcG9wb3ZlcicpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHN0b3JlKSB7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IHN0b3JlLndpZHRoO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gc3RvcmUuaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuZmlsbFRhYmxlKHN0b3JlLmNlbGxzVW5pb25zLCBzdG9yZS5kZWNvcmF0aW9ucywgc3RvcmUubWVzc2FnZXMpO1xyXG4gICAgICAgIGxldCAkYm9keSA9ICQoJ2JvZHknKTtcclxuICAgICAgICAkYm9keS5vbignbW91c2V1cCcsICgpID0+IHRoaXMub25Cb2R5TW91c2V1cCgpKTtcclxuICAgICAgICAkYm9keS5vbigna2V5ZG93bicsIChldmVudCkgPT4gdGhpcy5vbkJvZHlLZXlkb3duKGV2ZW50KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBmaWxsVGFibGUoY2VsbHNVbmlvbnMsIGRlY29yYXRpb25zLCBtZXNzYWdlcyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZmlsbFN0YXJ0VGFibGUoKTtcclxuICAgICAgICB0aGlzLnVuaW9uKGNlbGxzVW5pb25zKTtcclxuICAgICAgICB0aGlzLmRlY29yYXRlKGRlY29yYXRpb25zKTtcclxuICAgICAgICB0aGlzLmFkZE1lc3NhZ2VzKG1lc3NhZ2VzKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGZpbGxTdGFydFRhYmxlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY2VsbHMubGVuZ3RoID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGVpZ2h0OyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5jZWxscy5wdXNoKFtdKTtcclxuICAgICAgICAgICAgbGV0ICRyb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdyb3cnKTtcclxuICAgICAgICAgICAgJHJvdy5jbGFzc05hbWUgPSAnY29tZ3JpZC1yb3cnO1xyXG4gICAgICAgICAgICB0aGlzLiR0YWJsZUNvbnRhaW5lci5hcHBlbmQoJHJvdyk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy53aWR0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNlbGxzW2ldLnB1c2gobmV3IENlbGwoaSwgaiwgJHJvdywgdGhpcykpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdW5pb24oY2VsbHNVbmlvbnMpOiB2b2lkIHtcclxuICAgICAgICBjZWxsc1VuaW9ucy5mb3JFYWNoKHVuaW9uID0+IHRoaXMuY3JlYXRlVW5pb24odW5pb24pKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZVVuaW9uKGNlbGxzVW5pb24pOiB2b2lkIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gY2VsbHNVbmlvbi5sZWZ0VXBYOyBpIDw9IGNlbGxzVW5pb24ucmlnaHREb3duWDsgaSsrKVxyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gY2VsbHNVbmlvbi5sZWZ0VXBZOyBqIDw9IGNlbGxzVW5pb24ucmlnaHREb3duWTsgaisrKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRDZWxsKGksIGopLnNlbGVjdFdpdGhGcmllbmRzKHRydWUpO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0RG93bigpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZGVjb3JhdGUoZGVjb3JhdGlvbnMpOiB2b2lkIHtcclxuICAgICAgICBkZWNvcmF0aW9ucy5mb3JFYWNoKGRlY29yYXRpb24gPT4gdGhpcy5kZWNvcmF0ZU9uZShkZWNvcmF0aW9uKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkZWNvcmF0ZU9uZShkZWNvcmF0aW9uKTogdm9pZCB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IGRlY29yYXRpb24ubGVmdFVwWDsgaSA8PSBkZWNvcmF0aW9uLnJpZ2h0RG93blg7IGkrKylcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IGRlY29yYXRpb24ubGVmdFVwWTsgaiA8PSBkZWNvcmF0aW9uLnJpZ2h0RG93blk7IGorKylcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q2VsbChpLCBqKS5hZGREZWNvcihkZWNvcmF0aW9uLmNzc1RleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYWRkTWVzc2FnZXMobWVzc2FnZXMpOiB2b2lkIHtcclxuICAgICAgICBtZXNzYWdlcy5mb3JFYWNoKG1lc3NhZ2UgPT4gdGhpcy5nZXRDZWxsKG1lc3NhZ2UueCwgbWVzc2FnZS55KS5hZGRNZXNzYWdlKG1lc3NhZ2UudGV4dCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25Cb2R5TW91c2V1cCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLm1vZCA9IFRhYmxlTW9kLm5vbmU7XHJcbiAgICAgICAgdGhpcy5zZWxlY3REb3duKCk7XHJcbiAgICAgICAgdGhpcy5oaWRlUG9wb3ZlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2VsZWN0RG93bigpOiB2b2lkIHtcclxuICAgICAgICBsZXQgY2xvbmUgPSB0aGlzLnNlbGVjdGVkQ2VsbHMubWFwKGVsZW0gPT4gZWxlbSk7XHJcbiAgICAgICAgd2hpbGUgKHRoaXMuc2VsZWN0ZWRDZWxscy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGxldCBjZWxsID0gdGhpcy5zZWxlY3RlZENlbGxzLnBvcCgpO1xyXG4gICAgICAgICAgICBjZWxsLnNldEZyaWVuZHMoY2xvbmUpO1xyXG4gICAgICAgICAgICBjZWxsLnNlbGVjdE5vbmUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvbkJvZHlLZXlkb3duKGV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgaWYgKGV2ZW50LmN0cmxLZXkgJiYgZXZlbnQuY29kZSA9PT0gJ0tleVonKSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMucG9wQWN0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDZWxsKHg6IG51bWJlciwgeTogbnVtYmVyKTogQ2VsbCB7XHJcbiAgICAgICAgaWYgKHggPj0gMCAmJiB4IDwgdGhpcy5oZWlnaHQgJiYgeSA+PSAwICYmIHkgPCB0aGlzLndpZHRoKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jZWxsc1t4XVt5XTtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcHVzaEFjdGlvbihhY3Rpb246IEFjdGlvbikge1xyXG4gICAgICAgIGxldCBsYXN0QWN0aW9uID0gdGhpcy5hY3Rpb25zW3RoaXMuYWN0aW9ucy5sZW5ndGggLSAxXTtcclxuICAgICAgICBpZiAobGFzdEFjdGlvbiAhPSBudWxsICYmIGxhc3RBY3Rpb25bMF0gPT09IEFjdGlvblR5cGUud3JpdGUgJiYgYWN0aW9uWzBdIDw9IEFjdGlvblR5cGUud3JpdGVXaXRoU3BhY2VcclxuICAgICAgICAgICAgJiYgbGFzdEFjdGlvblsxXSA9PT0gYWN0aW9uWzFdICYmIGxhc3RBY3Rpb25bMl0gPT09IGFjdGlvblsyXSlcclxuICAgICAgICAgICAgdGhpcy5hY3Rpb25zLnBvcCgpO1xyXG4gICAgICAgIHRoaXMuYWN0aW9ucy5wdXNoKGFjdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHBvcEFjdGlvbigpIHtcclxuICAgICAgICBsZXQgYWN0aW9uID0gdGhpcy5hY3Rpb25zLnBvcCgpO1xyXG4gICAgICAgIHN3aXRjaCAoYWN0aW9uWzBdKSB7XHJcbiAgICAgICAgICAgIGNhc2UgQWN0aW9uVHlwZS53cml0ZTpcclxuICAgICAgICAgICAgICAgIHRoaXMudW5kb1dyaXRlKGFjdGlvblsxXSwgYWN0aW9uWzJdKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgLy8gY2FzZSBBY3Rpb25UeXBlLmRlbGV0ZTpcclxuICAgICAgICAgICAgLy8gICAgIHRoaXMudW5kb0RlbGV0ZShhY3Rpb25bMV0sIGFjdGlvblsyXSwgYWN0aW9uWzNdKTtcclxuICAgICAgICAgICAgLy8gICAgIHJldHVybjtcclxuICAgICAgICAgICAgY2FzZSBBY3Rpb25UeXBlLndyaXRlV2l0aFNwYWNlOlxyXG4gICAgICAgICAgICAgICAgdGhpcy51bmRvV3JpdGUoYWN0aW9uWzFdLCBhY3Rpb25bMl0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVuZG9Xcml0ZSh4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuZ2V0Q2VsbCh4LCB5KS51bmRvV3JpdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVuZG9EZWxldGUoeDogbnVtYmVyLCB5OiBudW1iZXIsIHRleHQ6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuZ2V0Q2VsbCh4LCB5KS51bmRvRGVsZXRlKHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzaG93UG9wb3Zlcih4OiBudW1iZXIsIHk6IG51bWJlcil7XHJcbiAgICAgICAgdGhpcy5fJHBvcG92ZXIucmVtb3ZlQ2xhc3MoJ2Qtbm9uZScpO1xyXG4gICAgICAgIHRoaXMuXyRwb3BvdmVyLmF0dHIoJ3N0eWxlJywgYGxlZnQ6ICR7eSozMiArIDE2fXB4OyB0b3A6ICR7eCozMiArIDE2fXB4O2ApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBoaWRlUG9wb3Zlcigpe1xyXG4gICAgICAgIHRoaXMuXyRwb3BvdmVyLmFkZENsYXNzKCdkLW5vbmUnKTtcclxuICAgIH1cclxufSIsImV4cG9ydCBlbnVtIFRhYmxlTW9ke1xyXG4gICAgbm9uZSxcclxuICAgIHNlbGVjdGluZ1xyXG59IiwiaW1wb3J0IHtUYWJsZX0gZnJvbSBcIi4vVGFibGVcIjtcclxuXHJcbmxldCB0YWJsZTtcclxuZXhwb3J0IGxldCBzdG9yZSA9IHtcclxuICAgIGhlaWdodDogNTAsXHJcbiAgICB3aWR0aDogNTAsXHJcbiAgICBjZWxsc1VuaW9uczogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGVmdFVwWDogMTEsXHJcbiAgICAgICAgICAgIGxlZnRVcFk6IDE0LFxyXG4gICAgICAgICAgICByaWdodERvd25YOiAxNyxcclxuICAgICAgICAgICAgcmlnaHREb3duWTogMTdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGVmdFVwWDogMjIsXHJcbiAgICAgICAgICAgIGxlZnRVcFk6IDE3LFxyXG4gICAgICAgICAgICByaWdodERvd25YOiAyNCxcclxuICAgICAgICAgICAgcmlnaHREb3duWTogMzBcclxuICAgICAgICB9XHJcbiAgICBdLFxyXG4gICAgZGVjb3JhdGlvbnM6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxlZnRVcFg6IDExLFxyXG4gICAgICAgICAgICBsZWZ0VXBZOiAxNCxcclxuICAgICAgICAgICAgcmlnaHREb3duWDogMTcsXHJcbiAgICAgICAgICAgIHJpZ2h0RG93blk6IDE3LFxyXG4gICAgICAgICAgICBjc3NUZXh0OiBcImJhY2tncm91bmQtY29sb3I6IGJsdWUgIWltcG9ydGFudDsgY29sb3I6IHllbGxvdyAhaW1wb3J0YW50OyBib3JkZXItY29sb3I6IHJlZCAhaW1wb3J0YW50O1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxlZnRVcFg6IDMxLFxyXG4gICAgICAgICAgICBsZWZ0VXBZOiA0MSxcclxuICAgICAgICAgICAgcmlnaHREb3duWDogMzEsXHJcbiAgICAgICAgICAgIHJpZ2h0RG93blk6IDQxLFxyXG4gICAgICAgICAgICBjc3NUZXh0OiBcImJhY2tncm91bmQtY29sb3I6IHJnYigyMDQsMTEsMTEpICFpbXBvcnRhbnQ7IGNvbG9yOiBncmVlbiAhaW1wb3J0YW50OyBib3JkZXItY29sb3I6IGJsdWUgIWltcG9ydGFudDtcIlxyXG4gICAgICAgIH1cclxuICAgIF0sXHJcbiAgICBtZXNzYWdlczogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgeDogMjIsXHJcbiAgICAgICAgICAgIHk6IDE3LFxyXG4gICAgICAgICAgICB0ZXh0OiBcItCg0LXQsdGP0YLQsCwg0L/RgNC40LLQtdGCLCDRh9GC0L4g0LfQsNC00LDQu9C4INC/0L4g0L/RgNC10LrRgNCw0YHQvdC+0Lkg0LbQuNC30L3QuCDQsdC10Lcg0LfQsNCx0L7Rgj9cIlxyXG4gICAgICAgIH1cclxuICAgIF0sXHJcbiAgICBzZWxlY3RlZENsYXNzZXM6IFsnYmctZGFyaycsICd0ZXh0LWxpZ2h0J10sXHJcbiAgICBub1NlbGVjdGVkQ2xhc3NlczogWyd0ZXh0LWRhcmsnXVxyXG59XHJcblxyXG4kKHdpbmRvdykub24oJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICB0YWJsZSA9IG5ldyBUYWJsZShzdG9yZSk7XHJcbn0pOyIsIlxyXG5leHBvcnQgZW51bSBBY3Rpb25UeXBlIHtcclxuICAgIHdyaXRlLFxyXG4gICAgd3JpdGVXaXRoU3BhY2UsXHJcbiAgICBkZWxldGUsXHJcbiAgICB1bmlvblxyXG59XHJcblxyXG5leHBvcnQgdHlwZSBBY3Rpb24gPSBbYWN0aW9uVHlwZTogQWN0aW9uVHlwZSwgY2VsbFg6IG51bWJlciwgY2VsbFk6IG51bWJlciwgaW5mbz86IGFueV07IiwiZXhwb3J0IGVudW0gRGlyZWN0aW9ue1xyXG4gICAgbGVmdCxcclxuICAgIHJpZ2h0LFxyXG4gICAgdG9wLFxyXG4gICAgYm90dG9tXHJcbn0iXX0=
