import Is from 'dan/is'
import LoaderAsset from './loader'

const VIDEO_LOADER_TYPE = {
    TAG: 'tag',
    BLOB: 'blob'
}
export { VIDEO_LOADER_TYPE }

/**
 * Image asset loader
 */
export default class LoaderVideo extends LoaderAsset {
    /**
     * Test if url is valid
     * @param {String} header
     */
    static match(header) {
        return typeof header === 'string' && header.search(/\.(mp4)$/) !== -1
    }

    /**
     * Constructor
     * @param {String} header 
     * @param {Object} options 
     */
    constructor(header, options) {
        super(header, options)

        const {
            type = VIDEO_LOADER_TYPE.TAG,
            muted = true,
            autoplay = false,
            controls = false,
            loop = false,
        } = options

        // Loader type
        this._type = type

        // Videos options
        this._autoplay = autoplay
        this._controls = controls
        this._loop = loop
        this._muted = autoplay && Is.ios?true:muted
    }

    /**
     * Fetch video asset
     * @returns {Promise}
     */
    fetch() {
        return this._type === VIDEO_LOADER_TYPE.BLOB
            ? this._fetchWithBlob()
            : this._fetchWithTag()
    }

    /** 
     * Fetch the video with a XMLHttpRequest
     */
    _fetchWithBlob() {
        return new Promise((resolve, reject) => {
            const video = this._generateVideoTag()

            // Request
            const req = new XMLHttpRequest()
            req.open('GET', this.header, true)
            req.responseType = 'blob'

            req.onload = function () {
                // Ready
                if (this.status === 200) {
                    video.src = URL.createObjectURL(this.response)
                    resolve(video)
                }
                else {
                    reject(this._videoError);
                }
            }

            // Error
            req.onerror = function () {
                reject(this._videoError)
            }

            req.send();
        })
    }

    /**
     * Fetch the video with an html tag
     * @returns {Promise}
     */
    _fetchWithTag() {
        return new Promise((resolve, reject) => {
            const video = this._generateVideoTag()
            video.setAttribute("preload", true)
            video.setAttribute("loop", this._loop)
            
            // Clear
            const clear = () => {
                video.removeEventListener('canplaythrough', onCanPlay)
                video.removeEventListener('error', onError)
            }

            // Ready
            const onCanPlay = () => {
                clear()
                resolve(video)
            }

            // Error
            const onError = () => {
                clear()
                reject(this._videoError)
            }

            video.addEventListener('canplaythrough', onCanPlay)
            video.addEventListener('error', onError)

            video.src = this.header
        })
    }

    /**
     * Create a video html tag
     * @return {HTMLEntity}
     */
    _generateVideoTag() {
        const video = document.createElement('video')
        video.setAttribute("playsinline", true)
        video.setAttribute("muted", this._muted)
        video.setAttribute("controls", this._controls)
        video.setAttribute("autoplay", this._autoplay)
        video.setAttribute("loop", this._loop)

        video.muted = this._muted
        video.loop = this._loop
        
        return video
    }

    get _videoError() {
        return 'Failed to load video ' + this.header
    }
}