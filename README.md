# THIS PROJECT IS A WORK IN PROGRESS

The only console with a dictionary is currently the NES.  More will be added once 1.0.0 of this project, the CLI, and the GUI are released.

# Laniakea ROM Renamer

The purpose of this project is to provide both a CLI and GUI for renaming and categorization of ROMs.  This is going to be the backbone for both.

## Usage

After installing and including Laniakea like so:

```
npm install laniakea
```

```javascript
  const Laniakea = require('laniakea');
```

Upon instantiation, you can supply a boolean to dictate whether there is console output after a successful file transfer or dryrun. After instantiation, the available methods are `renameFile` and `renameDirectory`.  The only argument is the filepath to the ROM you want renamed.  The rename is written to console and the new location of the ROM is returned.

#### Example:

```javascript
l = new Laniakea(object.consoleOutput: <Display console output | optional>);
l.renameFile(string: <ROM to be renamed>, string: <output directory>, object: <options | optional>);
l.renameDirectory(string: <Dir to be sorted>, string: <output directory>, object: <options | optional>);

```
___

Real world example:

```javascript
l = new Laniakea({ consoleOutput: true});
l.renameFile('User/Downloads/unnamed.nes', 'User/Games/', {
  dryrun: false,
  sortIntoFolders: true
});
l.renameDirectory('User/Downloads/ROMs/', 'User/Games/', {
  recursive: false,
  dryrun: false,
  sortIntoFolders: false
});

```

## Options

#### renameFile

Below is a list of options for the `renameFile()` command.  The keys are the option name and the values are the defaults.

```javascript
  {
    dryrun: false, // If true, it will return a mock run without moving any files
    sortIntoFolders: false // If true, files will be namespaced into folders named after the console
  }
```

#### renameDirectory

Below is a list of options for the `renameDirectory()` command.  The keys are the option name and the values are the defaults.

```javascript
  {
    recursive: false, // If true, will recurse into subdirectories to find appropriate files
    dryrun: false, // If true, it will return a mock run without moving any files
    sortIntoFolders: false // If true, files will be namespaced into folders named after the console
  }
```

## License

While this package is under MIT licensing,  I want it to be explicitly clear that I don't care what you do with this software.  

Seriously.  Take it, use it commercially, modify it, leave it as is, credit me, don't credit me, etc.  If you find it useful, do whatever you want with it!
