const commonConfig = {
  presets: ['@zeit/next-typescript/babel'],
  plugins: ['babel-plugin-idx'],
};

const testConfig = {
  ...commonConfig,
  presets: ['next/babel', ...commonConfig.presets],
};

module.exports = {
  commonConfig,
  testConfig,
};
