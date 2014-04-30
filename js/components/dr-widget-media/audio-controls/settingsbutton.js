define('audio-control-settings-button', [], function () {
	
	/*jshint mootools:true*/
	'use strict';

	var SettingsButton = new Class({
		initialize: function (model) {
			this.model = model;

			//TODO: add event for qualities available 
			//this.model.addEvent('play', this.onPlay.bind(this));

			this.element = new Element('div', {
				'class': 'settings',
				'style': 'display: none;'
			});

			this.toggle = new Element('button', {
				'class':'dr-icon-settings',
				'role':'presentation'
			});

			this.list = new Element('ul', {
				'style': 'display: none;'
			});

			this.element.adopt(
					this.toggle,
					this.list
				);

			this.onClick = this.onClick.bind(this);
			this.toggle.addEvent('click', this.onClick, false);

			this.buildMenu = this.buildMenu.bind(this);
			this.model.addEvent('dr-widget-audio-player-bitrates-available', this.buildMenu, false);

			this.setSelected = this.setSelected.bind(this);
			this.model.addEvent('dr-widget-audio-player-bitrate-selected', this.setSelected, false);

			this.onChangeBitrate = this.onChangeBitrate.bind(this);
			this.element.addEvent('click:relay(a)', this.onChangeBitrate, false);
		},
		onClick: function (e) {
			e.stop();
			if (this.list.get('style') === '') {
				this.list.set('style', 'display: none;');
			} else {
				this.list.set('style', '');
			}
		},
		onChangeBitrate: function (e, target) {
			e.preventDefault();
			var kbps = target.get('data-kbps');
			this.model.setNewBitrate(kbps);
			this.list.set('style', 'display: none;');
		},
		buildMenu: function () {
			this.list.set('html', '');
			if (this.model.bitratesAvailable.length > 1) {
				for (var i=0; i<this.model.bitratesAvailable.length; i++) {
					var b = this.model.bitratesAvailable[i];

					var element = new Element('li');
					element.adopt(new Element('a', {
						'text': (b.bitrate > 0 ? b.bitrate + ' kbps' : 'Automatisk'),
						'href': '#',
						'data-kbps': b.bitrate,
						'title': (b.bitrate > 0 ? 'Skift kvalitet til ' + b.bitrate + ' kbps' : 'Vælg automatisk kvalitet'),
						'class': (this.model.options.appData.defaultQuality == b.bitrate ? 'selected' : '')
					}));
					this.list.adopt(element);
				}
				this.element.set('style', '');
				this.model.options.element.addClass('has-settings');
			} else {
				this.element.set('style', 'display: none;');
				this.model.options.element.removeClass('has-settings');
			}
		},
		setSelected: function (event, bitrate) {
			var selectedKbps = this.model.options.appData.defaultQuality;
			this.element.getElements('li a').each(function (a) {
				if (a.get('data-kbps') == selectedKbps) {
					a.addClass('selected');
				} else {
					a.removeClass('selected');
				}
			});


		},
		toElement: function () {
			return this.element;
		}
	});

	return SettingsButton;
});