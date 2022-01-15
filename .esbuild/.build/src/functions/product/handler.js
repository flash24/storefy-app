var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toESM = (module2, isNodeMode) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", !isNodeMode && module2 && module2.__esModule ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

// node_modules/@middy/core/index.js
var require_core = __commonJS({
  "node_modules/@middy/core/index.js"(exports, module2) {
    "use strict";
    var middy2 = (baseHandler = () => {
    }, plugin) => {
      var _plugin$beforePrefetc;
      plugin === null || plugin === void 0 ? void 0 : (_plugin$beforePrefetc = plugin.beforePrefetch) === null || _plugin$beforePrefetc === void 0 ? void 0 : _plugin$beforePrefetc.call(plugin);
      const beforeMiddlewares = [];
      const afterMiddlewares = [];
      const onErrorMiddlewares = [];
      const instance = (event = {}, context = {}) => {
        var _plugin$requestStart;
        plugin === null || plugin === void 0 ? void 0 : (_plugin$requestStart = plugin.requestStart) === null || _plugin$requestStart === void 0 ? void 0 : _plugin$requestStart.call(plugin);
        const request = {
          event,
          context,
          response: void 0,
          error: void 0,
          internal: {}
        };
        return runRequest(request, [...beforeMiddlewares], baseHandler, [...afterMiddlewares], [...onErrorMiddlewares], plugin);
      };
      instance.use = (middlewares) => {
        if (Array.isArray(middlewares)) {
          for (const middleware of middlewares) {
            instance.applyMiddleware(middleware);
          }
          return instance;
        }
        return instance.applyMiddleware(middlewares);
      };
      instance.applyMiddleware = (middleware) => {
        const {
          before,
          after,
          onError
        } = middleware;
        if (!before && !after && !onError) {
          throw new Error('Middleware must be an object containing at least one key among "before", "after", "onError"');
        }
        if (before)
          instance.before(before);
        if (after)
          instance.after(after);
        if (onError)
          instance.onError(onError);
        return instance;
      };
      instance.before = (beforeMiddleware) => {
        beforeMiddlewares.push(beforeMiddleware);
        return instance;
      };
      instance.after = (afterMiddleware) => {
        afterMiddlewares.unshift(afterMiddleware);
        return instance;
      };
      instance.onError = (onErrorMiddleware) => {
        onErrorMiddlewares.push(onErrorMiddleware);
        return instance;
      };
      instance.__middlewares = {
        before: beforeMiddlewares,
        after: afterMiddlewares,
        onError: onErrorMiddlewares
      };
      return instance;
    };
    var runRequest = async (request, beforeMiddlewares, baseHandler, afterMiddlewares, onErrorMiddlewares, plugin) => {
      try {
        await runMiddlewares(request, beforeMiddlewares, plugin);
        if (request.response === void 0) {
          var _plugin$beforeHandler, _plugin$afterHandler;
          plugin === null || plugin === void 0 ? void 0 : (_plugin$beforeHandler = plugin.beforeHandler) === null || _plugin$beforeHandler === void 0 ? void 0 : _plugin$beforeHandler.call(plugin);
          request.response = await baseHandler(request.event, request.context);
          plugin === null || plugin === void 0 ? void 0 : (_plugin$afterHandler = plugin.afterHandler) === null || _plugin$afterHandler === void 0 ? void 0 : _plugin$afterHandler.call(plugin);
          await runMiddlewares(request, afterMiddlewares, plugin);
        }
      } catch (e) {
        request.response = void 0;
        request.error = e;
        try {
          await runMiddlewares(request, onErrorMiddlewares, plugin);
        } catch (e2) {
          e2.originalError = request.error;
          request.error = e2;
          throw request.error;
        }
        if (request.response === void 0)
          throw request.error;
      } finally {
        var _plugin$requestEnd;
        await (plugin === null || plugin === void 0 ? void 0 : (_plugin$requestEnd = plugin.requestEnd) === null || _plugin$requestEnd === void 0 ? void 0 : _plugin$requestEnd.call(plugin, request));
      }
      return request.response;
    };
    var runMiddlewares = async (request, middlewares, plugin) => {
      for (const nextMiddleware of middlewares) {
        var _plugin$beforeMiddlew, _plugin$afterMiddlewa;
        plugin === null || plugin === void 0 ? void 0 : (_plugin$beforeMiddlew = plugin.beforeMiddleware) === null || _plugin$beforeMiddlew === void 0 ? void 0 : _plugin$beforeMiddlew.call(plugin, nextMiddleware === null || nextMiddleware === void 0 ? void 0 : nextMiddleware.name);
        const res = await (nextMiddleware === null || nextMiddleware === void 0 ? void 0 : nextMiddleware(request));
        plugin === null || plugin === void 0 ? void 0 : (_plugin$afterMiddlewa = plugin.afterMiddleware) === null || _plugin$afterMiddlewa === void 0 ? void 0 : _plugin$afterMiddlewa.call(plugin, nextMiddleware === null || nextMiddleware === void 0 ? void 0 : nextMiddleware.name);
        if (res !== void 0) {
          request.response = res;
          return;
        }
      }
    };
    module2.exports = middy2;
  }
});

// node_modules/@middy/util/codes.json
var require_codes = __commonJS({
  "node_modules/@middy/util/codes.json"(exports, module2) {
    module2.exports = {
      "100": "Continue",
      "101": "Switching Protocols",
      "102": "Processing",
      "103": "Early Hints",
      "200": "OK",
      "201": "Created",
      "202": "Accepted",
      "203": "Non-Authoritative Information",
      "204": "No Content",
      "205": "Reset Content",
      "206": "Partial Content",
      "207": "Multi-Status",
      "208": "Already Reported",
      "226": "IM Used",
      "300": "Multiple Choices",
      "301": "Moved Permanently",
      "302": "Found",
      "303": "See Other",
      "304": "Not Modified",
      "305": "Use Proxy",
      "306": "(Unused)",
      "307": "Temporary Redirect",
      "308": "Permanent Redirect",
      "400": "Bad Request",
      "401": "Unauthorized",
      "402": "Payment Required",
      "403": "Forbidden",
      "404": "Not Found",
      "405": "Method Not Allowed",
      "406": "Not Acceptable",
      "407": "Proxy Authentication Required",
      "408": "Request Timeout",
      "409": "Conflict",
      "410": "Gone",
      "411": "Length Required",
      "412": "Precondition Failed",
      "413": "Payload Too Large",
      "414": "URI Too Long",
      "415": "Unsupported Media Type",
      "416": "Range Not Satisfiable",
      "417": "Expectation Failed",
      "418": "I'm a teapot",
      "421": "Misdirected Request",
      "422": "Unprocessable Entity",
      "423": "Locked",
      "424": "Failed Dependency",
      "425": "Unordered Collection",
      "426": "Upgrade Required",
      "428": "Precondition Required",
      "429": "Too Many Requests",
      "431": "Request Header Fields Too Large",
      "451": "Unavailable For Legal Reasons",
      "500": "Internal Server Error",
      "501": "Not Implemented",
      "502": "Bad Gateway",
      "503": "Service Unavailable",
      "504": "Gateway Timeout",
      "505": "HTTP Version Not Supported",
      "506": "Variant Also Negotiates",
      "507": "Insufficient Storage",
      "508": "Loop Detected",
      "509": "Bandwidth Limit Exceeded",
      "510": "Not Extended",
      "511": "Network Authentication Required"
    };
  }
});

