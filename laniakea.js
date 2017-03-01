const helpers = require('./library/helpers');
const utils = require('./library/utils');
const fs = require('fs');

module.exports = class Laniakea {
  /**
   * Creates an instance of Laniakea Renamer
   * @constructor
   * @param {string} outputDestination - Where you want the renamed files to be saved.
   */
  constructor(outputDestination) {
    this.outputDestination = outputDestination;
  }

  /**
   * Renames an individual file based on installed dictionaries
   * @param {string} sourceLocation - Where the file to be renamed is located.  Should be a fullpath.
   * @param {object} options - A configuration object
   * @param {boolean} options.sortIntoFolders - Whether to namespace into folders named after the console
   * @param {boolean} options.dryrun - Whether to preform a dryrun without moving files
   * @return {object} - An object containing the source and destination strings
   */
  renameFile(sourceLocation, options) {
    let defaults = {
      dryrun: false,
      sortIntoFolders: false
    };
    let opts = Object.assign(defaults, options);

    if (!fs.existsSync(sourceLocation)) {
      throw new Error(`File: ${sourceLocation} not found`);
    }
    let result = utils.moveFile({
      sourceLocation: sourceLocation,
      sortIntoFolders: opts.sortIntoFolders,
      outputDestination: this.outputDestination,
      dryrun: opts.dryrun
    });

    console.log(`${sourceLocation} -> ${result}`);
    return {
      source: sourceLocation,
      destination: result
    };
  }

  /**
   * Renames an individual file based on installed dictionaries
   * @param {string} sourceDirectory - Where the directory with files to be renamed is located.  Should be a fullpath.
   * @param {object} options - A configuration object
   * @param {boolean} options.sortIntoFolders - Whether to namespace into folders named after the console
   * @param {boolean} options.recursive - Whether to recursively search directories
   * @param {boolean} options.dryrun - Whether to preform a dryrun without moving files
   * @return {array} - An array containing a list of source and dest ojects as well as any errors
   */
  renameDirectory(sourceDirectory, options) {
    if (!fs.existsSync(sourceDirectory)) {
      throw new Error(`Directory: ${sourceDirectory} not found`);
    }

    let defaults = {
      recursive: false,
      dryrun: false,
      sortIntoFolders: false
    };
    let opts = Object.assign(defaults, options);

    let fileList = utils.listFiles(sourceDirectory, opts.recursive);
    let destinationList = [];
    let errorList = [];

    fileList.forEach((file) => {
      try {
        let fileDest = this.renameFile(file, {
          dryrun: opts.dryrun,
          sortIntoFolders: opts.sortIntoFolders
        });

        destinationList.push(fileDest);
      } catch (e) {
        errorList.push({
          file: file,
          message: e.message
        });
        console.log(`Error processing ${file}: ${e.message}`);
      }
    });

    return {
      files: destinationList,
      errors: errorList
    };
  }
};
