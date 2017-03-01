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
  }

  /**
   * Renames an individual file based on installed dictionaries
   * @param {string} sourceLocation - Where the file to be renamed is located.  Should be a fullpath.
   * @param {boolean} dryrun - Will output the resultant paths of a rename operation without moving the file
   * @return {boolean} - Whether the rename was successful
   */
  renameFile(sourceLocation, dryrun = false) {
    if (!fs.existsSync(sourceLocation)){
      throw new Error(`File: ${sourceLocation} not found`);
    }
    let result = utils.moveFile({
      sourceLocation: sourceLocation,
      sortIntoFolders: this.sortIntoFolders,
      outputDestination: this.outputDestination,
      dryrun: dryrun
    });

    console.log(`${sourceLocation} -> ${result}`);
    return { source: sourceLocation, destination: result };
  }

  /**
   * Renames an individual file based on installed dictionaries
   * @param {string} sourceDirectory - Where the directory with files to be renamed is located.  Should be a fullpath.
   * @param {object} options - A configuration object
   * @param {boolean} options.recursive - Whether to recursively search directories
   * @param {boolean} options.dryrun - Whether to preform a dryrun without moving files
   * @return {boolean} - Whether the rename was successful
   */
  renameDirectory(sourceDirectory, options) {
    let defaults = { recursive: false, dryrun: false };
    let opts = Object.assign(defaults, options);

    let fileList = utils.listFiles(sourceDirectory, opts.recursive);
    let destinationList = [];

    fileList.forEach((file) => {
      try {
        let fileDest = this.renameFile(file, opts.dryrun);
        destinationList.push(fileDest);
      } catch(e) {
        throw new Error(`There was an error in moving file '${file}'.  Error: ${e}`);
      }
    });

    return destinationList;
  }
};