// node_modules/@middy/util/index.js
var require_util = __commonJS({
  "node_modules/@middy/util/index.js"(exports, module2) {
    "use strict";
    var {
      Agent
    } = require("https");
    var awsClientDefaultOptions = {
      httpOptions: {
        agent: new Agent({
          secureProtocol: "TLSv1_2_method"
        })
      }
    };
    var createPrefetchClient = (options) => {
      const awsClientOptions = __spreadValues(__spreadValues({}, awsClientDefaultOptions), options.awsClientOptions);
      const client = new options.AwsClient(awsClientOptions);
      if (options.awsClientCapture) {
        return options.awsClientCapture(client);
      }
      return client;
    };
    var createClient = async (options, request) => {
      let awsClientCredentials = {};
      if (options.awsClientAssumeRole) {
        if (!request)
          throw new Error("Request required when assuming role");
        awsClientCredentials = await getInternal({
          credentials: options.awsClientAssumeRole
        }, request);
      }
      awsClientCredentials = __spreadValues(__spreadValues({}, awsClientCredentials), options.awsClientOptions);
      return createPrefetchClient(__spreadProps(__spreadValues({}, options), {
        awsClientOptions: awsClientCredentials
      }));
    };
    var canPrefetch = (options) => {
      return !(options !== null && options !== void 0 && options.awsClientAssumeRole) && !(options !== null && options !== void 0 && options.disablePrefetch);
    };
    var getInternal = async (variables, request) => {
      if (!variables || !request)
        return {};
      let keys = [];
      let values = [];
      if (variables === true) {
        keys = values = Object.keys(request.internal);
      } else if (typeof variables === "string") {
        keys = values = [variables];
      } else if (Array.isArray(variables)) {
        keys = values = variables;
      } else if (typeof variables === "object") {
        keys = Object.keys(variables);
        values = Object.values(variables);
      }
      const promises = [];
      for (const internalKey of values) {
        var _valuePromise;
        const pathOptionKey = internalKey.split(".");
        const rootOptionKey = pathOptionKey.shift();
        let valuePromise = request.internal[rootOptionKey];
        if (typeof ((_valuePromise = valuePromise) === null || _valuePromise === void 0 ? void 0 : _valuePromise.then) !== "function") {
          valuePromise = Promise.resolve(valuePromise);
        }
        promises.push(valuePromise.then((value) => pathOptionKey.reduce((p, c) => p === null || p === void 0 ? void 0 : p[c], value)));
      }
      values = await Promise.allSettled(promises);
      const errors = values.filter((res) => res.status === "rejected").map((res) => res.reason.message);
      if (errors.length)
        throw new Error(JSON.stringify(errors));
      return keys.reduce((obj, key, index) => __spreadProps(__spreadValues({}, obj), {
        [sanitizeKey(key)]: values[index].value
      }), {});
    };
    var sanitizeKeyPrefixLeadingNumber = /^([0-9])/;
    var sanitizeKeyRemoveDisallowedChar = /[^a-zA-Z0-9]+/g;
    var sanitizeKey = (key) => {
      return key.replace(sanitizeKeyPrefixLeadingNumber, "_$1").replace(sanitizeKeyRemoveDisallowedChar, "_");
    };
    var cache = {};
    var processCache = (options, fetch = () => void 0, request) => {
      const {
        cacheExpiry,
        cacheKey
      } = options;
      if (cacheExpiry) {
        const cached = getCache(cacheKey);
        const unexpired = cached && (cacheExpiry < 0 || cached.expiry > Date.now());
        if (unexpired && cached.modified) {
          const value2 = fetch(request, cached.value);
          cache[cacheKey] = {
            value: __spreadValues(__spreadValues({}, cached.value), value2),
            expiry: cached.expiry
          };
          return cache[cacheKey];
        }
        if (unexpired) {
          return __spreadProps(__spreadValues({}, cached), {
            cache: true
          });
        }
      }
      const value = fetch(request);
      const expiry = Date.now() + cacheExpiry;
      if (cacheExpiry) {
        cache[cacheKey] = {
          value,
          expiry
        };
      }
      return {
        value,
        expiry
      };
    };
    var getCache = (key) => {
      return cache[key];
    };
    var modifyCache = (cacheKey, value) => {
      if (!cache[cacheKey])
        return;
      cache[cacheKey] = __spreadProps(__spreadValues({}, cache[cacheKey]), {
        value,
        modified: true
      });
    };
    var clearCache = (keys = null) => {
      var _keys;
      keys = (_keys = keys) !== null && _keys !== void 0 ? _keys : Object.keys(cache);
      if (!Array.isArray(keys))
        keys = [keys];
      for (const cacheKey of keys) {
        cache[cacheKey] = void 0;
      }
    };
    var jsonSafeParse = (string, reviver) => {
      if (typeof string !== "string")
        return string;
      const firstChar = string[0];
      if (firstChar !== "{" && firstChar !== "[" && firstChar !== '"')
        return string;
      try {
        return JSON.parse(string, reviver);
      } catch (e) {
      }
      return string;
    };
    var normalizeHttpResponse = (response) => {
      var _response$headers, _response;
      if (response === void 0) {
        response = {};
      } else if (Array.isArray(response) || typeof response !== "object" || response === null) {
        response = {
          body: response
        };
      }
      response.headers = (_response$headers = (_response = response) === null || _response === void 0 ? void 0 : _response.headers) !== null && _response$headers !== void 0 ? _response$headers : {};
      return response;
    };
    var statuses = require_codes();
    var {
      inherits
    } = require("util");
    var createErrorRegexp = /[^a-zA-Z]/g;
    var createError = (code, message, properties = {}) => {
      const name2 = statuses[code].replace(createErrorRegexp, "");
      const className = name2.substr(-5) !== "Error" ? name2 + "Error" : name2;
      function HttpError(message2) {
        const msg = message2 !== null && message2 !== void 0 ? message2 : statuses[code];
        const err = new Error(msg);
        Error.captureStackTrace(err, HttpError);
        Object.setPrototypeOf(err, HttpError.prototype);
        Object.defineProperty(err, "message", {
          enumerable: true,
          configurable: true,
          value: msg,
          writable: true
        });
        Object.defineProperty(err, "name", {
          enumerable: false,
          configurable: true,
          value: className,
          writable: true
        });
        return err;
      }
      inherits(HttpError, Error);
      const desc = Object.getOwnPropertyDescriptor(HttpError, "name");
      desc.value = className;
      Object.defineProperty(HttpError, "name", desc);
      Object.assign(HttpError.prototype, {
        status: code,
        statusCode: code,
        expose: code < 500
      }, properties);
      return new HttpError(message);
    };
    module2.exports = {
      createPrefetchClient,
      createClient,
      canPrefetch,
      getInternal,
      sanitizeKey,
      processCache,
      getCache,
      modifyCache,
      clearCache,
      jsonSafeParse,
      normalizeHttpResponse,
      createError
    };
  }
});

// node_modules/@middy/http-json-body-parser/index.js
var require_http_json_body_parser = __commonJS({
  "node_modules/@middy/http-json-body-parser/index.js"(exports, module2) {
    "use strict";
    var mimePattern = /^application\/(.+\+)?json(;.*)?$/;
    var defaults = {
      reviver: void 0
    };
    var httpJsonBodyParserMiddleware = (opts = {}) => {
      const options = __spreadValues(__spreadValues({}, defaults), opts);
      const httpJsonBodyParserMiddlewareBefore = async (request) => {
        var _headers$ContentType;
        const {
          headers,
          body
        } = request.event;
        const contentTypeHeader = (_headers$ContentType = headers === null || headers === void 0 ? void 0 : headers["Content-Type"]) !== null && _headers$ContentType !== void 0 ? _headers$ContentType : headers === null || headers === void 0 ? void 0 : headers["content-type"];
        if (mimePattern.test(contentTypeHeader)) {
          try {
            const data = request.event.isBase64Encoded ? Buffer.from(body, "base64").toString() : body;
            request.event.rawBody = body;
            request.event.body = JSON.parse(data, options.reviver);
          } catch (err) {
            const {
              createError
            } = require_util();
            throw createError(422, "Content type defined as JSON but an invalid JSON was provided");
          }
        }
      };
      return {
        before: httpJsonBodyParserMiddlewareBefore
      };
    };
    module2.exports = httpJsonBodyParserMiddleware;
  }
});

