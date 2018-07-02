const path = require('path')
const paths = require('../paths')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const htmlMinifier = require('html-minifier').minify
const fonts = require('./fonts')
const locales = require('./locales')

// HTML
exports.template = ({ inject, minify, browsers = [] }) => ({
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(paths.app, 'index.html'),
            minify: minify ? {
                collapseWhitespace: true,
                html5: true,
                minifyCSS: true,
                removeComments: true,
                minifyJS: false,
                processScripts: ['text/javascript']
            } : false,
            inject,
            bundles: browsers.map(({ id, test }) => {
                return { id, test }
            }),
            fonts: fonts.js(),
            locales: locales.locales(),
            locale: locales.locale(),
            files: locales.files(),
            assets: paths.publicAssets,
            path: paths.public
        })
    ]
})