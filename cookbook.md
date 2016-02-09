## Cookbook

### Register a public key

```bash
KEY_TO_ADD=`cat ~/.ssh/id_rsa.pub`
dow ssh-keys create --name="new-user" --public_key="$KEY_TO_ADD" --raw > ./new_key_response
NEW_KEY_ID=`cat new_key_response | json ssh_key.id`
```

### Create an image

```bash
dow droplets create \
  --name="new-box" \
  --region="nyc2" \
  --size="512mb" \
  --image=ubuntu-14-04-x64
  --ssh_keys=$NEW_KEY_ID
  --raw > ./new_droplet_response
NEW_DROPLET_IP=`cat new_droplet_response | json droplet.networks.v4[0].ip_address`
ssh root@$NEW_DROPLET_IP
```
