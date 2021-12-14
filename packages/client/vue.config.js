const path = require("path");

module.exports = {
  lintOnSave: false,
  configureWebpack: {
    resolve: {
      alias: {
        "@shared-core": path.resolve(__dirname, "../shared-core/"),
      },
      // modules: [
      //   path.resolve(__dirname, 'node_modules'),
      //   'node_modules',
      // ],
    },
    // resolveLoader: {
    //   modules: [
    //     path.resolve(__dirname, 'node_modules'),
    //     'node_modules',
    //   ],
    // },
    devtool: "source-map",
  },
};
