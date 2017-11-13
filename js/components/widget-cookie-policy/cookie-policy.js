window.define('cookie-policy', function () { 'use strict';

function __$styleInject(css) {
    if (!css) return;

    if (typeof window == 'undefined') return;
    var style = document.createElement('style');
    style.setAttribute('media', 'screen');

    style.innerHTML = css;
    document.head.appendChild(style);
    return css;
}

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var get = function (selector, parent) {
	return (parent || document).querySelector(selector);
};

/* eslint-env node, browser */
var eventtarget = function (obj) {
	var listeners = {};

	function addEventListener(type, listener) {
		if (!listeners[type]) {
			listeners[type] = [];
		}
		if (listeners[type].indexOf(listener) === -1) {
			listeners[type].push(listener);
		}
	}

	function removeEventListener(type, listener) {
		if (listeners[type]) {
			if (listener) {
				var index = listeners[type].indexOf(listener);
				if (index > -1) {
					listeners[type].splice(index, 1);
				}
			} else {
				listeners[type].length = 0;
			}
		}
	}

	function dispatchEvent(type, data) {
		if (listeners[type]) {
			var handle = function(listener) {
				try {
					listener.call(obj, data);
				} catch(e) {
					if (console && console.error) {
						console.error(e);
					}
				}
			};
			listeners[type].slice().forEach(handle);
		}
	}

	Object.defineProperties(obj, {
		"addEventListener": {
			value: addEventListener
		},
		"removeEventListener": {
			value: removeEventListener
		},
		"dispatchEvent": {
			value: dispatchEvent
		}
	});
	return obj;
};

var templates = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});
// Default
function general() {
  return "<!--googleoff: all-->" + "<div>" + "<div class=\"cookie-icon\" aria-hidden=\"true\"></div>" + "<p class=\"header\">Cookie- og privatlivspolitik</p>" + "<p>" + "Vi bruger cookies for at forbedre din oplevelse, vurdere brugen af de enkelte elementer på dr.dk " + "og til at støtte markedsføringen af vores services. Ved at benytte dr.dk accepterer du vores " + "brug af cookies." + "<a class=\"dr-link\" href=\"//www.dr.dk/service/privatlivspolitik/\">Læs mere</a>" + "</p>" + "<button type=\"button\" class=\"dismiss\">OK</button>" + "</div>" + "<!--googleon: all-->";
}

// Ultra
function ultra() {
  return "<!--googleoff: all-->" + "<div>" + "<div class=\"cookie-icon\" aria-hidden=\"true\"></div>" + "<p class=\"header\">Cookies</p>" + "<p>" + "Vi bruger cookies til at samle oplysninger om måden du bruger websitet på. " + "Det gør vi for at blive klogere på hvad du godt kan lide, " + "så vi kan give dig flere gode oplevelser i Ultra." + "<a href=\"//www.dr.dk/ultra/sider/ultra-cookie-politik\">Læs mere</a>" + "</p>" + "<button type=\"button\" class=\"dismiss\">OK</button>" + "</div>" + "<!--googleon: all-->";
}

// Ramasjang
function ramasjang() {
  return "<!--googleoff: all-->" + "<div>" + "<div class=\"cookie-icon\" aria-hidden=\"true\"></div>" + "<p class=\"header\">Cookies</p>" + "<p>" + "Vi bruger cookies til at samle oplysninger om måden du bruger websitet på. " + "Det gør vi for at blive klogere på hvad du godt kan lide, " + "så vi kan give dig flere gode oplevelser i Ramasjang." + "<a href=\"//www.dr.dk/ramasjang/20170904140725\">Læs mere</a>" + "</p>" + "<button type=\"button\" class=\"dismiss\">OK</button>" + "</div>" + "<!--googleon: all-->";
}

exports.default = {
  general: general,
  ultra: ultra,
  ramasjang: ramasjang
};
});

unwrapExports(templates);

