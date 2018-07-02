const paths = require('../paths')

// Routes
module.exports = () => ({
    devServer: {
        historyApiFallback: {
            rewrites: [
                {
                    from: /.*/,
                    to: paths.public + 'index.html'
                }
            ]
        }
    }
})
