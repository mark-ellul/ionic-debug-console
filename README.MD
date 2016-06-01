# Ionic Debug Console

In-app javascript console for Ionic 2 applications with remote error tracking.

## Installation

Run this command in root of your Ionic 2 project.

To install this library, run:

```bash
$ npm install ionic-debug-console --save
```

Then require the console library in app.ts.

```typescript
import * as cons from 'ionic-debug-console/ionic-debug-console';
```

Add providers and directives to @App metadata in app.ts

```typescript
providers: [cons.ConfProvider, cons.ConsoleDataProvider, cons.AppConsoleService, cons.SystemInfoProvider],
directives: [cons.ConsoleButtonComponent]
```

Pass ConsoleDataProvider instance to @App class constructor and init console with some config.

```typescript
constructor(private _consoleDataProvider: cons.ConsoleDataProvider){
  this._consoleDataProvider.init({apiUrl: 'http://localhost:3000/',
                                  apiToken: '574a946146bab50828200f3e',
                                  reporting: true});
}
```

Put console button component to @App template. Don\`t forget pass `content`.

```html
<console-button [content]="content"></console-button>
```

Example application with integration described above:

https://github.com/lpikora/ionic-debug-console-testapp

## Configuration

Configuration is pass as object with properties to `init` function of `ConsoleDataProvider`. For example:

```typescript
constructor(private _consoleDataProvider: cons.ConsoleDataProvider){
  this._consoleDataProvider.init({apiUrl: 'http://localhost:3000/',
                                  apiToken: '574a946146bab50828200f3e',
                                  reporting: true});
}
```

When **reporting** set `true`, some configuration values are load from server application settings. Values passed to init() function has always prioprity and rewrite application configuration from server.

* **apiUrl** - url of server running <a href="https://github.com/lpikora/ionic-debug-console-backend-api">Ionic Debug Console Server</a>
* **apiToken** - application accest token for server
* **reporting** - when `true`, logged data are sent to server. Default `false`.
* **production** - when `true`, console button will not show and console errors, logs and warns are disabled. Default `false`.
* **communicationInterval** - interval in `ms` for sending dat to server. Default value loads from server.
* **logErrors** - when `true`, errors aer sent to server. Default value loads from server.
* **logWarnings** - when `true`, console.warn output is sent to server. Default value loads from server.
* **logLogs** - when `true`, console.log output is sent to server. Default value loads from server.
* **sendOnlyOnError** - when `true`, console output is sent only if contains error. Default value loads from server.

## Development

To generate all `*.js`, `*.js.map` and `*.d.ts` files:

```bash
$ npm run tsc
```

## Other repos

### Ionic Debug Console Server

Ionic Debug Console server with REST API for error tracking.

https://github.com/lpikora/ionic-debug-console-backend-api

### Ionic Debug Console Server UI

User interface for Ionic Debug Console Server. Provide managing apps and displaying tracked logs and errors.

https://github.com/lpikora/ionic-debug-console-backend-ui

### Example app with Ionic Debug Console intergation

Example of Ionic Debug Console itegration in Ionic 2 app.

https://github.com/lpikora/ionic-debug-console-testapp

## License

MIT © [Lukas Pikora](lpikora@gmail.com)
