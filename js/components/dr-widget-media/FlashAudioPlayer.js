/*jshint mootools:true,browser:true,devel:true */
define("dr-media-flash-audio-player", ['dr-media-audio-player'], function (AudioPlayer) {
    "use strict";
    var FlashAudioPlayer = new Class({
        Extends: AudioPlayer,
        eventCatcherId: null,
        swiff: null,
        flashStreamInitalized: false,
        lastProgressEvent: null,
        isPlaying: false,
        options: {
            'appData': {
                'errorMessages': {
                    'obsolete_flash_player': 'Du skal have <a href="http://get.adobe.com/flashplayer/">Adobe Flash Player 10 eller nyere</a> installeret for at høre dette.'
                }
            }
        },
        initialize: function (options) {
            this.parent(options);

            //register global eventCatcher for flash callbacks:
            if (!window.DR) {
                window.DR = {};
            }
            if (!window.DR.NetRadio) {
                window.DR.NetRadio = {};
            }
            this.eventCatcherId = "eventCatcher_" + this.mediaPlayerId.toString();
            window.DR.NetRadio[this.eventCatcherId] = this.eventCatcher.bind(this);
        },

        build: function () {
            if (Browser.Plugins.Flash.version < 10) {
                this.displayError('obsolete_flash_player');
                return;
            }

            this._ensureStream = this.options.videoData.videoType === 'ondemand' ?  this.ensureResource : this.ensureLiveStreams;
            this._ensureStream(this.postBuild.bind(this));
            this.parent();
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
        postBuild: function () {
            var swiffContainer = new Element('div', { 'class':'DRInvisibleAudioPlayer',
                styles: { position: 'absolute' }
            });

            this.options.element.adopt(swiffContainer);

            var swfUrl = '';

            /*if (this.getQuerystring('akamai-test', '') == 'true') {
                swfUrl = '/assets/swf/DRInvisibleAudioPlayer-test.swf';
            } else {
                swfUrl = '/assets/swf/DRInvisibleAudioPlayer.swf';
            }
            */
            swfUrl = '/assets/swf/DRInvisibleAudioPlayer.swf';
            
            this.swiff = new Swiff(swfUrl, {
                container: swiffContainer,
                params: {
                    allowscriptaccess: 'sameDomain',
                    wmode: 'transparent',
                    bgcolor: '#ffffff'
                },
                vars: {
                    eventCatcherFunction: "window.DR.NetRadio." + this.eventCatcherId,
                    autoPlay: this.options.appData.autoPlay
                }
            });
            // this.swiff.object.set('tabindex', '-1');
        },

        eventCatcher: function (event) {

            switch (event.type) {

                case "versionEvent":
                    //flash player is ready
                    this.setVolume(this.currentVolume || 0.7);
                    this.setBroadcastData();
                    this.ready();
                    break;

                case "progressEvent":
                    this.lastProgressEvent = event;
                    this.onProgressChange();
                    break;

                case "complete":
                    this.onComplete();
                    break;

                case "playStateChange":
                    if (event.playState === "playing") {
                        this.isPlaying = true;
                        this.onPlay();
                    } else if (event.playState === "paused") {
                        this.isPlaying = false;
                        this.onPause();
                    } else if (event.playState === "stopped") {
                        this.flashStreamInitalized = false;
                        this.isPlaying = false;
                        this.onStop();
                    }
                    break;

                case "bufferProgressEvent":
                    // console.log("buffer: " + event.progress);
                    break;

                case "bufferingChange":
                    if (event.buffering) {
                        this.options.element.addClass('buffering');
                        this.onBuffering(this.position());
                    } else {
                        this.options.element.removeClass('buffering');
                        this.onBufferingComplete(this.position());
                    }
                    break;

                case "seekingChange":
                    if (event.seeking) {
                        this.onBeforeSeek(this.lastProgressEvent.currentTime);
                    } else {
                        this.lastProgressEvent = { 'currentTime': event.time};
                        this.onAfterSeek(event.time);
                        this.onProgressChange();
                        this.onPlay();
                    }
                    break;

                case "mediaError":
                    if (event.error && event.error.detail)
                        console.log(event.error.detail);

                    this.displayError('defaultMsg');
                    break;

                default:
                     if (window.console && console.log) { console.log("unknown event: ", event.type); }
                    break;
            }
        },

        setBroadcastData: function() {
            if (this.options.videoData.videoType === 'live') {
                try {
                    Swiff.remote(this.swiff.object, 'flash_setVideoData', this.options.videoData);
                } catch (err) {
                    console.log("Error calling 'flash_setVideoData'");
                }
            } else if (this.programcardResult !== null) {
                var pc = this.programcardResult;
                pc.videoType = this.options.videoData.videoType;
                try {
                    Swiff.remote(this.swiff.object, 'flash_setProgramCard', this.programcardResult);
                } catch (err) {
                    console.log("Error calling 'flash_setProgramCard'");
                }
            }
        },

        setNewBitrate: function(bitrate) {
            this.parent(bitrate);

            this.flashStreamInitalized = false;

            this.play();

            if (this.targetTimeCode) this.seek(this.targetTimeCode);
        },

        updateOptions: function (options) {
            //this.pause(); // stop current stream
            this.setOptions(options); // set new options
            this.setOptions({ 'appData': { 'autoPlay': true} }); // enable autoplay
            this.forgetModel(); // reset resource
            this.flashStreamInitalized = false; // tell flash to load new file
            this.play();
        },

        play: function () {
            if (!this.flashStreamInitalized) {
                this._ensureStream(function () {
                    var stream = this.getStream(this.options.appData.defaultQuality);

                    if (!stream) {
                        console.log('invalid stream: ' + stream + ' ::: ABORTING!');
                    }
                    
                    Swiff.remote(this.swiff.object, 'flash_play', stream);
                    this.flashStreamInitalized = true;
                } .bind(this));
            } else {
                if (!this.isPlaying) {
                    Swiff.remote(this.swiff.object, 'flash_pause'); //toggle pause
                }
            }
        },
        pause: function () {
            Swiff.remote(this.swiff.object, 'flash_pause');
        },
        stop: function () {
            Swiff.remote(this.swiff.object, 'flash_stop');
        },
        position: function () {
            // if (this.seekWhenReady) {
            //     var fakePosition = 0;
            //     if (typeof (this.seekWhenReady) === 'string') {
            //         fakePosition = this.timeCodeConverter.timeCodeToSeconds(this.seekWhenReady);
            //     } else {
            //         fakePosition = this.seekWhenReady;
            //     }
            //     return fakePosition;
            // }
            if (this.lastProgressEvent) {
                return this.lastProgressEvent.currentTime;
            } else {
                return 0;
            }
        },
        volume: function () {
            return this.currentVolume;
        },
        setVolume: function (vol) {
            this.currentVolume = vol;
            if (this.swiff) Swiff.remote(this.swiff.object, 'flash_setVolume', vol);
            this.fireEvent('volumechange');
        },
        /**
         * @private
         */
        _seek: function (value) {
            var seconds;
            if (typeof(value) === 'string') {
                seconds = this.timeCodeConverter.timeCodeToSeconds(value);
            } else {
                seconds = value * this.duration();
            }
            if (this.isPlaying) {
                try {
                    Swiff.remote(this.swiff.object, 'flash_seekTo', seconds);
                    return true;
                } catch (error) {
                    return false;
                }
            }
            return false;
        }
    });

    return FlashAudioPlayer;
});
