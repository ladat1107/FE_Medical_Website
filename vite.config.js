// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";
//import sass from 'sass';
import tailwindcss from 'tailwindcss'; // Sử dụng import thay vì require
import autoprefixer from 'autoprefixer';
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // implementation: sass,
      },
    },
    postcss: {
      plugins: [
        tailwindcss, // Sử dụng biến tailwindcss đã import
        autoprefixer, // Sử dụng biến autoprefixer đã import
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      'flowbite': path.resolve(__dirname, 'node_modules/flowbite'),
    },

  },
  build: {
    commonjsOptions: {
      esmExternals: true,
    },
  },
  server: {
    port: 3000,
    open: true, // Mở trình duyệt khi chạy dev
    host: '0.0.0.0'
  },
  optimizeDeps: {
    include: ["swiper"], // Đảm bảo Swiper được tối ưu hóa
  },
});
