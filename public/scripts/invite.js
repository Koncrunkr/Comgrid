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
},{"../util/Constants":3,"../util/HttpClient":4,"../util/request/UserInfoRequest":8}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HttpClient_1 = require("./util/HttpClient");
var IsLoggedInRequest_1 = require("./util/request/IsLoggedInRequest");
var PostLinkRequest_1 = require("./util/request/PostLinkRequest");
var Util_1 = require("./util/Util");
window.onload = function () {
    var http = (0, HttpClient_1.getHttpClient)();
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
},{"./util/HttpClient":4,"./util/Util":5,"./util/request/IsLoggedInRequest":6,"./util/request/PostLinkRequest":7}],3:[function(require,module,exports){
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParam = void 0;
function getParam(name) {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}
exports.getParam = getParam;
},{}],6:[function(require,module,exports){
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
},{"../HttpClient":4}],7:[function(require,module,exports){
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
},{"../HttpClient":4}],8:[function(require,module,exports){
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
},{"../HttpClient":4}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJUU2NyaXB0L2F1dGhvcml6YXRpb24vU3RhdGUudHMiLCJUU2NyaXB0L2ludml0ZS50cyIsIlRTY3JpcHQvdXRpbC9Db25zdGFudHMudHMiLCJUU2NyaXB0L3V0aWwvSHR0cENsaWVudC50cyIsIlRTY3JpcHQvdXRpbC9VdGlsLnRzIiwiVFNjcmlwdC91dGlsL3JlcXVlc3QvSXNMb2dnZWRJblJlcXVlc3QudHMiLCJUU2NyaXB0L3V0aWwvcmVxdWVzdC9Qb3N0TGlua1JlcXVlc3QudHMiLCJUU2NyaXB0L3V0aWwvcmVxdWVzdC9Vc2VySW5mb1JlcXVlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNDQSwrQ0FBa0c7QUFDbEcsaURBQStEO0FBQy9ELG1FQUFrRTtBQUdsRTtJQUFBO0lBT0EsQ0FBQztJQUFELFdBQUM7QUFBRCxDQVBBLEFBT0MsSUFBQTtBQVBZLG9CQUFJO0FBU0osUUFBQSxxQkFBcUIsR0FBRztJQUNuQyxNQUFNLEVBQUUsMEJBQWM7SUFDdEIsRUFBRSxFQUFFLHNCQUFVO0NBQ2YsQ0FBQTtBQUVEO0lBS0U7UUFXUSxnQkFBVyxHQUFZLEtBQUssQ0FBQTtRQUM1QixjQUFTLEdBQVksS0FBSyxDQUFBO1FBWGhDLElBQUksQ0FBQyxLQUFLLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUMxQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQTtJQUNsQyxDQUFDO0lBUEQsc0JBQUksNkJBQVU7YUFBZDtZQUNFLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUMxQixDQUFDOzs7T0FBQTtJQU9ELHlCQUFTLEdBQVQ7UUFBQSxpQkFFQztRQURDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBTSxPQUFB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Q0FBQyxZQUFZLEdBQUcsTUFBQSxVQUFVLENBQUMsWUFBWSwwQ0FBRSxRQUFRLEVBQUUsQ0FBQTtRQUU3RCxJQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQTtJQUM1QixDQUFDO0lBS0ssd0NBQWMsR0FBcEIsVUFBcUIsUUFBa0I7Ozs7OzRCQUN0QixxQkFBTSxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUE7O3dCQUE1QixJQUFJLEdBQUcsU0FBcUI7d0JBQ2xDLHNCQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFpQixFQUFDOzs7O0tBQzNDO0lBQ0wsc0JBQUM7QUFBRCxDQWxCQSxBQWtCQyxJQUFBO0FBbEJZLDBDQUFlIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IHsgVGFibGVSZXNwb25zZSB9IGZyb20gXCIuLi91dGlsL3JlcXVlc3QvQ3JlYXRlVGFibGVSZXF1ZXN0XCI7XHJcbmltcG9ydCB7IGFwaUxpbmssIGF1dGhvcml6YXRpb25SZWRpcmVjdFVyaSwgZ29vZ2xlTG9naW5VcmksIHZrTG9naW5VcmkgfSBmcm9tIFwiLi4vdXRpbC9Db25zdGFudHNcIjtcclxuaW1wb3J0IHsgZ2V0SHR0cENsaWVudCwgSHR0cENsaWVudCB9IGZyb20gXCIuLi91dGlsL0h0dHBDbGllbnRcIjtcclxuaW1wb3J0IHsgVXNlckluZm9SZXF1ZXN0IH0gZnJvbSBcIi4uL3V0aWwvcmVxdWVzdC9Vc2VySW5mb1JlcXVlc3RcIjtcclxuaW1wb3J0IHsgSXNMb2dnZWRJblJlcXVlc3QgfSBmcm9tIFwiLi4vdXRpbC9yZXF1ZXN0L0lzTG9nZ2VkSW5SZXF1ZXN0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVXNlciB7XHJcbiAgcmVhZG9ubHkgaWQhOiBzdHJpbmdcclxuICByZWFkb25seSBuYW1lITogc3RyaW5nXHJcbiAgcmVhZG9ubHkgZW1haWw/OiBzdHJpbmdcclxuICByZWFkb25seSBhdmF0YXIhOiBzdHJpbmdcclxuICByZWFkb25seSBjcmVhdGVkITogRGF0ZVxyXG4gIHJlYWRvbmx5IGNoYXRzPzogVGFibGVSZXNwb25zZVtdXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBBdXRob3JpemF0aW9uUHJvdmlkZXIgPSB7XHJcbiAgZ29vZ2xlOiBnb29nbGVMb2dpblVyaSxcclxuICB2azogdmtMb2dpblVyaSxcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFN0YXRlIHtcclxuICBnZXQgYXV0aG9yaXplZCgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLl9hdXRob3JpemVkO1xyXG4gIH1cclxuICBwcml2YXRlIHJlYWRvbmx5IGNoZWNrZXI6IFByb21pc2U8Ym9vbGVhbj5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMudG9rZW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpXHJcbiAgICB0aGlzLmNoZWNrZXIgPSB0aGlzLmNoZWNrVG9rZW4oKVxyXG4gIH1cclxuXHJcbiAgd2hlblJlYWR5KCk6IFByb21pc2U8U3RhdGU+e1xyXG4gICAgcmV0dXJuIHRoaXMuY2hlY2tlci50aGVuKCgpID0+IHRoaXMpXHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGN1cnJlbnRVc2VyPzogVXNlclxyXG4gIHByaXZhdGUgdG9rZW4/OiBzdHJpbmdcclxuICBwcml2YXRlIF9hdXRob3JpemVkOiBib29sZWFuID0gZmFsc2VcclxuICBwcml2YXRlIGlzTG9hZGluZzogYm9vbGVhbiA9IGZhbHNlXHJcblxyXG4gIGFzeW5jIGF1dGhvcml6ZShyZWRpcmVjdFVyaT86IHN0cmluZywgcHJvdmlkZXI/OiBrZXlvZiB0eXBlb2YgQXV0aG9yaXphdGlvblByb3ZpZGVyKSB7XHJcbiAgICBpZih0aGlzLl9hdXRob3JpemVkKXtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgaWYoYXdhaXQgdGhpcy5jaGVja1Rva2VuKCkpXHJcbiAgICAgIHJldHVybjtcclxuXHJcbiAgICBpZighcmVkaXJlY3RVcmkpXHJcbiAgICAgIHJlZGlyZWN0VXJpID0gd2luZG93LmxvY2F0aW9uLmhyZWZcclxuXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInJlZGlyZWN0QWZ0ZXJBdXRob3JpemF0aW9uVXJpXCIsIHJlZGlyZWN0VXJpKVxyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJwcm92aWRlclwiLCBwcm92aWRlcilcclxuXHJcbiAgICBpZighcHJvdmlkZXIpXHJcbiAgICAgIHByb3ZpZGVyID0gXCJnb29nbGVcIlxyXG5cclxuICAgIHRoaXMuaXNMb2FkaW5nID0gdHJ1ZVxyXG4gICAgY29uc3QgYXV0aG9yaXplTGluayA9IEF1dGhvcml6YXRpb25Qcm92aWRlcltwcm92aWRlcl0gKyBcIj9cIiArXHJcbiAgICAgIG5ldyBVUkxTZWFyY2hQYXJhbXMoe1wicmVkaXJlY3RfdXJpXCI6IGF1dGhvcml6YXRpb25SZWRpcmVjdFVyaX0pLnRvU3RyaW5nKCk7XHJcbiAgICBjb25zb2xlLmxvZyhhdXRob3JpemVMaW5rKVxyXG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBhdXRob3JpemVMaW5rXHJcbiAgfVxyXG5cclxuICBhc3luYyBhZnRlckF1dGhvcml6ZSh0b2tlbjogc3RyaW5nKSB7XHJcbiAgICBpZighdGhpcy5pc0xvYWRpbmcpXHJcbiAgICAgIHRoaXMuaXNMb2FkaW5nID0gdHJ1ZVxyXG4gICAgdGhpcy50b2tlbiA9IHRva2VuXHJcbiAgICBjb25zdCBodHRwQ2xpZW50ID0gZ2V0SHR0cENsaWVudCgpO1xyXG4gICAgYXdhaXQgaHR0cENsaWVudC5wcm9jZWVkUmVxdWVzdChcclxuICAgICAgbmV3IFVzZXJJbmZvUmVxdWVzdCh7fSksXHJcbiAgICAgIGNvZGUgPT4ge1xyXG4gICAgICAgIGlmKGNvZGUgPT09IDQwMSl7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIlVzZXIgaXMgbm90IGF1dGhvcml6ZWQgYWZ0ZXIgYXNraW5nXCIpXHJcbiAgICAgICAgICB0aGlzLnJldm9rZUF1dGhvcml6YXRpb24oKVxyXG4gICAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgKS50aGVuKHVzZXIgPT4ge1xyXG4gICAgICB0aGlzLmN1cnJlbnRVc2VyID0gdXNlclxyXG4gICAgICB0aGlzLnRva2VuID0gdG9rZW5cclxuICAgICAgdGhpcy5fYXV0aG9yaXplZCA9IHRydWVcclxuICAgICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZVxyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInVzZXJJZFwiLCB1c2VyLmlkKVxyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInRva2VuXCIsIHRva2VuKVxyXG4gICAgICBjb25zdCByZWRpcmVjdCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwicmVkaXJlY3RBZnRlckF1dGhvcml6YXRpb25VcmlcIik7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwicmVkaXJlY3RBZnRlckF1dGhvcml6YXRpb25VcmlcIilcclxuICAgICAgY29uc29sZS5sb2coXCJBdXRoZWQgdXNlcjogXCIpXHJcbiAgICAgIGNvbnNvbGUubG9nKHVzZXIpXHJcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKHJlZGlyZWN0KVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXN5bmMgY2hlY2tUb2tlbigpOiBQcm9taXNlPGJvb2xlYW4+e1xyXG4gICAgY29uc3QgaHR0cENsaWVudCA9IGdldEh0dHBDbGllbnQoKTtcclxuICAgIGlmKCF0aGlzLnRva2VuKVxyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICBmZXRjaChcclxuICAgICAgYXBpTGluayArIFwiL3VzZXIvaW5mb1wiLFxyXG4gICAgICB7XHJcbiAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgIFwiQ29udGVudC10eXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgXCJBdXRob3JpemF0aW9uXCI6IFwiQmVhcmVyIFwiICsgdGhpcy50b2tlblxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgKS50aGVuKGFzeW5jIChyZXNwb25zZSkgPT4ge1xyXG4gICAgICBpZihyZXNwb25zZS5zdGF0dXMgPT09IDIwMCl7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50VXNlciA9IEpTT04ucGFyc2UoYXdhaXQgcmVzcG9uc2UudGV4dCgpKVxyXG4gICAgICAgIHRoaXMuX2F1dGhvcml6ZWQgPSB0cnVlXHJcbiAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZVxyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidXNlcklkXCIsIHRoaXMuY3VycmVudFVzZXIuaWQpXHJcbiAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlVzZXIgaXMgbm90IGF1dGhvcml6ZWRcIilcclxuICAgICAgICB0aGlzLnJldm9rZUF1dGhvcml6YXRpb24oKVxyXG4gICAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2VcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0QXV0aG9yaXphdGlvbkhlYWRlcigpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+e1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgXCJBdXRob3JpemF0aW9uXCI6IFwiQmVhcmVyIFwiICsgdGhpcy50b2tlblxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV2b2tlQXV0aG9yaXphdGlvbigpe1xyXG4gICAgdGhpcy5fYXV0aG9yaXplZCA9IGZhbHNlXHJcbiAgICB0aGlzLmN1cnJlbnRVc2VyID0gbnVsbFxyXG4gICAgdGhpcy50b2tlbiA9IG51bGxcclxuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwidXNlcklkXCIpXHJcbiAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcInRva2VuXCIpXHJcbiAgfVxyXG59XHJcblxyXG5sZXQgc3RhdGU6IFN0YXRlO1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3RhdGUoKTogU3RhdGV7XHJcbiAgaWYoIXN0YXRlKVxyXG4gICAgc3RhdGUgPSBuZXcgU3RhdGUoKTtcclxuICByZXR1cm4gc3RhdGVcclxufSIsImltcG9ydCB7IGdldEh0dHBDbGllbnQsIEh0dHBDbGllbnQgfSBmcm9tIFwiLi91dGlsL0h0dHBDbGllbnRcIjtcclxuaW1wb3J0IHtJc0xvZ2dlZEluUmVxdWVzdH0gZnJvbSBcIi4vdXRpbC9yZXF1ZXN0L0lzTG9nZ2VkSW5SZXF1ZXN0XCI7XHJcbmltcG9ydCB7UG9zdExpbmtSZXF1ZXN0fSBmcm9tIFwiLi91dGlsL3JlcXVlc3QvUG9zdExpbmtSZXF1ZXN0XCI7XHJcbmltcG9ydCB7Z2V0UGFyYW19IGZyb20gXCIuL3V0aWwvVXRpbFwiO1xyXG5cclxud2luZG93Lm9ubG9hZCA9ICgpID0+IHtcclxuICAgIGNvbnN0IGh0dHAgPSBnZXRIdHRwQ2xpZW50KCk7XHJcbiAgICBodHRwLnByb2NlZWRSZXF1ZXN0KFxyXG4gICAgICAgIG5ldyBJc0xvZ2dlZEluUmVxdWVzdCgpLFxyXG4gICAgICAgIChjb2RlLCBlcnIpID0+IHtcclxuICAgICAgICAgICAgaWYgKGNvZGUgPT09IDQwMSkge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCLQktGLINC90LUg0LLQvtGI0LvQuCDQsiDRgdC40YHRgtC10LzRgywg0LLQvtC50LTQuNGC0LUsINC/0L7QttCw0LvRg9C50YHRgtCwXCIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICAgICAgICAgICAgICBsaW5rLmhyZWYgPSBcImh0dHBzOi8vY29tZ3JpZC5ydVwiO1xyXG4gICAgICAgICAgICAgICAgbGluay5jbGljaygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGNvZGUsIGVycik7XHJcbiAgICAgICAgfVxyXG4gICAgKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICBpZiAocmVzcG9uc2UgPT09IDIwMCkge1xyXG4gICAgICAgICAgICBodHRwLnByb2NlZWRSZXF1ZXN0KFxyXG4gICAgICAgICAgICAgICAgbmV3IFBvc3RMaW5rUmVxdWVzdCh7IGNvZGU6IGdldFBhcmFtKCdjb2RlJykgfSksXHJcbiAgICAgICAgICAgICAgICAoY29kZSwgZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvZGUgPT09IDQyMikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGluay5ocmVmID0gXCJodHRwczovL2NvbWdyaWQucnUvcGFnZXMvdGFibGU/aWQ9XCIgKyBnZXRQYXJhbSgnY2hhdElkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmsuY2xpY2soKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBhbGVydChlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmsuaHJlZiA9IFwiaHR0cHM6Ly9jb21ncmlkLnJ1XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluay5jbGljaygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICAgICAgICAgICAgICBsaW5rLmhyZWYgPSBcImh0dHBzOi8vY29tZ3JpZC5ydS9wYWdlcy90YWJsZT9pZD1cIiArIGdldFBhcmFtKCdjaGF0SWQnKTtcclxuICAgICAgICAgICAgICAgIGxpbmsuY2xpY2soKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuXHJcbn0iLCJcclxuXHJcbmV4cG9ydCBjb25zdCBhcGlMaW5rID0gXCJodHRwczovL2NvbWdyaWQucnU6ODQ0M1wiXHJcbmV4cG9ydCBjb25zdCB2a0xvZ2luVXJpID0gYXBpTGluayArIFwiL29hdXRoMi9hdXRob3JpemUvdmtcIlxyXG5leHBvcnQgY29uc3QgZ29vZ2xlTG9naW5VcmkgPSBhcGlMaW5rICsgXCIvb2F1dGgyL2F1dGhvcml6ZS9nb29nbGVcIlxyXG5cclxuZXhwb3J0IGNvbnN0IGF1dGhvcml6YXRpb25SZWRpcmVjdFVyaSA9IFwiaHR0cHM6Ly9jb21ncmlkLnJ1L3BhZ2VzL2xvZ2luLmh0bWxcIiIsImltcG9ydCB7UmVxdWVzdFdyYXBwZXJ9IGZyb20gXCIuL3JlcXVlc3QvUmVxdWVzdFwiO1xyXG5pbXBvcnQgeyBnZXRTdGF0ZSwgU3RhdGUgfSBmcm9tIFwiLi4vYXV0aG9yaXphdGlvbi9TdGF0ZVwiO1xyXG5pbXBvcnQgeyBhcGlMaW5rIH0gZnJvbSBcIi4vQ29uc3RhbnRzXCI7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEh0dHBDbGllbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBhcGlMaW5rOiBzdHJpbmcpIHt9XHJcblxyXG4gICAgYXN5bmMgcHJvY2VlZFJlcXVlc3Q8VD4oXHJcbiAgICAgICAgcmVxdWVzdDogUmVxdWVzdFdyYXBwZXI8VD4sXHJcbiAgICAgICAgb25GYWlsdXJlOiAoY29kZTogbnVtYmVyLCBlcnJvclRleHQ6IHN0cmluZykgPT4gdW5rbm93biA9XHJcbiAgICAgICAgICAgIChjb2RlLCBlcnJvclRleHQpID0+IGFsZXJ0KGBjb2RlOiAke2NvZGV9LCBlcnJvcjogJHtlcnJvclRleHR9YCksXHJcbiAgICAgICAgb25OZXR3b3JrRmFpbHVyZTogKHJlYXNvbikgPT4gdW5rbm93biA9XHJcbiAgICAgICAgICAgIChyZWFzb24pID0+IGFsZXJ0KGBuZXR3b3JrIGVycm9yOiAke3JlYXNvbn1gKVxyXG4gICAgKTogUHJvbWlzZTxUPntcclxuICAgICAgICBjb25zdCBmaW5hbExpbmsgPSBuZXcgVVJMKHRoaXMuYXBpTGluayArIHJlcXVlc3QuZW5kcG9pbnQpXHJcbiAgICAgICAgaWYocmVxdWVzdC5wYXJhbWV0ZXJzICE9IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgZmluYWxMaW5rLnNlYXJjaCA9IG5ldyBVUkxTZWFyY2hQYXJhbXMocmVxdWVzdC5wYXJhbWV0ZXJzKS50b1N0cmluZygpXHJcblxyXG4gICAgICAgIGxldCBoZWFkZXJzID0ge1xyXG4gICAgICAgICAgICAuLi5yZXF1ZXN0LmhlYWRlcnMsXHJcbiAgICAgICAgICAgIC4uLihhd2FpdCBnZXRTdGF0ZSgpLndoZW5SZWFkeSgpKS5nZXRBdXRob3JpemF0aW9uSGVhZGVyKClcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5sb2coey4uLnJlcXVlc3QsIGhlYWRlcnM6IGhlYWRlcnN9KVxyXG4gICAgICAgIHJldHVybiBmZXRjaChcclxuICAgICAgICAgICAgZmluYWxMaW5rLnRvU3RyaW5nKCksXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogcmVxdWVzdC5tZXRob2RUeXBlLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyczogaGVhZGVycyxcclxuICAgICAgICAgICAgICAgIGJvZHk6IHJlcXVlc3QuYm9keVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKS50aGVuKGFzeW5jIChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICBpZihyZXNwb25zZS5zdGF0dXMgPT09IDIwMCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdC5wcm9jZWVkUmVxdWVzdChyZXNwb25zZSlcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlcnJvclRleHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XHJcbiAgICAgICAgICAgICAgICBvbkZhaWx1cmUocmVzcG9uc2Uuc3RhdHVzLCBlcnJvclRleHQpO1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihlcnJvclRleHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxufVxyXG5cclxubGV0IGh0dHBDbGllbnQ6IEh0dHBDbGllbnQ7XHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRIdHRwQ2xpZW50KCk6IEh0dHBDbGllbnR7XHJcbiAgICBpZighaHR0cENsaWVudClcclxuICAgICAgICBodHRwQ2xpZW50ID0gbmV3IEh0dHBDbGllbnQoYXBpTGluaylcclxuICAgIHJldHVybiBodHRwQ2xpZW50XHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIE1ldGhvZFR5cGV7XHJcbiAgICBQT1NUPVwiUE9TVFwiLFxyXG4gICAgR0VUPVwiR0VUXCIsXHJcbiAgICBQQVRDSD1cIlBBVENIXCIsXHJcbiAgICBQVVQ9XCJQVVRcIixcclxuICAgIERFTEVURT1cIkRFTEVURVwiXHJcbn0iLCJcclxuXHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFBhcmFtKG5hbWU6IHN0cmluZyk6IHN0cmluZ3tcclxuICBjb25zdCB1cmxQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpXHJcbiAgcmV0dXJuIHVybFBhcmFtcy5nZXQobmFtZSlcclxufSIsImltcG9ydCB7UmVxdWVzdFdyYXBwZXJ9IGZyb20gXCIuL1JlcXVlc3RcIjtcclxuaW1wb3J0IHtNZXRob2RUeXBlfSBmcm9tIFwiLi4vSHR0cENsaWVudFwiO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBJc0xvZ2dlZEluUmVxdWVzdCBpbXBsZW1lbnRzIFJlcXVlc3RXcmFwcGVyPG51bWJlcj57XHJcbiAgICByZWFkb25seSBlbmRwb2ludDogc3RyaW5nID0gJy91c2VyL2xvZ2luJztcclxuICAgIHJlYWRvbmx5IG1ldGhvZFR5cGU6IE1ldGhvZFR5cGUgPSBNZXRob2RUeXBlLkdFVDtcclxuXHJcbiAgICBhc3luYyBwcm9jZWVkUmVxdWVzdChyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPG51bWJlcj4ge1xyXG4gICAgICAgIHJldHVybiByZXNwb25zZS5zdGF0dXM7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQge01ldGhvZFR5cGV9IGZyb20gXCIuLi9IdHRwQ2xpZW50XCI7XHJcbmltcG9ydCB7UmVxdWVzdFdyYXBwZXJ9IGZyb20gXCIuL1JlcXVlc3RcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDaGF0SWRLZWVwZXIge1xyXG4gICAgY2hhdElkITogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUG9zdExpbmtSZXF1ZXN0IGltcGxlbWVudHMgUmVxdWVzdFdyYXBwZXI8Q2hhdElkS2VlcGVyPiB7XHJcbiAgICByZWFkb25seSBib2R5OiBhbnk7XHJcbiAgICBjb25zdHJ1Y3Rvcihib2R5OiB7IGNvZGU6IHN0cmluZyB9KSB7XHJcbiAgICAgICAgdGhpcy5ib2R5ID0gSlNPTi5zdHJpbmdpZnkoYm9keSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVhZG9ubHkgZW5kcG9pbnQ6IHN0cmluZyA9IFwiL3RhYmxlL2ludml0YXRpb25fbGlua1wiO1xyXG4gICAgcmVhZG9ubHkgaGVhZGVyczogSGVhZGVyc0luaXQgPSB7XHJcbiAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcclxuICAgIH07XHJcbiAgICByZWFkb25seSBtZXRob2RUeXBlOiBNZXRob2RUeXBlID0gTWV0aG9kVHlwZS5QT1NUO1xyXG5cclxuICAgIGFzeW5jIHByb2NlZWRSZXF1ZXN0KHJlc3BvbnNlOiBSZXNwb25zZSk6IFByb21pc2U8Q2hhdElkS2VlcGVyPiB7XHJcbiAgICAgICAgY29uc3QgdGV4dCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcclxuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh0ZXh0KSBhcyBDaGF0SWRLZWVwZXI7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQge1JlcXVlc3RXcmFwcGVyfSBmcm9tIFwiLi9SZXF1ZXN0XCI7XHJcbmltcG9ydCB7VGFibGVSZXNwb25zZX0gZnJvbSBcIi4vQ3JlYXRlVGFibGVSZXF1ZXN0XCI7XHJcbmltcG9ydCB7TWV0aG9kVHlwZX0gZnJvbSBcIi4uL0h0dHBDbGllbnRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBVc2VyUmVzcG9uc2V7XHJcbiAgICByZWFkb25seSBpZCE6IHN0cmluZ1xyXG4gICAgcmVhZG9ubHkgbmFtZSE6IHN0cmluZ1xyXG4gICAgcmVhZG9ubHkgZW1haWw/OiBzdHJpbmdcclxuICAgIHJlYWRvbmx5IGF2YXRhciE6IHN0cmluZ1xyXG4gICAgcmVhZG9ubHkgY3JlYXRlZCE6IERhdGVcclxuICAgIHJlYWRvbmx5IGNoYXRzPzogVGFibGVSZXNwb25zZVtdXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBVc2VySW5mb1JlcXVlc3QgaW1wbGVtZW50cyBSZXF1ZXN0V3JhcHBlcjxVc2VyUmVzcG9uc2U+e1xyXG4gICAgcmVhZG9ubHkgcGFyYW1ldGVyczogUmVjb3JkPHN0cmluZywgc3RyaW5nPlxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBhcmFtZXRlcnM6IHsgaW5jbHVkZUNoYXRzPzogYm9vbGVhbiB9KSB7XHJcbiAgICAgICAgbGV0IHBhcmFtczogYW55ID0ge31cclxuICAgICAgICBpZihwYXJhbWV0ZXJzLmluY2x1ZGVDaGF0cylcclxuICAgICAgICAgICAgcGFyYW1zLmluY2x1ZGVDaGF0cyA9IHBhcmFtZXRlcnMuaW5jbHVkZUNoYXRzPy50b1N0cmluZygpXHJcblxyXG4gICAgICAgIHRoaXMucGFyYW1ldGVycyA9IHBhcmFtc1xyXG4gICAgfVxyXG5cclxuICAgIHJlYWRvbmx5IGVuZHBvaW50OiBzdHJpbmcgPSBcIi91c2VyL2luZm9cIjtcclxuICAgIHJlYWRvbmx5IG1ldGhvZFR5cGU6IE1ldGhvZFR5cGUgPSBNZXRob2RUeXBlLkdFVDtcclxuXHJcbiAgICBhc3luYyBwcm9jZWVkUmVxdWVzdChyZXNwb25zZTogUmVzcG9uc2UpOiBQcm9taXNlPFVzZXJSZXNwb25zZT4ge1xyXG4gICAgICAgIGNvbnN0IHRleHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XHJcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodGV4dCkgYXMgVXNlclJlc3BvbnNlO1xyXG4gICAgfVxyXG59Il19
