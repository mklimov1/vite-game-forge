import { defineConfig } from "vite";
import { develop } from "./../src/networkConfigs";

export default defineConfig({
  plugins: develop.plugins,
});
