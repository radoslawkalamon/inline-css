const menus = {
  default: `
  inline-css [command] <options>

  generate ................ show weather for today
  version ................. show package version
  help .................... show help menu for a command
  `,
  generate: `
  inline-css generate <options>

  --url, -u ................ page address to visit
                             local files need to be opened on localhost dev server! more info:
                             https://stackoverflow.com/questions/48753691/cannot-access-cssrules-from-local-css-file-in-chrome-64/49160760#49160760
  --width, -w .............. window width [bigger than or equal to ${global.config.windowWidthMinumum}]
  `,
};

module.exports = () => {
  console.log(menus[global.args._[1]] || menus.default);
}
