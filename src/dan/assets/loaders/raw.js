import LoaderAsset from './loader'

/**
 * URL raw asset loader
 */
export default class LoaderRAW extends LoaderAsset {
    /**
     * Test if url is valid
     * @param {String} header
     */
    static match(header) {
        return typeof header === 'string'
    }

    /**
     * Fetch RAW asset
     */
    fetch() {
        return new Promise((resolve, reject) => {
            fetch(this.header, {
                headers: {
                  credentials: 'include'
                }
            }).then((response) => {
                resolve(response.text())
            }).catch(() => {
                reject('Failed to load RAW ' + this.header)
            })
        })
    }
}