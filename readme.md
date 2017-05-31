# cli
> depmap cli

## Installation
`npm install -g @depmap/cli`

## Usage
```
$ depmap --help
usage: depmap [-h] [-v] [-d] [-s] [-c CFG] {compile,watch,clean} ...

depmap - dependency map

Optional arguments:
  -h, --help            Show this help message and exit.
  -v, --version         Show program's version number and exit.
  -d, --debug           Enable debugging
  -s, --stateless       Stateless mode
  -c CFG, --cfg CFG     Set configuration

Commands:
  {compile,watch,clean}
    compile             Build the project once. If the build directory is
                        present, will only update the difference
    watch               Continuously compile the project when files are
                        updated
    clean               Clean up build directory and/or cache
```

## license
MIT
