# Universal DotEnv<br/>[![Sponsored by][sponsor-img]][sponsor] [![Version][npm-version-img]][npm] [![Downloads][npm-downloads-img]][npm] [![Build Status Unix][travis-img]][travis] [![Build Status Windows][appveyor-img]][appveyor] [![Dependencies][deps-img]][deps] [![Tested with Jest][jest-img]][jest]

[sponsor-img]: https://img.shields.io/badge/Sponsored%20by-Sebastian%20Software-692446.svg
[sponsor]: https://www.sebastian-software.de
[deps]: https://david-dm.org/sebastian-software/universal-dotenv
[deps-img]: https://david-dm.org/sebastian-software/universal-dotenv.svg
[npm]: https://www.npmjs.com/package/universal-dotenv
[npm-downloads-img]: https://img.shields.io/npm/dm/universal-dotenv.svg
[npm-version-img]: https://img.shields.io/npm/v/universal-dotenv.svg
[travis-img]: https://img.shields.io/travis/sebastian-software/universal-dotenv/master.svg?branch=master&label=unix%20build
[appveyor-img]: https://img.shields.io/appveyor/ci/swernerx/universal-dotenv/master.svg?label=windows%20build
[travis]: https://travis-ci.org/sebastian-software/universal-dotenv
[appveyor]: https://ci.appveyor.com/project/swernerx/universal-dotenv/branch/master
[jest-img]: https://facebook.github.io/jest/img/jest-badge.svg
[jest]: https://github.com/facebook/jest

Universal DotEnv - A Robust Environment Configuration for Universal Applications.


## Features

- Supports loading `.env` files with overriding between different `NODE_ENV` settings and `BUILD_TARGET` configurations.
- Serializes all `APP_` prefixed environment variables for usage as `raw`, `stringified` or `webpack` (for `DefinePlugin`)
- Supports variable expansion between different settings.
- Allows local overrides using files which use a ".local" postfix.


## All Strings

It's always a good concept to keep in mind that environment variables
are always strings. Even if you define `true` or numbers like `100` they are
still send over as strings. See also: https://github.com/motdotla/dotenv/issues/51


## Variables

- `NODE_ENV`: Typically either `production`, `development` or `test`
- `BUILD_TARGET`: Either `client` or `server`


## File Priority

Files are being loaded in this order. Values which are already set are never overwritten. Command line environment settings e.g. via [cross-env](https://www.npmjs.com/package/cross-env) always win.

- `.env.${BUILD_TARGET}.${NODE_ENV}.local`
- `.env.${BUILD_TARGET}.${NODE_ENV}`
- `.env.${BUILD_TARGET}.local`
- `.env.${BUILD_TARGET}`
- `.env.${NODE_ENV}.local`
- `.env.${NODE_ENV}`
- `.env.local`
- `.env`

Note: `local` files without `NODE_ENV` are not respected when running in `NODE_ENV=test`.


## Basic Usage

All loading features are enabled by importing the core module itself:

```js
import "dotenv-universal"
```

After this you can access all environment settings you have defined in one of your `.env` files.

```js
console.log(process.env.APP_MY_ENV)
```


## Serialization

The module offers access to all app specific environment settings which should be prefixed with `APP_` e.g. `APP_TITLE = "My App"`.

```js
import { getEnvironment } from "dotenv-universal"

// This also loads all environment specific settings into `process.env`

const { raw, stringified, webpack } = getEnvironment()
```

Return values:

- raw: Just a plain JS object containing all app settings
- stringified: Plain object but with JSON stringified values
- webpack: For usage with [Webpacks Define Plugin](https://webpack.js.org/plugins/define-plugin/)



## License

[Apache License Version 2.0, January 2004](license)

## Copyright

<img src="https://cdn.rawgit.com/sebastian-software/sebastian-software-brand/3d93746f/sebastiansoftware-en.svg" alt="Sebastian Software GmbH Logo" width="250" height="200"/>

Copyright 2018<br/>[Sebastian Software GmbH](http://www.sebastian-software.de)
