/**
 * @file 文件管理状态Store
 * @description 处理个人云盘的文件上传、下载、文件夹管理等功能
 */

import { create } from 'zustand';
import { FileInfo, FolderInfo, FileType } from '@/types/user.types';

/**
 * 排序类型
 */
export type SortType = 'name' | 'size' | 'date' | 'type';

/**
 * 排序方向
 */
export type SortDirection = 'asc' | 'desc';

/**
 * 路径项接口
 */
export interface PathItem {
  /** 文件夹ID */
  id: string;
  /** 文件夹名称 */
  name: string;
}

/**
 * 文件管理状态接口
 */
interface FileState {
  // 状态
  /** 当前文件夹ID */
  currentFolderId: string | null;
  /** 当前路径 */
  currentPath: PathItem[];
  /** 文件列表 */
  files: FileInfo[];
  /** 文件夹列表 */
  folders: FolderInfo[];
  /** 选中的文件/文件夹IDs */
  selectedItems: string[];
  /** 是否加载中 */
  isLoading: boolean;
  /** 上传进度 */
  uploadProgress: { [fileId: string]: number };
  /** 排序类型 */
  sortType: SortType;
  /** 排序方向 */
  sortDirection: SortDirection;
  /** 错误信息 */
  error: string | null;
  
  // 操作
  /** 设置当前文件夹 */
  setCurrentFolder: (folderId: string | null, path: PathItem[]) => void;
  /** 获取文件列表 */
  fetchFiles: (folderId?: string | null) => Promise<void>;
  /** 上传文件 */
  uploadFile: (file: File, folderId?: string | null) => Promise<void>;
  /** 创建文件夹 */
  createFolder: (name: string, parentId?: string | null) => Promise<void>;
  /** 重命名文件/文件夹 */
  renameItem: (id: string, newName: string, isFolder: boolean) => Promise<void>;
  /** 删除文件/文件夹 */
  deleteItems: (ids: string[]) => Promise<void>;
  /** 下载文件 */
  downloadFile: (fileId: string) => Promise<void>;
  /** 选择项目 */
  selectItems: (ids: string[]) => void;
  /** 清除选择 */
  clearSelection: () => void;
  /** 设置排序 */
  setSorting: (type: SortType, direction: SortDirection) => void;
  /** 设置错误 */
  setError: (error: string | null) => void;
}

/**
 * 获取文件类型
 */
const getFileType = (filename: string): FileType => {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
  const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv'];
  const documentExtensions = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt'];
  const archiveExtensions = ['zip', 'rar', '7z', 'tar', 'gz'];
  
  if (extension && imageExtensions.includes(extension)) {
    return FileType.IMAGE;
  }
  if (extension && videoExtensions.includes(extension)) {
    return FileType.VIDEO;
  }
  if (extension && documentExtensions.includes(extension)) {
    return FileType.DOCUMENT;
  }
  if (extension && archiveExtensions.includes(extension)) {
    return FileType.ARCHIVE;
  }
  
  return FileType.OTHER;
};

/**
 * 模拟API调用 - 获取文件列表
 */
const fetchFilesApi = async (folderId: string | null): Promise<{ files: FileInfo[], folders: FolderInfo[] }> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 模拟数据
  const mockFolders: FolderInfo[] = [
    {
      id: 'folder-1',
      name: '前端项目',
      parentFolderId: folderId,
      createdAt: new Date('2024-01-15'),
      subFolders: [],
      files: []
    },
    {
      id: 'folder-2',
      name: '学习资料',
      parentFolderId: folderId,
      createdAt: new Date('2024-01-10'),
      subFolders: [],
      files: []
    },
    {
      id: 'folder-3',
      name: '图片素材',
      parentFolderId: folderId,
      createdAt: new Date('2024-01-08'),
      subFolders: [],
      files: []
    }
  ];
  
  const mockFiles: FileInfo[] = [
    {
      id: 'file-1',
      name: '项目文档.pdf',
      type: FileType.DOCUMENT,
      size: 2048576, // 2MB
      url: '/mock/project-doc.pdf',
      parentFolderId: folderId,
      uploadedAt: new Date('2024-01-20'),
      mimeType: 'application/pdf'
    },
    {
      id: 'file-2',
      name: '设计稿.png',
      type: FileType.IMAGE,
      size: 1536000, // 1.5MB
      url: '/mock/design.png',
      parentFolderId: folderId,
      uploadedAt: new Date('2024-01-18'),
      mimeType: 'image/png'
    },
    {
      id: 'file-3',
      name: '演示视频.mp4',
      type: FileType.VIDEO,
      size: 52428800, // 50MB
      url: '/mock/demo.mp4',
      parentFolderId: folderId,
      uploadedAt: new Date('2024-01-16'),
      mimeType: 'video/mp4'
    },
    {
      id: 'file-4',
      name: '源代码.zip',
      type: FileType.ARCHIVE,
      size: 10485760, // 10MB
      url: '/mock/source-code.zip',
      parentFolderId: folderId,
      uploadedAt: new Date('2024-01-14'),
      mimeType: 'application/zip'
    }
  ];
  
  return { files: mockFiles, folders: mockFolders };
};

