import { withChisel } from "use-chisel/next";
import { fileURLToPath } from "node:url";

const nextConfig = {
  webpack(config, { webpack }) {
    if (process.env.RC_DESIGN_PREVIEW === "1") {
      config.plugins.push(new webpack.NormalModuleReplacementPlugin(
        /^@\/sanity\/lib\/client$/,
        fileURLToPath(new URL("./scripts/staging-client.mjs", import.meta.url)),
      ));
    }
    return config;
  },
  poweredByHeader: false,
  transpilePackages: ["@rc/website-feedback"],
  images: {
    qualities: [70, 75],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/**" },
      ...(process.env.CHISEL_ENABLED === "1" ? [
        new URL("https://lh3.googleusercontent.com/a/*"),
        new URL("https://lh3.googleusercontent.com/a-/*"),
      ] : []),
    ],
  },
  async headers() {
    const securityHeaders = [
      ...(process.env.RC_STAGING === "1" ? [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }] : []),
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
      ...(process.env.NODE_ENV === "production" ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }] : []),
    ];
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/studio/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }] },
      { source: "/feedback/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }] },
      { source: "/api/:path*", headers: [{ key: "Cache-Control", value: "no-store" }] },
    ];
  },
};

export default process.env.CHISEL_ENABLED === "1" ? withChisel(nextConfig) : nextConfig;
