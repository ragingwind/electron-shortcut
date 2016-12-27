'use strict';

const {app, globalShortcut} = require('electron');
const oassign = require('object-assign');

function isArray(e) {
	if (!Array.isArray(e)) {
		e = [e];
	}

	return e;
}

class Shortcut {
	constructor(event, opts, listener) {
		if (typeof opts === 'function') {
			listener = opts;
			opts = undefined;
		}

		opts = oassign({
			autoRegister: true
		}, opts);

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
		});
	}

	unregister() {
		if (!globalShortcut.isRegistered(this._event)) {
			return;
		}

		globalShortcut.unregister(this._event);
	}

	set autoRegister(on) {
		if (on) {
			const _this = this;

			this._onFocus = () => {
				_this.register();
			};

			this._onBlur = () => {
				_this.unregister();
			};

			app.on('browser-window-focus', this._onFocus);
			app.on('browser-window-blur', this._onBlur);
		} else if (this._onFocus && this._onBlur) {
			app.removeListener('browser-window-focus', this._onFocus);
			app.removeListener('browser-window-blur', this._onBlur);

			this._onFocus = null;
			this._onBlur = null;
		}
	}

	get autoRegister() {
		return this._onFocus && this._onBlur;
	}
}

class Shortcuts {
	constructor(events, opts, listener) {
		this._shortcuts = {};

		this.add(events, opts, listener);

		return this;
	}

	register() {
		for (const event of Object.keys(this._shortcuts)) {
			this._shortcuts[event].register();
		}

		return this;
	}

	unregister() {
		for (const event of Object.keys(this._shortcuts)) {
			this._shortcuts[event].unregister();
		}

		return this;
	}

	add(events, opts, listener) {
		events = isArray(events);

		for (const event of events) {
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

		for (const event of events) {
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

module.exports = (function () {
	let _shortcuts = null;

	Shortcuts.register = (events, opts, listener) => {
		if (_shortcuts) {
			_shortcuts.add(events, opts, listener);
		} else {
			_shortcuts = new Shortcuts(events, opts, listener);
		}

		if (opts && typeof opts !== 'function' && !opts.autoRegister) {
			events = isArray(events);
			for (const event of events) {
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

	Shortcuts.Shortcut = Shortcut;

	return Shortcuts;
})();
