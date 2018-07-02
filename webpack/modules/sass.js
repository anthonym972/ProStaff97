const autoprefixer = require('autoprefixer')
const fonts = require('./fonts')
const paths = require('../paths')

// SASS
module.exports = ({ sourceMap, browsers, dev = false }) => ({
    module: {
        rules: [
            {
                test: /\.scss/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap,
                            importLoaders: 1,
                            localIdentName: dev?'[path][name]-[local]-[hash:base64:5]':'[hash:base64]'
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            data: `$path: "${paths.publicAssets}";
${fonts.sass()}
`
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: loader => [
                                autoprefixer(browsers)
                            ],
                            sourceMap
                        }
                    },
                ]
            }
        ]
    }
})
