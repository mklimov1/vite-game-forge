import type { Plugin } from "vite";

export interface NetworkConfig {
  name: string;
  plugins: Plugin[];
  ctaFunction: string;
  scripts: string[];
  maxSize?: number;
}
