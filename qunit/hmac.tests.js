/**
 * @file hmac.tests.js
 */

var request, HMAC = new AcquiaHttpHmac({
  realm: 'dice^',
  public_key: 'ABCD-1234',
  secret_key: 'd175024aa4c4d8b312a7114687790c772dd94fb725cb68016aaeae5a76d68102'
});

// For testing only, alter the isXMLHttpRequest function to accept MockHttpRequest.
HMAC.isXMLHttpRequest = function (request) {
   return typeof MockHttpRequest !== 'undefined' && request instanceof MockHttpRequest;
};

// Freeze the Date.now() and Math.random() functions for testing.
Date.now = function () {
   return 1000000000;
};
Math.random = function () {
   return 0.123456789;
};

QUnit.module('HTTP HMAC JavaScript Library tests', {
  setup: function() {
    request = new MockHttpRequest();
  },
  teardown: function() {
    delete request, HMAC;
  }
});

QUnit.test('Test sign(), asserts GET pass.', function(assert) {
  expect(5);

  var method = 'GET',
      path = 'http://fakesite.com:8888',
      signed_headers = {},
      content_type = 'text/plain',
      responseText = 'correct response text';

  request.open(method, path);
  request.setRequestHeader('Content-Type', content_type);

  var sign_parameters = {
    request: request,
    method: method,
    path: path,
    signed_headers: signed_headers,
    content_type: content_type
  };
  HMAC.sign(sign_parameters);

  request.send();
  request.receive(200, responseText);

  var authorization = 'acquia-http-hmac id="ABCD-1234",nonce="11bdbac4-1111-4111-9111-111111111111",realm="dice%5E",version="2.0",signature="aeOVMGoyBcWZPyyzdjrzFkGAF8gAGaeqbfA324L5q8Y="';
  assert.equal(request.acquiaHttpHmac.nonce, '11bdbac4-1111-4111-9111-111111111111', 'sign() records a nonce to the XHR object.');
  assert.equal(request.acquiaHttpHmac.timestamp, 1000000, 'sign() records a timestamp to the XHR object.');
  assert.equal(request.getRequestHeader('X-Authorization-Timestamp'), 1000000, 'sign() sets "X-Authorization-Timestamp" request header to the XHR object.');
  assert.equal(request.getRequestHeader('Authorization'), authorization, 'sign() sets "Authorization" request header to the XHR object.');
  assert.equal(request.getRequestHeader('X-Authorization-Content-SHA256'), undefined, 'sign() sets "X-Authorization-Content-SHA256" request header to the XHR object.');
});

QUnit.test('Test sign(), asserts GET pass with full URL path, body, various signed headers, and without request.open().', function(assert) {
  expect(5);

  var method = 'GET',
      path = 'http://fakesite.com:8888/fake-api?first_param=first_value&second_param=second_value',
      signed_headers = {
        'UPPERCASE-HEADER': 'UPPERCASE HEADER VALUE',
        'lowercase-header': 'lowercase header value',
        'header^with special#char': 'header^with special#char value'
      },
      content_type = 'text/plain',
      body = 'correct request text',
      responseText = 'correct response text';

  // No request.open here because we let the signer to open request.
  // request.open(method, path);

  // GET requests silently drops the body, here we are testing if the sign() respects that behavior by passing in the body anyway.
  var sign_parameters = {
    request: request,
    method: method,
    path: path,
    signed_headers: signed_headers,
    content_type: content_type,
    body: body
  };
  HMAC.sign(sign_parameters);

  request.setRequestHeader('Content-Type', content_type); // setRequestHeader happens after the signer opens the request.
  request.send(body);  // GET requests silently drops the body.
  request.receive(200, responseText);

  var authorization = 'acquia-http-hmac id="ABCD-1234",nonce="11bdbac4-1111-4111-9111-111111111111",realm="dice%5E",version="2.0",headers="header%5Ewith%20special#char;lowercase-header;uppercase-header",signature="enTl9k7vcbOEn5wDDMSKrvVizafbR7n7a6XMqZCfPSA="';
  assert.equal(request.acquiaHttpHmac.nonce, '11bdbac4-1111-4111-9111-111111111111', 'sign() records a nonce to the XHR object.');
  assert.equal(request.acquiaHttpHmac.timestamp, 1000000, 'sign() records a timestamp to the XHR object.');
  assert.equal(request.getRequestHeader('X-Authorization-Timestamp'), 1000000, 'sign() sets "X-Authorization-Timestamp" request header to the XHR object.');
  assert.equal(request.getRequestHeader('Authorization'), authorization, 'sign() sets "Authorization" request header to the XHR object.');
  assert.equal(request.getRequestHeader('X-Authorization-Content-SHA256'), undefined, 'sign() sets "X-Authorization-Content-SHA256" request header to the XHR object.');
});

