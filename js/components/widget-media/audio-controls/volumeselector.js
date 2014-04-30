define('audio-control-volumeselector', [], function () {

    /*jshint mootools:true*/
    'use strict';

    var VolumeSelector = new Class({
        unmuteVolume: 0,
        isMuted: false,
        initialize: function (model) {
            this.model = model;
            this.model.addEvent('volumechange', this.update.bind(this));

            this.element = new Element('div', { 'class': 'volume-selector' });

            for (var i = 0; i < 6; i++) {
                var name = 'volume_' + this.model.mediaPlayerId;
                this.element.adopt(
                    new Element('label', { 'for': name + '_' + i, 'text': i * 20 + '% lydstyrke' }),
                    new Element('input', { type: 'radio', name: name, 'title': i * 20 + '% lydstyrke',  id: name + '_' + i, events: { click: this.onClick.bind(this)} })
                );
            }

            this.element.getFirst().addClass('dr-icon-audio-medium');
            this.restoreVolume();
        },
        onClick: function (event) {
            event.stop();

            var list = this.element.getElements('input[type=radio]');
            var el = this.element.getElement('input[type=radio]:checked');

            if (el) {
                var idx = list.indexOf(el);
                if (idx === 0) {
                    if (this.isMuted) {
                        this.model.volume(this.model.setVolume(this.unmuteVolume));
                        this.isMuted = false;
                    } else {
                        this.isMuted = true;
                        this.unmuteVolume = this.model.volume();
                        this.model.setVolume(0);
                    }
                } else {
                    var volume = idx / (list.length - 1);
                    this.model.setVolume.delay(0, this.model, volume);
                    this.isMuted = false;
                }
            }
        },
        update: function () {
            var volume = this.model.volume();

            if (volume === 0) {
                this.element.addClass('muted');
            } else {
                this.element.removeClass('muted');
                this.saveVolume(volume);
            }

            var list = this.element.getElements('input[type=radio]');
            var idx = Math.floor(volume * (list.length - 1));

            if (idx > -1) {
                list[idx].set('checked', true);

                // support IE8 which can't style on :checked
                list.removeClass('checked');
                list[idx].addClass('checked');
            }

        },
        saveVolume: function () {
            if ('localStorage' in window && window.localStorage !== null) {
                localStorage['dr:netradio:volume'] = this.model.volume();
            }
        },
        restoreVolume: function () {
            if ('localStorage' in window && window.localStorage !== null) {
                var volume = Number(localStorage['dr:netradio:volume']) || 0.7;
                this.model.setVolume.delay(0, this.model, volume);
            }
        },
        toElement: function () {
            return this.element;
        }
    });

    return VolumeSelector;
});
