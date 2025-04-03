// next.config.ts
import type { NextConfig } from 'next';

const isExport = process.env.STATIC_EXPORT === 'true';

const nextConfig: NextConfig = {
  output: isExport ? 'export' : undefined,
};

export default nextConfig;
