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
          if (autoload.footer === true) {
            args = [];
          } else {
            args = autoload.footer;
          }
          require(['navigation-footer'], function(footer) {
            footer.initialize.apply(null, args);
          });
        };

        if (autoload.fromDK) {
          // Load client info from dk module
          if (autoload.fromDK === true) {
            args = [];
          } else {
            args = autoload.fromDK;
          }
          require(["client-info-from-dk"], function(fromDK) {
            fromDK.initialize.apply(null, args);
          });
        };
      };

    });

  });
  
})(window, document);