(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var State_1 = require("./State");
window.onload = function () {
    var params = new URLSearchParams(window.location.search);
    var token = params.get("token");
    if (!token) {
        console.log("Couldn't authorize user, because there was no token param");
        // window.location.href = AuthorizationProvider[provider] +
        //   encodeURIComponent(new URLSearchParams({"redirectUri": authorizationRedirectUri}).toString())
    }
    console.log("Token got from auth: " + token);
    (0, State_1.getState)().whenReady().then(function (state) { return state.afterAuthorize(token); });
};
},{"./State":2}],2:[function(require,module,exports){
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
exports.getState = exports.State = exports.AuthorizationProvider = exports.User = void 0;
var Constants_1 = require("../util/Constants");
var HttpClient_1 = require("../util/HttpClient");
var UserInfoRequest_1 = require("../util/request/UserInfoRequest");
var User = /** @class */ (function () {
    function User() {
    }
    return User;
}());
exports.User = User;
exports.AuthorizationProvider = {
    google: Constants_1.googleLoginUri,
    vk: Constants_1.vkLoginUri,
};
var State = /** @class */ (function () {
    function State() {
        this.authorized = false;
        this.isLoading = false;
        this.token = localStorage.getItem("token");
        this.checker = this.checkToken();
    }
    State.prototype.whenReady = function () {
        var _this = this;
        return this.checker.then(function () { return _this; });
    };
    State.prototype.authorize = function (redirectUri, provider) {
        return __awaiter(this, void 0, void 0, function () {
            var authorizeLink;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.authorized) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.checkToken()];
                    case 1:
                        if (_a.sent())
                            return [2 /*return*/];
                        if (!redirectUri)
                            redirectUri = window.location.href;
                        localStorage.setItem("redirectAfterAuthorizationUri", redirectUri);
                        localStorage.setItem("provider", provider);
                        if (!provider)
                            provider = "google";
                        this.isLoading = true;
                        authorizeLink = exports.AuthorizationProvider[provider] + "?" +
                            new URLSearchParams({ "redirect_uri": Constants_1.authorizationRedirectUri }).toString();
                        console.log(authorizeLink);
                        window.location.href = authorizeLink;
                        return [2 /*return*/];
                }
            });
        });
    };
    State.prototype.afterAuthorize = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var httpClient;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isLoading)
                            this.isLoading = true;
                        this.token = token;
                        httpClient = (0, HttpClient_1.getHttpClient)();
                        return [4 /*yield*/, httpClient.proceedRequest(new UserInfoRequest_1.UserInfoRequest({}), function (code) {
                                if (code === 401) {
                                    console.log("User is not authorized after asking");
                                    _this.revokeAuthorization();
                                    _this.isLoading = false;
                                }
                            }).then(function (user) {
                                _this.currentUser = user;
                                _this.token = token;
                                _this.authorized = true;
                                _this.isLoading = false;
                                localStorage.setItem("userId", user.id);
                                localStorage.setItem("token", token);
                                var redirect = localStorage.getItem("redirectAfterAuthorizationUri");
                                localStorage.removeItem("redirectAfterAuthorizationUri");
                                console.log("Authed user: ");
                                console.log(user);
                                window.location.replace(redirect);
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    State.prototype.checkToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var httpClient;
            var _this = this;
            return __generator(this, function (_a) {
                httpClient = (0, HttpClient_1.getHttpClient)();
                if (!this.token)
                    return [2 /*return*/, false];
                fetch(Constants_1.apiLink + "/user/info", {
                    method: "GET",
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": "Bearer " + this.token
                    }
                }).then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                    var _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                if (!(response.status === 200)) return [3 /*break*/, 2];
                                _a = this;
                                _c = (_b = JSON).parse;
                                return [4 /*yield*/, response.text()];
                            case 1:
                                _a.currentUser = _c.apply(_b, [_d.sent()]);
                                this.authorized = true;
                                this.isLoading = false;
                                localStorage.setItem("userId", this.currentUser.id);
                                return [2 /*return*/, true];
                            case 2:
                                console.log("User is not authorized");
                                this.revokeAuthorization();
                                this.isLoading = false;
                                return [2 /*return*/, false];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    State.prototype.getAuthorizationHeader = function () {
        return {
            "Authorization": "Bearer " + this.token
        };
    };
    State.prototype.revokeAuthorization = function () {
        this.authorized = false;
        this.currentUser = null;
        this.token = null;
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
    };
    return State;
}());
exports.State = State;
var state;
function getState() {
    if (!state)
        state = new State();
    return state;
}
exports.getState = getState;
},{"../util/Constants":3,"../util/HttpClient":4,"../util/request/UserInfoRequest":5}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizationRedirectUri = exports.googleLoginUri = exports.vkLoginUri = exports.apiLink = void 0;
exports.apiLink = "https://comgrid.ru:8443";
exports.vkLoginUri = exports.apiLink + "/oauth2/authorize/vk";
exports.googleLoginUri = exports.apiLink + "/oauth2/authorize/google";
exports.authorizationRedirectUri = "https://comgrid.ru/pages/login.html";
},{}],4:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.MethodType = exports.getHttpClient = exports.HttpClient = void 0;
var State_1 = require("../authorization/State");
var Constants_1 = require("./Constants");
var HttpClient = /** @class */ (function () {
    function HttpClient(apiLink) {
        this.apiLink = apiLink;
    }
    HttpClient.prototype.proceedRequest = function (request, onFailure, onNetworkFailure) {
        if (onFailure === void 0) { onFailure = function (code, errorText) { return alert("code: ".concat(code, ", error: ").concat(errorText)); }; }
        if (onNetworkFailure === void 0) { onNetworkFailure = function (reason) { return alert("network error: ".concat(reason)); }; }
        return __awaiter(this, void 0, void 0, function () {
            var finalLink, headers, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        finalLink = new URL(this.apiLink + request.endpoint);
                        if (request.parameters != undefined)
                            finalLink.search = new URLSearchParams(request.parameters).toString();
                        _a = [__assign({}, request.headers)];
                        return [4 /*yield*/, (0, State_1.getState)().whenReady()];
                    case 1:
                        headers = __assign.apply(void 0, _a.concat([(_b.sent()).getAuthorizationHeader()]));
                        console.log(__assign(__assign({}, request), { headers: headers }));
                        return [2 /*return*/, fetch(finalLink.toString(), {
                                method: request.methodType,
                                headers: headers,
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
                }
            });
        });
    };
    return HttpClient;
}());
exports.HttpClient = HttpClient;
var httpClient;
function getHttpClient() {
    if (!httpClient)
        httpClient = new HttpClient(Constants_1.apiLink);
    return httpClient;
}
exports.getHttpClient = getHttpClient;
var MethodType;
(function (MethodType) {
    MethodType["POST"] = "POST";
    MethodType["GET"] = "GET";
    MethodType["PATCH"] = "PATCH";
    MethodType["PUT"] = "PUT";
    MethodType["DELETE"] = "DELETE";
})(MethodType = exports.MethodType || (exports.MethodType = {}));
},{"../authorization/State":2,"./Constants":3}],5:[function(require,module,exports){
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
},{"../HttpClient":4}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJUU2NyaXB0L2F1dGhvcml6YXRpb24vTG9naW5QYWdlLnRzIiwiVFNjcmlwdC9hdXRob3JpemF0aW9uL1N0YXRlLnRzIiwiVFNjcmlwdC91dGlsL0NvbnN0YW50cy50cyIsIlRTY3JpcHQvdXRpbC9IdHRwQ2xpZW50LnRzIiwiVFNjcmlwdC91dGlsL3JlcXVlc3QvVXNlckluZm9SZXF1ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNDQSxpQ0FBaUU7QUFHakUsTUFBTSxDQUFDLE1BQU0sR0FBRztJQUNkLElBQU0sTUFBTSxHQUFHLElBQUksZUFBZSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUE7SUFFMUQsSUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUVqQyxJQUFHLENBQUMsS0FBSyxFQUFDO1FBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQywyREFBMkQsQ0FBQyxDQUFDO1FBQ3pFLDJEQUEyRDtRQUMzRCxrR0FBa0c7S0FDbkc7SUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixHQUFHLEtBQUssQ0FBQyxDQUFBO0lBRTVDLElBQUEsZ0JBQVEsR0FBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFDLEtBQUssSUFBSyxPQUFBLEtBQUssQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEVBQTNCLENBQTJCLENBQUMsQ0FBQTtBQUNyRSxDQUFDLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaEJELCtDQUFrRztBQUNsRyxpREFBK0Q7QUFDL0QsbUVBQWtFO0FBR2xFO0lBQUE7SUFPQSxDQUFDO0lBQUQsV0FBQztBQUFELENBUEEsQUFPQyxJQUFBO0FBUFksb0JBQUk7QUFTSixRQUFBLHFCQUFxQixHQUFHO0lBQ25DLE1BQU0sRUFBRSww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QUM1QixDQUFDO0lBS0ssd0NBQWMsR0FBcEIsVUFBcUIsUUFBa0I7Ozs7OzRCQUN0QixxQkFBTSxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUE7O3dCQUE1QixJQUFJLEdBQUcsU0FBcUI7d0JBQ2xDLHNCQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFpQixFQUFDOzs7O0tBQzNDO0lBQ0wsc0JBQUM7QUFBRCxDQWxCQSxBQWtCQyxJQUFBO0FBbEJZLDBDQUFlIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IHsgYXV0aG9yaXphdGlvblJlZGlyZWN0VXJpIH0gZnJvbSBcIi4uL3V0aWwvQ29uc3RhbnRzXCI7XHJcbmltcG9ydCB7IEF1dGhvcml6YXRpb25Qcm92aWRlciwgZ2V0U3RhdGUsIFN0YXRlIH0gZnJvbSBcIi4vU3RhdGVcIjtcclxuXHJcblxyXG53aW5kb3cub25sb2FkID0gKCkgPT4ge1xyXG4gIGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaClcclxuXHJcbiAgY29uc3QgdG9rZW4gPSBwYXJhbXMuZ2V0KFwidG9rZW5cIilcclxuXHJcbiAgaWYoIXRva2VuKXtcclxuICAgIGNvbnNvbGUubG9nKFwiQ291bGRuJ3QgYXV0aG9yaXplIHVzZXIsIGJlY2F1c2UgdGhlcmUgd2FzIG5vIHRva2VuIHBhcmFtXCIpO1xyXG4gICAgLy8gd2luZG93LmxvY2F0aW9uLmhyZWYgPSBBdXRob3JpemF0aW9uUHJvdmlkZXJbcHJvdmlkZXJdICtcclxuICAgIC8vICAgZW5jb2RlVVJJQ29tcG9uZW50KG5ldyBVUkxTZWFyY2hQYXJhbXMoe1wicmVkaXJlY3RVcmlcIjogYXV0aG9yaXphdGlvblJlZGlyZWN0VXJpfSkudG9TdHJpbmcoKSlcclxuICB9XHJcbiAgY29uc29sZS5sb2coXCJUb2tlbiBnb3QgZnJvbSBhdXRoOiBcIiArIHRva2VuKVxyXG5cclxuICBnZXRTdGF0ZSgpLndoZW5SZWFkeSgpLnRoZW4oKHN0YXRlKSA9PiBzdGF0ZS5hZnRlckF1dGhvcml6ZSh0b2tlbikpXHJcbn0iLCJpbXBvcnQgeyBUYWJsZVJlc3BvbnNlIH0gZnJvbSBcIi4uL3V0aWwvcmVxdWVzdC9DcmVhdGVUYWJsZVJlcXVlc3RcIjtcclxuaW1wb3J0IHsgYXBpTGluaywgYXV0aG9yaXphdGlvblJlZGlyZWN0VXJpLCBnb29nbGVMb2dpblVyaSwgdmtMb2dpblVyaSB9IGZyb20gXCIuLi91dGlsL0NvbnN0YW50c1wiO1xyXG5pbXBvcnQgeyBnZXRIdHRwQ2xpZW50LCBIdHRwQ2xpZW50IH0gZnJvbSBcIi4uL3V0aWwvSHR0cENsaWVudFwiO1xyXG5pbXBvcnQgeyBVc2VySW5mb1JlcXVlc3QgfSBmcm9tIFwiLi4vdXRpbC9yZXF1ZXN0L1VzZXJJbmZvUmVxdWVzdFwiO1xyXG5pbXBvcnQgeyBJc0xvZ2dlZEluUmVxdWVzdCB9IGZyb20gXCIuLi91dGlsL3JlcXVlc3QvSXNMb2dnZWRJblJlcXVlc3RcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBVc2VyIHtcclxuICByZWFkb25seSBpZCE6IHN0cmluZ1xyXG4gIHJlYWRvbmx5IG5hbWUhOiBzdHJpbmdcclxuICByZWFkb25seSBlbWFpbD86IHN0cmluZ1xyXG4gIHJlYWRvbmx5IGF2YXRhciE6IHN0cmluZ1xyXG4gIHJlYWRvbmx5IGNyZWF0ZWQhOiBEYXRlXHJcbiAgcmVhZG9ubHkgY2hhdHM/OiBUYWJsZVJlc3BvbnNlW11cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IEF1dGhvcml6YXRpb25Qcm92aWRlciA9IHtcclxuICBnb29nbGU6IGdvb2dsZUxvZ2luVXJpLFxyXG4gIHZrOiB2a0xvZ2luVXJpLFxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU3RhdGUge1xyXG4gIHByaXZhdGUgcmVhZG9ubHkgY2hlY2tlcjogUHJvbWlzZTxib29sZWFuPlxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy50b2tlbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIilcclxuICAgIHRoaXMuY2hlY2tlciA9IHRoaXMuY2hlY2tUb2tlbigpXHJcbiAgfVxyXG5cclxuICB3aGVuUmVhZHkoKTogUHJvbWlzZTxTdGF0ZT57XHJcbiAgICByZXR1cm4gdGhpcy5jaGVja2VyLnRoZW4oKCkgPT4gdGhpcylcclxuICB9XHJcblxyXG4gIHByaXZhdGUgY3VycmVudFVzZXI/OiBVc2VyXHJcbiAgcHJpdmF0ZSB0b2tlbj86IHN0cmluZ1xyXG4gIHByaXZhdGUgYXV0aG9yaXplZDogYm9vbGVhbiA9IGZhbHNlXHJcbiAgcHJpdmF0ZSBpc0xvYWRpbmc6IGJvb2xlYW4gPSBmYWxzZVxyXG5cclxuICBhc3luYyBhdXRob3JpemUocmVkaXJlY3RVcmk/OiBzdHJpbmcsIHByb3ZpZGVyPzoga2V5b2YgdHlwZW9mIEF1dGhvcml6YXRpb25Qcm92aWRlcikge1xyXG4gICAgaWYodGhpcy5hdXRob3JpemVkKXtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgaWYoYXdhaXQgdGhpcy5jaGVja1Rva2VuKCkpXHJcbiAgICAgIHJldHVybjtcclxuXHJcbiAgICBpZighcmVkaXJlY3RVcmkpXHJcbiAgICAgIHJlZGlyZWN0VXJpID0gd2luZG93LmxvY2F0aW9uLmhyZWZcclxuXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInJlZGlyZWN0QWZ0ZXJBdXRob3JpemF0aW9uVXJpXCIsIHJlZGlyZWN0VXJpKVxyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJwcm92aWRlclwiLCBwcm92aWRlcilcclxuXHJcbiAgICBpZighcHJvdmlkZXIpXHJcbiAgICAgIHByb3ZpZGVyID0gXCJnb29nbGVcIlxyXG5cclxuICAgIHRoaXMuaXNMb2FkaW5nID0gdHJ1ZVxyXG4gICAgY29uc3QgYXV0aG9yaXplTGluayA9IEF1dGhvcml6YXRpb25Qcm92aWRlcltwcm92aWRlcl0gKyBcIj9cIiArXHJcbiAgICAgIG5ldyBVUkxTZWFyY2hQYXJhbXMoe1wicmVkaXJlY3RfdXJpXCI6IGF1dGhvcml6YXRpb25SZWRpcmVjdFVyaX0pLnRvU3RyaW5nKCk7XHJcbiAgICBjb25zb2xlLmxvZyhhdXRob3JpemVMaW5rKVxyXG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBhdXRob3JpemVMaW5rXHJcbiAgfVxyXG5cclxuICBhc3luYyBhZnRlckF1dGhvcml6ZSh0b2tlbjogc3RyaW5nKSB7XHJcbiAgICBpZighdGhpcy5pc0xvYWRpbmcpXHJcbiAgICAgIHRoaXMuaXNMb2FkaW5nID0gdHJ1ZVxyXG4gICAgdGhpcy50b2tlbiA9IHRva2VuXHJcbiAgICBjb25zdCBodHRwQ2xpZW50ID0gZ2V0SHR0cENsaWVudCgpO1xyXG4gICAgYXdhaXQgaHR0cENsaWVudC5wcm9jZWVkUmVxdWVzdChcclxuICAgICAgbmV3IFVzZXJJbmZvUmVxdWVzdCh7fSksXHJcbiAgICAgIGNvZGUgPT4ge1xyXG4gICAgICAgIGlmKGNvZGUgPT09IDQwMSl7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIlVzZXIgaXMgbm90IGF1dGhvcml6ZWQgYWZ0ZXIgYXNraW5nXCIpXHJcbiAgICAgICAgICB0aGlzLnJldm9rZUF1dGhvcml6YXRpb24oKVxyXG4gICAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgKS50aGVuKHVzZXIgPT4ge1xyXG4gICAgICB0aGlzLmN1cnJlbnRVc2VyID0gdXNlclxyXG4gICAgICB0aGlzLnRva2VuID0gdG9rZW5cclxuICAgICAgdGhpcy5hdXRob3JpemVkID0gdHJ1ZVxyXG4gICAgICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlXHJcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidXNlcklkXCIsIHVzZXIuaWQpXHJcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidG9rZW5cIiwgdG9rZW4pXHJcbiAgICAgIGNvbnN0IHJlZGlyZWN0ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJyZWRpcmVjdEFmdGVyQXV0aG9yaXphdGlvblVyaVwiKTtcclxuICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJyZWRpcmVjdEFmdGVyQXV0aG9yaXphdGlvblVyaVwiKVxyXG4gICAgICBjb25zb2xlLmxvZyhcIkF1dGhlZCB1c2VyOiBcIilcclxuICAgICAgY29uc29sZS5sb2codXNlcilcclxuICAgICAgd2luZG93LmxvY2F0aW9uLnJlcGxhY2UocmVkaXJlY3QpXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhc3luYyBjaGVja1Rva2VuKCk6IFByb21pc2U8Ym9vbGVhbj57XHJcbiAgICBjb25zdCBodHRwQ2xpZW50ID0gZ2V0SHR0cENsaWVudCgpO1xyXG4gICAgaWYoIXRoaXMudG9rZW4pXHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIGZldGNoKFxyXG4gICAgICBhcGlMaW5rICsgXCIvdXNlci9pbmZvXCIsXHJcbiAgICAgIHtcclxuICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgXCJDb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAgICAgICAgICBcIkF1dGhvcml6YXRpb25cIjogXCJCZWFyZXIgXCIgKyB0aGlzLnRva2VuXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICApLnRoZW4oYXN5bmMgKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgIGlmKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKXtcclxuICAgICAgICB0aGlzLmN1cnJlbnRVc2VyID0gSlNPTi5wYXJzZShhd2FpdCByZXNwb25zZS50ZXh0KCkpXHJcbiAgICAgICAgdGhpcy5hdXRob3JpemVkID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2VcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInVzZXJJZFwiLCB0aGlzLmN1cnJlbnRVc2VyLmlkKVxyXG4gICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJVc2VyIGlzIG5vdCBhdXRob3JpemVkXCIpXHJcbiAgICAgICAgdGhpcy5yZXZva2VBdXRob3JpemF0aW9uKClcclxuICAgICAgICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldEF1dGhvcml6YXRpb25IZWFkZXIoKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPntcclxuICAgIHJldHVybiB7XHJcbiAgICAgIFwiQXV0aG9yaXphdGlvblwiOiBcIkJlYXJlciBcIiArIHRoaXMudG9rZW5cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldm9rZUF1dGhvcml6YXRpb24oKXtcclxuICAgIHRoaXMuYXV0aG9yaXplZCA9IGZhbHNlXHJcbiAgICB0aGlzLmN1cnJlbnRVc2VyID0gbnVsbFxyXG4gICAgdGhpcy50b2tlbiA9IG51bGxcclxuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwidXNlcklkXCIpXHJcbiAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcInRva2VuXCIpXHJcbiAgfVxyXG59XHJcblxyXG5sZXQgc3RhdGU6IFN0YXRlO1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3RhdGUoKTogU3RhdGV7XHJcbiAgaWYoIXN0YXRlKVxyXG4gICAgc3RhdGUgPSBuZXcgU3RhdGUoKTtcclxuICByZXR1cm4gc3RhdGVcclxufSIsIlxyXG5cclxuZXhwb3J0IGNvbnN0IGFwaUxpbmsgPSBcImh0dHBzOi8vY29tZ3JpZC5ydTo4NDQzXCJcclxuZXhwb3J0IGNvbnN0IHZrTG9naW5VcmkgPSBhcGlMaW5rICsgXCIvb2F1dGgyL2F1dGhvcml6ZS92a1wiXHJcbmV4cG9ydCBjb25zdCBnb29nbGVMb2dpblVyaSA9IGFwaUxpbmsgKyBcIi9vYXV0aDIvYXV0aG9yaXplL2dvb2dsZVwiXHJcblxyXG5leHBvcnQgY29uc3QgYXV0aG9yaXphdGlvblJlZGlyZWN0VXJpID0gXCJodHRwczovL2NvbWdyaWQucnUvcGFnZXMvbG9naW4uaHRtbFwiIiwiaW1wb3J0IHtSZXF1ZXN0V3JhcHBlcn0gZnJvbSBcIi4vcmVxdWVzdC9SZXF1ZXN0XCI7XHJcbmltcG9ydCB7IGdldFN0YXRlLCBTdGF0ZSB9IGZyb20gXCIuLi9hdXRob3JpemF0aW9uL1N0YXRlXCI7XHJcbmltcG9ydCB7IGFwaUxpbmsgfSBmcm9tIFwiLi9Db25zdGFudHNcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgSHR0cENsaWVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGFwaUxpbms6IHN0cmluZykge31cclxuXHJcbiAgICBhc3luYyBwcm9jZWVkUmVxdWVzdDxUPihcclxuICAgICAgICByZXF1ZXN0OiBSZXF1ZXN0V3JhcHBlcjxUPixcclxuICAgICAgICBvbkZhaWx1cmU6IChjb2RlOiBudW1iZXIsIGVycm9yVGV4dDogc3RyaW5nKSA9PiB1bmtub3duID1cclxuICAgICAgICAgICAgKGNvZGUsIGVycm9yVGV4dCkgPT4gYWxlcnQoYGNvZGU6ICR7Y29kZX0sIGVycm9yOiAke2Vycm9yVGV4dH1gKSxcclxuICAgICAgICBvbk5ldHdvcmtGYWlsdXJlOiAocmVhc29uKSA9PiB1bmtub3duID1cclxuICAgICAgICAgICAgKHJlYXNvbikgPT4gYWxlcnQoYG5ldHdvcmsgZXJyb3I6ICR7cmVhc29ufWApXHJcbiAgICApOiBQcm9taXNlPFQ+e1xyXG4gICAgICAgIGNvbnN0IGZpbmFsTGluayA9IG5ldyBVUkwodGhpcy5hcGlMaW5rICsgcmVxdWVzdC5lbmRwb2ludClcclxuICAgICAgICBpZihyZXF1ZXN0LnBhcmFtZXRlcnMgIT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICBmaW5hbExpbmsuc2VhcmNoID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhyZXF1ZXN0LnBhcmFtZXRlcnMpLnRvU3RyaW5nKClcclxuXHJcbiAgICAgICAgbGV0IGhlYWRlcnMgPSB7XHJcbiAgICAgICAgICAgIC4uLnJlcXVlc3QuaGVhZGVycyxcclxuICAgICAgICAgICAgLi4uKGF3YWl0IGdldFN0YXRlKCkud2hlblJlYWR5KCkpLmdldEF1dGhvcml6YXRpb25IZWFkZXIoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmxvZyh7Li4ucmVxdWVzdCwgaGVhZGVyczogaGVhZGVyc30pXHJcbiAgICAgICAgcmV0dXJuIGZldGNoKFxyXG4gICAgICAgICAgICBmaW5hbExpbmsudG9TdHJpbmcoKSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiByZXF1ZXN0Lm1ldGhvZFR5cGUsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzLFxyXG4gICAgICAgICAgICAgICAgYm9keTogcmVxdWVzdC5ib2R5XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApLnRoZW4oYXN5bmMgKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnByb2NlZWRSZXF1ZXN0KHJlc3BvbnNlKVxyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yVGV4dCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcclxuICAgICAgICAgICAgICAgIG9uRmFpbHVyZShyZXNwb25zZS5zdGF0dXMsIGVycm9yVGV4dCk7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGVycm9yVGV4dCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59XHJcblxyXG5sZXQgaHR0cENsaWVudDogSHR0cENsaWVudDtcclxuZXhwb3J0IGZ1bmN0aW9uIGdldEh0dHBDbGllbnQoKTogSHR0cENsaWVudHtcclxuICAgIGlmKCFodHRwQ2xpZW50KVxyXG4gICAgICAgIGh0dHBDbGllbnQgPSBuZXcgSHR0cENsaWVudChhcGlMaW5rKVxyXG4gICAgcmV0dXJuIGh0dHBDbGllbnRcclxufVxyXG5cclxuZXhwb3J0IGVudW0gTWV0aG9kVHlwZXtcclxuICAgIFBPU1Q9XCJQT1NUXCIsXHJcbiAgICBHRVQ9XCJHRVRcIixcclxuICAgIFBBVENIPVwiUEFUQ0hcIixcclxuICAgIFBVVD1cIlBVVFwiLFxyXG4gICAgREVMRVRFPVwiREVMRVRFXCJcclxufSIsImltcG9ydCB7UmVxdWVzdFdyYXBwZXJ9IGZyb20gXCIuL1JlcXVlc3RcIjtcclxuaW1wb3J0IHtUYWJsZVJlc3BvbnNlfSBmcm9tIFwiLi9DcmVhdGVUYWJsZVJlcXVlc3RcIjtcclxuaW1wb3J0IHtNZXRob2RUeXBlfSBmcm9tIFwiLi4vSHR0cENsaWVudFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFVzZXJSZXNwb25zZXtcclxuICAgIHJlYWRvbmx5IGlkITogc3RyaW5nXHJcbiAgICByZWFkb25seSBuYW1lITogc3RyaW5nXHJcbiAgICByZWFkb25seSBlbWFpbD86IHN0cmluZ1xyXG4gICAgcmVhZG9ubHkgYXZhdGFyITogc3RyaW5nXHJcbiAgICByZWFkb25seSBjcmVhdGVkITogRGF0ZVxyXG4gICAgcmVhZG9ubHkgY2hhdHM/OiBUYWJsZVJlc3BvbnNlW11cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFVzZXJJbmZvUmVxdWVzdCBpbXBsZW1lbnRzIFJlcXVlc3RXcmFwcGVyPFVzZXJSZXNwb25zZT57XHJcbiAgICByZWFkb25seSBwYXJhbWV0ZXJzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+XHJcblxyXG4gICAgY29uc3RydWN0b3IocGFyYW1ldGVyczogeyBpbmNsdWRlQ2hhdHM/OiBib29sZWFuIH0pIHtcclxuICAgICAgICBsZXQgcGFyYW1zOiBhbnkgPSB7fVxyXG4gICAgICAgIGlmKHBhcmFtZXRlcnMuaW5jbHVkZUNoYXRzKVxyXG4gICAgICAgICAgICBwYXJhbXMuaW5jbHVkZUNoYXRzID0gcGFyYW1ldGVycy5pbmNsdWRlQ2hhdHM/LnRvU3RyaW5nKClcclxuXHJcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzID0gcGFyYW1zXHJcbiAgICB9XHJcblxyXG4gICAgcmVhZG9ubHkgZW5kcG9pbnQ6IHN0cmluZyA9IFwiL3VzZXIvaW5mb1wiO1xyXG4gICAgcmVhZG9ubHkgbWV0aG9kVHlwZTogTWV0aG9kVHlwZSA9IE1ldGhvZFR5cGUuR0VUO1xyXG5cclxuICAgIGFzeW5jIHByb2NlZWRSZXF1ZXN0KHJlc3BvbnNlOiBSZXNwb25zZSk6IFByb21pc2U8VXNlclJlc3BvbnNlPiB7XHJcbiAgICAgICAgY29uc3QgdGV4dCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcclxuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh0ZXh0KSBhcyBVc2VyUmVzcG9uc2U7XHJcbiAgICB9XHJcbn0iXX0=
