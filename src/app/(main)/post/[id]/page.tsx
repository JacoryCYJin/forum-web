import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import AvatarLink from '@/components/common/AvatarLink/AvatarLink';
import BackButton from '@/components/common/BackButton/BackButton';
import LocationDisplay from '@/components/common/LocationDisplay/LocationDisplay';
import PostSidebar from '@/components/features/post/PostSidebar';
import PostReportButton from '@/components/features/post/PostReportButton';
import { getPostByIdApi } from '@/lib/api/postsApi';
import { getUserInfoApi } from '@/lib/api/userApi';
import type { PostDetailQueryParams } from '@/types/postTypes';
import type { User } from '@/types/userTypes';
import MarkdownRenderer from '@/components/common/MarkdownRenderer/MarkdownRenderer';


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
                  // 先清理fileUrls字符串，移除可能的JSON格式污染
                  let cleanFileUrls = post.fileUrls;
                  
                  // 如果包含JSON格式的响应，尝试提取实际的URL
                  if (cleanFileUrls.includes('"code":0') || cleanFileUrls.includes('"success":true}')) {
                    // 尝试解析JSON格式的响应，提取data字段
                    try {
                      const jsonMatches = cleanFileUrls.match(/\{"code":0.*?"data":"([^"]+)".*?\}/g);
                      if (jsonMatches && jsonMatches.length > 0) {
                        const extractedUrls = jsonMatches.map(match => {
                          const result = JSON.parse(match);
                          return result.data;
                        }).filter(url => url && typeof url === 'string');
                        cleanFileUrls = extractedUrls.join(',');
                      }
                    } catch (e) {
                      console.error('解析图片URL JSON失败:', e);
                      // 如果解析失败，尝试简单的字符串清理
                      cleanFileUrls = cleanFileUrls.replace(/\{"code":0[^}]*\}/g, '').replace(/,+/g, ',').replace(/^,|,$/g, '');
                    }
                  }
                  
                  const allUrls = cleanFileUrls.split(',').map(url => url.trim()).filter(url => url && !url.includes('"') && !url.includes('{'));
                  const imageUrls = allUrls.filter(url => 
                    /\.(jpg|jpeg|png|gif|webp|bmp|tiff|svg)$/i.test(url) ||
                    url.includes('/image/') || 
                    url.includes('image') ||
                    // 检查URL中是否包含图片相关关键词
                    /\.(JPG|JPEG|PNG|GIF|WEBP|BMP|TIFF|SVG)$/i.test(url)
                  );
                  
                  if (imageUrls.length === 0) return null;
                  
                  return (
                    <div className="lg:w-1/2 p-6 border-b lg:border-b-0 lg:border-r border-neutral-100 dark:border-zinc-700">
                      <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-4">
                        图片内容 ({imageUrls.length})
                      </h3>
                      <div className="space-y-4">
                        {imageUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`图片 ${index + 1}`}
                              className="w-full h-auto rounded-lg object-cover cursor-pointer hover:opacity-95 transition-opacity shadow-sm"
                              onClick={() => window.open(url, '_blank')}
                              onError={(e) => {
                                console.error('图片加载失败:', url);
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
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
                <div className={`${(() => {
                  if (!post.fileUrls) return 'w-full';
                  
                  // 先清理fileUrls
                  let cleanUrls = post.fileUrls;
                  if (cleanUrls.includes('"code":0') || cleanUrls.includes('"success":true}')) {
                    try {
                      const jsonMatches = cleanUrls.match(/\{"code":0.*?"data":"([^"]+)".*?\}/g);
                      if (jsonMatches && jsonMatches.length > 0) {
                        const extractedUrls = jsonMatches.map(match => JSON.parse(match).data);
                        cleanUrls = extractedUrls.join(',');
                      }
                    } catch {
                      cleanUrls = cleanUrls.replace(/\{"code":0[^}]*\}/g, '').replace(/,+/g, ',').replace(/^,|,$/g, '');
                    }
                  }
                  
                  const urls = cleanUrls.split(',').map(url => url.trim()).filter(url => url && !url.includes('"') && !url.includes('{'));
                  const hasImages = urls.some(url => /\.(jpg|jpeg|png|gif|webp|bmp|tiff|svg)$/i.test(url) || url.includes('/image/') || url.includes('image'));
                  return hasImages ? 'lg:w-1/2' : 'w-full';
                })()} p-6 relative`}>
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
                        <span>发布时间</span>
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
                        <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                          发布位置:
                        </span>
                        <LocationDisplay 
                          location={post.location}
                          showIcon={false}
                          className="text-blue-700 dark:text-blue-300 font-medium"
                          showFullAddress={true}
                        />
                      </div>
                    </div>
                  )}

                  {/* 附件显示区域 - 只显示非图片文件 */}
                  {post.fileUrls && (() => {
                    // 先清理fileUrls字符串，移除可能的JSON格式污染
                    let cleanFileUrls = post.fileUrls;
                    
                    // 如果包含JSON格式的响应，尝试提取实际的URL
                    if (cleanFileUrls.includes('"code":0') || cleanFileUrls.includes('"success":true}')) {
                      // 尝试解析JSON格式的响应，提取data字段
                      try {
                        const jsonMatches = cleanFileUrls.match(/\{"code":0.*?"data":"([^"]+)".*?\}/g);
                        if (jsonMatches && jsonMatches.length > 0) {
                          const extractedUrls = jsonMatches.map(match => {
                            const result = JSON.parse(match);
                            return result.data;
                          }).filter(url => url && typeof url === 'string');
                          cleanFileUrls = extractedUrls.join(',');
                        }
                      } catch (e) {
                        console.error('解析文件URL JSON失败:', e);
                        // 如果解析失败，尝试简单的字符串清理
                        cleanFileUrls = cleanFileUrls.replace(/\{"code":0[^}]*\}/g, '').replace(/,+/g, ',').replace(/^,|,$/g, '');
                      }
                    }
                    
                    const allUrls = cleanFileUrls.split(',').map(url => url.trim()).filter(url => url && !url.includes('"') && !url.includes('{'));
                    const attachmentUrls = allUrls.filter(url => 
                      !(/\.(jpg|jpeg|png|gif|webp|bmp|tiff|svg)$/i.test(url) ||
                        url.includes('/image/') || 
                        url.includes('image') ||
                        /\.(JPG|JPEG|PNG|GIF|WEBP|BMP|TIFF|SVG)$/i.test(url))
                    );
                    
                    console.log('🔍 文件URL调试信息:');
                    console.log('  - 原始fileUrls:', post.fileUrls);
                    console.log('  - 清理后fileUrls:', cleanFileUrls);
                    console.log('  - 所有URLs:', allUrls);
                    console.log('  - 附件URLs:', attachmentUrls);
                    
                    if (attachmentUrls.length === 0) return null;
                    
                    return (
                      <div className="mt-6">
                        <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                          附件文件 ({attachmentUrls.length})
                        </h3>
                        <div className="space-y-2">
                          {attachmentUrls.map((fileUrl, index) => {
                            const fileName = fileUrl.split('/').pop() || `文件${index + 1}`;
                            const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
                            
                            // 根据文件类型显示不同图标
                            const getFileIcon = (ext: string) => {
                              if (['pdf'].includes(ext)) {
                                return (
                                  <svg className="w-5 h-5 text-red-500 group-hover:text-red-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2l3 3h5a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2h8zm-1 9V9a1 1 0 00-1-1H6a1 1 0 000 2h4a1 1 0 001-1zm0 4v-2a1 1 0 00-1-1H6a1 1 0 000 2h4a1 1 0 001-1z"/>
                                  </svg>
                                );
                              } else if (['doc', 'docx'].includes(ext)) {
                                return (
                                  <svg className="w-5 h-5 text-blue-500 group-hover:text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                                    <polyline points="14,2 14,8 20,8"/>
                                    <line x1="16" y1="13" x2="8" y2="13"/>
                                    <line x1="16" y1="17" x2="8" y2="17"/>
                                    <polyline points="10,9 9,9 8,9"/>
                                  </svg>
                                );
                              } else if (['xls', 'xlsx'].includes(ext)) {
                                return (
                                  <svg className="w-5 h-5 text-green-500 group-hover:text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                                    <polyline points="14,2 14,8 20,8"/>
                                    <line x1="8" y1="13" x2="16" y2="13"/>
                                    <line x1="8" y1="17" x2="16" y2="17"/>
                                    <line x1="12" y1="13" x2="12" y2="17"/>
                                  </svg>
                                );
                              } else if (['zip', 'rar', '7z'].includes(ext)) {
                                return (
                                  <svg className="w-5 h-5 text-purple-500 group-hover:text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V8z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                                  </svg>
                                );
                              } else {
                                return (
                                  <svg className="w-5 h-5 text-neutral-400 dark:text-neutral-500 group-hover:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                );
                              }
                            };
                            
                            return (
                              <a
                                key={index}
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-3 p-3 bg-neutral-50 dark:bg-zinc-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-600 transition-colors group"
                              >
                                {getFileIcon(fileExtension)}
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300 truncate">
                                    {fileName}
                                  </div>
                                  <div className="text-xs text-neutral-500 dark:text-neutral-400 uppercase">
                                    {fileExtension ? `${fileExtension} 文件` : '文件'}
                                  </div>
                                </div>
                                <svg className="w-4 h-4 text-neutral-400 dark:text-neutral-500 group-hover:text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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