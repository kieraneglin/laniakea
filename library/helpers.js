const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const consoles = require('./../dictionaries/consoles.json');

module.exports = {
  getGameByFilepath(filepath) {
    let hash = this.getMD5Checksum(filepath);
    let dict = this.getDictionaryByFile(filepath);

    return dict.find((obj) => {
      return obj.checksums.md5 == hash;
    });
  },

  getValidExtensions() {
    let validExtensions = [];

    // Consoles as defined above as a json require
    consoles.map((obj) => {
      // Concat to make sure it's one big array, instead of array of arrays
      validExtensions = validExtensions.concat(obj.extension);
    });

    return validExtensions;
  },

  getConsoleByExtension(filepath){
    let ext = filepath.split('.').pop();
    // Consoles as defined above as a json require
    return consoles.find((obj) => {
      // return the first console to use the file extension form above
      return obj.extension.includes(ext);
    });
  },

  getFileInfo(filepath) {
    return {
      filename: path.basename(filepath).split('.').shift(),
      extension: filepath.split('.').pop()
    };
  },

  getDictionaryByFile(filepath) {
    let konsole = this.getConsoleByExtension(filepath).dictionaryName;
    let dictPath = path.join('dictionaries', 'games', `${konsole}.json`);

    return JSON.parse(fs.readFileSync(dictPath, 'utf8'));
  },

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
