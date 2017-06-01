#!/usr/bin/env node

'use strict'

const fs = require('fs')
const removeSync = require('fs-extra').removeSync
const path = require('path')
const process = require('process')
const ArgParser = require('argparse').ArgumentParser
const pretty = require('@depmap/errors')
const VERSION = require('./package.json').version

const cli = new ArgParser({
  version: VERSION,
  addHelp: true,
  description: 'depmap - dependency map'
})

cli.addArgument(['-d', '--debug'], {
  action: 'storeTrue',
  help: 'Enable debugging'
})

cli.addArgument(['-s', '--stateless'], {
  action: 'storeTrue',
  help: 'Stateless mode'
})

cli.addArgument(['-c', '--cfg'], {
  action: 'store',
  type: 'string',
  nargs: 1,
  help: 'Set configuration'
})

const cmds = cli.addSubparsers({
  title: 'Commands',
  dest: 'cmd'
})

cmds.addParser('compile', {
  help: 'Build the project once. If the build directory is present, will only update the difference'
})

cmds.addParser('watch', {
  help: 'Continuously compile the project when files are updated'
})

let cleanCmd = cmds.addParser('clean', {
  help: 'Clean up build directory and/or cache'
})

cleanCmd.addArgument('what', {
  action: 'store',
  choices: ['build', 'cache', 'all'],
  defaultValue: 'all',
  nargs: '*'
})

class Debug {
  constructor(verbose) {
    this.log = console.log
    if (!verbose) this.log = function(){}
  }

  info(msg) {
    this.log(msg)
  }

  warn(msg) {
    pretty.warn(msg)
  }

  error(err) {
    pretty.error(err)
  }
}

const args = cli.parseArgs()
const debug = new Debug(args.debug)
Promise.all([findDepmap(args), findConfig(args.config), args])
  .then(run)
  .catch(pretty.error)

function run([depmap, [config, cfgPath], args]) {
  debug.info(`Debugging...`)
  if (args.cmd === 'clean') clean(args.what, config)
  config.cliArgs = args

  // TODO automate this
  debug.info(`
  CLI Options:
    debug:     ${args.debug}
    stateless: ${args.stateless}
    cfg:       ${args.cfg}
    cmd:       ${args.cmd}

  Depmap Config: ${path.relative(process.cwd(), path.resolve(cfgPath))}
    path:   ${config.path}
    output: ${config.output}
    load:   [${Object.keys(config.load)}]
    cache:
      path: ${config.cache.path}
  `)

  depmap = require(depmap)
  let map = {}
  let opts = {} ;[map, opts] = depmap.build(config)
  opts.logger = debug

  depmap.compile(map, opts, !!(args.cmd === 'compile'))
}

function findConfig(path) {
  return new Promise((resolve, reject) => {
    let cfg
    let cfgPath = 'config.js'

    if (path) cfg = loadCfg(path[0])
    else cfg = loadCfg(cfgPath)

    if (!cfg) {
      cfgPath = 'package.json'
      cfg = loadCfg(cfgPath)
      cfg = cfg.depmap ? cfg.depmap : cfg
    }

    if (!cfg) reject(new Error('No config found.'))
    else {
      resolve([cfg, cfgPath])
    }
    return
  })
}

function findDepmap() {
  return new Promise((resolve, reject) => {
    const global = path.join(process.cwd(), 'node_modules/@depmap/depmap')
    fs.stat(global, (err, data) => {
      if (err) resolve('@depmap/depmap')
      resolve(global)
    })
  })
}

function clean(argument, opts) {
  let build = opts.build || 'build'
  let cache = opts.cache && opts.cache.path ? opts.cache.path : '.cache'

  if (argument[0] === 'build') {
    removeSync(build)
    console.log(`Lets rebuild from a clean slate, ${build} has been destoryed!`)
  } else if (argument[0] === 'cache') {
    removeSync(cache)
    console.log(`Removed the old for the new, ${cache} has been removed.`)
  } else {
    removeSync(build)
    removeSync(cache)
    console.log(`All clean, ${build} and ${cache} are no more!`)
  }

  process.exit(0)
}

function loadCfg (file) {
  let cfg
  try {
    cfg = require(path.join(process.cwd(), file))
  } catch (e) {
    debug.info(`Unable to load: ${file}`)
    debug.info(e)
    cfg = undefined
  }

  return cfg
}
