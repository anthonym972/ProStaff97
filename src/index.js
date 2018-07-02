import config from 'config'
import { use, start, i18n, router } from 'dan'
import webfonts from 'dan/webfonts'
import app from './app'

// Config
const { locale, locales, assets, path, fonts, files } = config

// Router
use(router.config({ app }))

// I18n
use(i18n.config({
    api: `${assets}locales/{locale}/{file}.json`
}))

// Webfonts
use(webfonts.config({
    timeout: 10000, // ms
    async: true,
    fonts
}))

// Launch the app
start().catch((e) => {
    throw new Error('Failed to start the App:\n\n' + e)
})
