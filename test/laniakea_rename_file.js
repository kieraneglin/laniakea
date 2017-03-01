const Laniakea = require('./../laniakea.js');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const helpers = require('./helpers/helpers');

if(glob.sync('**/*.nes', { cwd: __dirname, nocase: true }).length === 0){
  console.log("Test ROMs not found!  If you're running this from github, " +
    "you'll need to put your own ROMs in place and update tests accordingly.");
  console.log("For copyright reasons, I cannot check ROMs into source control. " +
    "Please only use ROMs you own and have converted yourself.");

  return false;
}

describe('Laniakea', function() {
  beforeEach(function() {
    // Pass false to silence console
    this.l = new Laniakea(false);
  });

  describe('renameFile', function() {
    describe('basic functions', function(){
      it('throws error if rom cannot be found in dictionary', function(){
        assert.throws(() => {
          // Arrow notation to refer to correct 'this';
          this.l.renameFile(helpers.romPath('without_checksum.nes'), helpers.romDest(), {
            dryrun: false,
            sortIntoFolders: false
          });
        }, /Error: Could not find associated game for given file checksum.  Checksum: cc4eaa427e8a035c41573dcd45542208/);

        assert(!fs.existsSync(helpers.romDest('without_checksum.nes')));
        assert(fs.existsSync(helpers.romPath('without_checksum.nes')));
      });

      it('throws error if source file cannot be found', function(){
        assert.throws(() => {
          // Arrow notation to refer to correct 'this';
          this.l.renameFile(helpers.romPath('doesnt_exist.nes'), helpers.romDest(), {
            dryrun: false,
            sortIntoFolders: false
          });
        }, `Error: File: ${helpers.romPath('doesnt_exist.nes')} not found`);
      });

      it('creates output directory if doesnt exist', function(){
        assert(!fs.existsSync(helpers.romPath('new_folder')));

        let rename = this.l.renameFile(helpers.romPath('1942.nes'), helpers.romDest('new_folder'), {
          dryrun: false,
          sortIntoFolders: false
        });

        assert(rename.destination === helpers.romDest('new_folder', '1942.nes'));
        assert(fs.existsSync(helpers.romDest('new_folder')));

        // Cleanup

        fs.renameSync(helpers.romDest('new_folder', '1942.nes'), helpers.romPath('1942.nes'));
        fs.rmdirSync(helpers.romDest('new_folder'));
      });

      it('renames misnamed rom', function(){
        let rename = this.l.renameFile(helpers.romPath('misnamed_file.nes'), helpers.romDest(), {
          dryrun: false,
          sortIntoFolders: false
        });

        assert(!fs.existsSync(helpers.romPath('misnamed_file.nes')));
        assert(!fs.existsSync(helpers.romDest('misnamed_file.nes')));
        assert(fs.existsSync(helpers.romDest('Abadox.nes')));

        // Cleanup

        fs.renameSync(helpers.romDest('Abadox.nes'), helpers.romPath('misnamed_file.nes'));
      });
    });
    describe('dryrun: true', function() {
      it('returns non-namespaced mock rename', function() {
        let rename = this.l.renameFile(helpers.romPath('1942.nes'), helpers.romDest(), {
          dryrun: true,
          sortIntoFolders: false
        });

        assert(rename.destination === helpers.romDest('1942.nes'));
        assert(!rename.destination.includes('NES'));
        assert(!fs.existsSync(helpers.romDest('1942.nes')));
      });

      it('returns namespaced mock rename', function() {
        let rename = this.l.renameFile(helpers.romPath('1942.nes'), helpers.romDest(), {
          dryrun: true,
          sortIntoFolders: true
        });

        assert(rename.destination === helpers.romDest('NES', '1942.nes'));
        assert(rename.destination.includes('NES'));
        assert(!fs.existsSync(helpers.romDest('1942.nes')));
        assert(!fs.existsSync(helpers.romDest('NES', '1942.nes')));
      });
    });
    describe('dryrun: false', function(){
      it('returns non-namespaced rename', function(){
        let rename = this.l.renameFile(helpers.romPath('1942.nes'), helpers.romDest(), {
          dryrun: false,
          sortIntoFolders: false
        });

        assert(rename.destination === helpers.romDest('1942.nes'));
        assert(!rename.destination.includes('NES'));
        assert(fs.existsSync(helpers.romDest('1942.nes')));

        // Cleanup

        fs.renameSync(helpers.romDest('1942.nes'), helpers.romPath('1942.nes'));
      });

      it('returns namespaced rename', function() {
        let rename = this.l.renameFile(helpers.romPath('1942.nes'), helpers.romDest(), {
          dryrun: false,
          sortIntoFolders: true
        });

        assert(rename.destination === helpers.romDest('NES', '1942.nes'));
        assert(rename.destination.includes('NES'));
        assert(!fs.existsSync(helpers.romDest('1942.nes')));
        assert(fs.existsSync(helpers.romDest('NES', '1942.nes')));

        // Cleanup

        fs.renameSync(helpers.romDest('NES', '1942.nes'), helpers.romPath('1942.nes'));
        fs.rmdirSync(helpers.romDest('NES'));
      });
    });
  });
});
