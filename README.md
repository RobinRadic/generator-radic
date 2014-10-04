# generator-radic [![Build Status](https://secure.travis-ci.org/robinradic/generator-radic.png?branch=master)](https://travis-ci.org/robinradic/generator-radic)

> A [Yeoman](http://yeoman.io) generator using my personal preferences.

## Quick overview

#### Files/directories generated

- bower.json, package.json, config.yml, Gruntfile.js, LICENSE, README.md, travis.yml, editorconfig, jshintrc
- src/views/{layouts/default.jade,partials,pages/index.jade,mixins}

#### Grunt

- sass
- jade
- livereload
- connect
- wiredep
- build

#### Bower
bootstrap-sass-official
json3
es5-shim
jquery
underscore
fontawesome
jquery-jsonp

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

Finally, initiate the generator:

```bash
yo radic
```

### Subgenerators

```bash
yo radic:jquery-plugin              # Quite similiar to grunt-init-jquery
yo radic:jquery-ui-widget           # Quite similiar to grunt-init-jquery
yo radic:angular                    # Creates full angular application on top of current src
```


## License

MIT