QUnit.test('Test sign(), asserts GET pass with a promise-based request object.', function(assert) {
  expect(3);

  // Create a fake promise-based request object.
  request = {};
  request.headers = {};
  request.setRequestHeader = function(name, value) {
    request.headers[name] = value;
  };
  request.getResponseHeader = function() {};
  request.promise = function() {};

  var method = 'GET',
      path = 'http://fakesite.com:8888',
      signed_headers = {},
      content_type = 'text/plain';

  var sign_parameters = {
    request: request,
    method: method,
    path: path,
    signed_headers: signed_headers,
    content_type: content_type
  };
  HMAC.sign(sign_parameters);

  var authorization = 'acquia-http-hmac id="ABCD-1234",nonce="11bdbac4-1111-4111-9111-111111111111",realm="dice%5E",version="2.0",signature="aeOVMGoyBcWZPyyzdjrzFkGAF8gAGaeqbfA324L5q8Y="';
  assert.equal(request.acquiaHttpHmac.nonce, '11bdbac4-1111-4111-9111-111111111111', 'sign() records a nonce to the jqXHR object.');
  assert.equal(request.acquiaHttpHmac.timestamp, 1000000, 'sign() records a timestamp to the jqXHR object.');
  assert.deepEqual(request.headers, { Authorization: authorization, 'X-Authorization-Timestamp': '1000000' }, 'sign() sets "X-Authorization-Timestamp" and "Authorization" request header to the jqXHR object.');
});

QUnit.test('Test sign(), asserts POST pass.', function(assert) {
  expect(5);

  var method = 'POST',
      path = 'http://fakesite.com:8888',
      signed_headers = {},
      content_type = 'text/plain',
      body = 'correct request text',
      responseText = 'correct response text';

  request.open(method, path);
  request.setRequestHeader('Content-Type', content_type);

  var sign_parameters = {
    request: request,
    method: method,
    path: path,
    signed_headers: signed_headers,
    content_type: content_type,
    body: body
  };
  HMAC.sign(sign_parameters);

  request.send(body);
  request.receive(200, responseText);

  var authorization = 'acquia-http-hmac id="ABCD-1234",nonce="11bdbac4-1111-4111-9111-111111111111",realm="dice%5E",version="2.0",signature="pNUQl+h18e+F6Lzd2lDGe53uaWCDbqQ5eqGnxrC433M="';
  assert.equal(request.acquiaHttpHmac.nonce, '11bdbac4-1111-4111-9111-111111111111', 'sign() records a nonce to the XHR object.');
  assert.equal(request.acquiaHttpHmac.timestamp, 1000000, 'sign() records a timestamp to the XHR object.');
  assert.equal(request.getRequestHeader('X-Authorization-Timestamp'), 1000000, 'sign() sets "X-Authorization-Timestamp" request header to the XHR object.');
  assert.equal(request.getRequestHeader('Authorization'), authorization, 'sign() sets "Authorization" request header to the XHR object.');
  assert.equal(request.getRequestHeader('X-Authorization-Content-SHA256'), '2WR1x45F7yiwv/OKh43jtkmbsMSfQvXxeR3z6RJHPBg=', 'sign() sets "X-Authorization-Content-SHA256" request header to the XHR object.');
});

QUnit.test('Test sign(), asserts constructor set config.', function(assert) {
  expect(5);
  var HMAC_test_constructor = new AcquiaHttpHmac({
    realm: 'my_realm',
    public_key: 'my_public_key',
    secret_key: 'my_secret_key',
    version: '2.0',
    default_content_type: 'application/XML'
  });
  var secret_key_words = [-4999, -7, 503316480];
  assert.equal(HMAC_test_constructor.config.realm, 'my_realm', 'constructor() sets realm.');
  assert.equal(HMAC_test_constructor.config.public_key, 'my_public_key', 'constructor() sets public_key.');
  assert.deepEqual(HMAC_test_constructor.config.parsed_secret_key.words, secret_key_words, 'constructor() sets secret_key.');
  assert.equal(HMAC_test_constructor.config.version, '2.0', 'constructor() sets version.');
  assert.equal(HMAC_test_constructor.config.default_content_type, 'application/XML', 'constructor() sets default_content_type.');
});

