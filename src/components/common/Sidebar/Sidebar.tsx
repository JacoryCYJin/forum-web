'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, Fire, Code, VideoOne, ArrowLeft, ArrowRight } from '@icon-park/react';

interface SidebarProps {
  onToggle?: (collapsed: boolean) => void;
}

interface SidebarCategory {
  title: string;
  items: SidebarItem[];
}

interface SidebarItem {
  name: string;
  icon: React.ReactNode;
  path?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 当折叠状态改变时，调用父组件的回调函数
  useEffect(() => {
    if (onToggle) {
      onToggle(isCollapsed);
    }
  }, [isCollapsed, onToggle]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const categories: SidebarCategory[] = [
    {
      title: '话题',
      items: [
        {
          name: '首页',
          icon: <Home theme="outline" size="22" className="sidebar-icon" />,
          path: '/',
        },
        {
          name: '热门',
          icon: <Fire theme="outline" size="22" className="sidebar-icon" />,
          path: '/popular',
        },
      ],
    },
    {
      title: '分类',
      items: [
        {
          name: '技术',
          icon: <Code theme="outline" size="22" className="sidebar-icon" />,
          path: '/category/tech',
        },
        {
          name: '娱乐',
          icon: <VideoOne theme="outline" size="22" className="sidebar-icon" />,
          path: '/category/entertainment',
        },
      ],
    },
  ];

  return (
    <aside
      className={`h-screen bg-white dark:bg-dark-primary border-r border-neutral-200 dark:border-zinc-800 transition-all duration-300 fixed top-14 left-0 z-40 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="relative">
        <button
          onClick={toggleSidebar}
          className="absolute right-0 top-4 p-2 text-neutral-400 hover:text-neutral-500 dark:hover:text-white rounded-md"
          style={{ transform: 'translateX(50%)' }}
        >
          {isCollapsed ? (
            <ArrowRight theme="outline" size="20" className="bg-white dark:bg-dark-primary p-1 rounded-full shadow-md" />
          ) : (
            <ArrowLeft theme="outline" size="20" className="bg-white dark:bg-dark-primary p-1 rounded-full shadow-md" />
          )}
        </button>
      </div>

      <div className={`overflow-y-auto h-[calc(100vh-6rem)] mt-12 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        {categories.map((category, index) => (
          <div key={index} className="mb-6">
            {!isCollapsed && (
              <h3 className="mb-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">{category.title}</h3>
            )}
            <ul>
              {category.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  {item.path ? (
                    <Link href={item.path} className={`flex items-center p-2 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-md ${isCollapsed ? 'justify-center' : ''}`}>
                      {item.icon}
                      {!isCollapsed && <span className="ml-3">{item.name}</span>}
                    </Link>
                  ) : (
                    <div className={`flex items-center p-2 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-md ${isCollapsed ? 'justify-center' : ''}`}>
                      {item.icon}
                      {!isCollapsed && <span className="ml-3">{item.name}</span>}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;