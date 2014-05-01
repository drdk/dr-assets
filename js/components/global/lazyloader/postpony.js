var postPony = (function (global, doc) {

	// utility functions
	var requestAF = global.requestAnimationFrame,
		cancelAF = global.cancelAnimationFrame;

	if (!doc.querySelectorAll || !requestAF || !cancelAF) {
		return;
	}

	var getElements = (function () {
		var sliceCallResult;
		try {
			sliceCallResult = [].slice.call(doc.querySelectorAll("html"));
		}
		catch (e) {}

		if (Object.prototype.toString.call(sliceCallResult) === "[object Array]") {
			return function (selector, element) {
				return [].slice.call((element || doc).querySelectorAll(selector))
			};
		}
		else {
			return function (selector, element) {
				var nodelist = (element || doc).querySelectorAll(selector),
					i = 0,
					l = nodelist.length,
					elements = [];

				while (i < l) elements.push(nodelist[i++]);
				return elements;
			};
		}
		
	}());

	function getIndex(array, value) {
		var i = 0,
			l = array.length;
		while (i < l) {
			if (array[i] === value) {
				return i;
			}
			i++;
		}
		return -1;
	}

	function each(subject, callback, bind) {
		var index = 0,
			length = subject.length;

		while (index < length) {
			callback.call(bind || subject, subject[index], index++);
		}

		return subject;
	}

	function hasClass(element, className) {
		var classList = element.className.split(/\s+/),
			index = getIndex(classList, className);

		return !(index == -1);
	}

	var addEvent = (global.addEventListener) ? function _addEventListener(element, event, func) {
		element.addEventListener(event, func, false);
	} : (global.attachEvent) ? function _attachEvent(element, event, func) {
		element.attachEvent("on" + event, func);
	} : function _addEvent(element, event, func) {
		element["on" + event] = func;
	};

	var removeEvent = (global.removeEventListener) ? function _removeEventListener(element, event, func) {
		element.removeEventListener(event, func, false);
	} : (global.detachEvent) ? function _detachEvent(element, event, func) {
		element.detachEvent("on" + event, func);
	} : function _removeEvent(element, event, func) {
		element["on" + event] = null;
	};


	/************/

	var active = false,
		placeholders = [],
		data = {},
		uid = 0,
		handlers = {},
		buffer = 800,
		body = doc.body,
		html = doc.documentElement,
		viewportOffset = 0,
		viewportOffsetObject = html,
		viewportOffsetProp = "scrollTop",
		viewportHeight = 0,
		viewportHeightObject = html,
		viewportHeightProp = "clientHeight",
		scrollableClassName = null;

	if ("pageYOffset" in global) {
		viewportOffsetProp = "pageYOffset";
		viewportOffsetObject = global;
	}

	if ("innerHeight" in global) {
		viewportHeightProp = "innerHeight";
		viewportHeightObject = global;
	}

	function setViewportHeight() {
		viewportHeight = viewportHeightObject[viewportHeightProp];
	};

	function setViewportOffset() {
		viewportOffset = viewportOffsetObject[viewportOffsetProp];
	};

	function check() {
		var i = 0,
			l = placeholders.length;

		if (!l) {
			stop();
		}
		else {
			var visible = [],
				top = viewportOffset - buffer,
				bottom = viewportOffset + viewportHeight + buffer,
				placeholder, id, d, _top, _bottom;

			while (i < l) {
				placeholder = placeholders[i++];
				if (placeholder) {
					id = placeholder.id;
					d = data[id];
					if (d) {
						_top = d.top;
						_bottom = d.bottom;
						if (bottom < _top) {
							break;
						}
						else if (_top > top || (_bottom > top && _bottom < bottom)) {
							visible.push(placeholder);
						}
					}
				}
			}

			i = 0;
			l = visible.length;
			while (i < l) {
				replace(visible[i++]);
			}
		}
	}


	var checkFrameId, checkTimer, checkTimeout = 300;

	function checkFrame() {
		checkFrameId = requestAF(check);
	}

	function checkStart() {
		if (!checkFrameId) {
			checkFrame();
		}
		if (checkTimer) {
			checkTimer = clearTimeout(checkTimer);
		}
		checkTimer = setTimeout(checkStop, checkTimeout);
	}

	function checkStop() {
		checkFrameId = cancelAF(checkFrameId);
		checkTimer = clearTimeout(checkTimer);
	}

	function replace(placeholder) {
		var index = getIndex(placeholders, placeholder),
			id = placeholder.id,
			d = data[id];

		handlers[d.type].replace(placeholder);

		if (index > -1) {
			placeholders.splice(index, 1);
			delete data[id];
		}
	}

	function stop() {
		if (active) {
			removeEvent(global, "scroll", SetAndStartCheck);
			removeEvent(global, "resize", updateAndCheck);
			active = false;
		}
	}

	function updatePositions(_placeholders) {
		_placeholders = _placeholders || placeholders;
		var i = 0,
			l = _placeholders.length,
			placeholder;

		while (i < l) {
			placeholder = _placeholders[i++];
			var height = placeholder.offsetHeight;

			if (height) {
				var rect = placeholder.getBoundingClientRect(),
					top = viewportOffset + rect.top,
					id = placeholder.id,
					d = data[id];
				if (d) {
						d.top = top;
						d.bottom = top + height;
				}
			}
		}
		_placeholders.sort(function (a, b) {
			return data[a.id].top - data[b.id].top;
		});
 	}

	function updateAndCheck() {
		setViewportHeight();
		updatePositions();
		check();
	}

	function SetAndStartCheck() {
		setViewportOffset();
		checkStart();
	}

	function handleScrollable(element) {
		var _placeholders = [];
		
		for (var type in handlers) {
			_placeholders.concat(getPlaceholders(element, handlers[type]));
		}
		addEvent(element, "scroll", function () {
			updatePositions(_placeholders);
			check();
		});
	};

	function getPlaceholders(element, handler) {
		var _placeholders = [],
			elements = getElements(handler.selector, element);

		each(elements, function (placeholder) {
			if (getIndex(placeholders, placeholder) < 0) {
				var id = placeholder.id;
				if (!id) {
					id = placeholder.id = "_" + uid++;
				}
				if (!data[id]) {
					data[id] = {
						type: handler.type
					};
				}
				placeholders.push(placeholder);
			}
			_placeholders.push(placeholder);
		});

		return _placeholders;
	}

	function config (options) {
		for (var key in options) {
		
			switch (key) {
				case "handlers":
					each(options[key], function (handler) {
						handlers[handler.type] = handler; 
					});
					break;

				case "scrollableClassName":
					scrollableClassName = options[key];
					break;
			}
		}
	}

	function init(element) {
		element = element || html;

		if (scrollableClassName) {
			var scrollables = (hasClass(element, scrollableClassName)) ? [element] : getElements("." + scrollableClassName, element);
			each(scrollables, handleScrollable);
		}

		var _placeholders = [];
		
		for (var type in handlers) {
			_placeholders = _placeholders.concat(getPlaceholders(element, handlers[type]));
		}

		if (_placeholders.length) {

			// for clients that do not support lazyloading
			if (window.operamini) {
				updatePositions(placeholders);
				each(placeholders, replace);
			}
			else {

				if (!active) {
					active = true;
					addEvent(global, "scroll", SetAndStartCheck);
					addEvent(global, "resize", updateAndCheck);
				}

				setTimeout(function () {
					setViewportOffset();
					setViewportHeight();
					updatePositions(placeholders);
					check();
				}, 0);

			}
		}
	};

	return {
		init: init,
		update: updateAndCheck,
		config: config
	};

}(window, document));