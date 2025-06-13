import LanguageText from "@/components/common/LanguageText/LanguageText";
import PostList from "@/components/features/post/PostList";

export default function Home() {
  return (
    <div className="space-y-6">
      {/* 语言切换测试区域 */}
      {/* <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-6 mb-6">
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
      </div> */}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-white">
          <LanguageText 
            texts={{
              'zh-CN': '猜你喜欢',
              'zh-TW': '猜你喜歡',
              'en': 'Recommended Posts'
            }}
          />
        </h1>
        {/* <div className="flex items-center space-x-2">
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
        </div> */}
      </div>

      {/* 使用真实的帖子列表组件 */}
      <PostList pageSize={10} />
    </div>
  );
}