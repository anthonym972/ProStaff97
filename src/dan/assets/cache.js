const assets = {}

/**
 * Add a new asset in the cache
 * @param {String} id - Asset id 
 * @param {*} asset - Asset Object
 */
function addInCache(id, asset) {
    if (assets[id]) {
        throw new Error('Asset "' + id + '" is already in cache')
    }
    assets[id] = asset
}

/**
 * Remove an asset from the cache
 * @param {String} id - Asset id
 */
function removeFromCache(id) {
    delete assets[id]
}

/**
 * Get an item from the cache
 * @param {String} id - Asset id
 * @return {*} Targeted asset or null
 */
function getFromCache(id) {
    return assets[id] || null
}

export { addInCache, removeFromCache, getFromCache }