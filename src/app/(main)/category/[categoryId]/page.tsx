/**
 * @file 分类页面组件
 * @description 显示指定分类下的文章列表
 */

import { notFound } from 'next/navigation';

/**
 * 分类页面属性接口
 */
interface CategoryPageProps {
  /**
   * 路由参数
   */
  params: {
    /**
     * 分类ID
     */
    categoryId: string;
  };
}

/**
 * 分类页面组件
 * 
 * 根据分类ID显示该分类下的文章列表
 * 
 * @async
 * @param {CategoryPageProps} props - 组件属性
 * @returns {Promise<React.ReactElement>} 分类页面React元素
 */
async function CategoryPage({ params }: CategoryPageProps): Promise<React.ReactElement> {
  const { categoryId } = params;

  // 如果分类ID无效，显示404页面
  if (!categoryId) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-dark-secondary">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            分类: {categoryId}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            浏览该分类下的所有文章
          </p>
        </div>

        {/* 文章列表区域 */}
        <div className="bg-white dark:bg-dark-primary rounded-lg shadow-sm border border-neutral-200 dark:border-zinc-800 p-6">
          <div className="text-center py-12">
            <div className="text-neutral-400 dark:text-neutral-500 mb-4">
              <svg 
                className="w-16 h-16 mx-auto mb-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
              暂无文章
            </h3>
            <p className="text-neutral-500 dark:text-neutral-400 mb-6">
              该分类下还没有文章，来发布第一篇吧！
            </p>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
              发布文章
            </button>
          </div>
        </div>

        {/* 侧边信息栏 */}
        <div className="mt-8 bg-white dark:bg-dark-primary rounded-lg shadow-sm border border-neutral-200 dark:border-zinc-800 p-6">
          <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-4">
            分类信息
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-500 dark:text-neutral-400">分类ID:</span>
              <span className="text-neutral-900 dark:text-white">{categoryId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500 dark:text-neutral-400">文章数量:</span>
              <span className="text-neutral-900 dark:text-white">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500 dark:text-neutral-400">关注人数:</span>
              <span className="text-neutral-900 dark:text-white">0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryPage; 