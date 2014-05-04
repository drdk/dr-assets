/*
|--------------------------------------------------------------------------
| First-load js, before any other script has been loaded.
|--------------------------------------------------------------------------
*/

(function() {

    /*
    |--------------------------------------------------------------------------
    | Avoid debugging errors
    |--------------------------------------------------------------------------
    |
    | Avoid `console` errors in browsers that lack a console.
    | Originally from HTML5Boilerplate (http://html5boilerplate.com/)
    */

    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Log JS errors
    |--------------------------------------------------------------------------
    */

    window.onerror = function(errorMessage, url, line) {
        try {
            if (typeof(url) === "undefined") {
                url = "";
            }
            if (typeof(line) === "undefined") {
                line = "";
            }

            // Avoid error message being too long...
            if (errorMessage.length > 300) {
                errorMessage = errorMessage.slice(0,300) + "...";
            }

            errorMessage = errorMessage.replace(/&/g, "%26").replace(/ /g, "+");
            url = url;
            line = line;
            var parentUrl = encodeURIComponent(document.location.href);

            // Set error details
            var parameters = "error_message=" + errorMessage + 
                             "&url=" + url + 
                             "&line=" + line + 
                             "&parent_url=" + parentUrl;
            
            // Set path to log target
            var logUrl = "http://www.dr.dk/assets/img/blank.gif";

            // Set error details as image parameters
            new Image().src = logUrl + '?' + parameters;
        } catch (e) {}
    };

}());