QUnit.test('Test hasValidResponse(), asserts pass.', function(assert) {
  expect(1);

  request.open('POST', 'my_path');
  request.setRequestHeader('Content-Type', 'text/plain');
  request.acquiaHttpHmac = {};
  request.acquiaHttpHmac.nonce = '480b7e99-d558-4a59-e49a-228ae489561b';
  request.acquiaHttpHmac.timestamp = 1000000000;
  request.setResponseHeader('X-Server-Authorization-HMAC-SHA256', 'CU0ma6cbZ6wZAsjjKli8ukH8Nxx6kShpTQqxvw08Yns=');
  request.send('correct request text');
  request.receive(200, 'correct response text');

  var hasValidResponse = HMAC.hasValidResponse(request);
  assert.ok(hasValidResponse, 'hasValidResponse() asserts pass.');
});

QUnit.test('Test hasValidResponse(), asserts fail by wrong nonce.', function(assert) {
  expect(1);

  request.open('POST', 'my_path');
  request.setRequestHeader('Content-Type', 'text/plain');
  request.acquiaHttpHmac = {};
  request.acquiaHttpHmac.nonce = 'wrong-nonce';
  request.acquiaHttpHmac.timestamp = 1000000000;
  request.setResponseHeader('X-Server-Authorization-HMAC-SHA256', 'CU0ma6cbZ6wZAsjjKli8ukH8Nxx6kShpTQqxvw08Yns=');
  request.send('correct request text');
  request.receive(200, 'correct response text');

  var hasValidResponse = HMAC.hasValidResponse(request);
  assert.notOk(hasValidResponse, 'hasValidResponse() asserts fail by wrong nonce.');
});

QUnit.test('Test hasValidResponse(), asserts fail by wrong timestamp.', function(assert) {
  expect(1);

  request.open('POST', 'my_path');
  request.setRequestHeader('Content-Type', 'text/plain');
  request.acquiaHttpHmac = {};
  request.acquiaHttpHmac.nonce = '480b7e99-d558-4a59-e49a-228ae489561b';
  request.acquiaHttpHmac.timestamp = 90210;  // Wrong time stamp
  request.setResponseHeader('X-Server-Authorization-HMAC-SHA256', 'CU0ma6cbZ6wZAsjjKli8ukH8Nxx6kShpTQqxvw08Yns=');
  request.send('correct request text');
  request.receive(200, 'correct response text');

  var hasValidResponse = HMAC.hasValidResponse(request);
  assert.notOk(hasValidResponse, 'hasValidResponse() asserts fail by wrong timestamp.');
});

QUnit.test('Test hasValidResponse(), asserts fail by wrong responseText.', function(assert) {
  expect(1);

  request.open('POST', 'my_path');
  request.setRequestHeader('Content-Type', 'text/plain');
  request.acquiaHttpHmac = {};
  request.acquiaHttpHmac.nonce = '480b7e99-d558-4a59-e49a-228ae489561b';
  request.acquiaHttpHmac.timestamp = 1000000000;
  request.setResponseHeader('X-Server-Authorization-HMAC-SHA256', 'CU0ma6cbZ6wZAsjjKli8ukH8Nxx6kShpTQqxvw08Yns=');
  request.send('correct request text');
  request.receive(200, 'wrong response text');  // Wrong response text.

  var hasValidResponse = HMAC.hasValidResponse(request);
  assert.notOk(hasValidResponse, 'hasValidResponse() asserts fail by wrong responseText.');
});

QUnit.test('Test hasValidResponse(), asserts fail by wrong server hash.', function(assert) {
  expect(1);

  request.open('POST', 'my_path');
  request.setRequestHeader('Content-Type', 'text/plain');
  request.acquiaHttpHmac = {};
  request.acquiaHttpHmac.nonce = '480b7e99-d558-4a59-e49a-228ae489561b';
  request.acquiaHttpHmac.timestamp = 1000000000;
  request.setResponseHeader('X-Server-Authorization-HMAC-SHA256', 'wrong header value');  // Wrong authorization header value.
  request.send('correct request text');
  request.receive(200, 'correct response text');

  var hasValidResponse = HMAC.hasValidResponse(request);
  assert.notOk(hasValidResponse, 'hasValidResponse() asserts fail by wrong server hash.');
});
