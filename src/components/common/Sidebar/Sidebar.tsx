"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Fire,
  Code,
  VideoOne,
  ActivitySource,
  Down,
  Concern,
  MapDraw,
  Music,
  ForkSpoon,
  Journey,
  Camera,
  CoffeeMachine,
  Sport,
  Book,
  Gamepad,
  Chip,
} from "@icon-park/react";
import { getCategoryListWithCacheApi } from "@/lib/api/categoryApi";
import { Category } from "@/types/categoryTypes";
import LanguageText from "@/components/common/LanguageText/LanguageText";
import { useUserStore } from "@/store/userStore";

/**
 * 侧边栏组件属性接口
 */
interface SidebarProps {
  /**
   * 侧边栏折叠状态变化回调函数
   */
  onToggle?: (collapsed: boolean) => void;
}

/**
 * 侧边栏项目接口
 */
interface SidebarItem {
  /**
   * 项目名称
   */
  name: string;
  /**
   * 项目图标
   */
  icon: React.ReactElement;
  /**
   * 项目路径
   */
  path?: string;
  /**
   * 分类ID（用于动态分类）
   */
  categoryId?: string;
}

/**
 * 侧边栏组件
 *
 * 提供导航功能，包含固定导航项和动态分类列表
 *
 * @component
 * @example
 * // 基本用法
 * <Sidebar onToggle={(collapsed) => console.log('Sidebar collapsed:', collapsed)} />
 */
