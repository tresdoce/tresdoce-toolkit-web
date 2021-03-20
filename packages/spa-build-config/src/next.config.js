const typescript = require('@zeit/next-typescript');
const withPlugins = require('next-compose-plugins');
const css = require('@zeit/next-css');
const images = require('next-images');
const babelConfig = require('./babelConfig');
const { configSourceMaps } = require('./sourceMap');
const shell = require('shelljs');
const fs = require('fs');
const { promisify } = require('util');
const { join, resolve } = require('path');

const copyFile = promisify(fs.copyFile);

const isProd = process.env.NODE_ENV === 'production';

const packageJson = require(join(process.cwd(), './package.json'));

const createBuildJson = (dir, outDir, distDir, buildId) => {
  const version = packageJson.version;
  const buildManifest = require(join(distDir, 'build-manifest.json'));

  // Get versions of Tresdoce UI and Tresdoce Toolkit
  const dependencies = Object.keys(packageJson.dependencies).reduce(
    (result, dep) => {
      if (dep.startsWith('@tresdoce')) {
        result[dep] = require(join(
          dir,
          `./node_modules/${dep}/package.json`
        )).version;
      }

      return result;
    },
    {}
  );

  // Get versions of Tresdoce UI and Tresdoce Toolkit
  const devDependencies = Object.keys(packageJson.devDependencies).reduce(
    (result, dep) => {
      if (dep.startsWith('@tresdoce')) {
        result[dep] = require(join(
          dir,
          `./node_modules/${dep}/package.json`
        )).version;
      }

      return result;
    },
    {}
  );

  const buildMetadata = {
    id: buildId,
    version,
    manifest: buildManifest,
    dependencies,
    devDependencies,
  };

  fs.writeFileSync(
    join(outDir, 'build.json'),
    JSON.stringify(buildMetadata, null, 2)
  );
};

const nextConfig = withPlugins([[typescript], [css], [images]], {
  exportPathMap: async function(
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    if (dev) {
      return defaultPathMap;
    }

    createBuildJson(dir, outDir, distDir, buildId);

    // Legacy. Eliminar cuando se ajuste la integración .net
    await copyFile(
      join(distDir, 'build-manifest.json'),
      join(outDir, 'build-manifest.json')
    );
    await copyFile(join(distDir, 'BUILD_ID'), join(outDir, 'BUILD_ID'));

    /*// Copy widgets
        if (fs.existsSync(join(distDir, 'widgets'))) {
            shell.cp('-R', join(distDir, 'widgets'), outDir);
        }*/

    return defaultPathMap;
  },
  webpack: function(config, options) {
    const originalEntry = config.entry;

    // Configuration for next.js entry, so we can add support for browser polyfills
    config.entry = async () => {
      const entries = await originalEntry();
      const clientPollifillsPath =
        './node_modules/@tresdoce-toolkit/spa-build-config/dist/client-polyfills.js';

      if (
        entries['main.js'] &&
        !entries['main.js'].includes(clientPollifillsPath)
      ) {
        entries['main.js'].unshift(clientPollifillsPath);
      }

      return entries;
    };

    // Custom Babel config
    if (!options.defaultLoaders.babel.options.presets) {
      options.defaultLoaders.babel.options.presets = [];
    }

    Array.prototype.push.apply(
      options.defaultLoaders.babel.options.presets,
      babelConfig.commonConfig.presets
    );

    if (!options.defaultLoaders.babel.options.plugins) {
      options.defaultLoaders.babel.options.plugins = [];
    }
    Array.prototype.push.apply(
      options.defaultLoaders.babel.options.plugins,
      babelConfig.commonConfig.plugins
    );

    const cwd = process.cwd();

    // Configuration for module-resolution based on aliases
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        '@lib': resolve(cwd, 'lib/'),
        '@config': resolve(cwd, 'config/'),
        '@contexts': resolve(cwd, 'contexts/'),
        '@components': resolve(cwd, 'components/'),
        '@containers': resolve(cwd, 'containers/'),
        '@hooks': resolve(cwd, 'hooks/'),
      },
    };

    // Configure font-loading via next-static
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 8192,
            fallback: 'file-loader',
            publicPath: '/_next/static/fonts/',
            outputPath: 'static/fonts/',
            name: '[name]-[hash].[ext]',
          },
        },
      ],
    });

    if (isProd) {
      // Configure next.js to transpile node_modules targeting IE, so every module that provides an ESM build, doesn't break in IE >= 10
      config.module.rules.push({
        test: /\.js$/,
        include: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  useBuiltIns: 'entry',
                  modules: false,
                  targets: {
                    // Recommended in: https://jamie.build/last-2-versions
                    browsers: ['>0.25%', 'ie 9', 'not op_mini all'],
                  },
                },
              ],
            ],
          },
        },
      });

      configSourceMaps(config, '/_next/');
    }

    return config;
  },
  assetPrefix: isProd ? process.env.CDN_URL || '' : '',
  generateBuildId: async () => {
    if (process.env.CUSTOM_BUILD_ID) {
      return process.env.CUSTOM_BUILD_ID;
    }

    return null;
  },
});

module.exports = nextConfig;
