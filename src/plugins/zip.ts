import { createWriteStream } from "node:fs";
import { join } from "node:path";
import archiver from "archiver";
import type { Plugin } from "vite";

const FILE_EXT = ".zip";

export const zipPlugin = (name: string): Plugin => {
  const FULL_NAME = name + FILE_EXT;

  return {
    name: "zip-plugin",
    enforce: "post",

    closeBundle() {
      const outDir = (this as any).config?.build?.outDir ?? "dist";
      const zipPath = join(outDir, FULL_NAME);

      return new Promise<void>((resolve, reject) => {
        const output = createWriteStream(zipPath);
        const archive = archiver("zip", { zlib: { level: 9 } });

        output.on("close", () => {
          const bytes = archive.pointer();
          console.log(`\n  ✔ Zip: ${formatBytes(bytes)} → ${zipPath}\n`);
          resolve();
        });

        archive.on("error", reject);

        archive.pipe(output);
        archive.glob("**/*", {
          cwd: outDir,
          ignore: [FULL_NAME],
        });
        archive.finalize();
      });
    },
  };
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
