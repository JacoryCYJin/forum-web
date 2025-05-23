import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

interface Post {
  id: number;
  title: string;
  author: string;
  upvotes: number;
  commentCount: number;
  timeAgo: string;
  category: string;
  content: string;
}

interface Comment {
  id: number;
  author: string;
  content: string;
  timeAgo: string;
  upvotes: number;
}

// 生成静态元数据
export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  // 在实际应用中，应该通过API获取帖子信息
  const postId = parseInt(params.id, 10);
  const post = mockPosts.find(p => p.id === postId);

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
}

// 模拟数据
const mockPosts: Post[] = [
  {
    id: 1,
    title: "Next.js 15 正式发布，性能提升明显",
    author: "技术爱好者",
    upvotes: 458,
    commentCount: 3,
    timeAgo: "3小时前",
    category: "技术",
    content: "今天，Vercel宣布正式发布Next.js 15版本，带来了许多激动人心的新特性和显著的性能提升。最值得注意的是新的服务器组件架构，使得页面渲染速度提升了约35%。另外，基于Turbopack的本地开发服务器现在成为默认选项，冷启动时间缩短了约40%，HMR速度提升了约30%。\n\n此外，新版本还引入了：\n\n- 改进的路由和数据加载系统\n- 更好的TypeScript集成\n- 优化的图像组件\n- 改进的CSS支持\n\n升级方式相当简单，只需要更新package.json中的依赖项，然后运行npm install或yarn即可。"
  },
  {
    id: 2,
    title: "使用Element Plus和Tailwind CSS打造现代化UI界面",
    author: "前端开发者",
    upvotes: 327,
    commentCount: 5,
    timeAgo: "5小时前",
    category: "设计",
    content: "在现代前端开发中，选择合适的UI库和CSS框架可以极大地提高开发效率和产品质量。本文将探讨如何结合Element Plus组件库和Tailwind CSS工具类框架，打造既美观又高效的用户界面。\n\nElement Plus提供了丰富的预设组件，而Tailwind CSS则提供了高度可定制的原子化CSS类。将两者结合使用，我们可以：\n\n1. 使用Element Plus的组件系统快速构建功能性UI\n2. 使用Tailwind CSS进行细粒度的样式调整\n3. 保持一致的设计语言同时拥有足够的灵活性\n\n本文将通过具体示例展示如何配置项目，解决潜在的样式冲突，以及最佳实践技巧。"
  },
  {
    id: 3,
    title: "React服务器组件vs客户端组件，何时使用？",
    author: "React专家",
    upvotes: 289,
    commentCount: 4,
    timeAgo: "12小时前",
    category: "讨论",
    content: "React服务器组件（RSC）是React生态系统中的一项重要创新，它改变了我们构建React应用的方式。但是，很多开发者仍然困惑于何时应该使用服务器组件，何时应该使用客户端组件。\n\n**服务器组件的优势：**\n- 减少客户端JavaScript包大小\n- 允许直接访问服务器资源（数据库、文件系统等）\n- 更好的初始加载性能\n- 搜索引擎优化更好\n\n**客户端组件的优势：**\n- 可以使用React钩子（useState、useEffect等）\n- 支持交互性事件处理\n- 可以访问浏览器API\n- 可以使用useEffect进行生命周期管理\n\n一般原则是：默认使用服务器组件，只有在需要交互性、客户端状态或浏览器API时才切换到客户端组件。"
  },
  {
    id: 4,
    title: "每个开发者都应该了解的性能优化技巧",
    author: "性能优化师",
    upvotes: 215,
    commentCount: 2,
    timeAgo: "1天前",
    category: "教程",
    content: "网站性能优化是前端开发中不可忽视的重要环节，它直接影响用户体验和转化率。以下是每个开发者都应该了解的核心性能优化技巧：\n\n**1. 资源优化**\n- 压缩和合并CSS/JavaScript文件\n- 优化图像（WebP格式、适当尺寸、懒加载）\n- 使用适当的字体加载策略\n\n**2. 渲染优化**\n- 减少关键渲染路径\n- 避免布局抖动（Layout Thrashing）\n- 合理使用CSS硬件加速\n\n**3. 网络优化**\n- 实现内容分发网络（CDN）\n- 利用浏览器缓存\n- 减少HTTP请求\n\n**4. 代码优化**\n- 避免不必要的重渲染\n- 使用代码分割和懒加载\n- 优化第三方脚本\n\n通过实施这些优化技巧，你可以显著提升网站的加载速度和运行性能，提供更流畅的用户体验。"
  },
  {
    id: 5,
    title: "从零开始构建Next.js应用 - 完整指南",
    author: "全栈工程师",
    upvotes: 189,
    commentCount: 3,
    timeAgo: "2天前",
    category: "教程",
    content: "Next.js已经成为React开发中最受欢迎的框架之一，它提供了诸多开箱即用的功能，大大简化了现代Web应用的开发流程。本指南将带你从零开始构建一个完整的Next.js应用。\n\n**第一步：环境设置**\n```bash\nnpx create-next-app my-next-app\ncd my-next-app\nnpm run dev\n```\n\n**第二步：了解文件结构**\n- `pages/`：基于文件系统的路由\n- `public/`：静态资源\n- `styles/`：CSS样式文件\n- `components/`：可重用组件\n\n**第三步：实现核心功能**\n- 创建页面和路由\n- 数据获取方法（getStaticProps, getServerSideProps）\n- API路由开发\n- 样式解决方案\n\n**第四步：部署**\n- 使用Vercel一键部署\n- 其他部署选项\n\n通过本指南，你将能够掌握使用Next.js开发现代Web应用的核心技能。"
  }
];

