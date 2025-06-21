import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import AvatarLink from '@/components/common/AvatarLink/AvatarLink';
import BackButton from '@/components/common/BackButton/BackButton';
import PostSidebar from '@/components/features/post/PostSidebar';
import PostReportButton from '@/components/features/post/PostReportButton';
import { getPostByIdApi } from '@/lib/api/postsApi';
import { getUserInfoApi } from '@/lib/api/userApi';
import type { PostDetailQueryParams } from '@/types/postTypes';
import type { User } from '@/types/userTypes';
import MarkdownRenderer from '@/components/common/MarkdownRenderer/MarkdownRenderer';
import { formatPostTime } from '@/lib/utils/dateUtils';

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
      <div className="relative">
        {/* 返回按钮 */}
        <div className="max-w-7xl mx-auto mb-6">
          <BackButton />
        </div>

        <div className="max-w-[1400px] mx-auto flex gap-8">
          {/* 主要内容区域 */}
          <div className="flex-1 max-w-5xl">
            <article className="bg-white dark:bg-dark-secondary rounded-xl shadow-lg border border-neutral-100 dark:border-zinc-700">
              <div className="flex flex-col lg:flex-row">
                {/* 左侧图片区域 - 只显示图片文件 */}
                {post.fileUrls && (() => {
                  const imageUrls = post.fileUrls.split(',')
                    .map(url => url.trim())
                    .filter(url => /\.(jpg|jpeg|png|gif|webp)$/i.test(url));
                  
                  if (imageUrls.length === 0) return null;
                  
                  return (
                    <div className="lg:w-1/2 p-6 border-b lg:border-b-0 lg:border-r border-neutral-100 dark:border-zinc-700">
                      <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-4">
                        图片内容
                      </h3>
                      <div className="space-y-4">
                        {imageUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`图片 ${index + 1}`}
                              className="w-full h-auto rounded-lg object-cover cursor-pointer hover:opacity-95 transition-opacity shadow-sm"
                              onClick={() => window.open(url, '_blank')}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg flex items-center justify-center">
                              <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-80 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* 右侧内容区域 */}
                <div className={`${post.fileUrls && post.fileUrls.split(',').some(url => /\.(jpg|jpeg|png|gif|webp)$/i.test(url.trim())) ? 'lg:w-1/2' : 'w-full'} p-6 relative`}>
                  {/* 举报按钮 - 右上角 */}
                  <div className="absolute top-4 right-4">
                    <PostReportButton postId={id} postTitle={post.title} />
                  </div>

                  {/* 作者信息 */}
                  <div className="flex items-center space-x-4 mb-6 pr-12">
                    {userInfo && (
                      <AvatarLink
                        userId={post.userId}
                        avatarUrl={userInfo.avatarUrl}
                        username={userDisplayName}
                        sizeClass="w-14 h-14"
                      />
                    )}
                    <div className="flex-1">
                      <Link 
                        href={`/user/${post.userId}`}
                        className="font-semibold text-lg text-neutral-800 dark:text-white hover:text-primary transition-colors"
                      >
                        {userDisplayName}
                      </Link>
                      <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{formatPostTime(post.createdTime)}</span>
                      </div>
                    </div>
                  </div>

                  {/* 帖子标题和分类 */}
                  <div className="mb-6">
                    <h1 className="text-2xl font-bold text-neutral-800 dark:text-white leading-tight mb-3">
                      {post.title}
                    </h1>
                    
                    {/* 分类和标签区域 */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {/* 分类标签 - 红色主题 */}
                      <span className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-red-500/10 to-red-600/5 text-red-600 dark:text-red-400 rounded-full text-sm font-medium border border-red-200 dark:border-red-800">
                        {post.category.categoryName}
                      </span>
                      
                      {/* 标签列表 */}
                      {post.tags && post.tags.length > 0 && post.tags.map((tag) => (
                        <span
                          key={tag.tagId}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-neutral-100 dark:bg-zinc-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-zinc-600 transition-colors cursor-pointer"
                        >
                          #{tag.tagName}
                        </span>
                      ))}
                    </div>
                    
                    {/* 统计信息 - 移除评论数显示，避免重复 */}
                    <div className="flex items-center space-x-6 text-sm text-neutral-500 dark:text-neutral-400">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>{Math.floor(Math.random() * 1000) + 100} 浏览</span>
                      </div>
                    </div>
                  </div>

                  {/* 视频内容 - 如果是视频帖子，优先展示视频 */}
                  {post.fileUrls && /\.(mp4|webm|ogg|avi|mov|wmv|flv|mkv)(\?|$)/i.test(post.fileUrls) && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        视频内容
                      </h3>
                      <div className="relative bg-black rounded-xl overflow-hidden shadow-lg mb-6">
                        <video
                          src={post.fileUrls.split(',').find(url => /\.(mp4|webm|ogg|avi|mov|wmv|flv|mkv)(\?|$)/i.test(url.trim()))?.trim()}
                          controls
                          preload="metadata"
                          className="w-full max-h-96 object-contain bg-black"
                          poster="" // 可以添加视频封面
                        >
                          <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 dark:bg-zinc-800">
                            <div className="text-center">
                              <svg className="w-16 h-16 mx-auto mb-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              <p className="text-neutral-500">您的浏览器不支持视频播放</p>
                            </div>
                          </div>
                        </video>
                      </div>
                    </div>
                  )}

                  {/* 帖子内容 - 支持富文本HTML */}
                  <div className="mt-6">
                    <div className="prose prose-neutral dark:prose-invert max-w-none">
                      {/* 如果内容包含HTML标签，直接渲染；否则使用Markdown */}
                      {post.content.includes('<img') || post.content.includes('<div') || post.content.includes('<p') ? (
                        <div 
                          dangerouslySetInnerHTML={{ __html: post.content }}
                          className="rich-content"
                        />
                      ) : (
                        <MarkdownRenderer content={post.content} />
                      )}
                    </div>
                  </div>

                  {/* 位置信息 */}
                  {post.location && (
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                          发布位置: {post.location}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 附件显示区域 - 只显示非图片和非视频文件 */}
                  {post.fileUrls && (() => {
                    const attachmentUrls = post.fileUrls.split(',')
                      .map(url => url.trim())
                      .filter(url => !/\.(jpg|jpeg|png|gif|webp|mp4|webm|ogg|avi|mov|wmv|flv|mkv)$/i.test(url));
                    
                    if (attachmentUrls.length === 0) return null;
                    
                    return (
                      <div className="mt-6">
                        <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                          附件文件
                        </h3>
                        <div className="space-y-2">
                          {attachmentUrls.map((fileUrl, index) => {
                            const fileName = fileUrl.split('/').pop() || `文件${index + 1}`;
                            return (
                              <a
                                key={index}
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-3 p-3 bg-neutral-50 dark:bg-zinc-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-600 transition-colors group"
                              >
                                <svg className="w-5 h-5 text-neutral-400 dark:text-neutral-500 group-hover:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="text-sm text-neutral-700 dark:text-neutral-300 flex-1">{fileName}</span>
                                <svg className="w-4 h-4 text-neutral-400 dark:text-neutral-500 group-hover:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </article>
          </div>

          {/* 右侧互动面板 - 固定定位 */}
          <div className="hidden xl:block w-96 flex-shrink-0">
            <div className="sticky top-20">
              <PostSidebar 
                postId={id}
                postTitle={post.title}
                commentCount={post.comments.total_count}
                initialComments={post.comments}
              />
            </div>
          </div>
        </div>

        {/* 移动设备上的互动面板 - 在内容下方 */}
        <div className="xl:hidden max-w-5xl mx-auto mt-8">
          <PostSidebar 
            postId={id}
            postTitle={post.title}
            commentCount={post.comments.total_count}
            initialComments={post.comments}
          />
        </div>
      </div>
    );
  } catch {
    console.error('获取帖子详情失败');
    notFound();
  }
}