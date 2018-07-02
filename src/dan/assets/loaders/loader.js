import { addInCache, removeFromCache } from '../cache'

// Loader status
const LoaderAssetStatus = {
    Progress: 0,
    Complete: 1,
    Error: 2
}

/**
 * Loader abstract class
 * @param {String} header  - Adress (URL, function, ...)
 * @param {Object} options - Options (cache, size)
 */
class LoaderAsset {
    constructor(header, { size = 1, cache = false, attributes = null }) {
        this.header = header
        this.body = null
        this.size = size
        this.status = LoaderAssetStatus.Progress
        this._cache = cache
        this._fetch = null
        this.attributes = attributes
    }

    /**
     * Start loading
     */
    load() {
        return new Promise((resolve, reject) => {
            // Already loaded
            if (this.status === LoaderAssetStatus.Complete) {
                resolve(this.body)
            }
            else {
                // Start
                if (this._fetch === null) {
                    this._fetch = this.fetch()

                    // Cache
                    this.cache = this._cache
                }

                // Wait
                this._fetch.then((body) => {
                    // Complete
                    this.status = LoaderAssetStatus.Complete
                    this.body = body

                    // Attributes
                    if(typeof body === 'object') {
                        for(let id in this.attributes) {
                            if(body[id] === undefined) {
                                body[id] = this.attributes[id]
                            }
                        }
                    }

                    resolve(body)
                }).catch((error) => {
                    // Error
                    this.status = LoaderAssetStatus.Error
                    this.body = null
                    reject(error)
                })
            }
        })
    }

    /**
     * Fetch the body asset
     */
    fetch() {
        return new Promise(function (resolve, reject) {
            reject('fetch() is not impleted')
        })
    }

    /**
     * Get cache status
     * @returns {Boolean}
     */
    get cache() {
        return this._cache
    }

    /**
     * Set cache status
     * @param {Boolean} cache - Cache status
     */
    set cache(cache) {
        // Add
        if (cache) {
            addInCache(this.id, this)
        }
        // Remove
        else {
            removeFromCache(this.id, this)
        }

        this._cache = cache
    }
}

export default LoaderAsset
export { LoaderAsset, LoaderAssetStatus }