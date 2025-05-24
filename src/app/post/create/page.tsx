/**
 * @file 发帖页面
 * @description 允许用户创建图文帖子或视频帖子
 */

'use client';

import React, { useState } from 'react';
import { PostType } from '@/types/user.types';
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
      <div className="min-h-screen bg-neutral-50 dark:bg-zinc-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-8">
            <h1 className="text-3xl font-bold text-center mb-8 text-neutral-800 dark:text-white">
              选择发帖类型
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {/* 图文帖子 */}
              <button
                onClick={() => setSelectedType(PostType.TEXT_IMAGE)}
                className="group p-6 border-2 border-neutral-200 dark:border-zinc-700 rounded-lg hover:border-primary hover:shadow-lg transition-all duration-200"
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-neutral-800 dark:text-white">
                    图文帖子
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                    支持富文本编辑，可插入图片，适合分享详细内容
                  </p>
                </div>
              </button>

              {/* 视频帖子 */}
              <button
                onClick={() => setSelectedType(PostType.VIDEO)}
                className="group p-6 border-2 border-neutral-200 dark:border-zinc-700 rounded-lg hover:border-primary hover:shadow-lg transition-all duration-200"
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-secondary/10 rounded-full flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                    <svg className="w-8 h-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-neutral-800 dark:text-white">
                    视频帖子
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                    上传视频文件，配上标题和简介，适合视频内容分享
                  </p>
                </div>
              </button>
            </div>
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