const Sidebar: React.FC<SidebarProps> = ({ onToggle }) => {
  /**
   * 用户登录状态
   */
  const { user } = useUserStore();

  /**
   * 组件挂载状态引用，防止在组件卸载后更新状态
   */
  const isMountedRef = useRef(true);

  /**
   * 侧边栏折叠状态
   */
  const [isCollapsed, setIsCollapsed] = useState(false);

  /**
   * 分类展开状态
   */
  const [expandedCategories, setExpandedCategories] = useState<{
    [key: string]: boolean;
  }>({
    分类: true, // 默认展开分类区域
  });

  /**
   * 分类数据列表
   */
  const [categories, setCategories] = useState<Category[]>([]);

  /**
   * 加载状态
   */
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 错误信息
   */
  const [error, setError] = useState<string | null>(null);

  const pathname = usePathname();

  /**
   * 获取分类数据
   *
   * 从API获取分类列表并更新组件状态，包含完整的错误处理
   *
   * @async
   */
  const fetchCategories = async () => {
    // 检查组件是否仍然挂载
    if (!isMountedRef.current) return;

    try {
      setIsLoading(true);
      setError(null);

      console.log("🚀 开始获取分类数据...");
      const categoryData = await getCategoryListWithCacheApi();

      // 再次检查组件是否仍然挂载
      if (!isMountedRef.current) return;

      console.log("✅ 分类数据获取成功:", categoryData);
      setCategories(categoryData || []);
    } catch (err: any) {
      // 再次检查组件是否仍然挂载
      if (!isMountedRef.current) return;

      console.error("❌ 获取分类列表失败:", err);

      // 提取错误信息
      const errorMessage = err?.message || "获取分类列表失败";
      setError(errorMessage);

      // 设置空数组避免渲染错误
      setCategories([]);
    } finally {
      // 检查组件是否仍然挂载后再更新状态
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  /**
   * 组件挂载时的副作用
   */
  useEffect(() => {
    // 设置组件为挂载状态
    isMountedRef.current = true;

    // 🚀 启用真实API调用
    fetchCategories();

    // 清理函数
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  /**
   * 当折叠状态改变时，调用父组件的回调函数
   */
  useEffect(() => {
    if (onToggle && isMountedRef.current) {
      onToggle(isCollapsed);
    }
  }, [isCollapsed, onToggle]);

  /**
   * 切换侧边栏折叠状态
   */
  const toggleSidebar = () => {
    if (isMountedRef.current) {
      setIsCollapsed(!isCollapsed);
    }
  };

  /**
   * 切换分类展开状态
   *
   * @param {string} title - 分类标题
   */
  const toggleCategory = (title: string) => {
    if (isMountedRef.current) {
      setExpandedCategories((prev) => ({
        ...prev,
        [title]: !prev[title],
      }));
    }
  };

  /**
   * 检查链接是否被选中
   *
   * @param {string} path - 链接路径
   * @returns {boolean} 是否为当前激活路径
   */
  const isLinkActive = (path: string) => {
    return pathname === path;
  };

  /**
   * 根据分类名称生成图标
   *
   * @param {string} categoryName - 分类名称
   * @param {boolean} isActive - 是否为激活状态
   * @returns {React.ReactElement} 分类图标
   */
  const getCategoryIcon = (categoryName: string, isActive: boolean = false) => {
    const theme = isActive ? "filled" : "outline";

    switch (categoryName) {
      case "科技":
        return <Chip theme={theme} size="18" />;
      case "技术":
        return <Code theme={theme} size="18" />;
      case "电影":
        return <VideoOne theme={theme} size="18" />;
      case "音乐":
        return <Music theme={theme} size="18" />;
      case "美食":
        return <ForkSpoon theme={theme} size="18" />;
      case "旅行":
        return <Journey theme={theme} size="18" />;
      case "摄影":
        return <Camera theme={theme} size="18" />;
      case "生活":
        return (
          <CoffeeMachine theme={theme} size="18" />
        );
      case "运动":
        return <Sport theme={theme} size="18" />;
      case "读书":
        return <Book theme={theme} size="18" />;
      case "游戏":
        return <Gamepad theme={theme} size="18" />;
      default:
        return <Code theme={theme} size="18" />;
    }
  };

  /**
   * 手动重试获取分类数据
   */
  const handleRetry = () => {
    if (isMountedRef.current) {
      fetchCategories();
    }
  };

  /**
   * 获取导航项的多语言文本
   *
   * @param {string} key - 导航项键值
   * @returns {object} 多语言文本映射
   */
  const getNavText = (key: string) => {
    const textMap: { [key: string]: { 'zh-CN': string; 'zh-TW': string; 'en': string } } = {
      home: {
        'zh-CN': '首页',
        'zh-TW': '首頁',
        'en': 'Home'
      },
      hot: {
        'zh-CN': '热门',
        'zh-TW': '熱門',
        'en': 'Hot'
      },
      message: {
        'zh-CN': '聊天',
        'zh-TW': '聊天',
        'en': 'Messages'
      },
      map: {
        'zh-CN': '地图',
        'zh-TW': '地圖',
        'en': 'Map'
      },
      follow: {
        'zh-CN': '关注',
        'zh-TW': '關注',
        'en': 'Follow'
      },
      category: {
        'zh-CN': '分类',
        'zh-TW': '分類',
        'en': 'Categories'
      },
      loading: {
        'zh-CN': '加载中...',
        'zh-TW': '載入中...',
        'en': 'Loading...'
      },
      retry: {
        'zh-CN': '重试',
        'zh-TW': '重試',
        'en': 'Retry'
      },
      ignore: {
        'zh-CN': '忽略',
        'zh-TW': '忽略',
        'en': 'Ignore'
      },
      noData: {
        'zh-CN': '暂无分类数据',
        'zh-TW': '暫無分類數據',
        'en': 'No categories available'
      }
    };
    return textMap[key] || textMap.home;
  };

  /**
   * 获取分类的多语言文本
   *
   * @param {string} categoryName - 分类名称
   * @returns {object} 多语言文本映射
   */
  const getCategoryText = (categoryName: string) => {
    const textMap: { [key: string]: { 'zh-CN': string; 'zh-TW': string; 'en': string } } = {
      '科技': {
        'zh-CN': '科技',
        'zh-TW': '科技',
        'en': 'Science'
      },
      '技术': {
        'zh-CN': '技术',
        'zh-TW': '技術',
        'en': 'Technology'
      },
      '电影': {
        'zh-CN': '电影',
        'zh-TW': '電影',
        'en': 'Movies'
      },
      '音乐': {
        'zh-CN': '音乐',
        'zh-TW': '音樂',
        'en': 'Music'
      },
      '美食': {
        'zh-CN': '美食',
        'zh-TW': '美食',
        'en': 'Food'
      },
      '旅行': {
        'zh-CN': '旅行',
        'zh-TW': '旅行',
        'en': 'Travel'
      },
      '摄影': {
        'zh-CN': '摄影',
        'zh-TW': '攝影',
        'en': 'Photography'
      },
      '生活': {
        'zh-CN': '生活',
        'zh-TW': '生活',
        'en': 'Lifestyle'
      },
      '运动': {
        'zh-CN': '运动',
        'zh-TW': '運動',
        'en': 'Sports'
      },
      '读书': {
        'zh-CN': '读书',
        'zh-TW': '讀書',
        'en': 'Reading'
      },
      '游戏': {
        'zh-CN': '游戏',
        'zh-TW': '遊戲',
        'en': 'Gaming'
      }
    };
    return textMap[categoryName] || {
      'zh-CN': categoryName,
      'zh-TW': categoryName,
      'en': categoryName
    };
  };

  // 顶部固定导航项
  const allNavItems: SidebarItem[] = [
    {
      name: "home",
      icon: <Home theme="outline" size="20" />,
      path: "/",
    },
    {
      name: "hot",
      icon: <Fire theme="outline" size="20" />,
      path: "/popular",
    },
    {
      name: "message",
      icon: (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      path: "/message",
    },
    {
      name: "map",
      icon: <MapDraw theme="outline" size="20" />,
      path: "/introduce",
    },
    {
      name: "follow",
      icon: <Concern theme="outline" size="20" />,
      path: "/like",
    },
  ];

  // 根据用户登录状态过滤导航项
  const topNavItems = allNavItems.filter(item => {
    // 未登录时隐藏聊天和关注选项
    if (!user && (item.name === "message" || item.name === "follow")) {
      return false;
    }
    return true;
  });

  return (
    <aside className="fixed top-14 left-0 z-40 h-[calc(100vh-3.5rem)] flex flex-col">
      {/* 侧边栏可收缩部分 */}
      <div
        className={`bg-white dark:bg-dark-primary border-r border-neutral-200 dark:border-zinc-800 transition-all duration-300 ease-in-out h-full ${
          isCollapsed ? "w-10" : "w-60"
        }`}
      >
        {/* 折叠按钮 */}
        <div className="relative">
          <button
            onClick={toggleSidebar}
            className="absolute right-0 top-4 p-3 text-neutral-400 hover:text-neutral-700 dark:text-neutral-300 dark:hover:text-white rounded-full bg-white dark:bg-dark-primary border border-neutral-200 dark:border-zinc-700 shadow-md z-10 focus:outline-none focus:ring-0 focus:!shadow-none focus:!border-neutral-200 dark:focus:!border-zinc-700"
            style={{ transform: "translateX(50%)" }}
            aria-label={isCollapsed ? "展开侧边栏" : "收起侧边栏"}
          >
            <ActivitySource theme="outline" size="18" strokeLinejoin="miter" />
          </button>
        </div>

        {/* 侧边栏内容 - 使用 opacity 和 width 过渡，避免闪烁 */}
        <div
          className={`overflow-y-auto h-full pl-4 pr-7 mt-4 transition-all duration-300 ease-in-out ${
            isCollapsed
              ? "opacity-0 invisible w-0 pl-0 pr-0"
              : "opacity-100 visible w-full"
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
                      className={`group flex items-center space-x-3 hover:text-primary dark:hover:text-primary transition-all duration-300 p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-700/50 text-base font-medium ${
                        isLinkActive(item.path)
                          ? 'text-primary bg-neutral-100 dark:bg-zinc-700/50'
                          : 'text-neutral-700 dark:text-neutral-300'
                      }`}                    >
                      <span className="group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 text-primary pl-2">
                        {item.path === "/" && isLinkActive(item.path) ? (
                          <Home
                            theme="filled"
                            size="20"
                          />
                        ) : item.path === "/popular" &&
                          isLinkActive(item.path) ? (
                          <Fire
                            theme="filled"
                            size="20"
                          />
                        ) : item.path === "/message" &&
                          isLinkActive(item.path) ? (
                          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        ) : item.path === "/introduce" &&
                          isLinkActive(item.path) ? (
                          <MapDraw
                            theme="filled"
                            size="20"
                          />
                        ) : item.path === "/like" &&
                          isLinkActive(item.path) ? (
                          <Concern
                            theme="filled"
                            size="20"
                          />
                        ) : (
                          item.icon
                        )}
                      </span>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        <LanguageText texts={getNavText(item.name)} />
                      </span>
                    </Link>
                  ) : (
                    <div className="flex items-center p-3 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-md">
                      {item.icon}
                                              <span className="ml-3">
                          <LanguageText texts={getNavText(item.name)} />
                        </span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* 分隔线 */}
          <div className="border-b border-neutral-200 dark:border-zinc-800 mb-4"></div>

          {/* 动态分类区域 */}
          <div className="mb-6">
            <div
              className="flex items-center justify-between mb-2 cursor-pointer"
              onClick={() => toggleCategory("分类")}
            >
              <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                <LanguageText texts={getNavText('category')} />
              </h3>
              <Down
                theme="outline"
                size="14"
                className={`text-neutral-400 transition-transform duration-300 ${
                  expandedCategories["分类"] ? "rotate-180" : ""
                }`}
              />
            </div>

            {expandedCategories["分类"] && (
              <div className="transition-all duration-300">
                {/* 加载状态 */}
                {isLoading && (
                  <div className="flex items-center p-2 text-neutral-500 dark:text-neutral-400">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-neutral-500 mr-3"></div>
                    <span className="text-sm">
                      <LanguageText texts={getNavText('loading')} />
                    </span>
                  </div>
                )}

                {/* 错误状态 */}
                {error && !isLoading && (
                  <div className="p-2">
                    <div className="flex flex-col space-y-2">
                      <span className="text-xs text-red-500 dark:text-red-400">
                        {error}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleRetry}
                          className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline hover:no-underline"
                        >
                          <LanguageText texts={getNavText('retry')} />
                        </button>
                        <button
                          onClick={() => setError(null)}
                          className="text-xs text-neutral-500 hover:text-neutral-600 dark:text-neutral-400 dark:hover:text-neutral-300"
                        >
                          <LanguageText texts={getNavText('ignore')} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 分类列表 */}
                {!isLoading && !error && (
                  <ul>
                    {categories.length > 0 ? (
                      categories.map((category) => {
                        const categoryPath = `/category/${category.categoryId}`;
                        const isActive = isLinkActive(categoryPath);

                        return (
                          <li key={category.categoryId}>
                            <Link
                              href={categoryPath}
                              className={`group flex items-center space-x-3 hover:text-primary dark:hover:text-primary transition-all duration-300 p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-700/50 text-base font-medium ${
                                isActive
                                  ? 'text-primary bg-neutral-100 dark:bg-zinc-700/50'
                                  : 'text-neutral-700 dark:text-neutral-300'
                              }`}
                            >
                              <span className="group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 text-primary pl-2">
                                {getCategoryIcon(category.categoryName, isActive)}
                              </span>
                              <span className="group-hover:translate-x-1 transition-transform duration-300">
                                <LanguageText texts={getCategoryText(category.categoryName)} />
                              </span>
                            </Link>
                          </li>
                        );
                      })
                    ) : (
                      /* 空状态 */
                      <li className="p-2 text-neutral-500 dark:text-neutral-400 text-sm">
                        <LanguageText texts={getNavText('noData')} />
                      </li>
                    )}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
