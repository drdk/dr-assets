/*
|--------------------------------------------------------------------------
| DR Require JS config. 
|--------------------------------------------------------------------------
|
| Builds on top of the DR Global Object to define the configuration.
*/

(function(win) { 
  require(['DR', 'require'], function(DR, require) {
    var config = {
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
    };

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
      };
      return;
    };

    function initConfig(config) {
      if ((config != null) && (require != null)) {
        require.config(config);
        DR.require.config = config;
        if ((require.s != null) && (require.s.contexts != null) && (require.s.contexts['_'] != null) && (require.s.contexts['_'].registry != null)) {
          DR.require.registry = require.s.contexts['_'].registry;
        };
      };   
      return; 
    };

  });

}(window));