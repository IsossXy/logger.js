# @isoss/logger.js 

[![npm-version](https://img.shields.io/badge/npm-v1.0.0-blue.svg)](https://npmjs.com/package/@isoss/logger.js) [![dependencies](https://img.shields.io/badge/dependencies-none-brightgreen)]() [![license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://github.com/IsossXy/logger.js/blob/HEAD/LISCENSE)

> A lightweight and simple logging library  
> *inspired by [jonnyreeves' work](https://github.com/jonnyreeves/js-logger)*

## Table of contents

- [Install](#install)
- [Usage](#usage)
  - [Constructor](#using-the-constructor)
  - [Logger.get](#using-logger.get)
- [Logging](#logging)
  - [Levels](#levels)
    - [Combining](#combining)
    - [Enabling](#enabling)
    - [Disabling](#disabling)
  - [Handler](#handler)
    - [Default Handler](#default-handler)
  - [Context](#context)

## Install

```sh
$ npm install @isoss/logger.js
```

## Usage

### Using the constructor

```js
import { Logger } from '@isoss/logger.js';
// or const { Logger } = require('@isoss/logger.js');

const logger = new Logger({
    context: {
        name: 'MyLogger'
    }
});
```

*Note: a logger handles by default only fatal, error, warn and info levels. See [Levels](#levels) below.*

### Using Logger.get

```js
import { Logger } from '@isoss/logger.js';
// or const { Logger } = require('@isoss/logger.js');

const logger = Logger.get('MyLogger');
```

*Note: The Logger.get method retrives a logger already instantiated or creates a new one.*

## Logging

A logger has 6 different levels of logging:  
`FATAL, ERROR, WARN, INFO, DEBUG, TRACE`  
Each of these logging levels has its own method on the logging interface.

```js
logger.fatal('Whoops ! A fatal error occurs.');
// => [hh:mm:ss] [MyLogger] [Fatal] Whoops ! A fatal error occurs.
// [Program crash...]

logger.error('This is pretty embarassing...');
// => [hh:mm:ss] [MyLogger] [Error] This is pretty embarassing...

logger.warn('Something goes wrong but we can continue.');
// => [hh:mm:ss] [MyLogger] [Warn] Something goes wrong but we can continue.

logger.info('This is a neat info !');
// => [hh:mm:ss] [MyLogger] [Info] This is a neat info !

logger.debug('AAAAA');
// => [hh:mm:ss] [MyLogger] [Debug] AAAAA

logger.trace('Very verbose logging !');
// => [hh:mm:ss] [MyLogger] [Trace] Very verbose logging ! 
```

## Levels

Logging levels are represented by a bitfield. Only `FATAL, ERROR and INFO` are enabled by default. A level which isn't enabled will **not** be handled by the logging handler (see [Handler](#handler) below).

```js
import { Level } from '@isoss/logger.js';
// or const { Level } = require('@isoss/logger.js');
```

### Combining

As a level is represented by a flag in a bitfield, you can combine multiple levels easily using the bitwise operator `|`.

```js
Level.FATAL | Level.ERROR | Level.INFO // FATAL, ERROR and INFO levels
```

### Enabling

Use `Logger#enable` to enable a logging level (or more).

```js
logger.enable(Level.WARN); // Enables the WARN level
```

You can check if a level is enabled using `Logger#enabledFor`

```js
if(logger.enabledFor(Level.TRACE)) {
  // Do something
}
```

### Disabling

Use `Logger#disable` to enable a logging level (or more).

```js
logger.disable(Level.DEBUG); // Disables the DEBUG level
```

## Handler

All log messages are routed through a handler functions which redirects them somewhere. You can configure it using `Logge#setHandler`. The supplied function expects three arguments; the first being the log messages, the second being the level key which represents the handled level (i.e. `'FATAL', 'ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE'`) and the third being the context (name and levels that the logger handles) to handle.

```js
logger.setHandler((messages, level, context) => {
    // Redirect messages somewhere
});
```

### Default Handler

logger.js provides a default logging handler which writes to the console object using the appropriate logging function (i.e. `logger.info` => `console.info`).

Use `Logger.createDefaultHandler` to return a new logging handler.

```js
let handler = Logger.createDefaultHandler({
    formatter: (messages, level, context) => {
        // Prefix each log message by a timestamp
        messages.unshift(new Date().toLocaleTimeString());
    }
})
```

### Context

A context object contains the logger's name and filter level (the levels which are enabled). You can get it using `Logger#getContext` and set it via `Logger#setContext`.

```js
{
    filterLevel: 0, // The bitfield representing the filter level
    name: 'Logger' // The logger's name
}
```