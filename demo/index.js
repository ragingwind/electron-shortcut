'use strict';
const app = require('app');
const path = require('path');
const BrowserWindow = require('browser-window');
const Shortcuts = require('../');

// report crashes to the Electron project
require('crash-reporter').start();

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// prevent window being garbage collected
let mainWindow;

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null;
}

var win;
var shortcut;

function createMainWindow() {
	 win = new BrowserWindow({
		width: 640,
		height: 480,
		'web-preferences' : {
			'preload': path.join(__dirname, 'browser.js')
		}
	});

	win.loadUrl(`file://${__dirname}/index.html`);
	win.on('closed', onClosed);

	return win;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate-with-no-open-windows', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.shortcutPressed = (e) => {
	win.webContents.send('shortcut-pressed', e.event);
};

app.on('ready', () => {
	mainWindow = createMainWindow();

	// register a shortcut
	Shortcuts.register('Command+1', {toggle: true}, app.shortcutPressed);

	// register a shorcuts
	Shortcuts.register([
		'Command+2',
		'Command+3'
	], {toggle: false}, app.shortcutPressed);

	// register an indivisual shortcut
	var shortcut = new Shortcuts.Shortcut('Command+4', {
		cmdOrCtrl: true,
		toggle: true
	}, app.shortcutPressed);
});

app.on('will-quit', function () {
	Shortcuts.unregister();
});
