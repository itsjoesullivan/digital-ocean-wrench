var chalk = require('chalk');
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
        var d = data[key];
        console.log('id:\t' + d.id);
        console.log('name:\t' + d.name);
        console.log('status:\t' + d.status);
        console.log('region:\t' + d.region.slug);
        console.log('image:\t' + d.image.slug);
        console.log('size:\t' + d.size.slug);
        break;
      case 'droplets':
        data[key].forEach(function(d) {
          console.log('id:\t' + d.id);
          console.log('name:\t' + d.name);
          console.log('status:\t' + d.status);
          console.log('region:\t' + d.region.slug);
          console.log('image:\t' + d.image.slug);
          console.log('size:\t' + d.size.slug);
          console.log('\n');
        });
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
