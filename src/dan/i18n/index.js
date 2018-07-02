import config from 'config'
import router from 'dan/router'
import { newQueue } from 'dan/assets'
import Signal from 'signal'

/**
 * Gets the value at path of object. If the resolved value is undefined, the defaultValue is returned in its place.
 * @param {*} obj - Targeted object
 * @param {*} path - Object path
 * @param {*} def - Default value
 */
function get(obj, path, def) {
	var fullPath = path
		.replace(/\[/g, '.')
		.replace(/]/g, '')
		.split('.')
		.filter(Boolean);

	return fullPath.every(everyFunc) ? obj : def;

	function everyFunc(step) {
		return !(step && (obj = obj[step]) === undefined);
	}
}

/*
 * I18n
 */
class I18n {
    /**
     * Constructor
     */
    constructor() {
        this._locales = [] // Supported locales
        this._locale = null // Current locale
        this._files = [] // Files to localized
        this._url = new RegExp() // Regex for extract the locales from the browser location
        this._api = null // Path for the key/values files
        this._queue = newQueue() // Download queue

        // Signals
        this.onChange = new Signal() // Change event
    }

    /**
     * Setup the i18n module
     * @param {Object} options - Configs parameters (api, files, path, locales, locale)
     */
    config({ api, files = config.files, path = config.path, locales = config.locales, locale = config.locale }) {
        // Get locale form the url

        this._url = new RegExp(`^${path}(${locales.join('|')})/?`)
        router.use(({ url }) => {
            return new Promise((resolve, reject) => {
                const newLocale = this.getLocaleFromURL(location.pathname, locale)

                // New locale
                if (this._locale !== newLocale) {
                    // TODO: change locale
                    reject()
                }
                else {
                    resolve()
                }
            })
        })

        // Setup
        this._api = api
        this._files = files

        // Setup the default locale
        this._locale = this.getLocaleFromURL(location.pathname, locale)
        return this.sync()
    }

    /**
     * Synchronise the i18n files
     * @param {String} [locale] - Locale to sync
     * @param {String} [files] - Files to sync
     * @return {Promise}
     */
    sync(locale = this._locale, files = this._files) {
        return new Promise((resolve, reject) => {
            // New locale
            if (this._locales[locale] === undefined) {
                this._locales[locale] = {}
            }

            // Load files
            Promise.all(files.map((file) => {
                let item = this._locales[locale][file]

                // Start loading
                if (item === undefined) {
                    item = this._queue.add(this._api.replace('{locale}', locale).replace('{file}', file))
                    item.then((content) => {
                        this._locales[locale][file] = content
                    }).catch((e) => {
                        this._locales[locale][file] = undefined
                    })
                    this._locales[locale][file] = item
                    return item
                }
                // Downloading ...
                if (item && typeof (item.then) === 'function') {
                    return item
                }
            })).then(resolve).catch(reject)
        });
    }

    /**
     * Localize a key, return the key if not found
     * @param {String} key - Key to localize
     * @param {Object} [params] - Parameters in {}
     * @param {String} [file] - File were key is localised
     * @param {String} [locale]  - Targeted locale
     * @returns {String}
     */
    localize(key, params = {}, file = this._files[0], locale = this._locale) {
        return this.with(key, params, file, locale) || key
    }

    /**
     * Localize a key, return null if not found
     * @param {String} key - Key to localize
     * @param {Object} [params] - Parameters in {}
     * @param {String} [file] - File were key is localised
     * @param {String} [locale]  - Targeted locale
     * @returns {String}
     */
    with(key, params = {}, file = this._files[0], locale = this._locale) {
        // Seek
        let output = (
            this._locales[locale] &&
            this._locales[locale][file]
        ) ? get(this._locales[locale][file], key, null) : null

        // Params
        for (var id in params) {
            output = output.replace(new RegExp(`\\\{${id}\\\}`, 'g'), params[id]);
        }

        return output
    }

    /**
     * Get a localized file
     * @param {String} file - File name 
     * @param {String} locale - Targeted locale
     * @returns {Array}
     */
    getFile(file, locale = this._locale) {
        return this._locales[locale] && this._locales[locale][file]
            ? this._locales[locale][file]
            : null
    }

    /**
     * Get the current locale
     * @return {String}
     */
    get locale() {
        return this._locale
    }

    /**
     * Set a new current locale
     * @param {String} [locale] New locale
     */
    set locale(locale) {
        this._locale = locale
        this.sync()
    }

    /**
     * Get the locale URL
     * @param {String} path - URL pathname
     * @param {String} locale - Default locale
     * @returns {String}
     */
    getLocaleFromURL(path, locale) {
        const data = path.match(this._url)
        if (data) {
            return data[1]
        }
        return locale
    }
}

export { I18n }
export default new I18n()