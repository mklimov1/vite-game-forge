import { ctaPlugin, scriptsPlugin } from "./../plugins";
import type { NetworkConfig } from "./../types/networkConfig";

const MAX_SIZE = 5 * 1024 * 1024;

export const createNetworkConfig = (config: NetworkConfig): NetworkConfig => {
  return {
    ...config,
    plugins: [
      ctaPlugin(config.ctaFunction),
      scriptsPlugin(config.scripts),
      ...config.plugins,
    ],
    maxSize: config.maxSize || MAX_SIZE,
  };
};
