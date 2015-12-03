# electron-shortcut [![Build Status](https://travis-ci.org/ragingwind/electron-shortcut.svg?branch=master)](https://travis-ci.org/ragingwind/electron-shortcut)

> Helper for global shortcut registering


## Install

```
$ npm install --save electron-shortcut
```


## Usage

```js
const Shortcut = require('electron-shortcut');

// create and register a shortcut with auto-register
var shortcut = new Shortcut('Command+1', {toggle: true}, handler);

// create and register shortcuts with manual-register
var shortcut = Shortcut(['Command+2', 'Command+3'], {
	toggle: false
}, handler);

shortcut.register();
```

## Shortcut

### Shortcut(shortcuts, [options], handler)

#### shortcuts

Type: `string` or 'array'

Names for shortcut to register as global shortcut

#### options

- `toggle`: default: false, Auto un/register shortcuts on application has focus.
- `cmdOrCtrl`: default: false, All events of Command or Cmd will be changed into Control or Ctrl when your application runs on Windows or Linux.

### register

Register shortcuts with shortcut list already added.

### unregister

Unregister shortcuts with shortcut list already added.

### add

Add a new shortcut

### remove

Remove a shortcut

### get(event)

Return shortcut by event name

### set(event, [options], handler)

Update shortcut with new options by event name

## License

MIT © [ragingwind](http://ragingwind.me)
