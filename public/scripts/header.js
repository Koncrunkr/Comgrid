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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJUU2NyaXB0L2hlYWRlclNjcmlwdC50cyIsIlRTY3JpcHQvaW5kZXgudHMiLCJUU2NyaXB0L3V0aWwvSHR0cENsaWVudC50cyIsIlRTY3JpcHQvdXRpbC9yZXF1ZXN0L0NyZWF0ZVRhYmxlUmVxdWVzdC50cyIsIlRTY3JpcHQvdXRpbC9yZXF1ZXN0L0lzTG9nZ2VkSW5SZXF1ZXN0LnRzIiwiVFNjcmlwdC91dGlsL3JlcXVlc3QvVXNlckluZm9SZXF1ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxzRUFBbUU7QUFDbkUsZ0RBQTZDO0FBQzdDLGtFQUErRDtBQUMvRCxpQ0FBaUM7QUFFakMsSUFBSSxJQUFJLEdBQUc7SUFDUCxNQUFNLEVBQUUsRUFBRTtDQUNiLENBQUE7QUFFRCxNQUFNLENBQUMsTUFBTSxHQUFHO0lBQ1osSUFBSSxVQUFVLEdBQUcsSUFBSSx1QkFBVSxDQUFDLHlCQUF5QixDQUFDLENBQUM7SUFDM0QsVUFBVSxDQUFDLGNBQWMsQ0FDckIsSUFBSSxxQ0FBaUIsRUFBRSxFQUN2QjtRQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUNsQyxDQUFDLENBQ0osQ0FBQyxJQUFJLENBQUMsVUFBQyxRQUFRO1FBQ1osQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUV0QyxVQUFVLENBQUMsY0FBYyxDQUNyQixJQUFJLGlDQUFlLENBQUMsRUFBQyxZQUFZLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FDN0MsQ0FBQyxJQUFJLENBQUMsVUFBQSxRQUFRO1lBQ1gsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFPLFFBQVEsQ0FBQyxFQUFFLENBQUUsQ0FBQyxDQUFDO1lBQzNDLFlBQVksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxFQUFFLENB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M0M7SUFDTCxzQkFBQztBQUFELENBbEJBLEFBa0JDLElBQUE7QUFsQlksMENBQWUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQge0lzTG9nZ2VkSW5SZXF1ZXN0fSBmcm9tIFwiLi91dGlsL3JlcXVlc3QvSXNMb2dnZWRJblJlcXVlc3RcIjtcclxuaW1wb3J0IHtIdHRwQ2xpZW50fSBmcm9tIFwiLi91dGlsL0h0dHBDbGllbnRcIjtcclxuaW1wb3J0IHtVc2VySW5mb1JlcXVlc3R9IGZyb20gXCIuL3V0aWwvcmVxdWVzdC9Vc2VySW5mb1JlcXVlc3RcIjtcclxuaW1wb3J0IHsgb25Mb2FkIH0gZnJvbSBcIi4vaW5kZXhcIjtcclxuXHJcbmxldCBpbmZvID0ge1xyXG4gICAgdXNlcklkOiAnJ1xyXG59XHJcblxyXG53aW5kb3cub25sb2FkID0gKCkgPT4ge1xyXG4gICAgbGV0IGh0dHBDbGllbnQgPSBuZXcgSHR0cENsaWVudChcImh0dHBzOi8vY29tZ3JpZC5ydTo4NDQzXCIpO1xyXG4gICAgaHR0cENsaWVudC5wcm9jZWVkUmVxdWVzdChcclxuICAgICAgICBuZXcgSXNMb2dnZWRJblJlcXVlc3QoKSxcclxuICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidW5hdXRob3JpemF0ZWRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgKS50aGVuKChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICQoJy5jbGlja2FibGUnKS50b2dnbGVDbGFzcygnZC1ub25lJyk7XHJcblxyXG4gICAgICAgIGh0dHBDbGllbnQucHJvY2VlZFJlcXVlc3QoXHJcbiAgICAgICAgICAgIG5ldyBVc2VySW5mb1JlcXVlc3Qoe2luY2x1ZGVDaGF0czogZmFsc2V9KVxyXG4gICAgICAgICkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICQoJyNpZC1rZWVwZXInKS50ZXh0KGBpZDogJHtyZXNwb25zZS5pZH1gKTtcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ1c2VySWRcIiwgcmVzcG9uc2UuaWQpO1xyXG4gICAgICAgICAgICBvbkxvYWQoKVxyXG4gICAgICAgIH0pXHJcbiAgICB9KVxyXG59IiwiaW1wb3J0IHtIdHRwQ2xpZW50fSBmcm9tIFwiLi91dGlsL0h0dHBDbGllbnRcIjtcclxuaW1wb3J0IHtDcmVhdGVUYWJsZVJlcXVlc3R9IGZyb20gXCIuL3V0aWwvcmVxdWVzdC9DcmVhdGVUYWJsZVJlcXVlc3RcIjtcclxuaW1wb3J0IHtVc2VySW5mb1JlcXVlc3R9IGZyb20gXCIuL3V0aWwvcmVxdWVzdC9Vc2VySW5mb1JlcXVlc3RcIjtcclxuaW1wb3J0IHtJc0xvZ2dlZEluUmVxdWVzdH0gZnJvbSBcIi4vdXRpbC9yZXF1ZXN0L0lzTG9nZ2VkSW5SZXF1ZXN0XCI7XHJcblxyXG5sZXQgc3RvcmU6IGFueSA9IHtcclxuICAgIGRpYWxvZ3MyOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZDogMCxcclxuICAgICAgICAgICAgbmFtZTogJ9CS0LjRgtCw0LvRjyDQuCDQutC+0LzQv9Cw0L3QuNGPJyxcclxuICAgICAgICAgICAgbGFzdFNlbmRlcjogJ9CS0LjRgtCw0LvRjycsXHJcbiAgICAgICAgICAgIGxhc3RNZXNzYWdlOiAn0J/RgNC40LLQtdGCLCDQv9GA0LjRhdC+0LTQuCDQv9C40YLRjCDQutGA0L7QstGMJyxcclxuICAgICAgICAgICAgdGltZTogJ9Cy0YfQtdGA0LAnLFxyXG4gICAgICAgICAgICBtZXNzYWdlc0NvdW50OiA1MSxcclxuICAgICAgICAgICAgYXZhdGFyOiAnLi9waWN0dXJlcy8xLnBuZycsXHJcbiAgICAgICAgICAgIHdpZHRoOiAxMDAsXHJcbiAgICAgICAgICAgIGhlaWdodDogMTIwXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlkOiAxLFxyXG4gICAgICAgICAgICBuYW1lOiAn0JHQtdGB0LXQtNCwINC90LUg0LTQu9GPINCz0LvRg9C/0YvRhScsXHJcbiAgICAgICAgICAgIGxhc3RTZW5kZXI6ICfQmtGC0L7QotC+INCd0LXQk9C70YPQv9GL0LknLFxyXG4gICAgICAgICAgICBsYXN0TWVzc2FnZTogJ9Ch0LrQvtC70YzQutC+INCx0YPQtNC10YIgMisyPycsXHJcbiAgICAgICAgICAgIHRpbWU6ICfQstGH0LXRgNCwJyxcclxuICAgICAgICAgICAgbWVzc2FnZXNDb3VudDogMTcsXHJcbiAgICAgICAgICAgIGF2YXRhcjogJy4vcGljdHVyZXMvMi5wbmcnLFxyXG4gICAgICAgICAgICB3aWR0aDogMTAsXHJcbiAgICAgICAgICAgIGhlaWdodDogMTEyXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlkOiAyLFxyXG4gICAgICAgICAgICBuYW1lOiAn0JHQtdGB0LXQtNCwINGC0L7Qu9GM0LrQviDQtNC70Y8g0LPQu9GD0L/Ri9GFJyxcclxuICAgICAgICAgICAgbGFzdFNlbmRlcjogJ9Ch0LDQvNGL0Lkg0JPQu9GD0L/Ri9C5JyxcclxuICAgICAgICAgICAgbGFzdE1lc3NhZ2U6ICfQoNC10LHRj9GC0LAsINGPINGC0L7Qu9GM0LrQviDRh9GC0L4g0LTQvtC60LDQt9Cw0Lsg0LPQuNC/0L7RgtC10LfRgyDQoNC40LzQsNC90LAhINCa0L7RgNC+0YfQtSwg0YLQsNC8INCy0YHRkSDQv9GA0L7RgdGC0L4hJyxcclxuICAgICAgICAgICAgdGltZTogJzExOjMwJyxcclxuICAgICAgICAgICAgbWVzc2FnZXNDb3VudDogMCxcclxuICAgICAgICAgICAgYXZhdGFyOiAnLi9waWN0dXJlcy8zLnBuZycsXHJcbiAgICAgICAgICAgIHdpZHRoOiAyMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiA0MFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZDogMyxcclxuICAgICAgICAgICAgbmFtZTogJ9CR0LXRgdC10LTQsCDRgSDQvtGH0LXQvdGMINC00LvQuNC90L3Ri9C8INC90LDQt9Cy0LDQvdC40LXQvC4g0KDQtdCx0Y/RgtCwLCDRjyDQvdC1INC/0YDQtdC00YHRgtCw0LLQu9GP0Y4g0LrQvtC80YMg0LIg0LPQvtC70L7QstGDINC/0YDQuNGI0LvQviDQtNCw0LLQsNGC0Ywg0YLQsNC60L7QtSDQtNC70LjQvdC90L7QtSDQvdCw0LfQstCw0L3QuNC1LiDQoNC10LHRj9GC0LAsINC/0YDQtdC00LvQsNCz0LDRjiDQvtCz0YDQsNC90LjRh9C40YLRjCDQtNC70LjQvdGDINC90LDQt9Cy0LDQvdC40LknLFxyXG4gICAgICAgICAgICBsYXN0U2VuZGVyOiAn0JLQuNGC0LDQu9GPJyxcclxuICAgICAgICAgICAgbGFzdE1lc3NhZ2U6ICfQn9GA0LjQstC10YIsINCz0LvRj9C90Ywg0LvRgScsXHJcbiAgICAgICAgICAgIHRpbWU6ICcxNDoxNScsXHJcbiAgICAgICAgICAgIG1lc3NhZ2VzQ291bnQ6IDAsXHJcbiAgICAgICAgICAgIGF2YXRhcjogJy4vcGljdHVyZXMvNC5wbmcnLFxyXG4gICAgICAgICAgICB3aWR0aDogMTAwMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiAxMDAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlkOiA0LFxyXG4gICAgICAgICAgICBuYW1lOiAn0JLQuNGC0LDQu9GPINCi0YDRg9Cx0L7QtdC0JyxcclxuICAgICAgICAgICAgbGFzdFNlbmRlcjogJycsXHJcbiAgICAgICAgICAgIGxhc3RNZXNzYWdlOiAn0JTQsNCy0L3QviDRh9C40YLQsNC7INCx0LXRgdC10LTRgz8nLFxyXG4gICAgICAgICAgICB0aW1lOiAnMTk6NTEnLFxyXG4gICAgICAgICAgICBtZXNzYWdlc0NvdW50OiA0LFxyXG4gICAgICAgICAgICBhdmF0YXI6ICcuL3BpY3R1cmVzLzUucG5nJyxcclxuICAgICAgICAgICAgd2lkdGg6IDEwMDAsXHJcbiAgICAgICAgICAgIGhlaWdodDogNTAwXHJcbiAgICAgICAgfVxyXG4gICAgXVxyXG59XHJcbmxldCBsaW5rID0gXCJodHRwczovL2NvbWdyaWQucnU6ODQ0M1wiO1xyXG5jb25zdCBodHRwQ2xpZW50ID0gbmV3IEh0dHBDbGllbnQobGluaylcclxubGV0IGxlZnRCdXR0b25DbGlja2VkID0gZmFsc2U7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gb25Mb2FkKCl7XHJcbiAgICBsb2FkU3RvcmUoKVxyXG4gICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICBkcmF3RGlhbG9ncygpXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICQoJy5jbGlja2FibGUnKS5vbignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgJCgnLmNsaWNrYWJsZScpLnRvZ2dsZUNsYXNzKCdkLW5vbmUnKVxyXG4gICAgfSk7XHJcbiAgICBsZXQgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFibGUtaW1hZ2UtZmlsZS1pbnB1dCcpO1xyXG4gICAgaW5wdXQub25jaGFuZ2UgPSAoKSA9PiBzaG93SW1hZ2UoaW5wdXQpO1xyXG4gICAgJChcIiNzaG93ZXJcIikub24oXCJkcmFnc3RhcnRcIiwgKCkgPT4gZmFsc2UpO1xyXG4gICAgJChcIiNzaG93ZXItY3V0XCIpLm9uKFwiZHJhZ3N0YXJ0XCIsICgpID0+IGZhbHNlKTtcclxuICAgICQoXCIjc2F2ZS1jYW52YXNcIikub24oXCJjbGlja1wiLCBzYXZlQ2FudmFzKTtcclxuICAgICQoJyNjcmVhdGUtdGFibGUtZm9ybScpLm9uKCdzdWJtaXQnLCBzdWJtaXQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkcmF3RGlhbG9ncygpIHtcclxuICAgIGxldCAkY29udGFpbmVyID0gJCgnLmNoYXQtY29udGFpbmVyJyk7XHJcbiAgICBsZXQgJG5vRGVsID0gJGNvbnRhaW5lci5maW5kKCcubm8tZGVsZXRhYmxlJyk7XHJcbiAgICAkY29udGFpbmVyLmh0bWwoJycpO1xyXG4gICAgJGNvbnRhaW5lci5hcHBlbmQoJG5vRGVsKTtcclxuICAgIHN0b3JlLmRpYWxvZ3Muc2xpY2UoKS5yZXZlcnNlKCkuZm9yRWFjaCgoZGlhbG9nLCBpbmRleCkgPT4ge1xyXG4gICAgICAgIGxldCBkaWFsb2cyID0gc3RvcmUuZGlhbG9nczJbaW5kZXggJSBzdG9yZS5kaWFsb2dzMi5sZW5ndGhdO1xyXG4gICAgICAgIGxldCAkY2hhdCA9ICQoJy5jaGF0JykuY2xvbmUoKTtcclxuICAgICAgICAkY2hhdC5yZW1vdmVDbGFzcygnY2hhdCBkLW5vbmUnKTtcclxuICAgICAgICAkY2hhdC5maW5kKCdhJykuYXR0cignaHJlZicsICdwYWdlcy90YWJsZT9pZD0nICsgZGlhbG9nLmlkKTtcclxuICAgICAgICAkY2hhdC5maW5kKCcuY2hhdC1uYW1lJykudGV4dChkaWFsb2cubmFtZSk7XHJcbiAgICAgICAgJGNoYXQuZmluZCgnLmNoYXQtc2VuZGVyJykudGV4dChkaWFsb2cyLmxhc3RTZW5kZXIgKyAoZGlhbG9nMi5sYXN0U2VuZGVyID09PSAnJyA/ICcnIDogJzonKSk7XHJcbiAgICAgICAgJGNoYXQuZmluZCgnLmNoYXQtdGV4dCcpLnRleHQoZGlhbG9nMi5sYXN0TWVzc2FnZSk7XHJcbiAgICAgICAgJGNoYXQuZmluZCgnLmNoYXQtdGltZScpLnRleHQoZGlhbG9nMi50aW1lKTtcclxuICAgICAgICBpZihkaWFsb2cuYXZhdGFyLnN0YXJ0c1dpdGgoXCIvXCIpKVxyXG4gICAgICAgICAgICBkaWFsb2cuYXZhdGFyID0gbGluayArIGRpYWxvZy5hdmF0YXJcclxuICAgICAgICBsZXQgJGltZyA9ICRjaGF0LmZpbmQoJ2ltZycpO1xyXG4gICAgICAgICRpbWcuYXR0cignc3JjJywgZGlhbG9nLmF2YXRhcik7XHJcbiAgICAgICAgJGltZ1swXS5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCB3aWR0aCA9ICRpbWdbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XHJcbiAgICAgICAgICAgICRpbWcuaGVpZ2h0KHdpZHRoKTtcclxuICAgICAgICAgICAgJGltZy53aWR0aCh3aWR0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICRjaGF0LmZpbmQoJy5jaGF0LXNpemUnKS50ZXh0KGRpYWxvZy53aWR0aCArICfDlycgKyBkaWFsb2cuaGVpZ2h0KVxyXG4gICAgICAgIGRpYWxvZzIubWVzc2FnZXNDb3VudCA9PT0gMFxyXG4gICAgICAgICAgICA/ICRjaGF0LmZpbmQoJy5jaGF0LXVucmVhZCcpLnJlbW92ZSgpXHJcbiAgICAgICAgICAgIDogJGNoYXQuZmluZCgnLmNoYXQtdW5yZWFkJykudGV4dChkaWFsb2cyLm1lc3NhZ2VzQ291bnQpO1xyXG4gICAgICAgICRjb250YWluZXIuYXBwZW5kKCRjaGF0KTtcclxuICAgICAgICAkY2hhdC5vbignbW91c2VlbnRlcicsICgpID0+IHtcclxuICAgICAgICAgICAgJGNoYXQucmVtb3ZlQ2xhc3MoJ2JnLWxpZ2h0JylcclxuICAgICAgICB9KTtcclxuICAgICAgICAkY2hhdC5vbignbW91c2VsZWF2ZScsICgpID0+IHtcclxuICAgICAgICAgICAgJGNoYXQuYWRkQ2xhc3MoJ2JnLWxpZ2h0JylcclxuICAgICAgICB9KTtcclxuICAgICAgICAkY2hhdC5vbignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGRpYWxvZy5tZXNzYWdlc0NvdW50ID0gMDtcclxuICAgICAgICAgICAgZHJhd0RpYWxvZ3MoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzdWJtaXQoKSB7XHJcbiAgICBjb25zdCBhdmF0YXJGaWxlID0gKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YWJsZS1pbWFnZS1maWxlLWlucHV0JykgYXMgSFRNTElucHV0RWxlbWVudCk/LmZpbGVzWzBdO1xyXG4gICAgbGV0IGF2YXRhckxpbmsgPSAkKCcjdGFibGUtaW1hZ2UtbGluay1pbnB1dCcpLnZhbCgpO1xyXG4gICAgaWYoYXZhdGFyTGluayA9PT0gXCJcIiAmJiBhdmF0YXJGaWxlID09PSBudWxsKXtcclxuICAgICAgICBhbGVydChcIllvdSBtdXN0IHNwZWNpZnkgZWl0aGVyIGltYWdlIG9yIGxpbmsgdG8gaW1hZ2VcIik7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgbGV0IGhlaWdodCA9ICQoJyN0YWJsZS1oZWlnaHQtaW5wdXQnKS52YWwoKTtcclxuICAgIGxldCB3aWR0aCA9ICQoJyN0YWJsZS13aWR0aC1pbnB1dCcpLnZhbCgpO1xyXG4gICAgaWYoKCtoZWlnaHQpICogKCt3aWR0aCkgPiAxMDAwMCkge1xyXG4gICAgICAgIGFsZXJ0KFwi0KDQsNC30LzQtdGAINGC0LDQsdC70LjRhtGLINC90LUg0LzQvtC20LXRgiDQv9GA0LXQstGL0YjQsNGC0YwgMTAwMDAg0Y/Rh9C10LXQulwiKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBpZigraGVpZ2h0IDw9IDAgfHwgK3dpZHRoIDw9IDApIHtcclxuICAgICAgICBhbGVydChcItCd0LXQv9C+0LvQvtC20LjRgtC10LvRjNC90YvQtSDRgNCw0LfQvNC10YDRiz8g0KfRgtC+0LHRiyDQvtGC0L/RgNCw0LLQu9GP0YLRjCDQvdC10YHRg9GJ0LXRgdGC0LLRg9GO0YnQuNC1INGB0L7QvtCx0YnQtdC90LjRjz8g0JrRgNGD0YLQviwg0L3QuNGH0LXQs9C+INC90LUg0YHQutCw0LbQtdGI0YwsINC90L4g0L3QtdC70YzQt9GPXCIpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGxldCBpbWFnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2hvd2VyXCIpIGFzIEhUTUxJbWFnZUVsZW1lbnQ7XHJcbiAgICBjb25zb2xlLmxvZyhpbWFnZS5uYXR1cmFsSGVpZ2h0LCBpbWFnZS5uYXR1cmFsV2lkdGgpO1xyXG4gICAgaWYoaW1hZ2UubmF0dXJhbEhlaWdodCAhPT0gaW1hZ2UubmF0dXJhbFdpZHRoKSB7XHJcbiAgICAgICAgYWxlcnQoXCLQmtCw0YDRgtC40L3QutCwINC00L7Qu9C20L3QsCDQsdGL0YLRjCDQutCy0LDQtNGA0LDRgtC90L7QuS4g0J7QsdGA0LXQttGM0YLQtSDQtdGRIVwiKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBjb25zdCBuZXdUYWJsZSA9IG5ldyBDcmVhdGVUYWJsZVJlcXVlc3Qoe1xyXG4gICAgICAgIG5hbWU6ICQoJyN0YWJsZS1uYW1lLWlucHV0JykudmFsKCkgYXMgc3RyaW5nLFxyXG4gICAgICAgIHdpZHRoOiB3aWR0aCBhcyBudW1iZXIsXHJcbiAgICAgICAgaGVpZ2h0OiBoZWlnaHQgYXMgbnVtYmVyLFxyXG4gICAgICAgIGF2YXRhckxpbms6IGF2YXRhckxpbmsgYXMgc3RyaW5nLFxyXG4gICAgICAgIGF2YXRhckZpbGU6IGF2YXRhckZpbGVcclxuICAgIH0pXHJcblxyXG4gICAgcG9zdFRhYmxlKG5ld1RhYmxlKVxyXG4gICAgLnRoZW4oKHRhYmxlKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2codGFibGUpXHJcbiAgICAgICAgbG9hZFN0b3JlKCkudGhlbihkcmF3RGlhbG9ncylcclxuICAgIH0pO1xyXG4gICAgY2xlYXJNZW51KCk7XHJcbiAgICBjbG9zZU1lbnUoKTtcclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZnVuY3Rpb24gcG9zdFRhYmxlKHRhYmxlKSB7XHJcbiAgICByZXR1cm4gaHR0cENsaWVudC5wcm9jZWVkUmVxdWVzdChcclxuICAgICAgICB0YWJsZSxcclxuICAgICAgICAoY29kZSwgZXJyb3JUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGFsZXJ0KGBFcnJvciBoYXBwZW5lZCB3aGlsZSBjcmVhdGluZyB0YWJsZTogJHtjb2RlfSwgJHtlcnJvclRleHR9YClcclxuICAgICAgICB9XHJcbiAgICApXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNsZWFyTWVudSgpIHtcclxuICAgICQoJyNjbGVhci1idXR0b24nKS5jbGljaygpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjbG9zZU1lbnUoKSB7XHJcbiAgICAkKCcjY2xvc2UtYnV0dG9uJykuY2xpY2soKTtcclxufVxyXG5cclxuZnVuY3Rpb24gbG9hZFN0b3JlKCkge1xyXG4gICAgcmV0dXJuIGh0dHBDbGllbnQucHJvY2VlZFJlcXVlc3QoXHJcbiAgICAgICAgbmV3IFVzZXJJbmZvUmVxdWVzdCh7IGluY2x1ZGVDaGF0czogdHJ1ZSB9KSxcclxuICAgICAgICAoY29kZSwgZXJyb3JUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGFsZXJ0KGBFcnJvciBoYXBwZW5lZCB3aGlsZSBsb2FkaW5nIHVzZXIgaW5mbzogJHtjb2RlfSwgJHtlcnJvclRleHR9YClcclxuICAgICAgICB9XHJcbiAgICApLnRoZW4odXNlciA9PiB7XHJcbiAgICAgICAgc3RvcmUuZGlhbG9ncyA9IHVzZXIuY2hhdHM7XHJcbiAgICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBzaG93SW1hZ2UoaW5wdXQpIHtcclxuICAgIGlmIChpbnB1dC5maWxlcyAmJiBpbnB1dC5maWxlc1swXSkge1xyXG4gICAgICAgIGxldCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG4gICAgICAgIGxldCBzaG93ZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2hvd2VyJykgYXMgSFRNTEltYWdlRWxlbWVudDtcclxuICAgICAgICBjb25zb2xlLmxvZyhzaG93ZXIubmF0dXJhbFdpZHRoLCBzaG93ZXIubmF0dXJhbEhlaWdodCk7XHJcblxyXG4gICAgICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIHNob3dlci5jbGFzc0xpc3QucmVtb3ZlKCdkLW5vbmUnKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBtZXRob2QgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGFyayA9ICQoJy5kYXJrLWJhY2tncm91bmQnKTtcclxuICAgICAgICAgICAgICAgIHNob3dlci53aWR0aCA9IDUwMDtcclxuICAgICAgICAgICAgICAgIHNob3dlci5oZWlnaHQgPSBzaG93ZXIubmF0dXJhbEhlaWdodCAqIHNob3dlci53aWR0aCAvIHNob3dlci5uYXR1cmFsV2lkdGg7XHJcbiAgICAgICAgICAgICAgICBkYXJrLnJlbW92ZUNsYXNzKCdkLW5vbmUnKTtcclxuICAgICAgICAgICAgICAgIGRhcmsud2lkdGgoc2hvd2VyLndpZHRoKTtcclxuICAgICAgICAgICAgICAgIGRhcmsuaGVpZ2h0KHNob3dlci5oZWlnaHQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBzaG93ZXJDdXQ6IEhUTUxDYW52YXNFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Nob3dlci1jdXQnKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgICAgICAgICAgICAgIHNob3dlckN1dC5jbGFzc0xpc3QucmVtb3ZlKCdkLW5vbmUnKTtcclxuICAgICAgICAgICAgICAgIHNob3dlckN1dC53aWR0aCA9IHNob3dlci53aWR0aCAqIDIgLyAzO1xyXG4gICAgICAgICAgICAgICAgc2hvd2VyQ3V0LmhlaWdodCA9IHNob3dlci53aWR0aCAqIDIgLyAzO1xyXG4gICAgICAgICAgICAgICAgbGV0IG9mZnNldCA9IHNob3dlci53aWR0aCAvIDY7XHJcbiAgICAgICAgICAgICAgICBzaG93ZXJDdXQuc3R5bGUudG9wID0gYCR7b2Zmc2V0fXB4YDtcclxuICAgICAgICAgICAgICAgIHNob3dlckN1dC5zdHlsZS5sZWZ0ID0gYCR7b2Zmc2V0fXB4YDtcclxuXHJcbiAgICAgICAgICAgICAgICBzaG93ZXJDdXQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgc2hvd2VyQ3V0TW92ZSk7XHJcbiAgICAgICAgICAgICAgICBzaG93ZXJDdXQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgc2hvd2VyQ3V0TW92ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGNvbnRleHQgPSBzaG93ZXJDdXQuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuZHJhd0ltYWdlKHNob3dlciwgLW9mZnNldCwgLW9mZnNldCwgc2hvd2VyLndpZHRoLCBzaG93ZXIud2lkdGgpO1xyXG4gICAgICAgICAgICAgICAgLy9jb250ZXh0LnN0cm9rZVJlY3QoMCwgMCwgc2hvd2VyLndpZHRoLCBzaG93ZXIud2lkdGgpO1xyXG4gICAgICAgICAgICAgICAgc2hvd2VyLnNldEF0dHJpYnV0ZSgnc3JjJywgZS50YXJnZXQucmVzdWx0IGFzIHN0cmluZyk7XHJcbiAgICAgICAgICAgICAgICBzaG93ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignbG9hZCcsIG1ldGhvZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgJCgnI3NhdmUtY2FudmFzJykucmVtb3ZlQ2xhc3MoJ2Qtbm9uZScpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzaG93ZXIuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIG1ldGhvZCk7XHJcbiAgICAgICAgICAgIHNob3dlci5zZXRBdHRyaWJ1dGUoJ3NyYycsIGUudGFyZ2V0LnJlc3VsdCBhcyBzdHJpbmcpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGlucHV0LmZpbGVzWzBdKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gc2F2ZUNhbnZhcygpIHtcclxuICAgIGxldCBzaG93ZXJDdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2hvd2VyLWN1dCcpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgbGV0IGtlZXBlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaG93ZXInKSBhcyBIVE1MSW1hZ2VFbGVtZW50O1xyXG5cclxuXHJcbiAgICBzaG93ZXJDdXQudG9CbG9iKGJsb2IgPT4ge1xyXG4gICAgICAgIGxldCBkdCA9IG5ldyBEYXRhVHJhbnNmZXIoKTtcclxuICAgICAgICBkdC5pdGVtcy5hZGQobmV3IEZpbGUoW2Jsb2JdLCAnaW1hZ2UucG5nJywge3R5cGU6ICdpbWFnZS9wbmcnfSkpO1xyXG4gICAgICAgIGxldCBmaWxlX2xpc3QgPSBkdC5maWxlcztcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coJ9Ca0L7Qu9C70LXQutGG0LjRjyDRhNCw0LnQu9C+0LIg0YHQvtC30LTQsNC90LA6Jyk7XHJcbiAgICAgICAgY29uc29sZS5kaXIoZmlsZV9saXN0KTtcclxuXHJcbiAgICAgICAgbGV0IGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RhYmxlLWltYWdlLWZpbGUtaW5wdXQnKSBhcyBIVE1MSW5wdXRFbGVtZW50XHJcbiAgICAgICAgaW5wdXQuZmlsZXMgPSBmaWxlX2xpc3Q7XHJcbiAgICAgICAgc2hvd0ltYWdlKGlucHV0KTtcclxuICAgIH0pXHJcbn1cclxuXHJcbmxldCBzaG93ZXJDdXRNb3ZlID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgIGxldCBzaG93ZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2hvd2VyLWN1dCcpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgbGV0IGtlZXBlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaG93ZXInKSBhcyBIVE1MSW1hZ2VFbGVtZW50O1xyXG4gICAgbGV0IGJvdW5kaW5nID0ga2VlcGVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgbGV0IHNoaWZ0WCA9IGV2ZW50LmNsaWVudFggLSBzaG93ZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdDtcclxuICAgIGxldCBzaGlmdFkgPSBldmVudC5jbGllbnRZIC0gc2hvd2VyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcDtcclxuXHJcbiAgICBzaG93ZXIuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xyXG5cclxuICAgIG1vdmVBdChldmVudC5wYWdlWCwgZXZlbnQucGFnZVkpO1xyXG5cclxuICAgIGZ1bmN0aW9uIG1vdmVBdChwYWdlWCwgcGFnZVkpIHtcclxuICAgICAgICBsZXQgbGVmdCA9IE1hdGgubWluKE1hdGgubWF4KHBhZ2VYIC0gc2hpZnRYIC0gYm91bmRpbmcubGVmdCwgMCksIGJvdW5kaW5nLndpZHRoIC0gc2hvd2VyLndpZHRoKTtcclxuICAgICAgICBsZXQgdG9wID0gTWF0aC5taW4oTWF0aC5tYXgocGFnZVkgLSBzaGlmdFkgLSBib3VuZGluZy50b3AsIDApLCBib3VuZGluZy5oZWlnaHQgLSBzaG93ZXIuaGVpZ2h0KTtcclxuICAgICAgICBzaG93ZXIuc3R5bGUubGVmdCA9IGxlZnQgKyAncHgnO1xyXG4gICAgICAgIHNob3dlci5zdHlsZS50b3AgPSB0b3AgKyAncHgnO1xyXG4gICAgICAgIGxldCBjb250ZXh0ID0gc2hvd2VyLmdldENvbnRleHQoJzJkJylcclxuICAgICAgICBjb250ZXh0LmNsZWFyUmVjdCgwLCAwLCBib3VuZGluZy53aWR0aCwgYm91bmRpbmcuaGVpZ2h0KTtcclxuICAgICAgICBjb250ZXh0LmRyYXdJbWFnZShrZWVwZXIsIC1sZWZ0LCAtdG9wLCBib3VuZGluZy53aWR0aCwgYm91bmRpbmcuaGVpZ2h0KTtcclxuICAgICAgICAvL2NvbnRleHQuc3Ryb2tlUmVjdCgwLCAwLCBzaG93ZXIud2lkdGgsIHNob3dlci5oZWlnaHQpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHJlc2l6ZShpbmNyZWFzZTogYm9vbGVhbikge1xyXG4gICAgICAgIGxldCB3aWR0aCA9IE1hdGgubWluKHNob3dlci53aWR0aCArIChpbmNyZWFzZSA/IDYgOiAtNiksIGJvdW5kaW5nLndpZHRoLCBib3VuZGluZy5oZWlnaHQpO1xyXG4gICAgICAgIHNob3dlci53aWR0aCA9IHdpZHRoO1xyXG4gICAgICAgIHNob3dlci5oZWlnaHQgPSB3aWR0aDtcclxuICAgICAgICBsZXQgYm91bmRpbmdJbiA9IHNob3dlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgICAgICAgbGV0IGxlZnQgPSBNYXRoLm1pbihNYXRoLm1heCgrc2hvd2VyLnN0eWxlLmxlZnQuc2xpY2UoMCwtMiksIDApLCBib3VuZGluZy53aWR0aCAtIHNob3dlci53aWR0aCk7XHJcbiAgICAgICAgbGV0IHRvcCA9IE1hdGgubWluKE1hdGgubWF4KCtzaG93ZXIuc3R5bGUudG9wLnNsaWNlKDAsLTIpLCAwKSwgYm91bmRpbmcuaGVpZ2h0IC0gc2hvd2VyLmhlaWdodCk7XHJcbiAgICAgICAgc2hvd2VyLnN0eWxlLmxlZnQgPSBsZWZ0ICsgJ3B4JztcclxuICAgICAgICBzaG93ZXIuc3R5bGUudG9wID0gdG9wICsgJ3B4JztcclxuICAgICAgICBsZXQgY29udGV4dCA9IHNob3dlci5nZXRDb250ZXh0KCcyZCcpXHJcbiAgICAgICAgY29udGV4dC5jbGVhclJlY3QoMCwgMCwgYm91bmRpbmcud2lkdGgsIGJvdW5kaW5nLmhlaWdodCk7XHJcbiAgICAgICAgY29udGV4dC5kcmF3SW1hZ2Uoa2VlcGVyLCAtbGVmdCwgLXRvcCwgYm91bmRpbmcud2lkdGgsIGJvdW5kaW5nLmhlaWdodCk7XHJcbiAgICAgICAgLy9jb250ZXh0LnN0cm9rZVJlY3QoMCwgMCwgc2hvd2VyLndpZHRoLCBzaG93ZXIuaGVpZ2h0KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBvbk1vdXNlTW92ZShldmVudDogTW91c2VFdmVudCkge1xyXG4gICAgICAgIGlmIChldmVudC5jdHJsS2V5KSB7XHJcbiAgICAgICAgICAgIGxldCBuZXdTaGlmdFggPSBldmVudC5jbGllbnRYIC0gc2hvd2VyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQ7XHJcbiAgICAgICAgICAgIGxldCBuZXdTaGlmdFkgPSBldmVudC5jbGllbnRZIC0gc2hvd2VyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcDtcclxuICAgICAgICAgICAgbGV0IGluY3JlYXNlID0gKG5ld1NoaWZ0WCAtIG5ld1NoaWZ0WSAtIHNoaWZ0WCArIHNoaWZ0WSkgPiAwO1xyXG4gICAgICAgICAgICBzaGlmdFggPSBuZXdTaGlmdFg7XHJcbiAgICAgICAgICAgIHNoaWZ0WSA9IG5ld1NoaWZ0WTtcclxuICAgICAgICAgICAgcmVzaXplKGluY3JlYXNlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBtb3ZlQXQoZXZlbnQucGFnZVgsIGV2ZW50LnBhZ2VZKTtcclxuICAgIH1cclxuXHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbk1vdXNlTW92ZSk7XHJcblxyXG4gICAgc2hvd2VyLm9ubW91c2V1cCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbk1vdXNlTW92ZSk7XHJcbiAgICAgICAgc2hvd2VyLm9ubW91c2V1cCA9IG51bGw7XHJcbiAgICB9O1xyXG59IiwiaW1wb3J0IHtSZXF1ZXN0V3JhcHBlcn0gZnJvbSBcIi4vcmVxdWVzdC9SZXF1ZXN0XCI7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEh0dHBDbGllbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBhcGlMaW5rOiBzdHJpbmcpIHt9XHJcblxyXG4gICAgYXN5bmMgcHJvY2VlZFJlcXVlc3Q8VD4oXHJcbiAgICAgICAgcmVxdWVzdDogUmVxdWVzdFdyYXBwZXI8VD4sXHJcbiAgICAgICAgb25GYWlsdXJlOiAoY29kZTogbnVtYmVyLCBlcnJvclRleHQ6IHN0cmluZykgPT4gdW5rbm93biA9XHJcbiAgICAgICAgICAgIChjb2RlLCBlcnJvclRleHQpID0+IGFsZXJ0KGBjb2RlOiAke2NvZGV9LCBlcnJvcjogJHtlcnJvclRleHR9YCksXHJcbiAgICAgICAgb25OZXR3b3JrRmFpbHVyZTogKHJlYXNvbikgPT4gdW5rbm93biA9XHJcbiAgICAgICAgICAgIChyZWFzb24pID0+IGFsZXJ0KGBuZXR3b3JrIGVycm9yOiAke3JlYXNvbn1gKVxyXG4gICAgKTogUHJvbWlzZTxUPntcclxuICAgICAgICBjb25zdCBmaW5hbExpbmsgPSBuZXcgVVJMKHRoaXMuYXBpTGluayArIHJlcXVlc3QuZW5kcG9pbnQpXHJcbiAgICAgICAgaWYocmVxdWVzdC5wYXJhbWV0ZXJzICE9IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgZmluYWxMaW5rLnNlYXJjaCA9IG5ldyBVUkxTZWFyY2hQYXJhbXMocmVxdWVzdC5wYXJhbWV0ZXJzKS50b1N0cmluZygpXHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKHJlcXVlc3QpXHJcbiAgICAgICAgcmV0dXJuIGZldGNoKFxyXG4gICAgICAgICAgICBmaW5hbExpbmsudG9TdHJpbmcoKSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwiaW5jbHVkZVwiLFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiByZXF1ZXN0Lm1ldGhvZFR5cGUsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiByZXF1ZXN0LmhlYWRlcnMsXHJcbiAgICAgICAgICAgICAgICBib2R5OiByZXF1ZXN0LmJvZHlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICkudGhlbihhc3luYyAocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgaWYocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucHJvY2VlZFJlcXVlc3QocmVzcG9uc2UpXHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZXJyb3JUZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xyXG4gICAgICAgICAgICAgICAgb25GYWlsdXJlKHJlc3BvbnNlLnN0YXR1cywgZXJyb3JUZXh0KTtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoZXJyb3JUZXh0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIE1ldGhvZFR5cGV7XHJcbiAgICBQT1NUPVwiUE9TVFwiLFxyXG4gICAgR0VUPVwiR0VUXCIsXHJcbiAgICBQQVRDSD1cIlBBVENIXCIsXHJcbiAgICBQVVQ9XCJQVVRcIixcclxuICAgIERFTEVURT1cIkRFTEVURVwiXHJcbn0iLCJpbXBvcnQge01ldGhvZFR5cGV9IGZyb20gXCIuLi9IdHRwQ2xpZW50XCI7XHJcbmltcG9ydCB7UmVxdWVzdFdyYXBwZXJ9IGZyb20gXCIuL1JlcXVlc3RcIjtcclxuaW1wb3J0IHtVc2VyUmVzcG9uc2V9IGZyb20gXCIuL1VzZXJJbmZvUmVxdWVzdFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRhYmxlUmVzcG9uc2Uge1xyXG4gICAgcmVhZG9ubHkgaWQhOiBudW1iZXJcclxuICAgIHJlYWRvbmx5IG5hbWUhOiBzdHJpbmdcclxuICAgIHJlYWRvbmx5IGNyZWF0b3IhOiBudW1iZXJcclxuICAgIHJlYWRvbmx5IHdpZHRoITogbnVtYmVyXHJcbiAgICByZWFkb25seSBoZWlnaHQhOiBudW1iZXJcclxuICAgIHJlYWRvbmx5IGF2YXRhciE6IG51bWJlclxyXG4gICAgcmVhZG9ubHkgY3JlYXRlZCE6IERhdGVcclxuICAgIHJlYWRvbmx5IGxhc3RNZXNzYWdlSWQ/OiBudW1iZXJcclxuICAgIHJlYWRvbmx5IHBhcnRpY2lwYW50cz86IFVzZXJSZXNwb25zZVtdXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDcmVhdGVUYWJsZVJlcXVlc3QgaW1wbGVtZW50cyBSZXF1ZXN0V3JhcHBlcjxUYWJsZVJlc3BvbnNlPiB7XHJcbiAgICByZWFkb25seSBib2R5PzogRm9ybURhdGFcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihib2R5OiB7XHJcbiAgICAgICAgbmFtZTogc3RyaW5nLFxyXG4gICAgICAgIHdpZHRoOiBudW1iZXIsXHJcbiAgICAgICAgaGVpZ2h0OiBudW1iZXIsXHJcbiAgICAgICAgYXZhdGFyRmlsZT86IEZpbGUsXHJcbiAgICAgICAgYXZhdGFyTGluaz86IHN0cmluZ1xyXG4gICAgfSkge1xyXG4gICAgICAgIHRoaXMuYm9keSA9IG5ldyBGb3JtRGF0YSgpXHJcbiAgICAgICAgdGhpcy5ib2R5LmFwcGVuZCgnbmFtZScsIGJvZHkubmFtZSlcclxuICAgICAgICB0aGlzLmJvZHkuYXBwZW5kKCd3aWR0aCcsIGJvZHkud2lkdGgudG9TdHJpbmcoKSlcclxuICAgICAgICB0aGlzLmJvZHkuYXBwZW5kKCdoZWlnaHQnLCBib2R5LmhlaWdodC50b1N0cmluZygpKVxyXG4gICAgICAgIGlmIChib2R5LmF2YXRhckxpbmsgPT0gdW5kZWZpbmVkICYmIGJvZHkuYXZhdGFyRmlsZSA9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3Qgc2VuZCByZXF1ZXN0IHdpdGggbm8gYXZhdGFyXCIpXHJcbiAgICAgICAgaWYgKGJvZHkuYXZhdGFyRmlsZSAhPSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRoaXMuYm9keS5hcHBlbmQoJ2F2YXRhckZpbGUnLCBib2R5LmF2YXRhckZpbGUpXHJcbiAgICAgICAgaWYgKGJvZHkuYXZhdGFyTGluayAhPSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRoaXMuYm9keS5hcHBlbmQoJ2F2YXRhckxpbmsnLCBib2R5LmF2YXRhckxpbmspXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgcHJvY2VlZFJlcXVlc3QocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTxUYWJsZVJlc3BvbnNlPiB7XHJcbiAgICAgICAgY29uc3QgdGV4dCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKVxyXG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHRleHQpIGFzIFRhYmxlUmVzcG9uc2VcclxuICAgIH1cclxuXHJcbiAgICBlbmRwb2ludDogc3RyaW5nID0gXCIvdGFibGUvY3JlYXRlXCI7XHJcbiAgICBtZXRob2RUeXBlOiBNZXRob2RUeXBlID0gTWV0aG9kVHlwZS5QT1NUO1xyXG59IiwiaW1wb3J0IHtSZXF1ZXN0V3JhcHBlcn0gZnJvbSBcIi4vUmVxdWVzdFwiO1xyXG5pbXBvcnQge01ldGhvZFR5cGV9IGZyb20gXCIuLi9IdHRwQ2xpZW50XCI7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIElzTG9nZ2VkSW5SZXF1ZXN0IGltcGxlbWVudHMgUmVxdWVzdFdyYXBwZXI8bnVtYmVyPntcclxuICAgIHJlYWRvbmx5IGVuZHBvaW50OiBzdHJpbmcgPSAnL3VzZXIvbG9naW4nO1xyXG4gICAgcmVhZG9ubHkgbWV0aG9kVHlwZTogTWV0aG9kVHlwZSA9IE1ldGhvZFR5cGUuR0VUO1xyXG5cclxuICAgIGFzeW5jIHByb2NlZWRSZXF1ZXN0KHJlc3BvbnNlOiBSZXNwb25zZSk6IFByb21pc2U8bnVtYmVyPiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnN0YXR1cztcclxuICAgIH1cclxufSIsImltcG9ydCB7UmVxdWVzdFdyYXBwZXJ9IGZyb20gXCIuL1JlcXVlc3RcIjtcclxuaW1wb3J0IHtUYWJsZVJlc3BvbnNlfSBmcm9tIFwiLi9DcmVhdGVUYWJsZVJlcXVlc3RcIjtcclxuaW1wb3J0IHtNZXRob2RUeXBlfSBmcm9tIFwiLi4vSHR0cENsaWVudFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFVzZXJSZXNwb25zZXtcclxuICAgIHJlYWRvbmx5IGlkITogc3RyaW5nXHJcbiAgICByZWFkb25seSBuYW1lITogc3RyaW5nXHJcbiAgICByZWFkb25seSBlbWFpbCE6IHN0cmluZ1xyXG4gICAgcmVhZG9ubHkgYXZhdGFyITogc3RyaW5nXHJcbiAgICByZWFkb25seSBjcmVhdGVkITogRGF0ZVxyXG4gICAgcmVhZG9ubHkgY2hhdHM/OiBUYWJsZVJlc3BvbnNlW11cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFVzZXJJbmZvUmVxdWVzdCBpbXBsZW1lbnRzIFJlcXVlc3RXcmFwcGVyPFVzZXJSZXNwb25zZT57XHJcbiAgICByZWFkb25seSBwYXJhbWV0ZXJzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+XHJcblxyXG4gICAgY29uc3RydWN0b3IocGFyYW1ldGVyczogeyBpbmNsdWRlQ2hhdHM/OiBib29sZWFuIH0pIHtcclxuICAgICAgICBsZXQgcGFyYW1zOiBhbnkgPSB7fVxyXG4gICAgICAgIGlmKHBhcmFtZXRlcnMuaW5jbHVkZUNoYXRzKVxyXG4gICAgICAgICAgICBwYXJhbXMuaW5jbHVkZUNoYXRzID0gcGFyYW1ldGVycy5pbmNsdWRlQ2hhdHM/LnRvU3RyaW5nKClcclxuXHJcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzID0gcGFyYW1zXHJcbiAgICB9XHJcblxyXG4gICAgcmVhZG9ubHkgZW5kcG9pbnQ6IHN0cmluZyA9IFwiL3VzZXIvaW5mb1wiO1xyXG4gICAgcmVhZG9ubHkgbWV0aG9kVHlwZTogTWV0aG9kVHlwZSA9IE1ldGhvZFR5cGUuR0VUO1xyXG5cclxuICAgIGFzeW5jIHByb2NlZWRSZXF1ZXN0KHJlc3BvbnNlOiBSZXNwb25zZSk6IFByb21pc2U8VXNlclJlc3BvbnNlPiB7XHJcbiAgICAgICAgY29uc3QgdGV4dCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcclxuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh0ZXh0KSBhcyBVc2VyUmVzcG9uc2U7XHJcbiAgICB9XHJcbn0iXX0=
