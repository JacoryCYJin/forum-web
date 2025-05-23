'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from '@icon-park/react';

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  // 当组件加载时，检查系统偏好
  useEffect(() => {
    // 检查localStorage中是否有保存的主题设置
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || 
        (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // 切换主题
  const toggleTheme = () => {
    if (darkMode) {
      // 切换到亮色模式
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      // 切换到暗色模式
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="rounded-full p-2 bg-neutral-100 dark:bg-dark-secondary hover:bg-neutral-200 dark:hover:bg-zinc-700 transition-colors"
      aria-label={darkMode ? '切换到亮色模式' : '切换到暗色模式'}
    >
      {darkMode ? (
        <Sun theme="filled" size="20" fill="#F59E0B" />
      ) : (
        <Moon theme="filled" size="20" fill="#6B7280" />
      )}
    </button>
  );
};

export default ThemeToggle; 