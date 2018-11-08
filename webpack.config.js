const path = require('path');


module.exports = {
    entry: {
        index: ['babel-polyfill' , './src/index.js'],
        dashboard: ['babel-polyfill', './src/dashboard.js'],
        profile: ['babel-polyfill', './src/profile.js'],
        favorites: ['babel-polyfill', './src/favorites.js']
    },
    output: {
        path: path.resolve(__dirname, 'public/scripts'),
        filename: '[name]-bundle.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_module/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env'],
                    plugins: ['transform-object-rest-spread']
                }
            }
        }]
    },
    devServer:{
        contentBase: path.resolve(__dirname, 'public'),
        publicPath: '/scripts/'
    },
    devtool: 'source-map'
}