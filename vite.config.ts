import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  // server: {
  //   cors: true,
  // },
  server: {
    proxy: {
      "/api": {
        target: "https://script.google.com",
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            // Remove browser headers that cause preflight
            proxyReq.removeHeader("origin");
            proxyReq.removeHeader("authorization");

            // Inject server-side token
            proxyReq.setHeader(
              "Authorization",
              `Bearer ""`,
            );
          });
        },
        rewrite: (path) =>
          path.replace(
            /^\/api/,
            "/macros/s/AKfycby04EGJi61Ht090CplXYZ_m37rJFNIT4SMZDW9h8bqh2LxfNs_4PntjCFyUFv1AxeM4",
          ),
      },
    },
  },
});
