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
        this._authorized = false;
        this.isLoading = false;
        this.token = localStorage.getItem("token");
        this.checker = this.checkToken();
    }
    Object.defineProperty(State.prototype, "authorized", {
        get: function () {
            return this._authorized;
        },
        enumerable: false,
        configurable: true
    });
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
                        if (this._authorized) {
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
                                _this._authorized = true;
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
                                this._authorized = true;
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
        this._authorized = false;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJUU2NyaXB0L2F1dGhvcml6YXRpb24vTG9naW5QYWdlLnRzIiwiVFNjcmlwdC9hdXRob3JpemF0aW9uL1N0YXRlLnRzIiwiVFNjcmlwdC91dGlsL0NvbnN0YW50cy50cyIsIlRTY3JpcHQvdXRpbC9IdHRwQ2xpZW50LnRzIiwiVFNjcmlwdC91dGlsL3JlcXVlc3QvVXNlckluZm9SZXF1ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNDQSxpQ0FBaUU7QUFHakUsTUFBTSxDQUFDLE1BQU0sR0FBRztJQUNkLElBQU0sTUFBTSxHQUFHLElBQUksZUFBZSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUE7SUFFMUQsSUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUVqQyxJQUFHLENBQUMsS0FBSyxFQUFDO1FBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQywyREFBMkQsQ0FBQyxDQUFDO1FBQ3pFLDJEQUEyRDtRQUMzRCxrR0FBa0c7S0FDbkc7SUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixHQUFHLEtBQUssQ0FBQyxDQUFBO0lBRTVDLElBQUEsZ0JBQVEsR0FBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFDLEtBQUssSUFBSyxPQUFBLEtBQUssQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEVBQTNCLENBQTJCLENBQUMsQ0FBQTtBQUNyRSxDQUFDLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaEJELCtDQUFrRztBQUNsRyxpREFBK0Q7QUFDL0QsbUVBQWtFO0FBR2xFO0lBQUE7SUFPQSxDQUFDO0lBQUQsV0FBQztBQUFELENBUEEsQUFPQyxJQUFBO0FBUFksb0JBQUk7QUFTSixRQUFBLHFCQUFxQixHQUFHO0lBQ25DLE1BQU0sRUFBRSww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QVUsQ0FBQyxZQUFZLDBDQUFFLFFBQVEsRUFBRSxDQUFBO1FBRTdELElBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFBO0lBQzVCLENBQUM7SUFLSyx3Q0FBYyxHQUFwQixVQUFxQixRQUFrQjs7Ozs7NEJBQ3RCLHFCQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBQTs7d0JBQTVCLElBQUksR0FBRyxTQUFxQjt3QkFDbEMsc0JBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQWlCLEVBQUM7Ozs7S0FDM0M7SUFDTCxzQkFBQztBQUFELENBbEJBLEFBa0JDLElBQUE7QUFsQlksMENBQWUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgeyBhdXRob3JpemF0aW9uUmVkaXJlY3RVcmkgfSBmcm9tIFwiLi4vdXRpbC9Db25zdGFudHNcIjtcclxuaW1wb3J0IHsgQXV0aG9yaXphdGlvblByb3ZpZGVyLCBnZXRTdGF0ZSwgU3RhdGUgfSBmcm9tIFwiLi9TdGF0ZVwiO1xyXG5cclxuXHJcbndpbmRvdy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKVxyXG5cclxuICBjb25zdCB0b2tlbiA9IHBhcmFtcy5nZXQoXCJ0b2tlblwiKVxyXG5cclxuICBpZighdG9rZW4pe1xyXG4gICAgY29uc29sZS5sb2coXCJDb3VsZG4ndCBhdXRob3JpemUgdXNlciwgYmVjYXVzZSB0aGVyZSB3YXMgbm8gdG9rZW4gcGFyYW1cIik7XHJcbiAgICAvLyB3aW5kb3cubG9jYXRpb24uaHJlZiA9IEF1dGhvcml6YXRpb25Qcm92aWRlcltwcm92aWRlcl0gK1xyXG4gICAgLy8gICBlbmNvZGVVUklDb21wb25lbnQobmV3IFVSTFNlYXJjaFBhcmFtcyh7XCJyZWRpcmVjdFVyaVwiOiBhdXRob3JpemF0aW9uUmVkaXJlY3RVcml9KS50b1N0cmluZygpKVxyXG4gIH1cclxuICBjb25zb2xlLmxvZyhcIlRva2VuIGdvdCBmcm9tIGF1dGg6IFwiICsgdG9rZW4pXHJcblxyXG4gIGdldFN0YXRlKCkud2hlblJlYWR5KCkudGhlbigoc3RhdGUpID0+IHN0YXRlLmFmdGVyQXV0aG9yaXplKHRva2VuKSlcclxufSIsImltcG9ydCB7IFRhYmxlUmVzcG9uc2UgfSBmcm9tIFwiLi4vdXRpbC9yZXF1ZXN0L0NyZWF0ZVRhYmxlUmVxdWVzdFwiO1xyXG5pbXBvcnQgeyBhcGlMaW5rLCBhdXRob3JpemF0aW9uUmVkaXJlY3RVcmksIGdvb2dsZUxvZ2luVXJpLCB2a0xvZ2luVXJpIH0gZnJvbSBcIi4uL3V0aWwvQ29uc3RhbnRzXCI7XHJcbmltcG9ydCB7IGdldEh0dHBDbGllbnQsIEh0dHBDbGllbnQgfSBmcm9tIFwiLi4vdXRpbC9IdHRwQ2xpZW50XCI7XHJcbmltcG9ydCB7IFVzZXJJbmZvUmVxdWVzdCB9IGZyb20gXCIuLi91dGlsL3JlcXVlc3QvVXNlckluZm9SZXF1ZXN0XCI7XHJcbmltcG9ydCB7IElzTG9nZ2VkSW5SZXF1ZXN0IH0gZnJvbSBcIi4uL3V0aWwvcmVxdWVzdC9Jc0xvZ2dlZEluUmVxdWVzdFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFVzZXIge1xyXG4gIHJlYWRvbmx5IGlkITogc3RyaW5nXHJcbiAgcmVhZG9ubHkgbmFtZSE6IHN0cmluZ1xyXG4gIHJlYWRvbmx5IGVtYWlsPzogc3RyaW5nXHJcbiAgcmVhZG9ubHkgYXZhdGFyITogc3RyaW5nXHJcbiAgcmVhZG9ubHkgY3JlYXRlZCE6IERhdGVcclxuICByZWFkb25seSBjaGF0cz86IFRhYmxlUmVzcG9uc2VbXVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgQXV0aG9yaXphdGlvblByb3ZpZGVyID0ge1xyXG4gIGdvb2dsZTogZ29vZ2xlTG9naW5VcmksXHJcbiAgdms6IHZrTG9naW5VcmksXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTdGF0ZSB7XHJcbiAgZ2V0IGF1dGhvcml6ZWQoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5fYXV0aG9yaXplZDtcclxuICB9XHJcbiAgcHJpdmF0ZSByZWFkb25seSBjaGVja2VyOiBQcm9taXNlPGJvb2xlYW4+XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ0b2tlblwiKVxyXG4gICAgdGhpcy5jaGVja2VyID0gdGhpcy5jaGVja1Rva2VuKClcclxuICB9XHJcblxyXG4gIHdoZW5SZWFkeSgpOiBQcm9taXNlPFN0YXRlPntcclxuICAgIHJldHVybiB0aGlzLmNoZWNrZXIudGhlbigoKSA9PiB0aGlzKVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjdXJyZW50VXNlcj86IFVzZXJcclxuICBwcml2YXRlIHRva2VuPzogc3RyaW5nXHJcbiAgcHJpdmF0ZSBfYXV0aG9yaXplZDogYm9vbGVhbiA9IGZhbHNlXHJcbiAgcHJpdmF0ZSBpc0xvYWRpbmc6IGJvb2xlYW4gPSBmYWxzZVxyXG5cclxuICBhc3luYyBhdXRob3JpemUocmVkaXJlY3RVcmk/OiBzdHJpbmcsIHByb3ZpZGVyPzoga2V5b2YgdHlwZW9mIEF1dGhvcml6YXRpb25Qcm92aWRlcikge1xyXG4gICAgaWYodGhpcy5fYXV0aG9yaXplZCl7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIGlmKGF3YWl0IHRoaXMuY2hlY2tUb2tlbigpKVxyXG4gICAgICByZXR1cm47XHJcblxyXG4gICAgaWYoIXJlZGlyZWN0VXJpKVxyXG4gICAgICByZWRpcmVjdFVyaSA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXHJcblxyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJyZWRpcmVjdEFmdGVyQXV0aG9yaXphdGlvblVyaVwiLCByZWRpcmVjdFVyaSlcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwicHJvdmlkZXJcIiwgcHJvdmlkZXIpXHJcblxyXG4gICAgaWYoIXByb3ZpZGVyKVxyXG4gICAgICBwcm92aWRlciA9IFwiZ29vZ2xlXCJcclxuXHJcbiAgICB0aGlzLmlzTG9hZGluZyA9IHRydWVcclxuICAgIGNvbnN0IGF1dGhvcml6ZUxpbmsgPSBBdXRob3JpemF0aW9uUHJvdmlkZXJbcHJvdmlkZXJdICsgXCI/XCIgK1xyXG4gICAgICBuZXcgVVJMU2VhcmNoUGFyYW1zKHtcInJlZGlyZWN0X3VyaVwiOiBhdXRob3JpemF0aW9uUmVkaXJlY3RVcml9KS50b1N0cmluZygpO1xyXG4gICAgY29uc29sZS5sb2coYXV0aG9yaXplTGluaylcclxuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gYXV0aG9yaXplTGlua1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgYWZ0ZXJBdXRob3JpemUodG9rZW46IHN0cmluZykge1xyXG4gICAgaWYoIXRoaXMuaXNMb2FkaW5nKVxyXG4gICAgICB0aGlzLmlzTG9hZGluZyA9IHRydWVcclxuICAgIHRoaXMudG9rZW4gPSB0b2tlblxyXG4gICAgY29uc3QgaHR0cENsaWVudCA9IGdldEh0dHBDbGllbnQoKTtcclxuICAgIGF3YWl0IGh0dHBDbGllbnQucHJvY2VlZFJlcXVlc3QoXHJcbiAgICAgIG5ldyBVc2VySW5mb1JlcXVlc3Qoe30pLFxyXG4gICAgICBjb2RlID0+IHtcclxuICAgICAgICBpZihjb2RlID09PSA0MDEpe1xyXG4gICAgICAgICAgY29uc29sZS5sb2coXCJVc2VyIGlzIG5vdCBhdXRob3JpemVkIGFmdGVyIGFza2luZ1wiKVxyXG4gICAgICAgICAgdGhpcy5yZXZva2VBdXRob3JpemF0aW9uKClcclxuICAgICAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2VcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICkudGhlbih1c2VyID0+IHtcclxuICAgICAgdGhpcy5jdXJyZW50VXNlciA9IHVzZXJcclxuICAgICAgdGhpcy50b2tlbiA9IHRva2VuXHJcbiAgICAgIHRoaXMuX2F1dGhvcml6ZWQgPSB0cnVlXHJcbiAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2VcclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ1c2VySWRcIiwgdXNlci5pZClcclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ0b2tlblwiLCB0b2tlbilcclxuICAgICAgY29uc3QgcmVkaXJlY3QgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInJlZGlyZWN0QWZ0ZXJBdXRob3JpemF0aW9uVXJpXCIpO1xyXG4gICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcInJlZGlyZWN0QWZ0ZXJBdXRob3JpemF0aW9uVXJpXCIpXHJcbiAgICAgIGNvbnNvbGUubG9nKFwiQXV0aGVkIHVzZXI6IFwiKVxyXG4gICAgICBjb25zb2xlLmxvZyh1c2VyKVxyXG4gICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZShyZWRpcmVjdClcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIGNoZWNrVG9rZW4oKTogUHJvbWlzZTxib29sZWFuPntcclxuICAgIGNvbnN0IGh0dHBDbGllbnQgPSBnZXRIdHRwQ2xpZW50KCk7XHJcbiAgICBpZighdGhpcy50b2tlbilcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgZmV0Y2goXHJcbiAgICAgIGFwaUxpbmsgKyBcIi91c2VyL2luZm9cIixcclxuICAgICAge1xyXG4gICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICBcIkNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgIFwiQXV0aG9yaXphdGlvblwiOiBcIkJlYXJlciBcIiArIHRoaXMudG9rZW5cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICkudGhlbihhc3luYyAocmVzcG9uc2UpID0+IHtcclxuICAgICAgaWYocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApe1xyXG4gICAgICAgIHRoaXMuY3VycmVudFVzZXIgPSBKU09OLnBhcnNlKGF3YWl0IHJlc3BvbnNlLnRleHQoKSlcclxuICAgICAgICB0aGlzLl9hdXRob3JpemVkID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2VcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInVzZXJJZFwiLCB0aGlzLmN1cnJlbnRVc2VyLmlkKVxyXG4gICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJVc2VyIGlzIG5vdCBhdXRob3JpemVkXCIpXHJcbiAgICAgICAgdGhpcy5yZXZva2VBdXRob3JpemF0aW9uKClcclxuICAgICAgICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldEF1dGhvcml6YXRpb25IZWFkZXIoKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPntcclxuICAgIHJldHVybiB7XHJcbiAgICAgIFwiQXV0aG9yaXphdGlvblwiOiBcIkJlYXJlciBcIiArIHRoaXMudG9rZW5cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldm9rZUF1dGhvcml6YXRpb24oKXtcclxuICAgIHRoaXMuX2F1dGhvcml6ZWQgPSBmYWxzZVxyXG4gICAgdGhpcy5jdXJyZW50VXNlciA9IG51bGxcclxuICAgIHRoaXMudG9rZW4gPSBudWxsXHJcbiAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcInVzZXJJZFwiKVxyXG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJ0b2tlblwiKVxyXG4gIH1cclxufVxyXG5cclxubGV0IHN0YXRlOiBTdGF0ZTtcclxuZXhwb3J0IGZ1bmN0aW9uIGdldFN0YXRlKCk6IFN0YXRle1xyXG4gIGlmKCFzdGF0ZSlcclxuICAgIHN0YXRlID0gbmV3IFN0YXRlKCk7XHJcbiAgcmV0dXJuIHN0YXRlXHJcbn0iLCJcclxuXHJcbmV4cG9ydCBjb25zdCBhcGlMaW5rID0gXCJodHRwczovL2NvbWdyaWQucnU6ODQ0M1wiXHJcbmV4cG9ydCBjb25zdCB2a0xvZ2luVXJpID0gYXBpTGluayArIFwiL29hdXRoMi9hdXRob3JpemUvdmtcIlxyXG5leHBvcnQgY29uc3QgZ29vZ2xlTG9naW5VcmkgPSBhcGlMaW5rICsgXCIvb2F1dGgyL2F1dGhvcml6ZS9nb29nbGVcIlxyXG5cclxuZXhwb3J0IGNvbnN0IGF1dGhvcml6YXRpb25SZWRpcmVjdFVyaSA9IFwiaHR0cHM6Ly9jb21ncmlkLnJ1L3BhZ2VzL2xvZ2luLmh0bWxcIiIsImltcG9ydCB7UmVxdWVzdFdyYXBwZXJ9IGZyb20gXCIuL3JlcXVlc3QvUmVxdWVzdFwiO1xyXG5pbXBvcnQgeyBnZXRTdGF0ZSwgU3RhdGUgfSBmcm9tIFwiLi4vYXV0aG9yaXphdGlvbi9TdGF0ZVwiO1xyXG5pbXBvcnQgeyBhcGlMaW5rIH0gZnJvbSBcIi4vQ29uc3RhbnRzXCI7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEh0dHBDbGllbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBhcGlMaW5rOiBzdHJpbmcpIHt9XHJcblxyXG4gICAgYXN5bmMgcHJvY2VlZFJlcXVlc3Q8VD4oXHJcbiAgICAgICAgcmVxdWVzdDogUmVxdWVzdFdyYXBwZXI8VD4sXHJcbiAgICAgICAgb25GYWlsdXJlOiAoY29kZTogbnVtYmVyLCBlcnJvclRleHQ6IHN0cmluZykgPT4gdW5rbm93biA9XHJcbiAgICAgICAgICAgIChjb2RlLCBlcnJvclRleHQpID0+IGFsZXJ0KGBjb2RlOiAke2NvZGV9LCBlcnJvcjogJHtlcnJvclRleHR9YCksXHJcbiAgICAgICAgb25OZXR3b3JrRmFpbHVyZTogKHJlYXNvbikgPT4gdW5rbm93biA9XHJcbiAgICAgICAgICAgIChyZWFzb24pID0+IGFsZXJ0KGBuZXR3b3JrIGVycm9yOiAke3JlYXNvbn1gKVxyXG4gICAgKTogUHJvbWlzZTxUPntcclxuICAgICAgICBjb25zdCBmaW5hbExpbmsgPSBuZXcgVVJMKHRoaXMuYXBpTGluayArIHJlcXVlc3QuZW5kcG9pbnQpXHJcbiAgICAgICAgaWYocmVxdWVzdC5wYXJhbWV0ZXJzICE9IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgZmluYWxMaW5rLnNlYXJjaCA9IG5ldyBVUkxTZWFyY2hQYXJhbXMocmVxdWVzdC5wYXJhbWV0ZXJzKS50b1N0cmluZygpXHJcblxyXG4gICAgICAgIGxldCBoZWFkZXJzID0ge1xyXG4gICAgICAgICAgICAuLi5yZXF1ZXN0LmhlYWRlcnMsXHJcbiAgICAgICAgICAgIC4uLihhd2FpdCBnZXRTdGF0ZSgpLndoZW5SZWFkeSgpKS5nZXRBdXRob3JpemF0aW9uSGVhZGVyKClcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5sb2coey4uLnJlcXVlc3QsIGhlYWRlcnM6IGhlYWRlcnN9KVxyXG4gICAgICAgIHJldHVybiBmZXRjaChcclxuICAgICAgICAgICAgZmluYWxMaW5rLnRvU3RyaW5nKCksXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogcmVxdWVzdC5tZXRob2RUeXBlLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyczogaGVhZGVycyxcclxuICAgICAgICAgICAgICAgIGJvZHk6IHJlcXVlc3QuYm9keVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKS50aGVuKGFzeW5jIChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICBpZihyZXNwb25zZS5zdGF0dXMgPT09IDIwMCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wcm9jZWVkUmVxdWVzdChyZXNwb25zZSlcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlcnJvclRleHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XHJcbiAgICAgICAgICAgICAgICBvbkZhaWx1cmUocmVzcG9uc2Uuc3RhdHVzLCBlcnJvclRleHQpO1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihlcnJvclRleHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxufVxyXG5cclxubGV0IGh0dHBDbGllbnQ6IEh0dHBDbGllbnQ7XHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRIdHRwQ2xpZW50KCk6IEh0dHBDbGllbnR7XHJcbiAgICBpZighaHR0cENsaWVudClcclxuICAgICAgICBodHRwQ2xpZW50ID0gbmV3IEh0dHBDbGllbnQoYXBpTGluaylcclxuICAgIHJldHVybiBodHRwQ2xpZW50XHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIE1ldGhvZFR5cGV7XHJcbiAgICBQT1NUPVwiUE9TVFwiLFxyXG4gICAgR0VUPVwiR0VUXCIsXHJcbiAgICBQQVRDSD1cIlBBVENIXCIsXHJcbiAgICBQVVQ9XCJQVVRcIixcclxuICAgIERFTEVURT1cIkRFTEVURVwiXHJcbn0iLCJpbXBvcnQge1JlcXVlc3RXcmFwcGVyfSBmcm9tIFwiLi9SZXF1ZXN0XCI7XHJcbmltcG9ydCB7VGFibGVSZXNwb25zZX0gZnJvbSBcIi4vQ3JlYXRlVGFibGVSZXF1ZXN0XCI7XHJcbmltcG9ydCB7TWV0aG9kVHlwZX0gZnJvbSBcIi4uL0h0dHBDbGllbnRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBVc2VyUmVzcG9uc2V7XHJcbiAgICByZWFkb25seSBpZCE6IHN0cmluZ1xyXG4gICAgcmVhZG9ubHkgbmFtZSE6IHN0cmluZ1xyXG4gICAgcmVhZG9ubHkgZW1haWw/OiBzdHJpbmdcclxuICAgIHJlYWRvbmx5IGF2YXRhciE6IHN0cmluZ1xyXG4gICAgcmVhZG9ubHkgY3JlYXRlZCE6IERhdGVcclxuICAgIHJlYWRvbmx5IGNoYXRzPzogVGFibGVSZXNwb25zZVtdXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBVc2VySW5mb1JlcXVlc3QgaW1wbGVtZW50cyBSZXF1ZXN0V3JhcHBlcjxVc2VyUmVzcG9uc2U+e1xyXG4gICAgcmVhZG9ubHkgcGFyYW1ldGVyczogUmVjb3JkPHN0cmluZywgc3RyaW5nPlxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBhcmFtZXRlcnM6IHsgaW5jbHVkZUNoYXRzPzogYm9vbGVhbiB9KSB7XHJcbiAgICAgICAgbGV0IHBhcmFtczogYW55ID0ge31cclxuICAgICAgICBpZihwYXJhbWV0ZXJzLmluY2x1ZGVDaGF0cylcclxuICAgICAgICAgICAgcGFyYW1zLmluY2x1ZGVDaGF0cyA9IHBhcmFtZXRlcnMuaW5jbHVkZUNoYXRzPy50b1N0cmluZygpXHJcblxyXG4gICAgICAgIHRoaXMucGFyYW1ldGVycyA9IHBhcmFtc1xyXG4gICAgfVxyXG5cclxuICAgIHJlYWRvbmx5IGVuZHBvaW50OiBzdHJpbmcgPSBcIi91c2VyL2luZm9cIjtcclxuICAgIHJlYWRvbmx5IG1ldGhvZFR5cGU6IE1ldGhvZFR5cGUgPSBNZXRob2RUeXBlLkdFVDtcclxuXHJcbiAgICBhc3luYyBwcm9jZWVkUmVxdWVzdChyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPFVzZXJSZXNwb25zZT4ge1xyXG4gICAgICAgIGNvbnN0IHRleHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XHJcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodGV4dCkgYXMgVXNlclJlc3BvbnNlO1xyXG4gICAgfVxyXG59Il19
