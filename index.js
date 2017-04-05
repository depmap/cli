#!/usr/bin/env node

'use strict'

const fs = require('fs')
const path = require('path')
const process = require('process')
const pretty = require('depmap-errors')

async function findDepmap () { return await new Promise((resolve, reject) => {
    let global = path.join(process.cwd(), 'node_modules/depmap')
    fs.stat(global, (err, data) => {
      if (err) resolve('depmap')
      resolve(global)
    })
  })
}

const args = process.argv
const env = process.env.NODE_ENV || ''
const cmds = {
  __usage: 'usage:\n      depmap [option]\n\noptions:',
  compile: '    compile: build the project once. If the build directory is present, will only update the difference',
  watch: '    watch:   continuously compile the project when files are updated',
  help: '    help:    display this dialog'
}

if (args.length < 3 || args[2] === 'help' || !cmds[args[2]]) for (let cmd in cmds) console.log(cmds[cmd])
else {
  let cfg = env ? `config.${env}.js` : 'config.js'
  cfg = path.join(process.cwd(), cfg)

  let opts = {}
  fs.stat(cfg, (err, data) => {
    if (!err) opts = require(cfg)
    else pretty.warn('Warning: No config found. Using default config')

    findDepmap()
      .then(mod => {
        let depmap = require(mod)
        let map
        [ map, opts ] = depmap.build(opts)
        depmap[args[2]](map, opts)
      })
      .catch(pretty.error)
  })
}
