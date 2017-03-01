const fs = require('fs');
const path = require('path');
const consoles = require('./../dictionaries/consoles.json');
const crypto = require('./crypto');

module.exports = {
  /**
   * Formats source file to expose it's filename and extension in a digestable format
   * @param {string} filepath - Where the file to be renamed is located.  Should be a fullpath.
   * @return {object} - An object containing the filename and extension
   */
  getFileInfo(filepath) {
    return {
      filename: path.basename(filepath).split('.').shift(),
      extension: filepath.split('.').pop()
    };
  },

  /**
   * Returns the dictionary represented by the filepath.
   * @param {string} filepath - Where the file to be renamed is located.  Should be a fullpath.
   * @return {object} - The appropriate dictionary information for the game that is represented by filepath.
   */
  getDictionaryByFile(filepath) {
    let konsole = this.getConsoleByExtension(filepath).dictionaryName;
    // Use __dirname so that relative filepaths work
    let dictPath = path.join(__dirname, '..', 'dictionaries', 'games', `${konsole}.json`);

    let dictionary = JSON.parse(fs.readFileSync(dictPath, 'utf8'));

    if (!dictionary) {
      throw new Error(`Could not find associated dictionary for given console.  Console: ${konsole}`);
    }

    return dictionary;
  },

  /**
   * Returns the game represented by the filepath from the associated dictionary.
   * @param {string} filepath - Where the file to be renamed is located.  Should be a fullpath.
   * @return {object} - The appropriate game information from the dictionary that is represented by filepath.
   */
  getGameByFilepath(filepath) {
    let hash = crypto.MD5Checksum(filepath);
    let dict = this.getDictionaryByFile(filepath);

    let game = dict.find((obj) => {
      return obj.checksums.md5 == hash;
    });

    if (!game) {
      throw new Error(`Could not find associated game for given file checksum.  Checksum: ${hash}`);
    }

    return game;
  },

  /**
   * Returns the appropriate console for a given file extension. Information is from the console dictionary
   * @param {string} filepath - Where the file to be renamed is located.  Should be a fullpath.
   * @return {object} - The appropriate consle information associated with a given filetype.
   */
  getConsoleByExtension(filepath) {
    let ext = filepath.split('.').pop().toLowerCase();
    // Consoles as defined above as a json require
    let konsole = consoles.find((obj) => {
      // return the first console to use the file extension form above
      return obj.extension.includes(ext);
    });

    if (!konsole) {
      throw new Error(`Could not find associated console for given file extension.  Extension: ${ext}`);
    }

    return konsole;
  },

  /**
   * IN PROGRESS: Returns a list of extensions that are valid for the consoles included.
   * To be used to filter what files will be filtered from a directory walk.
   * @return {array} - A list of extensions found in the console dictionary
   */
  getValidExtensions() {
    let validExtensions = [];

    // Consoles as defined above as a json require
    consoles.map((obj) => {
      // Concat to make sure it's one big array, instead of array of arrays
      validExtensions = validExtensions.concat(obj.extension);
    });

    return validExtensions;
  }
};
