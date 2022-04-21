(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onLoad = void 0;
var HttpClient_1 = require("./util/HttpClient");
var CreateTableRequest_1 = require("./util/request/CreateTableRequest");
var UserInfoRequest_1 = require("./util/request/UserInfoRequest");
var store = {
    dialogs2: [
        {
            id: 0,
            name: 'Виталя и компания',
            lastSender: 'Виталя',
            lastMessage: 'Привет, приходи пить кровь',
            time: 'вчера',
            messagesCount: 51,
            avatar: './pictures/1.png',
            width: 100,
            height: 120
        },
        {
            id: 1,
            name: 'Беседа не для глупых',
            lastSender: 'КтоТо НеГлупый',
            lastMessage: 'Сколько будет 2+2?',
            time: 'вчера',
            messagesCount: 17,
            avatar: './pictures/2.png',
            width: 10,
            height: 112
        },
        {
            id: 2,
            name: 'Беседа для разных людей',
            lastSender: 'Необычный человек',
            lastMessage: 'Ребята, я только что доказал гипотезу Римана! Короче, там всё просто!',
            time: '11:30',
            messagesCount: 0,
            avatar: './pictures/3.png',
            width: 20,
            height: 40
        },
        {
            id: 3,
            name: 'Беседа с очень длинным названием. Ребята, я не представляю кому в голову пришло давать такое длинное название. Ребята, предлагаю ограничить длину названий',
            lastSender: 'Виталя',
            lastMessage: 'Привет, глянь лс',
            time: '14:15',
            messagesCount: 0,
            avatar: './pictures/4.png',
            width: 1000,
            height: 1000
        },
        {
            id: 4,
            name: 'Виталя Трубоед',
            lastSender: '',
            lastMessage: 'Давно читал беседу?',
            time: '19:51',
            messagesCount: 4,
            avatar: './pictures/5.png',
            width: 1000,
            height: 500
        }
    ]
};
var link = "https://comgrid.ru:8443";
var httpClient = new HttpClient_1.HttpClient(link);
var leftButtonClicked = false;
function onLoad() {
    loadStore()
        .then(function () {
        drawDialogs();
    });
    $('.clickable').on('click', function () {
        $('.clickable').toggleClass('d-none');
    });
    var input = document.getElementById('table-image-file-input');
    input.onchange = function () { return showImage(input); };
    $("#shower").on("dragstart", function () { return false; });
    $("#shower-cut").on("dragstart", function () { return false; });
    $("#save-canvas").on("click", saveCanvas);
    $('#create-table-form').on('submit', submit);
}
exports.onLoad = onLoad;
function drawDialogs() {
    var $container = $('.chat-container');
    var $noDel = $container.find('.no-deletable');
    $container.html('');
    $container.append($noDel);
    store.dialogs.slice().reverse().forEach(function (dialog, index) {
        var dialog2 = store.dialogs2[index % store.dialogs2.length];
        var $chat = $('.chat').clone();
        $chat.removeClass('chat d-none');
        $chat.find('a').attr('href', 'pages/table?id=' + dialog.id);
        $chat.find('.chat-name').text(dialog.name);
        $chat.find('.chat-sender').text(dialog2.lastSender + (dialog2.lastSender === '' ? '' : ':'));
        $chat.find('.chat-text').text(dialog2.lastMessage);
        $chat.find('.chat-time').text(dialog2.time);
        if (dialog.avatar.startsWith("/"))
            dialog.avatar = link + dialog.avatar;
        var $img = $chat.find('img');
        $img.attr('src', dialog.avatar);
        $img[0].onload = function () {
            var width = $img[0].getBoundingClientRect().width;
            $img.height(width);
            $img.width(width);
        };
        $chat.find('.chat-size').text(dialog.width + '×' + dialog.height);
        dialog2.messagesCount === 0
            ? $chat.find('.chat-unread').remove()
            : $chat.find('.chat-unread').text(dialog2.messagesCount);
        $container.append($chat);
        $chat.on('mouseenter', function () {
            $chat.removeClass('bg-light');
        });
        $chat.on('mouseleave', function () {
            $chat.addClass('bg-light');
        });
        $chat.on('click', function () {
            dialog.messagesCount = 0;
            drawDialogs();
        });
    });
}
function submit() {
    var _a;
    var avatarFile = (_a = document.getElementById('table-image-file-input')) === null || _a === void 0 ? void 0 : _a.files[0];
    var avatarLink = $('#table-image-link-input').val();
    if (avatarLink === "" && avatarFile === null) {
        alert("You must specify either image or link to image");
        return false;
    }
    var height = $('#table-height-input').val();
    var width = $('#table-width-input').val();
    if ((+height) * (+width) > 10000) {
        alert("Размер таблицы не может превышать 10000 ячеек");
        return false;
    }
    if (+height <= 0 || +width <= 0) {
        alert("Неположительные размеры? Чтобы отправлять несуществующие сообщения? Круто, ничего не скажешь, но нельзя");
        return false;
    }
    var image = document.getElementById("shower");
    console.log(image.naturalHeight, image.naturalWidth);
    if (image.naturalHeight !== image.naturalWidth) {
        alert("Картинка должна быть квадратной. Обрежьте её!");
        return false;
    }
    var newTable = new CreateTableRequest_1.CreateTableRequest({
        name: $('#table-name-input').val(),
        width: width,
        height: height,
        avatarLink: avatarLink,
        avatarFile: avatarFile
    });
    postTable(newTable)
        .then(function (table) {
        console.log(table);
        loadStore().then(drawDialogs);
    });
    clearMenu();
    closeMenu();
    return false;
}
function postTable(table) {
    return httpClient.proceedRequest(table, function (code, errorText) {
        alert("Error happened while creating table: ".concat(code, ", ").concat(errorText));
    });
}
function clearMenu() {
    $('#clear-button').click();
}
function closeMenu() {
    $('#close-button').click();
}
function loadStore() {
    return httpClient.proceedRequest(new UserInfoRequest_1.UserInfoRequest({ includeChats: true }), function (code, errorText) {
        alert("Error happened while loading user info: ".concat(code, ", ").concat(errorText));
    }).then(function (user) {
        store.dialogs = user.chats;
    });
}
function showImage(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        var shower_1 = document.getElementById('shower');
        console.log(shower_1.naturalWidth, shower_1.naturalHeight);
        reader.onload = function (e) {
            shower_1.classList.remove('d-none');
            var method = function () {
                var dark = $('.dark-background');
                shower_1.width = 500;
                shower_1.height = shower_1.naturalHeight * shower_1.width / shower_1.naturalWidth;
                dark.removeClass('d-none');
                dark.width(shower_1.width);
                dark.height(shower_1.height);
                var showerCut = document.getElementById('shower-cut');
                showerCut.classList.remove('d-none');
                showerCut.width = shower_1.width * 2 / 3;
                showerCut.height = shower_1.width * 2 / 3;
                var offset = shower_1.width / 6;
                showerCut.style.top = "".concat(offset, "px");
                showerCut.style.left = "".concat(offset, "px");
                showerCut.removeEventListener('mousedown', showerCutMove);
                showerCut.addEventListener('mousedown', showerCutMove);
                var context = showerCut.getContext('2d');
                context.drawImage(shower_1, -offset, -offset, shower_1.width, shower_1.width);
                //context.strokeRect(0, 0, shower.width, shower.width);
                shower_1.setAttribute('src', e.target.result);
                shower_1.removeEventListener('load', method);
                $('#save-canvas').removeClass('d-none');
            };
            shower_1.addEventListener('load', method);
            shower_1.setAttribute('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}
function saveCanvas() {
    var showerCut = document.getElementById('shower-cut');
    var keeper = document.getElementById('shower');
    showerCut.toBlob(function (blob) {
        var dt = new DataTransfer();
        dt.items.add(new File([blob], 'image.png', { type: 'image/png' }));
        var file_list = dt.files;
        console.log('Коллекция файлов создана:');
        console.dir(file_list);
        var input = document.getElementById('table-image-file-input');
        input.files = file_list;
        showImage(input);
    });
}
var showerCutMove = function (event) {
    var shower = document.getElementById('shower-cut');
    var keeper = document.getElementById('shower');
    var bounding = keeper.getBoundingClientRect();
    var shiftX = event.clientX - shower.getBoundingClientRect().left;
    var shiftY = event.clientY - shower.getBoundingClientRect().top;
    shower.style.position = 'absolute';
    moveAt(event.pageX, event.pageY);
    function moveAt(pageX, pageY) {
        var left = Math.min(Math.max(pageX - shiftX - bounding.left, 0), bounding.width - shower.width);
        var top = Math.min(Math.max(pageY - shiftY - bounding.top, 0), bounding.height - shower.height);
        shower.style.left = left + 'px';
        shower.style.top = top + 'px';
        var context = shower.getContext('2d');
        context.clearRect(0, 0, bounding.width, bounding.height);
        context.drawImage(keeper, -left, -top, bounding.width, bounding.height);
        //context.strokeRect(0, 0, shower.width, shower.height);
    }
    function resize(increase) {
        var width = Math.min(shower.width + (increase ? 6 : -6), bounding.width, bounding.height);
        shower.width = width;
        shower.height = width;
        var boundingIn = shower.getBoundingClientRect();
        var left = Math.min(Math.max(+shower.style.left.slice(0, -2), 0), bounding.width - shower.width);
        var top = Math.min(Math.max(+shower.style.top.slice(0, -2), 0), bounding.height - shower.height);
        shower.style.left = left + 'px';
        shower.style.top = top + 'px';
        var context = shower.getContext('2d');
        context.clearRect(0, 0, bounding.width, bounding.height);
        context.drawImage(keeper, -left, -top, bounding.width, bounding.height);
        //context.strokeRect(0, 0, shower.width, shower.height);
    }
    function onMouseMove(event) {
        if (event.ctrlKey) {
            var newShiftX = event.clientX - shower.getBoundingClientRect().left;
            var newShiftY = event.clientY - shower.getBoundingClientRect().top;
            var increase = (newShiftX - newShiftY - shiftX + shiftY) > 0;
            shiftX = newShiftX;
            shiftY = newShiftY;
            resize(increase);
        }
        else
            moveAt(event.pageX, event.pageY);
    }
    document.addEventListener('mousemove', onMouseMove);
    shower.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        shower.onmouseup = null;
    };
};
},{"./util/HttpClient":2,"./util/request/CreateTableRequest":3,"./util/request/UserInfoRequest":4}],2:[function(require,module,exports){
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
            var _this = this;
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
                    }).then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var errorText;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(response.status === 200)) return [3 /*break*/, 1];
                                    return [2 /*return*/, request.proceedRequest(response)];
                                case 1: return [4 /*yield*/, response.text()];
                                case 2:
                                    errorText = _a.sent();
                                    onFailure(response.status, errorText);
                                    throw new TypeError(errorText);
                            }
                        });
                    }); })];
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
    MethodType["DELETE"] = "DELETE";
})(MethodType = exports.MethodType || (exports.MethodType = {}));
},{}],3:[function(require,module,exports){
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
exports.CreateTableRequest = exports.TableResponse = void 0;
var HttpClient_1 = require("../HttpClient");
var TableResponse = /** @class */ (function () {
    function TableResponse() {
    }
    return TableResponse;
}());
exports.TableResponse = TableResponse;
var CreateTableRequest = /** @class */ (function () {
    function CreateTableRequest(body) {
        this.endpoint = "/table/create";
        this.methodType = HttpClient_1.MethodType.POST;
        this.body = new FormData();
        this.body.append('name', body.name);
        this.body.append('width', body.width.toString());
        this.body.append('height', body.height.toString());
        if (body.avatarLink == undefined && body.avatarFile == undefined)
            throw new TypeError("Cannot send request with no avatar");
        if (body.avatarFile != undefined)
            this.body.append('avatarFile', body.avatarFile);
        if (body.avatarLink != undefined)
            this.body.append('avatarLink', body.avatarLink);
    }
    CreateTableRequest.prototype.proceedRequest = function (response) {
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
    return CreateTableRequest;
}());
exports.CreateTableRequest = CreateTableRequest;
},{"../HttpClient":2}],4:[function(require,module,exports){
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
},{"../HttpClient":2}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJUU2NyaXB0L2luZGV4LnRzIiwiVFNjcmlwdC91dGlsL0h0dHBDbGllbnQudHMiLCJUU2NyaXB0L3V0aWwvcmVxdWVzdC9DcmVhdGVUYWJsZVJlcXVlc3QudHMiLCJUU2NyaXB0L3V0aWwvcmVxdWVzdC9Vc2VySW5mb1JlcXVlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNBQSxnREFBNkM7QUFDN0Msd0VBQXFFO0FBQ3JFLGtFQUErRDtBQUcvRCxJQUFJLEtBQUssR0FBUTtJQUNiLFFBQVEsRUFBRTtRQUNOO1lBQ0ksRUFBRSxFQUFFLENBQUM7WUFDTCxJQUFJLEVBQUUsbUJBQW1CO1lBQ3pCLFVBQVUsRUFBRSxRQUFRO1lBQ3BCLFdBQVcsRUFBRSw0QkFBNEI7WUFDekMsSUFBSSxFQUFFLE9BQU87WUFDYixhQUFhLEVBQUUsRUFBRTtZQUNqQixNQUFNLEVBQUUsa0JBQWtCO1lBQzFCLEtBQUssRUFBRSxHQUFHO1lBQ1YsTUFBTSxFQUFFLEdBQUc7U0FDZDtRQUNEO1lBQ0ksRUFBRSxFQUFFLENBQUM7WUFDTCxJQUFJLEVBQUUsc0JBQXNCO1lBQzVCLFVBQVUsRUFBRSxnQkFBZ0I7WUFDNUIsV0FBVyxFQUFFLG9CQUFvQjtZQUNqQyxJQUFJLEVBQUUsT0FBTztZQUNiLGFBQWEsRUFBRSxFQUFFO1lBQ2pCLE1BQU0sRUFBRSxrQkFBa0I7WUFDMUIsS0FBSyxFQUFFLEVBQUU7WUFDVCxNQUFNLEVBQUUsR0FBRztTQUNkO1FBQ0Q7WUFDSSxFQUFFLEVBQUUsQ0FBQztZQUNMLElBQUksRUFBRSx5QkFBeUI7WUFDL0IsVUFBVSxFQUFFLG1CQUFtQjtZQUMvQixXQUFXLEVBQUUsdUVBQXVFO1lBQ3BGLElBQUksRUFBRSxPQUFPO1lBQ2IsYUFBYSxFQUFFLENBQUM7WUFDaEIsTUFBTSxFQUFFLGtCQUFrQjtZQUMxQixLQUFLLEVBQUUsRUFBRTtZQUNULE1BQU0sRUFB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QUFJLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLE1BQU0sR0FBRyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hHLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsTUFBTSxHQUFHLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDaEcsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNoQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDO1FBQzlCLElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDckMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3pELE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hFLHdEQUF3RDtJQUM1RCxDQUFDO0lBRUQsU0FBUyxNQUFNLENBQUMsUUFBaUI7UUFDN0IsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUYsTUFBTSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDckIsTUFBTSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDdEIsSUFBSSxVQUFVLEdBQUcsTUFBTSxDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFFaEQsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hHLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNoRyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUM7UUFDOUIsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNyQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekQsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEUsd0RBQXdE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QUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQTtJQUN2RCxDQUFDO0lBRUssMkNBQWMsR0FBcEIsVUFBcUIsUUFBa0I7Ozs7OzRCQUN0QixxQkFBTSxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUE7O3dCQUE1QixJQUFJLEdBQUcsU0FBcUI7d0JBQ2xDLHNCQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFrQixFQUFBOzs7O0tBQzNDO0lBSUwseUJBQUM7QUFBRCxDQTdCQSxBQTZCQyxJQUFBO0FBN0JZLGdEQUFrQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNkL0IsNENBQXlDO0FBRXpDO0lBQUE7SUFPQSxDQUFDO0lBQUQsbUJBQUM7QUFBRCxDQVBBLEFBT0MsSUFBQTtBQVBZLG9DQUFZO0FBU3pCO0lBR0kseUJBQVksVUFBc0M7O1FBUXpDLGFBQVEsR0FBVyxZQUFZLENBQUM7UUFDaEMsZUFBVSxHQUFlLHVCQUFVLENBQUMsR0FBRyxDQUFDO1FBUjdDLElBQUksTUFBTSxHQUFRLEVBQUUsQ0FBQTtRQUNwQixJQUFHLFVBQVUsQ0FBQyxZQUFZO1lBQ3RCLE1BQU0sQ0FBQyxZQUFZLEdBQUcsTUFBQSxVQUFVLENBQUMsWUFBWSwwQ0FBRSxRQUFRLEVBQUUsQ0FBQTtRQUU3RCxJQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQTtJQUM1QixDQUFDO0lBS0ssd0NBQWMsR0FBcEIsVUFBcUIsUUFBa0I7Ozs7OzRCQUN0QixxQkFBTSxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUE7O3dCQUE1QixJQUFJLEdBQUcsU0FBcUI7d0JBQ2xDLHNCQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFpQixFQUFDOzs7O0tBQzNDO0lBQ0wsc0JBQUM7QUFBRCxDQWxCQSxBQWtCQyxJQUFBO0FBbEJZLDBDQUFlIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IHtIdHRwQ2xpZW50fSBmcm9tIFwiLi91dGlsL0h0dHBDbGllbnRcIjtcclxuaW1wb3J0IHtDcmVhdGVUYWJsZVJlcXVlc3R9IGZyb20gXCIuL3V0aWwvcmVxdWVzdC9DcmVhdGVUYWJsZVJlcXVlc3RcIjtcclxuaW1wb3J0IHtVc2VySW5mb1JlcXVlc3R9IGZyb20gXCIuL3V0aWwvcmVxdWVzdC9Vc2VySW5mb1JlcXVlc3RcIjtcclxuaW1wb3J0IHtJc0xvZ2dlZEluUmVxdWVzdH0gZnJvbSBcIi4vdXRpbC9yZXF1ZXN0L0lzTG9nZ2VkSW5SZXF1ZXN0XCI7XHJcblxyXG5sZXQgc3RvcmU6IGFueSA9IHtcclxuICAgIGRpYWxvZ3MyOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZDogMCxcclxuICAgICAgICAgICAgbmFtZTogJ9CS0LjRgtCw0LvRjyDQuCDQutC+0LzQv9Cw0L3QuNGPJyxcclxuICAgICAgICAgICAgbGFzdFNlbmRlcjogJ9CS0LjRgtCw0LvRjycsXHJcbiAgICAgICAgICAgIGxhc3RNZXNzYWdlOiAn0J/RgNC40LLQtdGCLCDQv9GA0LjRhdC+0LTQuCDQv9C40YLRjCDQutGA0L7QstGMJyxcclxuICAgICAgICAgICAgdGltZTogJ9Cy0YfQtdGA0LAnLFxyXG4gICAgICAgICAgICBtZXNzYWdlc0NvdW50OiA1MSxcclxuICAgICAgICAgICAgYXZhdGFyOiAnLi9waWN0dXJlcy8xLnBuZycsXHJcbiAgICAgICAgICAgIHdpZHRoOiAxMDAsXHJcbiAgICAgICAgICAgIGhlaWdodDogMTIwXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlkOiAxLFxyXG4gICAgICAgICAgICBuYW1lOiAn0JHQtdGB0LXQtNCwINC90LUg0LTQu9GPINCz0LvRg9C/0YvRhScsXHJcbiAgICAgICAgICAgIGxhc3RTZW5kZXI6ICfQmtGC0L7QotC+INCd0LXQk9C70YPQv9GL0LknLFxyXG4gICAgICAgICAgICBsYXN0TWVzc2FnZTogJ9Ch0LrQvtC70YzQutC+INCx0YPQtNC10YIgMisyPycsXHJcbiAgICAgICAgICAgIHRpbWU6ICfQstGH0LXRgNCwJyxcclxuICAgICAgICAgICAgbWVzc2FnZXNDb3VudDogMTcsXHJcbiAgICAgICAgICAgIGF2YXRhcjogJy4vcGljdHVyZXMvMi5wbmcnLFxyXG4gICAgICAgICAgICB3aWR0aDogMTAsXHJcbiAgICAgICAgICAgIGhlaWdodDogMTEyXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlkOiAyLFxyXG4gICAgICAgICAgICBuYW1lOiAn0JHQtdGB0LXQtNCwINC00LvRjyDRgNCw0LfQvdGL0YUg0LvRjtC00LXQuScsXHJcbiAgICAgICAgICAgIGxhc3RTZW5kZXI6ICfQndC10L7QsdGL0YfQvdGL0Lkg0YfQtdC70L7QstC10LonLFxyXG4gICAgICAgICAgICBsYXN0TWVzc2FnZTogJ9Cg0LXQsdGP0YLQsCwg0Y8g0YLQvtC70YzQutC+INGH0YLQviDQtNC+0LrQsNC30LDQuyDQs9C40L/QvtGC0LXQt9GDINCg0LjQvNCw0L3QsCEg0JrQvtGA0L7Rh9C1LCDRgtCw0Lwg0LLRgdGRINC/0YDQvtGB0YLQviEnLFxyXG4gICAgICAgICAgICB0aW1lOiAnMTE6MzAnLFxyXG4gICAgICAgICAgICBtZXNzYWdlc0NvdW50OiAwLFxyXG4gICAgICAgICAgICBhdmF0YXI6ICcuL3BpY3R1cmVzLzMucG5nJyxcclxuICAgICAgICAgICAgd2lkdGg6IDIwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDQwXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlkOiAzLFxyXG4gICAgICAgICAgICBuYW1lOiAn0JHQtdGB0LXQtNCwINGBINC+0YfQtdC90Ywg0LTQu9C40L3QvdGL0Lwg0L3QsNC30LLQsNC90LjQtdC8LiDQoNC10LHRj9GC0LAsINGPINC90LUg0L/RgNC10LTRgdGC0LDQstC70Y/RjiDQutC+0LzRgyDQsiDQs9C+0LvQvtCy0YMg0L/RgNC40YjQu9C+INC00LDQstCw0YLRjCDRgtCw0LrQvtC1INC00LvQuNC90L3QvtC1INC90LDQt9Cy0LDQvdC40LUuINCg0LXQsdGP0YLQsCwg0L/RgNC10LTQu9Cw0LPQsNGOINC+0LPRgNCw0L3QuNGH0LjRgtGMINC00LvQuNC90YMg0L3QsNC30LLQsNC90LjQuScsXHJcbiAgICAgICAgICAgIGxhc3RTZW5kZXI6ICfQktC40YLQsNC70Y8nLFxyXG4gICAgICAgICAgICBsYXN0TWVzc2FnZTogJ9Cf0YDQuNCy0LXRgiwg0LPQu9GP0L3RjCDQu9GBJyxcclxuICAgICAgICAgICAgdGltZTogJzE0OjE1JyxcclxuICAgICAgICAgICAgbWVzc2FnZXNDb3VudDogMCxcclxuICAgICAgICAgICAgYXZhdGFyOiAnLi9waWN0dXJlcy80LnBuZycsXHJcbiAgICAgICAgICAgIHdpZHRoOiAxMDAwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDEwMDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWQ6IDQsXHJcbiAgICAgICAgICAgIG5hbWU6ICfQktC40YLQsNC70Y8g0KLRgNGD0LHQvtC10LQnLFxyXG4gICAgICAgICAgICBsYXN0U2VuZGVyOiAnJyxcclxuICAgICAgICAgICAgbGFzdE1lc3NhZ2U6ICfQlNCw0LLQvdC+INGH0LjRgtCw0Lsg0LHQtdGB0LXQtNGDPycsXHJcbiAgICAgICAgICAgIHRpbWU6ICcxOTo1MScsXHJcbiAgICAgICAgICAgIG1lc3NhZ2VzQ291bnQ6IDQsXHJcbiAgICAgICAgICAgIGF2YXRhcjogJy4vcGljdHVyZXMvNS5wbmcnLFxyXG4gICAgICAgICAgICB3aWR0aDogMTAwMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiA1MDBcclxuICAgICAgICB9XHJcbiAgICBdXHJcbn1cclxubGV0IGxpbmsgPSBcImh0dHBzOi8vY29tZ3JpZC5ydTo4NDQzXCI7XHJcbmNvbnN0IGh0dHBDbGllbnQgPSBuZXcgSHR0cENsaWVudChsaW5rKVxyXG5sZXQgbGVmdEJ1dHRvbkNsaWNrZWQgPSBmYWxzZTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBvbkxvYWQoKXtcclxuICAgIGxvYWRTdG9yZSgpXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgIGRyYXdEaWFsb2dzKClcclxuICAgICAgfSk7XHJcblxyXG4gICAgJCgnLmNsaWNrYWJsZScpLm9uKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAkKCcuY2xpY2thYmxlJykudG9nZ2xlQ2xhc3MoJ2Qtbm9uZScpXHJcbiAgICB9KTtcclxuICAgIGxldCBpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YWJsZS1pbWFnZS1maWxlLWlucHV0Jyk7XHJcbiAgICBpbnB1dC5vbmNoYW5nZSA9ICgpID0+IHNob3dJbWFnZShpbnB1dCk7XHJcbiAgICAkKFwiI3Nob3dlclwiKS5vbihcImRyYWdzdGFydFwiLCAoKSA9PiBmYWxzZSk7XHJcbiAgICAkKFwiI3Nob3dlci1jdXRcIikub24oXCJkcmFnc3RhcnRcIiwgKCkgPT4gZmFsc2UpO1xyXG4gICAgJChcIiNzYXZlLWNhbnZhc1wiKS5vbihcImNsaWNrXCIsIHNhdmVDYW52YXMpO1xyXG4gICAgJCgnI2NyZWF0ZS10YWJsZS1mb3JtJykub24oJ3N1Ym1pdCcsIHN1Ym1pdCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXdEaWFsb2dzKCkge1xyXG4gICAgbGV0ICRjb250YWluZXIgPSAkKCcuY2hhdC1jb250YWluZXInKTtcclxuICAgIGxldCAkbm9EZWwgPSAkY29udGFpbmVyLmZpbmQoJy5uby1kZWxldGFibGUnKTtcclxuICAgICRjb250YWluZXIuaHRtbCgnJyk7XHJcbiAgICAkY29udGFpbmVyLmFwcGVuZCgkbm9EZWwpO1xyXG4gICAgc3RvcmUuZGlhbG9ncy5zbGljZSgpLnJldmVyc2UoKS5mb3JFYWNoKChkaWFsb2csIGluZGV4KSA9PiB7XHJcbiAgICAgICAgbGV0IGRpYWxvZzIgPSBzdG9yZS5kaWFsb2dzMltpbmRleCAlIHN0b3JlLmRpYWxvZ3MyLmxlbmd0aF07XHJcbiAgICAgICAgbGV0ICRjaGF0ID0gJCgnLmNoYXQnKS5jbG9uZSgpO1xyXG4gICAgICAgICRjaGF0LnJlbW92ZUNsYXNzKCdjaGF0IGQtbm9uZScpO1xyXG4gICAgICAgICRjaGF0LmZpbmQoJ2EnKS5hdHRyKCdocmVmJywgJ3BhZ2VzL3RhYmxlP2lkPScgKyBkaWFsb2cuaWQpO1xyXG4gICAgICAgICRjaGF0LmZpbmQoJy5jaGF0LW5hbWUnKS50ZXh0KGRpYWxvZy5uYW1lKTtcclxuICAgICAgICAkY2hhdC5maW5kKCcuY2hhdC1zZW5kZXInKS50ZXh0KGRpYWxvZzIubGFzdFNlbmRlciArIChkaWFsb2cyLmxhc3RTZW5kZXIgPT09ICcnID8gJycgOiAnOicpKTtcclxuICAgICAgICAkY2hhdC5maW5kKCcuY2hhdC10ZXh0JykudGV4dChkaWFsb2cyLmxhc3RNZXNzYWdlKTtcclxuICAgICAgICAkY2hhdC5maW5kKCcuY2hhdC10aW1lJykudGV4dChkaWFsb2cyLnRpbWUpO1xyXG4gICAgICAgIGlmKGRpYWxvZy5hdmF0YXIuc3RhcnRzV2l0aChcIi9cIikpXHJcbiAgICAgICAgICAgIGRpYWxvZy5hdmF0YXIgPSBsaW5rICsgZGlhbG9nLmF2YXRhclxyXG4gICAgICAgIGxldCAkaW1nID0gJGNoYXQuZmluZCgnaW1nJyk7XHJcbiAgICAgICAgJGltZy5hdHRyKCdzcmMnLCBkaWFsb2cuYXZhdGFyKTtcclxuICAgICAgICAkaW1nWzBdLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IHdpZHRoID0gJGltZ1swXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcclxuICAgICAgICAgICAgJGltZy5oZWlnaHQod2lkdGgpO1xyXG4gICAgICAgICAgICAkaW1nLndpZHRoKHdpZHRoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgJGNoYXQuZmluZCgnLmNoYXQtc2l6ZScpLnRleHQoZGlhbG9nLndpZHRoICsgJ8OXJyArIGRpYWxvZy5oZWlnaHQpXHJcbiAgICAgICAgZGlhbG9nMi5tZXNzYWdlc0NvdW50ID09PSAwXHJcbiAgICAgICAgICAgID8gJGNoYXQuZmluZCgnLmNoYXQtdW5yZWFkJykucmVtb3ZlKClcclxuICAgICAgICAgICAgOiAkY2hhdC5maW5kKCcuY2hhdC11bnJlYWQnKS50ZXh0KGRpYWxvZzIubWVzc2FnZXNDb3VudCk7XHJcbiAgICAgICAgJGNvbnRhaW5lci5hcHBlbmQoJGNoYXQpO1xyXG4gICAgICAgICRjaGF0Lm9uKCdtb3VzZWVudGVyJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAkY2hhdC5yZW1vdmVDbGFzcygnYmctbGlnaHQnKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICRjaGF0Lm9uKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAkY2hhdC5hZGRDbGFzcygnYmctbGlnaHQnKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICRjaGF0Lm9uKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgZGlhbG9nLm1lc3NhZ2VzQ291bnQgPSAwO1xyXG4gICAgICAgICAgICBkcmF3RGlhbG9ncygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN1Ym1pdCgpIHtcclxuICAgIGNvbnN0IGF2YXRhckZpbGUgPSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RhYmxlLWltYWdlLWZpbGUtaW5wdXQnKSBhcyBIVE1MSW5wdXRFbGVtZW50KT8uZmlsZXNbMF07XHJcbiAgICBsZXQgYXZhdGFyTGluayA9ICQoJyN0YWJsZS1pbWFnZS1saW5rLWlucHV0JykudmFsKCk7XHJcbiAgICBpZihhdmF0YXJMaW5rID09PSBcIlwiICYmIGF2YXRhckZpbGUgPT09IG51bGwpe1xyXG4gICAgICAgIGFsZXJ0KFwiWW91IG11c3Qgc3BlY2lmeSBlaXRoZXIgaW1hZ2Ugb3IgbGluayB0byBpbWFnZVwiKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBsZXQgaGVpZ2h0ID0gJCgnI3RhYmxlLWhlaWdodC1pbnB1dCcpLnZhbCgpO1xyXG4gICAgbGV0IHdpZHRoID0gJCgnI3RhYmxlLXdpZHRoLWlucHV0JykudmFsKCk7XHJcbiAgICBpZigoK2hlaWdodCkgKiAoK3dpZHRoKSA+IDEwMDAwKSB7XHJcbiAgICAgICAgYWxlcnQoXCLQoNCw0LfQvNC10YAg0YLQsNCx0LvQuNGG0Ysg0L3QtSDQvNC+0LbQtdGCINC/0YDQtdCy0YvRiNCw0YLRjCAxMDAwMCDRj9GH0LXQtdC6XCIpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGlmKCtoZWlnaHQgPD0gMCB8fCArd2lkdGggPD0gMCkge1xyXG4gICAgICAgIGFsZXJ0KFwi0J3QtdC/0L7Qu9C+0LbQuNGC0LXQu9GM0L3Ri9C1INGA0LDQt9C80LXRgNGLPyDQp9GC0L7QsdGLINC+0YLQv9GA0LDQstC70Y/RgtGMINC90LXRgdGD0YnQtdGB0YLQstGD0Y7RidC40LUg0YHQvtC+0LHRidC10L3QuNGPPyDQmtGA0YPRgtC+LCDQvdC40YfQtdCz0L4g0L3QtSDRgdC60LDQttC10YjRjCwg0L3QviDQvdC10LvRjNC30Y9cIik7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgbGV0IGltYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzaG93ZXJcIikgYXMgSFRNTEltYWdlRWxlbWVudDtcclxuICAgIGNvbnNvbGUubG9nKGltYWdlLm5hdHVyYWxIZWlnaHQsIGltYWdlLm5hdHVyYWxXaWR0aCk7XHJcbiAgICBpZihpbWFnZS5uYXR1cmFsSGVpZ2h0ICE9PSBpbWFnZS5uYXR1cmFsV2lkdGgpIHtcclxuICAgICAgICBhbGVydChcItCa0LDRgNGC0LjQvdC60LAg0LTQvtC70LbQvdCwINCx0YvRgtGMINC60LLQsNC00YDQsNGC0L3QvtC5LiDQntCx0YDQtdC20YzRgtC1INC10ZEhXCIpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGNvbnN0IG5ld1RhYmxlID0gbmV3IENyZWF0ZVRhYmxlUmVxdWVzdCh7XHJcbiAgICAgICAgbmFtZTogJCgnI3RhYmxlLW5hbWUtaW5wdXQnKS52YWwoKSBhcyBzdHJpbmcsXHJcbiAgICAgICAgd2lkdGg6IHdpZHRoIGFzIG51bWJlcixcclxuICAgICAgICBoZWlnaHQ6IGhlaWdodCBhcyBudW1iZXIsXHJcbiAgICAgICAgYXZhdGFyTGluazogYXZhdGFyTGluayBhcyBzdHJpbmcsXHJcbiAgICAgICAgYXZhdGFyRmlsZTogYXZhdGFyRmlsZVxyXG4gICAgfSlcclxuXHJcbiAgICBwb3N0VGFibGUobmV3VGFibGUpXHJcbiAgICAudGhlbigodGFibGUpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyh0YWJsZSlcclxuICAgICAgICBsb2FkU3RvcmUoKS50aGVuKGRyYXdEaWFsb2dzKVxyXG4gICAgfSk7XHJcbiAgICBjbGVhck1lbnUoKTtcclxuICAgIGNsb3NlTWVudSgpO1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwb3N0VGFibGUodGFibGUpIHtcclxuICAgIHJldHVybiBodHRwQ2xpZW50LnByb2NlZWRSZXF1ZXN0KFxyXG4gICAgICAgIHRhYmxlLFxyXG4gICAgICAgIChjb2RlLCBlcnJvclRleHQpID0+IHtcclxuICAgICAgICAgICAgYWxlcnQoYEVycm9yIGhhcHBlbmVkIHdoaWxlIGNyZWF0aW5nIHRhYmxlOiAke2NvZGV9LCAke2Vycm9yVGV4dH1gKVxyXG4gICAgICAgIH1cclxuICAgIClcclxufVxyXG5cclxuZnVuY3Rpb24gY2xlYXJNZW51KCkge1xyXG4gICAgJCgnI2NsZWFyLWJ1dHRvbicpLmNsaWNrKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNsb3NlTWVudSgpIHtcclxuICAgICQoJyNjbG9zZS1idXR0b24nKS5jbGljaygpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBsb2FkU3RvcmUoKSB7XHJcbiAgICByZXR1cm4gaHR0cENsaWVudC5wcm9jZWVkUmVxdWVzdChcclxuICAgICAgICBuZXcgVXNlckluZm9SZXF1ZXN0KHsgaW5jbHVkZUNoYXRzOiB0cnVlIH0pLFxyXG4gICAgICAgIChjb2RlLCBlcnJvclRleHQpID0+IHtcclxuICAgICAgICAgICAgYWxlcnQoYEVycm9yIGhhcHBlbmVkIHdoaWxlIGxvYWRpbmcgdXNlciBpbmZvOiAke2NvZGV9LCAke2Vycm9yVGV4dH1gKVxyXG4gICAgICAgIH1cclxuICAgICkudGhlbih1c2VyID0+IHtcclxuICAgICAgICBzdG9yZS5kaWFsb2dzID0gdXNlci5jaGF0cztcclxuICAgIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNob3dJbWFnZShpbnB1dCkge1xyXG4gICAgaWYgKGlucHV0LmZpbGVzICYmIGlucHV0LmZpbGVzWzBdKSB7XHJcbiAgICAgICAgbGV0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICAgICAgbGV0IHNob3dlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaG93ZXInKSBhcyBIVE1MSW1hZ2VFbGVtZW50O1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHNob3dlci5uYXR1cmFsV2lkdGgsIHNob3dlci5uYXR1cmFsSGVpZ2h0KTtcclxuXHJcbiAgICAgICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgc2hvd2VyLmNsYXNzTGlzdC5yZW1vdmUoJ2Qtbm9uZScpO1xyXG5cclxuICAgICAgICAgICAgbGV0IG1ldGhvZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBkYXJrID0gJCgnLmRhcmstYmFja2dyb3VuZCcpO1xyXG4gICAgICAgICAgICAgICAgc2hvd2VyLndpZHRoID0gNTAwO1xyXG4gICAgICAgICAgICAgICAgc2hvd2VyLmhlaWdodCA9IHNob3dlci5uYXR1cmFsSGVpZ2h0ICogc2hvd2VyLndpZHRoIC8gc2hvd2VyLm5hdHVyYWxXaWR0aDtcclxuICAgICAgICAgICAgICAgIGRhcmsucmVtb3ZlQ2xhc3MoJ2Qtbm9uZScpO1xyXG4gICAgICAgICAgICAgICAgZGFyay53aWR0aChzaG93ZXIud2lkdGgpO1xyXG4gICAgICAgICAgICAgICAgZGFyay5oZWlnaHQoc2hvd2VyLmhlaWdodCk7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHNob3dlckN1dDogSFRNTENhbnZhc0VsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2hvd2VyLWN1dCcpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgICAgICAgICAgICAgc2hvd2VyQ3V0LmNsYXNzTGlzdC5yZW1vdmUoJ2Qtbm9uZScpO1xyXG4gICAgICAgICAgICAgICAgc2hvd2VyQ3V0LndpZHRoID0gc2hvd2VyLndpZHRoICogMiAvIDM7XHJcbiAgICAgICAgICAgICAgICBzaG93ZXJDdXQuaGVpZ2h0ID0gc2hvd2VyLndpZHRoICogMiAvIDM7XHJcbiAgICAgICAgICAgICAgICBsZXQgb2Zmc2V0ID0gc2hvd2VyLndpZHRoIC8gNjtcclxuICAgICAgICAgICAgICAgIHNob3dlckN1dC5zdHlsZS50b3AgPSBgJHtvZmZzZXR9cHhgO1xyXG4gICAgICAgICAgICAgICAgc2hvd2VyQ3V0LnN0eWxlLmxlZnQgPSBgJHtvZmZzZXR9cHhgO1xyXG5cclxuICAgICAgICAgICAgICAgIHNob3dlckN1dC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBzaG93ZXJDdXRNb3ZlKTtcclxuICAgICAgICAgICAgICAgIHNob3dlckN1dC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBzaG93ZXJDdXRNb3ZlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgY29udGV4dCA9IHNob3dlckN1dC5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5kcmF3SW1hZ2Uoc2hvd2VyLCAtb2Zmc2V0LCAtb2Zmc2V0LCBzaG93ZXIud2lkdGgsIHNob3dlci53aWR0aCk7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnRleHQuc3Ryb2tlUmVjdCgwLCAwLCBzaG93ZXIud2lkdGgsIHNob3dlci53aWR0aCk7XHJcbiAgICAgICAgICAgICAgICBzaG93ZXIuc2V0QXR0cmlidXRlKCdzcmMnLCBlLnRhcmdldC5yZXN1bHQgYXMgc3RyaW5nKTtcclxuICAgICAgICAgICAgICAgIHNob3dlci5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJywgbWV0aG9kKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkKCcjc2F2ZS1jYW52YXMnKS5yZW1vdmVDbGFzcygnZC1ub25lJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNob3dlci5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgbWV0aG9kKTtcclxuICAgICAgICAgICAgc2hvd2VyLnNldEF0dHJpYnV0ZSgnc3JjJywgZS50YXJnZXQucmVzdWx0IGFzIHN0cmluZyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoaW5wdXQuZmlsZXNbMF0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBzYXZlQ2FudmFzKCkge1xyXG4gICAgbGV0IHNob3dlckN1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaG93ZXItY3V0JykgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICBsZXQga2VlcGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Nob3dlcicpIGFzIEhUTUxJbWFnZUVsZW1lbnQ7XHJcblxyXG5cclxuICAgIHNob3dlckN1dC50b0Jsb2IoYmxvYiA9PiB7XHJcbiAgICAgICAgbGV0IGR0ID0gbmV3IERhdGFUcmFuc2ZlcigpO1xyXG4gICAgICAgIGR0Lml0ZW1zLmFkZChuZXcgRmlsZShbYmxvYl0sICdpbWFnZS5wbmcnLCB7dHlwZTogJ2ltYWdlL3BuZyd9KSk7XHJcbiAgICAgICAgbGV0IGZpbGVfbGlzdCA9IGR0LmZpbGVzO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZygn0JrQvtC70LvQtdC60YbQuNGPINGE0LDQudC70L7QsiDRgdC+0LfQtNCw0L3QsDonKTtcclxuICAgICAgICBjb25zb2xlLmRpcihmaWxlX2xpc3QpO1xyXG5cclxuICAgICAgICBsZXQgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFibGUtaW1hZ2UtZmlsZS1pbnB1dCcpIGFzIEhUTUxJbnB1dEVsZW1lbnRcclxuICAgICAgICBpbnB1dC5maWxlcyA9IGZpbGVfbGlzdDtcclxuICAgICAgICBzaG93SW1hZ2UoaW5wdXQpO1xyXG4gICAgfSlcclxufVxyXG5cclxubGV0IHNob3dlckN1dE1vdmUgPSBmdW5jdGlvbihldmVudCkge1xyXG4gICAgbGV0IHNob3dlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaG93ZXItY3V0JykgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICBsZXQga2VlcGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Nob3dlcicpIGFzIEhUTUxJbWFnZUVsZW1lbnQ7XHJcbiAgICBsZXQgYm91bmRpbmcgPSBrZWVwZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICBsZXQgc2hpZnRYID0gZXZlbnQuY2xpZW50WCAtIHNob3dlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0O1xyXG4gICAgbGV0IHNoaWZ0WSA9IGV2ZW50LmNsaWVudFkgLSBzaG93ZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wO1xyXG5cclxuICAgIHNob3dlci5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XHJcblxyXG4gICAgbW92ZUF0KGV2ZW50LnBhZ2VYLCBldmVudC5wYWdlWSk7XHJcblxyXG4gICAgZnVuY3Rpb24gbW92ZUF0KHBhZ2VYLCBwYWdlWSkge1xyXG4gICAgICAgIGxldCBsZWZ0ID0gTWF0aC5taW4oTWF0aC5tYXgocGFnZVggLSBzaGlmdFggLSBib3VuZGluZy5sZWZ0LCAwKSwgYm91bmRpbmcud2lkdGggLSBzaG93ZXIud2lkdGgpO1xyXG4gICAgICAgIGxldCB0b3AgPSBNYXRoLm1pbihNYXRoLm1heChwYWdlWSAtIHNoaWZ0WSAtIGJvdW5kaW5nLnRvcCwgMCksIGJvdW5kaW5nLmhlaWdodCAtIHNob3dlci5oZWlnaHQpO1xyXG4gICAgICAgIHNob3dlci5zdHlsZS5sZWZ0ID0gbGVmdCArICdweCc7XHJcbiAgICAgICAgc2hvd2VyLnN0eWxlLnRvcCA9IHRvcCArICdweCc7XHJcbiAgICAgICAgbGV0IGNvbnRleHQgPSBzaG93ZXIuZ2V0Q29udGV4dCgnMmQnKVxyXG4gICAgICAgIGNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIGJvdW5kaW5nLndpZHRoLCBib3VuZGluZy5oZWlnaHQpO1xyXG4gICAgICAgIGNvbnRleHQuZHJhd0ltYWdlKGtlZXBlciwgLWxlZnQsIC10b3AsIGJvdW5kaW5nLndpZHRoLCBib3VuZGluZy5oZWlnaHQpO1xyXG4gICAgICAgIC8vY29udGV4dC5zdHJva2VSZWN0KDAsIDAsIHNob3dlci53aWR0aCwgc2hvd2VyLmhlaWdodCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcmVzaXplKGluY3JlYXNlOiBib29sZWFuKSB7XHJcbiAgICAgICAgbGV0IHdpZHRoID0gTWF0aC5taW4oc2hvd2VyLndpZHRoICsgKGluY3JlYXNlID8gNiA6IC02KSwgYm91bmRpbmcud2lkdGgsIGJvdW5kaW5nLmhlaWdodCk7XHJcbiAgICAgICAgc2hvd2VyLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgc2hvd2VyLmhlaWdodCA9IHdpZHRoO1xyXG4gICAgICAgIGxldCBib3VuZGluZ0luID0gc2hvd2VyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuICAgICAgICBsZXQgbGVmdCA9IE1hdGgubWluKE1hdGgubWF4KCtzaG93ZXIuc3R5bGUubGVmdC5zbGljZSgwLC0yKSwgMCksIGJvdW5kaW5nLndpZHRoIC0gc2hvd2VyLndpZHRoKTtcclxuICAgICAgICBsZXQgdG9wID0gTWF0aC5taW4oTWF0aC5tYXgoK3Nob3dlci5zdHlsZS50b3Auc2xpY2UoMCwtMiksIDApLCBib3VuZGluZy5oZWlnaHQgLSBzaG93ZXIuaGVpZ2h0KTtcclxuICAgICAgICBzaG93ZXIuc3R5bGUubGVmdCA9IGxlZnQgKyAncHgnO1xyXG4gICAgICAgIHNob3dlci5zdHlsZS50b3AgPSB0b3AgKyAncHgnO1xyXG4gICAgICAgIGxldCBjb250ZXh0ID0gc2hvd2VyLmdldENvbnRleHQoJzJkJylcclxuICAgICAgICBjb250ZXh0LmNsZWFyUmVjdCgwLCAwLCBib3VuZGluZy53aWR0aCwgYm91bmRpbmcuaGVpZ2h0KTtcclxuICAgICAgICBjb250ZXh0LmRyYXdJbWFnZShrZWVwZXIsIC1sZWZ0LCAtdG9wLCBib3VuZGluZy53aWR0aCwgYm91bmRpbmcuaGVpZ2h0KTtcclxuICAgICAgICAvL2NvbnRleHQuc3Ryb2tlUmVjdCgwLCAwLCBzaG93ZXIud2lkdGgsIHNob3dlci5oZWlnaHQpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG9uTW91c2VNb3ZlKGV2ZW50OiBNb3VzZUV2ZW50KSB7XHJcbiAgICAgICAgaWYgKGV2ZW50LmN0cmxLZXkpIHtcclxuICAgICAgICAgICAgbGV0IG5ld1NoaWZ0WCA9IGV2ZW50LmNsaWVudFggLSBzaG93ZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdDtcclxuICAgICAgICAgICAgbGV0IG5ld1NoaWZ0WSA9IGV2ZW50LmNsaWVudFkgLSBzaG93ZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wO1xyXG4gICAgICAgICAgICBsZXQgaW5jcmVhc2UgPSAobmV3U2hpZnRYIC0gbmV3U2hpZnRZIC0gc2hpZnRYICsgc2hpZnRZKSA+IDA7XHJcbiAgICAgICAgICAgIHNoaWZ0WCA9IG5ld1NoaWZ0WDtcclxuICAgICAgICAgICAgc2hpZnRZID0gbmV3U2hpZnRZO1xyXG4gICAgICAgICAgICByZXNpemUoaW5jcmVhc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIG1vdmVBdChldmVudC5wYWdlWCwgZXZlbnQucGFnZVkpO1xyXG4gICAgfVxyXG5cclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uTW91c2VNb3ZlKTtcclxuXHJcbiAgICBzaG93ZXIub25tb3VzZXVwID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uTW91c2VNb3ZlKTtcclxuICAgICAgICBzaG93ZXIub25tb3VzZXVwID0gbnVsbDtcclxuICAgIH07XHJcbn0iLCJpbXBvcnQge1JlcXVlc3RXcmFwcGVyfSBmcm9tIFwiLi9yZXF1ZXN0L1JlcXVlc3RcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgSHR0cENsaWVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGFwaUxpbms6IHN0cmluZykge31cclxuXHJcbiAgICBhc3luYyBwcm9jZWVkUmVxdWVzdDxUPihcclxuICAgICAgICByZXF1ZXN0OiBSZXF1ZXN0V3JhcHBlcjxUPixcclxuICAgICAgICBvbkZhaWx1cmU6IChjb2RlOiBudW1iZXIsIGVycm9yVGV4dDogc3RyaW5nKSA9PiB1bmtub3duID1cclxuICAgICAgICAgICAgKGNvZGUsIGVycm9yVGV4dCkgPT4gYWxlcnQoYGNvZGU6ICR7Y29kZX0sIGVycm9yOiAke2Vycm9yVGV4dH1gKSxcclxuICAgICAgICBvbk5ldHdvcmtGYWlsdXJlOiAocmVhc29uKSA9PiB1bmtub3duID1cclxuICAgICAgICAgICAgKHJlYXNvbikgPT4gYWxlcnQoYG5ldHdvcmsgZXJyb3I6ICR7cmVhc29ufWApXHJcbiAgICApOiBQcm9taXNlPFQ+e1xyXG4gICAgICAgIGNvbnN0IGZpbmFsTGluayA9IG5ldyBVUkwodGhpcy5hcGlMaW5rICsgcmVxdWVzdC5lbmRwb2ludClcclxuICAgICAgICBpZihyZXF1ZXN0LnBhcmFtZXRlcnMgIT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICBmaW5hbExpbmsuc2VhcmNoID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhyZXF1ZXN0LnBhcmFtZXRlcnMpLnRvU3RyaW5nKClcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2cocmVxdWVzdClcclxuICAgICAgICByZXR1cm4gZmV0Y2goXHJcbiAgICAgICAgICAgIGZpbmFsTGluay50b1N0cmluZygpLFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjcmVkZW50aWFsczogXCJpbmNsdWRlXCIsXHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6IHJlcXVlc3QubWV0aG9kVHlwZSxcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHJlcXVlc3QuaGVhZGVycyxcclxuICAgICAgICAgICAgICAgIGJvZHk6IHJlcXVlc3QuYm9keVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKS50aGVuKGFzeW5jIChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICBpZihyZXNwb25zZS5zdGF0dXMgPT09IDIwMCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wcm9jZWVkUmVxdWVzdChyZXNwb25zZSlcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlcnJvclRleHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XHJcbiAgICAgICAgICAgICAgICBvbkZhaWx1cmUocmVzcG9uc2Uuc3RhdHVzLCBlcnJvclRleHQpO1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihlcnJvclRleHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGVudW0gTWV0aG9kVHlwZXtcclxuICAgIFBPU1Q9XCJQT1NUXCIsXHJcbiAgICBHRVQ9XCJHRVRcIixcclxuICAgIFBBVENIPVwiUEFUQ0hcIixcclxuICAgIFBVVD1cIlBVVFwiLFxyXG4gICAgREVMRVRFPVwiREVMRVRFXCJcclxufSIsImltcG9ydCB7TWV0aG9kVHlwZX0gZnJvbSBcIi4uL0h0dHBDbGllbnRcIjtcclxuaW1wb3J0IHtSZXF1ZXN0V3JhcHBlcn0gZnJvbSBcIi4vUmVxdWVzdFwiO1xyXG5pbXBvcnQge1VzZXJSZXNwb25zZX0gZnJvbSBcIi4vVXNlckluZm9SZXF1ZXN0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVGFibGVSZXNwb25zZSB7XHJcbiAgICByZWFkb25seSBpZCE6IG51bWJlclxyXG4gICAgcmVhZG9ubHkgbmFtZSE6IHN0cmluZ1xyXG4gICAgcmVhZG9ubHkgY3JlYXRvciE6IG51bWJlclxyXG4gICAgcmVhZG9ubHkgd2lkdGghOiBudW1iZXJcclxuICAgIHJlYWRvbmx5IGhlaWdodCE6IG51bWJlclxyXG4gICAgcmVhZG9ubHkgYXZhdGFyITogbnVtYmVyXHJcbiAgICByZWFkb25seSBjcmVhdGVkITogRGF0ZVxyXG4gICAgcmVhZG9ubHkgbGFzdE1lc3NhZ2VJZD86IG51bWJlclxyXG4gICAgcmVhZG9ubHkgcGFydGljaXBhbnRzPzogVXNlclJlc3BvbnNlW11cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENyZWF0ZVRhYmxlUmVxdWVzdCBpbXBsZW1lbnRzIFJlcXVlc3RXcmFwcGVyPFRhYmxlUmVzcG9uc2U+IHtcclxuICAgIHJlYWRvbmx5IGJvZHk/OiBGb3JtRGF0YVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKGJvZHk6IHtcclxuICAgICAgICBuYW1lOiBzdHJpbmcsXHJcbiAgICAgICAgd2lkdGg6IG51bWJlcixcclxuICAgICAgICBoZWlnaHQ6IG51bWJlcixcclxuICAgICAgICBhdmF0YXJGaWxlPzogRmlsZSxcclxuICAgICAgICBhdmF0YXJMaW5rPzogc3RyaW5nXHJcbiAgICB9KSB7XHJcbiAgICAgICAgdGhpcy5ib2R5ID0gbmV3IEZvcm1EYXRhKClcclxuICAgICAgICB0aGlzLmJvZHkuYXBwZW5kKCduYW1lJywgYm9keS5uYW1lKVxyXG4gICAgICAgIHRoaXMuYm9keS5hcHBlbmQoJ3dpZHRoJywgYm9keS53aWR0aC50b1N0cmluZygpKVxyXG4gICAgICAgIHRoaXMuYm9keS5hcHBlbmQoJ2hlaWdodCcsIGJvZHkuaGVpZ2h0LnRvU3RyaW5nKCkpXHJcbiAgICAgICAgaWYgKGJvZHkuYXZhdGFyTGluayA9PSB1bmRlZmluZWQgJiYgYm9keS5hdmF0YXJGaWxlID09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBzZW5kIHJlcXVlc3Qgd2l0aCBubyBhdmF0YXJcIilcclxuICAgICAgICBpZiAoYm9keS5hdmF0YXJGaWxlICE9IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhpcy5ib2R5LmFwcGVuZCgnYXZhdGFyRmlsZScsIGJvZHkuYXZhdGFyRmlsZSlcclxuICAgICAgICBpZiAoYm9keS5hdmF0YXJMaW5rICE9IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhpcy5ib2R5LmFwcGVuZCgnYXZhdGFyTGluaycsIGJvZHkuYXZhdGFyTGluaylcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBwcm9jZWVkUmVxdWVzdChyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPFRhYmxlUmVzcG9uc2U+IHtcclxuICAgICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpXHJcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodGV4dCkgYXMgVGFibGVSZXNwb25zZVxyXG4gICAgfVxyXG5cclxuICAgIGVuZHBvaW50OiBzdHJpbmcgPSBcIi90YWJsZS9jcmVhdGVcIjtcclxuICAgIG1ldGhvZFR5cGU6IE1ldGhvZFR5cGUgPSBNZXRob2RUeXBlLlBPU1Q7XHJcbn0iLCJpbXBvcnQge1JlcXVlc3RXcmFwcGVyfSBmcm9tIFwiLi9SZXF1ZXN0XCI7XHJcbmltcG9ydCB7VGFibGVSZXNwb25zZX0gZnJvbSBcIi4vQ3JlYXRlVGFibGVSZXF1ZXN0XCI7XHJcbmltcG9ydCB7TWV0aG9kVHlwZX0gZnJvbSBcIi4uL0h0dHBDbGllbnRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBVc2VyUmVzcG9uc2V7XHJcbiAgICByZWFkb25seSBpZCE6IHN0cmluZ1xyXG4gICAgcmVhZG9ubHkgbmFtZSE6IHN0cmluZ1xyXG4gICAgcmVhZG9ubHkgZW1haWwhOiBzdHJpbmdcclxuICAgIHJlYWRvbmx5IGF2YXRhciE6IHN0cmluZ1xyXG4gICAgcmVhZG9ubHkgY3JlYXRlZCE6IERhdGVcclxuICAgIHJlYWRvbmx5IGNoYXRzPzogVGFibGVSZXNwb25zZVtdXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBVc2VySW5mb1JlcXVlc3QgaW1wbGVtZW50cyBSZXF1ZXN0V3JhcHBlcjxVc2VyUmVzcG9uc2U+e1xyXG4gICAgcmVhZG9ubHkgcGFyYW1ldGVyczogUmVjb3JkPHN0cmluZywgc3RyaW5nPlxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBhcmFtZXRlcnM6IHsgaW5jbHVkZUNoYXRzPzogYm9vbGVhbiB9KSB7XHJcbiAgICAgICAgbGV0IHBhcmFtczogYW55ID0ge31cclxuICAgICAgICBpZihwYXJhbWV0ZXJzLmluY2x1ZGVDaGF0cylcclxuICAgICAgICAgICAgcGFyYW1zLmluY2x1ZGVDaGF0cyA9IHBhcmFtZXRlcnMuaW5jbHVkZUNoYXRzPy50b1N0cmluZygpXHJcblxyXG4gICAgICAgIHRoaXMucGFyYW1ldGVycyA9IHBhcmFtc1xyXG4gICAgfVxyXG5cclxuICAgIHJlYWRvbmx5IGVuZHBvaW50OiBzdHJpbmcgPSBcIi91c2VyL2luZm9cIjtcclxuICAgIHJlYWRvbmx5IG1ldGhvZFR5cGU6IE1ldGhvZFR5cGUgPSBNZXRob2RUeXBlLkdFVDtcclxuXHJcbiAgICBhc3luYyBwcm9jZWVkUmVxdWVzdChyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPFVzZXJSZXNwb25zZT4ge1xyXG4gICAgICAgIGNvbnN0IHRleHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XHJcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodGV4dCkgYXMgVXNlclJlc3BvbnNlO1xyXG4gICAgfVxyXG59Il19
