'use strict';

const chai = require('chai');
const chaiThings = require('chai-things');
const Vinyl = require('vinyl');

const gulpLocalesBundler = require('../src/gulpLocalesBundler');

chai.use(chaiThings);

const {expect} = chai;

const data = [
  {
    contents: {
      another: 'textteil2',
      some: 'textteil',
    },
    path: '/src/component-1/locales/de-de.json',
  },
  {
    contents: {
      some: 'piece of text',
    },
    path: '/src/component-1/locales/en-us.json',
  },
  {
    contents: {
      hello: 'world',
    },
    path: '/src/deeply/nested/component/locales/en-us.json',
  },
  {
    contents: {
      test: 'test-textteil',
    },
    path: '/src/component-2/locales/de-de.json',
  },
].
    map((file) => {
      file.base = '/src/';
      file.contents = new Buffer(JSON.stringify(file.contents));

      return new Vinyl(file);
    });

describe('gulpLocalesBundler', () => {
  it('should bundle JSON files with the same name', (done) => {
    const files = [];
    const glb = gulpLocalesBundler();

    glb.on('data', (file) => files.push(file));

    glb.on('end', () => {
      expect(files).to.have.lengthOf(2);
      expect(files).to.include.an.item.with.property('path', 'de-de.json');
      expect(files).to.include.an.item.with.property('path', 'en-us.json');
      done();
    });

    data.forEach((file) => glb.write(file));

    glb.end();
  });

  it('should merge the contents', (done) => {
    const files = [];
    const glb = gulpLocalesBundler();

    glb.on('data', (file) => files.push(JSON.parse(file.contents.toString())));

    glb.on('end', () => {
      const deDe = {
        'component-1': {
          locales: {
            another: 'textteil2',
            some: 'textteil',
          },
        },
        'component-2': {
          locales: {
            test: 'test-textteil',
          },
        },
      };

      expect(files).to.contain.an.item.that.deep.equals(deDe);

      done();
    });

    data.forEach((file) => glb.write(file));

    glb.end();
  });

  it('should optionally inherit values from the master', (done) => {
    const files = [];
    const glb = gulpLocalesBundler({master: 'de-de.json'});

    glb.on('data', (file) => files.push(JSON.parse(file.contents.toString())));

    glb.on('end', () => {
      const enUs = {
        'component-1': {
          locales: {
            another: 'textteil2',
            some: 'piece of text',
          },
        },
        'component-2': {
          locales: {
            test: 'test-textteil',
          },
        },
        'deeply': {
          nested: {
            component: {
              locales: {
                hello: 'world',
              },
            },
          },
        },
      };

      expect(files).to.contain.an.item.that.deep.equals(enUs);

      done();
    });

    data.forEach((file) => glb.write(file));

    glb.end();
  });

  it('should optionally omit the directory name from the objects', (done) => {
    const files = [];
    const glb = gulpLocalesBundler({omit: 'locales'});

    glb.on('data', (file) => files.push(JSON.parse(file.contents.toString())));

    glb.on('end', () => {
      const deDe = {
        'component-1': {
          another: 'textteil2',
          some: 'textteil',
        },
        'component-2': {
          test: 'test-textteil',
        },
      };

      expect(files).to.contain.an.item.that.deep.equals(deDe);

      done();
    });

    data.forEach((file) => glb.write(file));

    glb.end();
  });
});
