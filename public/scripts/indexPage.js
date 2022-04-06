(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        $('.clickable').toggleClass('d-none');
    });
}
function checkAuthorization() {
    return httpClient.proceedRequest(new IsLoggedInRequest_1.IsLoggedInRequest(), function () { return window.location.href = link + "/oauth2/authorization/google"; });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJUU2NyaXB0L2luZGV4LnRzIiwiVFNjcmlwdC91dGlsL0h0dHBDbGllbnQudHMiLCJUU2NyaXB0L3V0aWwvcmVxdWVzdC9DcmVhdGVUYWJsZVJlcXVlc3QudHMiLCJUU2NyaXB0L3V0aWwvcmVxdWVzdC9Jc0xvZ2dlZEluUmVxdWVzdC50cyIsIlRTY3JpcHQvdXRpbC9yZXF1ZXN0L1VzZXJJbmZvUmVxdWVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsZ0RBQTZDO0FBQzdDLHdFQUFxRTtBQUVyRSxrRUFBK0Q7QUFDL0Qsc0VBQW1FO0FBRW5FLElBQUksS0FBSyxHQUFRO0lBQ2IsUUFBUSxFQUFFO1FBQ047WUFDSSxFQUFFLEVBQUUsQ0FBQztZQUNMLElBQUksRUFBRSxtQkFBbUI7WUFDekIsVUFBVSxFQUFFLFFBQVE7WUFDcEIsV0FBVyxFQUFFLDRCQUE0QjtZQUN6QyxJQUFJLEVBQUUsT0FBTztZQUNiLGFBQWEsRUFBRSxFQUFFO1lBQ2pCLE1BQU0sRUFBRSxrQkFBa0I7WUFDMUIsS0FBSyxFQUFFLEdBQUc7WUFDVixNQUFNLEVBQUUsR0FBRztTQUNkO1FBQ0Q7WUFDSSxFQUFFLEVBQUUsQ0FBQztZQUNMLElBQUksRUFBRSxzQkFBc0I7WUFDNUIsVUFBVSxFQUFFLGdCQUFnQjtZQUM1QixXQUFXLEVBQUUsb0JBQW9CO1lBQ2pDLElBQUksRUFBRSxPQUFPO1lBQ2IsYUFBYSxFQUFFLEVBQUU7WUFDakIsTUFBTSxFQUFFLGtCQUFrQjtZQUMxQixLQUFLLEVBQUUsRUFBRTtZQUNULE1BQU0sRUFBRSxHQUFHO1NBQ2Q7UUFDRDtZQUNJLEVBQUUsRUFBRSxDQUFDO1lBQ0wsSUFBSSxFQUFFLDBCQUEwQjtZQUNoQyxVQUFVLEVBQUUsY0FBYztZQUMxQixXQUFXLEVBQUUsdUVBQXVFO1lBQ3BGLElBQUksRUFBRSxPQUFPO1lBQ2IsYUFBYSxFQUFFLENBQUM7WUFD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O0lBQUQsbUJBQUM7QUFBRCxDQVBBLEFBT0MsSUFBQTtBQVBZLG9DQUFZO0FBU3pCO0lBR0kseUJBQVksVUFBc0M7O1FBUXpDLGFBQVEsR0FBVyxZQUFZLENBQUM7UUFDaEMsZUFBVSxHQUFlLHVCQUFVLENBQUMsR0FBRyxDQUFDO1FBUjdDLElBQUksTUFBTSxHQUFRLEVBQUUsQ0FBQTtRQUNwQixJQUFHLFVBQVUsQ0FBQyxZQUFZO1lBQ3RCLE1BQU0sQ0FBQyxZQUFZLEdBQUcsTUFBQSxVQUFVLENBQUMsWUFBWSwwQ0FBRSxRQUFRLEVBQUUsQ0FBQTtRQUU3RCxJQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQTtJQUM1QixDQUFDO0lBS0ssd0NBQWMsR0FBcEIsVUFBcUIsUUFBa0I7Ozs7OzRCQUN0QixxQkFBTSxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUE7O3dCQUE1QixJQUFJLEdBQUcsU0FBcUI7d0JBQ2xDLHNCQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFpQixFQUFDOzs7O0tBQzNDO0lBQ0wsc0JBQUM7QUFBRCxDQWxCQSxBQWtCQyxJQUFBO0FBbEJZLDBDQUFlIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IHtIdHRwQ2xpZW50fSBmcm9tIFwiLi91dGlsL0h0dHBDbGllbnRcIjtcclxuaW1wb3J0IHtDcmVhdGVUYWJsZVJlcXVlc3R9IGZyb20gXCIuL3V0aWwvcmVxdWVzdC9DcmVhdGVUYWJsZVJlcXVlc3RcIjtcclxuaW1wb3J0IHtUYWJsZUluZm9SZXF1ZXN0fSBmcm9tIFwiLi91dGlsL3JlcXVlc3QvVGFibGVJbmZvUmVxdWVzdFwiO1xyXG5pbXBvcnQge1VzZXJJbmZvUmVxdWVzdH0gZnJvbSBcIi4vdXRpbC9yZXF1ZXN0L1VzZXJJbmZvUmVxdWVzdFwiO1xyXG5pbXBvcnQge0lzTG9nZ2VkSW5SZXF1ZXN0fSBmcm9tIFwiLi91dGlsL3JlcXVlc3QvSXNMb2dnZWRJblJlcXVlc3RcIjtcclxuXHJcbmxldCBzdG9yZTogYW55ID0ge1xyXG4gICAgZGlhbG9nczI6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlkOiAwLFxyXG4gICAgICAgICAgICBuYW1lOiAn0JLQuNGC0LDQu9GPINC4INC60L7QvNC/0LDQvdC40Y8nLFxyXG4gICAgICAgICAgICBsYXN0U2VuZGVyOiAn0JLQuNGC0LDQu9GPJyxcclxuICAgICAgICAgICAgbGFzdE1lc3NhZ2U6ICfQn9GA0LjQstC10YIsINC/0YDQuNGF0L7QtNC4INC/0LjRgtGMINC60YDQvtCy0YwnLFxyXG4gICAgICAgICAgICB0aW1lOiAn0LLRh9C10YDQsCcsXHJcbiAgICAgICAgICAgIG1lc3NhZ2VzQ291bnQ6IDUxLFxyXG4gICAgICAgICAgICBhdmF0YXI6ICcuL3BpY3R1cmVzLzEucG5nJyxcclxuICAgICAgICAgICAgd2lkdGg6IDEwMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiAxMjBcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWQ6IDEsXHJcbiAgICAgICAgICAgIG5hbWU6ICfQkdC10YHQtdC00LAg0L3QtSDQtNC70Y8g0LPQu9GD0L/Ri9GFJyxcclxuICAgICAgICAgICAgbGFzdFNlbmRlcjogJ9Ca0YLQvtCi0L4g0J3QtdCT0LvRg9C/0YvQuScsXHJcbiAgICAgICAgICAgIGxhc3RNZXNzYWdlOiAn0KHQutC+0LvRjNC60L4g0LHRg9C00LXRgiAyKzI/JyxcclxuICAgICAgICAgICAgdGltZTogJ9Cy0YfQtdGA0LAnLFxyXG4gICAgICAgICAgICBtZXNzYWdlc0NvdW50OiAxNyxcclxuICAgICAgICAgICAgYXZhdGFyOiAnLi9waWN0dXJlcy8yLnBuZycsXHJcbiAgICAgICAgICAgIHdpZHRoOiAxMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiAxMTJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWQ6IDIsXHJcbiAgICAgICAgICAgIG5hbWU6ICfQkdC10YHQtdC00LAg0YLQvtC70YzQutC+INC00LvRjyDQs9C70YPQv9GL0YUnLFxyXG4gICAgICAgICAgICBsYXN0U2VuZGVyOiAn0KHQsNC80YvQuSDQk9C70YPQv9GL0LknLFxyXG4gICAgICAgICAgICBsYXN0TWVzc2FnZTogJ9Cg0LXQsdGP0YLQsCwg0Y8g0YLQvtC70YzQutC+INGH0YLQviDQtNC+0LrQsNC30LDQuyDQs9C40L/QvtGC0LXQt9GDINCg0LjQvNCw0L3QsCEg0JrQvtGA0L7Rh9C1LCDRgtCw0Lwg0LLRgdGRINC/0YDQvtGB0YLQviEnLFxyXG4gICAgICAgICAgICB0aW1lOiAnMTE6MzAnLFxyXG4gICAgICAgICAgICBtZXNzYWdlc0NvdW50OiAwLFxyXG4gICAgICAgICAgICBhdmF0YXI6ICcuL3BpY3R1cmVzLzMucG5nJyxcclxuICAgICAgICAgICAgd2lkdGg6IDIwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDQwXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlkOiAzLFxyXG4gICAgICAgICAgICBuYW1lOiAn0JHQtdGB0LXQtNCwINGBINC+0YfQtdC90Ywg0LTQu9C40L3QvdGL0Lwg0L3QsNC30LLQsNC90LjQtdC8LiDQoNC10LHRj9GC0LAsINGPINC90LUg0L/RgNC10LTRgdGC0LDQstC70Y/RjiDQutC+0LzRgyDQsiDQs9C+0LvQvtCy0YMg0L/RgNC40YjQu9C+INC00LDQstCw0YLRjCDRgtCw0LrQvtC1INC00LvQuNC90L3QvtC1INC90LDQt9Cy0LDQvdC40LUuINCg0LXQsdGP0YLQsCwg0L/RgNC10LTQu9Cw0LPQsNGOINC+0LPRgNCw0L3QuNGH0LjRgtGMINC00LvQuNC90YMg0L3QsNC30LLQsNC90LjQuScsXHJcbiAgICAgICAgICAgIGxhc3RTZW5kZXI6ICfQktC40YLQsNC70Y8nLFxyXG4gICAgICAgICAgICBsYXN0TWVzc2FnZTogJ9Cf0YDQuNCy0LXRgiwg0LPQu9GP0L3RjCDQu9GBJyxcclxuICAgICAgICAgICAgdGltZTogJzE0OjE1JyxcclxuICAgICAgICAgICAgbWVzc2FnZXNDb3VudDogMCxcclxuICAgICAgICAgICAgYXZhdGFyOiAnLi9waWN0dXJlcy80LnBuZycsXHJcbiAgICAgICAgICAgIHdpZHRoOiAxMDAwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDEwMDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWQ6IDQsXHJcbiAgICAgICAgICAgIG5hbWU6ICfQktC40YLQsNC70Y8g0KLRgNGD0LHQvtC10LQnLFxyXG4gICAgICAgICAgICBsYXN0U2VuZGVyOiAnJyxcclxuICAgICAgICAgICAgbGFzdE1lc3NhZ2U6ICfQlNCw0LLQvdC+INGH0LjRgtCw0Lsg0LHQtdGB0LXQtNGDPycsXHJcbiAgICAgICAgICAgIHRpbWU6ICcxOTo1MScsXHJcbiAgICAgICAgICAgIG1lc3NhZ2VzQ291bnQ6IDQsXHJcbiAgICAgICAgICAgIGF2YXRhcjogJy4vcGljdHVyZXMvNS5wbmcnLFxyXG4gICAgICAgICAgICB3aWR0aDogMTAwMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiA1MDBcclxuICAgICAgICB9XHJcbiAgICBdXHJcbn1cclxubGV0IGxpbmsgPSBcImh0dHBzOi8vY29tZ3JpZC5ydTo4NDQzXCI7XHJcbmNvbnN0IGh0dHBDbGllbnQgPSBuZXcgSHR0cENsaWVudChsaW5rKVxyXG5cclxuJCh3aW5kb3cpLm9uKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgY2hlY2tBdXRob3JpemF0aW9uKClcclxuICAgIC50aGVuKGxvYWRTdG9yZSlcclxuICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAkKCcjY3JlYXRlLXRhYmxlLWZvcm0nKS5vbignc3VibWl0Jywgc3VibWl0KTtcclxuICAgICAgICBkcmF3RGlhbG9ncygpXHJcblxyXG4gICAgICAgICQoJy5jbGlja2FibGUnKS5vbignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICQoJy5jbGlja2FibGUnKS50b2dnbGVDbGFzcygnZC1ub25lJylcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KVxyXG5cclxuZnVuY3Rpb24gZHJhd0RpYWxvZ3MoKSB7XHJcbiAgICBsZXQgJGNvbnRhaW5lciA9ICQoJy5jaGF0LWNvbnRhaW5lcicpO1xyXG4gICAgbGV0ICRub0RlbCA9ICRjb250YWluZXIuZmluZCgnLm5vLWRlbGV0YWJsZScpO1xyXG4gICAgJGNvbnRhaW5lci5odG1sKCcnKTtcclxuICAgICRjb250YWluZXIuYXBwZW5kKCRub0RlbCk7XHJcbiAgICBzdG9yZS5kaWFsb2dzLnNsaWNlKCkucmV2ZXJzZSgpLmZvckVhY2goKGRpYWxvZywgaW5kZXgpID0+IHtcclxuICAgICAgICBsZXQgZGlhbG9nMiA9IHN0b3JlLmRpYWxvZ3MyW2luZGV4XTtcclxuICAgICAgICBsZXQgJGNoYXQgPSAkKCcuY2hhdCcpLmNsb25lKCk7XHJcbiAgICAgICAgJGNoYXQucmVtb3ZlQ2xhc3MoJ2NoYXQgZC1ub25lJyk7XHJcbiAgICAgICAgJGNoYXQuZmluZCgnYScpLmF0dHIoJ2hyZWYnLCAncGFnZXMvdGFibGUuaHRtbD9pZD0nICsgZGlhbG9nLmlkKTtcclxuICAgICAgICAkY2hhdC5maW5kKCcuY2hhdC1uYW1lJykudGV4dChkaWFsb2cubmFtZSk7XHJcbiAgICAgICAgJGNoYXQuZmluZCgnLmNoYXQtc2VuZGVyJykudGV4dChkaWFsb2cyLmxhc3RTZW5kZXIgKyAoZGlhbG9nMi5sYXN0U2VuZGVyID09PSAnJyA/ICcnIDogJzonKSk7XHJcbiAgICAgICAgJGNoYXQuZmluZCgnLmNoYXQtdGV4dCcpLnRleHQoZGlhbG9nMi5sYXN0TWVzc2FnZSk7XHJcbiAgICAgICAgJGNoYXQuZmluZCgnLmNoYXQtdGltZScpLnRleHQoZGlhbG9nMi50aW1lKTtcclxuICAgICAgICBpZihkaWFsb2cuYXZhdGFyLnN0YXJ0c1dpdGgoXCIvXCIpKVxyXG4gICAgICAgICAgICBkaWFsb2cuYXZhdGFyID0gbGluayArIGRpYWxvZy5hdmF0YXJcclxuICAgICAgICAkY2hhdC5maW5kKCdpbWcnKS5hdHRyKCdzcmMnLCBkaWFsb2cuYXZhdGFyKTtcclxuICAgICAgICAkY2hhdC5maW5kKCcuY2hhdC1zaXplJykudGV4dChkaWFsb2cud2lkdGggKyAnw5cnICsgZGlhbG9nLmhlaWdodClcclxuICAgICAgICBkaWFsb2cyLm1lc3NhZ2VzQ291bnQgPT09IDBcclxuICAgICAgICAgICAgPyAkY2hhdC5maW5kKCcuY2hhdC11bnJlYWQnKS5yZW1vdmUoKVxyXG4gICAgICAgICAgICA6ICRjaGF0LmZpbmQoJy5jaGF0LXVucmVhZCcpLnRleHQoZGlhbG9nMi5tZXNzYWdlc0NvdW50KTtcclxuICAgICAgICAkY29udGFpbmVyLmFwcGVuZCgkY2hhdCk7XHJcbiAgICAgICAgJGNoYXQub24oJ21vdXNlZW50ZXInLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICRjaGF0LnJlbW92ZUNsYXNzKCdiZy1saWdodCcpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJGNoYXQub24oJ21vdXNlbGVhdmUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICRjaGF0LmFkZENsYXNzKCdiZy1saWdodCcpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJGNoYXQub24oJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBkaWFsb2cubWVzc2FnZXNDb3VudCA9IDA7XHJcbiAgICAgICAgICAgIGRyYXdEaWFsb2dzKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gc3VibWl0KCkge1xyXG4gICAgY29uc3QgYXZhdGFyRmlsZTogYW55ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RhYmxlLWltYWdlLWZpbGUtaW5wdXQnKVxyXG4gICAgbGV0IGF2YXRhckxpbmsgPSAkKCcjdGFibGUtaW1hZ2UtbGluay1pbnB1dCcpLnZhbCgpO1xyXG4gICAgaWYoYXZhdGFyTGluayA9PT0gXCJcIiAmJiBhdmF0YXJGaWxlLmZpbGVzWzBdID09PSBudWxsKXtcclxuICAgICAgICBhbGVydChcIllvdSBtdXN0IHNwZWNpZnkgZWl0aGVyIGltYWdlIG9yIGxpbmsgdG8gaW1hZ2VcIilcclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgIH1cclxuICAgIGxldCBoZWlnaHQgPSAkKCcjdGFibGUtaGVpZ2h0LWlucHV0JykudmFsKCk7XHJcbiAgICBsZXQgd2lkdGggPSAkKCcjdGFibGUtd2lkdGgtaW5wdXQnKS52YWwoKTtcclxuICAgIGNvbnN0IG5ld1RhYmxlID0gbmV3IENyZWF0ZVRhYmxlUmVxdWVzdCh7XHJcbiAgICAgICAgbmFtZTogJCgnI3RhYmxlLW5hbWUtaW5wdXQnKS52YWwoKSBhcyBzdHJpbmcsXHJcbiAgICAgICAgd2lkdGg6IHdpZHRoIGFzIG51bWJlcixcclxuICAgICAgICBoZWlnaHQ6IGhlaWdodCBhcyBudW1iZXIsXHJcbiAgICAgICAgYXZhdGFyTGluazogYXZhdGFyTGluayBhcyBzdHJpbmcsXHJcbiAgICAgICAgYXZhdGFyRmlsZTogYXZhdGFyRmlsZT8uZmlsZXNbMF1cclxuICAgIH0pXHJcbiAgICBpZihwYXJzZUludChoZWlnaHQgYXMgc3RyaW5nKSAqIHBhcnNlSW50KHdpZHRoIGFzIHN0cmluZykgPiAyNTAwKXtcclxuICAgICAgICBhbGVydChcItCg0LDQt9C80LXRgCDRgtCw0LHQu9C40YbRiyDQvdC1INC80L7QttC10YIg0L/RgNC10LLRi9GI0LDRgtGMIDI1MDAg0Y/Rh9C10LXQulwiKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBwb3N0VGFibGUobmV3VGFibGUpXHJcbiAgICAudGhlbigodGFibGUpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyh0YWJsZSlcclxuICAgICAgICBsb2FkU3RvcmUoKS50aGVuKGRyYXdEaWFsb2dzKVxyXG4gICAgfSk7XHJcbiAgICBjbGVhck1lbnUoKTtcclxuICAgIGNsb3NlTWVudSgpO1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwb3N0VGFibGUodGFibGUpIHtcclxuICAgIHJldHVybiBodHRwQ2xpZW50LnByb2NlZWRSZXF1ZXN0KFxyXG4gICAgICAgIHRhYmxlLFxyXG4gICAgICAgIChjb2RlLCBlcnJvclRleHQpID0+IHtcclxuICAgICAgICAgICAgYWxlcnQoYEVycm9yIGhhcHBlbmVkIHdoaWxlIGNyZWF0aW5nIHRhYmxlOiAke2NvZGV9LCAke2Vycm9yVGV4dH1gKVxyXG4gICAgICAgIH1cclxuICAgIClcclxufVxyXG5cclxuZnVuY3Rpb24gY2xlYXJNZW51KCkge1xyXG4gICAgJCgnI2NsZWFyLWJ1dHRvbicpLmNsaWNrKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNsb3NlTWVudSgpIHtcclxuICAgICQoJyNjbG9zZS1idXR0b24nKS5jbGljaygpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBsb2FkU3RvcmUoKSB7XHJcbiAgICByZXR1cm4gaHR0cENsaWVudC5wcm9jZWVkUmVxdWVzdChcclxuICAgICAgICBuZXcgVXNlckluZm9SZXF1ZXN0KHsgaW5jbHVkZUNoYXRzOiB0cnVlIH0pLFxyXG4gICAgICAgIChjb2RlLCBlcnJvclRleHQpID0+IHtcclxuICAgICAgICAgICAgYWxlcnQoYEVycm9yIGhhcHBlbmVkIHdoaWxlIGxvYWRpbmcgdXNlciBpbmZvOiAke2NvZGV9LCAke2Vycm9yVGV4dH1gKVxyXG4gICAgICAgIH1cclxuICAgICkudGhlbih1c2VyID0+IHtcclxuICAgICAgICBzdG9yZS5kaWFsb2dzID0gdXNlci5jaGF0cztcclxuICAgICAgICAkKCcuY2xpY2thYmxlJykudG9nZ2xlQ2xhc3MoJ2Qtbm9uZScpO1xyXG4gICAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gY2hlY2tBdXRob3JpemF0aW9uKCkge1xyXG4gICAgcmV0dXJuIGh0dHBDbGllbnQucHJvY2VlZFJlcXVlc3QoXHJcbiAgICAgICAgbmV3IElzTG9nZ2VkSW5SZXF1ZXN0KCksXHJcbiAgICAgICAgKCkgPT4gd2luZG93LmxvY2F0aW9uLmhyZWYgPSBsaW5rICsgXCIvb2F1dGgyL2F1dGhvcml6YXRpb24vZ29vZ2xlXCJcclxuICAgICk7XHJcbn0iLCJpbXBvcnQge1JlcXVlc3RXcmFwcGVyfSBmcm9tIFwiLi9yZXF1ZXN0L1JlcXVlc3RcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgSHR0cENsaWVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGFwaUxpbms6IHN0cmluZykge31cclxuXHJcbiAgICBhc3luYyBwcm9jZWVkUmVxdWVzdDxUPihcclxuICAgICAgICByZXF1ZXN0OiBSZXF1ZXN0V3JhcHBlcjxUPixcclxuICAgICAgICBvbkZhaWx1cmU6IChjb2RlOiBudW1iZXIsIGVycm9yVGV4dDogc3RyaW5nKSA9PiB1bmtub3duID1cclxuICAgICAgICAgICAgKGNvZGUsIGVycm9yVGV4dCkgPT4gYWxlcnQoYGNvZGU6ICR7Y29kZX0sIGVycm9yOiAke2Vycm9yVGV4dH1gKSxcclxuICAgICAgICBvbk5ldHdvcmtGYWlsdXJlOiAocmVhc29uKSA9PiB1bmtub3duID1cclxuICAgICAgICAgICAgKHJlYXNvbikgPT4gYWxlcnQoYG5ldHdvcmsgZXJyb3I6ICR7cmVhc29ufWApXHJcbiAgICApOiBQcm9taXNlPFQ+e1xyXG4gICAgICAgIGNvbnN0IGZpbmFsTGluayA9IG5ldyBVUkwodGhpcy5hcGlMaW5rICsgcmVxdWVzdC5lbmRwb2ludClcclxuICAgICAgICBpZihyZXF1ZXN0LnBhcmFtZXRlcnMgIT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICBmaW5hbExpbmsuc2VhcmNoID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhyZXF1ZXN0LnBhcmFtZXRlcnMpLnRvU3RyaW5nKClcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2cocmVxdWVzdClcclxuICAgICAgICByZXR1cm4gZmV0Y2goXHJcbiAgICAgICAgICAgIGZpbmFsTGluay50b1N0cmluZygpLFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjcmVkZW50aWFsczogXCJpbmNsdWRlXCIsXHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6IHJlcXVlc3QubWV0aG9kVHlwZSxcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHJlcXVlc3QuaGVhZGVycyxcclxuICAgICAgICAgICAgICAgIGJvZHk6IHJlcXVlc3QuYm9keVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKS50aGVuKChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICBpZihyZXNwb25zZS5zdGF0dXMgPT09IDIwMCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wcm9jZWVkUmVxdWVzdChyZXNwb25zZSlcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICByZXNwb25zZS50ZXh0KCkudGhlbih0ZXh0ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBvbkZhaWx1cmUocmVzcG9uc2Uuc3RhdHVzLCB0ZXh0KVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCh0ZXh0KVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIE1ldGhvZFR5cGV7XHJcbiAgICBQT1NUPVwiUE9TVFwiLFxyXG4gICAgR0VUPVwiR0VUXCIsXHJcbiAgICBQQVRDSD1cIlBBVENIXCIsXHJcbiAgICBQVVQ9XCJQVVRcIixcclxufSIsImltcG9ydCB7TWV0aG9kVHlwZX0gZnJvbSBcIi4uL0h0dHBDbGllbnRcIjtcclxuaW1wb3J0IHtSZXF1ZXN0V3JhcHBlcn0gZnJvbSBcIi4vUmVxdWVzdFwiO1xyXG5pbXBvcnQge1VzZXJSZXNwb25zZX0gZnJvbSBcIi4vVXNlckluZm9SZXF1ZXN0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVGFibGVSZXNwb25zZSB7XHJcbiAgICByZWFkb25seSBpZCE6IG51bWJlclxyXG4gICAgcmVhZG9ubHkgbmFtZSE6IHN0cmluZ1xyXG4gICAgcmVhZG9ubHkgY3JlYXRvciE6IG51bWJlclxyXG4gICAgcmVhZG9ubHkgd2lkdGghOiBudW1iZXJcclxuICAgIHJlYWRvbmx5IGhlaWdodCE6IG51bWJlclxyXG4gICAgcmVhZG9ubHkgYXZhdGFyITogbnVtYmVyXHJcbiAgICByZWFkb25seSBjcmVhdGVkITogRGF0ZVxyXG4gICAgcmVhZG9ubHkgbGFzdE1lc3NhZ2VJZD86IG51bWJlclxyXG4gICAgcmVhZG9ubHkgcGFydGljaXBhbnRzPzogVXNlclJlc3BvbnNlW11cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENyZWF0ZVRhYmxlUmVxdWVzdCBpbXBsZW1lbnRzIFJlcXVlc3RXcmFwcGVyPFRhYmxlUmVzcG9uc2U+IHtcclxuICAgIHJlYWRvbmx5IGJvZHk/OiBGb3JtRGF0YVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKGJvZHk6IHtcclxuICAgICAgICBuYW1lOiBzdHJpbmcsXHJcbiAgICAgICAgd2lkdGg6IG51bWJlcixcclxuICAgICAgICBoZWlnaHQ6IG51bWJlcixcclxuICAgICAgICBhdmF0YXJGaWxlPzogRmlsZSxcclxuICAgICAgICBhdmF0YXJMaW5rPzogc3RyaW5nXHJcbiAgICB9KSB7XHJcbiAgICAgICAgdGhpcy5ib2R5ID0gbmV3IEZvcm1EYXRhKClcclxuICAgICAgICB0aGlzLmJvZHkuYXBwZW5kKCduYW1lJywgYm9keS5uYW1lKVxyXG4gICAgICAgIHRoaXMuYm9keS5hcHBlbmQoJ3dpZHRoJywgYm9keS53aWR0aC50b1N0cmluZygpKVxyXG4gICAgICAgIHRoaXMuYm9keS5hcHBlbmQoJ2hlaWdodCcsIGJvZHkuaGVpZ2h0LnRvU3RyaW5nKCkpXHJcbiAgICAgICAgaWYgKGJvZHkuYXZhdGFyTGluayA9PSB1bmRlZmluZWQgJiYgYm9keS5hdmF0YXJGaWxlID09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBzZW5kIHJlcXVlc3Qgd2l0aCBubyBhdmF0YXJcIilcclxuICAgICAgICBpZiAoYm9keS5hdmF0YXJGaWxlICE9IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhpcy5ib2R5LmFwcGVuZCgnYXZhdGFyRmlsZScsIGJvZHkuYXZhdGFyRmlsZSlcclxuICAgICAgICBpZiAoYm9keS5hdmF0YXJMaW5rICE9IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhpcy5ib2R5LmFwcGVuZCgnYXZhdGFyTGluaycsIGJvZHkuYXZhdGFyTGluaylcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBwcm9jZWVkUmVxdWVzdChyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPFRhYmxlUmVzcG9uc2U+IHtcclxuICAgICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpXHJcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodGV4dCkgYXMgVGFibGVSZXNwb25zZVxyXG4gICAgfVxyXG5cclxuICAgIGVuZHBvaW50OiBzdHJpbmcgPSBcIi90YWJsZS9jcmVhdGVcIjtcclxuICAgIGhlYWRlcnM/OiBIZWFkZXJzSW5pdCA9IHtcclxuICAgICAgICBcIkNvbnRlbnQtVHlwZXNcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcclxuICAgIH07XHJcbiAgICBtZXRob2RUeXBlOiBNZXRob2RUeXBlID0gTWV0aG9kVHlwZS5QT1NUO1xyXG59IiwiaW1wb3J0IHtSZXF1ZXN0V3JhcHBlcn0gZnJvbSBcIi4vUmVxdWVzdFwiO1xyXG5pbXBvcnQge01ldGhvZFR5cGV9IGZyb20gXCIuLi9IdHRwQ2xpZW50XCI7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIElzTG9nZ2VkSW5SZXF1ZXN0IGltcGxlbWVudHMgUmVxdWVzdFdyYXBwZXI8bnVtYmVyPntcclxuICAgIHJlYWRvbmx5IGVuZHBvaW50OiBzdHJpbmcgPSAnL3VzZXIvbG9naW4nO1xyXG4gICAgcmVhZG9ubHkgbWV0aG9kVHlwZTogTWV0aG9kVHlwZSA9IE1ldGhvZFR5cGUuR0VUO1xyXG5cclxuICAgIGFzeW5jIHByb2NlZWRSZXF1ZXN0KHJlc3BvbnNlOiBSZXNwb25zZSk6IFByb21pc2U8bnVtYmVyPiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnN0YXR1cztcclxuICAgIH1cclxufSIsImltcG9ydCB7UmVxdWVzdFdyYXBwZXJ9IGZyb20gXCIuL1JlcXVlc3RcIjtcclxuaW1wb3J0IHtUYWJsZVJlc3BvbnNlfSBmcm9tIFwiLi9DcmVhdGVUYWJsZVJlcXVlc3RcIjtcclxuaW1wb3J0IHtNZXRob2RUeXBlfSBmcm9tIFwiLi4vSHR0cENsaWVudFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFVzZXJSZXNwb25zZXtcclxuICAgIHJlYWRvbmx5IGlkITogc3RyaW5nXHJcbiAgICByZWFkb25seSBuYW1lITogc3RyaW5nXHJcbiAgICByZWFkb25seSBlbWFpbCE6IHN0cmluZ1xyXG4gICAgcmVhZG9ubHkgYXZhdGFyITogc3RyaW5nXHJcbiAgICByZWFkb25seSBjcmVhdGVkITogRGF0ZVxyXG4gICAgcmVhZG9ubHkgY2hhdHM/OiBUYWJsZVJlc3BvbnNlW11cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFVzZXJJbmZvUmVxdWVzdCBpbXBsZW1lbnRzIFJlcXVlc3RXcmFwcGVyPFVzZXJSZXNwb25zZT57XHJcbiAgICByZWFkb25seSBwYXJhbWV0ZXJzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+XHJcblxyXG4gICAgY29uc3RydWN0b3IocGFyYW1ldGVyczogeyBpbmNsdWRlQ2hhdHM/OiBib29sZWFuIH0pIHtcclxuICAgICAgICBsZXQgcGFyYW1zOiBhbnkgPSB7fVxyXG4gICAgICAgIGlmKHBhcmFtZXRlcnMuaW5jbHVkZUNoYXRzKVxyXG4gICAgICAgICAgICBwYXJhbXMuaW5jbHVkZUNoYXRzID0gcGFyYW1ldGVycy5pbmNsdWRlQ2hhdHM/LnRvU3RyaW5nKClcclxuXHJcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzID0gcGFyYW1zXHJcbiAgICB9XHJcblxyXG4gICAgcmVhZG9ubHkgZW5kcG9pbnQ6IHN0cmluZyA9IFwiL3VzZXIvaW5mb1wiO1xyXG4gICAgcmVhZG9ubHkgbWV0aG9kVHlwZTogTWV0aG9kVHlwZSA9IE1ldGhvZFR5cGUuR0VUO1xyXG5cclxuICAgIGFzeW5jIHByb2NlZWRSZXF1ZXN0KHJlc3BvbnNlOiBSZXNwb25zZSk6IFByb21pc2U8VXNlclJlc3BvbnNlPiB7XHJcbiAgICAgICAgY29uc3QgdGV4dCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcclxuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh0ZXh0KSBhcyBVc2VyUmVzcG9uc2U7XHJcbiAgICB9XHJcbn0iXX0=
