(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cell = void 0;
var CellDrawer_1 = require("./CellDrawer");
var TableMod_1 = require("./TableMod");
var Direction_1 = require("./Direction");
var Action_1 = require("./Action");
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
        this.table.selectedCells.push(this);
        this.drawer.select();
    };
    Cell.prototype.selectNone = function () {
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
    return Cell;
}());
exports.Cell = Cell;
},{"./Action":1,"./CellDrawer":3,"./Direction":4,"./TableMod":6}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CellDrawer = void 0;
var TablePage_1 = require("./TablePage");
var Direction_1 = require("./Direction");
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
        //$span.oninput = (event) => this.keeper.onInput(event);
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
    return CellDrawer;
}());
exports.CellDrawer = CellDrawer;
},{"./Direction":4,"./TablePage":7}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = void 0;
var Cell_1 = require("./Cell");
var TableMod_1 = require("./TableMod");
var Action_1 = require("./Action");
var Table = /** @class */ (function () {
    function Table(width, height) {
        var _this = this;
        this.width = width;
        this.height = height;
        this.$tableContainer = $('main');
        this.cells = [];
        this.selectedCells = [];
        this.actions = [];
        this.fillTable();
        var $body = $('body');
        $body.on('mouseup', function () { return _this.onBodyMouseup(); });
        //$body.on('keydown', (event) => this.onBodyKeydown(event));
    }
    Table.prototype.fillTable = function () {
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
    Table.prototype.onBodyMouseup = function () {
        this.mod = TableMod_1.TableMod.none;
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
            case Action_1.ActionType.delete:
                this.undoDelete(action[1], action[2], action[3]);
                return;
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
    return Table;
}());
exports.Table = Table;
},{"./Action":1,"./Cell":2,"./TableMod":6}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableMod = void 0;
var TableMod;
(function (TableMod) {
    TableMod[TableMod["none"] = 0] = "none";
    TableMod[TableMod["selecting"] = 1] = "selecting";
})(TableMod = exports.TableMod || (exports.TableMod = {}));
},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
var Table_1 = require("./Table");
var table;
exports.store = {
    height: 50,
    width: 50,
    selectedClasses: ['bg-dark', 'text-light'],
    noSelectedClasses: ['text-dark']
};
$(window).on('load', function () {
    table = new Table_1.Table(exports.store.height, exports.store.width);
});
},{"./Table":5}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJUU2NyaXB0L1RhYmxlUGFnZS9BY3Rpb24udHMiLCJUU2NyaXB0L1RhYmxlUGFnZS9DZWxsLnRzIiwiVFNjcmlwdC9UYWJsZVBhZ2UvQ2VsbERyYXdlci50cyIsIlRTY3JpcHQvVGFibGVQYWdlL0RpcmVjdGlvbi50cyIsIlRTY3JpcHQvVGFibGVQYWdlL1RhYmxlLnRzIiwiVFNjcmlwdC9UYWJsZVBhZ2UvVGFibGVNb2QudHMiLCJUU2NyaXB0L1RhYmxlUGFnZS9UYWJsZVBhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNDQSxJQUFZLFVBS1g7QUFMRCxXQUFZLFVBQVU7SUFDbEIsNkNBQUssQ0FBQTtJQUNMLCtEQUFjLENBQUE7SUFDZCwrQ0FBTSxDQUFBO0lBQ04sNkNBQUssQ0FBQTtBQUNULENBQUMsRUFMVyxVQUFVLEdBQVYsa0JBQVUsS0FBVixrQkFBVSxRQUtyQjs7Ozs7QUNORCwyQ0FBd0M7QUFFeEMsdUNBQW9DO0FBQ3BDLHlDQUFzQztBQUN0QyxtQ0FBb0M7QUFJcEM7SUFLSSxjQUNvQixDQUFTLEVBQ1QsQ0FBUyxFQUN6QixJQUFpQixFQUNELEtBQVk7UUFIWixNQUFDLEdBQUQsQ0FBQyxDQUFRO1FBQ1QsTUFBQyxHQUFELENBQUMsQ0FBUTtRQUVULFVBQUssR0FBTCxLQUFLLENBQU87UUFFNUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLHVCQUFVLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRCxzQkFBVywyQkFBUzthQUFwQjtZQUFBLGlCQVVDO1lBVEcsT0FBTyxDQUFDLFVBQUEsS0FBSztnQkFDVCxJQUFJLEtBQUssQ0FBQyxPQUFPO29CQUFFLE9BQU87Z0JBQzFCLElBQUksS0FBSyxDQUFDLFFBQVE7b0JBQUUsT0FBTztnQkFDM0IsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLFNBQVM7b0JBQUUsS0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUM3RSxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssV0FBVyxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssT0FBTztvQkFBRSxLQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ3pHLElBQUksQ0FBQyxLQUFJLENBQUMsT0FBTyxFQUFFO29CQUFFLE9BQU87Z0JBQzVCLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxXQUFXO29CQUFFLEtBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUksQ0FBQyxDQUFDLEVBQUUsS0FBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDL0UsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLFlBQVk7b0JBQUUsS0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSSxDQUFDLENBQUMsRUFBRSxLQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3BGLENBQUMsQ0FBQyxDQUFBO1FBQ04sQ0FBQzs7O09BQUE7SUFFRCxzQkFBVyw4QkFBWTthQUF2QjtZQUFBLGlCQUtDO1lBSkcsT0FBTztnQkFDSCxJQUFJLEtBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLG1CQUFRLENBQUMsU0FBUztvQkFBRSxPQUFPO2dCQUNsRCxLQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUM3QixDQUFDLENBQUE7UUFDTCxDQUFDOzs7T0FBQTtJQUVELHNCQUFXLDZCQUFXO2FBQXRCO1lBQUEsaUJBS0M7WUFKRyxPQUFPO2dCQUNILEtBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLG1CQUFRLENBQUMsU0FBUyxDQUFDO2dCQUNwQyxLQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUM3QixDQUFDLENBQUE7UUFDTCxDQUFDOzs7T0FBQTtJQUVELHNCQUFXLCtCQUFhO2FBQXhCO1lBQUEsaUJBSUM7WUFIRyxPQUFPO2dCQUNILEtBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNqQixDQUFDLENBQUE7UUFDTCxDQUFDOzs7T0FBQTtJQUVELHNCQUFXLHdCQUFNO2FBQWpCO1lBQUEsaUJBS0M7WUFKRyxPQUFPLFVBQUMsSUFBWTtnQkFDaEIsSUFBRyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUM7b0JBQ2hCLEtBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNyQixDQUFDLENBQUE7UUFDTCxDQUFDOzs7T0FBQTtJQUVELHNCQUFXLHlCQUFPO2FBQWxCO1lBQUEsaUJBU0M7WUFSRyxPQUFPLFVBQUMsS0FBVTtnQkFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDN0IsSUFBRyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUc7b0JBQ3pCLElBQUcsS0FBSyxDQUFDLElBQUksS0FBSyxHQUFHO3dCQUFFLEtBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsbUJBQVUsQ0FBQyxjQUFjLEVBQUUsS0FBSSxDQUFDLENBQUMsRUFBRSxLQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7d0JBQ3JGLEtBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsbUJBQVUsQ0FBQyxLQUFLLEVBQUUsS0FBSSxDQUFDLENBQUMsRUFBRSxLQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDOUQsSUFBRyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUc7b0JBQzlCLEtBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsbUJBQVUsQ0FBQyxNQUFNLEVBQUUsS0FBSSxDQUFDLENBQUMsRUFBRSxLQUFJLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1RyxDQUFDLENBQUE7UUFDTCxDQUFDOzs7T0FBQTtJQUVNLG9CQUFLLEdBQVo7UUFDSSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUVNLGdDQUFpQixHQUF4QixVQUF5QixHQUFtQjtRQUFuQixvQkFBQSxFQUFBLFVBQW1CO1FBQ3hDLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEtBQUssQ0FBQztZQUNuRCxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDOztZQUV4QyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFDLE1BQU0sSUFBSyxPQUFBLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLEVBQTNDLENBQTJDLENBQUMsQ0FBQztJQUN2RixDQUFDO0lBRU0seUJBQVUsR0FBakIsVUFBa0IsT0FBZTtRQUFqQyxpQkFXQztRQVZHLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLHFCQUFTLENBQUMsR0FBRyxFQUFFLHFCQUFTLENBQUMsTUFBTSxFQUFFLHFCQUFTLENBQUMsSUFBSSxFQUFFLHFCQUFTLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDeEYsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSSxJQUFLLE9BQUEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUE1QyxDQUE0QyxDQUFDLElBQUksSUFBSTtZQUM1RSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxxQkFBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlDLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFDLElBQUksSUFBSyxPQUFBLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBNUMsQ0FBNEMsQ0FBQyxJQUFJLElBQUk7WUFDNUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMscUJBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFJLElBQUssT0FBQSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFJLENBQUMsQ0FBQyxDQUFDLEVBQTVDLENBQTRDLENBQUMsSUFBSSxJQUFJO1lBQzVFLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLHFCQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDNUMsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSSxJQUFLLE9BQUEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSSxDQUFDLENBQUMsQ0FBQyxFQUE1QyxDQUE0QyxDQUFDLElBQUksSUFBSTtZQUM1RSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxxQkFBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFTSxxQkFBTSxHQUFiO1FBQ0ksSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFh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QUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNyQyxPQUFPO1NBQ2Q7SUFDTCxDQUFDO0lBRU8seUJBQVMsR0FBakIsVUFBa0IsQ0FBUyxFQUFFLENBQVM7UUFDbEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDbkMsQ0FBQztJQUVPLDBCQUFVLEdBQWxCLFVBQW1CLENBQVMsRUFBRSxDQUFTLEVBQUUsSUFBWTtRQUNqRCxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUNMLFlBQUM7QUFBRCxDQW5GQSxBQW1GQyxJQUFBO0FBbkZZLHNCQUFLOzs7OztBQ0psQixJQUFZLFFBR1g7QUFIRCxXQUFZLFFBQVE7SUFDaEIsdUNBQUksQ0FBQTtJQUNKLGlEQUFTLENBQUE7QUFDYixDQUFDLEVBSFcsUUFBUSxHQUFSLGdCQUFRLEtBQVIsZ0JBQVEsUUFHbkI7Ozs7O0FDSEQsaUNBQThCO0FBRTlCLElBQUksS0FBSyxDQUFDO0FBQ0MsUUFBQSxLQUFLLEdBQUc7SUFDZixNQUFNLEVBQUUsRUFBRTtJQUNWLEtBQUssRUFBRSxFQUFFO0lBQ1QsZUFBZSxFQUFFLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQztJQUMxQyxpQkFBaUIsRUFBRSxDQUFDLFdBQVcsQ0FBQztDQUNuQyxDQUFBO0FBRUQsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUU7SUFDakIsS0FBSyxHQUFHLElBQUksYUFBSyxDQUFDLGFBQUssQ0FBQyxNQUFNLEVBQUUsYUFBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2pELENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXHJcbmV4cG9ydCBlbnVtIEFjdGlvblR5cGUge1xyXG4gICAgd3JpdGUsXHJcbiAgICB3cml0ZVdpdGhTcGFjZSxcclxuICAgIGRlbGV0ZSxcclxuICAgIHVuaW9uXHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIEFjdGlvbiA9IFthY3Rpb25UeXBlOiBBY3Rpb25UeXBlLCBjZWxsWDogbnVtYmVyLCBjZWxsWTogbnVtYmVyLCBpbmZvPzogYW55XTsiLCJpbXBvcnQge0NlbGxEcmF3ZXJ9IGZyb20gXCIuL0NlbGxEcmF3ZXJcIjtcclxuaW1wb3J0IHtUYWJsZX0gZnJvbSBcIi4vVGFibGVcIjtcclxuaW1wb3J0IHtUYWJsZU1vZH0gZnJvbSBcIi4vVGFibGVNb2RcIjtcclxuaW1wb3J0IHtEaXJlY3Rpb259IGZyb20gXCIuL0RpcmVjdGlvblwiO1xyXG5pbXBvcnQge0FjdGlvblR5cGV9IGZyb20gXCIuL0FjdGlvblwiO1xyXG5cclxudHlwZSBvblRyaWdnZXIgPSAoZXZlbnQ/OiBhbnkpID0+IHZvaWQgfCBib29sZWFuXHJcblxyXG5leHBvcnQgY2xhc3MgQ2VsbCB7XHJcbiAgICBwcml2YXRlIGRyYXdlcjogQ2VsbERyYXdlcjtcclxuICAgIHByaXZhdGUgX2ZyaWVuZHM6IENlbGxbXTtcclxuICAgIHByaXZhdGUgX2Jsb2NrZWQ6IGJvb2xlYW47XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHVibGljIHJlYWRvbmx5IHg6IG51bWJlcixcclxuICAgICAgICBwdWJsaWMgcmVhZG9ubHkgeTogbnVtYmVyLFxyXG4gICAgICAgICRyb3c6IEhUTUxFbGVtZW50LFxyXG4gICAgICAgIHB1YmxpYyByZWFkb25seSB0YWJsZTogVGFibGVcclxuICAgICkge1xyXG4gICAgICAgIHRoaXMuZHJhd2VyID0gbmV3IENlbGxEcmF3ZXIoJHJvdywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBvbktleWRvd24oKTogb25UcmlnZ2VyIHtcclxuICAgICAgICByZXR1cm4gKGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgaWYgKGV2ZW50LmN0cmxLZXkpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKGV2ZW50LnNoaWZ0S2V5KSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmIChldmVudC5jb2RlID09PSAnQXJyb3dVcCcpIHRoaXMudGFibGUuZ2V0Q2VsbCh0aGlzLnggLSAxLCB0aGlzLnkpLmZvY3VzKCk7XHJcbiAgICAgICAgICAgIGlmIChldmVudC5jb2RlID09PSAnQXJyb3dEb3duJyB8fCBldmVudC5jb2RlID09PSAnRW50ZXInKSB0aGlzLnRhYmxlLmdldENlbGwodGhpcy54ICsgMSwgdGhpcy55KS5mb2N1cygpO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNFbXB0eSgpKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmIChldmVudC5jb2RlID09PSAnQXJyb3dMZWZ0JykgdGhpcy50YWJsZS5nZXRDZWxsKHRoaXMueCwgdGhpcy55IC0gMSkuZm9jdXMoKTtcclxuICAgICAgICAgICAgaWYgKGV2ZW50LmNvZGUgPT09ICdBcnJvd1JpZ2h0JykgdGhpcy50YWJsZS5nZXRDZWxsKHRoaXMueCwgdGhpcy55ICsgMSkuZm9jdXMoKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgb25Nb3VzZWVudGVyKCk6IG9uVHJpZ2dlciB7XHJcbiAgICAgICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudGFibGUubW9kICE9PSBUYWJsZU1vZC5zZWxlY3RpbmcpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RXaXRoRnJpZW5kcygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG9uTW91c2Vkb3duKCk6IG9uVHJpZ2dlciB7XHJcbiAgICAgICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy50YWJsZS5tb2QgPSBUYWJsZU1vZC5zZWxlY3Rpbmc7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0V2l0aEZyaWVuZHMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBvbkRvdWJsZUNsaWNrKCk6IG9uVHJpZ2dlciB7XHJcbiAgICAgICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5mb2N1cygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG9uQmx1cigpOiBvblRyaWdnZXIge1xyXG4gICAgICAgIHJldHVybiAodGV4dDogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKHRleHQubGVuZ3RoICE9PSAwKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5ibG9jaygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG9uSW5wdXQoKTogb25UcmlnZ2VyIHtcclxuICAgICAgICByZXR1cm4gKGV2ZW50OiBhbnkpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZXZlbnQuaW5wdXRUeXBlKTtcclxuICAgICAgICAgICAgaWYoZXZlbnQuaW5wdXRUeXBlWzBdID09PSAnaScpXHJcbiAgICAgICAgICAgICAgICBpZihldmVudC5kYXRhID09PSAnICcpIHRoaXMudGFibGUucHVzaEFjdGlvbihbQWN0aW9uVHlwZS53cml0ZVdpdGhTcGFjZSwgdGhpcy54LCB0aGlzLnldKTtcclxuICAgICAgICAgICAgICAgIGVsc2UgdGhpcy50YWJsZS5wdXNoQWN0aW9uKFtBY3Rpb25UeXBlLndyaXRlLCB0aGlzLngsIHRoaXMueV0pO1xyXG4gICAgICAgICAgICBlbHNlIGlmKGV2ZW50LmlucHV0VHlwZVswXSA9PT0gJ2QnKVxyXG4gICAgICAgICAgICAgICAgdGhpcy50YWJsZS5wdXNoQWN0aW9uKFtBY3Rpb25UeXBlLmRlbGV0ZSwgdGhpcy54LCB0aGlzLnksIGV2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKCd0ZXh0L2h0bWwnKV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZm9jdXMoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5kcmF3ZXIuYmxvY2tObygpO1xyXG4gICAgICAgIHRoaXMuZHJhd2VyLmZvY3VzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNlbGVjdFdpdGhGcmllbmRzKHllczogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5fZnJpZW5kcyA9PSBudWxsIHx8IHRoaXMuX2ZyaWVuZHMubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICB5ZXMgPyB0aGlzLnNlbGVjdCgpIDogdGhpcy5zZWxlY3ROb25lKCk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLl9mcmllbmRzLmZvckVhY2goKGZyaWVuZCkgPT4geWVzID8gZnJpZW5kLnNlbGVjdCgpIDogZnJpZW5kLnNlbGVjdE5vbmUoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldEZyaWVuZHMoZnJpZW5kczogQ2VsbFtdKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fZnJpZW5kcyA9IGZyaWVuZHM7XHJcbiAgICAgICAgdGhpcy5kcmF3ZXIuYWRkQm9yZGVycyhEaXJlY3Rpb24udG9wLCBEaXJlY3Rpb24uYm90dG9tLCBEaXJlY3Rpb24ubGVmdCwgRGlyZWN0aW9uLnJpZ2h0KVxyXG4gICAgICAgIGlmIChmcmllbmRzLmZpbmQoKGNlbGwpID0+IChjZWxsLnggPT09IHRoaXMueCAmJiBjZWxsLnkgPT09IHRoaXMueSArIDEpKSAhPSBudWxsKVxyXG4gICAgICAgICAgICB0aGlzLmRyYXdlci5yZW1vdmVCb3JkZXIoRGlyZWN0aW9uLnJpZ2h0KTtcclxuICAgICAgICBpZiAoZnJpZW5kcy5maW5kKChjZWxsKSA9PiAoY2VsbC54ID09PSB0aGlzLnggJiYgY2VsbC55ID09PSB0aGlzLnkgLSAxKSkgIT0gbnVsbClcclxuICAgICAgICAgICAgdGhpcy5kcmF3ZXIucmVtb3ZlQm9yZGVyKERpcmVjdGlvbi5sZWZ0KTtcclxuICAgICAgICBpZiAoZnJpZW5kcy5maW5kKChjZWxsKSA9PiAoY2VsbC54ID09PSB0aGlzLnggLSAxICYmIGNlbGwueSA9PT0gdGhpcy55KSkgIT0gbnVsbClcclxuICAgICAgICAgICAgdGhpcy5kcmF3ZXIucmVtb3ZlQm9yZGVyKERpcmVjdGlvbi50b3ApO1xyXG4gICAgICAgIGlmIChmcmllbmRzLmZpbmQoKGNlbGwpID0+IChjZWxsLnggPT09IHRoaXMueCArIDEgJiYgY2VsbC55ID09PSB0aGlzLnkpKSAhPSBudWxsKVxyXG4gICAgICAgICAgICB0aGlzLmRyYXdlci5yZW1vdmVCb3JkZXIoRGlyZWN0aW9uLmJvdHRvbSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNlbGVjdCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnRhYmxlLnNlbGVjdGVkQ2VsbHMucHVzaCh0aGlzKTtcclxuICAgICAgICB0aGlzLmRyYXdlci5zZWxlY3QoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VsZWN0Tm9uZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmRyYXdlci5zZWxlY3ROb25lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGlzRW1wdHkoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZHJhd2VyLmlzRW1wdHkoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGJsb2NrKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZHJhd2VyLmJsb2NrKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBibG9ja05vKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZHJhd2VyLmJsb2NrTm8oKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdW5kb1dyaXRlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZHJhd2VyLnVuZG9Xcml0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1bmRvRGVsZXRlKHRleHQ6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZHJhd2VyLnVuZG9EZWxldGUodGV4dCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQge0NlbGx9IGZyb20gXCIuL0NlbGxcIjtcclxuaW1wb3J0IHtzdG9yZX0gZnJvbSBcIi4vVGFibGVQYWdlXCI7XHJcbmltcG9ydCB7RGlyZWN0aW9ufSBmcm9tIFwiLi9EaXJlY3Rpb25cIjtcclxuaW1wb3J0IHtldmVudH0gZnJvbSBcImpxdWVyeVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENlbGxEcmF3ZXIge1xyXG4gICAgcHJpdmF0ZSAkY2VsbDogSFRNTEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlICRzcGFuOiBIVE1MRWxlbWVudDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICAkcm93OiBIVE1MRWxlbWVudCxcclxuICAgICAgICBwcml2YXRlIGtlZXBlcjogQ2VsbFxyXG4gICAgKSB7XHJcbiAgICAgICAgdGhpcy5pbml0KCRyb3cpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdCgkcm93KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy4kc3BhbiA9IHRoaXMuJGNyZWF0ZVNwYW4oKTtcclxuICAgICAgICB0aGlzLiRjZWxsID0gdGhpcy4kY3JlYXRlQ2VsbCh0aGlzLiRzcGFuKTtcclxuICAgICAgICAkcm93LmFwcGVuZCh0aGlzLiRjZWxsKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlICRjcmVhdGVTcGFuKCk6IEhUTUxFbGVtZW50IHtcclxuICAgICAgICBsZXQgJHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgJHNwYW4uY2xhc3NOYW1lID0gJ3RleHQtbm93cmFwIG5vLXNob3ctZm9jdXMnO1xyXG4gICAgICAgICRzcGFuLm9ua2V5ZG93biA9IChldmVudCkgPT4gdGhpcy5rZWVwZXIub25LZXlkb3duKGV2ZW50KTtcclxuICAgICAgICAkc3Bhbi5vbmJsdXIgPSAoKSA9PiB0aGlzLmtlZXBlci5vbkJsdXIoJHNwYW4udGV4dENvbnRlbnQpO1xyXG4gICAgICAgIC8vJHNwYW4ub25pbnB1dCA9IChldmVudCkgPT4gdGhpcy5rZWVwZXIub25JbnB1dChldmVudCk7XHJcbiAgICAgICAgJHNwYW4uY29udGVudEVkaXRhYmxlID0gJ3RydWUnO1xyXG4gICAgICAgIHJldHVybiAkc3BhbjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlICRjcmVhdGVDZWxsKCRzcGFuOiBIVE1MRWxlbWVudCk6IEhUTUxFbGVtZW50IHtcclxuICAgICAgICBsZXQgJGNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAkY2VsbC5jbGFzc05hbWUgPSAnY29tZ3JpZC1jZWxsIGJvcmRlci10b3AgYm9yZGVyLWxlZnQgYm9yZGVyLXJpZ2h0IGJvcmRlci1ib3R0b20gdGV4dC1kYXJrJztcclxuICAgICAgICAkY2VsbC5vbm1vdXNlZW50ZXIgPSAoKSA9PiB0aGlzLmtlZXBlci5vbk1vdXNlZW50ZXIoKTtcclxuICAgICAgICAkY2VsbC5vbm1vdXNlZG93biA9ICgpID0+IHRoaXMua2VlcGVyLm9uTW91c2Vkb3duKCk7XHJcbiAgICAgICAgJGNlbGwub25kcmFnc3RhcnQgPSAoKSA9PiBmYWxzZTtcclxuICAgICAgICAkY2VsbC5hcHBlbmQoJHNwYW4pO1xyXG4gICAgICAgIHJldHVybiAkY2VsbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZm9jdXMoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy4kc3Bhbi5mb2N1cygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZWxlY3QoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy4kY2VsbC5jbGFzc0xpc3QucmVtb3ZlKC4uLnN0b3JlLm5vU2VsZWN0ZWRDbGFzc2VzKTtcclxuICAgICAgICB0aGlzLiRjZWxsLmNsYXNzTGlzdC5hZGQoLi4uc3RvcmUuc2VsZWN0ZWRDbGFzc2VzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VsZWN0Tm9uZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLiRjZWxsLmNsYXNzTGlzdC5yZW1vdmUoLi4uc3RvcmUuc2VsZWN0ZWRDbGFzc2VzKTtcclxuICAgICAgICB0aGlzLiRjZWxsLmNsYXNzTGlzdC5hZGQoLi4uc3RvcmUubm9TZWxlY3RlZENsYXNzZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpc0VtcHR5KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLiRzcGFuLnRleHRDb250ZW50Lmxlbmd0aCA9PT0gMDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVtb3ZlQm9yZGVycyguLi5kaXJlY3Rpb25zOiBEaXJlY3Rpb25bXSk6IHZvaWQge1xyXG4gICAgICAgIGRpcmVjdGlvbnMuZm9yRWFjaCgoZGlyZWN0aW9uKSA9PiB0aGlzLnJlbW92ZUJvcmRlcihkaXJlY3Rpb24pKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVtb3ZlQm9yZGVyKGRpcmVjdGlvbjogRGlyZWN0aW9uKTogdm9pZCB7XHJcbiAgICAgICAgc3dpdGNoIChkaXJlY3Rpb24pIHtcclxuICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24uYm90dG9tOlxyXG4gICAgICAgICAgICAgICAgdGhpcy4kY2VsbC5jbGFzc0xpc3QucmVtb3ZlKCdib3JkZXItYm90dG9tJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLmxlZnQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRjZWxsLmNsYXNzTGlzdC5yZW1vdmUoJ2JvcmRlci1sZWZ0Jyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLnJpZ2h0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy4kY2VsbC5jbGFzc0xpc3QucmVtb3ZlKCdib3JkZXItcmlnaHQnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24udG9wOlxyXG4gICAgICAgICAgICAgICAgdGhpcy4kY2VsbC5jbGFzc0xpc3QucmVtb3ZlKCdib3JkZXItdG9wJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRCb3JkZXJzKC4uLmRpcmVjdGlvbnM6IERpcmVjdGlvbltdKTogdm9pZCB7XHJcbiAgICAgICAgZGlyZWN0aW9ucy5mb3JFYWNoKChkaXJlY3Rpb24pID0+IHRoaXMuYWRkQm9yZGVyKGRpcmVjdGlvbikpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRCb3JkZXIoZGlyZWN0aW9uOiBEaXJlY3Rpb24pOiB2b2lkIHtcclxuICAgICAgICBzd2l0Y2ggKGRpcmVjdGlvbikge1xyXG4gICAgICAgICAgICBjYXNlIERpcmVjdGlvbi5ib3R0b206XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRjZWxsLmNsYXNzTGlzdC5hZGQoJ2JvcmRlci1ib3R0b20nKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24ubGVmdDpcclxuICAgICAgICAgICAgICAgIHRoaXMuJGNlbGwuY2xhc3NMaXN0LmFkZCgnYm9yZGVyLWxlZnQnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24ucmlnaHQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRjZWxsLmNsYXNzTGlzdC5hZGQoJ2JvcmRlci1yaWdodCcpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBjYXNlIERpcmVjdGlvbi50b3A6XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRjZWxsLmNsYXNzTGlzdC5hZGQoJ2JvcmRlci10b3AnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGJsb2NrKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuJHNwYW4uY29udGVudEVkaXRhYmxlID0gJ2ZhbHNlJztcclxuICAgICAgICB0aGlzLiRzcGFuLmNsYXNzTGlzdC5hZGQoJ3VzZXItc2VsZWN0LW5vbmUnKTtcclxuICAgICAgICB0aGlzLiRjZWxsLm9uZGJsY2xpY2sgPSAoKSA9PiB0aGlzLmtlZXBlci5vbkRvdWJsZUNsaWNrKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGJsb2NrTm8oKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy4kc3Bhbi5jb250ZW50RWRpdGFibGUgPSAndHJ1ZSc7XHJcbiAgICAgICAgdGhpcy4kc3Bhbi5jbGFzc0xpc3QucmVtb3ZlKCd1c2VyLXNlbGVjdC1ub25lJyk7XHJcbiAgICAgICAgdGhpcy4kY2VsbC5vbmRibGNsaWNrID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdW5kb1dyaXRlKCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBsYXN0U3BhY2VJbmRleCA9IHRoaXMuJHNwYW4udGV4dENvbnRlbnQubGFzdEluZGV4T2YoJyAnKTtcclxuICAgICAgICBpZihsYXN0U3BhY2VJbmRleCA8IDApIHRoaXMuJHNwYW4udGV4dENvbnRlbnQgPSAnJztcclxuICAgICAgICBlbHNlIHRoaXMuJHNwYW4udGV4dENvbnRlbnQgPSB0aGlzLiRzcGFuLnRleHRDb250ZW50LnN1YnN0cigwLCBsYXN0U3BhY2VJbmRleCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVuZG9EZWxldGUodGV4dCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuJHNwYW4udGV4dENvbnRlbnQgKz0gdGV4dDtcclxuICAgIH1cclxufSIsImV4cG9ydCBlbnVtIERpcmVjdGlvbntcclxuICAgIGxlZnQsXHJcbiAgICByaWdodCxcclxuICAgIHRvcCxcclxuICAgIGJvdHRvbVxyXG59IiwiaW1wb3J0IHtDZWxsfSBmcm9tIFwiLi9DZWxsXCI7XHJcbmltcG9ydCB7VGFibGVNb2R9IGZyb20gXCIuL1RhYmxlTW9kXCI7XHJcbmltcG9ydCB7QWN0aW9uLCBBY3Rpb25UeXBlfSBmcm9tIFwiLi9BY3Rpb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUYWJsZSB7XHJcbiAgICBwcml2YXRlICR0YWJsZUNvbnRhaW5lciA9ICQoJ21haW4nKTtcclxuICAgIHB1YmxpYyByZWFkb25seSBjZWxsczogQ2VsbFtdW10gPSBbXTtcclxuICAgIHB1YmxpYyBtb2Q6IFRhYmxlTW9kO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IHNlbGVjdGVkQ2VsbHM6IENlbGxbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBhY3Rpb25zOiBBY3Rpb25bXSA9IFtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHB1YmxpYyByZWFkb25seSB3aWR0aDogbnVtYmVyLFxyXG4gICAgICAgIHB1YmxpYyByZWFkb25seSBoZWlnaHQ6IG51bWJlclxyXG4gICAgKSB7XHJcbiAgICAgICAgdGhpcy5maWxsVGFibGUoKTtcclxuICAgICAgICBsZXQgJGJvZHkgPSAkKCdib2R5Jyk7XHJcbiAgICAgICAgJGJvZHkub24oJ21vdXNldXAnLCAoKSA9PiB0aGlzLm9uQm9keU1vdXNldXAoKSk7XHJcbiAgICAgICAgLy8kYm9keS5vbigna2V5ZG93bicsIChldmVudCkgPT4gdGhpcy5vbkJvZHlLZXlkb3duKGV2ZW50KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBmaWxsVGFibGUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5jZWxscy5sZW5ndGggPSAwO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5oZWlnaHQ7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmNlbGxzLnB1c2goW10pO1xyXG4gICAgICAgICAgICBsZXQgJHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3JvdycpO1xyXG4gICAgICAgICAgICAkcm93LmNsYXNzTmFtZSA9ICdjb21ncmlkLXJvdyc7XHJcbiAgICAgICAgICAgIHRoaXMuJHRhYmxlQ29udGFpbmVyLmFwcGVuZCgkcm93KTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLndpZHRoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2VsbHNbaV0ucHVzaChuZXcgQ2VsbChpLCBqLCAkcm93LCB0aGlzKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvbkJvZHlNb3VzZXVwKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMubW9kID0gVGFibGVNb2Qubm9uZTtcclxuICAgICAgICBsZXQgY2xvbmUgPSB0aGlzLnNlbGVjdGVkQ2VsbHMubWFwKGVsZW0gPT4gZWxlbSk7XHJcbiAgICAgICAgd2hpbGUgKHRoaXMuc2VsZWN0ZWRDZWxscy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGxldCBjZWxsID0gdGhpcy5zZWxlY3RlZENlbGxzLnBvcCgpO1xyXG4gICAgICAgICAgICBjZWxsLnNldEZyaWVuZHMoY2xvbmUpO1xyXG4gICAgICAgICAgICBjZWxsLnNlbGVjdE5vbmUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvbkJvZHlLZXlkb3duKGV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgaWYgKGV2ZW50LmN0cmxLZXkgJiYgZXZlbnQuY29kZSA9PT0gJ0tleVonKSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMucG9wQWN0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDZWxsKHg6IG51bWJlciwgeTogbnVtYmVyKTogQ2VsbCB7XHJcbiAgICAgICAgaWYgKHggPj0gMCAmJiB4IDwgdGhpcy5oZWlnaHQgJiYgeSA+PSAwICYmIHkgPCB0aGlzLndpZHRoKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jZWxsc1t4XVt5XTtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcHVzaEFjdGlvbihhY3Rpb246IEFjdGlvbikge1xyXG4gICAgICAgIGxldCBsYXN0QWN0aW9uID0gdGhpcy5hY3Rpb25zW3RoaXMuYWN0aW9ucy5sZW5ndGggLSAxXTtcclxuICAgICAgICBpZiAobGFzdEFjdGlvbiAhPSBudWxsICYmIGxhc3RBY3Rpb25bMF0gPT09IEFjdGlvblR5cGUud3JpdGUgJiYgYWN0aW9uWzBdIDw9IEFjdGlvblR5cGUud3JpdGVXaXRoU3BhY2VcclxuICAgICAgICAgICAgJiYgbGFzdEFjdGlvblsxXSA9PT0gYWN0aW9uWzFdICYmIGxhc3RBY3Rpb25bMl0gPT09IGFjdGlvblsyXSlcclxuICAgICAgICAgICAgdGhpcy5hY3Rpb25zLnBvcCgpO1xyXG4gICAgICAgIHRoaXMuYWN0aW9ucy5wdXNoKGFjdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHBvcEFjdGlvbigpIHtcclxuICAgICAgICBsZXQgYWN0aW9uID0gdGhpcy5hY3Rpb25zLnBvcCgpO1xyXG4gICAgICAgIHN3aXRjaCAoYWN0aW9uWzBdKSB7XHJcbiAgICAgICAgICAgIGNhc2UgQWN0aW9uVHlwZS53cml0ZTpcclxuICAgICAgICAgICAgICAgIHRoaXMudW5kb1dyaXRlKGFjdGlvblsxXSwgYWN0aW9uWzJdKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgY2FzZSBBY3Rpb25UeXBlLmRlbGV0ZTpcclxuICAgICAgICAgICAgICAgIHRoaXMudW5kb0RlbGV0ZShhY3Rpb25bMV0sIGFjdGlvblsyXSwgYWN0aW9uWzNdKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgY2FzZSBBY3Rpb25UeXBlLndyaXRlV2l0aFNwYWNlOlxyXG4gICAgICAgICAgICAgICAgdGhpcy51bmRvV3JpdGUoYWN0aW9uWzFdLCBhY3Rpb25bMl0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVuZG9Xcml0ZSh4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuZ2V0Q2VsbCh4LCB5KS51bmRvV3JpdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVuZG9EZWxldGUoeDogbnVtYmVyLCB5OiBudW1iZXIsIHRleHQ6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuZ2V0Q2VsbCh4LCB5KS51bmRvRGVsZXRlKHRleHQpO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGVudW0gVGFibGVNb2R7XHJcbiAgICBub25lLFxyXG4gICAgc2VsZWN0aW5nXHJcbn0iLCJpbXBvcnQge1RhYmxlfSBmcm9tIFwiLi9UYWJsZVwiO1xyXG5cclxubGV0IHRhYmxlO1xyXG5leHBvcnQgbGV0IHN0b3JlID0ge1xyXG4gICAgaGVpZ2h0OiA1MCxcclxuICAgIHdpZHRoOiA1MCxcclxuICAgIHNlbGVjdGVkQ2xhc3NlczogWydiZy1kYXJrJywgJ3RleHQtbGlnaHQnXSxcclxuICAgIG5vU2VsZWN0ZWRDbGFzc2VzOiBbJ3RleHQtZGFyayddXHJcbn1cclxuXHJcbiQod2luZG93KS5vbignbG9hZCcsICgpID0+IHtcclxuICAgIHRhYmxlID0gbmV3IFRhYmxlKHN0b3JlLmhlaWdodCwgc3RvcmUud2lkdGgpO1xyXG59KTsiXX0=
