var methodAliases = require('./method-map');
module.exports = function getMethodName(categoryName, methodAlias) {
  return methodAliases[categoryName] && methodAliases[categoryName][methodAlias];
};
