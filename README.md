##Digital Ocean Wrench

Complete CLI to the Digital Ocean API


###Installation

`npm install -g dow`

###Usage

The tool will pretty much explain how to use it. Top-level lists categories:

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

###Special flags

--raw - log out Digital Ocean's JSON response
