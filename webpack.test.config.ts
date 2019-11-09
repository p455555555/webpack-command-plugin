import { resolve } from 'path';
import webpack from 'webpack';
import WebpackCommandPlugin from './dist';

const config: webpack.Configuration =  {
    watch: true,
    entry: resolve(__dirname, './test/entry.js'),
    output: {
        path: resolve(__dirname, './test/dist'),
        filename: 'bundle.js'
    },
    /*devServer: {
        contentBase: path.resolve(__dirname, 'test')
    },*/
    module: {
        rules: [
            { test: /\.css$/, loader: 'css-loader' }
        ]
    },
    mode:'development',
    plugins: [
        new WebpackCommandPlugin({onBuildStart:'node ./test/test.js', onBuildEnd:'echo "Webpack End"'}),
        new webpack.HotModuleReplacementPlugin()
    ]
};

export default config;
