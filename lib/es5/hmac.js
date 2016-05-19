'use strict';

// For IE8 compatibility.

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

if (!Date.now) {
  Date.now = function () {
    return new Date().getTime();
  };
}

/**
 * AcquiaHttpHmac - Let's you sign a XMLHttpRequest or promised-based request object (e.g. jqXHR) by Acquia's
 * HTTP HMAC Spec. For more information, see: https://github.com/acquia/http-hmac-spec/tree/2.0
 */

var AcquiaHttpHmac = function () {
  /**
   * Constructor.
   *
   * @constructor
   * @param {string} Realm
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

  function AcquiaHttpHmac(_ref) {
    var realm = _ref.realm;
    var public_key = _ref.public_key;
    var secret_key = _ref.secret_key;
    var _ref$version = _ref.version;
    var version = _ref$version === undefined ? '2.0' : _ref$version;
    var _ref$default_content_ = _ref.default_content_type;
    var default_content_type = _ref$default_content_ === undefined ? 'application/json' : _ref$default_content_;

    _classCallCheck(this, AcquiaHttpHmac);

    if (!realm) {
      throw new Error('The "realm" must not be empty.');
    }
    if (!public_key) {
      throw new Error('The "public_key" must not be empty.');
    }
    if (!secret_key) {
      throw new Error('The "secret_key" must not be empty.');
    }
    var supported_versions = ['2.0'];
    if (supported_versions.indexOf(version) < 0) {
      throw new Error('The version must be "' + supported_versions.join('" or "') + '". Version "' + version + '" is not supported.');
    }

    var parsed_secret_key = CryptoJS.enc.Base64.parse(secret_key);
    this.config = { realm: realm, public_key: public_key, parsed_secret_key: parsed_secret_key, version: version, default_content_type: default_content_type };

    /**
     * Supported methods. Other HTTP methods through XMLHttpRequest are not supported by modern browsers due to insecurity.
     *
     * @type array
     */
    this.SUPPORTED_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS', 'CUSTOM'];
  }

  /**
   * Check if the request is a XMLHttpRequest.
   *
   * @param {(XMLHttpRequest|Object)} request
   *   The request to be signed, which can be a XMLHttpRequest or a promise-based request Object (e.g. jqXHR).
   * @returns {boolean}
   *   TRUE if the request is a XMLHttpRequest; FALSE otherwise.
   */

  _createClass(AcquiaHttpHmac, [{
    key: 'isXMLHttpRequest',
    value: function isXMLHttpRequest(request) {
      return request instanceof XMLHttpRequest;
    }

    /**
     * Check if the request is a promise-based request Object (e.g. jqXHR).
     *
     * @param {(XMLHttpRequest|Object)} request
     *   The request to be signed, which can be a XMLHttpRequest or a promise-based request Object (e.g. jqXHR).
     * @returns {boolean}
     *   TRUE if the request is a promise-based request Object (e.g. jqXHR); FALSE otherwise.
     */

  }, {
    key: 'isPromiseRequest',
    value: function isPromiseRequest(request) {
      return request.hasOwnProperty('setRequestHeader') && request.hasOwnProperty('getResponseHeader') && request.hasOwnProperty('promise');
    }

    /**
     * Sign the request using provided parameters.
     *
     * @param {(XMLHttpRequest|Object)} request
     *   The request to be signed, which can be a XMLHttpRequest or a promise-based request Object (e.g. jqXHR).
     * @param {string} method
     *   Must be defined in the supported_methods.
     * @param {string} path
     *   End point's full URL path.
     * @param {object} signed_headers
     *   Signed headers.
     * @param {string} content_type
     *   Content type.
     * @param {string} body
     *   Body.
     * @returns {string}
     */

  }, {
    key: 'sign',
    value: function sign(_ref2) {
      var request = _ref2.request;
      var method = _ref2.method;
      var path = _ref2.path;
      var _ref2$signed_headers = _ref2.signed_headers;
      var signed_headers = _ref2$signed_headers === undefined ? {} : _ref2$signed_headers;
      var _ref2$content_type = _ref2.content_type;
      var content_type = _ref2$content_type === undefined ? this.config.default_content_type : _ref2$content_type;
      var _ref2$body = _ref2.body;
      var body = _ref2$body === undefined ? '' : _ref2$body;

      // Validate input. First 3 parameters are mandatory.
      if (!this.isXMLHttpRequest(request) && !this.isPromiseRequest(request)) {
        throw new Error('The request must be a XMLHttpRequest or promise-based request Object (e.g. jqXHR).');
      }
      if (this.SUPPORTED_METHODS.indexOf(method) < 0) {
        throw new Error('The method must be "' + this.SUPPORTED_METHODS.join('" or "') + '". "' + method + '" is not supported.');
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
       * @returns {string}
       */
      var parametersToString = function parametersToString(parameters) {
        var value_prefix = arguments.length <= 1 || arguments[1] === undefined ? '=' : arguments[1];
        var value_suffix = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];
        var glue = arguments.length <= 3 || arguments[3] === undefined ? '&' : arguments[3];

        var parameters_array = [];
        for (var parameter in parameters) {
          if (!parameters.hasOwnProperty(parameter)) {
            continue;
          }
          parameters_array.push('' + parameter + value_prefix + parameters[parameter] + value_suffix);
        }
        return parameters_array.join(glue);
      };

      /**
       * Generate a UUID nonce.
       *
       * @returns {string}
       */
      var generateNonce = function generateNonce() {
        var d = Date.now();
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c == 'x' ? r : r & 0x7 | 0x8).toString(16);
        });
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
      var willSendBody = function willSendBody(body, method) {
        var bodyless_request_types = ['GET', 'HEAD'];
        return body.length !== 0 && bodyless_request_types.indexOf(method) < 0;
      };

      // Compute the authorization headers.
      var nonce = generateNonce(),
          parser = document.createElement('a'),
          authorization_parameters = {
        id: this.config.public_key,
        nonce: nonce,
        realm: this.config.realm,
        version: this.config.version
      },
          x_authorization_timestamp = Math.floor(Date.now() / 1000).toString(),
          x_authorization_content_sha256 = willSendBody(body, method) ? CryptoJS.SHA256(body).toString(CryptoJS.enc.Base64) : '',
          signature_base_string_content_suffix = willSendBody(body, method) ? '\n' + content_type + '\n' + x_authorization_content_sha256 : '';

      parser.href = path;

      var site_port = parser.port ? ':' + parser.port : '',
          site_name_and_port = '' + parser.hostname + site_port,
          url_query_string = parser.search.substring(1),
          signature_base_string = method + '\n' + site_name_and_port + '\n' + parser.pathname + '\n' + url_query_string + '\n' + parametersToString(authorization_parameters) + '\n' + x_authorization_timestamp + signature_base_string_content_suffix,
          authorization_string = parametersToString(authorization_parameters, '="', '"', ','),
          authorization_signed_header_postfix = Object.keys(signed_headers).length === 0 ? '' : ',headers="' + Object.keys(signed_headers).join() + '"',
          signature = CryptoJS.HmacSHA256(signature_base_string, this.config.parsed_secret_key).toString(CryptoJS.enc.Base64),
          authorization = 'acquia-http-hmac ' + authorization_string + ',signature="' + signature + '"' + authorization_signed_header_postfix;

      if (this.isXMLHttpRequest(request) && request.readyState === 0) {
        request.open(method, path, true);
      }

      // Set the authorizations headers.
      request.acquiaHttpHmac = {};
      request.acquiaHttpHmac.timestamp = x_authorization_timestamp;
      request.acquiaHttpHmac.nonce = nonce;
      request.setRequestHeader('X-Authorization-Timestamp', x_authorization_timestamp);
      request.setRequestHeader('Authorization', authorization);
      if (x_authorization_content_sha256) {
        request.setRequestHeader('X-Authorization-Content-SHA256', x_authorization_content_sha256);
      }

      void 0;
      void 0;
      void 0;
      void 0;
      void 0;
    }
  }, {
    key: 'hasValidResponse',

    /**
     * Check if the request has a valid response.
     *
     * @param {XMLHttpRequest|Object} request
     *   The request to be validated.
     * @returns {boolean}
     *   TRUE if the request is valid; FALSE otherwise.
     */
    value: function hasValidResponse(request) {
      var signature_base_string = request.acquiaHttpHmac.nonce + '\n' + request.acquiaHttpHmac.timestamp + '\n' + request.responseText,
          signature = CryptoJS.HmacSHA256(signature_base_string, this.config.parsed_secret_key).toString(CryptoJS.enc.Base64),
          server_signature = request.getResponseHeader('X-Server-Authorization-HMAC-SHA256');

      void 0;
      void 0;
      void 0;

      return signature === server_signature;
    }
  }]);

  return AcquiaHttpHmac;
}();

if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === "object") {
  // CommonJS
  var CryptoJS = require('crypto-js');
  module.exports = exports = AcquiaHttpHmac;
} else if (typeof define === "function" && define.amd) {
  // AMD
  throw new Error('Update here to support AMD.');
} else {
  // Global (browser)
  window.AcquiaHttpHmac = AcquiaHttpHmac;
}