define('audio-control-play-button', [], function () {

    /*jshint mootools:true*/
    'use strict';

    var PlayButton = new Class({
        Implements:[Options],
        options: {
            playClass: 'dr-icon-play-large',
            pauseClass: 'dr-icon-pause-large'
        },
        initialize: function (model, options) {
            this.model = model;

            this.setOptions(options);

            this.model.addEvent('play', this.onPlay.bind(this));
            this.model.addEvent('pause', this.onPause.bind(this));

            this.element = new Element('button', {
                text: 'Play',
                'class': this.options.playClass
            });

            this.onClick = this.onClick.bind(this);
            this.element.addEvent('click', this.onClick, false);
        },
        onClick: function (e) {
            e.stop();
            if (!this.element.hasClass('disabled')) {
                this.element.addClass('disabled');
                if (this.element.hasClass(this.options.playClass)) {
                    this.model.play();
                } else {
                    this.model.pause();
                }
            }
        },
        onPlay: function () {
            this.element.set({ 'class': this.options.pauseClass, text: 'Pause' });
        },
        onPause: function () {
            this.element.set({ 'class': this.options.playClass, text: 'Play' });
        },
        toElement: function () {
            return this.element;
        }
    });

    return PlayButton;
});
