/**
 * @file 分页组件
 * @module components/common/Pagination
 * @description 通用分页组件，支持多语言、暗色模式和响应式设计，现代化UI风格
 */

"use client";

import LanguageText from "@/components/common/LanguageText/LanguageText";

/**
 * 分页组件属性接口
 */
export interface PaginationProps {
  /**
   * 当前页码
   */
  currentPage: number;

  /**
   * 总页数
   */
  totalPages: number;

  /**
   * 页码变化回调函数
   */
  onPageChange: (page: number) => void;

  /**
   * 是否显示统计信息
   * @default true
   */
  showStats?: boolean;

  /**
   * 显示的页码按钮数量
   * @default 5
   */
  showPagesCount?: number;

  /**
   * 是否紧凑模式（移动端适配）
   * @default false
   */
  compact?: boolean;

  /**
   * 是否在只有一页时也显示分页组件
   * @default false
   */
  showWhenSinglePage?: boolean;
}

/**
 * 通用分页组件
 *
 * 提供分页导航功能，支持响应式设计和多语言，现代化UI设计
 *
 * @component
 * @example
 * // 基本用法
 * <Pagination
 *   currentPage={1}
 *   totalPages={10}
 *   total={100}
 *   pageSize={10}
 *   onPageChange={(page) => console.log(page)}
 * />
 *
 * // 紧凑模式（适合移动端）
 * <Pagination
 *   currentPage={1}
 *   totalPages={10}
 *   total={100}
 *   pageSize={10}
 *   onPageChange={(page) => console.log(page)}
 *   compact={true}
 *   showStats={false}
 * />
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showPagesCount = 5,
  compact = false,
  showWhenSinglePage = false,
}: PaginationProps) {
  /**
   * 计算显示的页码数组
   *
   * @returns {number[]} 页码数组
   */
  const getPageNumbers = (): number[] => {
    const pages: number[] = [];
    const halfShow = Math.floor(showPagesCount / 2);
    let startPage = Math.max(1, currentPage - halfShow);
    const endPage = Math.min(totalPages, startPage + showPagesCount - 1);

    // 重新调整起始页以确保显示足够的页码
    startPage = Math.max(1, endPage - showPagesCount + 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  /**
   * 处理页码点击事件
   *
   * @param {number} page - 目标页码
   */
  const handlePageClick = (page: number): void => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  // 如果总页数小于等于1，根据showWhenSinglePage决定是否显示分页
  if (totalPages <= 1 && !showWhenSinglePage) {
    return null;
  }

  const pageNumbers = getPageNumbers();

  // 紧凑模式布局 - 简化设计
  if (compact) {
    return (
      <div className="flex items-center justify-center space-x-3 mt-8 p-4">
        {/* 上一页 */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage <= 1}
          className="group flex items-center px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 bg-white dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 rounded-lg hover:bg-primary hover:text-white hover:border-primary shadow-sm hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <LanguageText
            texts={{
              "zh-CN": "上一页",
              "zh-TW": "上一頁",
              en: "Prev",
            }}
          />
        </button>

        {/* 页码显示 */}
        <div className="flex items-center px-4 py-2 bg-neutral-100 dark:bg-zinc-700 border border-neutral-200 dark:border-zinc-600 rounded-lg">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            <LanguageText
              texts={{
                "zh-CN": `第 ${currentPage} 页 / 共 ${totalPages} 页`,
                "zh-TW": `第 ${currentPage} 頁 / 共 ${totalPages} 頁`,
                en: `Page ${currentPage} of ${totalPages}`,
              }}
            />
          </span>
        </div>

        {/* 下一页 */}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="group flex items-center px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 bg-white dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 rounded-lg hover:bg-primary hover:text-white hover:border-primary shadow-sm hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LanguageText
            texts={{
              "zh-CN": "下一页",
              "zh-TW": "下一頁",
              en: "Next",
            }}
          />
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    );
  }

  // 标准模式布局 - 现代化设计
  return (
    <div className="flex flex-col items-center gap-6 mt-12">
      {/* 分页按钮组 - 现代化设计 */}
      <div className="flex items-center space-x-2 bg-white dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 rounded-2xl p-2 shadow-lg">
        {/* 上一页 */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage <= 1}
          className="group flex items-center px-4 py-2.5 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-gradient-to-r hover:from-primary hover:to-primary-hover hover:text-white rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-neutral-600 dark:disabled:hover:text-neutral-300 transform hover:scale-105 disabled:hover:scale-100"
        >
          <svg
            className="w-4 h-4 mr-1.5 transition-transform group-hover:-translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <LanguageText
            texts={{
              "zh-CN": "上一页",
              "zh-TW": "上一頁",
              en: "Prev",
            }}
          />
        </button>

        {/* 第一页 */}
        {pageNumbers[0] > 1 && (
          <>
            <button
              onClick={() => handlePageClick(1)}
              className="px-3 py-2.5 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-gradient-to-r hover:from-primary hover:to-primary-hover hover:text-white rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              1
            </button>
            {pageNumbers[0] > 2 && (
              <span className="px-2 py-2 text-sm text-neutral-400 dark:text-neutral-500">...</span>
            )}
          </>
        )}

        {/* 页码按钮 */}
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            className={`px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 transform hover:scale-105 ${
              page === currentPage
                ? "bg-gradient-to-r from-primary to-primary-hover text-white shadow-lg scale-105"
                : "text-neutral-600 dark:text-neutral-300 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:text-primary"
            }`}
          >
            {page}
          </button>
        ))}

        {/* 最后一页 */}
        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <span className="px-2 py-2 text-sm text-neutral-400 dark:text-neutral-500">...</span>
            )}
            <button
              onClick={() => handlePageClick(totalPages)}
              className="px-3 py-2.5 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-gradient-to-r hover:from-primary hover:to-primary-hover hover:text-white rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* 下一页 */}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="group flex items-center px-4 py-2.5 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-gradient-to-r hover:from-primary hover:to-primary-hover hover:text-white rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-neutral-600 dark:disabled:hover:text-neutral-300 transform hover:scale-105 disabled:hover:scale-100"
        >
          <LanguageText
            texts={{
              "zh-CN": "下一页",
              "zh-TW": "下一頁",
              en: "Next",
            }}
          />
          <svg
            className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* 跳转功能 - 与上下页在同一行 */}
        {totalPages > 1 && (
          <>
            <div className="w-px h-6 bg-neutral-200 dark:bg-zinc-600 mx-2"></div>
            <div className="flex items-center space-x-2 text-sm">
              <LanguageText
                texts={{
                  "zh-CN": "跳转到",
                  "zh-TW": "跳轉到",
                  en: "Go to",
                }}
              />
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder={currentPage.toString()}
                className="w-12 px-2 py-1 text-center text-sm font-medium border border-neutral-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-neutral-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                onKeyPress={(e) => {
                  // 只允许数字输入
                  if (
                    !/[0-9]/.test(e.key) &&
                    e.key !== "Enter" &&
                    e.key !== "Backspace" &&
                    e.key !== "Delete"
                  ) {
                    e.preventDefault();
                    return;
                  }

                  if (e.key === "Enter") {
                    const value = parseInt((e.target as HTMLInputElement).value);
                    if (
                      value >= 1 &&
                      value <= totalPages &&
                      value !== currentPage
                    ) {
                      handlePageClick(value);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }
                }}
                onBlur={(e) => {
                  const value = parseInt(e.target.value);
                  if (
                    value >= 1 &&
                    value <= totalPages &&
                    value !== currentPage
                  ) {
                    handlePageClick(value);
                  }
                  e.target.value = "";
                }}
              />
              <LanguageText
                texts={{
                  "zh-CN": "页",
                  "zh-TW": "頁",
                  en: "page",
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
