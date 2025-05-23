export default function Footer() {
  return (
    <footer className="bg-white dark:bg-dark-secondary py-6 border-t border-neutral-200 dark:border-zinc-700">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              © {new Date().getFullYear()} 地理社区. 保留所有权利.
            </p>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-neutral-500 dark:text-neutral-400 hover:text-primary dark:hover:text-primary">
              关于我们
            </a>
            <a href="#" className="text-neutral-500 dark:text-neutral-400 hover:text-primary dark:hover:text-primary">
              隐私政策
            </a>
            <a href="#" className="text-neutral-500 dark:text-neutral-400 hover:text-primary dark:hover:text-primary">
              使用条款
            </a>
            <a href="#" className="text-neutral-500 dark:text-neutral-400 hover:text-primary dark:hover:text-primary">
              联系我们
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}