// node_modules/uuid/dist/rng.js
var require_rng = __commonJS({
  "node_modules/uuid/dist/rng.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = rng;
    var _crypto = _interopRequireDefault(require("crypto"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var rnds8Pool = new Uint8Array(256);
    var poolPtr = rnds8Pool.length;
    function rng() {
      if (poolPtr > rnds8Pool.length - 16) {
        _crypto.default.randomFillSync(rnds8Pool);
        poolPtr = 0;
      }
      return rnds8Pool.slice(poolPtr, poolPtr += 16);
    }
  }
});

// node_modules/uuid/dist/regex.js
var require_regex = __commonJS({
  "node_modules/uuid/dist/regex.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
    exports.default = _default;
  }
});

// node_modules/uuid/dist/validate.js
var require_validate = __commonJS({
  "node_modules/uuid/dist/validate.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _regex = _interopRequireDefault(require_regex());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function validate3(uuid2) {
      return typeof uuid2 === "string" && _regex.default.test(uuid2);
    }
    var _default = validate3;
    exports.default = _default;
  }
});

// node_modules/uuid/dist/stringify.js
var require_stringify = __commonJS({
  "node_modules/uuid/dist/stringify.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _validate = _interopRequireDefault(require_validate());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var byteToHex = [];
    for (let i = 0; i < 256; ++i) {
      byteToHex.push((i + 256).toString(16).substr(1));
    }
    function stringify2(arr, offset = 0) {
      const uuid2 = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
      if (!(0, _validate.default)(uuid2)) {
        throw TypeError("Stringified UUID is invalid");
      }
      return uuid2;
    }
    var _default = stringify2;
    exports.default = _default;
  }
});

// node_modules/uuid/dist/v1.js
var require_v1 = __commonJS({
  "node_modules/uuid/dist/v1.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _rng = _interopRequireDefault(require_rng());
    var _stringify = _interopRequireDefault(require_stringify());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var _nodeId;
    var _clockseq;
    var _lastMSecs = 0;
    var _lastNSecs = 0;
    function v12(options, buf, offset) {
      let i = buf && offset || 0;
      const b = buf || new Array(16);
      options = options || {};
      let node = options.node || _nodeId;
      let clockseq = options.clockseq !== void 0 ? options.clockseq : _clockseq;
      if (node == null || clockseq == null) {
        const seedBytes = options.random || (options.rng || _rng.default)();
        if (node == null) {
          node = _nodeId = [seedBytes[0] | 1, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
        }
        if (clockseq == null) {
          clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 16383;
        }
      }
      let msecs = options.msecs !== void 0 ? options.msecs : Date.now();
      let nsecs = options.nsecs !== void 0 ? options.nsecs : _lastNSecs + 1;
      const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 1e4;
      if (dt < 0 && options.clockseq === void 0) {
        clockseq = clockseq + 1 & 16383;
      }
      if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === void 0) {
        nsecs = 0;
      }
      if (nsecs >= 1e4) {
        throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
      }
      _lastMSecs = msecs;
      _lastNSecs = nsecs;
      _clockseq = clockseq;
      msecs += 122192928e5;
      const tl = ((msecs & 268435455) * 1e4 + nsecs) % 4294967296;
      b[i++] = tl >>> 24 & 255;
      b[i++] = tl >>> 16 & 255;
      b[i++] = tl >>> 8 & 255;
      b[i++] = tl & 255;
      const tmh = msecs / 4294967296 * 1e4 & 268435455;
      b[i++] = tmh >>> 8 & 255;
      b[i++] = tmh & 255;
      b[i++] = tmh >>> 24 & 15 | 16;
      b[i++] = tmh >>> 16 & 255;
      b[i++] = clockseq >>> 8 | 128;
      b[i++] = clockseq & 255;
      for (let n = 0; n < 6; ++n) {
        b[i + n] = node[n];
      }
      return buf || (0, _stringify.default)(b);
    }
    var _default = v12;
    exports.default = _default;
  }
});

// node_modules/uuid/dist/parse.js
var require_parse = __commonJS({
  "node_modules/uuid/dist/parse.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _validate = _interopRequireDefault(require_validate());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function parse2(uuid2) {
      if (!(0, _validate.default)(uuid2)) {
        throw TypeError("Invalid UUID");
      }
      let v;
      const arr = new Uint8Array(16);
      arr[0] = (v = parseInt(uuid2.slice(0, 8), 16)) >>> 24;
      arr[1] = v >>> 16 & 255;
      arr[2] = v >>> 8 & 255;
      arr[3] = v & 255;
      arr[4] = (v = parseInt(uuid2.slice(9, 13), 16)) >>> 8;
      arr[5] = v & 255;
      arr[6] = (v = parseInt(uuid2.slice(14, 18), 16)) >>> 8;
      arr[7] = v & 255;
      arr[8] = (v = parseInt(uuid2.slice(19, 23), 16)) >>> 8;
      arr[9] = v & 255;
      arr[10] = (v = parseInt(uuid2.slice(24, 36), 16)) / 1099511627776 & 255;
      arr[11] = v / 4294967296 & 255;
      arr[12] = v >>> 24 & 255;
      arr[13] = v >>> 16 & 255;
      arr[14] = v >>> 8 & 255;
      arr[15] = v & 255;
      return arr;
    }
    var _default = parse2;
    exports.default = _default;
  }
});

// node_modules/uuid/dist/v35.js
var require_v35 = __commonJS({
  "node_modules/uuid/dist/v35.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = _default;
    exports.URL = exports.DNS = void 0;
    var _stringify = _interopRequireDefault(require_stringify());
    var _parse = _interopRequireDefault(require_parse());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function stringToBytes(str) {
      str = unescape(encodeURIComponent(str));
      const bytes = [];
      for (let i = 0; i < str.length; ++i) {
        bytes.push(str.charCodeAt(i));
      }
      return bytes;
    }
    var DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
    exports.DNS = DNS;
    var URL = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
    exports.URL = URL;
    function _default(name2, version2, hashfunc) {
      function generateUUID(value, namespace, buf, offset) {
        if (typeof value === "string") {
          value = stringToBytes(value);
        }
        if (typeof namespace === "string") {
          namespace = (0, _parse.default)(namespace);
        }
        if (namespace.length !== 16) {
          throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
        }
        let bytes = new Uint8Array(16 + value.length);
        bytes.set(namespace);
        bytes.set(value, namespace.length);
        bytes = hashfunc(bytes);
        bytes[6] = bytes[6] & 15 | version2;
        bytes[8] = bytes[8] & 63 | 128;
        if (buf) {
          offset = offset || 0;
          for (let i = 0; i < 16; ++i) {
            buf[offset + i] = bytes[i];
          }
          return buf;
        }
        return (0, _stringify.default)(bytes);
      }
      try {
        generateUUID.name = name2;
      } catch (err) {
      }
      generateUUID.DNS = DNS;
      generateUUID.URL = URL;
      return generateUUID;
    }
  }
});

// node_modules/uuid/dist/md5.js
var require_md5 = __commonJS({
  "node_modules/uuid/dist/md5.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _crypto = _interopRequireDefault(require("crypto"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function md5(bytes) {
      if (Array.isArray(bytes)) {
        bytes = Buffer.from(bytes);
      } else if (typeof bytes === "string") {
        bytes = Buffer.from(bytes, "utf8");
      }
      return _crypto.default.createHash("md5").update(bytes).digest();
    }
    var _default = md5;
    exports.default = _default;
  }
});

// node_modules/uuid/dist/v3.js
var require_v3 = __commonJS({
  "node_modules/uuid/dist/v3.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _v = _interopRequireDefault(require_v35());
    var _md = _interopRequireDefault(require_md5());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var v32 = (0, _v.default)("v3", 48, _md.default);
    var _default = v32;
    exports.default = _default;
  }
});

