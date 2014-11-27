---
layout: page
title: Yeoman generator-radic
---
[![Build Status](https://secure.travis-ci.org/RobinRadic/generator-radic.svg?branch=master)](https://travis-ci.org/RobinRadic/generator-radic)
[![GitHub version](https://badge.fury.io/gh/robinradic%2Fgenerator-radic.svg)](http://badge.fury.io/gh/robinradic%2Fgenerator-radic)
[![Goto documentation](http://img.shields.io/badge/goto-documentation-orange.svg)](http://robinradic.github.io/generator-radic)
[![Goto repository](http://img.shields.io/badge/goto-repository-orange.svg)](https://github.com/robinradic/generator-radic)
[![License](http://img.shields.io/badge/license-MIT-blue.svg)](http://radic.mit-license.org)


> A [Yeoman](http://yeoman.io) generator using my personal preferences. Generates various types of projects or files. Or does some other stuff..

Getting Started
---------------

### Install yeoman
`npm install -g yo`


### Install generator-radic

To install generator-radic from npm, run:

`npm install -g generator-radic`

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
Copyright 2014 Robin Radic
[MIT Licensed](http://radic.mit-license.org)