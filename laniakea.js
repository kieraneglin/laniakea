const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const consoles = require('./dictionaries/consoles.json');

module.exports = class Laniakea {
  constructor(outputDestination, sortIntoFolders = false) {
    // sortIntoFolders dictates whether the roms will end up in folders named after their system
    this.outputDestination = outputDestination;
    this.sortIntoFolders = sortIntoFolders;
    this.validExtensions = this.getValidExtensions();
  }

  renameFile(sourceLocation) {
    let dict = this.getDictionaryByFile(sourceLocation);
    let hash = this.getMD5Checksum(sourceLocation);
    let game = this.getGameByHash(hash, dict);
    // console.log(hash);
    console.log(game);
  }

  // Private

  getValidExtensions() {
    let validExtensions = [];

    // Consoles as defined above as a json require
    consoles.map((obj) => {
      // Concat to make sure it's one big array, instead of array of arrays
      validExtensions = validExtensions.concat(obj.extension);
    });

    return validExtensions;
  }

  getGameByHash(hash, dict) {
    return dict.find((obj) => {
      return obj.checksums.md5 == hash;
    });
  }

  getDictionaryByFile(filepath) {
    let ext = filepath.split('.').pop();
    let dictPath;
    // Consoles as defined above as a json require
    let konsole = consoles.find((obj) => {
      // return the first console to use the file extension form above
      return obj.extension.includes(ext);
    });
    
    dictPath = path.join('dictionaries', 'games', `${konsole.dictionaryName}.json`);

    return JSON.parse(fs.readFileSync(dictPath, 'utf8'));
  }

  getMD5Checksum(filepath) {
    const BUFFER_SIZE = 8192;

    var fd = fs.openSync(filepath, 'r');
    var hash = crypto.createHash('md5');
    var buffer = new Buffer(BUFFER_SIZE);

    try {
      var bytesRead;

      do {
        bytesRead = fs.readSync(fd, buffer, 0, BUFFER_SIZE);
        hash.update(buffer.slice(0, bytesRead));
      } while (bytesRead === BUFFER_SIZE);
    } finally {
      fs.closeSync(fd);
    }

    return hash.digest('hex');
  }
};