// node_modules/uuid/dist/v4.js
var require_v4 = __commonJS({
  "node_modules/uuid/dist/v4.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _rng = _interopRequireDefault(require_rng());
    var _stringify = _interopRequireDefault(require_stringify());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function v42(options, buf, offset) {
      options = options || {};
      const rnds = options.random || (options.rng || _rng.default)();
      rnds[6] = rnds[6] & 15 | 64;
      rnds[8] = rnds[8] & 63 | 128;
      if (buf) {
        offset = offset || 0;
        for (let i = 0; i < 16; ++i) {
          buf[offset + i] = rnds[i];
        }
        return buf;
      }
      return (0, _stringify.default)(rnds);
    }
    var _default = v42;
    exports.default = _default;
  }
});

// node_modules/uuid/dist/sha1.js
var require_sha1 = __commonJS({
  "node_modules/uuid/dist/sha1.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _crypto = _interopRequireDefault(require("crypto"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function sha1(bytes) {
      if (Array.isArray(bytes)) {
        bytes = Buffer.from(bytes);
      } else if (typeof bytes === "string") {
        bytes = Buffer.from(bytes, "utf8");
      }
      return _crypto.default.createHash("sha1").update(bytes).digest();
    }
    var _default = sha1;
    exports.default = _default;
  }
});

// node_modules/uuid/dist/v5.js
var require_v5 = __commonJS({
  "node_modules/uuid/dist/v5.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _v = _interopRequireDefault(require_v35());
    var _sha = _interopRequireDefault(require_sha1());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var v52 = (0, _v.default)("v5", 80, _sha.default);
    var _default = v52;
    exports.default = _default;
  }
});

// node_modules/uuid/dist/nil.js
var require_nil = __commonJS({
  "node_modules/uuid/dist/nil.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _default = "00000000-0000-0000-0000-000000000000";
    exports.default = _default;
  }
});

// node_modules/uuid/dist/version.js
var require_version = __commonJS({
  "node_modules/uuid/dist/version.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _validate = _interopRequireDefault(require_validate());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function version2(uuid2) {
      if (!(0, _validate.default)(uuid2)) {
        throw TypeError("Invalid UUID");
      }
      return parseInt(uuid2.substr(14, 1), 16);
    }
    var _default = version2;
    exports.default = _default;
  }
});

// node_modules/uuid/dist/index.js
var require_dist = __commonJS({
  "node_modules/uuid/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    Object.defineProperty(exports, "v1", {
      enumerable: true,
      get: function() {
        return _v.default;
      }
    });
    Object.defineProperty(exports, "v3", {
      enumerable: true,
      get: function() {
        return _v2.default;
      }
    });
    Object.defineProperty(exports, "v4", {
      enumerable: true,
      get: function() {
        return _v3.default;
      }
    });
    Object.defineProperty(exports, "v5", {
      enumerable: true,
      get: function() {
        return _v4.default;
      }
    });
    Object.defineProperty(exports, "NIL", {
      enumerable: true,
      get: function() {
        return _nil.default;
      }
    });
    Object.defineProperty(exports, "version", {
      enumerable: true,
      get: function() {
        return _version.default;
      }
    });
    Object.defineProperty(exports, "validate", {
      enumerable: true,
      get: function() {
        return _validate.default;
      }
    });
    Object.defineProperty(exports, "stringify", {
      enumerable: true,
      get: function() {
        return _stringify.default;
      }
    });
    Object.defineProperty(exports, "parse", {
      enumerable: true,
      get: function() {
        return _parse.default;
      }
    });
    var _v = _interopRequireDefault(require_v1());
    var _v2 = _interopRequireDefault(require_v3());
    var _v3 = _interopRequireDefault(require_v4());
    var _v4 = _interopRequireDefault(require_v5());
    var _nil = _interopRequireDefault(require_nil());
    var _version = _interopRequireDefault(require_version());
    var _validate = _interopRequireDefault(require_validate());
    var _stringify = _interopRequireDefault(require_stringify());
    var _parse = _interopRequireDefault(require_parse());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
  }
});

