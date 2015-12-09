'use strict';
const app = require('app');
const path = require('path');
const BrowserWindow = require('browser-window');
const Shortcut = require('../');

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
	win.webContents.send('shortcut-status', 'Setted event has been fired ' + e.event);
};

app.anotherShortcutPressed = (e) => {
	win.webContents.send('shortcut-pressed', e.event);
	win.webContents.send('shortcut-status', 'Setted event has been fired ' + e.event);
};

app.on('ready', () => {
	mainWindow = createMainWindow();

	// register a shortcut
	app.shortcut1 = new Shortcut('Command+1', app.shortcutPressed);

	// register a shorcuts with no autoRegister option
	app.shortcut2 = new Shortcut([
		'Command+2',
		'Command+3'
	], {
		autoRegister: false
	}, app.shortcutPressed);

	// add a new command and set
	app.shortcut2.add('Command+4', app.shortcutPressed);
	// app.shortcut2.remove('Command+4');
	// app.shortcut2.add('Command+4', app.anotherShortcutPressed);

	// cancel a new command
	app.shortcut2.add('Command+5', app.shortcutPressed);
	app.shortcut2.remove('Command+5');

	// manuall register
	app.shortcut2.register();

	// using static method
	Shortcut.register('Command+6', app.shortcutPressed);
	Shortcut.register('Command+7', app.shortcutPressed);
	Shortcut.register(['Command+8', 'Command+9'], app.shortcutPressed);
});

app.on('will-quit', function () {
	app.shortcut1.unregister();
	app.shortcut2.unregister();

	Shortcut.unregister();
});
