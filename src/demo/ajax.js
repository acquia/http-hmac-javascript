/**
 * @file ajax.js
 */

// Configure local caller script.
let method = 'GET', // Can also be other methods here such as 'HEAD'.
    port = location.port ? `:${location.port}` : '',
    pathname = location.pathname.replace(/html$/, 'php'),
    // Example path: http://localhost:9000/http-hmac-javascript/demo/ajax.php?first_word=Hello&second_word=World#myAnchor
    path = `${location.protocol}//${location.hostname}${port}${pathname}?first_word=Hello&second_word=World#myAnchor`,
    signed_headers = {
      'Special-Header-1': 'special_header_1_value',
      'Special-Header-2': 'special_header_2_value'
    },
    content_type = 'text/plain';

// Create HMAC instance.
let hmac_config = {
  realm: 'dice',
  public_key: 'ABCD-1234',
  secret_key: 'd175024aa4c4d8b312a7114687790c772dd94fb725cb68016aaeae5a76d68102'
};
const HMAC = new AcquiaHttpHmac(hmac_config);

let all_headers = {
  'Special-Header-1': 'special_header_1_value',
  'Special-Header-2': 'special_header_2_value',
  'Unsigned-Header-1': 'unsigned_header_1_value'
};

let before_send_callback = (request) => {
  // Sign the request using AcquiaHttpHmac.sign().
  let sign_parameters = {request, method, path, signed_headers, content_type};
  HMAC.sign(sign_parameters);
};

let ajax_setting = {
  method: method,
  url: path,
  headers: all_headers,
  beforeSend: before_send_callback,
  contentType: content_type
};

// Define the promise's callbacks.
let done_callback = (data, textStatus, request) => {
  // Validate the request's response.
  if (textStatus !== 'success') {
    throw new Error('The request does not have a success response.');
  }
  if (!HMAC.hasValidResponse(request)) {
    throw new Error('The request does not have a valid response.');
  }

  // Finally, carry out the intended change.
  document.getElementById('text-display').innerHTML = data;
};

let fail_callback = (request) => {
  // Error out the request error details.
  let error_text = `${request.status} ${request.statusText}`;
  if (request.responseText) {
    error_text += ` - ${request.responseText}`;
  }
  throw new Error(error_text);
};

// Create and configure the request.
let request = jQuery.ajax(ajax_setting).success(done_callback).error(fail_callback);
