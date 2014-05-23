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

  win.require(["DR", "jquery"], function(DR, $) {

    $(doc).ready(function() {

      if ((DR != null) && (DR.autoload != null)) {

        var module,
            autoload = DR.autoload;

        for (module in autoload) {
          if (autoload[module] === false) {
            continue;
          }

          switch (module) {
            case "lazyLoader":
              // Load image lazy loader
              require(['lazyloader'], function() {
                $(".image-wrap > img").lazyload();
              });
              break;

            case "cookiePolicy":
              // Load cookie policy
              require(['cookie-policy'], function(cookiePolicy) {
                cookiePolicy.initialize();
              });
              break;

            case "footer":
              // Load footer
              var footerArgs = [];
              if (autoload.footer !== true) {
                footerArgs = autoload.footer;
              }
              require(['navigation-footer'], function(footer) {
                footer.initialize.apply(null, footerArgs);
              });
              break;

            default:
              break;
          };
          
        };

      };

      if (win.location.hostname === "www.dr.dk") {
        var webstatURI = "http://www.dr.dk/drWebStat/drWebStat.js";
        $.ajax({
          url: webstatURI,
          cache: true,
          dataType: "script",
          error: function(xhr, ajaxOptions, thrownError) {
            console.log("Error loading drwebstat", xhr.status, thrownError);
          }
        });
      }

    });

  });
  
})(window, document);