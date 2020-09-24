'use strict';

// For IE5.5 to IE8 compatibility.
if (!Date.now) {
  Date.now = () => new Date().getTime();
}
if (!Object.keys) {
  Object.keys = (function() {
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function(obj) {
      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }

      var result = [], prop, i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());
}
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function(callback, thisArg) {
    var T, k;

    if (this == null) {
      throw new TypeError(' this is null or not defined');
    }

    // 1. Let O be the result of calling toObject() passing the
    // |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get() internal
    // method of O with the argument "length".
    // 3. Let len be toUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If isCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== "function") {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let
    // T be undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Let k be 0
    k = 0;

    // 7. Repeat, while k < len
    while (k < len) {
      var kValue;

      // a. Let Pk be ToString(k).
      //    This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty
      //    internal method of O with argument Pk.
      //    This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {
        // i. Let kValue be the result of calling the Get internal
        // method of O with argument Pk.
        kValue = O[k];

        // ii. Call the Call internal method of callback with T as
        // the this value and argument list containing kValue, k, and O.
        callback.call(T, kValue, k, O);
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined
  };
}
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(searchElement, fromIndex) {

    var k;

    // 1. Let o be the result of calling ToObject passing
    //    the this value as the argument.
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }

    var o = Object(this);

    // 2. Let lenValue be the result of calling the Get
    //    internal method of o with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = o.length >>> 0;

    // 4. If len is 0, return -1.
    if (len === 0) {
      return -1;
    }

    // 5. If argument fromIndex was passed let n be
    //    ToInteger(fromIndex); else let n be 0.
    var n = +fromIndex || 0;

    if (Math.abs(n) === Infinity) {
      n = 0;
    }

    // 6. If n >= len, return -1.
    if (n >= len) {
      return -1;
    }

    // 7. If n >= 0, then Let k be n.
    // 8. Else, n<0, Let k be len - abs(n).
    //    If k is less than 0, then let k be 0.
    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

    // 9. Repeat, while k < len
    while (k < len) {
      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the
      //    HasProperty internal method of o with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      //    i.  Let elementK be the result of calling the Get
      //        internal method of o with the argument ToString(k).
      //   ii.  Let same be the result of applying the
      //        Strict Equality Comparison Algorithm to
      //        searchElement and elementK.
      //  iii.  If same is true, return k.
      if (k in o && o[k] === searchElement) {
        return k;
      }
      k++;
    }
    return -1;
  };
}
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
// Because PhantomJS does not fully support JS APIs
if (typeof Object.assign != 'function') {
  (function () {
    Object.assign = function (target) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var output = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source !== undefined && source !== null) {
          for (var nextKey in source) {
            if (source.hasOwnProperty(nextKey)) {
              output[nextKey] = source[nextKey];
            }
          }
        }
      }
      return output;
    };
  })();
}

/**
 * AcquiaHttpHmac - Let's you sign a XMLHttpRequest or promised-based request object (e.g. jqXHR) by Acquia's
 * HTTP HMAC Spec. For more information, see: https://github.com/acquia/http-hmac-spec/tree/2.0
 */
class AcquiaHttpHmac {
  /**
   * Constructor.
   *
   * @constructor
   * @param {string} realm
   *   The provider.
   * @param {string} public_key
   *   Public key.
   * @param {string} secret_key
   *   Secret key.
   * @param {string} version
   *   Authenticator version.
   * @param {string} default_content_type
   *   Default content type of all signings (other than specified during signing).
   */
  constructor({realm, public_key, secret_key, version = '2.0', default_content_type = 'application/json'}) {
    if (!realm) {
      throw new Error('The "realm" must not be empty.');
    }
    if (!public_key) {
      throw new Error('The "public_key" must not be empty.');
    }
    if (!secret_key) {
      throw new Error('The "secret_key" must not be empty.');
    }
    let supported_versions = ['2.0'];
    if (supported_versions.indexOf(version) < 0) {
      throw new Error(`The version must be "${supported_versions.join('" or "')}". Version "${version}" is not supported.`);
    }

    let parsed_secret_key = CryptoJS.enc.Base64.parse(secret_key);
    this.config = {realm, public_key, parsed_secret_key, version, default_content_type};

    /**
     * Supported methods. Other HTTP methods through XMLHttpRequest are not supported by modern browsers due to insecurity.
     *
     * @type array
     */
    this.SUPPORTED_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS', 'CUSTOM'];
  }


