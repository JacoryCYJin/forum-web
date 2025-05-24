/**
 * @file 图文帖子编辑器组件
 * @description 支持富文本编辑，可插入图片，选择标签等功能
 */

'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

/**
 * 图文帖子编辑器Props
 */
interface PostEditorTextProps {
  /** 取消回调 */
  onCancel: () => void;
}

/**
 * 图文帖子编辑器组件
 * 
 * @component
 * @param props - 组件属性
 */
export function PostEditorText({ onCancel }: PostEditorTextProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // 表单状态
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 可选标签
  const availableTags = [
    '生活', '技术', '摄影', '旅游', '美食', '运动', 
    '音乐', '电影', '读书', '学习', '工作', '娱乐'
  ];

  /**
   * 处理标签选择
   */
  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  /**
   * 处理封面图片上传
   */
  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * 插入图片到内容中
   */
  const handleInsertImage = () => {
    fileInputRef.current?.click();
  };

  /**
   * 处理内容图片插入
   */
  const handleContentImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && contentRef.current) {
      const reader = new FileReader();
      reader.onload = () => {
        if (!contentRef.current) return;
        
        const img = document.createElement('img');
        img.src = reader.result as string;
        img.className = 'max-w-full h-auto rounded-lg my-4';
        img.alt = '插入的图片';
        
        // 在光标位置插入图片
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(img);
          range.collapse(false);
        } else {
          contentRef.current.appendChild(img);
        }
        
        // 更新内容状态
        setContent(contentRef.current.innerHTML);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * 处理内容变化
   */
  const handleContentChange = () => {
    if (contentRef.current) {
      setContent(contentRef.current.innerHTML);
    }
  };

  /**
   * 处理发布
   */
  const handleSubmit = async () => {
    if (!title.trim()) {
      alert('请输入标题');
      return;
    }
    
    if (!content.trim()) {
      alert('请输入内容');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('发布图文帖子:', {
        title,
        content,
        tags: selectedTags,
        coverImage
      });
      
      // 发布成功后跳转
      router.push('/');
    } catch (error) {
      console.error('发布失败:', error);
      alert('发布失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 头部 */}
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-neutral-800 dark:text-white">
              创建图文帖子
            </h1>
            <button
              onClick={onCancel}
              className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 标题输入 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入帖子标题..."
              className="w-full px-4 py-3 border border-neutral-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-zinc-800 text-neutral-800 dark:text-white placeholder-neutral-400"
            />
          </div>

          {/* 封面图片 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              封面图片 (可选)
            </label>
            <div className="flex items-center space-x-4">
              {coverImage ? (
                <div className="relative">
                  <img
                    src={coverImage}
                    alt="封面预览"
                    className="w-32 h-20 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setCoverImage(null)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <label className="w-32 h-20 border-2 border-dashed border-neutral-300 dark:border-zinc-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                  <svg className="w-6 h-6 text-neutral-400 dark:text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">上传封面</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* 内容编辑器 */}
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              内容 <span className="text-red-500">*</span>
            </label>
            <button
              onClick={handleInsertImage}
              className="flex items-center space-x-2 px-3 py-1 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>插入图片</span>
            </button>
          </div>
          
          <div
            ref={contentRef}
            contentEditable
            onInput={handleContentChange}
            className="min-h-[300px] p-4 border border-neutral-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-zinc-800 text-neutral-800 dark:text-white outline-none"
            style={{ whiteSpace: 'pre-wrap' }}
            data-placeholder="请输入帖子内容，支持插入图片..."
          />
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleContentImageUpload}
            className="hidden"
          />
        </div>

        {/* 标签选择 */}
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-6 mb-6">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4">
            选择标签 (最多选择5个)
          </label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                disabled={!selectedTags.includes(tag) && selectedTags.length >= 5}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-primary text-white'
                    : 'bg-neutral-100 dark:bg-zinc-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-zinc-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {tag}
              </button>
            ))}
          </div>
          {selectedTags.length > 0 && (
            <div className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
              已选择: {selectedTags.join(', ')}
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-neutral-300 dark:border-zinc-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-zinc-700 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !title.trim() || !content.trim()}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isSubmitting && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            <span>{isSubmitting ? '发布中...' : '发布帖子'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostEditorText; 