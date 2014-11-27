generator-radic
===============
[![Build Status](https://secure.travis-ci.org/RobinRadic/generator-radic.svg?branch=master)](https://travis-ci.org/RobinRadic/generator-radic)
[![GitHub version](https://badge.fury.io/gh/robinradic%2Fgenerator-radic.svg)](http://badge.fury.io/gh/robinradic%2Fgenerator-radic)

> A [Yeoman](http://yeoman.io) generator using my personal preferences.

## Quick overview
**Under development**
Generates various types of projects or files. Or does some other stuff..

## Getting Started

### Install yeoman

```bash
npm install -g yo
```

### Install generator-radic

To install generator-radic from npm, run:

```bash
npm install -g generator-radic
```

### generators
**required before running other generators**  
`yo radic:config`  
Creates a global configuration file that stores shared/common data used by all other radic generators  
  
  
  
`yo radic`
- Creates a base project (composer,node,other)
- Generates README.md, .editorconfig, .travis.yml
- **optional** Generates a LICENSE
- **optional** Generates a .jshintrc
- **optional** Runs `yo radic:gitinit` afterwards

`yo radic:gitinit`
- Initialises git
- Creates .gitignore with common values
- Adds all files
- Does an initial commit
- **optional** Add remote
- **optional** create remote(github/bitbucket)
- **optional** push to origin/master

## License

[MIT Licensed](http://radic.mit-license.org)
