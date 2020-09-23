"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function _createClass(e,t,n){return t&&_defineProperties(e.prototype,t),n&&_defineProperties(e,n),e}function _typeof(e){"@babel/helpers - typeof";return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function _classPrivateFieldLooseBase(e,t){if(!Object.prototype.hasOwnProperty.call(e,t))throw new TypeError("attempted to use private field on non-instance");return e}function _classPrivateFieldLooseKey(e){return"__private_"+id++ +"_"+e}var id=0;Date.now||(Date.now=function(){return(new Date).getTime()}),Object.keys||(Object.keys=function(){var e=Object.prototype.hasOwnProperty,t=!{toString:null}.propertyIsEnumerable("toString"),n=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"],o=n.length;return function(r){if("object"!==_typeof(r)&&("function"!=typeof r||null===r))throw new TypeError("Object.keys called on non-object");var a,s,i=[];for(a in r)e.call(r,a)&&i.push(a);if(t)for(s=0;s<o;s++)e.call(r,n[s])&&i.push(n[s]);return i}}()),Array.prototype.forEach||(Array.prototype.forEach=function(e,t){var n,o;if(null==this)throw new TypeError(" this is null or not defined");var r=Object(this),a=r.length>>>0;if("function"!=typeof e)throw new TypeError(e+" is not a function");for(arguments.length>1&&(n=t),o=0;o<a;){var s;o in r&&(s=r[o],e.call(n,s,o,r)),o++}}),Array.prototype.indexOf||(Array.prototype.indexOf=function(e,t){var n;if(null==this)throw new TypeError('"this" is null or not defined');var o=Object(this),r=o.length>>>0;if(0===r)return-1;var a=+t||0;if(Math.abs(a)===1/0&&(a=0),a>=r)return-1;for(n=Math.max(a>=0?a:r-Math.abs(a),0);n<r;){if(n in o&&o[n]===e)return n;n++}return-1}),"function"!=typeof Object.assign&&!function(){Object.assign=function(e){if(void 0===e||null===e)throw new TypeError("Cannot convert undefined or null to object");for(var t=Object(e),n=1;n<arguments.length;n++){var o=arguments[n];if(void 0!==o&&null!==o)for(var r in o)o.hasOwnProperty(r)&&(t[r]=o[r])}return t}}();var AcquiaHttpHmac=function(){function e(t){var n=t.realm,o=t.public_key,r=t.secret_key,a=t.version,s=void 0===a?"2.0":a,i=t.default_content_type,c=void 0===i?"application/json":i;if(_classCallCheck(this,e),Object.defineProperty(this,_hasValidResponse,{value:_hasValidResponse2}),Object.defineProperty(this,_generateNonce,{value:_generateNonce2}),Object.defineProperty(this,_generateTimestamp,{value:_generateTimestamp2}),!n)throw new Error('The "realm" must not be empty.');if(!o)throw new Error('The "public_key" must not be empty.');if(!r)throw new Error('The "secret_key" must not be empty.');var p=["2.0"];if(p.indexOf(s)<0)throw new Error('The version must be "'.concat(p.join('" or "'),'". Version "').concat(s,'" is not supported.'));var u=CryptoJS.enc.Base64.parse(r);this.config={realm:n,public_key:o,parsed_secret_key:u,version:s,default_content_type:c},this.SUPPORTED_METHODS=["GET","POST","PUT","PATCH","DELETE","HEAD","OPTIONS","CUSTOM"]}return _createClass(e,[{key:"getHeaders",value:function(t){var n=t.method,o=t.path,r=t.signed_headers,a=void 0===r?{}:r,s=t.content_type,i=void 0===s?this.config.default_content_type:s,c=t.body,p=void 0===c?"":c,u=t.nonce,l=t.timestamp;if(this.SUPPORTED_METHODS.indexOf(n)<0)throw new Error("Args are ".concat(n,' TA. The method must be "').concat(this.SUPPORTED_METHODS.join('" or "'),'". "').concat(n,'" is not supported.'));if(!o)throw new Error("The end point path must not be empty.");var h=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"=",n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"",o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"&",r=!(arguments.length>4&&void 0!==arguments[4])||arguments[4],a=Object.keys(e),s=[],i={},c=[];return a.forEach(function(t){if(e.hasOwnProperty(t)){var n=t.toLowerCase();s.push(n),i[n]=r?encodeURIComponent(e[t]):e[t]}}),s.sort().forEach(function(e){i.hasOwnProperty(e)&&c.push("".concat(e).concat(t).concat(i[e]).concat(n))}),c.join(o)},f=function(e,t){var n=["GET","HEAD"];return 0!==e.length&&n.indexOf(t)<0};u=u?u:_classPrivateFieldLooseBase(this,_generateNonce)[_generateNonce]();var d=e.parseUri(o),y={id:this.config.public_key,nonce:u,realm:this.config.realm,version:this.config.version},m=l||_classPrivateFieldLooseBase(this,_generateTimestamp)[_generateTimestamp](),_=f(p,n)?CryptoJS.SHA256(p).toString(CryptoJS.enc.Base64):"",v=f(p,n)?"\n".concat(i,"\n").concat(_):"",g=d.port?":".concat(d.port):"",b="".concat(d.hostname).concat(g),H=d.search,w=h(a,":","","\n",!1),x=""===w?"":"".concat(w,"\n"),O="".concat(n,"\n").concat(b,"\n").concat(d.pathname||"/","\n").concat(H,"\n").concat(h(y),"\n").concat(x).concat(m).concat(v),T=h(y,'="','"',","),P=encodeURI(Object.keys(a).join("|||||").toLowerCase().split("|||||").sort().join(";")),S=encodeURI(CryptoJS.HmacSHA256(O,this.config.parsed_secret_key).toString(CryptoJS.enc.Base64)),q="acquia-http-hmac ".concat(T,',headers="').concat(P,'",signature="').concat(S,'"'),E={"X-Authorization-Timestamp":m,Authorization:q};return _&&(E["X-Authorization-Content-SHA256"]=_),E}},{key:"getFetchHeaders",value:function(e){var t=_classPrivateFieldLooseBase(this,_generateNonce)[_generateNonce](),n=_classPrivateFieldLooseBase(this,_generateTimestamp)[_generateTimestamp](),o=Object.assign({},e);Object.assign(o,{nonce:t,timestamp:n});var r=this.getHeaders(o);return{headers:r,nonce:t,timestamp:n}}},{key:"sign",value:function(t){var n=t.request,o=t.method,r=t.path,a=t.signed_headers,s=void 0===a?{}:a,i=t.content_type,c=void 0===i?this.config.default_content_type:i,p=t.body,u=void 0===p?"":p;if(!n||!e.isXMLHttpRequest(n)&&!e.isPromiseRequest(n))throw new Error("The request is required, and must be a XMLHttpRequest or promise-based request Object (e.g. jqXHR).");var l=_classPrivateFieldLooseBase(this,_generateNonce)[_generateNonce](),h=_classPrivateFieldLooseBase(this,_generateTimestamp)[_generateTimestamp](),f=this.getHeaders({method:o,path:r,signed_headers:s,content_type:c,body:u,nonce:l,x_authorization_timestamp:h});e.isXMLHttpRequest(n)&&0===n.readyState&&n.open(o,r,!0),n.acquiaHttpHmac={},n.acquiaHttpHmac.timestamp=h,n.acquiaHttpHmac.nonce=l,Object.keys(f).forEach(function(e){return n.setRequestHeader(e,f[e])})}},{key:"hasValidResponse",value:function(e){return _classPrivateFieldLooseBase(this,_hasValidResponse)[_hasValidResponse](e.responseText,e.getResponseHeader("X-Server-Authorization-HMAC-SHA256"),e.acquiaHttpHmac.nonce,e.acquiaHttpHmac.timestamp)}},{key:"hasValidFetchResponse",value:function(e,t,n,o){return _classPrivateFieldLooseBase(this,_hasValidResponse)[_hasValidResponse](e,t["X-Server-Authorization-HMAC-SHA256"],n,o)}}],[{key:"isXMLHttpRequest",value:function(e){return!!(e instanceof XMLHttpRequest||e.onreadystatechange)}},{key:"isPromiseRequest",value:function(e){return e.hasOwnProperty("setRequestHeader")&&e.hasOwnProperty("getResponseHeader")&&e.hasOwnProperty("promise")}},{key:"parseUri",value:function(e){for(var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n={key:["source","protocol","host","userInfo","user","password","hostname","port","relative","pathname","directory","file","search","hash"],q:{name:"queryKey",parser:/(?:^|&)([^&=]*)=?([^&]*)/g},parser:{strict:/^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,loose:/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/}},o=n.parser[t?"strict":"loose"].exec(e),r={},a=14;a--;)r[n.key[a]]=o[a]||"";return r[n.q.name]={},r[n.key[12]].replace(n.q.parser,function(e,t,o){t&&(r[n.q.name][t]=o)}),r}}]),e}(),_generateTimestamp=_classPrivateFieldLooseKey("generateTimestamp"),_generateNonce=_classPrivateFieldLooseKey("generateNonce"),_hasValidResponse=_classPrivateFieldLooseKey("hasValidResponse"),_generateTimestamp2=function(){return Math.floor(Date.now()/1e3).toString()},_generateNonce2=function(){var e=Date.now();return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(t){var n=(e+16*Math.random())%16|0;return e=Math.floor(e/16),("x"==t?n:7&n|8).toString(16)})},_hasValidResponse2=function(e,t,n,o){var r="".concat(n,"\n").concat(o,"\n").concat(e),a=CryptoJS.HmacSHA256(r,this.config.parsed_secret_key).toString(CryptoJS.enc.Base64);return a===t};if("object"===("undefined"==typeof exports?"undefined":_typeof(exports))){var CryptoJS=require("crypto-js"),XMLHttpRequest=XMLHttpRequest||require("xmlhttprequest").XMLHttpRequest;module.exports=exports=AcquiaHttpHmac}else{if("function"==typeof define&&define.amd)throw new Error("Update here to support AMD.");window.AcquiaHttpHmac=AcquiaHttpHmac}
!function(t,n){"object"==typeof exports?module.exports=exports=n():"function"==typeof define&&define.amd?define([],n):t.CryptoJS=n()}(this,function(){var t=t||function(t,n){var i=Object.create||function(){function t(){}return function(n){var i;return t.prototype=n,i=new t,t.prototype=null,i}}(),e={},r=e.lib={},o=r.Base=function(){return{extend:function(t){var n=i(this);return t&&n.mixIn(t),n.hasOwnProperty("init")&&this.init!==n.init||(n.init=function(){n.$super.init.apply(this,arguments)}),n.init.prototype=n,n.$super=this,n},create:function(){var t=this.extend();return t.init.apply(t,arguments),t},init:function(){},mixIn:function(t){for(var n in t)t.hasOwnProperty(n)&&(this[n]=t[n]);t.hasOwnProperty("toString")&&(this.toString=t.toString)},clone:function(){return this.init.prototype.extend(this)}}}(),s=r.WordArray=o.extend({init:function(t,i){t=this.words=t||[],i!=n?this.sigBytes=i:this.sigBytes=4*t.length},toString:function(t){return(t||c).stringify(this)},concat:function(t){var n=this.words,i=t.words,e=this.sigBytes,r=t.sigBytes;if(this.clamp(),e%4)for(var o=0;o<r;o++){var s=i[o>>>2]>>>24-o%4*8&255;n[e+o>>>2]|=s<<24-(e+o)%4*8}else for(var o=0;o<r;o+=4)n[e+o>>>2]=i[o>>>2];return this.sigBytes+=r,this},clamp:function(){var n=this.words,i=this.sigBytes;n[i>>>2]&=4294967295<<32-i%4*8,n.length=t.ceil(i/4)},clone:function(){var t=o.clone.call(this);return t.words=this.words.slice(0),t},random:function(n){for(var i,e=[],r=function(n){var n=n,i=987654321,e=4294967295;return function(){i=36969*(65535&i)+(i>>16)&e,n=18e3*(65535&n)+(n>>16)&e;var r=(i<<16)+n&e;return r/=4294967296,r+=.5,r*(t.random()>.5?1:-1)}},o=0;o<n;o+=4){var a=r(4294967296*(i||t.random()));i=987654071*a(),e.push(4294967296*a()|0)}return new s.init(e,n)}}),a=e.enc={},c=a.Hex={stringify:function(t){for(var n=t.words,i=t.sigBytes,e=[],r=0;r<i;r++){var o=n[r>>>2]>>>24-r%4*8&255;e.push((o>>>4).toString(16)),e.push((15&o).toString(16))}return e.join("")},parse:function(t){for(var n=t.length,i=[],e=0;e<n;e+=2)i[e>>>3]|=parseInt(t.substr(e,2),16)<<24-e%8*4;return new s.init(i,n/2)}},u=a.Latin1={stringify:function(t){for(var n=t.words,i=t.sigBytes,e=[],r=0;r<i;r++){var o=n[r>>>2]>>>24-r%4*8&255;e.push(String.fromCharCode(o))}return e.join("")},parse:function(t){for(var n=t.length,i=[],e=0;e<n;e++)i[e>>>2]|=(255&t.charCodeAt(e))<<24-e%4*8;return new s.init(i,n)}},f=a.Utf8={stringify:function(t){try{return decodeURIComponent(escape(u.stringify(t)))}catch(n){throw new Error("Malformed UTF-8 data")}},parse:function(t){return u.parse(unescape(encodeURIComponent(t)))}},h=r.BufferedBlockAlgorithm=o.extend({reset:function(){this._data=new s.init,this._nDataBytes=0},_append:function(t){"string"==typeof t&&(t=f.parse(t)),this._data.concat(t),this._nDataBytes+=t.sigBytes},_process:function(n){var i=this._data,e=i.words,r=i.sigBytes,o=this.blockSize,a=4*o,c=r/a;c=n?t.ceil(c):t.max((0|c)-this._minBufferSize,0);var u=c*o,f=t.min(4*u,r);if(u){for(var h=0;h<u;h+=o)this._doProcessBlock(e,h);var p=e.splice(0,u);i.sigBytes-=f}return new s.init(p,f)},clone:function(){var t=o.clone.call(this);return t._data=this._data.clone(),t},_minBufferSize:0}),p=(r.Hasher=h.extend({cfg:o.extend(),init:function(t){this.cfg=this.cfg.extend(t),this.reset()},reset:function(){h.reset.call(this),this._doReset()},update:function(t){return this._append(t),this._process(),this},finalize:function(t){t&&this._append(t);var n=this._doFinalize();return n},blockSize:16,_createHelper:function(t){return function(n,i){return new t.init(i).finalize(n)}},_createHmacHelper:function(t){return function(n,i){return new p.HMAC.init(t,i).finalize(n)}}}),e.algo={});return e}(Math);return t});
!function(e,t){"object"==typeof exports?module.exports=exports=t(require("./core")):"function"==typeof define&&define.amd?define(["./core"],t):t(e.CryptoJS)}(this,function(e){!function(){var t=e,i=t.lib,n=i.Base,s=t.enc,r=s.Utf8,o=t.algo;o.HMAC=n.extend({init:function(e,t){e=this._hasher=new e.init,"string"==typeof t&&(t=r.parse(t));var i=e.blockSize,n=4*i;t.sigBytes>n&&(t=e.finalize(t)),t.clamp();for(var s=this._oKey=t.clone(),o=this._iKey=t.clone(),a=s.words,f=o.words,c=0;c<i;c++)a[c]^=1549556828,f[c]^=909522486;s.sigBytes=o.sigBytes=n,this.reset()},reset:function(){var e=this._hasher;e.reset(),e.update(this._iKey)},update:function(e){return this._hasher.update(e),this},finalize:function(e){var t=this._hasher,i=t.finalize(e);t.reset();var n=t.finalize(this._oKey.clone().concat(i));return n}})}()});
!function(e,r){"object"==typeof exports?module.exports=exports=r(require("./core")):"function"==typeof define&&define.amd?define(["./core"],r):r(e.CryptoJS)}(this,function(e){return function(r){var t=e,o=t.lib,n=o.WordArray,i=o.Hasher,s=t.algo,a=[],c=[];!function(){function e(e){for(var t=r.sqrt(e),o=2;o<=t;o++)if(!(e%o))return!1;return!0}function t(e){return 4294967296*(e-(0|e))|0}for(var o=2,n=0;n<64;)e(o)&&(n<8&&(a[n]=t(r.pow(o,.5))),c[n]=t(r.pow(o,1/3)),n++),o++}();var f=[],h=s.SHA256=i.extend({_doReset:function(){this._hash=new n.init(a.slice(0))},_doProcessBlock:function(e,r){for(var t=this._hash.words,o=t[0],n=t[1],i=t[2],s=t[3],a=t[4],h=t[5],u=t[6],l=t[7],d=0;d<64;d++){if(d<16)f[d]=0|e[r+d];else{var _=f[d-15],p=(_<<25|_>>>7)^(_<<14|_>>>18)^_>>>3,v=f[d-2],H=(v<<15|v>>>17)^(v<<13|v>>>19)^v>>>10;f[d]=p+f[d-7]+H+f[d-16]}var y=a&h^~a&u,w=o&n^o&i^n&i,A=(o<<30|o>>>2)^(o<<19|o>>>13)^(o<<10|o>>>22),S=(a<<26|a>>>6)^(a<<21|a>>>11)^(a<<7|a>>>25),g=l+S+y+c[d]+f[d],m=A+w;l=u,u=h,h=a,a=s+g|0,s=i,i=n,n=o,o=g+m|0}t[0]=t[0]+o|0,t[1]=t[1]+n|0,t[2]=t[2]+i|0,t[3]=t[3]+s|0,t[4]=t[4]+a|0,t[5]=t[5]+h|0,t[6]=t[6]+u|0,t[7]=t[7]+l|0},_doFinalize:function(){var e=this._data,t=e.words,o=8*this._nDataBytes,n=8*e.sigBytes;return t[n>>>5]|=128<<24-n%32,t[(n+64>>>9<<4)+14]=r.floor(o/4294967296),t[(n+64>>>9<<4)+15]=o,e.sigBytes=4*t.length,this._process(),this._hash},clone:function(){var e=i.clone.call(this);return e._hash=this._hash.clone(),e}});t.SHA256=i._createHelper(h),t.HmacSHA256=i._createHmacHelper(h)}(Math),e.SHA256});
!function(e,r,o){"object"==typeof exports?module.exports=exports=r(require("./core"),require("./sha256"),require("./hmac")):"function"==typeof define&&define.amd?define(["./core","./sha256","./hmac"],r):r(e.CryptoJS)}(this,function(e){return e.HmacSHA256});
!function(r,e){"object"==typeof exports?module.exports=exports=e(require("./core")):"function"==typeof define&&define.amd?define(["./core"],e):e(r.CryptoJS)}(this,function(r){return function(){function e(r,e,t){for(var a=[],o=0,i=0;i<e;i++)if(i%4){var f=t[r.charCodeAt(i-1)]<<i%4*2,c=t[r.charCodeAt(i)]>>>6-i%4*2;a[o>>>2]|=(f|c)<<24-o%4*8,o++}return n.create(a,o)}var t=r,a=t.lib,n=a.WordArray,o=t.enc;o.Base64={stringify:function(r){var e=r.words,t=r.sigBytes,a=this._map;r.clamp();for(var n=[],o=0;o<t;o+=3)for(var i=e[o>>>2]>>>24-o%4*8&255,f=e[o+1>>>2]>>>24-(o+1)%4*8&255,c=e[o+2>>>2]>>>24-(o+2)%4*8&255,s=i<<16|f<<8|c,h=0;h<4&&o+.75*h<t;h++)n.push(a.charAt(s>>>6*(3-h)&63));var p=a.charAt(64);if(p)for(;n.length%4;)n.push(p);return n.join("")},parse:function(r){var t=r.length,a=this._map,n=this._reverseMap;if(!n){n=this._reverseMap=[];for(var o=0;o<a.length;o++)n[a.charCodeAt(o)]=o}var i=a.charAt(64);if(i){var f=r.indexOf(i);f!==-1&&(t=f)}return e(r,t,n)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}}(),r.enc.Base64});
"use strict";var method="GET",port=location.port?":".concat(location.port):"",pathname=location.pathname.replace(/html$/,"php"),path="".concat(location.protocol,"//").concat(location.hostname).concat(port).concat(pathname,"?first_word=Hello&second_word=World#myAnchor"),signed_headers={"Special-Header-1":"special_header_1_value","Special-Header-2":"special_header_2_value"},content_type="text/plain",hmac_config={realm:"dice",public_key:"ABCD-1234",secret_key:"d175024aa4c4d8b312a7114687790c772dd94fb725cb68016aaeae5a76d68102"},HMAC=new AcquiaHttpHmac(hmac_config),request=new XMLHttpRequest;request.onreadystatechange=function(){if(4===request.readyState){if(200!==request.status)throw new Error("Problem retrieving data.");if(!HMAC.hasValidResponse(request))throw new Error("The request does not have a valid response.");document.getElementById("text-display").innerHTML=request.response}};var sign_parameters={request:request,method:method,path:path,signed_headers:signed_headers,content_type:content_type};HMAC.sign(sign_parameters),request.setRequestHeader("Content-Type",content_type),request.setRequestHeader("Special-Header-1","special_header_1_value"),request.setRequestHeader("Special-Header-2","special_header_2_value"),request.setRequestHeader("Unsigned-Header-1","unsigned_header_1_value"),request.send();