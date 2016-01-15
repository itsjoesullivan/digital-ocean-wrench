var DigitalOceanAPI = require('digital-ocean-api-v2');
var api = new DigitalOceanAPI(process.env.DIGITALOCEAN_ACCESS_TOKEN);
module.exports = function(category, methodName) {
  var cat;
  cat = api[category];
  if (!cat[methodName]) {
    var otherName = category.replace(/s$/, '') + 'Actions';
    cat = api[otherName];
  }
  return cat[methodName];
}
