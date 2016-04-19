#!/usr/bin/env node

var chalk = require('chalk');
var _ = require('lodash');
var Spin = require('io-spin');
var inquirer = require("inquirer");

var argv = require('yargs').argv;

var getCategoryName = require('./lib/getCategoryName');
var getMethodName = require('./lib/getMethodName');
var getMethodSchema = require('./lib/getMethodSchema');
var getMethod = require('./lib/getMethod');

var categoryAlias = argv._[0];
var methodAlias = argv._[1];

var categoryName = getCategoryName(categoryAlias);
if (!categoryName) {
  var map = require('./lib/method-map');
  var categories = Object.keys(map);
  console.log(chalk.yellow('usage: dow <command>\n'));
  console.log('where <command> is one of:\n\n\t' + categories.join('\n\t'));
  process.exit(1);
}

var methodName = getMethodName(categoryName, methodAlias);
if (!methodName) {
  var map = require('./lib/method-map');
  var methods = Object.keys(map[categoryName]);
  console.log(chalk.yellow('usage: dow ' + categoryName + ' <method>\n'));
  console.log('where <method> is one of:\n\n\t' + methods.join('\n\t'));
  process.exit(1);
}

function nameToPropertyName(name) {
  var map = {
    "account": "account",
    "actions": "actions",
    "domains": "domains",
    "domain-records": "domainRecords",
    "droplets": "droplets",
    "images": "images",
    "ssh-keys": "sshKeys",
    "regions": "regions",
    "sizes": "sizes",
    "floating-ips": "floatingIPs"
  };
  return map[name];
}

var methodSchema = getMethodSchema(nameToPropertyName(categoryName), methodName);
if (!methodSchema) {
  var otherName = nameToPropertyName(categoryName).replace(/s$/,'') + 'Actions';
  var methodSchema = getMethodSchema(otherName, methodName);
}

if (!methodSchema) {
throw new Error("methodSchema not found: " + categoryName + " " + methodName);
}

var resourceIds = argv._.slice(2);

function usage(schema) {
  var args = (methodSchema.path + '/')
    .split(/\$/g)
    .map(function(v) {
      return '<' + v.replace(/\/.*/g, '').toLowerCase().replace('_', '-') + '>';
    }).slice(1);
  var usageString = 'usage: dow ' +
    categoryName + ' ' +
    methodAlias + ' ' +
    args.join(' ') +
    schema.properties.map(function(prop) {
      if (prop.required) {
        return '\n\t\t--' + prop.name + '=<value>';
      } else {
        if (prop.name === "ssh_keys") {
          return '\n\t\t[--' + prop.name + '=<value-1>,<value-2>,...]';
        } else {
          return '\n\t\t[--' + prop.name + '=<value>]';
        }
      }
    }).join(' ');
  console.log(usageString);
}

if (resourceIds.length < methodSchema.requiredResourceIdCount) {
  usage(methodSchema);
  process.exit(1);
  // invalid call: lacking ids. display usage
}

var props = Object.keys(argv).filter(function(item) {
  return !/^\$/.test(item) && item !== "_";
});
var requiredKeys = _(methodSchema.properties
    .filter(function(prop) { return prop.required; })).map('name').value();
// TODO: make this less confusing
var missingProps = _.without.apply(_, [requiredKeys]
    .concat(props)
    .concat(Object.keys(methodSchema.staticProperties)));
if (missingProps.length) {
  usage(methodSchema);
  process.exit(1);
}

var logData = require('./lib/log');

var method = getMethod(nameToPropertyName(categoryName), methodName);
var optionsObject = _.omit(argv, ['token', '_', '$0']);
if (optionsObject.ssh_keys) {
  optionsObject.ssh_keys = optionsObject.ssh_keys.toString().split(',');
}
var methodArgs = argv._.slice(2).concat([optionsObject]);

if (/delete/i.test(methodSchema.method)) {
  function goAhead() {
    startAction();
  }
  if (argv.force === true) {
    if (!argv.raw) {
      console.warn(chalk.yellow("Force flag active. Deleting without manual confirmation."));
    }
    goAhead();
  } else {
    inquirer.prompt([{
      type: "input",
      name: "answer",
      message: "Please confirm your desire to perform DELETE operation (y/N).",
      default: "N"
    }], function(answers) {
      if (answers.answer === "y") {
        goAhead();
      } else {
        console.log('Cancelled.');
        process.exit(1);
      }
    });
  }
} else {
  startAction();
}

function startAction() {

  if (!argv.raw && (argv.spin !== false)) {
    var spin = new Spin('Spin4');
    spin.start();
  }

  function successHandler(d) {

    /*
     *  Wait for in-progress actions to reach a solution
     */
    if ((argv.wait !== false) && d && d.action && d.action.status === "in-progress") {
      setTimeout(function() {
        var method = getMethod('actions', 'retrieveExistingAction');
        method(d.action.id).then(successHandler, errorHandler);
      }, 1000);
      return;
    }

    /*
     *  When creating a droplet, it comes back as "new". Waiting for that to change
     *  means that you end up with a fully initialized (and booted) droplet.
     */
    if ((argv.wait !== false) && d && d.droplet && d.droplet.status === "new") {
      setTimeout(function() {
        getMethod('droplets', 'retrieveExistingDropletById')(d.droplet.id, { page: argv.page }).then(successHandler, errorHandler);
      }, 1000);
      return;
    }

    if (argv.raw) {
      console.log(JSON.stringify(d, null, 2));
    } else {
      logData(d);
    }
    process.exit(0);
  }

  function errorHandler(response) {
    console.log(chalk.yellow(response.error.message));
    process.exit(1);
  }

  method.apply(null, methodArgs).then(successHandler, errorHandler);
}
