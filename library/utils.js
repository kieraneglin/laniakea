const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const consoles = require('./../dictionaries/consoles.json');
const helpers = require('./helpers');

module.exports = {
  moveFile(args) {
    let konsole = helpers.getConsoleByExtension(args.sourceLocation);
    let game = helpers.getGameByFilepath(args.sourceLocation);
    let fileInfo = helpers.getFileInfo(args.sourceLocation);

    if(args.sortIntoFolders){
      newPath = path.join(
        args.outputDestination,
        konsole.folderName,
        `${game.title}.${fileInfo.extension}`
      );

    } else {
      newPath = path.join(
        args.outputDestination,
        `${game.title}.${fileInfo.extension}`
      );
    }

    if (!fs.existsSync(path.dirname(newPath))){
      fs.mkdirSync(path.dirname(newPath));
    }

    fs.renameSync(args.sourceLocation, newPath);

    return newPath;
  }
};
