const minimist = require('minimist');
const path = require('path');

// module.exports = () => {
  // Initialize
  global.directoryMain = path.dirname(process.mainModule.filename);
  global.filenameMain = (+ new Date());
  global.config = require('./config.json');
  global.logger = require('./utils/logger')();
  global.args = minimist(process.argv.slice(2));

  global.logger('STARTUP', 'Startup configuration done!');
  global.logger('STARTUP', `Arguments: ${JSON.stringify(global.args)}`);

  let cmd = global.args._[0] || 'help';

  if (global.args.generate || global.args.g) cmd = 'generate';
  if (global.args.version || global.args.v)  cmd = 'version';
  if (global.args.help || global.args.h)     cmd = 'help';

  // Generate condition
  if (global.args.generate || global.args.g) {
    if (!global.args.width && !global.args.w)                                                       { cmd = 'help'; global.args._[1] = 'generate'; }
    if (global.args.width && global.args.width < global.config.valueMinimumWidth)                   { cmd = 'help'; global.args._[1] = 'generate'; }
    if (global.args.w && global.args.w < global.config.valueMinimumWidth)                           { cmd = 'help'; global.args._[1] = 'generate'; }
    if (!global.args.url && !global.args.u)                                                         { cmd = 'help'; global.args._[1] = 'generate'; }
    if (global.args.url && (global.args.url === true || global.args.url.indexOf('file:///') === 0)) { cmd = 'help'; global.args._[1] = 'generate'; }
    if (global.args.u && (global.args.u === true || global.args.u.indexOf('file:///') === 0))       { cmd = 'help'; global.args._[1] = 'generate'; }
  }

  global.logger('STARTUP', `Invoking module '${cmd}'...`);

  switch (cmd) {
    case 'generate':
      require('./cmds/generate')();
      break;
    case 'version':
      require('./cmds/version')();
      break;
    case 'help':
      require('./cmds/help')();
      break;
    default:
      global.logger('STARTUP', `"${cmd}" is not a valid module!`);
      process.exit(1);
      break;
  }
// };