import i18n from './i18n'
import router from './router'
import * as routes from '../routes'
import app from 'app'

const tasks = []

/**
 * Add a new setup module
 * @param {Promise} setup 
 */
function use(setup) {
    tasks.push(setup)
}

/**
 * Start the app
 * @returns {Promise}
 */
function start() {
    return new Promise((resolve, reject) => {
        Promise.all(tasks).then(() => {
            for(let id in routes) {
                router.add(id, routes[id])
            }
            
            router.start().then(() => {
                app.ready = true
                resolve()
            }).catch(reject)
        })
    })
}

// Export
export {use, start, i18n, router}