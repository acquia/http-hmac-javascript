'use strict';

// For IE8 compatibility.
if (!Date.now) {
  Date.now = () => new Date().getTime();
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
  isXMLHttpRequest(request) {
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
  isPromiseRequest(request) {
    return request.hasOwnProperty('setRequestHeader') &&
      request.hasOwnProperty('getResponseHeader') &&
      request.hasOwnProperty('promise');
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
  sign({request, method, path, signed_headers = {}, content_type = this.config.default_content_type, body = ''}) {
    // Validate input. First 3 parameters are mandatory.
    if (!this.isXMLHttpRequest(request) && !this.isPromiseRequest(request)) {
      throw new Error('The request must be a XMLHttpRequest or promise-based request Object (e.g. jqXHR).');
    }
    if (this.SUPPORTED_METHODS.indexOf(method) < 0) {
      throw new Error(`The method must be "${this.SUPPORTED_METHODS.join('" or "')}". "${method}" is not supported.`);
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
    let parametersToString = (parameters, value_prefix = '=', value_suffix = '', glue = '&') => {
      let parameters_array = [];
      for (let parameter in parameters) {
        if (!parameters.hasOwnProperty(parameter)) {
          continue;
        }
        parameters_array.push(`${parameter}${value_prefix}${parameters[parameter]}${value_suffix}`);
      }
      return parameters_array.join(glue);
    };

    /**
     * Generate a UUID nonce.
     *
     * @returns {string}
     */
    let generateNonce = () => {
      let d = Date.now();
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
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
    let willSendBody = (body, method) => {
      let bodyless_request_types = ['GET', 'HEAD'];
      return body.length !== 0 && bodyless_request_types.indexOf(method) < 0;
    };

    // Compute the authorization headers.
    let nonce = generateNonce(),
        parser = document.createElement('a'),
        authorization_parameters = {
          id: this.config.public_key,
          nonce: nonce,
          realm: this.config.realm,
          version: this.config.version
        },
        x_authorization_timestamp = Math.floor(Date.now() / 1000).toString(),
        x_authorization_content_sha256 = willSendBody(body, method) ? CryptoJS.SHA256(body).toString(CryptoJS.enc.Base64) : '',
        signature_base_string_content_suffix = willSendBody(body, method) ? `\n${content_type}\n${x_authorization_content_sha256}` : '';

    parser.href = path;

    let site_port = parser.port ? `:${parser.port}` : '',
        site_name_and_port = `${parser.hostname}${site_port}`,
        url_query_string = parser.search.substring(1),
        signature_base_string = `${method}\n${site_name_and_port}\n${parser.pathname}\n${url_query_string}\n${parametersToString(authorization_parameters)}\n${parametersToString(signed_headers, ':', '', ',').toLowerCase()}\n${x_authorization_timestamp}${signature_base_string_content_suffix}`,
        authorization_string = parametersToString(authorization_parameters, '="', '"', ','),
        authorization_signed_header_postfix = Object.keys(signed_headers).length === 0 ? '' : `,headers="${Object.keys(signed_headers).join()}"`,
        signature = CryptoJS.HmacSHA256(signature_base_string, this.config.parsed_secret_key).toString(CryptoJS.enc.Base64),
        authorization = `acquia-http-hmac ${authorization_string},signature="${signature}"${authorization_signed_header_postfix}`;

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

    console.log('signature_base_string', signature_base_string);
    console.log('authorization', authorization);
    console.log('x_authorization_timestamp', x_authorization_timestamp);
    console.log('nonce', nonce);
    console.log('x_authorization_content_sha256', x_authorization_content_sha256);
  };

  /**
   * Check if the request has a valid response.
   *
   * @param {XMLHttpRequest|Object} request
   *   The request to be validated.
   * @returns {boolean}
   *   TRUE if the request is valid; FALSE otherwise.
   */
  hasValidResponse (request) {
    let signature_base_string = `${request.acquiaHttpHmac.nonce}\n${request.acquiaHttpHmac.timestamp}\n${request.responseText}`,
        signature = CryptoJS.HmacSHA256(signature_base_string, this.config.parsed_secret_key).toString(CryptoJS.enc.Base64),
        server_signature = request.getResponseHeader('X-Server-Authorization-HMAC-SHA256');

    console.log('signature_base_string', signature_base_string);
    console.log('signature ', signature);
    console.log('server_signature', server_signature);

    return signature === server_signature;
  };
}

if (typeof exports === "object") {
  // CommonJS
  var CryptoJS = require('crypto-js');
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
