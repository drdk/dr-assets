define('audio-control-skip-buttons', [], function () {

    /*jshint mootools:true*/
    'use strict';

    var SkipButtons = new Class({
        initialize: function (model) {
            this.model = model;

            this.element = new Element('div', { 'class': 'skip-buttons' }).adopt(
                new Element('button', {
                    text: 'Tilbage', 'class': 'dr-icon-back',
                    events: { 'click': this.onPrevious.bind(this) }
                }),
                new Element('button', {
                    text: 'Frem', 'class': 'dr-icon-skip',
                    events: { 'click': this.onNext.bind(this) }
                })
            );
        },
        onNext: function (e) {
            e.stop();
            this.seek(this.model.skipProvider.getNextPosition());
        },
        onPrevious: function (e) {
            e.stop();
            this.seek(this.model.skipProvider.getPreviousPosition());
        },
        seek: function (pos) {
            if (pos || pos === 0) {
                var pct = 1.0 / this.model.duration() * pos;
                this.model.seek(pct);
                return this;
            }
        },
        toElement: function () {
            return this.element;
        }
    });

    return SkipButtons;
});
