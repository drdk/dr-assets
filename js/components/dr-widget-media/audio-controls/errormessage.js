define('audio-control-error-message', [], function () {

    /*jshint mootools:true*/
    'use strict';

    var ErrorMesage = new Class({
        initialize: function (message, details) {
            this.message = message;

            this.element = new Element('div', { 'class': 'dr-infobox' });
            this.element.adopt(
                new Element('a', { 'href': '#', 'class': 'dr-icon-close-boxed close', 'title': 'luk', 'text': 'luk' }),
                new Element('h1', { 'class': 'dr-icon-info-boxed', 'text': 'Der er sket en fejl' }),
                new Element('p', { 'html': this.message })
            );

            if (details) {
                this.element.adopt(new Element('pre', { 'text': details }));
            }

            this.element.addEvent('click:relay(a.close)', function () {
                this.element.dispose();
            } .bind(this));
            // <div id="new-design-feedback" class="dr-infobox dr-siteid-tv">
            //     <a href="#" class="dr-icon-close-boxed close" title="Luk">Luk</a>
            //     <h1 class="dr-icon-info-boxed">Lorem ipsum dolor sit amet consectetur</h1>
            //     <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. <a href="#" class="section-link" title="Læs mere">Læs mere</a></p>
            // </div>
        },
        toElement: function () {
            return this.element;
        }
    });

    return ErrorMesage;
});
