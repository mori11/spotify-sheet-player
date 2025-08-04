const http = require('http');
const httpProxy = require('http-proxy');

// Create proxy
const proxy = httpProxy.createProxyServer({
  target: 'http://localhost:3000',
  changeOrigin: false,
  ws: true
});

// Create server
const server = http.createServer((req, res) => {
  console.log(`Proxying request: ${req.method} ${req.url}`);
  proxy.web(req, res, {}, (err) => {
    console.error('Proxy error:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Proxy error');
  });
});

// Handle WebSocket upgrades
server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head);
});

// Listen on 127.0.0.1:8888
server.listen(8888, '127.0.0.1', () => {
  console.log('Simple proxy server running on http://127.0.0.1:8888');
  console.log('Forwarding all requests to http://localhost:3000');
});