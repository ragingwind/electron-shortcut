'use strict';

const {ipcRenderer} = require('electron');

ipcRenderer.on('shortcut-pressed', (e, shortcut) => {
	document.querySelector('#shortcut-title').textContent = shortcut;
});

ipcRenderer.on('shortcut-status', (e, status) => {
	document.querySelector('#shortcut-status').textContent = status;
});
