/*
|--------------------------------------------------------------------------
| DR Geolocation Check for Danish IP Address
|--------------------------------------------------------------------------
*/

(function(win, sessionStorage) {
  win.define("client-info-from-dk", ["DR", "jquery"], function(DR, $) {
    var fromDK = function(options, callback) { 
      var endpointUrl = "http://www.dr.dk/DR/DR.CheckIP.IsDanish/",
          sessionKey = 'client-info-from-dk',
          result;

      if (DR.proxyUrl != null) {
        endpointUrl = DR.proxyUrl + endpointUrl;
      }

      if (sessionStorage && !sessionStorage.getItem(sessionKey)) {
        result = sessionStorage.getItem(sessionKey);
        DR.addClientInfo("fromDK", result);
        if (callback != null) {
          callback(result);
          return;
        }
      } else {
        $.ajax(endpointUrl, {
          type: "GET",
          dataType: "html",
          timeout: 1000,
          error: function(jqXHR, textStatus, errorThrown) {
            console.log("Ajax geo detection request error: " + textStatus);
            if(textStatus==="timeout") {
              if (callback != null) {
                callback(result);
              }
            }
            return;
          },
          success: function(data, textStatus, jqXHR) {
            result = (data === 'true');
            DR.addClientInfo("fromDK", result);
            if (sessionStorage && !sessionStorage.getItem(sessionKey)) {
              try {
                sessionStorage.setItem(sessionKey, result);
              } catch (e) {
                console.log("Could not save data: client-info-from-dk", e);
              }
            }
            if (callback != null) {
              callback(result);
            }
            return;
          }
        });
      }
    };
    return {
      initialize: function(options, callback) { fromDK(options, callback) }
    }
  });
}(window, window.sessionStorage));