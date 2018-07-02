const webpack = require('webpack')

// HMR
module.exports = () => ({
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
    ],
    devServer: {
        hot: true
    },
})