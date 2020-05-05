const path = require('path')
const { EnvironmentPlugin } = require('webpack')

module.exports = {
    entry: path.join(__dirname, 'src', 'index'),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/static/'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            include: /src/,
            use: 'babel-loader',
        }]
    },
    devServer: {
        historyApiFallback: true
    },
    plugins: [
        new EnvironmentPlugin({
            NODE_ENV: 'development'
        })
    ]
};