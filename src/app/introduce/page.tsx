/**
 * @file 云社 · OpenShare 介绍页面
 * @module app/introduce
 * @description 展示平台特色、技术架构和愿景的综合介绍页面
 */

"use client";

import React from "react";
import Link from "next/link";
import MapWrapper from "./MapWrapper";
import SimpleLayout from "@/components/common/Layout/SimpleLayout";
import {
  MediaDisplay,
  MediaType,
} from "@/components/common/MediaDisplay/MediaDisplay";

/**
 * 演示媒体数据配置
 */
const demoMediaData = {
  forumScreenshots: [
    {
      url: "/images/screenshots/forum/1.png",
      title: "论坛首页",
      description: "现代化的论坛首页设计，支持分类浏览和热门内容展示",
    },
    {
      url: "/images/screenshots/forum/2.png",
      title: "富文本编辑器",
      description: "强大的Markdown编辑器，支持图片上传和实时预览",
    },
    {
      url: "/images/screenshots/forum/3.png",
      title: "帖子详情页",
      description: "清晰的帖子展示，支持点赞、收藏和评论互动",
    },
  ],

  // 聊天系统演示视频
  chatDemos: [
    {
      url: "/images/screenshots/chat/1.png",
      title: "实时聊天演示",
      description: "WebSocket实时通信，支持私聊、群聊和在线状态",
      // thumbnail: '/images/screenshots/chat/chat-preview.jpg'
    },
    {
      url: "/images/screenshots/chat/2.png",
      title: "文件列表视图",
      description: "清晰的文件管理界面，支持多种视图模式",
    },
    {
      url: "/images/screenshots/chat/3.png",
      title: "文件上传进度",
      description: "实时显示上传进度，支持批量上传和断点续传",
    },
  ],

  // 文件管理截图
  filesScreenshots: [
    {
      url: "/images/screenshots/files/file-list.jpg",
      title: "文件列表视图",
      description: "清晰的文件管理界面，支持多种视图模式",
    },
    {
      url: "/images/screenshots/files/upload-progress.jpg",
      title: "文件上传进度",
      description: "实时显示上传进度，支持批量上传和断点续传",
    },
    {
      url: "/images/screenshots/files/share-settings.jpg",
      title: "分享设置",
      description: "灵活的权限控制，支持链接分享和访问期限设置",
    },
  ],

  // 数据分析演示视频
  analyticsDemo: [
    {
      url: "/videos/analytics-demo.mp4",
      title: "大数据分析演示",
      description: "MaxCompute驱动的实时数据分析和可视化",
      thumbnail: "/images/screenshots/analytics/dashboard-preview.jpg",
    },
  ],

  // 云盘系统截图
  cloudScreenshots: [
    {
      url: "/images/screenshots/files/cloud-storage.jpg",
      title: "云盘主界面",
      description: "基于MinIO的分布式存储，提供企业级文件服务",
    },
    {
      url: "/images/screenshots/files/folder-management.jpg",
      title: "文件夹管理",
      description: "支持文件夹创建、重命名、移动等完整操作",
    },
  ],

  // 管理后台截图
  adminScreenshots: [
    {
      url: "/images/screenshots/admin/dashboard.jpg",
      title: "管理后台首页",
      description: "Vue3 + Element Plus构建的现代化管理界面",
    },
    {
      url: "/images/screenshots/admin/user-management.jpg",
      title: "用户管理",
      description: "完整的用户生命周期管理和权限控制",
    },
    {
      url: "/images/screenshots/admin/content-review.jpg",
      title: "内容审核",
      description: "智能化的内容审核和举报处理系统",
    },
  ],
};

/**
 * 云社 · OpenShare 介绍页面组件
 *
 * 展示平台的核心功能、技术架构和愿景的综合介绍页面
 *
 * @component
 * @returns {React.JSX.Element} 介绍页面组件
 */