/**
 * 模拟API调用 - 上传文件
 */
const uploadFileApi = async (file: File, folderId: string | null): Promise<FileInfo> => {
  // 模拟上传时间
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    id: `file-${Date.now()}`,
    name: file.name,
    type: getFileType(file.name),
    size: file.size,
    url: URL.createObjectURL(file),
    parentFolderId: folderId,
    uploadedAt: new Date(),
    mimeType: file.type
  };
};

/**
 * 文件管理状态Store
 */
export const useFileStore = create<FileState>((set, get) => ({
  // 初始状态
  currentFolderId: null,
  currentPath: [],
  files: [],
  folders: [],
  selectedItems: [],
  isLoading: false,
  uploadProgress: {},
  sortType: 'name',
  sortDirection: 'asc',
  error: null,
  
  // 设置当前文件夹
  setCurrentFolder: (folderId, path) => {
    set({ currentFolderId: folderId, currentPath: path });
    get().fetchFiles(folderId);
  },
  
  // 获取文件列表
  fetchFiles: async (folderId = null) => {
    set({ isLoading: true, error: null });
    try {
      const { files, folders } = await fetchFilesApi(folderId);
      set({ files, folders, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '获取文件列表失败', 
        isLoading: false 
      });
    }
  },
  
  // 上传文件
  uploadFile: async (file, folderId = null) => {
    const tempId = `temp-${Date.now()}`;
    
    try {
      // 添加上传进度
      set(state => ({
        uploadProgress: { ...state.uploadProgress, [tempId]: 0 }
      }));
      
      // 模拟上传进度
      const progressInterval = setInterval(() => {
        set(state => {
          const currentProgress = state.uploadProgress[tempId] || 0;
          if (currentProgress >= 100) {
            clearInterval(progressInterval);
            return state;
          }
          return {
            uploadProgress: {
              ...state.uploadProgress,
              [tempId]: Math.min(currentProgress + 20, 100)
            }
          };
        });
      }, 400);
      
      const uploadedFile = await uploadFileApi(file, folderId);
      
      // 清除进度并添加文件到列表
      set(state => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [tempId]: _removed, ...restProgress } = state.uploadProgress;
        return {
          files: [...state.files, uploadedFile],
          uploadProgress: restProgress
        };
      });
      
    } catch (error) {
      // 清除进度并设置错误
      set(state => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [tempId]: _removed, ...restProgress } = state.uploadProgress;
        return {
          uploadProgress: restProgress,
          error: error instanceof Error ? error.message : '文件上传失败'
        };
      });
    }
  },
  
  // 创建文件夹
  createFolder: async (name, parentId = null) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newFolder: FolderInfo = {
        id: `folder-${Date.now()}`,
        name,
        parentFolderId: parentId,
        createdAt: new Date(),
        subFolders: [],
        files: []
      };
      
      set(state => ({
        folders: [...state.folders, newFolder]
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '创建文件夹失败' 
      });
    }
  },
  
  // 重命名文件/文件夹
  renameItem: async (id, newName, isFolder) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (isFolder) {
        set(state => ({
          folders: state.folders.map(folder =>
            folder.id === id ? { ...folder, name: newName } : folder
          )
        }));
      } else {
        set(state => ({
          files: state.files.map(file =>
            file.id === id ? { ...file, name: newName } : file
          )
        }));
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '重命名失败' 
      });
    }
  },
  
  // 删除文件/文件夹
  deleteItems: async (ids) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        files: state.files.filter(file => !ids.includes(file.id)),
        folders: state.folders.filter(folder => !ids.includes(folder.id)),
        selectedItems: []
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '删除失败' 
      });
    }
  },
  
  // 下载文件
  downloadFile: async (fileId) => {
    try {
      const file = get().files.find(f => f.id === fileId);
      if (file) {
        // 创建下载链接
        const link = document.createElement('a');
        link.href = file.url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '下载失败' 
      });
    }
  },
  
  // 选择项目
  selectItems: (ids) => {
    set({ selectedItems: ids });
  },
  
  // 清除选择
  clearSelection: () => {
    set({ selectedItems: [] });
  },
  
  // 设置排序
  setSorting: (type, direction) => {
    set({ sortType: type, sortDirection: direction });
  },
  
  // 设置错误
  setError: (error) => {
    set({ error });
  }
}));