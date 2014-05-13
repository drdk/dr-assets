/*
|--------------------------------------------------------------------------
| DR Image Lazy Loader
|--------------------------------------------------------------------------
|
| Uses jQuery.
*/

(function(win) {
  win.define("lazyloader", function() {

    $.fn.lazyload = function(options, callback) {
      if (options == null) {

        options = {};
      }

      var $w = $(win),

          loaded,
          
          images = this,

          validRatios = {
            "20/9": 0.45,
            "16/9": 0.5625,
            "4/3":  0.75,
            "1/1":  1,
            "3/4":  1.25
          },

          defaults = {
            pixelRatio: win.devicePixelRatio || 1,
            scaleAfter: "crop",
            ratio: "16/9",
            threshold: 100,
            imageBasePath: "//asset.dr.dk/imagescaler/",
            srcAttrib: "data-src",
            ratioAttrib: "data-ratio",
            scaleAfterAttrib: "data-scale-after"
          };

      // Set unset attributes to defaults
      var settings = $.extend(options, defaults);

      function getImageUri(src, width, height, scaleAfter) {
        width = Math.round(width * settings.pixelRatio);
        height = Math.round(height * settings.pixelRatio);

        src = settings.imageBasePath
               + "?server=" + "www.dr.dk"
               + "&amp;file=" + src
               + "&amp;w=" + width
               + "&amp;h=" + height
               + "&amp;scaleAfter=" + scaleAfter

        return src;
      };

      this.one("lazyload", function() {
        var source = this.getAttribute(settings.srcAttrib),
            ratio, $this, width, elementRatio, height, elementScaleAfter, scaleAfter, loadSuccess;

        if (!source) {
          return;
        }

        $this = $(this);
        width = this.clientWidth ? this.clientWidth : $this.parents("div").width();

        elementRatio = $this.attr(settings.ratioAttrib);
        ratio = (elementRatio && (validRatios[elementRatio] != null)) ? validRatios[elementRatio] : validRatios[settings.ratio];

        height = Math.round(width * ratio);

        elementScaleAfter = $this.attr(settings.scaleAfterAttrib);

        scaleAfter = elementScaleAfter ? elementScaleAfter : settings.scaleAfter;

        $this.attr({ width: width, height: height });

        imageUri = getImageUri(source, width, height, scaleAfter);

        function loadSuccess() {
          $this.addClass('image-load-success')
        };

        if ($this.prop('complete')) {
          loadSuccess();
        } else {
          $this.load(function() {
            loadSuccess();
          });
        };

        this.onerror = function(e) {
          $this.addClass('image-load-error')
          console.log("image load error", e, imageUri);
        };

        $this.attr("src", imageUri);
        
        if (typeof callback === "function") { 
          callback.call(this);
        }

      });

      function lazyload() {
        var visibleImages = images.filter(function() {
          var $e = $(this);
          
          var wt = $w.scrollTop(),
              wb = wt + $w.height(),
              et = $e.offset().top,
              eb = et + $e.height();

          return eb >= wt - settings.threshold && et <= wb + settings.threshold;
        });

        loaded = visibleImages.trigger("lazyload");
        images = images.not(loaded);
      }

      $w.scroll(lazyload);
      $w.resize(lazyload);

      lazyload();

      return this;

    };

  });
}(window));