'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from '@icon-park/react';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 在客户端挂载后再渲染，避免水合错误
  useEffect(() => {
    setMounted(true);
  }, []);

  // 切换主题
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // 如果没有挂载完成，返回占位符以避免布局偏移
  if (!mounted) {
    return (
      <button
        className="rounded-full p-2 bg-neutral-100 dark:bg-dark-secondary transition-colors"
        aria-label="加载中"
      >
        <div className="w-5 h-5"></div>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="rounded-full p-2 bg-neutral-100 dark:bg-dark-secondary hover:bg-neutral-200 dark:hover:bg-zinc-700 transition-colors"
      aria-label={theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
    >
      {theme === 'dark' ? (
        <Sun theme="filled" size="20" fill="#F59E0B" />
      ) : (
        <Moon theme="filled" size="20" fill="#6B7280" />
      )}
    </button>
  );
};

export default ThemeToggle; 