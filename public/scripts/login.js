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
                        window.location.href = exports.AuthorizationProvider[provider] + "?" +
                            new URLSearchParams({ "redirectUri": encodeURIComponent(Constants_1.authorizationRedirectUri) }).toString();
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
        if (!this.authorized)
            return {};
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
exports.authorizationRedirectUri = "https://comgrid.ru/login";
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
            var finalLink, headers, _a, _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        finalLink = new URL(this.apiLink + request.endpoint);
                        if (request.parameters != undefined)
                            finalLink.search = new URLSearchParams(request.parameters).toString();
                        _a = [__assign({}, request.headers)];
                        _b = request.requiresAuthentication;
                        if (!_b) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, State_1.getState)().whenReady()];
                    case 1:
                        _b = (_c.sent()).getAuthorizationHeader();
                        _c.label = 2;
                    case 2:
                        headers = __assign.apply(void 0, _a.concat([(_b)]));
                        console.log(request);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJUU2NyaXB0L2F1dGhvcml6YXRpb24vTG9naW5QYWdlLnRzIiwiVFNjcmlwdC9hdXRob3JpemF0aW9uL1N0YXRlLnRzIiwiVFNjcmlwdC91dGlsL0NvbnN0YW50cy50cyIsIlRTY3JpcHQvdXRpbC9IdHRwQ2xpZW50LnRzIiwiVFNjcmlwdC91dGlsL3JlcXVlc3QvVXNlckluZm9SZXF1ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNDQSxpQ0FBaUU7QUFHakUsTUFBTSxDQUFDLE1BQU0sR0FBRztJQUNkLElBQU0sTUFBTSxHQUFHLElBQUksZUFBZSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUE7SUFFMUQsSUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUVqQyxJQUFHLENBQUMsS0FBSyxFQUFDO1FBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQywyREFBMkQsQ0FBQyxDQUFDO1FBQ3pFLDJEQUEyRDtRQUMzRCxrR0FBa0c7S0FDbkc7SUFFRCxJQUFBLGdCQUFRLEdBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQyxLQUFLLElBQUssT0FBQSxLQUFLLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxFQUEzQixDQUEyQixDQUFDLENBQUE7QUFDckUsQ0FBQyxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2ZELCtDQUFrRztBQUNsRyxpREFBK0Q7QUFDL0QsbUVBQWtFO0FBR2xFO0lBQUE7SUFPQSxDQUFDO0lBQUQsV0FBQztBQUFELENBUEEsQUFPQyxJQUFBO0FBUFksb0JBQUk7QUFTSixRQUFBLHFCQUFxQixHQUFHO0lBQ25DLE1BQU0sRUFBRSwwQkFBYztJQUN0QixFQUFFLEVBQUUsc0JBQVU7Q0FDZixDQUFBO0FBRUQ7SUFFRTtRQVdRLGVB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QUFDLEtBQUssQ0FBQyxJQUFJLENBQWlCLEVBQUM7Ozs7S0FDM0M7SUFDTCxzQkFBQztBQUFELENBbEJBLEFBa0JDLElBQUE7QUFsQlksMENBQWUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgeyBhdXRob3JpemF0aW9uUmVkaXJlY3RVcmkgfSBmcm9tIFwiLi4vdXRpbC9Db25zdGFudHNcIjtcclxuaW1wb3J0IHsgQXV0aG9yaXphdGlvblByb3ZpZGVyLCBnZXRTdGF0ZSwgU3RhdGUgfSBmcm9tIFwiLi9TdGF0ZVwiO1xyXG5cclxuXHJcbndpbmRvdy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKVxyXG5cclxuICBjb25zdCB0b2tlbiA9IHBhcmFtcy5nZXQoXCJ0b2tlblwiKVxyXG5cclxuICBpZighdG9rZW4pe1xyXG4gICAgY29uc29sZS5sb2coXCJDb3VsZG4ndCBhdXRob3JpemUgdXNlciwgYmVjYXVzZSB0aGVyZSB3YXMgbm8gdG9rZW4gcGFyYW1cIik7XHJcbiAgICAvLyB3aW5kb3cubG9jYXRpb24uaHJlZiA9IEF1dGhvcml6YXRpb25Qcm92aWRlcltwcm92aWRlcl0gK1xyXG4gICAgLy8gICBlbmNvZGVVUklDb21wb25lbnQobmV3IFVSTFNlYXJjaFBhcmFtcyh7XCJyZWRpcmVjdFVyaVwiOiBhdXRob3JpemF0aW9uUmVkaXJlY3RVcml9KS50b1N0cmluZygpKVxyXG4gIH1cclxuXHJcbiAgZ2V0U3RhdGUoKS53aGVuUmVhZHkoKS50aGVuKChzdGF0ZSkgPT4gc3RhdGUuYWZ0ZXJBdXRob3JpemUodG9rZW4pKVxyXG59IiwiaW1wb3J0IHsgVGFibGVSZXNwb25zZSB9IGZyb20gXCIuLi91dGlsL3JlcXVlc3QvQ3JlYXRlVGFibGVSZXF1ZXN0XCI7XHJcbmltcG9ydCB7IGFwaUxpbmssIGF1dGhvcml6YXRpb25SZWRpcmVjdFVyaSwgZ29vZ2xlTG9naW5VcmksIHZrTG9naW5VcmkgfSBmcm9tIFwiLi4vdXRpbC9Db25zdGFudHNcIjtcclxuaW1wb3J0IHsgZ2V0SHR0cENsaWVudCwgSHR0cENsaWVudCB9IGZyb20gXCIuLi91dGlsL0h0dHBDbGllbnRcIjtcclxuaW1wb3J0IHsgVXNlckluZm9SZXF1ZXN0IH0gZnJvbSBcIi4uL3V0aWwvcmVxdWVzdC9Vc2VySW5mb1JlcXVlc3RcIjtcclxuaW1wb3J0IHsgSXNMb2dnZWRJblJlcXVlc3QgfSBmcm9tIFwiLi4vdXRpbC9yZXF1ZXN0L0lzTG9nZ2VkSW5SZXF1ZXN0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVXNlciB7XHJcbiAgcmVhZG9ubHkgaWQhOiBzdHJpbmdcclxuICByZWFkb25seSBuYW1lITogc3RyaW5nXHJcbiAgcmVhZG9ubHkgZW1haWw/OiBzdHJpbmdcclxuICByZWFkb25seSBhdmF0YXIhOiBzdHJpbmdcclxuICByZWFkb25seSBjcmVhdGVkITogRGF0ZVxyXG4gIHJlYWRvbmx5IGNoYXRzPzogVGFibGVSZXNwb25zZVtdXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBBdXRob3JpemF0aW9uUHJvdmlkZXIgPSB7XHJcbiAgZ29vZ2xlOiBnb29nbGVMb2dpblVyaSxcclxuICB2azogdmtMb2dpblVyaSxcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFN0YXRlIHtcclxuICBwcml2YXRlIHJlYWRvbmx5IGNoZWNrZXI6IFByb21pc2U8Ym9vbGVhbj5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMudG9rZW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpXHJcbiAgICB0aGlzLmNoZWNrZXIgPSB0aGlzLmNoZWNrVG9rZW4oKVxyXG4gIH1cclxuXHJcbiAgd2hlblJlYWR5KCk6IFByb21pc2U8U3RhdGU+e1xyXG4gICAgcmV0dXJuIHRoaXMuY2hlY2tlci50aGVuKCgpID0+IHRoaXMpXHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGN1cnJlbnRVc2VyPzogVXNlclxyXG4gIHByaXZhdGUgdG9rZW4/OiBzdHJpbmdcclxuICBwcml2YXRlIGF1dGhvcml6ZWQ6IGJvb2xlYW4gPSBmYWxzZVxyXG4gIHByaXZhdGUgaXNMb2FkaW5nOiBib29sZWFuID0gZmFsc2VcclxuXHJcbiAgYXN5bmMgYXV0aG9yaXplKHJlZGlyZWN0VXJpPzogc3RyaW5nLCBwcm92aWRlcj86IGtleW9mIHR5cGVvZiBBdXRob3JpemF0aW9uUHJvdmlkZXIpIHtcclxuICAgIGlmKHRoaXMuYXV0aG9yaXplZCl7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIGlmKGF3YWl0IHRoaXMuY2hlY2tUb2tlbigpKVxyXG4gICAgICByZXR1cm47XHJcblxyXG4gICAgaWYoIXJlZGlyZWN0VXJpKVxyXG4gICAgICByZWRpcmVjdFVyaSA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXHJcblxyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJyZWRpcmVjdEFmdGVyQXV0aG9yaXphdGlvblVyaVwiLCByZWRpcmVjdFVyaSlcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwicHJvdmlkZXJcIiwgcHJvdmlkZXIpXHJcblxyXG4gICAgaWYoIXByb3ZpZGVyKVxyXG4gICAgICBwcm92aWRlciA9IFwiZ29vZ2xlXCJcclxuXHJcbiAgICB0aGlzLmlzTG9hZGluZyA9IHRydWVcclxuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gQXV0aG9yaXphdGlvblByb3ZpZGVyW3Byb3ZpZGVyXSArIFwiP1wiICtcclxuICAgICAgbmV3IFVSTFNlYXJjaFBhcmFtcyh7XCJyZWRpcmVjdFVyaVwiOiBlbmNvZGVVUklDb21wb25lbnQoYXV0aG9yaXphdGlvblJlZGlyZWN0VXJpKX0pLnRvU3RyaW5nKClcclxuICB9XHJcblxyXG4gIGFzeW5jIGFmdGVyQXV0aG9yaXplKHRva2VuOiBzdHJpbmcpIHtcclxuICAgIGlmKCF0aGlzLmlzTG9hZGluZylcclxuICAgICAgdGhpcy5pc0xvYWRpbmcgPSB0cnVlXHJcbiAgICBjb25zdCBodHRwQ2xpZW50ID0gZ2V0SHR0cENsaWVudCgpO1xyXG4gICAgYXdhaXQgaHR0cENsaWVudC5wcm9jZWVkUmVxdWVzdChcclxuICAgICAgbmV3IFVzZXJJbmZvUmVxdWVzdCh7fSksXHJcbiAgICAgIGNvZGUgPT4ge1xyXG4gICAgICAgIGlmKGNvZGUgPT09IDQwMSl7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIlVzZXIgaXMgbm90IGF1dGhvcml6ZWQgYWZ0ZXIgYXNraW5nXCIpXHJcbiAgICAgICAgICB0aGlzLnJldm9rZUF1dGhvcml6YXRpb24oKVxyXG4gICAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgKS50aGVuKHVzZXIgPT4ge1xyXG4gICAgICB0aGlzLmN1cnJlbnRVc2VyID0gdXNlclxyXG4gICAgICB0aGlzLnRva2VuID0gdG9rZW5cclxuICAgICAgdGhpcy5hdXRob3JpemVkID0gdHJ1ZVxyXG4gICAgICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlXHJcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidXNlcklkXCIsIHVzZXIuaWQpXHJcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidG9rZW5cIiwgdG9rZW4pXHJcbiAgICAgIGNvbnN0IHJlZGlyZWN0ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJyZWRpcmVjdEFmdGVyQXV0aG9yaXphdGlvblVyaVwiKTtcclxuICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJyZWRpcmVjdEFmdGVyQXV0aG9yaXphdGlvblVyaVwiKVxyXG4gICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZShyZWRpcmVjdClcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIGNoZWNrVG9rZW4oKTogUHJvbWlzZTxib29sZWFuPntcclxuICAgIGNvbnN0IGh0dHBDbGllbnQgPSBnZXRIdHRwQ2xpZW50KCk7XHJcbiAgICBpZighdGhpcy50b2tlbilcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgZmV0Y2goXHJcbiAgICAgIGFwaUxpbmsgKyBcIi91c2VyL2luZm9cIixcclxuICAgICAge1xyXG4gICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICBcIkNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgIFwiQXV0aG9yaXphdGlvblwiOiBcIkJlYXJlciBcIiArIHRoaXMudG9rZW5cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICkudGhlbihhc3luYyAocmVzcG9uc2UpID0+IHtcclxuICAgICAgaWYocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApe1xyXG4gICAgICAgIHRoaXMuY3VycmVudFVzZXIgPSBKU09OLnBhcnNlKGF3YWl0IHJlc3BvbnNlLnRleHQoKSlcclxuICAgICAgICB0aGlzLmF1dGhvcml6ZWQgPSB0cnVlXHJcbiAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZVxyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidXNlcklkXCIsIHRoaXMuY3VycmVudFVzZXIuaWQpXHJcbiAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlVzZXIgaXMgbm90IGF1dGhvcml6ZWRcIilcclxuICAgICAgICB0aGlzLnJldm9rZUF1dGhvcml6YXRpb24oKVxyXG4gICAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2VcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0QXV0aG9yaXphdGlvbkhlYWRlcigpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+e1xyXG4gICAgaWYoIXRoaXMuYXV0aG9yaXplZClcclxuICAgICAgcmV0dXJuIHt9XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBcIkF1dGhvcml6YXRpb25cIjogXCJCZWFyZXIgXCIgKyB0aGlzLnRva2VuXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXZva2VBdXRob3JpemF0aW9uKCl7XHJcbiAgICB0aGlzLmF1dGhvcml6ZWQgPSBmYWxzZVxyXG4gICAgdGhpcy5jdXJyZW50VXNlciA9IG51bGxcclxuICAgIHRoaXMudG9rZW4gPSBudWxsXHJcbiAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcInVzZXJJZFwiKVxyXG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJ0b2tlblwiKVxyXG4gIH1cclxufVxyXG5cclxubGV0IHN0YXRlOiBTdGF0ZTtcclxuZXhwb3J0IGZ1bmN0aW9uIGdldFN0YXRlKCk6IFN0YXRle1xyXG4gIGlmKCFzdGF0ZSlcclxuICAgIHN0YXRlID0gbmV3IFN0YXRlKCk7XHJcbiAgcmV0dXJuIHN0YXRlXHJcbn0iLCJcclxuXHJcbmV4cG9ydCBjb25zdCBhcGlMaW5rID0gXCJodHRwczovL2NvbWdyaWQucnU6ODQ0M1wiXHJcbmV4cG9ydCBjb25zdCB2a0xvZ2luVXJpID0gYXBpTGluayArIFwiL29hdXRoMi9hdXRob3JpemUvdmtcIlxyXG5leHBvcnQgY29uc3QgZ29vZ2xlTG9naW5VcmkgPSBhcGlMaW5rICsgXCIvb2F1dGgyL2F1dGhvcml6ZS9nb29nbGVcIlxyXG5cclxuZXhwb3J0IGNvbnN0IGF1dGhvcml6YXRpb25SZWRpcmVjdFVyaSA9IFwiaHR0cHM6Ly9jb21ncmlkLnJ1L2xvZ2luXCIiLCJpbXBvcnQge1JlcXVlc3RXcmFwcGVyfSBmcm9tIFwiLi9yZXF1ZXN0L1JlcXVlc3RcIjtcclxuaW1wb3J0IHsgZ2V0U3RhdGUsIFN0YXRlIH0gZnJvbSBcIi4uL2F1dGhvcml6YXRpb24vU3RhdGVcIjtcclxuaW1wb3J0IHsgYXBpTGluayB9IGZyb20gXCIuL0NvbnN0YW50c1wiO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBIdHRwQ2xpZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgYXBpTGluazogc3RyaW5nKSB7fVxyXG5cclxuICAgIGFzeW5jIHByb2NlZWRSZXF1ZXN0PFQ+KFxyXG4gICAgICAgIHJlcXVlc3Q6IFJlcXVlc3RXcmFwcGVyPFQ+LFxyXG4gICAgICAgIG9uRmFpbHVyZTogKGNvZGU6IG51bWJlciwgZXJyb3JUZXh0OiBzdHJpbmcpID0+IHVua25vd24gPVxyXG4gICAgICAgICAgICAoY29kZSwgZXJyb3JUZXh0KSA9PiBhbGVydChgY29kZTogJHtjb2RlfSwgZXJyb3I6ICR7ZXJyb3JUZXh0fWApLFxyXG4gICAgICAgIG9uTmV0d29ya0ZhaWx1cmU6IChyZWFzb24pID0+IHVua25vd24gPVxyXG4gICAgICAgICAgICAocmVhc29uKSA9PiBhbGVydChgbmV0d29yayBlcnJvcjogJHtyZWFzb259YClcclxuICAgICk6IFByb21pc2U8VD57XHJcbiAgICAgICAgY29uc3QgZmluYWxMaW5rID0gbmV3IFVSTCh0aGlzLmFwaUxpbmsgKyByZXF1ZXN0LmVuZHBvaW50KVxyXG4gICAgICAgIGlmKHJlcXVlc3QucGFyYW1ldGVycyAhPSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIGZpbmFsTGluay5zZWFyY2ggPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHJlcXVlc3QucGFyYW1ldGVycykudG9TdHJpbmcoKVxyXG5cclxuICAgICAgICBjb25zdCBoZWFkZXJzID0ge1xyXG4gICAgICAgICAgICAuLi5yZXF1ZXN0LmhlYWRlcnMsXHJcbiAgICAgICAgICAgIC4uLihyZXF1ZXN0LnJlcXVpcmVzQXV0aGVudGljYXRpb24gJiYgKGF3YWl0IGdldFN0YXRlKCkud2hlblJlYWR5KCkpLmdldEF1dGhvcml6YXRpb25IZWFkZXIoKSlcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5sb2cocmVxdWVzdClcclxuICAgICAgICByZXR1cm4gZmV0Y2goXHJcbiAgICAgICAgICAgIGZpbmFsTGluay50b1N0cmluZygpLFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6IHJlcXVlc3QubWV0aG9kVHlwZSxcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXHJcbiAgICAgICAgICAgICAgICBib2R5OiByZXF1ZXN0LmJvZHlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICkudGhlbihhc3luYyAocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgaWYocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucHJvY2VlZFJlcXVlc3QocmVzcG9uc2UpXHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZXJyb3JUZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xyXG4gICAgICAgICAgICAgICAgb25GYWlsdXJlKHJlc3BvbnNlLnN0YXR1cywgZXJyb3JUZXh0KTtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoZXJyb3JUZXh0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn1cclxuXHJcbmxldCBodHRwQ2xpZW50OiBIdHRwQ2xpZW50O1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0SHR0cENsaWVudCgpOiBIdHRwQ2xpZW50e1xyXG4gICAgaWYoIWh0dHBDbGllbnQpXHJcbiAgICAgICAgaHR0cENsaWVudCA9IG5ldyBIdHRwQ2xpZW50KGFwaUxpbmspXHJcbiAgICByZXR1cm4gaHR0cENsaWVudFxyXG59XHJcblxyXG5leHBvcnQgZW51bSBNZXRob2RUeXBle1xyXG4gICAgUE9TVD1cIlBPU1RcIixcclxuICAgIEdFVD1cIkdFVFwiLFxyXG4gICAgUEFUQ0g9XCJQQVRDSFwiLFxyXG4gICAgUFVUPVwiUFVUXCIsXHJcbiAgICBERUxFVEU9XCJERUxFVEVcIlxyXG59IiwiaW1wb3J0IHtSZXF1ZXN0V3JhcHBlcn0gZnJvbSBcIi4vUmVxdWVzdFwiO1xyXG5pbXBvcnQge1RhYmxlUmVzcG9uc2V9IGZyb20gXCIuL0NyZWF0ZVRhYmxlUmVxdWVzdFwiO1xyXG5pbXBvcnQge01ldGhvZFR5cGV9IGZyb20gXCIuLi9IdHRwQ2xpZW50XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVXNlclJlc3BvbnNle1xyXG4gICAgcmVhZG9ubHkgaWQhOiBzdHJpbmdcclxuICAgIHJlYWRvbmx5IG5hbWUhOiBzdHJpbmdcclxuICAgIHJlYWRvbmx5IGVtYWlsPzogc3RyaW5nXHJcbiAgICByZWFkb25seSBhdmF0YXIhOiBzdHJpbmdcclxuICAgIHJlYWRvbmx5IGNyZWF0ZWQhOiBEYXRlXHJcbiAgICByZWFkb25seSBjaGF0cz86IFRhYmxlUmVzcG9uc2VbXVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVXNlckluZm9SZXF1ZXN0IGltcGxlbWVudHMgUmVxdWVzdFdyYXBwZXI8VXNlclJlc3BvbnNlPntcclxuICAgIHJlYWRvbmx5IHBhcmFtZXRlcnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXJhbWV0ZXJzOiB7IGluY2x1ZGVDaGF0cz86IGJvb2xlYW4gfSkge1xyXG4gICAgICAgIGxldCBwYXJhbXM6IGFueSA9IHt9XHJcbiAgICAgICAgaWYocGFyYW1ldGVycy5pbmNsdWRlQ2hhdHMpXHJcbiAgICAgICAgICAgIHBhcmFtcy5pbmNsdWRlQ2hhdHMgPSBwYXJhbWV0ZXJzLmluY2x1ZGVDaGF0cz8udG9TdHJpbmcoKVxyXG5cclxuICAgICAgICB0aGlzLnBhcmFtZXRlcnMgPSBwYXJhbXNcclxuICAgIH1cclxuXHJcbiAgICByZWFkb25seSBlbmRwb2ludDogc3RyaW5nID0gXCIvdXNlci9pbmZvXCI7XHJcbiAgICByZWFkb25seSBtZXRob2RUeXBlOiBNZXRob2RUeXBlID0gTWV0aG9kVHlwZS5HRVQ7XHJcblxyXG4gICAgYXN5bmMgcHJvY2VlZFJlcXVlc3QocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTxVc2VyUmVzcG9uc2U+IHtcclxuICAgICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xyXG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHRleHQpIGFzIFVzZXJSZXNwb25zZTtcclxuICAgIH1cclxufSJdfQ==
