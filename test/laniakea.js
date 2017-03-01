const Laniakea = require('./../laniakea.js');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const romPath = (romName = '') => {
  // Returns a full filepath or the directory path if no argument is passed
  return path.join(__dirname, 'roms', 'source', romName);
};
const romDest = (romName = '') => {
  // Returns a full filepath or the directory path if no argument is passed
  return path.join(__dirname, 'roms', 'destination', romName);
};

if(glob.sync(`**/*.nes`, { cwd: __dirname, nocase: true }).length === 0){

  console.log("Test ROMs not found!  If you're running this from github, " +
    "you'll need to put your own ROMs in place and update tests accordingly.");

  console.log("For copyright reasons, I cannot check ROMs into source control. " +
    "Please only use ROMs you own and have converted yourself.");

  return false;
}

describe('Laniakea', () => {
  beforeEach(() => {
    this.l = new Laniakea();
  });

  describe('renameFile', () => {
    describe('dryrun: true', () => {
      it('returns non-namespaced mock rename', () => {
        this.l.renameFile();
      });
    });
  });
});
