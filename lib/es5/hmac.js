'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var CryptoJS = require('crypto-js');

exports.sign = function (req, public_key, secret_key) {
  var version = '2.0';
  var realm = req.realm;
  var host = req.host;
  var method = req.method;
  var path = req.path;
  var signed_headers = req.signed_headers;
  var content_type = req.content_type;
  var body = req.body;
  var port = req.port;
  var query_string = req.query_string;
  var SUPPORTED_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS', 'CUSTOM'];

  if (SUPPORTED_METHODS.indexOf(method) < 0) {
    throw new Error('The method must be "' + SUPPORTED_METHODS.join('" or "') + '". "' + method + '" is not supported.');
  }
  if (!path) {
    throw new Error('path must not be empty.');
  }
  if (!public_key) {
    throw new Error('public_key must not be empty.');
  }
  if (!secret_key) {
    throw new Error('secret_key must not be empty.');
  }
  var req_is_valid = (typeof req === 'undefined' ? 'undefined' : _typeof(req)) === "object" && !Array.isArray(req) && req !== null;
  if (!req_is_valid) {
    throw new Error('req object is invalid.');
  }

  // Compute the authorization headers.
  var nonce = generateNonce();
  var authorization_parameters = {
    id: public_key,
    nonce: nonce,
    realm: realm,
    version: "2.0"
  };

  var x_authorization_timestamp = Math.floor(Date.now() / 1000).toString();
  var x_authorization_content_sha256 = willSendBody(body, method) ? CryptoJS.SHA256(body instanceof Buffer ? CryptoJS.enc.Base64.parse(body.toString('base64')) : body).toString(CryptoJS.enc.Base64) : '';
  var signature_base_string_content_suffix = willSendBody(body, method) ? '\n' + content_type + '\n' + x_authorization_content_sha256 : '';
  var signed_headers_string = parametersToString(signed_headers, ':', '', '\n', false);
  var signature_base_signed_headers_string = signed_headers_string === '' ? '' : signed_headers_string + '\n';
  var signature_base_string = method + '\n' + host + '\n' + path + '\n' + query_string + '\n' + parametersToString(authorization_parameters) + '\n' + signature_base_signed_headers_string + x_authorization_timestamp + signature_base_string_content_suffix;
  var authorization_string = parametersToString(authorization_parameters, '="', '"', ',');
  var authorization_signed_headers_string = encodeURI(Object.keys(signed_headers).join('|||||').toLowerCase().split('|||||').sort().join(';'));
  var signature = encodeURI(CryptoJS.HmacSHA256(signature_base_string, secret_key).toString(CryptoJS.enc.Base64));
  var authorization = 'acquia-http-hmac ' + authorization_string;
  if (authorization_signed_headers_string) {
    authorization += ',headers=' + authorization_signed_headers_string;
  }
  authorization += ',signature="' + signature + '"';
  authorization += ',version="' + version + '"';

  // Set the authorizations headers.
  req.acquiaHttpHmac = {};
  req.acquiaHttpHmac.timestamp = x_authorization_timestamp;
  req.acquiaHttpHmac.nonce = nonce;
  req.headers['X-Authorization-Timestamp'] = x_authorization_timestamp;
  req.headers['Authorization'] = authorization;
  if (x_authorization_content_sha256) {
    req.headers['X-Authorization-Content-SHA256'] = x_authorization_content_sha256;
  }
};

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

var parametersToString = function parametersToString(parameters, value_prefix, value_suffix, glue, encode) {
  if (typeof value_prefix === "undefined") {
    value_prefix = '=';
  }
  if (typeof value_suffix === "undefined") {
    value_suffix = '';
  }
  if (typeof glue === "undefined") {
    glue = '&';
  }
  if (typeof encode === "undefined") {
    encode = true;
  }
  var parameter_keys = Object.keys(parameters),
      processed_parameter_keys = [],
      processed_parameters = {},
      result_string_array = [];

  // Process the headers.
  // 1) Process the parameter keys into lowercase, and
  // 2) Process values to URI encoded if applicable.
  parameter_keys.forEach(function (parameter_key) {
    if (!parameters.hasOwnProperty(parameter_key)) {
      return;
    }
    var processed_parameter_key = parameter_key.toLowerCase();
    processed_parameter_keys.push(processed_parameter_key);
    processed_parameters[processed_parameter_key] = encode ? encodeURIComponent(parameters[parameter_key]) : parameters[parameter_key];
  });

  // Process into result string.
  processed_parameter_keys.sort().forEach(function (processed_parameter_key) {
    if (!processed_parameters.hasOwnProperty(processed_parameter_key)) {
      return;
    }
    result_string_array.push('' + processed_parameter_key + value_prefix + processed_parameters[processed_parameter_key] + value_suffix);
  });
  return result_string_array.join(glue);
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