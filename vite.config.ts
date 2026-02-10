import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: ["3a2004440bc0.ngrok-free.app"],
  },
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tailwindcss(),
    // Run SVGR before other asset plugins to transform SVGs into React components
    (() => {
      const plugin = svgr({
        // svgr options: https://react-svgr.com/docs/options/
        svgrOptions: {
          exportType: "default",
          ref: true,
          svgo: false,
          titleProp: true,
        },
        include: "**/*.svg",
      });
      return { ...plugin, enforce: "pre" } as typeof plugin & {
        enforce: "pre";
      };
    })(),
  ],
});