// node_modules/validate.js/validate.js
var require_validate2 = __commonJS({
  "node_modules/validate.js/validate.js"(exports, module2) {
    (function(exports2, module3, define2) {
      "use strict";
      var validate3 = function(attributes, constraints, options) {
        options = v.extend({}, v.options, options);
        var results = v.runValidations(attributes, constraints, options), attr, validator;
        if (results.some(function(r) {
          return v.isPromise(r.error);
        })) {
          throw new Error("Use validate.async if you want support for promises");
        }
        return validate3.processValidationResults(results, options);
      };
      var v = validate3;
      v.extend = function(obj) {
        [].slice.call(arguments, 1).forEach(function(source) {
          for (var attr in source) {
            obj[attr] = source[attr];
          }
        });
        return obj;
      };
      v.extend(validate3, {
        version: {
          major: 0,
          minor: 13,
          patch: 1,
          metadata: null,
          toString: function() {
            var version2 = v.format("%{major}.%{minor}.%{patch}", v.version);
            if (!v.isEmpty(v.version.metadata)) {
              version2 += "+" + v.version.metadata;
            }
            return version2;
          }
        },
        Promise: typeof Promise !== "undefined" ? Promise : null,
        EMPTY_STRING_REGEXP: /^\s*$/,
        runValidations: function(attributes, constraints, options) {
          var results = [], attr, validatorName, value, validators, validator, validatorOptions, error;
          if (v.isDomElement(attributes) || v.isJqueryElement(attributes)) {
            attributes = v.collectFormValues(attributes);
          }
          for (attr in constraints) {
            value = v.getDeepObjectValue(attributes, attr);
            validators = v.result(constraints[attr], value, attributes, attr, options, constraints);
            for (validatorName in validators) {
              validator = v.validators[validatorName];
              if (!validator) {
                error = v.format("Unknown validator %{name}", { name: validatorName });
                throw new Error(error);
              }
              validatorOptions = validators[validatorName];
              validatorOptions = v.result(validatorOptions, value, attributes, attr, options, constraints);
              if (!validatorOptions) {
                continue;
              }
              results.push({
                attribute: attr,
                value,
                validator: validatorName,
                globalOptions: options,
                attributes,
                options: validatorOptions,
                error: validator.call(validator, value, validatorOptions, attr, attributes, options)
              });
            }
          }
          return results;
        },
        processValidationResults: function(errors, options) {
          errors = v.pruneEmptyErrors(errors, options);
          errors = v.expandMultipleErrors(errors, options);
          errors = v.convertErrorMessages(errors, options);
          var format = options.format || "grouped";
          if (typeof v.formatters[format] === "function") {
            errors = v.formatters[format](errors);
          } else {
            throw new Error(v.format("Unknown format %{format}", options));
          }
          return v.isEmpty(errors) ? void 0 : errors;
        },
        async: function(attributes, constraints, options) {
          options = v.extend({}, v.async.options, options);
          var WrapErrors = options.wrapErrors || function(errors) {
            return errors;
          };
          if (options.cleanAttributes !== false) {
            attributes = v.cleanAttributes(attributes, constraints);
          }
          var results = v.runValidations(attributes, constraints, options);
          return new v.Promise(function(resolve, reject) {
            v.waitForResults(results).then(function() {
              var errors = v.processValidationResults(results, options);
              if (errors) {
                reject(new WrapErrors(errors, options, attributes, constraints));
              } else {
                resolve(attributes);
              }
            }, function(err) {
              reject(err);
            });
          });
        },
        single: function(value, constraints, options) {
          options = v.extend({}, v.single.options, options, {
            format: "flat",
            fullMessages: false
          });
          return v({ single: value }, { single: constraints }, options);
        },
        waitForResults: function(results) {
          return results.reduce(function(memo, result) {
            if (!v.isPromise(result.error)) {
              return memo;
            }
            return memo.then(function() {
              return result.error.then(function(error) {
                result.error = error || null;
              });
            });
          }, new v.Promise(function(r) {
            r();
          }));
        },
        result: function(value) {
          var args = [].slice.call(arguments, 1);
          if (typeof value === "function") {
            value = value.apply(null, args);
          }
          return value;
        },
        isNumber: function(value) {
          return typeof value === "number" && !isNaN(value);
        },
        isFunction: function(value) {
          return typeof value === "function";
        },
        isInteger: function(value) {
          return v.isNumber(value) && value % 1 === 0;
        },
        isBoolean: function(value) {
          return typeof value === "boolean";
        },
        isObject: function(obj) {
          return obj === Object(obj);
        },
        isDate: function(obj) {
          return obj instanceof Date;
        },
        isDefined: function(obj) {
          return obj !== null && obj !== void 0;
        },
        isPromise: function(p) {
          return !!p && v.isFunction(p.then);
        },
        isJqueryElement: function(o) {
          return o && v.isString(o.jquery);
        },
        isDomElement: function(o) {
          if (!o) {
            return false;
          }
          if (!o.querySelectorAll || !o.querySelector) {
            return false;
          }
          if (v.isObject(document) && o === document) {
            return true;
          }
          if (typeof HTMLElement === "object") {
            return o instanceof HTMLElement;
          } else {
            return o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string";
          }
        },
        isEmpty: function(value) {
          var attr;
          if (!v.isDefined(value)) {
            return true;
          }
          if (v.isFunction(value)) {
            return false;
          }
          if (v.isString(value)) {
            return v.EMPTY_STRING_REGEXP.test(value);
          }
          if (v.isArray(value)) {
            return value.length === 0;
          }
          if (v.isDate(value)) {
            return false;
          }
          if (v.isObject(value)) {
            for (attr in value) {
              return false;
            }
            return true;
          }
          return false;
        },
        format: v.extend(function(str, vals) {
          if (!v.isString(str)) {
            return str;
          }
          return str.replace(v.format.FORMAT_REGEXP, function(m0, m1, m2) {
            if (m1 === "%") {
              return "%{" + m2 + "}";
            } else {
              return String(vals[m2]);
            }
          });
        }, {
          FORMAT_REGEXP: /(%?)%\{([^\}]+)\}/g
        }),
        prettify: function(str) {
          if (v.isNumber(str)) {
            if (str * 100 % 1 === 0) {
              return "" + str;
            } else {
              return parseFloat(Math.round(str * 100) / 100).toFixed(2);
            }
          }
          if (v.isArray(str)) {
            return str.map(function(s) {
              return v.prettify(s);
            }).join(", ");
          }
          if (v.isObject(str)) {
            if (!v.isDefined(str.toString)) {
              return JSON.stringify(str);
            }
            return str.toString();
          }
          str = "" + str;
          return str.replace(/([^\s])\.([^\s])/g, "$1 $2").replace(/\\+/g, "").replace(/[_-]/g, " ").replace(/([a-z])([A-Z])/g, function(m0, m1, m2) {
            return "" + m1 + " " + m2.toLowerCase();
          }).toLowerCase();
        },
        stringifyValue: function(value, options) {
          var prettify = options && options.prettify || v.prettify;
          return prettify(value);
        },
        isString: function(value) {
          return typeof value === "string";
        },
        isArray: function(value) {
          return {}.toString.call(value) === "[object Array]";
        },
        isHash: function(value) {
          return v.isObject(value) && !v.isArray(value) && !v.isFunction(value);
        },
        contains: function(obj, value) {
          if (!v.isDefined(obj)) {
            return false;
          }
          if (v.isArray(obj)) {
            return obj.indexOf(value) !== -1;
          }
          return value in obj;
        },
        unique: function(array) {
          if (!v.isArray(array)) {
            return array;
          }
          return array.filter(function(el, index, array2) {
            return array2.indexOf(el) == index;
          });
        },
        forEachKeyInKeypath: function(object, keypath, callback) {
          if (!v.isString(keypath)) {
            return void 0;
          }
          var key = "", i, escape = false;
          for (i = 0; i < keypath.length; ++i) {
            switch (keypath[i]) {
              case ".":
                if (escape) {
                  escape = false;
                  key += ".";
                } else {
                  object = callback(object, key, false);
                  key = "";
                }
                break;
              case "\\":
                if (escape) {
                  escape = false;
                  key += "\\";
                } else {
                  escape = true;
                }
                break;
              default:
                escape = false;
                key += keypath[i];
                break;
            }
          }
          return callback(object, key, true);
        },
        getDeepObjectValue: function(obj, keypath) {
          if (!v.isObject(obj)) {
            return void 0;
          }
          return v.forEachKeyInKeypath(obj, keypath, function(obj2, key) {
            if (v.isObject(obj2)) {
              return obj2[key];
            }
          });
        },
        collectFormValues: function(form, options) {
          var values = {}, i, j, input, inputs, option, value;
          if (v.isJqueryElement(form)) {
            form = form[0];
          }
          if (!form) {
            return values;
          }
          options = options || {};
          inputs = form.querySelectorAll("input[name], textarea[name]");
          for (i = 0; i < inputs.length; ++i) {
            input = inputs.item(i);
            if (v.isDefined(input.getAttribute("data-ignored"))) {
              continue;
            }
            var name2 = input.name.replace(/\./g, "\\\\.");
            value = v.sanitizeFormValue(input.value, options);
            if (input.type === "number") {
              value = value ? +value : null;
            } else if (input.type === "checkbox") {
              if (input.attributes.value) {
                if (!input.checked) {
                  value = values[name2] || null;
                }
              } else {
                value = input.checked;
              }
            } else if (input.type === "radio") {
              if (!input.checked) {
                value = values[name2] || null;
              }
            }
            values[name2] = value;
          }
          inputs = form.querySelectorAll("select[name]");
          for (i = 0; i < inputs.length; ++i) {
            input = inputs.item(i);
            if (v.isDefined(input.getAttribute("data-ignored"))) {
              continue;
            }
            if (input.multiple) {
              value = [];
              for (j in input.options) {
                option = input.options[j];
                if (option && option.selected) {
                  value.push(v.sanitizeFormValue(option.value, options));
                }
              }
            } else {
              var _val = typeof input.options[input.selectedIndex] !== "undefined" ? input.options[input.selectedIndex].value : "";
              value = v.sanitizeFormValue(_val, options);
            }
            values[input.name] = value;
          }
          return values;
        },
        sanitizeFormValue: function(value, options) {
          if (options.trim && v.isString(value)) {
            value = value.trim();
          }
          if (options.nullify !== false && value === "") {
            return null;
          }
          return value;
        },
        capitalize: function(str) {
          if (!v.isString(str)) {
            return str;
          }
          return str[0].toUpperCase() + str.slice(1);
        },
        pruneEmptyErrors: function(errors) {
          return errors.filter(function(error) {
            return !v.isEmpty(error.error);
          });
        },
        expandMultipleErrors: function(errors) {
          var ret = [];
          errors.forEach(function(error) {
            if (v.isArray(error.error)) {
              error.error.forEach(function(msg) {
                ret.push(v.extend({}, error, { error: msg }));
              });
            } else {
              ret.push(error);
            }
          });
          return ret;
        },
        convertErrorMessages: function(errors, options) {
          options = options || {};
          var ret = [], prettify = options.prettify || v.prettify;
          errors.forEach(function(errorInfo) {
            var error = v.result(errorInfo.error, errorInfo.value, errorInfo.attribute, errorInfo.options, errorInfo.attributes, errorInfo.globalOptions);
            if (!v.isString(error)) {
              ret.push(errorInfo);
              return;
            }
            if (error[0] === "^") {
              error = error.slice(1);
            } else if (options.fullMessages !== false) {
              error = v.capitalize(prettify(errorInfo.attribute)) + " " + error;
            }
            error = error.replace(/\\\^/g, "^");
            error = v.format(error, {
              value: v.stringifyValue(errorInfo.value, options)
            });
            ret.push(v.extend({}, errorInfo, { error }));
          });
          return ret;
        },
        groupErrorsByAttribute: function(errors) {
          var ret = {};
          errors.forEach(function(error) {
            var list = ret[error.attribute];
            if (list) {
              list.push(error);
            } else {
              ret[error.attribute] = [error];
            }
          });
          return ret;
        },
        flattenErrorsToArray: function(errors) {
          return errors.map(function(error) {
            return error.error;
          }).filter(function(value, index, self) {
            return self.indexOf(value) === index;
          });
        },
        cleanAttributes: function(attributes, whitelist) {
          function whitelistCreator(obj, key, last) {
            if (v.isObject(obj[key])) {
              return obj[key];
            }
            return obj[key] = last ? true : {};
          }
          function buildObjectWhitelist(whitelist2) {
            var ow = {}, lastObject, attr;
            for (attr in whitelist2) {
              if (!whitelist2[attr]) {
                continue;
              }
              v.forEachKeyInKeypath(ow, attr, whitelistCreator);
            }
            return ow;
          }
          function cleanRecursive(attributes2, whitelist2) {
            if (!v.isObject(attributes2)) {
              return attributes2;
            }
            var ret = v.extend({}, attributes2), w, attribute;
            for (attribute in attributes2) {
              w = whitelist2[attribute];
              if (v.isObject(w)) {
                ret[attribute] = cleanRecursive(ret[attribute], w);
              } else if (!w) {
                delete ret[attribute];
              }
            }
            return ret;
          }
          if (!v.isObject(whitelist) || !v.isObject(attributes)) {
            return {};
          }
          whitelist = buildObjectWhitelist(whitelist);
          return cleanRecursive(attributes, whitelist);
        },
        exposeModule: function(validate4, root, exports3, module4, define3) {
          if (exports3) {
            if (module4 && module4.exports) {
              exports3 = module4.exports = validate4;
            }
            exports3.validate = validate4;
          } else {
            root.validate = validate4;
            if (validate4.isFunction(define3) && define3.amd) {
              define3([], function() {
                return validate4;
              });
            }
          }
        },
        warn: function(msg) {
          if (typeof console !== "undefined" && console.warn) {
            console.warn("[validate.js] " + msg);
          }
        },
        error: function(msg) {
          if (typeof console !== "undefined" && console.error) {
            console.error("[validate.js] " + msg);
          }
        }
      });
      validate3.validators = {
        presence: function(value, options) {
          options = v.extend({}, this.options, options);
          if (options.allowEmpty !== false ? !v.isDefined(value) : v.isEmpty(value)) {
            return options.message || this.message || "can't be blank";
          }
        },
        length: function(value, options, attribute) {
          if (!v.isDefined(value)) {
            return;
          }
          options = v.extend({}, this.options, options);
          var is = options.is, maximum = options.maximum, minimum = options.minimum, tokenizer = options.tokenizer || function(val) {
            return val;
          }, err, errors = [];
          value = tokenizer(value);
          var length = value.length;
          if (!v.isNumber(length)) {
            return options.message || this.notValid || "has an incorrect length";
          }
          if (v.isNumber(is) && length !== is) {
            err = options.wrongLength || this.wrongLength || "is the wrong length (should be %{count} characters)";
            errors.push(v.format(err, { count: is }));
          }
          if (v.isNumber(minimum) && length < minimum) {
            err = options.tooShort || this.tooShort || "is too short (minimum is %{count} characters)";
            errors.push(v.format(err, { count: minimum }));
          }
          if (v.isNumber(maximum) && length > maximum) {
            err = options.tooLong || this.tooLong || "is too long (maximum is %{count} characters)";
            errors.push(v.format(err, { count: maximum }));
          }
          if (errors.length > 0) {
            return options.message || errors;
          }
        },
        numericality: function(value, options, attribute, attributes, globalOptions) {
          if (!v.isDefined(value)) {
            return;
          }
          options = v.extend({}, this.options, options);
          var errors = [], name2, count, checks = {
            greaterThan: function(v2, c) {
              return v2 > c;
            },
            greaterThanOrEqualTo: function(v2, c) {
              return v2 >= c;
            },
            equalTo: function(v2, c) {
              return v2 === c;
            },
            lessThan: function(v2, c) {
              return v2 < c;
            },
            lessThanOrEqualTo: function(v2, c) {
              return v2 <= c;
            },
            divisibleBy: function(v2, c) {
              return v2 % c === 0;
            }
          }, prettify = options.prettify || globalOptions && globalOptions.prettify || v.prettify;
          if (v.isString(value) && options.strict) {
            var pattern = "^-?(0|[1-9]\\d*)";
            if (!options.onlyInteger) {
              pattern += "(\\.\\d+)?";
            }
            pattern += "$";
            if (!new RegExp(pattern).test(value)) {
              return options.message || options.notValid || this.notValid || this.message || "must be a valid number";
            }
          }
          if (options.noStrings !== true && v.isString(value) && !v.isEmpty(value)) {
            value = +value;
          }
          if (!v.isNumber(value)) {
            return options.message || options.notValid || this.notValid || this.message || "is not a number";
          }
          if (options.onlyInteger && !v.isInteger(value)) {
            return options.message || options.notInteger || this.notInteger || this.message || "must be an integer";
          }
          for (name2 in checks) {
            count = options[name2];
            if (v.isNumber(count) && !checks[name2](value, count)) {
              var key = "not" + v.capitalize(name2);
              var msg = options[key] || this[key] || this.message || "must be %{type} %{count}";
              errors.push(v.format(msg, {
                count,
                type: prettify(name2)
              }));
            }
          }
          if (options.odd && value % 2 !== 1) {
            errors.push(options.notOdd || this.notOdd || this.message || "must be odd");
          }
          if (options.even && value % 2 !== 0) {
            errors.push(options.notEven || this.notEven || this.message || "must be even");
          }
          if (errors.length) {
            return options.message || errors;
          }
        },
        datetime: v.extend(function(value, options) {
          if (!v.isFunction(this.parse) || !v.isFunction(this.format)) {
            throw new Error("Both the parse and format functions needs to be set to use the datetime/date validator");
          }
          if (!v.isDefined(value)) {
            return;
          }
          options = v.extend({}, this.options, options);
          var err, errors = [], earliest = options.earliest ? this.parse(options.earliest, options) : NaN, latest = options.latest ? this.parse(options.latest, options) : NaN;
          value = this.parse(value, options);
          if (isNaN(value) || options.dateOnly && value % 864e5 !== 0) {
            err = options.notValid || options.message || this.notValid || "must be a valid date";
            return v.format(err, { value: arguments[0] });
          }
          if (!isNaN(earliest) && value < earliest) {
            err = options.tooEarly || options.message || this.tooEarly || "must be no earlier than %{date}";
            err = v.format(err, {
              value: this.format(value, options),
              date: this.format(earliest, options)
            });
            errors.push(err);
          }
          if (!isNaN(latest) && value > latest) {
            err = options.tooLate || options.message || this.tooLate || "must be no later than %{date}";
            err = v.format(err, {
              date: this.format(latest, options),
              value: this.format(value, options)
            });
            errors.push(err);
          }
          if (errors.length) {
            return v.unique(errors);
          }
        }, {
          parse: null,
          format: null
        }),
        date: function(value, options) {
          options = v.extend({}, options, { dateOnly: true });
          return v.validators.datetime.call(v.validators.datetime, value, options);
        },
        format: function(value, options) {
          if (v.isString(options) || options instanceof RegExp) {
            options = { pattern: options };
          }
          options = v.extend({}, this.options, options);
          var message = options.message || this.message || "is invalid", pattern = options.pattern, match;
          if (!v.isDefined(value)) {
            return;
          }
          if (!v.isString(value)) {
            return message;
          }
          if (v.isString(pattern)) {
            pattern = new RegExp(options.pattern, options.flags);
          }
          match = pattern.exec(value);
          if (!match || match[0].length != value.length) {
            return message;
          }
        },
        inclusion: function(value, options) {
          if (!v.isDefined(value)) {
            return;
          }
          if (v.isArray(options)) {
            options = { within: options };
          }
          options = v.extend({}, this.options, options);
          if (v.contains(options.within, value)) {
            return;
          }
          var message = options.message || this.message || "^%{value} is not included in the list";
          return v.format(message, { value });
        },
        exclusion: function(value, options) {
          if (!v.isDefined(value)) {
            return;
          }
          if (v.isArray(options)) {
            options = { within: options };
          }
          options = v.extend({}, this.options, options);
          if (!v.contains(options.within, value)) {
            return;
          }
          var message = options.message || this.message || "^%{value} is restricted";
          if (v.isString(options.within[value])) {
            value = options.within[value];
          }
          return v.format(message, { value });
        },
        email: v.extend(function(value, options) {
          options = v.extend({}, this.options, options);
          var message = options.message || this.message || "is not a valid email";
          if (!v.isDefined(value)) {
            return;
          }
          if (!v.isString(value)) {
            return message;
          }
          if (!this.PATTERN.exec(value)) {
            return message;
          }
        }, {
          PATTERN: /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i
        }),
        equality: function(value, options, attribute, attributes, globalOptions) {
          if (!v.isDefined(value)) {
            return;
          }
          if (v.isString(options)) {
            options = { attribute: options };
          }
          options = v.extend({}, this.options, options);
          var message = options.message || this.message || "is not equal to %{attribute}";
          if (v.isEmpty(options.attribute) || !v.isString(options.attribute)) {
            throw new Error("The attribute must be a non empty string");
          }
          var otherValue = v.getDeepObjectValue(attributes, options.attribute), comparator = options.comparator || function(v12, v2) {
            return v12 === v2;
          }, prettify = options.prettify || globalOptions && globalOptions.prettify || v.prettify;
          if (!comparator(value, otherValue, options, attribute, attributes)) {
            return v.format(message, { attribute: prettify(options.attribute) });
          }
        },
        url: function(value, options) {
          if (!v.isDefined(value)) {
            return;
          }
          options = v.extend({}, this.options, options);
          var message = options.message || this.message || "is not a valid url", schemes = options.schemes || this.schemes || ["http", "https"], allowLocal = options.allowLocal || this.allowLocal || false, allowDataUrl = options.allowDataUrl || this.allowDataUrl || false;
          if (!v.isString(value)) {
            return message;
          }
          var regex = "^(?:(?:" + schemes.join("|") + ")://)(?:\\S+(?::\\S*)?@)?(?:";
          var tld = "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))";
          if (allowLocal) {
            tld += "?";
          } else {
            regex += "(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})";
          }
          regex += "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" + tld + ")(?::\\d{2,5})?(?:[/?#]\\S*)?$";
          if (allowDataUrl) {
            var mediaType = "\\w+\\/[-+.\\w]+(?:;[\\w=]+)*";
            var urlchar = "[A-Za-z0-9-_.!~\\*'();\\/?:@&=+$,%]*";
            var dataurl = "data:(?:" + mediaType + ")?(?:;base64)?," + urlchar;
            regex = "(?:" + regex + ")|(?:^" + dataurl + "$)";
          }
          var PATTERN = new RegExp(regex, "i");
          if (!PATTERN.exec(value)) {
            return message;
          }
        },
        type: v.extend(function(value, originalOptions, attribute, attributes, globalOptions) {
          if (v.isString(originalOptions)) {
            originalOptions = { type: originalOptions };
          }
          if (!v.isDefined(value)) {
            return;
          }
          var options = v.extend({}, this.options, originalOptions);
          var type = options.type;
          if (!v.isDefined(type)) {
            throw new Error("No type was specified");
          }
          var check;
          if (v.isFunction(type)) {
            check = type;
          } else {
            check = this.types[type];
          }
          if (!v.isFunction(check)) {
            throw new Error("validate.validators.type.types." + type + " must be a function.");
          }
          if (!check(value, options, attribute, attributes, globalOptions)) {
            var message = originalOptions.message || this.messages[type] || this.message || options.message || (v.isFunction(type) ? "must be of the correct type" : "must be of type %{type}");
            if (v.isFunction(message)) {
              message = message(value, originalOptions, attribute, attributes, globalOptions);
            }
            return v.format(message, { attribute: v.prettify(attribute), type });
          }
        }, {
          types: {
            object: function(value) {
              return v.isObject(value) && !v.isArray(value);
            },
            array: v.isArray,
            integer: v.isInteger,
            number: v.isNumber,
            string: v.isString,
            date: v.isDate,
            boolean: v.isBoolean
          },
          messages: {}
        })
      };
      validate3.formatters = {
        detailed: function(errors) {
          return errors;
        },
        flat: v.flattenErrorsToArray,
        grouped: function(errors) {
          var attr;
          errors = v.groupErrorsByAttribute(errors);
          for (attr in errors) {
            errors[attr] = v.flattenErrorsToArray(errors[attr]);
          }
          return errors;
        },
        constraint: function(errors) {
          var attr;
          errors = v.groupErrorsByAttribute(errors);
          for (attr in errors) {
            errors[attr] = errors[attr].map(function(result) {
              return result.validator;
            }).sort();
          }
          return errors;
        }
      };
      validate3.exposeModule(validate3, this, exports2, module3, define2);
    }).call(exports, typeof exports !== "undefined" ? exports : null, typeof module2 !== "undefined" ? module2 : null, typeof define !== "undefined" ? define : null);
  }
});

