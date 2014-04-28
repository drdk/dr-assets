require.config({
	baseUrl: ((location.hostname === "beta.dr.dk" || location.hostname === "localhost") ? "//www.dr.dk" : "") + "/assets/js/",
	paths: {
		// first party        
        "dr-media-player-factory": "005/dr/widgets/dr-widget-media",
        "dr-media-gemius-implementation": "005/dr/widgets/dr-widget-media",
        "dr-media-gemius-implementation-test": "005/dr/widgets/dr-widget-media",
        "dr-media-conviva-implementation": "005/dr/widgets/dr-widget-media",
        "dr-media-sola-implementation": "005/dr/widgets/dr-widget-media",
        "dr-media-springstreams-implementation": "005/dr/widgets/dr-widget-media",
        "dr-media-hash-implementation": "005/dr/widgets/dr-widget-media",
        "dr-widget-video-player-factory": "005/dr/widgets/dr-widget-media",
		"dr-widget-video-player": "005/dr/widgets/dr-widget-media",
		"dr-widget-video-playlist": "005/dr/widgets/dr-widget-media",
		"dr-widget-audio-player": "005/dr/widgets/dr-widget-media",
		"dr-widget-audio-playlist": "005/dr/widgets/dr-widget-media",
		"dr-widget-media-playlist": "005/dr/widgets/dr-widget-media",
		"dr-media-audio-player": "005/dr/widgets/dr-widget-media",
		"dr-media-html5-audio-player": "005/dr/widgets/dr-widget-media/Html5AudioPlayer",
		"dr-media-flash-audio-player": "005/dr/widgets/dr-widget-media/FlashAudioPlayer",
		"dr-widget-chaos-upload": "005/dr/widgets/dr-widget-chaos/dr-widget-chaos-upload",

		// third party
		"more": "005/more"
	},
	shim: {
		"more": {
			exports: "MooTools.More"
		},
		"swfobject": {
			exports: "SWFObject"
		},
		"swipejs": {
            exports: "Swipe"
        }
	}
});
