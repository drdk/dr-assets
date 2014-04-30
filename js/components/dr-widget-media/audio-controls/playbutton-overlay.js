define('audio-control-play-button-overlay', [], function () {

    /*jshint mootools:true*/
    'use strict';

    var PlayButtonOverlay = new Class({
            initialize: function (model) {
                this.model = model;
                this.model.addEvent('play', this.onPlay.bind(this));

                this.element = new Element('div', {
                    text: 'Start afspilning',
                    'class': 'pressPlay'
                });
            },
            onPlay: function () {
                this.element.setStyle('display', 'none');
            },
            toElement: function () {
                return this.element;
            }
    });

    return PlayButtonOverlay;
});
