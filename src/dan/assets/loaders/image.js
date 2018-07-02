import LoaderAsset from './loader'

/**
 * Image asset loader
 */
export default class LoaderImage extends LoaderAsset {
    /**
     * Test if url is valid
     * @param {String} header
     */
    static match(header) {
        return typeof header === 'string' && header.search(/\.(png|jpeg|jpg|.bmp)$/) !== -1
    }

    /**
     * Fetch RAW asset
     */
    fetch() {
        return new Promise((resolve, reject) => {
            const image = new Image()
            image.crossOrigin = 'Anonymous';

            const clear = () => {
                image.onload = null
                image.onerror = null
            }

            // Events
            image.onload = () => {
                clear()
                resolve(image)
            }
            image.onerror = () => {
                clear()
                reject('Failed to load Image ' + this.header)
            }

            // Fetch
            image.src = this.header
        })
    }
}