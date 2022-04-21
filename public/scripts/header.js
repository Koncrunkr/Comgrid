(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IsLoggedInRequest_1 = require("./util/request/IsLoggedInRequest");
var HttpClient_1 = require("./util/HttpClient");
var UserInfoRequest_1 = require("./util/request/UserInfoRequest");
var index_1 = require("./index");
var info = {
    userId: ''
};
window.onload = function () {
    var httpClient = new HttpClient_1.HttpClient("https://comgrid.ru:8443");
    httpClient.proceedRequest(new IsLoggedInRequest_1.IsLoggedInRequest(), function () {
        console.log("unauthorizated");
    }).then(function (response) {
        $('.clickable').toggleClass('d-none');
        httpClient.proceedRequest(new UserInfoRequest_1.UserInfoRequest({ includeChats: false })).then(function (response) {
            $('#id-keeper').text("id: ".concat(response.id));
            localStorage.setItem("userId", response.id);
            (0, index_1.onLoad)();
        });
    });
};
},{"./index":2,"./util/HttpClient":3,"./util/request/IsLoggedInRequest":5,"./util/request/UserInfoRequest":6}],2:[function(require,module,exports){
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
},{"./util/HttpClient":3,"./util/request/CreateTableRequest":4,"./util/request/UserInfoRequest":6}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
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
},{"../HttpClient":3}],5:[function(require,module,exports){
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
},{"../HttpClient":3}],6:[function(require,module,exports){
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
},{"../HttpClient":3}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJUU2NyaXB0L2hlYWRlclNjcmlwdC50cyIsIlRTY3JpcHQvaW5kZXgudHMiLCJUU2NyaXB0L3V0aWwvSHR0cENsaWVudC50cyIsIlRTY3JpcHQvdXRpbC9yZXF1ZXN0L0NyZWF0ZVRhYmxlUmVxdWVzdC50cyIsIlRTY3JpcHQvdXRpbC9yZXF1ZXN0L0lzTG9nZ2VkSW5SZXF1ZXN0LnRzIiwiVFNjcmlwdC91dGlsL3JlcXVlc3QvVXNlckluZm9SZXF1ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxzRUFBbUU7QUFDbkUsZ0RBQTZDO0FBQzdDLGtFQUErRDtBQUMvRCxpQ0FBaUM7QUFFakMsSUFBSSxJQUFJLEdBQUc7SUFDUCxNQUFNLEVBQUUsRUFBRTtDQUNiLENBQUE7QUFFRCxNQUFNLENBQUMsTUFBTSxHQUFHO0lBQ1osSUFBSSxVQUFVLEdBQUcsSUFBSSx1QkFBVSxDQUFDLHlCQUF5QixDQUFDLENBQUM7SUFDM0QsVUFBVSxDQUFDLGNBQWMsQ0FDckIsSUFBSSxxQ0FBaUIsRUFBRSxFQUN2QjtRQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUNsQyxDQUFDLENBQ0osQ0FBQyxJQUFJLENBQUMsVUFBQyxRQUFRO1FBQ1osQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUV0QyxVQUFVLENBQUMsY0FBYyxDQUNyQixJQUFJLGlDQUFlLENBQUMsRUFBQyxZQUFZLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FDN0MsQ0FBQyxJQUFJLENBQUMsVUFBQSxRQUFRO1lBQ1gsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFPLFFBQVEsQ0FBQyxFQUFFLENBQUUsQ0FBQyxDQUFDO1lBQzNDLFlBQVksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxFQUFFLENB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QUMzQztJQUNMLHNCQUFDO0FBQUQsQ0FsQkEsQUFrQkMsSUFBQTtBQWxCWSwwQ0FBZSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCB7SXNMb2dnZWRJblJlcXVlc3R9IGZyb20gXCIuL3V0aWwvcmVxdWVzdC9Jc0xvZ2dlZEluUmVxdWVzdFwiO1xyXG5pbXBvcnQge0h0dHBDbGllbnR9IGZyb20gXCIuL3V0aWwvSHR0cENsaWVudFwiO1xyXG5pbXBvcnQge1VzZXJJbmZvUmVxdWVzdH0gZnJvbSBcIi4vdXRpbC9yZXF1ZXN0L1VzZXJJbmZvUmVxdWVzdFwiO1xyXG5pbXBvcnQgeyBvbkxvYWQgfSBmcm9tIFwiLi9pbmRleFwiO1xyXG5cclxubGV0IGluZm8gPSB7XHJcbiAgICB1c2VySWQ6ICcnXHJcbn1cclxuXHJcbndpbmRvdy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICBsZXQgaHR0cENsaWVudCA9IG5ldyBIdHRwQ2xpZW50KFwiaHR0cHM6Ly9jb21ncmlkLnJ1Ojg0NDNcIik7XHJcbiAgICBodHRwQ2xpZW50LnByb2NlZWRSZXF1ZXN0KFxyXG4gICAgICAgIG5ldyBJc0xvZ2dlZEluUmVxdWVzdCgpLFxyXG4gICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJ1bmF1dGhvcml6YXRlZFwiKTtcclxuICAgICAgICB9XHJcbiAgICApLnRoZW4oKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgJCgnLmNsaWNrYWJsZScpLnRvZ2dsZUNsYXNzKCdkLW5vbmUnKTtcclxuXHJcbiAgICAgICAgaHR0cENsaWVudC5wcm9jZWVkUmVxdWVzdChcclxuICAgICAgICAgICAgbmV3IFVzZXJJbmZvUmVxdWVzdCh7aW5jbHVkZUNoYXRzOiBmYWxzZX0pXHJcbiAgICAgICAgKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgJCgnI2lkLWtlZXBlcicpLnRleHQoYGlkOiAke3Jlc3BvbnNlLmlkfWApO1xyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInVzZXJJZFwiLCByZXNwb25zZS5pZCk7XHJcbiAgICAgICAgICAgIG9uTG9hZCgpXHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcbn0iLCJpbXBvcnQge0h0dHBDbGllbnR9IGZyb20gXCIuL3V0aWwvSHR0cENsaWVudFwiO1xyXG5pbXBvcnQge0NyZWF0ZVRhYmxlUmVxdWVzdH0gZnJvbSBcIi4vdXRpbC9yZXF1ZXN0L0NyZWF0ZVRhYmxlUmVxdWVzdFwiO1xyXG5pbXBvcnQge1VzZXJJbmZvUmVxdWVzdH0gZnJvbSBcIi4vdXRpbC9yZXF1ZXN0L1VzZXJJbmZvUmVxdWVzdFwiO1xyXG5pbXBvcnQge0lzTG9nZ2VkSW5SZXF1ZXN0fSBmcm9tIFwiLi91dGlsL3JlcXVlc3QvSXNMb2dnZWRJblJlcXVlc3RcIjtcclxuXHJcbmxldCBzdG9yZTogYW55ID0ge1xyXG4gICAgZGlhbG9nczI6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlkOiAwLFxyXG4gICAgICAgICAgICBuYW1lOiAn0JLQuNGC0LDQu9GPINC4INC60L7QvNC/0LDQvdC40Y8nLFxyXG4gICAgICAgICAgICBsYXN0U2VuZGVyOiAn0JLQuNGC0LDQu9GPJyxcclxuICAgICAgICAgICAgbGFzdE1lc3NhZ2U6ICfQn9GA0LjQstC10YIsINC/0YDQuNGF0L7QtNC4INC/0LjRgtGMINC60YDQvtCy0YwnLFxyXG4gICAgICAgICAgICB0aW1lOiAn0LLRh9C10YDQsCcsXHJcbiAgICAgICAgICAgIG1lc3NhZ2VzQ291bnQ6IDUxLFxyXG4gICAgICAgICAgICBhdmF0YXI6ICcuL3BpY3R1cmVzLzEucG5nJyxcclxuICAgICAgICAgICAgd2lkdGg6IDEwMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiAxMjBcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWQ6IDEsXHJcbiAgICAgICAgICAgIG5hbWU6ICfQkdC10YHQtdC00LAg0L3QtSDQtNC70Y8g0LPQu9GD0L/Ri9GFJyxcclxuICAgICAgICAgICAgbGFzdFNlbmRlcjogJ9Ca0YLQvtCi0L4g0J3QtdCT0LvRg9C/0YvQuScsXHJcbiAgICAgICAgICAgIGxhc3RNZXNzYWdlOiAn0KHQutC+0LvRjNC60L4g0LHRg9C00LXRgiAyKzI/JyxcclxuICAgICAgICAgICAgdGltZTogJ9Cy0YfQtdGA0LAnLFxyXG4gICAgICAgICAgICBtZXNzYWdlc0NvdW50OiAxNyxcclxuICAgICAgICAgICAgYXZhdGFyOiAnLi9waWN0dXJlcy8yLnBuZycsXHJcbiAgICAgICAgICAgIHdpZHRoOiAxMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiAxMTJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWQ6IDIsXHJcbiAgICAgICAgICAgIG5hbWU6ICfQkdC10YHQtdC00LAg0LTQu9GPINGA0LDQt9C90YvRhSDQu9GO0LTQtdC5JyxcclxuICAgICAgICAgICAgbGFzdFNlbmRlcjogJ9Cd0LXQvtCx0YvRh9C90YvQuSDRh9C10LvQvtCy0LXQuicsXHJcbiAgICAgICAgICAgIGxhc3RNZXNzYWdlOiAn0KDQtdCx0Y/RgtCwLCDRjyDRgtC+0LvRjNC60L4g0YfRgtC+INC00L7QutCw0LfQsNC7INCz0LjQv9C+0YLQtdC30YMg0KDQuNC80LDQvdCwISDQmtC+0YDQvtGH0LUsINGC0LDQvCDQstGB0ZEg0L/RgNC+0YHRgtC+IScsXHJcbiAgICAgICAgICAgIHRpbWU6ICcxMTozMCcsXHJcbiAgICAgICAgICAgIG1lc3NhZ2VzQ291bnQ6IDAsXHJcbiAgICAgICAgICAgIGF2YXRhcjogJy4vcGljdHVyZXMvMy5wbmcnLFxyXG4gICAgICAgICAgICB3aWR0aDogMjAsXHJcbiAgICAgICAgICAgIGhlaWdodDogNDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWQ6IDMsXHJcbiAgICAgICAgICAgIG5hbWU6ICfQkdC10YHQtdC00LAg0YEg0L7Rh9C10L3RjCDQtNC70LjQvdC90YvQvCDQvdCw0LfQstCw0L3QuNC10LwuINCg0LXQsdGP0YLQsCwg0Y8g0L3QtSDQv9GA0LXQtNGB0YLQsNCy0LvRj9GOINC60L7QvNGDINCyINCz0L7Qu9C+0LLRgyDQv9GA0LjRiNC70L4g0LTQsNCy0LDRgtGMINGC0LDQutC+0LUg0LTQu9C40L3QvdC+0LUg0L3QsNC30LLQsNC90LjQtS4g0KDQtdCx0Y/RgtCwLCDQv9GA0LXQtNC70LDQs9Cw0Y4g0L7Qs9GA0LDQvdC40YfQuNGC0Ywg0LTQu9C40L3RgyDQvdCw0LfQstCw0L3QuNC5JyxcclxuICAgICAgICAgICAgbGFzdFNlbmRlcjogJ9CS0LjRgtCw0LvRjycsXHJcbiAgICAgICAgICAgIGxhc3RNZXNzYWdlOiAn0J/RgNC40LLQtdGCLCDQs9C70Y/QvdGMINC70YEnLFxyXG4gICAgICAgICAgICB0aW1lOiAnMTQ6MTUnLFxyXG4gICAgICAgICAgICBtZXNzYWdlc0NvdW50OiAwLFxyXG4gICAgICAgICAgICBhdmF0YXI6ICcuL3BpY3R1cmVzLzQucG5nJyxcclxuICAgICAgICAgICAgd2lkdGg6IDEwMDAsXHJcbiAgICAgICAgICAgIGhlaWdodDogMTAwMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZDogNCxcclxuICAgICAgICAgICAgbmFtZTogJ9CS0LjRgtCw0LvRjyDQotGA0YPQsdC+0LXQtCcsXHJcbiAgICAgICAgICAgIGxhc3RTZW5kZXI6ICcnLFxyXG4gICAgICAgICAgICBsYXN0TWVzc2FnZTogJ9CU0LDQstC90L4g0YfQuNGC0LDQuyDQsdC10YHQtdC00YM/JyxcclxuICAgICAgICAgICAgdGltZTogJzE5OjUxJyxcclxuICAgICAgICAgICAgbWVzc2FnZXNDb3VudDogNCxcclxuICAgICAgICAgICAgYXZhdGFyOiAnLi9waWN0dXJlcy81LnBuZycsXHJcbiAgICAgICAgICAgIHdpZHRoOiAxMDAwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDUwMFxyXG4gICAgICAgIH1cclxuICAgIF1cclxufVxyXG5sZXQgbGluayA9IFwiaHR0cHM6Ly9jb21ncmlkLnJ1Ojg0NDNcIjtcclxuY29uc3QgaHR0cENsaWVudCA9IG5ldyBIdHRwQ2xpZW50KGxpbmspXHJcbmxldCBsZWZ0QnV0dG9uQ2xpY2tlZCA9IGZhbHNlO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG9uTG9hZCgpe1xyXG4gICAgbG9hZFN0b3JlKClcclxuICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgZHJhd0RpYWxvZ3MoKVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAkKCcuY2xpY2thYmxlJykub24oJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICQoJy5jbGlja2FibGUnKS50b2dnbGVDbGFzcygnZC1ub25lJylcclxuICAgIH0pO1xyXG4gICAgbGV0IGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RhYmxlLWltYWdlLWZpbGUtaW5wdXQnKTtcclxuICAgIGlucHV0Lm9uY2hhbmdlID0gKCkgPT4gc2hvd0ltYWdlKGlucHV0KTtcclxuICAgICQoXCIjc2hvd2VyXCIpLm9uKFwiZHJhZ3N0YXJ0XCIsICgpID0+IGZhbHNlKTtcclxuICAgICQoXCIjc2hvd2VyLWN1dFwiKS5vbihcImRyYWdzdGFydFwiLCAoKSA9PiBmYWxzZSk7XHJcbiAgICAkKFwiI3NhdmUtY2FudmFzXCIpLm9uKFwiY2xpY2tcIiwgc2F2ZUNhbnZhcyk7XHJcbiAgICAkKCcjY3JlYXRlLXRhYmxlLWZvcm0nKS5vbignc3VibWl0Jywgc3VibWl0KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZHJhd0RpYWxvZ3MoKSB7XHJcbiAgICBsZXQgJGNvbnRhaW5lciA9ICQoJy5jaGF0LWNvbnRhaW5lcicpO1xyXG4gICAgbGV0ICRub0RlbCA9ICRjb250YWluZXIuZmluZCgnLm5vLWRlbGV0YWJsZScpO1xyXG4gICAgJGNvbnRhaW5lci5odG1sKCcnKTtcclxuICAgICRjb250YWluZXIuYXBwZW5kKCRub0RlbCk7XHJcbiAgICBzdG9yZS5kaWFsb2dzLnNsaWNlKCkucmV2ZXJzZSgpLmZvckVhY2goKGRpYWxvZywgaW5kZXgpID0+IHtcclxuICAgICAgICBsZXQgZGlhbG9nMiA9IHN0b3JlLmRpYWxvZ3MyW2luZGV4ICUgc3RvcmUuZGlhbG9nczIubGVuZ3RoXTtcclxuICAgICAgICBsZXQgJGNoYXQgPSAkKCcuY2hhdCcpLmNsb25lKCk7XHJcbiAgICAgICAgJGNoYXQucmVtb3ZlQ2xhc3MoJ2NoYXQgZC1ub25lJyk7XHJcbiAgICAgICAgJGNoYXQuZmluZCgnYScpLmF0dHIoJ2hyZWYnLCAncGFnZXMvdGFibGU/aWQ9JyArIGRpYWxvZy5pZCk7XHJcbiAgICAgICAgJGNoYXQuZmluZCgnLmNoYXQtbmFtZScpLnRleHQoZGlhbG9nLm5hbWUpO1xyXG4gICAgICAgICRjaGF0LmZpbmQoJy5jaGF0LXNlbmRlcicpLnRleHQoZGlhbG9nMi5sYXN0U2VuZGVyICsgKGRpYWxvZzIubGFzdFNlbmRlciA9PT0gJycgPyAnJyA6ICc6JykpO1xyXG4gICAgICAgICRjaGF0LmZpbmQoJy5jaGF0LXRleHQnKS50ZXh0KGRpYWxvZzIubGFzdE1lc3NhZ2UpO1xyXG4gICAgICAgICRjaGF0LmZpbmQoJy5jaGF0LXRpbWUnKS50ZXh0KGRpYWxvZzIudGltZSk7XHJcbiAgICAgICAgaWYoZGlhbG9nLmF2YXRhci5zdGFydHNXaXRoKFwiL1wiKSlcclxuICAgICAgICAgICAgZGlhbG9nLmF2YXRhciA9IGxpbmsgKyBkaWFsb2cuYXZhdGFyXHJcbiAgICAgICAgbGV0ICRpbWcgPSAkY2hhdC5maW5kKCdpbWcnKTtcclxuICAgICAgICAkaW1nLmF0dHIoJ3NyYycsIGRpYWxvZy5hdmF0YXIpO1xyXG4gICAgICAgICRpbWdbMF0ub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgd2lkdGggPSAkaW1nWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xyXG4gICAgICAgICAgICAkaW1nLmhlaWdodCh3aWR0aCk7XHJcbiAgICAgICAgICAgICRpbWcud2lkdGgod2lkdGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAkY2hhdC5maW5kKCcuY2hhdC1zaXplJykudGV4dChkaWFsb2cud2lkdGggKyAnw5cnICsgZGlhbG9nLmhlaWdodClcclxuICAgICAgICBkaWFsb2cyLm1lc3NhZ2VzQ291bnQgPT09IDBcclxuICAgICAgICAgICAgPyAkY2hhdC5maW5kKCcuY2hhdC11bnJlYWQnKS5yZW1vdmUoKVxyXG4gICAgICAgICAgICA6ICRjaGF0LmZpbmQoJy5jaGF0LXVucmVhZCcpLnRleHQoZGlhbG9nMi5tZXNzYWdlc0NvdW50KTtcclxuICAgICAgICAkY29udGFpbmVyLmFwcGVuZCgkY2hhdCk7XHJcbiAgICAgICAgJGNoYXQub24oJ21vdXNlZW50ZXInLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICRjaGF0LnJlbW92ZUNsYXNzKCdiZy1saWdodCcpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJGNoYXQub24oJ21vdXNlbGVhdmUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICRjaGF0LmFkZENsYXNzKCdiZy1saWdodCcpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJGNoYXQub24oJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBkaWFsb2cubWVzc2FnZXNDb3VudCA9IDA7XHJcbiAgICAgICAgICAgIGRyYXdEaWFsb2dzKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gc3VibWl0KCkge1xyXG4gICAgY29uc3QgYXZhdGFyRmlsZSA9IChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFibGUtaW1hZ2UtZmlsZS1pbnB1dCcpIGFzIEhUTUxJbnB1dEVsZW1lbnQpPy5maWxlc1swXTtcclxuICAgIGxldCBhdmF0YXJMaW5rID0gJCgnI3RhYmxlLWltYWdlLWxpbmstaW5wdXQnKS52YWwoKTtcclxuICAgIGlmKGF2YXRhckxpbmsgPT09IFwiXCIgJiYgYXZhdGFyRmlsZSA9PT0gbnVsbCl7XHJcbiAgICAgICAgYWxlcnQoXCJZb3UgbXVzdCBzcGVjaWZ5IGVpdGhlciBpbWFnZSBvciBsaW5rIHRvIGltYWdlXCIpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGxldCBoZWlnaHQgPSAkKCcjdGFibGUtaGVpZ2h0LWlucHV0JykudmFsKCk7XHJcbiAgICBsZXQgd2lkdGggPSAkKCcjdGFibGUtd2lkdGgtaW5wdXQnKS52YWwoKTtcclxuICAgIGlmKCgraGVpZ2h0KSAqICgrd2lkdGgpID4gMTAwMDApIHtcclxuICAgICAgICBhbGVydChcItCg0LDQt9C80LXRgCDRgtCw0LHQu9C40YbRiyDQvdC1INC80L7QttC10YIg0L/RgNC10LLRi9GI0LDRgtGMIDEwMDAwINGP0YfQtdC10LpcIik7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgaWYoK2hlaWdodCA8PSAwIHx8ICt3aWR0aCA8PSAwKSB7XHJcbiAgICAgICAgYWxlcnQoXCLQndC10L/QvtC70L7QttC40YLQtdC70YzQvdGL0LUg0YDQsNC30LzQtdGA0Ys/INCn0YLQvtCx0Ysg0L7RgtC/0YDQsNCy0LvRj9GC0Ywg0L3QtdGB0YPRidC10YHRgtCy0YPRjtGJ0LjQtSDRgdC+0L7QsdGJ0LXQvdC40Y8/INCa0YDRg9GC0L4sINC90LjRh9C10LPQviDQvdC1INGB0LrQsNC20LXRiNGMLCDQvdC+INC90LXQu9GM0LfRj1wiKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBsZXQgaW1hZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNob3dlclwiKSBhcyBIVE1MSW1hZ2VFbGVtZW50O1xyXG4gICAgY29uc29sZS5sb2coaW1hZ2UubmF0dXJhbEhlaWdodCwgaW1hZ2UubmF0dXJhbFdpZHRoKTtcclxuICAgIGlmKGltYWdlLm5hdHVyYWxIZWlnaHQgIT09IGltYWdlLm5hdHVyYWxXaWR0aCkge1xyXG4gICAgICAgIGFsZXJ0KFwi0JrQsNGA0YLQuNC90LrQsCDQtNC+0LvQttC90LAg0LHRi9GC0Ywg0LrQstCw0LTRgNCw0YLQvdC+0LkuINCe0LHRgNC10LbRjNGC0LUg0LXRkSFcIik7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgY29uc3QgbmV3VGFibGUgPSBuZXcgQ3JlYXRlVGFibGVSZXF1ZXN0KHtcclxuICAgICAgICBuYW1lOiAkKCcjdGFibGUtbmFtZS1pbnB1dCcpLnZhbCgpIGFzIHN0cmluZyxcclxuICAgICAgICB3aWR0aDogd2lkdGggYXMgbnVtYmVyLFxyXG4gICAgICAgIGhlaWdodDogaGVpZ2h0IGFzIG51bWJlcixcclxuICAgICAgICBhdmF0YXJMaW5rOiBhdmF0YXJMaW5rIGFzIHN0cmluZyxcclxuICAgICAgICBhdmF0YXJGaWxlOiBhdmF0YXJGaWxlXHJcbiAgICB9KVxyXG5cclxuICAgIHBvc3RUYWJsZShuZXdUYWJsZSlcclxuICAgIC50aGVuKCh0YWJsZSkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRhYmxlKVxyXG4gICAgICAgIGxvYWRTdG9yZSgpLnRoZW4oZHJhd0RpYWxvZ3MpXHJcbiAgICB9KTtcclxuICAgIGNsZWFyTWVudSgpO1xyXG4gICAgY2xvc2VNZW51KCk7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBvc3RUYWJsZSh0YWJsZSkge1xyXG4gICAgcmV0dXJuIGh0dHBDbGllbnQucHJvY2VlZFJlcXVlc3QoXHJcbiAgICAgICAgdGFibGUsXHJcbiAgICAgICAgKGNvZGUsIGVycm9yVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBhbGVydChgRXJyb3IgaGFwcGVuZWQgd2hpbGUgY3JlYXRpbmcgdGFibGU6ICR7Y29kZX0sICR7ZXJyb3JUZXh0fWApXHJcbiAgICAgICAgfVxyXG4gICAgKVxyXG59XHJcblxyXG5mdW5jdGlvbiBjbGVhck1lbnUoKSB7XHJcbiAgICAkKCcjY2xlYXItYnV0dG9uJykuY2xpY2soKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2xvc2VNZW51KCkge1xyXG4gICAgJCgnI2Nsb3NlLWJ1dHRvbicpLmNsaWNrKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvYWRTdG9yZSgpIHtcclxuICAgIHJldHVybiBodHRwQ2xpZW50LnByb2NlZWRSZXF1ZXN0KFxyXG4gICAgICAgIG5ldyBVc2VySW5mb1JlcXVlc3QoeyBpbmNsdWRlQ2hhdHM6IHRydWUgfSksXHJcbiAgICAgICAgKGNvZGUsIGVycm9yVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBhbGVydChgRXJyb3IgaGFwcGVuZWQgd2hpbGUgbG9hZGluZyB1c2VyIGluZm86ICR7Y29kZX0sICR7ZXJyb3JUZXh0fWApXHJcbiAgICAgICAgfVxyXG4gICAgKS50aGVuKHVzZXIgPT4ge1xyXG4gICAgICAgIHN0b3JlLmRpYWxvZ3MgPSB1c2VyLmNoYXRzO1xyXG4gICAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gc2hvd0ltYWdlKGlucHV0KSB7XHJcbiAgICBpZiAoaW5wdXQuZmlsZXMgJiYgaW5wdXQuZmlsZXNbMF0pIHtcclxuICAgICAgICBsZXQgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuICAgICAgICBsZXQgc2hvd2VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Nob3dlcicpIGFzIEhUTUxJbWFnZUVsZW1lbnQ7XHJcbiAgICAgICAgY29uc29sZS5sb2coc2hvd2VyLm5hdHVyYWxXaWR0aCwgc2hvd2VyLm5hdHVyYWxIZWlnaHQpO1xyXG5cclxuICAgICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBzaG93ZXIuY2xhc3NMaXN0LnJlbW92ZSgnZC1ub25lJyk7XHJcblxyXG4gICAgICAgICAgICBsZXQgbWV0aG9kID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGRhcmsgPSAkKCcuZGFyay1iYWNrZ3JvdW5kJyk7XHJcbiAgICAgICAgICAgICAgICBzaG93ZXIud2lkdGggPSA1MDA7XHJcbiAgICAgICAgICAgICAgICBzaG93ZXIuaGVpZ2h0ID0gc2hvd2VyLm5hdHVyYWxIZWlnaHQgKiBzaG93ZXIud2lkdGggLyBzaG93ZXIubmF0dXJhbFdpZHRoO1xyXG4gICAgICAgICAgICAgICAgZGFyay5yZW1vdmVDbGFzcygnZC1ub25lJyk7XHJcbiAgICAgICAgICAgICAgICBkYXJrLndpZHRoKHNob3dlci53aWR0aCk7XHJcbiAgICAgICAgICAgICAgICBkYXJrLmhlaWdodChzaG93ZXIuaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgc2hvd2VyQ3V0OiBIVE1MQ2FudmFzRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaG93ZXItY3V0JykgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICBzaG93ZXJDdXQuY2xhc3NMaXN0LnJlbW92ZSgnZC1ub25lJyk7XHJcbiAgICAgICAgICAgICAgICBzaG93ZXJDdXQud2lkdGggPSBzaG93ZXIud2lkdGggKiAyIC8gMztcclxuICAgICAgICAgICAgICAgIHNob3dlckN1dC5oZWlnaHQgPSBzaG93ZXIud2lkdGggKiAyIC8gMztcclxuICAgICAgICAgICAgICAgIGxldCBvZmZzZXQgPSBzaG93ZXIud2lkdGggLyA2O1xyXG4gICAgICAgICAgICAgICAgc2hvd2VyQ3V0LnN0eWxlLnRvcCA9IGAke29mZnNldH1weGA7XHJcbiAgICAgICAgICAgICAgICBzaG93ZXJDdXQuc3R5bGUubGVmdCA9IGAke29mZnNldH1weGA7XHJcblxyXG4gICAgICAgICAgICAgICAgc2hvd2VyQ3V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHNob3dlckN1dE1vdmUpO1xyXG4gICAgICAgICAgICAgICAgc2hvd2VyQ3V0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHNob3dlckN1dE1vdmUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBjb250ZXh0ID0gc2hvd2VyQ3V0LmdldENvbnRleHQoJzJkJyk7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmRyYXdJbWFnZShzaG93ZXIsIC1vZmZzZXQsIC1vZmZzZXQsIHNob3dlci53aWR0aCwgc2hvd2VyLndpZHRoKTtcclxuICAgICAgICAgICAgICAgIC8vY29udGV4dC5zdHJva2VSZWN0KDAsIDAsIHNob3dlci53aWR0aCwgc2hvd2VyLndpZHRoKTtcclxuICAgICAgICAgICAgICAgIHNob3dlci5zZXRBdHRyaWJ1dGUoJ3NyYycsIGUudGFyZ2V0LnJlc3VsdCBhcyBzdHJpbmcpO1xyXG4gICAgICAgICAgICAgICAgc2hvd2VyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBtZXRob2QpO1xyXG5cclxuICAgICAgICAgICAgICAgICQoJyNzYXZlLWNhbnZhcycpLnJlbW92ZUNsYXNzKCdkLW5vbmUnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2hvd2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBtZXRob2QpO1xyXG4gICAgICAgICAgICBzaG93ZXIuc2V0QXR0cmlidXRlKCdzcmMnLCBlLnRhcmdldC5yZXN1bHQgYXMgc3RyaW5nKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZWFkZXIucmVhZEFzRGF0YVVSTChpbnB1dC5maWxlc1swXSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNhdmVDYW52YXMoKSB7XHJcbiAgICBsZXQgc2hvd2VyQ3V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Nob3dlci1jdXQnKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgIGxldCBrZWVwZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2hvd2VyJykgYXMgSFRNTEltYWdlRWxlbWVudDtcclxuXHJcblxyXG4gICAgc2hvd2VyQ3V0LnRvQmxvYihibG9iID0+IHtcclxuICAgICAgICBsZXQgZHQgPSBuZXcgRGF0YVRyYW5zZmVyKCk7XHJcbiAgICAgICAgZHQuaXRlbXMuYWRkKG5ldyBGaWxlKFtibG9iXSwgJ2ltYWdlLnBuZycsIHt0eXBlOiAnaW1hZ2UvcG5nJ30pKTtcclxuICAgICAgICBsZXQgZmlsZV9saXN0ID0gZHQuZmlsZXM7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKCfQmtC+0LvQu9C10LrRhtC40Y8g0YTQsNC50LvQvtCyINGB0L7Qt9C00LDQvdCwOicpO1xyXG4gICAgICAgIGNvbnNvbGUuZGlyKGZpbGVfbGlzdCk7XHJcblxyXG4gICAgICAgIGxldCBpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YWJsZS1pbWFnZS1maWxlLWlucHV0JykgYXMgSFRNTElucHV0RWxlbWVudFxyXG4gICAgICAgIGlucHV0LmZpbGVzID0gZmlsZV9saXN0O1xyXG4gICAgICAgIHNob3dJbWFnZShpbnB1dCk7XHJcbiAgICB9KVxyXG59XHJcblxyXG5sZXQgc2hvd2VyQ3V0TW92ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICBsZXQgc2hvd2VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Nob3dlci1jdXQnKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgIGxldCBrZWVwZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2hvd2VyJykgYXMgSFRNTEltYWdlRWxlbWVudDtcclxuICAgIGxldCBib3VuZGluZyA9IGtlZXBlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgIGxldCBzaGlmdFggPSBldmVudC5jbGllbnRYIC0gc2hvd2VyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQ7XHJcbiAgICBsZXQgc2hpZnRZID0gZXZlbnQuY2xpZW50WSAtIHNob3dlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3A7XHJcblxyXG4gICAgc2hvd2VyLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcclxuXHJcbiAgICBtb3ZlQXQoZXZlbnQucGFnZVgsIGV2ZW50LnBhZ2VZKTtcclxuXHJcbiAgICBmdW5jdGlvbiBtb3ZlQXQocGFnZVgsIHBhZ2VZKSB7XHJcbiAgICAgICAgbGV0IGxlZnQgPSBNYXRoLm1pbihNYXRoLm1heChwYWdlWCAtIHNoaWZ0WCAtIGJvdW5kaW5nLmxlZnQsIDApLCBib3VuZGluZy53aWR0aCAtIHNob3dlci53aWR0aCk7XHJcbiAgICAgICAgbGV0IHRvcCA9IE1hdGgubWluKE1hdGgubWF4KHBhZ2VZIC0gc2hpZnRZIC0gYm91bmRpbmcudG9wLCAwKSwgYm91bmRpbmcuaGVpZ2h0IC0gc2hvd2VyLmhlaWdodCk7XHJcbiAgICAgICAgc2hvd2VyLnN0eWxlLmxlZnQgPSBsZWZ0ICsgJ3B4JztcclxuICAgICAgICBzaG93ZXIuc3R5bGUudG9wID0gdG9wICsgJ3B4JztcclxuICAgICAgICBsZXQgY29udGV4dCA9IHNob3dlci5nZXRDb250ZXh0KCcyZCcpXHJcbiAgICAgICAgY29udGV4dC5jbGVhclJlY3QoMCwgMCwgYm91bmRpbmcud2lkdGgsIGJvdW5kaW5nLmhlaWdodCk7XHJcbiAgICAgICAgY29udGV4dC5kcmF3SW1hZ2Uoa2VlcGVyLCAtbGVmdCwgLXRvcCwgYm91bmRpbmcud2lkdGgsIGJvdW5kaW5nLmhlaWdodCk7XHJcbiAgICAgICAgLy9jb250ZXh0LnN0cm9rZVJlY3QoMCwgMCwgc2hvd2VyLndpZHRoLCBzaG93ZXIuaGVpZ2h0KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByZXNpemUoaW5jcmVhc2U6IGJvb2xlYW4pIHtcclxuICAgICAgICBsZXQgd2lkdGggPSBNYXRoLm1pbihzaG93ZXIud2lkdGggKyAoaW5jcmVhc2UgPyA2IDogLTYpLCBib3VuZGluZy53aWR0aCwgYm91bmRpbmcuaGVpZ2h0KTtcclxuICAgICAgICBzaG93ZXIud2lkdGggPSB3aWR0aDtcclxuICAgICAgICBzaG93ZXIuaGVpZ2h0ID0gd2lkdGg7XHJcbiAgICAgICAgbGV0IGJvdW5kaW5nSW4gPSBzaG93ZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG4gICAgICAgIGxldCBsZWZ0ID0gTWF0aC5taW4oTWF0aC5tYXgoK3Nob3dlci5zdHlsZS5sZWZ0LnNsaWNlKDAsLTIpLCAwKSwgYm91bmRpbmcud2lkdGggLSBzaG93ZXIud2lkdGgpO1xyXG4gICAgICAgIGxldCB0b3AgPSBNYXRoLm1pbihNYXRoLm1heCgrc2hvd2VyLnN0eWxlLnRvcC5zbGljZSgwLC0yKSwgMCksIGJvdW5kaW5nLmhlaWdodCAtIHNob3dlci5oZWlnaHQpO1xyXG4gICAgICAgIHNob3dlci5zdHlsZS5sZWZ0ID0gbGVmdCArICdweCc7XHJcbiAgICAgICAgc2hvd2VyLnN0eWxlLnRvcCA9IHRvcCArICdweCc7XHJcbiAgICAgICAgbGV0IGNvbnRleHQgPSBzaG93ZXIuZ2V0Q29udGV4dCgnMmQnKVxyXG4gICAgICAgIGNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIGJvdW5kaW5nLndpZHRoLCBib3VuZGluZy5oZWlnaHQpO1xyXG4gICAgICAgIGNvbnRleHQuZHJhd0ltYWdlKGtlZXBlciwgLWxlZnQsIC10b3AsIGJvdW5kaW5nLndpZHRoLCBib3VuZGluZy5oZWlnaHQpO1xyXG4gICAgICAgIC8vY29udGV4dC5zdHJva2VSZWN0KDAsIDAsIHNob3dlci53aWR0aCwgc2hvd2VyLmhlaWdodCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gb25Nb3VzZU1vdmUoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcclxuICAgICAgICBpZiAoZXZlbnQuY3RybEtleSkge1xyXG4gICAgICAgICAgICBsZXQgbmV3U2hpZnRYID0gZXZlbnQuY2xpZW50WCAtIHNob3dlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0O1xyXG4gICAgICAgICAgICBsZXQgbmV3U2hpZnRZID0gZXZlbnQuY2xpZW50WSAtIHNob3dlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3A7XHJcbiAgICAgICAgICAgIGxldCBpbmNyZWFzZSA9IChuZXdTaGlmdFggLSBuZXdTaGlmdFkgLSBzaGlmdFggKyBzaGlmdFkpID4gMDtcclxuICAgICAgICAgICAgc2hpZnRYID0gbmV3U2hpZnRYO1xyXG4gICAgICAgICAgICBzaGlmdFkgPSBuZXdTaGlmdFk7XHJcbiAgICAgICAgICAgIHJlc2l6ZShpbmNyZWFzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgbW92ZUF0KGV2ZW50LnBhZ2VYLCBldmVudC5wYWdlWSk7XHJcbiAgICB9XHJcblxyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Nb3VzZU1vdmUpO1xyXG5cclxuICAgIHNob3dlci5vbm1vdXNldXAgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Nb3VzZU1vdmUpO1xyXG4gICAgICAgIHNob3dlci5vbm1vdXNldXAgPSBudWxsO1xyXG4gICAgfTtcclxufSIsImltcG9ydCB7UmVxdWVzdFdyYXBwZXJ9IGZyb20gXCIuL3JlcXVlc3QvUmVxdWVzdFwiO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBIdHRwQ2xpZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgYXBpTGluazogc3RyaW5nKSB7fVxyXG5cclxuICAgIGFzeW5jIHByb2NlZWRSZXF1ZXN0PFQ+KFxyXG4gICAgICAgIHJlcXVlc3Q6IFJlcXVlc3RXcmFwcGVyPFQ+LFxyXG4gICAgICAgIG9uRmFpbHVyZTogKGNvZGU6IG51bWJlciwgZXJyb3JUZXh0OiBzdHJpbmcpID0+IHVua25vd24gPVxyXG4gICAgICAgICAgICAoY29kZSwgZXJyb3JUZXh0KSA9PiBhbGVydChgY29kZTogJHtjb2RlfSwgZXJyb3I6ICR7ZXJyb3JUZXh0fWApLFxyXG4gICAgICAgIG9uTmV0d29ya0ZhaWx1cmU6IChyZWFzb24pID0+IHVua25vd24gPVxyXG4gICAgICAgICAgICAocmVhc29uKSA9PiBhbGVydChgbmV0d29yayBlcnJvcjogJHtyZWFzb259YClcclxuICAgICk6IFByb21pc2U8VD57XHJcbiAgICAgICAgY29uc3QgZmluYWxMaW5rID0gbmV3IFVSTCh0aGlzLmFwaUxpbmsgKyByZXF1ZXN0LmVuZHBvaW50KVxyXG4gICAgICAgIGlmKHJlcXVlc3QucGFyYW1ldGVycyAhPSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIGZpbmFsTGluay5zZWFyY2ggPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHJlcXVlc3QucGFyYW1ldGVycykudG9TdHJpbmcoKVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhyZXF1ZXN0KVxyXG4gICAgICAgIHJldHVybiBmZXRjaChcclxuICAgICAgICAgICAgZmluYWxMaW5rLnRvU3RyaW5nKCksXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcImluY2x1ZGVcIixcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogcmVxdWVzdC5tZXRob2RUeXBlLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyczogcmVxdWVzdC5oZWFkZXJzLFxyXG4gICAgICAgICAgICAgICAgYm9keTogcmVxdWVzdC5ib2R5XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApLnRoZW4oYXN5bmMgKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnByb2NlZWRSZXF1ZXN0KHJlc3BvbnNlKVxyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yVGV4dCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcclxuICAgICAgICAgICAgICAgIG9uRmFpbHVyZShyZXNwb25zZS5zdGF0dXMsIGVycm9yVGV4dCk7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGVycm9yVGV4dCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZW51bSBNZXRob2RUeXBle1xyXG4gICAgUE9TVD1cIlBPU1RcIixcclxuICAgIEdFVD1cIkdFVFwiLFxyXG4gICAgUEFUQ0g9XCJQQVRDSFwiLFxyXG4gICAgUFVUPVwiUFVUXCIsXHJcbiAgICBERUxFVEU9XCJERUxFVEVcIlxyXG59IiwiaW1wb3J0IHtNZXRob2RUeXBlfSBmcm9tIFwiLi4vSHR0cENsaWVudFwiO1xyXG5pbXBvcnQge1JlcXVlc3RXcmFwcGVyfSBmcm9tIFwiLi9SZXF1ZXN0XCI7XHJcbmltcG9ydCB7VXNlclJlc3BvbnNlfSBmcm9tIFwiLi9Vc2VySW5mb1JlcXVlc3RcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUYWJsZVJlc3BvbnNlIHtcclxuICAgIHJlYWRvbmx5IGlkITogbnVtYmVyXHJcbiAgICByZWFkb25seSBuYW1lITogc3RyaW5nXHJcbiAgICByZWFkb25seSBjcmVhdG9yITogbnVtYmVyXHJcbiAgICByZWFkb25seSB3aWR0aCE6IG51bWJlclxyXG4gICAgcmVhZG9ubHkgaGVpZ2h0ITogbnVtYmVyXHJcbiAgICByZWFkb25seSBhdmF0YXIhOiBudW1iZXJcclxuICAgIHJlYWRvbmx5IGNyZWF0ZWQhOiBEYXRlXHJcbiAgICByZWFkb25seSBsYXN0TWVzc2FnZUlkPzogbnVtYmVyXHJcbiAgICByZWFkb25seSBwYXJ0aWNpcGFudHM/OiBVc2VyUmVzcG9uc2VbXVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ3JlYXRlVGFibGVSZXF1ZXN0IGltcGxlbWVudHMgUmVxdWVzdFdyYXBwZXI8VGFibGVSZXNwb25zZT4ge1xyXG4gICAgcmVhZG9ubHkgYm9keT86IEZvcm1EYXRhXHJcblxyXG4gICAgY29uc3RydWN0b3IoYm9keToge1xyXG4gICAgICAgIG5hbWU6IHN0cmluZyxcclxuICAgICAgICB3aWR0aDogbnVtYmVyLFxyXG4gICAgICAgIGhlaWdodDogbnVtYmVyLFxyXG4gICAgICAgIGF2YXRhckZpbGU/OiBGaWxlLFxyXG4gICAgICAgIGF2YXRhckxpbms/OiBzdHJpbmdcclxuICAgIH0pIHtcclxuICAgICAgICB0aGlzLmJvZHkgPSBuZXcgRm9ybURhdGEoKVxyXG4gICAgICAgIHRoaXMuYm9keS5hcHBlbmQoJ25hbWUnLCBib2R5Lm5hbWUpXHJcbiAgICAgICAgdGhpcy5ib2R5LmFwcGVuZCgnd2lkdGgnLCBib2R5LndpZHRoLnRvU3RyaW5nKCkpXHJcbiAgICAgICAgdGhpcy5ib2R5LmFwcGVuZCgnaGVpZ2h0JywgYm9keS5oZWlnaHQudG9TdHJpbmcoKSlcclxuICAgICAgICBpZiAoYm9keS5hdmF0YXJMaW5rID09IHVuZGVmaW5lZCAmJiBib2R5LmF2YXRhckZpbGUgPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHNlbmQgcmVxdWVzdCB3aXRoIG5vIGF2YXRhclwiKVxyXG4gICAgICAgIGlmIChib2R5LmF2YXRhckZpbGUgIT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aGlzLmJvZHkuYXBwZW5kKCdhdmF0YXJGaWxlJywgYm9keS5hdmF0YXJGaWxlKVxyXG4gICAgICAgIGlmIChib2R5LmF2YXRhckxpbmsgIT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aGlzLmJvZHkuYXBwZW5kKCdhdmF0YXJMaW5rJywgYm9keS5hdmF0YXJMaW5rKVxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIHByb2NlZWRSZXF1ZXN0KHJlc3BvbnNlOiBSZXNwb25zZSk6IFByb21pc2U8VGFibGVSZXNwb25zZT4ge1xyXG4gICAgICAgIGNvbnN0IHRleHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KClcclxuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh0ZXh0KSBhcyBUYWJsZVJlc3BvbnNlXHJcbiAgICB9XHJcblxyXG4gICAgZW5kcG9pbnQ6IHN0cmluZyA9IFwiL3RhYmxlL2NyZWF0ZVwiO1xyXG4gICAgbWV0aG9kVHlwZTogTWV0aG9kVHlwZSA9IE1ldGhvZFR5cGUuUE9TVDtcclxufSIsImltcG9ydCB7UmVxdWVzdFdyYXBwZXJ9IGZyb20gXCIuL1JlcXVlc3RcIjtcclxuaW1wb3J0IHtNZXRob2RUeXBlfSBmcm9tIFwiLi4vSHR0cENsaWVudFwiO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBJc0xvZ2dlZEluUmVxdWVzdCBpbXBsZW1lbnRzIFJlcXVlc3RXcmFwcGVyPG51bWJlcj57XHJcbiAgICByZWFkb25seSBlbmRwb2ludDogc3RyaW5nID0gJy91c2VyL2xvZ2luJztcclxuICAgIHJlYWRvbmx5IG1ldGhvZFR5cGU6IE1ldGhvZFR5cGUgPSBNZXRob2RUeXBlLkdFVDtcclxuXHJcbiAgICBhc3luYyBwcm9jZWVkUmVxdWVzdChyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPG51bWJlcj4ge1xyXG4gICAgICAgIHJldHVybiByZXNwb25zZS5zdGF0dXM7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQge1JlcXVlc3RXcmFwcGVyfSBmcm9tIFwiLi9SZXF1ZXN0XCI7XHJcbmltcG9ydCB7VGFibGVSZXNwb25zZX0gZnJvbSBcIi4vQ3JlYXRlVGFibGVSZXF1ZXN0XCI7XHJcbmltcG9ydCB7TWV0aG9kVHlwZX0gZnJvbSBcIi4uL0h0dHBDbGllbnRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBVc2VyUmVzcG9uc2V7XHJcbiAgICByZWFkb25seSBpZCE6IHN0cmluZ1xyXG4gICAgcmVhZG9ubHkgbmFtZSE6IHN0cmluZ1xyXG4gICAgcmVhZG9ubHkgZW1haWwhOiBzdHJpbmdcclxuICAgIHJlYWRvbmx5IGF2YXRhciE6IHN0cmluZ1xyXG4gICAgcmVhZG9ubHkgY3JlYXRlZCE6IERhdGVcclxuICAgIHJlYWRvbmx5IGNoYXRzPzogVGFibGVSZXNwb25zZVtdXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBVc2VySW5mb1JlcXVlc3QgaW1wbGVtZW50cyBSZXF1ZXN0V3JhcHBlcjxVc2VyUmVzcG9uc2U+e1xyXG4gICAgcmVhZG9ubHkgcGFyYW1ldGVyczogUmVjb3JkPHN0cmluZywgc3RyaW5nPlxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBhcmFtZXRlcnM6IHsgaW5jbHVkZUNoYXRzPzogYm9vbGVhbiB9KSB7XHJcbiAgICAgICAgbGV0IHBhcmFtczogYW55ID0ge31cclxuICAgICAgICBpZihwYXJhbWV0ZXJzLmluY2x1ZGVDaGF0cylcclxuICAgICAgICAgICAgcGFyYW1zLmluY2x1ZGVDaGF0cyA9IHBhcmFtZXRlcnMuaW5jbHVkZUNoYXRzPy50b1N0cmluZygpXHJcblxyXG4gICAgICAgIHRoaXMucGFyYW1ldGVycyA9IHBhcmFtc1xyXG4gICAgfVxyXG5cclxuICAgIHJlYWRvbmx5IGVuZHBvaW50OiBzdHJpbmcgPSBcIi91c2VyL2luZm9cIjtcclxuICAgIHJlYWRvbmx5IG1ldGhvZFR5cGU6IE1ldGhvZFR5cGUgPSBNZXRob2RUeXBlLkdFVDtcclxuXHJcbiAgICBhc3luYyBwcm9jZWVkUmVxdWVzdChyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPFVzZXJSZXNwb25zZT4ge1xyXG4gICAgICAgIGNvbnN0IHRleHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XHJcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodGV4dCkgYXMgVXNlclJlc3BvbnNlO1xyXG4gICAgfVxyXG59Il19
