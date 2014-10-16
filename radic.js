'use strict';
var util = require('util');
var path = require('path');
var fs = require('fs-extra');
var _ = require('underscore');

var Radic = function () {
    var radic = {
        _cwd: '',
        _file: '',
        config: {},
        getOrDie: function (cwd) {
            this._cwd = cwd;
            this._file = path.join(this._cwd, 'radic.json');
            if (!fs.existsSync(this._file)) {
                console.log('Error reading radic.json');
                process.exit(1);
            } else {
                this.loadConfig();
                return this;
            }
        },
        loadConfig: function () {
            this.config= fs.readJsonFileSync(this._file);
        },
        writeConfig: function () {
            fs.writeJSONFileSync(this._file, this.config);
        },
        addGeneratedChild: function (generatorName, name) {
            this.config.generatedChildren[generatorName] = name;
        }
    };

    return function (cwd) {
        return radic.getOrDie(cwd);
    }
}();

module.exports = Radic;