export default function IntroducePage(): React.JSX.Element {
  return (
    <SimpleLayout>
      <div className="intro-page flex flex-col">
        {/* Hero Section - 地图背景 */}
        <div className="relative h-screen overflow-hidden">
          <MapWrapper />

          {/* 主标题区域 */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 text-center">
            <div className="mb-8">
              <h1
                className="intro-hero-title text-gray-800 dark:text-white mb-4"
                style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
              >
                <span className="intro-gradient-text">云社</span>
                <span className="text-gray-800 dark:text-white mx-4">·</span>
                <span className="text-gray-800 dark:text-white">OpenShare</span>
              </h1>
              <p
                className="text-xl md:text-2xl lg:text-3xl text-gray-700 dark:text-white/90 max-w-4xl mx-auto leading-relaxed mb-6"
                style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.4)" }}
              >
                连接世界，分享智慧 —— 打造下一代智能社交平台
              </p>
              <p
                className="text-lg md:text-xl text-gray-600 dark:text-white/80 max-w-3xl mx-auto leading-relaxed px-4"
                style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}
              >
                融合内容交流与文件分享功能，支持实时聊天、大数据分析的综合性社区平台。
                让交流更智能、更有温度，数据驱动社区发展。
              </p>
            </div>

            {/* CTA 按钮组 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/"
                className="intro-button-primary py-5 px-8 flex items-center shadow-lg"
              >
                <svg
                  className="h-5 w-5 mr-2 intro-pulse"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                立即体验
              </Link>
            </div>
          </div>

          {/* 浮动特性卡片 */}
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-50 hidden lg:block intro-float">
            <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-2xl max-w-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">平台亮点</h3>
              <div className="space-y-3">
                {[
                  { icon: "📊", text: "大数据智能分析" },
                  { icon: "💬", text: "实时聊天系统" },
                  { icon: "☁️", text: "云端文件管理" },
                  { icon: "📊", text: "大数据智能分析" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center text-gray-700">
                    <span className="text-2xl mr-3">{item.icon}</span>
                    <span className="font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 统计数据区块 */}
        <section className="intro-stats-section py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="intro-stats-item text-white">
                <div className="text-4xl md:text-5xl font-bold mb-2">10K+</div>
                <div className="text-white/80 text-lg">活跃用户</div>
              </div>
              <div className="intro-stats-item text-white">
                <div className="text-4xl md:text-5xl font-bold mb-2">50K+</div>
                <div className="text-white/80 text-lg">分享内容</div>
              </div>
              <div className="intro-stats-item text-white">
                <div className="text-4xl md:text-5xl font-bold mb-2">1TB+</div>
                <div className="text-white/80 text-lg">云端存储</div>
              </div>
              <div className="intro-stats-item text-white">
                <div className="text-4xl md:text-5xl font-bold mb-2">99.9%</div>
                <div className="text-white/80 text-lg">服务可用性</div>
              </div>
            </div>
          </div>
        </section>

        {/* 系统架构概览 */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="intro-section-title intro-gradient-text font-bold mb-6">
                系统架构概览
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                采用微服务架构，支持高并发、高可用的现代化社区平台
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              {/* 论坛系统 */}
              <div className="intro-system-card">
                <div className="intro-system-header">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-orange-600 rounded-2xl flex items-center justify-center mb-6">
                    <span className="text-2xl text-white">📱</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    论坛社区系统
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    基于 Next.js
                    构建的现代化社区论坛，支持内容创作、互动交流和文件分享
                  </p>
                </div>

                <div className="intro-feature-list">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    核心功能
                  </h4>
                  <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <span className="intro-feature-bullet">📝</span>
                      <div>
                        <strong>富文本内容创作</strong>
                        <span className="intro-feature-desc">
                          支持 Markdown 编辑、图片上传、标签分类
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="intro-feature-bullet">💬</span>
                      <div>
                        <strong>实时聊天系统</strong>
                        <span className="intro-feature-desc">
                          WebSocket + Kafka 消息队列，支持私聊和群聊
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="intro-feature-bullet">☁️</span>
                      <div>
                        <strong>云盘文件管理</strong>
                        <span className="intro-feature-desc">
                          基于 MinIO 的分布式存储，支持文件分享和权限控制
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="intro-feature-bullet">📊</span>
                      <div>
                        <strong>大数据分析系统</strong>
                        <span className="intro-feature-desc">
                          MaxCompute驱动的智能分析与个性化推荐
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 管理系统 */}
              <div className="intro-system-card">
                <div className="intro-system-header">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary to-orange-700 rounded-2xl flex items-center justify-center mb-6">
                    <span className="text-2xl text-white">⚙️</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    管理后台系统
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    基于 Vue 3 构建的管理后台，提供全面的运营管理和数据分析能力
                  </p>
                </div>

                <div className="intro-feature-list">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    管理功能
                  </h4>
                  <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <span className="intro-feature-bullet">👥</span>
                      <div>
                        <strong>用户管理</strong>
                        <span className="intro-feature-desc">
                          用户信息管理、权限控制、封禁处理
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="intro-feature-bullet">🛡️</span>
                      <div>
                        <strong>举报处理</strong>
                        <span className="intro-feature-desc">
                          内容审核、举报处理、违规内容管理
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="intro-feature-bullet">📊</span>
                      <div>
                        <strong>数据看板</strong>
                        <span className="intro-feature-desc">
                          实时数据统计、用户行为分析、运营指标监控
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="intro-feature-bullet">🔧</span>
                      <div>
                        <strong>系统配置</strong>
                        <span className="intro-feature-desc">
                          系统参数设置、功能开关、维护管理
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 技术架构详解 */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="intro-section-title intro-gradient-text font-bold mb-6">
                技术架构详解
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                采用现代化技术栈，确保平台的高性能、高可用性和可扩展性
              </p>
            </div>

            {/* 系统架构图 */}
            <div className="mb-16">
              <div className="bg-white dark:bg-gray-800 p-8 ">
                <div className="text-center mb-8">
                  {/* <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    云社 · OpenShare 系统架构图
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    基于微服务架构的企业级社区平台技术栈
                  </p> */}
                </div>
                <div className="flex justify-center">
                  <div className="w-full max-w-6xl">
                    <img
                      src="/images/system-architecture.svg"
                      alt="云社 · OpenShare 系统架构图"
                      className="w-full h-auto rounded-lg shadow-lg"
                      style={{ maxHeight: "800px", objectFit: "contain" }}
                    />
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    点击图片可查看完整架构详情
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {/* 前端技术 */}
              <div className="intro-tech-card">
                <div className="intro-tech-header">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-orange-600 rounded-2xl flex items-center justify-center mb-6">
                    <span className="text-2xl text-white">💻</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    前端技术栈
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="intro-tech-item">
                    <span className="intro-tech-name">Next.js 14</span>
                    <span className="intro-tech-tag">React框架</span>
                  </div>
                  <div className="intro-tech-item">
                    <span className="intro-tech-name">TypeScript</span>
                    <span className="intro-tech-tag">类型安全</span>
                  </div>
                  <div className="intro-tech-item">
                    <span className="intro-tech-name">Tailwind CSS</span>
                    <span className="intro-tech-tag">样式框架</span>
                  </div>
                  <div className="intro-tech-item">
                    <span className="intro-tech-name">Element Plus</span>
                    <span className="intro-tech-tag">UI组件库</span>
                  </div>
                  <div className="intro-tech-item">
                    <span className="intro-tech-name">Zustand</span>
                    <span className="intro-tech-tag">状态管理</span>
                  </div>
                </div>
              </div>

              {/* 后端技术 */}
              <div className="intro-tech-card">
                <div className="intro-tech-header">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary to-orange-700 rounded-2xl flex items-center justify-center mb-6">
                    <span className="text-2xl text-white">🗄️</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    后端技术栈
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="intro-tech-item">
                    <span className="intro-tech-name">Spring Boot</span>
                    <span className="intro-tech-tag">Java框架</span>
                  </div>
                  <div className="intro-tech-item">
                    <span className="intro-tech-name">MySQL</span>
                    <span className="intro-tech-tag">关系数据库</span>
                  </div>
                  <div className="intro-tech-item">
                    <span className="intro-tech-name">Redis</span>
                    <span className="intro-tech-tag">缓存系统</span>
                  </div>
                  <div className="intro-tech-item">
                    <span className="intro-tech-name">MinIO</span>
                    <span className="intro-tech-tag">对象存储</span>
                  </div>
                  <div className="intro-tech-item">
                    <span className="intro-tech-name">JWT</span>
                    <span className="intro-tech-tag">身份认证</span>
                  </div>
                </div>
              </div>

              {/* 大数据技术 */}
              <div className="intro-tech-card">
                <div className="intro-tech-header">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-yellow-600 rounded-2xl flex items-center justify-center mb-6">
                    <span className="text-2xl text-white">📊</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    大数据技术
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="intro-tech-item">
                    <span className="intro-tech-name">MaxCompute</span>
                    <span className="intro-tech-tag">大数据计算</span>
                  </div>
                  <div className="intro-tech-item">
                    <span className="intro-tech-name">DataWorks</span>
                    <span className="intro-tech-tag">数据开发</span>
                  </div>
                  <div className="intro-tech-item">
                    <span className="intro-tech-name">ODPS SDK</span>
                    <span className="intro-tech-tag">数据接口</span>
                  </div>
                  <div className="intro-tech-item">
                    <span className="intro-tech-name">Zookeeper</span>
                    <span className="intro-tech-tag">服务协调</span>
                  </div>
                  <div className="intro-tech-item">
                    <span className="intro-tech-name">Kafka</span>
                    <span className="intro-tech-tag">消息队列</span>
                  </div>
                </div>
              </div>

              {/* 基础设施 */}
              <div className="intro-tech-card">
                <div className="intro-tech-header">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary to-orange-800 rounded-2xl flex items-center justify-center mb-6">
                    <span className="text-2xl text-white">🚀</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    基础设施
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="intro-tech-item">
                    <span className="intro-tech-name">Docker</span>
                    <span className="intro-tech-tag">容器化</span>
                  </div>
                  <div className="intro-tech-item">
                    <span className="intro-tech-name">Nginx</span>
                    <span className="intro-tech-tag">反向代理</span>
                  </div>
                  <div className="intro-tech-item">
                    <span className="intro-tech-name">WebSocket</span>
                    <span className="intro-tech-tag">实时通信</span>
                  </div>
                  <div className="intro-tech-item">
                    <span className="intro-tech-name">SSL/TLS</span>
                    <span className="intro-tech-tag">安全传输</span>
                  </div>
                  <div className="intro-tech-item">
                    <span className="intro-tech-name">监控告警</span>
                    <span className="intro-tech-tag">运维保障</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 核心特性展示 */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="intro-section-title intro-gradient-text font-bold mb-6">
                核心特性展示
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                每一个功能都经过精心设计，为用户提供最佳的使用体验
              </p>
            </div>

            <div className="space-y-16">
              {/* 论坛社区系统 */}
              <div className="intro-feature-showcase">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                      <span className="intro-gradient-text">论坛社区系统</span>
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                      基于Next.js +
                      React的现代化论坛系统，支持富文本编辑、分类标签、热门排行、用户互动等完整社区功能
                    </p>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <span className="intro-feature-bullet">📝</span>
                        <div>
                          <strong className="text-gray-900 dark:text-white">
                            富文本编辑器支持
                          </strong>
                          <p className="text-gray-600 dark:text-gray-300">
                            支持Markdown编辑、图片上传、标签分类
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="intro-feature-bullet">🏷️</span>
                        <div>
                          <strong className="text-gray-900 dark:text-white">
                            分类标签系统
                          </strong>
                          <p className="text-gray-600 dark:text-gray-300">
                            灵活的内容分类与标签管理机制
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="intro-feature-bullet">❤️</span>
                        <div>
                          <strong className="text-gray-900 dark:text-white">
                            点赞收藏功能
                          </strong>
                          <p className="text-gray-600 dark:text-gray-300">
                            用户互动与内容价值评估
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="intro-feature-bullet">🔥</span>
                        <div>
                          <strong className="text-gray-900 dark:text-white">
                            热门排行算法
                          </strong>
                          <p className="text-gray-600 dark:text-gray-300">
                            智能的内容推荐与热点发现
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <MediaDisplay
                      type={MediaType.IMAGES}
                      media={demoMediaData.forumScreenshots}
                      className="w-full max-w-4xl mx-auto"
                      autoPlay={true}
                      interval={4000}
                      maintainAspectRatio={true}
                    />
                  </div>
                </div>
              </div>

              {/* 实时聊天系统 */}
              <div className="intro-feature-showcase">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="lg:order-2">
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                      <span className="intro-gradient-text">实时聊天系统</span>
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                      基于WebSocket +
                      Kafka的高并发实时聊天，支持私聊、群聊、消息推送、在线状态等完整即时通讯功能
                    </p>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <span className="intro-feature-bullet">⚡</span>
                        <div>
                          <strong className="text-gray-900 dark:text-white">
                            WebSocket实时通信
                          </strong>
                          <p className="text-gray-600 dark:text-gray-300">
                            毫秒级消息传输，低延迟实时交流
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="intro-feature-bullet">🔄</span>
                        <div>
                          <strong className="text-gray-900 dark:text-white">
                            Kafka消息队列
                          </strong>
                          <p className="text-gray-600 dark:text-gray-300">
                            可靠的消息投递与高并发处理
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="intro-feature-bullet">👥</span>
                        <div>
                          <strong className="text-gray-900 dark:text-white">
                            私聊群聊支持
                          </strong>
                          <p className="text-gray-600 dark:text-gray-300">
                            灵活的多人会话与群组管理
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="intro-feature-bullet">🟢</span>
                        <div>
                          <strong className="text-gray-900 dark:text-white">
                            在线状态显示
                          </strong>
                          <p className="text-gray-600 dark:text-gray-300">
                            实时的用户在线状态与活跃度
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="lg:order-1">
                    <MediaDisplay
                      type={MediaType.IMAGES}
                      media={demoMediaData.chatDemos}
                      className="w-full max-w-4xl mx-auto"
                      autoPlay={true}
                      interval={4000}
                      maintainAspectRatio={true}
                    />
                  </div>
                </div>
              </div>

              {/* 智能文件管理 */}
              <div className="intro-feature-showcase">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                      <span className="intro-gradient-text">智能文件管理</span>
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                      基于MinIO的分布式存储系统，提供文件上传下载、智能分类、批量操作、版本管理等企业级文件服务
                    </p>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <span className="intro-feature-bullet">☁️</span>
                        <div>
                          <strong className="text-gray-900 dark:text-white">
                            分布式文件存储
                          </strong>
                          <p className="text-gray-600 dark:text-gray-300">
                            高可用、高性能的对象存储服务
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="intro-feature-bullet">🧠</span>
                        <div>
                          <strong className="text-gray-900 dark:text-white">
                            智能文件分类
                          </strong>
                          <p className="text-gray-600 dark:text-gray-300">
                            自动识别文件类型与智能归档
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="intro-feature-bullet">📦</span>
                        <div>
                          <strong className="text-gray-900 dark:text-white">
                            批量上传下载
                          </strong>
                          <p className="text-gray-600 dark:text-gray-300">
                            高效的批量文件处理能力
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="intro-feature-bullet">🔄</span>
                        <div>
                          <strong className="text-gray-900 dark:text-white">
                            文件版本管理
                          </strong>
                          <p className="text-gray-600 dark:text-gray-300">
                            完整的版本控制与历史追踪
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <MediaDisplay
                      type={MediaType.IMAGES}
                      media={demoMediaData.filesScreenshots}
                      className="w-full max-w-4xl mx-auto"
                      autoPlay={true}
                      interval={4000}
                      maintainAspectRatio={true}
                    />
                  </div>
                </div>
              </div>

              {/* 大数据分析系统 */}
              <div className="intro-feature-showcase">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="lg:order-2">
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                      <span className="intro-gradient-text">
                        大数据分析系统
                      </span>
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                      集成MaxCompute +
                      DataWorks，实现用户行为分析、内容推荐、热点预测、数据可视化等智能化分析功能
                    </p>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <span className="intro-feature-bullet">🚀</span>
                        <div>
                          <strong className="text-gray-900 dark:text-white">
                            MaxCompute大数据处理
                          </strong>
                          <p className="text-gray-600 dark:text-gray-300">
                            阿里云企业级大数据计算平台
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="intro-feature-bullet">📈</span>
                        <div>
                          <strong className="text-gray-900 dark:text-white">
                            用户行为分析
                          </strong>
                          <p className="text-gray-600 dark:text-gray-300">
                            深度洞察用户行为模式与偏好
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="intro-feature-bullet">🎯</span>
                        <div>
                          <strong className="text-gray-900 dark:text-white">
                            智能内容推荐
                          </strong>
                          <p className="text-gray-600 dark:text-gray-300">
                            基于机器学习的个性化推荐
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="intro-feature-bullet">📊</span>
                        <div>
                          <strong className="text-gray-900 dark:text-white">
                            实时数据可视化
                          </strong>
                          <p className="text-gray-600 dark:text-gray-300">
                            动态图表与实时监控看板
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="lg:order-1">
                    <MediaDisplay
                      type={MediaType.VIDEO}
                      media={demoMediaData.analyticsDemo}
                      className="w-full max-w-4xl mx-auto"
                      aspectRatio="16:9"
                    />
                  </div>
                </div>
              </div>

              {/* 云盘共享系统 */}
              <div className="intro-feature-showcase">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                      <span className="intro-gradient-text">云盘共享系统</span>
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                      企业级云盘存储解决方案，支持文件夹管理、权限控制、分享链接、访问统计等完整的文件共享服务
                    </p>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <span className="intro-feature-bullet">📁</span>
                        <div>
                          <strong className="text-gray-900 dark:text-white">
                            文件夹层级管理
                          </strong>
                          <p className="text-gray-600 dark:text-gray-300">
                            灵活的目录结构与层级组织
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="intro-feature-bullet">🔐</span>
                        <div>
                          <strong className="text-gray-900 dark:text-white">
                            权限精细控制
                          </strong>
                          <p className="text-gray-600 dark:text-gray-300">
                            细粒度的访问权限与安全管控
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="intro-feature-bullet">🔗</span>
                        <div>
                          <strong className="text-gray-900 dark:text-white">
                            分享链接生成
                          </strong>
                          <p className="text-gray-600 dark:text-gray-300">
                            快速创建安全的文件分享链接
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="intro-feature-bullet">📊</span>
                        <div>
                          <strong className="text-gray-900 dark:text-white">
                            访问统计分析
                          </strong>
                          <p className="text-gray-600 dark:text-gray-300">
                            详细的访问记录与使用情况分析
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <MediaDisplay
                      type={MediaType.IMAGES}
                      media={demoMediaData.cloudScreenshots}
                      className="w-full max-w-4xl mx-auto"
                      autoPlay={true}
                      interval={4000}
                      maintainAspectRatio={true}
                    />
                  </div>
                </div>
              </div>

              {/* 智能管理后台 */}
              <div className="intro-feature-showcase">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="lg:order-2">
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                      <span className="intro-gradient-text">智能管理后台</span>
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                      基于Vue3 + Element
                      Plus的现代化管理后台，提供用户管理、内容审核、数据统计、系统监控等全面管理功能
                    </p>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <span className="intro-feature-bullet">👥</span>
                        <div>
                          <strong className="text-gray-900 dark:text-white">
                            用户权限管理
                          </strong>
                          <p className="text-gray-600 dark:text-gray-300">
                            完整的用户生命周期与权限体系
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="intro-feature-bullet">🛡️</span>
                        <div>
                          <strong className="text-gray-900 dark:text-white">
                            内容审核系统
                          </strong>
                          <p className="text-gray-600 dark:text-gray-300">
                            智能化内容审核与违规处理
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="intro-feature-bullet">📈</span>
                        <div>
                          <strong className="text-gray-900 dark:text-white">
                            数据统计看板
                          </strong>
                          <p className="text-gray-600 dark:text-gray-300">
                            全方位的运营数据与趋势分析
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="intro-feature-bullet">🔔</span>
                        <div>
                          <strong className="text-gray-900 dark:text-white">
                            系统监控告警
                          </strong>
                          <p className="text-gray-600 dark:text-gray-300">
                            实时监控与智能告警机制
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="lg:order-1">
                    <MediaDisplay
                      type={MediaType.IMAGES}
                      media={demoMediaData.adminScreenshots}
                      className="w-full max-w-4xl mx-auto"
                      autoPlay={true}
                      interval={4000}
                      maintainAspectRatio={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 开发阶段展示 */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="intro-section-title intro-gradient-text font-bold mb-6">
                开发历程
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                从项目规划到功能实现，每个阶段都体现了我们对技术的追求和对用户体验的关注
              </p>
            </div>

            <div className="intro-timeline">
              <div className="space-y-12">
                <div className="intro-timeline-item">
                  <div className="intro-timeline-marker">1</div>
                  <div className="intro-timeline-content">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      项目架构与技术准备
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      搭建技术基础、数据模型与初始化环境
                    </p>
                    <div className="intro-timeline-tags">
                      <span className="intro-timeline-tag">Spring Boot</span>
                      <span className="intro-timeline-tag">Next.js</span>
                      <span className="intro-timeline-tag">Vue 3</span>
                      <span className="intro-timeline-tag">MySQL</span>
                      <span className="intro-timeline-tag">Redis</span>
                    </div>
                  </div>
                </div>

                <div className="intro-timeline-item">
                  <div className="intro-timeline-marker">2</div>
                  <div className="intro-timeline-content">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      用户模块开发
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      实现用户注册认证、基础资料与偏好配置
                    </p>
                    <div className="intro-timeline-tags">
                      <span className="intro-timeline-tag">JWT认证</span>
                      <span className="intro-timeline-tag">用户管理</span>
                      <span className="intro-timeline-tag">权限控制</span>
                    </div>
                  </div>
                </div>

                <div className="intro-timeline-item">
                  <div className="intro-timeline-marker">3</div>
                  <div className="intro-timeline-content">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      论坛核心功能开发
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      支持发帖、展示、互动与分类结构搭建
                    </p>
                    <div className="intro-timeline-tags">
                      <span className="intro-timeline-tag">富文本编辑</span>
                      <span className="intro-timeline-tag">文件上传</span>
                      <span className="intro-timeline-tag">标签系统</span>
                      <span className="intro-timeline-tag">热门排行</span>
                    </div>
                  </div>
                </div>

                <div className="intro-timeline-item">
                  <div className="intro-timeline-marker">4</div>
                  <div className="intro-timeline-content">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      云端存储体系构建
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      基于MinIO构建分布式文件系统，实现智能云盘功能
                    </p>
                    <div className="intro-timeline-tags">
                      <span className="intro-timeline-tag">MinIO存储</span>
                      <span className="intro-timeline-tag">文件管理</span>
                      <span className="intro-timeline-tag">权限控制</span>
                      <span className="intro-timeline-tag">分享机制</span>
                    </div>
                  </div>
                </div>

                <div className="intro-timeline-item">
                  <div className="intro-timeline-marker">5</div>
                  <div className="intro-timeline-content">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      实时聊天系统
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      集成WebSocket、Kafka、Zookeeper构建聊天功能
                    </p>
                    <div className="intro-timeline-tags">
                      <span className="intro-timeline-tag">WebSocket</span>
                      <span className="intro-timeline-tag">Kafka</span>
                      <span className="intro-timeline-tag">Zookeeper</span>
                      <span className="intro-timeline-tag">实时通信</span>
                    </div>
                  </div>
                </div>

                <div className="intro-timeline-item">
                  <div className="intro-timeline-marker">6</div>
                  <div className="intro-timeline-content">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      大数据分析系统
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      集成MaxCompute、DataWorks实现数据驱动决策
                    </p>
                    <div className="intro-timeline-tags">
                      <span className="intro-timeline-tag">MaxCompute</span>
                      <span className="intro-timeline-tag">DataWorks</span>
                      <span className="intro-timeline-tag">ODPS SDK</span>
                      <span className="intro-timeline-tag">数据分析</span>
                    </div>
                  </div>
                </div>

                <div className="intro-timeline-item">
                  <div className="intro-timeline-marker">7</div>
                  <div className="intro-timeline-content">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      系统优化与上线
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      性能优化、安全加固、监控部署
                    </p>
                    <div className="intro-timeline-tags">
                      <span className="intro-timeline-tag">性能优化</span>
                      <span className="intro-timeline-tag">安全加固</span>
                      <span className="intro-timeline-tag">Docker部署</span>
                      <span className="intro-timeline-tag">监控告警</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 团队愿景区块 */}
        <section className="py-20 intro-gradient-vision text-white relative overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full mix-blend-multiply intro-float"></div>
            <div
              className="absolute bottom-10 right-10 w-80 h-80 bg-white rounded-full mix-blend-multiply intro-float"
              style={{ animationDelay: "3s" }}
            ></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">我们的愿景</h2>
            <p className="text-2xl mb-16 max-w-4xl mx-auto leading-relaxed">
              &ldquo;让每个人都能在数字世界中找到属于自己的声音，
              通过技术的力量连接彼此，分享知识，创造价值。&rdquo;
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
                <div className="text-4xl text-white mb-6 mx-auto">🌍</div>
                <h3 className="text-xl font-bold mb-4">连接世界</h3>
                <p className="text-white/80 leading-relaxed">
                  打破地理界限，让全球用户能够无障碍地交流和分享，构建真正的全球化社区。
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
                <div className="text-4xl text-white mb-6 mx-auto">⚡</div>
                <h3 className="text-xl font-bold mb-4">激发创造</h3>
                <p className="text-white/80 leading-relaxed">
                  提供强大的创作工具和平台，激发每个用户的创造潜能，让优质内容得到更好的传播。
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
                <div className="text-4xl text-white mb-6 mx-auto">❤️</div>
                <h3 className="text-xl font-bold mb-4">共享未来</h3>
                <p className="text-white/80 leading-relaxed">
                  通过开放共享的理念，让知识和经验得到更好的传承，共同构建美好的数字未来。
                </p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xl mb-8 italic">
                &ldquo;技术改变世界，分享创造价值&rdquo;
              </p>
              <p className="text-white/80">—— 云社 · OpenShare 团队</p>
            </div>
          </div>
        </section>

        {/* 强化CTA区块 */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="intro-section-title intro-gradient-text font-bold mb-6">
              加入我们的社区
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
              成为云社 · OpenShare
              的一员，与全球用户一起分享知识、创造价值、连接未来
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Link
                href="/"
                className="intro-button-primary px-10 py-4 text-lg font-semibold rounded-full"
              >
                立即体验
              </Link>
              <button className="intro-button-secondary px-10 py-4 text-lg font-semibold rounded-full">
                查看演示
              </button>
            </div>

            <div className="flex justify-center space-x-8 text-gray-400">
              <a href="#" className="hover:text-primary transition-colors">
                <span className="text-2xl">👥</span>
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <span className="text-2xl">🌍</span>
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <span className="text-2xl">❤️</span>
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <span className="text-2xl">⭐</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </SimpleLayout>
  );
}
