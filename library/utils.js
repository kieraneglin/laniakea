const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');
const glob = require('glob');

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
    let dryrun = args.dryrun;

    if (args.sortIntoFolders) {
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

    if(!dryrun){
      try {
        if (!fs.existsSync(path.dirname(newPath))) {
          fs.mkdirSync(path.dirname(newPath));
        }
        fs.renameSync(args.sourceLocation, newPath);
      } catch (e) {
        throw new Error(`There was a generic error when moving the ROM.  Error: ${e}`);
      }
    }

    return newPath;
  },

  /**
   * Renames an individual file based on installed dictionaries
   * @param {string} sourceDirectory - The directory to be searched.  Should be a fullpath.
   * @param {boolean} recursive - Whether subdirectories should be searched
   * @return {array} - A list of all files that have extenstions specified in the console dictionary
   */
  listFiles(sourceDirectory, recursive = false) {
    let extensionList = helpers.getValidExtensions().join();
    let globPattern;

    if(recursive){
      globPattern = `${sourceDirectory}/**/*.{${extensionList}}`;
    } else {
      globPattern = `${sourceDirectory}/*.{${extensionList}}`;
    }

    return glob.sync(globPattern, { nocase: true });
  }
};
