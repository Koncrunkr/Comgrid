(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"../util/Constants":3,"../util/HttpClient":4,"../util/request/UserInfoRequest":5}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HttpClient_1 = require("./util/HttpClient");
var UserInfoRequest_1 = require("./util/request/UserInfoRequest");
var State_1 = require("./authorization/State");
var info = {
    userId: ''
};
window.onload = function () {
    var signIn = document.getElementById('sign-in');
    signIn.onclick = function () {
        (0, State_1.getState)().whenReady().then(function (state) { return state.authorize(); });
        return false;
    };
    var signUp = document.getElementById('sign-up');
    signUp.onclick = function () {
        (0, State_1.getState)().whenReady().then(function (state) { return state.authorize(); });
        return false;
    };
    (0, State_1.getState)().whenReady().then(function (state) {
        if (state.authorized) {
            $('.clickable').toggleClass('d-none');
            (0, HttpClient_1.getHttpClient)().proceedRequest(new UserInfoRequest_1.UserInfoRequest({ includeChats: false })).then(function (response) {
                $('#id-keeper').text("id: ".concat(response.id));
                localStorage.setItem("userId", response.id);
            });
        }
    });
};

},{"./authorization/State":1,"./util/HttpClient":4,"./util/request/UserInfoRequest":5}],3:[function(require,module,exports){
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

},{"../authorization/State":1,"./Constants":3}],5:[function(require,module,exports){
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

},{"../HttpClient":4}]},{},[2]);
