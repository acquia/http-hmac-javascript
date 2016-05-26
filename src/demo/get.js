/**
 * @file get.js
 */

// Configure local caller script.
let method = 'GET', // Can also be other methods here such as 'HEAD'.
    port = location.port ? `:${location.port}` : '',
    pathname = location.pathname.replace(/html$/, 'php'),
    // Example path: http://localhost:9000/http-hmac-javascript/demo/get.php?first_word=Hello&second_word=World#myAnchor
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

// Create and configure the request.
let request = new XMLHttpRequest();
// Define the state change action.
request.onreadystatechange = () => {
  if (request.readyState === 4) {
    // Check if the response status is 200 ok.
    if (request.status !== 200) {
      throw new Error('Problem retrieving data.');
    }

    // Validate the request's response.
    if (!HMAC.hasValidResponse(request)) {
      throw new Error('The request does not have a valid response.');
    }

    // Finally, carry out the intended change.
    document.getElementById('text-display').innerHTML = request.response;
  }
};

// It is optional to open the request before signing.
// request.open(method, path, true);

// Sign the request using AcquiaHttpHmac.sign().
let sign_parameters = {request, method, path, signed_headers, content_type};
HMAC.sign(sign_parameters);

// Set Content-Type header and other headers. This can happen before or after signing.
request.setRequestHeader('Content-Type', content_type);
request.setRequestHeader('Special-Header-1', 'special_header_1_value');
request.setRequestHeader('Special-Header-2', 'special_header_2_value');
request.setRequestHeader('Unsigned-Header-1', 'unsigned_header_1_value');

// Send the request.
request.send();
