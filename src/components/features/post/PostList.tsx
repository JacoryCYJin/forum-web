"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getPostListApi, getPostsByCategoryIdApi } from '@/lib/api/postsApi';
import { getUserInfoApi } from '@/lib/api/userApi';
import type { Post, PageResponse, Tag } from '@/types/postType';
import type { User } from '@/types/userType';
import LanguageText from '@/components/common/LanguageText/LanguageText';
import Pagination from '@/components/common/Pagination/Pagination';

/**
 * 帖子列表组件属性接口
 */
interface PostListProps {
  /**
   * 每页显示的帖子数量
   * @default 10
   */
  pageSize?: number;
  
  /**
   * 搜索关键词
   */
  searchKeyword?: string;
  
  /**
   * 分类ID，如果提供则只显示该分类下的帖子
   */
  categoryId?: string;
}

/**
 * 帖子列表组件
 * 
 * 显示帖子列表，支持分页、搜索和分类过滤功能
 *
 * @component
 * @example
 * // 显示所有帖子
 * <PostList pageSize={10} />
 * 
 * // 显示指定分类的帖子
 * <PostList categoryId="category-123" pageSize={10} />
 * 
 * // 带搜索功能的帖子列表
 * <PostList searchKeyword="Next.js" pageSize={10} />
 */
