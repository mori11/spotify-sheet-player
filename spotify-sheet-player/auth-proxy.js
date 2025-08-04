const express = require('express');
const httpProxy = require('http-proxy-middleware');
const app = express();

// Create proxy middleware
const proxy = httpProxy.createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
  ws: true,
  logLevel: 'debug'
});

// Use proxy for all requests
app.use('*', proxy);

// Listen on 127.0.0.1:8888
const server = app.listen(8888, '127.0.0.1', () => {
  console.log('Auth proxy server running on http://127.0.0.1:8888');
  console.log('Proxying all requests to http://localhost:3000');
});