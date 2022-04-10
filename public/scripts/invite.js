(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HttpClient_1 = require("./util/HttpClient");
var IsLoggedInRequest_1 = require("./util/request/IsLoggedInRequest");
var PostLinkRequest_1 = require("./util/request/PostLinkRequest");
var Util_1 = require("./util/Util");
window.onload = function () {
    var http = new HttpClient_1.HttpClient("https://comgrid.ru:8443");
    http.proceedRequest(new IsLoggedInRequest_1.IsLoggedInRequest(), function (code, err) {
        if (code === 401) {
            alert("Вы не вошли в систему, войдите, пожалуйста");
            var link = document.createElement('a');
            link.href = "https://comgrid.ru";
            link.click();
        }
        console.log(code, err);
    }).then(function (response) {
        if (response === 200) {
            http.proceedRequest(new PostLinkRequest_1.PostLinkRequest({ code: (0, Util_1.getParam)('code') }), function (code, err) {
                if (code === 422) {
                    var link_1 = document.createElement('a');
                    link_1.href = "https://comgrid.ru/pages/table?id=" + (0, Util_1.getParam)('chatId');
                    link_1.click();
                    return;
                }
                alert(err);
                var link = document.createElement('a');
                link.href = "https://comgrid.ru";
                link.click();
            }).then(function (response) {
                var link = document.createElement('a');
                link.href = "https://comgrid.ru/pages/table?id=" + (0, Util_1.getParam)('chatId');
                link.click();
            });
        }
    });
};
},{"./util/HttpClient":2,"./util/Util":3,"./util/request/IsLoggedInRequest":4,"./util/request/PostLinkRequest":5}],2:[function(require,module,exports){
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParam = void 0;
function getParam(name) {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}
exports.getParam = getParam;
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
exports.PostLinkRequest = exports.ChatIdKeeper = void 0;
var HttpClient_1 = require("../HttpClient");
var ChatIdKeeper = /** @class */ (function () {
    function ChatIdKeeper() {
    }
    return ChatIdKeeper;
}());
exports.ChatIdKeeper = ChatIdKeeper;
var PostLinkRequest = /** @class */ (function () {
    function PostLinkRequest(body) {
        this.endpoint = "/table/invitation_link";
        this.headers = {
            "Content-Type": "application/json"
        };
        this.methodType = HttpClient_1.MethodType.POST;
        this.body = JSON.stringify(body);
    }
    PostLinkRequest.prototype.proceedRequest = function (response) {
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
    return PostLinkRequest;
}());
exports.PostLinkRequest = PostLinkRequest;
},{"../HttpClient":2}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJUU2NyaXB0L2ludml0ZS50cyIsIlRTY3JpcHQvdXRpbC9IdHRwQ2xpZW50LnRzIiwiVFNjcmlwdC91dGlsL1V0aWwudHMiLCJUU2NyaXB0L3V0aWwvcmVxdWVzdC9Jc0xvZ2dlZEluUmVxdWVzdC50cyIsIlRTY3JpcHQvdXRpbC9yZXF1ZXN0L1Bvc3RMaW5rUmVxdWVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsZ0RBQTZDO0FBQzdDLHNFQUFtRTtBQUNuRSxrRUFBK0Q7QUFDL0Qsb0NBQXFDO0FBRXJDLE1BQU0sQ0FBQyxNQUFNLEdBQUc7SUFDWixJQUFNLElBQUksR0FBRyxJQUFJLHVCQUFVLENBQUMseUJBQXlCLENBQUMsQ0FBQztJQUN2RCxJQUFJLENBQUMsY0FBYyxDQUNmLElBQUkscUNBQWlCLEVBQUUsRUFDdkIsVUFBQyxJQUFJLEVBQUUsR0FBRztRQUNOLElBQUksSUFBSSxLQUFLLEdBQUcsRUFBRTtZQUNkLEtBQUssQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO1lBQ3BELElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdkMsSUFBSSxDQUFDLElBQUksR0FBRyxvQkFBb0IsQ0FBQztZQUNqQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDaEI7UUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztJQUMzQixDQUFDLENBQ0osQ0FBQyxJQUFJLENBQUMsVUFBQSxRQUFRO1FBQ1gsSUFBSSxRQUFRLEtBQUssR0FBRyxFQUFFO1lBQ2xCLElBQUksQ0FBQyxjQUFjLENBQ2YsSUFBSSxpQ0FBZSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUEsZUFBUSxFQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFDL0MsVUFBQyxJQUFJLEVBQUUsR0FBRztnQkFDTixJQUFJLElBQUks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O3dCQUE1QixJQUFJLEdBQUcsU0FBcUI7d0JBQ2xDLHNCQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFpQixFQUFDOzs7O0tBQzNDO0lBQ0wsc0JBQUM7QUFBRCxDQWhCQSxBQWdCQyxJQUFBO0FBaEJZLDBDQUFlIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IHtIdHRwQ2xpZW50fSBmcm9tIFwiLi91dGlsL0h0dHBDbGllbnRcIjtcclxuaW1wb3J0IHtJc0xvZ2dlZEluUmVxdWVzdH0gZnJvbSBcIi4vdXRpbC9yZXF1ZXN0L0lzTG9nZ2VkSW5SZXF1ZXN0XCI7XHJcbmltcG9ydCB7UG9zdExpbmtSZXF1ZXN0fSBmcm9tIFwiLi91dGlsL3JlcXVlc3QvUG9zdExpbmtSZXF1ZXN0XCI7XHJcbmltcG9ydCB7Z2V0UGFyYW19IGZyb20gXCIuL3V0aWwvVXRpbFwiO1xyXG5cclxud2luZG93Lm9ubG9hZCA9ICgpID0+IHtcclxuICAgIGNvbnN0IGh0dHAgPSBuZXcgSHR0cENsaWVudChcImh0dHBzOi8vY29tZ3JpZC5ydTo4NDQzXCIpO1xyXG4gICAgaHR0cC5wcm9jZWVkUmVxdWVzdChcclxuICAgICAgICBuZXcgSXNMb2dnZWRJblJlcXVlc3QoKSxcclxuICAgICAgICAoY29kZSwgZXJyKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjb2RlID09PSA0MDEpIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KFwi0JLRiyDQvdC1INCy0L7RiNC70Lgg0LIg0YHQuNGB0YLQtdC80YMsINCy0L7QudC00LjRgtC1LCDQv9C+0LbQsNC70YPQudGB0YLQsFwiKTtcclxuICAgICAgICAgICAgICAgIGxldCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgICAgICAgICAgICAgbGluay5ocmVmID0gXCJodHRwczovL2NvbWdyaWQucnVcIjtcclxuICAgICAgICAgICAgICAgIGxpbmsuY2xpY2soKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhjb2RlLCBlcnIpO1xyXG4gICAgICAgIH1cclxuICAgICkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgaWYgKHJlc3BvbnNlID09PSAyMDApIHtcclxuICAgICAgICAgICAgaHR0cC5wcm9jZWVkUmVxdWVzdChcclxuICAgICAgICAgICAgICAgIG5ldyBQb3N0TGlua1JlcXVlc3QoeyBjb2RlOiBnZXRQYXJhbSgnY29kZScpIH0pLFxyXG4gICAgICAgICAgICAgICAgKGNvZGUsIGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb2RlID09PSA0MjIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmsuaHJlZiA9IFwiaHR0cHM6Ly9jb21ncmlkLnJ1L3BhZ2VzL3RhYmxlP2lkPVwiICsgZ2V0UGFyYW0oJ2NoYXRJZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rLmNsaWNrKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICAgICAgICAgICAgICBsaW5rLmhyZWYgPSBcImh0dHBzOi8vY29tZ3JpZC5ydVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmsuY2xpY2soKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgICAgICAgICAgICAgbGluay5ocmVmID0gXCJodHRwczovL2NvbWdyaWQucnUvcGFnZXMvdGFibGU/aWQ9XCIgKyBnZXRQYXJhbSgnY2hhdElkJyk7XHJcbiAgICAgICAgICAgICAgICBsaW5rLmNsaWNrKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn0iLCJpbXBvcnQge1JlcXVlc3RXcmFwcGVyfSBmcm9tIFwiLi9yZXF1ZXN0L1JlcXVlc3RcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgSHR0cENsaWVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGFwaUxpbms6IHN0cmluZykge31cclxuXHJcbiAgICBhc3luYyBwcm9jZWVkUmVxdWVzdDxUPihcclxuICAgICAgICByZXF1ZXN0OiBSZXF1ZXN0V3JhcHBlcjxUPixcclxuICAgICAgICBvbkZhaWx1cmU6IChjb2RlOiBudW1iZXIsIGVycm9yVGV4dDogc3RyaW5nKSA9PiB1bmtub3duID1cclxuICAgICAgICAgICAgKGNvZGUsIGVycm9yVGV4dCkgPT4gYWxlcnQoYGNvZGU6ICR7Y29kZX0sIGVycm9yOiAke2Vycm9yVGV4dH1gKSxcclxuICAgICAgICBvbk5ldHdvcmtGYWlsdXJlOiAocmVhc29uKSA9PiB1bmtub3duID1cclxuICAgICAgICAgICAgKHJlYXNvbikgPT4gYWxlcnQoYG5ldHdvcmsgZXJyb3I6ICR7cmVhc29ufWApXHJcbiAgICApOiBQcm9taXNlPFQ+e1xyXG4gICAgICAgIGNvbnN0IGZpbmFsTGluayA9IG5ldyBVUkwodGhpcy5hcGlMaW5rICsgcmVxdWVzdC5lbmRwb2ludClcclxuICAgICAgICBpZihyZXF1ZXN0LnBhcmFtZXRlcnMgIT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICBmaW5hbExpbmsuc2VhcmNoID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhyZXF1ZXN0LnBhcmFtZXRlcnMpLnRvU3RyaW5nKClcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2cocmVxdWVzdClcclxuICAgICAgICByZXR1cm4gZmV0Y2goXHJcbiAgICAgICAgICAgIGZpbmFsTGluay50b1N0cmluZygpLFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjcmVkZW50aWFsczogXCJpbmNsdWRlXCIsXHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6IHJlcXVlc3QubWV0aG9kVHlwZSxcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHJlcXVlc3QuaGVhZGVycyxcclxuICAgICAgICAgICAgICAgIGJvZHk6IHJlcXVlc3QuYm9keVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKS50aGVuKGFzeW5jIChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICBpZihyZXNwb25zZS5zdGF0dXMgPT09IDIwMCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wcm9jZWVkUmVxdWVzdChyZXNwb25zZSlcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlcnJvclRleHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XHJcbiAgICAgICAgICAgICAgICBvbkZhaWx1cmUocmVzcG9uc2Uuc3RhdHVzLCBlcnJvclRleHQpO1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihlcnJvclRleHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGVudW0gTWV0aG9kVHlwZXtcclxuICAgIFBPU1Q9XCJQT1NUXCIsXHJcbiAgICBHRVQ9XCJHRVRcIixcclxuICAgIFBBVENIPVwiUEFUQ0hcIixcclxuICAgIFBVVD1cIlBVVFwiLFxyXG4gICAgREVMRVRFPVwiREVMRVRFXCJcclxufSIsIlxyXG5cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGFyYW0obmFtZTogc3RyaW5nKTogc3RyaW5ne1xyXG4gIGNvbnN0IHVybFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaClcclxuICByZXR1cm4gdXJsUGFyYW1zLmdldChuYW1lKVxyXG59IiwiaW1wb3J0IHtSZXF1ZXN0V3JhcHBlcn0gZnJvbSBcIi4vUmVxdWVzdFwiO1xyXG5pbXBvcnQge01ldGhvZFR5cGV9IGZyb20gXCIuLi9IdHRwQ2xpZW50XCI7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIElzTG9nZ2VkSW5SZXF1ZXN0IGltcGxlbWVudHMgUmVxdWVzdFdyYXBwZXI8bnVtYmVyPntcclxuICAgIHJlYWRvbmx5IGVuZHBvaW50OiBzdHJpbmcgPSAnL3VzZXIvbG9naW4nO1xyXG4gICAgcmVhZG9ubHkgbWV0aG9kVHlwZTogTWV0aG9kVHlwZSA9IE1ldGhvZFR5cGUuR0VUO1xyXG5cclxuICAgIGFzeW5jIHByb2NlZWRSZXF1ZXN0KHJlc3BvbnNlOiBSZXNwb25zZSk6IFByb21pc2U8bnVtYmVyPiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnN0YXR1cztcclxuICAgIH1cclxufSIsImltcG9ydCB7TWV0aG9kVHlwZX0gZnJvbSBcIi4uL0h0dHBDbGllbnRcIjtcclxuaW1wb3J0IHtSZXF1ZXN0V3JhcHBlcn0gZnJvbSBcIi4vUmVxdWVzdFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENoYXRJZEtlZXBlciB7XHJcbiAgICBjaGF0SWQhOiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQb3N0TGlua1JlcXVlc3QgaW1wbGVtZW50cyBSZXF1ZXN0V3JhcHBlcjxDaGF0SWRLZWVwZXI+IHtcclxuICAgIHJlYWRvbmx5IGJvZHk6IGFueTtcclxuICAgIGNvbnN0cnVjdG9yKGJvZHk6IHsgY29kZTogc3RyaW5nIH0pIHtcclxuICAgICAgICB0aGlzLmJvZHkgPSBKU09OLnN0cmluZ2lmeShib2R5KTtcclxuICAgIH1cclxuXHJcbiAgICByZWFkb25seSBlbmRwb2ludDogc3RyaW5nID0gXCIvdGFibGUvaW52aXRhdGlvbl9saW5rXCI7XHJcbiAgICByZWFkb25seSBoZWFkZXJzOiBIZWFkZXJzSW5pdCA9IHtcclxuICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxyXG4gICAgfTtcclxuICAgIHJlYWRvbmx5IG1ldGhvZFR5cGU6IE1ldGhvZFR5cGUgPSBNZXRob2RUeXBlLlBPU1Q7XHJcblxyXG4gICAgYXN5bmMgcHJvY2VlZFJlcXVlc3QocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTxDaGF0SWRLZWVwZXI+IHtcclxuICAgICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xyXG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHRleHQpIGFzIENoYXRJZEtlZXBlcjtcclxuICAgIH1cclxufSJdfQ==
