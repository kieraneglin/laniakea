const helpers = require('./library/helpers');
const path = require('path');
const fs = require('fs');

module.exports = class Laniakea {
  constructor(outputDestination, sortIntoFolders = false) {
    // sortIntoFolders dictates whether the roms will end up in folders named after their system
    this.outputDestination = outputDestination;
    this.sortIntoFolders = sortIntoFolders;
    this.validExtensions = helpers.getValidExtensions();
  }

  renameFile(sourceLocation) {
    let konsole = helpers.getConsoleByExtension(sourceLocation);
    let game = helpers.getGameByFilepath(sourceLocation);
    let fileInfo = helpers.getFileInfo(sourceLocation);

    let result = helpers.moveFile({
      folderName: konsole.folderName,
      game: game,
      fileInfo: fileInfo,
      sourceLocation: sourceLocation,
      sortIntoFolders: this.sortIntoFolders,
      outputDestination: this.outputDestination
    });

    console.log(`${sourceLocation} -> ${result}`);
  }
};
