module.exports = {
  webpack: (config, { api, options }) => {
    const chain = api.resolveChainableWebpackConfig();
    const existingPlugins = chain.plugins.values().map(item => item.name);
    const allowedPlugins = [
      'vue-loader',
      'friendly-errors',
      'no-emit-on-errors',
      'extract-css',
      'optimize-css',
      'hash-module-ids',
    ];

    existingPlugins.forEach((plugin) => {
      if (!allowedPlugins.includes(plugin) && !options.allowedPlugins.includes(plugin)) {
        chain.plugins.delete(plugin);
      }
    });

    const resolvedConfig = chain.toConfig();

    return {
      ...config,
      plugins: [...config.plugins, ...resolvedConfig.plugins],
      module: {
        ...config.module,
        ...resolvedConfig.module,
      },
      resolve: {
        ...resolvedConfig.resolve,
        alias: {
          ...resolvedConfig.resolve.alias,
          vue$: require.resolve('vue/dist/vue.esm.js'),
        },
      },
      resolveLoader: resolvedConfig.resolveLoader,
    };
  },
  webpackFinal: config => ({
    ...config,
    module: {
      ...config.module,
      // Remove duplicate rules added by storybook
      // https://github.com/storybooks/storybook/blob/v4.1.0/lib/core/src/server/preview/base-webpack.config.js
      rules: config.module.rules.slice(0, -3),
    },
  }),
};
