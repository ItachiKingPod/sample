import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  allowedDevOrigins: ["*.sandbox.revolte.io"],
};

export default nextConfig;
