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
    let newPath;

    if(this.sortIntoFolders){
      newPath = path.join(this.outputDestination, konsole.folderName, `${game.title}.${fileInfo.extension}`);
    } else {
      newPath = path.join(this.outputDestination, `${game.title}.${fileInfo.extension}`);
    }

    if (!fs.existsSync(path.dirname(newPath))){
      fs.mkdirSync(path.dirname(newPath));
    }

    fs.rename(sourceLocation, newPath, function (err) {
      if (err) throw err;
      console.log('Successfully renamed - AKA moved!');
    });
  }
};
