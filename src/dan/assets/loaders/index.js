// Cache
import { getFromCache, addInCache, removeFromCache } from '../cache'
import { LoaderAsset, LoaderAssetStatus } from './loader'

// Loaders
import raw from './raw'
import func from './function'
import image from './image'
import video from './video'
import json from './json'

const LOADERS = [
    json,
    image,
    video,
    func,
    raw,
], defaultsLoaders = LOADERS.length

/**
 * Add a new asset loader
 * @param {*} loader 
 */
function addAssetLoader(loader) {
    LOADERS.splice(LOADERS.length - defaultsLoaders, 0, loader)
}

/**
 * Generate an asset loader with this footprint
 * @param {*} header - Asset adress (URL, function, ...)
 * @param {String} options - Options with an id
 */
function getAssetLoader(header, options) {
    let loader = getFromCache(options.id)

    // Cache
    if (loader) {
        return loader
    }

    // Generate
    let Loader
    for (let i = 0; i < LOADERS.length; i++) {
        Loader = LOADERS[i]
        // Loader found
        if (Loader.match(header)) {
            loader = new Loader(header, options)
            loader.id = loader.id || options.id || header
            return loader
        }
    }

    // Unknow file format
    throw new Error('Asset file format "' + header + '" is not suported')
}

export {
    getAssetLoader,
    addAssetLoader,
    LoaderAsset,
    LoaderAssetStatus,
    getFromCache,
    removeFromCache
}