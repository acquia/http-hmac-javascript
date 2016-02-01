/**
 * @file get.js
 */

// Configure local caller script.
let method = 'GET', // Can also be other methods here such as 'HEAD'.
    port = location.port ? `:${location.port}` : '',
    request_pathname = location.pathname.replace(/html$/, 'php'),
    // Example path: http://localhost:9000/http-hmac-javascript/demo/get.php?first_word=Hello&second_word=World#myAnchor
    path = `${location.protocol}//${location.hostname}${port}${request_pathname}?first_word=Hello&second_word=World#myAnchor`,
    signed_headers = {
      'special-header-1': 'special_header_1_value',
      'special-header-2': 'special_header_2_value'
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
  if (request.readyState == 4) {
    // Check if the response status is 200 ok.
    if (request.status !== 200) {
      throw new Error('Problem retrieving data.', request);
      return;
    }

    // Validate the request's response.
    if (!HMAC.hasValidResponse(request)) {
      throw new Error('The request does not have a valid response.', request);
      return;
    }

    // Finally, carry out the intended change.
    document.getElementById('text-display').innerHTML = request.response;
  }
};
request.open(method, path, true);
request.setRequestHeader('Content-Type', content_type);

// The first two headers are the signed headers.
request.setRequestHeader('Special-Header-1', 'special_header_1_value');
request.setRequestHeader('Special-Header-2', 'special_header_2_value');
request.setRequestHeader('Special-Header-3', 'special_header_3_value');

// Sign the request using AcquiaHttpHmac.sign().
let sign_parameters = {request, method, path, signed_headers, content_type};
HMAC.sign(sign_parameters);

// Send the request.
request.send();
