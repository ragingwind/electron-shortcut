# electron-shortcut

> Helper for registering global shortcut


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

## Shortcut(events, [options], handler)

#### events

Type: `string` or 'array'

Names for shortcut to register as global shortcut

#### options

- `toggle`: default: false, Auto un/register shortcuts on application has focus.
- `cmdOrCtrl`: default: false, All events of Command or Cmd will be changed into Control or Ctrl when your application runs on Windows or Linux.

#### handler

Global event handler for events

### register()

Register shortcuts with shortcut list already added.

### unregister()

Unregister shortcuts with shortcut list already added.

### add(events, [options], handler)

Add a new shortcut

### remove(events)

Remove a shortcut. If events is not set, remove all of events.

### get(events)

Return array of shortcut by event names

### set(events, [options], handler)

Update shortcut with new options by event name

## Shortcut.register(events, [options], handler)

Register events with static method. See [Shortcut](#Shortcut) for more information.

## Shortcut.unregister([events])

Unregister events with static method

## License

MIT © [ragingwind](http://ragingwind.me)
