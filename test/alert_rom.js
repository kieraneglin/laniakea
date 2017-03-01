const glob = require('glob');

if(glob.sync('**/*.nes', { cwd: __dirname, nocase: true }).length === 0){
  console.log("\x1b[30m\x1b[47m", "Test ROMs not found!  If you're running this from github, " +
    "you'll need to put your own ROMs in place and update tests accordingly.");
  console.log("For copyright reasons, I cannot check ROMs into source control. " +
    "Please only use ROMs you own and have converted yourself.");
  // To reset the colours
  console.log("\x1b[0m");

  throw new Error();
}
