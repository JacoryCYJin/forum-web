/**
 * @file 分页组件
 * @module components/common/Pagination
 * @description 通用分页组件，支持多语言、暗色模式和响应式设计
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
   * 总记录数
   */
  total: number;

  /**
   * 每页记录数
   */
  pageSize: number;

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
 * 提供分页导航功能，支持响应式设计和多语言
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

  // 紧凑模式布局
  if (compact) {
    return (
      <div className="flex items-center justify-center space-x-2 mt-6">
        {/* 上一页 */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex items-center px-3 py-2 text-sm font-medium text-neutral-500 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-dark-primary dark:border-zinc-700 dark:text-neutral-300 dark:hover:bg-zinc-800"
        >
          <svg
            className="w-4 h-4 mr-1"
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
        <span className="flex items-center px-4 py-2 text-sm text-neutral-600 dark:text-neutral-300">
          <LanguageText
            texts={{
              "zh-CN": `${currentPage} / ${totalPages}`,
              "zh-TW": `${currentPage} / ${totalPages}`,
              en: `${currentPage} / ${totalPages}`,
            }}
          />
        </span>

        {/* 下一页 */}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex items-center px-3 py-2 text-sm font-medium text-neutral-500 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-dark-primary dark:border-zinc-700 dark:text-neutral-300 dark:hover:bg-zinc-800"
        >
          <LanguageText
            texts={{
              "zh-CN": "下一页",
              "zh-TW": "下一頁",
              en: "Next",
            }}
          />
          <svg
            className="w-4 h-4 ml-1"
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

  // 标准模式布局
  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      {/* 分页按钮组和跳转功能 */}
      <div className="flex items-center space-x-1">
        {/* 上一页 */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-3 py-2 text-sm font-medium text-neutral-500 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-dark-primary dark:border-zinc-700 dark:text-neutral-300 dark:hover:bg-zinc-800"
        >
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
              className="px-3 py-2 text-sm font-medium text-neutral-500 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50 dark:bg-dark-primary dark:border-zinc-700 dark:text-neutral-300 dark:hover:bg-zinc-800"
            >
              1
            </button>
            {pageNumbers[0] > 2 && (
              <span className="px-2 py-2 text-sm text-neutral-400">...</span>
            )}
          </>
        )}

        {/* 页码按钮 */}
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            className={`px-3 py-2 text-sm font-medium border rounded-md transition-colors ${
              page === currentPage
                ? "bg-primary text-white border-primary hover:bg-primary-hover"
                : "text-neutral-500 bg-white border-neutral-300 hover:bg-neutral-50 dark:bg-dark-primary dark:border-zinc-700 dark:text-neutral-300 dark:hover:bg-zinc-800"
            }`}
          >
            {page}
          </button>
        ))}

        {/* 最后一页 */}
        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <span className="px-2 py-2 text-sm text-neutral-400">...</span>
            )}
            <button
              onClick={() => handlePageClick(totalPages)}
              className="px-3 py-2 text-sm font-medium text-neutral-500 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50 dark:bg-dark-primary dark:border-zinc-700 dark:text-neutral-300 dark:hover:bg-zinc-800"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* 下一页 */}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-3 py-2 text-sm font-medium text-neutral-500 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-dark-primary dark:border-zinc-700 dark:text-neutral-300 dark:hover:bg-zinc-800"
        >
          <LanguageText
            texts={{
              "zh-CN": "下一页",
              "zh-TW": "下一頁",
              en: "Next",
            }}
          />
        </button>

        {/* 直接跳转页码输入框 - 放在下一页右边 */}
        {totalPages > 1 && (
          <div className="flex items-center space-x-2 text-sm pl-10">
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
              className="w-12 px-2 py-2 text-center border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-dark-primary dark:border-zinc-700 dark:text-neutral-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
        )}
      </div>
    </div>
  );
}