// 模拟评论数据
const mockComments: Record<number, Comment[]> = {
  1: [
    { id: 1, author: "前端开发者", content: "太棒了！等不及要尝试新版本的服务器组件了。", timeAgo: "2小时前", upvotes: 15 },
    { id: 2, author: "技术分析师", content: "性能提升真的很显著，我已经在生产项目中使用了，启动时间确实快了不少。", timeAgo: "1小时前", upvotes: 8 },
    { id: 3, author: "初学者", content: "有没有详细的升级指南？我有一个较大的项目需要升级。", timeAgo: "30分钟前", upvotes: 3 }
  ],
  2: [
    { id: 1, author: "UI设计师", content: "Element Plus的设计语言很现代，和Tailwind结合确实是个不错的选择。", timeAgo: "4小时前", upvotes: 12 },
    { id: 2, author: "全栈开发", content: "我在最近的项目中也是这么做的，不过遇到了一些主题定制的问题。", timeAgo: "3小时前", upvotes: 7 },
    { id: 3, author: "资深前端", content: "建议在文章中也提一下如何处理Tailwind的JIT和Element Plus的样式优先级冲突问题。", timeAgo: "2小时前", upvotes: 9 },
    { id: 4, author: "新手前端", content: "能分享一下你们项目的配置文件吗？我正在学习这个组合。", timeAgo: "1小时前", upvotes: 4 },
    { id: 5, author: "产品经理", content: "从产品角度看，这种组合确实能加快开发速度，我们团队的迭代周期缩短了不少。", timeAgo: "30分钟前", upvotes: 6 }
  ],
  3: [
    { id: 1, author: "React核心开发", content: "很好的总结！我想补充一点：服务器组件和客户端组件可以嵌套使用，这给了开发者很大的灵活性。", timeAgo: "10小时前", upvotes: 25 },
    { id: 2, author: "全栈开发者", content: "我发现在数据获取方面，服务器组件确实比客户端组件有明显优势，特别是对于需要从多个API获取数据的场景。", timeAgo: "8小时前", upvotes: 18 },
    { id: 3, author: "前端架构师", content: "服务器组件也带来了一些心智负担，特别是在理解数据流和组件渲染时序方面。", timeAgo: "6小时前", upvotes: 12 },
    { id: 4, author: "React初学者", content: "这篇文章对我帮助很大，终于理解了何时使用服务器组件和客户端组件。谢谢分享！", timeAgo: "2小时前", upvotes: 7 }
  ],
  4: [
    { id: 1, author: "Web性能专家", content: "非常全面的总结！我想补充一点关于Core Web Vitals的重要性，它已成为Google排名的因素之一。", timeAgo: "20小时前", upvotes: 19 },
    { id: 2, author: "移动开发者", content: "对于移动端来说，预加载和缓存策略尤为重要。建议针对移动用户优化这些部分。", timeAgo: "15小时前", upvotes: 11 }
  ],
  5: [
    { id: 1, author: "Next.js爱好者", content: "非常详细的教程，对初学者很友好！", timeAgo: "1天前", upvotes: 20 },
    { id: 2, author: "全栈开发", content: "能否增加一些关于Next.js中状态管理的内容？比如与Redux或Zustand的集成？", timeAgo: "1天前", upvotes: 15 },
    { id: 3, author: "后端开发", content: "作为一个后端开发者，我发现Next.js的API路由功能让我可以快速构建全栈应用，不需要单独设置后端服务器。", timeAgo: "12小时前", upvotes: 13 }
  ]
};

