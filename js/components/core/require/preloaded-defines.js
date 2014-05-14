(function(win) { 
  win.require(["require"], function(require) {
    // Preloaded modules
    win.define('jquery', [], function () { return win.jQuery; });
  });
});