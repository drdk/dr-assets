/*
|--------------------------------------------------------------------------
| Post load
|--------------------------------------------------------------------------
|
| This loads in the end of the global core script.
| Used to initialize scripts and methods based 
| on the DR Global Object settings.
*/

(function(win, doc, $) {

  $(document).ready(function() {

    if ((win.DR != null) && (win.DR.autoload != null)) {

      var autoload = win.DR.autoload;

      if (autoload.lazyLoader) {
        // Load image lazy loader
        require(['lazyloader'], function() {
          $(".image-wrap > img").lazyload();
        });
      }

      //if (autoload.cookiePolicy) {
      //  // Load cookie policy
      //  require(['cookie-policy'], function() {
      //    cookiePolicy.initialize();
      //  });
      //};
      
      //if (autoload.footer) {
      //  // Load footer
      //  require(['footer'], function() {
      //    footer.initialize();
      //  });
      //};

      //if (autoload.geoCheck) {
      //  // Load footer
      //  require(['footer'], function() {
      //    footer.initialize();
      //  });
      //};
    };

  });
  
})(window, document, window.jQuery);