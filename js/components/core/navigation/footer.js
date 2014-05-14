(function(win) {
  win.define("navigation-footer", function() {

    $.ajax(DR.TV.basePath + "/footer", {
      type: "GET",
      dataType: "html",
      error: function(jqXHR, textStatus, errorThrown) {
        return console.log("AJAX Error: " + textStatus);
      },
      success: function(data, textStatus, jqXHR) {
        $('body').append(data);
        $('#globalfooter .nav-wrapper').addClass('container-fluid');
        return $('.disclaimer-section div').addClass('container-fluid');
      }
    });

  });
}(window));

