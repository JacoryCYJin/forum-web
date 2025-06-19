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
        return <Chip theme={theme} size="16" />;
      case "技术":
        return <Code theme={theme} size="16" />;
      case "电影":
        return <VideoOne theme={theme} size="16" />;
      case "音乐":
        return <Music theme={theme} size="16" />;
      case "美食":
        return <ForkSpoon theme={theme} size="16" />;
      case "旅行":
        return <Journey theme={theme} size="16" />;
      case "摄影":
        return <Camera theme={theme} size="16" />;
      case "生活":
        return (
          <CoffeeMachine theme={theme} size="16" />
        );
      case "运动":
        return <Sport theme={theme} size="16" />;
      case "读书":
        return <Book theme={theme} size="16" />;
      case "游戏":
        return <Gamepad theme={theme} size="16" />;
      default:
        return <Code theme={theme} size="16" />;
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

  // 顶部固定导航项
  const topNavItems: SidebarItem[] = [
    {
      name: "home",
      icon: <Home theme="outline" size="16" />,
      path: "/",
    },
    {
      name: "hot",
      icon: <Fire theme="outline" size="16" />,
      path: "/popular",
    },
    {
      name: "map",
      icon: <MapDraw theme="outline" size="16" />,
      path: "/introduce",
    },
    {
      name: "follow",
      icon: <Concern theme="outline" size="16" />,
      path: "/like",
    },
  ];

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
                      className="group flex items-center space-x-3 text-neutral-600 dark:text-neutral-400 hover:text-primary dark:hover:text-primary transition-all duration-300 p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-700/50"                    >
                      <span className="group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 text-primary pl-2">
                        {item.path === "/" && isLinkActive(item.path) ? (
                          <Home
                            theme="filled"
                            size="16"
                          />
                        ) : item.path === "/popular" &&
                          isLinkActive(item.path) ? (
                          <Fire
                            theme="filled"
                            size="16"
                          />
                        ) : item.path === "/introduce" &&
                          isLinkActive(item.path) ? (
                          <MapDraw
                            theme="filled"
                            size="16"
                          />
                        ) : item.path === "/like" &&
                          isLinkActive(item.path) ? (
                          <Concern
                            theme="filled"
                            size="16"
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
                              className="group flex items-center space-x-3 text-neutral-600 dark:text-neutral-400 hover:text-primary dark:hover:text-primary transition-all duration-300 p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-700/50"
                            >
                              <span className="group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 text-primary pl-2">
                                {getCategoryIcon(category.categoryName, isActive)}
                              </span>
                              <span className="group-hover:translate-x-1 transition-transform duration-300">
                                {category.categoryName}
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
