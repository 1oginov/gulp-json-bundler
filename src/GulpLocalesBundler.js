const deepAssign = require('deep-assign');
const objectPath = require('object-path');
const path = require('path');
const through2 = require('through2');
const Vinyl = require('vinyl');

/**
 * Gulp Locales Bundler.
 * @param {Object} [options={}]
 * @return {*}
 */
const GulpLocalesBundler = (options = {}) => {
  const master = options.master || '';
  const omit = options.omit || '';

  const contents = {};

  return through2.obj(
      // Transform function.
      function(chunk, encoding, callback) {
        let localePath = path.relative(chunk.base, path.dirname(chunk.path)).
            replace(new RegExp(omit, 'g'), '');

        // Replace backslashes with slashes for Windows paths.
        localePath = localePath.replace(/\\/g, '/');
        // Remove first and last slashes.
        localePath = localePath.replace(/^\/|\/$/g, '');

        const fileName = path.basename(chunk.path);
        const content = {};

        objectPath.set(content, localePath.replace(/\//g, '.'),
            JSON.parse(chunk.contents));

        contents[fileName] = contents[fileName] || {};
        deepAssign(contents[fileName], content);

        callback();
      },
      // Flush function.
      function(callback) {
        Object.keys(contents).
            map((fileName) => {
              const values = deepAssign({}, contents[master] || {},
                  contents[fileName]);

              return new Vinyl({
                contents: new Buffer(JSON.stringify(values)),
                path: fileName,
              });
            }).
            forEach((file) => {
              return this.push(file); // eslint-disable-line no-invalid-this
            });

        callback();
      });
};

module.exports = GulpLocalesBundler;
