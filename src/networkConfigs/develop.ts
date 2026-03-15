import { zipPlugin, inlinePlugin } from "./../plugins";
import { createNetworkConfig } from "./../scripts/createNetworkConfig";

const NAME = "develop";

export const develop = createNetworkConfig({
  name: NAME,
  plugins: [inlinePlugin(), zipPlugin(NAME)],
  ctaFunction: `
    function cta() {
      console.log("CTA clicked");
    }
  `,
  scripts: [],
});
