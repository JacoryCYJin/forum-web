/**
 * @file 分类页面组件
 * @description 显示指定分类下的文章列表
 */

import { notFound } from 'next/navigation';
import { getCategoryByIdApi } from '@/lib/api/categoryApi';
import { CategoryPageProps } from '@/types/categoryType';
import PostList from '@/components/features/post/PostList';
import LanguageText from '@/components/common/LanguageText/LanguageText';

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
  const { categoryId } = await params;

  // 如果分类ID无效，显示404页面
  if (!categoryId) {
    notFound();
  }

  // 根据分类ID获取分类信息
  let category;
  try {
    category = await getCategoryByIdApi(categoryId);
  } catch (error) {
    console.error('获取分类信息失败:', error);
    notFound();
  }

  // 如果分类不存在，显示404页面
  if (!category) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* 分类信息卡片 */}
      <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
              <LanguageText 
                texts={{
                  'zh-CN': `分类: ${category.categoryName}`,
                  'zh-TW': `分類: ${category.categoryName}`,
                  'en': `Category: ${category.categoryName}`
                }}
              />
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              <LanguageText 
                texts={{
                  'zh-CN': '浏览该分类下的所有文章',
                  'zh-TW': '瀏覽該分類下的所有文章',
                  'en': 'Browse all posts in this category'
                }}
              />
            </p>
          </div>
          
          {/* 分类徽章 */}
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            {category.categoryName}
          </div>
        </div>
        
        {/* 分类详细信息 */}
        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-zinc-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <span className="block text-neutral-500 dark:text-neutral-400">
                <LanguageText 
                  texts={{
                    'zh-CN': '分类ID',
                    'zh-TW': '分類ID',
                    'en': 'Category ID'
                  }}
                />
              </span>
              <span className="block text-neutral-900 dark:text-white font-mono text-xs mt-1">
                {categoryId}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 帖子列表标题 */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-neutral-800 dark:text-white">
          <LanguageText 
            texts={{
              'zh-CN': '相关帖子',
              'zh-TW': '相關貼文',
              'en': 'Related Posts'
            }}
          />
        </h2>
      </div>

      {/* 帖子列表 */}
      <PostList 
        key={categoryId} // 添加key确保组件在不同分类间正确重新渲染
        categoryId={categoryId}
        pageSize={10}
      />
    </div>
  );
}

export default CategoryPage; 