__$styleInject(".drc-cookie-policy {\n  position: fixed;\n  bottom: 0;\n  height: auto;\n  width: 100%;\n  background: #4d4d4d;\n  background: rgba(77, 77, 77, 0.95);\n  z-index: 1000;\n}\n.drc-cookie-policy > div {\n  position: relative;\n  display: block;\n  margin: 10px 10px;\n  width: auto;\n  *zoom: 1;\n}\n.drc-cookie-policy > div:before,\n.drc-cookie-policy > div:after {\n  content: \" \";\n  display: table;\n}\n.drc-cookie-policy > div:after {\n  clear: both;\n}\n.drc-cookie-policy > div > h1,\n.drc-cookie-policy > div > .header {\n  margin: -5px 0 0;\n  padding-left: 32px;\n  line-height: 30px;\n  position: relative;\n  display: block;\n  font-family: \"gibsonSemiBold\", \"arial black\", sans-serif;\n  font-size: 14px;\n  color: #fff;\n  text-transform: uppercase;\n  *zoom: 1;\n}\n.drc-cookie-policy > div > h1:before,\n.drc-cookie-policy > div > .header:before,\n.drc-cookie-policy > div > h1:after,\n.drc-cookie-policy > div > .header:after {\n  content: \" \";\n  display: table;\n}\n.drc-cookie-policy > div > h1:after,\n.drc-cookie-policy > div > .header:after {\n  clear: both;\n}\n.drc-cookie-policy > div > .cookie-icon {\n  width: 27px;\n  height: 25px;\n  background-color: transparent;\n  background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADkAAAA1CAMAAADMBLPMAAABC1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8AAAA3w/QSt/EVufEgvPK/v7961/jf9v0OtvEbuvImvfI+xfQuwPNhz/YywfMqv/NGx/RYzfZPyvVczfZTy/VCxvSB2fh92PhKyfWF2vhq0vdl0fYQEBB21veAgICd4vqM3Pht0/eY4PmU3/kgICC16fuP3vmJ3Pnf399gYGDa9P3O8fzB7fym5Prv7+9AQEDq+f7I7/xx1fe76/ui4/r5/f/j9/3U8v2u5/ufn5+r5vr0/P7w+/5WzPXu+v6w6PrPz8/l9/6Pj4+vr68wMDArv/JwcHAKBuq1AAAAEXRSTlMAwYIkRNf2s2KmowyTU3O2NOks03wAAANOSURBVEjHlZZpc5pAGICL0cZo03Zf61UPjGLEiCIIoshhIOCtOXr9/1/SRVerRi08n5Z35pmdgWd2+XCecCgUvfoQnKsvgPn4KbAYp6Dbbg8AboKaN/BriBB6bcFtMDEMLRUtnkfoB1DBzGtoI2uia0vUhVAQMQqt4VJ3FEMbpSESxKRghjRnbr7Yb+gRArzfEHSRZU9dwVT0xSt89P9VI5AeTRRXkATTyaKB/y/zCR7R2DAFSZKEqb1UWxD2Wc9HeF3oU0HGSK6ioTZc+41ggDRFkHsekmlYwxZE/UbwbJiyuKYnTXU0A8pvBJOpJPY39ARn7C+HWxyB5QhiY0vPtP3lQMEPpJu9BrulIb9ofnL4jCPIKnKjvoNtCMbSRw4R+DmyhUY9k0EbMpm6aE7+n0MIR6DNxQzP88TEq7qsWCSHSxGkl45cf8IQE694VrD/l0MMR6C77FMHQ0xvyfen48s5fAVQrZf+E+dBTG/ZycjG5Ryu4Q+yJZ5rehBzve6wroZz+Hyhu+F4znL0ezqiM/p5PgcKd2eIHbr6HpqXJujxXINRHIEm8HTlBNUm+/KcPpdDBGYjhW2u7k9R4Xo2ziF2LgJd5lYMAW0gT/dV3nxT4VQO8QiOYM5XmAcCMbePDN1wTucQw1vafZopbyHm7pnhpCzO4fZEd6rldphybQsxd8/lVUY5dVlc4+4MtlIu7CDmv0GZ7k1wDtETEUjNciGxg5j/BgWmMx/NIPL+8FF4BosnTaKuWJvkcHADab1KobQHMfcmiVpTwDlE4kc30Jwrl4p7EHN/lHjIGHjT2OENpLNM6W4fYu6PiomqZKn7DeIIFi6duMvvQ8yD2e/ak0KOpF13Bl+7Sx1AzINZvsSIWXIkkcPHku+LqYsmURPNKWmQHD4Kl0jlDiHm0TRfZidDsmkYQM32H/K55CHEPJrmilUTb0ptI5jSJSKeNwmpAq9vGrzCEWQbtdS3Y4h5PE7mV+7mHIx6qXPF5He/5ArsGAF4n6SNnGYxmfzmj2SuUPfutvDanPRXhYRfak13gbpwhV9tFyHdu718Ua+L8zFSIbKufYAQssZZf7wtEFJ/QWyTULc9S/unPWgBFV/XR0FQbuK7P/YY5R/yd/8XGNHhvJWDmxkAAAAASUVORK5CYII=\");\n  background-repeat: no-repeat;\n  background-position: top left;\n  background-size: contain;\n  position: absolute;\n  top: -3px;\n  left: 0;\n}\n.drc-cookie-policy > div > button {\n  position: static;\n  top: 30px;\n  right: 0;\n  display: block;\n  width: 100%;\n  height: 30px;\n  background: blue;\n  padding: 0 10px;\n  text-align: center;\n  border: 0;\n  outline: 0;\n  font: 14px/30px \"gibsonRegular\", \"Arial\", sans-serif;\n  cursor: pointer;\n  background-color: #38b4ef;\n  text-transform: uppercase;\n  text-decoration: none;\n  color: #fff;\n}\n.drc-cookie-policy > div > button:active,\n.drc-cookie-policy > div > button:focus {\n  outline: 0;\n}\n.drc-cookie-policy > div > button:hover {\n  background-color: #0076ae;\n}\n.drc-cookie-policy > div > button:active {\n  background-color: #38b4ef;\n}\n.drc-cookie-policy > div > p {\n  *zoom: 1;\n  display: block;\n  margin-right: 70px;\n  font: 14px/16px \"gibsonRegular\", \"Arial\", sans-serif;\n  color: #fff;\n  -webkit-font-smoothing: subpixel-antialiased;\n  padding-bottom: 10px;\n  margin: 0;\n  width: auto;\n}\n.drc-cookie-policy > div > p:before,\n.drc-cookie-policy > div > p:after {\n  content: \" \";\n  display: table;\n}\n.drc-cookie-policy > div > p:after {\n  clear: both;\n}\n.drc-cookie-policy > div > p a {\n  margin-top: 3px;\n  display: block;\n  color: #38b4ef;\n  text-decoration: underline;\n  text-transform: uppercase;\n}\n.drc-cookie-policy.ultra {\n  background: rgba(51, 51, 51, 0.85);\n}\n.drc-cookie-policy.ultra > div > .cookie-icon {\n  background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAtCAMAAAANxBKoAAAAkFBMVEUAAADj/xbj/xbj/xbj/xbj/xbj/xbj/xbj/xbj/xbj/xbj/xbj/xbj/xbj/xbj/xbj/xbj/xbj/xbj/xbj/xbj/xbj/xbj/xbj/xbj/xbj/xbj/xbj/xbj/xbj/xbj/xbj/xbj/xbj/xbj/xbj/xbj/xbj/xbj/xbj/xbj/xbj/xbj/xbj/xbj/xbj/xbj/xaDvf7SAAAAL3RSTlMAwHCw+gLuLDDgkYZbUBwN0825nXdrPikiEwbp1tCrp5qXi2NNSxfy3MeDelZSN9nsFzgAAAFCSURBVEjHldXnjoJAFIbhj6VJkaIgYHft9bv/u1vMaJDAyuH5y5vJGSaTQbvpbjw3SGfph2iV39P0NjDx5J/4ZiXTRlpcnNfHjY1Q56c4R42ZHlnZxKybZbUhl/zOKarY1NllWdUXdpvgxTYEtY4XnQJGqOKAIntVb9lg6aWINYmqx2zQUPphjatqTVZzsUPpLKgV1wRG4pqeZO6KjW2Peo2gR+0AurwmMDD61NiI6xMQWOLabZs7GpbGbDByPCiWAr+USgBEbIgHpeYqGQBDfDo3ABTXW+Ha1WVbiOscPf5JhJJNIR9PK4poJp4KhwKLAoo9Y6d1iLdA4zdW7GX4YN5Vb62T1u01hJPh3p4C/lElo6oe4X+HqzY/uza8Kj+g25VvPxDYWVTmJgQOq+odkXioza4glLkz0gggZU48zYPyByOD+BSRDLadAAAAAElFTkSuQmCC\");\n}\n.drc-cookie-policy.ultra > div > button {\n  background-color: #e3ff16;\n  color: #000;\n}\n.drc-cookie-policy.ultra > div > p a {\n  color: #e3ff16;\n}\n@media (min-width: 980px) {\n  .drc-cookie-policy {\n    position: fixed;\n    display: block;\n    left: 0;\n    right: 0;\n  }\n  .drc-cookie-policy > div {\n    margin: 10px auto;\n    max-width: 940px;\n  }\n  .drc-cookie-policy > div > h1,\n  .drc-cookie-policy > div > .header {\n    margin: 2px 0 0 0;\n    padding-left: 60px;\n    line-height: 16px;\n  }\n  .drc-cookie-policy > div > .cookie-icon {\n    width: 46px;\n    height: 43px;\n    top: 2px;\n  }\n  .drc-cookie-policy > div > p {\n    width: 700px;\n    margin: 0 0 0 60px;\n    padding: 0;\n  }\n  .drc-cookie-policy > div > button {\n    position: absolute;\n    width: 70px;\n  }\n}\n");

