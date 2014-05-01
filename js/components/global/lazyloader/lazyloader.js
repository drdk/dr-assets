var lazyloader = (function (global, doc) {
	
	// higher pixel density allows for
	// larger images at lower quality at roughly the same weight
	var devicePixelRatio = window.devicePixelRatio || 1,
		quality = (function (p) {
			var max = 75,
				min = 30,
				value = max,
				range = max - min;

			if (p >= 2) {
				value = min;
			}
			else if (p > 1 && p < 2) {
				value = max + Math.round((p - 1) * range);
			}

			return value;
		}(devicePixelRatio)),
		location = global.location,
		isDrdk = (location.hostname === "www.dr.dk"),
		isLocalhost = (location.hostname === "localhost"),
		//excludedPaths = /^\/(sporten\/ol2012)/i,
		isExcludedpath = false, //(location.pathname.match(excludedPaths)),
		scaler = (isDrdk) ? "//asset.dr.dk/imagescaler/" : "//wcf/imagescaler/",
		ratios = {
			"ratio-16-9": 0.5625,
			"ratio-4-3": 0.75,
			"ratio-1-1": 1,
			"ratio-3-4": 1.25
		};

	return function replaceImage (placeholder) {

		var dataElement = placeholder.querySelector("[data-src]"),
			src, useSource, forceDrdk,
			_width, _height, _ratio,
			properties;

		if (!dataElement) {
			return;
		}

		src = dataElement.getAttribute("data-src");
		_width = dataElement.getAttribute("data-width");
		_height = dataElement.getAttribute("data-height");
		_ratio = _height / _width;

		properties = {
			"aria-hidden": "true",
			"role": "presentation"
		};

		if (src) {

			forceDrdk = (src.match(/^\/(?:nr|mu)\//i) && isLocalhost);

			placeholder.removeChild(dataElement);

			dataElement.setAttribute("data-src", "");

			properties.alt = dataElement.getAttribute("data-alt") || "";

			var height = placeholder.offsetHeight,
				ratio = placeholder.className.match(/ratio-(\d+)-(\d+)/);

			if (devicePixelRatio > 1) {
				height *= devicePixelRatio;
			}

			if (ratio) {
				ratio = (ratio[0] in ratios) ? ratios[ratio[0]] : ratio[2] / ratio[1];
				width = height / ratio;
			}

			width = Math.round(width);
			height = Math.round(height);

			// if no ratio is set - or - if ratio and source image are the same (within 5%)
			// - and -
			// source image is same size or smaller - or within 5% bigger - just serve that up.
			if ((!ratio || Math.abs(_ratio - ratio) / ratio <= 0.05) && (_width <= width || (_width - width) / width <= 0.05)) {
				if (forceDrdk) {
					src = "//asset.dr.dk" + src;
				}
				useSource = true;
			}

			properties.width = width;
			properties.height = height;


			// if src is _not_ an absolute path on localhost _or_ the path is _not_ excluded - then scale images
			if (!useSource && (!((src.match(/^\/[^\/]/) && isLocalhost) || isExcludedpath) || forceDrdk)) {

				var widthReg = /((\?|(&(amp;)?))w(idth)?=)\d+/,
					heightReg = /((\?|(&(amp;)?))h(eight)?=)\d+/,
					isScaled = src.replace(widthReg, "").replace(heightReg, "") != src;

				// if the url already has parameters for width/height
				// it's probably already being passed through an imagescaler
				// just modify width/height
				if (isScaled) {
					src = src.replace(widthReg, "$1" + width).replace(heightReg, "$1" + height);
				}
					// url doesn't have width/height parameters - pass it through an imagescaler
				else {

					var server = src.match(/^http:\/\/([^\/]+)/),
						query = {
							file: src,
							w: width,
							h: height,
							scaleAfter: "crop" // loose this bit when imagescaler is done
						};

					if (quality) {
						query.quality = quality;
					}

					// extract contentType from url
					var contentType = src.match(/contenttype=([^&=]+)/i);

					if (contentType) {
						query.contenttype = contentType[1];
					}

					if (server) {
						query.file = query.file.slice(server[0].length);
						query.server = server[1];
					}
					else if (!isDrdk) {
						query.server = (forceDrdk) ? "www.dr.dk" : location.host;
					}

					if (query.server && query.server.match(/^(cmsred|webcms|webudv02|socialbld01)/)) { // removed due to popular demand /(^(cmsred|webcms))|(\.net\.dr\.dk$)/
						query.server = "www.dr.dk";
					}

					var imagescaled = scaler
						+ "?file=" + encodeURIComponent(query.file) + ""
						+ "&w=" + width
						+ "&h=" + height
						+ "&scaleAfter=crop"
						+ ((query.quality) ? "&quality=" + query.quality : "")
						+ ((query.contenttype) ? "&contenttype=" + query.contenttype : "")
						+ ((query.server) ? "&server=" + encodeURIComponent(query.server) : "");

					src = imagescaled;
				}

			}
			
			var image = loadImage(src, onerror, properties);
			
			placeholder.insertBefore(image, placeholder.firstChild);
		}
	}
	
	function loadImage(src, onerror, options) {
		var img = new Image();
		if (options) {
			for (key in options) {
				img.setAttribute(key, options[key]);
			}
		}
		img.onload = onload;
		img.onerror = function (e) {
			e = e || global.event;
			img.className = ((img.className) ? img.className + " " : "") + "lazy-broken";
			if (global.console) {
				console.log("error", e, src);
			}
		};
		img.src = src;
		return img;
	}

}(window, document));