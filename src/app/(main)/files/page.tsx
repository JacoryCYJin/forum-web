/**
 * @file 个人云盘页面
 * @description 文件上传、下载、管理功能，类似百度网盘
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useFileStore, SortType, SortDirection } from '@/store/fileStore';
import { useUserStore } from '@/store/userStore';
import { FileType } from '@/types/user.types';

/**
 * 个人云盘页面组件
 * 
 * @component
 */
export default function FilesPage() {
  const { user } = useUserStore();
  const {
    currentFolderId,
    currentPath,
    files,
    folders,
    isLoading,
    uploadProgress,
    sortType,
    sortDirection,
    error,
    setCurrentFolder,
    fetchFiles,
    uploadFile,
    createFolder,
    renameItem,
    deleteItems,
    downloadFile,
    setSorting,
    setError
  } = useFileStore();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    itemId: string;
    isFolder: boolean;
  } | null>(null);
  const [renameMode, setRenameMode] = useState<{
    id: string;
    name: string;
    isFolder: boolean;
  } | null>(null);

  /**
   * 初始化时获取文件列表
   */
  useEffect(() => {
    if (user) {
      fetchFiles();
    }
  }, [user, fetchFiles]);

  /**
   * 获取文件类型图标
   */
  const getFileIcon = (type: FileType) => {
    switch (type) {
      case FileType.IMAGE:
        return (
          <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case FileType.VIDEO:
        return (
          <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case FileType.DOCUMENT:
        return (
          <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case FileType.ARCHIVE:
        return (
          <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
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
   * 格式化日期
   */
  const formatDate = (date: Date): string => {
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * 处理文件上传
   */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        uploadFile(file, currentFolderId);
      });
    }
    // 清空input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * 处理文件夹创建
   */
  const handleCreateFolder = async () => {
    if (newFolderName.trim()) {
      await createFolder(newFolderName.trim(), currentFolderId);
      setNewFolderName('');
      setIsCreatingFolder(false);
    }
  };

  /**
   * 处理文件夹导航
   */
  const handleFolderNavigation = (folderId: string, folderName: string) => {
    const newPath = [...currentPath, { id: folderId, name: folderName }];
    setCurrentFolder(folderId, newPath);
  };

  /**
   * 返回上级目录
   */
  const handleGoBack = () => {
    if (currentPath.length > 0) {
      const newPath = currentPath.slice(0, -1);
      const parentId = newPath.length > 0 ? newPath[newPath.length - 1].id : null;
      setCurrentFolder(parentId, newPath);
    }
  };

  /**
   * 处理右键菜单
   */
  const handleContextMenu = (e: React.MouseEvent, itemId: string, isFolder: boolean) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      itemId,
      isFolder
    });
  };

  /**
   * 关闭右键菜单
   */
  const closeContextMenu = () => {
    setContextMenu(null);
  };

  /**
   * 处理重命名
   */
  const handleRename = (id: string, name: string, isFolder: boolean) => {
    setRenameMode({ id, name, isFolder });
    closeContextMenu();
  };

  /**
   * 确认重命名
   */
  const confirmRename = async () => {
    if (renameMode && renameMode.name.trim()) {
      await renameItem(renameMode.id, renameMode.name.trim(), renameMode.isFolder);
      setRenameMode(null);
    }
  };

  /**
   * 取消重命名
   */
  const cancelRename = () => {
    setRenameMode(null);
  };

  /**
   * 处理删除
   */
  const handleDelete = async () => {
    if (contextMenu) {
      await deleteItems([contextMenu.itemId]);
      closeContextMenu();
    }
  };

  /**
   * 处理排序
   */
  const handleSort = (type: SortType) => {
    const direction: SortDirection = sortType === type && sortDirection === 'asc' ? 'desc' : 'asc';
    setSorting(type, direction);
  };

  // 如果用户未登录，显示提示
  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-800 dark:text-white mb-4">
            请先登录
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            您需要登录才能访问个人云盘
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-zinc-900 py-8" onClick={closeContextMenu}>
      <div className="max-w-6xl mx-auto px-4">
        {/* 头部操作栏 */}
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-neutral-800 dark:text-white">
                我的文件
              </h1>
              
              {/* 面包屑导航 */}
              <nav className="flex items-center space-x-2 text-sm">
                <button
                  onClick={() => setCurrentFolder(null, [])}
                  className="text-primary hover:text-primary-hover"
                >
                  根目录
                </button>
                {currentPath.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <span className="text-neutral-400">/</span>
                    <button
                      onClick={() => {
                        const newPath = currentPath.slice(0, index + 1);
                        setCurrentFolder(item.id, newPath);
                      }}
                      className="text-primary hover:text-primary-hover"
                    >
                      {item.name}
                    </button>
                  </React.Fragment>
                ))}
              </nav>
            </div>

            <div className="flex items-center space-x-3">
              {/* 返回按钮 */}
              {currentPath.length > 0 && (
                <button
                  onClick={handleGoBack}
                  className="px-3 py-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-zinc-700 rounded-md transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
              )}
              
              {/* 新建文件夹 */}
              <button
                onClick={() => setIsCreatingFolder(true)}
                className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-hover transition-colors"
              >
                新建文件夹
              </button>
              
              {/* 上传文件 */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors"
              >
                上传文件
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* 新建文件夹对话框 */}
        {isCreatingFolder && (
          <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-4 mb-6">
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="输入文件夹名称"
                className="flex-1 px-3 py-2 border border-neutral-200 dark:border-zinc-700 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-zinc-800 text-neutral-800 dark:text-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateFolder();
                  } else if (e.key === 'Escape') {
                    setIsCreatingFolder(false);
                    setNewFolderName('');
                  }
                }}
                autoFocus
              />
              <button
                onClick={handleCreateFolder}
                className="px-3 py-2 bg-primary text-white rounded-md hover:bg-primary-hover"
              >
                创建
              </button>
              <button
                onClick={() => {
                  setIsCreatingFolder(false);
                  setNewFolderName('');
                }}
                className="px-3 py-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-zinc-700 rounded-md"
              >
                取消
              </button>
            </div>
          </div>
        )}

        {/* 上传进度 */}
        {Object.keys(uploadProgress).length > 0 && (
          <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-4 mb-6">
            <h3 className="font-medium mb-3">上传进度</h3>
            <div className="space-y-2">
              {Object.entries(uploadProgress).map(([id, progress]) => (
                <div key={id} className="flex items-center space-x-3">
                  <div className="flex-1">
                    <div className="w-full bg-neutral-200 dark:bg-zinc-700 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    {progress}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 文件列表 */}
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow">
          {/* 列表头部 */}
          <div className="border-b border-neutral-200 dark:border-zinc-700 px-4 py-3">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
              <div 
                className="col-span-5 flex items-center cursor-pointer hover:text-primary"
                onClick={() => handleSort('name')}
              >
                名称
                {sortType === 'name' && (
                  <svg className={`w-4 h-4 ml-1 transform ${sortDirection === 'asc' ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                )}
              </div>
              <div 
                className="col-span-2 flex items-center cursor-pointer hover:text-primary"
                onClick={() => handleSort('size')}
              >
                大小
                {sortType === 'size' && (
                  <svg className={`w-4 h-4 ml-1 transform ${sortDirection === 'asc' ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                )}
              </div>
              <div 
                className="col-span-2 flex items-center cursor-pointer hover:text-primary"
                onClick={() => handleSort('type')}
              >
                类型
                {sortType === 'type' && (
                  <svg className={`w-4 h-4 ml-1 transform ${sortDirection === 'asc' ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                )}
              </div>
              <div 
                className="col-span-3 flex items-center cursor-pointer hover:text-primary"
                onClick={() => handleSort('date')}
              >
                修改时间
                {sortType === 'date' && (
                  <svg className={`w-4 h-4 ml-1 transform ${sortDirection === 'asc' ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                )}
              </div>
            </div>
          </div>

          {/* 列表内容 */}
          <div className="divide-y divide-neutral-200 dark:divide-zinc-700">
            {isLoading ? (
              // 加载状态
              <div className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-neutral-500 dark:text-neutral-400">加载中...</p>
              </div>
            ) : [...folders, ...files].length === 0 ? (
              // 空状态
              <div className="p-12 text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-neutral-400 dark:text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5L12 5H5a2 2 0 00-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-neutral-800 dark:text-white mb-2">
                  文件夹为空
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400">
                  上传一些文件或创建文件夹开始使用云盘
                </p>
              </div>
            ) : (
              // 文件夹和文件列表
              <>
                {/* 文件夹 */}
                {folders.map(folder => (
                  <div
                    key={folder.id}
                    className="px-4 py-3 hover:bg-neutral-50 dark:hover:bg-zinc-700 transition-colors"
                    onContextMenu={(e) => handleContextMenu(e, folder.id, true)}
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-5 flex items-center space-x-3">
                        <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5L12 5H5a2 2 0 00-2 2z" />
                        </svg>
                        {renameMode?.id === folder.id ? (
                          <input
                            type="text"
                            value={renameMode.name}
                            onChange={(e) => setRenameMode({ ...renameMode, name: e.target.value })}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                confirmRename();
                              } else if (e.key === 'Escape') {
                                cancelRename();
                              }
                            }}
                            onBlur={confirmRename}
                            className="flex-1 px-2 py-1 border border-neutral-200 dark:border-zinc-700 rounded text-sm bg-white dark:bg-zinc-800"
                            autoFocus
                          />
                        ) : (
                          <button
                            onClick={() => handleFolderNavigation(folder.id, folder.name)}
                            className="font-medium text-neutral-800 dark:text-white hover:text-primary"
                          >
                            {folder.name}
                          </button>
                        )}
                      </div>
                      <div className="col-span-2 text-sm text-neutral-500 dark:text-neutral-400">
                        —
                      </div>
                      <div className="col-span-2 text-sm text-neutral-500 dark:text-neutral-400">
                        文件夹
                      </div>
                      <div className="col-span-3 text-sm text-neutral-500 dark:text-neutral-400">
                        {formatDate(folder.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}

                {/* 文件 */}
                {files.map(file => (
                  <div
                    key={file.id}
                    className="px-4 py-3 hover:bg-neutral-50 dark:hover:bg-zinc-700 transition-colors"
                    onContextMenu={(e) => handleContextMenu(e, file.id, false)}
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-5 flex items-center space-x-3">
                        {getFileIcon(file.type)}
                        {renameMode?.id === file.id ? (
                          <input
                            type="text"
                            value={renameMode.name}
                            onChange={(e) => setRenameMode({ ...renameMode, name: e.target.value })}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                confirmRename();
                              } else if (e.key === 'Escape') {
                                cancelRename();
                              }
                            }}
                            onBlur={confirmRename}
                            className="flex-1 px-2 py-1 border border-neutral-200 dark:border-zinc-700 rounded text-sm bg-white dark:bg-zinc-800"
                            autoFocus
                          />
                        ) : (
                          <span className="font-medium text-neutral-800 dark:text-white">
                            {file.name}
                          </span>
                        )}
                      </div>
                      <div className="col-span-2 text-sm text-neutral-500 dark:text-neutral-400">
                        {formatFileSize(file.size)}
                      </div>
                      <div className="col-span-2 text-sm text-neutral-500 dark:text-neutral-400">
                        {file.type}
                      </div>
                      <div className="col-span-3 text-sm text-neutral-500 dark:text-neutral-400">
                        {formatDate(file.uploadedAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* 右键菜单 */}
        {contextMenu && (
          <div
            className="fixed bg-white dark:bg-dark-secondary rounded-lg shadow-lg border border-neutral-200 dark:border-zinc-700 py-2 z-50"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            {!contextMenu.isFolder && (
              <button
                onClick={() => {
                  downloadFile(contextMenu.itemId);
                  closeContextMenu();
                }}
                className="w-full px-4 py-2 text-left hover:bg-neutral-50 dark:hover:bg-zinc-700 text-sm"
              >
                下载
              </button>
            )}
            <button
              onClick={() => handleRename(
                contextMenu.itemId,
                contextMenu.isFolder 
                  ? folders.find(f => f.id === contextMenu.itemId)?.name || ''
                  : files.find(f => f.id === contextMenu.itemId)?.name || '',
                contextMenu.isFolder
              )}
              className="w-full px-4 py-2 text-left hover:bg-neutral-50 dark:hover:bg-zinc-700 text-sm"
            >
              重命名
            </button>
            <button
              onClick={handleDelete}
              className="w-full px-4 py-2 text-left hover:bg-neutral-50 dark:hover:bg-zinc-700 text-sm text-red-600"
            >
              删除
            </button>
          </div>
        )}
      </div>
    </div>
  );
}