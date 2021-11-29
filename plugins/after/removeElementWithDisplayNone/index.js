module.exports = (config, args, configPlugin) => {
  let nameModule = 'removeElementWithDisplayNone';
  let counter = 0;

  if (args[configPlugin.argument] === true) {
    window.inline_css__logger(nameModule, `Argument ${configPlugin.argument} found! Removing elements...`);

    document
      .querySelectorAll(`${config.HTMLExtractSelector} *`)
      .forEach(element => {
        let elementDisplay = window.getComputedStyle(element).display;
        if (elementDisplay === 'none') {
          element.remove();
          counter = counter + 1;
        }
    });

    window.inline_css__logger(nameModule, `Removed ${counter} elements!`);
  }
};
