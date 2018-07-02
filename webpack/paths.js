const chalk = require('chalk')
const path = require('path')
const argv = require('minimist')(process.argv.slice(2))

// Default
const paths = {
    public: '/',
    publicAssets: '/',
    app: path.join(__dirname, '../src'),
    build: path.join(__dirname, '../dist'),
    assets: path.join(__dirname, '../assets'),
    locales: path.join(__dirname, '../assets/locales'),
}

// Override with parameters
if (argv.path) {
    // Public
    paths.public = argv.path
    paths.publicAssets = paths.public
    console.log(chalk.cyan('Public path'), 'override with', chalk.green(paths.public))
}

if (argv.assets) {
    // Assets
    paths.publicAssets = argv.assets
    console.log(chalk.cyan('Public assets path'), 'override with', chalk.green(paths.publicAssets))
}

module.exports = paths