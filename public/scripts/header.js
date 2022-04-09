(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.info = void 0;
var IsLoggedInRequest_1 = require("./util/request/IsLoggedInRequest");
var HttpClient_1 = require("./util/HttpClient");
var UserInfoRequest_1 = require("./util/request/UserInfoRequest");
exports.info = {
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
            exports.info.userId = response.id;
        });
    });
};
},{"./util/HttpClient":2,"./util/request/IsLoggedInRequest":3,"./util/request/UserInfoRequest":4}],2:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJUU2NyaXB0L2hlYWRlclNjcmlwdC50cyIsIlRTY3JpcHQvdXRpbC9IdHRwQ2xpZW50LnRzIiwiVFNjcmlwdC91dGlsL3JlcXVlc3QvSXNMb2dnZWRJblJlcXVlc3QudHMiLCJUU2NyaXB0L3V0aWwvcmVxdWVzdC9Vc2VySW5mb1JlcXVlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNBQSxzRUFBbUU7QUFDbkUsZ0RBQTZDO0FBQzdDLGtFQUErRDtBQUVwRCxRQUFBLElBQUksR0FBRztJQUNkLE1BQU0sRUFBRSxFQUFFO0NBQ2IsQ0FBQTtBQUVELE1BQU0sQ0FBQyxNQUFNLEdBQUc7SUFDWixJQUFJLFVBQVUsR0FBRyxJQUFJLHVCQUFVLENBQUMseUJBQXlCLENBQUMsQ0FBQztJQUMzRCxVQUFVLENBQUMsY0FBYyxDQUNyQixJQUFJLHFDQUFpQixFQUFFLEVBQ3ZCO1FBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ2xDLENBQUMsQ0FDSixDQUFDLElBQUksQ0FBQyxVQUFDLFFBQVE7UUFDWixDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRXRDLFVBQVUsQ0FBQyxjQUFjLENBQ3JCLElBQUksaUNBQWUsQ0FBQyxFQUFDLFlBQVksRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUM3QyxDQUFDLElBQUksQ0FBQyxVQUFBLFFBQVE7WUFDWCxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQU8sUUFBUSxDQUFDLEVBQUUsQ0FBRSxDQUFDLENBQUM7WUFDM0MsWUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsRUFBRSxDQUFDO1FBQzlCLENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQyxDQUFDLENBQUE7QUFDTixDQUFDLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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QUMsWUFBWSwwQ0FBRSxRQUFRLEVBQUUsQ0FBQTtRQUU3RCxJQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQTtJQUM1QixDQUFDO0lBS0ssd0NBQWMsR0FBcEIsVUFBcUIsUUFBa0I7Ozs7OzRCQUN0QixxQkFBTSxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUE7O3dCQUE1QixJQUFJLEdBQUcsU0FBcUI7d0JBQ2xDLHNCQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFpQixFQUFDOzs7O0tBQzNDO0lBQ0wsc0JBQUM7QUFBRCxDQWxCQSxBQWtCQyxJQUFBO0FBbEJZLDBDQUFlIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IHtJc0xvZ2dlZEluUmVxdWVzdH0gZnJvbSBcIi4vdXRpbC9yZXF1ZXN0L0lzTG9nZ2VkSW5SZXF1ZXN0XCI7XHJcbmltcG9ydCB7SHR0cENsaWVudH0gZnJvbSBcIi4vdXRpbC9IdHRwQ2xpZW50XCI7XHJcbmltcG9ydCB7VXNlckluZm9SZXF1ZXN0fSBmcm9tIFwiLi91dGlsL3JlcXVlc3QvVXNlckluZm9SZXF1ZXN0XCI7XHJcblxyXG5leHBvcnQgbGV0IGluZm8gPSB7XHJcbiAgICB1c2VySWQ6ICcnXHJcbn1cclxuXHJcbndpbmRvdy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICBsZXQgaHR0cENsaWVudCA9IG5ldyBIdHRwQ2xpZW50KFwiaHR0cHM6Ly9jb21ncmlkLnJ1Ojg0NDNcIik7XHJcbiAgICBodHRwQ2xpZW50LnByb2NlZWRSZXF1ZXN0KFxyXG4gICAgICAgIG5ldyBJc0xvZ2dlZEluUmVxdWVzdCgpLFxyXG4gICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJ1bmF1dGhvcml6YXRlZFwiKTtcclxuICAgICAgICB9XHJcbiAgICApLnRoZW4oKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgJCgnLmNsaWNrYWJsZScpLnRvZ2dsZUNsYXNzKCdkLW5vbmUnKTtcclxuXHJcbiAgICAgICAgaHR0cENsaWVudC5wcm9jZWVkUmVxdWVzdChcclxuICAgICAgICAgICAgbmV3IFVzZXJJbmZvUmVxdWVzdCh7aW5jbHVkZUNoYXRzOiBmYWxzZX0pXHJcbiAgICAgICAgKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgJCgnI2lkLWtlZXBlcicpLnRleHQoYGlkOiAke3Jlc3BvbnNlLmlkfWApO1xyXG4gICAgICAgICAgICBpbmZvLnVzZXJJZCA9IHJlc3BvbnNlLmlkO1xyXG4gICAgICAgIH0pXHJcbiAgICB9KVxyXG59IiwiaW1wb3J0IHtSZXF1ZXN0V3JhcHBlcn0gZnJvbSBcIi4vcmVxdWVzdC9SZXF1ZXN0XCI7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEh0dHBDbGllbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBhcGlMaW5rOiBzdHJpbmcpIHt9XHJcblxyXG4gICAgYXN5bmMgcHJvY2VlZFJlcXVlc3Q8VD4oXHJcbiAgICAgICAgcmVxdWVzdDogUmVxdWVzdFdyYXBwZXI8VD4sXHJcbiAgICAgICAgb25GYWlsdXJlOiAoY29kZTogbnVtYmVyLCBlcnJvclRleHQ6IHN0cmluZykgPT4gdW5rbm93biA9XHJcbiAgICAgICAgICAgIChjb2RlLCBlcnJvclRleHQpID0+IGFsZXJ0KGBjb2RlOiAke2NvZGV9LCBlcnJvcjogJHtlcnJvclRleHR9YCksXHJcbiAgICAgICAgb25OZXR3b3JrRmFpbHVyZTogKHJlYXNvbikgPT4gdW5rbm93biA9XHJcbiAgICAgICAgICAgIChyZWFzb24pID0+IGFsZXJ0KGBuZXR3b3JrIGVycm9yOiAke3JlYXNvbn1gKVxyXG4gICAgKTogUHJvbWlzZTxUPntcclxuICAgICAgICBjb25zdCBmaW5hbExpbmsgPSBuZXcgVVJMKHRoaXMuYXBpTGluayArIHJlcXVlc3QuZW5kcG9pbnQpXHJcbiAgICAgICAgaWYocmVxdWVzdC5wYXJhbWV0ZXJzICE9IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgZmluYWxMaW5rLnNlYXJjaCA9IG5ldyBVUkxTZWFyY2hQYXJhbXMocmVxdWVzdC5wYXJhbWV0ZXJzKS50b1N0cmluZygpXHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKHJlcXVlc3QpXHJcbiAgICAgICAgcmV0dXJuIGZldGNoKFxyXG4gICAgICAgICAgICBmaW5hbExpbmsudG9TdHJpbmcoKSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwiaW5jbHVkZVwiLFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiByZXF1ZXN0Lm1ldGhvZFR5cGUsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiByZXF1ZXN0LmhlYWRlcnMsXHJcbiAgICAgICAgICAgICAgICBib2R5OiByZXF1ZXN0LmJvZHlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICkudGhlbigocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgaWYocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucHJvY2VlZFJlcXVlc3QocmVzcG9uc2UpXHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UudGV4dCgpLnRoZW4odGV4dCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgb25GYWlsdXJlKHJlc3BvbnNlLnN0YXR1cywgdGV4dClcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QodGV4dClcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZW51bSBNZXRob2RUeXBle1xyXG4gICAgUE9TVD1cIlBPU1RcIixcclxuICAgIEdFVD1cIkdFVFwiLFxyXG4gICAgUEFUQ0g9XCJQQVRDSFwiLFxyXG4gICAgUFVUPVwiUFVUXCIsXHJcbn0iLCJpbXBvcnQge1JlcXVlc3RXcmFwcGVyfSBmcm9tIFwiLi9SZXF1ZXN0XCI7XHJcbmltcG9ydCB7TWV0aG9kVHlwZX0gZnJvbSBcIi4uL0h0dHBDbGllbnRcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgSXNMb2dnZWRJblJlcXVlc3QgaW1wbGVtZW50cyBSZXF1ZXN0V3JhcHBlcjxudW1iZXI+e1xyXG4gICAgcmVhZG9ubHkgZW5kcG9pbnQ6IHN0cmluZyA9ICcvdXNlci9sb2dpbic7XHJcbiAgICByZWFkb25seSBtZXRob2RUeXBlOiBNZXRob2RUeXBlID0gTWV0aG9kVHlwZS5HRVQ7XHJcblxyXG4gICAgYXN5bmMgcHJvY2VlZFJlcXVlc3QocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTxudW1iZXI+IHtcclxuICAgICAgICByZXR1cm4gcmVzcG9uc2Uuc3RhdHVzO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHtSZXF1ZXN0V3JhcHBlcn0gZnJvbSBcIi4vUmVxdWVzdFwiO1xyXG5pbXBvcnQge1RhYmxlUmVzcG9uc2V9IGZyb20gXCIuL0NyZWF0ZVRhYmxlUmVxdWVzdFwiO1xyXG5pbXBvcnQge01ldGhvZFR5cGV9IGZyb20gXCIuLi9IdHRwQ2xpZW50XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVXNlclJlc3BvbnNle1xyXG4gICAgcmVhZG9ubHkgaWQhOiBzdHJpbmdcclxuICAgIHJlYWRvbmx5IG5hbWUhOiBzdHJpbmdcclxuICAgIHJlYWRvbmx5IGVtYWlsITogc3RyaW5nXHJcbiAgICByZWFkb25seSBhdmF0YXIhOiBzdHJpbmdcclxuICAgIHJlYWRvbmx5IGNyZWF0ZWQhOiBEYXRlXHJcbiAgICByZWFkb25seSBjaGF0cz86IFRhYmxlUmVzcG9uc2VbXVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVXNlckluZm9SZXF1ZXN0IGltcGxlbWVudHMgUmVxdWVzdFdyYXBwZXI8VXNlclJlc3BvbnNlPntcclxuICAgIHJlYWRvbmx5IHBhcmFtZXRlcnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXJhbWV0ZXJzOiB7IGluY2x1ZGVDaGF0cz86IGJvb2xlYW4gfSkge1xyXG4gICAgICAgIGxldCBwYXJhbXM6IGFueSA9IHt9XHJcbiAgICAgICAgaWYocGFyYW1ldGVycy5pbmNsdWRlQ2hhdHMpXHJcbiAgICAgICAgICAgIHBhcmFtcy5pbmNsdWRlQ2hhdHMgPSBwYXJhbWV0ZXJzLmluY2x1ZGVDaGF0cz8udG9TdHJpbmcoKVxyXG5cclxuICAgICAgICB0aGlzLnBhcmFtZXRlcnMgPSBwYXJhbXNcclxuICAgIH1cclxuXHJcbiAgICByZWFkb25seSBlbmRwb2ludDogc3RyaW5nID0gXCIvdXNlci9pbmZvXCI7XHJcbiAgICByZWFkb25seSBtZXRob2RUeXBlOiBNZXRob2RUeXBlID0gTWV0aG9kVHlwZS5HRVQ7XHJcblxyXG4gICAgYXN5bmMgcHJvY2VlZFJlcXVlc3QocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTxVc2VyUmVzcG9uc2U+IHtcclxuICAgICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xyXG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHRleHQpIGFzIFVzZXJSZXNwb25zZTtcclxuICAgIH1cclxufSJdfQ==
