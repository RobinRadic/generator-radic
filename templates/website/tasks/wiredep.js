module.exports = {
    wiredep: {
        build: {
            src: [
                '<%= config.src.views %>/**/*.jade',
                '<%= config.src.styles %>/main.scss'
            ],

            fileTypes: {
                jade: {
                    block: /(([ \t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi,
                    detect: {
                        js: /script\(.*src=['"]([^'"]+)/gi,
                        css: /link\(.*href=['"]([^'"]+)/gi
                    },
                    replace: {
                        js: 'script(src=bowerAsset(\'{{filePath}}\'))',
                        css: 'link(rel=\'stylesheet\', href=\'{{filePath}}\')'
                    }
                }
            },
            ignorePath: '../../../bower_components'

        }
    }
}
