////////////////////////////////////////////////////////////////////////////////
/// Document ready
////////////////////////////////////////////////////////////////////////////////
(function(win, doc, $) {

	var DR = win.DR || {};

	$(document).ready(function() {

		// Start image lazy loader
		$(".image-wrap > img").lazyload();

		// Init cookie policy
		//cookiePolicy.initialize();
	});
	
})(window, document, window.jQuery);