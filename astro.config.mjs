// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [
    {
      name: "importStyleCSS",
      hooks: {
        "astro:config:setup": ({ injectScript }) => {
          injectScript("page-ssr", `import '@acab/reset.css';`);
        },
      },
    },
  ],
});
