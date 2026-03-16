import type { Plugin } from "vite";
import {
  ctaPlugin,
  inlinePlugin,
  scriptsPlugin,
  zipPlugin,
} from "./../plugins";
import type { NetworkConfig } from "./../types/networkConfig";

const MAX_SIZE = 5 * 1024 * 1024;

interface Options extends Omit<NetworkConfig, "plugins"> {
  plugins?: Plugin[];
  inline?: boolean;
  zip?: boolean;
}

export const createNetworkConfig = (config: Options): NetworkConfig => {
  const plugins = [
    ctaPlugin(config.ctaFunction),
    scriptsPlugin(config.scripts),
    ...(config.plugins ?? []),
  ];

  if (config.inline !== false) plugins.push(inlinePlugin());
  if (config.zip !== false) plugins.push(zipPlugin(config.name));

  return {
    ...config,
    plugins,
    maxSize: config.maxSize || MAX_SIZE,
  };
};
