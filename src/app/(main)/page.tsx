import LanguageText from "@/components/common/LanguageText/LanguageText";
import PostList from "@/components/features/post/PostList";

export default function Home() {
  return (
    <div className="space-y-8">
      {/* 欢迎横幅 */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 dark:to-transparent rounded-2xl">
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="relative px-8 py-12">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 dark:text-white mb-4">
              <LanguageText 
                texts={{
                  'zh-CN': '欢迎来到云社 · OpenShare',
                  'zh-TW': '歡迎來到雲社 · OpenShare',
                  'en': 'Welcome to OpenShare'
                }}
              />
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed">
              <LanguageText 
                texts={{
                  'zh-CN': '连接世界，分享智慧。在这里发现有趣的内容，与志同道合的朋友交流，让知识和经验得到更好的传播。',
                  'zh-TW': '連接世界，分享智慧。在這裡發現有趣的內容，與志同道合的朋友交流，讓知識和經驗得到更好的傳播。',
                  'en': 'Connect the world, share wisdom. Discover interesting content, communicate with like-minded friends, and let knowledge and experience spread better.'
                }}
              />
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-full font-medium transition-colors flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>
                  <LanguageText 
                    texts={{
                      'zh-CN': '发布内容',
                      'zh-TW': '發布內容',
                      'en': 'Create Post'
                    }}
                  />
                </span>
              </button>
              <button className="bg-white dark:bg-dark-secondary text-neutral-700 dark:text-neutral-300 px-6 py-3 rounded-full font-medium border border-neutral-200 dark:border-zinc-700 hover:bg-neutral-50 dark:hover:bg-zinc-700 transition-colors flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>
                  <LanguageText 
                    texts={{
                      'zh-CN': '探索内容',
                      'zh-TW': '探索內容',
                      'en': 'Explore'
                    }}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 统计数据 */}
      {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-dark-secondary rounded-xl p-6 text-center border border-neutral-100 dark:border-zinc-700">
          <div className="text-3xl font-bold text-primary mb-2">10K+</div>
          <div className="text-neutral-600 dark:text-neutral-400 text-sm">
            <LanguageText 
              texts={{
                'zh-CN': '活跃用户',
                'zh-TW': '活躍用戶',
                'en': 'Active Users'
              }}
            />
          </div>
        </div>
        <div className="bg-white dark:bg-dark-secondary rounded-xl p-6 text-center border border-neutral-100 dark:border-zinc-700">
          <div className="text-3xl font-bold text-green-500 mb-2">50K+</div>
          <div className="text-neutral-600 dark:text-neutral-400 text-sm">
            <LanguageText 
              texts={{
                'zh-CN': '精彩内容',
                'zh-TW': '精彩內容',
                'en': 'Great Posts'
              }}
            />
          </div>
        </div>
        <div className="bg-white dark:bg-dark-secondary rounded-xl p-6 text-center border border-neutral-100 dark:border-zinc-700">
          <div className="text-3xl font-bold text-blue-500 mb-2">100K+</div>
          <div className="text-neutral-600 dark:text-neutral-400 text-sm">
            <LanguageText 
              texts={{
                'zh-CN': '互动交流',
                'zh-TW': '互動交流',
                'en': 'Interactions'
              }}
            />
          </div>
        </div>
        <div className="bg-white dark:bg-dark-secondary rounded-xl p-6 text-center border border-neutral-100 dark:border-zinc-700">
          <div className="text-3xl font-bold text-purple-500 mb-2">24/7</div>
          <div className="text-neutral-600 dark:text-neutral-400 text-sm">
            <LanguageText 
              texts={{
                'zh-CN': '在线服务',
                'zh-TW': '在線服務',
                'en': 'Online Service'
              }}
            />
          </div>
        </div>
      </div> */}

      {/* 帖子列表标题和筛选 */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-neutral-800 dark:text-white flex items-center">
          <svg className="w-6 h-6 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <LanguageText 
            texts={{
              'zh-CN': '精选内容',
              'zh-TW': '精選內容',
              'en': 'Featured Posts'
            }}
          />
        </h2>
        <div className="flex items-center space-x-2">
          <button className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-primary-hover transition-colors">
            <LanguageText 
              texts={{
                'zh-CN': '最新',
                'zh-TW': '最新',
                'en': 'Latest'
              }}
            />
          </button>
          <button className="bg-white dark:bg-dark-secondary text-neutral-500 dark:text-neutral-300 px-4 py-2 rounded-full text-sm font-medium hover:bg-neutral-100 dark:hover:bg-zinc-700 border border-neutral-200 dark:border-zinc-700 transition-colors">
            <LanguageText 
              texts={{
                'zh-CN': '热门',
                'zh-TW': '熱門',
                'en': 'Popular'
              }}
            />
          </button>
          <button className="bg-white dark:bg-dark-secondary text-neutral-500 dark:text-neutral-300 px-4 py-2 rounded-full text-sm font-medium hover:bg-neutral-100 dark:hover:bg-zinc-700 border border-neutral-200 dark:border-zinc-700 transition-colors">
            <LanguageText 
              texts={{
                'zh-CN': '推荐',
                'zh-TW': '推薦',
                'en': 'Recommended'
              }}
            />
          </button>
        </div>
      </div>

      {/* 使用真实的帖子列表组件 */}
      <PostList pageSize={10} />
    </div>
  );
}