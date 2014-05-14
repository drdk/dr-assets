/*
|--------------------------------------------------------------------------
| Cookie Policy box
|--------------------------------------------------------------------------
|
| Not for hybrid apps, only web. Uses cookies to save toggle state.
*/

(function (win, doc) {
	win.define("cookie-policy", function() {
		// detect cookie support/blockage
		if (!doc.cookie) {
			doc.cookie = "cookiePolicyDismissedTest=true";
			if (!doc.cookie.match(/(?:^|[; ]+)cookiePolicyDismissed=yes(?:;|$)/)) {
				return; // cookies not supported/blocked
			}
			doc.cookie = "cookiePolicyDismissedTest=;expires=" + expireIn(-1);
		}
		// if already dismissed 
		else if (doc.cookie.match(/(?:^|[; ]+)cookiePolicyDismissed=yes(?:;|$)/)) {
			return;
		}

		function expireIn(days) {
			var expires = new Date();
			expires.setDate(expires.getDate() + days);
			return expires.toUTCString();
		}

		var catchEvent = function(element, event, cb) {
			if (element.addEventListener) {
				element.addEventListener(event, cb, false);
			} else if (doc.attachEvent) {
				element.attachEvent("on" + event, cb);
			}
		};

		var cookiePolicy = {

			__data: {
				iconUrl: "http://www.dr.dk/assets/img/cookie-icon.png",
				title: "Cookie- og privatlivspolitik på dr.dk",
				mobileTitle: "Cookie- og privatlivspolitik",
				bodyText: "Vi bruger cookies for at forbedre din oplevelse, vurdere brugen af de enkelte elementer på dr.dk "
				+ "og til at støtte markedsføringen af vores services. Ved at klikke videre på dr.dk accepterer du vores "
				+ "brug af cookies.",
				infoUrl: "http://www.dr.dk/service/privatlivspolitik/"
			},
			
			__template: "<!--googleoff: all--><div>"
				+ "<h1><img src=\"{iconUrl}\">{title}</h1>"
				+ "<p>{bodyText}<a class=\"dr-link\" href=\"{infoUrl}\">Læs mere</a></p>"
				+ "<button type=\"button\">OK</button>"
				+ "</div> <!--googleon: all-->", // space or newline before googleon tag is required

			__getRootDomain: function() {
				var url = location.href;
				if(url.search(/^https?\:\/\//) != -1) {
					url = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i, "");
				} else {
					url = url.match(/^([^\/?#]+)(?:[\/?#]|$)/i, "");
				}

				return url[1];
			},

			////////////////////////////////////////////////////////////////////////////////
			/// Policy alert/popup/nag
			////////////////////////////////////////////////////////////////////////////////

			initialize: function () {

				// Container
				this.container = doc.createElement("div");
				this.container.className = "cookie-info-box";
				var host = location.hostname.toLowerCase();
				var data = this.__data;
				if (host === "mobil.dr.dk" || host === "mobilstage.dr.dk") {
					data = this.__data.mobileTitle;
				}

				this.container.innerHTML = this.__template.replace(/\{([^}]+)\}/g, function (m, key) {
					return (key in data) ? data[key]: m;
				});

				doc.body.insertBefore(this.container, doc.body.firstChild);

				var button = this.container.getElementsByTagName("button")[0];
					catchEvent(button, "click", function() {
						cookiePolicy.dismiss();
					});
				this.container.focus();
			},

			dismiss: function() {
				this.container.parentNode.removeChild(this.container);

				var domain = this.__getRootDomain();
				if (!/((^|\.)((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]?\d))){4}(:[\d]{1,5})?$/.test(domain)) {
					domain = "." + domain;
				} else {
					var idx = -1;

					if ((idx = domain.indexOf(":")) != -1) {
						domain = domain.substring(0, idx);
					}
				}

				doc.cookie = "cookiePolicyDismissed=yes; expires=" + expireIn(365) + "; path=/; domain=" + domain;
			}
		};
	});
})(window, document);