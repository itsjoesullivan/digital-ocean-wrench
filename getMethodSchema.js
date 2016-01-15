var schemas = require('digital-ocean-api-v2/parsed-schema');
module.exports = function(categoryName, methodName) {
  var method;
  schemas.some(function(schemaCategory) {
    if (schemaCategory.name === categoryName) {
      return schemaCategory.items.some(function(methodItem) {
        if (methodItem.name === methodName) {
          method = methodItem;
          return true;
        }
      });
    }
  });
  return method;
}
