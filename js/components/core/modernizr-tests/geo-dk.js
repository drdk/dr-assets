/*
|--------------------------------------------------------------------------
| DR Geolocation Check for Danish IP Address
|--------------------------------------------------------------------------
|
| Uses jQuery.
*/

(function(win) {
  win.define("modernizr-geo-dk", ["DR", "jquery"], function(DR, $) {
    var bool = geoDK();
    DR.addTest("geoDK", bool);

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