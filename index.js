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
			throw new Error('Listener is invalid');
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
		} else {
			this.register();
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
				}, this);
			}
		}.bind(this));
	}

	unregister() {
		if (!globalShortcut.isRegistered(this._event)) {
			console.warn('Event has not been registered', this._event);
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
	constructor() {
		this._shortcuts = {};
	}

	register(events, opts, listener) {
		opts = opts || {};

		if (!Array.isArray(events)) {
			events = [events];
		}

		for (var event of events) {
			if (this._shortcuts[event]) {
				throw new Error('Event already was registered');
			}

			var shortcut = new Shortcut(event, {
				cmdOrCtrl: opts.cmdOrCtrl,
				toggle: opts.toggle
			}, listener);

			this._shortcuts[event] = shortcut;
		}

		return this;
	}

	unregister(events) {
		if (!events) {
			events = Object.keys(this._shortcuts);
		}

		if (!Array.isArray(events)) {
			events = [events];
		}

		for (var event of events) {
			if (this._shortcuts[event]) {
				this._shortcuts[event].unregister();
				delete this._shortcuts[event];
				this._shortcuts[event] = null;
			}
		}

		return this;
	}
}

const shortcuts = new Shortcuts();

module.exports = shortcuts;
module.exports.Shortcut = Shortcut;
