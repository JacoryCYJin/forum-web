'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Fire, Code, VideoOne, ActivitySource, Down } from '@icon-park/react';

interface SidebarProps {
  onToggle?: (collapsed: boolean) => void;
}

interface SidebarCategory {
  title: string;
  items: SidebarItem[];
}

interface SidebarItem {
  name: string;
  icon: React.ReactElement;
  path?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<{[key: string]: boolean}>({});
  const pathname = usePathname();

  // 初始化所有分类为展开状态
  useEffect(() => {
    const initialState: {[key: string]: boolean} = {};
    categories.forEach(category => {
      initialState[category.title] = true;
    });
    setExpandedCategories(initialState);
  }, []);

  // 当折叠状态改变时，调用父组件的回调函数
  useEffect(() => {
    if (onToggle) {
      onToggle(isCollapsed);
    }
  }, [isCollapsed, onToggle]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleCategory = (title: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  // 检查链接是否被选中
  const isLinkActive = (path: string) => {
    return pathname === path;
  };

  // 顶部固定导航项
  const topNavItems: SidebarItem[] = [
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
  ];

  const categories: SidebarCategory[] = [
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
    <aside className="fixed top-0 left-0 z-40 h-screen flex flex-col">
      {/* 侧边栏顶部固定部分 - 不随收缩变化 */}
      <div className="w-60 h-14 bg-white dark:bg-dark-primary border-b border-neutral-200 dark:border-zinc-800">
        <div className="h-full flex items-center justify-between px-4">
          <Link href="/" className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="h-8 w-8 text-primary">
              <g>
                <circle fill="currentColor" cx="10" cy="10" r="10" />
                <path fill="white" d="M16.67,10A1.46,1.46,0,0,0,14.2,9a7.12,7.12,0,0,0-3.85-1.23L11,4.65,13.14,5.1a1,1,0,1,0,.13-0.61L10.82,4a0.31,0.31,0,0,0-.37.24L9.71,7.71a7.14,7.14,0,0,0-3.9,1.23A1.46,1.46,0,1,0,4.2,11.33a2.87,2.87,0,0,0,0,.44c0,2.24,2.61,4.06,5.83,4.06s5.83-1.82,5.83-4.06a2.87,2.87,0,0,0,0-.44A1.46,1.46,0,0,0,16.67,10Zm-10,1a1,1,0,1,1,1,1A1,1,0,0,1,6.67,11Zm5.81,2.75a3.84,3.84,0,0,1-2.47.77,3.84,3.84,0,0,1-2.47-.77,0.27,0.27,0,0,1,.38-0.38A3.27,3.27,0,0,0,10,14a3.28,3.28,0,0,0,2.09-.61A0.27,0.27,0,1,1,12.48,13.79Zm-0.18-1.71a1,1,0,1,1,1-1A1,1,0,0,1,12.29,12.08Z" />
              </g>
            </svg>
            <span className="ml-2 text-xl font-bold text-neutral-500 dark:text-white">论坛</span>
          </Link>
        </div>
      </div>
      
      {/* 侧边栏可收缩部分 */}
      <div 
        className={`bg-white dark:bg-dark-primary border-r border-neutral-200 dark:border-zinc-800 transition-all duration-300 ease-in-out h-[calc(100vh-3.5rem)] ${
          isCollapsed ? 'w-10' : 'w-60'
        }`}
      >
        {/* 折叠按钮 */}
        <div className="relative">
          <button
            onClick={toggleSidebar}
            className="absolute right-0 top-4 p-3 text-neutral-400 hover:text-neutral-700 dark:text-neutral-300 dark:hover:text-white rounded-full bg-white dark:bg-dark-primary border border-neutral-200 dark:border-zinc-700 shadow-md z-10"
            style={{ transform: 'translateX(50%)' }}
          >
            <ActivitySource theme="outline" size="18" strokeLinejoin="miter"/>
          </button>
        </div>

        {/* 侧边栏内容 - 使用 opacity 和 width 过渡，避免闪烁 */}
        <div 
          className={`overflow-y-auto h-full pl-4 pr-7 mt-4 transition-all duration-300 ease-in-out ${
            isCollapsed 
              ? 'opacity-0 invisible w-0 pl-0 pr-0' 
              : 'opacity-100 visible w-full'
          }`}
        >
          {/* 顶部固定导航项 */}
          <div className="mb-4">
            <ul>
              {topNavItems.map((item, index) => (
                <li key={index}>
                  {item.path ? (
                    <Link 
                      href={item.path} 
                      className={`flex items-center p-2 rounded-md ${
                        isLinkActive(item.path) 
                          ? 'bg-neutral-200 dark:bg-zinc-700 text-neutral-900 dark:text-white' 
                          : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {item.path === '/' && isLinkActive(item.path) ? (
                        <Home theme="filled" size="22" className="sidebar-icon" />
                      ) : item.path === '/popular' && isLinkActive(item.path) ? (
                        <Fire theme="filled" size="22" className="sidebar-icon" />
                      ) : (
                        item.icon
                      )}
                      <span className="ml-3">{item.name}</span>
                    </Link>
                  ) : (
                    <div className="flex items-center p-2 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-md">
                      {item.icon}
                      <span className="ml-3">{item.name}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* 分隔线 */}
          <div className="border-b border-neutral-200 dark:border-zinc-800 mb-4"></div>

          {/* 分类 */}
          {categories.map((category, index) => (
            <div key={index} className="mb-6">
              <div 
                className="flex items-center justify-between mb-2 cursor-pointer"
                onClick={() => toggleCategory(category.title)}
              >
                <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  {category.title}
                </h3>
                <Down 
                  theme="outline" 
                  size="14" 
                  className={`text-neutral-400 transition-transform duration-300 ${expandedCategories[category.title] ? 'rotate-180' : ''}`}
                />
              </div>
              {expandedCategories[category.title] && (
                <ul className="transition-all duration-300">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      {item.path ? (
                        <Link 
                          href={item.path} 
                          className={`flex items-center p-2 rounded-md ${
                            isLinkActive(item.path) 
                              ? 'bg-neutral-200 dark:bg-zinc-700 text-neutral-900 dark:text-white' 
                              : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-zinc-800'
                          }`}
                        >
                          {item.path === '/category/tech' && isLinkActive(item.path) ? (
                            <Code theme="filled" size="22" className="sidebar-icon" />
                          ) : item.path === '/category/entertainment' && isLinkActive(item.path) ? (
                            <VideoOne theme="filled" size="22" className="sidebar-icon" />
                          ) : (
                            item.icon
                          )}
                          <span className="ml-3">{item.name}</span>
                        </Link>
                      ) : (
                        <div className="flex items-center p-2 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-md">
                          {item.icon}
                          <span className="ml-3">{item.name}</span>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;