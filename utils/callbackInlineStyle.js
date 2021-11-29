module.exports = (config, args) => {
  // window.inline_css__logger('STYLE_INLINE_CALLBACK', 'Hello form callback');
  document.querySelectorAll(`${config.HTMLExtractSelector} *`).forEach((element => {
    let elementCSSRules = [];

    for (let stylesheet of document.styleSheets) {
      // IF stylesheet do not have any selectors (eg. Google Fonts)
      // Browser will throw error
      // Exception: DOMException: Failed to read the 'rules' property from 'CSSStyleSheet': Cannot access rules at CSSStyleSheet.invokeGetter (<anonymous>:2:14)

      // TO-DO: try / catch for such error will be great!

      for (let cssRule of stylesheet.cssRules) {
        // If CSSStyleRule
        if (cssRule.type === 1 && element.matches(cssRule.selectorText)) {
          elementCSSRules.push(cssRule.cssText);
        }

        // If CSSMediaRule
        if (cssRule.type === 4) {
          if (window.matchMedia(cssRule.media.mediaText).matches) {
            for (let cssRuleMedia of cssRule.cssRules) {
              if (cssRuleMedia.type === 1 && element.matches(cssRuleMedia.selectorText)) {
                elementCSSRules.push(cssRuleMedia.cssText);
              }

              if (cssRuleMedia.type === 4) {
                console.log('There is mediaQuery rules within mediaQuery')
              }
            }
          }
        }
      }
    }

    // Cut the selectors from elementCSSRules
    elementCSSRules = elementCSSRules.map(rule => {
      let startPosition = rule.indexOf('{') + 2;
      let endPosition = rule.indexOf('}') - 1;

      return rule.substring(startPosition, endPosition);
    });
    elementCSSRules.push(element.getAttribute('style'));

    // Minify Style
    let styleObject =
      elementCSSRules
        .join('')
        .split(';')
        .map(rule => rule.trim().split(':'))
        .filter(rule => rule.length === 2)
        .reduce((styleObject, rule) => {
          let [ruleName, ruleValue] = rule;

          return styleObject[ruleName] && styleObject[ruleName].indexOf('!important') > -1 && ruleValue.indexOf('!important') === -1
            ? styleObject
            : { ...styleObject, [ruleName]: ruleValue.trim() };
        }, {});

    let styleString =
      Object.entries(styleObject)
        .map(i => i.join(':'))
        .join(';');

    if (styleString !== '') {
      element.setAttribute('style', styleString);
    }
  }));

  document.querySelectorAll(`${config.HTMLExtractSelector} *`).forEach((element => {
    element.removeAttribute('class');
  }));
}
