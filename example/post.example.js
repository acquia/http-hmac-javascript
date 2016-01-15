/**
 * @file post.example.js
 */

// Configure your local script.
var method = 'POST'; // Can also be other methods here such as 'PUT'.
var path = 'http://localhost:9000/http-hmac-javascript/example/post.endpoint.php?myQueryParameter=90210#myAnchor';
var signed_headers = {
  'special-header-1': 'special_header_1_value',
  'special-header-2': 'special_header_2_value'
};
var content_type = 'application/x-www-form-urlencoded';
var body = 'first_word=Hello&second_word=World';

// Configure AcquiaHttpHmac library's config object.
AcquiaHttpHmacConfig.clientId = 'ABCD-1234';
AcquiaHttpHmacConfig.secretKey = 'd175024aa4c4d8b312a7114687790c772dd94fb725cb68016aaeae5a76d68102';
AcquiaHttpHmacConfig.realm = 'dice';

// Create and configure the request.
var request = new XMLHttpRequest();
request.onreadystatechange = state_change;
request.open(method, path, true);
request.setRequestHeader('Content-Type', content_type);

// The first two headers are the signed headers.
request.setRequestHeader('Special-Header-1', 'special_header_1_value');
request.setRequestHeader('Special-Header-2', 'special_header_2_value');
request.setRequestHeader('Special-Header-3', 'special_header_2_value');

// Sign the request using AcquiaHttpHmac.sign().
AcquiaHttpHmac.sign(request, method, path, signed_headers, content_type, body);

// Send the request.
request.send(body);

// Define the state change action.
function state_change() {
  if (request.readyState == 4) {
    // Check if the response status is 200 ok.
    if (request.status !== 200) {
      throw new Error('Problem retrieving XML data.', request);
      return;
    }

    // Validate the request's response.
    if (!AcquiaHttpHmac.hasValidResponse(request)) {
      throw new Error('The request does not have a valid response.', request);
      return;
    }

    // Finally, carry out the intended change.
    document.getElementById('text-display').innerHTML = request.response;
  }
}