  /**
   * Check if the request is a XMLHttpRequest.
   *
   * @param {(XMLHttpRequest|Object)} request
   *   The request to be signed, which can be a XMLHttpRequest or a promise-based request Object (e.g. jqXHR).
   * @returns {boolean}
   *   TRUE if the request is a XMLHttpRequest; FALSE otherwise.
   */
  static isXMLHttpRequest(request) {
    if (request instanceof XMLHttpRequest || request.onreadystatechange) {
      return true;
    }
    return false;
  }

  /**
   * Check if the request is a promise-based request Object (e.g. jqXHR).
   *
   * @param {(XMLHttpRequest|Object)} request
   *   The request to be signed, which can be a XMLHttpRequest or a promise-based request Object (e.g. jqXHR).
   * @returns {boolean}
   *   TRUE if the request is a promise-based request Object (e.g. jqXHR); FALSE otherwise.
   */
  static isPromiseRequest(request) {
    return request.hasOwnProperty('setRequestHeader') &&
      request.hasOwnProperty('getResponseHeader') &&
      request.hasOwnProperty('promise');
  }

  /**
   * Implementation of Steven Levithan uri parser.
   *
   * @param  {String}   str The uri to parse
   * @param  {Boolean}  strictMode strict mode flag
   * @return {Object}   parsed representation of a uri
   */
  static parseUri (str, strictMode = false) {
    let o = {
      key: ["source","protocol","host","userInfo","user","password","hostname","port","relative","pathname","directory","file","search","hash"],
      q: {
        name:   "queryKey",
        parser: /(?:^|&)([^&=]*)=?([^&]*)/g
      },
      parser: {
        strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
        loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
      }
    },
    m  = o.parser[strictMode ? "strict" : "loose"].exec(str),
    uri = {},
    i  = 14;

    while (i--) uri[o.key[i]] = m[i] || "";

    uri[o.q.name] = {};
    uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
      if ($1) uri[o.q.name][$1] = $2;
    });

    return uri;
  };

  #generateTimestamp() {
    return Math.floor(Date.now() / 1000).toString();
  };

  /**
     * Generate a UUID nonce.
     *
     * @returns {string}
  */
  #generateNonce() {
    let d = Date.now();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    });
  };

  /**
   * Generate signed headers using provided parameters.
   *
   * @param {(XMLHttpRequest|Object)} request
   *   The request to be signed, which can be a XMLHttpRequest or a promise-based request Object (e.g. jqXHR).
   * @param {string} method
   *   Must be defined in the supported_methods.
   * @param {string} path
   *   End point's full URL path, including schema, port, query string, etc. It must already be URL encoded.
   * @param {object} signed_headers
   *   Signed headers.
   * @param {string} content_type
   *   Content type.
   * @param {string} body
   *   Body.
   * @returns {object}
   */
  getHeaders({method, path, signed_headers = {}, content_type = this.config.default_content_type, body = '', nonce, timestamp}) {
    // Validate input. First 2 parameters are mandatory.
    if (this.SUPPORTED_METHODS.indexOf(method) < 0) {
      throw new Error(`Args are ${method} TA. The method must be "${this.SUPPORTED_METHODS.join('" or "')}". "${method}" is not supported.`);
    }
    if (!path) {
      throw new Error('The end point path must not be empty.');
    }

    /**
     * Convert an object of parameters to a string.
     *
     * @param {object} parameters
     *   Header parameters in key: value pair.
     * @param value_prefix
     *   The parameter value's prefix decoration.
     * @param value_suffix
     *   The parameter value's suffix decoration.
     * @param glue
     *   When join(), use this string as the glue.
     * @param encode
     *   When true, encode the parameter's value; otherwise don't encode.
     * @returns {string}
     */
    let parametersToString = (parameters, value_prefix = '=', value_suffix = '', glue = '&', encode = true) => {
      let parameter_keys = Object.keys(parameters),
          processed_parameter_keys = [],
          processed_parameters = {},
          result_string_array = [];

      // Process the headers.
      // 1) Process the parameter keys into lowercase, and
      // 2) Process values to URI encoded if applicable.
      parameter_keys.forEach((parameter_key) => {
        if (!parameters.hasOwnProperty(parameter_key)) {
          return;
        }
        let processed_parameter_key = parameter_key.toLowerCase();
        processed_parameter_keys.push(processed_parameter_key);
        processed_parameters[processed_parameter_key] = encode ? encodeURIComponent(parameters[parameter_key]) : parameters[parameter_key];
      });

      // Process into result string.
      processed_parameter_keys.sort().forEach((processed_parameter_key) => {
        if (!processed_parameters.hasOwnProperty(processed_parameter_key)) {
          return;
        }
        result_string_array.push(`${processed_parameter_key}${value_prefix}${processed_parameters[processed_parameter_key]}${value_suffix}`);
      });
      return result_string_array.join(glue);
    };



    /**
     * Determine if this request sends body content (or skips silently).
     *
     * Note: modern browsers always skip body at send(), when the request method is "GET" or "HEAD".
     *
     * @param body
     *   Body content.
     * @param method
     *   The request's method.
     * @returns {boolean}
     */
    let willSendBody = (body, method) => {
      let bodyless_request_types = ['GET', 'HEAD'];
      return body.length !== 0 && bodyless_request_types.indexOf(method) < 0;
    };

    // Compute the authorization headers.
    nonce = !!nonce ? nonce : this.#generateNonce();
    let parser = AcquiaHttpHmac.parseUri(path),
        authorization_parameters = {
          id: this.config.public_key,
          nonce: nonce,
          realm: this.config.realm,
          version: this.config.version
        },
        x_authorization_timestamp = timestamp || this.#generateTimestamp(),
        x_authorization_content_sha256 = willSendBody(body, method) ? CryptoJS.SHA256(body).toString(CryptoJS.enc.Base64) : '',
        signature_base_string_content_suffix = willSendBody(body, method) ? `\n${content_type}\n${x_authorization_content_sha256}` : '',
        site_port = parser.port ? `:${parser.port}` : '',
        site_name_and_port = `${parser.hostname}${site_port}`,
        url_query_string = parser.search,
        signed_headers_string = parametersToString(signed_headers, ':', '', '\n', false),
        signature_base_signed_headers_string = signed_headers_string === '' ? '' : `${signed_headers_string}\n`,
        signature_base_string = `${method}\n${site_name_and_port}\n${parser.pathname || '/'}\n${url_query_string}\n${parametersToString(authorization_parameters)}\n${signature_base_signed_headers_string}${x_authorization_timestamp}${signature_base_string_content_suffix}`,
        authorization_string = parametersToString(authorization_parameters, '="', '"', ','),
        authorization_signed_headers_string = encodeURI(Object.keys(signed_headers).join('|||||').toLowerCase().split('|||||').sort().join(';')),
        signature = encodeURI(CryptoJS.HmacSHA256(signature_base_string, this.config.parsed_secret_key).toString(CryptoJS.enc.Base64)),
        authorization = `acquia-http-hmac ${authorization_string},headers="${authorization_signed_headers_string}",signature="${signature}"`;


    const headers = {
      'X-Authorization-Timestamp':  x_authorization_timestamp,
      Authorization: authorization
    };

    if (x_authorization_content_sha256) {
      headers['X-Authorization-Content-SHA256'] =  x_authorization_content_sha256;
    }

    console.log('signature_base_string', signature_base_string);
    console.log('authorization', authorization);
    console.log('x_authorization_timestamp', x_authorization_timestamp);
    console.log('nonce', nonce);
    console.log('x_authorization_content_sha256', x_authorization_content_sha256);

    return headers;
  };


  /**
   * Generate signed headers using provided parameters.
   *
   * @param {Object} signParameters
   *   The signing parameters to be signed, which include method, path, headers, content type, body.
   * @returns {object}
   *   The object contains headers, nonce, and timestamp.
   */
  getFetchHeaders(signParameters) {
    const nonce = this.#generateNonce();
    const timestamp = this.#generateTimestamp();
    const copiedParameters = Object.assign({}, signParameters);

    Object.assign(copiedParameters, { nonce, timestamp });

    const headers = this.getHeaders(copiedParameters);

    return { headers, nonce, timestamp };
  }


  /**
   * Sign the request using provided parameters.
   *
   * @param {(XMLHttpRequest|Object)} request
   *   The request to be signed, which can be a XMLHttpRequest or a promise-based request Object (e.g. jqXHR).
   * @param {string} method
   *   Must be defined in the supported_methods.
   * @param {string} path
   *   End point's full URL path, including schema, port, query string, etc. It must already be URL encoded.
   * @param {object} signed_headers
   *   Signed headers.
   * @param {string} content_type
   *   Content type.
   * @param {string} body
   *   Body.
   * @returns {string}
   */
  sign({request, method, path, signed_headers = {}, content_type = this.config.default_content_type, body = ''}) {
    // Validate input.
    if (!request || !AcquiaHttpHmac.isXMLHttpRequest(request) && !AcquiaHttpHmac.isPromiseRequest(request)) {
      throw new Error('The request is required, and must be a XMLHttpRequest or promise-based request Object (e.g. jqXHR).');
    }

    const nonce = this.#generateNonce();
    const x_authorization_timestamp = this.#generateTimestamp();

    const headers = this.getHeaders(
      { 
        method,
        path,
        signed_headers,
        content_type,
        body,
        nonce,
        x_authorization_timestamp
      });

    // Open request if needed and set headers.
    if (AcquiaHttpHmac.isXMLHttpRequest(request) && request.readyState === 0) {
      request.open(method, path, true);
    }

    request.acquiaHttpHmac = {};
    request.acquiaHttpHmac.timestamp = x_authorization_timestamp;
    request.acquiaHttpHmac.nonce = nonce;
   
    Object.keys(headers).forEach((headerName) => request.setRequestHeader(headerName, headers[headerName]));
  }

  /**
   * Helper method to perform the Crypto processing and comparison.
   *
   * @param {String} responseText
   *   The content (as string) of the server's response.
   * @param {String} sha256Header
   *   The `X-Server-Authorization-HMAC-SHA256` header from the server's response.
   * @param {String} nonce
   *   The nonce used to sign the sent request.
   * @param {String} timestamp
   *   The nonce used to sign the sent request.
   * @returns {boolean}
   *   TRUE if the request is valid; FALSE otherwise.
   */
  #hasValidResponse(responseText, sha256Header, nonce, timestamp) {
    const signature_base_string = `${nonce}\n${timestamp}\n${responseText}`;
    const signature = CryptoJS.HmacSHA256(signature_base_string, this.config.parsed_secret_key).toString(CryptoJS.enc.Base64);

    console.log('signature_base_string', signature_base_string);
    console.log('signature ', signature);
    console.log('server_signature', sha256Header);

    return signature === sha256Header;
  }

  /**
   * Check if the request has a valid response.
   *
   * @param {XMLHttpRequest|Object} request
   *   The request to be validated.
   * @returns {boolean}
   *   TRUE if the request is valid; FALSE otherwise.
   */
  hasValidResponse (request) {
    return this.#hasValidResponse(
      request.responseText,
      request.getResponseHeader('X-Server-Authorization-HMAC-SHA256'),
      request.acquiaHttpHmac.nonce,
      request.acquiaHttpHmac.timestamp,
    );
  };

  /**
   * Check if the Fetch Response is valid.
   *
   * @param {String} responseText
   *   The Fetch response's text.
   * @param {Object} headers
   *   The Fetch response's headers.
   * @param {String} nonce
   *   The nonce used to sign the Fetch request.
   * @param {String} timestamp
   *   The nonce used to sign the Fetch request.
   * @returns {boolean}
   *   TRUE if the request is valid; FALSE otherwise.
   */
  hasValidFetchResponse (responseText, headers, nonce, timestamp) {
    return this.#hasValidResponse(
      responseText,
      headers.get('X-Server-Authorization-HMAC-SHA256'),
      nonce,
      timestamp,
    );
  };

}

if (typeof exports === "object") {
  // CommonJS
  var CryptoJS = require('crypto-js');
  var XMLHttpRequest = XMLHttpRequest || require("xmlhttprequest").XMLHttpRequest;
  module.exports = exports = AcquiaHttpHmac;
}
else if (typeof define === "function" && define.amd) {
  // AMD
  throw new Error('Update here to support AMD.')
}
else {
  // Global (browser)
  window.AcquiaHttpHmac = AcquiaHttpHmac;
}
