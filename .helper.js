'use strict';

var chalk = require('chalk');


console.info(chalk.yellow('hai'));

process.argv.forEach(function(val, index, array) {
    console.log(index + ': ' + val);
});

