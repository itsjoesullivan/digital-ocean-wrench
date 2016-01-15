var chalk = require('chalk');
module.exports = function logData(data) {
  if (!data) {
    console.log('success');
    process.exit(0);
  }
  var key = Object.keys(data)[0];
  if (key) {
    console.log(key + ':');
    switch (key) {
      case 'ssh_keys':
        data[key].forEach(function(key) {
          console.log(key.name + '\t\t' + key.fingerprint);
        });
        break;
      case 'floating_ip':
        var item = data[key];
        console.log(item.ip + '\t\t' + item.region.slug);
        break;
      case 'floating_ips':
        data[key].forEach(function(data) {
          console.log(data.ip + '\t\t' + data.region.slug);
        });
      case 'regions':
        data[key].forEach(function(region) {
          console.log('\t' + region.slug);
        });
        break;
      case 'images':
        data[key].forEach(function(image) {
          console.log('\t' + image.slug);
        });
        break;
      case 'sizes':
        data[key].forEach(function(size) {
          console.log('\t' + size.slug);
        });
        break;
      default:
        console.log(chalk.red('logger for data type "' + key +
              '" not implemented!\ntry --raw flag or open an issue (pr better)'));
        break;
    }
  } else {
    console.log('success');
  }
}
