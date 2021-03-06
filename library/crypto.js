const fs = require('fs');
const crypto = require('crypto');

module.exports = {

  /**
   * Returns an MD5Checksum of a given file
   * @param {string} filepath - Where the file to be renamed is located.  Should be a fullpath.
   * @return {string} - The checksum of the given file
   */
  MD5Checksum(filepath) {
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
