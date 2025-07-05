import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "html-transform",
      transformIndexHtml(html) {
        return html.replace(
          /%VITE_GOOGLE_CLIENT_ID%/g,
          process.env.VITE_GOOGLE_CLIENT_ID || ""
        );
      },
    },
  ],
  base: "/",
  server: {
    port: 5173,
    // 開発サーバーでのセキュリティヘッダー設定
    headers: {
      "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
    },
  },
  preview: {
    // プレビューサーバーでのセキュリティヘッダー設定
    headers: {
      "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
    },
  },
});
