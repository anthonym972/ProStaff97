const chalk = require('chalk')
const argv = require('minimist')(process.argv.slice(2))
const https = !!argv.https

if(https) {
    console.log(chalk.cyan('HTTPS'), chalk.green('On'))
}

module.exports = https