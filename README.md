# gulp-locales-bundler

[![Build Status](https://travis-ci.org/1oginov/gulp-locales-bundler.svg?branch=master)](https://travis-ci.org/1oginov/gulp-locales-bundler)
[![dependencies Status](https://david-dm.org/1oginov/gulp-locales-bundler/status.svg)](https://david-dm.org/1oginov/gulp-locales-bundler)
[![devDependencies Status](https://david-dm.org/1oginov/gulp-locales-bundler/dev-status.svg)](https://david-dm.org/1oginov/gulp-locales-bundler?type=dev)

Merges JSON files scattered here and there across your app. It is designed to **convert nested file structure into flat
with files containing deep objects**. So all of the `*/locales/en.json` files will be compiled into one `en.json`
keeping nested structure.

It can be helpful if you want to have graceful translation files structure with respect to the **component approach**,
but your app works with only one file containing all of the language-related stuff at once. As it
[angular-translate](https://angular-translate.github.io/) does when uses
[staticFilesLoader](https://angular-translate.github.io/docs/#/guide/12_asynchronous-loading).

## Quick start

### Install

```sh
npm install gulp-locales-bundler --save-dev
```

### Use

`gulpfile.js` example:

```javascript
var gulp = require('gulp');
var localesBundler = require('gulp-locales-bundler');

gulp.task('locales', function() {
  var options = {
    master: 'en.json', // copy missed translations from `en.json` files, default is ''
    omit: 'locales',   // omits `locales` directory from the resulting objects, default is ''
  };

  return gulp.src('src/app/**/locales/**/*.json'). // get all JSON files from `locales` dir
    pipe(localesBundler(options)).                 // bundle
    pipe(gulp.dest('dist/locales/'));              // spit out
});
```

Of course, you can use any name for your JSON files, they will be bundled by filename.

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

```json
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

So you can access to the needed value using dot notation, `catalog.catalogItem.headline` for example.
