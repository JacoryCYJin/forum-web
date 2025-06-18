/**
 * @file 发帖页面
 * @description 允许用户创建图文帖子或视频帖子
 */

'use client';

import React, { useState } from 'react';
import { PostType } from '@/types/userTypes';
import { PostEditorText } from '@/components/features/post/PostEditorText';
import { PostEditorVideo } from '@/components/features/post/PostEditorVideo';

/**
 * 发帖页面组件
 * 
 * @component
 */
export default function CreatePostPage() {
  const [selectedType, setSelectedType] = useState<PostType | null>(null);

  /**
   * 重置到选择类型页面
   */
  const handleBackToSelection = () => {
    setSelectedType(null);
  };

  // 如果还没有选择类型，显示选择界面
  if (!selectedType) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-zinc-900 py-12">
        <div className="max-w-5xl mx-auto px-4">
          {/* 现代化页面标题区域 */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-neutral-800 dark:text-white mb-4">
              创建新帖子
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              选择适合的帖子类型，开始分享你的想法和内容
            </p>
          </div>
          
          {/* 现代化选择卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* 图文帖子卡片 */}
            <button
              onClick={() => setSelectedType(PostType.TEXT_IMAGE)}
              className="group relative bg-white dark:bg-dark-secondary rounded-2xl shadow-sm border border-neutral-200/50 dark:border-zinc-700/50 p-8 hover:shadow-xl hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300 group-hover:scale-110">
                  <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-neutral-800 dark:text-white group-hover:text-primary transition-colors duration-300">
                  图文帖子
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                  支持富文本编辑，可插入图片和附件，适合分享详细内容和教程
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">富文本</span>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">图片</span>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">附件</span>
                </div>
              </div>
            </button>

            {/* 视频帖子卡片 */}
            <button
              onClick={() => setSelectedType(PostType.VIDEO)}
              className="group relative bg-white dark:bg-dark-secondary rounded-2xl shadow-sm border border-neutral-200/50 dark:border-zinc-700/50 p-8 hover:shadow-xl hover:border-secondary/30 dark:hover:border-secondary/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-2xl flex items-center justify-center group-hover:from-secondary/20 group-hover:to-secondary/10 transition-all duration-300 group-hover:scale-110">
                  <svg className="w-10 h-10 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-neutral-800 dark:text-white group-hover:text-secondary transition-colors duration-300">
                  视频帖子
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                  上传视频文件，配上标题和简介，适合视频内容分享和演示
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-medium rounded-full">视频上传</span>
                  <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-medium rounded-full">封面图</span>
                  <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-medium rounded-full">高清播放</span>
                </div>
              </div>
            </button>
          </div>
          
          {/* 提示信息 */}
          <div className="mt-12 text-center">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              💡 选择后可以随时返回选择其他类型
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 根据选择的类型显示对应的编辑器
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-zinc-900">
      {selectedType === PostType.TEXT_IMAGE && (
        <PostEditorText onCancel={handleBackToSelection} />
      )}
      {selectedType === PostType.VIDEO && (
        <PostEditorVideo onCancel={handleBackToSelection} />
      )}
    </div>
  );
} 