module.exports = function(droplet) {
  console.log('id:\t' + droplet.id);
  console.log('name:\t' + droplet.name);
  console.log('status:\t' + droplet.status);
  if (droplet.networks.v4.length === 1) {
    console.log('ip:\t' + droplet.networks.v4[0].ip_address);
  }
  console.log('region:\t' + droplet.region.slug);
  console.log('image:\t' + droplet.image.slug);
  console.log('size:\t' + droplet.size.slug);
  console.log('\n');
};
