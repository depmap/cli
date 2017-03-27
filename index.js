#!/usr/bin/env node

'use strict'

const fs = require('fs')
const path = require('path')
const process = require('process')
const pretty = require('depmap-errors')

const depmap = require(path.join(process.cwd(), 'node_modules/depmap'))
  || require('depmap')

const args = process.argv
const env = process.env.NODE_ENV || ''
const cmds = {
  __usage: 'usage:\n      depmap [option]\n\noptions:',
  compile: '    compile: build the project once. If the build directory is present, will only update the difference',
  watch: '    watch:   continuously compile the project when files are updated',
  help: '    help:    display this dialog'
}

if (args.length < 3 || args[2] === 'help') for (let cmd in cmds) console.log(cmds[cmd])
else {
  let cfg = env ? `config.${env}.js` : 'config.js'
  let opts = {}
  fs.stat(cfg, (err, data) => {
    if (err) {
      pretty.warn('Warning: No config found. Using default config')
    }

    opts = require(path.join(process.cwd(), 'config.js'))
    depmap.build(opts)
      .then(map => depmap[args[2]](map, opts))
      .catch(pretty.error)
  })
}
