"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { flushSync } from 'react-dom';
import Link from 'next/link';
import { getPostListApi, getPostsByCategoryIdApi } from '@/lib/api/postsApi';
import { getUserFavouritesApi, toggleFavouriteApi, checkFavouriteApi } from '@/lib/api/favouriteApi';
import { getUserInfoApi } from '@/lib/api/userApi';
import { usePaginationStore } from '@/store/paginationStore';
import type { Post, PageResponse } from '@/types/postType';
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
  
  /**
   * 是否显示收藏列表
   */
  showFavourites?: boolean;
  
  /**
   * 用户ID，当显示收藏列表时使用，为空时使用当前登录用户
   */
  userId?: string;
}

/**
 * 帖子列表组件
 * 
 * 显示帖子列表，支持分页、搜索、分类过滤和收藏列表功能
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
 * 
 * // 显示用户收藏列表
 * <PostList showFavourites={true} userId="user-123" pageSize={10} />
 */
export default function PostList({ 
  pageSize = 10, 
  searchKeyword,
  categoryId,
  showFavourites = false,
  userId = ''
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
  
  // 用户信息缓存：userId -> User
  const [userCache, setUserCache] = useState<Map<string, User>>(new Map());
  // 正在请求中的用户ID集合，避免重复请求
  const [fetchingUserIds, setFetchingUserIds] = useState<Set<string>>(new Set());
  
  // 收藏状态缓存：postId -> boolean
  const [favouriteCache, setFavouriteCache] = useState<Map<string, boolean>>(new Map());
  // 正在切换收藏状态的帖子ID集合
  const [togglingFavouriteIds, setTogglingFavouriteIds] = useState<Set<string>>(new Set());

  // 点赞状态缓存：postId -> boolean
  const [likeCache, setLikeCache] = useState<Map<string, boolean>>(new Map());
  // 正在切换点赞状态的帖子ID集合
  const [togglingLikeIds, setTogglingLikeIds] = useState<Set<string>>(new Set());

  // 使用ref来跟踪上一次的props，避免不必要的重置
  const prevPropsRef = useRef({ categoryId, searchKeyword, pageSize, showFavourites, userId });

  // 分页状态管理
  const { getPage, setPage, resetPage } = usePaginationStore();
  
  // 生成页面唯一标识
  const pageKey = showFavourites 
    ? `favourites-${userId || 'current'}` 
    : categoryId 
      ? `category-${categoryId}` 
      : searchKeyword 
        ? `search-${searchKeyword}` 
        : 'home';
  
  // 从store获取当前页码
  const currentPage = getPage(pageKey);

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
   * 获取帖子收藏状态
   * 
   * @param postId - 帖子ID
   */
  const fetchFavouriteStatus = useCallback(async (postId: string) => {
    // 如果已经缓存，直接返回
    if (favouriteCache.has(postId)) {
      return;
    }

    try {
      const isFavourited = await checkFavouriteApi({ postId });
      setFavouriteCache(prev => {
        const newCache = new Map(prev);
        newCache.set(postId, isFavourited);
        return newCache;
      });
    } catch (error) {
      console.error(`获取收藏状态失败 (postId: ${postId}):`, error);
    }
  }, [favouriteCache]);

  /**
   * 切换收藏状态
   * 
   * @param postId - 帖子ID
   */
  const handleToggleFavourite = useCallback(async (postId: string) => {
    // 如果正在切换中，直接返回
    if (togglingFavouriteIds.has(postId)) {
      return;
    }

    // 标记为正在切换中
    setTogglingFavouriteIds(prev => new Set(prev).add(postId));

    try {
      const newFavouriteStatus = await toggleFavouriteApi({ postId });
      
      // 更新缓存
      setFavouriteCache(prev => {
        const newCache = new Map(prev);
        newCache.set(postId, newFavouriteStatus);
        return newCache;
      });
      
      console.log(`${newFavouriteStatus ? '已收藏' : '已取消收藏'} 帖子: ${postId}`);
    } catch (error) {
      console.error(`切换收藏状态失败 (postId: ${postId}):`, error);
    } finally {
      // 移除切换中标记
      setTogglingFavouriteIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  }, [togglingFavouriteIds]);

  /**
   * 切换点赞状态
   * 
   * @param postId - 帖子ID
   */
  const handleToggleLike = useCallback(async (postId: string) => {
    // 如果正在切换中，直接返回
    if (togglingLikeIds.has(postId)) {
      return;
    }

    // 标记为正在切换中
    setTogglingLikeIds(prev => new Set(prev).add(postId));

    try {
      // 这里暂时模拟点赞功能，后续可以替换为真实API
      const currentLikeStatus = likeCache.get(postId) || false;
      const newLikeStatus = !currentLikeStatus;
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 更新缓存
      setLikeCache(prev => {
        const newCache = new Map(prev);
        newCache.set(postId, newLikeStatus);
        return newCache;
      });
      
      console.log(`${newLikeStatus ? '已点赞' : '已取消点赞'} 帖子: ${postId}`);
    } catch (error) {
      console.error(`切换点赞状态失败 (postId: ${postId}):`, error);
    } finally {
      // 移除切换中标记
      setTogglingLikeIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  }, [togglingLikeIds, likeCache]);

  /**
   * 分享帖子 - 复制链接到剪贴板
   * 
   * @param postId - 帖子ID
   * @param title - 帖子标题
   */
  const handleShare = useCallback(async (postId: string, title: string) => {
    try {
      const url = `${window.location.origin}/post/${postId}`;
      await navigator.clipboard.writeText(url);
      
      // 这里可以添加一个toast提示，暂时用console.log
      console.log(`已复制链接到剪贴板: ${title}`);
      
      // 可以添加一个临时的成功提示
      const button = document.activeElement as HTMLButtonElement;
      if (button) {
        const originalText = button.innerHTML;
        button.innerHTML = `
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span class="text-xs">已复制</span>
        `;
        setTimeout(() => {
          button.innerHTML = originalText;
        }, 2000);
      }
    } catch (error) {
      console.error('复制链接失败:', error);
      // 降级方案：选择文本
      const textArea = document.createElement('textarea');
      textArea.value = `${window.location.origin}/post/${postId}`;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }, []);

  /**
   * 获取帖子列表数据
   * 
   * @param page - 页码
   */
  const fetchPosts = useCallback(async (page: number = 1) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let response: PageResponse<Post>;
      
      if (showFavourites) {
        // 获取收藏列表
        response = await getUserFavouritesApi({
          pageNum: page,
          pageSize,
          userId
        });
      } else if (categoryId) {
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
      
      // 使用flushSync强制同步更新状态
      flushSync(() => {
        setPosts(newPosts);
        setPageInfo(response);
      });

      // 异步获取所有用户信息和收藏状态
      const userIds = [...new Set(newPosts.map(post => post.userId))];
      userIds.forEach(userId => {
        fetchUserInfo(userId);
      });
      
      // 如果不是收藏列表页面，获取收藏状态
      if (!showFavourites) {
        newPosts.forEach(post => {
          fetchFavouriteStatus(post.postId);
        });
      }
    } catch (err: any) {
      setError(err.message || '获取帖子列表失败');
      console.error('获取帖子列表错误:', err);
    } finally {
      setIsLoading(false);
    }
  }, [categoryId, pageSize, searchKeyword, showFavourites, userId, fetchUserInfo]);

  /**
   * 组件初始化和关键props变化时获取数据
   */
  useEffect(() => {
    const prevProps = prevPropsRef.current;
    const currentProps = { categoryId, searchKeyword, pageSize, showFavourites, userId };
    
    // 检查是否是真正需要重置页码的变化
    const shouldResetPage = (
      prevProps.categoryId !== currentProps.categoryId ||
      prevProps.searchKeyword !== currentProps.searchKeyword ||
      prevProps.pageSize !== currentProps.pageSize ||
      prevProps.showFavourites !== currentProps.showFavourites ||
      prevProps.userId !== currentProps.userId
    );
    
    if (shouldResetPage) {
      // 只有在关键参数变化时才重置页码
      resetPage(pageKey);
      fetchPosts(1);
    } else {
      // 如果没有关键变化，使用当前页码获取数据
      fetchPosts(currentPage);
    }
    
    // 更新ref
    prevPropsRef.current = currentProps;
  }, [searchKeyword, pageSize, categoryId, showFavourites, userId, fetchPosts, currentPage, pageKey, resetPage]);

  /**
   * 处理分页变化
   * 
   * @param page - 新的页码
   */
  const handlePageChange = useCallback((page: number) => {
    // 更新store中的页码
    setPage(pageKey, page);
    
    // 立即获取数据，然后在数据更新后滚动
    fetchPosts(page).then(() => {
      // 使用 requestAnimationFrame 确保 DOM 更新完成后再滚动
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // 使用多种方法确保滚动成功
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
          });
          
          // 备用方案：如果smooth滚动有问题，800ms后强制滚动到顶部
          setTimeout(() => {
            if (window.scrollY > 10) {
              window.scrollTo(0, 0);
            }
          }, 800);
        });
      });
    });
  }, [fetchPosts, pageKey, setPage]);

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
   * 获取用户头像
   * 
   * @param userId - 用户ID
   * @returns 用户头像URL或默认头像
   */
  const getUserAvatar = (userId: string): string => {
    const user = userCache.get(userId);
    return user?.avatarUrl || '/images/avatars/default-avatar.png';
  };

  /**
   * 格式化发布时间
   * 
   * @param postId - 帖子ID，用于生成模拟时间
   * @returns 格式化后的时间显示
   */
  const formatPostTime = (postId: string): string => {
    // 由于Post接口中没有createdAt字段，这里使用postId生成模拟时间
    const hash = postId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const randomHours = Math.abs(hash) % 72; // 0-72小时前
    const now = new Date();
    const mockDate = new Date(now.getTime() - randomHours * 60 * 60 * 1000);
    
    const diffInMinutes = Math.floor((now.getTime() - mockDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return '刚刚';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}分钟前`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}小时前`;
    } else if (diffInMinutes < 10080) {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days}天前`;
    } else {
      return mockDate.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  // 加载状态
  if (isLoading && posts.length === 0) {
    return (
      <div className="space-y-4">
        {/* 简化的加载状态 */}
        {[...Array(5)].map((_, index) => (
          <div key={index} className="bg-white dark:bg-dark-secondary rounded-lg shadow p-6">
            <div className="animate-pulse">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-neutral-200 dark:bg-zinc-700 rounded-full"></div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="h-4 bg-neutral-200 dark:bg-zinc-700 rounded w-20"></div>
                    <div className="h-4 bg-neutral-200 dark:bg-zinc-700 rounded w-16"></div>
                  </div>
                  <div className="h-6 bg-neutral-200 dark:bg-zinc-700 rounded w-3/4"></div>
                  <div className="h-4 bg-neutral-200 dark:bg-zinc-700 rounded w-full"></div>
                  <div className="h-4 bg-neutral-200 dark:bg-zinc-700 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
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
    if (showFavourites) {
      return (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto mb-4 text-neutral-400 dark:text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <h3 className="text-lg font-medium text-neutral-800 dark:text-white mb-2">
            <LanguageText 
              texts={{
                'zh-CN': '暂无收藏内容',
                'zh-TW': '暫無收藏內容',
                'en': 'No favorites yet'
              }}
            />
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400">
            <LanguageText 
              texts={{
                'zh-CN': '您还没有收藏过任何内容',
                'zh-TW': '您還沒有收藏過任何內容',
                'en': 'You haven\'t favorited any content yet'
              }}
            />
          </p>
        </div>
      );
    }
    
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
      {posts.map((post) => {
        return (
          <article 
            key={post.postId} 
            className="bg-white dark:bg-dark-secondary rounded-lg shadow hover:shadow-md transition-all duration-200 border border-neutral-100 dark:border-zinc-700 hover:border-neutral-200 dark:hover:border-zinc-600"
          >
            <div className="p-4">
              {/* 用户头像和信息 - 放在最上方 */}
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src={getUserAvatar(post.userId)}
                  alt={getUserDisplayName(post.userId)}
                  className="w-10 h-10 rounded-full object-cover border-2 border-neutral-200 dark:border-zinc-600"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-neutral-700 dark:text-neutral-300 text-sm">
                    {getUserDisplayName(post.userId)}
                  </div>
                  <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400">
                    <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatPostTime(post.postId)}
                  </div>
                </div>
              </div>
              
              {/* 帖子标题和分类 */}
              <div className="mb-3">
                <Link 
                  href={`/post/${post.postId}`} 
                  className="block group"
                >
                  <div className="flex items-start flex-wrap gap-2">
                    <h2 className="text-lg font-semibold text-neutral-800 dark:text-white group-hover:text-primary dark:group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                      {post.title}
                    </h2>
                    <span className="flex-shrink-0 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium ml-2">
                      {post.category.categoryName}
                    </span>
                  </div>
                </Link>
              </div>
              
              {/* 帖子内容预览 */}
              <div className="text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2 leading-relaxed text-sm">
                {post.content.length > 120 
                  ? `${post.content.substring(0, 120)}...` 
                  : post.content
                }
              </div>
              
              {/* 标签显示区域 - 只显示前3个，改为灰色 */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag.tagId}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-neutral-100 dark:bg-zinc-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-zinc-600 transition-colors cursor-pointer"
                    >
                      #{tag.tagName}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-neutral-100 dark:bg-zinc-700 text-neutral-600 dark:text-neutral-300">
                      +{post.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
              
              {/* 帖子统计和操作区域 */}
              <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-zinc-700">
                <div className="flex items-center space-x-4 text-sm text-neutral-500 dark:text-neutral-400">
                  {/* 评论数 */}
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>0</span>
                  </div>
                  
                  {/* 浏览数 */}
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>{Math.floor(Math.random() * 500) + 50}</span>
                  </div>
                </div>
                
                {/* 操作按钮 */}
                <div className="flex items-center space-x-2">
                  {/* 点赞按钮 */}
                  <button 
                    onClick={() => handleToggleLike(post.postId)}
                    disabled={togglingLikeIds.has(post.postId)}
                    className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors ${
                      likeCache.get(post.postId) 
                        ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
                        : 'text-neutral-500 dark:text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                    } ${togglingLikeIds.has(post.postId) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {togglingLikeIds.has(post.postId) ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    ) : (
                      <svg 
                        className="w-4 h-4" 
                        fill={likeCache.get(post.postId) ? "currentColor" : "none"} 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    )}
                    <span className="text-xs">
                      <LanguageText 
                        texts={{
                          'zh-CN': likeCache.get(post.postId) ? '已点赞' : '点赞',
                          'zh-TW': likeCache.get(post.postId) ? '已點讚' : '點讚',
                          'en': likeCache.get(post.postId) ? 'Liked' : 'Like'
                        }}
                      />
                    </span>
                  </button>
                  
                  {/* 分享按钮 */}
                  <button 
                    onClick={() => handleShare(post.postId, post.title)}
                    className="flex items-center space-x-1 px-2 py-1 text-neutral-500 dark:text-neutral-400 hover:text-primary dark:hover:text-primary hover:bg-neutral-50 dark:hover:bg-zinc-700 rounded transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span className="text-xs">
                      <LanguageText 
                        texts={{
                          'zh-CN': '分享',
                          'zh-TW': '分享',
                          'en': 'Share'
                        }}
                      />
                    </span>
                  </button>
                  
                  {/* 收藏按钮 */}
                  {showFavourites ? (
                    <span className="flex items-center space-x-1 px-2 py-1 text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      <span className="text-xs">
                        <LanguageText 
                          texts={{
                            'zh-CN': '已收藏',
                            'zh-TW': '已收藏',
                            'en': 'Favorited'
                          }}
                        />
                      </span>
                    </span>
                  ) : (
                    <button 
                      onClick={() => handleToggleFavourite(post.postId)}
                      disabled={togglingFavouriteIds.has(post.postId)}
                      className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors ${
                        favouriteCache.get(post.postId) 
                          ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' 
                          : 'text-neutral-500 dark:text-neutral-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                      } ${togglingFavouriteIds.has(post.postId) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {togglingFavouriteIds.has(post.postId) ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      ) : (
                        <svg 
                          className="w-4 h-4" 
                          fill={favouriteCache.get(post.postId) ? "currentColor" : "none"} 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      )}
                      <span className="text-xs">
                        <LanguageText 
                          texts={{
                            'zh-CN': favouriteCache.get(post.postId) ? '已收藏' : '收藏',
                            'zh-TW': favouriteCache.get(post.postId) ? '已收藏' : '收藏',
                            'en': favouriteCache.get(post.postId) ? 'Favorited' : 'Save'
                          }}
                        />
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </article>
        );
      })}
      
      {/* 分页组件 */}
      {pageInfo && pageInfo.total_count > 0 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={pageInfo.page_count}
            total={pageInfo.total_count}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            showWhenSinglePage={true}
          />
        </div>
      )}
    </div>
  );
}
 