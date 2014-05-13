/*
|--------------------------------------------------------------------------
| Post load
|--------------------------------------------------------------------------
|
| This loads in the end of the global core script.
| Used to initialize scripts and methods based 
| on the DR Global Object settings.
*/

(function(win, doc, $) {

	var DR = win.DR || {};

	$(document).ready(function() {

		// Start image lazy loader
		$(".image-wrap > img").lazyload();

		// Init cookie policy
		//cookiePolicy.initialize();
	});
	
})(window, document, window.jQuery);