import type { Plugin } from "vite";

export const scriptsPlugin = (scripts: string[]): Plugin => {
  return {
    name: "scripts-plugin",

    transformIndexHtml(html) {
      if (!scripts.length) return html;

      return html.replace("</head>", `${scripts.join("\n")}\n</head>`);
    },
  };
};
