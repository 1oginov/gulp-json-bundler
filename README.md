# gulp-locales-bundler

[![NpmVersion](https://img.shields.io/npm/v/gulp-locales-bundler.svg)](https://www.npmjs.com/package/gulp-locales-bundler)
[![Build Status](https://travis-ci.org/loginov-rocks/gulp-locales-bundler.svg?branch=master)](https://travis-ci.org/loginov-rocks/gulp-locales-bundler)
[![Coverage Status](https://coveralls.io/repos/github/loginov-rocks/gulp-locales-bundler/badge.svg?branch=master)](https://coveralls.io/github/loginov-rocks/gulp-locales-bundler?branch=master)
[![dependencies Status](https://david-dm.org/loginov-rocks/gulp-locales-bundler/status.svg)](https://david-dm.org/loginov-rocks/gulp-locales-bundler)
[![devDependencies Status](https://david-dm.org/loginov-rocks/gulp-locales-bundler/dev-status.svg)](https://david-dm.org/loginov-rocks/gulp-locales-bundler?type=dev)
[![Greenkeeper badge](https://badges.greenkeeper.io/loginov-rocks/gulp-locales-bundler.svg)](https://greenkeeper.io/)

Merges JSON files scattered here and there across your app. It is designed to **convert nested file structure into flat
with files containing deep objects**. So all of the `*/locales/en.json` files will be compiled into the one `en.json`
keeping nested structure.

It can be helpful if you want to have graceful translation files structure with respect to the **component approach**,
but your app works with only one file containing all of the language-related stuff at once. For example, as
[angular-translate](https://angular-translate.github.io) does it when uses
[staticFilesLoader](https://angular-translate.github.io/docs/#/guide/12_asynchronous-loading).

## Quick start

### Install

```sh
npm install --save-dev gulp-locales-bundler
```

### Use

`gulpfile.js` example:

```js
const gulp = require('gulp');
const gulpLocalesBundler = require('gulp-locales-bundler');

gulp.task('locales', function() {
  const options = {
    master: 'en.json', // Copy missed translations from `en.json` files, default is ''.
    omit: 'locales',   // Omit `locales` directory from the resulting objects, default is ''.
  };

  return gulp.src('src/app/**/locales/**/*.json'). // Get all JSON files from `locales` dir.
    pipe(gulpLocalesBundler(options)).             // Bundle.
    pipe(gulp.dest('dist/locales'));               // Spit out.
});
```

Of course, you can use any names for your JSON files.

## Real life example

Your application structure:

```
/src/app/
|-- catalog
|   |-- catalogItem
|   |   |-- locales
|   |   |   |-- en.json
|   |   |   `-- ru.json
|   |   `-- catalogItem.component.js
|   |-- locales
|   |   |-- en.json
|   |   `-- ru.json
|   `-- catalog.component.js
`-- user
    |-- locales
    |   |-- de.json 
    |   |-- en.json
    |   `-- ru.json
    `-- user.component.js
```

After using the above `gulpfile.js`:

```
/dist/locales/
|-- de.json
|-- en.json
`-- ru.json
```

The `en.json` file will look like this:

```
{
  "catalog": {
    "catalogItem": {
      // contents of `/src/app/catalog/catalogItem/locales/en.json`
    },
    // contents of `/src/app/catalog/locales/en.json`
  },
  "user": {
    // contents of `/src/app/user/locales/en.json`
  }
}
```

So you can obtain values using dot notation, `catalog.catalogItem.headline` for example.

## Contribution

If you want to contribute, please use the [dev](https://github.com/loginov-rocks/gulp-locales-bundler/tree/dev) branch.
