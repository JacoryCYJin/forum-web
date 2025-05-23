import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-neutral-800 dark:text-white mb-6">页面未找到</h2>
      <p className="text-neutral-600 dark:text-neutral-300 mb-8 text-center max-w-md">
        很抱歉，您访问的页面不存在或已被移除。
      </p>
      <Link 
        href="/" 
        className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors font-medium"
      >
        返回首页
      </Link>
    </div>
  );
} 