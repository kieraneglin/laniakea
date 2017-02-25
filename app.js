const fs = require('fs');

class Laniakea {
  constructor(outputDestination, sortIntoFolders = false) {
    // sortIntoFolders dictates whether the roms will end up in folders named after their system
    this.outputDestination = outputDestination;
    this.sortIntoFolders = sortIntoFolders
    this.validExtensions = this.getValidExtensions('dictionaries/consoles/extensions.json')
  }

  rename(sourceLocation){

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
}

l = new Laniakea('/Users/Kieran/Documents/Programming/rom-renamer/laniakea/test_roms/dest');
// console.log(l.romExtensions);
