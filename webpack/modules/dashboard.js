const DashboardPlugin = require('webpack-dashboard/plugin');
const port = require('./port')

// Dashboard
module.exports = () => ({
    plugins: [
        new DashboardPlugin({
            minified: false,
            gzip: false
        })
    ]
})