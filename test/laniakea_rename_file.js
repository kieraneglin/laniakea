const Laniakea = require('./../laniakea.js');
const assert = require('assert');
const fs = require('fs');
const h = require('./helpers/helpers');

describe('Laniakea', function () {
  beforeEach(function () {
    this.l = new Laniakea({ consoleOutput: false });
  });

  describe('renameFile', function () {
    describe('basic functions', function () {
      it('throws error if rom cannot be found in dictionary', function () {
        assert.throws(() => {
          // Arrow notation to refer to correct 'this';
          this.l.renameFile(h.romPath('without_checksum.nes'), h.romDest(), {
            dryrun: false,
            sortIntoFolders: false
          });
        }, /Error: Could not find associated game for given file checksum.  Checksum: cc4eaa427e8a035c41573dcd45542208/);

        assert(!fs.existsSync(h.romDest('without_checksum.nes')));
        assert(fs.existsSync(h.romPath('without_checksum.nes')));
      });

      it('throws error if source file cannot be found', function () {
        assert.throws(() => {
          // Arrow notation to refer to correct 'this';
          this.l.renameFile(h.romPath('doesnt_exist.nes'), h.romDest(), {
            dryrun: false,
            sortIntoFolders: false
          });
        }, `Error: File: ${h.romPath('doesnt_exist.nes')} not found`);
      });

      it('creates output directory if doesnt exist', function () {
        assert(!fs.existsSync(h.romPath('new_folder')));

        let rename = this.l.renameFile(h.romPath('1942.nes'), h.romDest('new_folder'), {
          dryrun: false,
          sortIntoFolders: false
        });

        assert(rename.destination === h.romDest('new_folder', '1942.nes'));
        assert(fs.existsSync(h.romDest('new_folder')));

        // Cleanup

        fs.renameSync(h.romDest('new_folder', '1942.nes'), h.romPath('1942.nes'));
        fs.rmdirSync(h.romDest('new_folder'));
      });

      it('renames misnamed rom', function () {
        let rename = this.l.renameFile(h.romPath('misnamed_file.nes'), h.romDest(), {
          dryrun: false,
          sortIntoFolders: false
        });

        assert(!fs.existsSync(h.romPath('misnamed_file.nes')));
        assert(!fs.existsSync(h.romDest('misnamed_file.nes')));
        assert(fs.existsSync(h.romDest('Abadox.nes')));

        // Cleanup

        fs.renameSync(h.romDest('Abadox.nes'), h.romPath('misnamed_file.nes'));
      });
    });
    describe('dryrun: true', function () {
      it('returns non-namespaced mock rename', function () {
        let rename = this.l.renameFile(h.romPath('1942.nes'), h.romDest(), {
          dryrun: true,
          sortIntoFolders: false
        });

        assert(rename.destination === h.romDest('1942.nes'));
        assert(!rename.destination.includes('NES'));
        assert(!fs.existsSync(h.romDest('1942.nes')));
      });

      it('returns namespaced mock rename', function () {
        let rename = this.l.renameFile(h.romPath('1942.nes'), h.romDest(), {
          dryrun: true,
          sortIntoFolders: true
        });

        assert(rename.destination === h.romDest('NES', '1942.nes'));
        assert(rename.destination.includes('NES'));
        assert(!fs.existsSync(h.romDest('1942.nes')));
        assert(!fs.existsSync(h.romDest('NES', '1942.nes')));
      });
    });
    describe('dryrun: false', function () {
      it('returns non-namespaced rename', function () {
        let rename = this.l.renameFile(h.romPath('1942.nes'), h.romDest(), {
          dryrun: false,
          sortIntoFolders: false
        });

        assert(rename.destination === h.romDest('1942.nes'));
        assert(!rename.destination.includes('NES'));
        assert(fs.existsSync(h.romDest('1942.nes')));

        // Cleanup

        fs.renameSync(h.romDest('1942.nes'), h.romPath('1942.nes'));
      });

      it('returns namespaced rename', function () {
        let rename = this.l.renameFile(h.romPath('1942.nes'), h.romDest(), {
          dryrun: false,
          sortIntoFolders: true
        });

        assert(rename.destination === h.romDest('NES', '1942.nes'));
        assert(rename.destination.includes('NES'));
        assert(!fs.existsSync(h.romDest('1942.nes')));
        assert(fs.existsSync(h.romDest('NES', '1942.nes')));

        // Cleanup

        fs.renameSync(h.romDest('NES', '1942.nes'), h.romPath('1942.nes'));
        fs.rmdirSync(h.romDest('NES'));
      });
    });
  });
});
