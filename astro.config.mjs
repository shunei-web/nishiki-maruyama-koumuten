// @ts-check
import { defineConfig } from "astro/config";

const subfolder = "/maruyama-koumuten/";

// https://astro.build/config
export default defineConfig({
  base: subfolder,
  outDir: `./dist${subfolder}`,
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `\
            @use "/src/styles/sass/global/_index.scss" as global;\
            `,
        },
      },
    },
  },
});