export default function PostList({ 
  pageSize = 10, 
  searchKeyword,
  categoryId
}: PostListProps) {
  /**
   * 帖子列表数据
   */
  const [posts, setPosts] = useState<Post[]>([]);
  
  /**
   * 分页信息
   */
  const [pageInfo, setPageInfo] = useState<PageResponse<Post> | null>(null);
  
  /**
   * 加载状态
   */
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  /**
   * 错误信息
   */
  const [error, setError] = useState<string | null>(null);
  
  /**
   * 当前页码
   */
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  // 用户信息缓存：userId -> User
  const [userCache, setUserCache] = useState<Map<string, User>>(new Map());
  // 正在请求中的用户ID集合，避免重复请求
  const [fetchingUserIds, setFetchingUserIds] = useState<Set<string>>(new Set());

  /**
   * 获取用户信息并缓存
   * 
   * @param userId - 用户ID
   */
  const fetchUserInfo = useCallback(async (userId: string) => {
    // 如果已经缓存或正在请求中，直接返回
    if (userCache.has(userId) || fetchingUserIds.has(userId)) {
      return;
    }

    // 标记为正在请求中
    setFetchingUserIds(prev => new Set(prev).add(userId));

    try {
      const userInfo = await getUserInfoApi({ userId });
      setUserCache(prev => {
        const newCache = new Map(prev);
        newCache.set(userId, userInfo);
        return newCache;
      });
    } catch (error) {
      console.error(`获取用户信息失败 (userId: ${userId}):`, error);
    } finally {
      // 移除请求中标记
      setFetchingUserIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  }, [userCache, fetchingUserIds]);

  /**
   * 获取帖子列表
   * 
   * @param page - 页码
   */
  const fetchPosts = async (page: number = 1) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let response: PageResponse<Post>;
      
      if (categoryId) {
        // 获取分类下的帖子
        response = await getPostsByCategoryIdApi(categoryId, page, pageSize);
      } else {
        // 获取所有帖子
        const params = {
          page_num: page,
          page_size: pageSize,
          ...(searchKeyword && { title: searchKeyword })
        };
        response = await getPostListApi(params);
      }
      
      const newPosts = response.list || [];
      
      setPosts(newPosts);
      setPageInfo(response);
      setCurrentPage(page);

      // 异步获取所有用户信息
      const userIds = [...new Set(newPosts.map(post => post.userId))];
      userIds.forEach(userId => {
        fetchUserInfo(userId);
      });
    } catch (err: any) {
      setError(err.message || '获取帖子列表失败');
      console.error('获取帖子列表错误:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 组件初始化时获取数据
   */
  useEffect(() => {
    setCurrentPage(1); // 重置页码
    fetchPosts(1);
  }, [searchKeyword, pageSize, categoryId]);

  /**
   * 处理分页变化
   * 
   * @param page - 新的页码
   */
  const handlePageChange = (page: number) => {
    fetchPosts(page);
  };

  /**
   * 获取用户显示名称
   * 
   * @param userId - 用户ID
   * @returns 用户名或默认显示文本
   */
  const getUserDisplayName = (userId: string): string => {
    const user = userCache.get(userId);
    if (user) {
      return user.username || `用户${userId}`;
    }
    
    // 如果正在获取用户信息，显示加载状态
    if (fetchingUserIds.has(userId)) {
      return '加载中...';
    }
    
    // 默认显示用户ID
    return `用户${userId}`;
  };

  /**
   * 渲染标签列表
   * 
   * @param tags - 标签数组
   * @returns JSX元素
   */
  const renderTags = (tags: Tag[]) => {
    if (!tags || tags.length === 0) {
      return null;
    }

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {tags.slice(0, 3).map((tag) => (
          <span
            key={tag.tagId}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            #{tag.tagName}
          </span>
        ))}
        {tags.length > 3 && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 dark:bg-zinc-700 text-neutral-600 dark:text-neutral-300">
            +{tags.length - 3}
          </span>
        )}
      </div>
    );
  };

  // 加载状态
  if (isLoading && posts.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-neutral-600 dark:text-neutral-300">
          <LanguageText 
            texts={{
              'zh-CN': '加载中...',
              'zh-TW': '載入中...',
              'en': 'Loading...'
            }}
          />
        </span>
      </div>
    );
  }

  // 错误状态
  if (error && posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={() => fetchPosts()}
          className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-hover transition-colors"
        >
          <LanguageText 
            texts={{
              'zh-CN': '重试',
              'zh-TW': '重試',
              'en': 'Retry'
            }}
          />
        </button>
      </div>
    );
  }

  // 空状态
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-neutral-500 dark:text-neutral-400">
          <LanguageText 
            texts={{
              'zh-CN': categoryId ? '该分类下暂无帖子' : '暂无帖子',
              'zh-TW': categoryId ? '該分類下暫無貼文' : '暫無貼文',
              'en': categoryId ? 'No posts in this category' : 'No posts found'
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 帖子列表 */}
      {posts.map((post) => (
        <article 
          key={post.postId} 
          className="bg-white dark:bg-dark-secondary rounded-md shadow hover:shadow-md transition-shadow p-4"
        >
          <div className="flex-1 px-2">
            <div className="flex items-center text-xs text-neutral-400 mb-1">
              <span className="px-2 py-1 bg-neutral-100 dark:bg-zinc-700 rounded-full text-xs text-neutral-600 dark:text-neutral-300 mr-2">
                {post.category.categoryName}
              </span>
              <span>
                <LanguageText 
                  texts={{
                    'zh-CN': `由 ${getUserDisplayName(post.userId)} 发布`,
                    'zh-TW': `由 ${getUserDisplayName(post.userId)} 發布`,
                    'en': `Posted by ${getUserDisplayName(post.userId)}`
                  }}
                />
              </span>
            </div>
            
            <Link 
              href={`/post/${post.postId}`} 
              className="text-lg font-medium text-neutral-800 dark:text-white hover:text-primary dark:hover:text-primary mb-2 block"
            >
              {post.title}
            </Link>
            
            <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">
              {post.content.length > 100 
                ? `${post.content.substring(0, 100)}...` 
                : post.content
              }
            </div>
            
            {/* 标签显示区域 */}
            {renderTags(post.tags)}
            
            <div className="flex items-center text-sm text-neutral-400 mt-3">
              <button className="flex items-center hover:bg-neutral-100 dark:hover:bg-zinc-700 px-2 py-1 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                0 <LanguageText 
                  texts={{
                    'zh-CN': '评论',
                    'zh-TW': '評論',
                    'en': 'comments'
                  }}
                />
              </button>
              
              <button className="flex items-center hover:bg-neutral-100 dark:hover:bg-zinc-700 px-2 py-1 rounded ml-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <LanguageText 
                  texts={{
                    'zh-CN': '分享',
                    'zh-TW': '分享',
                    'en': 'Share'
                  }}
                />
              </button>
              
              <button className="flex items-center hover:bg-neutral-100 dark:hover:bg-zinc-700 px-2 py-1 rounded ml-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <LanguageText 
                  texts={{
                    'zh-CN': '收藏',
                    'zh-TW': '收藏',
                    'en': 'Save'
                  }}
                />
              </button>
            </div>
          </div>
        </article>
      ))}
      
      {/* 分页组件 */}
      {pageInfo && pageInfo.total > 0 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={pageInfo.pages}
            total={pageInfo.total}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            showWhenSinglePage={true}
          />
        </div>
      )}
    </div>
  );
}
 