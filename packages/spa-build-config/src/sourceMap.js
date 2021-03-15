const { join } = require('path');
const webpack = require('webpack');
const packageJson = require(join(process.cwd(), './package.json'));

const configSourceMaps = (config, baseLocation = '/') => {
  config.devtool = false;
  config.plugins = config.plugins || [];

  const isDevBuild = (process.env.JOB_NAME || '').endsWith('-dev');
  const componentName = packageJson.name.startsWith('@')
    ? packageJson.name.split('/')[1]
    : packageJson.name;

  const publicPath =
    `https://cdn.statically.io/${componentName}/` +
    (isDevBuild ? 'dev' : packageJson.version) +
    baseLocation;

  config.plugins.push(
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map',
      publicPath,
    })
  );

  if (config.optimization && config.optimization.minimizer) {
    for (const plugin of config.optimization.minimizer) {
      if (plugin.constructor.name === 'TerserPlugin') {
        plugin.options.sourceMap = true;
        break;
      }
    }
  }
};

module.exports = { configSourceMaps };
