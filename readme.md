# electron-shortcuts [![Build Status](https://travis-ci.org/ragingwind/electron-shortcuts.svg?branch=master)](https://travis-ci.org/ragingwind/electron-shortcuts)

> Helper for global shortcut registering


## Install

```
$ npm install --save electron-shortcuts
```


## Usage

```js
const Shortcuts = require('electron-shortcut');

// create and register a shortcut with auto-register
var shortcuts = new Shortcuts('Command+1', {toggle: true}, handler);

// create and register shortcuts with manual-register
var shortcuts = Shortcuts(['Command+2', 'Command+3'], {
	toggle: false
}, handler);
shortcuts.register();

// register an individual shortcut
var shortcut = new Shortcuts.Shortcut('Command+4', {
	cmdOrCtrl: true,
	toggle: true
}, handler);
```

## Shortcuts

### Shortcuts(input, [options], handler)

Shortcuts supports that register a list of shortcut. Please refer parameters to [Shortcut](#Shortcut).

### register

Register shortcuts with shortcut list already added.

### unregister

Unregister shortcuts with shortcut list already added.

### add

Add a new shortcut

### remove

Remove a shortcut

## Shortcut

Shortcut class supports that register a individual shortcut

### Shortcut(input, [options], handler)

#### input

Type: `string` or 'array'

Names for shortcut to register as global shortcut

#### options

- `toggle`: default: false, Auto un/register shortcuts on application has focus.
- `cmdOrCtrl`: default: false, All events of Command or Cmd will be changed into Control or Ctrl when your application runs on Windows or Linux.

#### handler

Event handler for the shortcut

### register

register a shortcut on global scope

### unregister

unregister a shortcut on global scope

### toggle(on)

Toggle a shortcut on `browser-window-focus/blur event`

## License

MIT © [ragingwind](http://ragingwind.me)
