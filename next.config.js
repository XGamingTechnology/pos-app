// next.config.js
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🔑 WAJIB untuk Docker: hasilkan build standalone
  output: "standalone",

  // Opsional: matikan source maps di production
  productionBrowserSourceMaps: false,

  // 🔑 SOLUSI UTAMA: bantu Webpack kenali folder `lib/` di root
  webpack: (config) => {
    config.resolve.alias["@/lib"] = path.resolve(__dirname, "lib");
    return config;
  },
};

module.exports = nextConfig;
