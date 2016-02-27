var chalk = require('chalk');
var dropletLogger = require('./loggers/droplet');
/*
   All logging for Digital Ocean's non-error responses
*/
module.exports = function logData(data) {
  if (!data) {
    console.log('success');
    process.exit(0);
  }
  var key = Object.keys(data)[0];
  if (key) {
    console.log('\n' + key + ':');
    switch (key) {
      case 'ssh_keys':
        data[key].forEach(function(key) {
          console.log(key.id);
          console.log('\tname:\t' + key.name);
          console.log('\tfingerprint:\t' + key.fingerprint);
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
        break;
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
      case 'droplet':
        var droplet = data[key];
        dropletLogger(droplet);
        break;
      case 'droplets':
        data[key].forEach(dropletLogger);
        break;
      default:
        console.log(chalk.red('logger for data type "' + key +
              '" not implemented!\ntry --raw flag or open an issue (a pr would be even better)'));
        break;
    }
  } else {
    console.log('success');
  }
  if (data.links && data.links.pages) {
    console.log('There are ' + (data.meta.total - 200) + ' additional results. Access them via the --page=<page-#> flag.');
  }
}
