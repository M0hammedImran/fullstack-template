/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    eslint: {
        dirs: ['src'],
    },
};

module.exports = nextConfig;
