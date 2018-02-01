'use strict';

var localesBundler = require('../src/GulpLocalesBundler');
var File = require('vinyl');
var chai = require('chai');
var expect = chai.expect;

chai.use(require('chai-things'));

describe('localesBundler', function() {
  var fixtures = [
    {
      contents: {some: 'textteil', another: 'textteil2'},
      path: '/src/component-1/locales/de-de.json',
    },
    {
      contents: {some: 'piece of text'},
      path: '/src/component-1/locales/en-us.json',
    },
    {
      contents: {hello: 'world'},
      path: '/src/deeply/nested/component/locales/en-us.json',
    },
    {
      contents: {test: 'test-textteil'},
      path: '/src/component-2/locales/de-de.json',
    },
  ].
      map(function(file) {
        file.base = '/src/';
        file.contents = new Buffer(JSON.stringify(file.contents));

        return new File(file);
      });

  it('bundles json files with the same name', function(done) {
    var files = [];

    var jb = localesBundler();

    jb.on('data', function(file) {
      return files.push(file);
    });

    jb.on('end', function() {
      expect(files).to.have.lengthOf(2);
      expect(files).to.include.an.item.with.property('path', 'de-de.json');
      expect(files).to.include.an.item.with.property('path', 'en-us.json');
      done();
    });

    fixtures.forEach(function(file) {
      return jb.write(file);
    });

    jb.end();
  });

  it('merges the contents together', function(done) {
    var files = [];

    var jb = localesBundler();

    jb.on('data', function(file) {
      return files.push(JSON.parse(file.contents.toString()));
    });

    jb.on('end', function() {
      var deDe = {
        'component-1': {
          locales: {some: 'textteil', another: 'textteil2'},
        },
        'component-2': {
          locales: {test: 'test-textteil'},
        },
      };

      expect(files).to.contain.an.item.that.deep.equals(deDe);

      done();
    });

    fixtures.forEach(function(file) {
      return jb.write(file);
    });

    jb.end();
  });

  it('optionally inherits values from a master', function(done) {
    var files = [];

    var jb = localesBundler({master: 'de-de.json'});

    jb.on('data', function(file) {
      return files.push(JSON.parse(file.contents.toString()));
    });

    jb.on('end', function() {
      var enUs = {
        'component-1': {
          locales: {some: 'piece of text', another: 'textteil2'},
        },
        'component-2': {
          locales: {test: 'test-textteil'},
        },
        'deeply': {
          nested: {
            component: {
              locales: {hello: 'world'},
            },
          },
        },
      };

      expect(files).to.contain.an.item.that.deep.equals(enUs);

      done();
    });

    fixtures.forEach(function(file) {
      return jb.write(file);
    });

    jb.end();
  });

  it('optionally omits a directory name from the resulting object paths', function(done) {
    var files = [];

    var jb = localesBundler({omit: 'locales'});

    jb.on('data', function(file) {
      return files.push(JSON.parse(file.contents.toString()));
    });

    jb.on('end', function() {
      var deDe = {
        'component-1': {some: 'textteil', another: 'textteil2'},
        'component-2': {test: 'test-textteil'},
      };

      expect(files).to.contain.an.item.that.deep.equals(deDe);

      done();
    });

    fixtures.forEach(function(file) {
      return jb.write(file);
    });

    jb.end();
  });

});
