/*
|--------------------------------------------------------------------------
| DR Geolocation Check for Danish IP Address
|--------------------------------------------------------------------------
|
| Uses jQuery.
*/

(function(win) {
  win.define("detect-geo-dk", ["DR", "jquery"], function(DR, $) {
    var geoDK = {
      initialize: function() {
        this.makeRequest();
      },
      makeRequest: function() { 
        $.ajax("http://geo.dr.dk/DR/DR.CheckIP.IsDanish/", {
          type: "GET",
          dataType: "html",
          error: function(jqXHR, textStatus, errorThrown) {
            console.log("AJAX Error: " + textStatus);
            return false;
          },
          success: function(data, textStatus, jqXHR) {
            return DR.addDetection("geoDK", (data === 'true'));
          }
        });
      }
    };

    return geoDK;
  });
}(window));