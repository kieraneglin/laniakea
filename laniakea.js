const helpers = require('./library/helpers');
const utils = require('./library/utils');
const fs = require('fs');

module.exports = class Laniakea {

  /**
   * @constructor
   * @param {boolean} consoleOutput - Dictates if script writes to console.
   */
  constructor(consoleOutput = true) {
    this.consoleOutput = consoleOutput;
  }

  /**
   * Renames an individual file based on installed dictionaries
   * @param {string} sourceLocation - Where the file to be renamed is located.  Should be a fullpath.
   * @param {string} outputDirectory - Where you want the renamed files to be saved. Should be a fullpath.
   * @param {object} options - A configuration object
   * @param {boolean} options.sortIntoFolders - Whether to namespace into folders named after the console
   * @param {boolean} options.dryrun - Whether to preform a dryrun without moving files
   * @return {object} - An object containing the source and destination strings
   */
  renameFile(sourceLocation, outputDirectory, options) {
    let defaults = {
      dryrun: false,
      sortIntoFolders: false
    };
    let opts = Object.assign(defaults, options);
    let result;

    if (!fs.existsSync(sourceLocation)) {
      throw new Error(`File: ${sourceLocation} not found`);
    }
    if (!fs.existsSync(outputDirectory)) {
      fs.mkdirSync(outputDirectory);
    }

    result = utils.moveFile({
      sourceLocation: sourceLocation,
      sortIntoFolders: opts.sortIntoFolders,
      outputDestination: outputDirectory,
      dryrun: opts.dryrun
    });

    if(this.consoleOutput){
      console.log(`${sourceLocation} -> ${result}`);
    }

    return {
      source: sourceLocation,
      destination: result
    };
  }

  /**
   * Renames an individual file based on installed dictionaries
   * @param {string} sourceDirectory - Where the directory with files to be renamed is located.  Should be a fullpath.
   * @param {string} outputDirectory - Where you want the renamed files to be saved. Should be a fullpath.
   * @param {object} options - A configuration object
   * @param {boolean} options.sortIntoFolders - Whether to namespace into folders named after the console
   * @param {boolean} options.recursive - Whether to recursively search directories
   * @param {boolean} options.dryrun - Whether to preform a dryrun without moving files
   * @return {array} - An array containing a list of source and dest ojects as well as any errors
   */
  renameDirectory(sourceDirectory, outputDirectory, options) {
    let defaults = {
      recursive: false,
      dryrun: false,
      sortIntoFolders: false
    };
    let opts = Object.assign(defaults, options);
    let destinationList = [];
    let errorList = [];
    let fileList;

    if (!fs.existsSync(sourceDirectory)) {
      throw new Error(`Directory: ${sourceDirectory} not found`);
    }
    if (!fs.existsSync(outputDirectory)) {
      fs.mkdirSync(outputDirectory);
    }

    fileList = utils.listFiles(sourceDirectory, opts.recursive);

    fileList.forEach((file) => {
      try {
        let fileDest = this.renameFile(file, outputDirectory, {
          dryrun: opts.dryrun,
          sortIntoFolders: opts.sortIntoFolders
        });

        destinationList.push(fileDest);
      } catch (e) {
        errorList.push({
          file: file,
          message: e.message
        });

        if(this.consoleOutput){
          console.log(`Error processing ${file}: ${e.message}`);
          console.log(e);
        }
      }
    });

    return {
      files: destinationList,
      errors: errorList
    };
  }
};
