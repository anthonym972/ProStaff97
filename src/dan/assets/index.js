import {getFromCache as getAssetFromCache} from './cache'
import {AssetQueue} from './queue'

/**
 * Create a new assets queue
 * @param {Object} [options] - Queue options
 */
function newQueue(options) {
    return new AssetQueue(options)
}

/**
 * Get body asset from cache
 * @param {String} id 
 * @return {*} Asset body or null
 */
function getFromCache(id) {
    const asset = getAssetFromCache(id)
    if(asset) {
        return asset.body
    }
    else {
        return null
    }
}

/**
 * Load an anonymous asset
 * @param {String} header - Asset adress (URL, function, ...)
 * @param {Options} [options]
 */
function loadAsset(header, options) {
    return newQueue().add(header, options)
}

export default newQueue
export {loadAsset, newQueue, getFromCache}