export default function PostPage({ params }: { params: { id: string } }) {
  const postId = parseInt(params.id, 10);
  const post = mockPosts.find(p => p.id === postId);
  const comments = mockComments[postId] || [];

  if (!post) {
    notFound();
  }

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
      <article className="bg-white dark:bg-dark-secondary rounded-lg shadow p-6">
        <div className="flex">
          {/* 投票区 */}
          <div className="flex flex-col items-center mr-4">
            <button className="text-neutral-400 hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <span className="font-medium text-sm my-2">{post.upvotes}</span>
            <button className="text-neutral-400 hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* 内容区 */}
          <div className="flex-1">
            <div className="flex items-center text-sm text-neutral-400 mb-2">
              <span className="px-2 py-1 bg-neutral-100 dark:bg-zinc-700 rounded-full text-xs text-neutral-600 dark:text-neutral-300 mr-2">
                {post.category}
              </span>
              <span>由 {post.author} 发布 · {post.timeAgo}</span>
            </div>

            <h1 className="text-2xl font-bold text-neutral-800 dark:text-white mb-4">{post.title}</h1>

            <div className="prose dark:prose-invert max-w-none mb-6">
              {post.content.split("\n\n").map((paragraph, idx) => (
                <p key={idx} className="mb-4 text-neutral-700 dark:text-neutral-300">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="flex items-center text-sm text-neutral-400 pt-4 border-t border-neutral-100 dark:border-zinc-700">
              <button className="flex items-center hover:bg-neutral-100 dark:hover:bg-zinc-700 px-3 py-2 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {comments.length} 评论
              </button>

              <button className="flex items-center hover:bg-neutral-100 dark:hover:bg-zinc-700 px-3 py-2 rounded ml-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                分享
              </button>

              <button className="flex items-center hover:bg-neutral-100 dark:hover:bg-zinc-700 px-3 py-2 rounded ml-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                收藏
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* 评论区 */}
      <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 text-neutral-800 dark:text-white">评论 ({comments.length})</h2>

        {/* 评论输入框 */}
        <div className="mb-8">
          <textarea
            className="w-full border border-neutral-200 dark:border-zinc-700 rounded-md p-4 mb-3 bg-white dark:bg-zinc-800 text-neutral-800 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-primary focus:border-transparent"
            rows={3}
            placeholder="添加评论..."
          />
          <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary-hover transition-colors">
            发布评论
          </button>
        </div>

        {/* 评论列表 */}
        <div className="space-y-6">
          {comments.map(comment => (
            <div key={comment.id} className="flex space-x-3 pb-6 border-b border-neutral-100 dark:border-zinc-700 last:border-b-0 last:pb-0">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-neutral-200 dark:bg-zinc-700 flex items-center justify-center text-neutral-500 dark:text-neutral-300 font-semibold">
                  {comment.author.charAt(0)}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-neutral-800 dark:text-white">{comment.author}</span>
                  <span className="text-xs text-neutral-400">{comment.timeAgo}</span>
                </div>
                <p className="text-neutral-600 dark:text-neutral-300 mb-2">{comment.content}</p>
                <div className="flex items-center text-sm">
                  <button className="flex items-center text-neutral-400 hover:text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    <span>{comment.upvotes}</span>
                  </button>
                  <button className="flex items-center text-neutral-400 hover:text-primary ml-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button className="ml-4 text-neutral-400 hover:text-primary">回复</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 