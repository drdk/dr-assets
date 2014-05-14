/*
|--------------------------------------------------------------------------
| DR Geolocation Check for Danish IP Address
|--------------------------------------------------------------------------
|
| Uses jQuery.
*/

(function(win) {
  win.define("detect-geo-dk", ["DR", "jquery"], function(DR, $) {
    var init = function() {
      var bool = geoDK();
      DR.addDetection("geoDK", bool);
      return bool;
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