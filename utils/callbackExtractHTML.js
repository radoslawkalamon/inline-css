module.exports = (config, args) => {
  return document.querySelector(`${config.HTMLExtractSelector}`).innerHTML;
};
