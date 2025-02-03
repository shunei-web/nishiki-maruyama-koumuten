// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `\
            @use "/src/styles/sass/global/_index.scss" as global;\
            @use "/src/styles/sass/style.scss" as *;\
            `,
        },
      },
    },
  },
  integrations: [
    {
      name: "importStyleCSS",
      hooks: {
        "astro:config:setup": ({ injectScript }) => {
          injectScript(
            "page-ssr",
            `import '/src/styles/css/variable/typography.css';`,
          );
          injectScript(
            "page-ssr",
            `import '/src/styles/css/variable/colors.css';`,
          );
          injectScript("page-ssr", `import '@acab/reset.css';`);
          injectScript(
            "page-ssr",
            `import '/src/styles/css/foundation/base.css';`,
          );
        },
      },
    },
  ],
});
