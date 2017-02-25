const fs = require('fs');

class Laniakea {
  constructor(outputDestination, sortIntoFolders = false) {
    // sortIntoFolders dictates whether the roms will end up in folders named after their system
    this.outputDestination = outputDestination;
    this.sortIntoFolders = sortIntoFolders

    let extensionMap = JSON.parse(fs.readFileSync('dictionaries/consoles/extensions.json', 'utf8'));
    this.validExtensions = []

    extensionMap.map((obj) => {
      this.validExtensions = this.validExtensions.concat(obj.extension)
    });

    console.log(this.validExtensions);
  }

  rename(sourceLocation){

  }

  getValidExtensions(filepath){
    
  }
}

l = new Laniakea('/Users/Kieran/Documents/Programming/rom-renamer/laniakea/test_roms/dest');
// console.log(l.romExtensions);
