/**
 * @file 文件管理页面
 * @description 用户文件管理界面，支持文件上传、文件夹创建等功能
 */

'use client';

import React, { useState, useRef } from 'react';

/**
 * 文件类型接口
 */
interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: string;
  modifiedAt: string;
  icon: string;
}

/**
 * 文件管理页面组件
 * 
 * @component
 */
export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: '1',
      name: '前端项目',
      type: 'folder',
      modifiedAt: '2024/01/15 08:00',
      icon: '📁'
    },
    {
      id: '2',
      name: '学习资料',
      type: 'folder',
      modifiedAt: '2024/01/10 08:00',
      icon: '📁'
    },
    {
      id: '3',
      name: '图片素材',
      type: 'folder',
      modifiedAt: '2024/01/08 08:00',
      icon: '📁'
    },
    {
      id: '4',
      name: '项目文档.pdf',
      type: 'file',
      size: '1.95 MB',
      modifiedAt: '2024/01/20 08:00',
      icon: '📄'
    },
    {
      id: '5',
      name: '设计稿.png',
      type: 'file',
      size: '1.46 MB',
      modifiedAt: '2024/01/18 08:00',
      icon: '🖼️'
    },
    {
      id: '6',
      name: '演示视频.mp4',
      type: 'file',
      size: '50 MB',
      modifiedAt: '2024/01/16 08:00',
      icon: '🎥'
    },
    {
      id: '7',
      name: '源代码.zip',
      type: 'file',
      size: '10 MB',
      modifiedAt: '2024/01/14 08:00',
      icon: '🗜️'
    }
  ]);

  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * 处理创建文件夹
   */
  const handleCreateFolder = () => {
    setIsCreatingFolder(true);
  };

  /**
   * 确认创建文件夹
   */
  const confirmCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: FileItem = {
        id: Date.now().toString(),
        name: newFolderName,
        type: 'folder',
        modifiedAt: new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(/\//g, '/'),
        icon: '📁'
      };
      setFiles([newFolder, ...files]);
      setNewFolderName('');
      setIsCreatingFolder(false);
    }
  };

  /**
   * 取消创建文件夹
   */
  const cancelCreateFolder = () => {
    setIsCreatingFolder(false);
    setNewFolderName('');
  };

  /**
   * 处理文件上传
   */
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (uploadedFiles) {
      Array.from(uploadedFiles).forEach(file => {
        const newFile: FileItem = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          type: 'file',
          size: formatFileSize(file.size),
          modifiedAt: new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }).replace(/\//g, '/'),
          icon: getFileIcon(file.name)
        };
        setFiles(prev => [newFile, ...prev]);
      });
    }
    // 清空文件输入
    if (event.target) {
      event.target.value = '';
    }
  };

  /**
   * 格式化文件大小
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  /**
   * 获取文件图标
   */
  const getFileIcon = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return '📄';
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return '🖼️';
      case 'mp4':
      case 'avi':
      case 'mov':
        return '🎥';
      case 'zip':
      case 'rar':
        return '🗜️';
      case 'doc':
      case 'docx':
        return '📝';
      case 'xls':
      case 'xlsx':
        return '📊';
      default:
        return '📄';
    }
  };

  /**
   * 获取文件类型标签
   */
  const getFileTypeLabel = (file: FileItem): string => {
    if (file.type === 'folder') return '文件夹';
    
    const ext = file.name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return 'document';
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif': return 'image';
      case 'mp4':
      case 'avi':
      case 'mov': return 'video';
      case 'zip':
      case 'rar': return 'archive';
      case 'doc':
      case 'docx': return 'document';
      case 'xls':
      case 'xlsx': return 'spreadsheet';
      default: return 'file';
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* 页面标题和操作按钮 */}
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-neutral-800 dark:text-white">
                我的文件
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                管理和组织您的所有文件
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCreateFolder}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
              >
                新建文件夹
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
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

        {/* 文件列表 */}
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow">
          <div className="overflow-x-auto">
            {/* 表头 */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-neutral-200 dark:border-zinc-700 text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              <div className="col-span-6">名称</div>
              <div className="col-span-2">大小</div>
              <div className="col-span-2">类型</div>
              <div className="col-span-2">修改时间</div>
            </div>

            {/* 新建文件夹输入框 */}
            {isCreatingFolder && (
              <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-neutral-200 dark:border-zinc-700 bg-yellow-50 dark:bg-yellow-900/20">
                <div className="col-span-6 flex items-center space-x-3">
                  <span className="text-2xl">📁</span>
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        confirmCreateFolder();
                      } else if (e.key === 'Escape') {
                        cancelCreateFolder();
                      }
                    }}
                    placeholder="输入文件夹名称"
                    className="flex-1 px-3 py-2 border border-neutral-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-neutral-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    autoFocus
                  />
                  <button
                    onClick={confirmCreateFolder}
                    className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                  >
                    确认
                  </button>
                  <button
                    onClick={cancelCreateFolder}
                    className="px-3 py-2 bg-neutral-400 text-white rounded-md hover:bg-neutral-500 transition-colors"
                  >
                    取消
                  </button>
                </div>
                <div className="col-span-2">—</div>
                <div className="col-span-2">文件夹</div>
                <div className="col-span-2">—</div>
              </div>
            )}

            {/* 文件列表 */}
            <div className="divide-y divide-neutral-200 dark:divide-zinc-700">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-neutral-50 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                  <div className="col-span-6 flex items-center space-x-3">
                    <span className="text-2xl">{file.icon}</span>
                    <span className="text-neutral-800 dark:text-white font-medium">
                      {file.name}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center text-neutral-600 dark:text-neutral-400">
                    {file.size || '—'}
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className="px-2 py-1 bg-neutral-100 dark:bg-zinc-700 rounded-full text-xs text-neutral-600 dark:text-neutral-300">
                      {getFileTypeLabel(file)}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center text-neutral-600 dark:text-neutral-400">
                    {file.modifiedAt}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}