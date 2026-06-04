/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@xenova/transformers'],
  allowedDevOrigins: ['autodocs-app.loca.lt', 'bore.pub']
};

module.exports = nextConfig;
