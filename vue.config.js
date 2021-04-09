const vueConfig = {
  publicPath: "/",
  outputDir: "build",
  devServer: {
    port: 8000,
    proxy: {
      "^/api": {
        target: "http://localhost:9090",
        ws: false,
        changeOrigin: true,
      },
    },
    disableHostCheck: true,
  },
  // disable source map in production
  productionSourceMap: false,
  lintOnSave: undefined,
  transpileDependencies: [],
};
module.exports = vueConfig;
