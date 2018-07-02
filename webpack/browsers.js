const argv = require('minimist')(process.argv.slice(2))

/* You can list supported browser at this address:
 * http://browserl.ist/
 */
let browsers = [
    {
        id: 'es6-2017',
        browsers: ["chrome >= 60"],
        test: '[...[]];(fetch);'
    },
    {
        id: 'es6-2016',
        browsers: ["chrome >= 52", "safari >= 10", "edge >= 15", "ChromeAndroid 61"],
        test: 'class C {};',
        polyfill: () => {
            return {
                entry: ['whatwg-fetch'],
                resolve: {
                    alias: {
                        'fetch': 'whatwg-fetch',
                    }
                }
            }
        }
    },
    {
        id: 'es5',
        browsers: [">= 1%", "ie 11"],
        polyfill: () => {
            return {
                entry: ['babel-polyfill', 'whatwg-fetch'],
                resolve: {
                    alias: {
                        'fetch': 'whatwg-fetch',
                    }
                }
            }
        }
    }
]

// Dev filter
if (argv.browser) {
    browsers = browsers.filter(({ id }) => {
        return id === argv.browser
    })
    console.log('Browser override with', browsers[0].id)
}

module.exports = browsers