var cookiePolicy = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();



var _get2 = _interopRequireDefault(get);



var _eventtarget2 = _interopRequireDefault(eventtarget);



var _templates2 = _interopRequireDefault(templates);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CookiePolicy = function () {
  function CookiePolicy() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, CookiePolicy);

    if (!options.template || !_templates2.default.hasOwnProperty(options.template)) {
      options.template = "general"; // fallback
    }

    this.options = options;

    // Make this an event target
    (_eventtarget2.default)(this);

    this.render();
  }

  _createClass(CookiePolicy, [{
    key: "render",
    value: function render() {
      var _this = this;

      var html = _templates2.default[this.options.template]();
      
      this.container = document.createElement("div");
      this.container.className = "drc-cookie-policy " + this.options.template;
      this.container.innerHTML = html;
      document.body.insertBefore(this.container, document.body.firstChild);
      var button = (_get2.default)("button.dismiss", this.container);
      button.onclick = function () {
        _this.dismiss();
      };
      this.container.focus();
    }
  }, {
    key: "dismiss",
    value: function dismiss() {
      if (!this.container) {
        return;
      }
      this.container.parentNode.removeChild(this.container);
      this.dispatchEvent("dismiss");
    }
  }]);

  return CookiePolicy;
}();

exports.default = CookiePolicy;
});

