import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getPostByIdApi } from '@/lib/api/postsApi';
import { getUserInfoApi } from '@/lib/api/userApi';
import type { Tag, PostDetailQueryParams } from '@/types/postType';
import type { User } from '@/types/userType';
import MarkdownRenderer from '@/components/common/MarkdownRenderer/MarkdownRenderer';
import PostDetailClient from '@/components/features/post/PostDetailClient';
import FavouriteButton from '@/components/features/post/FavouriteButton';


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
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
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
        <article className="bg-white dark:bg-dark-secondary rounded-lg shadow p-8">
          <div className="flex">
            {/* 投票区 - 暂时使用静态数据 */}
            {/* <div className="flex flex-col items-center mr-4">
              <button className="text-neutral-400 hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <span className="font-medium text-sm my-2">0</span>
              <button className="text-neutral-400 hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div> */}

            {/* 内容区 */}
            <div className="flex-1">
              <div className="flex items-center text-sm text-neutral-400 mb-2">
                <span className="px-2 py-1 bg-neutral-100 dark:bg-zinc-700 rounded-full text-xs text-neutral-600 dark:text-neutral-300 mr-2">
                  {post.category.categoryName}
                </span>
                <div className="flex items-center space-x-2">
                  {userInfo?.avatarUrl && (
                    <img
                      src={userInfo.avatarUrl}
                      alt={userDisplayName}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  )}
                  <span>由 {userDisplayName} 发布</span>
                </div>
              </div>

              <h1 className="text-2xl font-bold text-neutral-800 dark:text-white mb-4">{post.title}</h1>

              {/* 标签显示区域 */}
              {renderTags(post.tags)}

              {/* 使用 Markdown 渲染器渲染内容 */}
              <div className="mb-6">
                <MarkdownRenderer content={post.content} />
              </div>

              {/* 附件显示 */}
              {post.fileUrls && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-2">附件</h3>
                  <div className="space-y-2">
                    {post.fileUrls.split(',').map((url, index) => (
                      <a
                        key={index}
                        href={url.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-hover underline block"
                      >
                        附件 {index + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* 位置信息 */}
              {post.location && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-2">发布位置</h3>
                  <p className="text-neutral-600 dark:text-neutral-400">{post.location}</p>
                </div>
              )}

              <div className="flex items-center text-sm text-neutral-400 pt-4 border-t border-neutral-100 dark:border-zinc-700">
                <button className="flex items-center hover:bg-neutral-100 dark:hover:bg-zinc-700 px-3 py-2 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {post.comments.total_count} 评论
                </button>

                <button className="flex items-center hover:bg-neutral-100 dark:hover:bg-zinc-700 px-3 py-2 rounded ml-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  分享
                </button>

                <FavouriteButton 
                  postId={id} 
                  variant="default"
                  className="ml-3"
                />
              </div>
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