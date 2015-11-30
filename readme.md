# electron-shortcuts [![Build Status](https://travis-ci.org/ragingwind/electron-shortcuts.svg?branch=master)](https://travis-ci.org/ragingwind/electron-shortcuts)

> Helper for global shortcut registering


## Install

```
$ npm install --save electron-shortcuts
```


## Usage

```js
const Shortcuts = require('electron-shortcut');

// register a shortcut
Shortcuts.register('Command+1', {toggle: true}, handler);

// register a shortcuts
Shortcuts.register([
	'Command+2',
	'Command+3'
], {toggle: false}, handler);

// register an individual shortcut
var shortcut = new Shortcuts.Shortcut('Command+4', {
	cmdOrCtrl: true,
	toggle: true
}, handler);

shortcut.register();
```

## API

### register(input, [options], handler)

#### input

Type: `string` or 'array'

Names for shortcut to register as global shortcut

#### options

- `autoRegister`: default: false, Auto un/register shortcuts on application has focus.
- `cmdOrCtrl`: default: false, All events of Command or Cmd will be changed into Control or Ctrl when your application runs on Windows or Linux.

## License

MIT © [ragingwind](http://ragingwind.me)
