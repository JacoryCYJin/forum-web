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
      url: "/images/screenshots/forum/home.jpg",
      title: "论坛首页",
      description: "现代化的论坛首页设计，支持分类浏览和热门内容展示，支持黑夜模式",
    },
    {
      url: "/images/screenshots/forum/login-page.jpg",
      title: "登录组件",
      description: "简洁的登录组件，支持手机号邮箱注册登录，重制密码",
    },
    {
      url: "/images/screenshots/forum/post-send.jpg",
      title: "帖子发送",
      description: "强大的Markdown编辑器，支持图文帖子和视频帖子的发送",
    },
    {
      url: "/images/screenshots/forum/post-detail.jpg",
      title: "帖子详情页",
      description: "清晰的帖子展示，支持点赞、收藏和评论互动，支持视频播放",
    },
    {
      url: "/images/screenshots/forum/report.jpg",
      title: "举报帖子/评论/用户",
      description: "支持举报帖子、评论、用户，支持举报原因选择",
    },
    {
      url: "/images/screenshots/forum/language.jpg",
      title: "多语言支持",
      description: "支持多语言切换，支持中文简体、中文繁体、英文切换",
    },
    {
      url: "/images/screenshots/forum/me.jpg",
      title: "我的页面",
      description: "支持查看我的收藏、我的帖子、我关注的人和我的关注人的发帖子",
    },
  ],

  // 聊天系统演示视频
  chatDemos: [
    {
      url: "/videos/chat.mp4",
      title: "大数据分析演示",
      description: "MaxCompute驱动的实时数据分析和可视化",
      thumbnail: "/images/screenshots/analytics/dashboard-preview.jpg",
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
      url: "/videos/chat.mp4",
      title: "大数据分析演示",
      description: "MaxCompute驱动的实时数据分析和可视化",
      thumbnail: "/images/screenshots/chat/1.png",
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
      url: "/images/screenshots/admin/admin-login.jpg",
      title: "管理后台登录",
      description: "Vue3 + Element Plus构建的现代化管理界面",
    },
    {
      url: "/images/screenshots/admin/admin-home.jpg",
      title: "管理后台首页",
      description: "完整的用户生命周期管理和权限控制",
    },
    {
      url: "/images/screenshots/admin/admin-report.jpg",
      title: "举报处理",
      description: "智能化的内容审核和举报处理系统",
    },
    {
      url: "/images/screenshots/admin/admin-tag.jpg",
      title: "标签管理",
      description: "支持标签创建、编辑、删除等操作",
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
                融合内容交流与文件分享功能，支持实时聊天、智能管理后台的综合性社区平台。
                让交流更智能、更有温度，数据驱动运营决策。
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
                  { icon: "📊", text: "数据看板与统计" },
                  { icon: "💬", text: "实时聊天系统" },
                  { icon: "☁️", text: "云端文件管理" },
                  { icon: "🛡️", text: "智能管理后台" },
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
                  <div className="w-full max-w-7xl">
                    <img
                      src="/images/system-architecture.svg"
                      alt="云社 · OpenShare 系统架构图"
                      className="w-full h-auto rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
                      style={{ maxHeight: "1000px", objectFit: "contain" }}
                    />
                  </div>
                </div>
                {/* <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    点击图片可查看完整架构详情
                  </p>
                </div> */}
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
                      React的现代化论坛系统，支持深色模式、多语言切换、富文本编辑、用户管理等完整社区功能
                    </p>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <span className="intro-feature-bullet">🌓</span>
                        <div>
                          <strong className="text-gray-900 dark:text-white">
                            现代化界面设计
                          </strong>
                          <p className="text-gray-600 dark:text-gray-300">
                            支持深色/浅色主题切换，分类浏览和热门内容展示
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="intro-feature-bullet">🔐</span>
                        <div>
                          <strong className="text-gray-900 dark:text-white">
                            完整用户认证系统
                          </strong>
                          <p className="text-gray-600 dark:text-gray-300">
                            支持手机号/邮箱注册登录，密码重置功能
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="intro-feature-bullet">📝</span>
                        <div>
                          <strong className="text-gray-900 dark:text-white">
                            强大的内容创作
                          </strong>
                          <p className="text-gray-600 dark:text-gray-300">
                            Markdown编辑器，支持图文帖子和视频帖子发送
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="intro-feature-bullet">💬</span>
                        <div>
                          <strong className="text-gray-900 dark:text-white">
                            丰富的互动功能
                          </strong>
                          <p className="text-gray-600 dark:text-gray-300">
                            点赞收藏评论分享，支持举报机制，保障社区环境
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="intro-feature-bullet">🌐</span>
                        <div>
                          <strong className="text-gray-900 dark:text-white">
                            多语言国际化
                          </strong>
                          <p className="text-gray-600 dark:text-gray-300">
                            支持中文简体、中文繁体、英文多语言切换
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="intro-feature-bullet">👤</span>
                        <div>
                          <strong className="text-gray-900 dark:text-white">
                            个人中心管理
                          </strong>
                          <p className="text-gray-600 dark:text-gray-300">
                            我的收藏、我的帖子、关注管理等完整用户体验
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
                    />
                  </div>
                </div>
              </div>

              {/* 实时聊天系统 */}
              <div className="intro-feature-showcase">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div className="lg:order-2">
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                      <span className="intro-gradient-text">实时聊天系统</span>
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                      基于WebSocket +
                      Kafka的高并发实时聊天，支持私聊、文件发送、消息推送、在线状态等完整即时通讯功能
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
                        <span className="intro-feature-bullet">📎</span>
                        <div>
                          <strong className="text-gray-900 dark:text-white">
                            文件发送支持
                          </strong>
                          <p className="text-gray-600 dark:text-gray-300">
                            支持图片、文档等多种文件类型的实时发送
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="intro-feature-bullet">🟢</span>
                        <div>
                          <strong className="text-gray-900 dark:text-white">
                            在线状态与消息提醒
                          </strong>
                          <p className="text-gray-600 dark:text-gray-300">
                            实时显示用户在线状态，未读消息智能提醒
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="lg:order-1">
                    <MediaDisplay
                      type={MediaType.VIDEO}
                      media={demoMediaData.chatDemos}
                      className="w-full max-w-4xl mx-auto"
                      autoPlay={true}
                      interval={4000}
                    />
                  </div>
                </div>
              </div>

              {/* 云盘文件管理 */}
              <div className="intro-feature-showcase">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                      <span className="intro-gradient-text">云盘文件管理</span>
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                      基于MinIO的企业级云盘存储解决方案，提供文件上传下载、文件夹管理、权限控制、分享链接等完整的云端文件服务
                    </p>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <span className="intro-feature-bullet">☁️</span>
                        <div>
                          <strong className="text-gray-900 dark:text-white">
                            分布式文件存储
                          </strong>
                          <p className="text-gray-600 dark:text-gray-300">
                            高可用、高性能的MinIO对象存储服务
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="intro-feature-bullet">📁</span>
                        <div>
                          <strong className="text-gray-900 dark:text-white">
                            文件夹层级管理
                          </strong>
                          <p className="text-gray-600 dark:text-gray-300">
                            灵活的目录结构与层级组织，智能文件分类
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
                            高效的批量文件处理与进度显示
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="intro-feature-bullet">🔐</span>
                        <div>
                          <strong className="text-gray-900 dark:text-white">
                            权限与分享控制
                          </strong>
                          <p className="text-gray-600 dark:text-gray-300">
                            细粒度权限控制，安全分享链接生成
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
                      media={[...demoMediaData.filesScreenshots, ...demoMediaData.cloudScreenshots]}
                      className="w-full max-w-4xl mx-auto"
                      autoPlay={true}
                      interval={4000}
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
                        <span className="intro-feature-bullet">📍</span>
                        <div>
                          <strong className="text-gray-900 dark:text-white">
                            智能埋点服务
                          </strong>
                          <p className="text-gray-600 dark:text-gray-300">
                            全链路数据埋点收集，精准追踪用户行为轨迹
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
                  <div>
                    <MediaDisplay
                      type={MediaType.VIDEO}
                      media={demoMediaData.analyticsDemo}
                      className="w-full max-w-4xl mx-auto"
                      autoPlay={true}
                      interval={4000}
                    />
                  </div>
                </div>
              </div>


              {/* 智能管理后台 */}
              <div className="intro-feature-showcase">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                      <span className="intro-gradient-text">智能管理后台</span>
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                      基于Vue3 + Element
                      Plus的现代化管理后台，提供用户管理、内容审核、数据统计、系统监控等全面管理功能
                    </p>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <span className="intro-feature-bullet">💻</span>
                        <div>
                          <strong className="text-gray-900 dark:text-white">
                            现代化管理界面
                          </strong>
                          <p className="text-gray-600 dark:text-gray-300">
                            Vue3 + Element Plus构建的现代化登录与管理界面
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="intro-feature-bullet">📊</span>
                        <div>
                          <strong className="text-gray-900 dark:text-white">
                            数据看板与统计
                          </strong>
                          <p className="text-gray-600 dark:text-gray-300">
                            实时用户数据统计、活跃度分析、内容质量监控等可视化看板
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="intro-feature-bullet">👥</span>
                        <div>
                          <strong className="text-gray-900 dark:text-white">
                            用户权限管理
                          </strong>
                          <p className="text-gray-600 dark:text-gray-300">
                            用户角色分配、权限控制、账户状态管理、封禁解封等操作
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="intro-feature-bullet">🛡️</span>
                        <div>
                          <strong className="text-gray-900 dark:text-white">
                            举报处理系统
                          </strong>
                          <p className="text-gray-600 dark:text-gray-300">
                            智能化内容审核与人工复审结合，智能无法判断的举报内容交由人工最终审核
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="intro-feature-bullet">🏷️</span>
                        <div>
                          <strong className="text-gray-900 dark:text-white">
                            标签与内容管理
                          </strong>
                          <p className="text-gray-600 dark:text-gray-300">
                            标签分类管理、用户内容管理、帖子审核与删除等全面内容治理
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <MediaDisplay
                      type={MediaType.IMAGES}
                      media={demoMediaData.adminScreenshots}
                      className="w-full max-w-4xl mx-auto"
                      autoPlay={true}
                      interval={4000}
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

            {/* 时间线式布局 - 优雅的介绍页面风格 */}
            <div className="relative">
              {/* 时间线主轴 */}
              <div className="absolute left-1/2 transform -translate-x-0.5 w-1 h-full bg-gradient-to-b from-orange-400 via-orange-500 to-orange-600 rounded-full"></div>
              
              <div className="space-y-16">
                {/* 阶段 1 */}
                <div className="relative flex items-center">
                  <div className="w-1/2 pr-8 text-right">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-orange-100 dark:border-orange-900/20 hover:shadow-xl transition-all duration-500 hover:scale-105">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        项目架构与技术准备
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        搭建技术基础、数据模型与初始化环境，确立系统架构设计和技术选型，为整个项目奠定坚实的技术基础
                      </p>
                      <div className="flex flex-wrap gap-2 justify-end">
                        <span className="px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm rounded-full border border-orange-200 dark:border-orange-800">Spring Boot</span>
                        <span className="px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm rounded-full border border-orange-200 dark:border-orange-800">Next.js</span>
                        <span className="px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm rounded-full border border-orange-200 dark:border-orange-800">Vue 3</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white dark:bg-gray-800 border-4 border-orange-400 rounded-full flex items-center justify-center shadow-lg z-10">
                    <span className="text-orange-600 font-bold text-lg">1</span>
                  </div>
                  <div className="w-1/2 pl-8"></div>
                </div>

                {/* 阶段 2 */}
                <div className="relative flex items-center">
                  <div className="w-1/2 pr-8"></div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white dark:bg-gray-800 border-4 border-orange-400 rounded-full flex items-center justify-center shadow-lg z-10">
                    <span className="text-orange-600 font-bold text-lg">2</span>
                  </div>
                  <div className="w-1/2 pl-8">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-orange-100 dark:border-orange-900/20 hover:shadow-xl transition-all duration-500 hover:scale-105">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        用户模块开发
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        实现用户注册认证、基础资料与偏好配置，构建完整的用户管理体系，确保系统安全性和用户体验
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm rounded-full border border-orange-200 dark:border-orange-800">JWT认证</span>
                        <span className="px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm rounded-full border border-orange-200 dark:border-orange-800">用户管理</span>
                        <span className="px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm rounded-full border border-orange-200 dark:border-orange-800">权限控制</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 阶段 3 */}
                <div className="relative flex items-center">
                  <div className="w-1/2 pr-8 text-right">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-orange-100 dark:border-orange-900/20 hover:shadow-xl transition-all duration-500 hover:scale-105">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        论坛核心功能开发
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        支持发帖、展示、互动与分类结构搭建，打造完整的社区交流平台，提供丰富的用户互动体验
                      </p>
                      <div className="flex flex-wrap gap-2 justify-end">
                        <span className="px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm rounded-full border border-orange-200 dark:border-orange-800">富文本编辑</span>
                        <span className="px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm rounded-full border border-orange-200 dark:border-orange-800">文件上传</span>
                        <span className="px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm rounded-full border border-orange-200 dark:border-orange-800">标签系统</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white dark:bg-gray-800 border-4 border-orange-400 rounded-full flex items-center justify-center shadow-lg z-10">
                    <span className="text-orange-600 font-bold text-lg">3</span>
                  </div>
                  <div className="w-1/2 pl-8"></div>
                </div>

                {/* 阶段 4 */}
                <div className="relative flex items-center">
                  <div className="w-1/2 pr-8"></div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white dark:bg-gray-800 border-4 border-orange-400 rounded-full flex items-center justify-center shadow-lg z-10">
                    <span className="text-orange-600 font-bold text-lg">4</span>
                  </div>
                  <div className="w-1/2 pl-8">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-orange-100 dark:border-orange-900/20 hover:shadow-xl transition-all duration-500 hover:scale-105">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        云端存储体系构建
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        基于MinIO构建分布式文件系统，实现智能云盘功能和企业级存储服务，保障数据安全与高效访问
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm rounded-full border border-orange-200 dark:border-orange-800">MinIO存储</span>
                        <span className="px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm rounded-full border border-orange-200 dark:border-orange-800">文件管理</span>
                        <span className="px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm rounded-full border border-orange-200 dark:border-orange-800">权限控制</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 阶段 5 */}
                <div className="relative flex items-center">
                  <div className="w-1/2 pr-8 text-right">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-orange-100 dark:border-orange-900/20 hover:shadow-xl transition-all duration-500 hover:scale-105">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        实时聊天系统
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        集成WebSocket、Kafka、Zookeeper构建聊天功能，实现高并发实时通信，提供流畅的即时交流体验
                      </p>
                      <div className="flex flex-wrap gap-2 justify-end">
                        <span className="px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm rounded-full border border-orange-200 dark:border-orange-800">WebSocket</span>
                        <span className="px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm rounded-full border border-orange-200 dark:border-orange-800">Kafka</span>
                        <span className="px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm rounded-full border border-orange-200 dark:border-orange-800">实时通信</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white dark:bg-gray-800 border-4 border-orange-400 rounded-full flex items-center justify-center shadow-lg z-10">
                    <span className="text-orange-600 font-bold text-lg">5</span>
                  </div>
                  <div className="w-1/2 pl-8"></div>
                </div>

                {/* 阶段 6 */}
                <div className="relative flex items-center">
                  <div className="w-1/2 pr-8"></div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white dark:bg-gray-800 border-4 border-orange-400 rounded-full flex items-center justify-center shadow-lg z-10">
                    <span className="text-orange-600 font-bold text-lg">6</span>
                  </div>
                  <div className="w-1/2 pl-8">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-orange-100 dark:border-orange-900/20 hover:shadow-xl transition-all duration-500 hover:scale-105">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        大数据分析系统
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        集成MaxCompute、DataWorks实现数据驱动决策，构建智能化分析平台，提供个性化推荐和深度洞察
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm rounded-full border border-orange-200 dark:border-orange-800">MaxCompute</span>
                        <span className="px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm rounded-full border border-orange-200 dark:border-orange-800">DataWorks</span>
                        <span className="px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm rounded-full border border-orange-200 dark:border-orange-800">数据分析</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 阶段 7 */}
                <div className="relative flex items-center">
                  <div className="w-1/2 pr-8 text-right">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-orange-100 dark:border-orange-900/20 hover:shadow-xl transition-all duration-500 hover:scale-105">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        系统优化与上线
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        性能优化、安全加固、监控部署，确保系统稳定运行和用户体验，实现生产环境的高可用性
                      </p>
                      <div className="flex flex-wrap gap-2 justify-end">
                        <span className="px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm rounded-full border border-orange-200 dark:border-orange-800">性能优化</span>
                        <span className="px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm rounded-full border border-orange-200 dark:border-orange-800">安全加固</span>
                        <span className="px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm rounded-full border border-orange-200 dark:border-orange-800">Docker部署</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white dark:bg-gray-800 border-4 border-orange-400 rounded-full flex items-center justify-center shadow-lg z-10">
                    <span className="text-orange-600 font-bold text-lg">7</span>
                  </div>
                  <div className="w-1/2 pl-8"></div>
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
                  打破地理界限，通过智能管理后台与数据看板，让全球用户无障碍交流分享，构建智能化社区。
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
                <div className="text-4xl text-white mb-6 mx-auto">⚡</div>
                <h3 className="text-xl font-bold mb-4">激发创造</h3>
                <p className="text-white/80 leading-relaxed">
                  提供强大的创作工具和平台，结合用户权限管理，激发创造潜能，让优质内容安全传播。
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
                <div className="text-4xl text-white mb-6 mx-auto">📊</div>
                <h3 className="text-xl font-bold mb-4">数据驱动</h3>
                <p className="text-white/80 leading-relaxed">
                  通过数据看板和统计分析，让知识和经验得到更好的传承，数据驱动运营决策。
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
