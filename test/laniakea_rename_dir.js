const Laniakea = require('./../laniakea.js');
const assert = require('assert');
const fs = require('fs');
const h = require('./helpers/helpers');

describe('Laniakea', function () {
  beforeEach(function () {
    this.l = new Laniakea({ consoleOutput: false });
  });

  describe('renameDirectory', function () {
    describe('basic functions', function () {
      it('renames all files in a directory', function () {
        let rename = this.l.renameDirectory(h.romPath('subdirectory'), h.romDest(), {
          recursive: false,
          dryrun: false,
          sortIntoFolders: false
        });

        assert(fs.existsSync(h.romDest('Conan.nes')));
        assert(fs.existsSync(h.romDest('Commando.nes')));

        assert(!fs.existsSync(h.romPath('subdirectory', 'Conan.nes')));
        assert(!fs.existsSync(h.romPath('subdirectory', 'Commando.nes')));

        // Cleanup

        fs.renameSync(h.romDest('Conan.nes'), h.romPath('subdirectory', 'Conan.nes'));
        fs.renameSync(h.romDest('Commando.nes'), h.romPath('subdirectory', 'misnamed_file.nes'));
      });
    });
    describe('recursing into directories', function () {
      it('does not recurse with recurse: false', function () {
        let rename = this.l.renameDirectory(h.romPath(), h.romDest(), {
          recursive: false,
          dryrun: false,
          sortIntoFolders: false
        });

        assert(fs.existsSync(h.romDest('1942.nes')));
        assert(fs.existsSync(h.romDest('Abadox.nes')));

        assert(!fs.existsSync(h.romDest('Conan.nes')));
        assert(!fs.existsSync(h.romDest('Commando.nes')));
        assert(!fs.existsSync(h.romDest('without_checksum.nes')));

        // Cleanup

        fs.renameSync(h.romDest('Abadox.nes'), h.romPath('misnamed_file.nes'));
        fs.renameSync(h.romDest('1942.nes'), h.romPath('1942.nes'));
      });
      it('does recurse with recurse: true', function () {
        let rename = this.l.renameDirectory(h.romPath(), h.romDest(), {
          recursive: true,
          dryrun: false,
          sortIntoFolders: false
        });

        assert(fs.existsSync(h.romDest('1942.nes')));
        assert(fs.existsSync(h.romDest('Abadox.nes')));
        assert(fs.existsSync(h.romDest('Conan.nes')));
        assert(fs.existsSync(h.romDest('Commando.nes')));

        assert(!fs.existsSync(h.romDest('without_checksum.nes')));

        // Cleanup

        fs.renameSync(h.romDest('Abadox.nes'), h.romPath('misnamed_file.nes'));
        fs.renameSync(h.romDest('1942.nes'), h.romPath('1942.nes'));
        fs.renameSync(h.romDest('Conan.nes'), h.romPath('subdirectory', 'Conan.nes'));
        fs.renameSync(h.romDest('Commando.nes'), h.romPath('subdirectory', 'misnamed_file.nes'));
      });
    });
    describe('dryrun: true', function () {
      it('will not move files', function () {
        let rename = this.l.renameDirectory(h.romPath('subdirectory'), h.romDest(), {
          recursive: false,
          dryrun: true,
          sortIntoFolders: false
        });

        assert(!fs.existsSync(h.romDest('Conan.nes')));
        assert(!fs.existsSync(h.romDest('Commando.nes')));

        assert(fs.existsSync(h.romPath('subdirectory', 'Conan.nes')));
        assert(fs.existsSync(h.romPath('subdirectory', 'misnamed_file.nes')));
      });
    });
    describe('sortIntoFolders: true', function () {
      it('will namespace into folders', function () {
        let rename = this.l.renameDirectory(h.romPath('subdirectory'), h.romDest(), {
          recursive: false,
          dryrun: false,
          sortIntoFolders: true
        });

        assert(fs.existsSync(h.romDest('NES', 'Conan.nes')));
        assert(fs.existsSync(h.romDest('NES', 'Commando.nes')));

        assert(!fs.existsSync(h.romPath('subdirectory', 'Conan.nes')));
        assert(!fs.existsSync(h.romPath('subdirectory', 'misnamed_file.nes')));

        // Cleanup

        fs.renameSync(h.romDest('NES', 'Conan.nes'), h.romPath('subdirectory', 'Conan.nes'));
        fs.renameSync(h.romDest('NES', 'Commando.nes'), h.romPath('subdirectory', 'misnamed_file.nes'));

        fs.rmdirSync(h.romDest('NES'));
      });
    });
    describe('return arrays', function () {
      it('wont stop on error, instead puts error in array', function () {
        let rename = this.l.renameDirectory(h.romPath(), h.romDest(), {
          recursive: false,
          dryrun: true,
          sortIntoFolders: false
        });

        assert(rename[2].errors);
      });
      it('returns array of all modified files', function () {
        let rename = this.l.renameDirectory(h.romPath(), h.romDest(), {
          recursive: false,
          dryrun: true,
          sortIntoFolders: false
        });

        assert(rename.length > 0);
      });
    });
  });
});
