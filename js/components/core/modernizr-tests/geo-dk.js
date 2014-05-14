/*
|--------------------------------------------------------------------------
| DR Geolocation Check for Danish IP Address
|--------------------------------------------------------------------------
|
| Uses jQuery.
*/

(function(win) {
  win.define("modernizr-geo-dk", function() {

    if (win.Modernizr != null) {
      var Modernizr = win.Modernizr;
      Modernizr.addTest('geodk', function () {
        return geoDK();
      });
    };

    var geoDK = function() {
      $.ajax("http://geo.dr.dk/DR/DR.CheckIP.IsDanish/", {
        type: "GET",
        dataType: "html",
        error: function(jqXHR, textStatus, errorThrown) {
          console.log("AJAX Error: " + textStatus);
          return false;
        },
        success: function(data, textStatus, jqXHR) {
          if (data === 'true') {
            return true;
          };
          return false;
        }
      });
    };

  });
}(window));