// YAML
module.exports = () => ({
    module: {
        rules: [
            {
                test: /\.yaml$/,
                use: [
                    {
                        loader: 'json-loader'
                    },
                    {
                        loader: 'yaml-loader'
                    }
                ]
            }
        ]
    }
})