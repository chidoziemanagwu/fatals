import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

const path = require('path');

module.exports = {
  distDir: path.resolve(__dirname, '.next-local'),
};