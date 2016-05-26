"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol?"symbol":typeof e};Date.now||(Date.now=function(){return(new Date).getTime()}),Object.keys||(Object.keys=function(){var e=Object.prototype.hasOwnProperty,t=!{toString:null}.propertyIsEnumerable("toString"),r=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"],n=r.length;return function(o){if("object"!==("undefined"==typeof o?"undefined":_typeof(o))&&("function"!=typeof o||null===o))throw new TypeError("Object.keys called on non-object");var a,i,s=[];for(a in o)e.call(o,a)&&s.push(a);if(t)for(i=0;n>i;i++)e.call(o,r[i])&&s.push(r[i]);return s}}()),Array.prototype.forEach||(Array.prototype.forEach=function(e,t){var r,n;if(null==this)throw new TypeError(" this is null or not defined");var o=Object(this),a=o.length>>>0;if("function"!=typeof e)throw new TypeError(e+" is not a function");for(arguments.length>1&&(r=t),n=0;a>n;){var i;n in o&&(i=o[n],e.call(r,i,n,o)),n++}});var AcquiaHttpHmac=function(){function e(t){var r=t.realm,n=t.public_key,o=t.secret_key,a=t.version,i=void 0===a?"2.0":a,s=t.default_content_type,u=void 0===s?"application/json":s;if(_classCallCheck(this,e),!r)throw new Error('The "realm" must not be empty.');if(!n)throw new Error('The "public_key" must not be empty.');if(!o)throw new Error('The "secret_key" must not be empty.');var c=["2.0"];if(c.indexOf(i)<0)throw new Error('The version must be "'+c.join('" or "')+'". Version "'+i+'" is not supported.');var p=CryptoJS.enc.Base64.parse(o);this.config={realm:r,public_key:n,parsed_secret_key:p,version:i,default_content_type:u},this.SUPPORTED_METHODS=["GET","POST","PUT","DELETE","HEAD","OPTIONS","CUSTOM"]}return _createClass(e,[{key:"isXMLHttpRequest",value:function(e){return e instanceof XMLHttpRequest}},{key:"isPromiseRequest",value:function(e){return e.hasOwnProperty("setRequestHeader")&&e.hasOwnProperty("getResponseHeader")&&e.hasOwnProperty("promise")}},{key:"sign",value:function(e){var t=e.request,r=e.method,n=e.path,o=e.signed_headers,a=void 0===o?{}:o,i=e.content_type,s=void 0===i?this.config.default_content_type:i,u=e.body,c=void 0===u?"":u;if(!this.isXMLHttpRequest(t)&&!this.isPromiseRequest(t))throw new Error("The request must be a XMLHttpRequest or promise-based request Object (e.g. jqXHR).");if(this.SUPPORTED_METHODS.indexOf(r)<0)throw new Error('The method must be "'+this.SUPPORTED_METHODS.join('" or "')+'". "'+r+'" is not supported.');if(!n)throw new Error("The end point path must not be empty.");var p=function(e){var t=arguments.length<=1||void 0===arguments[1]?"=":arguments[1],r=arguments.length<=2||void 0===arguments[2]?"":arguments[2],n=arguments.length<=3||void 0===arguments[3]?"&":arguments[3],o=Object.keys(e).sort(),a=[];return o.forEach(function(n){e.hasOwnProperty(n)&&a.push(""+n.toLocaleLowerCase()+t+encodeURI(e[n])+r)}),a.join(n)},f=function(){var e=Date.now();return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(t){var r=(e+16*Math.random())%16|0;return e=Math.floor(e/16),("x"==t?r:7&r|8).toString(16)})},h=function(e,t){var r=["GET","HEAD"];return 0!==e.length&&r.indexOf(t)<0},y=f(),l=document.createElement("a"),m={id:this.config.public_key,nonce:y,realm:this.config.realm,version:this.config.version},d=Math.floor(Date.now()/1e3).toString(),g=h(c,r)?CryptoJS.SHA256(c).toString(CryptoJS.enc.Base64):"",H=h(c,r)?"\n"+s+"\n"+g:"";l.href=n;var v=l.port?":"+l.port:"",w=""+l.hostname+v,x=l.search.substring(1),b=r+"\n"+w+"\n"+l.pathname+"\n"+x+"\n"+p(m)+"\n"+d+H,S=p(m,'="','"',","),E=0===Object.keys(a).length?"":',headers="'+encodeURI(Object.keys(a).sort().join(";").toLowerCase())+'"',O=encodeURI(CryptoJS.HmacSHA256(b,this.config.parsed_secret_key).toString(CryptoJS.enc.Base64)),_="acquia-http-hmac "+S+E+',signature="'+O+'"';this.isXMLHttpRequest(t)&&0===t.readyState&&t.open(r,n,!0),t.acquiaHttpHmac={},t.acquiaHttpHmac.timestamp=d,t.acquiaHttpHmac.nonce=y,t.setRequestHeader("X-Authorization-Timestamp",d),t.setRequestHeader("Authorization",_),g&&t.setRequestHeader("X-Authorization-Content-SHA256",g)}},{key:"hasValidResponse",value:function(e){var t=e.acquiaHttpHmac.nonce+"\n"+e.acquiaHttpHmac.timestamp+"\n"+e.responseText,r=CryptoJS.HmacSHA256(t,this.config.parsed_secret_key).toString(CryptoJS.enc.Base64),n=e.getResponseHeader("X-Server-Authorization-HMAC-SHA256");return r===n}}]),e}();if("object"===("undefined"==typeof exports?"undefined":_typeof(exports))){var CryptoJS=require("crypto-js");module.exports=exports=AcquiaHttpHmac}else{if("function"==typeof define&&define.amd)throw new Error("Update here to support AMD.");window.AcquiaHttpHmac=AcquiaHttpHmac}
!function(t,n){"object"==typeof exports?module.exports=exports=n():"function"==typeof define&&define.amd?define([],n):t.CryptoJS=n()}(this,function(){var t=t||function(t,n){var i={},e=i.lib={},r=e.Base=function(){function t(){}return{extend:function(n){t.prototype=this;var i=new t;return n&&i.mixIn(n),i.hasOwnProperty("init")||(i.init=function(){i.$super.init.apply(this,arguments)}),i.init.prototype=i,i.$super=this,i},create:function(){var t=this.extend();return t.init.apply(t,arguments),t},init:function(){},mixIn:function(t){for(var n in t)t.hasOwnProperty(n)&&(this[n]=t[n]);t.hasOwnProperty("toString")&&(this.toString=t.toString)},clone:function(){return this.init.prototype.extend(this)}}}(),s=e.WordArray=r.extend({init:function(t,i){t=this.words=t||[],i!=n?this.sigBytes=i:this.sigBytes=4*t.length},toString:function(t){return(t||a).stringify(this)},concat:function(t){var n=this.words,i=t.words,e=this.sigBytes,r=t.sigBytes;if(this.clamp(),e%4)for(var s=0;r>s;s++){var o=i[s>>>2]>>>24-s%4*8&255;n[e+s>>>2]|=o<<24-(e+s)%4*8}else for(var s=0;r>s;s+=4)n[e+s>>>2]=i[s>>>2];return this.sigBytes+=r,this},clamp:function(){var n=this.words,i=this.sigBytes;n[i>>>2]&=4294967295<<32-i%4*8,n.length=t.ceil(i/4)},clone:function(){var t=r.clone.call(this);return t.words=this.words.slice(0),t},random:function(n){for(var i,e=[],r=function(n){var n=n,i=987654321,e=4294967295;return function(){i=36969*(65535&i)+(i>>16)&e,n=18e3*(65535&n)+(n>>16)&e;var r=(i<<16)+n&e;return r/=4294967296,r+=.5,r*(t.random()>.5?1:-1)}},o=0;n>o;o+=4){var a=r(4294967296*(i||t.random()));i=987654071*a(),e.push(4294967296*a()|0)}return new s.init(e,n)}}),o=i.enc={},a=o.Hex={stringify:function(t){for(var n=t.words,i=t.sigBytes,e=[],r=0;i>r;r++){var s=n[r>>>2]>>>24-r%4*8&255;e.push((s>>>4).toString(16)),e.push((15&s).toString(16))}return e.join("")},parse:function(t){for(var n=t.length,i=[],e=0;n>e;e+=2)i[e>>>3]|=parseInt(t.substr(e,2),16)<<24-e%8*4;return new s.init(i,n/2)}},c=o.Latin1={stringify:function(t){for(var n=t.words,i=t.sigBytes,e=[],r=0;i>r;r++){var s=n[r>>>2]>>>24-r%4*8&255;e.push(String.fromCharCode(s))}return e.join("")},parse:function(t){for(var n=t.length,i=[],e=0;n>e;e++)i[e>>>2]|=(255&t.charCodeAt(e))<<24-e%4*8;return new s.init(i,n)}},u=o.Utf8={stringify:function(t){try{return decodeURIComponent(escape(c.stringify(t)))}catch(n){throw new Error("Malformed UTF-8 data")}},parse:function(t){return c.parse(unescape(encodeURIComponent(t)))}},f=e.BufferedBlockAlgorithm=r.extend({reset:function(){this._data=new s.init,this._nDataBytes=0},_append:function(t){"string"==typeof t&&(t=u.parse(t)),this._data.concat(t),this._nDataBytes+=t.sigBytes},_process:function(n){var i=this._data,e=i.words,r=i.sigBytes,o=this.blockSize,a=4*o,c=r/a;c=n?t.ceil(c):t.max((0|c)-this._minBufferSize,0);var u=c*o,f=t.min(4*u,r);if(u){for(var h=0;u>h;h+=o)this._doProcessBlock(e,h);var p=e.splice(0,u);i.sigBytes-=f}return new s.init(p,f)},clone:function(){var t=r.clone.call(this);return t._data=this._data.clone(),t},_minBufferSize:0}),h=(e.Hasher=f.extend({cfg:r.extend(),init:function(t){this.cfg=this.cfg.extend(t),this.reset()},reset:function(){f.reset.call(this),this._doReset()},update:function(t){return this._append(t),this._process(),this},finalize:function(t){t&&this._append(t);var n=this._doFinalize();return n},blockSize:16,_createHelper:function(t){return function(n,i){return new t.init(i).finalize(n)}},_createHmacHelper:function(t){return function(n,i){return new h.HMAC.init(t,i).finalize(n)}}}),i.algo={});return i}(Math);return t});
!function(e,t){"object"==typeof exports?module.exports=exports=t(require("./core")):"function"==typeof define&&define.amd?define(["./core"],t):t(e.CryptoJS)}(this,function(e){!function(){var t=e,i=t.lib,n=i.Base,s=t.enc,r=s.Utf8,o=t.algo;o.HMAC=n.extend({init:function(e,t){e=this._hasher=new e.init,"string"==typeof t&&(t=r.parse(t));var i=e.blockSize,n=4*i;t.sigBytes>n&&(t=e.finalize(t)),t.clamp();for(var s=this._oKey=t.clone(),o=this._iKey=t.clone(),a=s.words,f=o.words,c=0;i>c;c++)a[c]^=1549556828,f[c]^=909522486;s.sigBytes=o.sigBytes=n,this.reset()},reset:function(){var e=this._hasher;e.reset(),e.update(this._iKey)},update:function(e){return this._hasher.update(e),this},finalize:function(e){var t=this._hasher,i=t.finalize(e);t.reset();var n=t.finalize(this._oKey.clone().concat(i));return n}})}()});
!function(e,r){"object"==typeof exports?module.exports=exports=r(require("./core")):"function"==typeof define&&define.amd?define(["./core"],r):r(e.CryptoJS)}(this,function(e){return function(r){var t=e,o=t.lib,n=o.WordArray,i=o.Hasher,s=t.algo,a=[],c=[];!function(){function e(e){for(var t=r.sqrt(e),o=2;t>=o;o++)if(!(e%o))return!1;return!0}function t(e){return 4294967296*(e-(0|e))|0}for(var o=2,n=0;64>n;)e(o)&&(8>n&&(a[n]=t(r.pow(o,.5))),c[n]=t(r.pow(o,1/3)),n++),o++}();var f=[],h=s.SHA256=i.extend({_doReset:function(){this._hash=new n.init(a.slice(0))},_doProcessBlock:function(e,r){for(var t=this._hash.words,o=t[0],n=t[1],i=t[2],s=t[3],a=t[4],h=t[5],u=t[6],l=t[7],d=0;64>d;d++){if(16>d)f[d]=0|e[r+d];else{var _=f[d-15],p=(_<<25|_>>>7)^(_<<14|_>>>18)^_>>>3,v=f[d-2],H=(v<<15|v>>>17)^(v<<13|v>>>19)^v>>>10;f[d]=p+f[d-7]+H+f[d-16]}var y=a&h^~a&u,w=o&n^o&i^n&i,A=(o<<30|o>>>2)^(o<<19|o>>>13)^(o<<10|o>>>22),S=(a<<26|a>>>6)^(a<<21|a>>>11)^(a<<7|a>>>25),g=l+S+y+c[d]+f[d],m=A+w;l=u,u=h,h=a,a=s+g|0,s=i,i=n,n=o,o=g+m|0}t[0]=t[0]+o|0,t[1]=t[1]+n|0,t[2]=t[2]+i|0,t[3]=t[3]+s|0,t[4]=t[4]+a|0,t[5]=t[5]+h|0,t[6]=t[6]+u|0,t[7]=t[7]+l|0},_doFinalize:function(){var e=this._data,t=e.words,o=8*this._nDataBytes,n=8*e.sigBytes;return t[n>>>5]|=128<<24-n%32,t[(n+64>>>9<<4)+14]=r.floor(o/4294967296),t[(n+64>>>9<<4)+15]=o,e.sigBytes=4*t.length,this._process(),this._hash},clone:function(){var e=i.clone.call(this);return e._hash=this._hash.clone(),e}});t.SHA256=i._createHelper(h),t.HmacSHA256=i._createHmacHelper(h)}(Math),e.SHA256});
!function(e,r,o){"object"==typeof exports?module.exports=exports=r(require("./core"),require("./sha256"),require("./hmac")):"function"==typeof define&&define.amd?define(["./core","./sha256","./hmac"],r):r(e.CryptoJS)}(this,function(e){return e.HmacSHA256});
!function(r,e){"object"==typeof exports?module.exports=exports=e(require("./core")):"function"==typeof define&&define.amd?define(["./core"],e):e(r.CryptoJS)}(this,function(r){return function(){var e=r,t=e.lib,n=t.WordArray,a=e.enc;a.Base64={stringify:function(r){var e=r.words,t=r.sigBytes,n=this._map;r.clamp();for(var a=[],i=0;t>i;i+=3)for(var o=e[i>>>2]>>>24-i%4*8&255,f=e[i+1>>>2]>>>24-(i+1)%4*8&255,c=e[i+2>>>2]>>>24-(i+2)%4*8&255,s=o<<16|f<<8|c,p=0;4>p&&t>i+.75*p;p++)a.push(n.charAt(s>>>6*(3-p)&63));var u=n.charAt(64);if(u)for(;a.length%4;)a.push(u);return a.join("")},parse:function(r){var e=r.length,t=this._map,a=t.charAt(64);if(a){var i=r.indexOf(a);-1!=i&&(e=i)}for(var o=[],f=0,c=0;e>c;c++)if(c%4){var s=t.indexOf(r.charAt(c-1))<<c%4*2,p=t.indexOf(r.charAt(c))>>>6-c%4*2,u=s|p;o[f>>>2]|=u<<24-f%4*8,f++}return n.create(o,f)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}}(),r.enc.Base64});
"use strict";var method="POST",port=location.port?":"+location.port:"",pathname=location.pathname.replace(/html$/,"php"),path=location.protocol+"//"+location.hostname+port+pathname+"?myQueryParameter=90210#myAnchor",signed_headers={"Special-Header-1":"special_header_1_value","Special-Header-2":"special_header_2_value"},content_type="application/x-www-form-urlencoded",body="first_word=Hello&second_word=World",hmac_config={realm:"dice",public_key:"ABCD-1234",secret_key:"d175024aa4c4d8b312a7114687790c772dd94fb725cb68016aaeae5a76d68102"},HMAC=new AcquiaHttpHmac(hmac_config),request=new XMLHttpRequest;request.onreadystatechange=function(){if(4===request.readyState){if(200!==request.status)throw new Error("Problem retrieving data.");if(!HMAC.hasValidResponse(request))throw new Error("The request does not have a valid response.");document.getElementById("text-display").innerHTML=request.response}};var sign_parameters={request:request,method:method,path:path,signed_headers:signed_headers,content_type:content_type,body:body};HMAC.sign(sign_parameters),request.setRequestHeader("Content-Type",content_type),request.setRequestHeader("Special-Header-1","special_header_1_value"),request.setRequestHeader("Special-Header-2","special_header_2_value"),request.setRequestHeader("Unsigned-Header-1","unsigned_header_1_value"),request.send(body);