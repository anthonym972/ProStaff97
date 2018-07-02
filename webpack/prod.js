const async = require('async')
const webpack = require('webpack')
const merge = require('webpack-merge')
const core = require('./core')
const paths = require('./paths')
const browsers = require('./browsers')
const CleanupPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');

// Modules
const html = require('./modules/html')
const sass = require('./modules/sass')
const js = require('./modules/js')
const server = require('./modules/server')
const { setup } = require('./modules/setup')


// Time
const startTime = Date.now()

// Setup
setup().then(() => {
    // Sourcemap
    const sourceMap = false

    // Clean
    const cleanup = ({ path, exclude }) => ({
        plugins: [new CleanupPlugin(path, { exclude, verbose: true, allowExternal: true })],
    })

    // Minify
    const enableAutoMinifiers = () => ({
        plugins: [
            new webpack.LoaderOptionsPlugin({
                minimize: true,
                debug: false,
            }),
        ],
    })

    const minifyJS = () => ({
        plugins: [
            new UglifyJsPlugin({
                sourceMap
            })
        ],
    })

    const stripNonProductionCode = () => ({
        plugins: [
            new webpack.DefinePlugin({
                'process.env': { NODE_ENV: '"production"' },
            }),
        ],
    })

    const minifyAll = () =>
        merge([
            stripNonProductionCode(),
            enableAutoMinifiers(),
            minifyJS(),
        ])

    // Assets
    const assets = () => ({
        plugins: [
            new CopyWebpackPlugin([
                {
                    from: paths.assets
                }
            ]),
        ]
    })

    /**
     * Make a webpack build
     * @param {*} options
     */
    function build({ browsers: { browsers: browser, id, polyfill = () => { } }, clean }) {
        return new Promise((resolve, reject) => {
            webpack(merge([
                polyfill(),
                core,
                {
                    output: {
                        filename: 'js/' + id + '/app.js',
                        chunkFilename: 'js/' + id + '/[name].app.js',
                    },
                    stats: "minimal"
                },
                sass({ sourceMap, browsers: browser }),
                js({ include: paths.app, browsers: browser }),
                clean ? html.template({ inject: false, minify: true, browsers }) : null,
                clean ? cleanup({ path: paths.build }) : null,
                clean ? assets() : null,
                minifyAll(),
            ]), (err, stats) => {
                console.log('\n')

                // Errors
                if (err) {
                    console.log('Error on build ' + id + ':\n\n', err)
                    reject(id)
                }
                else if (stats.hasErrors()) {
                    console.log('Webpack Error on build ' + id + ':\n', stats.toString({
                        all: false,
                        errors: true,
                        errorDetails: true,
                        warning: true,
                        colors: true,
                    }))
                    reject(id)
                }
                // Complete
                else {
                    console.log('Build ' + id + ':\n', stats.toString({
                        all: false,
                        chunks: true,
                        warning: true,
                        colors: true,
                        maxModules: 1000
                    }))
                    resolve()
                }
            })
        })
    }

    // Build by browsers
    let index = -1
    async.eachSeries(browsers, (browsers, callback) => {
        index++
        build({
            browsers,
            clean: index === 0
        }).then(() => {
            callback()
        }).catch((error) => {
            callback(error)
        })
    }, (err) => {
        // Failed
        if (err) {
            console.log('\n\nBuild failed\n\n', err)
        }
        // Complete
        else {
            console.log('\n\nBuild completed in ' + parseInt((Date.now() - startTime) / 1000) + 's at ' + paths.build)
            server()
        }
    })
}).catch((err) => {
    console.log(err)
})
