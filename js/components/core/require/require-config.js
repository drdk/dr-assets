/*
|--------------------------------------------------------------------------
| DR Require JS config. 
|--------------------------------------------------------------------------
|
| Builds on top of the DR Global Object to define the configuration.
*/

(function(win) { 
  win.require(['DR'], function(DR) {
    var defaultBasePathSuffix = ".dr.dk"
    var config = {
      baseUrl: ((win.location.hostname.indexOf(defaultBasePathSuffix, win.location.hostname.length - defaultBasePathSuffix.length) === -1) ? "//www.dr.dk" : "") + "/assets/js/",
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
        "fastclick": "005/third/fastclick"
      },
      shim: {
      }
    };

    if (DR.require == null) {
      DR.require = {};
    } else if (DR.require.register != null) {
      register(DR.require.register);
    } else {
      initConfig(config);
    }

    DR.require.register = function(options) {
      if (options == null) {
        return false;
      };
      register(options);
      return;
    }

    function register(options) {
      if (Object.prototype.toString.call( options ) === '[object Object]') {
        options = [options];
      }
      if (Object.prototype.toString.call( options ) !== '[object Array]') {
        return false;
      };
      var configChange = false;
      for (var i = 0; i < options.length; i++) {
        if ((options[i].type === "paths") && (options[i].name != null) && (options[i].path != null)) {
          if (options[i].path.slice(-3) === ".js") {
            options[i].path = options[i].path.slice(0, -3);
          }
          config.paths[options[i].name] = options[i].path;
          configChange = true;
        };
      };
      if (configChange) {
        initConfig(config);
      }
      return;
    };

    function initConfig(config) {
      if ((config != null) && (win.require != null)) {
        win.require.config(config);
        DR.require.config = config;
        if ((win.require.s != null) && (win.require.s.contexts != null) && (win.require.s.contexts['_'] != null) && (win.require.s.contexts['_'].registry != null)) {
          DR.require.registry = win.require.s.contexts['_'].registry;
        };
      };   
      return; 
    };

  });

}(window));