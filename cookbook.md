## Cookbook

In order to really get things done using `dow`, especially if in an automated way, I recommend storing Digital Ocean's JSON responses and extracting the data you want from them using a tool like [json](https://github.com/trentm/json).

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
NEW_DROPLET_ID=`cat new_droplet_response | json droplet.id`
ssh root@$NEW_DROPLET_IP
```

### Point a floating-ip at an instance

```bash
dow floating-ips assign $FLOATING_IP --droplet_id=$NEW_DROPLET_ID
```
