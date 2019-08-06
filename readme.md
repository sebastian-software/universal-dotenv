# Universal DotEnv<br/>[![Sponsored by][sponsor-img]][sponsor] [![Version][npm-version-img]][npm] [![Downloads][npm-downloads-img]][npm] [![Build Status Unix][travis-img]][travis] [![Build Status Windows][appveyor-img]][appveyor] [![Dependencies][deps-img]][deps]

[sponsor]: https://www.sebastian-software.de
[deps]: https://david-dm.org/sebastian-software/universal-dotenv
[npm]: https://www.npmjs.com/package/universal-dotenv
[travis]: https://travis-ci.org/sebastian-software/universal-dotenv
[appveyor]: https://ci.appveyor.com/project/swernerx/universal-dotenv/branch/master
[sponsor-img]: https://badgen.net/badge/Sponsored%20by/Sebastian%20Software/692446
[deps-img]: https://badgen.net/david/dep/sebastian-software/universal-dotenv
[npm-downloads-img]: https://badgen.net/npm/dm/universal-dotenv
[npm-version-img]: https://badgen.net/npm/v/universal-dotenv
[travis-img]: https://badgen.net/travis/sebastian-software/universal-dotenv?label=unix%20build
[appveyor-img]: https://badgen.net/appveyor/ci/swernerx/universal-dotenv?label=windows%20build

Universal DotEnv - A Robust Environment Configuration for Universal Applications.

This solution is heavily inspired by the approach chosen by [Create React App](https://facebook.github.io/create-react-app/docs/adding-custom-environment-variables#adding-development-environment-variables-in-env) and made available for general usage.

## Features

- Supports loading `.env` files with overriding between different `NODE_ENV` settings and `ENV_CONTEXT` configurations.
- Automatically adds a `APP_ROOT` which points to the absolute root folder.
- Also adds `APP_SOURCE` which points to the source folder.
- Serializes all `APP_` prefixed environment variables for usage as `raw`, `stringified` or `webpack` (for `DefinePlugin`)
- Supports variable expansion between different settings.
- Allows local overrides using files which use a ".local" postfix.

## All Strings

It is important to remember that all environment variables are always stored as strings. Even numbers and booleans. The casting to other types must therefore take place in the application code. See also: https://github.com/motdotla/dotenv/issues/51

## Variables

- `NODE_ENV`: Typically either `production`, `development` or `test`
- `ENV_CONTEXT`: Often used for e.g. `client` or `server`. Can be also something totally custom e.g. `docker`, `staging`, etc.
- `APP_ROOT`: Points to the root folder of the application (absolute filesystem path)
- `APP_SOURCE`: Points to the source folder. If `src` exists this is being used. Otherwise the assumption is that it's identical to the `APP_ROOT`.

## File Priority

Files are being loaded in this order. Values which are already set are never overwritten. Command line environment settings e.g. via [cross-env](https://www.npmjs.com/package/cross-env) always win.

- `.env.${ENV_CONTEXT}.${NODE_ENV}.local`
- `.env.${ENV_CONTEXT}.${NODE_ENV}`
- `.env.${ENV_CONTEXT}.local`
- `.env.${ENV_CONTEXT}`
- `.env.${NODE_ENV}.local`
- `.env.${NODE_ENV}`
- `.env.local`
- `.env`

Note: `local` files without `NODE_ENV` are not respected when running in `NODE_ENV=test`.

## Basic Usage

All loading features are enabled by importing the core module itself:

```js
import "universal-dotenv"
```

After this you can access all environment settings you have defined in one of your `.env` files.

```js
console.log(process.env.APP_MY_ENV)
```

## Serialization

The module offers access to all app specific environment settings which should be prefixed with `APP_` e.g. `APP_TITLE = "My App"`.

```js
import { getEnvironment } from "universal-dotenv"

// This also loads all environment specific settings into `process.env`

const { raw, stringified, webpack } = getEnvironment()
```

Return values:

- raw: Just a plain JS object containing all app settings
- stringified: Plain object but with JSON stringified values
- webpack: For usage with [Webpacks Define Plugin](https://webpack.js.org/plugins/define-plugin/)

Webpack Usage:

```js
import { getEnvironment } from "universal-dotenv"
const { webpack } = getEnvironment()

...

plugins.push(new webpack.DefinePlugin(webpack))
```

This method also supports custom filtering of the environment data to export using a key-based filter method.

Here you can see the example config for only exporting environment settings where the key starts with string `MYKEY_`.

```js
const { raw, stringified, webpack } = getEnvironment({
  filter: (key) => key.startsWith("MYKEY_")
})
```

By default the `getEnvironment()` method translates strings which look like numbers or booleans into their native type representation. To disable this behavior pass over `false` for `enableTranslation` like:

```js
const { raw, stringified, webpack } = getEnvironment({ translate: false })
```

## License

[Apache License Version 2.0, January 2004](license)

## Copyright

<img src="https://cdn.rawgit.com/sebastian-software/sebastian-software-brand/0d4ec9d6/sebastiansoftware-en.svg" alt="Logo of Sebastian Software GmbH, Mainz, Germany" width="460" height="160"/>

Copyright 2018-2019<br/>[Sebastian Software GmbH](http://www.sebastian-software.de)
