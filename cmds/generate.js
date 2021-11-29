const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const callbackInlineStyle = require('../utils/callbackInlineStyle');
const callbackExtractHTML = require('../utils/callbackExtractHTML');
const minifyHTML = require('../utils/minifyHTML');

module.exports = () => {
  (async () => {
    let browser;
    let page;
    let HTMLString;

    try {
      global.logger('BROWSER', 'Opening browser...');
      global.logger('BROWSER', `Configuration object: ${JSON.stringify(global.config.configObjectBrowser)}`);
      browser = await puppeteer.launch(global.config.configObjectBrowser);

      global.logger('BROWSER', 'Configuring browser...');
      page = await browser.newPage();
      await page.setViewport({
        width: global.args.width,
        height: 768,
      });

      global.logger('BROWSER', 'Exposing "logger" function to page...');
      await page.exposeFunction('inline_css__logger', global.logger);

      global.logger('BROWSER', `Loading page ${global.args.url}...`);
      global.logger('BROWSER', `Configuration object: ${JSON.stringify(global.config.configObjectPage)}`);
      await page.goto(global.args.url, global.config.configObjectPage);

      try {
        global.logger('PLUGINS_BEFORE', `Reading BEFORE plugins directory...`);
        let pluginsDirectoryBefore = path.resolve(global.directoryMain, global.config.pluginsDirectoryBefore);
        let pluginsDirectoryBeforeElements = fs.readdirSync(pluginsDirectoryBefore);
        
        for (let i = 0; i < pluginsDirectoryBeforeElements.length; i++) {
          try {
            let pluginDirectory = path.resolve(pluginsDirectoryBefore, pluginsDirectoryBeforeElements[i]);
            let pluginFilepathConfig = path.resolve(pluginDirectory, global.config.pluginsFilenameConfig);
            let pluginFilepathCallback = pluginDirectory;
            let pluginConfigObject = null;
            let pluginCallback = () => {};

            if (fs.existsSync(pluginFilepathConfig)) {
              global.logger('PLUGINS_BEFORE', `${pluginsDirectoryBeforeElements[i]} | Trying to load plugin configuration...`);
              global.logger('PLUGINS_BEFORE', `${pluginsDirectoryBeforeElements[i]} | ${pluginFilepathConfig}`);
              pluginConfigObject = require(`${pluginFilepathConfig}`);
            }

            global.logger('PLUGINS_BEFORE', `${pluginsDirectoryBeforeElements[i]} | Trying to load plugin...`);
            global.logger('PLUGINS_BEFORE', `${pluginsDirectoryBeforeElements[i]} | ${pluginDirectory}`);
            pluginCallback = require(`${pluginFilepathCallback}`);

            global.logger('PLUGINS_BEFORE', `${pluginsDirectoryBeforeElements[i]} | Applying plugin to page...`);
            global.logger('PLUGINS_BEFORE', `${pluginsDirectoryBeforeElements[i]} | Configuration object: ${JSON.stringify(pluginConfigObject)}`);
            await page.evaluate(
              pluginCallback,
              global.config,
              global.args,
              pluginConfigObject,
            );
          } catch (errorPluginsBeforeOne) {
            global.logger('ERROR_CATCH_PLUGINS_BEFORE_ONE', `Error: ${errorPluginsBeforeOne.name} | ${errorPluginsBeforeOne.message}`);
          }
        }
      } catch (errorPluginsBefore) {
        global.logger('ERROR_CATCH_PLUGINS_BEFORE', `Error: ${errorPluginsBefore.name} | ${errorPluginsBefore.message}`);
        global.logger('ERROR_CATCH_PLUGINS_BEFORE', `Proceeding without BEFORE plugins!`);
      }

      global.logger('STYLE_INLINE', `Inlining styles...`);
      await page.evaluate(
        callbackInlineStyle,
        global.config,
        global.args,
      );

      try {
        global.logger('PLUGINS_AFTER', `Reading AFTER plugins directory...`);
        let pluginsDirectoryAfter = path.resolve(global.directoryMain, global.config.pluginsDirectoryAfter);
        let pluginsDirectoryAfterElements = fs.readdirSync(pluginsDirectoryAfter);
        
        for (let i = 0; i < pluginsDirectoryAfterElements.length; i++) {
          try {
            let pluginDirectory = path.resolve(pluginsDirectoryAfter, pluginsDirectoryAfterElements[i]);
            let pluginFilepathConfig = path.resolve(pluginDirectory, global.config.pluginsFilenameConfig);
            let pluginFilepathCallback = pluginDirectory;
            let pluginConfigObject = null;
            let pluginCallback = () => {};

            if (fs.existsSync(pluginFilepathConfig)) {
              global.logger('PLUGINS_AFTER', `${pluginsDirectoryAfterElements[i]} | Trying to load plugin configuration...`);
              global.logger('PLUGINS_AFTER', `${pluginsDirectoryAfterElements[i]} | ${pluginFilepathConfig}`);
              pluginConfigObject = require(`${pluginFilepathConfig}`);
            }

            global.logger('PLUGINS_AFTER', `${pluginsDirectoryAfterElements[i]} | Trying to load plugin...`);
            global.logger('PLUGINS_AFTER', `${pluginsDirectoryAfterElements[i]} | ${pluginDirectory}`);
            pluginCallback = require(`${pluginFilepathCallback}`);

            global.logger('PLUGINS_AFTER', `${pluginsDirectoryAfterElements[i]} | Applying plugin to page...`);
            global.logger('PLUGINS_AFTER', `${pluginsDirectoryAfterElements[i]} | ${JSON.stringify(pluginConfigObject)}`);
            await page.evaluate(
              pluginCallback,
              global.config,
              global.args,
              pluginConfigObject,
            );
          } catch (errorPluginsBeforeOne) {
            global.logger('ERROR_CATCH_PLUGINS_AFTER_ONE', `Error: ${errorPluginsBeforeOne.name} | ${errorPluginsBeforeOne.message}`);
          }
        }
      } catch (errorPluginsBefore) {
        global.logger('ERROR_CATCH_PLUGINS_AFTER', `Error: ${errorPluginsBefore.name} | ${errorPluginsBefore.message}`);
        global.logger('ERROR_CATCH_PLUGINS_AFTER', `Proceeding without AFTER plugins!`);
      }

      global.logger('HTML_EXTRACT', `Extracting HTML...`);
      HTMLString = await page.evaluate(
        callbackExtractHTML,
        global.config,
        global.args,
      );

      if (global.config.HTMLMinify) {
        global.logger('HTML_MINIFING', `Minifing HTML...`);
        HTMLString = minifyHTML(HTMLString);
      }

      if (global.config.HTMLSaveToFile) {
        let HTMLDirectoryOutput = path.resolve(global.directoryMain, global.config.HTMLSaveDirectory);
        let HTMLFilepath = path.resolve(HTMLDirectoryOutput, `${global.filenameMain}.html`);

        if (fs.existsSync(HTMLDirectoryOutput) === false) {
          global.logger('HTML_SAVE_TO_FILE', `Trying to create output folder (${HTMLDirectoryOutput})...`);
          fs.mkdirSync(HTMLDirectoryOutput);
        }

        global.logger('HTML_SAVE_TO_FILE', `Saving HTML to file (${HTMLFilepath})...`);
        fs.writeFileSync(
          HTMLFilepath,
          HTMLString,
        );
      } else {
        global.logger('HTML_SAVE_TO_TERMINAL', 'Throwing HTML to output...');
        console.log(HTMLString);
      }

      global.logger('BROWSER', 'Closing browser...');
      await browser.close();

    } catch (err) {
      global.logger('ERROR_CATCH_GLOBAL', `Error: ${err.name} | ${err.message}`);
      global.logger('ERROR_CATCH_GLOBAL', 'Cannot continue. Exiting...');
      process.exit(1);
    }
  })();
}
