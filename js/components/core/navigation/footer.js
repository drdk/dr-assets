(function(win) {
  win.define("navigation-footer", ["DR", "jquery"], function(DR, $) {
    var footer = function(options, callback) { 
      var endpointUrl = DR.basePath + "/drdktopbar/Navigation/RawHtmlFooter"
      if (DR.proxyUrl != null) {
        endpointUrl = DR.proxyUrl + endpointUrl;
      }
      $.ajax(endpointUrl, {
        type: "GET",
        dataType: "html",
        error: function(jqXHR, textStatus, errorThrown) {
          return console.log("ajax request error for footer: " + textStatus);
        },
        success: function(data, textStatus, jqXHR) {
          $('body').append(data);
          if (callback != null) {
            callback(data)
          }
          return;
        }
      });
    };
    return {
      initialize: function(options, callback) { footer(options, callback) }
    }
  });
}(window));