const { exec } = require('child_process')
const { add } = require('./setup')
const { kill } = require('cross-port-killer')

const argv = require('minimist')(process.argv.slice(2))
const port = argv.port ? parseInt(argv.port) : 9000

// Setup
add(() => {
    return new Promise((resolve, reject) => {
        // Kill process allready use this port
        kill([port]).then(resolve).catch(resolve)
    })
})

// Export
module.exports = {
    server: port
}