'use strict';

const app = require('app');
const globalShortcut = require('global-shortcut');

function isArray(e) {
	return !Array.isArray(e) ? [e] : e;
}

class Shortcut {
	constructor(event, opts, listener) {
		if (typeof opts === 'function') {
			listener = opts;
			opts = undefined;
		}

		opts = opts || {
			autoRegister: true
		};

		if (!listener) {
			throw new TypeError('Listener is invalid');
		}

		// save arguments
		this._event = this._originEvent = event;
		this._listener = listener;
		this._opts = opts;

		// change accelerator according to platform
		if (opts.cmdOrCtrl && process.platform !== 'darwin') {
			if (/Command\+/i.test(this._event)) {
				this._event = this._event.replace(/Command/i, 'Control');
			} else if (/Cmd\+/i.test(event)) {
				this._event = this._event.replace(/Cmd/i, 'Ctrl');
			}
		}

		this.autoRegister = opts.autoRegister;
	}

	register() {
		if (globalShortcut.isRegistered(this._event)) {
			return;
		}

		globalShortcut.register(this._event, () => {
			if (this._listener) {
				this._listener({
					event: this._event,
					shortcuts: this._shortcuts
				}, this);
			}
		}.bind(this));
	}

	unregister() {
		if (!globalShortcut.isRegistered(this._event)) {
			return;
		}

		globalShortcut.unregister(this._event);
	}

	set autoRegister(on) {
		if (on) {
			var _this = this;

			this._on_focus = () => {_this.register();};
			this._on_blur = () => {_this.unregister();};

			app.on('browser-window-focus', this._on_focus);
			app.on('browser-window-blur', this._on_blur);
		} else {
			if (this._on_focus && this._on_blur) {
				app.removeListener('browser-window-focus', this._on_focus);
				app.removeListener('browser-window-blur', this._on_blur);

				this._on_focus = null;
				this._on_blur = null;
			}
		}
	}

	get autoRegister() {
		return this._on_focus && this._on_blur;
	}
}

class Shortcuts {
	constructor(events, opts, listener) {
		this._shortcuts = {};

		this.add(events, opts, listener);

		return this;
	}

	register() {
		var events = Object.keys(this._shortcuts);

		for (var event of events) {
			this._shortcuts[event].register();
		}

		return this;
	}

	unregister() {
		var events = Object.keys(this._shortcuts);

		for (var event of events) {
			this._shortcuts[event].unregister();
		}

		return this;
	}

	add(events, opts, listener) {
		events = isArray(events);

		for (var event of events) {
			if (this._shortcuts[event]) {
				throw new TypeError('Event already was registered');
			}

			this._shortcuts[event] = new Shortcut(event, opts, listener);
		}

		return this;
	}

	remove(events) {
		if (!events) {
			throw new TypeError('Invalid events');
		}

		events = isArray(events);

		for (var event of events) {
			if (this._shortcuts[event]) {
				this._shortcuts[event].unregister();
				delete this._shortcuts[event];
			}
		}

		return this;
	}

	get events() {
		return this._shortcuts;
	}
}

module.exports = (function() {
	let _shortcuts = null;

	Shortcuts.register = (events, opts, listener) => {
		if (!_shortcuts) {
			_shortcuts = new Shortcuts(events, opts, listener);
		} else {
			_shortcuts.add(events, opts, listener);
		}

		if (opts && typeof opts !== 'function' && !opts.autoRegister) {
			events = isArray(events);
			for (let event of events) {
				_shortcuts.events[event].register();
			}
		}
	};

	Shortcuts.unregister = events => {
		if (!_shortcuts) {
			return;
		}

		if (events) {
			_shortcuts.remove(events);
		} else {
			_shortcuts.unregister();
		}
	};

	return Shortcuts;
}());
