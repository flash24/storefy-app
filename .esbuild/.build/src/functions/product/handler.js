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
    var createPrefetchClient = (options2) => {
      const awsClientOptions = __spreadValues(__spreadValues({}, awsClientDefaultOptions), options2.awsClientOptions);
      const client = new options2.AwsClient(awsClientOptions);
      if (options2.awsClientCapture) {
        return options2.awsClientCapture(client);
      }
      return client;
    };
    var createClient = async (options2, request) => {
      let awsClientCredentials = {};
      if (options2.awsClientAssumeRole) {
        if (!request)
          throw new Error("Request required when assuming role");
        awsClientCredentials = await getInternal({
          credentials: options2.awsClientAssumeRole
        }, request);
      }
      awsClientCredentials = __spreadValues(__spreadValues({}, awsClientCredentials), options2.awsClientOptions);
      return createPrefetchClient(__spreadProps(__spreadValues({}, options2), {
        awsClientOptions: awsClientCredentials
      }));
    };
    var canPrefetch = (options2) => {
      return !(options2 !== null && options2 !== void 0 && options2.awsClientAssumeRole) && !(options2 !== null && options2 !== void 0 && options2.disablePrefetch);
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
    var processCache = (options2, fetch = () => void 0, request) => {
      const {
        cacheExpiry,
        cacheKey
      } = options2;
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
      const options2 = __spreadValues(__spreadValues({}, defaults), opts);
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
            request.event.body = JSON.parse(data, options2.reviver);
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

// node_modules/validate.js/validate.js
var require_validate = __commonJS({
  "node_modules/validate.js/validate.js"(exports, module2) {
    (function(exports2, module3, define2) {
      "use strict";
      var validate2 = function(attributes, constraints, options2) {
        options2 = v.extend({}, v.options, options2);
        var results = v.runValidations(attributes, constraints, options2), attr, validator;
        if (results.some(function(r) {
          return v.isPromise(r.error);
        })) {
          throw new Error("Use validate.async if you want support for promises");
        }
        return validate2.processValidationResults(results, options2);
      };
      var v = validate2;
      v.extend = function(obj) {
        [].slice.call(arguments, 1).forEach(function(source) {
          for (var attr in source) {
            obj[attr] = source[attr];
          }
        });
        return obj;
      };
      v.extend(validate2, {
        version: {
          major: 0,
          minor: 13,
          patch: 1,
          metadata: null,
          toString: function() {
            var version = v.format("%{major}.%{minor}.%{patch}", v.version);
            if (!v.isEmpty(v.version.metadata)) {
              version += "+" + v.version.metadata;
            }
            return version;
          }
        },
        Promise: typeof Promise !== "undefined" ? Promise : null,
        EMPTY_STRING_REGEXP: /^\s*$/,
        runValidations: function(attributes, constraints, options2) {
          var results = [], attr, validatorName, value, validators, validator, validatorOptions, error;
          if (v.isDomElement(attributes) || v.isJqueryElement(attributes)) {
            attributes = v.collectFormValues(attributes);
          }
          for (attr in constraints) {
            value = v.getDeepObjectValue(attributes, attr);
            validators = v.result(constraints[attr], value, attributes, attr, options2, constraints);
            for (validatorName in validators) {
              validator = v.validators[validatorName];
              if (!validator) {
                error = v.format("Unknown validator %{name}", { name: validatorName });
                throw new Error(error);
              }
              validatorOptions = validators[validatorName];
              validatorOptions = v.result(validatorOptions, value, attributes, attr, options2, constraints);
              if (!validatorOptions) {
                continue;
              }
              results.push({
                attribute: attr,
                value,
                validator: validatorName,
                globalOptions: options2,
                attributes,
                options: validatorOptions,
                error: validator.call(validator, value, validatorOptions, attr, attributes, options2)
              });
            }
          }
          return results;
        },
        processValidationResults: function(errors, options2) {
          errors = v.pruneEmptyErrors(errors, options2);
          errors = v.expandMultipleErrors(errors, options2);
          errors = v.convertErrorMessages(errors, options2);
          var format = options2.format || "grouped";
          if (typeof v.formatters[format] === "function") {
            errors = v.formatters[format](errors);
          } else {
            throw new Error(v.format("Unknown format %{format}", options2));
          }
          return v.isEmpty(errors) ? void 0 : errors;
        },
        async: function(attributes, constraints, options2) {
          options2 = v.extend({}, v.async.options, options2);
          var WrapErrors = options2.wrapErrors || function(errors) {
            return errors;
          };
          if (options2.cleanAttributes !== false) {
            attributes = v.cleanAttributes(attributes, constraints);
          }
          var results = v.runValidations(attributes, constraints, options2);
          return new v.Promise(function(resolve, reject) {
            v.waitForResults(results).then(function() {
              var errors = v.processValidationResults(results, options2);
              if (errors) {
                reject(new WrapErrors(errors, options2, attributes, constraints));
              } else {
                resolve(attributes);
              }
            }, function(err) {
              reject(err);
            });
          });
        },
        single: function(value, constraints, options2) {
          options2 = v.extend({}, v.single.options, options2, {
            format: "flat",
            fullMessages: false
          });
          return v({ single: value }, { single: constraints }, options2);
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
        stringifyValue: function(value, options2) {
          var prettify = options2 && options2.prettify || v.prettify;
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
        collectFormValues: function(form, options2) {
          var values = {}, i, j, input, inputs, option, value;
          if (v.isJqueryElement(form)) {
            form = form[0];
          }
          if (!form) {
            return values;
          }
          options2 = options2 || {};
          inputs = form.querySelectorAll("input[name], textarea[name]");
          for (i = 0; i < inputs.length; ++i) {
            input = inputs.item(i);
            if (v.isDefined(input.getAttribute("data-ignored"))) {
              continue;
            }
            var name2 = input.name.replace(/\./g, "\\\\.");
            value = v.sanitizeFormValue(input.value, options2);
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
                  value.push(v.sanitizeFormValue(option.value, options2));
                }
              }
            } else {
              var _val = typeof input.options[input.selectedIndex] !== "undefined" ? input.options[input.selectedIndex].value : "";
              value = v.sanitizeFormValue(_val, options2);
            }
            values[input.name] = value;
          }
          return values;
        },
        sanitizeFormValue: function(value, options2) {
          if (options2.trim && v.isString(value)) {
            value = value.trim();
          }
          if (options2.nullify !== false && value === "") {
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
        convertErrorMessages: function(errors, options2) {
          options2 = options2 || {};
          var ret = [], prettify = options2.prettify || v.prettify;
          errors.forEach(function(errorInfo) {
            var error = v.result(errorInfo.error, errorInfo.value, errorInfo.attribute, errorInfo.options, errorInfo.attributes, errorInfo.globalOptions);
            if (!v.isString(error)) {
              ret.push(errorInfo);
              return;
            }
            if (error[0] === "^") {
              error = error.slice(1);
            } else if (options2.fullMessages !== false) {
              error = v.capitalize(prettify(errorInfo.attribute)) + " " + error;
            }
            error = error.replace(/\\\^/g, "^");
            error = v.format(error, {
              value: v.stringifyValue(errorInfo.value, options2)
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
        exposeModule: function(validate3, root, exports3, module4, define3) {
          if (exports3) {
            if (module4 && module4.exports) {
              exports3 = module4.exports = validate3;
            }
            exports3.validate = validate3;
          } else {
            root.validate = validate3;
            if (validate3.isFunction(define3) && define3.amd) {
              define3([], function() {
                return validate3;
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
      validate2.validators = {
        presence: function(value, options2) {
          options2 = v.extend({}, this.options, options2);
          if (options2.allowEmpty !== false ? !v.isDefined(value) : v.isEmpty(value)) {
            return options2.message || this.message || "can't be blank";
          }
        },
        length: function(value, options2, attribute) {
          if (!v.isDefined(value)) {
            return;
          }
          options2 = v.extend({}, this.options, options2);
          var is = options2.is, maximum = options2.maximum, minimum = options2.minimum, tokenizer = options2.tokenizer || function(val) {
            return val;
          }, err, errors = [];
          value = tokenizer(value);
          var length = value.length;
          if (!v.isNumber(length)) {
            return options2.message || this.notValid || "has an incorrect length";
          }
          if (v.isNumber(is) && length !== is) {
            err = options2.wrongLength || this.wrongLength || "is the wrong length (should be %{count} characters)";
            errors.push(v.format(err, { count: is }));
          }
          if (v.isNumber(minimum) && length < minimum) {
            err = options2.tooShort || this.tooShort || "is too short (minimum is %{count} characters)";
            errors.push(v.format(err, { count: minimum }));
          }
          if (v.isNumber(maximum) && length > maximum) {
            err = options2.tooLong || this.tooLong || "is too long (maximum is %{count} characters)";
            errors.push(v.format(err, { count: maximum }));
          }
          if (errors.length > 0) {
            return options2.message || errors;
          }
        },
        numericality: function(value, options2, attribute, attributes, globalOptions) {
          if (!v.isDefined(value)) {
            return;
          }
          options2 = v.extend({}, this.options, options2);
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
          }, prettify = options2.prettify || globalOptions && globalOptions.prettify || v.prettify;
          if (v.isString(value) && options2.strict) {
            var pattern = "^-?(0|[1-9]\\d*)";
            if (!options2.onlyInteger) {
              pattern += "(\\.\\d+)?";
            }
            pattern += "$";
            if (!new RegExp(pattern).test(value)) {
              return options2.message || options2.notValid || this.notValid || this.message || "must be a valid number";
            }
          }
          if (options2.noStrings !== true && v.isString(value) && !v.isEmpty(value)) {
            value = +value;
          }
          if (!v.isNumber(value)) {
            return options2.message || options2.notValid || this.notValid || this.message || "is not a number";
          }
          if (options2.onlyInteger && !v.isInteger(value)) {
            return options2.message || options2.notInteger || this.notInteger || this.message || "must be an integer";
          }
          for (name2 in checks) {
            count = options2[name2];
            if (v.isNumber(count) && !checks[name2](value, count)) {
              var key = "not" + v.capitalize(name2);
              var msg = options2[key] || this[key] || this.message || "must be %{type} %{count}";
              errors.push(v.format(msg, {
                count,
                type: prettify(name2)
              }));
            }
          }
          if (options2.odd && value % 2 !== 1) {
            errors.push(options2.notOdd || this.notOdd || this.message || "must be odd");
          }
          if (options2.even && value % 2 !== 0) {
            errors.push(options2.notEven || this.notEven || this.message || "must be even");
          }
          if (errors.length) {
            return options2.message || errors;
          }
        },
        datetime: v.extend(function(value, options2) {
          if (!v.isFunction(this.parse) || !v.isFunction(this.format)) {
            throw new Error("Both the parse and format functions needs to be set to use the datetime/date validator");
          }
          if (!v.isDefined(value)) {
            return;
          }
          options2 = v.extend({}, this.options, options2);
          var err, errors = [], earliest = options2.earliest ? this.parse(options2.earliest, options2) : NaN, latest = options2.latest ? this.parse(options2.latest, options2) : NaN;
          value = this.parse(value, options2);
          if (isNaN(value) || options2.dateOnly && value % 864e5 !== 0) {
            err = options2.notValid || options2.message || this.notValid || "must be a valid date";
            return v.format(err, { value: arguments[0] });
          }
          if (!isNaN(earliest) && value < earliest) {
            err = options2.tooEarly || options2.message || this.tooEarly || "must be no earlier than %{date}";
            err = v.format(err, {
              value: this.format(value, options2),
              date: this.format(earliest, options2)
            });
            errors.push(err);
          }
          if (!isNaN(latest) && value > latest) {
            err = options2.tooLate || options2.message || this.tooLate || "must be no later than %{date}";
            err = v.format(err, {
              date: this.format(latest, options2),
              value: this.format(value, options2)
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
        date: function(value, options2) {
          options2 = v.extend({}, options2, { dateOnly: true });
          return v.validators.datetime.call(v.validators.datetime, value, options2);
        },
        format: function(value, options2) {
          if (v.isString(options2) || options2 instanceof RegExp) {
            options2 = { pattern: options2 };
          }
          options2 = v.extend({}, this.options, options2);
          var message = options2.message || this.message || "is invalid", pattern = options2.pattern, match;
          if (!v.isDefined(value)) {
            return;
          }
          if (!v.isString(value)) {
            return message;
          }
          if (v.isString(pattern)) {
            pattern = new RegExp(options2.pattern, options2.flags);
          }
          match = pattern.exec(value);
          if (!match || match[0].length != value.length) {
            return message;
          }
        },
        inclusion: function(value, options2) {
          if (!v.isDefined(value)) {
            return;
          }
          if (v.isArray(options2)) {
            options2 = { within: options2 };
          }
          options2 = v.extend({}, this.options, options2);
          if (v.contains(options2.within, value)) {
            return;
          }
          var message = options2.message || this.message || "^%{value} is not included in the list";
          return v.format(message, { value });
        },
        exclusion: function(value, options2) {
          if (!v.isDefined(value)) {
            return;
          }
          if (v.isArray(options2)) {
            options2 = { within: options2 };
          }
          options2 = v.extend({}, this.options, options2);
          if (!v.contains(options2.within, value)) {
            return;
          }
          var message = options2.message || this.message || "^%{value} is restricted";
          if (v.isString(options2.within[value])) {
            value = options2.within[value];
          }
          return v.format(message, { value });
        },
        email: v.extend(function(value, options2) {
          options2 = v.extend({}, this.options, options2);
          var message = options2.message || this.message || "is not a valid email";
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
        equality: function(value, options2, attribute, attributes, globalOptions) {
          if (!v.isDefined(value)) {
            return;
          }
          if (v.isString(options2)) {
            options2 = { attribute: options2 };
          }
          options2 = v.extend({}, this.options, options2);
          var message = options2.message || this.message || "is not equal to %{attribute}";
          if (v.isEmpty(options2.attribute) || !v.isString(options2.attribute)) {
            throw new Error("The attribute must be a non empty string");
          }
          var otherValue = v.getDeepObjectValue(attributes, options2.attribute), comparator = options2.comparator || function(v1, v2) {
            return v1 === v2;
          }, prettify = options2.prettify || globalOptions && globalOptions.prettify || v.prettify;
          if (!comparator(value, otherValue, options2, attribute, attributes)) {
            return v.format(message, { attribute: prettify(options2.attribute) });
          }
        },
        url: function(value, options2) {
          if (!v.isDefined(value)) {
            return;
          }
          options2 = v.extend({}, this.options, options2);
          var message = options2.message || this.message || "is not a valid url", schemes = options2.schemes || this.schemes || ["http", "https"], allowLocal = options2.allowLocal || this.allowLocal || false, allowDataUrl = options2.allowDataUrl || this.allowDataUrl || false;
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
          var options2 = v.extend({}, this.options, originalOptions);
          var type = options2.type;
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
          if (!check(value, options2, attribute, attributes, globalOptions)) {
            var message = originalOptions.message || this.messages[type] || this.message || options2.message || (v.isFunction(type) ? "must be of the correct type" : "must be of type %{type}");
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
      validate2.formatters = {
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
      validate2.exposeModule(validate2, this, exports2, module3, define2);
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

// src/libs/handlerResolver.ts
var handlerPath = (context) => {
  return `${context.split(process.cwd())[1].substring(1).replace(/\\/g, "/")}`;
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

// src/utils/util.ts
var import_validate = __toESM(require_validate());
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
var options = {};
if (process.env.IS_OFFLINE) {
  options = {
    region: "localhost",
    endpoint: "http://localhost:8000"
  };
}
var documentClient = new AWS.DynamoDB.DocumentClient(options);
var DatabaseService = class {
  constructor() {
    this.create = async (params) => {
      try {
        return await documentClient.put(params).promise();
      } catch (error) {
        throw new ResponseModel({}, 500, `create-error: ${error}`);
      }
    };
    this.batchCreate = async (params) => {
      try {
        return await documentClient.batchWrite(params).promise();
      } catch (error) {
        throw new ResponseModel({}, 500, `batch-write-error: ${error}`);
      }
    };
    this.update = async (params) => {
      try {
        return await documentClient.update(params).promise();
      } catch (error) {
        throw new ResponseModel({}, 500, `update-error: ${error}`);
      }
    };
    this.query = async (params) => {
      try {
        return await documentClient.query(params).promise();
      } catch (error) {
        throw new ResponseModel({}, 500, `query-error: ${error}`);
      }
    };
    this.get = async (params) => {
      try {
        return await documentClient.get(params).promise();
      } catch (error) {
        throw new ResponseModel({}, 500, `get-error: ${error}`);
      }
    };
    this.delete = async (params) => {
      try {
        return await documentClient.delete(params).promise();
      } catch (error) {
        throw new ResponseModel({}, 500, `delete-error: ${error}`);
      }
    };
  }
};

// src/functions/product/handler.ts
console.log(handlerPath(__dirname));
var create = async (event) => {
  let response;
  return validateAgainstConstraints(event.body, create_constraint_default).then(async () => {
    console.log(event.body);
    const databaseService = new DatabaseService();
    return "asd";
  }).then((listId) => {
    response = new ResponseModel({ listId }, 200, "Product successfully created");
  }).catch((error) => {
    response = error instanceof ResponseModel ? error : new ResponseModel({}, 500, "Product cannot be created");
  }).then(() => {
    return response.generate();
  });
  return formatJSONResponse({
    message: `Hello , welcome to the exciting Serverless world! your id : ${id}`,
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
var update = async (event) => {
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