// src/functions/product/handler.ts
var handler_exports = {};
__export(handler_exports, {
  createSL: () => createSL,
  deleteSL: () => deleteSL,
  readListSL: () => readListSL,
  readSL: () => readSL,
  updateSL: () => updateSL
});

// src/libs/apiGateway.ts
var formatJSONResponse = (response) => {
  return {
    statusCode: 200,
    body: JSON.stringify(response)
  };
};

// src/libs/lambda.ts
var import_core = __toESM(require_core());
var import_http_json_body_parser = __toESM(require_http_json_body_parser());
var middyfy = (handler) => {
  return (0, import_core.default)(handler).use((0, import_http_json_body_parser.default)());
};

// node_modules/uuid/wrapper.mjs
var import_dist = __toESM(require_dist(), 1);
var v1 = import_dist.default.v1;
var v3 = import_dist.default.v3;
var v4 = import_dist.default.v4;
var v5 = import_dist.default.v5;
var NIL = import_dist.default.NIL;
var version = import_dist.default.version;
var validate = import_dist.default.validate;
var stringify = import_dist.default.stringify;
var parse = import_dist.default.parse;

// src/models/product.model.ts
var ProductModel = class {
  constructor({
    id = v4(),
    name: name2 = "",
    sku: sku2 = "",
    description: description2 = "",
    price: price2 = 0,
    stock: stock2 = 0
  }) {
    this._id = id;
    this._name = name2;
    this._sku = sku2;
    this._description = description2;
    this._price = price2;
    this._stock = stock2;
  }
  setId(value) {
    this._id = value !== "" ? value : null;
  }
  getId() {
    return this._id;
  }
  setName(value) {
    this._name = value !== "" ? value : null;
  }
  getName() {
    return this._name;
  }
  setSku(value) {
    this._sku = value !== "" ? value : null;
  }
  getSku() {
    return this._sku;
  }
  setDescription(value) {
    this._description = value !== "" ? value : null;
  }
  getDescription() {
    return this._description;
  }
  setPrice(value) {
    this._price = value > 0 ? value : null;
  }
  getPrice() {
    return this._price;
  }
  setStock(value) {
    this._stock = value > 0 ? value : null;
  }
  getStock() {
    return this._stock;
  }
  getEntityMappings() {
    return {
      id: this.getId(),
      name: this.getName(),
      sku: this.getSku(),
      description: this.getDescription(),
      price: this.getPrice(),
      stock: this.getStock(),
      timestamp: new Date().getTime()
    };
  }
};

