import LoaderAsset from './loader'

/**
 * Function asset loader
 */
export default class LoaderFunction extends LoaderAsset {
    /**
     * Test if url is valid
     * @param {String} header
     */
    static match(header) {
        return typeof header === 'function'
    }

    /**
     * Fetch RAW asset
     */
    fetch() {
        return new Promise((resolve, reject) => {
            this.header().then(resolve).catch((error) => {
                reject('Failed to load asset Function ' + this.header)
            })
        })
    }
}