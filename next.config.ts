import type { NextConfig } from "next";
import nextI18nextConfig from "./next-i18next.config.js";

const nextConfig: NextConfig = {
    /* config options here */
    reactCompiler: true,
    reactStrictMode: true,

    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },

    i18n: nextI18nextConfig.i18n,

    rewrites: async () => {
        return [
            {
                source: "/api/:path*",
                destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
            },
        ];
    },
};

export default nextConfig;
