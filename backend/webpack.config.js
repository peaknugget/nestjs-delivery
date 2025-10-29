const webpack = require('webpack');
const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = function (options) {
  return {
    ...options,
    target: 'node', // ✅ Node.js 환경으로 명시
    devtool: 'source-map',
    resolve: {
      extensions: ['.ts', '.js', '.json'],
      plugins: [
        new TsconfigPathsPlugin({
          configFile: path.resolve(__dirname, 'tsconfig.json'), // ✅ 루트 tsconfig.json 읽도록
        }),
      ],
      // fallback: {
      //   crypto: require.resolve('crypto-browserify'),
      //   stream: require.resolve('stream-browserify'),
      //   buffer: require.resolve('buffer'),
      //   process: require.resolve('process/browser'),
      // },
      fallback: {
        // ✅ 브라우저 폴리필 제거
        crypto: false,
        stream: false,
        buffer: false,
        process: false,
      },
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    // plugins: [
    //   new webpack.ProvidePlugin({
    //     Buffer: ['buffer', 'Buffer'],
    //     process: 'process/browser',
    //     crypto: 'crypto', // crypto-browserify를 사용하도록
    //   }),
    // ],
    plugins: [
      // ✅ Node 환경에선 ProvidePlugin 필요 없음 (삭제)
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
      }),
    ],
  };
};
