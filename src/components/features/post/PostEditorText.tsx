/**
 * @file 图文帖子编辑器组件
 * @description 支持富文本编辑，可插入图片，选择分类和标签等功能，支持获取地理位置
 */

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { LoginDialogUtils } from '@/components/common/Navbar/LoginDialog.utils';
import { createPostApi } from '@/lib/api/postsApi';
import { searchTagsApi, type Tag } from '@/lib/api/tagApi';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 图片上传状态（富文本中的图片）
  const [contentImages, setContentImages] = useState<File[]>([]);
  
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
  const [suggestedTags, setSuggestedTags] = useState<Tag[]>([]);
  const [tagSearchInput, setTagSearchInput] = useState('');
  const [isSearchingTags, setIsSearchingTags] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

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
   * 显示图片调整菜单
   */
  const showImageResizeMenu = (img: HTMLImageElement) => {
    const menu = document.createElement('div');
    menu.className = 'fixed z-50 bg-white dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 rounded-lg shadow-lg p-2';
    menu.style.top = '50%';
    menu.style.left = '50%';
    menu.style.transform = 'translate(-50%, -50%)';
    
    const sizes = [
      { label: '小图 (25%)', width: '25%' },
      { label: '中图 (50%)', width: '50%' },
      { label: '大图 (75%)', width: '75%' },
      { label: '原始大小 (100%)', width: '100%' }
    ];
    
    const aligns = [
      { label: '居左', align: 'left' },
      { label: '居中', align: 'center' },
      { label: '居右', align: 'right' }
    ];
    
    menu.innerHTML = `
      <div class="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">调整图片</div>
      <div class="space-y-2">
        <div>
          <div class="text-xs text-neutral-600 dark:text-neutral-400 mb-1">大小:</div>
          ${sizes.map(size => `
            <button type="button" class="block w-full text-left px-2 py-1 text-xs hover:bg-neutral-100 dark:hover:bg-zinc-700 rounded" data-width="${size.width}">
              ${size.label}
            </button>
          `).join('')}
        </div>
        <div>
          <div class="text-xs text-neutral-600 dark:text-neutral-400 mb-1">对齐:</div>
          ${aligns.map(align => `
            <button type="button" class="block w-full text-left px-2 py-1 text-xs hover:bg-neutral-100 dark:hover:bg-zinc-700 rounded" data-align="${align.align}">
              ${align.label}
            </button>
          `).join('')}
        </div>
        <button type="button" class="w-full px-2 py-1 text-xs bg-red-500 text-white hover:bg-red-600 rounded" data-action="delete">
          删除图片
        </button>
        <button type="button" class="w-full px-2 py-1 text-xs bg-neutral-500 text-white hover:bg-neutral-600 rounded" data-action="close">
          关闭
        </button>
      </div>
    `;
    
    // 添加事件监听
    menu.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const width = target.getAttribute('data-width');
      const align = target.getAttribute('data-align');
      const action = target.getAttribute('data-action');
      
      if (width) {
        img.style.width = width;
        img.style.maxWidth = width;
      }
      
      if (align) {
        img.style.display = 'block';
        if (align === 'center') {
          img.style.margin = '16px auto';
        } else if (align === 'left') {
          img.style.margin = '16px auto 16px 0';
        } else if (align === 'right') {
          img.style.margin = '16px 0 16px auto';
        }
      }
      
      if (action === 'delete') {
        img.remove();
      }
      
      if (width || align || action) {
        document.body.removeChild(menu);
        setContent(contentRef.current?.innerHTML || '');
      }
    });
    
    document.body.appendChild(menu);
    
    // 点击其他地方关闭菜单
    const closeMenu = (e: MouseEvent) => {
      if (!menu.contains(e.target as Node)) {
        document.body.removeChild(menu);
        document.removeEventListener('click', closeMenu);
      }
    };
    
    setTimeout(() => {
      document.addEventListener('click', closeMenu);
    }, 100);
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

    try {
      // 创建临时URL用于预览
      const blobUrl = URL.createObjectURL(file);
      
      // 添加到图片列表（顺序很重要，后端会按这个顺序处理）
      setContentImages(prev => [...prev, file]);
      
      // 将图片插入到富文本编辑器中
      if (contentRef.current) {
        const img = document.createElement('img');
        img.src = blobUrl;
        img.className = 'max-w-full h-auto rounded-lg my-4 block cursor-pointer';
        img.alt = file.name;
        // 添加一个标记以便后端替换时能找到对应的图片
        img.setAttribute('data-image-placeholder', 'true');
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.borderRadius = '8px';
        img.style.margin = '16px auto';
        img.style.display = 'block';
        
        // 添加图片点击事件用于调整大小
        img.addEventListener('click', (e) => {
          e.preventDefault();
          showImageResizeMenu(e.target as HTMLImageElement);
        });
        
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
      
      console.log('✅ 图片插入成功:', file.name);
    } catch (error: any) {
      console.error('❌ 图片插入失败:', error);
      alert(error.message || '图片插入失败，请稍后重试');
    } finally {
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
      console.log('🚀 提交帖子数据:', {
        title: title.trim(),
        content: content.trim(),
        category_id: selectedCategory.categoryId,
        tag_names: selectedTags,
        location,
        attachmentCount: attachmentFiles.length,
        contentImageCount: contentImages.length
      });

      // 使用下划线格式的参数调用API
      await createPostApi({
        title: title.trim(),
        content: content.trim(),
        category_id: selectedCategory.categoryId,
        tag_names: selectedTags.length > 0 ? selectedTags : undefined,
        location: location || undefined,
        files: attachmentFiles.length > 0 ? attachmentFiles : undefined,
        content_images: contentImages.length > 0 ? contentImages : undefined
      });
      
      console.log('✅ 发布图文帖子成功:', {
        title,
        content: content,
        category: selectedCategory,
        tags: selectedTags,
        location,
        attachmentCount: attachmentFiles.length,
        contentImageCount: contentImages.length
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
    <div className="min-h-screen bg-neutral-200 dark:bg-zinc-900 py-6">
      <div className="max-w-4xl mx-auto px-4">
        {/* 现代化头部卡片 */}
        <div className="bg-white dark:bg-dark-secondary rounded-xl shadow-sm border border-neutral-200/50 dark:border-zinc-700/50 p-8 mb-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-800 dark:text-white">
                  创建图文帖子
                </h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  支持富文本编辑，可插入图片和附件
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
              <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center mr-2">
                <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              标题 <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入帖子标题..."
              className="w-full px-5 py-4 border border-neutral-200/50 dark:border-zinc-700/50 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-zinc-800 text-neutral-800 dark:text-white placeholder-neutral-400 shadow-sm hover:shadow-md transition-all duration-200"
            />
          </div>

          {/* 现代化分类和标签选择 - 同行布局 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* 分类选择 */}
            <div>
              <label className="flex items-center text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-3">
                <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center mr-2">
                  <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7l2 2-8 8-4-4-6 6-2-2 8-8 4 4 6-6z" />
                  </svg>
                </div>
                选择分类 <span className="text-red-500 ml-1">*</span>
              </label>
              {loadingCategories ? (
                <div className="flex items-center px-5 py-4 bg-neutral-50 dark:bg-zinc-800 border border-neutral-200/50 dark:border-zinc-700/50 rounded-xl">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-3"></div>
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
                    className="w-full px-5 py-4 border border-neutral-200/50 dark:border-zinc-700/50 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-zinc-800 text-neutral-800 dark:text-white appearance-none cursor-pointer shadow-sm hover:shadow-md transition-all duration-200"
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
                <div className="mt-3 inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-primary/10 to-primary/5 text-primary rounded-full text-sm font-medium border border-primary/20">
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

          {/* 现代化内容编辑器 */}
          <div className="mb-8">
            <label className="flex items-center text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-3">
              <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center mr-2">
                <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              内容 <span className="text-red-500 ml-1">*</span>
            </label>
            
            {/* 编辑器工具栏 */}
            <div className="border border-neutral-200 dark:border-zinc-700 rounded-t-lg bg-neutral-50 dark:bg-zinc-800 px-3 py-2 flex items-center space-x-1 flex-wrap gap-2">
              {/* 标题样式 */}
              <select
                onChange={(e) => {
                  const value = e.target.value;
                  if (value) {
                    document.execCommand('formatBlock', false, value);
                    setContent(contentRef.current?.innerHTML || '');
                    e.target.value = '';
                  }
                }}
                className="px-2 py-1 text-xs border border-neutral-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-700 text-neutral-700 dark:text-neutral-300"
              >
                <option value="">样式</option>
                <option value="h1">大标题 H1</option>
                <option value="h2">中标题 H2</option>
                <option value="h3">小标题 H3</option>
                <option value="p">正文</option>
              </select>

              {/* 格式化按钮 */}
              <button
                type="button"
                onClick={() => {
                  document.execCommand('bold');
                  setContent(contentRef.current?.innerHTML || '');
                }}
                className="flex items-center justify-center w-8 h-8 text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary hover:bg-white dark:hover:bg-zinc-700 rounded transition-colors"
                title="粗体"
              >
                <strong>B</strong>
              </button>

              <button
                type="button"
                onClick={() => {
                  document.execCommand('italic');
                  setContent(contentRef.current?.innerHTML || '');
                }}
                className="flex items-center justify-center w-8 h-8 text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary hover:bg-white dark:hover:bg-zinc-700 rounded transition-colors"
                title="斜体"
              >
                <em>I</em>
              </button>

              <button
                type="button"
                onClick={() => {
                  document.execCommand('underline');
                  setContent(contentRef.current?.innerHTML || '');
                }}
                className="flex items-center justify-center w-8 h-8 text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary hover:bg-white dark:hover:bg-zinc-700 rounded transition-colors"
                title="下划线"
              >
                <span style={{ textDecoration: 'underline' }}>U</span>
              </button>

              {/* 分隔线 */}
              <div className="w-px h-6 bg-neutral-300 dark:bg-zinc-600"></div>

              {/* 列表按钮 */}
              <button
                type="button"
                onClick={() => {
                  document.execCommand('insertUnorderedList');
                  setContent(contentRef.current?.innerHTML || '');
                }}
                className="flex items-center justify-center w-8 h-8 text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary hover:bg-white dark:hover:bg-zinc-700 rounded transition-colors"
                title="无序列表"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => {
                  document.execCommand('insertOrderedList');
                  setContent(contentRef.current?.innerHTML || '');
                }}
                className="flex items-center justify-center w-8 h-8 text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary hover:bg-white dark:hover:bg-zinc-700 rounded transition-colors"
                title="有序列表"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </button>

              {/* 分隔线 */}
              <div className="w-px h-6 bg-neutral-300 dark:bg-zinc-600"></div>

              {/* 插入图片 */}
              <button
                type="button"
                onClick={handleInsertImage}
                disabled={uploadingAttachment}
                className="flex items-center space-x-1 px-3 py-1 text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary hover:bg-white dark:hover:bg-zinc-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="插入图片"
              >
                {uploadingAttachment ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
                <span className="hidden sm:inline">{uploadingAttachment ? '上传中...' : '插入图片'}</span>
              </button>

              {/* 分隔线 */}
              <div className="w-px h-6 bg-neutral-300 dark:bg-zinc-600"></div>

              {/* 清除格式 */}
              <button
                type="button"
                onClick={() => {
                  document.execCommand('removeFormat');
                  setContent(contentRef.current?.innerHTML || '');
                }}
                className="flex items-center justify-center w-8 h-8 text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary hover:bg-white dark:hover:bg-zinc-700 rounded transition-colors"
                title="清除格式"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* 富文本编辑区域 */}
            <div
              ref={contentRef}
              contentEditable
              onInput={handleContentChange}
              className="w-full min-h-[200px] p-4 border border-neutral-200 dark:border-zinc-700 border-t-0 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-zinc-800 text-neutral-800 dark:text-white prose prose-neutral dark:prose-invert max-w-none"
              style={{ 
                whiteSpace: 'pre-wrap',
                '--tw-prose-headings': '#1f2937',
                '--tw-prose-h1': '#1f2937',
                '--tw-prose-h2': '#374151',
                '--tw-prose-h3': '#4b5563'
              } as React.CSSProperties}
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
              disabled={isSubmitting || uploadingAttachment || !title.trim() || !content.trim() || !selectedCategory}
              className="px-8 py-3 bg-gradient-to-r from-primary to-primary-hover text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 font-medium shadow-md"
            >
              {(isSubmitting || uploadingAttachment) && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <span>
                {uploadingAttachment ? '上传附件中...' : isSubmitting ? '发布中...' : '发布帖子'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostEditorText; 