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
                return [2 /*return*/, fetch(finalLink.toString(), {
                        credentials: "include",
                        method: request.methodType,
                        headers: request.headers,
                        body: request.body
                    }).then(function (response) {
                        if (response.status === 200) {
                            return request.proceedRequest(response);
                            // if(response.headers.get("Content-Type").startsWith("image")) {
                            //     response.blob().then(blob => {
                            //         onSuccess(blob)
                            //     })
                            // }else {
                            //     response.text().then(text => {
                            //         onSuccess(text)
                            //     })
                            // }
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
        this.headers = null;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJUU2NyaXB0L2luZGV4LnRzIiwiVFNjcmlwdC91dGlsL0h0dHBDbGllbnQudHMiLCJUU2NyaXB0L3V0aWwvcmVxdWVzdC9DcmVhdGVUYWJsZVJlcXVlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLGdEQUE2QztBQUM3Qyx3RUFBcUU7QUFFckUsSUFBSSxLQUFLLEdBQVE7SUFDYixRQUFRLEVBQUU7UUFDTjtZQUNJLEVBQUUsRUFBRSxDQUFDO1lBQ0wsSUFBSSxFQUFFLG1CQUFtQjtZQUN6QixVQUFVLEVBQUUsUUFBUTtZQUNwQixXQUFXLEVBQUUsNEJBQTRCO1lBQ3pDLElBQUksRUFBRSxPQUFPO1lBQ2IsYUFBYSxFQUFFLEVBQUU7WUFDakIsTUFBTSxFQUFFLGtCQUFrQjtZQUMxQixLQUFLLEVBQUUsR0FBRztZQUNWLE1BQU0sRUFBRSxHQUFHO1NBQ2Q7UUFDRDtZQUNJLEVBQUUsRUFBRSxDQUFDO1lBQ0wsSUFBSSxFQUFFLHNCQUFzQjtZQUM1QixVQUFVLEVBQUUsZ0JBQWdCO1lBQzVCLFdBQVcsRUFBRSxvQkFBb0I7WUFDakMsSUFBSSxFQUFFLE9BQU87WUFDYixhQUFhLEVBQUUsRUFBRTtZQUNqQixNQUFNLEVBQUUsa0JBQWtCO1lBQzFCLEtBQUssRUFBRSxFQUFFO1lBQ1QsTUFBTSxFQUFFLEdBQUc7U0FDZDtRQUNEO1lBQ0ksRUFBRSxFQUFFLENBQUM7WUFDTCxJQUFJLEVBQUUsMEJBQTBCO1lBQ2hDLFVBQVUsRUFBRSxjQUFjO1lBQzFCLFdBQVcsRUFBRSx1RUFBdUU7WUFDcEYsSUFBSSxFQUFFLE9BQU87WUFDYixhQUFhLEVBQUUsQ0FBQztZQUNoQixNQUFNLEVBQUUsa0JBQWtCO1lBQzFCLEtBQUssRUFBRSxFQUFFO1lBQ1QsTUFBTSxFQUFFLEVBQUU7U0FDYjtRQUNEO1lBQ0ksRUFBRSxFQUFFLENBQUM7WUFDTCxJQUFJLEVBQUUsNEpBQTRK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LEFBOEJDLElBQUE7QUE5QlksZ0RBQWtCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IHtIdHRwQ2xpZW50fSBmcm9tIFwiLi91dGlsL0h0dHBDbGllbnRcIjtcclxuaW1wb3J0IHtDcmVhdGVUYWJsZVJlcXVlc3R9IGZyb20gXCIuL3V0aWwvcmVxdWVzdC9DcmVhdGVUYWJsZVJlcXVlc3RcIjtcclxuXHJcbmxldCBzdG9yZTogYW55ID0ge1xyXG4gICAgZGlhbG9nczI6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlkOiAwLFxyXG4gICAgICAgICAgICBuYW1lOiAn0JLQuNGC0LDQu9GPINC4INC60L7QvNC/0LDQvdC40Y8nLFxyXG4gICAgICAgICAgICBsYXN0U2VuZGVyOiAn0JLQuNGC0LDQu9GPJyxcclxuICAgICAgICAgICAgbGFzdE1lc3NhZ2U6ICfQn9GA0LjQstC10YIsINC/0YDQuNGF0L7QtNC4INC/0LjRgtGMINC60YDQvtCy0YwnLFxyXG4gICAgICAgICAgICB0aW1lOiAn0LLRh9C10YDQsCcsXHJcbiAgICAgICAgICAgIG1lc3NhZ2VzQ291bnQ6IDUxLFxyXG4gICAgICAgICAgICBhdmF0YXI6ICcuL3BpY3R1cmVzLzEucG5nJyxcclxuICAgICAgICAgICAgd2lkdGg6IDEwMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiAxMjBcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWQ6IDEsXHJcbiAgICAgICAgICAgIG5hbWU6ICfQkdC10YHQtdC00LAg0L3QtSDQtNC70Y8g0LPQu9GD0L/Ri9GFJyxcclxuICAgICAgICAgICAgbGFzdFNlbmRlcjogJ9Ca0YLQvtCi0L4g0J3QtdCT0LvRg9C/0YvQuScsXHJcbiAgICAgICAgICAgIGxhc3RNZXNzYWdlOiAn0KHQutC+0LvRjNC60L4g0LHRg9C00LXRgiAyKzI/JyxcclxuICAgICAgICAgICAgdGltZTogJ9Cy0YfQtdGA0LAnLFxyXG4gICAgICAgICAgICBtZXNzYWdlc0NvdW50OiAxNyxcclxuICAgICAgICAgICAgYXZhdGFyOiAnLi9waWN0dXJlcy8yLnBuZycsXHJcbiAgICAgICAgICAgIHdpZHRoOiAxMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiAxMTJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWQ6IDIsXHJcbiAgICAgICAgICAgIG5hbWU6ICfQkdC10YHQtdC00LAg0YLQvtC70YzQutC+INC00LvRjyDQs9C70YPQv9GL0YUnLFxyXG4gICAgICAgICAgICBsYXN0U2VuZGVyOiAn0KHQsNC80YvQuSDQk9C70YPQv9GL0LknLFxyXG4gICAgICAgICAgICBsYXN0TWVzc2FnZTogJ9Cg0LXQsdGP0YLQsCwg0Y8g0YLQvtC70YzQutC+INGH0YLQviDQtNC+0LrQsNC30LDQuyDQs9C40L/QvtGC0LXQt9GDINCg0LjQvNCw0L3QsCEg0JrQvtGA0L7Rh9C1LCDRgtCw0Lwg0LLRgdGRINC/0YDQvtGB0YLQviEnLFxyXG4gICAgICAgICAgICB0aW1lOiAnMTE6MzAnLFxyXG4gICAgICAgICAgICBtZXNzYWdlc0NvdW50OiAwLFxyXG4gICAgICAgICAgICBhdmF0YXI6ICcuL3BpY3R1cmVzLzMucG5nJyxcclxuICAgICAgICAgICAgd2lkdGg6IDIwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDQwXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlkOiAzLFxyXG4gICAgICAgICAgICBuYW1lOiAn0JHQtdGB0LXQtNCwINGBINC+0YfQtdC90Ywg0LTQu9C40L3QvdGL0Lwg0L3QsNC30LLQsNC90LjQtdC8LiDQoNC10LHRj9GC0LAsINGPINC90LUg0L/RgNC10LTRgdGC0LDQstC70Y/RjiDQutC+0LzRgyDQsiDQs9C+0LvQvtCy0YMg0L/RgNC40YjQu9C+INC00LDQstCw0YLRjCDRgtCw0LrQvtC1INC00LvQuNC90L3QvtC1INC90LDQt9Cy0LDQvdC40LUuINCg0LXQsdGP0YLQsCwg0L/RgNC10LTQu9Cw0LPQsNGOINC+0LPRgNCw0L3QuNGH0LjRgtGMINC00LvQuNC90YMg0L3QsNC30LLQsNC90LjQuScsXHJcbiAgICAgICAgICAgIGxhc3RTZW5kZXI6ICfQktC40YLQsNC70Y8nLFxyXG4gICAgICAgICAgICBsYXN0TWVzc2FnZTogJ9Cf0YDQuNCy0LXRgiwg0LPQu9GP0L3RjCDQu9GBJyxcclxuICAgICAgICAgICAgdGltZTogJzE0OjE1JyxcclxuICAgICAgICAgICAgbWVzc2FnZXNDb3VudDogMCxcclxuICAgICAgICAgICAgYXZhdGFyOiAnLi9waWN0dXJlcy80LnBuZycsXHJcbiAgICAgICAgICAgIHdpZHRoOiAxMDAwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDEwMDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWQ6IDQsXHJcbiAgICAgICAgICAgIG5hbWU6ICfQktC40YLQsNC70Y8g0KLRgNGD0LHQvtC10LQnLFxyXG4gICAgICAgICAgICBsYXN0U2VuZGVyOiAnJyxcclxuICAgICAgICAgICAgbGFzdE1lc3NhZ2U6ICfQlNCw0LLQvdC+INGH0LjRgtCw0Lsg0LHQtdGB0LXQtNGDPycsXHJcbiAgICAgICAgICAgIHRpbWU6ICcxOTo1MScsXHJcbiAgICAgICAgICAgIG1lc3NhZ2VzQ291bnQ6IDQsXHJcbiAgICAgICAgICAgIGF2YXRhcjogJy4vcGljdHVyZXMvNS5wbmcnLFxyXG4gICAgICAgICAgICB3aWR0aDogMTAwMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiA1MDBcclxuICAgICAgICB9XHJcbiAgICBdXHJcbn1cclxubGV0IGxpbmsgPSBcImh0dHBzOi8vY29tZ3JpZC5ydTo4NDQzXCI7XHJcbmNvbnN0IGh0dHBDbGllbnQgPSBuZXcgSHR0cENsaWVudChsaW5rKVxyXG5cclxuJCh3aW5kb3cpLm9uKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgY2hlY2tBdXRob3JpemF0aW9uKCgpID0+IHtcclxuICAgICAgICBsb2FkU3RvcmUoKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgJCgnI2NyZWF0ZS10YWJsZS1mb3JtJykub24oJ3N1Ym1pdCcsIHN1Ym1pdCk7XHJcbiAgICAgICAgICAgIGRyYXdEaWFsb2dzKClcclxuXHJcbiAgICAgICAgICAgICQoJy5jbGlja2FibGUnKS5vbignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAkKCcuY2xpY2thYmxlJykudG9nZ2xlQ2xhc3MoJ2Qtbm9uZScpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pXHJcblxyXG5mdW5jdGlvbiBkcmF3RGlhbG9ncygpIHtcclxuICAgIGxldCAkY29udGFpbmVyID0gJCgnLmNoYXQtY29udGFpbmVyJyk7XHJcbiAgICBsZXQgJG5vRGVsID0gJGNvbnRhaW5lci5maW5kKCcubm8tZGVsZXRhYmxlJyk7XHJcbiAgICAkY29udGFpbmVyLmh0bWwoJycpO1xyXG4gICAgJGNvbnRhaW5lci5hcHBlbmQoJG5vRGVsKTtcclxuICAgIHN0b3JlLmRpYWxvZ3Muc2xpY2UoKS5yZXZlcnNlKCkuZm9yRWFjaCgoZGlhbG9nLCBpbmRleCkgPT4ge1xyXG4gICAgICAgIGxldCBkaWFsb2cyID0gc3RvcmUuZGlhbG9nczJbaW5kZXhdO1xyXG4gICAgICAgIGxldCAkY2hhdCA9ICQoJy5jaGF0JykuY2xvbmUoKTtcclxuICAgICAgICAkY2hhdC5yZW1vdmVDbGFzcygnY2hhdCBkLW5vbmUnKTtcclxuICAgICAgICAkY2hhdC5maW5kKCdhJykuYXR0cignaHJlZicsICdwYWdlcy90YWJsZS5odG1sP2lkPScgKyBkaWFsb2cuaWQpO1xyXG4gICAgICAgICRjaGF0LmZpbmQoJy5jaGF0LW5hbWUnKS50ZXh0KGRpYWxvZy5uYW1lKTtcclxuICAgICAgICAkY2hhdC5maW5kKCcuY2hhdC1zZW5kZXInKS50ZXh0KGRpYWxvZzIubGFzdFNlbmRlciArIChkaWFsb2cyLmxhc3RTZW5kZXIgPT09ICcnID8gJycgOiAnOicpKTtcclxuICAgICAgICAkY2hhdC5maW5kKCcuY2hhdC10ZXh0JykudGV4dChkaWFsb2cyLmxhc3RNZXNzYWdlKTtcclxuICAgICAgICAkY2hhdC5maW5kKCcuY2hhdC10aW1lJykudGV4dChkaWFsb2cyLnRpbWUpO1xyXG4gICAgICAgICRjaGF0LmZpbmQoJ2ltZycpLmF0dHIoJ3NyYycsIGRpYWxvZy5hdmF0YXIpO1xyXG4gICAgICAgICRjaGF0LmZpbmQoJy5jaGF0LXNpemUnKS50ZXh0KGRpYWxvZy53aWR0aCArICfDlycgKyBkaWFsb2cuaGVpZ2h0KVxyXG4gICAgICAgIGRpYWxvZzIubWVzc2FnZXNDb3VudCA9PT0gMFxyXG4gICAgICAgICAgICA/ICRjaGF0LmZpbmQoJy5jaGF0LXVucmVhZCcpLnJlbW92ZSgpXHJcbiAgICAgICAgICAgIDogJGNoYXQuZmluZCgnLmNoYXQtdW5yZWFkJykudGV4dChkaWFsb2cyLm1lc3NhZ2VzQ291bnQpO1xyXG4gICAgICAgICRjb250YWluZXIuYXBwZW5kKCRjaGF0KTtcclxuICAgICAgICAkY2hhdC5vbignbW91c2VlbnRlcicsICgpID0+IHtcclxuICAgICAgICAgICAgJGNoYXQucmVtb3ZlQ2xhc3MoJ2JnLWxpZ2h0JylcclxuICAgICAgICB9KTtcclxuICAgICAgICAkY2hhdC5vbignbW91c2VsZWF2ZScsICgpID0+IHtcclxuICAgICAgICAgICAgJGNoYXQuYWRkQ2xhc3MoJ2JnLWxpZ2h0JylcclxuICAgICAgICB9KTtcclxuICAgICAgICAkY2hhdC5vbignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGRpYWxvZy5tZXNzYWdlc0NvdW50ID0gMDtcclxuICAgICAgICAgICAgZHJhd0RpYWxvZ3MoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzdWJtaXQoKSB7XHJcbiAgICBjb25zdCBhdmF0YXJGaWxlOiBhbnkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFibGUtaW1hZ2UtZmlsZS1pbnB1dCcpXHJcbiAgICBsZXQgYXZhdGFyTGluayA9ICQoJyN0YWJsZS1pbWFnZS1saW5rLWlucHV0JykudmFsKCk7XHJcbiAgICBpZihhdmF0YXJMaW5rID09PSBcIlwiICYmIGF2YXRhckZpbGUuZmlsZXNbMF0gPT09IG51bGwpe1xyXG4gICAgICAgIGFsZXJ0KFwiWW91IG11c3Qgc3BlY2lmeSBlaXRoZXIgaW1hZ2Ugb3IgbGluayB0byBpbWFnZVwiKVxyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfVxyXG4gICAgbGV0IGhlaWdodCA9ICQoJyN0YWJsZS1oZWlnaHQtaW5wdXQnKS52YWwoKTtcclxuICAgIGxldCB3aWR0aCA9ICQoJyN0YWJsZS13aWR0aC1pbnB1dCcpLnZhbCgpO1xyXG4gICAgY29uc3QgbmV3VGFibGUgPSBuZXcgQ3JlYXRlVGFibGVSZXF1ZXN0KHtcclxuICAgICAgICBuYW1lOiAkKCcjdGFibGUtbmFtZS1pbnB1dCcpLnZhbCgpIGFzIHN0cmluZyxcclxuICAgICAgICB3aWR0aDogd2lkdGggYXMgbnVtYmVyLFxyXG4gICAgICAgIGhlaWdodDogaGVpZ2h0IGFzIG51bWJlcixcclxuICAgICAgICBhdmF0YXJMaW5rOiBhdmF0YXJMaW5rIGFzIHN0cmluZyxcclxuICAgICAgICBhdmF0YXJGaWxlOiBhdmF0YXJGaWxlPy5maWxlc1swXVxyXG4gICAgfSlcclxuICAgIGlmKHBhcnNlSW50KGhlaWdodCBhcyBzdHJpbmcpICogcGFyc2VJbnQod2lkdGggYXMgc3RyaW5nKSA+IDI1MDApe1xyXG4gICAgICAgIGFsZXJ0KFwi0KDQsNC30LzQtdGAINGC0LDQsdC70LjRhtGLINC90LUg0LzQvtC20LXRgiDQv9GA0LXQstGL0YjQsNGC0YwgMjUwMCDRj9GH0LXQtdC6XCIpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHBvc3RUYWJsZShuZXdUYWJsZSk7XHJcbiAgICBjbGVhck1lbnUoKTtcclxuICAgIGNsb3NlTWVudSgpO1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwb3N0VGFibGUodGFibGUpIHtcclxuICAgIGh0dHBDbGllbnQucHJvY2VlZFJlcXVlc3QoXHJcbiAgICAgICAgdGFibGUsXHJcbiAgICAgICAgKGNvZGUsIGVycm9yVGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBhbGVydChgRXJyb3IgaGFwcGVuZWQ6ICR7Y29kZX0sICR7ZXJyb3JUZXh0fWApXHJcbiAgICAgICAgfVxyXG4gICAgKS50aGVuKCh0YWJsZSkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRhYmxlKVxyXG4gICAgICAgIGxvYWRTdG9yZSgpLnRoZW4oZHJhd0RpYWxvZ3MpXHJcbiAgICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBjbGVhck1lbnUoKSB7XHJcbiAgICAkKCcjY2xlYXItYnV0dG9uJykuY2xpY2soKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2xvc2VNZW51KCkge1xyXG4gICAgJCgnI2Nsb3NlLWJ1dHRvbicpLmNsaWNrKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvYWRTdG9yZSgpIHtcclxuICAgIHJldHVybiBmZXRjaChcclxuICAgICAgICBsaW5rICsgXCIvdXNlci9pbmZvP2luY2x1ZGVDaGF0cz10cnVlXCIsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjcmVkZW50aWFsczogXCJpbmNsdWRlXCIsXHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICkudGhlbigocmVzcG9uc2UpID0+IHtcclxuICAgICAgICBpZihyZXNwb25zZS5zdGF0dXMgPT09IDIwMCl7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbigoanNvbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgc3RvcmUuZGlhbG9ncyA9IEpTT04ucGFyc2UoanNvbikuY2hhdHM7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnRleHQoKS50aGVuKHRleHQgPT4gY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzICsgXCIsIFwiICsgdGV4dCkpO1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXCJub3RoaW5nXCIpXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNoZWNrQXV0aG9yaXphdGlvbihpbnZva2VBZnRlclN1Y2Nlc3MpIHtcclxuICAgIHJldHVybiBmZXRjaChcclxuICAgICAgICBsaW5rICsgXCIvdXNlci9sb2dpblwiLFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwiaW5jbHVkZVwiLFxyXG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIn1cclxuICAgICAgICB9XHJcbiAgICApLnRoZW4oKHJlc3BvbnNlKSA9PntcclxuICAgICAgICBpZihyZXNwb25zZS5zdGF0dXMgPT09IDIwMCl7XHJcbiAgICAgICAgICAgIGludm9rZUFmdGVyU3VjY2VzcygpXHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gbGluayArIFwiL29hdXRoMi9hdXRob3JpemF0aW9uL2dvb2dsZVwiXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn0iLCJpbXBvcnQge1JlcXVlc3RXcmFwcGVyfSBmcm9tIFwiLi9yZXF1ZXN0L1JlcXVlc3RcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgSHR0cENsaWVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGFwaUxpbms6IHN0cmluZykge31cclxuXHJcbiAgICBhc3luYyBwcm9jZWVkUmVxdWVzdDxUPihcclxuICAgICAgICByZXF1ZXN0OiBSZXF1ZXN0V3JhcHBlcjxUPixcclxuICAgICAgICBvbkZhaWx1cmU6IChjb2RlOiBudW1iZXIsIGVycm9yVGV4dDogc3RyaW5nKSA9PiB1bmtub3duID1cclxuICAgICAgICAgICAgKGNvZGUsIGVycm9yVGV4dCkgPT4gYWxlcnQoYGNvZGU6ICR7Y29kZX0sIGVycm9yOiAke2Vycm9yVGV4dH1gKSxcclxuICAgICAgICBvbk5ldHdvcmtGYWlsdXJlOiAocmVhc29uKSA9PiB1bmtub3duID1cclxuICAgICAgICAgICAgKHJlYXNvbikgPT4gYWxlcnQoYG5ldHdvcmsgZXJyb3I6ICR7cmVhc29ufWApXHJcbiAgICApOiBQcm9taXNlPFQ+e1xyXG4gICAgICAgIGNvbnN0IGZpbmFsTGluayA9IG5ldyBVUkwodGhpcy5hcGlMaW5rICsgcmVxdWVzdC5lbmRwb2ludClcclxuICAgICAgICBpZihyZXF1ZXN0LnBhcmFtZXRlcnMgIT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICBmaW5hbExpbmsuc2VhcmNoID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhyZXF1ZXN0LnBhcmFtZXRlcnMpLnRvU3RyaW5nKClcclxuXHJcbiAgICAgICAgcmV0dXJuIGZldGNoKFxyXG4gICAgICAgICAgICBmaW5hbExpbmsudG9TdHJpbmcoKSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwiaW5jbHVkZVwiLFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiByZXF1ZXN0Lm1ldGhvZFR5cGUsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiByZXF1ZXN0LmhlYWRlcnMsXHJcbiAgICAgICAgICAgICAgICBib2R5OiByZXF1ZXN0LmJvZHlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICkudGhlbigocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgaWYocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucHJvY2VlZFJlcXVlc3QocmVzcG9uc2UpXHJcbiAgICAgICAgICAgICAgICAvLyBpZihyZXNwb25zZS5oZWFkZXJzLmdldChcIkNvbnRlbnQtVHlwZVwiKS5zdGFydHNXaXRoKFwiaW1hZ2VcIikpIHtcclxuICAgICAgICAgICAgICAgIC8vICAgICByZXNwb25zZS5ibG9iKCkudGhlbihibG9iID0+IHtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgb25TdWNjZXNzKGJsb2IpXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgfSlcclxuICAgICAgICAgICAgICAgIC8vIH1lbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vICAgICByZXNwb25zZS50ZXh0KCkudGhlbih0ZXh0ID0+IHtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgb25TdWNjZXNzKHRleHQpXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgfSlcclxuICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICByZXNwb25zZS50ZXh0KCkudGhlbih0ZXh0ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBvbkZhaWx1cmUocmVzcG9uc2Uuc3RhdHVzLCB0ZXh0KVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCh0ZXh0KVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIE1ldGhvZFR5cGV7XHJcbiAgICBQT1NUPVwiUE9TVFwiLFxyXG4gICAgR0VUPVwiR0VUXCIsXHJcbiAgICBQQVRDSD1cIlBBVENIXCIsXHJcbiAgICBQVVQ9XCJQVVRcIixcclxufSIsImltcG9ydCB7TWV0aG9kVHlwZX0gZnJvbSBcIi4uL0h0dHBDbGllbnRcIjtcclxuaW1wb3J0IHtSZXF1ZXN0V3JhcHBlcn0gZnJvbSBcIi4vUmVxdWVzdFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFVzZXJSZXNwb25zZXtcclxuICAgIHJlYWRvbmx5IGlkITogc3RyaW5nXHJcbiAgICByZWFkb25seSBuYW1lITogc3RyaW5nXHJcbiAgICByZWFkb25seSBlbWFpbCE6IHN0cmluZ1xyXG4gICAgcmVhZG9ubHkgYXZhdGFyITogc3RyaW5nXHJcbiAgICByZWFkb25seSBjcmVhdGVkITogRGF0ZVxyXG4gICAgcmVhZG9ubHkgY2hhdHM/OiBUYWJsZVJlc3BvbnNlW11cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRhYmxlUmVzcG9uc2Uge1xyXG4gICAgcmVhZG9ubHkgaWQhOiBudW1iZXJcclxuICAgIHJlYWRvbmx5IG5hbWUhOiBzdHJpbmdcclxuICAgIHJlYWRvbmx5IGNyZWF0b3IhOiBudW1iZXJcclxuICAgIHJlYWRvbmx5IHdpZHRoITogbnVtYmVyXHJcbiAgICByZWFkb25seSBoZWlnaHQhOiBudW1iZXJcclxuICAgIHJlYWRvbmx5IGF2YXRhciE6IG51bWJlclxyXG4gICAgcmVhZG9ubHkgY3JlYXRlZCE6IERhdGVcclxuICAgIHJlYWRvbmx5IGxhc3RNZXNzYWdlSWQ/OiBudW1iZXJcclxuICAgIHJlYWRvbmx5IHBhcnRpY2lwYW50cz86IFVzZXJSZXNwb25zZVtdXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDcmVhdGVUYWJsZVJlcXVlc3QgaW1wbGVtZW50cyBSZXF1ZXN0V3JhcHBlcjxUYWJsZVJlc3BvbnNlPiB7XHJcbiAgICByZWFkb25seSBib2R5PzogRm9ybURhdGFcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihib2R5OiB7XHJcbiAgICAgICAgbmFtZTogc3RyaW5nLFxyXG4gICAgICAgIHdpZHRoOiBudW1iZXIsXHJcbiAgICAgICAgaGVpZ2h0OiBudW1iZXIsXHJcbiAgICAgICAgYXZhdGFyRmlsZT86IEZpbGUsXHJcbiAgICAgICAgYXZhdGFyTGluaz86IHN0cmluZ1xyXG4gICAgfSkge1xyXG4gICAgICAgIHRoaXMuYm9keSA9IG5ldyBGb3JtRGF0YSgpXHJcbiAgICAgICAgdGhpcy5ib2R5LmFwcGVuZCgnbmFtZScsIGJvZHkubmFtZSlcclxuICAgICAgICB0aGlzLmJvZHkuYXBwZW5kKCd3aWR0aCcsIGJvZHkud2lkdGgudG9TdHJpbmcoKSlcclxuICAgICAgICB0aGlzLmJvZHkuYXBwZW5kKCdoZWlnaHQnLCBib2R5LmhlaWdodC50b1N0cmluZygpKVxyXG4gICAgICAgIGlmIChib2R5LmF2YXRhckxpbmsgPT0gdW5kZWZpbmVkICYmIGJvZHkuYXZhdGFyRmlsZSA9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3Qgc2VuZCByZXF1ZXN0IHdpdGggbm8gYXZhdGFyXCIpXHJcbiAgICAgICAgaWYgKGJvZHkuYXZhdGFyRmlsZSAhPSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRoaXMuYm9keS5hcHBlbmQoJ2F2YXRhckZpbGUnLCBib2R5LmF2YXRhckZpbGUpXHJcbiAgICAgICAgaWYgKGJvZHkuYXZhdGFyTGluayAhPSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRoaXMuYm9keS5hcHBlbmQoJ2F2YXRhckxpbmsnLCBib2R5LmF2YXRhckxpbmspXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgcHJvY2VlZFJlcXVlc3QocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTxUYWJsZVJlc3BvbnNlPiB7XHJcbiAgICAgICAgY29uc3QgdGV4dCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKVxyXG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHRleHQpIGFzIFRhYmxlUmVzcG9uc2VcclxuICAgIH1cclxuXHJcbiAgICBlbmRwb2ludDogc3RyaW5nID0gXCIvdGFibGUvY3JlYXRlXCI7XHJcbiAgICBoZWFkZXJzPzogSGVhZGVyc0luaXQgPSBudWxsO1xyXG4gICAgbWV0aG9kVHlwZTogTWV0aG9kVHlwZSA9IE1ldGhvZFR5cGUuUE9TVDtcclxufSJdfQ==
