if (postPony) {
	postPony.config({
		scrollableClassName: "dr-lazyloader-scroll",
		handlers: [{
			type: "dr-image",
			selector: ".image-wrap",
			replace: lazyloader
		}]
	});

	postPony.init();

	// re-update positions onload due to webfonts (default fonts have different metrics)

	window.addEventListener("load", function () {
		setTimeout(function () {
			postPony.update();
		}, 100);
	});
}