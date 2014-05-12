require.config({
	baseUrl: ((location.hostname === "beta.dr.dk" || location.hostname === "localhost") ? "//www.dr.dk" : "") + "/assets/js/",
	paths: {
		// first party        
		//"dr-media-player-factory": "modules/dr-widget-media",
		//"dr-media-gemius-implementation": "modules/dr-widget-media",
		//"dr-media-gemius-implementation-test": "modules/dr-widget-media",
		//"dr-media-conviva-implementation": "modules/dr-widget-media",
		//"dr-media-sola-implementation": "modules/dr-widget-media",
		//"dr-media-springstreams-implementation": "modules/dr-widget-media",
		//"dr-media-hash-implementation": "modules/dr-widget-media",
		//"dr-widget-video-player-factory": "modules/dr-widget-media",
		//"dr-widget-video-player": "modules/dr-widget-media",
		//"dr-widget-video-playlist": "modules/dr-widget-media",
		//"dr-widget-audio-player": "modules/dr-widget-media",
		//"dr-widget-audio-playlist": "modules/dr-widget-media",
		//"dr-widget-media-playlist": "modules/dr-widget-media",
		//"dr-media-audio-player": "modules/dr-widget-media",
		//"dr-media-html5-audio-player": "modules/dr-widget-media/Html5AudioPlayer",
		//"dr-media-flash-audio-player": "modules/dr-widget-media/FlashAudioPlayer",

		// third party
		"jquery": "third/jquery/jquery-1.11.0.js"
	},
	shims: {
		'lazyloader':      { deps: ['jquery'], exports: '$.fn.lazyload' }
	}
});
