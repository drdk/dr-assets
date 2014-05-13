/*
|--------------------------------------------------------------------------
| DR Global Object
|--------------------------------------------------------------------------
|
| Use for states and settings. 
*/

(function(win) {

  var DR = win.DR || {};

  // Defaults
  var load = {
    cookiePolicy: true,
    topNavigation: true,
    footer: true
  };

  // Inherit defaults
  if (win.DR.load != null) {
    for (key in load) {
      if (win.DR.load[key] == null) {
        win.DR.load[key] = load[key];
      }
    }
  } else {
    win.DR.load = load;
  }

  win.DR = DR

}(window));