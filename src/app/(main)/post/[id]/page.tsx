import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import AvatarLink from '@/components/common/AvatarLink/AvatarLink';
import { getPostByIdApi } from '@/lib/api/postsApi';
import { getUserInfoApi } from '@/lib/api/userApi';
import type { Tag, PostDetailQueryParams } from '@/types/postTypes';
import type { User } from '@/types/userTypes';
import MarkdownRenderer from '@/components/common/MarkdownRenderer/MarkdownRenderer';
import PostDetailClient from '@/components/features/post/PostDetailClient';
import PostActions from '@/components/features/post/PostActions';


/**
 * 帖子详情页面参数类型
 */
interface PostPageParams {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * 获取用户显示名称
 * 
 * @param userId - 用户ID
 * @returns 用户昵称或默认显示名称
 */
async function getUserDisplayName(userId: string): Promise<string> {
  try {
    const userInfo = await getUserInfoApi({ userId });
    return userInfo.username || `用户${userId}`;
  } catch (error) {
    console.error(`获取用户信息失败 (userId: ${userId}):`, error);
    return `用户${userId}`;
  }
}

/**
 * 获取用户信息
 * 
 * @param userId - 用户ID
 * @returns 用户信息或null
 */
async function getUserInfo(userId: string): Promise<User | null> {
  try {
    const userInfo = await getUserInfoApi({ userId });
    return userInfo;
  } catch (error) {
    console.error(`获取用户信息失败 (userId: ${userId}):`, error);
    return null;
  }
}

/**
 * 生成静态元数据
 * 
 * @param {PostPageParams} params - 页面参数
 * @returns {Promise<Metadata>} 页面元数据
 */
export async function generateMetadata({ params }: PostPageParams): Promise<Metadata> {
  try {
    const { id } = await params;
    const post = await getPostByIdApi(id);

    if (!post) {
      return {
        title: '帖子未找到',
        description: '这个帖子不存在或已被删除。'
      };
    }

    return {
      title: `${post.title} - 论坛`,
      description: post.content.slice(0, 160) // 使用帖子内容的前160个字符作为描述
    };
  } catch {
    return {
      title: '帖子未找到',
      description: '无法加载帖子信息。'
    };
  }
}

/**
 * 渲染标签列表
 * 
 * @param tags - 标签数组
 * @returns JSX元素
 */
function renderTags(tags: Tag[]) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      {/* <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-2">标签</h3> */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag.tagId}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-neutral-100 dark:bg-zinc-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-zinc-600 transition-colors cursor-pointer"
          >
            #{tag.tagName}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * 帖子详情页面组件
 * 
 * 显示单个帖子的详细信息，支持Markdown内容渲染和评论分页
 * 
 * @param {PostPageParams} params - 页面参数
 * @returns {Promise<JSX.Element>} 页面组件
 */
export default async function PostPage({ params, searchParams }: PostPageParams) {
  try {
    const { id } = await params;
    const searchParamsResolved = await searchParams;
    
    // 解析评论分页参数
    const commentPageNum = parseInt(searchParamsResolved.comment_page_num as string) || 1;
    const commentPageSize = parseInt(searchParamsResolved.comment_page_size as string) || 10;
    
    const queryParams: PostDetailQueryParams = {
      comment_page_num: commentPageNum,
      comment_page_size: commentPageSize
    };
    
    const post = await getPostByIdApi(id, queryParams);

    if (!post) {
      notFound();
    }

    // 获取用户显示名称和用户信息
    const [userDisplayName, userInfo] = await Promise.all([
      getUserDisplayName(post.userId),
      getUserInfo(post.userId)
    ]);

    return (
      <div className="space-y-6">
        {/* 返回链接 */}
        <div className="mb-6">
          <Link href="/" className="flex items-center text-secondary hover:text-secondary-hover">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            返回首页
          </Link>
        </div>

        {/* 帖子卡片 */}
        <article className="bg-white dark:bg-dark-secondary rounded-lg shadow-lg border border-neutral-100 dark:border-zinc-700">
          {/* 帖子头部 */}
          <div className="p-6">
            {/* 作者信息 */}
            <div className="flex items-center space-x-3 mb-4">
              {userInfo && (
                <AvatarLink
                  userId={post.userId}
                  avatarUrl={userInfo.avatarUrl}
                  username={userDisplayName}
                  sizeClass="w-12 h-12"
                />
              )}
              <div className="flex-1">
                <Link 
                  href={`/user/${post.userId}`}
                  className="font-semibold text-neutral-800 dark:text-white hover:text-primary transition-colors"
                >
                  {userDisplayName}
                </Link>
                <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>发布时间</span>
                </div>
              </div>
            </div>

            {/* 帖子标题和分类 */}
            <div className="flex items-start flex-wrap gap-2 mb-4">
              <h1 className="text-2xl font-bold text-neutral-800 dark:text-white leading-tight mr-2">
                {post.title}
              </h1>
              <span className="flex-shrink-0 inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium ml-2">
                {post.category.categoryName}
              </span>
            </div>

            {/* 标签显示区域 */}
            {renderTags(post.tags)}
          </div>

          {/* 帖子内容 */}
          <div className="px-6 pb-4">
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <MarkdownRenderer content={post.content} />
            </div>
          </div>

          {/* 附件显示 */}
          {post.fileUrls && (
            <div className="px-6 pb-4">
              <div className="bg-neutral-50 dark:bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  附件
                </h3>
                <div className="space-y-2">
                  {post.fileUrls.split(',').map((url, index) => (
                    <a
                      key={index}
                      href={url.trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-primary hover:text-primary-hover underline p-2 hover:bg-white dark:hover:bg-zinc-700 rounded transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>附件 {index + 1}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 位置信息 */}
          {post.location && (
            <div className="px-6 pb-4">
              <div className="bg-neutral-50 dark:bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  发布位置
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">{post.location}</p>
              </div>
            </div>
          )}

          {/* 帖子操作栏 */}
          <div className="px-6 py-3 border-t border-neutral-100 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800/50 rounded-b-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 text-sm text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="font-medium">{post.comments.total_count} 评论</span>
                </div>

                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{Math.floor(Math.random() * 1000) + 100} 浏览</span>
                </div>
              </div>

              {/* 使用新的PostActions组件 */}
              <PostActions 
                postId={id} 
                postTitle={post.title}
              />
            </div>
          </div>
        </article>

        {/* 评论区 - 使用新的评论组件 */}
        <PostDetailClient 
          postId={id}
          initialComments={post.comments}
        />
      </div>
    );
  } catch {
    console.error('获取帖子详情失败');
    notFound();
  }
}