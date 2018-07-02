import WebFont from 'webfontloader'

function config({ fonts, timeout, async }) {
    return new Promise((resolve, reject) => {
        const config  = {
            custom: {
                families: fonts
            },
            timeout: timeout
        }

        // Wait font loading completed
        if(!async) {
            config.active = resolve
            config.inactive = resolve
        }

        // Load
        WebFont.load(config)

        // Async
        if(async) {
            resolve()
        }
    })
}

export default {
    config
}