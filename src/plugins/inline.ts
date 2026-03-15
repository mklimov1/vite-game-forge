import {
  readFileSync,
  writeFileSync,
  readdirSync,
  unlinkSync,
  rmdirSync,
} from "node:fs";
import { join, extname } from "node:path";
import type { Plugin } from "vite";

export const inlinePlugin = (): Plugin => {
  return {
    name: "inline-plugin",

    config() {
      return {
        build: {
          assetsInlineLimit: 100_000_000,
          cssCodeSplit: false,
          modulePreload: { polyfill: false },
          rollupOptions: {
            output: {
              inlineDynamicImports: true,
            },
          },
        },
      };
    },

    closeBundle() {
      const outDir = (this as any).config?.build?.outDir ?? "dist";
      const html = inlineAssets(outDir);
      writeFileSync(join(outDir, "index.html"), html, "utf-8");
    },
  };
};

function inlineAssets(outDir: string): string {
  let html = readFileSync(join(outDir, "index.html"), "utf-8");

  const assetsDir = join(outDir, "assets");
  let files: string[] = [];

  try {
    files = readdirSync(assetsDir);
  } catch {
    return html;
  }

  for (const file of files) {
    if (extname(file) !== ".css") continue;

    const content = readFileSync(join(assetsDir, file), "utf-8");
    const regex = new RegExp(
      `<link[^>]+href=["'][./]*assets/${file}["'][^>]*/?>`,
      "g",
    );
    html = html.replace(regex, `<style>${content}</style>`);
    unlinkSync(join(assetsDir, file));
  }

  for (const file of files) {
    if (extname(file) !== ".js") continue;

    const content = readFileSync(join(assetsDir, file), "utf-8");
    const regex = new RegExp(
      `<script[^>]+src=["'][./]*assets/${file}["'][^>]*>\\s*</script>`,
      "g",
    );
    html = html.replace(regex, `<script>${content}</script>`);
    unlinkSync(join(assetsDir, file));
  }

  try {
    if (readdirSync(assetsDir).length === 0) rmdirSync(assetsDir);
  } catch {}

  return html;
}
