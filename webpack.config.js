const path = require('path')
const { EnvironmentPlugin } = require('webpack')

const devOptions = process.env.NODE_ENV === 'development'? {
    devServer: {
        historyApiFallback: true
    },
    mode: 'development',
    devtool: 'source-map'
} : {}

module.exports = Object.assign({
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
    
    plugins: [
        new EnvironmentPlugin({
            NODE_ENV: 'development'
        })
    ]
}, devOptions);