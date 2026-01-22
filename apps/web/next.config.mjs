/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@repo/db", "@repo/shared"],
    images: {
        domains: ['scontent.cdninstagram.com'], // For IG images
    },
};

export default nextConfig;
