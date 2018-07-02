// JS
module.exports = ({ include, exclude, browsers, dev = false }) => {
    const loaders = [
        {
            loader: 'babel-loader',
            options: {
                presets: [
                    "react",
                    [
                        "env", {
                            "targets": {
                                "browsers": browsers
                            },
                            "modules": false
                        },
                    ],
                ],
            },
        }
    ]

    // Dev modules
    if(dev) {
        loaders.unshift({
            loader: 'hot-css-loader'
        })
    }

    return {
        module: {
            rules: [
                {
                    test: /\.js$/,
                    include,
                    exclude,
                    use: loaders,
                },
            ],
        },
    }
}