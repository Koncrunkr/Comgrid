(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuthorization = void 0;
var HttpClient_1 = require("./util/HttpClient");
var CreateTableRequest_1 = require("./util/request/CreateTableRequest");
var UserInfoRequest_1 = require("./util/request/UserInfoRequest");
var IsLoggedInRequest_1 = require("./util/request/IsLoggedInRequest");
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
            name: 'Беседа только для глупых',
            lastSender: 'Самый Глупый',
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
$(window).on('load', function () {
    checkAuthorization()
        .then(loadStore)
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
});
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
        $img.height($img[0].getBoundingClientRect().width);
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
    if ((+height) * (+width) > 2500) {
        alert("Размер таблицы не может превышать 2500 ячеек");
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
function checkAuthorization() {
    return httpClient.proceedRequest(new IsLoggedInRequest_1.IsLoggedInRequest(), function () { return window.location.href = link + "/oauth2/authorization/google"; });
}
exports.checkAuthorization = checkAuthorization;
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
},{"./util/HttpClient":2,"./util/request/CreateTableRequest":3,"./util/request/IsLoggedInRequest":4,"./util/request/UserInfoRequest":5}],2:[function(require,module,exports){
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
},{"../HttpClient":2}],5:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJUU2NyaXB0L2luZGV4LnRzIiwiVFNjcmlwdC91dGlsL0h0dHBDbGllbnQudHMiLCJUU2NyaXB0L3V0aWwvcmVxdWVzdC9DcmVhdGVUYWJsZVJlcXVlc3QudHMiLCJUU2NyaXB0L3V0aWwvcmVxdWVzdC9Jc0xvZ2dlZEluUmVxdWVzdC50cyIsIlRTY3JpcHQvdXRpbC9yZXF1ZXN0L1VzZXJJbmZvUmVxdWVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztBQ0FBLGdEQUE2QztBQUM3Qyx3RUFBcUU7QUFDckUsa0VBQStEO0FBQy9ELHNFQUFtRTtBQUVuRSxJQUFJLEtBQUssR0FBUTtJQUNiLFFBQVEsRUFBRTtRQUNOO1lBQ0ksRUFBRSxFQUFFLENBQUM7WUFDTCxJQUFJLEVBQUUsbUJBQW1CO1lBQ3pCLFVBQVUsRUFBRSxRQUFRO1lBQ3BCLFdBQVcsRUFBRSw0QkFBNEI7WUFDekMsSUFBSSxFQUFFLE9BQU87WUFDYixhQUFhLEVBQUUsRUFBRTtZQUNqQixNQUFNLEVBQUUsa0JBQWtCO1lBQzFCLEtBQUssRUFBRSxHQUFHO1lBQ1YsTUFBTSxFQUFFLEdBQUc7U0FDZDtRQUNEO1lBQ0ksRUFBRSxFQUFFLENBQUM7WUFDTCxJQUFJLEVBQUUsc0JBQXNCO1lBQzVCLFVBQVUsRUFBRSxnQkFBZ0I7WUFDNUIsV0FBVyxFQUFFLG9CQUFvQjtZQUNqQyxJQUFJLEVBQUUsT0FBTztZQUNiLGFBQWEsRUFBRSxFQUFFO1lBQ2pCLE1BQU0sRUFBRSxrQkFBa0I7WUFDMUIsS0FBSyxFQUFFLEVBQUU7WUFDVCxNQUFNLEVBQUUsR0FBRztTQUNkO1FBQ0Q7WUFDSSxFQUFFLEVBQUUsQ0FBQztZQUNMLElBQUksRUFBRSwwQkFBMEI7WUFDaEMsVUFBVSxFQUFFLGNBQWM7WUFDMUIsV0FBVyxFQUFFLHVFQUF1RTtZQUNwRixJQUFJLEVBQUUsT0FBTztZQUNiLGFBQWEsRUFBRSxDQUFDO1lB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QUFFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzFGLE1BQU0sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLElBQUksVUFBVSxHQUFHLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBRWhELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoRyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDaEcsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNoQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDO1FBQzlCLElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDckMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3pELE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxLQUFL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QUFBO0lBQzVCLENBQUM7SUFLSyx3Q0FBYyxHQUFwQixVQUFxQixRQUFrQjs7Ozs7NEJBQ3RCLHFCQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBQTs7d0JBQTVCLElBQUksR0FBRyxTQUFxQjt3QkFDbEMsc0JBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQWlCLEVBQUM7Ozs7S0FDM0M7SUFDTCxzQkFBQztBQUFELENBbEJBLEFBa0JDLElBQUE7QUFsQlksMENBQWUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQge0h0dHBDbGllbnR9IGZyb20gXCIuL3V0aWwvSHR0cENsaWVudFwiO1xyXG5pbXBvcnQge0NyZWF0ZVRhYmxlUmVxdWVzdH0gZnJvbSBcIi4vdXRpbC9yZXF1ZXN0L0NyZWF0ZVRhYmxlUmVxdWVzdFwiO1xyXG5pbXBvcnQge1VzZXJJbmZvUmVxdWVzdH0gZnJvbSBcIi4vdXRpbC9yZXF1ZXN0L1VzZXJJbmZvUmVxdWVzdFwiO1xyXG5pbXBvcnQge0lzTG9nZ2VkSW5SZXF1ZXN0fSBmcm9tIFwiLi91dGlsL3JlcXVlc3QvSXNMb2dnZWRJblJlcXVlc3RcIjtcclxuXHJcbmxldCBzdG9yZTogYW55ID0ge1xyXG4gICAgZGlhbG9nczI6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlkOiAwLFxyXG4gICAgICAgICAgICBuYW1lOiAn0JLQuNGC0LDQu9GPINC4INC60L7QvNC/0LDQvdC40Y8nLFxyXG4gICAgICAgICAgICBsYXN0U2VuZGVyOiAn0JLQuNGC0LDQu9GPJyxcclxuICAgICAgICAgICAgbGFzdE1lc3NhZ2U6ICfQn9GA0LjQstC10YIsINC/0YDQuNGF0L7QtNC4INC/0LjRgtGMINC60YDQvtCy0YwnLFxyXG4gICAgICAgICAgICB0aW1lOiAn0LLRh9C10YDQsCcsXHJcbiAgICAgICAgICAgIG1lc3NhZ2VzQ291bnQ6IDUxLFxyXG4gICAgICAgICAgICBhdmF0YXI6ICcuL3BpY3R1cmVzLzEucG5nJyxcclxuICAgICAgICAgICAgd2lkdGg6IDEwMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiAxMjBcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWQ6IDEsXHJcbiAgICAgICAgICAgIG5hbWU6ICfQkdC10YHQtdC00LAg0L3QtSDQtNC70Y8g0LPQu9GD0L/Ri9GFJyxcclxuICAgICAgICAgICAgbGFzdFNlbmRlcjogJ9Ca0YLQvtCi0L4g0J3QtdCT0LvRg9C/0YvQuScsXHJcbiAgICAgICAgICAgIGxhc3RNZXNzYWdlOiAn0KHQutC+0LvRjNC60L4g0LHRg9C00LXRgiAyKzI/JyxcclxuICAgICAgICAgICAgdGltZTogJ9Cy0YfQtdGA0LAnLFxyXG4gICAgICAgICAgICBtZXNzYWdlc0NvdW50OiAxNyxcclxuICAgICAgICAgICAgYXZhdGFyOiAnLi9waWN0dXJlcy8yLnBuZycsXHJcbiAgICAgICAgICAgIHdpZHRoOiAxMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiAxMTJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWQ6IDIsXHJcbiAgICAgICAgICAgIG5hbWU6ICfQkdC10YHQtdC00LAg0YLQvtC70YzQutC+INC00LvRjyDQs9C70YPQv9GL0YUnLFxyXG4gICAgICAgICAgICBsYXN0U2VuZGVyOiAn0KHQsNC80YvQuSDQk9C70YPQv9GL0LknLFxyXG4gICAgICAgICAgICBsYXN0TWVzc2FnZTogJ9Cg0LXQsdGP0YLQsCwg0Y8g0YLQvtC70YzQutC+INGH0YLQviDQtNC+0LrQsNC30LDQuyDQs9C40L/QvtGC0LXQt9GDINCg0LjQvNCw0L3QsCEg0JrQvtGA0L7Rh9C1LCDRgtCw0Lwg0LLRgdGRINC/0YDQvtGB0YLQviEnLFxyXG4gICAgICAgICAgICB0aW1lOiAnMTE6MzAnLFxyXG4gICAgICAgICAgICBtZXNzYWdlc0NvdW50OiAwLFxyXG4gICAgICAgICAgICBhdmF0YXI6ICcuL3BpY3R1cmVzLzMucG5nJyxcclxuICAgICAgICAgICAgd2lkdGg6IDIwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDQwXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlkOiAzLFxyXG4gICAgICAgICAgICBuYW1lOiAn0JHQtdGB0LXQtNCwINGBINC+0YfQtdC90Ywg0LTQu9C40L3QvdGL0Lwg0L3QsNC30LLQsNC90LjQtdC8LiDQoNC10LHRj9GC0LAsINGPINC90LUg0L/RgNC10LTRgdGC0LDQstC70Y/RjiDQutC+0LzRgyDQsiDQs9C+0LvQvtCy0YMg0L/RgNC40YjQu9C+INC00LDQstCw0YLRjCDRgtCw0LrQvtC1INC00LvQuNC90L3QvtC1INC90LDQt9Cy0LDQvdC40LUuINCg0LXQsdGP0YLQsCwg0L/RgNC10LTQu9Cw0LPQsNGOINC+0LPRgNCw0L3QuNGH0LjRgtGMINC00LvQuNC90YMg0L3QsNC30LLQsNC90LjQuScsXHJcbiAgICAgICAgICAgIGxhc3RTZW5kZXI6ICfQktC40YLQsNC70Y8nLFxyXG4gICAgICAgICAgICBsYXN0TWVzc2FnZTogJ9Cf0YDQuNCy0LXRgiwg0LPQu9GP0L3RjCDQu9GBJyxcclxuICAgICAgICAgICAgdGltZTogJzE0OjE1JyxcclxuICAgICAgICAgICAgbWVzc2FnZXNDb3VudDogMCxcclxuICAgICAgICAgICAgYXZhdGFyOiAnLi9waWN0dXJlcy80LnBuZycsXHJcbiAgICAgICAgICAgIHdpZHRoOiAxMDAwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDEwMDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWQ6IDQsXHJcbiAgICAgICAgICAgIG5hbWU6ICfQktC40YLQsNC70Y8g0KLRgNGD0LHQvtC10LQnLFxyXG4gICAgICAgICAgICBsYXN0U2VuZGVyOiAnJyxcclxuICAgICAgICAgICAgbGFzdE1lc3NhZ2U6ICfQlNCw0LLQvdC+INGH0LjRgtCw0Lsg0LHQtdGB0LXQtNGDPycsXHJcbiAgICAgICAgICAgIHRpbWU6ICcxOTo1MScsXHJcbiAgICAgICAgICAgIG1lc3NhZ2VzQ291bnQ6IDQsXHJcbiAgICAgICAgICAgIGF2YXRhcjogJy4vcGljdHVyZXMvNS5wbmcnLFxyXG4gICAgICAgICAgICB3aWR0aDogMTAwMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiA1MDBcclxuICAgICAgICB9XHJcbiAgICBdXHJcbn1cclxubGV0IGxpbmsgPSBcImh0dHBzOi8vY29tZ3JpZC5ydTo4NDQzXCI7XHJcbmNvbnN0IGh0dHBDbGllbnQgPSBuZXcgSHR0cENsaWVudChsaW5rKVxyXG5sZXQgbGVmdEJ1dHRvbkNsaWNrZWQgPSBmYWxzZTtcclxuXHJcbiQod2luZG93KS5vbignbG9hZCcsICgpID0+IHtcclxuICAgIGNoZWNrQXV0aG9yaXphdGlvbigpXHJcbiAgICAudGhlbihsb2FkU3RvcmUpXHJcbiAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgZHJhd0RpYWxvZ3MoKVxyXG4gICAgfSk7XHJcblxyXG4gICAgJCgnLmNsaWNrYWJsZScpLm9uKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAkKCcuY2xpY2thYmxlJykudG9nZ2xlQ2xhc3MoJ2Qtbm9uZScpXHJcbiAgICB9KTtcclxuICAgIGxldCBpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YWJsZS1pbWFnZS1maWxlLWlucHV0Jyk7XHJcbiAgICBpbnB1dC5vbmNoYW5nZSA9ICgpID0+IHNob3dJbWFnZShpbnB1dCk7XHJcbiAgICAkKFwiI3Nob3dlclwiKS5vbihcImRyYWdzdGFydFwiLCAoKSA9PiBmYWxzZSk7XHJcbiAgICAkKFwiI3Nob3dlci1jdXRcIikub24oXCJkcmFnc3RhcnRcIiwgKCkgPT4gZmFsc2UpO1xyXG4gICAgJChcIiNzYXZlLWNhbnZhc1wiKS5vbihcImNsaWNrXCIsIHNhdmVDYW52YXMpO1xyXG4gICAgJCgnI2NyZWF0ZS10YWJsZS1mb3JtJykub24oJ3N1Ym1pdCcsIHN1Ym1pdCk7XHJcbn0pXHJcblxyXG5mdW5jdGlvbiBkcmF3RGlhbG9ncygpIHtcclxuICAgIGxldCAkY29udGFpbmVyID0gJCgnLmNoYXQtY29udGFpbmVyJyk7XHJcbiAgICBsZXQgJG5vRGVsID0gJGNvbnRhaW5lci5maW5kKCcubm8tZGVsZXRhYmxlJyk7XHJcbiAgICAkY29udGFpbmVyLmh0bWwoJycpO1xyXG4gICAgJGNvbnRhaW5lci5hcHBlbmQoJG5vRGVsKTtcclxuICAgIHN0b3JlLmRpYWxvZ3Muc2xpY2UoKS5yZXZlcnNlKCkuZm9yRWFjaCgoZGlhbG9nLCBpbmRleCkgPT4ge1xyXG4gICAgICAgIGxldCBkaWFsb2cyID0gc3RvcmUuZGlhbG9nczJbaW5kZXggJSBzdG9yZS5kaWFsb2dzMi5sZW5ndGhdO1xyXG4gICAgICAgIGxldCAkY2hhdCA9ICQoJy5jaGF0JykuY2xvbmUoKTtcclxuICAgICAgICAkY2hhdC5yZW1vdmVDbGFzcygnY2hhdCBkLW5vbmUnKTtcclxuICAgICAgICAkY2hhdC5maW5kKCdhJykuYXR0cignaHJlZicsICdwYWdlcy90YWJsZT9pZD0nICsgZGlhbG9nLmlkKTtcclxuICAgICAgICAkY2hhdC5maW5kKCcuY2hhdC1uYW1lJykudGV4dChkaWFsb2cubmFtZSk7XHJcbiAgICAgICAgJGNoYXQuZmluZCgnLmNoYXQtc2VuZGVyJykudGV4dChkaWFsb2cyLmxhc3RTZW5kZXIgKyAoZGlhbG9nMi5sYXN0U2VuZGVyID09PSAnJyA/ICcnIDogJzonKSk7XHJcbiAgICAgICAgJGNoYXQuZmluZCgnLmNoYXQtdGV4dCcpLnRleHQoZGlhbG9nMi5sYXN0TWVzc2FnZSk7XHJcbiAgICAgICAgJGNoYXQuZmluZCgnLmNoYXQtdGltZScpLnRleHQoZGlhbG9nMi50aW1lKTtcclxuICAgICAgICBpZihkaWFsb2cuYXZhdGFyLnN0YXJ0c1dpdGgoXCIvXCIpKVxyXG4gICAgICAgICAgICBkaWFsb2cuYXZhdGFyID0gbGluayArIGRpYWxvZy5hdmF0YXJcclxuICAgICAgICBsZXQgJGltZyA9ICRjaGF0LmZpbmQoJ2ltZycpO1xyXG4gICAgICAgICRpbWcuYXR0cignc3JjJywgZGlhbG9nLmF2YXRhcik7XHJcbiAgICAgICAgJGltZy5oZWlnaHQoJGltZ1swXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCk7XHJcbiAgICAgICAgJGNoYXQuZmluZCgnLmNoYXQtc2l6ZScpLnRleHQoZGlhbG9nLndpZHRoICsgJ8OXJyArIGRpYWxvZy5oZWlnaHQpXHJcbiAgICAgICAgZGlhbG9nMi5tZXNzYWdlc0NvdW50ID09PSAwXHJcbiAgICAgICAgICAgID8gJGNoYXQuZmluZCgnLmNoYXQtdW5yZWFkJykucmVtb3ZlKClcclxuICAgICAgICAgICAgOiAkY2hhdC5maW5kKCcuY2hhdC11bnJlYWQnKS50ZXh0KGRpYWxvZzIubWVzc2FnZXNDb3VudCk7XHJcbiAgICAgICAgJGNvbnRhaW5lci5hcHBlbmQoJGNoYXQpO1xyXG4gICAgICAgICRjaGF0Lm9uKCdtb3VzZWVudGVyJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAkY2hhdC5yZW1vdmVDbGFzcygnYmctbGlnaHQnKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICRjaGF0Lm9uKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAkY2hhdC5hZGRDbGFzcygnYmctbGlnaHQnKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICRjaGF0Lm9uKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgZGlhbG9nLm1lc3NhZ2VzQ291bnQgPSAwO1xyXG4gICAgICAgICAgICBkcmF3RGlhbG9ncygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN1Ym1pdCgpIHtcclxuICAgIGNvbnN0IGF2YXRhckZpbGUgPSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RhYmxlLWltYWdlLWZpbGUtaW5wdXQnKSBhcyBIVE1MSW5wdXRFbGVtZW50KT8uZmlsZXNbMF07XHJcbiAgICBsZXQgYXZhdGFyTGluayA9ICQoJyN0YWJsZS1pbWFnZS1saW5rLWlucHV0JykudmFsKCk7XHJcbiAgICBpZihhdmF0YXJMaW5rID09PSBcIlwiICYmIGF2YXRhckZpbGUgPT09IG51bGwpe1xyXG4gICAgICAgIGFsZXJ0KFwiWW91IG11c3Qgc3BlY2lmeSBlaXRoZXIgaW1hZ2Ugb3IgbGluayB0byBpbWFnZVwiKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBsZXQgaGVpZ2h0ID0gJCgnI3RhYmxlLWhlaWdodC1pbnB1dCcpLnZhbCgpO1xyXG4gICAgbGV0IHdpZHRoID0gJCgnI3RhYmxlLXdpZHRoLWlucHV0JykudmFsKCk7XHJcbiAgICBpZigoK2hlaWdodCkgKiAoK3dpZHRoKSA+IDI1MDApIHtcclxuICAgICAgICBhbGVydChcItCg0LDQt9C80LXRgCDRgtCw0LHQu9C40YbRiyDQvdC1INC80L7QttC10YIg0L/RgNC10LLRi9GI0LDRgtGMIDI1MDAg0Y/Rh9C10LXQulwiKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBsZXQgaW1hZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNob3dlclwiKSBhcyBIVE1MSW1hZ2VFbGVtZW50O1xyXG4gICAgY29uc29sZS5sb2coaW1hZ2UubmF0dXJhbEhlaWdodCwgaW1hZ2UubmF0dXJhbFdpZHRoKTtcclxuICAgIGlmKGltYWdlLm5hdHVyYWxIZWlnaHQgIT09IGltYWdlLm5hdHVyYWxXaWR0aCkge1xyXG4gICAgICAgIGFsZXJ0KFwi0JrQsNGA0YLQuNC90LrQsCDQtNC+0LvQttC90LAg0LHRi9GC0Ywg0LrQstCw0LTRgNCw0YLQvdC+0LkuINCe0LHRgNC10LbRjNGC0LUg0LXRkSFcIik7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgY29uc3QgbmV3VGFibGUgPSBuZXcgQ3JlYXRlVGFibGVSZXF1ZXN0KHtcclxuICAgICAgICBuYW1lOiAkKCcjdGFibGUtbmFtZS1pbnB1dCcpLnZhbCgpIGFzIHN0cmluZyxcclxuICAgICAgICB3aWR0aDogd2lkdGggYXMgbnVtYmVyLFxyXG4gICAgICAgIGhlaWdodDogaGVpZ2h0IGFzIG51bWJlcixcclxuICAgICAgICBhdmF0YXJMaW5rOiBhdmF0YXJMaW5rIGFzIHN0cmluZyxcclxuICAgICAgICBhdmF0YXJGaWxlOiBhdmF0YXJGaWxlXHJcbiAgICB9KVxyXG5cclxuICAgIHBvc3RUYWJsZShuZXdUYWJsZSlcclxuICAgIC50aGVuKCh0YWJsZSkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRhYmxlKVxyXG4gICAgICAgIGxvYWRTdG9yZSgpLnRoZW4oZHJhd0RpYWxvZ3MpXHJcbiAgICB9KTtcclxuICAgIGNsZWFyTWVudSgpO1xyXG4gICAgY2xvc2VNZW51KCk7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBvc3RUYWJsZSh0YWJsZSkge1xyXG4gICAgcmV0dXJuIGh0dHBDbGllbnQucHJvY2VlZFJlcXVlc3QoXHJcbiAgICAgICAgdGFibGUsXHJcbiAgICAgICAgKGNvZGUsIGVycm9yVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBhbGVydChgRXJyb3IgaGFwcGVuZWQgd2hpbGUgY3JlYXRpbmcgdGFibGU6ICR7Y29kZX0sICR7ZXJyb3JUZXh0fWApXHJcbiAgICAgICAgfVxyXG4gICAgKVxyXG59XHJcblxyXG5mdW5jdGlvbiBjbGVhck1lbnUoKSB7XHJcbiAgICAkKCcjY2xlYXItYnV0dG9uJykuY2xpY2soKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2xvc2VNZW51KCkge1xyXG4gICAgJCgnI2Nsb3NlLWJ1dHRvbicpLmNsaWNrKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvYWRTdG9yZSgpIHtcclxuICAgIHJldHVybiBodHRwQ2xpZW50LnByb2NlZWRSZXF1ZXN0KFxyXG4gICAgICAgIG5ldyBVc2VySW5mb1JlcXVlc3QoeyBpbmNsdWRlQ2hhdHM6IHRydWUgfSksXHJcbiAgICAgICAgKGNvZGUsIGVycm9yVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBhbGVydChgRXJyb3IgaGFwcGVuZWQgd2hpbGUgbG9hZGluZyB1c2VyIGluZm86ICR7Y29kZX0sICR7ZXJyb3JUZXh0fWApXHJcbiAgICAgICAgfVxyXG4gICAgKS50aGVuKHVzZXIgPT4ge1xyXG4gICAgICAgIHN0b3JlLmRpYWxvZ3MgPSB1c2VyLmNoYXRzO1xyXG4gICAgfSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrQXV0aG9yaXphdGlvbigpIHtcclxuICAgIHJldHVybiBodHRwQ2xpZW50LnByb2NlZWRSZXF1ZXN0KFxyXG4gICAgICAgIG5ldyBJc0xvZ2dlZEluUmVxdWVzdCgpLFxyXG4gICAgICAgICgpID0+IHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gbGluayArIFwiL29hdXRoMi9hdXRob3JpemF0aW9uL2dvb2dsZVwiXHJcbiAgICApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzaG93SW1hZ2UoaW5wdXQpIHtcclxuICAgIGlmIChpbnB1dC5maWxlcyAmJiBpbnB1dC5maWxlc1swXSkge1xyXG4gICAgICAgIGxldCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG4gICAgICAgIGxldCBzaG93ZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2hvd2VyJykgYXMgSFRNTEltYWdlRWxlbWVudDtcclxuICAgICAgICBjb25zb2xlLmxvZyhzaG93ZXIubmF0dXJhbFdpZHRoLCBzaG93ZXIubmF0dXJhbEhlaWdodCk7XHJcblxyXG4gICAgICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIHNob3dlci5jbGFzc0xpc3QucmVtb3ZlKCdkLW5vbmUnKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBtZXRob2QgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGFyayA9ICQoJy5kYXJrLWJhY2tncm91bmQnKTtcclxuICAgICAgICAgICAgICAgIHNob3dlci53aWR0aCA9IDUwMDtcclxuICAgICAgICAgICAgICAgIHNob3dlci5oZWlnaHQgPSBzaG93ZXIubmF0dXJhbEhlaWdodCAqIHNob3dlci53aWR0aCAvIHNob3dlci5uYXR1cmFsV2lkdGg7XHJcbiAgICAgICAgICAgICAgICBkYXJrLnJlbW92ZUNsYXNzKCdkLW5vbmUnKTtcclxuICAgICAgICAgICAgICAgIGRhcmsud2lkdGgoc2hvd2VyLndpZHRoKTtcclxuICAgICAgICAgICAgICAgIGRhcmsuaGVpZ2h0KHNob3dlci5oZWlnaHQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBzaG93ZXJDdXQ6IEhUTUxDYW52YXNFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Nob3dlci1jdXQnKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgICAgICAgICAgICAgIHNob3dlckN1dC5jbGFzc0xpc3QucmVtb3ZlKCdkLW5vbmUnKTtcclxuICAgICAgICAgICAgICAgIHNob3dlckN1dC53aWR0aCA9IHNob3dlci53aWR0aCAqIDIgLyAzO1xyXG4gICAgICAgICAgICAgICAgc2hvd2VyQ3V0LmhlaWdodCA9IHNob3dlci53aWR0aCAqIDIgLyAzO1xyXG4gICAgICAgICAgICAgICAgbGV0IG9mZnNldCA9IHNob3dlci53aWR0aCAvIDY7XHJcbiAgICAgICAgICAgICAgICBzaG93ZXJDdXQuc3R5bGUudG9wID0gYCR7b2Zmc2V0fXB4YDtcclxuICAgICAgICAgICAgICAgIHNob3dlckN1dC5zdHlsZS5sZWZ0ID0gYCR7b2Zmc2V0fXB4YDtcclxuXHJcbiAgICAgICAgICAgICAgICBzaG93ZXJDdXQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgc2hvd2VyQ3V0TW92ZSk7XHJcbiAgICAgICAgICAgICAgICBzaG93ZXJDdXQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgc2hvd2VyQ3V0TW92ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGNvbnRleHQgPSBzaG93ZXJDdXQuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuZHJhd0ltYWdlKHNob3dlciwgLW9mZnNldCwgLW9mZnNldCwgc2hvd2VyLndpZHRoLCBzaG93ZXIud2lkdGgpO1xyXG4gICAgICAgICAgICAgICAgLy9jb250ZXh0LnN0cm9rZVJlY3QoMCwgMCwgc2hvd2VyLndpZHRoLCBzaG93ZXIud2lkdGgpO1xyXG4gICAgICAgICAgICAgICAgc2hvd2VyLnNldEF0dHJpYnV0ZSgnc3JjJywgZS50YXJnZXQucmVzdWx0IGFzIHN0cmluZyk7XHJcbiAgICAgICAgICAgICAgICBzaG93ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignbG9hZCcsIG1ldGhvZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgJCgnI3NhdmUtY2FudmFzJykucmVtb3ZlQ2xhc3MoJ2Qtbm9uZScpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzaG93ZXIuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIG1ldGhvZCk7XHJcbiAgICAgICAgICAgIHNob3dlci5zZXRBdHRyaWJ1dGUoJ3NyYycsIGUudGFyZ2V0LnJlc3VsdCBhcyBzdHJpbmcpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGlucHV0LmZpbGVzWzBdKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gc2F2ZUNhbnZhcygpIHtcclxuICAgIGxldCBzaG93ZXJDdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2hvd2VyLWN1dCcpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgbGV0IGtlZXBlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaG93ZXInKSBhcyBIVE1MSW1hZ2VFbGVtZW50O1xyXG5cclxuXHJcbiAgICBzaG93ZXJDdXQudG9CbG9iKGJsb2IgPT4ge1xyXG4gICAgICAgIGxldCBkdCA9IG5ldyBEYXRhVHJhbnNmZXIoKTtcclxuICAgICAgICBkdC5pdGVtcy5hZGQobmV3IEZpbGUoW2Jsb2JdLCAnaW1hZ2UucG5nJywge3R5cGU6ICdpbWFnZS9wbmcnfSkpO1xyXG4gICAgICAgIGxldCBmaWxlX2xpc3QgPSBkdC5maWxlcztcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coJ9Ca0L7Qu9C70LXQutGG0LjRjyDRhNCw0LnQu9C+0LIg0YHQvtC30LTQsNC90LA6Jyk7XHJcbiAgICAgICAgY29uc29sZS5kaXIoZmlsZV9saXN0KTtcclxuXHJcbiAgICAgICAgbGV0IGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RhYmxlLWltYWdlLWZpbGUtaW5wdXQnKSBhcyBIVE1MSW5wdXRFbGVtZW50XHJcbiAgICAgICAgaW5wdXQuZmlsZXMgPSBmaWxlX2xpc3Q7XHJcbiAgICAgICAgc2hvd0ltYWdlKGlucHV0KTtcclxuICAgIH0pXHJcbn1cclxuXHJcbmxldCBzaG93ZXJDdXRNb3ZlID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgIGxldCBzaG93ZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2hvd2VyLWN1dCcpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgbGV0IGtlZXBlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaG93ZXInKSBhcyBIVE1MSW1hZ2VFbGVtZW50O1xyXG4gICAgbGV0IGJvdW5kaW5nID0ga2VlcGVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgbGV0IHNoaWZ0WCA9IGV2ZW50LmNsaWVudFggLSBzaG93ZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdDtcclxuICAgIGxldCBzaGlmdFkgPSBldmVudC5jbGllbnRZIC0gc2hvd2VyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcDtcclxuXHJcbiAgICBzaG93ZXIuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xyXG5cclxuICAgIG1vdmVBdChldmVudC5wYWdlWCwgZXZlbnQucGFnZVkpO1xyXG5cclxuICAgIGZ1bmN0aW9uIG1vdmVBdChwYWdlWCwgcGFnZVkpIHtcclxuICAgICAgICBsZXQgbGVmdCA9IE1hdGgubWluKE1hdGgubWF4KHBhZ2VYIC0gc2hpZnRYIC0gYm91bmRpbmcubGVmdCwgMCksIGJvdW5kaW5nLndpZHRoIC0gc2hvd2VyLndpZHRoKTtcclxuICAgICAgICBsZXQgdG9wID0gTWF0aC5taW4oTWF0aC5tYXgocGFnZVkgLSBzaGlmdFkgLSBib3VuZGluZy50b3AsIDApLCBib3VuZGluZy5oZWlnaHQgLSBzaG93ZXIuaGVpZ2h0KTtcclxuICAgICAgICBzaG93ZXIuc3R5bGUubGVmdCA9IGxlZnQgKyAncHgnO1xyXG4gICAgICAgIHNob3dlci5zdHlsZS50b3AgPSB0b3AgKyAncHgnO1xyXG4gICAgICAgIGxldCBjb250ZXh0ID0gc2hvd2VyLmdldENvbnRleHQoJzJkJylcclxuICAgICAgICBjb250ZXh0LmNsZWFyUmVjdCgwLCAwLCBib3VuZGluZy53aWR0aCwgYm91bmRpbmcuaGVpZ2h0KTtcclxuICAgICAgICBjb250ZXh0LmRyYXdJbWFnZShrZWVwZXIsIC1sZWZ0LCAtdG9wLCBib3VuZGluZy53aWR0aCwgYm91bmRpbmcuaGVpZ2h0KTtcclxuICAgICAgICAvL2NvbnRleHQuc3Ryb2tlUmVjdCgwLCAwLCBzaG93ZXIud2lkdGgsIHNob3dlci5oZWlnaHQpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHJlc2l6ZShpbmNyZWFzZTogYm9vbGVhbikge1xyXG4gICAgICAgIGxldCB3aWR0aCA9IE1hdGgubWluKHNob3dlci53aWR0aCArIChpbmNyZWFzZSA/IDYgOiAtNiksIGJvdW5kaW5nLndpZHRoLCBib3VuZGluZy5oZWlnaHQpO1xyXG4gICAgICAgIHNob3dlci53aWR0aCA9IHdpZHRoO1xyXG4gICAgICAgIHNob3dlci5oZWlnaHQgPSB3aWR0aDtcclxuICAgICAgICBsZXQgYm91bmRpbmdJbiA9IHNob3dlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgICAgICAgbGV0IGxlZnQgPSBNYXRoLm1pbihNYXRoLm1heCgrc2hvd2VyLnN0eWxlLmxlZnQuc2xpY2UoMCwtMiksIDApLCBib3VuZGluZy53aWR0aCAtIHNob3dlci53aWR0aCk7XHJcbiAgICAgICAgbGV0IHRvcCA9IE1hdGgubWluKE1hdGgubWF4KCtzaG93ZXIuc3R5bGUudG9wLnNsaWNlKDAsLTIpLCAwKSwgYm91bmRpbmcuaGVpZ2h0IC0gc2hvd2VyLmhlaWdodCk7XHJcbiAgICAgICAgc2hvd2VyLnN0eWxlLmxlZnQgPSBsZWZ0ICsgJ3B4JztcclxuICAgICAgICBzaG93ZXIuc3R5bGUudG9wID0gdG9wICsgJ3B4JztcclxuICAgICAgICBsZXQgY29udGV4dCA9IHNob3dlci5nZXRDb250ZXh0KCcyZCcpXHJcbiAgICAgICAgY29udGV4dC5jbGVhclJlY3QoMCwgMCwgYm91bmRpbmcud2lkdGgsIGJvdW5kaW5nLmhlaWdodCk7XHJcbiAgICAgICAgY29udGV4dC5kcmF3SW1hZ2Uoa2VlcGVyLCAtbGVmdCwgLXRvcCwgYm91bmRpbmcud2lkdGgsIGJvdW5kaW5nLmhlaWdodCk7XHJcbiAgICAgICAgLy9jb250ZXh0LnN0cm9rZVJlY3QoMCwgMCwgc2hvd2VyLndpZHRoLCBzaG93ZXIuaGVpZ2h0KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBvbk1vdXNlTW92ZShldmVudDogTW91c2VFdmVudCkge1xyXG4gICAgICAgIGlmIChldmVudC5jdHJsS2V5KSB7XHJcbiAgICAgICAgICAgIGxldCBuZXdTaGlmdFggPSBldmVudC5jbGllbnRYIC0gc2hvd2VyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQ7XHJcbiAgICAgICAgICAgIGxldCBuZXdTaGlmdFkgPSBldmVudC5jbGllbnRZIC0gc2hvd2VyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcDtcclxuICAgICAgICAgICAgbGV0IGluY3JlYXNlID0gKG5ld1NoaWZ0WCAtIG5ld1NoaWZ0WSAtIHNoaWZ0WCArIHNoaWZ0WSkgPiAwO1xyXG4gICAgICAgICAgICBzaGlmdFggPSBuZXdTaGlmdFg7XHJcbiAgICAgICAgICAgIHNoaWZ0WSA9IG5ld1NoaWZ0WTtcclxuICAgICAgICAgICAgcmVzaXplKGluY3JlYXNlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBtb3ZlQXQoZXZlbnQucGFnZVgsIGV2ZW50LnBhZ2VZKTtcclxuICAgIH1cclxuXHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbk1vdXNlTW92ZSk7XHJcblxyXG4gICAgc2hvd2VyLm9ubW91c2V1cCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbk1vdXNlTW92ZSk7XHJcbiAgICAgICAgc2hvd2VyLm9ubW91c2V1cCA9IG51bGw7XHJcbiAgICB9O1xyXG59IiwiaW1wb3J0IHtSZXF1ZXN0V3JhcHBlcn0gZnJvbSBcIi4vcmVxdWVzdC9SZXF1ZXN0XCI7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEh0dHBDbGllbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBhcGlMaW5rOiBzdHJpbmcpIHt9XHJcblxyXG4gICAgYXN5bmMgcHJvY2VlZFJlcXVlc3Q8VD4oXHJcbiAgICAgICAgcmVxdWVzdDogUmVxdWVzdFdyYXBwZXI8VD4sXHJcbiAgICAgICAgb25GYWlsdXJlOiAoY29kZTogbnVtYmVyLCBlcnJvclRleHQ6IHN0cmluZykgPT4gdW5rbm93biA9XHJcbiAgICAgICAgICAgIChjb2RlLCBlcnJvclRleHQpID0+IGFsZXJ0KGBjb2RlOiAke2NvZGV9LCBlcnJvcjogJHtlcnJvclRleHR9YCksXHJcbiAgICAgICAgb25OZXR3b3JrRmFpbHVyZTogKHJlYXNvbikgPT4gdW5rbm93biA9XHJcbiAgICAgICAgICAgIChyZWFzb24pID0+IGFsZXJ0KGBuZXR3b3JrIGVycm9yOiAke3JlYXNvbn1gKVxyXG4gICAgKTogUHJvbWlzZTxUPntcclxuICAgICAgICBjb25zdCBmaW5hbExpbmsgPSBuZXcgVVJMKHRoaXMuYXBpTGluayArIHJlcXVlc3QuZW5kcG9pbnQpXHJcbiAgICAgICAgaWYocmVxdWVzdC5wYXJhbWV0ZXJzICE9IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgZmluYWxMaW5rLnNlYXJjaCA9IG5ldyBVUkxTZWFyY2hQYXJhbXMocmVxdWVzdC5wYXJhbWV0ZXJzKS50b1N0cmluZygpXHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKHJlcXVlc3QpXHJcbiAgICAgICAgcmV0dXJuIGZldGNoKFxyXG4gICAgICAgICAgICBmaW5hbExpbmsudG9TdHJpbmcoKSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwiaW5jbHVkZVwiLFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiByZXF1ZXN0Lm1ldGhvZFR5cGUsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiByZXF1ZXN0LmhlYWRlcnMsXHJcbiAgICAgICAgICAgICAgICBib2R5OiByZXF1ZXN0LmJvZHlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICkudGhlbihhc3luYyAocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgaWYocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucHJvY2VlZFJlcXVlc3QocmVzcG9uc2UpXHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZXJyb3JUZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xyXG4gICAgICAgICAgICAgICAgb25GYWlsdXJlKHJlc3BvbnNlLnN0YXR1cywgZXJyb3JUZXh0KTtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoZXJyb3JUZXh0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIE1ldGhvZFR5cGV7XHJcbiAgICBQT1NUPVwiUE9TVFwiLFxyXG4gICAgR0VUPVwiR0VUXCIsXHJcbiAgICBQQVRDSD1cIlBBVENIXCIsXHJcbiAgICBQVVQ9XCJQVVRcIixcclxufSIsImltcG9ydCB7TWV0aG9kVHlwZX0gZnJvbSBcIi4uL0h0dHBDbGllbnRcIjtcclxuaW1wb3J0IHtSZXF1ZXN0V3JhcHBlcn0gZnJvbSBcIi4vUmVxdWVzdFwiO1xyXG5pbXBvcnQge1VzZXJSZXNwb25zZX0gZnJvbSBcIi4vVXNlckluZm9SZXF1ZXN0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVGFibGVSZXNwb25zZSB7XHJcbiAgICByZWFkb25seSBpZCE6IG51bWJlclxyXG4gICAgcmVhZG9ubHkgbmFtZSE6IHN0cmluZ1xyXG4gICAgcmVhZG9ubHkgY3JlYXRvciE6IG51bWJlclxyXG4gICAgcmVhZG9ubHkgd2lkdGghOiBudW1iZXJcclxuICAgIHJlYWRvbmx5IGhlaWdodCE6IG51bWJlclxyXG4gICAgcmVhZG9ubHkgYXZhdGFyITogbnVtYmVyXHJcbiAgICByZWFkb25seSBjcmVhdGVkITogRGF0ZVxyXG4gICAgcmVhZG9ubHkgbGFzdE1lc3NhZ2VJZD86IG51bWJlclxyXG4gICAgcmVhZG9ubHkgcGFydGljaXBhbnRzPzogVXNlclJlc3BvbnNlW11cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENyZWF0ZVRhYmxlUmVxdWVzdCBpbXBsZW1lbnRzIFJlcXVlc3RXcmFwcGVyPFRhYmxlUmVzcG9uc2U+IHtcclxuICAgIHJlYWRvbmx5IGJvZHk/OiBGb3JtRGF0YVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKGJvZHk6IHtcclxuICAgICAgICBuYW1lOiBzdHJpbmcsXHJcbiAgICAgICAgd2lkdGg6IG51bWJlcixcclxuICAgICAgICBoZWlnaHQ6IG51bWJlcixcclxuICAgICAgICBhdmF0YXJGaWxlPzogRmlsZSxcclxuICAgICAgICBhdmF0YXJMaW5rPzogc3RyaW5nXHJcbiAgICB9KSB7XHJcbiAgICAgICAgdGhpcy5ib2R5ID0gbmV3IEZvcm1EYXRhKClcclxuICAgICAgICB0aGlzLmJvZHkuYXBwZW5kKCduYW1lJywgYm9keS5uYW1lKVxyXG4gICAgICAgIHRoaXMuYm9keS5hcHBlbmQoJ3dpZHRoJywgYm9keS53aWR0aC50b1N0cmluZygpKVxyXG4gICAgICAgIHRoaXMuYm9keS5hcHBlbmQoJ2hlaWdodCcsIGJvZHkuaGVpZ2h0LnRvU3RyaW5nKCkpXHJcbiAgICAgICAgaWYgKGJvZHkuYXZhdGFyTGluayA9PSB1bmRlZmluZWQgJiYgYm9keS5hdmF0YXJGaWxlID09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBzZW5kIHJlcXVlc3Qgd2l0aCBubyBhdmF0YXJcIilcclxuICAgICAgICBpZiAoYm9keS5hdmF0YXJGaWxlICE9IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhpcy5ib2R5LmFwcGVuZCgnYXZhdGFyRmlsZScsIGJvZHkuYXZhdGFyRmlsZSlcclxuICAgICAgICBpZiAoYm9keS5hdmF0YXJMaW5rICE9IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhpcy5ib2R5LmFwcGVuZCgnYXZhdGFyTGluaycsIGJvZHkuYXZhdGFyTGluaylcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBwcm9jZWVkUmVxdWVzdChyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPFRhYmxlUmVzcG9uc2U+IHtcclxuICAgICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpXHJcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodGV4dCkgYXMgVGFibGVSZXNwb25zZVxyXG4gICAgfVxyXG5cclxuICAgIGVuZHBvaW50OiBzdHJpbmcgPSBcIi90YWJsZS9jcmVhdGVcIjtcclxuICAgIG1ldGhvZFR5cGU6IE1ldGhvZFR5cGUgPSBNZXRob2RUeXBlLlBPU1Q7XHJcbn0iLCJpbXBvcnQge1JlcXVlc3RXcmFwcGVyfSBmcm9tIFwiLi9SZXF1ZXN0XCI7XHJcbmltcG9ydCB7TWV0aG9kVHlwZX0gZnJvbSBcIi4uL0h0dHBDbGllbnRcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgSXNMb2dnZWRJblJlcXVlc3QgaW1wbGVtZW50cyBSZXF1ZXN0V3JhcHBlcjxudW1iZXI+e1xyXG4gICAgcmVhZG9ubHkgZW5kcG9pbnQ6IHN0cmluZyA9ICcvdXNlci9sb2dpbic7XHJcbiAgICByZWFkb25seSBtZXRob2RUeXBlOiBNZXRob2RUeXBlID0gTWV0aG9kVHlwZS5HRVQ7XHJcblxyXG4gICAgYXN5bmMgcHJvY2VlZFJlcXVlc3QocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTxudW1iZXI+IHtcclxuICAgICAgICByZXR1cm4gcmVzcG9uc2Uuc3RhdHVzO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHtSZXF1ZXN0V3JhcHBlcn0gZnJvbSBcIi4vUmVxdWVzdFwiO1xyXG5pbXBvcnQge1RhYmxlUmVzcG9uc2V9IGZyb20gXCIuL0NyZWF0ZVRhYmxlUmVxdWVzdFwiO1xyXG5pbXBvcnQge01ldGhvZFR5cGV9IGZyb20gXCIuLi9IdHRwQ2xpZW50XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVXNlclJlc3BvbnNle1xyXG4gICAgcmVhZG9ubHkgaWQhOiBzdHJpbmdcclxuICAgIHJlYWRvbmx5IG5hbWUhOiBzdHJpbmdcclxuICAgIHJlYWRvbmx5IGVtYWlsITogc3RyaW5nXHJcbiAgICByZWFkb25seSBhdmF0YXIhOiBzdHJpbmdcclxuICAgIHJlYWRvbmx5IGNyZWF0ZWQhOiBEYXRlXHJcbiAgICByZWFkb25seSBjaGF0cz86IFRhYmxlUmVzcG9uc2VbXVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVXNlckluZm9SZXF1ZXN0IGltcGxlbWVudHMgUmVxdWVzdFdyYXBwZXI8VXNlclJlc3BvbnNlPntcclxuICAgIHJlYWRvbmx5IHBhcmFtZXRlcnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXJhbWV0ZXJzOiB7IGluY2x1ZGVDaGF0cz86IGJvb2xlYW4gfSkge1xyXG4gICAgICAgIGxldCBwYXJhbXM6IGFueSA9IHt9XHJcbiAgICAgICAgaWYocGFyYW1ldGVycy5pbmNsdWRlQ2hhdHMpXHJcbiAgICAgICAgICAgIHBhcmFtcy5pbmNsdWRlQ2hhdHMgPSBwYXJhbWV0ZXJzLmluY2x1ZGVDaGF0cz8udG9TdHJpbmcoKVxyXG5cclxuICAgICAgICB0aGlzLnBhcmFtZXRlcnMgPSBwYXJhbXNcclxuICAgIH1cclxuXHJcbiAgICByZWFkb25seSBlbmRwb2ludDogc3RyaW5nID0gXCIvdXNlci9pbmZvXCI7XHJcbiAgICByZWFkb25seSBtZXRob2RUeXBlOiBNZXRob2RUeXBlID0gTWV0aG9kVHlwZS5HRVQ7XHJcblxyXG4gICAgYXN5bmMgcHJvY2VlZFJlcXVlc3QocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTxVc2VyUmVzcG9uc2U+IHtcclxuICAgICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xyXG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHRleHQpIGFzIFVzZXJSZXNwb25zZTtcclxuICAgIH1cclxufSJdfQ==
