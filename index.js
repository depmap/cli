#!/usr/bin/env node

'use strict';

const fs = require('fs')
const path = require('path')
const depmap = require('depmap')
const buildMap = require('depmap-builder')
const pretty = require('depmap-errors')

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
  getOpts()
    .then(buildMap)
    .then(depmap[args[2]])
    .catch(pretty.error)
}

function getOpts () {
  return new Promise((resolve, reject) => {
    fs.stat(`./config.${env}.js`, (err, data) => {
      if (err) {
        pretty.warn('Warning: Using default config')
        resolve({})
      }

      resolve(require(path.join(__dirname, 'config.js')))
    })
  })
}
