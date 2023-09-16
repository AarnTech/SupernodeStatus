const { createProxyMiddleware } = require('http-proxy-middleware');
const proxy = {
    target: 'http://wan5.servebeer.com:18690',
    changeOrigin: true
}
module.exports = function(app) {
  app.use(
    '/debug',
    createProxyMiddleware(proxy)
  );
};