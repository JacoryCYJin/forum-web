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
      <div className="bg-white dark:bg-dark-secondary rounded-lg shadow border border-neutral-200 dark:border-zinc-700">
        <div className="p-6">
          <div className="flex items-center space-x-4">
            {/* 分类图标 */}
            <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            
            <div className="">
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                {category.categoryName}
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
              <LanguageText 
                texts={{
                  'zh-CN': '分类',
                  'zh-TW': '分類',
                  'en': 'Category'
                }}
              />
            </div>
          </div>
        </div>
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