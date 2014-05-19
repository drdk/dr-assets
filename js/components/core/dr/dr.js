/*
|--------------------------------------------------------------------------
| DR Global Object
|--------------------------------------------------------------------------
|
| Use for states and settings. 
*/

(function(win) {
  win.define("DR", function() {
    var DR = win.DR || {};

    var defaults = {
      version: "6.0",
      autoload: {
        lazyLoader: true,
        cookiePolicy: true,
        topNavigation: true,
        footer: true
      },
      clientInfo: {},
      basePath: "",
      proxyUrl: null,
      addClientInfo: function(name, bool) {
        if ((name != null) && (Object.prototype.toString.call(bool) === "[object Boolean]")) {
          DR.clientInfo[name] = bool;
        }
      }
    }

    // Inherit defaults
    for (var key in defaults) {
      if (DR[key] == null) {
        DR[key] = defaults[key];
      } else if (Object.prototype.toString.call(DR[key]) === "[object Object]") {
        for (var subkey in defaults[key]) {
          if (DR[key][subkey] == null) {
            DR[key][subkey] = defaults[key][subkey];
          }
        }
      }
    }

    win.DR = DR;
    return DR;
  });
}(window));