import config from 'config'
import i18n from 'dan/i18n'
import app from './index'
import Signal from 'signal'

/**
 * Format optional parameters
 * @param {String} regex - Regex chunk
 * @param {String} option - Parameter options
 * @param {Number} id - Parameter id
 * @returns {String} New formated regex
 */
function formatOptional(regex, option, id) {
    return option.indexOf('?') === option.length - 1
        ? '(' + regex + ')?'
        : regex
}

/**
 * Convert URL route to a regex
 * @param {String} route URL route
 * @return {RegExp}
 */
function getRouteRegex(route) {
    const [, ...structure] = route.split(/\//)
    return new RegExp('^/?' + structure.reverse().reduce((reg, query, id) => {
        const instruction = query.charAt(0)
        const optional = query.length > 0 && query.indexOf('?') === query.length - 1
        let content = ''

        // Parameter
        if(instruction === ':') {
            content = '[^/]+'
        }
        // Splat
        else if(instruction === '*') {
            content = '.*'
        }
        // Text
        else {
            content = query
        }
        return '(' + (id !== structure.length - 1 ?'/':'') + content + reg + ')' + (optional?'?':'')
    }, '') + '$')

    // return new RegExp('^' + structure.reduce((reg, query, id) => {
    //     return reg
    // }, '') + '$')
}

/**
 * Extract parameters from an URL base on a template route
 * @param {String} route Template URL route
 * @param {String} url URL
 * @returns {Object}
 */
function getParameters(route, url) {
    const [, ...structure] = route.split(/\//)
    const [, ...data] = url.split(/\//)
    const parameters = {}

    structure.forEach((query, index) => {
        const [instruction,] = query
        let id = query.substr(1)
        let value = null

        // Optional
        if (query.charAt(query.length - 1) === '?') {
            id = id.substr(0, id.length - 1)
        }

        // Instructions type
        if (instruction === ':') {
            value = data[index]
        }
        else if (instruction === '*') {
            value = data.slice(index).join('/')
        }

        parameters[id] = value || null
    })
    return parameters
}
export { getParameters }

/*
 * Router
 */
class Router {
    /**
     * Constructor
     */
    constructor() {
        this._path = null
        this._file = null
        this._routes = []
        this._middlewares = []

        // Current
        this.route = null
        this.parameters = null

        // Signals
        this.onChange = new Signal() // Change event
    }

    /**
     * Setup the router module
     * @param {Object} options
     */
    config({ app, path = config.path, file = 'routes' }) {
        return new Promise((resolve, reject) => {
            this._path = path
            this._file = file
            this._app = app

            this._pathRegex = new RegExp('^' + path)
            resolve()
        })
    }

    /**
     * Add a new router
     * @param {String} name - Route name
     * @param {String|Function} controller - Controller function or module name
     */
    add(name, controller) {
        const route = i18n.localize(name, null, this._file)
        this._routes.push({
            regex: getRouteRegex(route),
            controller: typeof (controller) === 'function'
                ? controller
                : (params) => {
                    System.import('app/pages/' + controller + '/index.js').then((module) => {
                        this._app.setPage(module.default, params)
                    }).catch((e) => {
                        throw e
                    })
                },
            route,
            name
        })
    }

    /**
     * Remove a route
     * @param {String} name - Route name
     */
    remove(name) {
        this._routes.splice(this._routes.findIndex(({ routeName }) => {
            return name === routeName
        }), 1)
    }

    /**
     * Remove all routes
     */
    clear() {
        this._routes = []
    }

    /**
     * Add a new middleware
     * @param {Function} middleware 
     */
    use(middleware) {
        this._middlewares.push(middleware);
    }

    /**
     * Get URL with a route and parameters
     * @param {String} route
     * @param {Object} [params]
     * @param {locale} [locale]
     * @return {String|Promise}
     */
    getURL(route, params = {}, locale) {
        // Setup params
        var setup = (route) => {
            for (let key in params) {
                route = route.replace(new RegExp('(:|\\*)' + key + '\\??', 'i'), params[key])
            }
            return (this._path + route).replace(new RegExp('/?(:|\\*)[a-z0-9]+\\??', 'ig'), '').replace(/\/\//g, '/')
        }

        // With locale
        if (locale) {
            return new Promise((resolve, reject) => {
                this.sync(locale).then(() => {
                    resolve(setup(i18n.localize(route, null, this._file, locale)))
                })
            })
        }
        // Current locale
        else {
            const tmp = i18n.localize(route, params, this._file)
            return setup(tmp)
        }
    }

    /**
     * Start the router
     * @return {Promise}
     */
    start() {
        return new Promise((resolve, reject) => {
            window.onpopstate = (event) => {
                this.run()
            }

            this.onChange.dispatch()
            this.run()
            resolve()
        })
    }

    /**
     * Run the router
     */
    run() {
        // Setup
        const data = {
            url: this.url
        }

        // Middleware
        this._serie(this._middlewares, data).then(() => {
            // Routing
            let target = null,
                i = 0,
                item;
            
            while (target === null && i < this._routes.length) {
                item = this._routes[i]
                if (item.regex.test(data.url)) {
                    target = item
                }
                i++
            }

            // Target found
            if(target) {
                // Parameters
                const parameters = getParameters(target.route, data.url)

                // Update
                this.parameters = parameters
                this.route = target.name

                // Run controller
                target.controller(parameters)
            }
        }).catch(() => {
            // Route has been block by a middleware
        })
    }

    /**
     * Series of promises
     * @param {Array<Function>} tasks 
     */
    _serie(tasks, ...params) {
        return new Promise((resolve, reject) => {
            if (tasks.length === 0) {
                resolve()
            }
            else {
                const funcs = tasks.map((promise, index) => {
                    return () => {
                        promise(...params).then(() => {
                            const next = funcs[index + 1];
                            if (next) {
                                next()
                            }
                            else {
                                resolve()
                            }
                        }).catch(reject)
                    }
                })
                funcs[0]()
            }
        })
    }

    /**
     * Goto the URL
     * @param {String} URL
     * @param {Object} options
     */
    goto(url, { target = null, title = null } = {}) {
        // PushState
        if (target === null || url.search(/^[a-z]+:\/\//) === -1) {
            history.pushState({}, document.title, url)
            this.run()
        }
        // New URL
        else {
            // Popup
            if (target === '_blank') {
                window.open(url, title)
            }
            // Location
            else {
                location.href = url
            }
        }
    }

    /**
     * Get the current URL
     * @returns {String}
     */
    get url() {
        return '/' + location.pathname.replace(this._pathRegex, '').replace(/^(.+)\/$/, '$1')
    }
}

export default new Router()
export { Router }