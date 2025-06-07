"use client";

/**
 * @file Markdown渲染组件
 * @module components/common/MarkdownRenderer
 * @description 提供Markdown内容的渲染功能，使用纯TailwindCSS样式，完美集成项目主题
 */

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';

/**
 * Markdown渲染器组件Props
 */
interface MarkdownRendererProps {
  /**
   * 要渲染的Markdown内容
   */
  content: string;
  
  /**
   * 自定义CSS类名
   */
  className?: string;
}

/**
 * 自定义Markdown组件映射
 * 为Markdown元素添加Tailwind CSS样式，与项目主题完美集成
 */
const markdownComponents: Components = {
  // 标题样式
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold text-neutral-800 dark:text-white mb-6 pb-2 border-b border-neutral-200 dark:border-zinc-700">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-bold text-neutral-800 dark:text-white mb-4 mt-8 pb-2 border-b border-neutral-200 dark:border-zinc-700">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-bold text-neutral-800 dark:text-white mb-3 mt-6">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-lg font-semibold text-neutral-800 dark:text-white mb-2 mt-4">
      {children}
    </h4>
  ),
  h5: ({ children }) => (
    <h5 className="text-base font-semibold text-neutral-800 dark:text-white mb-2 mt-3">
      {children}
    </h5>
  ),
  h6: ({ children }) => (
    <h6 className="text-sm font-semibold text-neutral-800 dark:text-white mb-2 mt-3">
      {children}
    </h6>
  ),
  
  // 段落样式
  p: ({ children }) => (
    <p className="text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed">
      {children}
    </p>
  ),
  
  // 列表样式
  ul: ({ children }) => (
    <ul className="list-disc list-inside text-neutral-700 dark:text-neutral-300 mb-4 ml-4 space-y-1">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside text-neutral-700 dark:text-neutral-300 mb-4 ml-4 space-y-1">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed">
      {children}
    </li>
  ),
  
  // 链接样式
  a: ({ href, children }) => (
    <a 
      href={href} 
      className="text-primary hover:text-primary-hover underline decoration-primary decoration-2 underline-offset-2"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  
  // 代码样式 - 使用TailwindCSS，完美集成项目主题
  code: ({ children, className }) => {
    // 检查是否为代码块
    const isCodeBlock = className?.includes('language-');
    
    if (isCodeBlock) {
      // 获取语言类型
      const language = className?.replace('language-', '') || 'text';
      
      return (
        <div className="relative mb-4">
          {/* 语言标签 */}
          <div className="flex items-center justify-between bg-neutral-100 dark:bg-zinc-700 px-4 py-2 rounded-t-md border-b border-neutral-200 dark:border-zinc-600">
            <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300 uppercase">
              {language}
            </span>
          </div>
          {/* 代码内容 */}
          <pre className="bg-neutral-50 dark:bg-zinc-800 p-4 rounded-b-md overflow-x-auto border border-neutral-200 dark:border-zinc-700">
            <code className="text-sm font-mono text-neutral-800 dark:text-neutral-200 whitespace-pre">
              {children}
            </code>
          </pre>
        </div>
      );
    }
    
    // 内联代码
    return (
      <code className="bg-neutral-100 dark:bg-zinc-800 text-neutral-800 dark:text-neutral-200 px-2 py-1 rounded font-mono text-sm border border-neutral-200 dark:border-zinc-700">
        {children}
      </code>
    );
  },
  
  // 预格式化文本容器
  pre: ({ children }) => {
    // 如果已经在code组件中处理了，直接返回children
    return <>{children}</>;
  },
  
  // 引用块样式
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-primary bg-neutral-50 dark:bg-zinc-800 pl-4 pr-4 py-2 ml-4 mb-4 rounded-r-md">
      <div className="text-neutral-600 dark:text-neutral-400 italic">
        {children}
      </div>
    </blockquote>
  ),
  
  // 表格样式
  table: ({ children }) => (
    <div className="overflow-x-auto mb-4 rounded-lg border border-neutral-200 dark:border-zinc-700">
      <table className="min-w-full">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-neutral-100 dark:bg-zinc-800">
      {children}
    </thead>
  ),
  tbody: ({ children }) => (
    <tbody className="bg-white dark:bg-zinc-900 divide-y divide-neutral-200 dark:divide-zinc-700">
      {children}
    </tbody>
  ),
  tr: ({ children }) => (
    <tr className="hover:bg-neutral-50 dark:hover:bg-zinc-800 transition-colors">
      {children}
    </tr>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3 text-left font-semibold text-neutral-800 dark:text-white border-b border-neutral-200 dark:border-zinc-700">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">
      {children}
    </td>
  ),
  
  // 分割线样式
  hr: () => (
    <hr className="border-neutral-200 dark:border-zinc-700 my-8" />
  ),
  
  // 强调样式
  strong: ({ children }) => (
    <strong className="font-bold text-neutral-800 dark:text-white">
      {children}
    </strong>
  ),
  em: ({ children }) => (
    <em className="italic text-neutral-700 dark:text-neutral-300">
      {children}
    </em>
  ),
  
  // 删除线
  del: ({ children }) => (
    <del className="line-through text-neutral-500 dark:text-neutral-400">
      {children}
    </del>
  ),
};

/**
 * Markdown渲染器组件
 * 
 * 渲染Markdown内容为HTML，使用纯TailwindCSS样式，完美集成项目主题
 *
 * @component
 * @example
 * // 基本用法
 * <MarkdownRenderer content="# 标题\n\n这是一段**粗体**文本。" />
 * 
 * // 带自定义样式
 * <MarkdownRenderer 
 *   content={markdownContent} 
 *   className="max-w-none" 
 * />
 */
export default function MarkdownRenderer({ 
  content, 
  className = "" 
}: MarkdownRendererProps) {
  return (
    <div className={`prose dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]} // 支持GitHub风格的Markdown
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
} 