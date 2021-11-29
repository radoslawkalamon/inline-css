module.exports = (config, args, configPlugin) => {
  let nameModule = 'chooseResponsiveImagesResolution';
  let counter = 0;

  if (typeof args.images !== 'string' && configPlugin.arguments.includes(args.images) === false) return;

  window.inline_css__logger(nameModule, `Argument "images" found and validated! Proceeding...`);

  document
    .querySelectorAll(`${config.HTMLExtractSelector} img[src^="${configPlugin.main}"]`)
    .forEach(element => {
      let elementSrc = element.getAttribute('src');
      let elementURLArrayWithoutFilename = elementSrc
        .split('/')
        .filter((item, index, arr) => index + 1 !== arr.length)
        .join('/');
      let showImage = `${elementURLArrayWithoutFilename}/` === `${configPlugin.main}${configPlugin[args.images]}`;

      element.style.setProperty(
        'display',
        showImage ? 'block' : 'none',
        'important'
      );

      counter = counter + 1;
    });

  window.inline_css__logger(nameModule, `Display style prop changed on ${counter} images!`);
};
