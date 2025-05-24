import Link from "next/link";
import MapWrapper from "./MapWrapper";
import Footer from "@/components/common/Footer/Footer";

export default function MapPage() {
  return (
    <div className="flex flex-col">
      {/* 地图组件占据整个屏幕高度的第一部分 */}
      <div className="relative h-screen">
        <MapWrapper />

        {/* 顶部项目名称和介绍 */}
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-50 text-center">
          <h1 className="text-4xl font-bold text-white mb-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            综合性社区论坛
          </h1>
          <p className="text-xl text-white max-w-lg px-4" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
            一个面向所有用户的互动型社区论坛，支持信息交流、资源分享与动态社交。在地图上发现身边的话题，让交流更智能、更有温度。
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
            进入论坛
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
        
        {/* 向下滚动提示 */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
      
      {/* 项目详细介绍部分 */}
      <div className="bg-white dark:bg-dark-secondary py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-neutral-800 dark:text-white">项目详细介绍</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-gray-50 dark:bg-dark-primary p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-4 text-neutral-800 dark:text-white">社区互动</h3>
              <p className="text-neutral-700 dark:text-neutral-200 mb-6">
                我们的平台不仅仅是一个传统的论坛，更是一个基于地理位置的社交网络。用户可以看到周围正在发生的事情，
                参与附近的讨论，发现身边的有趣话题。这种基于位置的互动方式，让社区交流更加即时、真实和有温度。
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="bg-primary rounded-full p-1 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-neutral-700 dark:text-neutral-300">实时互动与反馈</span>
                </li>
                <li className="flex items-center">
                  <div className="bg-primary rounded-full p-1 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-neutral-700 dark:text-neutral-300">基于位置的推荐系统</span>
                </li>
                <li className="flex items-center">
                  <div className="bg-primary rounded-full p-1 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-neutral-700 dark:text-neutral-300">多样化的内容形式</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 dark:bg-dark-primary p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-4 text-neutral-800 dark:text-white">技术特点</h3>
              <p className="text-neutral-700 dark:text-neutral-200 mb-6">
                我们采用最新的技术栈构建平台，确保用户体验流畅、安全和高效。从前端到后端，
                每一个技术选择都经过精心考量，以提供最佳的性能和可靠性。
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="bg-primary rounded-full p-1 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-neutral-700 dark:text-neutral-300">高性能地图渲染</span>
                </li>
                <li className="flex items-center">
                  <div className="bg-primary rounded-full p-1 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-neutral-700 dark:text-neutral-300">实时数据更新</span>
                </li>
                <li className="flex items-center">
                  <div className="bg-primary rounded-full p-1 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-neutral-700 dark:text-neutral-300">响应式设计适配各种设备</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-16 bg-gray-50 dark:bg-dark-primary p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-6 text-neutral-800 dark:text-white">我们的愿景</h3>
            <p className="text-neutral-700 dark:text-neutral-200 text-lg leading-relaxed">
              我们致力于创建一个更加智能、便捷的社区交流平台，让用户能够轻松发现身边的信息和话题，
              建立真实的社交连接。在这个信息爆炸的时代，我们希望通过地理位置的筛选，
              让用户获取到更加精准、有价值的内容，同时也促进线上交流向线下活动的延伸，
              让虚拟社区与现实生活产生更多积极的互动。
            </p>
          </div>
        </div>
      </div>
      
      {/* 页脚 */}
      <Footer />
    </div>
  );
}
