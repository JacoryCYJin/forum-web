import Link from "next/link";
import LanguageText from "@/components/common/LanguageText/LanguageText";

interface Post {
  id: number;
  title: string;
  author: string;
  upvotes: number;
  commentCount: number;
  timeAgo: string;
  category: string;
}

export default function Home() {
  // 模拟数据
  const posts: Post[] = [
    {
      id: 1,
      title: "Next.js 15 正式发布，性能提升明显",
      author: "技术爱好者",
      upvotes: 458,
      commentCount: 56,
      timeAgo: "3小时前",
      category: "技术"
    },
    {
      id: 2,
      title: "使用Element Plus和Tailwind CSS打造现代化UI界面",
      author: "前端开发者",
      upvotes: 327,
      commentCount: 42,
      timeAgo: "5小时前",
      category: "设计"
    },
    {
      id: 3,
      title: "React服务器组件vs客户端组件，何时使用？",
      author: "React专家",
      upvotes: 289,
      commentCount: 38,
      timeAgo: "12小时前",
      category: "讨论"
    },
    {
      id: 4,
      title: "每个开发者都应该了解的性能优化技巧",
      author: "性能优化师",
      upvotes: 215,
      commentCount: 24,
      timeAgo: "1天前",
      category: "教程"
    },
    {
      id: 5,
      title: "从零开始构建Next.js应用 - 完整指南",
      author: "全栈工程师",
      upvotes: 189,
      commentCount: 19,
      timeAgo: "2天前",
      category: "教程"
    },
  ];

  return (
    <div className="space-y-6">
      {/* 语言切换测试区域 */}
      <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-neutral-800 dark:text-white mb-4">
          <LanguageText 
            texts={{
              'zh-CN': '🌐 语言切换测试',
              'zh-TW': '🌐 語言切換測試',
              'en': '🌐 Language Switch Test'
            }}
          />
        </h2>
        <div className="space-y-2 text-neutral-600 dark:text-neutral-400">
          <p>
            <LanguageText 
              texts={{
                'zh-CN': '欢迎使用我们的论坛！请在右上角切换语言来测试多语言功能。',
                'zh-TW': '歡迎使用我們的論壇！請在右上角切換語言來測試多語言功能。',
                'en': 'Welcome to our forum! Please switch languages in the top right corner to test the multilingual feature.'
              }}
            />
          </p>
          <p>
            <LanguageText 
              texts={{
                'zh-CN': '当前支持：简体中文 🇨🇳、繁体中文 🇭🇰、英文 🇺🇸',
                'zh-TW': '當前支持：簡體中文 🇨🇳、繁體中文 🇭🇰、英文 🇺🇸',
                'en': 'Currently supported: Simplified Chinese 🇨🇳, Traditional Chinese 🇭🇰, English 🇺🇸'
              }}
            />
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-white">
          <LanguageText 
            texts={{
              'zh-CN': '热门帖子',
              'zh-TW': '熱門帖子',
              'en': 'Popular Posts'
            }}
          />
        </h1>
        <div className="flex items-center space-x-2">
          <button className="bg-white dark:bg-dark-secondary text-neutral-500 dark:text-neutral-300 px-4 py-2 rounded-full text-sm font-medium hover:bg-neutral-100 dark:hover:bg-zinc-700 focus:outline-none">
            <LanguageText 
              texts={{
                'zh-CN': '最新',
                'zh-TW': '最新',
                'en': 'Latest'
              }}
            />
          </button>
          <button className="bg-white dark:bg-dark-secondary text-neutral-500 dark:text-neutral-300 px-4 py-2 rounded-full text-sm font-medium hover:bg-neutral-100 dark:hover:bg-zinc-700 focus:outline-none">
            <LanguageText 
              texts={{
                'zh-CN': '热门',
                'zh-TW': '熱門',
                'en': 'Popular'
              }}
            />
          </button>
          <button className="bg-white dark:bg-dark-secondary text-neutral-500 dark:text-neutral-300 px-4 py-2 rounded-full text-sm font-medium hover:bg-neutral-100 dark:hover:bg-zinc-700 focus:outline-none">
            <LanguageText 
              texts={{
                'zh-CN': '上升中',
                'zh-TW': '上升中',
                'en': 'Rising'
              }}
            />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <article key={post.id} className="bg-white dark:bg-dark-secondary rounded-md shadow hover:shadow-md transition-shadow p-4">
            <div className="flex">
              {/* 投票区 */}
              <div className="flex flex-col items-center mr-4 w-10">
                <button className="text-neutral-400 hover:text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <span className="font-medium text-sm my-1">{post.upvotes}</span>
                <button className="text-neutral-400 hover:text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              
              {/* 内容区 */}
              <div className="flex-1">
                <div className="flex items-center text-xs text-neutral-400 mb-1">
                  <span className="px-2 py-1 bg-neutral-100 dark:bg-zinc-700 rounded-full text-xs text-neutral-600 dark:text-neutral-300 mr-2">
                    {post.category}
                  </span>
                  <span>由 {post.author} 发布 · {post.timeAgo}</span>
                </div>
                
                <Link href={`/post/${post.id}`} className="text-lg font-medium text-neutral-800 dark:text-white hover:text-primary dark:hover:text-primary mb-2 block">
                  {post.title}
                </Link>
                
                <div className="flex items-center text-sm text-neutral-400">
                  <button className="flex items-center hover:bg-neutral-100 dark:hover:bg-zinc-700 px-2 py-1 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {post.commentCount} <LanguageText 
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
            </div>
          </article>
        ))}
      </div>
      
      <div className="flex justify-center mt-8">
        <button className="bg-white dark:bg-dark-secondary text-primary border border-primary px-6 py-2 rounded-full font-medium hover:bg-neutral-50 dark:hover:bg-zinc-700 focus:outline-none">
          <LanguageText 
            texts={{
              'zh-CN': '加载更多',
              'zh-TW': '載入更多',
              'en': 'Load More'
            }}
          />
        </button>
      </div>
    </div>
  );
}