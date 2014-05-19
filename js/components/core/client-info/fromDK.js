/*
|--------------------------------------------------------------------------
| DR Geolocation Check for Danish IP Address
|--------------------------------------------------------------------------
*/

(function(win) {
  win.define("client-info-from-dk", ["DR", "jquery"], function(DR, $) {
    var fromDK = function(options, callback) { 
      var endpointUrl = "http://geo.dr.dk/DR/DR.CheckIP.IsDanish/"
      if (DR.proxyUrl != null) {
        endpointUrl = DR.proxyUrl + endpointUrl;
      }
      $.ajax(endpointUrl, {
        type: "GET",
        dataType: "html",
        error: function(jqXHR, textStatus, errorThrown) {
          console.log("Ajax geo detection request error: " + textStatus);
          return false;
        },
        success: function(data, textStatus, jqXHR) {
          var result = (data === 'true');
          DR.addClientInfo("fromDK", result);
          if (callback != null) {
            callback(result)
          }
          return;
        }
      });
    };
    return {
      initialize: function(options, callback) { fromDK(options, callback) }
    }
  });
}(window));