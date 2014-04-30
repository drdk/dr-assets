define('audio-control-progressbar', [], function () {

    /*jshint mootools:true*/
    'use strict';

    var ProgressBar = new Class({
        isDragging: false,
        isEventsInitialized: false,
        initialize: function (model) {
            this.model = model;
            this.model.addEvent('durationChange', this.onDurationChange.bind(this));
            this.model.addEvent('afterSeek', this.update.bind(this));
            this.model.addEvent('progressChange', this.update.bind(this));
            this.model.addEvent('durationChange', this.initializeEvents.bind(this));
            var liveClass = this.model.options.videoData.videoType === "live" ? 'live' : '';
            this.element = new Element('div', { 'class': 'progressbar ' + liveClass }).adopt(
                new Element('div', { 'class': 'text' }).adopt(
                    new Element('span', { 'class': 'label', text: this.model.options.videoData.formattedstarttime || '00:00' }),
                    new Element('span', { 'class': 'label position', text: '00:00' }),
                    new Element('span', { 'class': 'label', text: this.model.options.videoData.formattedendtime || '00:00' })
                ),
                new Element('div', { 'class': 'meter' })
            );

            this.bindedStopDragEvent = this.stopDrag.bind(this);
            this.bindedDragEvent = this.drag.bind(this);
            this.update();


        },
        initializeEvents: function () {
            if (!this.isEventsInitialized) {
                this.element.addEvent((this.model.isTouch ? 'touchstart' : 'mousedown'), this.startDrag.bind(this));
                ['mousemove', 'mouseover', 'mouseout'].forEach(function (e) {
                    this.element.addEvent(e, this.handleToolTipEvents.bind(this));
                }, this);
            }
        },
        handleToolTipEvents: function (e) {
            e.stop();
            if (this.isDragging) {
                return;
            }
            switch (e.event.type) {
                case 'mouseover':
                    if (this.getMousePosition(e)) {
                        this.element.getElement('.text span.position').setStyle('display', 'block');
                    }
                    break;
                case 'mouseout':
                    this.element.getElement('.text span.position').setStyle('display', 'none');
                    break;
                case 'mousemove':
                    var pos = this.getMousePosition(e);
                    if (pos) {
                        this.element.getElement('.text span.position').setStyle('left', (pos * this.element.offsetWidth - 30) + 'px');
                        this.element.getElement('.text span.position').set('text', this.model.timeCodeConverter.progressToTimeCode(pos, this.model.duration()));
                    }
                    break;
            }
        },
        startDrag: function (e) {
            e.stop();
            if (this.getMousePosition(e)) {
                document.addEvent((this.model.isTouch ? 'touchend' : 'mouseup'), this.bindedStopDragEvent);
                document.addEvent((this.model.isTouch ? 'touchmove' : 'mousemove'), this.bindedDragEvent);
                this.element.getElement('.text span.position').setStyle('display', 'block');
                this.isDragging = true;
                this.drag(e);
            }
        },
        drag: function (e) {
            e.stop();
            var progress = this.getMousePosition(e);
            if (progress) {
                this.element.getElement('.meter').set('styles', { width: progress * 100 + '%' });
                this.element.getElement('.text span.position').setStyle('left', (progress * this.element.offsetWidth - 30) + 'px');
                this.element.getElement('.text span.position').set('text', this.model.timeCodeConverter.progressToTimeCode(progress, this.model.duration()));
            }
            this._dragPosition = progress;
        },
        stopDrag: function (e) {
            e.stop();
            this.isDragging = false;
            var pos = this._dragPosition;
            if (pos) {
                this.model.seek(pos);
            }
            this.element.getElement('.text span.position').setStyle('display', 'none');
            document.removeEvent((this.model.isTouch ? 'touchend' : 'mouseup'), this.bindedStopDragEvent);
            document.removeEvent((this.model.isTouch ? 'touchmove' : 'mousemove'), this.bindedDragEvent);
        },
        getMousePosition: function (event) {
            var bounds = this.element.getBoundingClientRect(),
                x = 0;
            if (event.event.type === 'touchend') {
                x = event.changedTouches[0].screenX;
            } else {
                x = event.page.x;
            }
            if (x > bounds.right) {
                return false;
            }
            return Math.max(0, (x - bounds.left) / (bounds.right - bounds.left));
        },
        onDurationChange: function () {
            this.element.getElement('.text span:last-child').set('text', this.model.timeCodeConverter.secondsToTimeCode(this.model.duration()));
            this.update();
        },
        update: function () {
            if (!this.isDragging) {
                var p = isFinite(this.model.progress()) ? this.model.progress() : 0;
                if(this.model.options.videoData.videoType !== "live"){
                    this.element.getElement('.text span:first-child').set('text', this.model.timeCodeConverter.secondsToTimeCode(this.model.position()));
                    this.element.getElement('.meter').set('styles', { width: (p ? p : 0) * 100 + '%' });
                }
            }
        },
        toElement: function () {
            return this.element;
        }
    });

    return ProgressBar;
});
