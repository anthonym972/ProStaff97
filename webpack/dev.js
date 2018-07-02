const argv = require('minimist')(process.argv.slice(2))
const merge = require('webpack-merge')
const core = require('./core')
const paths = require('./paths')
const [{ browsers, polyfill = () => { } }] = require('./browsers')

// Modules
const hmr = require('./modules/hmr')
const html = require('./modules/html')
const sass = require('./modules/sass')
const js = require('./modules/js')
const routing = require('./modules/routing')
const stats = require('./modules/stats')
const fonts = require('./modules/fonts')
const dashboard = require('./modules/dashboard')
const port = require('./modules/port')
const https = require('./modules/https')
const { setup }  = require('./modules/setup')

// Setup
setup().then(() => {
    // Dev config
    let config = merge([
        polyfill(),
        core,
        html.template({ inject: true, minify: false }),
        sass({ sourceMap: true, dev: true, browsers }),
        js({ include: paths.app, browsers, dev: true }),
        {
            devServer: {
                port: port.server,
                contentBase: [
                    paths.assets,
                ],
                watchContentBase: false,
                disableHostCheck: true,
                overlay: true,
                inline: true,
                clientLogLevel: "none",
                https
            },
            devtool: 'cheap-module-source-map'
        },
        hmr(),
        routing(),
        stats(),
        dashboard()
    ])

    // Server
    const Webpack = require('webpack');
    const WebpackDevServer = require('webpack-dev-server');
    const chokidar = require('chokidar')

    // Options
    const options = Object.assign({}, config.devServer, {
        host: '0.0.0.0'
    });
    WebpackDevServer.addDevServerEntrypoints(config, options);

    // Setup Server
    const compiler = Webpack(config);
    const server = new WebpackDevServer(compiler, options);

    // Start
    server.listen(options.port, '0.0.0.0', () => {
        console.log(`Server ready on http${https ? 's' : ''}://localhost:${options.port}`);
    });

    // Live reload statics files
    chokidar.watch([
        options.contentBase,
        `${paths.app}index.html`
    ]).on('all', () => {
        server.sockWrite(server.sockets, 'content-changed');
    })
}).catch((err) => {
    console.log(err)
})
