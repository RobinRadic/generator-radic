/*global describe, beforeEach, it*/
'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('radic:app', function () {
    it('creates files', function () {
        helpers.assertTextEqual('a', 'a');
    });
});
