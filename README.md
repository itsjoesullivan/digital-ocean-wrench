##Digital Ocean Wrench

Complete CLI to the Digital Ocean API


###Installation

- `npm install -g dow`

- It will look for a DIGITALOCEAN_ACCESS_TOKEN variable. In other words, you can authenticate by adding the following to your `.profile`: `export DIGITALOCEAN_ACCESS_TOKEN="<your-access-token>"`


###Usage

For now, the tool will pretty much explain how to use it. (Methods map pretty simply to the official [documentation](https://developers.digitalocean.com/documentation/v2/).) Top-level lists categories:

```bash
$ dow

usage: dow <command>

where <command> is one of:

  actions
  domains
  domain-records
  droplets
  images
  ssh-keys
  regions
  sizes
  floating-ips
```

Categories list methods:

```bash
$ dow images

usage: dow images <method>

where <method> is one of:

list
get-by-id
get-by-slug
list-actions
update
delete
transfer
convert-to-snapshot
get-action
```

And methods explain themselves when misused:

```bash
$ dow images get-by-slug

usage: dow images get-by-slug <image-id>
```

or

```bash
$ dow droplet create

usage: dow droplets create 
  --name=<value> 
  --region=<value> 
  --size=<value> 
  --image=<value> 
  [--ssh_keys=<value-1>,<value-2>,...] 
  [--backups=<value>] 
  [--ipv6=<value>] 
  [--private_networking=<value>] 
  [--user_data=<value>]
```

Output tries to be common sense, but [logData](./lib/logData.js) could use some love. You can use `--raw` to get just the JSON response.

###Special flags

Flag              | Explanation
-------------     | -------------
`--raw`           | only write out Digital Ocean's JSON response
`--token=<token>` | manually provide access token
