import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 性能优化配置
  compress: true,
  poweredByHeader: false,
  
  // 实验性功能
  experimental: {
    // 优化字体加载
    optimizePackageImports: ['element-plus'],
  },

  // 图片优化配置
  images: {
    // 支持的图片格式
    formats: ['image/webp', 'image/avif'],
    // 图片尺寸配置
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // 远程图片域名
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'forum-file-storage-core.oss-cn-shanghai.aliyuncs.com',
        pathname: '**',
      },
    ],
    // 已弃用的 domains 配置（保留兼容性）
    domains: ['forum-file-storage-core.oss-cn-shanghai.aliyuncs.com'],
    // 启用危险的域名允许（仅在需要时使用）
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // webpack 优化配置
  webpack: (config, { dev, isServer }) => {
    // 生产环境优化
    if (!dev && !isServer) {
      // 启用代码分割
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          // 第三方库单独打包
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          // Element Plus 单独打包
          elementPlus: {
            test: /[\\/]node_modules[\\/]element-plus[\\/]/,
            name: 'element-plus',
            chunks: 'all',
          },
          // 公共组件单独打包
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
        },
      };
    }

    // 优化模块解析
    config.resolve.alias = {
      ...config.resolve.alias,
      // 可以添加更多别名以优化打包
    };

    return config;
  },

  // 编译器优化
  compiler: {
    // 移除 console.log（仅在生产环境）
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // 输出优化
  output: 'standalone',

  // 静态资源优化
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : undefined,

  // PWA 和缓存配置
  headers: async () => {
    return [
      {
        source: '/(.*)\\.(ico|png|jpg|jpeg|gif|svg|webp)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(.*)\\.(js|css)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
