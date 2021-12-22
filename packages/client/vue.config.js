const path = require("path");

module.exports = {
  lintOnSave: false,
  configureWebpack: {
    resolve: {
      alias: {
        "@shared-core": path.resolve(__dirname, "../shared-core/"),
      },
    },
    devtool: "source-map",
  },
};
