(function (win, doc) {
  win.define("cookie-policy", function() {
    var cookiePolicyLoader = require('@dr/drc-global/cookie-policy');
    cookiePolicyLoader.initialize();
  });
})(window, document);
