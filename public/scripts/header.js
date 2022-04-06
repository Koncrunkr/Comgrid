(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IsLoggedInRequest_1 = require("./util/request/IsLoggedInRequest");
var HttpClient_1 = require("./util/HttpClient");
window.onload = function () {
    var httpClient = new HttpClient_1.HttpClient("https://comgrid.ru:8443");
    httpClient.proceedRequest(new IsLoggedInRequest_1.IsLoggedInRequest(), function () {
        console.log("unauthorizated");
    }).then(function () {
        $('.clickable').toggleClass('d-none');
    });
};
},{"./util/HttpClient":2,"./util/request/IsLoggedInRequest":3}],2:[function(require,module,exports){
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
},{"../HttpClient":2}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJUU2NyaXB0L2hlYWRlclNjcmlwdC50cyIsIlRTY3JpcHQvdXRpbC9IdHRwQ2xpZW50LnRzIiwiVFNjcmlwdC91dGlsL3JlcXVlc3QvSXNMb2dnZWRJblJlcXVlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLHNFQUFtRTtBQUNuRSxnREFBNkM7QUFFN0MsTUFBTSxDQUFDLE1BQU0sR0FBRztJQUNaLElBQUksVUFBVSxHQUFHLElBQUksdUJBQVUsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0lBQzNELFVBQVUsQ0FBQyxjQUFjLENBQ3JCLElBQUkscUNBQWlCLEVBQUUsRUFDdkI7UUFDSSxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDbEMsQ0FBQyxDQUNKLENBQUMsSUFBSSxDQUFDO1FBQ0gsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMxQyxDQUFDLENBQUMsQ0FBQTtBQUNOLENBQUMsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNWRDtJQUNJLG9CQUE2QixPQUFlO1FBQWYsWUFBTyxHQUFQLE9BQU8sQ0FBUTtJQUFHLENBQUM7SUFFMUMsbUNBQWMsR0FBcEIsVUFDSSxPQUEwQixFQUMxQixTQUNvRSxFQUNwRSxnQkFDaUQ7UUFIakQsMEJBQUEsRUFBQSxzQkFDSyxJQUFJLEVBQUUsU0FBUyxJQUFLLE9BQUEsS0FBSyxDQUFDLGdCQUFTLElBQUksc0JBQVksU0FBUyxDQUFFLENBQUMsRUFBM0MsQ0FBMkM7UUFDcEUsaUNBQUEsRUFBQSw2QkFDSyxNQUFNLElBQUssT0FBQSxLQUFLLENBQUMseUJBQWtCLE1BQU0sQ0FBRSxDQUFDLEVBQWpDLENBQWlDOzs7O2dCQUUzQyxTQUFTLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7Z0JBQzFELElBQUcsT0FBTyxDQUFDLFVBQVUsSUFBSSxTQUFTO29CQUM5QixTQUFTLENBQUMsTUFBTSxHQUFHLElBQUksZUFBZSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtnQkFFekUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQTtnQkFDcEIsc0JBQU8sS0FBSyxDQUNSLFNBQVMsQ0FBQyxRQUFRLEVBQUUsRUFDcEI7d0JBQ0ksV0FBVyxFQUFFLFNBQVM7d0JBQ3RCLE1BQU0sRUFBRSxPQUFPLENBQUMsVUFBVTt3QkFDMUIsT0FBTyxFQUFFLE9BQU8sQ0FBQyxPQUFPO3dCQUN4QixJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUk7cUJBQ3JCLENBQ0osQ0FBQyxJQUFJLENBQUMsVUFBQyxRQUFRO3dCQUNaLElBQUcsUUFBUSxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUM7NEJBQ3ZCLE9BQU8sT0FBTyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQTt5QkFDMUM7NkJBQUk7NEJBQ0QsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFBLElBQUk7Z0NBQ3JCLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFBO2dDQUNoQyxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUE7NEJBQy9CLENBQUMsQ0FBQyxDQUFBO3lCQUNMO29CQUNMLENBQUMsQ0FBQyxFQUFBOzs7S0FDTDtJQUNMLGlCQUFDO0FBQUQsQ0FsQ0EsQUFrQ0MsSUFBQTtBQWxDWSxnQ0FBVTtBQW9DdkIsSUFBWSxVQUtYO0FBTEQsV0FBWSxVQUFVO0lBQ2xCLDJCQUFXLENBQUE7SUFDWCx5QkFBUyxDQUFBO0lBQ1QsNkJBQWEsQ0FBQTtJQUNiLHlCQUFTLENBQUE7QUFDYixDQUFDLEVBTFcsVUFBVSxHQUFWLGtCQUFVLEtBQVYsa0JBQVUsUUFLckI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM0NELDRDQUF5QztBQUd6QztJQUFBO1FBQ2EsYUFBUSxHQUFXLGFBQWEsQ0FBQztRQUNqQyxlQUFVLEdBQWUsdUJBQVUsQ0FBQyxHQUFHLENBQUM7SUFLckQsQ0FBQztJQUhTLDBDQUFjLEdBQXBCLFVBQXFCLFFBQWtCOzs7Z0JBQ25DLHNCQUFPLFFBQVEsQ0FBQyxNQUFNLEVBQUM7OztLQUMxQjtJQUNMLHdCQUFDO0FBQUQsQ0FQQSxBQU9DLElBQUE7QUFQWSw4Q0FBaUIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQge0lzTG9nZ2VkSW5SZXF1ZXN0fSBmcm9tIFwiLi91dGlsL3JlcXVlc3QvSXNMb2dnZWRJblJlcXVlc3RcIjtcclxuaW1wb3J0IHtIdHRwQ2xpZW50fSBmcm9tIFwiLi91dGlsL0h0dHBDbGllbnRcIjtcclxuXHJcbndpbmRvdy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICBsZXQgaHR0cENsaWVudCA9IG5ldyBIdHRwQ2xpZW50KFwiaHR0cHM6Ly9jb21ncmlkLnJ1Ojg0NDNcIik7XHJcbiAgICBodHRwQ2xpZW50LnByb2NlZWRSZXF1ZXN0KFxyXG4gICAgICAgIG5ldyBJc0xvZ2dlZEluUmVxdWVzdCgpLFxyXG4gICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJ1bmF1dGhvcml6YXRlZFwiKTtcclxuICAgICAgICB9XHJcbiAgICApLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICQoJy5jbGlja2FibGUnKS50b2dnbGVDbGFzcygnZC1ub25lJyk7XHJcbiAgICB9KVxyXG59IiwiaW1wb3J0IHtSZXF1ZXN0V3JhcHBlcn0gZnJvbSBcIi4vcmVxdWVzdC9SZXF1ZXN0XCI7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEh0dHBDbGllbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBhcGlMaW5rOiBzdHJpbmcpIHt9XHJcblxyXG4gICAgYXN5bmMgcHJvY2VlZFJlcXVlc3Q8VD4oXHJcbiAgICAgICAgcmVxdWVzdDogUmVxdWVzdFdyYXBwZXI8VD4sXHJcbiAgICAgICAgb25GYWlsdXJlOiAoY29kZTogbnVtYmVyLCBlcnJvclRleHQ6IHN0cmluZykgPT4gdW5rbm93biA9XHJcbiAgICAgICAgICAgIChjb2RlLCBlcnJvclRleHQpID0+IGFsZXJ0KGBjb2RlOiAke2NvZGV9LCBlcnJvcjogJHtlcnJvclRleHR9YCksXHJcbiAgICAgICAgb25OZXR3b3JrRmFpbHVyZTogKHJlYXNvbikgPT4gdW5rbm93biA9XHJcbiAgICAgICAgICAgIChyZWFzb24pID0+IGFsZXJ0KGBuZXR3b3JrIGVycm9yOiAke3JlYXNvbn1gKVxyXG4gICAgKTogUHJvbWlzZTxUPntcclxuICAgICAgICBjb25zdCBmaW5hbExpbmsgPSBuZXcgVVJMKHRoaXMuYXBpTGluayArIHJlcXVlc3QuZW5kcG9pbnQpXHJcbiAgICAgICAgaWYocmVxdWVzdC5wYXJhbWV0ZXJzICE9IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgZmluYWxMaW5rLnNlYXJjaCA9IG5ldyBVUkxTZWFyY2hQYXJhbXMocmVxdWVzdC5wYXJhbWV0ZXJzKS50b1N0cmluZygpXHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKHJlcXVlc3QpXHJcbiAgICAgICAgcmV0dXJuIGZldGNoKFxyXG4gICAgICAgICAgICBmaW5hbExpbmsudG9TdHJpbmcoKSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwiaW5jbHVkZVwiLFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiByZXF1ZXN0Lm1ldGhvZFR5cGUsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiByZXF1ZXN0LmhlYWRlcnMsXHJcbiAgICAgICAgICAgICAgICBib2R5OiByZXF1ZXN0LmJvZHlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICkudGhlbigocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgaWYocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QucHJvY2VlZFJlcXVlc3QocmVzcG9uc2UpXHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UudGV4dCgpLnRoZW4odGV4dCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgb25GYWlsdXJlKHJlc3BvbnNlLnN0YXR1cywgdGV4dClcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QodGV4dClcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZW51bSBNZXRob2RUeXBle1xyXG4gICAgUE9TVD1cIlBPU1RcIixcclxuICAgIEdFVD1cIkdFVFwiLFxyXG4gICAgUEFUQ0g9XCJQQVRDSFwiLFxyXG4gICAgUFVUPVwiUFVUXCIsXHJcbn0iLCJpbXBvcnQge1JlcXVlc3RXcmFwcGVyfSBmcm9tIFwiLi9SZXF1ZXN0XCI7XHJcbmltcG9ydCB7TWV0aG9kVHlwZX0gZnJvbSBcIi4uL0h0dHBDbGllbnRcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgSXNMb2dnZWRJblJlcXVlc3QgaW1wbGVtZW50cyBSZXF1ZXN0V3JhcHBlcjxudW1iZXI+e1xyXG4gICAgcmVhZG9ubHkgZW5kcG9pbnQ6IHN0cmluZyA9ICcvdXNlci9sb2dpbic7XHJcbiAgICByZWFkb25seSBtZXRob2RUeXBlOiBNZXRob2RUeXBlID0gTWV0aG9kVHlwZS5HRVQ7XHJcblxyXG4gICAgYXN5bmMgcHJvY2VlZFJlcXVlc3QocmVzcG9uc2U6IFJlc3BvbnNlKTogUHJvbWlzZTxudW1iZXI+IHtcclxuICAgICAgICByZXR1cm4gcmVzcG9uc2Uuc3RhdHVzO1xyXG4gICAgfVxyXG59Il19
