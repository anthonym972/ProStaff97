const merge = require('webpack-merge')
const path = require('path')
const paths = require('./paths')
const alias = require('./alias')

// Modules
const glsl = require('./modules/glsl')
const yaml = require('./modules/yaml')

// Core
// TODO: enable polyfill for es5 build
module.exports = merge([
    {
        entry: [paths.app],
        output: {
            filename: 'js/[name].app.js',
            chunkFilename: 'js/[name].app.js',
            path: paths.build,
            publicPath: paths.publicAssets,
        },
        resolve: {
            alias: alias,
            modules: [paths.app, "node_modules"]
        },
        resolveLoader: {
            alias: {
                "hot-css-loader": path.join(__dirname, "./loaders/hot-css-loader")
            }
        },
    },
    glsl(),
    yaml(),
])