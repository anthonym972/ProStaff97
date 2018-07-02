const fs = require('fs')
const path = require('path')
const paths = require('../paths')

const FONTS_FOLDER = 'fonts'
const FORMATS = ['eot', 'ttf', 'woff', 'svg']

// Get fonts list
const test = new RegExp('\.(' + FORMATS.join('|') + ')$', 'i')
const fontsPath = path.join(paths.assets, FONTS_FOLDER)
const fonts = []
fs.readdirSync(fontsPath).forEach((name) => {
    if (fs.lstatSync(path.join(fontsPath, name)).isDirectory()) {
        // Formats
        const formats = {}
        fs.readdirSync(path.join(fontsPath, name)).forEach((file) => {
            const match = file.match(test)
            if (match) {
                formats[match[1].toLowerCase()] = FONTS_FOLDER + '/' + name + '/' + file
            }
        })

        // Add
        fonts.push({
            name,
            formats
        })
    }
})
// console.log('fonts', fonts)
// JS
exports.js = () => {
    return '[' + fonts.reduce((value, font, index) => {
        return value + "'" + font.name + "'" + (index !== fonts.length - 1 ? ',' : '')
    }, '') + ']'
}

// SASS
exports.sass = () => {
    let data = ''

    fonts.forEach(({ name, formats }) => {
        data += `
@font-face {
    font-family: "${name}";
`
        if(formats.eot) {
            data += `    src: url($path+"${formats.eot}");
    src: url($path+"${formats.eot}?#iefix") format("embedded-opentype"), `
        }
        else {
            data += 'src: '
        }
        if(formats.woff) {
            data += `url($path+"${formats.woff}") format("woff"), `
        }
        if(formats.ttf) {
            data += `url($path+"${formats.ttf}") format("truetype"), `
        }
        if(formats.svg) {
            data += `url($path+"${formats.svg}#${name}") format("svg")`
        }
        data += `;
    font-style: normal;
    font-weight: normal;
    text-rendering: optimizeLegibility;
}
`
    })

    data = `@mixin configWebFonts() {
    ${data}
}`

    return data
}