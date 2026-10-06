(function () {
  'use strict';

  var values = {
    OPERATOR_LEGAL_NAME: 'Индивидуальный предприниматель Руппель Роман Денисович',
    OPERATOR_SHORT_NAME: 'ИП Руппель Роман Денисович',
    OPERATOR_INN: '701410041474',
    OPERATOR_OGRNIP: '326180000077935',
    OPERATOR_ADDRESS: 'Удмуртская Республика, Можгинский район, станция Люга',
    PRIVACY_EMAIL: 'wowax9@yandex.ru',
    SUPPORT_CONTACT: 'wowax9@yandex.ru',
    SERVICE_DOMAIN: 'пригласимих.рф',
    LEGAL_EFFECTIVE_DATE: '28 августа 2026 года'
  };

  function replaceTokens(value) {
    return Object.keys(values).reduce(function (result, key) {
      return result.split('{{' + key + '}}').join(values[key]);
    }, value);
  }

  function applyLegalDetails() {
    var walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      var next = replaceTokens(node.nodeValue || '');
      if (next !== node.nodeValue) node.nodeValue = next;
    });
    document.querySelectorAll('[href],[content]').forEach(function (element) {
      ['href', 'content'].forEach(function (attribute) {
        if (!element.hasAttribute(attribute)) return;
        var current = element.getAttribute(attribute);
        var next = replaceTokens(current);
        if (next !== current) element.setAttribute(attribute, next);
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyLegalDetails);
  else applyLegalDetails();
})();
