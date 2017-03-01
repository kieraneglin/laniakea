const helpers = require('./library/helpers');
const utils = require('./library/utils');
const fs = require('fs');

module.exports = class Laniakea {
  /**
   * Creates an instance of Laniakea Renamer
   * @constructor
   * @param {string} outputDestination - Where you want the renamed files to be saved.
   * @param {boolean} sortIntoFolders - Dictates if you want sorted files namespaced into folders
   */
  constructor(outputDestination, sortIntoFolders = false) {
    this.outputDestination = outputDestination;
    this.sortIntoFolders = sortIntoFolders;
    this.validExtensions = helpers.getValidExtensions();
  }

  /**
   * Renames an individual file based on installed dictionaries
   * @param {string} sourceLocation - Where the file to be renamed is located.  Should be a fullpath.
   * @return {boolean} - Whether the rename was successful
   */
  renameFile(sourceLocation) {
    if (!fs.existsSync(sourceLocation)){
      throw new Error(`File: ${sourceLocation} not found`);
    }

    let result = utils.moveFile({
      sourceLocation: sourceLocation,
      sortIntoFolders: this.sortIntoFolders,
      outputDestination: this.outputDestination
    });

    console.log(`${sourceLocation} -> ${result}`);
    return true;
  }

  renameDirectory(sourceDirectory) {
    let fileList = utils.listFiles(sourceDirectory);

    fileList.forEach((file) => {
      try {
        this.renameFile(file);
      } catch(e) {
        throw new Error(`There was an error in moving file '${file}'.  Error: ${e}`);
      }
    });
  }
};
