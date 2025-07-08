import fs from 'fs';
import path from 'path';

const CONFIG_PATH = path.resolve(__dirname, '../proxy-config.json');
const DEFAULT_TARGET = 'https://nightly.dev.querypie.io';

export interface ProxyConfig {
  target: string;
  recent: string[];
}

function loadConfig(): ProxyConfig {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { target: DEFAULT_TARGET, recent: [DEFAULT_TARGET] };
  }
}

function saveConfig(config: ProxyConfig) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
}

export function getConfig(): ProxyConfig {
  return loadConfig();
}

export function setTarget(target: string) {
  const config = loadConfig();
  config.target = target;
  if (!config.recent.includes(target)) {
    config.recent.unshift(target);
    if (config.recent.length > 5) config.recent = config.recent.slice(0, 5);
  }
  saveConfig(config);
}
