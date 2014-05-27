/*
|--------------------------------------------------------------------------
| DR Image Lazy Loader
|--------------------------------------------------------------------------
*/

(function(win) {
  win.define("lazyloader", ["jquery"], function($) {

    var lazyloader = function(options, callback) {
      if (options == null) {
        options = {};
      }

      var $w = $(win),

          loaded,
          
          images = this,

          validRatios = {
            "20-9": 0.45,
            "16-9": 0.5625,
            "4-3":  0.75,
            "1-1":  1,
            "3-4":  1.25
          },

          defaults = {
            pixelRatio: win.devicePixelRatio || 1,
            scaleAfter: "crop",
            ratio: "16-9",
            threshold: 0,
            quality: 75,
            imageBasePath: "//asset.dr.dk/imagescaler/",
            srcAttrib: "data-src",
            ratioClassPrefix: "ratio-",
            scaleAfterAttrib: "data-scale-after"
          };

      // Set unset attributes to defaults
      var settings = $.extend(options, defaults);

      function getImageUri(src, width, height, scaleAfter) {
        if (src == null) { return false; }

        width = Math.round(width * settings.pixelRatio);
        height = Math.round(height * settings.pixelRatio);

        var srcParams = src.split("?");
        if (srcParams.length > 1) {
          src = srcParams[0];
        }

        // Temporary, check if image is from the mu-online api bar resource
        if ((src.toLowerCase().match(/\/api\/.*\/bar\//ig))) {
          src = src + "?width=" + width + "&height=" + height
        } else {
          src = encodeURIComponent(src);
          src = settings.imageBasePath
                 + "?server=" + "www.dr.dk"
                 + "&file=" + src
                 + "&w=" + width
                 + "&h=" + height
                 + "&scaleAfter=" + scaleAfter
                 + "&quality=" + settings.quality;
        }

        return src;
      };

      this.one("lazyload", function() {
        var alreadyLoaded = this.getAttribute('src'),
            source = this.getAttribute(settings.srcAttrib);
        if ((!source)||(alreadyLoaded)) { return false; }

        var ratio, $this, width, wrapperClass, wrapperClassArray, elementRatio, height, elementScaleAfter, scaleAfter, loadSuccess, value, _i, _len, _ref;

        $this = $(this);
        
        $this.removeAttr("data-src");

        width = this.clientWidth ? this.clientWidth : $this.parents("div").width();

        wrapperClass = $this.parent('.image-wrap').attr('class');

        if (wrapperClass) {
          wrapperClassArray = wrapperClass.split(" ");
          for (_i = 0, _len = wrapperClassArray.length; _i < _len; _i++) {
            value = wrapperClassArray[_i];
            if (value.indexOf(settings.ratioClassPrefix) === 0) {
              elementRatio = value.slice(settings.ratioClassPrefix.length);
              break;
            }
          }
        }

        ratio = (elementRatio && (validRatios[elementRatio] != null)) ? validRatios[elementRatio] : validRatios[settings.ratio];

        height = Math.round(width * ratio);

        elementScaleAfter = $this.attr(settings.scaleAfterAttrib);

        scaleAfter = elementScaleAfter ? elementScaleAfter : settings.scaleAfter;

        $this.attr({ width: width, height: height });

        imageUri = getImageUri(source, width, height, scaleAfter);

        function loadSuccess() {
          $this.addClass('image-load-success')
          $this.trigger("image-load-success")
        };

        if ($this.prop('complete')) {
          loadSuccess();
        } else {
          $this.load(function() {
            if (!$this.hasClass('image-load-error')) {
              loadSuccess();
            }
          });
        };

        this.onerror = function(e) {
          $this.addClass('image-load-error')
          $this.trigger("image-load-error")
          console.log("image load error", e, imageUri);
        };

        $this.attr("src", imageUri);
        
        if (typeof callback === "function") { 
          callback.call(this);
        }

      });

      function lazyload() {
        var visibleImages = images.filter(function() {
          var $this = $(this), $e;

          if ($this.parent('.image-wrap').length > 0) {
            $e = $this.parent('.image-wrap');
          } else {
            $e = $this;
          }

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

    return $.fn.lazyload = lazyloader;

  });
}(window));