// @ts-check
import { defineConfig } from "astro/config";

const subfolder = "/murayama-koumuten/";

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
