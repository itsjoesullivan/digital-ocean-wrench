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
var missingProps = _.without.apply(_, [requiredKeys].concat(props));

if (missingProps.length) {
  usage(methodSchema);
  process.exit(1);
}

var logData = require('./lib/logData');

var method = getMethod(nameToPropertyName(categoryName), methodName);
var optionsObject = _.omit(argv, ['token', '_', '$0']);
if (optionsObject.ssh_keys) {
  optionsObject.ssh_keys = optionsObject.ssh_keys.toString().split(',');
}
var methodArgs = argv._.slice(2).concat([optionsObject]);

if (/delete/i.test(methodSchema.method)) {
  inquirer.prompt([{
    type: "input",
    name: "answer",
    message: "Please confirm your desire to perform DELETE operation (y/N).",
    default: "N"
  }], function(answers) {
    if (answers.answer === "y") {
      startAction();
    } else {
      console.log('Cancelled.');
      process.exit(1);
    }
  });
} else {
  startAction();
}

function startAction() {
  if (!argv.raw) {
    var spin = new Spin('Spin4');
    spin.start();
  }
  function successHandler(d) {
    if (d && d.droplet && d.droplet.status === "new") {
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
