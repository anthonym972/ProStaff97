const path = require('path')
const paths = require('./paths')

module.exports = {
    // Shorcut
    // 'bundle': path.join(paths.app, 'src/path/bundle/'),
    
    // Libs
    'react': 'preact-compat',
    'react-dom': 'preact-compat',
    'signal': 'mini-signals'
}