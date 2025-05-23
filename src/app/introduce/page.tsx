import Link from "next/link";
import Footer from "@/components/common/Footer/Footer";
import MapWrapper from "./MapWrapper";

export default function MapPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 地图组件占据主要空间 */}
      <div className="flex-grow relative">
        <MapWrapper />

        {/* 顶部项目名称和介绍 */}
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-10 text-center">
          <h1 className="text-4xl font-bold text-white mb-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            综合性社区论坛
          </h1>
          <p className="text-xl text-white max-w-lg px-4" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
            一个面向所有用户的互动型社区论坛，支持信息交流、资源分享与动态社交。在地图上发现身边的话题，让交流更智能、更有温度。
          </p>
        </div>

        {/* 进入论坛按钮，固定在屏幕中间底部 */}
        <div className="absolute left-1/2 bottom-10 transform -translate-x-1/2 z-10">
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
            进入论坛
          </Link>
        </div>

        {/* 右侧功能介绍 */}
        <div className="absolute right-10 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-dark-secondary bg-opacity-90 dark:bg-opacity-90 p-6 rounded-lg shadow-lg max-w-xs">
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
                实时地理位置发帖，帖子在地图上显示
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
                帖子气泡随时间逐渐淡化，30分钟后消失
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
                发现身边的热门话题和有趣内容
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
                基于位置的社交互动和信息分享
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* 页脚 */}
      <Footer />
    </div>
  );
}
