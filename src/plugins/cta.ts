import type { Plugin } from "vite";

export const ctaPlugin = (ctaFunction: string): Plugin => {
  return {
    name: "cta-plugin",

    transformIndexHtml(html) {
      return html.replace(
        "</body>",
        `<script>${ctaFunction}</script>\n</body>`,
      );
    },
  };
};
