const fs = require('fs')
const path = require('path')
const paths = require('../paths')

// Locales
const locales = []
const files = []
const regex = /^(.*)\.json$/
fs.readdirSync(paths.locales).forEach((locale) => {
    const localePath = paths.locales+'/'+locale

    // Only directory
    if(fs.lstatSync(localePath).isDirectory()) {
        locales.push(locale)

        // Files
        fs.readdirSync(localePath).forEach((file) => {
            const match = file.match(regex)
            if(match && files.indexOf(match[1]) === -1) {
                files.push(match[1])
            }
        });
    }
})

exports.files = () => {
    return '[' + files.reduce((value, file, index) => {
        return value + "'" + file + "'" + (index !== files.length - 1 ? ', ' : '')
    }, '') + ']'
}

exports.locales = () => {
    return '[' + locales.reduce((value, locale, index) => {
        return value+ "'" + locale + "'" + (index !== locales.length - 1 ? ',' : '')
    }, '') + ']'
}

exports.locale = () => {
    return locales[0]
}