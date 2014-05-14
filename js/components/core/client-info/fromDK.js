/*
|--------------------------------------------------------------------------
| DR Geolocation Check for Danish IP Address
|--------------------------------------------------------------------------
*/

(function(win) {
  win.define("client-info-from-dk", ["DR", "jquery"], function(DR, $) {
    var fromDK = function() { 
      $.ajax("http://geo.dr.dk/DR/DR.CheckIP.IsDanish/", {
        type: "GET",
        dataType: "html",
        error: function(jqXHR, textStatus, errorThrown) {
          console.log("Ajax geo detection request error: " + textStatus);
          return false;
        },
        success: function(data, textStatus, jqXHR) {
          return DR.addClientInfo("fromDK", (data === 'true'));
        }
      });
    };
    return {
      initialize: fromDK();
    }
  });
}(window));