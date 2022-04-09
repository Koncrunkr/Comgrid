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
$(window).on('load', function () {
    checkAuthorization()
        .then(loadStore)
        .then(function () {
        drawDialogs();
        $('#create-table-form').on('submit', submit);
        var input = $('#table-image-file-input');
        input.on('change', function () { return showImage(input); });
    });
    $('.clickable').on('click', function () {
        $('.clickable').toggleClass('d-none');
    });
});
function drawDialogs() {
    var $container = $('.chat-container');
    var $noDel = $container.find('.no-deletable');
    $container.html('');
    $container.append($noDel);
    store.dialogs.slice().reverse().forEach(function (dialog, index) {
        var dialog2 = store.dialogs2[index];
        var $chat = $('.chat').clone();
        $chat.removeClass('chat d-none');
        $chat.find('a').attr('href', 'pages/table?id=' + dialog.id);
        $chat.find('.chat-name').text(dialog.name);
        $chat.find('.chat-sender').text(dialog2.lastSender + (dialog2.lastSender === '' ? '' : ':'));
        $chat.find('.chat-text').text(dialog2.lastMessage);
        $chat.find('.chat-time').text(dialog2.time);
        if (dialog.avatar.startsWith("/"))
            dialog.avatar = link + dialog.avatar;
        $chat.find('img').attr('src', dialog.avatar);
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
    var avatarFile = document.getElementById('table-image-file-input');
    var avatarLink = $('#table-image-link-input').val();
    if (avatarLink === "" && avatarFile.files[0] === null) {
        alert("You must specify either image or link to image");
        return false;
    }
    var height = $('#table-height-input').val();
    var width = $('#table-width-input').val();
    var newTable = new CreateTableRequest_1.CreateTableRequest({
        name: $('#table-name-input').val(),
        width: width,
        height: height,
        avatarLink: avatarLink,
        avatarFile: avatarFile === null || avatarFile === void 0 ? void 0 : avatarFile.files[0]
    });
    if (parseInt(height) * parseInt(width) > 2500) {
        alert("Размер таблицы не может превышать 2500 ячеек");
        return false;
    }
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
        reader.onload = function (e) {
            $('#image').attr('src', e.target.result);
            $('#image').removeClass('d-none');
        };
        reader.readAsDataURL(input.files[0]);
    }
}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJUU2NyaXB0L2luZGV4LnRzIiwiVFNjcmlwdC91dGlsL0h0dHBDbGllbnQudHMiLCJUU2NyaXB0L3V0aWwvcmVxdWVzdC9DcmVhdGVUYWJsZVJlcXVlc3QudHMiLCJUU2NyaXB0L3V0aWwvcmVxdWVzdC9Jc0xvZ2dlZEluUmVxdWVzdC50cyIsIlRTY3JpcHQvdXRpbC9yZXF1ZXN0L1VzZXJJbmZvUmVxdWVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztBQ0FBLGdEQUE2QztBQUM3Qyx3RUFBcUU7QUFFckUsa0VBQStEO0FBQy9ELHNFQUFtRTtBQUVuRSxJQUFJLEtBQUssR0FBUTtJQUNiLFFBQVEsRUFBRTtRQUNOO1lBQ0ksRUFBRSxFQUFFLENBQUM7WUFDTCxJQUFJLEVBQUUsbUJBQW1CO1lBQ3pCLFVBQVUsRUFBRSxRQUFRO1lBQ3BCLFdBQVcsRUFBRSw0QkFBNEI7WUFDekMsSUFBSSxFQUFFLE9BQU87WUFDYixhQUFhLEVBQUUsRUFBRTtZQUNqQixNQUFNLEVBQUUsa0JBQWtCO1lBQzFCLEtBQUssRUFBRSxHQUFHO1lBQ1YsTUFBTSxFQUFFLEdBQUc7U0FDZDtRQUNEO1lBQ0ksRUFBRSxFQUFFLENBQUM7WUFDTCxJQUFJLEVBQUUsc0JBQXNCO1lBQzVCLFVBQVUsRUFBRSxnQkFBZ0I7WUFDNUIsV0FBVyxFQUFFLG9CQUFvQjtZQUNqQyxJQUFJLEVBQUUsT0FBTztZQUNiLGFBQWEsRUFBRSxFQUFFO1lBQ2pCLE1BQU0sRUFBRSxrQkFBa0I7WUFDMUIsS0FBSyxFQUFFLEVBQUU7WUFDVCxNQUFNLEVBQUUsR0FBRztTQUNkO1FBQ0Q7WUFDSSxFQUFFLEVBQUUsQ0FBQztZQUNMLElBQUksRUFBRSwwQkFBMEI7WUFDaEMsVUFBVSxFQUFFLGNBQWM7WUFDMUIsV0FBVyxFQUFFLHVFQUF1RTtZQUNwRixJQUFJLEVBQUUsT0FBTztZQUNiLGFBQWEsRUFBRSxDQUFDO1lB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QUQsQ0FsQkEsQUFrQkMsSUFBQTtBQWxCWSwwQ0FBZSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCB7SHR0cENsaWVudH0gZnJvbSBcIi4vdXRpbC9IdHRwQ2xpZW50XCI7XHJcbmltcG9ydCB7Q3JlYXRlVGFibGVSZXF1ZXN0fSBmcm9tIFwiLi91dGlsL3JlcXVlc3QvQ3JlYXRlVGFibGVSZXF1ZXN0XCI7XHJcbmltcG9ydCB7VGFibGVJbmZvUmVxdWVzdH0gZnJvbSBcIi4vdXRpbC9yZXF1ZXN0L1RhYmxlSW5mb1JlcXVlc3RcIjtcclxuaW1wb3J0IHtVc2VySW5mb1JlcXVlc3R9IGZyb20gXCIuL3V0aWwvcmVxdWVzdC9Vc2VySW5mb1JlcXVlc3RcIjtcclxuaW1wb3J0IHtJc0xvZ2dlZEluUmVxdWVzdH0gZnJvbSBcIi4vdXRpbC9yZXF1ZXN0L0lzTG9nZ2VkSW5SZXF1ZXN0XCI7XHJcblxyXG5sZXQgc3RvcmU6IGFueSA9IHtcclxuICAgIGRpYWxvZ3MyOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZDogMCxcclxuICAgICAgICAgICAgbmFtZTogJ9CS0LjRgtCw0LvRjyDQuCDQutC+0LzQv9Cw0L3QuNGPJyxcclxuICAgICAgICAgICAgbGFzdFNlbmRlcjogJ9CS0LjRgtCw0LvRjycsXHJcbiAgICAgICAgICAgIGxhc3RNZXNzYWdlOiAn0J/RgNC40LLQtdGCLCDQv9GA0LjRhdC+0LTQuCDQv9C40YLRjCDQutGA0L7QstGMJyxcclxuICAgICAgICAgICAgdGltZTogJ9Cy0YfQtdGA0LAnLFxyXG4gICAgICAgICAgICBtZXNzYWdlc0NvdW50OiA1MSxcclxuICAgICAgICAgICAgYXZhdGFyOiAnLi9waWN0dXJlcy8xLnBuZycsXHJcbiAgICAgICAgICAgIHdpZHRoOiAxMDAsXHJcbiAgICAgICAgICAgIGhlaWdodDogMTIwXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlkOiAxLFxyXG4gICAgICAgICAgICBuYW1lOiAn0JHQtdGB0LXQtNCwINC90LUg0LTQu9GPINCz0LvRg9C/0YvRhScsXHJcbiAgICAgICAgICAgIGxhc3RTZW5kZXI6ICfQmtGC0L7QotC+INCd0LXQk9C70YPQv9GL0LknLFxyXG4gICAgICAgICAgICBsYXN0TWVzc2FnZTogJ9Ch0LrQvtC70YzQutC+INCx0YPQtNC10YIgMisyPycsXHJcbiAgICAgICAgICAgIHRpbWU6ICfQstGH0LXRgNCwJyxcclxuICAgICAgICAgICAgbWVzc2FnZXNDb3VudDogMTcsXHJcbiAgICAgICAgICAgIGF2YXRhcjogJy4vcGljdHVyZXMvMi5wbmcnLFxyXG4gICAgICAgICAgICB3aWR0aDogMTAsXHJcbiAgICAgICAgICAgIGhlaWdodDogMTEyXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlkOiAyLFxyXG4gICAgICAgICAgICBuYW1lOiAn0JHQtdGB0LXQtNCwINGC0L7Qu9GM0LrQviDQtNC70Y8g0LPQu9GD0L/Ri9GFJyxcclxuICAgICAgICAgICAgbGFzdFNlbmRlcjogJ9Ch0LDQvNGL0Lkg0JPQu9GD0L/Ri9C5JyxcclxuICAgICAgICAgICAgbGFzdE1lc3NhZ2U6ICfQoNC10LHRj9GC0LAsINGPINGC0L7Qu9GM0LrQviDRh9GC0L4g0LTQvtC60LDQt9Cw0Lsg0LPQuNC/0L7RgtC10LfRgyDQoNC40LzQsNC90LAhINCa0L7RgNC+0YfQtSwg0YLQsNC8INCy0YHRkSDQv9GA0L7RgdGC0L4hJyxcclxuICAgICAgICAgICAgdGltZTogJzExOjMwJyxcclxuICAgICAgICAgICAgbWVzc2FnZXNDb3VudDogMCxcclxuICAgICAgICAgICAgYXZhdGFyOiAnLi9waWN0dXJlcy8zLnBuZycsXHJcbiAgICAgICAgICAgIHdpZHRoOiAyMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiA0MFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZDogMyxcclxuICAgICAgICAgICAgbmFtZTogJ9CR0LXRgdC10LTQsCDRgSDQvtGH0LXQvdGMINC00LvQuNC90L3Ri9C8INC90LDQt9Cy0LDQvdC40LXQvC4g0KDQtdCx0Y/RgtCwLCDRjyDQvdC1INC/0YDQtdC00YHRgtCw0LLQu9GP0Y4g0LrQvtC80YMg0LIg0LPQvtC70L7QstGDINC/0YDQuNGI0LvQviDQtNCw0LLQsNGC0Ywg0YLQsNC60L7QtSDQtNC70LjQvdC90L7QtSDQvdCw0LfQstCw0L3QuNC1LiDQoNC10LHRj9GC0LAsINC/0YDQtdC00LvQsNCz0LDRjiDQvtCz0YDQsNC90LjRh9C40YLRjCDQtNC70LjQvdGDINC90LDQt9Cy0LDQvdC40LknLFxyXG4gICAgICAgICAgICBsYXN0U2VuZGVyOiAn0JLQuNGC0LDQu9GPJyxcclxuICAgICAgICAgICAgbGFzdE1lc3NhZ2U6ICfQn9GA0LjQstC10YIsINCz0LvRj9C90Ywg0LvRgScsXHJcbiAgICAgICAgICAgIHRpbWU6ICcxNDoxNScsXHJcbiAgICAgICAgICAgIG1lc3NhZ2VzQ291bnQ6IDAsXHJcbiAgICAgICAgICAgIGF2YXRhcjogJy4vcGljdHVyZXMvNC5wbmcnLFxyXG4gICAgICAgICAgICB3aWR0aDogMTAwMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiAxMDAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlkOiA0LFxyXG4gICAgICAgICAgICBuYW1lOiAn0JLQuNGC0LDQu9GPINCi0YDRg9Cx0L7QtdC0JyxcclxuICAgICAgICAgICAgbGFzdFNlbmRlcjogJycsXHJcbiAgICAgICAgICAgIGxhc3RNZXNzYWdlOiAn0JTQsNCy0L3QviDRh9C40YLQsNC7INCx0LXRgdC10LTRgz8nLFxyXG4gICAgICAgICAgICB0aW1lOiAnMTk6NTEnLFxyXG4gICAgICAgICAgICBtZXNzYWdlc0NvdW50OiA0LFxyXG4gICAgICAgICAgICBhdmF0YXI6ICcuL3BpY3R1cmVzLzUucG5nJyxcclxuICAgICAgICAgICAgd2lkdGg6IDEwMDAsXHJcbiAgICAgICAgICAgIGhlaWdodDogNTAwXHJcbiAgICAgICAgfVxyXG4gICAgXVxyXG59XHJcbmxldCBsaW5rID0gXCJodHRwczovL2NvbWdyaWQucnU6ODQ0M1wiO1xyXG5jb25zdCBodHRwQ2xpZW50ID0gbmV3IEh0dHBDbGllbnQobGluaylcclxuXHJcbiQod2luZG93KS5vbignbG9hZCcsICgpID0+IHtcclxuICAgIGNoZWNrQXV0aG9yaXphdGlvbigpXHJcbiAgICAudGhlbihsb2FkU3RvcmUpXHJcbiAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgZHJhd0RpYWxvZ3MoKVxyXG4gICAgICAgICQoJyNjcmVhdGUtdGFibGUtZm9ybScpLm9uKCdzdWJtaXQnLCBzdWJtaXQpO1xyXG4gICAgICAgIGxldCBpbnB1dCA9ICQoJyN0YWJsZS1pbWFnZS1maWxlLWlucHV0Jyk7XHJcbiAgICAgICAgaW5wdXQub24oJ2NoYW5nZScsICgpID0+IHNob3dJbWFnZShpbnB1dCkpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJCgnLmNsaWNrYWJsZScpLm9uKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAkKCcuY2xpY2thYmxlJykudG9nZ2xlQ2xhc3MoJ2Qtbm9uZScpXHJcbiAgICB9KTtcclxufSlcclxuXHJcbmZ1bmN0aW9uIGRyYXdEaWFsb2dzKCkge1xyXG4gICAgbGV0ICRjb250YWluZXIgPSAkKCcuY2hhdC1jb250YWluZXInKTtcclxuICAgIGxldCAkbm9EZWwgPSAkY29udGFpbmVyLmZpbmQoJy5uby1kZWxldGFibGUnKTtcclxuICAgICRjb250YWluZXIuaHRtbCgnJyk7XHJcbiAgICAkY29udGFpbmVyLmFwcGVuZCgkbm9EZWwpO1xyXG4gICAgc3RvcmUuZGlhbG9ncy5zbGljZSgpLnJldmVyc2UoKS5mb3JFYWNoKChkaWFsb2csIGluZGV4KSA9PiB7XHJcbiAgICAgICAgbGV0IGRpYWxvZzIgPSBzdG9yZS5kaWFsb2dzMltpbmRleF07XHJcbiAgICAgICAgbGV0ICRjaGF0ID0gJCgnLmNoYXQnKS5jbG9uZSgpO1xyXG4gICAgICAgICRjaGF0LnJlbW92ZUNsYXNzKCdjaGF0IGQtbm9uZScpO1xyXG4gICAgICAgICRjaGF0LmZpbmQoJ2EnKS5hdHRyKCdocmVmJywgJ3BhZ2VzL3RhYmxlP2lkPScgKyBkaWFsb2cuaWQpO1xyXG4gICAgICAgICRjaGF0LmZpbmQoJy5jaGF0LW5hbWUnKS50ZXh0KGRpYWxvZy5uYW1lKTtcclxuICAgICAgICAkY2hhdC5maW5kKCcuY2hhdC1zZW5kZXInKS50ZXh0KGRpYWxvZzIubGFzdFNlbmRlciArIChkaWFsb2cyLmxhc3RTZW5kZXIgPT09ICcnID8gJycgOiAnOicpKTtcclxuICAgICAgICAkY2hhdC5maW5kKCcuY2hhdC10ZXh0JykudGV4dChkaWFsb2cyLmxhc3RNZXNzYWdlKTtcclxuICAgICAgICAkY2hhdC5maW5kKCcuY2hhdC10aW1lJykudGV4dChkaWFsb2cyLnRpbWUpO1xyXG4gICAgICAgIGlmKGRpYWxvZy5hdmF0YXIuc3RhcnRzV2l0aChcIi9cIikpXHJcbiAgICAgICAgICAgIGRpYWxvZy5hdmF0YXIgPSBsaW5rICsgZGlhbG9nLmF2YXRhclxyXG4gICAgICAgICRjaGF0LmZpbmQoJ2ltZycpLmF0dHIoJ3NyYycsIGRpYWxvZy5hdmF0YXIpO1xyXG4gICAgICAgICRjaGF0LmZpbmQoJy5jaGF0LXNpemUnKS50ZXh0KGRpYWxvZy53aWR0aCArICfDlycgKyBkaWFsb2cuaGVpZ2h0KVxyXG4gICAgICAgIGRpYWxvZzIubWVzc2FnZXNDb3VudCA9PT0gMFxyXG4gICAgICAgICAgICA/ICRjaGF0LmZpbmQoJy5jaGF0LXVucmVhZCcpLnJlbW92ZSgpXHJcbiAgICAgICAgICAgIDogJGNoYXQuZmluZCgnLmNoYXQtdW5yZWFkJykudGV4dChkaWFsb2cyLm1lc3NhZ2VzQ291bnQpO1xyXG4gICAgICAgICRjb250YWluZXIuYXBwZW5kKCRjaGF0KTtcclxuICAgICAgICAkY2hhdC5vbignbW91c2VlbnRlcicsICgpID0+IHtcclxuICAgICAgICAgICAgJGNoYXQucmVtb3ZlQ2xhc3MoJ2JnLWxpZ2h0JylcclxuICAgICAgICB9KTtcclxuICAgICAgICAkY2hhdC5vbignbW91c2VsZWF2ZScsICgpID0+IHtcclxuICAgICAgICAgICAgJGNoYXQuYWRkQ2xhc3MoJ2JnLWxpZ2h0JylcclxuICAgICAgICB9KTtcclxuICAgICAgICAkY2hhdC5vbignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGRpYWxvZy5tZXNzYWdlc0NvdW50ID0gMDtcclxuICAgICAgICAgICAgZHJhd0RpYWxvZ3MoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzdWJtaXQoKSB7XHJcbiAgICBjb25zdCBhdmF0YXJGaWxlOiBhbnkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFibGUtaW1hZ2UtZmlsZS1pbnB1dCcpXHJcbiAgICBsZXQgYXZhdGFyTGluayA9ICQoJyN0YWJsZS1pbWFnZS1saW5rLWlucHV0JykudmFsKCk7XHJcbiAgICBpZihhdmF0YXJMaW5rID09PSBcIlwiICYmIGF2YXRhckZpbGUuZmlsZXNbMF0gPT09IG51bGwpe1xyXG4gICAgICAgIGFsZXJ0KFwiWW91IG11c3Qgc3BlY2lmeSBlaXRoZXIgaW1hZ2Ugb3IgbGluayB0byBpbWFnZVwiKVxyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfVxyXG4gICAgbGV0IGhlaWdodCA9ICQoJyN0YWJsZS1oZWlnaHQtaW5wdXQnKS52YWwoKTtcclxuICAgIGxldCB3aWR0aCA9ICQoJyN0YWJsZS13aWR0aC1pbnB1dCcpLnZhbCgpO1xyXG4gICAgY29uc3QgbmV3VGFibGUgPSBuZXcgQ3JlYXRlVGFibGVSZXF1ZXN0KHtcclxuICAgICAgICBuYW1lOiAkKCcjdGFibGUtbmFtZS1pbnB1dCcpLnZhbCgpIGFzIHN0cmluZyxcclxuICAgICAgICB3aWR0aDogd2lkdGggYXMgbnVtYmVyLFxyXG4gICAgICAgIGhlaWdodDogaGVpZ2h0IGFzIG51bWJlcixcclxuICAgICAgICBhdmF0YXJMaW5rOiBhdmF0YXJMaW5rIGFzIHN0cmluZyxcclxuICAgICAgICBhdmF0YXJGaWxlOiBhdmF0YXJGaWxlPy5maWxlc1swXVxyXG4gICAgfSlcclxuICAgIGlmKHBhcnNlSW50KGhlaWdodCBhcyBzdHJpbmcpICogcGFyc2VJbnQod2lkdGggYXMgc3RyaW5nKSA+IDI1MDApe1xyXG4gICAgICAgIGFsZXJ0KFwi0KDQsNC30LzQtdGAINGC0LDQsdC70LjRhtGLINC90LUg0LzQvtC20LXRgiDQv9GA0LXQstGL0YjQsNGC0YwgMjUwMCDRj9GH0LXQtdC6XCIpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHBvc3RUYWJsZShuZXdUYWJsZSlcclxuICAgIC50aGVuKCh0YWJsZSkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRhYmxlKVxyXG4gICAgICAgIGxvYWRTdG9yZSgpLnRoZW4oZHJhd0RpYWxvZ3MpXHJcbiAgICB9KTtcclxuICAgIGNsZWFyTWVudSgpO1xyXG4gICAgY2xvc2VNZW51KCk7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBvc3RUYWJsZSh0YWJsZSkge1xyXG4gICAgcmV0dXJuIGh0dHBDbGllbnQucHJvY2VlZFJlcXVlc3QoXHJcbiAgICAgICAgdGFibGUsXHJcbiAgICAgICAgKGNvZGUsIGVycm9yVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBhbGVydChgRXJyb3IgaGFwcGVuZWQgd2hpbGUgY3JlYXRpbmcgdGFibGU6ICR7Y29kZX0sICR7ZXJyb3JUZXh0fWApXHJcbiAgICAgICAgfVxyXG4gICAgKVxyXG59XHJcblxyXG5mdW5jdGlvbiBjbGVhck1lbnUoKSB7XHJcbiAgICAkKCcjY2xlYXItYnV0dG9uJykuY2xpY2soKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2xvc2VNZW51KCkge1xyXG4gICAgJCgnI2Nsb3NlLWJ1dHRvbicpLmNsaWNrKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvYWRTdG9yZSgpIHtcclxuICAgIHJldHVybiBodHRwQ2xpZW50LnByb2NlZWRSZXF1ZXN0KFxyXG4gICAgICAgIG5ldyBVc2VySW5mb1JlcXVlc3QoeyBpbmNsdWRlQ2hhdHM6IHRydWUgfSksXHJcbiAgICAgICAgKGNvZGUsIGVycm9yVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBhbGVydChgRXJyb3IgaGFwcGVuZWQgd2hpbGUgbG9hZGluZyB1c2VyIGluZm86ICR7Y29kZX0sICR7ZXJyb3JUZXh0fWApXHJcbiAgICAgICAgfVxyXG4gICAgKS50aGVuKHVzZXIgPT4ge1xyXG4gICAgICAgIHN0b3JlLmRpYWxvZ3MgPSB1c2VyLmNoYXRzO1xyXG4gICAgfSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrQXV0aG9yaXphdGlvbigpIHtcclxuICAgIHJldHVybiBodHRwQ2xpZW50LnByb2NlZWRSZXF1ZXN0KFxyXG4gICAgICAgIG5ldyBJc0xvZ2dlZEluUmVxdWVzdCgpLFxyXG4gICAgICAgICgpID0+IHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gbGluayArIFwiL29hdXRoMi9hdXRob3JpemF0aW9uL2dvb2dsZVwiXHJcbiAgICApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzaG93SW1hZ2UoaW5wdXQpIHtcclxuICAgIGlmIChpbnB1dC5maWxlcyAmJiBpbnB1dC5maWxlc1swXSkge1xyXG4gICAgICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG5cclxuICAgICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAkKCcjaW1hZ2UnKS5hdHRyKCdzcmMnLCBlLnRhcmdldC5yZXN1bHQgYXMgc3RyaW5nKTtcclxuICAgICAgICAgICAgJCgnI2ltYWdlJykucmVtb3ZlQ2xhc3MoJ2Qtbm9uZScpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGlucHV0LmZpbGVzWzBdKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7UmVxdWVzdFdyYXBwZXJ9IGZyb20gXCIuL3JlcXVlc3QvUmVxdWVzdFwiO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBIdHRwQ2xpZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgYXBpTGluazogc3RyaW5nKSB7fVxyXG5cclxuICAgIGFzeW5jIHByb2NlZWRSZXF1ZXN0PFQ+KFxyXG4gICAgICAgIHJlcXVlc3Q6IFJlcXVlc3RXcmFwcGVyPFQ+LFxyXG4gICAgICAgIG9uRmFpbHVyZTogKGNvZGU6IG51bWJlciwgZXJyb3JUZXh0OiBzdHJpbmcpID0+IHVua25vd24gPVxyXG4gICAgICAgICAgICAoY29kZSwgZXJyb3JUZXh0KSA9PiBhbGVydChgY29kZTogJHtjb2RlfSwgZXJyb3I6ICR7ZXJyb3JUZXh0fWApLFxyXG4gICAgICAgIG9uTmV0d29ya0ZhaWx1cmU6IChyZWFzb24pID0+IHVua25vd24gPVxyXG4gICAgICAgICAgICAocmVhc29uKSA9PiBhbGVydChgbmV0d29yayBlcnJvcjogJHtyZWFzb259YClcclxuICAgICk6IFByb21pc2U8VD57XHJcbiAgICAgICAgY29uc3QgZmluYWxMaW5rID0gbmV3IFVSTCh0aGlzLmFwaUxpbmsgKyByZXF1ZXN0LmVuZHBvaW50KVxyXG4gICAgICAgIGlmKHJlcXVlc3QucGFyYW1ldGVycyAhPSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIGZpbmFsTGluay5zZWFyY2ggPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHJlcXVlc3QucGFyYW1ldGVycykudG9TdHJpbmcoKVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhyZXF1ZXN0KVxyXG4gICAgICAgIHJldHVybiBmZXRjaChcclxuICAgICAgICAgICAgZmluYWxMaW5rLnRvU3RyaW5nKCksXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcImluY2x1ZGVcIixcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogcmVxdWVzdC5tZXRob2RUeXBlLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyczogcmVxdWVzdC5oZWFkZXJzLFxyXG4gICAgICAgICAgICAgICAgYm9keTogcmVxdWVzdC5ib2R5XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApLnRoZW4oYXN5bmMgKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnByb2NlZWRSZXF1ZXN0KHJlc3BvbnNlKVxyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yVGV4dCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcclxuICAgICAgICAgICAgICAgIG9uRmFpbHVyZShyZXNwb25zZS5zdGF0dXMsIGVycm9yVGV4dCk7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGVycm9yVGV4dCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZW51bSBNZXRob2RUeXBle1xyXG4gICAgUE9TVD1cIlBPU1RcIixcclxuICAgIEdFVD1cIkdFVFwiLFxyXG4gICAgUEFUQ0g9XCJQQVRDSFwiLFxyXG4gICAgUFVUPVwiUFVUXCIsXHJcbn0iLCJpbXBvcnQge01ldGhvZFR5cGV9IGZyb20gXCIuLi9IdHRwQ2xpZW50XCI7XHJcbmltcG9ydCB7UmVxdWVzdFdyYXBwZXJ9IGZyb20gXCIuL1JlcXVlc3RcIjtcclxuaW1wb3J0IHtVc2VyUmVzcG9uc2V9IGZyb20gXCIuL1VzZXJJbmZvUmVxdWVzdFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRhYmxlUmVzcG9uc2Uge1xyXG4gICAgcmVhZG9ubHkgaWQhOiBudW1iZXJcclxuICAgIHJlYWRvbmx5IG5hbWUhOiBzdHJpbmdcclxuICAgIHJlYWRvbmx5IGNyZWF0b3IhOiBudW1iZXJcclxuICAgIHJlYWRvbmx5IHdpZHRoITogbnVtYmVyXHJcbiAgICByZWFkb25seSBoZWlnaHQhOiBudW1iZXJcclxuICAgIHJlYWRvbmx5IGF2YXRhciE6IG51bWJlclxyXG4gICAgcmVhZG9ubHkgY3JlYXRlZCE6IERhdGVcclxuICAgIHJlYWRvbmx5IGxhc3RNZXNzYWdlSWQ/OiBudW1iZXJcclxuICAgIHJlYWRvbmx5IHBhcnRpY2lwYW50cz86IFVzZXJSZXNwb25zZVtdXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDcmVhdGVUYWJsZVJlcXVlc3QgaW1wbGVtZW50cyBSZXF1ZXN0V3JhcHBlcjxUYWJsZVJlc3BvbnNlPiB7XHJcbiAgICByZWFkb25seSBib2R5PzogRm9ybURhdGFcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihib2R5OiB7XHJcbiAgICAgICAgbmFtZTogc3RyaW5nLFxyXG4gICAgICAgIHdpZHRoOiBudW1iZXIsXHJcbiAgICAgICAgaGVpZ2h0OiBudW1iZXIsXHJcbiAgICAgICAgYXZhdGFyRmlsZT86IEZpbGUsXHJcbiAgICAgICAgYXZhdGFyTGluaz86IHN0cmluZ1xyXG4gICAgfSkge1xyXG4gICAgICAgIHRoaXMuYm9keSA9IG5ldyBGb3JtRGF0YSgpXHJcbiAgICAgICAgdGhpcy5ib2R5LmFwcGVuZCgnbmFtZScsIGJvZHkubmFtZSlcclxuICAgICAgICB0aGlzLmJvZHkuYXBwZW5kKCd3aWR0aCcsIGJvZHkud2lkdGgudG9TdHJpbmcoKSlcclxuICAgICAgICB0aGlzLmJvZHkuYXBwZW5kKCdoZWlnaHQnLCBib2R5LmhlaWdodC50b1N0cmluZygpKVxyXG4gICAgICAgIGlmIChib2R5LmF2YXRhckxpbmsgPT0gdW5kZWZpbmVkICYmIGJvZHkuYXZhdGFyRmlsZSA9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3Qgc2VuZCByZXF1ZXN0IHdpdGggbm8gYXZhdGFyXCIpXHJcbiAgICAgICAgaWYgKGJvZHkuYXZhdGFyRmlsZSAhPSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRoaXMuYm9keS5hcHBlbmQoJ2F2YXRhckZpbGUnLCBib2R5LmF2YXRhckZpbGUpXHJcbiAgICAgICAgaWYgKGJvZHkuYXZhdGFyTGluayAhPSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRoaXMuYm9keS5hcHBlbmQoJ2F2YXRhckxpbmsnLCBib2R5LmF2YXRhckxpbmspXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgcHJvY2VlZFJlcXVlc3QocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTxUYWJsZVJlc3BvbnNlPiB7XHJcbiAgICAgICAgY29uc3QgdGV4dCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKVxyXG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHRleHQpIGFzIFRhYmxlUmVzcG9uc2VcclxuICAgIH1cclxuXHJcbiAgICBlbmRwb2ludDogc3RyaW5nID0gXCIvdGFibGUvY3JlYXRlXCI7XHJcbiAgICBtZXRob2RUeXBlOiBNZXRob2RUeXBlID0gTWV0aG9kVHlwZS5QT1NUO1xyXG59IiwiaW1wb3J0IHtSZXF1ZXN0V3JhcHBlcn0gZnJvbSBcIi4vUmVxdWVzdFwiO1xyXG5pbXBvcnQge01ldGhvZFR5cGV9IGZyb20gXCIuLi9IdHRwQ2xpZW50XCI7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIElzTG9nZ2VkSW5SZXF1ZXN0IGltcGxlbWVudHMgUmVxdWVzdFdyYXBwZXI8bnVtYmVyPntcclxuICAgIHJlYWRvbmx5IGVuZHBvaW50OiBzdHJpbmcgPSAnL3VzZXIvbG9naW4nO1xyXG4gICAgcmVhZG9ubHkgbWV0aG9kVHlwZTogTWV0aG9kVHlwZSA9IE1ldGhvZFR5cGUuR0VUO1xyXG5cclxuICAgIGFzeW5jIHByb2NlZWRSZXF1ZXN0KHJlc3BvbnNlOiBSZXNwb25zZSk6IFByb21pc2U8bnVtYmVyPiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnN0YXR1cztcclxuICAgIH1cclxufSIsImltcG9ydCB7UmVxdWVzdFdyYXBwZXJ9IGZyb20gXCIuL1JlcXVlc3RcIjtcclxuaW1wb3J0IHtUYWJsZVJlc3BvbnNlfSBmcm9tIFwiLi9DcmVhdGVUYWJsZVJlcXVlc3RcIjtcclxuaW1wb3J0IHtNZXRob2RUeXBlfSBmcm9tIFwiLi4vSHR0cENsaWVudFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFVzZXJSZXNwb25zZXtcclxuICAgIHJlYWRvbmx5IGlkITogc3RyaW5nXHJcbiAgICByZWFkb25seSBuYW1lITogc3RyaW5nXHJcbiAgICByZWFkb25seSBlbWFpbCE6IHN0cmluZ1xyXG4gICAgcmVhZG9ubHkgYXZhdGFyITogc3RyaW5nXHJcbiAgICByZWFkb25seSBjcmVhdGVkITogRGF0ZVxyXG4gICAgcmVhZG9ubHkgY2hhdHM/OiBUYWJsZVJlc3BvbnNlW11cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFVzZXJJbmZvUmVxdWVzdCBpbXBsZW1lbnRzIFJlcXVlc3RXcmFwcGVyPFVzZXJSZXNwb25zZT57XHJcbiAgICByZWFkb25seSBwYXJhbWV0ZXJzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+XHJcblxyXG4gICAgY29uc3RydWN0b3IocGFyYW1ldGVyczogeyBpbmNsdWRlQ2hhdHM/OiBib29sZWFuIH0pIHtcclxuICAgICAgICBsZXQgcGFyYW1zOiBhbnkgPSB7fVxyXG4gICAgICAgIGlmKHBhcmFtZXRlcnMuaW5jbHVkZUNoYXRzKVxyXG4gICAgICAgICAgICBwYXJhbXMuaW5jbHVkZUNoYXRzID0gcGFyYW1ldGVycy5pbmNsdWRlQ2hhdHM/LnRvU3RyaW5nKClcclxuXHJcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzID0gcGFyYW1zXHJcbiAgICB9XHJcblxyXG4gICAgcmVhZG9ubHkgZW5kcG9pbnQ6IHN0cmluZyA9IFwiL3VzZXIvaW5mb1wiO1xyXG4gICAgcmVhZG9ubHkgbWV0aG9kVHlwZTogTWV0aG9kVHlwZSA9IE1ldGhvZFR5cGUuR0VUO1xyXG5cclxuICAgIGFzeW5jIHByb2NlZWRSZXF1ZXN0KHJlc3BvbnNlOiBSZXNwb25zZSk6IFByb21pc2U8VXNlclJlc3BvbnNlPiB7XHJcbiAgICAgICAgY29uc3QgdGV4dCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcclxuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh0ZXh0KSBhcyBVc2VyUmVzcG9uc2U7XHJcbiAgICB9XHJcbn0iXX0=
