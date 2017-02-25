const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');

module.exports = {
  /**
   * Properly renames file and moves it to desired destination
   * @param {object} args
   * @param {string} args.sourceLocation - The location of the file to be moved
   * @param {boolean} args.sortIntoFolders - Whether you want sorted files namespaced into folders
   * @param {string} args.outputDestination - The directory where the saved file should go
   * @return {string} - The path that the ROM was moved to
   */
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

    try{
      if (!fs.existsSync(path.dirname(newPath))){
        fs.mkdirSync(path.dirname(newPath));
      }
      fs.renameSync(args.sourceLocation, newPath);
    } catch(e) {
      throw new Error(`There was a generic error when moving the ROM.  Error: ${e}`);
    }

    return newPath;
  }
};
