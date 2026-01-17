// javascript
const { createProxyMiddleware } = require('http-proxy-middleware');

console.log('[setupProxy] loaded');

module.exports = function (app) {
    const apiTarget = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    // Absolute earliest confirmation that CRA's Express received /api/*
    app.use('/api', (req, res, next) => {
        console.log(
            `[api EARLY] ${req.method} ${req.url} host=${req.headers.host} accept=${req.headers.accept}`
        );
        next();
    });

    app.use(
        '/api',
        createProxyMiddleware({
            target: apiTarget,
            changeOrigin: true,
            secure: false,
            ws: false,

            // Make proxy activity visible regardless of version differences
            logger: console,

            // Ensure the backend receives the expected path (no /api prefix)
            pathRewrite: (path) => '/api'+path,

            // v3+ event hook API
            on: {
                proxyReq: (proxyReq, req) => {
                    console.log(
                        `[proxy req] ${req.method} ${req.url} -> ${apiTarget}${req.url}`
                    );
                },
                proxyRes: (proxyRes, req) => {
                    console.log(
                        `[proxy res] ${req.method} ${req.url} -> ${proxyRes.statusCode}`
                    );
                },
                error: (err, req, res) => {
                    console.error('[proxy error]', err && err.message ? err.message : err);
                    if (res && !res.headersSent) {
                        res.writeHead(502, { 'Content-Type': 'text/plain' });
                    }
                    res && res.end && res.end(`Proxy Error connecting to ${apiTarget}`);
                },
            },
        })
    );

    // If this logs, proxy did not take the request
    app.use('/api', (req, res) => {
        console.log(`[api FALLBACK] ${req.method} ${req.url}`);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Reached /api fallback instead of proxy');
    });
};
