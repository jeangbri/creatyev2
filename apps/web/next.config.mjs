/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    experimental: {
        serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
        outputFileTracingIncludes: {
            '/api/**/*': ['../../packages/db/node_modules/.prisma/client/libquery_engine-rhel-openssl-3.0.x.so.node', './node_modules/.prisma/client/libquery_engine-rhel-openssl-3.0.x.so.node'],
        },
    },
    transpilePackages: ["@repo/db"],
};

export default nextConfig;
