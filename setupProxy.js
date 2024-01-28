import { createProxyMiddleware } from "http-proxy-middleware";

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://s4.anilist.co",
      changeOrigin: true,
      pathRewrite: {
        "^/api": "",
      },
    })
  );
};
