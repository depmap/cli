#!/usr/bin/env node

'use strict';

const fs = require('fs')
const path = require('path')
const process = require('process')
const depmap = require('depmap')
const pretty = require('depmap-errors')

const buildMap = require(path.join(process.cwd(), 'node_modules/depmap-builder'))
  || require('depmap-builder')

const args = process.argv
const env = process.env.NODE_ENV || ''
const cmds = {
  __usage: 'usage:\n      <cmd> option\n',
  compile: 'compile: build the project once. If the build directory is present, will only update the difference',
  watch: 'watch:   continuously compile the project when files are updated',
  help: 'help:    display this dialog'
}

if (args.length < 2 || args[2] === 'help') for (let cmd in cmds) console.log(cmds[cmd])
else {
  findCfg()
    .then(buildMap)
    .then(depmap[args[2]])
    .catch(pretty.error)
}

function findCfg () {
  return new Promise((resolve, reject) => {
    let cfg = env ? `config.${env}.js` : 'config.js'
    fs.stat(cfg, (err, data) => {
      if (err) {
        pretty.warn('Warning: No config found. Using default config')
        resolve({})
      }

      resolve(require(path.join(process.cwd(), 'config.js')))
    })
  })
}
