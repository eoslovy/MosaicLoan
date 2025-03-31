import type { NextConfig } from 'next';

const isExport = process.env.STATIC_EXPORT === 'true';

const nextConfig: NextConfig = {
  ...(isExport && { output: 'export' }),
};

export default nextConfig;
