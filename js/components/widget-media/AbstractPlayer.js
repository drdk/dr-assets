/*jshint mootools:true,browser:true,devel:false*/
/*global escape */

define("dr-media-abstract-player", ["dr-media-hash-implementation"], function (HashTimeCodeImplementation) {
    "use strict";

    var AbstractPlayer = new Class({
        Implements: [Events, Options],
        options: {
            appData: {
                gemius: {
                    drIdentifier: '019_drdk-',
                    identifier: 'p9AwR.N.S86s_NjaJKdww7b.fdp8ky90ZnrKpgLHOUn.s7',
                    hitcollector: window.location.protocol + '//sdk.hit.gemius.pl',
                    channelName: 'drdk'
                },
                linkType: 'Streaming',
                fileType: 'mp3'
            },
            videoData: {
                materialIdentifier: 'unknown'
            },
            enableHashTimeCode: false
        },
        /** @private raw result from getresource handler */
        resourceResult: null,
        /** @private raw programcard */
        programcardResult: null,
        /** bool is true when player has recieved the duration of the content */
        hasDuration: false,
        /**
        * Instance of HashTimeCodeImplementation. Is set upon initialization if options.enableHashTimeCode is true.
        * @type {HashTimeCodeImplementation}
        */
        hashTimeCodeInstance: null,
        /** @constructor */
        initialize: function (options) {

          
            this.setOptions(options);
            if (this.options.element) {
                this.options.element.store("instance", this);
                /**
                * @name instance
                * @event
                * Dispatched when the class has been created. After this, the player object can be fetched by retrieving 'instance' from the containing element
                */
                this.options.element.fireEvent('instance', this);
            }

            this.mediaPlayerId = ++AbstractPlayer.$mediaPlayerId;

            this.buildPreview();

            if (this.options.enableHashTimeCode) {
                this.hashTimeCodeInstance = new HashTimeCodeImplementation(this);
            }
        },
        updateOptions: function (options) {
            this.options.appData.autoPlay = true;
            this.setOptions(options);
            // reset resourceResult
            this.forgetModel();
        },
        /**
        * Loads the resource if it is not allready loaded and calls a closure 
        * when the resource is ready
        * @param    resourceReady    Closure to call when resource is ready
        */
        ensureResource: function (resourceReady) {
            if (this.hasResource()) {
                resourceReady();
            } else {
                var url = this.options.videoData.resource;
                this.fireEvent('resourceLoading');
                if (this.options.platform) {
                    if (url.indexOf('?') !== -1) {
                        url = url + '&type=' + this.options.platform;
                    } else {
                        url = url + '?type=' + this.options.platform;
                    }
                }
                //debug replace:
                if (document.location.host != 'www.dr.dk') {
                    url = url.replace('www.dr.dk', document.location.host);
                }
                new Request.JSON({
                    'onSuccess': function (result) {
                        if (result.Data) {
                            this.programcardResult = result.Data[0];

                        } else {
                            this.resourceResult = result;
                        }
                        this.onDurationChange();
                        resourceReady();
                        this.fireEvent('resourceReady');
                    } .bind(this),
                    'onFailure': function (x) {
                        this.displayError('defaultMsg', 'State: ' + x.readyState + ' ' + x.statusText.toString() + ' ' + url);
                    } .bind(this),
                    'onError': function (msg, e) {
                        this.displayError('defaultMsg', 'Error: ' + msg + ' ' + url);
                    } .bind(this),
                    'url': url
                }).get();
            }
        },

        /**
        * Loads the live stream resources if they are not allready loaded and calls a closure
        * @param  {Function} liveStreamsReady     Closure to call when the resources are loaded
        */
        ensureLiveStreams: function (liveStreamsReady) {
            if (this.options.videoData.channels) {
                liveStreamsReady();
            } else {
                var url = this.options.appData.urls.liveStreams, channel, server, quality, stream;
                this.fireEvent('resourceLoading');
                new Request.JSON({
                    'onSuccess': function (result) {
                        this.options.videoData.channels = [];
                        result.Data.each(function (c) {
                            if (c.StreamingServers) {
                                var logo = "";
                                if (c.SourceUrl && this.options.appData.urls.channelLogoUrl) {
                                    var m = c.SourceUrl.match(/\/(\w{3})\/?$/i);
                                    if (m) {
                                        logo = m[1].toLowerCase();
                                        logo = logo === 'tvu' ? 'drn' : logo;
                                        logo = this.options.appData.urls.channelLogoUrl.replace("{id}", logo);
                                    }
                                }
                                channel = {
                                    'name': c.Title,
                                    'slug': c.Slug,
                                    'url': c.Url,
                                    'logo': logo,
                                    'servers': []
                                };
                                c.StreamingServers.each(function (s) {
                                    server = {
                                        'server': s.Server,
                                        'qualities': [],
                                        'linkType': s.LinkType,
                                        'dynamicUserQualityChange': s.DynamicUserQualityChange || false
                                    };
                                    s.Qualities.each(function (q) {
                                        quality = {
                                            'kbps': q.Kbps,
                                            'streams': []
                                        };
                                        q.Streams.each(function (st) {
                                            quality.streams.push(st.Stream);
                                        });
                                        server.qualities.push(quality);
                                    });
                                    channel.servers.push(server);
                                });
                                this.options.videoData.channels.push(channel);
                            }
                        } .bind(this));
                        liveStreamsReady();
                        this.fireEvent('resourceReady');
                    } .bind(this),
                    'url': url
                }).get();
            }
        },
        /**
         * Returns the stream with kbps closest to the kbps param
         * @param  {Array}  streams  [Array of streams]
         * @param  {Number} kbps     [Target kbps]
         * @param  {String} linkType [Optional! Defaults to options.appData.linkType]
         * @return {Sring}           [stream object]
         */
        findClosestQuality: function (streams, kbps, linkType) {
            var i, stream, selecedStream, type, HLSStream, HDSStream;
            type = linkType || this.options.appData.linkType;


            for (i = 0; i < streams.length; i = i + 1) {
                stream = streams[i];

                if ( stream.linkType && stream.linkType.toLowerCase() === "hls") {
                    HLSStream = stream;  
                }

                if ( stream.linkType && stream.linkType.toLowerCase() === "hds") {
                    HDSStream = stream;  
                }
            }

            selecedStream = this.selectStream(streams, kbps, type);

            if ( (type.toLowerCase() === "ios" || type.toLowerCase() === "android") && HLSStream ) {
                selecedStream = HLSStream;  
            } else if ( (type.toLowerCase() === "streaming" ) && HDSStream ) {
                selecedStream = HDSStream;
            }

            if (!selecedStream) { 
                selecedStream = this.selectStream(streams, kbps, 'download');
            }

            if (!selecedStream) {
                console.log("Unable to find stream " + type + " " + this.options.appData.fileType);
                throw new Error("Unable to find stream " + type + " " + this.options.appData.fileType);
            }

            return selecedStream;
        },
        selectStream: function(streams, kbps, type) {
            var stream, currentKbps, currentDist, returnStream;
            var dist = -1;

            for (var i = 0; i < streams.length; i = i + 1) {
                stream = streams[i];

                if ((!stream.linkType || stream.linkType.toLowerCase() === type.toLowerCase()) && (!stream.fileType || stream.fileType == this.options.appData.fileType)) {
                    currentKbps = (stream.kbps ? stream.kbps : stream.bitrateKbps);
                    currentDist = Math.abs(currentKbps - kbps);

                    if (dist === -1 || currentDist < dist) {
                        dist = currentDist;
                        returnStream = stream;
                    }
                }
            }

            return returnStream;
        },
        getQuerystring: function (key, default_) {
            if (default_==null) default_="";

            key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
            var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
            var qs = regex.exec(window.location.href);

            if(qs == null)
                return default_;
            else
                return qs[1];
        },
        /** starts playing the content */
        play: function () { },
        /** pauses the content */
        pause: function () { },
        /** stops playback and returns to the first frame */
        stop: function () { },
        /** @return current position in timeline in percent (Number between 0 and 1) */
        progress: function () {
            return this.position() / this.duration();
        },
        /** @return current position in timeline in seconds */
        position: function () {
            return 0;
        },
        currentTimeCode: function () {
            return this.timeCodeConverter.secondsToTimeCode(this.position());
        },
        /** @return total length of content in seconds */
        duration: function () {
            if (this.resourceResult) {
                return this.resourceResult.durationInMilliseconds / 1000;
            } else if (this.programcardResult) {
                var resource = this.programcardResult.Assets.filter(function (item) {
                    return item.Kind === "VideoResource" || item.Kind === "AudioResource";
                })[0];

                if (!resource) {
                    return 0;
                }
                
                return resource.DurationInMilliseconds / 1000;
            } else {
                return 0;
            }
        },
        productionNumber: function () {
            if (this.resourceResult) {
                return this.resourceResult.productionNumber;
            } else if (this.programcardResult && this.programcardResult.ProductionNumber) {
                return this.programcardResult.ProductionNumber;
            } else if (this.options.videoData.productionNumber) {
                return this.options.videoData.productionNumber;
            } else {
                return '00000000000';
            }
        },
        hasResource: function () {
            return (this.resourceResult != null || this.programcardResult != null);
        },
        resourceSlug: function () {
            // create slug for old getResource handler
            if (this.programcardResult) {
                return this.programcardResult.Slug;
            } else if (this.resourceResult && this.resourceResult.name) {
                var slug = this.resourceResult.name.toLowerCase();
                slug = slug.replace(/[^\-a-zA-Z0-9,&\s]+/ig, '');
                slug = slug.replace(/[\s|\-|\_]+/gi, "-");
                return slug.substr(0, 40);
            } else if (this.options.videoData.episodeSlug) {
                return this.options.videoData.episodeSlug;
            } else if (this.productionNumber() !== '00000000000') {
                return this.productionNumber();
            } else if (this.resourceResult && this.resourceResult.resourceId) {
                return 'resourceId:' + this.resourceResult.resourceId;
            } else {
                return '';
            }
        },
        links: function () {
            if (this.resourceResult) {
                return this.resourceResult.links;
            } else if (this.programcardResult) {
                var resource = this.programcardResult.Assets.filter(function (item) {
                    return item.Kind === "VideoResource" || item.Kind === "AudioResource";
                })[0];
                return resource.Links.map(function (item) {
                    return {
                        "uri": item.Uri,
                        "linkType": item.Target,
                        "fileType": item.FileFormat,
                        "bitrateKbps": item.Bitrate,
                        "width": item.Width,
                        "height": item.Height
                    }
                });
            }
            return [];
        },
        getPosterImage: function () {
            // use custom image, if defined
            if (this.options.videoData.image) {
                return this.options.videoData.image;
            }
            // use image from resource and resize
            var w, h, resourceImage;
            if (this.resourceResult && this.resourceResult.images && this.resourceResult.images.length > 0) {
                resourceImage = this.resourceResult.images[0].src;
                // w = this.options.element.offsetWidth;
                // h = Math.floor(this.options.element.offsetWidth / 16 * 9);
                return resourceImage;
            } else if (this.programcardResult) {
                var image = this.programcardResult.Assets.filter(function (item) {
                    return item.Kind === "Image";
                })[0];
                if (image) {
                    return image.Uri;
                }
            }
            // use original image, if defined
            if (this.originalPosterImage !== null) {
                return this.originalPosterImage;
            } else {
                return this.options.appData.urls.defaultImage || "";
            }
        },
        /**
         * forgets all properties loaded from ensureResource 
         */
        forgetModel: function () {
            this.resourceResult = null;
            this.programcardResult = null;
        },
        resourceName: function () {
            if (this.resourceResult) {
                return this.resourceResult.name;
            } else if (this.programcardResult) {
                return this.programcardResult.Title;
            }
            return "";
        },
        resourceId: function () {
            if (this.resourceResult) {
                return this.resourceResult.resourceId;
            } else if (this.programcardResult) {
                return this.programcardResult._ResourceId;
            }
            return 0;
        },
        onDurationChange: function () {
            var dur = this.duration();
            if (dur && dur > 0 && dur !== Infinity) {
                this.hasDuration = true;
                this.fireEvent('durationChange');
            }
        },
        onPlay: function () {
            this.fireEvent('play');
        },
        onPause: function () {
            if (!this._forceSeekIntervalId) {
                this.fireEvent('pause');
            }
        },
        onProgressChange: function () {
            this.fireEvent('progressChange');
        },
        /**
        * @name buffering
        * @event
        * Dispatched when the player starts to buffer content
        */
        onBuffering: function (position) {
            this.fireEvent('buffering', position);
        },
        /**
        * @name bufferingComplete
        * @event
        * Dispatched when the player is finished buffering
        */
        onBufferingComplete: function (position) {
            this.fireEvent('bufferingComplete', position);
        },

        /**
        * @name beforeSeek
        * @event
        * Dispatched when the player starts to seek to another position
        */
        onBeforeSeek: function (position) {
            //console.log('AbstractPlayer:onBeforeSeek');
            this.fireEvent('beforeSeek', position);
        },
        /**
        * @name afterSeek
        * @event
        * Dispatched when the player is finished seeking
        */
        onAfterSeek: function (position) {
            //console.log('AbstractPlayer:onAfterSeek');
            this.fireEvent('afterSeek', position);
        },
        /**
        * @name complete
        * @event
        * Dispatched when the player has played the entire content
        */
        onComplete: function () {
            //console.log('AbstractPlayer:onComplete');
            this.fireEvent('complete');
        },
        /**
        * @name changeChannel
        * @event
        * Fired when the player changes live channel from an internal menu. IE. flash fullscreen.
        */
        changeChannel: function (channelId) {
            this.fireEvent('changeChannel', channelId);
            this.channelHasChanged = true;
        },
        /**
        * @name changeContent
        * @event
        * Fired when the player changes on demand content from an internal menu. IE. flash fullscreen.
        */
        changeContent: function (programSLUG, programSerieSlug) {
            this.fireEvent('changeContent', programSLUG, programSerieSlug);
            this.contentHasChanged = true;
        },
        /**
        * Removes all html from element
        */
        clearContent: function () {
            this.fireEvent('clearContent');
            try {
                if (this.options.element.getChildren().length() > 0) {
                    this.options.element.getChildren().destroy();
                }
            } catch (e) {
                this.options.element.innerHTML = ''; //IE friendly disposing of flash player
            }
        },
        /**
        * Sends a logging entry if options.logging.errorLogUrl is defined
        * with the following GET parameters:
        * url        -    document.location of the containing page
        * error    -    "access_denied", "connection_failed", "defaultMsg", "notFound", "timeout"
        */
        logError: function (errorCode) {
            if (this.options.logging && this.options.logging.errorLogUrl !== null) {
                new Request({
                    'url': this.options.logging.errorLogUrl,
                    'method': 'get'
                }).send('error=' + errorCode + '&url=' + escape(document.location));
            }
        },
        /**
        * Displays error
        * @param  {[type]} errorCode [description]
        * @private
        */
        displayError: function (errorCode) {
            /*jshint devel:true */
            if (window.console && console.log) { console.log("Error: " + errorCode); }
        },


        /**
         * Seeks the player to a specific position in the timeline
         * @param  {string} timeCode formatted HH:MM:SS, MM:SS, HH:MM:SS.MS or MM:SS.MS
         * @deprecated Use seek instead
         * @see  seek
         */
        seekToTimeCode: function (timeCode) {
            /*jshint devel:true*/
            if (window.console && console.log) { console.log("seekToTimeCode is deprecated, use seek() instead"); }
            this.seek(timeCode);
        },

        /**
         * Seeks the player to a specific position in the timeline
         * @param {object} time code or number between 0 and 1
         */
        seek: function (value) {
            if (this._forceSeekIntervalId) {
                this._forceSeekComplete();
            }
            this._forceSeekIntervalId = this._forceSeek.periodical(100, this, value);
            this._forceSeek(value);
        },

        /** @private */
        _forceSeekIntervalId: null,
        /** @private */
        _forceSeek: function (value) {
            var seconds, distance, pos, seekResult;
            seekResult = this._seek(value);
            if (typeof(value) === 'string') {
                seconds = this.timeCodeConverter.timeCodeToSeconds(value);
            } else {
                seconds = value * this.duration();
            }
            pos = this.position();
            distance = Math.abs(seconds - pos);
            if (distance < 0.1 || seekResult || !value) {
                this._forceSeekComplete();
            }
        },
        /** @private */
        _forceSeekComplete: function () {
            clearTimeout(this._forceSeekIntervalId);
            this._forceSeekIntervalId = null;
        },

        timeCodeConverter: {

            /**
            * @function
            * Converts timecode to seconds as a floating point number
            * @param {String}    timeCode    The timecode as a string. IE: HH:MM:SS or MM:SS or MM:SS.MS
            * @return {Number}
            */
            timeCodeToSeconds: function (timeCode) {
                var values = timeCode.split(":");
                values = values.reverse();
                return Number(values[0]) + (Number(values[1]) * 60) + (values.length > 2 ? (Number(values[2]) * 3600) : 0);
            },

            /**
            * @function
            * Converts timecode to a progress factor, where 0 is the beginning of the content and 1 is the end.
            * @param {String}    timeCode    The timecode as a string. IE: HH:MM:SS or MM:SS or MM:SS.MS
            * @param {Number}    length    The duration of the content in seconds as a floating point number
            */
            timeCodeToProgress: function (timeCode, length) {
                return this.timeCodeToSeconds(timeCode) / length;
            },

            /**
            * @function
            * Converts progress factor to timecode as a string. IE: HH:MM:SS or MM:SS
            * @param {Number}    progress    Progress as a number, where 0 is the beginning of the content and 1 is the end.
            * @param {Number}    length        The duration of the content in seconds as a floating point number
            * @param {bool}     forceHours     If true the time code will allways contain hours
            */
            progressToTimeCode: function (progress, length, forceHours) {
                return this.secondsToTimeCode(this.progressToSeconds(progress, length), forceHours);
            },

            /**
            * @function
            * Converts progress factor to seconds as a floating point number
            * @param {Number}    progress    Progress as a number, where 0 is the beginning of the content and 1 is the end.
            * @param {Number}    length        The duration of the content in seconds as a floating point number
            */
            progressToSeconds: function (progress, length) {
                return progress * length;
            },

            /**
            * @function
            * Converts from seconds as a floating point number to timecode as a string. IE: HH:MM:SS or MM:SS
            * @param {Number}    seconds        Seconds as a floating point number
            * @param {bool}     forceHours     If true the time code will allways contain hours
            */
            secondsToTimeCode: function (seconds, forceHours) {
                var min = Math.floor(seconds / 60);
                var sec = parseInt(seconds, 10) % 60;
                var hours = 0;
                if (min >= 60) {
                    hours = Math.floor(min / 60);
                    min = min % 60;
                }

                return (hours > 0 || forceHours ? (hours < 10 ? "0" + hours : hours) + ":" : "") + (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec);
            },

            /**
            * @function
            */
            unixTimeStampToTimeCode: function (timestamp) {
                var date = new Date(timestamp);

                var seconds = 0;

                if (date.hours > 0) seconds += date.hoursUTC * 60 * 60;
                if (date.minutes > 0) seconds += date.minutesUTC * 60;
                if (date.seconds > 0) seconds += date.secondsUTC;

                return this.secondsToTimeCode(seconds);
            },

            /**
            * @function
            * Converts from seconds as a floating point number to progress factor, where 0 is the beginning of the content and 1 is the end.
            * @param {Numver} seconds Seconds as a floating point number
            * @param {Number} length The duration of the content in seconds as a decimal number.
            */
            secondsToProgress: function (seconds, length) {
                return seconds / length;
            }
        },
        queryGeofilter: function() {
            var xmlhttp = new XMLHttpRequest();

            xmlhttp.open("GET", window.location.protocol + "//geo.dr.dk/DR/DR.CheckIP.IsDanish/", true);
            xmlhttp.setRequestHeader("Cache-Control", "no-cache");
            xmlhttp.setRequestHeader("Accept", "*/*");
            xmlhttp.setRequestHeader("Server", "geo.dr.dk");

            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4) {
                    this.handleGeoResponse(xmlhttp.responseText);
                }
            }.bind(this);

            xmlhttp.send();
        },
        handleGeoResponse: function(isInDenmark) {
            console.log('handleGeoResponse() not implemented. Must be overridden in sub class');
        }
    });

    AbstractPlayer.$mediaPlayerId = 0;

    return AbstractPlayer;
});
