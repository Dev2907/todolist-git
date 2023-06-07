const proxy = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    proxy({
      target: "http://localhost:3000", // Replace with your Express server address
      changeOrigin: true,
    })
  );
};
