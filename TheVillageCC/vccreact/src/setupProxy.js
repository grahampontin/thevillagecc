const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Get the target API URL from environment variable or use default
  const apiTarget = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  app.use(
    '/api',
    createProxyMiddleware({
      target: apiTarget,
      changeOrigin: true,
      logLevel: 'debug',
      onProxyReq: (proxyReq, req, res) => {
        console.log(`[Proxy] ${req.method} ${req.path} -> ${apiTarget}${req.path}`);
      },
      onError: (err, req, res) => {
        console.error('[Proxy Error]', err);
        res.status(500).send('Proxy Error: Unable to connect to backend API server');
      }
    })
  );
};
