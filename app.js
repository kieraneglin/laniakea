const fs = require('fs');
const path = require('path');
const crypto = require('crypto')

class Laniakea {
  constructor(outputDestination, sortIntoFolders = false) {
    // sortIntoFolders dictates whether the roms will end up in folders named after their system
    this.outputDestination = outputDestination;
    this.sortIntoFolders = sortIntoFolders
    this.validExtensions = this.getValidExtensions(path.join('dictionaries', 'consoles', 'extensions.json'))
  }

  renameFile(sourceLocation){
    let hash = this.getMD5Checksum(sourceLocation);
    console.log(hash);
  }

  // Private

  getValidExtensions(filepath){
    let extensionMap = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    let validExtensions = [];

    extensionMap.map((obj) => {
      // Concat to make sure it's one big array, instead of array of arrays
      validExtensions = validExtensions.concat(obj.extension)
    });

    return validExtensions
  }

  getMD5Checksum(filepath){
    const BUFFER_SIZE = 8192

    var fd = fs.openSync(filepath, 'r')
    var hash = crypto.createHash('md5')
    var buffer = new Buffer(BUFFER_SIZE)

    try {
      var bytesRead

      do {
        bytesRead = fs.readSync(fd, buffer, 0, BUFFER_SIZE)
        hash.update(buffer.slice(0, bytesRead))
      } while (bytesRead === BUFFER_SIZE)
    } finally {
      fs.closeSync(fd)
    }

  return hash.digest('hex')
  }
}
