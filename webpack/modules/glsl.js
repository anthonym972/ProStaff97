// GLSL
module.exports = () => ({
    module: {
        rules: [
            {
                test: /\.(glsl|frag|vert)$/,
                use: [
                    {
                        loader: "raw-loader"
                    },
                    {
                        loader: 'glslify-loader'
                    }
                ],
            },
        ]
    }
})