// src/enums/status-code.enum.ts
var StatusCode = /* @__PURE__ */ ((StatusCode2) => {
  StatusCode2[StatusCode2["OK"] = 200] = "OK";
  StatusCode2[StatusCode2["ERROR"] = 500] = "ERROR";
  StatusCode2[StatusCode2["BAD_REQUEST"] = 400] = "BAD_REQUEST";
  return StatusCode2;
})(StatusCode || {});

// src/models/response.model.ts
var RESPONSE_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true
};
var ResponseModel = class {
  constructor(data = {}, code = 402, message = "") {
    this.setBodyVariable = (variable, value) => {
      this.body[variable] = value;
    };
    this.setData = (data) => {
      this.body.data = data;
    };
    this.setCode = (code) => {
      this.code = code;
    };
    this.getCode = () => {
      return this.code;
    };
    this.setMessage = (message) => {
      this.body.message = message;
    };
    this.getMessage = () => {
      return this.body.message;
    };
    this.generate = () => {
      return {
        statusCode: this.code,
        headers: RESPONSE_HEADERS,
        body: JSON.stringify(this.body)
      };
    };
    this.body = {
      data,
      message,
      status: StatusCode[code]
    };
    this.code = code;
  }
};

// src/libs/util.ts
var import_validate = __toESM(require_validate2());
var validateAgainstConstraints = (values, constraints) => {
  return new Promise((resolve, reject) => {
    const validation = (0, import_validate.default)(values, constraints);
    if (typeof validation === "undefined") {
      resolve();
    } else {
      reject(new ResponseModel({ validation }, 400, "required fields are missing"));
    }
  });
};

