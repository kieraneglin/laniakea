const helpers = require('./library/helpers');
const utils = require('./library/utils');
const fs = require('fs');

module.exports = class Laniakea {
  constructor(outputDestination, sortIntoFolders = false) {
    // sortIntoFolders dictates whether the roms will end up in folders named after their system
    this.outputDestination = outputDestination;
    this.sortIntoFolders = sortIntoFolders;
    this.validExtensions = helpers.getValidExtensions();
  }

  renameFile(sourceLocation) {
    if (!fs.existsSync(sourceLocation)){
      console.log(`File: ${sourceLocation} not found`);
      return false;
    }

    let result = utils.moveFile({
      sourceLocation: sourceLocation,
      sortIntoFolders: this.sortIntoFolders,
      outputDestination: this.outputDestination
    });

    console.log(`${sourceLocation} -> ${result}`);
    return true;
  }
};
