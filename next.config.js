const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

/** @type {import('next').NextConfig} */
const nextConfig = {
  presets: ["next/babel"],
  plugins: ["inline-react-svg"],
  experimental: {
    appDir: true,
  },
  reactStrictMode: false,
  swcMinify: true,
  webpack: (config, options) => {
    if (options.isServer) {
      config.plugins.push(
        new ForkTsCheckerWebpackPlugin({
          async: false, // This line ensures that TypeScript errors block compilation
        })
      );
    }

    return config;
  },
  images: {
    domains: [
      "media.kitsu.io",
      "anilist.co",
      "s4.anilist.co",
      "i.ytimg.com",
      "via.placeholder.com",
    ],
    // formats: ["image/avif", "image/webp"],
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "assets.vercel.com",
    //     port: "",
    //     pathname: "/image/upload/**",
    //   },
    // ],
  },
};
module.exports = nextConfig;
