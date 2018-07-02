import LoaderAsset from './loader'

/**
 * JSON asset loader
 */
export default class LoaderJSON extends LoaderAsset {
    /**
     * Test if url is valid
     * @param {String} header
     */
    static match(header) {
        return typeof header === 'string' && header.search(/\.json$/) !== -1
    }

    /**
     * Fetch RAW asset
     */
    fetch() {
        return new Promise((resolve, reject) => {
            fetch(this.header, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  credentials: 'include'
            }).then((response) => {
                response.json().then((body) => {
                    resolve(body)
                }).catch(() => {
                    reject('Failed to parse JSON ' + this.header)
                })
            }).catch(() => {
                reject('Failed to load JSON ' + this.header)
            })
        })
    }
}