import http from 'http';
import httpProxy from 'http-proxy';
import { getConfig } from './config';

let currentTarget = getConfig().target;

const proxy = httpProxy.createProxyServer({});

export function setProxyTarget(target: string) {
  currentTarget = target;
}

export function startProxyServer(port = 3001) {
  const server = http.createServer((req, res) => {
    proxy.web(req, res, { target: currentTarget, changeOrigin: true }, err => {
      res.writeHead(502, { 'Content-Type': 'text/plain' });
      res.end('Proxy error: ' + err?.message);
    });
  });
  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Proxy listening on http://localhost:${port} → ${currentTarget}`);
  });
  return server;
}
