/**
 * @file 视频帖子编辑器组件
 * @description 支持视频上传，填写标题和简介，选择分类和标签
 */

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { LoginDialogUtils } from '@/components/common/Navbar/LoginDialog.utils';
import { createPostApi } from '@/lib/api/postsApi';
import { searchTagsApi, type Tag } from '@/lib/api/tagApi';
import type { Category } from '@/types/categoryTypes';

/**
 * 视频帖子编辑器Props
 */
interface PostEditorVideoProps {
  /** 取消回调 */
  onCancel: () => void;
}

/**
 * 视频帖子编辑器组件
 * 
 * @component
 * @param props - 组件属性
 */
export function PostEditorVideo({ onCancel }: PostEditorVideoProps) {
  const router = useRouter();
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  // 表单状态
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 分类和标签数据
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [suggestedTags, setSuggestedTags] = useState<Tag[]>([]);
  const [tagSearchInput, setTagSearchInput] = useState('');
  const [isSearchingTags, setIsSearchingTags] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // 支持的视频格式
  const supportedVideoFormats = ['mp4', 'mov', 'avi', 'mkv', 'webm'];
  const maxVideoSize = 500 * 1024 * 1024; // 500MB

  /**
   * 防抖函数
   */
  const debounce = useCallback((func: (...args: any[]) => void, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }, []);

  /**
   * 搜索标签
   */
  const searchTags = useCallback(async (keyword: string) => {
    if (!keyword.trim()) {
      setSuggestedTags([]);
      return;
    }

    setIsSearchingTags(true);
    try {
      const tags = await searchTagsApi(keyword.trim(), 10);
      setSuggestedTags(tags);
    } catch (error) {
      console.error('搜索标签失败:', error);
      setSuggestedTags([]);
    } finally {
      setIsSearchingTags(false);
    }
  }, []);

  /**
   * 防抖搜索标签
   */
  const debouncedSearchTags = useCallback(
    debounce(searchTags, 300),
    [searchTags, debounce]
  );

  /**
   * 初始化分类数据
   */
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoadingCategories(true);
        
        // 获取分类数据
        const categories = await LoginDialogUtils.getCategoriesApi();
        setAvailableCategories(categories);
        
      } catch (error) {
        console.error('获取分类数据失败:', error);
        // 使用默认数据
        setAvailableCategories(LoginDialogUtils.getDefaultCategories());
      } finally {
        setLoadingCategories(false);
      }
    };

    initializeData();
  }, []);

  /**
   * 处理标签搜索输入
   */
  const handleTagSearchInputChange = (value: string) => {
    setTagSearchInput(value);
    debouncedSearchTags(value);
  };

  /**
   * 处理标签选择
   */
  const handleTagSelect = (tagName: string) => {
    if (!selectedTags.includes(tagName) && selectedTags.length < 8) {
      setSelectedTags([...selectedTags, tagName]);
    }
    setTagSearchInput('');
    setSuggestedTags([]);
  };

  /**
   * 移除标签
   */
  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };



  /**
   * 验证视频文件
   */
  const validateVideoFile = (file: File): string | null => {
    // 检查文件大小
    if (file.size > maxVideoSize) {
      return '视频文件大小不能超过 500MB';
    }

    // 检查文件格式
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !supportedVideoFormats.includes(fileExtension)) {
      return `不支持的视频格式，支持格式: ${supportedVideoFormats.join(', ')}`;
    }

    return null;
  };

  /**
   * 处理视频文件上传
   */
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件
    const validationError = validateVideoFile(file);
    if (validationError) {
      alert(validationError);
      return;
    }

    setVideoFile(file);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // 创建预览URL
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);

      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setIsUploading(false);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

    } catch (error) {
      console.error('视频上传失败:', error);
      alert('视频上传失败，请重试');
      setIsUploading(false);
    }
  };

  /**
   * 移除视频
   */
  const handleRemoveVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
    setUploadProgress(0);
    setIsUploading(false);
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  /**
   * 格式化文件大小
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  /**
   * 处理发布
   */
  const handleSubmit = async () => {
    if (!title.trim()) {
      alert('请输入标题');
      return;
    }
    
    if (!description.trim()) {
      alert('请输入简介');
      return;
    }

    if (!selectedCategory) {
      alert('请选择分类');
      return;
    }

    if (!videoFile) {
      alert('请上传视频文件');
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('🚀 提交视频帖子数据:', {
        title: title.trim(),
        content: description.trim(),
        category_id: selectedCategory.categoryId,
        tag_names: selectedTags,
        videoFile: {
          name: videoFile.name,
          size: videoFile.size,
          type: videoFile.type
        }
      });

      // 使用 createPostApi 创建视频帖子
      await createPostApi({
        title: title.trim(),
        content: description.trim(),
        category_id: selectedCategory.categoryId,
        tag_names: selectedTags.length > 0 ? selectedTags : undefined,
        files: [videoFile] // 视频文件作为附件
      });
      
      console.log('✅ 发布视频帖子成功');
      
      // 发布成功后跳转
      router.push('/');
    } catch (error: any) {
      console.error('❌ 发布失败:', error);
      alert(error.message || '发布失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-zinc-900 py-6">
      <div className="max-w-4xl mx-auto px-4">
        {/* 现代化头部卡片 */}
        <div className="bg-white dark:bg-dark-secondary rounded-xl shadow-sm border border-neutral-200/50 dark:border-zinc-700/50 p-8 mb-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-secondary/10 to-secondary/5 flex items-center justify-center">
                <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-800 dark:text-white">
                  创建视频帖子
                </h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  支持多种视频格式，最大500MB
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-3 rounded-xl text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-zinc-700 transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 现代化标题输入 */}
          <div className="mb-8">
            <label className="flex items-center text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-3">
              <div className="w-5 h-5 rounded-md bg-secondary/10 flex items-center justify-center mr-2">
                <svg className="w-3 h-3 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              标题 <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入视频标题..."
              className="w-full px-5 py-4 border border-neutral-200/50 dark:border-zinc-700/50 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary bg-white dark:bg-zinc-800 text-neutral-800 dark:text-white placeholder-neutral-400 shadow-sm hover:shadow-md transition-all duration-200"
            />
          </div>

          {/* 现代化简介输入 */}
          <div className="mb-8">
            <label className="flex items-center text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-3">
              <div className="w-5 h-5 rounded-md bg-secondary/10 flex items-center justify-center mr-2">
                <svg className="w-3 h-3 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              简介 <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="请输入视频简介..."
              rows={4}
              className="w-full px-5 py-4 border border-neutral-200/50 dark:border-zinc-700/50 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary bg-white dark:bg-zinc-800 text-neutral-800 dark:text-white placeholder-neutral-400 resize-none shadow-sm hover:shadow-md transition-all duration-200"
            />
          </div>

          {/* 现代化分类和标签选择 - 同行布局 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* 分类选择 */}
            <div>
              <label className="flex items-center text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-3">
                <div className="w-5 h-5 rounded-md bg-secondary/10 flex items-center justify-center mr-2">
                  <svg className="w-3 h-3 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7l2 2-8 8-4-4-6 6-2-2 8-8 4 4 6-6z" />
                  </svg>
                </div>
                选择分类 <span className="text-red-500 ml-1">*</span>
              </label>
              {loadingCategories ? (
                <div className="flex items-center px-5 py-4 bg-neutral-50 dark:bg-zinc-800 border border-neutral-200/50 dark:border-zinc-700/50 rounded-xl">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-secondary mr-3"></div>
                  <span className="text-neutral-500 dark:text-neutral-400">加载分类中...</span>
                </div>
              ) : (
                <div className="relative">
                  <select
                    value={selectedCategory?.categoryId || ''}
                    onChange={(e) => {
                      const categoryId = e.target.value;
                      const category = availableCategories.find(cat => cat.categoryId === categoryId);
                      setSelectedCategory(category || null);
                    }}
                    className="w-full px-5 py-4 border border-neutral-200/50 dark:border-zinc-700/50 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary bg-white dark:bg-zinc-800 text-neutral-800 dark:text-white appearance-none cursor-pointer shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <option value="">请选择分类</option>
                    {availableCategories.map(category => (
                      <option key={category.categoryId} value={category.categoryId}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              )}
              {selectedCategory && (
                <div className="mt-3 inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-secondary/10 to-secondary/5 text-secondary rounded-full text-sm font-medium border border-secondary/20">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  已选择: {selectedCategory.categoryName}
                </div>
              )}
            </div>

            {/* 标签选择 */}
            <div>
              <label className="flex items-center text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-3">
                <div className="w-5 h-5 rounded-md bg-secondary/10 flex items-center justify-center mr-2">
                  <svg className="w-3 h-3 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                选择标签 <span className="text-neutral-400 text-xs ml-1">(最多8个)</span>
              </label>
              
              {/* 标签输入框 */}
              <div className="relative mb-3">
                <input
                  type="text"
                  value={tagSearchInput}
                  onChange={(e) => handleTagSearchInputChange(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const tagName = tagSearchInput.trim();
                      if (tagName && !selectedTags.includes(tagName) && selectedTags.length < 8) {
                        setSelectedTags([...selectedTags, tagName]);
                        setTagSearchInput('');
                        setSuggestedTags([]);
                      }
                    }
                  }}
                  placeholder="输入标签名称..."
                  className="w-full px-5 py-4 border border-neutral-200/50 dark:border-zinc-700/50 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary bg-white dark:bg-zinc-800 text-neutral-800 dark:text-white placeholder-neutral-400 shadow-sm hover:shadow-md transition-all duration-200"
                  disabled={selectedTags.length >= 8}
                />
                {isSearchingTags && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-secondary"></div>
                  </div>
                )}
              </div>

              {/* 搜索结果下拉框 */}
              {suggestedTags.length > 0 && tagSearchInput.trim() && (
                <div className="mb-3 border border-neutral-200 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 max-h-32 overflow-y-auto shadow-lg">
                  {suggestedTags.map(tag => (
                    <button
                      key={tag.tagId}
                      onClick={() => handleTagSelect(tag.tagName)}
                      disabled={selectedTags.includes(tag.tagName)}
                      className="w-full text-left px-3 py-2 hover:bg-neutral-50 dark:hover:bg-zinc-700 text-neutral-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed border-b border-neutral-100 dark:border-zinc-700 last:border-b-0 text-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span>{tag.tagName}</span>
                        {selectedTags.includes(tag.tagName) && (
                          <span className="text-xs text-green-600 dark:text-green-400">已选择</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {/* 如果输入的标签不在搜索结果中，显示创建提示 */}
              {tagSearchInput.trim() && suggestedTags.length === 0 && !isSearchingTags && (
                <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700 dark:text-blue-300">
                      创建: &ldquo;{tagSearchInput.trim()}&rdquo;
                    </span>
                    <button
                      onClick={() => {
                        const tagName = tagSearchInput.trim();
                        if (tagName && !selectedTags.includes(tagName) && selectedTags.length < 8) {
                          setSelectedTags([...selectedTags, tagName]);
                          setTagSearchInput('');
                          setSuggestedTags([]);
                        }
                      }}
                      disabled={!tagSearchInput.trim() || selectedTags.includes(tagSearchInput.trim()) || selectedTags.length >= 8}
                      className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      添加
                    </button>
                  </div>
                </div>
              )}

              {/* 已选择的标签 */}
              {selectedTags.length > 0 && (
                <div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">
                    已选择 ({selectedTags.length}/8):
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs bg-secondary text-white"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1.5 text-white hover:text-red-200"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>



          {/* 现代化视频上传区域 */}
          <div className="mb-8">
            <label className="flex items-center text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-3">
              <div className="w-5 h-5 rounded-md bg-secondary/10 flex items-center justify-center mr-2">
                <svg className="w-3 h-3 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              视频文件 <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
              支持 {supportedVideoFormats.join(', ')} 格式，最大 500MB
            </div>
            
            {!videoFile ? (
              <label className="block w-full p-8 border-2 border-dashed border-neutral-300 dark:border-zinc-600 rounded-xl cursor-pointer hover:border-secondary hover:bg-secondary/5 transition-all duration-200">
                <div className="text-center">
                  <svg className="w-12 h-12 mx-auto mb-4 text-neutral-400 dark:text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    点击上传视频文件
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    支持格式: {supportedVideoFormats.join(', ')} | 最大文件大小: 500MB
                  </p>
                </div>
                <input
                  ref={videoInputRef}
                  type="file"
                  accept={supportedVideoFormats.map(format => `.${format}`).join(',')}
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="space-y-4">
                {/* 视频预览 */}
                {videoPreview && (
                  <div className="relative bg-black rounded-xl overflow-hidden shadow-sm">
                    <video
                      src={videoPreview}
                      controls
                      className="w-full max-h-80 object-contain"
                      preload="metadata"
                    >
                      您的浏览器不支持视频播放
                    </video>
                  </div>
                )}
                
                {/* 视频信息 */}
                <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-zinc-700 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <svg className="w-8 h-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="font-medium text-neutral-800 dark:text-white">{videoFile.name}</p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {formatFileSize(videoFile.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveVideo}
                    className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                
                {/* 上传进度 */}
                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600 dark:text-neutral-400">上传中...</span>
                      <span className="text-secondary">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-zinc-700 rounded-full h-2">
                      <div 
                        className="bg-secondary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 现代化操作按钮 */}
          <div className="pt-6 border-t border-neutral-100 dark:border-zinc-700 flex justify-end space-x-4">
            <button
              onClick={onCancel}
              className="px-8 py-3 border border-neutral-200 dark:border-zinc-600 text-neutral-700 dark:text-neutral-300 rounded-xl hover:bg-neutral-50 dark:hover:bg-zinc-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              取消
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !title.trim() || !description.trim() || !selectedCategory || !videoFile || isUploading}
              className="px-8 py-3 bg-gradient-to-r from-secondary to-secondary-hover text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 font-medium shadow-md"
            >
              {isSubmitting && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>{isSubmitting ? '发布中...' : '发布视频'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostEditorVideo;