const fs = require('fs');
const path = require('path');

module.exports = () => {
  const logsFilename = `${global.filenameMain}.log`;
  const logsFilepath = path.resolve(global.directoryMain, global.config.logsDirectory, logsFilename);
  const logsFilestream = fs.openSync(logsFilepath, 'a');

  return function(nameModule, text) {
    let stringDate = (new Date).toUTCString();

    fs.appendFileSync(
      logsFilestream,
      `${stringDate} | ${nameModule} | ${text}\n`,
    );
  };
};
