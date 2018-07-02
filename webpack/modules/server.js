const chalk = require('chalk')
const argv = require('minimist')(process.argv.slice(2))
const express = require('express')
const paths = require('../paths')
const path = require('path')
const port = require('./port')

module.exports = () => {
    if (argv.server) {
        const app = express()
        
        app.use(paths.public, express.static(paths.build))

        // index.html
        app.get('*', function (req, res) {
            res.sendFile(path.join(paths.build, 'index.html'));
        });
        
        app.listen(port.server, function () {
            console.log('Server ' + chalk.cyan('ready') + ' at ' + chalk.green('http://localhost:' + port.server + paths.public))
        })
    }
}