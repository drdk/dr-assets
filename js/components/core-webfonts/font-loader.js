(function (key, url, doc, fontSupport, storage) {

	function store(css) {
		if (css.indexOf("@font-face") == 0) {
			storage.setItem(key, css);
			var head = doc.head || doc.getElementsByTagName("head")[0],
				style = doc.createElement("style");
			style.textContent = css;
			head.appendChild(style);
		}
	}

	function request(url, callback) {
		var xhr = new XMLHttpRequest();

		xhr.open("GET", url, true);
		xhr.onload = function () {
			callback(xhr.responseText);
		};
		xhr.send(null);
	}

	if (storage && !storage.getItem(key)) {

		fontSupport(function (supported) {
			if (supported) {
				request(url.replace("{{format}}", supported), store);
			}
			else {
				storage.setItem(key, "no formats supported");
			}
		}, ["woff", "ttf", "svg"]);

	}

}("dr-webfonts", "//www.dr.dk/assets/css/006/fonts-{{format}}.css", document, fontSupport, window.localStorage));