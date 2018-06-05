# Babel Preset Edge<br/>[![Sponsored by][sponsor-img]][sponsor] [![Version][npm-version-img]][npm] [![Downloads][npm-downloads-img]][npm] [![Build Status Unix][travis-img]][travis] [![Build Status Windows][appveyor-img]][appveyor] [![Dependencies][deps-img]][deps] [![Tested with Jest][jest-img]][jest]

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

Universal Dotenv - A Robust Environment Configuration for Universal Applications.


## Key Features

- Supports loading `.env` files with overriding between different `NODE_ENV` settings and `BUILD_TARGET` configurations.
- Serializes all `APP_` prefixed environment variables for usage as `raw`, `stringified` or `webpack` (for `DefinePlugin`)
- Supports variable expansion between different settings.
- Allows local overrides using files which use a ".local" postfix.



## License

[Apache License Version 2.0, January 2004](license)

## Copyright

<img src="https://cdn.rawgit.com/sebastian-software/sebastian-software-brand/3d93746f/sebastiansoftware-en.svg" alt="Sebastian Software GmbH Logo" width="250" height="200"/>

Copyright 2018<br/>[Sebastian Software GmbH](http://www.sebastian-software.de)
