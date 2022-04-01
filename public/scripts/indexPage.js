(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HttpClient_1 = require("./util/HttpClient");
var CreateTableRequest_1 = require("./util/request/CreateTableRequest");
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
    checkAuthorization(function () {
        loadStore().then(function () {
            $('#create-table-form').on('submit', submit);
            drawDialogs();
            $('.clickable').on('click', function () {
                $('.clickable').toggleClass('d-none');
            });
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
    postTable(newTable);
    clearMenu();
    closeMenu();
    return false;
}
function postTable(table) {
    httpClient.proceedRequest(table, function (code, errorText) {
        alert("Error happened: ".concat(code, ", ").concat(errorText));
    }).then(function (table) {
        console.log(table);
        loadStore().then(drawDialogs);
    });
}
function clearMenu() {
    $('#clear-button').click();
}
function closeMenu() {
    $('#close-button').click();
}
function loadStore() {
    return fetch(link + "/user/info?includeChats=true", {
        credentials: "include",
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (response) {
        if (response.status === 200) {
            return response.text().then(function (json) {
                store.dialogs = JSON.parse(json).chats;
            });
        }
        else {
            response.text().then(function (text) { return console.log(response.status + ", " + text); });
            return Promise.reject("nothing");
        }
    });
}
function checkAuthorization(invokeAfterSuccess) {
    return fetch(link + "/user/login", {
        credentials: "include",
        method: "GET",
        headers: { "Content-Type": "application/json" }
    }).then(function (response) {
        if (response.status === 200) {
            invokeAfterSuccess();
        }
        else {
            window.location.href = link + "/oauth2/authorization/google";
        }
    });
}
},{"./util/HttpClient":2,"./util/request/CreateTableRequest":3}],2:[function(require,module,exports){
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
exports.CreateTableRequest = exports.TableResponse = exports.UserResponse = void 0;
var HttpClient_1 = require("../HttpClient");
var UserResponse = /** @class */ (function () {
    function UserResponse() {
    }
    return UserResponse;
}());
exports.UserResponse = UserResponse;
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
},{"../HttpClient":2}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJUU2NyaXB0L2luZGV4LnRzIiwiVFNjcmlwdC91dGlsL0h0dHBDbGllbnQudHMiLCJUU2NyaXB0L3V0aWwvcmVxdWVzdC9DcmVhdGVUYWJsZVJlcXVlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLGdEQUE2QztBQUM3Qyx3RUFBcUU7QUFFckUsSUFBSSxLQUFLLEdBQVE7SUFDYixRQUFRLEVBQUU7UUFDTjtZQUNJLEVBQUUsRUFBRSxDQUFDO1lBQ0wsSUFBSSxFQUFFLG1CQUFtQjtZQUN6QixVQUFVLEVBQUUsUUFBUTtZQUNwQixXQUFXLEVBQUUsNEJBQTRCO1lBQ3pDLElBQUksRUFBRSxPQUFPO1lBQ2IsYUFBYSxFQUFFLEVBQUU7WUFDakIsTUFBTSxFQUFFLGtCQUFrQjtZQUMxQixLQUFLLEVBQUUsR0FBRztZQUNWLE1BQU0sRUFBRSxHQUFHO1NBQ2Q7UUFDRDtZQUNJLEVBQUUsRUFBRSxDQUFDO1lBQ0wsSUFBSSxFQUFFLHNCQUFzQjtZQUM1QixVQUFVLEVBQUUsZ0JBQWdCO1lBQzVCLFdBQVcsRUFBRSxvQkFBb0I7WUFDakMsSUFBSSxFQUFFLE9BQU87WUFDYixhQUFhLEVBQUUsRUFBRTtZQUNqQixNQUFNLEVBQUUsa0JBQWtCO1lBQzFCLEtBQUssRUFBRSxFQUFFO1lBQ1QsTUFBTSxFQUFFLEdBQUc7U0FDZDtRQUNEO1lBQ0ksRUFBRSxFQUFFLENBQUM7WUFDTCxJQUFJLEVBQUUsMEJBQTBCO1lBQ2hDLFVBQVUsRUFBRSxjQUFjO1lBQzFCLFdBQVcsRUFBRSx1RUFBdUU7WUFDcEYsSUFBSSxFQUFFLE9BQU87WUFDYixhQUFhLEVBQUUsQ0FBQztZQUNoQixNQUFNLEVBQUUsa0JBQWtCO1lBQzFCLEtBQUssRUFBRSxFQUFFO1lBQ1QsTUFBTSxFQUFFLEVBQUU7U0FDYjtRQUNEO1lBQ0ksRUFBRSxFQUFFLENBQUM7WUFDTCxJQUFJLEVBQUUsNEpBQTRK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c291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQge0h0dHBDbGllbnR9IGZyb20gXCIuL3V0aWwvSHR0cENsaWVudFwiO1xyXG5pbXBvcnQge0NyZWF0ZVRhYmxlUmVxdWVzdH0gZnJvbSBcIi4vdXRpbC9yZXF1ZXN0L0NyZWF0ZVRhYmxlUmVxdWVzdFwiO1xyXG5cclxubGV0IHN0b3JlOiBhbnkgPSB7XHJcbiAgICBkaWFsb2dzMjogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWQ6IDAsXHJcbiAgICAgICAgICAgIG5hbWU6ICfQktC40YLQsNC70Y8g0Lgg0LrQvtC80L/QsNC90LjRjycsXHJcbiAgICAgICAgICAgIGxhc3RTZW5kZXI6ICfQktC40YLQsNC70Y8nLFxyXG4gICAgICAgICAgICBsYXN0TWVzc2FnZTogJ9Cf0YDQuNCy0LXRgiwg0L/RgNC40YXQvtC00Lgg0L/QuNGC0Ywg0LrRgNC+0LLRjCcsXHJcbiAgICAgICAgICAgIHRpbWU6ICfQstGH0LXRgNCwJyxcclxuICAgICAgICAgICAgbWVzc2FnZXNDb3VudDogNTEsXHJcbiAgICAgICAgICAgIGF2YXRhcjogJy4vcGljdHVyZXMvMS5wbmcnLFxyXG4gICAgICAgICAgICB3aWR0aDogMTAwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDEyMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZDogMSxcclxuICAgICAgICAgICAgbmFtZTogJ9CR0LXRgdC10LTQsCDQvdC1INC00LvRjyDQs9C70YPQv9GL0YUnLFxyXG4gICAgICAgICAgICBsYXN0U2VuZGVyOiAn0JrRgtC+0KLQviDQndC10JPQu9GD0L/Ri9C5JyxcclxuICAgICAgICAgICAgbGFzdE1lc3NhZ2U6ICfQodC60L7Qu9GM0LrQviDQsdGD0LTQtdGCIDIrMj8nLFxyXG4gICAgICAgICAgICB0aW1lOiAn0LLRh9C10YDQsCcsXHJcbiAgICAgICAgICAgIG1lc3NhZ2VzQ291bnQ6IDE3LFxyXG4gICAgICAgICAgICBhdmF0YXI6ICcuL3BpY3R1cmVzLzIucG5nJyxcclxuICAgICAgICAgICAgd2lkdGg6IDEwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDExMlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZDogMixcclxuICAgICAgICAgICAgbmFtZTogJ9CR0LXRgdC10LTQsCDRgtC+0LvRjNC60L4g0LTQu9GPINCz0LvRg9C/0YvRhScsXHJcbiAgICAgICAgICAgIGxhc3RTZW5kZXI6ICfQodCw0LzRi9C5INCT0LvRg9C/0YvQuScsXHJcbiAgICAgICAgICAgIGxhc3RNZXNzYWdlOiAn0KDQtdCx0Y/RgtCwLCDRjyDRgtC+0LvRjNC60L4g0YfRgtC+INC00L7QutCw0LfQsNC7INCz0LjQv9C+0YLQtdC30YMg0KDQuNC80LDQvdCwISDQmtC+0YDQvtGH0LUsINGC0LDQvCDQstGB0ZEg0L/RgNC+0YHRgtC+IScsXHJcbiAgICAgICAgICAgIHRpbWU6ICcxMTozMCcsXHJcbiAgICAgICAgICAgIG1lc3NhZ2VzQ291bnQ6IDAsXHJcbiAgICAgICAgICAgIGF2YXRhcjogJy4vcGljdHVyZXMvMy5wbmcnLFxyXG4gICAgICAgICAgICB3aWR0aDogMjAsXHJcbiAgICAgICAgICAgIGhlaWdodDogNDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWQ6IDMsXHJcbiAgICAgICAgICAgIG5hbWU6ICfQkdC10YHQtdC00LAg0YEg0L7Rh9C10L3RjCDQtNC70LjQvdC90YvQvCDQvdCw0LfQstCw0L3QuNC10LwuINCg0LXQsdGP0YLQsCwg0Y8g0L3QtSDQv9GA0LXQtNGB0YLQsNCy0LvRj9GOINC60L7QvNGDINCyINCz0L7Qu9C+0LLRgyDQv9GA0LjRiNC70L4g0LTQsNCy0LDRgtGMINGC0LDQutC+0LUg0LTQu9C40L3QvdC+0LUg0L3QsNC30LLQsNC90LjQtS4g0KDQtdCx0Y/RgtCwLCDQv9GA0LXQtNC70LDQs9Cw0Y4g0L7Qs9GA0LDQvdC40YfQuNGC0Ywg0LTQu9C40L3RgyDQvdCw0LfQstCw0L3QuNC5JyxcclxuICAgICAgICAgICAgbGFzdFNlbmRlcjogJ9CS0LjRgtCw0LvRjycsXHJcbiAgICAgICAgICAgIGxhc3RNZXNzYWdlOiAn0J/RgNC40LLQtdGCLCDQs9C70Y/QvdGMINC70YEnLFxyXG4gICAgICAgICAgICB0aW1lOiAnMTQ6MTUnLFxyXG4gICAgICAgICAgICBtZXNzYWdlc0NvdW50OiAwLFxyXG4gICAgICAgICAgICBhdmF0YXI6ICcuL3BpY3R1cmVzLzQucG5nJyxcclxuICAgICAgICAgICAgd2lkdGg6IDEwMDAsXHJcbiAgICAgICAgICAgIGhlaWdodDogMTAwMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZDogNCxcclxuICAgICAgICAgICAgbmFtZTogJ9CS0LjRgtCw0LvRjyDQotGA0YPQsdC+0LXQtCcsXHJcbiAgICAgICAgICAgIGxhc3RTZW5kZXI6ICcnLFxyXG4gICAgICAgICAgICBsYXN0TWVzc2FnZTogJ9CU0LDQstC90L4g0YfQuNGC0LDQuyDQsdC10YHQtdC00YM/JyxcclxuICAgICAgICAgICAgdGltZTogJzE5OjUxJyxcclxuICAgICAgICAgICAgbWVzc2FnZXNDb3VudDogNCxcclxuICAgICAgICAgICAgYXZhdGFyOiAnLi9waWN0dXJlcy81LnBuZycsXHJcbiAgICAgICAgICAgIHdpZHRoOiAxMDAwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDUwMFxyXG4gICAgICAgIH1cclxuICAgIF1cclxufVxyXG5sZXQgbGluayA9IFwiaHR0cHM6Ly9jb21ncmlkLnJ1Ojg0NDNcIjtcclxuY29uc3QgaHR0cENsaWVudCA9IG5ldyBIdHRwQ2xpZW50KGxpbmspXHJcblxyXG4kKHdpbmRvdykub24oJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICBjaGVja0F1dGhvcml6YXRpb24oKCkgPT4ge1xyXG4gICAgICAgIGxvYWRTdG9yZSgpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAkKCcjY3JlYXRlLXRhYmxlLWZvcm0nKS5vbignc3VibWl0Jywgc3VibWl0KTtcclxuICAgICAgICAgICAgZHJhd0RpYWxvZ3MoKVxyXG5cclxuICAgICAgICAgICAgJCgnLmNsaWNrYWJsZScpLm9uKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgICAgICQoJy5jbGlja2FibGUnKS50b2dnbGVDbGFzcygnZC1ub25lJylcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSlcclxuXHJcbmZ1bmN0aW9uIGRyYXdEaWFsb2dzKCkge1xyXG4gICAgbGV0ICRjb250YWluZXIgPSAkKCcuY2hhdC1jb250YWluZXInKTtcclxuICAgIGxldCAkbm9EZWwgPSAkY29udGFpbmVyLmZpbmQoJy5uby1kZWxldGFibGUnKTtcclxuICAgICRjb250YWluZXIuaHRtbCgnJyk7XHJcbiAgICAkY29udGFpbmVyLmFwcGVuZCgkbm9EZWwpO1xyXG4gICAgc3RvcmUuZGlhbG9ncy5zbGljZSgpLnJldmVyc2UoKS5mb3JFYWNoKChkaWFsb2csIGluZGV4KSA9PiB7XHJcbiAgICAgICAgbGV0IGRpYWxvZzIgPSBzdG9yZS5kaWFsb2dzMltpbmRleF07XHJcbiAgICAgICAgbGV0ICRjaGF0ID0gJCgnLmNoYXQnKS5jbG9uZSgpO1xyXG4gICAgICAgICRjaGF0LnJlbW92ZUNsYXNzKCdjaGF0IGQtbm9uZScpO1xyXG4gICAgICAgICRjaGF0LmZpbmQoJ2EnKS5hdHRyKCdocmVmJywgJ3BhZ2VzL3RhYmxlLmh0bWw/aWQ9JyArIGRpYWxvZy5pZCk7XHJcbiAgICAgICAgJGNoYXQuZmluZCgnLmNoYXQtbmFtZScpLnRleHQoZGlhbG9nLm5hbWUpO1xyXG4gICAgICAgICRjaGF0LmZpbmQoJy5jaGF0LXNlbmRlcicpLnRleHQoZGlhbG9nMi5sYXN0U2VuZGVyICsgKGRpYWxvZzIubGFzdFNlbmRlciA9PT0gJycgPyAnJyA6ICc6JykpO1xyXG4gICAgICAgICRjaGF0LmZpbmQoJy5jaGF0LXRleHQnKS50ZXh0KGRpYWxvZzIubGFzdE1lc3NhZ2UpO1xyXG4gICAgICAgICRjaGF0LmZpbmQoJy5jaGF0LXRpbWUnKS50ZXh0KGRpYWxvZzIudGltZSk7XHJcbiAgICAgICAgJGNoYXQuZmluZCgnaW1nJykuYXR0cignc3JjJywgZGlhbG9nLmF2YXRhcik7XHJcbiAgICAgICAgJGNoYXQuZmluZCgnLmNoYXQtc2l6ZScpLnRleHQoZGlhbG9nLndpZHRoICsgJ8OXJyArIGRpYWxvZy5oZWlnaHQpXHJcbiAgICAgICAgZGlhbG9nMi5tZXNzYWdlc0NvdW50ID09PSAwXHJcbiAgICAgICAgICAgID8gJGNoYXQuZmluZCgnLmNoYXQtdW5yZWFkJykucmVtb3ZlKClcclxuICAgICAgICAgICAgOiAkY2hhdC5maW5kKCcuY2hhdC11bnJlYWQnKS50ZXh0KGRpYWxvZzIubWVzc2FnZXNDb3VudCk7XHJcbiAgICAgICAgJGNvbnRhaW5lci5hcHBlbmQoJGNoYXQpO1xyXG4gICAgICAgICRjaGF0Lm9uKCdtb3VzZWVudGVyJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAkY2hhdC5yZW1vdmVDbGFzcygnYmctbGlnaHQnKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICRjaGF0Lm9uKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAkY2hhdC5hZGRDbGFzcygnYmctbGlnaHQnKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICRjaGF0Lm9uKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgZGlhbG9nLm1lc3NhZ2VzQ291bnQgPSAwO1xyXG4gICAgICAgICAgICBkcmF3RGlhbG9ncygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN1Ym1pdCgpIHtcclxuICAgIGNvbnN0IGF2YXRhckZpbGU6IGFueSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YWJsZS1pbWFnZS1maWxlLWlucHV0JylcclxuICAgIGxldCBhdmF0YXJMaW5rID0gJCgnI3RhYmxlLWltYWdlLWxpbmstaW5wdXQnKS52YWwoKTtcclxuICAgIGlmKGF2YXRhckxpbmsgPT09IFwiXCIgJiYgYXZhdGFyRmlsZS5maWxlc1swXSA9PT0gbnVsbCl7XHJcbiAgICAgICAgYWxlcnQoXCJZb3UgbXVzdCBzcGVjaWZ5IGVpdGhlciBpbWFnZSBvciBsaW5rIHRvIGltYWdlXCIpXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB9XHJcbiAgICBsZXQgaGVpZ2h0ID0gJCgnI3RhYmxlLWhlaWdodC1pbnB1dCcpLnZhbCgpO1xyXG4gICAgbGV0IHdpZHRoID0gJCgnI3RhYmxlLXdpZHRoLWlucHV0JykudmFsKCk7XHJcbiAgICBjb25zdCBuZXdUYWJsZSA9IG5ldyBDcmVhdGVUYWJsZVJlcXVlc3Qoe1xyXG4gICAgICAgIG5hbWU6ICQoJyN0YWJsZS1uYW1lLWlucHV0JykudmFsKCkgYXMgc3RyaW5nLFxyXG4gICAgICAgIHdpZHRoOiB3aWR0aCBhcyBudW1iZXIsXHJcbiAgICAgICAgaGVpZ2h0OiBoZWlnaHQgYXMgbnVtYmVyLFxyXG4gICAgICAgIGF2YXRhckxpbms6IGF2YXRhckxpbmsgYXMgc3RyaW5nLFxyXG4gICAgICAgIGF2YXRhckZpbGU6IGF2YXRhckZpbGU/LmZpbGVzWzBdXHJcbiAgICB9KVxyXG4gICAgaWYocGFyc2VJbnQoaGVpZ2h0IGFzIHN0cmluZykgKiBwYXJzZUludCh3aWR0aCBhcyBzdHJpbmcpID4gMjUwMCl7XHJcbiAgICAgICAgYWxlcnQoXCLQoNCw0LfQvNC10YAg0YLQsNCx0LvQuNGG0Ysg0L3QtSDQvNC+0LbQtdGCINC/0YDQtdCy0YvRiNCw0YLRjCAyNTAwINGP0YfQtdC10LpcIik7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcG9zdFRhYmxlKG5ld1RhYmxlKTtcclxuICAgIGNsZWFyTWVudSgpO1xyXG4gICAgY2xvc2VNZW51KCk7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBvc3RUYWJsZSh0YWJsZSkge1xyXG4gICAgaHR0cENsaWVudC5wcm9jZWVkUmVxdWVzdChcclxuICAgICAgICB0YWJsZSxcclxuICAgICAgICAoY29kZSwgZXJyb3JUZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIGFsZXJ0KGBFcnJvciBoYXBwZW5lZDogJHtjb2RlfSwgJHtlcnJvclRleHR9YClcclxuICAgICAgICB9XHJcbiAgICApLnRoZW4oKHRhYmxlKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2codGFibGUpXHJcbiAgICAgICAgbG9hZFN0b3JlKCkudGhlbihkcmF3RGlhbG9ncylcclxuICAgIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNsZWFyTWVudSgpIHtcclxuICAgICQoJyNjbGVhci1idXR0b24nKS5jbGljaygpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjbG9zZU1lbnUoKSB7XHJcbiAgICAkKCcjY2xvc2UtYnV0dG9uJykuY2xpY2soKTtcclxufVxyXG5cclxuZnVuY3Rpb24gbG9hZFN0b3JlKCkge1xyXG4gICAgcmV0dXJuIGZldGNoKFxyXG4gICAgICAgIGxpbmsgKyBcIi91c2VyL2luZm8/aW5jbHVkZUNoYXRzPXRydWVcIixcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcImluY2x1ZGVcIixcclxuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgKS50aGVuKChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIGlmKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKXtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKChqc29uKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzdG9yZS5kaWFsb2dzID0gSlNPTi5wYXJzZShqc29uKS5jaGF0cztcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgcmVzcG9uc2UudGV4dCgpLnRoZW4odGV4dCA9PiBjb25zb2xlLmxvZyhyZXNwb25zZS5zdGF0dXMgKyBcIiwgXCIgKyB0ZXh0KSk7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcIm5vdGhpbmdcIilcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2hlY2tBdXRob3JpemF0aW9uKGludm9rZUFmdGVyU3VjY2Vzcykge1xyXG4gICAgcmV0dXJuIGZldGNoKFxyXG4gICAgICAgIGxpbmsgKyBcIi91c2VyL2xvZ2luXCIsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjcmVkZW50aWFsczogXCJpbmNsdWRlXCIsXHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgaGVhZGVyczoge1wiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwifVxyXG4gICAgICAgIH1cclxuICAgICkudGhlbigocmVzcG9uc2UpID0+e1xyXG4gICAgICAgIGlmKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKXtcclxuICAgICAgICAgICAgaW52b2tlQWZ0ZXJTdWNjZXNzKClcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBsaW5rICsgXCIvb2F1dGgyL2F1dGhvcml6YXRpb24vZ29vZ2xlXCJcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufSIsImltcG9ydCB7UmVxdWVzdFdyYXBwZXJ9IGZyb20gXCIuL3JlcXVlc3QvUmVxdWVzdFwiO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBIdHRwQ2xpZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgYXBpTGluazogc3RyaW5nKSB7fVxyXG5cclxuICAgIGFzeW5jIHByb2NlZWRSZXF1ZXN0PFQ+KFxyXG4gICAgICAgIHJlcXVlc3Q6IFJlcXVlc3RXcmFwcGVyPFQ+LFxyXG4gICAgICAgIG9uRmFpbHVyZTogKGNvZGU6IG51bWJlciwgZXJyb3JUZXh0OiBzdHJpbmcpID0+IHVua25vd24gPVxyXG4gICAgICAgICAgICAoY29kZSwgZXJyb3JUZXh0KSA9PiBhbGVydChgY29kZTogJHtjb2RlfSwgZXJyb3I6ICR7ZXJyb3JUZXh0fWApLFxyXG4gICAgICAgIG9uTmV0d29ya0ZhaWx1cmU6IChyZWFzb24pID0+IHVua25vd24gPVxyXG4gICAgICAgICAgICAocmVhc29uKSA9PiBhbGVydChgbmV0d29yayBlcnJvcjogJHtyZWFzb259YClcclxuICAgICk6IFByb21pc2U8VD57XHJcbiAgICAgICAgY29uc3QgZmluYWxMaW5rID0gbmV3IFVSTCh0aGlzLmFwaUxpbmsgKyByZXF1ZXN0LmVuZHBvaW50KVxyXG4gICAgICAgIGlmKHJlcXVlc3QucGFyYW1ldGVycyAhPSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIGZpbmFsTGluay5zZWFyY2ggPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHJlcXVlc3QucGFyYW1ldGVycykudG9TdHJpbmcoKVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhyZXF1ZXN0KVxyXG4gICAgICAgIHJldHVybiBmZXRjaChcclxuICAgICAgICAgICAgZmluYWxMaW5rLnRvU3RyaW5nKCksXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcImluY2x1ZGVcIixcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogcmVxdWVzdC5tZXRob2RUeXBlLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyczogcmVxdWVzdC5oZWFkZXJzLFxyXG4gICAgICAgICAgICAgICAgYm9keTogcmVxdWVzdC5ib2R5XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApLnRoZW4oKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnByb2NlZWRSZXF1ZXN0KHJlc3BvbnNlKVxyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLnRleHQoKS50aGVuKHRleHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG9uRmFpbHVyZShyZXNwb25zZS5zdGF0dXMsIHRleHQpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHRleHQpXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGVudW0gTWV0aG9kVHlwZXtcclxuICAgIFBPU1Q9XCJQT1NUXCIsXHJcbiAgICBHRVQ9XCJHRVRcIixcclxuICAgIFBBVENIPVwiUEFUQ0hcIixcclxuICAgIFBVVD1cIlBVVFwiLFxyXG59IiwiaW1wb3J0IHtNZXRob2RUeXBlfSBmcm9tIFwiLi4vSHR0cENsaWVudFwiO1xyXG5pbXBvcnQge1JlcXVlc3RXcmFwcGVyfSBmcm9tIFwiLi9SZXF1ZXN0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVXNlclJlc3BvbnNle1xyXG4gICAgcmVhZG9ubHkgaWQhOiBzdHJpbmdcclxuICAgIHJlYWRvbmx5IG5hbWUhOiBzdHJpbmdcclxuICAgIHJlYWRvbmx5IGVtYWlsITogc3RyaW5nXHJcbiAgICByZWFkb25seSBhdmF0YXIhOiBzdHJpbmdcclxuICAgIHJlYWRvbmx5IGNyZWF0ZWQhOiBEYXRlXHJcbiAgICByZWFkb25seSBjaGF0cz86IFRhYmxlUmVzcG9uc2VbXVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVGFibGVSZXNwb25zZSB7XHJcbiAgICByZWFkb25seSBpZCE6IG51bWJlclxyXG4gICAgcmVhZG9ubHkgbmFtZSE6IHN0cmluZ1xyXG4gICAgcmVhZG9ubHkgY3JlYXRvciE6IG51bWJlclxyXG4gICAgcmVhZG9ubHkgd2lkdGghOiBudW1iZXJcclxuICAgIHJlYWRvbmx5IGhlaWdodCE6IG51bWJlclxyXG4gICAgcmVhZG9ubHkgYXZhdGFyITogbnVtYmVyXHJcbiAgICByZWFkb25seSBjcmVhdGVkITogRGF0ZVxyXG4gICAgcmVhZG9ubHkgbGFzdE1lc3NhZ2VJZD86IG51bWJlclxyXG4gICAgcmVhZG9ubHkgcGFydGljaXBhbnRzPzogVXNlclJlc3BvbnNlW11cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENyZWF0ZVRhYmxlUmVxdWVzdCBpbXBsZW1lbnRzIFJlcXVlc3RXcmFwcGVyPFRhYmxlUmVzcG9uc2U+IHtcclxuICAgIHJlYWRvbmx5IGJvZHk/OiBGb3JtRGF0YVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKGJvZHk6IHtcclxuICAgICAgICBuYW1lOiBzdHJpbmcsXHJcbiAgICAgICAgd2lkdGg6IG51bWJlcixcclxuICAgICAgICBoZWlnaHQ6IG51bWJlcixcclxuICAgICAgICBhdmF0YXJGaWxlPzogRmlsZSxcclxuICAgICAgICBhdmF0YXJMaW5rPzogc3RyaW5nXHJcbiAgICB9KSB7XHJcbiAgICAgICAgdGhpcy5ib2R5ID0gbmV3IEZvcm1EYXRhKClcclxuICAgICAgICB0aGlzLmJvZHkuYXBwZW5kKCduYW1lJywgYm9keS5uYW1lKVxyXG4gICAgICAgIHRoaXMuYm9keS5hcHBlbmQoJ3dpZHRoJywgYm9keS53aWR0aC50b1N0cmluZygpKVxyXG4gICAgICAgIHRoaXMuYm9keS5hcHBlbmQoJ2hlaWdodCcsIGJvZHkuaGVpZ2h0LnRvU3RyaW5nKCkpXHJcbiAgICAgICAgaWYgKGJvZHkuYXZhdGFyTGluayA9PSB1bmRlZmluZWQgJiYgYm9keS5hdmF0YXJGaWxlID09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBzZW5kIHJlcXVlc3Qgd2l0aCBubyBhdmF0YXJcIilcclxuICAgICAgICBpZiAoYm9keS5hdmF0YXJGaWxlICE9IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhpcy5ib2R5LmFwcGVuZCgnYXZhdGFyRmlsZScsIGJvZHkuYXZhdGFyRmlsZSlcclxuICAgICAgICBpZiAoYm9keS5hdmF0YXJMaW5rICE9IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhpcy5ib2R5LmFwcGVuZCgnYXZhdGFyTGluaycsIGJvZHkuYXZhdGFyTGluaylcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBwcm9jZWVkUmVxdWVzdChyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPFRhYmxlUmVzcG9uc2U+IHtcclxuICAgICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpXHJcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodGV4dCkgYXMgVGFibGVSZXNwb25zZVxyXG4gICAgfVxyXG5cclxuICAgIGVuZHBvaW50OiBzdHJpbmcgPSBcIi90YWJsZS9jcmVhdGVcIjtcclxuICAgIGhlYWRlcnM/OiBIZWFkZXJzSW5pdCA9IHtcclxuICAgICAgICBcIkNvbnRlbnQtVHlwZXNcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcclxuICAgIH07XHJcbiAgICBtZXRob2RUeXBlOiBNZXRob2RUeXBlID0gTWV0aG9kVHlwZS5QT1NUO1xyXG59Il19
