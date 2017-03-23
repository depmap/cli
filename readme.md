# cli

```javascript
styl = require('stylus-loader')
pug = require('pug-loader')
// pugLoader returns
//   pug: {
//   	parse: function(),
//   	compile: {
//   		string: function,
//   		file: function
//   	}
//   },

loaders = { pug, styl }
// expands to:
// loaders = {
// 	pug: {
// 		parse: function(),
// 		compile: {
// 			string: function,
// 			file: function
// 		}
// 	},
// 	styl: {
// 		parse: function(),
// 		compile: {
// 			string: function,
// 			file: function
// 		}
// 	}
// }


const options = {
  path: 'src',
	load: loaders,
}

watch(options)
```
