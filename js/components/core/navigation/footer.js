(function(win) {
  win.define("navigation-footer", ["jquery"], function($) {
    var footer = function(options, callback) { 
      var endpointUrl = "http://www.dr.dk/drdktopbar/Navigation/RawHtmlFooter"
      if (options != null) {
        if (options.proxyUrl != null) {
          endpointUrl = options.proxyUrl + endpointUrl;
        }
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