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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJUU2NyaXB0L2F1dGhvcml6YXRpb24vU3RhdGUudHMiLCJUU2NyaXB0L2ludml0ZS50cyIsIlRTY3JpcHQvdXRpbC9Db25zdGFudHMudHMiLCJUU2NyaXB0L3V0aWwvSHR0cENsaWVudC50cyIsIlRTY3JpcHQvdXRpbC9VdGlsLnRzIiwiVFNjcmlwdC91dGlsL3JlcXVlc3QvSXNMb2dnZWRJblJlcXVlc3QudHMiLCJUU2NyaXB0L3V0aWwvcmVxdWVzdC9Qb3N0TGlua1JlcXVlc3QudHMiLCJUU2NyaXB0L3V0aWwvcmVxdWVzdC9Vc2VySW5mb1JlcXVlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNDQSwrQ0FBa0c7QUFDbEcsaURBQStEO0FBQy9ELG1FQUFrRTtBQUdsRTtJQUFBO0lBT0EsQ0FBQztJQUFELFdBQUM7QUFBRCxDQVBBLEFBT0MsSUFBQTtBQVBZLG9CQUFJO0FBU0osUUFBQSxxQkFBcUIsR0FBRztJQUNuQyxNQUFNLEVBQUUsMEJBQWM7SUFDdEIsRUFBRSxFQUFFLHNCQUFVO0NBQ2YsQ0FBQTtBQUVEO0lBRUU7UUFXUSxlQUFVLEdBQVksS0FBSyxDQUFBO1FBQzNCLGNBQVMsR0FBWSxLQUFLLENBQUE7UUFYaEMsSUFBSSxDQUFDLEtBQUssR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQzFDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFBO0lBQ2xDLENBQUM7SUFFRCx5QkFBUyxHQUFUO1FBQUEsaUJBRUM7UUFEQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQU0sT0FBQSxLQUFJLEVBQUosQ0FBSSxDQUFDLENBQUE7SUFDdEMsQ0FBQztJQU9LLHlCQUFTLEdBQWYsVUFBZ0IsV0FBb0IsRUFBRSxRQUE2Qzs7Ozs7O3dCQUNqRixJQUFHLElBQUksQ0FBQyxVQUFVLEVBQUM7NEJBQ2pCLHNCQUFNO3lCQUNQO3dCQUVFLHFCQUFNLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBQTs7d0JBQTFCLElBQUcsU0FBdUI7NEJBQ3hCLHNCQUFPO3dCQUVULElBQUcsQ0FBQyxXQUFXOzRCQUNiLFdBQVcsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQTt3QkFFcEMsWUFBWSxDQUFDLE9BQU8sQ0FBQywrQkFBK0IsRUFBRSxXQUFXLENBQUMsQ0FBQTt3QkFDbEUsWUFBWSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUE7d0JBRTFDLElBQUcsQ0FBQyxRQUFROzRCQUNWLFFBQVEsR0FBRyxRQUFRLENBQUE7d0JBRXJCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFBO3dCQUNmLGFBQWEsR0FBRyw2QkFBcUIsQ0FBQyxRQUFRLENBQUMsR0FBRyxHQUFHOzRCQUN6RCxJQUFJLGVBQWUsQ0FBQyxFQUFDLGNBQWMsRUFBRSxvQ0FBd0IsRUFBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7d0JBQzdFLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUE7d0JBQzFCLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLGFBQWEsQ0FBQTs7Ozs7S0FDckM7SUFFSyw4QkFBYyxHQUFwQixVQUFxQixLQUFhOzs7Ozs7O3dCQUNoQyxJQUFHLENBQUMsSUFBSSxDQUFDLFNBQVM7NEJBQ2hCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFBO3dCQUN2QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQTt3QkFDWixVQUFVLEdBQUcsSUFBQSwwQkFBYSxHQUFFLENBQUM7d0JBQ25DLHFCQUFNLFVBQVUsQ0FBQyxjQUFjLENBQzdCLElBQUksaUNBQWUsQ0FBQyxFQUFFLENBQUMsRUFDdkIsVUFBQSxJQUFJO2dDQUNGLElBQUcsSUFBSSxLQUFLLEdBQUcsRUFBQztvQ0FDZCxPQUFPLENBQUMsR0FBRyxDQUFDLHFDQUFxQyxDQUFDLENBQUE7b0NBQ2xELEtBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFBO29DQUMxQixLQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQTtpQ0FDdkI7NEJBQ0gsQ0FBQyxDQUNGLENBQUMsSUFBSSxDQUFDLFVBQUEsSUFBSTtnQ0FDVCxLQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQTtnQ0FDdkIsS0FBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUE7Z0NBQ2xCLEtBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFBO2dDQUN0QixLQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQTtnQ0FDdEIsWUFBWSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO2dDQUN2QyxZQUFZLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQTtnQ0FDcEMsSUFBTSxRQUFRLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO2dDQUN2RSxZQUFZLENBQUMsVUFBVSxDQUFDLCtCQUErQixDQUFDLENBQUE7Z0NBQ3hELE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUE7Z0NBQzVCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7Z0NBQ2pCLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBOzRCQUNuQyxDQUFDLENBQUMsRUFBQTs7d0JBckJGLFNBcUJFLENBQUE7Ozs7O0tBQ0g7SUFFYSwwQkFBVSxHQUF4Qjs7Ozs7Z0JBQ1EsVUFBVSxHQUFHLElBQUEsMEJBQWEsR0FBRSxDQUFDO2dCQUNuQyxJQUFHLENBQUMsSUFBSSxDQUFDLEtBQUs7b0JBQ1osc0JBQU8sS0FBSyxFQUFDO2dCQUNmLEtBQUssQ0FDSCxtQkFBTyxHQUFHLFlBQVksRUFDdEI7b0JBQ0UsTUFBTSxFQUFFLEtBQUs7b0JBQ2IsT0FBTyxFQUFFO3dCQUNQLGNBQWMsRUFBRSxrQkFBa0I7d0JBQ2xDLGVBQWUsRUFBRSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUs7cUJBQ3hDO2lCQUNGLENBQ0YsQ0FBQyxJQUFJLENBQUMsVUFBTyxRQUFROzs7OztxQ0FDakIsQ0FBQSxRQUFRLENBQUMsTUFBTSxLQUFLLEdBQUcsQ0FBQSxFQUF2Qix3QkFBdUI7Z0NBQ3hCLEtBQUEsSUFBSSxDQUFBO2dDQUFlLEtBQUEsQ0FBQSxLQUFBLElBQUksQ0FBQSxDQUFDLEtBQUssQ0FBQTtnQ0FBQyxxQkFBTSxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUE7O2dDQUFuRCxHQUFLLFdBQVcsR0FBRyxjQUFXLFNBQXFCLEVBQUMsQ0FBQTtnQ0FDcEQsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUE7Z0NBQ3RCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFBO2dDQUN0QixZQUFZLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFBO2dDQUNuRCxzQkFBTyxJQUFJLEVBQUE7O2dDQUVYLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQTtnQ0FDckMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUE7Z0NBQzFCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFBO2dDQUN0QixzQkFBTyxLQUFLLEVBQUM7OztxQkFFaEIsQ0FBQyxDQUFDOzs7O0tBQ0o7SUFFRCxzQ0FBc0IsR0FBdEI7UUFDRSxPQUFPO1lBQ0wsZUFBZSxFQUFFLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSztTQUN4QyxDQUFBO0lBQ0gsQ0FBQztJQUVELG1DQUFtQixHQUFuQjtRQUNFLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFBO1FBQ3ZCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFBO1FBQ3ZCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFBO1FBQ2pCLFlBQVksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDakMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUNsQyxDQUFDO0lBQ0gsWUFBQztBQUFELENBL0dBLEFBK0dDLElBQUE7QUEvR1ksc0JBQUs7QUFpSGxCLElBQUksS0FBWSxDQUFDO0FBQ2pCLFNBQWdCLFFBQVE7SUFDdEIsSUFBRyxDQUFDLEtBQUs7UUFDUCxLQUFLLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztJQUN0QixPQUFPLEtBQUssQ0FBQTtBQUNkLENBQUM7QUFKRCw0QkFJQzs7OztBQzFJRCxnREFBOEQ7QUFDOUQsc0VBQW1FO0FBQ25FLGtFQUErRDtBQUMvRCxvQ0FBcUM7QUFFckMsTUFBTSxDQUFDLE1BQU0sR0FBRztJQUNaLElBQU0sSUFBSSxHQUFHLElBQUEsMEJBQWEsR0FBRSxDQUFDO0lBQzdCLElBQUksQ0FBQyxjQUFjLENBQ2YsSUFBSSxxQ0FBaUIsRUFBRSxFQUN2QixVQUFDLElBQUksRUFBRSxHQUFHO1FBQ04sSUFBSSxJQUFJLEtBQUssR0FBRyxFQUFFO1lBQ2QsS0FBSyxDQUFDLDRDQUE0QyxDQUFDLENBQUM7WUFDcEQsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN2QyxJQUFJLENBQUMsSUFBSSxHQUFHLG9CQUFvQixDQUFDO1lBQ2pDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUNoQjtRQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQzNCLENBQUMsQ0FDSixDQUFDLElBQUksQ0FBQyxVQUFBLFFBQVE7UUFDWCxJQUFJLFFBQVEsS0FBSyxHQUFHLEVBQUU7WUFDbEIsSUFBSSxDQUFDLGNBQWMsQ0FDZixJQUFJLGlDQUFlLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBQSxlQUFRLEVBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUMvQyxVQUFDLElBQUksRUFBRSxHQUFHO2dCQUNOLElBQUksSUFBSSxLQUFLLEdBQUcsRUFBRTtvQkFDZCxJQUFJLE1BQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUN2QyxNQUFJLENBQUMsSUFBSSxHQUFHLG9DQUFvQyxHQUFHLElBQUEsZUFBUSxFQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUN0RSxNQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBQ2IsT0FBTztpQkFDVjtnQkFDRCxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ1gsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDdkMsSUFBSSxDQUFDLElBQUksR0FBRyxvQkFBb0IsQ0FBQztnQkFDakMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2pCLENBQUMsQ0FDSixDQUFDLElBQUksQ0FBQyxVQUFBLFFBQVE7Z0JBQ1gsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDdkMsSUFBSSxDQUFDLElBQUksR0FBRyxvQ0FBb0MsR0FBRyxJQUFBLGVBQVEsRUFBQyxRQUFRLENBQUMsQ0FBQztnQkFDdEUsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2pCLENBQUMsQ0FBQyxDQUFDO1NBQ047SUFDTCxDQUFDLENBQUMsQ0FBQTtBQUVOLENBQUMsQ0FBQTs7Ozs7QUN4Q1ksUUFBQSxPQUFPLEdBQUcseUJBQXlCLENBQUE7QUFDbkMsUUFBQSxVQUFVLEdBQUcsZUFBTyxHQUFHLHNCQUFzQixDQUFBO0FBQzdDLFFBQUEsY0FBYyxHQUFHLGVBQU8sR0FBRywwQkFBMEIsQ0FBQTtBQUVyRCxRQUFBLHdCQUF3QixHQUFHLHFDQUFxQyxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTDdFLGdEQUF5RDtBQUN6RCx5Q0FBc0M7QUFHdEM7SUFDSSxvQkFBNkIsT0FBZTtRQUFmLFlBQU8sR0FBUCxPQUFPLENBQVE7SUFBRyxDQUFDO0lBRTFDLG1DQUFjLEdBQXBCLFVBQ0ksT0FBMEIsRUFDMUIsU0FDb0UsRUFDcEUsZ0JBQ2lEO1FBSGpELDBCQUFBLEVBQUEsc0JBQ0ssSUFBSSxFQUFFLFNBQVMsSUFBSyxPQUFBLEtBQUssQ0FBQyxnQkFBUyxJQUFJLHNCQUFZLFNBQVMsQ0FBRSxDQUFDLEVBQTNDLENBQTJDO1FBQ3BFLGlDQUFBLEVBQUEsNkJBQ0ssTUFBTSxJQUFLLE9BQUEsS0FBSyxDQUFDLHlCQUFrQixNQUFNLENBQUUsQ0FBQyxFQUFqQyxDQUFpQzs7Ozs7Ozt3QkFFM0MsU0FBUyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO3dCQUMxRCxJQUFHLE9BQU8sQ0FBQyxVQUFVLElBQUksU0FBUzs0QkFDOUIsU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLGVBQWUsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUE7MkNBR2xFLE9BQU8sQ0FBQyxPQUFPO3dCQUNkLHFCQUFNLElBQUEsZ0JBQVEsR0FBRSxDQUFDLFNBQVMsRUFBRSxFQUFBOzt3QkFGaEMsT0FBTyxxQ0FFSixDQUFDLFNBQTRCLENBQUMsQ0FBQyxzQkFBc0IsRUFBRSxHQUM3RDt3QkFDRCxPQUFPLENBQUMsR0FBRyx1QkFBSyxPQUFPLEtBQUUsT0FBTyxFQUFFLE9BQU8sSUFBRSxDQUFBO3dCQUMzQyxzQkFBTyxLQUFLLENBQ1IsU0FBUyxDQUFDLFFBQVEsRUFBRSxFQUNwQjtnQ0FDSSxNQUFNLEVBQUUsT0FBTyxDQUFDLFVBQVU7Z0NBQzFCLE9BQU8sRUFBRSxPQUFPO2dDQUNoQixJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUk7NkJBQ3JCLENBQ0osQ0FBQyxJQUFJLENBQUMsVUFBTyxRQUFROzs7OztpREFDZixDQUFBLFFBQVEsQ0FBQyxNQUFNLEtBQUssR0FBRyxDQUFBLEVBQXZCLHdCQUF1Qjs0Q0FDdEIsc0JBQU8sT0FBTyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsRUFBQTtnREFFckIscUJBQU0sUUFBUSxDQUFDLElBQUksRUFBRSxFQUFBOzs0Q0FBakMsU0FBUyxHQUFHLFNBQXFCOzRDQUN2QyxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQzs0Q0FDdEMsTUFBTSxJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQzs7O2lDQUV0QyxDQUFDLEVBQUE7Ozs7S0FDTDtJQUNMLGlCQUFDO0FBQUQsQ0FwQ0EsQUFvQ0MsSUFBQTtBQXBDWSxnQ0FBVTtBQXNDdkIsSUFBSSxVQUFzQixDQUFDO0FBQzNCLFNBQWdCLGFBQWE7SUFDekIsSUFBRyxDQUFDLFVBQVU7UUFDVixVQUFVLEdBQUcsSUFBSSxVQUFVLENBQUMsbUJBQU8sQ0FBQyxDQUFBO0lBQ3hDLE9BQU8sVUFBVSxDQUFBO0FBQ3JCLENBQUM7QUFKRCxzQ0FJQztBQUVELElBQVksVUFNWDtBQU5ELFdBQVksVUFBVTtJQUNsQiwyQkFBVyxDQUFBO0lBQ1gseUJBQVMsQ0FBQTtJQUNULDZCQUFhLENBQUE7SUFDYix5QkFBUyxDQUFBO0lBQ1QsK0JBQWUsQ0FBQTtBQUNuQixDQUFDLEVBTlcsVUFBVSxHQUFWLGtCQUFVLEtBQVYsa0JBQVUsUUFNckI7Ozs7O0FDcERELFNBQWdCLFFBQVEsQ0FBQyxJQUFZO0lBQ25DLElBQU0sU0FBUyxHQUFHLElBQUksZUFBZSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDN0QsT0FBTyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQzVCLENBQUM7QUFIRCw0QkFHQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNORCw0Q0FBeUM7QUFHekM7SUFBQTtRQUNhLGFBQVEsR0FBVyxhQUFhLENBQUM7UUFDakMsZUFBVSxHQUFlLHVCQUFVLENBQUMsR0FBRyxDQUFDO0lBS3JELENBQUM7SUFIUywwQ0FBYyxHQUFwQixVQUFxQixRQUFrQjs7O2dCQUNuQyxzQkFBTyxRQUFRLENBQUMsTUFBTSxFQUFDOzs7S0FDMUI7SUFDTCx3QkFBQztBQUFELENBUEEsQUFPQyxJQUFBO0FBUFksOENBQWlCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0o5Qiw0Q0FBeUM7QUFHekM7SUFBQTtJQUVBLENBQUM7SUFBRCxtQkFBQztBQUFELENBRkEsQUFFQyxJQUFBO0FBRlksb0NBQVk7QUFJekI7SUFFSSx5QkFBWSxJQUFzQjtRQUl6QixhQUFRLEdBQVcsd0JBQXdCLENBQUM7UUFDNUMsWUFBTyxHQUFnQjtZQUM1QixjQUFjLEVBQUUsa0JBQWtCO1NBQ3JDLENBQUM7UUFDTyxlQUFVLEdBQWUsdUJBQVUsQ0FBQyxJQUFJLENBQUM7UUFQOUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFRSyx3Q0FBYyxHQUFwQixVQUFxQixRQUFrQjs7Ozs7NEJBQ3RCLHFCQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBQTs7d0JBQTVCLElBQUksR0FBRyxTQUFxQjt3QkFDbEMsc0JBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQWlCLEVBQUM7Ozs7S0FDM0M7SUFDTCxzQkFBQztBQUFELENBaEJBLEFBZ0JDLElBQUE7QUFoQlksMENBQWU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTDVCLDRDQUF5QztBQUV6QztJQUFBO0lBT0EsQ0FBQztJQUFELG1CQUFDO0FBQUQsQ0FQQSxBQU9DLElBQUE7QUFQWSxvQ0FBWTtBQVN6QjtJQUdJLHlCQUFZLFVBQXNDOztRQVF6QyxhQUFRLEdBQVcsWUFBWSxDQUFDO1FBQ2hDLGVBQVUsR0FBZSx1QkFBVSxDQUFDLEdBQUcsQ0FBQztRQVI3QyxJQUFJLE1BQU0sR0FBUSxFQUFFLENBQUE7UUFDcEIsSUFBRyxVQUFVLENBQUMsWUFBWTtZQUN0QixNQUFNLENBQUMsWUFBWSxHQUFHLE1BQUEsVUFBVSxDQUFDLFlBQVksMENBQUUsUUFBUSxFQUFFLENBQUE7UUFFN0QsSUFBSSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUE7SUFDNUIsQ0FBQztJQUtLLHdDQUFjLEdBQXBCLFVBQXFCLFFBQWtCOzs7Ozs0QkFDdEIscUJBQU0sUUFBUSxDQUFDLElBQUksRUFBRSxFQUFBOzt3QkFBNUIsSUFBSSxHQUFHLFNBQXFCO3dCQUNsQyxzQkFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBaUIsRUFBQzs7OztLQUMzQztJQUNMLHNCQUFDO0FBQUQsQ0FsQkEsQUFrQkMsSUFBQTtBQWxCWSwwQ0FBZSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCB7IFRhYmxlUmVzcG9uc2UgfSBmcm9tIFwiLi4vdXRpbC9yZXF1ZXN0L0NyZWF0ZVRhYmxlUmVxdWVzdFwiO1xyXG5pbXBvcnQgeyBhcGlMaW5rLCBhdXRob3JpemF0aW9uUmVkaXJlY3RVcmksIGdvb2dsZUxvZ2luVXJpLCB2a0xvZ2luVXJpIH0gZnJvbSBcIi4uL3V0aWwvQ29uc3RhbnRzXCI7XHJcbmltcG9ydCB7IGdldEh0dHBDbGllbnQsIEh0dHBDbGllbnQgfSBmcm9tIFwiLi4vdXRpbC9IdHRwQ2xpZW50XCI7XHJcbmltcG9ydCB7IFVzZXJJbmZvUmVxdWVzdCB9IGZyb20gXCIuLi91dGlsL3JlcXVlc3QvVXNlckluZm9SZXF1ZXN0XCI7XHJcbmltcG9ydCB7IElzTG9nZ2VkSW5SZXF1ZXN0IH0gZnJvbSBcIi4uL3V0aWwvcmVxdWVzdC9Jc0xvZ2dlZEluUmVxdWVzdFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFVzZXIge1xyXG4gIHJlYWRvbmx5IGlkITogc3RyaW5nXHJcbiAgcmVhZG9ubHkgbmFtZSE6IHN0cmluZ1xyXG4gIHJlYWRvbmx5IGVtYWlsPzogc3RyaW5nXHJcbiAgcmVhZG9ubHkgYXZhdGFyITogc3RyaW5nXHJcbiAgcmVhZG9ubHkgY3JlYXRlZCE6IERhdGVcclxuICByZWFkb25seSBjaGF0cz86IFRhYmxlUmVzcG9uc2VbXVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgQXV0aG9yaXphdGlvblByb3ZpZGVyID0ge1xyXG4gIGdvb2dsZTogZ29vZ2xlTG9naW5VcmksXHJcbiAgdms6IHZrTG9naW5VcmksXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTdGF0ZSB7XHJcbiAgcHJpdmF0ZSByZWFkb25seSBjaGVja2VyOiBQcm9taXNlPGJvb2xlYW4+XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ0b2tlblwiKVxyXG4gICAgdGhpcy5jaGVja2VyID0gdGhpcy5jaGVja1Rva2VuKClcclxuICB9XHJcblxyXG4gIHdoZW5SZWFkeSgpOiBQcm9taXNlPFN0YXRlPntcclxuICAgIHJldHVybiB0aGlzLmNoZWNrZXIudGhlbigoKSA9PiB0aGlzKVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjdXJyZW50VXNlcj86IFVzZXJcclxuICBwcml2YXRlIHRva2VuPzogc3RyaW5nXHJcbiAgcHJpdmF0ZSBhdXRob3JpemVkOiBib29sZWFuID0gZmFsc2VcclxuICBwcml2YXRlIGlzTG9hZGluZzogYm9vbGVhbiA9IGZhbHNlXHJcblxyXG4gIGFzeW5jIGF1dGhvcml6ZShyZWRpcmVjdFVyaT86IHN0cmluZywgcHJvdmlkZXI/OiBrZXlvZiB0eXBlb2YgQXV0aG9yaXphdGlvblByb3ZpZGVyKSB7XHJcbiAgICBpZih0aGlzLmF1dGhvcml6ZWQpe1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBpZihhd2FpdCB0aGlzLmNoZWNrVG9rZW4oKSlcclxuICAgICAgcmV0dXJuO1xyXG5cclxuICAgIGlmKCFyZWRpcmVjdFVyaSlcclxuICAgICAgcmVkaXJlY3RVcmkgPSB3aW5kb3cubG9jYXRpb24uaHJlZlxyXG5cclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwicmVkaXJlY3RBZnRlckF1dGhvcml6YXRpb25VcmlcIiwgcmVkaXJlY3RVcmkpXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInByb3ZpZGVyXCIsIHByb3ZpZGVyKVxyXG5cclxuICAgIGlmKCFwcm92aWRlcilcclxuICAgICAgcHJvdmlkZXIgPSBcImdvb2dsZVwiXHJcblxyXG4gICAgdGhpcy5pc0xvYWRpbmcgPSB0cnVlXHJcbiAgICBjb25zdCBhdXRob3JpemVMaW5rID0gQXV0aG9yaXphdGlvblByb3ZpZGVyW3Byb3ZpZGVyXSArIFwiP1wiICtcclxuICAgICAgbmV3IFVSTFNlYXJjaFBhcmFtcyh7XCJyZWRpcmVjdF91cmlcIjogYXV0aG9yaXphdGlvblJlZGlyZWN0VXJpfSkudG9TdHJpbmcoKTtcclxuICAgIGNvbnNvbGUubG9nKGF1dGhvcml6ZUxpbmspXHJcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGF1dGhvcml6ZUxpbmtcclxuICB9XHJcblxyXG4gIGFzeW5jIGFmdGVyQXV0aG9yaXplKHRva2VuOiBzdHJpbmcpIHtcclxuICAgIGlmKCF0aGlzLmlzTG9hZGluZylcclxuICAgICAgdGhpcy5pc0xvYWRpbmcgPSB0cnVlXHJcbiAgICB0aGlzLnRva2VuID0gdG9rZW5cclxuICAgIGNvbnN0IGh0dHBDbGllbnQgPSBnZXRIdHRwQ2xpZW50KCk7XHJcbiAgICBhd2FpdCBodHRwQ2xpZW50LnByb2NlZWRSZXF1ZXN0KFxyXG4gICAgICBuZXcgVXNlckluZm9SZXF1ZXN0KHt9KSxcclxuICAgICAgY29kZSA9PiB7XHJcbiAgICAgICAgaWYoY29kZSA9PT0gNDAxKXtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiVXNlciBpcyBub3QgYXV0aG9yaXplZCBhZnRlciBhc2tpbmdcIilcclxuICAgICAgICAgIHRoaXMucmV2b2tlQXV0aG9yaXphdGlvbigpXHJcbiAgICAgICAgICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICApLnRoZW4odXNlciA9PiB7XHJcbiAgICAgIHRoaXMuY3VycmVudFVzZXIgPSB1c2VyXHJcbiAgICAgIHRoaXMudG9rZW4gPSB0b2tlblxyXG4gICAgICB0aGlzLmF1dGhvcml6ZWQgPSB0cnVlXHJcbiAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2VcclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ1c2VySWRcIiwgdXNlci5pZClcclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ0b2tlblwiLCB0b2tlbilcclxuICAgICAgY29uc3QgcmVkaXJlY3QgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInJlZGlyZWN0QWZ0ZXJBdXRob3JpemF0aW9uVXJpXCIpO1xyXG4gICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcInJlZGlyZWN0QWZ0ZXJBdXRob3JpemF0aW9uVXJpXCIpXHJcbiAgICAgIGNvbnNvbGUubG9nKFwiQXV0aGVkIHVzZXI6IFwiKVxyXG4gICAgICBjb25zb2xlLmxvZyh1c2VyKVxyXG4gICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZShyZWRpcmVjdClcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIGNoZWNrVG9rZW4oKTogUHJvbWlzZTxib29sZWFuPntcclxuICAgIGNvbnN0IGh0dHBDbGllbnQgPSBnZXRIdHRwQ2xpZW50KCk7XHJcbiAgICBpZighdGhpcy50b2tlbilcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgZmV0Y2goXHJcbiAgICAgIGFwaUxpbmsgKyBcIi91c2VyL2luZm9cIixcclxuICAgICAge1xyXG4gICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICBcIkNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgIFwiQXV0aG9yaXphdGlvblwiOiBcIkJlYXJlciBcIiArIHRoaXMudG9rZW5cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICkudGhlbihhc3luYyAocmVzcG9uc2UpID0+IHtcclxuICAgICAgaWYocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApe1xyXG4gICAgICAgIHRoaXMuY3VycmVudFVzZXIgPSBKU09OLnBhcnNlKGF3YWl0IHJlc3BvbnNlLnRleHQoKSlcclxuICAgICAgICB0aGlzLmF1dGhvcml6ZWQgPSB0cnVlXHJcbiAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZVxyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidXNlcklkXCIsIHRoaXMuY3VycmVudFVzZXIuaWQpXHJcbiAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlVzZXIgaXMgbm90IGF1dGhvcml6ZWRcIilcclxuICAgICAgICB0aGlzLnJldm9rZUF1dGhvcml6YXRpb24oKVxyXG4gICAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2VcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0QXV0aG9yaXphdGlvbkhlYWRlcigpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+e1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgXCJBdXRob3JpemF0aW9uXCI6IFwiQmVhcmVyIFwiICsgdGhpcy50b2tlblxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV2b2tlQXV0aG9yaXphdGlvbigpe1xyXG4gICAgdGhpcy5hdXRob3JpemVkID0gZmFsc2VcclxuICAgIHRoaXMuY3VycmVudFVzZXIgPSBudWxsXHJcbiAgICB0aGlzLnRva2VuID0gbnVsbFxyXG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJ1c2VySWRcIilcclxuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwidG9rZW5cIilcclxuICB9XHJcbn1cclxuXHJcbmxldCBzdGF0ZTogU3RhdGU7XHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRTdGF0ZSgpOiBTdGF0ZXtcclxuICBpZighc3RhdGUpXHJcbiAgICBzdGF0ZSA9IG5ldyBTdGF0ZSgpO1xyXG4gIHJldHVybiBzdGF0ZVxyXG59IiwiaW1wb3J0IHsgZ2V0SHR0cENsaWVudCwgSHR0cENsaWVudCB9IGZyb20gXCIuL3V0aWwvSHR0cENsaWVudFwiO1xyXG5pbXBvcnQge0lzTG9nZ2VkSW5SZXF1ZXN0fSBmcm9tIFwiLi91dGlsL3JlcXVlc3QvSXNMb2dnZWRJblJlcXVlc3RcIjtcclxuaW1wb3J0IHtQb3N0TGlua1JlcXVlc3R9IGZyb20gXCIuL3V0aWwvcmVxdWVzdC9Qb3N0TGlua1JlcXVlc3RcIjtcclxuaW1wb3J0IHtnZXRQYXJhbX0gZnJvbSBcIi4vdXRpbC9VdGlsXCI7XHJcblxyXG53aW5kb3cub25sb2FkID0gKCkgPT4ge1xyXG4gICAgY29uc3QgaHR0cCA9IGdldEh0dHBDbGllbnQoKTtcclxuICAgIGh0dHAucHJvY2VlZFJlcXVlc3QoXHJcbiAgICAgICAgbmV3IElzTG9nZ2VkSW5SZXF1ZXN0KCksXHJcbiAgICAgICAgKGNvZGUsIGVycikgPT4ge1xyXG4gICAgICAgICAgICBpZiAoY29kZSA9PT0gNDAxKSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydChcItCS0Ysg0L3QtSDQstC+0YjQu9C4INCyINGB0LjRgdGC0LXQvNGDLCDQstC+0LnQtNC40YLQtSwg0L/QvtC20LDQu9GD0LnRgdGC0LBcIik7XHJcbiAgICAgICAgICAgICAgICBsZXQgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICAgICAgICAgIGxpbmsuaHJlZiA9IFwiaHR0cHM6Ly9jb21ncmlkLnJ1XCI7XHJcbiAgICAgICAgICAgICAgICBsaW5rLmNsaWNrKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc29sZS5sb2coY29kZSwgZXJyKTtcclxuICAgICAgICB9XHJcbiAgICApLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgIGlmIChyZXNwb25zZSA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIGh0dHAucHJvY2VlZFJlcXVlc3QoXHJcbiAgICAgICAgICAgICAgICBuZXcgUG9zdExpbmtSZXF1ZXN0KHsgY29kZTogZ2V0UGFyYW0oJ2NvZGUnKSB9KSxcclxuICAgICAgICAgICAgICAgIChjb2RlLCBlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY29kZSA9PT0gNDIyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rLmhyZWYgPSBcImh0dHBzOi8vY29tZ3JpZC5ydS9wYWdlcy90YWJsZT9pZD1cIiArIGdldFBhcmFtKCdjaGF0SWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGluay5jbGljaygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluay5ocmVmID0gXCJodHRwczovL2NvbWdyaWQucnVcIjtcclxuICAgICAgICAgICAgICAgICAgICBsaW5rLmNsaWNrKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICAgICAgICAgIGxpbmsuaHJlZiA9IFwiaHR0cHM6Ly9jb21ncmlkLnJ1L3BhZ2VzL3RhYmxlP2lkPVwiICsgZ2V0UGFyYW0oJ2NoYXRJZCcpO1xyXG4gICAgICAgICAgICAgICAgbGluay5jbGljaygpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG5cclxufSIsIlxyXG5cclxuZXhwb3J0IGNvbnN0IGFwaUxpbmsgPSBcImh0dHBzOi8vY29tZ3JpZC5ydTo4NDQzXCJcclxuZXhwb3J0IGNvbnN0IHZrTG9naW5VcmkgPSBhcGlMaW5rICsgXCIvb2F1dGgyL2F1dGhvcml6ZS92a1wiXHJcbmV4cG9ydCBjb25zdCBnb29nbGVMb2dpblVyaSA9IGFwaUxpbmsgKyBcIi9vYXV0aDIvYXV0aG9yaXplL2dvb2dsZVwiXHJcblxyXG5leHBvcnQgY29uc3QgYXV0aG9yaXphdGlvblJlZGlyZWN0VXJpID0gXCJodHRwczovL2NvbWdyaWQucnUvcGFnZXMvbG9naW4uaHRtbFwiIiwiaW1wb3J0IHtSZXF1ZXN0V3JhcHBlcn0gZnJvbSBcIi4vcmVxdWVzdC9SZXF1ZXN0XCI7XHJcbmltcG9ydCB7IGdldFN0YXRlLCBTdGF0ZSB9IGZyb20gXCIuLi9hdXRob3JpemF0aW9uL1N0YXRlXCI7XHJcbmltcG9ydCB7IGFwaUxpbmsgfSBmcm9tIFwiLi9Db25zdGFudHNcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgSHR0cENsaWVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGFwaUxpbms6IHN0cmluZykge31cclxuXHJcbiAgICBhc3luYyBwcm9jZWVkUmVxdWVzdDxUPihcclxuICAgICAgICByZXF1ZXN0OiBSZXF1ZXN0V3JhcHBlcjxUPixcclxuICAgICAgICBvbkZhaWx1cmU6IChjb2RlOiBudW1iZXIsIGVycm9yVGV4dDogc3RyaW5nKSA9PiB1bmtub3duID1cclxuICAgICAgICAgICAgKGNvZGUsIGVycm9yVGV4dCkgPT4gYWxlcnQoYGNvZGU6ICR7Y29kZX0sIGVycm9yOiAke2Vycm9yVGV4dH1gKSxcclxuICAgICAgICBvbk5ldHdvcmtGYWlsdXJlOiAocmVhc29uKSA9PiB1bmtub3duID1cclxuICAgICAgICAgICAgKHJlYXNvbikgPT4gYWxlcnQoYG5ldHdvcmsgZXJyb3I6ICR7cmVhc29ufWApXHJcbiAgICApOiBQcm9taXNlPFQ+e1xyXG4gICAgICAgIGNvbnN0IGZpbmFsTGluayA9IG5ldyBVUkwodGhpcy5hcGlMaW5rICsgcmVxdWVzdC5lbmRwb2ludClcclxuICAgICAgICBpZihyZXF1ZXN0LnBhcmFtZXRlcnMgIT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICBmaW5hbExpbmsuc2VhcmNoID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhyZXF1ZXN0LnBhcmFtZXRlcnMpLnRvU3RyaW5nKClcclxuXHJcbiAgICAgICAgbGV0IGhlYWRlcnMgPSB7XHJcbiAgICAgICAgICAgIC4uLnJlcXVlc3QuaGVhZGVycyxcclxuICAgICAgICAgICAgLi4uKGF3YWl0IGdldFN0YXRlKCkud2hlblJlYWR5KCkpLmdldEF1dGhvcml6YXRpb25IZWFkZXIoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmxvZyh7Li4ucmVxdWVzdCwgaGVhZGVyczogaGVhZGVyc30pXHJcbiAgICAgICAgcmV0dXJuIGZldGNoKFxyXG4gICAgICAgICAgICBmaW5hbExpbmsudG9TdHJpbmcoKSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiByZXF1ZXN0Lm1ldGhvZFR5cGUsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzLFxyXG4gICAgICAgICAgICAgICAgYm9keTogcmVxdWVzdC5ib2R5XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApLnRoZW4oYXN5bmMgKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0LnByb2NlZWRSZXF1ZXN0KHJlc3BvbnNlKVxyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yVGV4dCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcclxuICAgICAgICAgICAgICAgIG9uRmFpbHVyZShyZXNwb25zZS5zdGF0dXMsIGVycm9yVGV4dCk7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGVycm9yVGV4dCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59XHJcblxyXG5sZXQgaHR0cENsaWVudDogSHR0cENsaWVudDtcclxuZXhwb3J0IGZ1bmN0aW9uIGdldEh0dHBDbGllbnQoKTogSHR0cENsaWVudHtcclxuICAgIGlmKCFodHRwQ2xpZW50KVxyXG4gICAgICAgIGh0dHBDbGllbnQgPSBuZXcgSHR0cENsaWVudChhcGlMaW5rKVxyXG4gICAgcmV0dXJuIGh0dHBDbGllbnRcclxufVxyXG5cclxuZXhwb3J0IGVudW0gTWV0aG9kVHlwZXtcclxuICAgIFBPU1Q9XCJQT1NUXCIsXHJcbiAgICBHRVQ9XCJHRVRcIixcclxuICAgIFBBVENIPVwiUEFUQ0hcIixcclxuICAgIFBVVD1cIlBVVFwiLFxyXG4gICAgREVMRVRFPVwiREVMRVRFXCJcclxufSIsIlxyXG5cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGFyYW0obmFtZTogc3RyaW5nKTogc3RyaW5ne1xyXG4gIGNvbnN0IHVybFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaClcclxuICByZXR1cm4gdXJsUGFyYW1zLmdldChuYW1lKVxyXG59IiwiaW1wb3J0IHtSZXF1ZXN0V3JhcHBlcn0gZnJvbSBcIi4vUmVxdWVzdFwiO1xyXG5pbXBvcnQge01ldGhvZFR5cGV9IGZyb20gXCIuLi9IdHRwQ2xpZW50XCI7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIElzTG9nZ2VkSW5SZXF1ZXN0IGltcGxlbWVudHMgUmVxdWVzdFdyYXBwZXI8bnVtYmVyPntcclxuICAgIHJlYWRvbmx5IGVuZHBvaW50OiBzdHJpbmcgPSAnL3VzZXIvbG9naW4nO1xyXG4gICAgcmVhZG9ubHkgbWV0aG9kVHlwZTogTWV0aG9kVHlwZSA9IE1ldGhvZFR5cGUuR0VUO1xyXG5cclxuICAgIGFzeW5jIHByb2NlZWRSZXF1ZXN0KHJlc3BvbnNlOiBSZXNwb25zZSk6IFByb21pc2U8bnVtYmVyPiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnN0YXR1cztcclxuICAgIH1cclxufSIsImltcG9ydCB7TWV0aG9kVHlwZX0gZnJvbSBcIi4uL0h0dHBDbGllbnRcIjtcclxuaW1wb3J0IHtSZXF1ZXN0V3JhcHBlcn0gZnJvbSBcIi4vUmVxdWVzdFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENoYXRJZEtlZXBlciB7XHJcbiAgICBjaGF0SWQhOiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQb3N0TGlua1JlcXVlc3QgaW1wbGVtZW50cyBSZXF1ZXN0V3JhcHBlcjxDaGF0SWRLZWVwZXI+IHtcclxuICAgIHJlYWRvbmx5IGJvZHk6IGFueTtcclxuICAgIGNvbnN0cnVjdG9yKGJvZHk6IHsgY29kZTogc3RyaW5nIH0pIHtcclxuICAgICAgICB0aGlzLmJvZHkgPSBKU09OLnN0cmluZ2lmeShib2R5KTtcclxuICAgIH1cclxuXHJcbiAgICByZWFkb25seSBlbmRwb2ludDogc3RyaW5nID0gXCIvdGFibGUvaW52aXRhdGlvbl9saW5rXCI7XHJcbiAgICByZWFkb25seSBoZWFkZXJzOiBIZWFkZXJzSW5pdCA9IHtcclxuICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxyXG4gICAgfTtcclxuICAgIHJlYWRvbmx5IG1ldGhvZFR5cGU6IE1ldGhvZFR5cGUgPSBNZXRob2RUeXBlLlBPU1Q7XHJcblxyXG4gICAgYXN5bmMgcHJvY2VlZFJlcXVlc3QocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTxDaGF0SWRLZWVwZXI+IHtcclxuICAgICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xyXG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHRleHQpIGFzIENoYXRJZEtlZXBlcjtcclxuICAgIH1cclxufSIsImltcG9ydCB7UmVxdWVzdFdyYXBwZXJ9IGZyb20gXCIuL1JlcXVlc3RcIjtcclxuaW1wb3J0IHtUYWJsZVJlc3BvbnNlfSBmcm9tIFwiLi9DcmVhdGVUYWJsZVJlcXVlc3RcIjtcclxuaW1wb3J0IHtNZXRob2RUeXBlfSBmcm9tIFwiLi4vSHR0cENsaWVudFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFVzZXJSZXNwb25zZXtcclxuICAgIHJlYWRvbmx5IGlkITogc3RyaW5nXHJcbiAgICByZWFkb25seSBuYW1lITogc3RyaW5nXHJcbiAgICByZWFkb25seSBlbWFpbD86IHN0cmluZ1xyXG4gICAgcmVhZG9ubHkgYXZhdGFyITogc3RyaW5nXHJcbiAgICByZWFkb25seSBjcmVhdGVkITogRGF0ZVxyXG4gICAgcmVhZG9ubHkgY2hhdHM/OiBUYWJsZVJlc3BvbnNlW11cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFVzZXJJbmZvUmVxdWVzdCBpbXBsZW1lbnRzIFJlcXVlc3RXcmFwcGVyPFVzZXJSZXNwb25zZT57XHJcbiAgICByZWFkb25seSBwYXJhbWV0ZXJzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+XHJcblxyXG4gICAgY29uc3RydWN0b3IocGFyYW1ldGVyczogeyBpbmNsdWRlQ2hhdHM/OiBib29sZWFuIH0pIHtcclxuICAgICAgICBsZXQgcGFyYW1zOiBhbnkgPSB7fVxyXG4gICAgICAgIGlmKHBhcmFtZXRlcnMuaW5jbHVkZUNoYXRzKVxyXG4gICAgICAgICAgICBwYXJhbXMuaW5jbHVkZUNoYXRzID0gcGFyYW1ldGVycy5pbmNsdWRlQ2hhdHM/LnRvU3RyaW5nKClcclxuXHJcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzID0gcGFyYW1zXHJcbiAgICB9XHJcblxyXG4gICAgcmVhZG9ubHkgZW5kcG9pbnQ6IHN0cmluZyA9IFwiL3VzZXIvaW5mb1wiO1xyXG4gICAgcmVhZG9ubHkgbWV0aG9kVHlwZTogTWV0aG9kVHlwZSA9IE1ldGhvZFR5cGUuR0VUO1xyXG5cclxuICAgIGFzeW5jIHByb2NlZWRSZXF1ZXN0KHJlc3BvbnNlOiBSZXNwb25zZSk6IFByb21pc2U8VXNlclJlc3BvbnNlPiB7XHJcbiAgICAgICAgY29uc3QgdGV4dCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcclxuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh0ZXh0KSBhcyBVc2VyUmVzcG9uc2U7XHJcbiAgICB9XHJcbn0iXX0=
