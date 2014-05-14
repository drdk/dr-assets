(function(win) {
  win.define("navigation-footer", ["jquery"], function($) {
    var footer = function() { 
      var defaultBasePathSuffix = "dr.dk",
          basePath = "";
      if (win.location.hostname.indexOf(defaultBasePathSuffix, win.location.hostname.length - defaultBasePathSuffix.length) === -1) {
        basePath = "//" + defaultBasePathSuffix;
      }
      $.ajax(basePath + "/drdktopbar/Navigation/RawHtmlFooter", {
        type: "GET",
        dataType: "html",
        error: function(jqXHR, textStatus, errorThrown) {
          return console.log("ajax request error for footer: " + textStatus);
        },
        success: function(data, textStatus, jqXHR) {
          return $('body').append(data);
          /*$('#globalfooter .nav-wrapper').addClass('container-fluid');
          $('.disclaimer-section div').addClass('container-fluid');*/
        }
      });
    };
    return {
      initialize: function() { footer() }
    }
  });
}(window));