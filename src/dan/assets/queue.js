import {getAssetLoader, LoaderAssetStatus} from './loaders'
import uniqid from 'uniqid'
import {addRafOnce} from 'dan/raf'
import Signal from 'signal'

/**
 * Assets queue
 */
export default class AssetQueue {
    /**
     * Constructor
     * @param {Object} [options] - Options (cache, size)
     */
    constructor({ cache = false, size = 0 } = {}) {
        this._assets = {}
        this.cache = cache

        this._size = size
        this._autoSize = size < 1
        this._needsUpdate = false

        // Events
        this.onProgress = new Signal()
        this.onComplete = new Signal()
        this.onError = new Signal()
    }

    /**
     * Alias for removeListener
     */
    off() {
        this.removeListener.apply(this, arguments);
    }

    /**
     * Add a new asset to load
     * @param {*} header - Asset adress (URL, function, ...)
     * @param {Object} [options] - Asset options (cache, id, size)
     */
    add(header, options = {}) {
        // Id
        options.id = typeof options.id === 'string'
            ?options.id
            :typeof header === 'string'
                ?header
                :uniqid()
        
        // Cache
        options.cache = typeof options.cache === 'boolean'
            ?options.cache
            :this.cache
        
        // Get asset loader
        const loader = getAssetLoader(header, options)
        this._assets[options.id] = loader

        // Size
        if(this._autoSize) {
            this._size += loader.size
        }

        // Load
        const loading = loader.load()

        loading.then((body) => {
            this._update()
        }).catch((error) => {
            this.onError.dispatch(error)
            this._update()
        })
        
        return loading
    }

    /**
     * Control group status
     */
    _update() {
        // Skip if queue was already waiting for update
        if(this._needsUpdate) {
            return
        }

        this._needsUpdate = true
        addRafOnce(() => {
            this._needsUpdate = false

            // Percent
            const percent = this.progress

            // Progress
            this.onProgress.dispatch(percent)
    
            // Complete
            if(percent >= 1) {
                this.onComplete.dispatch()
            }
        })
    }

    /**
     * Remove an asset to the queue
     * @param {String} id - Asset id
     */
    remove(id) {
        delete this._assets[id];
    }

    /**
     * Total items size to load
     * @return {number}
     */
    get progress() {
        let progress = 0,
            asset

        for(let id in this._assets) {
            asset = this._assets[id]

            // Complete or error
            if(asset.status !== LoaderAssetStatus.Progress) {
                progress = progress + asset.size
            }
        }

        // Percent
        return progress / this._size
    }

    /**
     * Get an asset by id
     * @param {String} id - Asset id
     * @returns {*} - Asset body
     */
    get(id) {
        const asset = this._assets[id]
        if(asset) {
            return asset.body
        }
        else {
            return null
        }
    }

    /**
     * Get asset attributes
     * @param {*} id  - Asset id
     * @return {Object} Attributes
     */
    attributes(id) {
        const asset = this._assets[id]
        if(asset) {
            return asset.attributes
        }
        else {
            return null
        }
    }

    /**
     * Get all assets
     * @returns {Object}
     */
    get assets() {
        const assets = {}
        for(let id in this._assets) {
            assets[id] = this._assets[id].body
        }
        return assets
    }
}

export {AssetQueue}