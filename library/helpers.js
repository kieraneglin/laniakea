const fs = require('fs');
const path = require('path');
const consoles = require('./../dictionaries/consoles.json');
const crypto = require('./crypto');

module.exports = {
  getFileInfo(filepath) {
    return {
      filename: path.basename(filepath).split('.').shift(),
      extension: filepath.split('.').pop()
    };
  },

  getGameByFilepath(filepath) {
    let hash = crypto.MD5Checksum(filepath);
    let dict = this.getDictionaryByFile(filepath);

    return dict.find((obj) => {
      return obj.checksums.md5 == hash;
    });
  },

  getConsoleByExtension(filepath){
    let ext = filepath.split('.').pop();
    // Consoles as defined above as a json require
    return consoles.find((obj) => {
      // return the first console to use the file extension form above
      return obj.extension.includes(ext);
    });
  },

  getDictionaryByFile(filepath) {
    let konsole = this.getConsoleByExtension(filepath).dictionaryName;
    let dictPath = path.join('dictionaries', 'games', `${konsole}.json`);

    return JSON.parse(fs.readFileSync(dictPath, 'utf8'));
  },

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
