module.exports = async ({ config }) => {
  // Configure CSS handling
  config.module.rules.push({
    test: /\.css$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          importLoaders: 1,
        }
      },
      'postcss-loader',
    ],
    include: /\.css$/,
  });

  return config;
}; 