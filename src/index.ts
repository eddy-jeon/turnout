import { startProxyServer, setProxyTarget } from './proxy';
import { getConfig } from './config';
import { tuiLoop } from './tui';

async function main() {
  const config = getConfig();
  setProxyTarget(config.target);
  startProxyServer(3001);
  await tuiLoop();
}

main();