unwrapExports(cookiePolicy);

var dist = createCommonjsModule(function (module) {
var _cookiePolicy2 = _interopRequireDefault(cookiePolicy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function initialize() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return new _cookiePolicy2.default(options);
}

module.exports = initialize;
});

unwrapExports(dist);

var storageKey = "cookieDismissed";

// Copied from drc-global, but modified to avoid require.ensure().
var cookiePolicyLoader = {
  initialize: function(options) {
    if (location.hostname.toLowerCase().slice(-6) !== ".dr.dk") {
      // return;
    }

    try {
      if (localStorage.getItem(storageKey)) {
        // cookie policy already dismissed - bail.
        return;
      } else {
        var testKey = storageKey + "Test";
        localStorage.setItem(testKey, testKey);
        if (!localStorage.getItem(testKey)) {
          // localStorage is not working properly - bail.
          return;
        } else {
          // localStorage seems to be working - clean up.
          localStorage.removeItem(testKey);
        }
      }
    } catch (e) {
      // localStorage not supported - bail.
      return;
    }

    var template = this.getTemplateName();

    var cp = dist({ template: template });
    cp.addEventListener("dismiss", function() {
      try {
        localStorage.setItem(storageKey, Math.round(new Date() / 1000));
      } catch (e) {}
    });
  },

  getTemplateName: function() {
    var pathname = location.pathname;
    if (pathname.slice(-1) !== "/") {
      pathname += "/";
    }
    if (pathname.toLowerCase().indexOf("/ultra/") === 0) {
      return "ultra";
    }
    if (pathname.toLowerCase().indexOf("/ramasjang/") === 0) {
      return "ramasjang";
    }
    return "default";
  }
};

var drcCookiePolicy_1 = {
  initialize: function() {
    cookiePolicyLoader.initialize();
  }
};

return drcCookiePolicy_1;

});
