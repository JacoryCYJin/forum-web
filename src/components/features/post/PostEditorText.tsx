/**
 * @file 图文帖子编辑器组件
 * @description 支持富文本编辑，可插入图片，选择分类和标签等功能，支持获取地理位置
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginDialogUtils } from '@/components/common/Navbar/LoginDialog.utils';
import { createPostApi } from '@/lib/api/postsApi';
import { uploadImageApi, uploadMultipleAttachmentsApi, type FileUploadResponse } from '@/lib/api/fileApi';
import type { Category } from '@/types/categoryTypes';

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
  const contentRef = useRef<HTMLDivElement>(null);
  
  // 表单状态
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 图片上传状态（富文本中的图片）
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // 附件上传状态（PDF、TXT等文件）
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  
  // 地理位置状态
  const [location, setLocation] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  
  // 文件输入引用
  const imageInputRef = useRef<HTMLInputElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  
  // 分类和标签数据
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [recommendedTags, setRecommendedTags] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  /**
   * 初始化分类和标签数据
   */
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoadingCategories(true);
        
        // 获取分类数据
        const categories = await LoginDialogUtils.getCategoriesApi();
        setAvailableCategories(categories);
        
        // 获取推荐标签
        const tags = LoginDialogUtils.getRecommendedTags();
        setRecommendedTags(tags);
        
      } catch (error) {
        console.error('获取分类和标签数据失败:', error);
        // 使用默认数据
        setAvailableCategories(LoginDialogUtils.getDefaultCategories());
        setRecommendedTags(LoginDialogUtils.getRecommendedTags());
      } finally {
        setLoadingCategories(false);
      }
    };

    initializeData();
  }, []);

  /**
   * 处理标签选择
   */
  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else if (selectedTags.length < 8) { // 限制最多8个标签
      setSelectedTags([...selectedTags, tag]);
    }
  };

  /**
   * 添加自定义标签
   */
  const handleAddCustomTag = () => {
    const trimmedTag = customTag.trim();
    if (trimmedTag && !selectedTags.includes(trimmedTag) && selectedTags.length < 8) {
      setSelectedTags([...selectedTags, trimmedTag]);
      setCustomTag('');
    }
  };

  /**
   * 移除标签
   */
  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  /**
   * 获取用户地理位置
   */
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('浏览器不支持地理位置获取');
      return;
    }

    setIsGettingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationString = `${longitude},${latitude}`;
        setLocation(locationString);
        setIsGettingLocation(false);
        console.log('📍 获取位置成功:', { latitude, longitude, locationString });
      },
      (error) => {
        let errorMessage = '获取位置失败';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '用户拒绝了位置获取请求';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = '位置信息不可用';
            break;
          case error.TIMEOUT:
            errorMessage = '获取位置超时';
            break;
        }
        setLocationError(errorMessage);
        setIsGettingLocation(false);
        console.error('📍 获取位置失败:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5分钟内的缓存位置可用
      }
    );
  };

  /**
   * 清除位置信息
   */
  const handleClearLocation = () => {
    setLocation(null);
    setLocationError(null);
  };

  /**
   * 处理富文本中的图片插入
   */
  const handleInsertImage = () => {
    imageInputRef.current?.click();
  };

  /**
   * 处理图片文件选择并插入到富文本
   */
  const handleImageFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    
    try {
      // 上传图片到OSS获取URL
      const imageUrl = await uploadImageApi(file);
      
      // 将图片插入到富文本编辑器中
      if (contentRef.current) {
        const img = document.createElement('img');
        img.src = imageUrl;
        img.className = 'max-w-full h-auto rounded-lg my-4 block';
        img.alt = file.name;
        
        // 在光标位置插入图片
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(img);
          
          // 插入换行符并移动光标到图片后面
          const br = document.createElement('br');
          range.collapse(false);
          range.insertNode(br);
          range.setStartAfter(br);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        } else {
          // 如果没有选区，就在最后添加
          contentRef.current.appendChild(img);
          contentRef.current.appendChild(document.createElement('br'));
        }
        
        // 更新内容状态
        setContent(contentRef.current.innerHTML);
        
        // 聚焦到编辑器
        contentRef.current.focus();
      }
      
      console.log('✅ 图片插入成功:', imageUrl);
    } catch (error: any) {
      console.error('❌ 图片插入失败:', error);
      alert(error.message || '图片上传失败，请稍后重试');
    } finally {
      setUploadingImage(false);
      // 清空input以便下次选择同一文件
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  /**
   * 处理附件上传
   */
  const handleAttachmentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // 添加到附件列表
    setAttachmentFiles(prev => [...prev, ...files]);
    
    // 清空input以便下次选择
    if (e.target) {
      e.target.value = '';
    }
  };

  /**
   * 移除附件
   */
  const handleRemoveAttachment = (index: number) => {
    setAttachmentFiles(prev => prev.filter((_, i) => i !== index));
  };

  /**
   * 获取文件大小显示
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  /**
   * 插入图片到内容中
   */


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

    if (!selectedCategory) {
      alert('请选择分类');
      return;
    }

    setIsSubmitting(true);
    setUploadingAttachment(true);
    
    try {
      const formData = new FormData();
      
      // 基本信息
      formData.append('title', title.trim());
      formData.append('content', content.trim());
      formData.append('categoryId', selectedCategory.categoryId);
      
      // 标签
      if (selectedTags.length > 0) {
        formData.append('tagIds', selectedTags.join(','));
      }
      
      // 地理位置
      if (location) {
        formData.append('location', location);
      }
      
      // 上传附件并获取URL
      let attachmentUrls: FileUploadResponse[] = [];
      if (attachmentFiles.length > 0) {
        console.log('📎 开始上传附件文件...');
        attachmentUrls = await uploadMultipleAttachmentsApi(attachmentFiles);
        console.log('✅ 附件上传完成:', attachmentUrls);
        
        // 将附件URL作为files字段提交
        attachmentUrls.forEach(attachment => {
          formData.append('files', attachment.url);
        });
      }

      console.log('🚀 提交帖子数据:', {
        title: title.trim(),
        content: content.trim(),
        categoryId: selectedCategory.categoryId,
        tagIds: selectedTags.join(','),
        location,
        attachmentCount: attachmentFiles.length
      });

      await createPostApi(formData);
      
      console.log('✅ 发布图文帖子成功:', {
        title,
        content,
        category: selectedCategory,
        tags: selectedTags,
        location,
        attachmentCount: attachmentFiles.length
      });
      
      // 发布成功后跳转
      router.push('/');
    } catch (error: any) {
      console.error('❌ 发布失败:', error);
      alert(error.message || '发布失败，请重试');
    } finally {
      setIsSubmitting(false);
      setUploadingAttachment(false);
    }
  };

  return (
    <div>
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

          {/* 分类选择 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              选择分类 <span className="text-red-500">*</span>
            </label>
            {loadingCategories ? (
              <div className="text-neutral-500 dark:text-neutral-400">加载分类中...</div>
            ) : (
              <div className="relative">
                <select
                  value={selectedCategory?.categoryId || ''}
                  onChange={(e) => {
                    const categoryId = e.target.value;
                    const category = availableCategories.find(cat => cat.categoryId === categoryId);
                    setSelectedCategory(category || null);
                  }}
                  className="w-full px-4 py-3 border border-neutral-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-zinc-800 text-neutral-800 dark:text-white appearance-none cursor-pointer"
                >
                  <option value="">请选择分类</option>
                  {availableCategories.map(category => (
                    <option key={category.categoryId} value={category.categoryId}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            )}
            {selectedCategory && (
              <div className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                已选择分类: {selectedCategory.categoryName}
              </div>
            )}
          </div>

          {/* 内容编辑器 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              内容 <span className="text-red-500">*</span>
            </label>
            
            {/* 编辑器工具栏 */}
            <div className="border border-neutral-200 dark:border-zinc-700 rounded-t-lg bg-neutral-50 dark:bg-zinc-800 px-3 py-2 flex items-center space-x-2">
              <button
                type="button"
                onClick={handleInsertImage}
                disabled={uploadingImage}
                className="flex items-center space-x-1 px-3 py-1 text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary hover:bg-white dark:hover:bg-zinc-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadingImage ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
                <span>{uploadingImage ? '上传中...' : '插入图片'}</span>
              </button>
            </div>
            
            {/* 富文本编辑区域 */}
            <div
              ref={contentRef}
              contentEditable
              onInput={handleContentChange}
              className="w-full min-h-[200px] p-4 border border-neutral-200 dark:border-zinc-700 border-t-0 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-zinc-800 text-neutral-800 dark:text-white"
              style={{ whiteSpace: 'pre-wrap' }}
              data-placeholder="请输入帖子内容，支持插入图片..."
            />
            
            {/* 隐藏的图片输入框 */}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageFileSelect}
              className="hidden"
            />
          </div>

          {/* 附件上传 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              附件 (可选)
            </label>
            <div className="space-y-4">
              {/* 上传按钮 */}
              <label className="inline-flex items-center px-4 py-2 border-2 border-dashed border-neutral-300 dark:border-zinc-600 rounded-lg cursor-pointer hover:border-primary transition-colors text-sm">
                <svg className="w-5 h-5 mr-2 text-neutral-400 dark:text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                <span className="text-neutral-600 dark:text-neutral-400">选择附件</span>
                <input
                  ref={attachmentInputRef}
                  type="file"
                  accept=".pdf,.txt,.doc,.docx,.xls,.xlsx,.zip,.rar"
                  multiple
                  onChange={handleAttachmentSelect}
                  className="hidden"
                />
              </label>
              
              {/* 附件列表 */}
              {attachmentFiles.length > 0 && (
                <div className="space-y-2">
                  {attachmentFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between px-3 py-2 bg-neutral-50 dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-neutral-400 dark:text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div>
                          <div className="text-sm font-medium text-neutral-800 dark:text-white">{file.name}</div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">{formatFileSize(file.size)}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveAttachment(index)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 位置信息 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              位置信息 (可选)
            </label>
            <div className="flex items-center space-x-4">
              {location ? (
                <div className="flex-1 flex items-center justify-between px-3 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm text-green-700 dark:text-green-300">已获取位置信息</span>
                  </div>
                  <button
                    onClick={handleClearLocation}
                    className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleGetLocation}
                  disabled={isGettingLocation}
                  className="flex items-center space-x-2 px-4 py-2 border border-neutral-300 dark:border-zinc-600 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGettingLocation ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      <span>获取位置中...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>获取当前位置</span>
                    </>
                  )}
                </button>
              )}
            </div>
            {locationError && (
              <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                {locationError}
              </div>
            )}
          </div>
        </div>

        {/* 内容编辑器 */}
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-6 mb-6">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4">
            内容 <span className="text-red-500">*</span>
          </label>
          
          <div
            ref={contentRef}
            contentEditable
            onInput={handleContentChange}
            className="min-h-[300px] p-4 border border-neutral-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-zinc-800 text-neutral-800 dark:text-white outline-none"
            style={{ whiteSpace: 'pre-wrap' }}
            data-placeholder="请输入帖子内容..."
          />
        </div>

        {/* 标签选择 */}
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-6 mb-6">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4">
            选择标签 (最多8个，可自定义)
          </label>
          
          {/* 推荐标签 */}
          <div className="mb-4">
            <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">推荐标签:</div>
            <div className="flex flex-wrap gap-2">
              {recommendedTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  disabled={!selectedTags.includes(tag) && selectedTags.length >= 8}
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
          </div>

          {/* 自定义标签输入 */}
          <div className="mb-4">
            <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">自定义标签:</div>
            <div className="flex gap-2">
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCustomTag()}
                placeholder="输入自定义标签..."
                className="flex-1 px-3 py-2 border border-neutral-200 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-neutral-800 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={selectedTags.length >= 8}
              />
              <button
                onClick={handleAddCustomTag}
                disabled={!customTag.trim() || selectedTags.includes(customTag.trim()) || selectedTags.length >= 8}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
              >
                添加
              </button>
            </div>
          </div>

          {/* 已选择的标签 */}
          {selectedTags.length > 0 && (
            <div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                已选择标签 ({selectedTags.length}/8):
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary text-white"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-white hover:text-red-200"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
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
            disabled={isSubmitting || uploadingAttachment || !title.trim() || !content.trim() || !selectedCategory}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {(isSubmitting || uploadingAttachment) && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            <span>
              {uploadingAttachment ? '上传附件中...' : isSubmitting ? '发布中...' : '发布帖子'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostEditorText; 