// src/functions/product/constraints/create.constraint.json
var sku = {
  presence: {
    allowEmpty: false
  },
  type: "string"
};
var description = {
  presence: {
    allowEmpty: false
  },
  type: "string"
};
var price = {
  presence: {
    allowEmpty: false
  },
  type: "number"
};
var stock = {
  presence: {
    allowEmpty: false
  },
  type: "number"
};
var name = {
  presence: {
    allowEmpty: false
  },
  type: "string"
};
var create_constraint_default = {
  sku,
  description,
  price,
  stock,
  name
};

// src/services/database.service.ts
var AWS = __toESM(require("aws-sdk"));
var {
  STAGE,
  DYNAMODB_LOCAL_STAGE,
  DYNAMODB_LOCAL_ACCESS_KEY_ID,
  DYNAMODB_LOCAL_SECRET_ACCESS_KEY,
  DYNAMODB_LOCAL_ENDPOINT
} = process.env;
var config2 = { region: "eu-west-1" };
if (STAGE === DYNAMODB_LOCAL_STAGE) {
  config2.accessKeyId = DYNAMODB_LOCAL_ACCESS_KEY_ID;
  config2.secretAccessKey = DYNAMODB_LOCAL_SECRET_ACCESS_KEY;
  config2.endpoint = DYNAMODB_LOCAL_ENDPOINT;
}
AWS.config.update(config2);
var documentClient = new AWS.DynamoDB.DocumentClient();
var DatabaseService = class {
  constructor() {
    this.getItem = async ({ key, hash, hashValue, tableName }) => {
      const params = {
        TableName: tableName,
        Key: {
          id: key
        }
      };
      if (hash) {
        params.Key[hash] = hashValue;
      }
      const results = await this.get(params);
      if (Object.keys(results).length) {
        return results;
      }
      console.error("Item does not exist");
      throw new ResponseModel({ id: key }, 400 /* BAD_REQUEST */, "Invalid Request!" /* INVALID_REQUEST */);
    };
    this.create = async (params) => {
      try {
        return await documentClient.put(params).promise();
      } catch (error) {
        console.error(`create-error: ${error}`);
        throw new ResponseModel({}, 500, `create-error: ${error}`);
      }
    };
    this.batchCreate = async (params) => {
      try {
        return await documentClient.batchWrite(params).promise();
      } catch (error) {
        console.error(`batch-write-error: ${error}`);
        throw new ResponseModel({}, 500, `batch-write-error: ${error}`);
      }
    };
    this.update = async (params) => {
      try {
        return await documentClient.update(params).promise();
      } catch (error) {
        console.error(`update-error: ${error}`);
        throw new ResponseModel({}, 500, `update-error: ${error}`);
      }
    };
    this.query = async (params) => {
      try {
        return await documentClient.query(params).promise();
      } catch (error) {
        console.error(`query-error: ${error}`);
        throw new ResponseModel({}, 500, `query-error: ${error}`);
      }
    };
    this.get = async (params) => {
      console.log("DB GET - STAGE: ", STAGE);
      console.log("DB GET - params.TableName: ", params.TableName);
      console.log("DB GET - params.Key: ", params.Key);
      try {
        return await documentClient.get(params).promise();
      } catch (error) {
        console.error(`get-error - TableName: ${params.TableName}`);
        console.error(`get-error: ${error}`);
        throw new ResponseModel({}, 500, `get-error: ${error}`);
      }
    };
    this.delete = async (params) => {
      try {
        return await documentClient.delete(params).promise();
      } catch (error) {
        console.error(`delete-error: ${error}`);
        throw new ResponseModel({}, 500, `delete-error: ${error}`);
      }
    };
  }
};

// src/functions/product/handler.ts
var create = async (event) => {
  let response;
  return validateAgainstConstraints(event.body, create_constraint_default).then(async () => {
    const databaseService = new DatabaseService();
    const productModel = new ProductModel(event.body);
    const data = productModel.getEntityMappings();
    const params = {
      TableName: process.env.PRODUCT_TABLE,
      Item: {
        id: data.id,
        name: data.name,
        sku: data.sku,
        description: data.description,
        price: data.price,
        stock: data.stock
      }
    };
    await databaseService.create(params);
    return data.id;
  }).then((listId) => {
    response = new ResponseModel({ listId }, 200, "Product successfully created");
  }).catch((error) => {
    response = error instanceof ResponseModel ? error : new ResponseModel({}, 500, "Product cannot be created");
  }).then(() => {
    return response.generate();
  });
};
var update = async (event) => {
  let response;
  const databaseService = new DatabaseService();
  const { PRODUCT_TABLE } = process.env;
  return formatJSONResponse({
    message: `read serverless`,
    event
  });
};
var read = async (event) => {
  try {
  } catch (error) {
    console.log(error);
  }
  return formatJSONResponse({
    message: `read serverless`,
    event
  });
};
var deleteP = async (event) => {
  try {
  } catch (error) {
    console.log(error);
  }
  return formatJSONResponse({
    message: `read serverless`,
    event
  });
};
var readList = async (event) => {
  try {
  } catch (error) {
    console.log(error);
  }
  return formatJSONResponse({
    message: `read serverless`,
    event
  });
};
var createSL = middyfy(create);
var readSL = middyfy(read);
var updateSL = middyfy(update);
var deleteSL = middyfy(deleteP);
var readListSL = middyfy(readList);
module.exports = __toCommonJS(handler_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createSL,
  deleteSL,
  readListSL,
  readSL,
  updateSL
});
/*!
 * validate.js 0.13.1
 *
 * (c) 2013-2019 Nicklas Ansman, 2013 Wrapp
 * Validate.js may be freely distributed under the MIT license.
 * For all details and documentation:
 * http://validatejs.org/
 */
//# sourceMappingURL=handler.js.map
