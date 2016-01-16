module.exports = function getCategoryName(alias) {
  if (['action','actions'].indexOf(alias) !== -1) {
    return "actions";
  } else if (['account', 'accounts'].indexOf(alias) !== -1) {
    return "account";
  } else if (['domain', 'domains'].indexOf(alias) !== -1) {
    return "domains";
  } else if (['domain-record', 'domain-records'].indexOf(alias) !== -1) {
    return "domain-records";
  } else if (['d', 'droplet', 'droplets'].indexOf(alias) !== -1) {
    return "droplets";
  } else if (['i', 'image', 'images'].indexOf(alias) !== -1) {
    return "images";
  } else if (['k', 'key', 'keys', 'ssh-key', 'ssh-keys'].indexOf(alias) !== -1) {
    return "ssh-keys";
  } else if (['region', 'regions'].indexOf(alias) !== -1) {
    return "regions";
  } else if (['size', 'sizes'].indexOf(alias) !== -1) {
    return "sizes";
  } else if (['ip', 'ips', 'floating-ip', 'floating-ips'].indexOf(alias) !== -1) {
    return "floating-ips";
  } else if (['ip', 'ips', 'floating-ip', 'floating-ips'].indexOf(alias) !== -1) {
    return "floating-ips";
  }
};
