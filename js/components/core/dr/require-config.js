/*
|--------------------------------------------------------------------------
| DR Require JS config. 
|--------------------------------------------------------------------------
|
| Builds on top of the DR Global Object to define the configuration.
*/

(function(win) { 

  var config = {
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
      "jquery": "third/jquery/jquery-1.11.0.js",
      "fastclick": "third/fastclick/fastclick.js"
    },
    shim: {
      'lazyload': { deps: ['jquery'], exports: '$.fn.lazyload' }
    }
  };

  if (win.DR.require == null) {
    win.DR.require = {
      register: function(options) {
        register(options);
      }
    };
  };

  for (key in config) {
    if (win.DR.require.config[key] == null) {
      win.DR.load[key] = load[key];
    }
  }

  initConfig(config);

  function register(options) {
    
    var configChange = false;

    if (options == null) {
      return;
    };

    if ((options.type === "paths") && (options.name != null) && (options.path != null)) {
      config.paths[name] = options.path;
      configChange = true;
    } else if ((options.type === "shims") && (options.name != null) && (options.exports != null)) {
      config.shim[name] = options.path;
      if (options.deps != null) {
        config.shim[name].deps = options.deps;
      }
      configChange = true;
    };

    if (configChange) {
      require.config(config);
    }

    return;
  };

  function initConfig(config) {
    if ((win.config != null) && (win.require != null)) {
      require.config(config);
    };   
    return; 
  };

}(window));