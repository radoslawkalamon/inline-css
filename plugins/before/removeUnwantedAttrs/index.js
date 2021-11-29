module.exports = (config, args, configPlugin) => {
  let nameModule = 'removeUnwantedAttrs';
  configPlugin.attrsToDelete.forEach(attr => {
    let elementsList = document.querySelectorAll(`${config.HTMLExtractSelector} [${attr}]`);
    window.inline_css__logger(nameModule, `Found ${elementsList.length} elements with attribute "${attr}"`);

    window.inline_css__logger(nameModule, `Removing...`);
    elementsList.forEach(element => {
      element.removeAttribute(attr);
    });
  });
};
