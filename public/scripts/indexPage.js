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
        $('#create-table-form').on('submit', submit);
        drawDialogs();
        $('.clickable').on('click', function () {
            $('.clickable').toggleClass('d-none');
        });
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
        $chat.find('a').attr('href', 'pages/table.html?id=' + dialog.id);
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
                    }).then(function (response) {
                        if (response.status === 200) {
                            return request.proceedRequest(response);
                        }
                        else {
                            response.text().then(function (text) {
                                onFailure(response.status, text);
                                return Promise.reject(text);
                            });
                        }
                    })];
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
        this.headers = {
            "Content-Types": "application/json"
        };
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJUU2NyaXB0L2luZGV4LnRzIiwiVFNjcmlwdC91dGlsL0h0dHBDbGllbnQudHMiLCJUU2NyaXB0L3V0aWwvcmVxdWVzdC9DcmVhdGVUYWJsZVJlcXVlc3QudHMiLCJUU2NyaXB0L3V0aWwvcmVxdWVzdC9Jc0xvZ2dlZEluUmVxdWVzdC50cyIsIlRTY3JpcHQvdXRpbC9yZXF1ZXN0L1VzZXJJbmZvUmVxdWVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztBQ0FBLGdEQUE2QztBQUM3Qyx3RUFBcUU7QUFFckUsa0VBQStEO0FBQy9ELHNFQUFtRTtBQUVuRSxJQUFJLEtBQUssR0FBUTtJQUNiLFFBQVEsRUFBRTtRQUNOO1lBQ0ksRUFBRSxFQUFFLENBQUM7WUFDTCxJQUFJLEVBQUUsbUJBQW1CO1lBQ3pCLFVBQVUsRUFBRSxRQUFRO1lBQ3BCLFdBQVcsRUFBRSw0QkFBNEI7WUFDekMsSUFBSSxFQUFFLE9BQU87WUFDYixhQUFhLEVBQUUsRUFBRTtZQUNqQixNQUFNLEVBQUUsa0JBQWtCO1lBQzFCLEtBQUssRUFBRSxHQUFHO1lBQ1YsTUFBTSxFQUFFLEdBQUc7U0FDZDtRQUNEO1lBQ0ksRUFBRSxFQUFFLENBQUM7WUFDTCxJQUFJLEVBQUUsc0JBQXNCO1lBQzVCLFVBQVUsRUFBRSxnQkFBZ0I7WUFDNUIsV0FBVyxFQUFFLG9CQUFvQjtZQUNqQyxJQUFJLEVBQUUsT0FBTztZQUNiLGFBQWEsRUFBRSxFQUFFO1lBQ2pCLE1BQU0sRUFBRSxrQkFBa0I7WUFDMUIsS0FBSyxFQUFFLEVBQUU7WUFDVCxNQUFNLEVBQUUsR0FBRztTQUNkO1FBQ0Q7WUFDSSxFQUFFLEVBQUUsQ0FBQztZQUNMLElBQUksRUFBRSwwQkFBMEI7WUFDaEMsVUFBVSxFQUFFLGNBQWM7WUFDMUIsV0FBVyxFQUFFLHVFQUF1RTtZQUNwRixJQUFJLEVBQUUsT0FBTztZQUNiLGFBQWEsRUFBRSxDQUFDO1lB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QUFTekI7SUFHSSx5QkFBWSxVQUFzQzs7UUFRekMsYUFBUSxHQUFXLFlBQVksQ0FBQztRQUNoQyxlQUFVLEdBQWUsdUJBQVUsQ0FBQyxHQUFHLENBQUM7UUFSN0MsSUFBSSxNQUFNLEdBQVEsRUFBRSxDQUFBO1FBQ3BCLElBQUcsVUFBVSxDQUFDLFlBQVk7WUFDdEIsTUFBTSxDQUFDLFlBQVksR0FBRyxNQUFBLFVBQVUsQ0FBQyxZQUFZLDBDQUFFLFFBQVEsRUFBRSxDQUFBO1FBRTdELElBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFBO0lBQzVCLENBQUM7SUFLSyx3Q0FBYyxHQUFwQixVQUFxQixRQUFrQjs7Ozs7NEJBQ3RCLHFCQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBQTs7d0JBQTVCLElBQUksR0FBRyxTQUFxQjt3QkFDbEMsc0JBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQWlCLEVBQUM7Ozs7S0FDM0M7SUFDTCxzQkFBQztBQUFELENBbEJBLEFBa0JDLElBQUE7QUFsQlksMENBQWUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQge0h0dHBDbGllbnR9IGZyb20gXCIuL3V0aWwvSHR0cENsaWVudFwiO1xyXG5pbXBvcnQge0NyZWF0ZVRhYmxlUmVxdWVzdH0gZnJvbSBcIi4vdXRpbC9yZXF1ZXN0L0NyZWF0ZVRhYmxlUmVxdWVzdFwiO1xyXG5pbXBvcnQge1RhYmxlSW5mb1JlcXVlc3R9IGZyb20gXCIuL3V0aWwvcmVxdWVzdC9UYWJsZUluZm9SZXF1ZXN0XCI7XHJcbmltcG9ydCB7VXNlckluZm9SZXF1ZXN0fSBmcm9tIFwiLi91dGlsL3JlcXVlc3QvVXNlckluZm9SZXF1ZXN0XCI7XHJcbmltcG9ydCB7SXNMb2dnZWRJblJlcXVlc3R9IGZyb20gXCIuL3V0aWwvcmVxdWVzdC9Jc0xvZ2dlZEluUmVxdWVzdFwiO1xyXG5cclxubGV0IHN0b3JlOiBhbnkgPSB7XHJcbiAgICBkaWFsb2dzMjogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWQ6IDAsXHJcbiAgICAgICAgICAgIG5hbWU6ICfQktC40YLQsNC70Y8g0Lgg0LrQvtC80L/QsNC90LjRjycsXHJcbiAgICAgICAgICAgIGxhc3RTZW5kZXI6ICfQktC40YLQsNC70Y8nLFxyXG4gICAgICAgICAgICBsYXN0TWVzc2FnZTogJ9Cf0YDQuNCy0LXRgiwg0L/RgNC40YXQvtC00Lgg0L/QuNGC0Ywg0LrRgNC+0LLRjCcsXHJcbiAgICAgICAgICAgIHRpbWU6ICfQstGH0LXRgNCwJyxcclxuICAgICAgICAgICAgbWVzc2FnZXNDb3VudDogNTEsXHJcbiAgICAgICAgICAgIGF2YXRhcjogJy4vcGljdHVyZXMvMS5wbmcnLFxyXG4gICAgICAgICAgICB3aWR0aDogMTAwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDEyMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZDogMSxcclxuICAgICAgICAgICAgbmFtZTogJ9CR0LXRgdC10LTQsCDQvdC1INC00LvRjyDQs9C70YPQv9GL0YUnLFxyXG4gICAgICAgICAgICBsYXN0U2VuZGVyOiAn0JrRgtC+0KLQviDQndC10JPQu9GD0L/Ri9C5JyxcclxuICAgICAgICAgICAgbGFzdE1lc3NhZ2U6ICfQodC60L7Qu9GM0LrQviDQsdGD0LTQtdGCIDIrMj8nLFxyXG4gICAgICAgICAgICB0aW1lOiAn0LLRh9C10YDQsCcsXHJcbiAgICAgICAgICAgIG1lc3NhZ2VzQ291bnQ6IDE3LFxyXG4gICAgICAgICAgICBhdmF0YXI6ICcuL3BpY3R1cmVzLzIucG5nJyxcclxuICAgICAgICAgICAgd2lkdGg6IDEwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDExMlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZDogMixcclxuICAgICAgICAgICAgbmFtZTogJ9CR0LXRgdC10LTQsCDRgtC+0LvRjNC60L4g0LTQu9GPINCz0LvRg9C/0YvRhScsXHJcbiAgICAgICAgICAgIGxhc3RTZW5kZXI6ICfQodCw0LzRi9C5INCT0LvRg9C/0YvQuScsXHJcbiAgICAgICAgICAgIGxhc3RNZXNzYWdlOiAn0KDQtdCx0Y/RgtCwLCDRjyDRgtC+0LvRjNC60L4g0YfRgtC+INC00L7QutCw0LfQsNC7INCz0LjQv9C+0YLQtdC30YMg0KDQuNC80LDQvdCwISDQmtC+0YDQvtGH0LUsINGC0LDQvCDQstGB0ZEg0L/RgNC+0YHRgtC+IScsXHJcbiAgICAgICAgICAgIHRpbWU6ICcxMTozMCcsXHJcbiAgICAgICAgICAgIG1lc3NhZ2VzQ291bnQ6IDAsXHJcbiAgICAgICAgICAgIGF2YXRhcjogJy4vcGljdHVyZXMvMy5wbmcnLFxyXG4gICAgICAgICAgICB3aWR0aDogMjAsXHJcbiAgICAgICAgICAgIGhlaWdodDogNDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWQ6IDMsXHJcbiAgICAgICAgICAgIG5hbWU6ICfQkdC10YHQtdC00LAg0YEg0L7Rh9C10L3RjCDQtNC70LjQvdC90YvQvCDQvdCw0LfQstCw0L3QuNC10LwuINCg0LXQsdGP0YLQsCwg0Y8g0L3QtSDQv9GA0LXQtNGB0YLQsNCy0LvRj9GOINC60L7QvNGDINCyINCz0L7Qu9C+0LLRgyDQv9GA0LjRiNC70L4g0LTQsNCy0LDRgtGMINGC0LDQutC+0LUg0LTQu9C40L3QvdC+0LUg0L3QsNC30LLQsNC90LjQtS4g0KDQtdCx0Y/RgtCwLCDQv9GA0LXQtNC70LDQs9Cw0Y4g0L7Qs9GA0LDQvdC40YfQuNGC0Ywg0LTQu9C40L3RgyDQvdCw0LfQstCw0L3QuNC5JyxcclxuICAgICAgICAgICAgbGFzdFNlbmRlcjogJ9CS0LjRgtCw0LvRjycsXHJcbiAgICAgICAgICAgIGxhc3RNZXNzYWdlOiAn0J/RgNC40LLQtdGCLCDQs9C70Y/QvdGMINC70YEnLFxyXG4gICAgICAgICAgICB0aW1lOiAnMTQ6MTUnLFxyXG4gICAgICAgICAgICBtZXNzYWdlc0NvdW50OiAwLFxyXG4gICAgICAgICAgICBhdmF0YXI6ICcuL3BpY3R1cmVzLzQucG5nJyxcclxuICAgICAgICAgICAgd2lkdGg6IDEwMDAsXHJcbiAgICAgICAgICAgIGhlaWdodDogMTAwMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZDogNCxcclxuICAgICAgICAgICAgbmFtZTogJ9CS0LjRgtCw0LvRjyDQotGA0YPQsdC+0LXQtCcsXHJcbiAgICAgICAgICAgIGxhc3RTZW5kZXI6ICcnLFxyXG4gICAgICAgICAgICBsYXN0TWVzc2FnZTogJ9CU0LDQstC90L4g0YfQuNGC0LDQuyDQsdC10YHQtdC00YM/JyxcclxuICAgICAgICAgICAgdGltZTogJzE5OjUxJyxcclxuICAgICAgICAgICAgbWVzc2FnZXNDb3VudDogNCxcclxuICAgICAgICAgICAgYXZhdGFyOiAnLi9waWN0dXJlcy81LnBuZycsXHJcbiAgICAgICAgICAgIHdpZHRoOiAxMDAwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDUwMFxyXG4gICAgICAgIH1cclxuICAgIF1cclxufVxyXG5sZXQgbGluayA9IFwiaHR0cHM6Ly9jb21ncmlkLnJ1Ojg0NDNcIjtcclxuY29uc3QgaHR0cENsaWVudCA9IG5ldyBIdHRwQ2xpZW50KGxpbmspXHJcblxyXG4kKHdpbmRvdykub24oJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICBjaGVja0F1dGhvcml6YXRpb24oKVxyXG4gICAgLnRoZW4obG9hZFN0b3JlKVxyXG4gICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICQoJyNjcmVhdGUtdGFibGUtZm9ybScpLm9uKCdzdWJtaXQnLCBzdWJtaXQpO1xyXG4gICAgICAgIGRyYXdEaWFsb2dzKClcclxuXHJcbiAgICAgICAgJCgnLmNsaWNrYWJsZScpLm9uKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgJCgnLmNsaWNrYWJsZScpLnRvZ2dsZUNsYXNzKCdkLW5vbmUnKVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pXHJcblxyXG5mdW5jdGlvbiBkcmF3RGlhbG9ncygpIHtcclxuICAgIGxldCAkY29udGFpbmVyID0gJCgnLmNoYXQtY29udGFpbmVyJyk7XHJcbiAgICBsZXQgJG5vRGVsID0gJGNvbnRhaW5lci5maW5kKCcubm8tZGVsZXRhYmxlJyk7XHJcbiAgICAkY29udGFpbmVyLmh0bWwoJycpO1xyXG4gICAgJGNvbnRhaW5lci5hcHBlbmQoJG5vRGVsKTtcclxuICAgIHN0b3JlLmRpYWxvZ3Muc2xpY2UoKS5yZXZlcnNlKCkuZm9yRWFjaCgoZGlhbG9nLCBpbmRleCkgPT4ge1xyXG4gICAgICAgIGxldCBkaWFsb2cyID0gc3RvcmUuZGlhbG9nczJbaW5kZXhdO1xyXG4gICAgICAgIGxldCAkY2hhdCA9ICQoJy5jaGF0JykuY2xvbmUoKTtcclxuICAgICAgICAkY2hhdC5yZW1vdmVDbGFzcygnY2hhdCBkLW5vbmUnKTtcclxuICAgICAgICAkY2hhdC5maW5kKCdhJykuYXR0cignaHJlZicsICdwYWdlcy90YWJsZS5odG1sP2lkPScgKyBkaWFsb2cuaWQpO1xyXG4gICAgICAgICRjaGF0LmZpbmQoJy5jaGF0LW5hbWUnKS50ZXh0KGRpYWxvZy5uYW1lKTtcclxuICAgICAgICAkY2hhdC5maW5kKCcuY2hhdC1zZW5kZXInKS50ZXh0KGRpYWxvZzIubGFzdFNlbmRlciArIChkaWFsb2cyLmxhc3RTZW5kZXIgPT09ICcnID8gJycgOiAnOicpKTtcclxuICAgICAgICAkY2hhdC5maW5kKCcuY2hhdC10ZXh0JykudGV4dChkaWFsb2cyLmxhc3RNZXNzYWdlKTtcclxuICAgICAgICAkY2hhdC5maW5kKCcuY2hhdC10aW1lJykudGV4dChkaWFsb2cyLnRpbWUpO1xyXG4gICAgICAgIGlmKGRpYWxvZy5hdmF0YXIuc3RhcnRzV2l0aChcIi9cIikpXHJcbiAgICAgICAgICAgIGRpYWxvZy5hdmF0YXIgPSBsaW5rICsgZGlhbG9nLmF2YXRhclxyXG4gICAgICAgICRjaGF0LmZpbmQoJ2ltZycpLmF0dHIoJ3NyYycsIGRpYWxvZy5hdmF0YXIpO1xyXG4gICAgICAgICRjaGF0LmZpbmQoJy5jaGF0LXNpemUnKS50ZXh0KGRpYWxvZy53aWR0aCArICfDlycgKyBkaWFsb2cuaGVpZ2h0KVxyXG4gICAgICAgIGRpYWxvZzIubWVzc2FnZXNDb3VudCA9PT0gMFxyXG4gICAgICAgICAgICA/ICRjaGF0LmZpbmQoJy5jaGF0LXVucmVhZCcpLnJlbW92ZSgpXHJcbiAgICAgICAgICAgIDogJGNoYXQuZmluZCgnLmNoYXQtdW5yZWFkJykudGV4dChkaWFsb2cyLm1lc3NhZ2VzQ291bnQpO1xyXG4gICAgICAgICRjb250YWluZXIuYXBwZW5kKCRjaGF0KTtcclxuICAgICAgICAkY2hhdC5vbignbW91c2VlbnRlcicsICgpID0+IHtcclxuICAgICAgICAgICAgJGNoYXQucmVtb3ZlQ2xhc3MoJ2JnLWxpZ2h0JylcclxuICAgICAgICB9KTtcclxuICAgICAgICAkY2hhdC5vbignbW91c2VsZWF2ZScsICgpID0+IHtcclxuICAgICAgICAgICAgJGNoYXQuYWRkQ2xhc3MoJ2JnLWxpZ2h0JylcclxuICAgICAgICB9KTtcclxuICAgICAgICAkY2hhdC5vbignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGRpYWxvZy5tZXNzYWdlc0NvdW50ID0gMDtcclxuICAgICAgICAgICAgZHJhd0RpYWxvZ3MoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzdWJtaXQoKSB7XHJcbiAgICBjb25zdCBhdmF0YXJGaWxlOiBhbnkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFibGUtaW1hZ2UtZmlsZS1pbnB1dCcpXHJcbiAgICBsZXQgYXZhdGFyTGluayA9ICQoJyN0YWJsZS1pbWFnZS1saW5rLWlucHV0JykudmFsKCk7XHJcbiAgICBpZihhdmF0YXJMaW5rID09PSBcIlwiICYmIGF2YXRhckZpbGUuZmlsZXNbMF0gPT09IG51bGwpe1xyXG4gICAgICAgIGFsZXJ0KFwiWW91IG11c3Qgc3BlY2lmeSBlaXRoZXIgaW1hZ2Ugb3IgbGluayB0byBpbWFnZVwiKVxyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfVxyXG4gICAgbGV0IGhlaWdodCA9ICQoJyN0YWJsZS1oZWlnaHQtaW5wdXQnKS52YWwoKTtcclxuICAgIGxldCB3aWR0aCA9ICQoJyN0YWJsZS13aWR0aC1pbnB1dCcpLnZhbCgpO1xyXG4gICAgY29uc3QgbmV3VGFibGUgPSBuZXcgQ3JlYXRlVGFibGVSZXF1ZXN0KHtcclxuICAgICAgICBuYW1lOiAkKCcjdGFibGUtbmFtZS1pbnB1dCcpLnZhbCgpIGFzIHN0cmluZyxcclxuICAgICAgICB3aWR0aDogd2lkdGggYXMgbnVtYmVyLFxyXG4gICAgICAgIGhlaWdodDogaGVpZ2h0IGFzIG51bWJlcixcclxuICAgICAgICBhdmF0YXJMaW5rOiBhdmF0YXJMaW5rIGFzIHN0cmluZyxcclxuICAgICAgICBhdmF0YXJGaWxlOiBhdmF0YXJGaWxlPy5maWxlc1swXVxyXG4gICAgfSlcclxuICAgIGlmKHBhcnNlSW50KGhlaWdodCBhcyBzdHJpbmcpICogcGFyc2VJbnQod2lkdGggYXMgc3RyaW5nKSA+IDI1MDApe1xyXG4gICAgICAgIGFsZXJ0KFwi0KDQsNC30LzQtdGAINGC0LDQsdC70LjRhtGLINC90LUg0LzQvtC20LXRgiDQv9GA0LXQstGL0YjQsNGC0YwgMjUwMCDRj9GH0LXQtdC6XCIpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHBvc3RUYWJsZShuZXdUYWJsZSlcclxuICAgIC50aGVuKCh0YWJsZSkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRhYmxlKVxyXG4gICAgICAgIGxvYWRTdG9yZSgpLnRoZW4oZHJhd0RpYWxvZ3MpXHJcbiAgICB9KTtcclxuICAgIGNsZWFyTWVudSgpO1xyXG4gICAgY2xvc2VNZW51KCk7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBvc3RUYWJsZSh0YWJsZSkge1xyXG4gICAgcmV0dXJuIGh0dHBDbGllbnQucHJvY2VlZFJlcXVlc3QoXHJcbiAgICAgICAgdGFibGUsXHJcbiAgICAgICAgKGNvZGUsIGVycm9yVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBhbGVydChgRXJyb3IgaGFwcGVuZWQgd2hpbGUgY3JlYXRpbmcgdGFibGU6ICR7Y29kZX0sICR7ZXJyb3JUZXh0fWApXHJcbiAgICAgICAgfVxyXG4gICAgKVxyXG59XHJcblxyXG5mdW5jdGlvbiBjbGVhck1lbnUoKSB7XHJcbiAgICAkKCcjY2xlYXItYnV0dG9uJykuY2xpY2soKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2xvc2VNZW51KCkge1xyXG4gICAgJCgnI2Nsb3NlLWJ1dHRvbicpLmNsaWNrKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvYWRTdG9yZSgpIHtcclxuICAgIHJldHVybiBodHRwQ2xpZW50LnByb2NlZWRSZXF1ZXN0KFxyXG4gICAgICAgIG5ldyBVc2VySW5mb1JlcXVlc3QoeyBpbmNsdWRlQ2hhdHM6IHRydWUgfSksXHJcbiAgICAgICAgKGNvZGUsIGVycm9yVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBhbGVydChgRXJyb3IgaGFwcGVuZWQgd2hpbGUgbG9hZGluZyB1c2VyIGluZm86ICR7Y29kZX0sICR7ZXJyb3JUZXh0fWApXHJcbiAgICAgICAgfVxyXG4gICAgKS50aGVuKHVzZXIgPT4ge1xyXG4gICAgICAgIHN0b3JlLmRpYWxvZ3MgPSB1c2VyLmNoYXRzO1xyXG4gICAgfSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrQXV0aG9yaXphdGlvbigpIHtcclxuICAgIHJldHVybiBodHRwQ2xpZW50LnByb2NlZWRSZXF1ZXN0KFxyXG4gICAgICAgIG5ldyBJc0xvZ2dlZEluUmVxdWVzdCgpLFxyXG4gICAgICAgICgpID0+IHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gbGluayArIFwiL29hdXRoMi9hdXRob3JpemF0aW9uL2dvb2dsZVwiXHJcbiAgICApO1xyXG59IiwiaW1wb3J0IHtSZXF1ZXN0V3JhcHBlcn0gZnJvbSBcIi4vcmVxdWVzdC9SZXF1ZXN0XCI7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEh0dHBDbGllbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBhcGlMaW5rOiBzdHJpbmcpIHt9XHJcblxyXG4gICAgYXN5bmMgcHJvY2VlZFJlcXVlc3Q8VD4oXHJcbiAgICAgICAgcmVxdWVzdDogUmVxdWVzdFdyYXBwZXI8VD4sXHJcbiAgICAgICAgb25GYWlsdXJlOiAoY29kZTogbnVtYmVyLCBlcnJvclRleHQ6IHN0cmluZykgPT4gdW5rbm93biA9XHJcbiAgICAgICAgICAgIChjb2RlLCBlcnJvclRleHQpID0+IGFsZXJ0KGBjb2RlOiAke2NvZGV9LCBlcnJvcjogJHtlcnJvclRleHR9YCksXHJcbiAgICAgICAgb25OZXR3b3JrRmFpbHVyZTogKHJlYXNvbikgPT4gdW5rbm93biA9XHJcbiAgICAgICAgICAgIChyZWFzb24pID0+IGFsZXJ0KGBuZXR3b3JrIGVycm9yOiAke3JlYXNvbn1gKVxyXG4gICAgKTogUHJvbWlzZTxUPntcclxuICAgICAgICBjb25zdCBmaW5hbExpbmsgPSBuZXcgVVJMKHRoaXMuYXBpTGluayArIHJlcXVlc3QuZW5kcG9pbnQpXHJcbiAgICAgICAgaWYocmVxdWVzdC5wYXJhbWV0ZXJzICE9IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgZmluYWxMaW5rLnNlYXJjaCA9IG5ldyBVUkxTZWFyY2hQYXJhbXMocmVxdWVzdC5wYXJhbWV0ZXJzKS50b1N0cmluZygpXHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKHJlcXVlc3QpXHJcbiAgICAgICAgcmV0dXJuIGZldGNoKFxyXG4gICAgICAgICAgICBmaW5hbExpbmsudG9TdHJpbmcoKSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwiaW5jbHVkZVwiLFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiByZXF1ZXN0Lm1ldGhvZFR5cGUsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiByZXF1ZXN0LmhlYWRlcnMsXHJcbiAgICAgICAgICAgICAgICBib2R5OiByZXF1ZXN0LmJvZHlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICkudGhlbigocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgaWYocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucHJvY2VlZFJlcXVlc3QocmVzcG9uc2UpXHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UudGV4dCgpLnRoZW4odGV4dCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgb25GYWlsdXJlKHJlc3BvbnNlLnN0YXR1cywgdGV4dClcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QodGV4dClcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZW51bSBNZXRob2RUeXBle1xyXG4gICAgUE9TVD1cIlBPU1RcIixcclxuICAgIEdFVD1cIkdFVFwiLFxyXG4gICAgUEFUQ0g9XCJQQVRDSFwiLFxyXG4gICAgUFVUPVwiUFVUXCIsXHJcbn0iLCJpbXBvcnQge01ldGhvZFR5cGV9IGZyb20gXCIuLi9IdHRwQ2xpZW50XCI7XHJcbmltcG9ydCB7UmVxdWVzdFdyYXBwZXJ9IGZyb20gXCIuL1JlcXVlc3RcIjtcclxuaW1wb3J0IHtVc2VyUmVzcG9uc2V9IGZyb20gXCIuL1VzZXJJbmZvUmVxdWVzdFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRhYmxlUmVzcG9uc2Uge1xyXG4gICAgcmVhZG9ubHkgaWQhOiBudW1iZXJcclxuICAgIHJlYWRvbmx5IG5hbWUhOiBzdHJpbmdcclxuICAgIHJlYWRvbmx5IGNyZWF0b3IhOiBudW1iZXJcclxuICAgIHJlYWRvbmx5IHdpZHRoITogbnVtYmVyXHJcbiAgICByZWFkb25seSBoZWlnaHQhOiBudW1iZXJcclxuICAgIHJlYWRvbmx5IGF2YXRhciE6IG51bWJlclxyXG4gICAgcmVhZG9ubHkgY3JlYXRlZCE6IERhdGVcclxuICAgIHJlYWRvbmx5IGxhc3RNZXNzYWdlSWQ/OiBudW1iZXJcclxuICAgIHJlYWRvbmx5IHBhcnRpY2lwYW50cz86IFVzZXJSZXNwb25zZVtdXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDcmVhdGVUYWJsZVJlcXVlc3QgaW1wbGVtZW50cyBSZXF1ZXN0V3JhcHBlcjxUYWJsZVJlc3BvbnNlPiB7XHJcbiAgICByZWFkb25seSBib2R5PzogRm9ybURhdGFcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihib2R5OiB7XHJcbiAgICAgICAgbmFtZTogc3RyaW5nLFxyXG4gICAgICAgIHdpZHRoOiBudW1iZXIsXHJcbiAgICAgICAgaGVpZ2h0OiBudW1iZXIsXHJcbiAgICAgICAgYXZhdGFyRmlsZT86IEZpbGUsXHJcbiAgICAgICAgYXZhdGFyTGluaz86IHN0cmluZ1xyXG4gICAgfSkge1xyXG4gICAgICAgIHRoaXMuYm9keSA9IG5ldyBGb3JtRGF0YSgpXHJcbiAgICAgICAgdGhpcy5ib2R5LmFwcGVuZCgnbmFtZScsIGJvZHkubmFtZSlcclxuICAgICAgICB0aGlzLmJvZHkuYXBwZW5kKCd3aWR0aCcsIGJvZHkud2lkdGgudG9TdHJpbmcoKSlcclxuICAgICAgICB0aGlzLmJvZHkuYXBwZW5kKCdoZWlnaHQnLCBib2R5LmhlaWdodC50b1N0cmluZygpKVxyXG4gICAgICAgIGlmIChib2R5LmF2YXRhckxpbmsgPT0gdW5kZWZpbmVkICYmIGJvZHkuYXZhdGFyRmlsZSA9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3Qgc2VuZCByZXF1ZXN0IHdpdGggbm8gYXZhdGFyXCIpXHJcbiAgICAgICAgaWYgKGJvZHkuYXZhdGFyRmlsZSAhPSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRoaXMuYm9keS5hcHBlbmQoJ2F2YXRhckZpbGUnLCBib2R5LmF2YXRhckZpbGUpXHJcbiAgICAgICAgaWYgKGJvZHkuYXZhdGFyTGluayAhPSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRoaXMuYm9keS5hcHBlbmQoJ2F2YXRhckxpbmsnLCBib2R5LmF2YXRhckxpbmspXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgcHJvY2VlZFJlcXVlc3QocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTxUYWJsZVJlc3BvbnNlPiB7XHJcbiAgICAgICAgY29uc3QgdGV4dCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKVxyXG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHRleHQpIGFzIFRhYmxlUmVzcG9uc2VcclxuICAgIH1cclxuXHJcbiAgICBlbmRwb2ludDogc3RyaW5nID0gXCIvdGFibGUvY3JlYXRlXCI7XHJcbiAgICBoZWFkZXJzPzogSGVhZGVyc0luaXQgPSB7XHJcbiAgICAgICAgXCJDb250ZW50LVR5cGVzXCI6IFwiYXBwbGljYXRpb24vanNvblwiXHJcbiAgICB9O1xyXG4gICAgbWV0aG9kVHlwZTogTWV0aG9kVHlwZSA9IE1ldGhvZFR5cGUuUE9TVDtcclxufSIsImltcG9ydCB7UmVxdWVzdFdyYXBwZXJ9IGZyb20gXCIuL1JlcXVlc3RcIjtcclxuaW1wb3J0IHtNZXRob2RUeXBlfSBmcm9tIFwiLi4vSHR0cENsaWVudFwiO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBJc0xvZ2dlZEluUmVxdWVzdCBpbXBsZW1lbnRzIFJlcXVlc3RXcmFwcGVyPG51bWJlcj57XHJcbiAgICByZWFkb25seSBlbmRwb2ludDogc3RyaW5nID0gJy91c2VyL2xvZ2luJztcclxuICAgIHJlYWRvbmx5IG1ldGhvZFR5cGU6IE1ldGhvZFR5cGUgPSBNZXRob2RUeXBlLkdFVDtcclxuXHJcbiAgICBhc3luYyBwcm9jZWVkUmVxdWVzdChyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPG51bWJlcj4ge1xyXG4gICAgICAgIHJldHVybiByZXNwb25zZS5zdGF0dXM7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQge1JlcXVlc3RXcmFwcGVyfSBmcm9tIFwiLi9SZXF1ZXN0XCI7XHJcbmltcG9ydCB7VGFibGVSZXNwb25zZX0gZnJvbSBcIi4vQ3JlYXRlVGFibGVSZXF1ZXN0XCI7XHJcbmltcG9ydCB7TWV0aG9kVHlwZX0gZnJvbSBcIi4uL0h0dHBDbGllbnRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBVc2VyUmVzcG9uc2V7XHJcbiAgICByZWFkb25seSBpZCE6IHN0cmluZ1xyXG4gICAgcmVhZG9ubHkgbmFtZSE6IHN0cmluZ1xyXG4gICAgcmVhZG9ubHkgZW1haWwhOiBzdHJpbmdcclxuICAgIHJlYWRvbmx5IGF2YXRhciE6IHN0cmluZ1xyXG4gICAgcmVhZG9ubHkgY3JlYXRlZCE6IERhdGVcclxuICAgIHJlYWRvbmx5IGNoYXRzPzogVGFibGVSZXNwb25zZVtdXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBVc2VySW5mb1JlcXVlc3QgaW1wbGVtZW50cyBSZXF1ZXN0V3JhcHBlcjxVc2VyUmVzcG9uc2U+e1xyXG4gICAgcmVhZG9ubHkgcGFyYW1ldGVyczogUmVjb3JkPHN0cmluZywgc3RyaW5nPlxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBhcmFtZXRlcnM6IHsgaW5jbHVkZUNoYXRzPzogYm9vbGVhbiB9KSB7XHJcbiAgICAgICAgbGV0IHBhcmFtczogYW55ID0ge31cclxuICAgICAgICBpZihwYXJhbWV0ZXJzLmluY2x1ZGVDaGF0cylcclxuICAgICAgICAgICAgcGFyYW1zLmluY2x1ZGVDaGF0cyA9IHBhcmFtZXRlcnMuaW5jbHVkZUNoYXRzPy50b1N0cmluZygpXHJcblxyXG4gICAgICAgIHRoaXMucGFyYW1ldGVycyA9IHBhcmFtc1xyXG4gICAgfVxyXG5cclxuICAgIHJlYWRvbmx5IGVuZHBvaW50OiBzdHJpbmcgPSBcIi91c2VyL2luZm9cIjtcclxuICAgIHJlYWRvbmx5IG1ldGhvZFR5cGU6IE1ldGhvZFR5cGUgPSBNZXRob2RUeXBlLkdFVDtcclxuXHJcbiAgICBhc3luYyBwcm9jZWVkUmVxdWVzdChyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPFVzZXJSZXNwb25zZT4ge1xyXG4gICAgICAgIGNvbnN0IHRleHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XHJcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodGV4dCkgYXMgVXNlclJlc3BvbnNlO1xyXG4gICAgfVxyXG59Il19
