module.exports = (config, args, configPlugin) => {
  let nameModule = 'addMetaCharsetToBody';
  let elementMeta = document.createElement('meta');
  elementMeta.setAttribute('charset', configPlugin.charset);

  let elementBody = document.querySelector(config.HTMLExtractSelector);
  let elementBodyFirstChild = elementBody.firstChild;

  window.inline_css__logger(nameModule, 'Adding <meta> to body...');

  elementBody.insertBefore(
    elementMeta,
    elementBodyFirstChild,
  );
};
