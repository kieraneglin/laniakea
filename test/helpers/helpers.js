const path = require('path');

module.exports = {
  romPath: (...romName) => {
    // Returns a full filepath or the directory path if no argument is passed
    pathname = [__dirname, '..', 'roms', 'source'];
    return path.join.apply(null, pathname.concat(romName));
  },

  romDest: (...romName) => {
    // Returns a full filepath or the directory path if no argument is passed
    pathname = [__dirname, '..', 'roms', 'destination'];
    return path.join.apply(null, pathname.concat(romName));
  }
};
