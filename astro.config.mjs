// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [
    {
      name: "importStyleCSS",
      hooks: {
        "astro:config:setup": ({ injectScript }) => {
          injectScript(
            "page-ssr",
            `import '/src/css/variable/typography.css';`,
          );
          injectScript("page-ssr", `import '/src/css/variable/colors.css';`);
          injectScript("page-ssr", `import '@acab/reset.css';`);
          injectScript("page-ssr", `import '/src/css/foundation/base.css';`);
        },
      },
    },
  ],
});
