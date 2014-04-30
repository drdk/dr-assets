/*jshint mootools:true,browser:true,devel:true */
define("dr-media-audio-player",
["dr-media-abstract-player", "dr-lazyloader",
    "audio-control-error-message", 'audio-control-settings-button', 'audio-control-play-button-overlay', 'audio-control-play-button',
    'audio-control-progressbar', 'audio-control-volumeselector', 'audio-control-skip-buttons'],
function (AbstractPlayer, LazyLoader, ErrorMessageControl, SettingsButton, PlayButtonOverlayControl, PlayButtonControl, ProgressBarControl, VolumeSelectorControl, SkipButtonsControl) {
    "use strict";

    /*
    if (!window.console) { window.console = {}; }
    if (console.log) { console._log = console.log; }
    console.log = function (msg) {
        var el = document.getElement('#HEST_log');
        if (!el) {
            el = new Element('pre', { id: 'HEST_log', styles: { backgroundColor: '#ccf', fontSize: '12px' }});
            el.inject(document.getElement('.dr-ui-paging-tabs'), 'top');
        }
        el.set('text', el.get('text') + '\n' + msg);
        if (console._log) {
            console._log.apply(console, arguments);
        }
    };
    */

    var AudioPlayer = new Class({
        Extends: AbstractPlayer,
        options: {
            mediaType: 'audio',
            videoData: {},
            appData: {
                defaultQuality: -1,
                gemius: {
                    identifier: 'ApianyLnm8kTV5nad0MB0cTYzQCZuM9wIVf5SZ5x.rH.n7<'
                },
                errorMessages: {
                    access_denied: 'Denne lydfil er af ophavsretsmæssige årsager beskyttet mod visning udenfor Danmark. Hvis du befinder dig i Danmark og mener du har fået denne besked ved en fejl, kontakt os da på brugerhenvendelsessiden',
                    not_found: 'Programmet du søger findes desværre ikke.',
                    connection_failed: 'Der er desværre sket en fejl. Læs om driftstatus og kontakt til DR på brugerhenvendelsessiden',
                    timeout: 'Afspilleren har været inaktiv for længe. Genindlæs siden, så kan du se videoen igen.',
                    defaultMsg: 'Der er desværre sket en fejl. Vi kigger på sagen, så prøv igen senere!'
                },
                urls: {
                    liveStreams: '/radio/external/channels?mediaType=radio',
                    channelLogoUrl: '/assets/img/logos/dr-logo-{id}-small.png'
                }
            }
        },
        bitratesAvailable: [],
        targetTimeCode: null,
        initialize: function (options) {
            this.parent(options);

            this.isTouch = ('ontouchmove' in window);
            if (this.isTouch) {
                this.options.element.addClass('touch');
            }

            var data = this.load();

            if (data && data.bitrate) {
                // cookie was already set
                this.options.appData.defaultQuality = data.bitrate;
            }

            // bind methods
            ['play', 'pause', 'stop', 'progress', 'position', 'duration'].forEach(function (fn) {
                this[fn] = this[fn].bind(this);
            }, this);

            this.addEvent('resourceReady', this.setDurationClass.bind(this));
            // this.addEvent('resourceLoading', this.setLoadingState.bind(this));

            this.build();
        },
        load: function () {
            var data = document.cookie.match(/(?:^|[; ]+)audio-player-bitrate=([^;]+)(?:;|$)/);
            if (data) {
                data = JSON.parse(decodeURIComponent(data[1]));
                return data;
            }
            else {
                return null;
            }
        },
        saveBitrate: function (bitrate) {
            var expires = new Date();
            expires.setFullYear(expires.getFullYear() + 1);

            this.options.appData.defaultQuality = bitrate;
            var data = { bitrate: bitrate };

            document.cookie = "audio-player-bitrate=" + encodeURIComponent(JSON.stringify(data)) + ";expires=" + expires.toUTCString() + ";path=/;domain=.dr.dk";
        },
        build: function () {
            var container = this.options.element;
            if (this.options.videoData.videoType === 'ondemand') {
                container.adopt(
                    new PlayButtonControl(this),
                    //new PlayButtonOverlayControl(this),
                    new ProgressBarControl(this),
                    new SettingsButton(this)
                );

                if (document.getElement('#net-radio')) {
                    new PlayButtonOverlayControl(this);
                }
            } else {
                container.adopt(
                    new PlayButtonControl(this, { pauseClass: 'dr-icon-stop-large' }),
                    //new PlayButtonOverlayControl(this),
                    new ProgressBarControl(this),
                    new SettingsButton(this)
                );

                if (document.getElement('#net-radio')) {
                    new PlayButtonOverlayControl(this);
                }
            }

            if (this.options.appData.volumeControls) {
                this.options.element.addClass('has-volume');
                container.adopt(new VolumeSelectorControl(this));
            }

            this.options.element.addClass('loading');

            if(this.options.videoData.videoType === "live") {
                this.initializeLiveProgressbar();
            }

            window.fireEvent('dr-widget-audio-player-initialized', container);

        },

        ready: function () {
            this.options.element.removeClass('loading');

            if (this.options.appData.autoPlay) {
                this.play();
            }
        },

        // TODO: candidate for refactor to abstractplayer (also used to Html5Player)
        getChannel: function () {
            return this.options.videoData.channels.filter(function (c) {
                return c.slug === this.options.videoData.channelId;
            }, this)[0];
        },

        setBitratesAvailable: function (value) {
            this.bitratesAvailable = value;
            this.fireEvent('dr-widget-audio-player-bitrates-available');
        },

        setNewBitrate: function(bitrate) {
            if (bitrate === this.options.appData.defaultQuality) {
                return;
            }
            

            this.saveBitrate(bitrate);
            this.fireEvent('dr-widget-audio-player-bitrate-selected');

            if (this.options.videoData.videoType === "ondemand") {
                this.targetTimeCode = this.currentTimeCode();
            }
        },

        getStream: function (quality) {
            var server, channel, item;
            if (this.options.videoData.videoType === "live") {
                item = this.findClosestQuality(this.getChannel().servers, quality);

                this.setBitratesAvailable(this.getBitratesFromLiveStream(item));

                var selectedStream = this.getStreamByBitrate(quality);

                if (selectedStream) {
                    return selectedStream.uri;
                } else {
                    return item.server + "/" + item.qualities[0].streams[0];
                }
            } else if (this.options.videoData.videoType === "ondemand") {
                item = this.findClosestQuality(this.links(), quality);
                
                if (item.linkType.toLowerCase() === 'hds') {
                    this.setBitratesAvailable(this.getBitratesFromODStream(item));

                    item = this.getStreamByBitrate(quality);
                }
                return item.uri;
            }
        },
        getBitratesFromODStream: function(stream) {
            // create bitrates array with default "all bitrates" option
            var bitrates = [{
                bitrate: -1, 
                uri: stream.uri
            }];

            var parts = stream.uri.split(',');
            var first = parts.splice(0, 1);
            var last = parts.pop();
            var bitrateObj;

            // Sort bitrates to ascending order
            parts.sort(function(a,b){return a-b});

            for(var i = 0; i < parts.length; i++) {
                bitrateObj = {
                    bitrate: parts[i], 
                    uri: first + ',' + parts[i] + ',' + last
                };

                bitrates.push(bitrateObj);
            }

            return bitrates;
        },
        getBitratesFromLiveStream: function(stream) {
            if (stream.linkType.toLowerCase() !== 'hds' && stream.linkType.toLowerCase() !== 'hls') {
                return;
            }

            var bitrateObj;
            var quality;
            var bitrates = [];

            for(var i = 0; i < stream.qualities.length; i++) {
                quality = stream.qualities[i];

                // Do not add quality if there is no stream for the quality
                if (quality.streams.length == 0)
                    continue;

                bitrateObj = {
                    bitrate: quality.kbps, 
                    uri: stream.server + '/' + quality.streams[0]
                };

                bitrates.push(bitrateObj);
            }

            return bitrates;

        },
        getStreamByBitrate: function(bitrate) {
            if (!this.bitratesAvailable || this.bitratesAvailable.length === 0) {
                console.log('Error: No bitrates available');
                return null;
            }

            var i, closest;

            for(i = 0; i < this.bitratesAvailable.length; i++) {
                if (closest == null || Math.abs(this.bitratesAvailable[i].bitrate - bitrate) < Math.abs(closest.bitrate - bitrate)) {
                    closest = this.bitratesAvailable[i];
                }
            }

            return closest;
        },
        setLoadingState: function () {
            this.options.element.addClass('loading');
        },

        /**
        * Adds 'hours' css class to container if content duration is larger than one hour
        */
        setDurationClass: function () {
            if (this.duration() >= 3600) {
                this.options.element.addClass('hours');
            } else {
                this.options.element.removeClass('hours');
            }
        },

        updateOptions: function (options) {
            this.parent(options);
            this.clearContent();
            this.build();
        },

        // onPlay: function () {
        //     if (this.seekWhenReady) {
        //         if (typeof (this.seekWhenReady) === 'string') {
        //             this.seekToTimeCode.delay(1000, this, this.seekWhenReady);
        //         } else {
        //             this.seek.delay(1000, this, this.seekWhenReady);
        //         }
        //         this.seekWhenReady = null;
        //     }
        //     this.parent();
        // },

        initializeLiveProgressbar: function() {
            require(["dr-widget-live-element"], function (LiveElement) {
                this.liveProgressBar = new LiveElement(this.options.element);
                window.liveprogress = this.liveProgressBar.domElement;
                this.liveProgressBar.domElement.addEvent('update', this.update.bind(this));
            }.bind(this));
        },

        buildPreview: function () {
            // no-op, audioplayer has no preview
        },

        displayError: function (errorCode, errorDescription) {
            var msg = this.options.appData.errorMessages[errorCode];
            this.options.element.adopt(new ErrorMessageControl(msg, errorDescription));
            /*jshint devel:true*/
            if (window.console && console.log) { console.log(errorDescription); }
        },

        registerSkipProvider: function (provider) {
            this.skipProvider = provider;
            if(this.options.videoData.videoType !== "live") {
                var buttons = new SkipButtonsControl(this);
                var container = this.options.element;
                $(buttons).inject(container.getElement('.progressbar'), 'before');
            }
        },

        onBeforeSeek: function (position) {
            this.parent(position);
        },

        onBuffering: function (pos) {
            this.options.element.addClass('buffering');
            this.parent(pos);
        },

        onBufferingComplete: function (pos) {
            this.options.element.removeClass('buffering');
            this.parent(pos);
        },

        setLiveTimestamps: function (start, end) {
            this.options.element.getElement('.text span:first-child').set('text', start);
            this.options.element.getElement('.text span:last-child').set('text', end);
        },

        update: function() {
            window.fireEvent('dr-widget-audio-player-program-end', this);
        }

    });

    return AudioPlayer;
});
