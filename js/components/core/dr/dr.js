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

    // Default auto load
    var autoload = {
      lazyLoader: true,
      cookiePolicy: true,
      topNavigation: true,
      footer: true
    };

    // Default client info
    var clientInfo = {
      fromDK: false
    };

    // Inherit defaults
    if (DR.autoload != null) {
      for (var key in autoload) {
        if (DR.autoload[key] == null) {
          DR.autoload[key] = autoload[key];
        }
      }
    } else {
      DR.autoload = autoload;
    }

    // Inherit defaults
    if (DR.clientInfo != null) {
      for (var key in clientInfo) {
        if (DR.clientInfo[key] == null) {
          DR.clientInfo[key] = clientInfo[key];
        }
      }
    } else {
      DR.clientInfo = clientInfo;
    }

    DR.version = "6.0";

    DR.addClientInfo = function(name, bool) {
      if ((name != null) && (Object.prototype.toString.call(bool) === "[object Boolean]")) {
        DR.clientInfo[name] = bool;
      }
    };

    win.DR = DR;

    return DR;
  });
}(window));