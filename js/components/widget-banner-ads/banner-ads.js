/*

Global Banner Ad Control:
===============================================================================

*/
(function (win) {
  win.define("banner-ads", ["jquery"], function ($) {

    win.AdServ = win.AdServ || {
      adspaces: []
    };

    var drBannerAds = {

      /* 
        Define each banner id's for each site.
        -----------------------------------------------------------------------
        Url can be string or array (multiple). Use "*"" to include sub paths.
        "Placement" must be either "top" or "bottom", else use elementID.
        If "elementID" is defined, it must exist in the DOM.
      */

      adIDs: [
        { 
          title: "TV Forside",
          urls: ["/tv-beta", "/tv/program/*"], 
          excludeSubpaths: ["/se/*", "/live/*"],
          ads: [
            { placement: "top", adID: 162 },
            { placement: "bottom", adID: 163 }
          ]
        },
        { 
          title: "TV Oversigt",
          urls: ["/tv-beta/oversigt/*"], 
          ads: [
            { placement: "top", adID: 80 },
            { placement: "bottom", adID: 81 }
          ]
        }
      ],

      initialize: function () {
        var insertBanners = false;
        var currentUrl = this.cleanUrl(location.pathname);
        for (var index = 0; index < this.adIDs.length; index++) {
          for (var urlIndex = 0; urlIndex < this.adIDs[index].urls.length; urlIndex++) {
            var adUrl = this.cleanUrl(this.adIDs[index].urls[urlIndex]);
            if (adUrl.slice(-1) === "*") {
              if (this.cleanUrl(currentUrl.slice(0, adUrl.length - 1)) === adUrl.slice(0, adUrl.length - 2)) {
                insertBanners = true;
                if (this.adIDs[index].hasOwnProperty("excludeSubpaths")) {
                  for (var pathIndex = 0; pathIndex < this.adIDs[index].excludeSubpaths.length; pathIndex++) {
                    var excludeSubpath = this.cleanUrl(this.adIDs[index].excludeSubpaths[pathIndex]);
                    if (excludeSubpath.slice(-1) === "*") {
                      var adUrlExludingSubpath = adUrl.slice(0, adUrl.length - 2) + excludeSubpath.slice(0, excludeSubpath.length - 2);
                      if (this.cleanUrl(currentUrl.slice(0, adUrlExludingSubpath.length)) === adUrlExludingSubpath) {
                        insertBanners = false;
                      }
                    } else if (currentUrl === (adUrl.slice(0, adUrl.length - 2) + excludeSubpath)) {
                      insertBanners = false;
                    }

                  }
                }
              }
            } else if (currentUrl === adUrl) {
              insertBanners = true;
            }
            if (insertBanners) {
              return this.insert(this.adIDs[index].ads);
            }
          }
        }
      },

      defaults: {
        placement: null,
        adID: null,
        keyword: '',
        elementID: null
      },

      cleanUrl: function (url) {
        url = url.toLowerCase();
        if ((url !== "") && (url.slice(0, 1) !== "/")) {
          url = "/" + url;
        }
        if (url.slice(-1) === "/") {
          url = url.slice(0, url.length - 1);
        }
        return url;
      },

      setElementID: function (options) {
        return 'ba_container_' + options.adID + "_" + options.placement;
      },

      insert: function (ads) {

        if (Object.prototype.toString.call(ads) === "[object Object]") {
          this.ads = [ads];
        } else if (Object.prototype.toString.call(ads) === "[object Array]") {
          this.ads = ads;
        } else {
          return;
        }

        this.$globalnavigation = $('#globalnavigation');
        this.$globalfooter = $('#globalfooter');

        //Process each ad
        for (var i = 0; i < this.ads.length; i++) {
          var ad = this.ads[i];
          //Inherit default attributes if any is undefined.
          for (var property in this.defaults) {
            if ((typeof (ad[property]) === "undefined") || (property === null)) {
              if (property === "elementID") {
                ad.elementID = this.setElementID(ad);
              } else {
                ad[property] = this.defaults[property];
              }
            }
          }

          if ($('#' + ad.elementID).length === 0) {
            var $bannerContainer = $('<div>', {
                "id": ad.elementID
              }),
              $body = $('body');
            //Inject container to the defined position
            if (ad.placement === "top") {
              var $bannerContainerWrapper = $('<div>', {
                "class": "banner-ad-top-wrapper"
              });
              $bannerContainer.addClass('banner-ad-top container-fluid hidden')
              $bannerContainerWrapper.append($bannerContainer);
              $body.prepend($bannerContainerWrapper);
            } else if (ad.placement === "bottom") {
              if (this.$globalfooter.length > 0) {
                $bannerContainer.insertBefore(this.$globalfooter);
              } else {
                $body.append($bannerContainer);
              }
              $bannerContainer.addClass('banner-ad-bottom container-fluid hidden')
            } else if (ad.placement !== null) {
              //Only support top and bottom as placements...
              continue;
            } else {
              //Neither element ID has been defined nor the placement in the document
              //Something is wrong - ignore it!
              continue;
            }
          }

          //Insert the ad in the defined target element
          win.AdServ.adspaces.push({
            "id": ad.adID,
            "keyword": ad.keyword,
            "target": ad.elementID,
            "adIndex": i,
            "onload": this.onload.bind(this)
          });
        }

      },

      onload: function (options, vars) {
        if ((typeof (options) !== "undefined") && (typeof (vars) !== "undefined")) {
          if ((typeof (options.banner) !== "undefined") && typeof (vars.adIndex) !== "undefined") {
            var ad = this.ads[vars.adIndex];
            if (typeof (ad) !== "undefined") {
              var $elementID = $('#' + ad.elementID);

              if ($elementID.length > 0) {
                if ($elementID.css('display') === "none") {
                  $elementID.css('display', 'block');
                }
                if (ad.placement === "top") {
                  $elementID.removeClass('hidden');
                } else if (ad.placement === "bottom") {
                  $elementID.removeClass('hidden');
                }

              }
            }
          }
        }
      }


    };

    return {
      initialize: function () {
        drBannerAds.initialize();
      }
    };

  });

})(window);