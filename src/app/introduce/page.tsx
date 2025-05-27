import Link from "next/link";
import MapWrapper from "./MapWrapper";
import SimpleLayout from "@/components/common/Layout/SimpleLayout";

export default function MapPage() {
  return (
    <SimpleLayout>
      <div className="flex flex-col">
        {/* 地图组件占据整个屏幕高度的第一部分 */}
        <div className="relative h-screen">
          <MapWrapper />

          {/* 顶部项目名称和介绍 */}
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-50 text-center">
            <h1
              className="text-4xl font-bold text-white mb-2"
              style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
            >
              云社 · OpenShare
            </h1>
            <p
              className="text-xl text-white max-w-lg px-4"
              style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}
            >
              一个融合内容交流与文件分享的综合性社区平台，打造开放、便捷、安全的互动空间。
            </p>
          </div>

          {/* 进入论坛按钮，固定在屏幕中间底部 */}
          <div className="absolute left-1/2 bottom-10 transform -translate-x-1/2 z-50">
            <Link
              href="/"
              className="bg-primary hover:bg-primary-dark text-white font-medium py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                />
              </svg>
              进入 云社 · OpenShare
            </Link>
          </div>

          {/* 右侧功能介绍 */}
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2 z-50 bg-white dark:bg-dark-secondary bg-opacity-90 dark:bg-opacity-90 p-6 rounded-lg shadow-lg max-w-xs">
            <h2 className="text-2xl font-bold text-neutral-800 dark:text-white mb-4">
              平台特色
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="bg-primary rounded-full p-1 mr-2 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-neutral-700 dark:text-neutral-200">
                  支持富文本发帖与多媒体内容交流
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-primary rounded-full p-1 mr-2 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-neutral-700 dark:text-neutral-200">
                  内建文件云盘，支持上传、管理与加密分享
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-primary rounded-full p-1 mr-2 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-neutral-700 dark:text-neutral-200">
                  个性化标签体系，构建专属信息空间
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-primary rounded-full p-1 mr-2 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-neutral-700 dark:text-neutral-200">
                  多端适配与深色模式，提升浏览体验
                </span>
              </li>
            </ul>
          </div>

          {/* 向下滚动提示 */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white opacity-80"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>

        {/* 项目详细介绍部分 */}
        <div className="bg-white dark:bg-dark-secondary py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-neutral-800 dark:text-white">
              项目详细介绍
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* 社区互动模块 */}
              <div className="bg-gray-50 dark:bg-dark-primary p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold mb-4 text-neutral-800 dark:text-white">
                  内容交流
                </h3>
                <p className="text-neutral-700 dark:text-neutral-200 mb-6">
                  云社不仅是一个论坛，更是一个注重个性表达与话题分享的内容社区。用户可以发布文字、图片、链接等多种形式的帖子，围绕标签聚集兴趣圈层，实现高效互动与观点碰撞。
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <div className="bg-primary rounded-full p-1 mr-2">
                      <svg
                        className="h-3 w-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-neutral-700 dark:text-neutral-300">
                      支持图文、链接、标签等多种发帖形式
                    </span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-primary rounded-full p-1 mr-2">
                      <svg
                        className="h-3 w-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-neutral-700 dark:text-neutral-300">
                      标签系统驱动内容分类与推荐
                    </span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-primary rounded-full p-1 mr-2">
                      <svg
                        className="h-3 w-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-neutral-700 dark:text-neutral-300">
                      关注与动态系统打造个性化首页
                    </span>
                  </li>
                </ul>
              </div>

              {/* 技术特点模块 */}
              <div className="bg-gray-50 dark:bg-dark-primary p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold mb-4 text-neutral-800 dark:text-white">
                  文件与技术支持
                </h3>
                <p className="text-neutral-700 dark:text-neutral-200 mb-6">
                  平台内建文件云盘系统，支持用户上传、管理与分享文件资源。配合现代化前后端架构，提供稳定可靠的使用体验，满足日常社交与资源协作的双重需求。
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <div className="bg-primary rounded-full p-1 mr-2">
                      <svg
                        className="h-3 w-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-neutral-700 dark:text-neutral-300">
                      云盘支持文件上传、删除与私密分享
                    </span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-primary rounded-full p-1 mr-2">
                      <svg
                        className="h-3 w-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-neutral-700 dark:text-neutral-300">
                      前后端分离，基于 React + Spring Boot 构建
                    </span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-primary rounded-full p-1 mr-2">
                      <svg
                        className="h-3 w-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-neutral-700 dark:text-neutral-300">
                      响应式设计，适配桌面与移动端
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 愿景模块 */}
            <div className="mt-16 bg-gray-50 dark:bg-dark-primary p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-6 text-neutral-800 dark:text-white">
                我们的愿景
              </h3>
              <p className="text-neutral-700 dark:text-neutral-200 text-lg leading-relaxed">
                我们希望打造一个真正开放而多元的社区空间，让用户不仅能交流观点，更能自由分享文件资源，在兴趣和知识中找到归属感。
                云社致力于连接信息与人、创意与实现，成为个人表达与资源协作的聚合场所，为学习、生活与工作注入更多可能性。
              </p>
            </div>
          </div>
        </div>
      </div>
    </SimpleLayout>
  );
}
