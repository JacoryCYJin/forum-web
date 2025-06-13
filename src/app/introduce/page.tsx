/**
 * @file 云社 · OpenShare 介绍页面
 * @module app/introduce
 * @description 展示平台特色、技术架构和愿景的综合介绍页面
 */

'use client';

import React from 'react';
import Link from "next/link";
import MapWrapper from "./MapWrapper";
import SimpleLayout from "@/components/common/Layout/SimpleLayout";

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
              <h1 className="intro-hero-title text-gray-800 dark:text-white mb-4" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>
                <span className="intro-gradient-text">
                  云社
                </span>
                <span className="text-gray-800 dark:text-white mx-4">·</span>
                <span className="text-gray-800 dark:text-white">OpenShare</span>
              </h1>
              <p className="text-xl md:text-2xl lg:text-3xl text-gray-700 dark:text-white/90 max-w-4xl mx-auto leading-relaxed mb-6" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.4)'}}>
                连接世界，分享智慧 —— 打造下一代智能社交平台
              </p>
              <p className="text-lg md:text-xl text-gray-600 dark:text-white/80 max-w-3xl mx-auto leading-relaxed px-4" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.3)'}}>
                一个面向所有用户的互动型社区论坛，支持信息交流、资源分享与动态社交。
                在地图上发现身边的话题，让交流更智能、更有温度。
              </p>
            </div>

            {/* CTA 按钮组 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/"
                className="intro-button-primary py-4 px-8 flex items-center shadow-lg"
              >
                <svg className="h-5 w-5 mr-2 intro-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                立即体验
              </Link>
              <button className="bg-white text-gray-800 border-2 border-gray-300 hover:border-primary hover:text-primary py-4 px-8 flex items-center rounded-lg font-semibold transition-all duration-300 shadow-lg">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                了解更多
              </button>
            </div>
          </div>

          {/* 浮动特性卡片 */}
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-50 hidden lg:block intro-float">
            <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-2xl max-w-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">平台亮点</h3>
              <div className="space-y-3">
                {[
                  { icon: "🌍", text: "地理位置社交" },
                  { icon: "💬", text: "智能内容推荐" },
                  { icon: "☁️", text: "云端文件管理" },
                  { icon: "🎨", text: "个性化定制" }
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

        {/* 统计数据区块 - 移除动画 */}
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

        {/* 核心功能区块 */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="intro-section-title intro-gradient-text font-bold mb-6">
                核心功能特性
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                集成先进技术，为用户提供全方位的社交体验
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* 智能内容创作 */}
              <div className="intro-feature-card-orange rounded-3xl p-8 intro-card-hover">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-orange-600 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">⚡</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">智能内容创作</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  AI辅助的内容创作工具，支持多媒体编辑、智能标签和自动优化，让创作更高效。
                </p>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center">
                    <span className="w-4 h-4 text-primary mr-2">⭐</span>
                    Markdown编辑器
                  </li>
                  <li className="flex items-center">
                    <span className="w-4 h-4 text-primary mr-2">⭐</span>
                    图片智能压缩
                  </li>
                  <li className="flex items-center">
                    <span className="w-4 h-4 text-primary mr-2">⭐</span>
                    内容智能推荐
                  </li>
                </ul>
              </div>

              {/* 云端文件管理 */}
              <div className="intro-feature-card-blue rounded-3xl p-8 intro-card-hover">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary to-blue-700 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">☁️</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">云端文件管理</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  基于MinIO的分布式存储系统，提供安全可靠的文件管理和分享服务。
                </p>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center">
                    <span className="w-4 h-4 text-secondary mr-2">⭐</span>
                    无限容量存储
                  </li>
                  <li className="flex items-center">
                    <span className="w-4 h-4 text-secondary mr-2">⭐</span>
                    多格式支持
                  </li>
                  <li className="flex items-center">
                    <span className="w-4 h-4 text-secondary mr-2">⭐</span>
                    安全加密传输
                  </li>
                </ul>
              </div>

              {/* 地理位置社交 */}
              <div className="intro-feature-card-warm rounded-3xl p-8 intro-card-hover">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-yellow-600 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white">📍</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">地理位置社交</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  创新的地图社交功能，发现身边的精彩内容，与附近的用户建立连接。
                </p>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center">
                    <span className="w-4 h-4 text-primary mr-2">⭐</span>
                    实时位置分享
                  </li>
                  <li className="flex items-center">
                    <span className="w-4 h-4 text-primary mr-2">⭐</span>
                    附近内容发现
                  </li>
                  <li className="flex items-center">
                    <span className="w-4 h-4 text-primary mr-2">⭐</span>
                    地理标签系统
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 技术架构区块 */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="intro-section-title intro-gradient-text font-bold mb-6">
                技术架构
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                采用现代化技术栈，确保平台的高性能、高可用性和可扩展性
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* 前端技术 */}
              <div className="intro-card-hover border-0 shadow-lg bg-white dark:bg-gray-800 rounded-lg">
                <div className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-orange-600 rounded-2xl flex items-center justify-center mb-6">
                    <span className="text-2xl text-white">💻</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">前端技术栈</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Next.js 14</span>
                      <span className="text-primary font-semibold">React框架</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">TypeScript</span>
                      <span className="text-primary font-semibold">类型安全</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Tailwind CSS</span>
                      <span className="text-primary font-semibold">样式框架</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Element Plus</span>
                      <span className="text-primary font-semibold">UI组件库</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Zustand</span>
                      <span className="text-primary font-semibold">状态管理</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 后端技术 */}
              <div className="intro-card-hover border-0 shadow-lg bg-white dark:bg-gray-800 rounded-lg">
                <div className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary to-blue-700 rounded-2xl flex items-center justify-center mb-6">
                    <span className="text-2xl text-white">🗄️</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">后端技术栈</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Spring Boot</span>
                      <span className="text-secondary font-semibold">Java框架</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">MySQL</span>
                      <span className="text-secondary font-semibold">关系数据库</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Redis</span>
                      <span className="text-secondary font-semibold">缓存系统</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">MinIO</span>
                      <span className="text-secondary font-semibold">对象存储</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">JWT</span>
                      <span className="text-secondary font-semibold">身份认证</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 基础设施 */}
              <div className="intro-card-hover border-0 shadow-lg bg-white dark:bg-gray-800 rounded-lg">
                <div className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-yellow-600 rounded-2xl flex items-center justify-center mb-6">
                    <span className="text-2xl text-white">🚀</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">基础设施</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Docker</span>
                      <span className="text-primary font-semibold">容器化</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Nginx</span>
                      <span className="text-primary font-semibold">反向代理</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">CDN</span>
                      <span className="text-primary font-semibold">内容分发</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">SSL/TLS</span>
                      <span className="text-primary font-semibold">安全传输</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">监控告警</span>
                      <span className="text-primary font-semibold">运维保障</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 用户体验亮点 */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="intro-section-title intro-gradient-text font-bold mb-6">
                用户体验亮点
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                每一个细节都经过精心设计，为用户提供极致的使用体验
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center intro-card-hover">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl text-white">📱</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">响应式设计</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  完美适配各种设备，无论是手机、平板还是桌面端，都能获得一致的优质体验。
                </p>
              </div>

              <div className="text-center intro-card-hover">
                <div className="w-20 h-20 bg-gradient-to-br from-secondary to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl text-white">⚡</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">极速加载</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  采用先进的缓存策略和CDN加速，确保页面加载速度快如闪电。
                </p>
              </div>

              <div className="text-center intro-card-hover">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl text-white">🌍</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">个性化主题</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  支持浅色/深色模式切换，多种主题配色，打造专属的视觉体验。
                </p>
              </div>

              <div className="text-center intro-card-hover">
                <div className="w-20 h-20 bg-gradient-to-br from-secondary to-blue-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl text-white">🛡️</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">隐私保护</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  严格的数据保护机制，用户隐私安全是我们的首要考虑。
                </p>
              </div>
            </div>

            {/* 演示界面 */}
            <div className="mt-16 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden">
              <div className="intro-gradient-stats p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="text-white font-medium">云社 · OpenShare</div>
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">实时动态</h4>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-white">👥</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900 dark:text-white font-medium">张三</p>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">分享了一张美丽的风景照片</p>
                          <p className="text-gray-400 text-xs">2分钟前</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                          <span className="text-white">📝</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900 dark:text-white font-medium">李四</p>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">发布了技术分享文章</p>
                          <p className="text-gray-400 text-xs">5分钟前</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">热门话题</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-gray-900 dark:text-white">#前端开发</span>
                        <span className="text-primary font-semibold">1.2k</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-gray-900 dark:text-white">#摄影分享</span>
                        <span className="text-primary font-semibold">856</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-gray-900 dark:text-white">#生活记录</span>
                        <span className="text-primary font-semibold">642</span>
                      </div>
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
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-white rounded-full mix-blend-multiply intro-float" style={{animationDelay: '3s'}}></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="intro-section-title font-bold mb-8">我们的愿景</h2>
            <p className="text-2xl mb-16 max-w-4xl mx-auto leading-relaxed">
              &ldquo;让每个人都能在数字世界中找到属于自己的声音，
              通过技术的力量连接彼此，分享知识，创造价值。&rdquo;
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="intro-glass rounded-2xl p-8">
                <div className="text-4xl text-white mb-6 mx-auto">🌍</div>
                <h3 className="text-xl font-bold mb-4">连接世界</h3>
                <p className="text-white/80 leading-relaxed">
                  打破地理界限，让全球用户能够无障碍地交流和分享，构建真正的全球化社区。
                </p>
              </div>
              <div className="intro-glass rounded-2xl p-8">
                <div className="text-4xl text-white mb-6 mx-auto">⚡</div>
                <h3 className="text-xl font-bold mb-4">激发创造</h3>
                <p className="text-white/80 leading-relaxed">
                  提供强大的创作工具和平台，激发每个用户的创造潜能，让优质内容得到更好的传播。
                </p>
              </div>
              <div className="intro-glass rounded-2xl p-8">
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
              <p className="text-white/80">
                —— 云社 · OpenShare 团队
              </p>
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
              成为云社 · OpenShare 的一员，与全球用户一起分享知识、创造价值、连接未来
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <button className="intro-button-primary px-10 py-4 text-lg font-semibold rounded-full">
                立即注册
              </button>
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
