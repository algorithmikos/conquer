// vite.config.ts
import { defineConfig } from "file:///H:/Netzwerk/conquer/node_modules/vite/dist/node/index.js";
import react from "file:///H:/Netzwerk/conquer/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { VitePWA } from "file:///H:/Netzwerk/conquer/node_modules/vite-plugin-pwa/dist/index.js";
import fs from "fs";
import path from "path";
var __vite_injected_original_dirname = "H:\\Netzwerk\\conquer";
var vite_config_default = defineConfig({
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__vite_injected_original_dirname, "localhost-key.pem")),
      cert: fs.readFileSync(path.resolve(__vite_injected_original_dirname, "localhost.pem"))
    }
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
            urlPattern: new RegExp(".*"),
            // Match all requests
            handler: "NetworkFirst"
          }
        ]
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
            type: "image/png"
          },
          {
            src: "logo-variants/icon-256x256.png",
            sizes: "256x256",
            type: "image/png"
          },
          {
            src: "logo-variants/icon-384x384.png",
            sizes: "384x384",
            type: "image/png"
          },
          {
            src: "logo-variants/icon-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJIOlxcXFxOZXR6d2Vya1xcXFxjb25xdWVyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJIOlxcXFxOZXR6d2Vya1xcXFxjb25xdWVyXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9IOi9OZXR6d2Vyay9jb25xdWVyL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xyXG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSBcInZpdGUtcGx1Z2luLXB3YVwiO1xyXG5pbXBvcnQgZnMgZnJvbSBcImZzXCI7XHJcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHNlcnZlcjoge1xyXG4gICAgaHR0cHM6IHtcclxuICAgICAga2V5OiBmcy5yZWFkRmlsZVN5bmMocGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJsb2NhbGhvc3Qta2V5LnBlbVwiKSksXHJcbiAgICAgIGNlcnQ6IGZzLnJlYWRGaWxlU3luYyhwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcImxvY2FsaG9zdC5wZW1cIikpLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHBsdWdpbnM6IFtcclxuICAgIHJlYWN0KCksXHJcbiAgICBWaXRlUFdBKHtcclxuICAgICAgd29ya2JveDoge1xyXG4gICAgICAgIC8vIFVzZSBuZXR3b3JrIGZpcnN0IHN0cmF0ZWd5IGZvciBhbGwgcmVxdWVzdHNcclxuICAgICAgICAvLyBUaGlzIHdpbGwgYXR0ZW1wdCB0byBmZXRjaCB0aGUgbGF0ZXN0IHJlc3BvbnNlIGZyb20gdGhlIG5ldHdvcmssXHJcbiAgICAgICAgLy8gZmFsbGluZyBiYWNrIHRvIHRoZSBjYWNoZSBpZiB0aGUgbmV0d29yayByZXF1ZXN0IGZhaWxzLlxyXG4gICAgICAgIHJ1bnRpbWVDYWNoaW5nOiBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHVybFBhdHRlcm46IG5ldyBSZWdFeHAoXCIuKlwiKSwgLy8gTWF0Y2ggYWxsIHJlcXVlc3RzXHJcbiAgICAgICAgICAgIGhhbmRsZXI6IFwiTmV0d29ya0ZpcnN0XCIsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIF0sXHJcbiAgICAgIH0sXHJcbiAgICAgIG1hbmlmZXN0OiB7XHJcbiAgICAgICAgbmFtZTogXCJDb25xdWVyIC0gT25lIEFwcCB0byBydWxlIHRoZW0gYWxsXCIsXHJcbiAgICAgICAgc2hvcnRfbmFtZTogXCJDb25xdWVyXCIsXHJcbiAgICAgICAgdGhlbWVfY29sb3I6IFwiIzAwMDAwMFwiLFxyXG4gICAgICAgIGJhY2tncm91bmRfY29sb3I6IFwiIzAwMDAwMFwiLFxyXG4gICAgICAgIHN0YXJ0X3VybDogXCIvXCIsXHJcbiAgICAgICAgZGlzcGxheTogXCJzdGFuZGFsb25lXCIsXHJcbiAgICAgICAgaWNvbnM6IFtcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgc3JjOiBcImxvZ28tdmFyaWFudHMvaWNvbi0xOTJ4MTkyLnBuZ1wiLFxyXG4gICAgICAgICAgICBzaXplczogXCIxOTJ4MTkyXCIsXHJcbiAgICAgICAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCIsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBzcmM6IFwibG9nby12YXJpYW50cy9pY29uLTI1NngyNTYucG5nXCIsXHJcbiAgICAgICAgICAgIHNpemVzOiBcIjI1NngyNTZcIixcclxuICAgICAgICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHNyYzogXCJsb2dvLXZhcmlhbnRzL2ljb24tMzg0eDM4NC5wbmdcIixcclxuICAgICAgICAgICAgc2l6ZXM6IFwiMzg0eDM4NFwiLFxyXG4gICAgICAgICAgICB0eXBlOiBcImltYWdlL3BuZ1wiLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgc3JjOiBcImxvZ28tdmFyaWFudHMvaWNvbi01MTJ4NTEyLnBuZ1wiLFxyXG4gICAgICAgICAgICBzaXplczogXCI1MTJ4NTEyXCIsXHJcbiAgICAgICAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCIsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIF0sXHJcbiAgICAgIH0sXHJcbiAgICB9KSxcclxuICBdLFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFpUCxTQUFTLG9CQUFvQjtBQUM5USxPQUFPLFdBQVc7QUFDbEIsU0FBUyxlQUFlO0FBQ3hCLE9BQU8sUUFBUTtBQUNmLE9BQU8sVUFBVTtBQUpqQixJQUFNLG1DQUFtQztBQU96QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixRQUFRO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxLQUFLLEdBQUcsYUFBYSxLQUFLLFFBQVEsa0NBQVcsbUJBQW1CLENBQUM7QUFBQSxNQUNqRSxNQUFNLEdBQUcsYUFBYSxLQUFLLFFBQVEsa0NBQVcsZUFBZSxDQUFDO0FBQUEsSUFDaEU7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixRQUFRO0FBQUEsTUFDTixTQUFTO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFJUCxnQkFBZ0I7QUFBQSxVQUNkO0FBQUEsWUFDRSxZQUFZLElBQUksT0FBTyxJQUFJO0FBQUE7QUFBQSxZQUMzQixTQUFTO0FBQUEsVUFDWDtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFDQSxVQUFVO0FBQUEsUUFDUixNQUFNO0FBQUEsUUFDTixZQUFZO0FBQUEsUUFDWixhQUFhO0FBQUEsUUFDYixrQkFBa0I7QUFBQSxRQUNsQixXQUFXO0FBQUEsUUFDWCxTQUFTO0FBQUEsUUFDVCxPQUFPO0FBQUEsVUFDTDtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsTUFBTTtBQUFBLFVBQ1I7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsVUFDUjtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxVQUNSO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsTUFBTTtBQUFBLFVBQ1I7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
