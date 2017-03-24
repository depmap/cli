const depmap = require('depmap')
const buildMap = require('depmap-builder')
const fs = require('fs')
const path = require('path')

const args = process.argv
const handleError = console.error

cli = {
	usage: 'usage:\n      <cmd> option\n',
	compile: 'compile: build the project once. If the build directory is present, will only update the difference',
	watch: 'watch:   continuously compile the project when files are updated',
	help: 'help:    display help dialog (this)'
}

if (args.length < 2 || args[2] === 'help') for (let i = 0; i < cli.length; i++) console.log(cli[i])
else getOpts() 
		.then(buildMap)
		.then(depmap[args[2]])
		.catch(err => handleError(err))

function getOpts() {
	return new Promise((resolve, reject) => {
		fs.stat('./config.js', (err, data) => {
			if (err) {
				// prettyError.warn(err)
				console.warn('Warning: Using default config')
				resolve({})
			}
			resolve(require(path.join(__dirname, 'config.js')))
		})
	})
}
