##Digital Ocean Wrench

Complete CLI to the Digital Ocean API


###Installation

`npm install -g dow`

`dow` will look for a `DIGITALOCEAN_ACCESS_TOKEN` environment variable. You can create one [here](https://cloud.digitalocean.com/settings/api/tokens), and surface it by adding the following to your `.profile`/`.bash_profile`/etc.:

```bash
export DIGITALOCEAN_ACCESS_TOKEN="<your-access-token>"
```

If you really want, you can additionally pass your token via the `--token` flag (see [special flags](#special-flags)). Read [here](http://stackoverflow.com/questions/8473121/execute-command-without-keeping-it-in-history) about how to keep such commands out of your history.

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

Output tries to be common sense, but [logData](./lib/logData.js) needs some love. You can use `--raw` to get just the JSON response.

###Special flags

Flag                      | Explanation
---------------------     | -------------
`--raw`                   | Only write out Digital Ocean's JSON response
`--token=<token>`         | Manually provide access token
`--no-wait`               | Do not wait for actions to move out of 'in-progress' status or for droplets to move out of 'new' status
`--no-spin`               | Do not show a spinner
