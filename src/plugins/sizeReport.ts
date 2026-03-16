import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import type { Plugin } from "vite";

export const sizeReportPlugin = (): Plugin => {
  return {
    name: "size-report-plugin",
    enforce: "post",

    closeBundle() {
      const outDir = (this as any).config?.build?.outDir ?? "dist";
      const files = getFiles(outDir);

      console.log("\n  📦 Size Report:");

      for (const { name, size } of files) {
        console.log(`     ${name} — ${formatBytes(size)}`);
      }

      const total = files.reduce((sum, f) => sum + f.size, 0);
      console.log(`     Total: ${formatBytes(total)}\n`);
    },
  };
};

function getFiles(dir: string, prefix = ""): { name: string; size: number }[] {
  const results: { name: string; size: number }[] = [];

  try {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      const name = prefix ? `${prefix}/${entry.name}` : entry.name;

      if (entry.isDirectory()) {
        results.push(...getFiles(path, name));
      } else {
        results.push({ name, size: statSync(path).size });
      }
    }
  } catch {}

  return results;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
