import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import fs from "fs";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "localhost-key.pem")),
      cert: fs.readFileSync(path.resolve(__dirname, "localhost.pem")),
    },
  },
  plugins: [
    react(),
    VitePWA({
      workbox: {
        // Use network first strategy for all requests
        // This will attempt to fetch the latest response from the network,
        // falling back to the cache if the network request fails.
        runtimeCaching: [
          {
            urlPattern: new RegExp(".*"), // Match all requests
            handler: "NetworkFirst",
          },
        ],
      },
      manifest: {
        name: "Conquer - One App to rule them all",
        short_name: "Conquer",
        theme_color: "#000000",
        background_color: "#000000",
        start_url: "/",
        display: "standalone",
        icons: [
          {
            src: "logo-variants/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "logo-variants/icon-256x256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "logo-variants/icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "logo-variants/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
