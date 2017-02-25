# Laniakea ROM Renamer

The purpose of this project is to provide both a CLI and GUI for renaming and categorization of ROMs.  This is going to be the backbone for both.

## Usage

After including Laniakea like so:

```javascript
  const Laniakea = require('laniakea');
```
you can instantiate Laniakea while passing the desired output destination and a boolean dictating whether you want files to be namespaced into folders named after their console (default: false).

After instantiation, the only available method at this time is `renameFile`.  The only argument is the filepath to the ROM you want renamed.  The rename is written to console and the new location of the ROM is returned.

#### Example:

```javascript
l = new Laniakea(string: <ROM output path>, true);
l.renameFile(string: <ROM to be renamed>);

```
