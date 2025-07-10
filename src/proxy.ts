import http from "http";
import httpProxy from "http-proxy";
import { getConfig } from "./config";

let currentTarget = getConfig().target;

const proxy = httpProxy.createProxyServer({});

// 로그 콜백 옵저버 패턴
let logCallback: ((msg: string) => void) | null = null;
export function setProxyLogCallback(cb: (msg: string) => void) {
  logCallback = cb;
}

export function setProxyTarget(target: string) {
  currentTarget = target;
}

export function startProxyServer(port = 3001) {
  const server = http.createServer((req, res) => {
    const info = `[${req.method}] ${req.url} → ${currentTarget}`;
    if (logCallback) logCallback(info);
    proxy.web(
      req,
      res,
      { target: currentTarget, changeOrigin: true },
      (err) => {
        res.writeHead(502, { "Content-Type": "text/plain" });
        res.end("Proxy error: " + err?.message);
        if (logCallback) logCallback("Proxy error: " + err?.message);
      }
    );
  });
  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(
      `Proxy listening on http://localhost:${port} → ${currentTarget}`
    );
    if (logCallback)
      logCallback(
        `Proxy listening on http://localhost:${port} → ${currentTarget}`
      );
  });
  return server;
}
