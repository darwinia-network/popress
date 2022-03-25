module.exports = {
  babel: {
    presets: ['@babel/preset-env'],
  },
  webpack: {
    // add mjs compatibility configuration
    configure: (config) => {
      config.module.rules.push({
        test: /\.js$/,
        loader: require.resolve('@open-wc/webpack-import-meta-loader'),
      });

      config.module.rules.push({
        test: /\.js$/,
        include: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env']
          }
        }
      });

      return config;
    },
  },
};
