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
});
