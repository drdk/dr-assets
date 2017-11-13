var drcCookiePolicy = require("@dr/drc-cookie-policy");
var storageKey = "cookieDismissed";
var cookiePolicyLoader = {
  initialize: function (options) {
    if (location.hostname.toLowerCase().slice(-6) !== ".dr.dk") {
      return;
    }

    try {
      if (localStorage.getItem(storageKey)){
          // cookie policy already dismissed - bail.
          return;
      }
      else {
        var testKey = storageKey + "Test";
        localStorage.setItem(testKey, testKey);
        if (!localStorage.getItem(testKey)) {
          // localStorage is not working properly - bail.
          return;
        }
        else {
          // localStorage seems to be working - clean up.
          localStorage.removeItem(testKey);
        }
      }
    }
    catch (e) {
      // localStorage not supported - bail.
      return;
    }

    var template = this.getTemplateName();

    var cp = drcCookiePolicy({template: template});
    cp.addEventListener("dismiss", function() {
      try {
        localStorage.setItem(storageKey, Math.round(new Date() / 1000));
      }
      catch (e) {}
    });
  },

  getTemplateName: function() {
    var pathname = location.pathname;
    if (pathname.slice(-1) !== "/") {
      pathname += "/";
    }
    if (pathname.toLowerCase().indexOf('/ultra/') === 0) {
      return "ultra";
    }
    if (pathname.toLowerCase().indexOf('/ramasjang/') === 0) {
      return "ramasjang";
    }
    return "default";
  }
};

return window.define('cookie-policy', function() {
  return {
    initialize: function() {
      cookiePolicyLoader.initialize();
    }
  }
})();
