/*
|--------------------------------------------------------------------------
| Post load
|--------------------------------------------------------------------------
|
| This loads in the end of the global core script.
| Used to initialize scripts and methods based 
| on the DR Global Object settings.
*/

(function(win, doc) {

  win.require(['DR', 'jquery'], function(DR, $) {

    $(doc).ready(function() {

      if ((DR != null) && (DR.autoload != null)) {

        var autoload = DR.autoload;

        if (autoload.lazyLoader) {
          // Load image lazy loader
          require(['lazyloader'], function() {
            $(".image-wrap > img").lazyload();
          });
        }

        if (autoload.cookiePolicy) {
          // Load cookie policy
          require(['cookie-policy'], function(cookiePolicy) {
            cookiePolicy.initialize();
          });
        };
        
        if (autoload.footer) {
          // Load footer
          require(['navigation-footer'], function(footer) {
            footer.initialize();
          });
        };

        if (autoload.fromDK) {
          // Load client info: "from denmark"
          require(["client-info-from-dk"], function(fromDK) {
            fromDK.initialize();
          });
        };
      };

    });

  });
  
})(window, document);