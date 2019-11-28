# HTTP HMAC Signer for JavaScript

![ES5](https://camo.githubusercontent.com/d341caa63123c99b79fda7f8efdc29b35f9f2e70/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f65732d352d627269676874677265656e2e737667)
![ES6](https://camo.githubusercontent.com/d25414161ebfbbdd0f69a4a3e6a188a76ae2e82a/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f65732d362d627269676874677265656e2e737667)
[![Build Status](https://travis-ci.org/acquia/http-hmac-javascript.svg?branch=master)](https://travis-ci.org/acquia/http-hmac-javascript)

HMAC Request Signer is a JavaScript library that implements the version 2.0 of the [HTTP HMAC Spec](https://github.com/acquia/http-hmac-spec/tree/2.0)
to sign RESTful Web API requests and verify responses.

Please note the 1.0 Spec is not supported.

## Development Prerequisites

Before further development, please ensure the following tools are installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)

You can use the following commands to check if you already have those tools:
```bash
git --version
node -v
npm -v
```

## Files
* _demo/_ - Visit _get.html_ and _post.html_ to see the demo in action.
* _lib/_ - Library files.
  * _es5/_ - Transpiled ES5 version, polyfilled to IE 5.5.
  * _es6/_ - ES6 version.
* _src/_ - Source files. Code changes should be made here.
  * _demo/_ - Demo files to show how the library can be used.
  * _hmac.js_ - The source file of the library.

## Build

* Run `npm install` to install all dependencies.
* Make code changes in _src/_ directory.
* In root directory, run ```gulp build-demo```. Alternatively, you can run ```gulp``` to keep gulp on watch to automatically compile/transpile all file changes.

## Tests

* Run `npm install` to install all dependencies.
* In root directory, run ```gulp test``` to see the current test results. Alternatively, you can go to the _qunit/hmac.html_ page in your browser.

## Submitting PR
* PR welcomed!
* Please run `gulp build-demo` and submit along all resulting file updates.
