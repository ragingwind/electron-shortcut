'use strict';

const app = require('app');
const globalShortcut = require('global-shortcut');

class Shortcut {
	constructor(event, opts, listener) {
		if (typeof opts === 'function') {
			listener = opts;
			opts = {};
		}

		opts = opts || {};

		if (!listener) {
			throw new TypeError('Listener is invalid');
		}

		// save arguments
		this._event = this._originEvent = event;
		this._listener = listener;

		// check event
		if (globalShortcut.isRegistered(this._event)) {
			console.warn('Event already has been registered', event);
			return;
		}

		// change accelerator according to platform
		if (opts.cmdOrCtrl && process.platform !== 'darwin') {
			if (/Command\+/i.test(this._event)) {
				this._event = this._event.replace(/Command/i, 'Control');
			} else if (/Cmd\+/i.test(event)) {
				this._event = this._event.replace(/Cmd/i, 'Ctrl');
			}
		}

		if (opts.toggle) {
			this.toggle(true);
		}
	}

	register() {
		if (globalShortcut.isRegistered(this._event)) {
			console.warn('Event already has been registered', this._event);
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

	toggle(on) {
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
		if (typeof opts === 'function') {
			listener = opts;
			opts = {};
		}

 		opts = opts || {};

		if (!Array.isArray(events)) {
			events = [events];
		}

		for (var event of events) {
			if (this._shortcuts[event]) {
				throw new TypeError('Event already was registered');
			}

			this._shortcuts[event] =  new Shortcut(event, {
				cmdOrCtrl: opts.cmdOrCtrl,
				toggle: opts.toggle
			}, listener);

			this._shortcuts[event]._shortcuts = this;
		}

		return this;
	}

	remove(events) {
		if (!events) {
			throw new TypeError('Invalid events');
		}

		if (!Array.isArray(events)) {
			events = [events];
		}

		for (var event of events) {
			if (this._shortcuts[event]) {
				this._shortcuts[event].unregister();
				delete this._shortcuts[event];
			}
		}

		return this;
	}

	get(event) {
		return this._shortcuts[event];
	}

	set(event, opts, listener) {
		this.remove(event);
		this.add(event, opts, listener);
	}
}

module.exports = Shortcuts;
module.exports.Shortcut = Shortcut;
